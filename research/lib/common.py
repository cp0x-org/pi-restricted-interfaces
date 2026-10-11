"""Shared plumbing of the check scripts: loading research/checks/*.json, evaluating `expect` / `absent` / `section` /
`countries` against a text, printing one line per check and writing research/out/<kind>.json + .md + evidence files."""
import argparse, glob, json, os, re, sys
from collections import OrderedDict

from . import countries as C
from .net import now_iso

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # research/
PROJECT = os.path.dirname(HERE)                                      # pi-restrict-interface/
CHECKS_DIR = os.path.join(HERE, "checks")
OUT_DIR = os.path.join(HERE, "out")

TYPES = ("code", "code-scan", "bundle", "page", "api", "live")
# claim -> allowed statuses. yes/reported (and detect/block for vpn) are restrictions and count towards the rating.
CLAIMS = OrderedDict([
    ("geo_site", ("yes", "reported", "tos_only", "optional", "no")),
    ("geo_site.close_only", ("yes", "reported")),
    ("geo_feature", ("yes", "reported", "tos_only", "optional", "no")),
    ("screening", ("yes", "reported", "tos_only", "optional", "no")),
    ("vpn", ("detect", "block", "tos_only", "optional", "no")),
    ("kyc", ("yes", "reported", "tos_only", "no")),
])
COUNTRY_MODES = ("names", "names+groups", "codes")


class SpecError(Exception):
    pass


def load_specs(only=None):
    """Every research/checks/<id>.json, validated. `only` limits to a set of interface ids."""
    specs, seen = [], set()
    for path in sorted(glob.glob(os.path.join(CHECKS_DIR, "*.json"))):
        with open(path, encoding="utf-8") as fh:
            spec = json.load(fh, object_pairs_hook=OrderedDict)
        iid = spec.get("id")
        if os.path.basename(path) != f"{iid}.json":
            raise SpecError(f"{path}: id {iid!r} does not match the file name")
        t = spec.get("targets")
        if not isinstance(t, dict) or not str(t.get("app", "")).startswith("https://"):
            raise SpecError(f"{iid}: targets.app (the official interface URL) is required")
        if t.get("repo") is not None and not (isinstance(t["repo"], dict) and t["repo"].get("repo") and t["repo"].get("ref")):
            raise SpecError(f"{iid}: targets.repo must be null or {{repo, ref}}")
        if not isinstance(t.get("endpoints", []), list):
            raise SpecError(f"{iid}: targets.endpoints must be a list")
        ids = set()
        for c in spec.get("checks", []):
            where = f"{iid}/{c.get('id')}"
            if not c.get("id") or c["id"] in ids:
                raise SpecError(f"{where}: missing or duplicate check id")
            ids.add(c["id"])
            if c.get("type") not in TYPES:
                raise SpecError(f"{where}: type must be one of {TYPES}")
            if c.get("claim") not in CLAIMS or c.get("status") not in CLAIMS[c["claim"]]:
                raise SpecError(f"{where}: claim/status {c.get('claim')}/{c.get('status')} not allowed")
            if not c.get("about"):
                raise SpecError(f"{where}: 'about' (one sentence: what the check shows) is required")
            cm = c.get("countries")
            if isinstance(cm, list):
                bad = [t for t in cm if not C.valid(t)]
                if bad:
                    raise SpecError(f"{where}: unknown country tokens {bad}")
            elif cm is not None and cm not in COUNTRY_MODES:
                raise SpecError(f"{where}: countries must be a token list or one of {COUNTRY_MODES}")
        if iid in seen:
            raise SpecError(f"duplicate interface {iid}")
        seen.add(iid)
        if not only or iid in only:
            specs.append(spec)
    return specs


def iter_checks(types, only=None):
    for spec in load_specs(only):
        for c in spec.get("checks", []):
            if c["type"] in types:
                yield spec, c


def sweep_result(spec, kind, about, outcome, source, **extra):
    """One row of a sweep: a check that runs for every interface that has something to check (its app, its repository,
    its Terms). It reports what it found and supports no claim by itself; combine.py compares it with the site."""
    r = OrderedDict([
        ("check", f"{spec['id']}/{kind}"), ("interface", spec["id"]), ("type", kind), ("claim", None), ("status", None),
        ("about", about), ("outcome", outcome), ("countries", []), ("source", source), ("checked_at", now_iso()),
    ])
    r.update(extra)
    return r


def parallel(fn, items, workers=8):
    """fn over items with a thread pool, results in input order (network-bound work only)."""
    from concurrent.futures import ThreadPoolExecutor
    with ThreadPoolExecutor(max_workers=workers) as pool:
        return list(pool.map(fn, items))


def cli(description, extra=None):
    ap = argparse.ArgumentParser(description=description, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--only", help="comma-separated interface ids, e.g. ambient,sky")
    ap.add_argument("--refresh", action="store_true", help="ignore the HTTP cache (research/.cache) and fetch everything again")
    ap.add_argument("--max-age", type=int, default=12 * 3600, help="reuse cached responses younger than this many seconds (default 12 h)")
    ap.add_argument("-v", "--verbose", action="store_true", help="print every matched line, not only the first")
    if extra:
        extra(ap)
    args = ap.parse_args()
    args.only = set(args.only.split(",")) if args.only else None
    if args.refresh:
        args.max_age = 0
    return args


# ----------------------------------------------------------------------------- evaluation
def _flags(check):
    return re.M if check.get("case") else re.M | re.I


def line_at(text, pos):
    start = text.rfind("\n", 0, pos) + 1
    end = text.find("\n", pos)
    end = len(text) if end == -1 else end
    return text.count("\n", 0, pos) + 1, text[start:end].strip()


def snippet(text, m, width=220):
    """The matched line, or a window around the match when the 'line' is a minified bundle."""
    lineno, line = line_at(text, m.start())
    if len(line) <= width:
        return lineno, line
    a = max(0, m.start() - width // 3)
    return lineno, ("…" if a else "") + text[a:m.start() + width - width // 3].replace("\n", " ") + "…"


def find_section(text, section, flags):
    """The part of `text` from the first `start` match to the next `end` match (or `max` characters)."""
    ms = re.search(section["start"], text, flags)
    if not ms:
        return None, None
    rest = text[ms.start():]
    me = re.search(section["end"], rest[len(ms.group(0)):], flags) if section.get("end") else None
    stop = len(ms.group(0)) + me.start() if me else min(len(rest), section.get("max", 6000))
    return rest[:stop], ms.start()


def evaluate(check, text):
    """Apply a check's expect / absent / section / countries to `text`. Returns an OrderedDict with ok, found, missing,
    forbidden, countries and section (the text the countries were read from)."""
    flags = _flags(check)
    res = OrderedDict(ok=True, found=[], missing=[], forbidden=[], countries=[], section=None, reasons=[])
    for pat in check.get("expect", []):
        m = re.search(pat, text, flags)
        if m:
            ln, s = snippet(text, m)
            res["found"].append(OrderedDict([("pattern", pat), ("line", ln), ("text", s)]))
        else:
            res["missing"].append(pat)
    for pat in check.get("absent", []):
        for m in re.finditer(pat, text, flags):
            ln, s = snippet(text, m)
            res["forbidden"].append(OrderedDict([("pattern", pat), ("line", ln), ("text", s)]))
            break
    if res["missing"]:
        res["reasons"].append(f"not found: {', '.join(res['missing'])}")
    if res["forbidden"]:
        res["reasons"].append(f"present but must be absent: {', '.join(f['pattern'] for f in res['forbidden'])}")

    mode = check.get("countries")
    if isinstance(mode, list):
        res["countries"] = list(mode)
    elif mode:
        part = text
        if check.get("section"):
            part, _ = find_section(text, check["section"], flags)
            if part is None:
                res["reasons"].append(f"section start not found: {check['section']['start']}")
                part = ""
        for pat in check.get("exclude", []):
            part = re.sub(pat, " ", part, flags=flags)
        res["section"] = part
        if mode == "codes":
            res["countries"] = C.from_codes(part)
        else:
            res["countries"], _ = C.from_names(part, groups=(mode == "names+groups"))
        if not res["countries"]:
            res["reasons"].append("no countries found in the section")
    res["ok"] = not res["reasons"]
    return res


# ----------------------------------------------------------------------------- results
def result(spec, check, outcome, source, evaluation=None, **extra):
    """One row of research/out/<kind>.json. outcome: pass | fail | error | skip (| recorded for live checks)."""
    r = OrderedDict([
        ("check", f"{spec['id']}/{check['id']}"), ("interface", spec["id"]), ("type", check["type"]),
        ("claim", check["claim"]), ("status", check["status"]), ("about", check["about"]), ("outcome", outcome),
        ("countries", (evaluation or {}).get("countries", []) if outcome in ("pass", "recorded") else []),
        ("source", source), ("checked_at", now_iso()),
    ])
    if evaluation:
        r["found"] = evaluation["found"]
        if evaluation["missing"] or evaluation["forbidden"]:
            r["missing"] = evaluation["missing"]
            r["forbidden"] = evaluation["forbidden"]
        if evaluation["reasons"]:
            r["reasons"] = evaluation["reasons"]
    r.update(extra)
    return r


def print_result(r, verbose=False):
    mark = {"pass": "PASS", "fail": "FAIL", "error": "ERR ", "skip": "SKIP", "recorded": "REC "}[r["outcome"]]
    cc = r["countries"]
    ctext = f"  {len(cc)}: {' '.join(cc[:12])}{' …' if len(cc) > 12 else ''}" if cc else ""
    print(f"{mark} {r['check']:40s} {r['type']:9s} {r['claim']}={r['status']}{ctext}")
    print(f"     {r['source']}")
    for f in (r.get("found") or [])[: None if verbose else 1]:
        print(f"     L{f['line']}: {f['text'][:200]}")
    for why in r.get("reasons") or []:
        print(f"     ! {why[:300]}")
    if r.get("note"):
        print(f"     note: {r['note'][:300]}")
    sys.stdout.flush()


def save_evidence(r, body, name=None):
    """Keep what the check looked at: research/out/evidence/<interface>/<check>.txt with a short header."""
    path = os.path.join(OUT_DIR, "evidence", r["interface"], (name or r["check"].split("/", 1)[1]) + ".txt")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    head = [f"check: {r['check']}", f"about: {r['about']}", f"source: {r['source']}", f"checked_at: {r['checked_at']}"]
    for k in ("fetched", "sha256", "http_status", "via", "vantage"):
        if r.get(k):
            head.append(f"{k}: {json.dumps(r[k], ensure_ascii=False) if isinstance(r[k], (dict, list)) else r[k]}")
    with open(path, "w", encoding="utf-8") as fh:
        fh.write("\n".join(head) + "\n" + "-" * 80 + "\n" + body)
    r["evidence_file"] = os.path.relpath(path, HERE)


def write_outputs(kind, results, meta=None, only=None):
    """research/out/<kind>.json (machine-readable) and research/out/<kind>.md (one table, for people).
    With `only` (a run limited by --only, or without the sweep) the rows not produced by this run are kept."""
    os.makedirs(OUT_DIR, exist_ok=True)
    path = os.path.join(OUT_DIR, f"{kind}.json")
    tally = OrderedDict()
    for r in results:
        tally[r["outcome"]] = tally.get(r["outcome"], 0) + 1
    ran = len(results)
    if only and os.path.exists(path):
        with open(path, encoding="utf-8") as fh:
            old = json.load(fh, object_pairs_hook=OrderedDict).get("results", [])
        fresh = {r["check"] for r in results}
        specs = {sp["id"]: {f"{sp['id']}/{c['id']}" for c in sp.get("checks", [])} for sp in load_specs()}
        defined = lambda r: r["interface"] in specs and (not r.get("claim") or r["check"] in specs[r["interface"]])
        results = sorted([r for r in old if r["check"] not in fresh and defined(r)] + results, key=lambda r: r["check"])
    doc = OrderedDict([("kind", kind), ("generated_at", now_iso()), ("meta", meta or {}), ("results", results)])
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(doc, fh, ensure_ascii=False, indent=2)
        fh.write("\n")
    rows = [f"# {kind} checks ({doc['generated_at']})", ""]
    for k, v in (meta or {}).items():
        rows.append(f"- {k}: {v}")
    rows += ["", "| Check | Claim | Outcome | Countries | Source | What matched / why not |", "|---|---|---|---|---|---|"]
    for r in results:
        why = "; ".join(r.get("reasons") or []) or (r["found"][0]["text"] if r.get("found") else (r.get("note") or ""))
        claim = f"{r['claim']}={r['status']}" if r["claim"] else "sweep"
        rows.append(f"| {r['check']} | {claim} | {r['outcome']} | {' '.join(r['countries'])} | "
                    f"{r['source']} | {why[:240].replace('|', '/')} |")
    with open(os.path.join(OUT_DIR, f"{kind}.md"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(rows) + "\n")
    kept = f" (+{len(results) - ran} kept from the previous run)" if len(results) > ran else ""
    print(f"\n{ran} checks: " + ", ".join(f"{k} {v}" for k, v in tally.items()) + kept +
          f"  ->  research/out/{kind}.json, research/out/{kind}.md")


def load_env():
    """Proxy and RPC settings: research/.env, then the project's .env.probe; real environment variables win.
    Returns the file that was read (or None). Values are never printed."""
    for path in (os.path.join(HERE, ".env"), os.path.join(PROJECT, ".env.probe")):
        if os.path.exists(path):
            with open(path, encoding="utf-8") as fh:
                for line in fh:
                    line = line.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    k, v = line.split("=", 1)
                    v = v.split(" #", 1)[0].strip().strip('"').strip("'")
                    os.environ.setdefault(k.strip(), v)
            return os.path.relpath(path, PROJECT)
    return None
