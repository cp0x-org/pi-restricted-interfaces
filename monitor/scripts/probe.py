#!/usr/bin/env python3
"""P3 edge-probe: HTTP checks of every interface from a chosen country through a proxy, without JavaScript.

What it records per interface and country:
  * the landing page: HTTP status, redirect chain, edge provider headers, a body excerpt and hash,
    a coarse ui_state (ok | blocked | challenge | error | unknown);
  * each known geo endpoint (`geo_endpoints` in interfaces.json): status, JSON flags such as
    blocked / isRegionRestricted / limited, a verdict header (dYdX `geo-origin-status`), a body excerpt;
  * each API probe (`api_probes` in interfaces.json): the protocol's own geo check or a read-only API call (GET or POST
    with a JSON body), classified by the probe's `rules` (regexes over the status line, headers and body: the first
    match gives the state) and, when none matches, like a geo endpoint; `flags` names the JSON paths and headers to keep;
    `{ip}` in the URL becomes the proxy's exit IP (an API that takes the address to check as a parameter: Spark
    /ip/status?ip=); the observation keeps the template URL, the IP itself is not recorded; `headers` are sent as
    given (an Origin the API insists on, as Jumper's geo-gates does);
  * the vantage: the country of the proxy's exit IP by IP -> country lookups (GEO_APIS) through the same proxy, the ASN,
    and `loc=` from /cdn-cgi/trace on Cloudflare-fronted hosts. A country is probed when the proxy answers and at least
    half of the lookups see that country; a proxy without an exit there (no_proxy) or with an exit elsewhere (wrong_country)
    is skipped: neither says anything about the sites.

"ok" means only "no edge-level block observed": client-side gates, wallet screening and feature gates
are out of scope for P3 (see docs/roadmap.md, P4/P5).

Usage:
  python3 -I monitor/scripts/probe.py run  monitor/data/interfaces.json monitor/probe/out              # default countries
  python3 -I monitor/scripts/probe.py run  ... --countries UA,US,DE
  python3 -I monitor/scripts/probe.py run  ... --countries sanctioned,US    # groups of monitor/data/countries.json
  python3 -I monitor/scripts/probe.py run  ... --only polymarket,hop --proxy-type direct    # no proxy, your own egress
  python3 -I monitor/scripts/probe.py merge monitor/data/observations.json monitor/probe/out/<run>.json

Countries: without --countries (or $PROBE_COUNTRIES) the `default` set of monitor/data/countries.json is probed:
`popular` + `regions` + `sanctioned`. Group names expand inside --countries. A region of a group (US-NY, CA-ON) is
probed only when its PROBE_PROXY_URL_<TOKEN> is set; a region named explicitly falls back to the country template.

Environment:
  PROBE_PROXY_URL        proxy URL template with {cc} (lower-case ISO2) and optional {CC} (upper-case) placeholders,
                         e.g. http://user-country-{cc}:pass@gate.example.com:7000; {session} becomes a new random id per
                         country, so a provider's sticky session keeps one exit IP for the vantage check and every target
                         (Decodo: user-LOGIN-country-{cc}-session-{session}-sessionduration-30)
  PROBE_PROXY_URL_<TOKEN> override for one token, e.g. PROBE_PROXY_URL_US_NY, PROBE_PROXY_URL_CA_ON
                         (token = country/region token with '-' replaced by '_')
  PROBE_PROXY_TYPE       residential | isp | mobile | datacenter | tor | direct   (default: residential, or direct with --proxy-type direct)
  PROBE_COUNTRIES        countries when --countries is not given (default: `default` of monitor/data/countries.json)
  PROBE_TIMEOUT          seconds per request (default 25)
  PROBE_DELAY            seconds between requests of one country (default 1.0)
  PROBE_WORKERS          countries probed in parallel (default 6)
  PROBE_RATE             requests per second over all countries, the cap the proxy gateway sees (default 5)

Countries run in parallel, each with its own sequence of requests and PROBE_DELAY pauses; all of them share one
PROBE_RATE budget. When the proxy says "too many requests" (CONNECT 429/503) a request backs off 15 s, then 30 s; when it
refuses authorization (407: credentials, used-up traffic) the run stops and writes what it has. Ctrl+C does the same.

Stdlib only; Python >= 3.9. Observation only: no logins, no CAPTCHA solving, no wallet, no transactions.
"""
import argparse, hashlib, html, json, os, re, secrets, shutil, ssl, subprocess, sys, tempfile, threading, time, urllib.error, urllib.parse, urllib.request
from collections import OrderedDict
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone

VERSION = "probe.py/0.1"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
COUNTRIES = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "countries.json")
GEO_APIS = [  # IP -> country lookups, queried through the proxy; at least half must see the requested country
    ("api.country.is", "https://api.country.is/", lambda j: (j.get("country"), None, None)),
    ("ipinfo.io", "https://ipinfo.io/json", lambda j: (j.get("country"), (j.get("org") or "").split(" ")[0] or None, j.get("org"))),
    ("ifconfig.co", "https://ifconfig.co/json", lambda j: (j.get("country_iso"), j.get("asn"), j.get("asn_org"))),
]
GEO_TEXT_RE = re.compile(r"(geo|region|country|jurisdiction|legal reasons|not available in|restricted|sanction)", re.I)
BLOCK_PATH_RE = re.compile(r"(blocked|restricted|not-?available|unavailable|geo-?block|not-?allowed|forbidden)", re.I)
BLOCK_TEXT_RE = re.compile(r"(not available in your (country|region|jurisdiction)|blocked in your|restricted in your|"
                           r"unavailable in your|access (is )?blocked|unavailable for legal reasons|service unavailable in)", re.I)
CHALLENGE_RE = re.compile(r"(just a moment|cf-chl|challenge-platform|attention required|verify you are human|enable javascript and cookies)", re.I)
# Cloudflare's WAF block page (a firewall rule matched: a country, an ASN, a bot score); not a challenge, and no geo wording
WAF_BLOCK_RE = re.compile(r"(sorry, you have been blocked|you are unable to access)", re.I)
FLAG_KEYS = ("blocked", "isBlocked", "geoblocked", "isRegionRestricted", "restricted", "isRestricted", "limited", "allowed", "ipAllowed")
TAG_RE = re.compile(r"<(script|style)[^>]*>.*?</\1>|<[^>]+>", re.S)
PROXY_BUSY_RE = re.compile(r"Tunnel connection failed: (429|503)\b")  # the gateway asks to slow down
PROXY_AUTH_RE = re.compile(r"Tunnel connection failed: 407\b")        # wrong credentials or used-up traffic
STOP = threading.Event()  # set on 407 or Ctrl+C: no new requests, the run file is written with what was collected
PRINT = threading.Lock()


def say(line):
    with PRINT:
        print(line, flush=True)


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


class Pacer:
    """At most `rate` requests per second over all workers: the proxy gateway sees one client however many countries run."""

    def __init__(self):
        self.gap, self.next, self.lock = 0.0, 0.0, threading.Lock()

    def set_rate(self, rate):
        self.gap = 1.0 / rate if rate > 0 else 0.0

    def wait(self):
        with self.lock:
            now = time.monotonic()
            at = max(now, self.next)
            self.next = at + self.gap
        if at > now:
            time.sleep(at - now)


PACER = Pacer()


TLS_RE = re.compile(r"PROTOCOL_VERSION|UNSUPPORTED_PROTOCOL|WRONG_VERSION_NUMBER|SSLV3_ALERT_HANDSHAKE_FAILURE")


def curl_fetch(proxy_url, url, timeout, max_bytes, method, data, headers, out):
    """The same single request with the curl binary (present on every Mac and Linux): the macOS system Python is linked
    against LibreSSL without TLS 1.3, and some sites (jumper.xyz) accept nothing else. Same as research/lib/net.py."""
    with tempfile.TemporaryDirectory() as tmp:
        hfile, bfile = os.path.join(tmp, "h"), os.path.join(tmp, "b")
        cmd = ["curl", "-sS", "-L", "--max-redirs", "10", "--max-time", str(int(timeout)), "-X", method, "-D", hfile, "-o", bfile,
               "-w", "%{http_code} %{url_effective}", "--max-filesize", str(max_bytes)]
        for k, v in headers.items():
            cmd += ["-H", f"{k}: {v}"]
        if proxy_url:
            cmd += ["-x", proxy_url]
        if data:
            cmd += ["--data-binary", "@-"]
        p = subprocess.run(cmd + [url], input=data, capture_output=True, timeout=timeout + 10)
        if p.returncode != 0 and not os.path.exists(bfile):
            out["error"] = f"curl: {p.stderr.decode('utf-8', 'replace').strip()[:160]}"
            return out
        code, _, final = p.stdout.decode().partition(" ")
        out["status"], out["final_url"] = int(code or 0) or None, final or url
        blocks = [b for b in open(hfile, encoding="latin-1").read().split("\r\n\r\n") if b.strip()] if os.path.exists(hfile) else []
        for b in blocks[:-1]:
            st, loc = re.match(r"HTTP/\S+ (\d+)", b), re.search(r"^location:\s*(\S+)", b, re.I | re.M)
            if st and loc:
                out["redirects"].append({"status": int(st.group(1)), "location": loc.group(1)})
        if blocks:
            out["headers"] = {k.lower(): v.strip() for k, v in re.findall(r"^([\w-]+):\s*(.*)$", blocks[-1], re.M)}
        with open(bfile, "rb") as fh:
            out["body"] = fh.read(max_bytes)
    return out


def fetch(proxy_url, url, timeout, max_bytes=400_000, method="GET", body=None, headers=None, _insecure=False, _busy=0):
    """GET (or POST with a JSON body) url through the proxy. Returns an OrderedDict with status, headers, body (bytes)
    and redirects.
    If the local root store cannot verify the chain (common with the macOS system Python), the request is retried once
    without verification and the observation carries tls_unverified=True. Only public pages are read, nothing is sent.
    Every attempt waits for its turn in PACER; a throttled proxy (429/503) is retried twice after 15 s and 30 s."""
    PACER.wait()
    opener, redirect = make_opener(proxy_url)
    if _insecure:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        opener.add_handler(urllib.request.HTTPSHandler(context=ctx))
    out = OrderedDict(url=url, status=None, final_url=url, headers={}, body=b"", redirects=[], error=None, ms=None,
                      tls_unverified=_insecure)
    data = None if body is None else json.dumps(body).encode()
    req = urllib.request.Request(url, data=data, method=method, headers=dict(headers or {}, **({"Content-Type": "application/json"} if data else {})))
    t0 = time.time()
    try:
        with opener.open(req, timeout=timeout) as r:
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
            return fetch(proxy_url, url, timeout, max_bytes, method, body, headers, True, _busy)
        if TLS_RE.search(str(e)) and shutil.which("curl"):
            all_headers = dict(opener.addheaders, **req.headers)
            out = curl_fetch(proxy_url, url, timeout, max_bytes, method, data, all_headers, out)
            out["ms"] = int((time.time() - t0) * 1000)
            return out
        if proxy_url and PROXY_BUSY_RE.search(str(e)) and _busy < 2 and not STOP.is_set():
            time.sleep(15 * (_busy + 1))
            return fetch(proxy_url, url, timeout, max_bytes, method, body, headers, _insecure, _busy + 1)
        if proxy_url and PROXY_AUTH_RE.search(str(e)) and not STOP.is_set():
            STOP.set()
            say(f"! the proxy refused authorization ({str(e)[:80]}): stopping, the run file keeps what was collected")
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
        if WAF_BLOCK_RE.search(text):
            return "unknown", "Cloudflare block page without geo wording (a firewall rule: country, network or bot score)"
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
    hdr = r["headers"]
    if hdr.get("geo-origin-status"):  # dYdX indexer: the verdict rides on every response, whatever the body
        flags["geo-origin-status"] = hdr["geo-origin-status"]
        if hdr["geo-origin-status"] == "restricted":
            return "blocked", flags, "geo-origin-status: restricted"
    if st == 451:
        return "blocked", flags, "HTTP 451"
    if st == 403:
        text = body_text(r["body"], 600)
        if WAF_BLOCK_RE.search(text):
            return "unknown", flags, "Cloudflare block page without geo wording (a firewall rule: country, network or bot score)"
        if hdr.get("cf-mitigated") == "challenge" or CHALLENGE_RE.search(text):
            return "challenge", flags, "Cloudflare challenge (not testable without a browser)"
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


def transcript(r):
    """What API probe rules are matched against: the status line, the response headers, then the body."""
    head = "".join(f"{k}: {v}\n" for k, v in r["headers"].items())
    return f"HTTP {r['status']}\n{head}\n" + r["body"].decode("utf-8", "replace")


def pick_flags(paths, r):
    """Values named by an API probe: dotted JSON paths (data.isBlocked) and response headers (header:geo-origin-status)."""
    j, out = body_json(r["body"]), OrderedDict()
    for path in paths:
        if path.startswith("header:"):
            v = r["headers"].get(path[7:].lower())
        else:
            v = j
            for part in path.split("."):
                v = v.get(part) if isinstance(v, dict) else None
        if isinstance(v, (str, int, float, bool)):
            out[path] = v
    return out


def classify_api(probe, r):
    """State of an API probe: its rules in order (the first match wins), else the generic geo-endpoint reading."""
    flags = pick_flags(probe.get("flags", []), r)
    if r["error"]:
        return "error", flags, r["error"]
    text = transcript(r)
    for rule in probe.get("rules", []):
        if re.search(rule["match"], text, re.M):
            return rule["state"], flags, rule.get("note") or f"rule {rule['match']}"
    state, generic, note = classify_endpoint(r)
    return state, flags or generic, note


# ----------------------------------------------------------------------------- vantage
def proxy_for(token, proxy_type, session=""):
    """Resolve the proxy URL for a country/region token from the environment; {session} is filled with `session`."""
    if proxy_type == "direct":
        return None
    tpl = os.environ.get("PROBE_PROXY_URL_" + token.replace("-", "_").upper()) or os.environ.get("PROBE_PROXY_URL")
    if not tpl:
        sys.exit("PROBE_PROXY_URL is not set (or use --proxy-type direct)")
    cc = token.split("-")[0]
    return tpl.replace("{cc}", cc.lower()).replace("{CC}", cc.upper()).replace("{session}", session)


def expand_countries(spec):
    """Country tokens from a comma-separated spec; group names of monitor/data/countries.json (popular, regions,
    sanctioned, default = all three) expand in place. A region of a group needs its own PROBE_PROXY_URL_<TOKEN>:
    with the country template it would silently probe the whole country."""
    with open(COUNTRIES, encoding="utf-8") as fh:
        groups = json.load(fh)
    groups["default"] = groups["popular"] + groups["regions"] + groups["sanctioned"]
    tokens = []
    for t in filter(None, (t.strip() for t in spec.split(","))):
        group = groups.get(t.lower())
        if isinstance(group, list):
            group = [g for g in group if "-" not in g or os.environ.get("PROBE_PROXY_URL_" + g.replace("-", "_").upper())]
        for c in group if isinstance(group, list) else [t.upper()]:
            if c not in tokens:
                tokens.append(c)
    return tokens


def check_vantage(proxy_url, token, timeout):
    """Ask the geo APIs through the proxy which country its exit IP is in.
    status: ok (the proxy answers and at least half of the answers are the requested country), no_proxy (the proxy did not
    answer, retried once: the provider has no exit there, which says nothing about the sites), wrong_country (the exit is
    elsewhere)."""
    expected = token.split("-")[0].upper()
    seen, asn, org, by, err, ip = [], None, None, [], None, None
    for i, (name, url, pick) in enumerate(GEO_APIS + GEO_APIS[:1]):
        if STOP.is_set():
            break
        if i == len(GEO_APIS):  # one retry when nothing answered: thin pools (CU) fail now and then
            if seen:
                break
            time.sleep(3)
        r = fetch(proxy_url, url, timeout)
        err = err or r["error"]
        j = body_json(r["body"]) if not r["error"] and r["status"] == 200 else None
        if isinstance(j, dict):
            c, a, o = pick(j)
            if c:
                seen.append(str(c).upper())
                by.append(name)
            asn = asn or a
            org = org or o
            ip = ip or (j.get("ip") if isinstance(j.get("ip"), str) else None)
    status = "no_proxy" if not seen else "ok" if seen.count(expected) * 2 >= len(seen) else "wrong_country"
    return OrderedDict(requested=token, ip_country=(max(seen, key=seen.count) if seen else None), seen=seen, asn=asn,
                       org=org, verified_by=by, status=status, error=None if seen else err, verified=status == "ok", ip=ip)


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
    return OrderedDict([  # the vantage's exit IP is deliberately left out
        ("interface_id", entry["id"]), ("kind", kind), ("url", r["url"]), ("country", token.split("-")[0]),
        ("region", token if "-" in token else None), ("proxy_type", proxy_type),
        ("vantage", OrderedDict([("ip_country", vantage["ip_country"]), ("asn", vantage["asn"]), ("org", vantage["org"]),
                                 ("verified_by", vantage["verified_by"]), ("cf_loc", cf_loc), ("verified", vantage["verified"])])),
        ("at", now_iso()), ("http_status", r["status"]), ("final_url", r["final_url"]), ("redirects", r["redirects"]),
        ("server", hdr.get("server")), ("cf_ray", hdr.get("cf-ray")), ("ms", r["ms"]),
        ("ui_state", state), ("flags", flags or {}), ("body_sha256", hashlib.sha256(r["body"]).hexdigest() if r["body"] else None),
        ("excerpt", body_text(r["body"])), ("note", note + ("; TLS chain not verified locally" if r.get("tls_unverified") else "")),
    ])


def probe_country(token, entries, proxy_type, timeout, delay):
    """Vantage check, then every target from one country in order. Returns (vantage, observations, finished)."""
    if STOP.is_set():
        return None, [], False
    proxy_url = proxy_for(token, proxy_type, secrets.token_hex(4))  # one sticky exit IP per country, if the template asks
    v = check_vantage(proxy_url, token, timeout)
    if STOP.is_set():
        return None, [], False
    say(f"[{token}] vantage: {v['status']} ip_country={v['ip_country']} seen={v['seen']} asn={v['asn']}")
    if not v["verified"]:
        why = f"the proxy has no exit here ({v['error']})" if v["status"] == "no_proxy" else f"the proxy exit is in {v['ip_country']}"
        say(f"[{token}] skipped: {why}")
        return v, [], True
    obs = []
    for e in entries:
        r = fetch(proxy_url, e["url"], timeout)
        cf_loc = cf_trace(proxy_url, r["final_url"], timeout) if (r["headers"].get("server") == "cloudflare" or r["headers"].get("cf-ray")) else None
        if STOP.is_set():  # the answer may be the proxy's 407, not the site's
            return v, obs, False
        state, note = classify_site(r)
        if cf_loc and cf_loc != token.split("-")[0].upper():
            note += f"; cdn-cgi/trace loc={cf_loc} disagrees with {token}"
        obs.append(observation(e, token, proxy_type, v, "site", r, state, note, cf_loc=cf_loc))
        say(f"[{token}] {e['id']:14s} site  {r['status']!s:>4} {state:16s} {note[:70]}")
        time.sleep(delay)
        for url in e.get("geo_endpoints", []):
            r2 = fetch(proxy_url, url, timeout)
            if STOP.is_set():
                return v, obs, False
            st2, flags, note2 = classify_endpoint(r2)
            obs.append(observation(e, token, proxy_type, v, "geo_endpoint", r2, st2, note2, flags=flags))
            say(f"[{token}] {e['id']:14s} geo   {r2['status']!s:>4} {st2:16s} {json.dumps(flags)[:70]}")
            time.sleep(delay)
        for probe in e.get("api_probes", []):
            r3 = fetch(proxy_url, probe["url"].replace("{ip}", v["ip"] or ""), timeout, method=probe.get("method", "GET"),
                       body=probe.get("body"), headers=probe.get("headers"))
            if STOP.is_set():
                return v, obs, False
            if "{ip}" in probe["url"]:  # the observation is keyed by the template; the exit IP stays out of the data
                r3["url"], r3["final_url"], r3["redirects"] = probe["url"], probe["url"], []
            st3, flags, note3 = classify_api(probe, r3)
            obs.append(observation(e, token, proxy_type, v, "api", r3, st3, f"{probe['name']}: {note3}", flags=flags))
            say(f"[{token}] {e['id']:14s} api   {r3['status']!s:>4} {st3:16s} {probe['name']} {json.dumps(flags)[:60]}")
            time.sleep(delay)
    return v, obs, True


def cmd_run(args):
    with open(args.data, encoding="utf-8") as fh:
        data = json.load(fh, object_pairs_hook=OrderedDict)
    only = set(args.only.split(",")) if args.only else None
    entries = [e for e in data["interfaces"] if not only or e["id"] in only]
    proxy_type = args.proxy_type or os.environ.get("PROBE_PROXY_TYPE", "residential")
    timeout = float(os.environ.get("PROBE_TIMEOUT", "25"))
    delay = float(os.environ.get("PROBE_DELAY", "1.0"))
    workers = max(1, int(os.environ.get("PROBE_WORKERS", "6")))
    PACER.set_rate(float(os.environ.get("PROBE_RATE", "5")))
    spec = args.countries or os.environ.get("PROBE_COUNTRIES")
    if spec or proxy_type != "direct":
        tokens = expand_countries(spec or "default")
    else:  # direct without countries: the country of this machine's own egress
        own = check_vantage(None, "", timeout)["ip_country"]
        tokens = [own] if own else []
    say(f"{len(tokens)} countries, {workers} in parallel, at most {os.environ.get('PROBE_RATE', '5')} requests/s: {' '.join(tokens)}")
    started = now_iso()
    run_id = started.replace(":", "").replace("-", "") + "_" + proxy_type

    pool = ThreadPoolExecutor(max_workers=workers)
    futures = [pool.submit(probe_country, t, entries, proxy_type, timeout, delay) for t in tokens]
    try:
        for f in futures:
            f.result()
    except KeyboardInterrupt:
        STOP.set()
        say("! interrupted: finishing the requests in flight, then writing what was collected")
    pool.shutdown(wait=True, cancel_futures=True)

    obs, vantages, unfinished = [], OrderedDict(), []
    for token, f in zip(tokens, futures):
        v, got, finished = (None, [], False) if f.cancelled() else f.result()
        if v:
            vantages[token] = OrderedDict((k, x) for k, x in v.items() if k != "ip")
        obs += got
        if not finished:
            unfinished.append(token)

    os.makedirs(args.outdir, exist_ok=True)
    out_path = os.path.join(args.outdir, run_id + ".json")
    result = OrderedDict([("run", OrderedDict([("id", run_id), ("started_at", started), ("finished_at", now_iso()), ("tool", VERSION),
                                               ("proxy_type", proxy_type), ("countries", tokens), ("unfinished", unfinished),
                                               ("vantages", vantages)])),
                          ("observations", obs)])
    with open(out_path, "w", encoding="utf-8") as fh:
        json.dump(result, fh, ensure_ascii=False, indent=2)
        fh.write("\n")
    for status in ("ok", "no_proxy", "wrong_country"):
        got = [f"{t}({v['ip_country']})" if status == "wrong_country" else t for t, v in vantages.items()
               if v["status"] == status and t not in unfinished]
        print(f"\n{status}: {len(got)} {' '.join(got)}", end="")
    if unfinished:
        print(f"\nunfinished: {len(unfinished)} {' '.join(unfinished)}", end="")
    print(f"\n\n{len(obs)} observations -> {out_path}")
    print("next: pnpm monitor:sync   (merges this run into monitor/data/observations.json and rebuilds the site data)")


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
    r.add_argument("--countries", help="comma-separated tokens and groups of monitor/data/countries.json: UA,US,DE,US-NY,"
                                       "sanctioned (default: $PROBE_COUNTRIES or `default` = popular + regions + sanctioned)")
    r.add_argument("--only", help="comma-separated interface ids")
    r.add_argument("--proxy-type", choices=["residential", "isp", "mobile", "datacenter", "tor", "direct"])
    r.set_defaults(func=cmd_run)
    m = sub.add_parser("merge", help="append run files to the observations store")
    m.add_argument("store", help="monitor/data/observations.json")
    m.add_argument("runs", nargs="+", help="run files from `probe.py run`")
    m.set_defaults(func=cmd_merge)
    args = ap.parse_args([a for a in sys.argv[1:] if a != "--"])  # pnpm forwards the `--` of `pnpm monitor:probe -- --only x`
    args.func(args)


if __name__ == "__main__":
    main()
