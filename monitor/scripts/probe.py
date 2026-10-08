#!/usr/bin/env python3
"""P3 edge-probe: HTTP checks of every interface from a chosen country through a proxy, without JavaScript.

What it records per interface and country:
  * the landing page: HTTP status, redirect chain, edge provider headers, a body excerpt and hash,
    a coarse ui_state (ok | blocked | challenge | error | unknown);
  * each known geo endpoint (`geo_endpoints` in interfaces.json): status, JSON flags such as
    blocked / isRegionRestricted / limited, a body excerpt;
  * the vantage: the country seen by two independent geo APIs through the same proxy, the ASN, and
    `loc=` from /cdn-cgi/trace on Cloudflare-fronted hosts. A proxied vantage needs two services agreeing;
    one that disagrees (or answers alone) is kept but marked verified=false and never reaches the site.

"ok" means only "no edge-level block observed": client-side gates, wallet screening and feature gates
are out of scope for P3 (see docs/roadmap.md, P4/P5).

Usage:
  python3 -I monitor/scripts/probe.py run  monitor/data/interfaces.json monitor/probe/out --countries UA,US,DE
  python3 -I monitor/scripts/probe.py run  ... --only polymarket,hop --proxy-type direct    # no proxy, your own egress
  python3 -I monitor/scripts/probe.py merge monitor/data/observations.json monitor/probe/out/<run>.json

Environment:
  PROBE_PROXY_URL        proxy URL template with {cc} (lower-case ISO2) and optional {CC} (upper-case) placeholders,
                         e.g. http://user-country-{cc}:pass@gate.example.com:7000
  PROBE_PROXY_URL_<TOKEN> override for one token, e.g. PROBE_PROXY_URL_US_NY, PROBE_PROXY_URL_CA_ON
                         (token = country/region token with '-' replaced by '_')
  PROBE_PROXY_TYPE       residential | isp | mobile | datacenter | tor | direct   (default: residential, or direct with --proxy-type direct)
  PROBE_TIMEOUT          seconds per request (default 25)
  PROBE_DELAY            seconds between requests (default 1.0)

Stdlib only; Python >= 3.9. Observation only: no logins, no CAPTCHA solving, no wallet, no transactions.
"""
import argparse, hashlib, html, json, os, re, ssl, sys, time, urllib.error, urllib.parse, urllib.request
from collections import OrderedDict
from datetime import datetime, timezone

VERSION = "probe.py/0.1"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
GEO_APIS = [  # independent IP -> country services, queried through the proxy; two must agree for a proxied run
    ("api.country.is", "https://api.country.is/", lambda j: (j.get("country"), None, None)),
    ("ipinfo.io", "https://ipinfo.io/json", lambda j: (j.get("country"), (j.get("org") or "").split(" ")[0] or None, j.get("org"))),
    ("ifconfig.co", "https://ifconfig.co/json", lambda j: (j.get("country_iso"), j.get("asn"), j.get("asn_org"))),
]
GEO_TEXT_RE = re.compile(r"(geo|region|country|jurisdiction|legal reasons|not available in|restricted|sanction)", re.I)
BLOCK_PATH_RE = re.compile(r"(blocked|restricted|not-?available|unavailable|geo-?block|not-?allowed|forbidden)", re.I)
BLOCK_TEXT_RE = re.compile(r"(not available in your (country|region|jurisdiction)|blocked in your|restricted in your|"
                           r"unavailable in your|access (is )?blocked|unavailable for legal reasons|service unavailable in)", re.I)
CHALLENGE_RE = re.compile(r"(just a moment|cf-chl|challenge-platform|attention required|verify you are human|enable javascript and cookies)", re.I)
FLAG_KEYS = ("blocked", "isBlocked", "geoblocked", "isRegionRestricted", "restricted", "isRestricted", "limited", "allowed", "ipAllowed")
TAG_RE = re.compile(r"<(script|style)[^>]*>.*?</\1>|<[^>]+>", re.S)


def now_iso():
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


# ----------------------------------------------------------------------------- http
class RecordingRedirectHandler(urllib.request.HTTPRedirectHandler):
    """Follow redirects like urllib does, but remember every hop."""

    def __init__(self):
        self.chain = []

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        self.chain.append({"status": code, "location": newurl})
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def make_opener(proxy_url):
    handlers = []
    redirect = RecordingRedirectHandler()
    if proxy_url:
        handlers.append(urllib.request.ProxyHandler({"http": proxy_url, "https": proxy_url}))
    else:
        handlers.append(urllib.request.ProxyHandler({}))  # ignore system proxies
    handlers.append(redirect)
    opener = urllib.request.build_opener(*handlers)
    opener.addheaders = [("User-Agent", UA), ("Accept", "text/html,application/json;q=0.9,*/*;q=0.8"),
                         ("Accept-Language", "en-US,en;q=0.8")]
    return opener, redirect


def fetch(proxy_url, url, timeout, max_bytes=400_000, _insecure=False):
    """GET url through the proxy. Returns an OrderedDict with status, headers, body (bytes) and redirects.
    If the local root store cannot verify the chain (common with the macOS system Python), the request is retried once
    without verification and the observation carries tls_unverified=True. Only public pages are read, nothing is sent."""
    opener, redirect = make_opener(proxy_url)
    if _insecure:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        opener.add_handler(urllib.request.HTTPSHandler(context=ctx))
    out = OrderedDict(url=url, status=None, final_url=url, headers={}, body=b"", redirects=[], error=None, ms=None,
                      tls_unverified=_insecure)
    t0 = time.time()
    try:
        with opener.open(url, timeout=timeout) as r:
            out["status"] = r.status
            out["final_url"] = r.geturl()
            out["headers"] = {k.lower(): v for k, v in r.headers.items()}
            out["body"] = r.read(max_bytes)
    except urllib.error.HTTPError as e:
        out["status"] = e.code
        out["final_url"] = e.geturl() if hasattr(e, "geturl") else url
        out["headers"] = {k.lower(): v for k, v in (e.headers.items() if e.headers else [])}
        try:
            out["body"] = e.read(max_bytes)
        except Exception:  # noqa: BLE001
            out["body"] = b""
    except Exception as e:  # noqa: BLE001 - any transport/parse failure is an observation of kind "error"
        if not _insecure and "CERTIFICATE_VERIFY_FAILED" in str(e):
            return fetch(proxy_url, url, timeout, max_bytes, _insecure=True)
        out["error"] = f"{type(e).__name__}: {str(e)[:160]}"
    out["ms"] = int((time.time() - t0) * 1000)
    out["redirects"] = redirect.chain
    return out


def body_text(body, limit=300):
    try:
        s = body.decode("utf-8", "replace")
    except Exception:  # noqa: BLE001
        return ""
    s = html.unescape(TAG_RE.sub(" ", s))
    s = re.sub(r"\s+", " ", s).strip()
    return s[:limit]


def body_json(body):
    try:
        return json.loads(body.decode("utf-8", "replace"))
    except Exception:  # noqa: BLE001
        return None


def classify_site(r):
    """Coarse state of a landing page fetched without JavaScript."""
    if r["error"]:
        return "error", r["error"]
    st, hdr = r["status"], r["headers"]
    text = body_text(r["body"], 600)
    if st == 451:
        return "blocked", "HTTP 451"
    if st == 403:
        if hdr.get("cf-mitigated") == "challenge" or CHALLENGE_RE.search(text):
            return "challenge", "Cloudflare challenge"
        if GEO_TEXT_RE.search(text):
            return "blocked", "HTTP 403 with geo wording"
        return "unknown", "HTTP 403 without geo wording (WAF/anti-bot?)"
    for hop in r["redirects"]:
        if BLOCK_PATH_RE.search(urllib.parse.urlsplit(hop["location"]).path):
            return "blocked", f"redirect -> {hop['location']}"
    if BLOCK_PATH_RE.search(urllib.parse.urlsplit(r["final_url"]).path):
        return "blocked", f"final url {r['final_url']}"
    if st and 200 <= st < 300:
        if BLOCK_TEXT_RE.search(text) and len(text) < 2000:
            return "blocked", "block text in body"
        if CHALLENGE_RE.search(text):
            return "challenge", "challenge page with HTTP 200"
        return "ok", "page served (client-side gates not evaluated)"
    if st and st >= 500:
        return "error", f"HTTP {st}"
    return "unknown", f"HTTP {st}"


def classify_endpoint(r):
    """State derived from a geo endpoint: JSON flags first, then status codes."""
    if r["error"]:
        return "error", {}, r["error"]
    st = r["status"]
    j = body_json(r["body"])
    flags = OrderedDict()
    if isinstance(j, dict):
        for k in FLAG_KEYS:
            if k in j and isinstance(j[k], bool):
                flags[k] = j[k]
        for k in ("country", "countryCode", "country_code", "region", "status", "tier"):
            if k in j and isinstance(j[k], (str, int)):
                flags[k] = j[k]
    if st == 451:
        return "blocked", flags, "HTTP 451"
    if st == 403:
        text = body_text(r["body"], 600)
        if GEO_TEXT_RE.search(text) or any(flags.get(k) is True for k in ("blocked", "geoblocked", "restricted")):
            return "blocked", flags, "HTTP 403 with geo wording"
        return "unknown", flags, "HTTP 403 without geo wording (WAF/anti-bot?)"
    if any(flags.get(k) is True for k in ("blocked", "isBlocked", "geoblocked", "isRegionRestricted", "restricted", "isRestricted")):
        return "blocked", flags, "flag true"
    if any(flags.get(k) is False for k in ("allowed", "ipAllowed")):
        return "blocked", flags, "allowed=false"
    if flags.get("limited") is True:
        return "feature_limited", flags, "limited=true"
    if st and 200 <= st < 300:
        return "ok", flags, "no restriction flag"
    if st and st >= 500:
        return "error", flags, f"HTTP {st}"
    return "unknown", flags, f"HTTP {st}"


# ----------------------------------------------------------------------------- vantage
def proxy_for(token, proxy_type):
    """Resolve the proxy URL for a country/region token from the environment."""
    if proxy_type == "direct":
        return None
    override = os.environ.get("PROBE_PROXY_URL_" + token.replace("-", "_").upper())
    if override:
        return override
    tpl = os.environ.get("PROBE_PROXY_URL")
    if not tpl:
        sys.exit("PROBE_PROXY_URL is not set (or use --proxy-type direct)")
    cc = token.split("-")[0]
    return tpl.replace("{cc}", cc.lower()).replace("{CC}", cc.upper())


def check_vantage(proxy_url, token, timeout, min_agree=2):
    """Ask independent geo APIs through the proxy which country they see; compare with the requested one.
    verified = at least `min_agree` services answered and every answer equals the requested country."""
    expected = token.split("-")[0].upper()
    seen, asn, org, by = [], None, None, []
    for name, url, pick in GEO_APIS:
        r = fetch(proxy_url, url, timeout)
        j = body_json(r["body"]) if not r["error"] and r["status"] == 200 else None
        if isinstance(j, dict):
            c, a, o = pick(j)
            if c:
                seen.append(str(c).upper())
                by.append(name)
            asn = asn or a
            org = org or o
    verified = len(seen) >= min_agree and all(c == expected for c in seen)
    return OrderedDict(requested=token, ip_country=(seen[0] if seen else None), seen=seen, asn=asn, org=org,
                       verified_by=by, verified=verified)


def cf_trace(proxy_url, final_url, timeout):
    """loc= from /cdn-cgi/trace when the host is behind Cloudflare; None otherwise."""
    parts = urllib.parse.urlsplit(final_url)
    r = fetch(proxy_url, f"{parts.scheme}://{parts.netloc}/cdn-cgi/trace", timeout, max_bytes=4000)
    if r["error"] or r["status"] != 200:
        return None
    m = re.search(r"^loc=([A-Z]{2})$", r["body"].decode("utf-8", "replace"), re.M)
    return m.group(1) if m else None


# ----------------------------------------------------------------------------- run
def observation(entry, token, proxy_type, vantage, kind, r, state, note, flags=None, cf_loc=None):
    hdr = r["headers"]
    return OrderedDict([
        ("interface_id", entry["id"]), ("kind", kind), ("url", r["url"]), ("country", token.split("-")[0]),
        ("region", token if "-" in token else None), ("proxy_type", proxy_type),
        ("vantage", OrderedDict([("ip_country", vantage["ip_country"]), ("asn", vantage["asn"]), ("org", vantage["org"]),
                                 ("verified_by", vantage["verified_by"]), ("cf_loc", cf_loc), ("verified", vantage["verified"])])),
        ("at", now_iso()), ("http_status", r["status"]), ("final_url", r["final_url"]), ("redirects", r["redirects"]),
        ("server", hdr.get("server")), ("cf_ray", hdr.get("cf-ray")), ("ms", r["ms"]),
        ("ui_state", state), ("flags", flags or {}), ("body_sha256", hashlib.sha256(r["body"]).hexdigest() if r["body"] else None),
        ("excerpt", body_text(r["body"])), ("note", note + ("; TLS chain not verified locally" if r.get("tls_unverified") else "")),
    ])


def cmd_run(args):
    with open(args.data, encoding="utf-8") as fh:
        data = json.load(fh, object_pairs_hook=OrderedDict)
    only = set(args.only.split(",")) if args.only else None
    entries = [e for e in data["interfaces"] if not only or e["id"] in only]
    tokens = [t.strip() for t in args.countries.split(",") if t.strip()]
    proxy_type = args.proxy_type or os.environ.get("PROBE_PROXY_TYPE", "residential")
    timeout = float(os.environ.get("PROBE_TIMEOUT", "25"))
    delay = float(os.environ.get("PROBE_DELAY", "1.0"))
    started = now_iso()
    run_id = started.replace(":", "").replace("-", "") + "_" + proxy_type
    obs, vantages = [], OrderedDict()

    for token in tokens:
        proxy_url = proxy_for(token, proxy_type)
        v = check_vantage(proxy_url, token, timeout, min_agree=1 if proxy_type == "direct" else 2)
        vantages[token] = v
        print(f"[{token}] vantage: ip_country={v['ip_country']} asn={v['asn']} verified={v['verified']} by={v['verified_by']}", flush=True)
        if not v["verified"]:
            print(f"[{token}] vantage NOT verified -> targets skipped for this token", flush=True)
            continue
        for e in entries:
            r = fetch(proxy_url, e["url"], timeout)
            cf_loc = cf_trace(proxy_url, r["final_url"], timeout) if (r["headers"].get("server") == "cloudflare" or r["headers"].get("cf-ray")) else None
            state, note = classify_site(r)
            if cf_loc and cf_loc != token.split("-")[0].upper():
                note += f"; cdn-cgi/trace loc={cf_loc} disagrees with {token}"
            obs.append(observation(e, token, proxy_type, v, "site", r, state, note, cf_loc=cf_loc))
            print(f"[{token}] {e['id']:14s} site  {r['status']!s:>4} {state:16s} {note[:70]}", flush=True)
            time.sleep(delay)
            for url in e.get("geo_endpoints", []):
                r2 = fetch(proxy_url, url, timeout)
                st2, flags, note2 = classify_endpoint(r2)
                obs.append(observation(e, token, proxy_type, v, "geo_endpoint", r2, st2, note2, flags=flags))
                print(f"[{token}] {e['id']:14s} geo   {r2['status']!s:>4} {st2:16s} {json.dumps(flags)[:70]}", flush=True)
                time.sleep(delay)

    os.makedirs(args.outdir, exist_ok=True)
    out_path = os.path.join(args.outdir, run_id + ".json")
    result = OrderedDict([("run", OrderedDict([("id", run_id), ("started_at", started), ("finished_at", now_iso()), ("tool", VERSION),
                                               ("proxy_type", proxy_type), ("countries", tokens), ("vantages", vantages)])),
                          ("observations", obs)])
    with open(out_path, "w", encoding="utf-8") as fh:
        json.dump(result, fh, ensure_ascii=False, indent=2)
        fh.write("\n")
    print(f"\n{len(obs)} observations -> {out_path}")
    print("merge with: python3 -I monitor/scripts/probe.py merge monitor/data/observations.json", out_path)


def obs_key(o):
    return (o["interface_id"], o["kind"], o["url"], o["country"], o.get("region"), o["proxy_type"], o["at"])


def cmd_merge(args):
    if os.path.exists(args.store):
        with open(args.store, encoding="utf-8") as fh:
            store = json.load(fh, object_pairs_hook=OrderedDict)
    else:
        store = OrderedDict([("schema_version", 1), ("runs", []), ("observations", [])])
    known = {obs_key(o) for o in store["observations"]}
    run_ids = {r["id"] for r in store["runs"]}
    added = 0
    for path in args.runs:
        with open(path, encoding="utf-8") as fh:
            run = json.load(fh, object_pairs_hook=OrderedDict)
        if run["run"]["id"] not in run_ids:
            meta = OrderedDict((k, v) for k, v in run["run"].items() if k != "vantages")
            store["runs"].append(meta)
            run_ids.add(meta["id"])
        for o in run["observations"]:
            if obs_key(o) in known:
                continue
            o = OrderedDict(o)
            o.pop("redirects", None)  # keep the store compact; the run file has the full chain
            known.add(obs_key(o))
            store["observations"].append(o)
            added += 1
    store["observations"].sort(key=lambda o: (o["interface_id"], o["country"], o["kind"], o["url"], o["at"]))
    with open(args.store, "w", encoding="utf-8") as fh:
        json.dump(store, fh, ensure_ascii=False, indent=2)
        fh.write("\n")
    print(f"added {added} observations; store now has {len(store['observations'])} across {len(store['runs'])} runs")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("run", help="probe interfaces from the given countries")
    r.add_argument("data", help="monitor/data/interfaces.json")
    r.add_argument("outdir", help="directory for the run file")
    r.add_argument("--countries", required=True, help="comma-separated tokens: UA,US,DE,US-NY")
    r.add_argument("--only", help="comma-separated interface ids")
    r.add_argument("--proxy-type", choices=["residential", "isp", "mobile", "datacenter", "tor", "direct"])
    r.set_defaults(func=cmd_run)
    m = sub.add_parser("merge", help="append run files to the observations store")
    m.add_argument("store", help="monitor/data/observations.json")
    m.add_argument("runs", nargs="+", help="run files from `probe.py run`")
    m.set_defaults(func=cmd_merge)
    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
