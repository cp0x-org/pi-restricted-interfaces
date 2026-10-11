#!/usr/bin/env python3
"""Bundle checks: the HTML and JavaScript each official site actually ships to the browser.

Why: whatever the repository says, the code that runs is what the site serves. A server can ship different files than
the repository, and closed frontends have no other public copy of their code. Geo lookups, country lists, the
sanctions-oracle address, screening endpoints and the texts of blocking screens are plain strings in that JavaScript.

Two kinds of work, both for every interface:
  sweep   for every interface (targets.app in research/checks/<id>.json): download the app's HTML, every <script> it
          loads and the chunks those scripts load lazily (found automatically: Next.js, webpack, Vite, Vue CLI and
          Angular chunk maps), then report the access-restriction signals found in them (lib/signals.py) with the file
          and a snippet. A signal is a lead; combine.py lists the strong ones the published data does not explain.
  checks  checks of type "bundle" confirm a specific claim in the same files: `expect` must be present, `absent`
          must not be, countries are read from `section`.
Nothing is executed: the files are only downloaded and searched as text. No browser, no wallet, no AI.

Usage (from pi-restrict-interface/):
  python3 -I research/check_bundle.py
  python3 -I research/check_bundle.py --only notional-v3 -v
  python3 -I research/check_bundle.py --no-sweep          # only the claim checks
"""
import os, re, sys, urllib.parse
from collections import OrderedDict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import common, signals  # noqa: E402
from lib.net import fetch, proxy_for, text_of  # noqa: E402

ATTR = r"=(?:\"([^\"]+)\"|'([^']+)'|([^\s>\"']+))"   # quoted or unquoted attribute value
SCRIPT_RE = re.compile(r"<script\b[^>]*\bsrc" + ATTR, re.I)
PRELOAD_RE = re.compile(r"<link\b(?=[^>]*\brel=[\"']?(?:modulepreload|preload)\b)[^>]*\bhref" + ATTR, re.I)
# Chunk paths written literally in JavaScript: Next.js (static/chunks/...), CRA (static/js/...), Vite (assets/...).
LITERAL_RE = re.compile(r"[\"'`]((?:\.{1,2}/|/)?(?:_next/static/|static/js/|static/chunks/|assets/|js/|chunks/)[\w./~@%+-]+?\.m?js)(?:\?[^\"'`]*)?[\"'`]")
# Chunks next to the importing file: import("./chunk-ABC.js"), from"./index-DEF.js" (Vite, esbuild/Angular).
SIBLING_RE = re.compile(r"[\"'`](\./[\w.~@%+-]+\.m?js)[\"'`]")
# webpack/Angular chunk maps: "static/js/"+({...}[e]||e)+"."+{12:"a1b2c3",...}[e]+".chunk.js"
# Written for minified code (no spaces) and without ambiguous repetition, so it stays linear on multi-MB bundles.
_KEY = r"(?:\d+|\"[\w.~-]+\"|[A-Za-z_$][\w$]*)"
HASHMAP_RE = re.compile(r"\"([.-])\"\+\{((?:" + _KEY + r":\"[0-9a-f]{5,32}\",)*" + _KEY + r":\"[0-9a-f]{5,32}\")\}\[\w+\]\+\"((?:\.chunk)?\.m?js)\"")
MAX_SCRIPTS, MAX_BYTES = 1500, 80_000_000
_COLLECTED = {}


def same_site(a, b):
    ha, hb = urllib.parse.urlsplit(a).hostname or "", urllib.parse.urlsplit(b).hostname or ""
    return ha.split(".")[-2:] == hb.split(".")[-2:]


def discover(js, script_url, page_url, next_root):
    """Lazy chunks referenced by one first-party script."""
    origin = "{0.scheme}://{0.netloc}/".format(urllib.parse.urlsplit(page_url))
    out = []
    for m in LITERAL_RE.finditer(js):
        path = m.group(1)
        if path.startswith(("./", "../")):
            out.append(urllib.parse.urljoin(script_url, path))
        elif path.startswith("static/") and next_root:
            out.append(urllib.parse.urljoin(next_root, path))
        else:
            out.append(urllib.parse.urljoin(origin, path.lstrip("/")))
    for m in SIBLING_RE.finditer(js):
        out.append(urllib.parse.urljoin(script_url, m.group(1)))
    for m in HASHMAP_RE.finditer(js):
        sep, body, suffix = m.groups()
        window = js[max(0, m.start() - 400):m.start()]
        pre = re.findall(r"\"([\w./-]*/)\"\s*\+", window)
        prefix = pre[-1] if pre else ""
        names = {}
        nm = re.findall(r"\{([^{}]*)\}\[\w+\]\|\|\w+", window)
        if nm:
            names = dict(re.findall(r"(" + _KEY + r"):\"([\w.~-]+)\"", nm[-1]))
        for cid, h in re.findall(r"(" + _KEY + r"):\"([0-9a-f]{5,32})\"", body):
            name = names.get(cid, cid).strip('"')
            path = f"{prefix}{name}{sep}{h}{suffix}"
            if prefix:
                out.append(urllib.parse.urljoin(next_root if (next_root and prefix.startswith("static/")) else origin, path))
            else:
                out.append(urllib.parse.urljoin(script_url, path))
    return out


def collect(url, max_age, scripts=None, follow=None, follow_base=None, max_scripts=MAX_SCRIPTS, proxy=None):
    """The page and its JavaScript: [(url, text, sha256)], first entry = inline scripts. Memoized per run."""
    key = (url, scripts, repr(follow), follow_base, proxy)
    if key in _COLLECTED:
        return _COLLECTED[key]
    page = fetch(url, cache=max_age, timeout=60, proxy=proxy)
    if page["error"] or not page["status"] or page["status"] >= 400:
        _COLLECTED[key] = (page, [], page["error"] or f"HTTP {page['status']}", False)
        return _COLLECTED[key]
    base = page["final_url"]
    html = text_of(page)
    urls = []
    for rx in (SCRIPT_RE, PRELOAD_RE):
        for m in rx.finditer(html):
            ref = next(g for g in m.groups() if g)
            if rx is PRELOAD_RE and not re.search(r"\.m?js(\?|$)", ref):
                continue
            u = urllib.parse.urljoin(base, ref)
            if u not in urls:
                urls.append(u)
    keep = re.compile(scripts) if scripts else None
    urls = [u for u in urls if not keep or keep.search(u)]
    inline = "\n".join(m.group(1) for m in re.finditer(r"<script\b(?![^>]*\bsrc=)[^>]*>(.*?)</script>", html, re.S | re.I))
    files = [(base + " (HTML and inline scripts)", html + "\n" + inline, page["sha256"])]
    next_root = next((u.split("/_next/")[0] + "/_next/" for u in urls if "/_next/" in u), None)
    fspec = follow
    frx = re.compile(fspec["regex"] if isinstance(fspec, dict) else fspec) if fspec else None
    template = fspec.get("path") if isinstance(fspec, dict) else None
    seen, level, size, truncated = set(urls), list(urls), len(html), False
    while level:
        if len(files) > max_scripts or size > MAX_BYTES:
            truncated = True
            break
        level = level[:max_scripts + 1 - len(files)]
        got = common.parallel(lambda u: (u, fetch(u, cache=max_age, timeout=60, proxy=proxy)), level)
        nxt = []
        for u, r in got:
            if r["error"] or r["status"] != 200 or "html" in r["headers"].get("content-type", ""):
                continue  # a single-page-app fallback answers 200 with index.html for files that do not exist
            js = text_of(r)
            files.append((u, js, r["sha256"]))
            size += len(js)
            if not same_site(u, base):
                continue  # third-party scripts are searched but not followed
            found = []
            if frx:
                for m in frx.finditer(js):
                    path = m.group(1) if not template else re.sub(r"\{(\d)\}", lambda g: m.group(int(g.group(1))), template)
                    found.append(urllib.parse.urljoin(follow_base or base, path))
            found += discover(js, u, base, next_root)
            for nu in found:
                if nu not in seen and (not keep or keep.search(nu) or same_site(nu, base)):
                    seen.add(nu)
                    nxt.append(nu)
        level = nxt
    _COLLECTED[key] = (page, files, None, truncated)
    return _COLLECTED[key]


def short(url):
    """Script URL without the origin and the cache-busting query string."""
    return re.sub(r"^https?://[^/]+", "", url or "").split("?")[0] or url


# ----------------------------------------------------------------------------- sweep
def sweep(spec, max_age, via_country=None):
    url = spec["targets"]["app"]
    page, files, err, truncated = collect(url, max_age)
    about = "Production HTML and JavaScript of the official app, searched for access-restriction signals"
    via, notes = "direct", []
    if (err or len(files) <= 1) and via_country and proxy_for(via_country):
        # Unreachable from this machine (anti-bot, an internet provider's block) or no scripts at all: same thing
        # through a proxy in another country.
        notes.append(f"direct: {err or 'no scripts in the page'}")
        page, files, err, truncated = collect(url, max_age, proxy=proxy_for(via_country))
        via = f"proxy {via_country}"
    if err:
        notes.append(f"{via}: {err}")
        return common.sweep_result(spec, "sweep-bundle", about, "error", url, http_status=page["status"], reasons=notes)
    hits = OrderedDict()
    for u, js, _ in files:
        signals.scan(short(u) if not u.endswith(")") else "/ (HTML and inline scripts)", js, hits)
    found = signals.summary(hits)
    res = common.sweep_result(spec, "sweep-bundle", about, "pass", url, final_url=page["final_url"], http_status=page["status"],
                              scripts=len(files) - 1, bytes=sum(len(js) for _, js, _ in files), truncated=truncated,
                              signals=found, strong=signals.categories(found), via=via, note="; ".join(notes) or None)
    body = f"page: {page['final_url']} (HTTP {page['status']})\nscripts ({len(files) - 1}{', truncated' if truncated else ''}):\n"
    body += "\n".join(f"  {u}  sha256={h}" for u, _, h in files[1:]) + "\n\nsignals:\n"
    for s in found:
        body += f"  [{s['strength']}] {s['category']}: {s['signal']} — {s['files']} file(s)\n"
        body += "".join(f"      {e['file']}: {e['snippet']}\n" for e in s["examples"])
    common.save_evidence(res, body, name="sweep-bundle")
    return res


def print_sweep(res, spec, verbose=False):
    mark = {"pass": "SCAN", "error": "ERR "}[res["outcome"]]
    if res["outcome"] == "error":
        print(f"{mark} {spec.get('name', res['interface']):24s} {res['source']}  ! {'; '.join(res.get('reasons') or [])[:160]}")
        return
    strong = [s for s in res["signals"] if s["strength"] == "strong"]
    tag = ", ".join(f"{s['category']}: {s['signal']}" for s in strong) or "no strong signals"
    trunc = (" (capped)" if res["truncated"] else "") + ("" if res.get("via", "direct") == "direct" else f" via {res['via']}")
    print(f"{mark} {spec.get('name', res['interface']):24s} {res['scripts']:3d} scripts {res['bytes'] / 1e6:5.1f} MB{trunc}  {tag}")
    for s in (res["signals"] if verbose else strong):
        e = s["examples"][0]
        print(f"       {s['category']}/{s['signal']} ({s['files']} files) {e['file']}: {e['snippet'][:140]}")
    sys.stdout.flush()


# ----------------------------------------------------------------------------- claim checks
def run(spec, check, max_age):
    src = check["source"]
    page, files, err, truncated = collect(src["url"], max_age, src.get("scripts"), src.get("follow"), src.get("follow_base"),
                                          src.get("max_scripts", MAX_SCRIPTS))
    if err:
        return common.result(spec, check, "error", src["url"], http_status=page["status"], reasons=[err])
    if check.get("skip_scripts"):  # e.g. the Terms page text or a third-party SDK, named in the check's `about`
        skip = re.compile(check["skip_scripts"])
        files = [f for f in files if not skip.search(f[0])]
    marks, parts, pos = [], [], 0
    for u, js, _ in files:
        marks.append((pos, u))
        parts.append(js)
        pos += len(js) + 1
    text = "\n".join(parts)
    ev = common.evaluate(check, text)

    def where(pattern):
        m = re.search(pattern, text, re.M if check.get("case") else re.M | re.I)
        if not m:
            return None
        return [u for p, u in marks if p <= m.start()][-1]

    for f in ev["found"]:
        f["script"] = where(f["pattern"])
        f["snippet"] = f["text"]
        f["text"] = f"{f['script']}: {f['text']}"
    for f in ev["forbidden"]:
        f["script"] = where(f["pattern"])
    if ev["forbidden"]:
        ev["reasons"] = [r for r in ev["reasons"] if not r.startswith("present")] + \
                        [f"{f['script']} matches {f['pattern']!r}: {f['text'][:160]}" for f in ev["forbidden"]]
    res = common.result(spec, check, "pass" if ev["ok"] else "fail", src["url"], ev, http_status=page["status"],
                        scripts=len(files) - 1, bytes=len(text), absent=check.get("absent", []), truncated=truncated,
                        note=f"{len(files) - 1} scripts downloaded from {page['final_url']}")
    body = "scripts:\n" + "\n".join(f"  {u}  sha256={h}" for u, _, h in files[1:]) + "\n\nmatches:\n"
    body += "\n".join(f"  {f['text']}" for f in ev["found"]) or "  none"
    if ev["section"]:
        body += "\n\n--- section the countries were read from ---\n" + ev["section"][:20000]
    common.save_evidence(res, body)
    return res


def print_bundle(res, spec, verbose=False):
    """One readable block per check: what was downloaded, what was searched for, where it was (or was not) found."""
    mark = {"pass": "PASS", "fail": "FAIL", "error": "ERR "}[res["outcome"]]
    cc = f" -> {len(res['countries'])} countries: {' '.join(res['countries'])}" if res["countries"] else ""
    print(f"\n{mark} {spec.get('name', res['interface'])} ({res['check']}): {res['claim']}={res['status']}{cc}")
    print(f"     {res['about']}")
    if res.get("scripts") is not None:
        print(f"     downloaded {res['source']} and {res['scripts']} scripts ({res['bytes'] / 1e6:.1f} MB of JavaScript)")
    for f in res.get("found") or []:
        print(f"     found     {f['pattern'][:90]}")
        print(f"       in      {short(f['script'])}: {f['snippet'][:150 if not verbose else 400]}")
    if res["outcome"] == "pass" and res.get("absent"):
        for pat in res["absent"]:
            print(f"     absent    {pat[:150]}{'…' if len(pat) > 150 else ''}")
        print(f"       -> no match in any of the {res['scripts']} scripts")
    for why in res.get("reasons") or []:
        print(f"     ! {why[:300]}")
    sys.stdout.flush()


def main():
    def extra(ap):
        ap.add_argument("--no-sweep", action="store_true", help="skip the sweep of every app")
        ap.add_argument("--via-country", default="US", help="proxy country for apps unreachable from this machine (default US)")
    args = common.cli(__doc__, extra)
    common.load_env()
    results = []
    specs = common.load_specs(args.only)
    if not args.no_sweep:
        print(f"Sweep: production JavaScript of {len(specs)} interfaces (SCAN = downloaded and searched)\n")
        for spec in specs:
            res = sweep(spec, args.max_age, args.via_country)
            print_sweep(res, spec, args.verbose)
            results.append(res)
    for spec in specs:
        for check in spec["checks"]:
            if check["type"] == "bundle":
                res = run(spec, check, args.max_age)
                print_bundle(res, spec, args.verbose)
                results.append(res)
    common.write_outputs("bundle", results, {"sweep": not args.no_sweep}, args.only or (args.no_sweep and {'partial'}))
    print("SCAN = the app's JavaScript was downloaded and searched; signals are leads, not verdicts (see research/out/report.md).\n"
          "PASS = the official site ships this code to every visitor today (or, for 'absent' checks, ships none of it). "
          "FAIL = the code is gone or still there; ERR = the site did not answer.")


if __name__ == "__main__":
    main()
