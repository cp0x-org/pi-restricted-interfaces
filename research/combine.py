#!/usr/bin/env python3
"""Combine the check results into the monitor table: rating and number of restrictions per interface.

Input: research/out/{code,bundle,docs,api,live}.json written by the check_*.py scripts. Only checks that passed
(or, for live checks without a proxy, a "recorded" observation) are used; a failed, skipped or missing check simply
does not support its claim. The P3 probe store (monitor/data/observations.json) adds one "recorded" row per claim for
the countries it saw restricted that no check names, with the same rule as the site (monitor/scripts/observed.py).

Per interface and claim the strongest status among passing checks wins (yes > reported > optional > tos_only > no;
for VPN block > detect). The rating is then computed with the same rule as the site (monitor/scripts/build.py):
  restrictions = every country/region blocked at site level (incl. close-only) or by a feature gate, counted once,
                 + 1 per mechanism: feature gate, wallet screening, VPN detection (detect/block), KYC,
                 + 1 for a site-level geo-block that names no countries;
                 only statuses yes / reported count, Terms-only (tos_only) reservations do not.
  rating       = A with 0, B with 1-5, C with 6-20, D above 20; n/a when nothing was established
                 (no restriction and neither the site-level geo status nor the screening status is known).

The result is compared with what the site publishes (src/data/interfaces.json, the dataset the web app is built
from): research/out/report.md lists every interface with its evidence and the differences, --csv writes the table.

Sweeps (rows without a claim) do not change the rating. They fill the coverage matrix (every check family for every
interface; empty only when there is nothing to check) and the "to review" list: a block seen from a country the site
does not count, different JavaScript served to one country, or strong restriction signals in the production
JavaScript or the repository while the site says the interface has no such mechanism.

Usage (from pi-restrict-interface/):
  python3 -I research/combine.py --csv                 # research/out/table.csv
  python3 -I research/combine.py --csv my-table.csv --scope all
"""
import argparse, csv, json, os, re, sys
from collections import OrderedDict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import common  # noqa: E402
from lib.net import now_iso  # noqa: E402

sys.path.append(os.path.join(common.PROJECT, "monitor", "scripts"))
import observed  # noqa: E402

KINDS = ("code", "bundle", "docs", "api", "live")
SITE = os.path.join(common.PROJECT, "src", "data", "interfaces.json")
CATALOG = os.path.join(common.PROJECT, "monitor", "data", "interfaces.json")
OBSERVATIONS = os.path.join(common.PROJECT, "monitor", "data", "observations.json")
RANK = {"block": 7, "detect": 6, "yes": 5, "reported": 4, "optional": 2, "tos_only": 1, "no": 0}
ENFORCED = ("yes", "reported")
STEPS = ((0, "A"), (5, "B"), (20, "C"))
CLAIMS = ("geo_site", "geo_feature", "screening", "vpn", "kyc")


def load_results():
    rows, meta = [], OrderedDict()
    for kind in KINDS:
        path = os.path.join(common.OUT_DIR, f"{kind}.json")
        if not os.path.exists(path):
            meta[kind] = "not run"
            continue
        with open(path, encoding="utf-8") as fh:
            doc = json.load(fh)
        meta[kind] = doc["generated_at"]
        rows += doc["results"]
    return rows, meta


def summarize(rows):
    """Claims of one interface from its passing checks: status, countries and the checks behind them."""
    claims = OrderedDict((c, OrderedDict(status=None, countries=[], close_only=[], checks=[])) for c in CLAIMS)
    for r in rows:
        if r["outcome"] not in ("pass", "recorded") or not r.get("claim"):
            continue  # sweeps support no claim by themselves
        name = "geo_site" if r["claim"] == "geo_site.close_only" else r["claim"]
        c = claims[name]
        if c["status"] is None or RANK[r["status"]] > RANK[c["status"]]:
            c["status"] = r["status"]
        c["checks"].append(r["check"])
        if r["status"] in ENFORCED:
            bucket = c["close_only"] if r["claim"] == "geo_site.close_only" else c["countries"]
            for t in r["countries"]:
                if t not in bucket:
                    bucket.append(t)
    return claims


def restrictions(claims):
    countries, mechanisms = set(), []
    gs, gf = claims["geo_site"], claims["geo_feature"]
    if gs["status"] in ENFORCED:
        countries |= set(gs["countries"]) | set(gs["close_only"])
        if not gs["countries"] and not gs["close_only"]:
            mechanisms.append("geo_site")
    if gf["status"] in ENFORCED:
        countries |= set(gf["countries"])
        mechanisms.append("geo_feature")
    if claims["screening"]["status"] in ENFORCED:
        mechanisms.append("screening")
    if claims["vpn"]["status"] in ("detect", "block"):
        mechanisms.append("vpn")
    if claims["kyc"]["status"] in ENFORCED:
        mechanisms.append("kyc")
    return len(countries) + len(mechanisms), sorted(countries), mechanisms


def rating(count, claims):
    if count == 0 and claims["geo_site"]["status"] is None and claims["screening"]["status"] is None:
        return "n/a"
    for limit, grade in STEPS:
        if count <= limit:
            return grade
    return "D"


def site_view(e):
    gs, gf = e["geo_site"], e["geo_feature"]
    cc = set()
    if gs["s"] in ENFORCED:
        cc |= set(gs["countries"]) | set(gs["close_only"])
    if gf["s"] in ENFORCED:
        cc |= set(gf["countries"])
    return OrderedDict(level=e["level"], count=e["restrictions"]["count"], countries=sorted(cc),
                       mechanisms=e["restrictions"]["mechanisms"])


def display_name(e):
    n = f"{e['name']} {e['version']}" if e.get("version") else e["name"]
    return f"{n} ({e['aka']})" if e.get("aka") else n


SWEEPS = OrderedDict([("sweep-bundle", "App JS"), ("sweep-live", "Live"), ("sweep-code", "Code"), ("sweep-terms", "Terms")])


def coverage(spec, sweeps, checks):
    """One cell per sweep: what was checked, or why there was nothing to check."""
    t = (spec or {}).get("targets") or {}
    applicable = {"sweep-bundle": bool(t.get("app")), "sweep-live": bool(t.get("app")),
                  "sweep-code": bool(t.get("repo")), "sweep-terms": bool(t.get("terms"))}
    nothing = {"sweep-code": "no open repository", "sweep-terms": "no Terms published"}
    cells = OrderedDict()
    for kind in SWEEPS:
        r = sweeps.get(kind)
        if not applicable[kind]:
            cells[kind] = "— " + nothing.get(kind, "nothing to check")
        elif r is None:
            cells[kind] = "not run"
        elif r["outcome"] == "pass":
            if kind == "sweep-bundle":
                cells[kind] = f"{r['scripts']} scripts" + (" (capped)" if r.get("truncated") else "")
            elif kind == "sweep-live":
                cells[kind] = " ".join(f"{v['country'] or label}:{r['observations'][label]['app']['state']}"
                                       for label, v in r["vantages"].items())
            elif kind == "sweep-code":
                cells[kind] = f"{r['files_scanned']} files"
            else:
                cells[kind] = f"{len(r['terms_countries'])} countries" + ("" if r.get("via") == "live" else f" (via {r['via']})")
        else:
            cells[kind] = f"{r['outcome']}: " + "; ".join(r.get("reasons") or [])[:90]
    api = [c for c in checks if c["type"] == "api"]
    cells["api"] = f"{len(api)} check(s)" if api else "— no public screening API known"
    return cells


def review(t, e, sweeps, spec=None):
    """Things the sweeps found that the published data does not explain: leads for a person, never automatic changes."""
    items = []
    counted = set(t["site"]["countries"]) if t["site"] else set()
    status = lambda name: ((e or {}).get(name) or {}).get("s", "unknown")
    covered = lambda cc: cc in counted or cc.split("-")[0] in counted  # US-NY is covered when US is counted
    network = ((spec or {}).get("targets") or {}).get("network_blocks") or {}
    lv = sweeps.get("sweep-live")
    if lv and lv["outcome"] == "pass":
        for label, rec in lv["observations"].items():
            cc = lv["vantages"][label]["country"]
            if label != "direct" and label in lv["vantages"]:
                cc = label  # the requested token (US-NY, CA-ON), not just the country the geo services saw
            app = rec["app"]
            if cc in network:
                continue  # a known block by the network, not by the interface (targets.network_blocks says why)
            if app["state"] == "blocked" and cc and not covered(cc):
                items.append(f"live: the app is blocked from {cc} ({app['why']}), but the site does not count {cc}"
                             + (" (check whether the interface or the network blocks it)" if "before the app" in app["why"] else ""))
            for ep, er in rec.items():
                if ep != "app" and er["state"] == "blocked" and cc and not covered(cc):
                    items.append(f"live: {ep} answers blocked to {cc} {json.dumps(er['flags'])}, but the site does not count {cc}")
        for n in lv.get("notes", []):
            if "different scripts" in n:
                items.append(f"live: {n}")
    expected = {"screening": ("screening", ("yes", "reported", "optional")), "vpn": ("vpn", ("detect", "block", "optional")),
                "kyc": ("kyc", ("yes", "reported"))}
    for kind, where in (("sweep-bundle", "production JavaScript"), ("sweep-code", "repository")):
        r = sweeps.get(kind)
        if not r or r["outcome"] != "pass":
            continue
        strong = [x for x in r["signals"] if x["strength"] == "strong"]
        for cat in sorted({x["category"] for x in strong}):
            labels = ", ".join(f"{x['signal']} ({x['examples'][0]['match']})" for x in strong if x["category"] == cat)
            if cat == "geo":
                if status("geo_site") not in ("yes", "reported", "optional") and status("geo_feature") not in ("yes", "reported", "optional"):
                    items.append(f"{where}: geo signals [{labels}], but the site says geo_site={status('geo_site')}, geo_feature={status('geo_feature')}")
            else:
                field, ok = expected[cat]
                if status(field) not in ok:
                    items.append(f"{where}: {cat} signals [{labels}], but the site says {field}={status(field)}")
    return items


def load_observed():
    """Restrictions the P3 probe saw, per interface (monitor/scripts/observed.py), or {} without a store."""
    if not os.path.exists(OBSERVATIONS):
        return {}
    with open(CATALOG, encoding="utf-8") as fh:
        catalog = json.load(fh)
    with open(OBSERVATIONS, encoding="utf-8") as fh:
        obs = json.load(fh).get("observations", [])
    return observed.found(obs, observed.targets(catalog))


def observed_rows(iid, claims, seen):
    """One "recorded" claim row per field for the countries the probe saw restricted that the checks do not name yet."""
    have = {(f, k): set(claims[f][k]) if claims[f]["status"] in ENFORCED else set() for f, k in observed.FIELDS.values()}
    out = []
    for (field, key), tokens in observed.additions(seen, have).items():
        claim = "geo_site.close_only" if key == "close_only" else field
        evidence = "; ".join(f"{t}: {o['kind']} {o['url']} → HTTP {o['http_status'] or '—'} {o['ui_state']} "
                             f"({o['proxy_type']}, {o['at'][:10]})" for t, o in ((t, seen[(field, key)][t]) for t in tokens))
        out.append(OrderedDict([
            ("interface", iid), ("check", f"{iid}/probe-{claim.replace('.', '-').replace('_', '-')}"), ("type", "probe"),
            ("claim", claim), ("status", "yes"), ("outcome", "recorded"), ("countries", tokens),
            ("about", "Live probe (monitor:probe): the newest verified observation from these countries is restricted"),
            ("source", "monitor/data/observations.json"), ("found", [OrderedDict(text=evidence)]), ("reasons", []),
        ]))
    return out


def build(scope):
    rows, meta = load_results()
    with open(SITE, encoding="utf-8") as fh:
        site = {e["id"]: e for e in json.load(fh)["interfaces"]}
    specs = {s["id"]: s for s in common.load_specs()}
    seen = load_observed()
    ids = list(site) + ([i for i in specs if i not in site] if scope == "all" else [])
    table = []
    for iid in ids:
        spec = specs.get(iid)
        current = {f"{iid}/{c['id']}" for c in (spec or {}).get("checks", [])}
        # Rows of checks that no longer exist in research/checks (left over from an older run) are ignored.
        mine = [r for r in rows if r["interface"] == iid and (not r.get("claim") or r["check"] in current)]
        planned = len((spec or {}).get("checks", []))
        not_run = planned - sum(1 for r in mine if r.get("claim"))
        checks = [r for r in mine if r.get("claim")]
        checks += observed_rows(iid, summarize(checks), seen.get(iid, {}))
        sweeps = {r["type"]: r for r in mine if not r.get("claim")}
        claims = summarize(checks)
        count, countries, mechanisms = restrictions(claims)
        lvl = rating(count, claims)
        e = site.get(iid)
        sv = site_view(e) if e else None
        tally = OrderedDict((k, sum(1 for r in checks if r["outcome"] == k)) for k in ("pass", "recorded", "fail", "error", "skip"))
        t = OrderedDict([
            ("id", iid), ("name", display_name(e) if e else specs[iid].get("name", iid)),
            ("lifecycle", e.get("lifecycle", "current") if e else ""), ("url", e["url"] if e else ""),
            ("rating", lvl), ("restrictions", count), ("countries", countries), ("mechanisms", mechanisms),
            ("claims", claims), ("checks", checks), ("tally", tally), ("not_run", not_run),
            ("site", sv), ("match", (sv is not None and sv["level"] == lvl and sv["count"] == count)),
            ("sweeps", sweeps), ("coverage", coverage(spec, sweeps, (spec or {}).get("checks", []))),
        ])
        t["review"] = review(t, e, sweeps, spec)
        st = sweeps.get("sweep-terms")
        if e and st and st["outcome"] == "pass":
            a, b = set(e["tos"].get("restricted_codes") or []), set(st["terms_countries"])
            t["terms_vs_site"] = OrderedDict(site=len(a), terms=len(b), only_terms=sorted(b - a), only_site=sorted(a - b))
        table.append(t)
    return table, meta


def write_csv(table, path):
    cols = ["id", "name", "lifecycle", "url", "rating", "restrictions", "countries_count", "countries", "mechanisms",
            "geo_site", "geo_site_countries", "close_only", "geo_feature", "geo_feature_countries", "screening", "vpn",
            "kyc", "checks_passed", "checks_recorded", "checks_failed", "checks_skipped_or_error", "checks_not_run",
            "site_rating", "site_restrictions", "matches_site", "scan_app_js", "scan_live", "scan_code", "scan_terms",
            "api_checks", "terms_countries", "needs_review"]
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    with open(path, "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh, lineterminator="\n")
        w.writerow(cols)
        for t in table:
            c = t["claims"]
            w.writerow([t["id"], t["name"], t["lifecycle"], t["url"], t["rating"], t["restrictions"], len(t["countries"]),
                        " ".join(t["countries"]), " ".join(t["mechanisms"]),
                        c["geo_site"]["status"] or "", " ".join(c["geo_site"]["countries"]), " ".join(c["geo_site"]["close_only"]),
                        c["geo_feature"]["status"] or "", " ".join(c["geo_feature"]["countries"]),
                        c["screening"]["status"] or "", c["vpn"]["status"] or "", c["kyc"]["status"] or "",
                        t["tally"]["pass"], t["tally"]["recorded"], t["tally"]["fail"], t["tally"]["error"] + t["tally"]["skip"],
                        t["not_run"], t["site"]["level"] if t["site"] else "", t["site"]["count"] if t["site"] else "",
                        ("yes" if t["match"] else "no") if t["site"] else ""] +
                       [t["coverage"][k] for k in list(SWEEPS) + ["api"]] +
                       [" ".join(t["sweeps"]["sweep-terms"]["terms_countries"]) if t["sweeps"].get("sweep-terms", {}).get("outcome") == "pass" else "",
                        " | ".join(t["review"])])


def md_link(src):
    """GitHub permalinks as owner/repo@sha:path#L, other URLs as host/path; text after the URL (" from US") is kept."""
    url, _, rest = src.partition(" ")
    if not url.startswith("http"):
        return src
    m = re.match(r"https://github\.com/([^/]+/[^/]+)/(?:blob|tree)/([0-9a-f]{7})[0-9a-f]*/?(.*)$", url)
    label = f"{m.group(1)}@{m.group(2)}:{m.group(3) or '/'}" if m else url.split("://", 1)[1]
    if len(label) > 90:
        label = label[:87] + "…"
    return f"[{label}]({url})" + (f" {rest}" if rest else "")


def sweep_detail(r, tvs):
    if not r or r["outcome"] != "pass":
        return ""
    if r["type"] in ("sweep-bundle", "sweep-code"):
        strong = [x for x in r["signals"] if x["strength"] == "strong"]
        if not strong:
            return "; no strong signals"
        return "; strong signals: " + "; ".join(
            f"{x['category']}/{x['signal']} in {x['files']} file(s), e.g. `{x['examples'][0]['match']}` in "
            f"{x['examples'][0].get('link') or x['examples'][0]['file']}" for x in strong)
    if r["type"] == "sweep-live":
        notes = r.get("notes") or []
        return ("; " + "; ".join(notes)) if notes else ""
    if r["type"] == "sweep-terms":
        cl = ", ".join(k for k, v in r["clauses"].items() if v) or "none"
        extra = ""
        if tvs and (tvs["only_terms"] or tvs["only_site"]):
            extra = f"; compared with the site's Terms column: +{' '.join(tvs['only_terms']) or '0'} / −{' '.join(tvs['only_site']) or '0'}"
        return f": {' '.join(r['terms_countries'])}; clauses: {cl}{extra}"
    return ""


def write_report(table, meta, path):
    n_site = sum(1 for t in table if t["site"])
    n_match = sum(1 for t in table if t["match"])
    out = ["# Reproduced restrictions table", "",
           f"Generated {now_iso()} by `research/combine.py` from the check results below. "
           f"Compared with the published dataset `src/data/interfaces.json`: **{n_match} of {n_site}** interfaces have the same "
           "rating and the same number of restrictions.", "",
           "Check runs: " + ", ".join(f"{k} — {v}" for k, v in meta.items()), "",
           "Rating: number of restrictions (each blocked country/region once + 1 per feature gate, wallet screening, VPN "
           "detection, KYC; Terms-only reservations do not count). A = 0, B = 1–5, C = 6–20, D > 20, n/a = nothing established.",
           "", "| Interface | Rating | Restrictions | Site | Match | Checks (pass/recorded/fail/other) |", "|---|---|---|---|---|---|"]
    for t in table:
        s = t["site"]
        tl = t["tally"]
        out.append(f"| [{t['name']}](#{t['id']}) | **{t['rating']}** | {t['restrictions']} | "
                   f"{(s['level'] + ' / ' + str(s['count'])) if s else '—'} | {'yes' if t['match'] else ('**no**' if s else '—')} | "
                   f"{tl['pass']}/{tl['recorded']}/{tl['fail']}/{tl['error'] + tl['skip'] + t['not_run']} |")
    n_rev = sum(1 for t in table if t["review"])
    out += ["", "## Coverage: every check family for every interface", "",
            "A cell is empty only when there is nothing to check (no open repository, no published Terms, no public "
            "screening API). Live: the app's state from this machine and from each verified proxy country.", "",
            f"Interfaces with items to review (sweep findings the published data does not explain): **{n_rev}**.", "",
            "| Interface | App JS | Live | Code | Terms | API | Claim checks | Review |", "|---|---|---|---|---|---|---|---|"]
    for t in table:
        c = t["coverage"]
        out.append(f"| [{t['name']}](#{t['id']}) | {c['sweep-bundle']} | {c['sweep-live']} | {c['sweep-code']} | "
                   f"{c['sweep-terms']} | {c['api']} | {len(t['checks'])} | {len(t['review']) or ''} |".replace("|  |", "| |"))
    for t in table:
        out += ["", f"## {t['name']}", f"<a id=\"{t['id']}\"></a>", "",
                f"Rating **{t['rating']}**, restrictions **{t['restrictions']}**"
                + (f" ({len(t['countries'])} countries/regions: {' '.join(t['countries'])})" if t["countries"] else "")
                + (f"; mechanisms: {', '.join(t['mechanisms'])}" if t["mechanisms"] else "") + "."]
        s = t["site"]
        if s and not t["match"]:
            plus = sorted(set(t["countries"]) - set(s["countries"]))
            minus = sorted(set(s["countries"]) - set(t["countries"]))
            mplus = sorted(set(t["mechanisms"]) - set(s["mechanisms"]))
            mminus = sorted(set(s["mechanisms"]) - set(t["mechanisms"]))
            diff = [f"site says {s['level']} / {s['count']}"]
            if plus:
                diff.append("countries only in the checks: " + " ".join(plus))
            if minus:
                diff.append("countries on the site without a passing check: " + " ".join(minus))
            if mplus:
                diff.append("mechanisms only in the checks: " + ", ".join(mplus))
            if mminus:
                diff.append("mechanisms on the site without a passing check: " + ", ".join(mminus))
            out.append("")
            out.append("**Differs from the site:** " + "; ".join(diff) + ".")
        if t["review"]:
            out += ["", "**To review** (found by the sweeps, not explained by the published data):", ""]
            out += [f"- {x}" for x in t["review"]]
        out += ["", "Sweeps:", ""]
        for kind, label in SWEEPS.items():
            out.append(f"- {label}: {t['coverage'][kind]}" + sweep_detail(t["sweeps"].get(kind), t.get("terms_vs_site")))
        out.append(f"- API: {t['coverage']['api']}")
        if not t["checks"]:
            out += ["", "No claim checks: the site establishes nothing for this interface that a check could confirm."]
            continue
        out += ["", "| Outcome | Claim | What the check shows | Source | Matched |", "|---|---|---|---|---|"]
        for r in t["checks"]:
            found = (r.get("found") or [{}])[0].get("text", "") if r.get("found") else "; ".join(r.get("reasons") or [])
            cc = f" → {len(r['countries'])}: {' '.join(r['countries'])}" if r["countries"] else ""
            link = md_link(r["source"])
            out.append(f"| {r['outcome']} | {r['claim']}={r['status']}{cc} | {r['about']} | {link} | "
                       f"{found[:200].replace('|', '/').replace(chr(10), ' ')} |")
    with open(path, "w", encoding="utf-8") as fh:
        fh.write("\n".join(out) + "\n")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--csv", nargs="?", const=os.path.join(common.OUT_DIR, "table.csv"),
                    help="write the table as CSV (default path research/out/table.csv)")
    ap.add_argument("--scope", choices=("site", "all"), default="site",
                    help="site: the interfaces published on the site (default); all: also those only in research/checks")
    args = ap.parse_args()
    table, meta = build(args.scope)
    os.makedirs(common.OUT_DIR, exist_ok=True)
    print(f"{'interface':24s} {'rating':6s} {'n':>3s}   {'site':8s} match  checks p/r/f/other")
    for t in table:
        s = t["site"]
        tl = t["tally"]
        print(f"{t['id']:24s} {t['rating']:6s} {t['restrictions']:3d}   {(s['level'] + ' ' + str(s['count'])) if s else '—':8s} "
              f"{'yes' if t['match'] else ('NO ' if s else '—  ')}    {tl['pass']}/{tl['recorded']}/{tl['fail']}/"
              f"{tl['error'] + tl['skip'] + t['not_run']}")
    report = os.path.join(common.OUT_DIR, "report.md")
    write_report(table, meta, report)
    n_site = sum(1 for t in table if t["site"])
    print(f"\nsame rating and count as the site: {sum(1 for t in table if t['match'])} of {n_site}")
    rev = [t for t in table if t["review"]]
    print(f"interfaces with sweep findings to review: {len(rev)}")
    for t in rev:
        for x in t["review"]:
            print(f"  {t['id']}: {x[:200]}")
    print(f"report: {os.path.relpath(report, common.PROJECT)}")
    if args.csv:
        write_csv(table, args.csv)
        print(f"csv:    {os.path.relpath(os.path.abspath(args.csv), common.PROJECT)}")


if __name__ == "__main__":
    main()
