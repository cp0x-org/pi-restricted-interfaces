#!/usr/bin/env python3
"""Live checks: what the interface answers to a visitor from a given country (edge or server-side geo-blocking).

Sweep (every interface, targets.app and targets.endpoints): the app page and its geo endpoints are requested from this
machine and through a proxy in each of --countries (vantage verified as below). For each vantage the page state
(ok / blocked / challenge / error), the redirect chain, the title and the list of <script> files are recorded, and the
countries are compared: a block, an anti-bot challenge or a different set of JavaScript files for one country shows up
as a "!" line. This is what catches a block done by the web server (nginx, CDN rules) or JavaScript swapped per country.

Claim checks (type "live"), one URL from one country (source.url, source.country):
  1. take the proxy for that country from PROBE_PROXY_URL (a template with {cc}, the same variable as
     monitor/scripts/probe.py; read from the environment, research/.env or the project's .env.probe);
  2. verify the vantage: api.country.is, ipinfo.io and ifconfig.co are asked through the same proxy which country
     the exit IP is in; the proxy must answer and at least half of the answers must be the requested country,
     otherwise the check is skipped (no exit there, or an exit in another country);
  3. GET source.url through the proxy (redirects followed and recorded) and match `expect` against the transcript
     (status, final_url, redirect lines, body).
Without a proxy (or with an unverified vantage) the script falls back to the observation already recorded in
monitor/data/observations.json for the same interface, country and URL, and reports the outcome as "recorded" with
its date. Re-run with a proxy to reproduce it yourself.

Proxy used for the catalog: Decodo (ex-Smartproxy), see research/METHODOLOGY.md. Any provider with country targeting
works; only the URL template changes. Read-only GET requests, no logins, no CAPTCHA solving.

Usage (from pi-restrict-interface/):
  python3 -I research/check_live.py                       # proxy from .env / .env.probe, else recorded
  PROBE_PROXY_URL='http://user-LOGIN-country-{cc}:PASS@gate.decodo.com:7000' python3 -I research/check_live.py
  python3 -I research/check_live.py --no-recorded          # never fall back to recorded observations
  python3 -I research/check_live.py --countries US,GB,DE   # sweep vantages (default: monitor/data/countries.json)
  python3 -I research/check_live.py --countries sanctioned # a group of monitor/data/countries.json
"""
import json, os, re, sys, urllib.parse
from collections import OrderedDict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import common  # noqa: E402
from lib.net import GEO_APIS, expand_countries, fetch, proxy_for, proxy_label, text_of, transcript, vantage  # noqa: E402
from lib.text import html_to_text  # noqa: E402

STORE = os.path.join(common.PROJECT, "monitor", "data", "observations.json")


def recorded(iface, country, url):
    """Newest verified observation for (interface, country, url) in monitor/data/observations.json."""
    if not os.path.exists(STORE):
        return None
    with open(STORE, encoding="utf-8") as fh:
        obs = json.load(fh).get("observations", [])
    hits = [o for o in obs if o["interface_id"] == iface and o["country"] == country.split("-")[0]
            and o["url"].rstrip("/") == url.rstrip("/") and o["vantage"].get("verified")]
    return max(hits, key=lambda o: o["at"]) if hits else None


def recorded_transcript(o):
    return "\n".join([f"request: GET {o['url']}", f"status: {o['http_status']}", f"final_url: {o['final_url']}",
                      f"ui_state: {o['ui_state']}", f"flags: {json.dumps(o['flags'])}", f"body: {o.get('excerpt', '')}",
                      f"note: {o['note']}"])


def run(spec, check, use_recorded, vantages):
    src = check["source"]
    cc = src["country"]
    proxy = proxy_for(cc)
    if proxy:
        if cc not in vantages:
            vantages[cc] = vantage(proxy, cc)
            v = vantages[cc]
            print(f"[{cc}] vantage via {proxy_label(proxy)}: seen={v['seen']} org={v['org']} verified={v['verified']}")
        v = vantages[cc]
        r = None
        if v["verified"]:
            r = fetch(src["url"], proxy=proxy, cache=None, timeout=float(os.environ.get("PROBE_TIMEOUT", "40")))
            if r["error"] and re.search(r"Tunnel connection failed|407|ProxyError", r["error"]):
                print(f"[{cc}] the proxy refused the request ({r['error'][:80]}): falling back to the recorded observation")
                r = None
        if r is not None:
            t = transcript(r, body_limit=300_000)  # blocking texts can sit deep in an HTML page
            ev = common.evaluate(check, t)
            outcome = "pass" if ev["ok"] else ("error" if r["error"] else "fail")
            res = common.result(spec, check, outcome, f"{src['url']} from {cc}", ev, via="proxy",
                                vantage=dict(v, proxy=proxy_label(proxy), proxy_type=os.environ.get("PROBE_PROXY_TYPE", "residential")),
                                http_status=r["status"])
            common.save_evidence(res, json.dumps(res["vantage"], ensure_ascii=False) + "\n\n" + t)
            return res
    o = recorded(spec["id"], cc, src["url"]) if use_recorded else None
    if o:
        t = recorded_transcript(o)
        ev = common.evaluate(check, t)
        res = common.result(spec, check, "recorded" if ev["ok"] else "fail", f"{src['url']} from {cc}", ev, via="recorded",
                            vantage=o["vantage"], recorded_at=o["at"], proxy_type=o["proxy_type"],
                            note=f"no verified {cc} proxy in this run; observation recorded {o['at']} via {o['proxy_type']} "
                                 f"proxy ({o['vantage'].get('org')}) in monitor/data/observations.json")
        common.save_evidence(res, t)
        return res
    why = "no proxy for this country (set PROBE_PROXY_URL)" if not proxy else "vantage not verified"
    return common.result(spec, check, "skip", f"{src['url']} from {cc}", reasons=[why])


# ----------------------------------------------------------------------------- sweep
GEO_TEXT_RE = re.compile(r"(geo|region|country|jurisdiction|legal reasons|not available in|restricted|sanction)", re.I)
BLOCK_PATH_RE = re.compile(r"(blocked|restricted|not-?available|unavailable|geo-?block|not-?allowed|forbidden|/error\?code=451)", re.I)
BLOCK_TEXT_RE = re.compile(r"(not available in your (country|region|jurisdiction)|blocked in your|restricted in your|"
                           r"unavailable in your|access (is )?(blocked|restricted)|unavailable for legal reasons|service unavailable in)", re.I)
CHALLENGE_RE = re.compile(r"(just a moment|cf-chl|challenge-platform/h/|attention required|verify you are human|"
                          r"enable javascript and cookies|x-vercel-challenge|vercel security checkpoint)", re.I)
FLAG_KEYS = ("blocked", "isBlocked", "geoblocked", "isRegionRestricted", "is_restricted_region", "restricted", "isRestricted",
             "limited", "allowed", "ipAllowed", "availability", "country", "countryCode", "country_code", "region", "is_vpn")
SCRIPT_RE = re.compile(r"<script\b[^>]*\bsrc=[\"']?([^\"' >]+)", re.I)
TITLE_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.I | re.S)


def classify_page(r):
    """Coarse state of an app page fetched without JavaScript: ok | blocked | challenge | error | unknown."""
    if r["error"]:
        return "error", r["error"][:120]
    st, hdr = r["status"], r["headers"]
    text = html_to_text(text_of(r)[:300_000])
    if st == 451:
        return "blocked", "HTTP 451"
    for hop in r["redirects"]:
        if BLOCK_PATH_RE.search(urllib.parse.urlsplit(hop["location"]).path + "?" + urllib.parse.urlsplit(hop["location"]).query):
            return "blocked", f"redirect -> {hop['location']}"
    if hdr.get("cf-mitigated") == "challenge" or hdr.get("x-vercel-mitigated") == "challenge" or (st in (403, 429, 503) and CHALLENGE_RE.search(text_of(r)[:20000])):
        return "challenge", f"HTTP {st} anti-bot challenge"
    if st == 403:
        return ("blocked", "HTTP 403 with geo wording") if GEO_TEXT_RE.search(text[:3000]) else ("unknown", "HTTP 403 without geo wording")
    if st and 200 <= st < 300:
        if BLOCK_TEXT_RE.search(text) and len(text) < 3000:
            return "blocked", "block text in the page"
        return "ok", "page served (client-side gates not evaluated)"
    if st and st >= 500:
        return "error", f"HTTP {st}"
    return "unknown", f"HTTP {st}"


def classify_endpoint(r):
    """State and flags of a geo endpoint answer (JSON)."""
    if r["error"]:
        return "error", {}
    try:
        j = json.loads(text_of(r))
    except ValueError:
        j = None
    flags = OrderedDict((k, j[k]) for k in FLAG_KEYS if isinstance(j, dict) and isinstance(j.get(k), (bool, str, int)))
    if r["status"] == 451 or any(flags.get(k) is True for k in ("blocked", "isBlocked", "geoblocked", "isRegionRestricted",
                                                                  "is_restricted_region", "restricted", "isRestricted")):
        return "blocked", flags
    if flags.get("allowed") is False or flags.get("ipAllowed") is False:
        return "blocked", flags
    if flags.get("limited") is True or flags.get("availability") == "limited":
        return "feature_limited", flags
    if r["status"] and 200 <= r["status"] < 300:
        return "ok", flags
    return ("unknown" if r["status"] and r["status"] < 500 else "error"), flags


def script_key(url):
    """A script path comparable across vantages: build hashes in file names are masked (main-REKVSMH7.js and
    main-WRNDBK4G.js are the same entry from two deploys), CDN analytics beacons and /cdn-cgi/ helpers are dropped."""
    path = urllib.parse.urlsplit(url).path
    if "/cdn-cgi/" in path or path.startswith("/beacon.min.js"):
        return None
    return re.sub(r"(?<=[.-])[A-Za-z0-9_]{6,}(?=\.m?js$)|(?<=[.-])[0-9a-f]{8,}(?=[.-])", "*", path)


def page_record(r, kind):
    rec = OrderedDict(status=r["status"], final_url=r["final_url"])
    if kind == "app":
        state, why = classify_page(r)
        html = text_of(r)
        t = TITLE_RE.search(html)
        rec.update(state=state, why=why, title=" ".join(t.group(1).split())[:80] if t else None,
                   scripts=sorted({script_key(u) for u in SCRIPT_RE.findall(html) if script_key(u)}), bytes=len(r["body"]))
    else:
        state, flags = classify_endpoint(r)
        rec.update(state=state, flags=flags, body=" ".join(text_of(r)[:200].split()))
    rec["redirects"] = [h["location"] for h in r["redirects"]]
    rec["server"] = r["headers"].get("server")
    return rec


def own_vantage():
    """Country of this machine's own egress, by the same geo services (no proxy)."""
    seen = []
    for name, url, pick in GEO_APIS:
        r = fetch(url, cache=None, timeout=20)
        try:
            c = pick(json.loads(text_of(r)))[0] if r["status"] == 200 else None
        except ValueError:
            c = None
        if c:
            seen.append(str(c).upper())
    top = max(set(seen), key=seen.count) if seen else None
    return OrderedDict(requested="direct", seen=seen, country=top, verified=bool(seen) and seen.count(top) >= max(1, len(seen) - 1))


def sweep_vantage(specs, label, proxy, timeout, workers):
    """The app page and every geo endpoint of every interface from one vantage: {id: {"app": rec, url: rec}}."""
    def one(spec):
        t = spec["targets"]
        out = OrderedDict(app=page_record(fetch(t["app"], proxy=proxy, cache=None, timeout=timeout, max_bytes=2_000_000), "app"))
        for ep in t.get("endpoints", []):
            out[ep] = page_record(fetch(ep, proxy=proxy, cache=None, timeout=timeout, max_bytes=200_000), "endpoint")
        return out
    return dict(zip([s["id"] for s in specs], common.parallel(one, specs, workers)))


def sweep(specs, countries, timeout):
    """Every app from this machine and from every proxy country; one sweep-live row per interface."""
    vantages = OrderedDict()
    v = own_vantage()
    print(f"[direct] this machine: seen={v['seen']} -> {v['country']}")
    vantages["direct"] = (v, None)
    with_proxy = [cc for cc in countries if proxy_for(cc)]
    for cc in countries:
        if cc not in with_proxy:
            print(f"[{cc}] no proxy (set PROBE_PROXY_URL): skipped")
    for cc, v in zip(with_proxy, common.parallel(lambda c: vantage(proxy_for(c), c), with_proxy, workers=6)):
        print(f"[{cc}] vantage via {proxy_label(proxy_for(cc))}: seen={v['seen']} org={v['org']} verified={v['verified']}")
        if v["verified"]:
            vantages[cc] = (v, proxy_for(cc))
    data = OrderedDict()
    labels = list(vantages)
    print(f"fetching {len(specs)} apps and their geo endpoints from {len(labels)} vantages: {' '.join(labels)}", flush=True)
    fetched = dict(zip(labels, common.parallel(lambda lb: sweep_vantage(specs, lb, vantages[lb][1], timeout, 6 if vantages[lb][1] else 8),
                                              labels, workers=4)))
    for label in labels:
        proxy = vantages[label][1]
        got = fetched[label]
        failed = sum(1 for rec in got.values() if re.search(r"Tunnel connection failed|407|ProxyError", rec["app"].get("why") or ""))
        if proxy and failed > len(got) // 2:
            # The proxy itself stopped answering (expired plan, used-up traffic): nothing was learned about the apps.
            print(f"[{label}] the proxy refused {failed} of {len(got)} requests (e.g. HTTP 407 from the proxy): vantage dropped")
            del vantages[label]
            continue
        data[label] = got
    rows = []
    about = "The app page (and its geo endpoints) from this machine and from every verified proxy country, compared"
    for spec in specs:
        per = OrderedDict((label, data[label][spec["id"]]) for label in data)
        notes = []
        # An empty page where other vantages get the app is a block in front of the app: the internet provider, a
        # national regulator, the CDN or the web server (nginx) answering instead of the application.
        served = [rec["app"] for rec in per.values() if rec["app"]["state"] == "ok" and rec["app"]["scripts"]]
        for label, rec in per.items():
            app = rec["app"]
            if served and app["state"] == "ok" and not app["scripts"] and app.get("bytes", 0) < 2000:
                other = served[0]["server"]
                app["state"] = "blocked"
                app["why"] = (f"empty page ({app.get('bytes', 0)} bytes) from server {app['server']!r} while other vantages get "
                              f"the app from {other!r}: blocked before the app (internet provider, regulator, CDN or web server)")
        base = per.get("direct", {}).get("app")
        for label, rec in per.items():
            app = rec["app"]
            if app["state"] in ("blocked", "challenge"):
                notes.append(f"{label}: app {app['state']} ({app['why']})")
            if base and label != "direct" and app["state"] == "ok" and base["state"] == "ok" and app["scripts"] != base["scripts"]:
                only_here = sorted(set(app["scripts"]) - set(base["scripts"]))
                only_direct = sorted(set(base["scripts"]) - set(app["scripts"]))
                notes.append(f"{label}: different scripts than direct (+{' +'.join(only_here[:3]) or '0'}"
                             f"{' …' if len(only_here) > 3 else ''} / -{' -'.join(only_direct[:3]) or '0'}{' …' if len(only_direct) > 3 else ''})")
            for ep, er in rec.items():
                if ep != "app" and er["state"] in ("blocked", "feature_limited"):
                    notes.append(f"{label}: {urllib.parse.urlsplit(ep).path} {er['state']} {json.dumps(er['flags'])}")
        ok = any(rec["app"]["state"] != "error" for rec in per.values())
        meta = OrderedDict((label, OrderedDict(country=vv.get("country") or vv.get("requested"), org=vv.get("org"),
                                               verified=vv["verified"])) for label, (vv, _) in vantages.items())
        res = common.sweep_result(spec, "sweep-live", about, "pass" if ok else "error", spec["targets"]["app"],
                                  vantages=meta, observations=per, notes=notes)
        if not ok:
            res["reasons"] = [f"{label}: {rec['app']['why']}" for label, rec in per.items()]
        common.save_evidence(res, json.dumps(per, ensure_ascii=False, indent=1), name="sweep-live")
        rows.append(res)
    return rows, vantages


def print_sweep(res, spec):
    per = res["observations"]
    cells = " ".join(f"{label}:{rec['app']['state'][:7]}" for label, rec in per.items())
    mark = "SCAN" if res["outcome"] == "pass" else "ERR "
    print(f"{mark} {spec.get('name', res['interface']):24s} {cells}")
    for n in res["notes"]:
        print(f"       ! {n[:160]}")


def main():
    def extra(ap):
        ap.add_argument("--no-recorded", action="store_true", help="do not fall back to monitor/data/observations.json")
        ap.add_argument("--countries", default=os.environ.get("PROBE_COUNTRIES", "default"),
                        help="proxy countries and groups of monitor/data/countries.json for the sweep, about 8 MB each "
                             "(default: $PROBE_COUNTRIES or `default` = popular + regions + sanctioned)")
        ap.add_argument("--no-sweep", action="store_true", help="only the claim checks of type live")
    args = common.cli(__doc__, extra)
    env_file = common.load_env()
    print(f"proxy settings: {env_file or 'environment only'}; PROBE_PROXY_URL {'set' if os.environ.get('PROBE_PROXY_URL') else 'not set'}")
    vantages, results = {}, []
    specs = common.load_specs(args.only)
    timeout = float(os.environ.get("PROBE_TIMEOUT", "40"))
    if not args.no_sweep:
        countries = expand_countries(args.countries)
        rows, used = sweep(specs, countries, timeout)
        print()
        for res in rows:
            print_sweep(res, next(s for s in specs if s["id"] == res["interface"]))
        results += rows
        vantages.update({k: dict(v) for k, (v, _) in used.items()})
        print()
    for spec, check in ((s, c) for s in specs for c in s["checks"] if c["type"] == "live"):
        res = run(spec, check, not args.no_recorded, vantages)
        common.print_result(res, args.verbose)
        results.append(res)
    common.write_outputs("live", results, {"vantages": vantages}, args.only or (args.no_sweep and {'partial'}))
    print("SCAN = the app was requested from every vantage; states: ok (served, client-side gates not evaluated), blocked, "
          "challenge (anti-bot, not testable), error. Lines with ! are differences between countries.")


if __name__ == "__main__":
    main()
