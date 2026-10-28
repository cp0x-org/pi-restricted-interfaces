#!/usr/bin/env python3
"""Publish a new version of the data: run every check, carry source changes into the catalog, rebuild the site
dataset and keep the history of versions.

  1. checks    research/run_all.py: every claim check against its source and every sweep over every interface (apps'
               JavaScript, answers from several countries, open repositories, Terms); pages and APIs are fetched fresh,
               files at pinned commits and Wayback snapshots come from the cache because they cannot change
  2. sync      country lists whose list checks all passed are written into monitor/data/interfaces.json
               (added and removed countries are listed in CHANGES.md). A failed, erroring or skipped check never
               changes the catalog: it is listed under "needs review" instead, as is a counted claim without a check.
  3. build     the monitor:build command from package.json with meta.generated = scan date: regenerates
               the site files in src/data/ (what the site shows) and monitor/out/*
  4. compare   research/combine.py: the table rebuilt from the checks, compared with the new site dataset
  5. versions  monitor/current/ (the version the site shows) moves to monitor/archive/<scanned>_<archived>/ and the
               new run is written to monitor/current/: VERSION.json, CHANGES.md, table.csv, report.md, the check
               results, the evidence, the check definitions and a copy of the catalog
  6. publish   monitor/scripts/publish.py: the site files go to dataset/current/, the previous ones to dataset/archive/

Usage (from pi-restrict-interface/):
  python3 -I monitor/scripts/update.py              # pnpm monitor:update
  python3 -I monitor/scripts/update.py --dry-run    # run the checks, print what would change, write nothing
  python3 -I monitor/scripts/update.py --no-sync    # record a version without touching monitor/data/interfaces.json
  python3 -I monitor/scripts/update.py --reuse      # reuse research/out from the last run instead of checking again
Afterwards: read monitor/current/CHANGES.md, run `pnpm build`, commit monitor/, research/checks/, src/data/ and dataset/.
"""
import argparse, csv, json, os, shlex, shutil, subprocess, sys
from collections import OrderedDict
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
MONITOR = os.path.dirname(HERE)
PROJECT = os.path.dirname(MONITOR)
RESEARCH = os.path.join(PROJECT, "research")
sys.path.insert(0, RESEARCH)
import combine  # noqa: E402
from lib import common  # noqa: E402

DATA = os.path.join(MONITOR, "data", "interfaces.json")
CURRENT = os.path.join(MONITOR, "current")
ARCHIVE = os.path.join(MONITOR, "archive")
ENFORCED = ("yes", "reported")
PASSED = ("pass", "recorded")


def rel(path):
    return os.path.relpath(path, PROJECT)


def call(cmd):
    shown = ["python3" if c == sys.executable else (rel(c) if os.path.isabs(c) else c) for c in cmd]
    print("$ " + " ".join(shown), flush=True)
    return subprocess.call(cmd, cwd=PROJECT)


def build_command():
    """The monitor:build command from package.json, so that the site is built exactly as `pnpm monitor:build` does."""
    with open(os.path.join(PROJECT, "package.json"), encoding="utf-8") as fh:
        args = shlex.split(json.load(fh)["scripts"]["monitor:build"])
    return [sys.executable if a == "python3" else a for a in args]


def load_json(path):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh, object_pairs_hook=OrderedDict)


def dump_json(obj, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(json.dumps(obj, ensure_ascii=False, indent=2) + "\n")


# ----------------------------------------------------------------------------- sync
def plan_sync(catalog, rows, specs):
    """What the checks say should change in the catalog. Returns (changes, review).
    Only country lists are synced, and only when every list check of that claim passed."""
    entries = {e["id"]: e for e in catalog["interfaces"]}
    by_check = {r["check"]: r for r in rows}
    changes, review = [], []
    for iid, spec in specs.items():
        e = entries.get(iid)
        if e is None:
            review.append(f"{iid}: research/checks/{iid}.json exists but the interface is not in the catalog")
            continue
        for c in spec["checks"]:
            r = by_check.get(f"{iid}/{c['id']}")
            if r is None:
                review.append(f"{iid}/{c['id']}: not run")
            elif r["outcome"] not in PASSED:
                why = "; ".join(r.get("reasons") or []) or r["outcome"]
                review.append(f"{iid}/{c['id']} ({c['claim']}={c['status']}): {r['outcome']} — {why[:240]}")
        for field, claims in (("geo_site", ("geo_site", "geo_site.close_only")), ("geo_feature", ("geo_feature",))):
            if e[field]["s"] not in ENFORCED:
                continue
            lists = [c for c in spec["checks"] if c["claim"] in claims and c.get("countries") and c["status"] in ENFORCED]
            outcomes = [by_check.get(f"{iid}/{c['id']}") for c in lists]
            if not lists or any(o is None or o["outcome"] not in PASSED for o in outcomes):
                continue  # nothing to read the list from, or a list check did not pass (already under review)
            close, main = [], []
            for c, o in zip(lists, outcomes):
                bucket = close if c["claim"] == "geo_site.close_only" else main
                bucket += [t for t in o["countries"] if t not in bucket]
            main = [t for t in main if t not in close]
            targets = [("countries", main)]
            if any(c["claim"] == "geo_site.close_only" for c in lists):
                targets.append(("close_only", close))
            elif field == "geo_site" and e[field]["close_only"]:
                review.append(f"{iid}: geo_site.close_only {' '.join(e[field]['close_only'])} has no check")
            for key, new in targets:
                old = e[field][key]
                if set(old) != set(new):
                    value = [t for t in old if t in new] + [t for t in new if t not in old]
                    changes.append(OrderedDict([("interface", iid), ("field", f"{field}.{key}"),
                                                ("added", [t for t in new if t not in old]),
                                                ("removed", [t for t in old if t not in new]), ("value", value)]))
        current = {f"{iid}/{c['id']}" for c in spec["checks"]}
        claims = combine.summarize([r for r in rows if r["interface"] == iid and r["check"] in current])
        for name in ("geo_site", "geo_feature", "screening", "kyc"):
            site_s = (e.get(name) or {}).get("s")
            if site_s in ENFORCED and claims[name]["status"] not in ENFORCED:
                review.append(f"{iid}: {name}={site_s} is counted on the site, but no check supports it")
            elif claims[name]["status"] in ENFORCED and site_s not in ENFORCED:
                review.append(f"{iid}: checks confirm {name}={claims[name]['status']} ({', '.join(claims[name]['checks'])}), "
                              f"but the site says {name}={site_s or 'nothing'}: update monitor/data/interfaces.json")
        if e["vpn"]["s"] in ("detect", "block") and claims["vpn"]["status"] not in ("detect", "block"):
            review.append(f"{iid}: vpn={e['vpn']['s']} is counted on the site, but no check supports it")
    return changes, review


def apply_sync(catalog, changes):
    entries = {e["id"]: e for e in catalog["interfaces"]}
    for ch in changes:
        field, key = ch["field"].split(".")
        entries[ch["interface"]][field][key] = ch["value"]


# ----------------------------------------------------------------------------- versions
def read_table(path):
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as fh:
        return {r["id"]: r for r in csv.DictReader(fh)}


def read_results(folder):
    out = {}
    for kind in combine.KINDS:
        path = os.path.join(folder, f"{kind}.json")
        if os.path.exists(path):
            for r in load_json(path)["results"]:
                out[r["check"]] = r
    return out


def table_diff(old, new):
    rows = []
    for iid in list(new) + [i for i in old if i not in new]:
        a, b = old.get(iid), new.get(iid)
        if a is None or b is None:
            rows.append((iid, f"{a['rating']} / {a['restrictions']}" if a else "—", f"{b['rating']} / {b['restrictions']}" if b else "—", "", ""))
            continue
        ca, cb = set(a["countries"].split()), set(b["countries"].split())
        ma, mb = set(a["mechanisms"].split()), set(b["mechanisms"].split())
        if (a["rating"], a["restrictions"]) != (b["rating"], b["restrictions"]) or ca != cb or ma != mb:
            cc = " ".join(["+" + t for t in sorted(cb - ca)] + ["−" + t for t in sorted(ca - cb)])
            mm = " ".join(["+" + t for t in sorted(mb - ma)] + ["−" + t for t in sorted(ma - mb)])
            rows.append((iid, f"{a['rating']} / {a['restrictions']}", f"{b['rating']} / {b['restrictions']}", cc, mm))
    return rows


def sweep_signature(r):
    """What a sweep found, as a comparable set of short strings."""
    if r["outcome"] != "pass":
        return {f"{r['outcome']}"}
    if r["type"] == "sweep-live":
        return {f"{v['country'] or label}:{r['observations'][label]['app']['state']}" for label, v in r["vantages"].items()} | \
               {f"{v['country'] or label}:{ep.split('/')[-1]}={er['state']}" for label, v in r["vantages"].items()
                for ep, er in r["observations"][label].items() if ep != "app"}
    if r["type"] in ("sweep-bundle", "sweep-code"):
        return {f"{x['category']}/{x['signal']}" for x in r["signals"] if x["strength"] == "strong"}
    if r["type"] == "sweep-terms":
        return set(r["terms_countries"])
    return set()


def checks_diff(old, new):
    rows = []
    for cid in list(new) + [c for c in old if c not in new]:
        a, b = old.get(cid), new.get(cid)
        if (a or b) and not (a or b).get("claim"):
            if a is None or b is None:
                rows.append((cid, "—" if a is None else "ran", "—" if b is None else "ran", ""))
                continue
            sa, sb = sweep_signature(a), sweep_signature(b)
            if sa != sb:
                rows.append((cid, a["outcome"], b["outcome"], " ".join(["+" + t for t in sorted(sb - sa)] + ["−" + t for t in sorted(sa - sb)])))
            continue
        if a is None or b is None:
            rows.append((cid, a["outcome"] if a else "new", b["outcome"] if b else "removed", ""))
            continue
        ca, cb = set(a["countries"]), set(b["countries"])
        if a["outcome"] != b["outcome"] or ca != cb:
            cc = " ".join(["+" + t for t in sorted(cb - ca)] + ["−" + t for t in sorted(ca - cb)])
            rows.append((cid, a["outcome"], b["outcome"], cc))
    return rows


def changes_md(version, previous, tdiff, cdiff, sync, review, synced, findings=(), unchecked=()):
    out = [f"# Changes in version {version}", ""]
    if previous:
        out.append(f"Compared with the previous version `{previous['version']}` (now in `{previous['path']}`).")
    else:
        out.append("First version with checks: nothing to compare with.")
    out += ["", "## Rating and restriction count", ""]
    if not previous:
        out.append("—")
    elif tdiff:
        out += ["| Interface | Before | After | Countries | Mechanisms |", "|---|---|---|---|---|"]
        out += [f"| {r[0]} | {r[1]} | {r[2]} | {r[3]} | {r[4]} |" for r in tdiff]
    else:
        out.append("No changes.")
    out += ["", "## Country lists copied from the sources into the catalog", ""]
    if sync:
        verb = "written to monitor/data/interfaces.json" if synced else "not written (--no-sync)"
        out += [f"- `{c['interface']}` {c['field']}: " + " ".join(["+" + t for t in c["added"]] + ["−" + t for t in c["removed"]]) + f" ({verb})"
                for c in sync]
    else:
        out.append("Nothing: the catalog already matches the sources.")
    out += ["", "## Checks whose result changed", ""]
    if not previous:
        out.append("—")
    elif cdiff:
        out += ["| Check | Before | After | Countries |", "|---|---|---|---|"]
        out += [f"| {r[0]} | {r[1]} | {r[2]} | {r[3]} |" for r in cdiff]
    else:
        out.append("No changes.")
    out += ["", "## Needs manual review", ""]
    out += [f"- {x}" for x in review] if review else ["Nothing."]
    out += ["", "## Found by the sweeps but not explained by the site's data", "",
            "Every interface is swept: the site's JavaScript, its answers from different countries, the code of open repositories, "
            "the Terms. These are leads for a researcher, not verdicts: they do not change the catalog.", ""]
    out += [f"- {x}" for x in findings] if findings else ["Nothing."]
    out += ["", "## Could not be checked", "", "The source exists, but the scripts could not read it (anti-bot, PDF, server error).", ""]
    out += [f"- {x}" for x in unchecked] if unchecked else ["Nothing."]
    return "\n".join(out) + "\n"


def archive_name(previous_version, today):
    base = f"{previous_version}_{today}"
    name, n = base, 2
    while os.path.exists(os.path.join(ARCHIVE, name)):
        name, n = f"{base}-{n}", n + 1
    return name


def git(*args):
    try:
        return subprocess.run(["git", *args], cwd=PROJECT, capture_output=True, text=True, timeout=30).stdout.strip() or None
    except Exception:  # noqa: BLE001 - git is optional
        return None


def write_version(version, scanned_at, table, meta, sync, review, synced, previous):
    os.makedirs(CURRENT)
    out = common.OUT_DIR
    shutil.copy(os.path.join(out, "table.csv"), os.path.join(CURRENT, "table.csv"))
    shutil.copy(os.path.join(out, "report.md"), os.path.join(CURRENT, "report.md"))
    os.makedirs(os.path.join(CURRENT, "results"))
    for kind in combine.KINDS:
        src = os.path.join(out, f"{kind}.json")
        if os.path.exists(src):
            shutil.copy(src, os.path.join(CURRENT, "results", f"{kind}.json"))
    if os.path.isdir(os.path.join(out, "evidence")):
        shutil.copytree(os.path.join(out, "evidence"), os.path.join(CURRENT, "evidence"))
    shutil.copytree(common.CHECKS_DIR, os.path.join(CURRENT, "checks"))
    os.makedirs(os.path.join(CURRENT, "catalog"))
    for src in (DATA, os.path.join(MONITOR, "data", "observations.json"), os.path.join(MONITOR, "out", "report.md"),
                os.path.join(MONITOR, "out", "interfaces.csv")):
        shutil.copy(src, os.path.join(CURRENT, "catalog", os.path.basename(src)))
    results = read_results(os.path.join(CURRENT, "results"))
    tally = OrderedDict()
    for r in results.values():
        tally.setdefault(r["type"], OrderedDict())
        tally[r["type"]][r["outcome"]] = tally[r["type"]].get(r["outcome"], 0) + 1
    on_site = [t for t in table if t["site"]]
    info = OrderedDict([
        ("version", version), ("scanned_at", scanned_at), ("archived_at", None),
        ("previous", previous["path"] if previous else None),
        ("site_interfaces", len(on_site)), ("reproduced", sum(1 for t in on_site if t["match"])),
        ("checks", tally), ("check_runs", meta), ("catalog_changes", len(sync) if synced else 0), ("needs_review", len(review)),
        ("sweep_findings", sum(len(t["review"]) for t in table)),
        ("not_checked", sum(1 for t in table for v in t["coverage"].values() if v.startswith(("error", "skip", "not run")))),
        ("git_head_before", git("rev-parse", "--short", "HEAD")),
        ("made_by", "monitor/scripts/update.py"),
        ("files", OrderedDict([
            ("CHANGES.md", "what changed since the previous version and what needs review"),
            ("table.csv", "the table rebuilt from the checks (rating, restrictions, countries, statuses, comparison with the site)"),
            ("report.md", "the same per interface with every check, its source and the matched text"),
            ("results/", "raw results of check_code / check_bundle / check_docs / check_api / check_live"),
            ("evidence/", "what each check saw: code lines, page text, API responses, proxy vantage"),
            ("checks/", "the check definitions used for this version (copy of research/checks/)"),
            ("catalog/", "monitor/data/interfaces.json and observations.json, monitor/out/report.md and interfaces.csv of this version"),
        ])),
    ])
    dump_json(info, os.path.join(CURRENT, "VERSION.json"))
    return info


# ----------------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dry-run", action="store_true", help="run the checks and print what would change; write nothing")
    ap.add_argument("--no-sync", action="store_true", help="do not write country lists into monitor/data/interfaces.json")
    ap.add_argument("--reuse", action="store_true", help="use research/out from the last run instead of running the checks")
    args = ap.parse_args()

    scanned_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    version = scanned_at[:10]
    if not args.reuse:
        rc = call([sys.executable, "-I", os.path.join(RESEARCH, "run_all.py"), "--refresh"])
        if rc:
            sys.exit(f"checks failed to run (exit {rc})")

    rows, meta = combine.load_results()
    specs = {s["id"]: s for s in common.load_specs()}
    catalog = load_json(DATA)
    sync, review = plan_sync(catalog, rows, specs)
    previous = None
    if os.path.exists(os.path.join(CURRENT, "VERSION.json")):
        previous = OrderedDict(version=load_json(os.path.join(CURRENT, "VERSION.json"))["version"])
    elif os.path.exists(CURRENT):
        sys.exit(f"{rel(CURRENT)} exists but has no VERSION.json; move it away first")

    print(f"\n=== sync: {len(sync)} country-list change(s), {len(review)} item(s) need review")
    for c in sync:
        print(f"  {c['interface']} {c['field']}: " + " ".join(["+" + t for t in c["added"]] + ["-" + t for t in c["removed"]]))
    for x in review:
        print(f"  review: {x}")

    if args.dry_run:
        table, _ = combine.build("site")
        new = {t["id"]: {"rating": t["rating"], "restrictions": str(t["restrictions"]), "countries": " ".join(t["countries"]),
                         "mechanisms": " ".join(t["mechanisms"])} for t in table}
        if previous:
            diff = table_diff(read_table(os.path.join(CURRENT, "table.csv")), new)
            print(f"\n=== compared with version {previous['version']}: {len(diff)} interface(s) would change")
            for r in diff:
                print(f"  {r[0]}: {r[1]} -> {r[2]}  {r[3]}  {r[4]}")
        else:
            print(f"\n=== no version yet: the first one would hold {len(new)} interfaces")
        print("\ndry run: nothing written")
        return

    synced = bool(sync) and not args.no_sync
    if synced:
        apply_sync(catalog, sync)
    catalog["meta"]["generated"] = version
    dump_json(catalog, DATA)
    print("\n=== build")
    if call(build_command()):
        sys.exit("monitor:build failed; monitor/data/interfaces.json is updated, nothing else was versioned")

    print("\n=== compare")
    table, meta = combine.build("site")
    combine.write_report(table, meta, os.path.join(common.OUT_DIR, "report.md"))
    combine.write_csv(table, os.path.join(common.OUT_DIR, "table.csv"))
    on_site = [t for t in table if t["site"]]
    print(f"same rating and count as the site: {sum(1 for t in on_site if t['match'])} of {len(on_site)}")

    old_table, old_results = {}, {}
    if previous:
        name = archive_name(previous["version"], version)
        dest = os.path.join(ARCHIVE, name)
        os.makedirs(ARCHIVE, exist_ok=True)
        shutil.move(CURRENT, dest)
        vpath = os.path.join(dest, "VERSION.json")
        info = load_json(vpath)
        info["archived_at"] = scanned_at
        dump_json(info, vpath)
        previous["path"] = rel(dest)
        old_table = read_table(os.path.join(dest, "table.csv"))
        old_results = read_results(os.path.join(dest, "results"))
        print(f"\n=== previous version {previous['version']} moved to {previous['path']}")

    info = write_version(version, scanned_at, table, meta, sync, review, synced, previous)
    new_table = read_table(os.path.join(CURRENT, "table.csv"))
    new_results = read_results(os.path.join(CURRENT, "results"))
    findings = [f"{t['id']}: {x}" for t in table for x in t["review"]]
    unchecked = [f"{t['id']}: {combine.SWEEPS.get(k, k)}: {v}" for t in table for k, v in t["coverage"].items()
                 if v.startswith(("error", "skip", "not run"))]
    md = changes_md(version, previous, table_diff(old_table, new_table) if previous else [],
                    checks_diff(old_results, new_results) if previous else [], sync, review, synced, findings, unchecked)
    with open(os.path.join(CURRENT, "CHANGES.md"), "w", encoding="utf-8") as fh:
        fh.write(md)
    print(f"=== version {version} written to {rel(CURRENT)}: {info['reproduced']} of {info['site_interfaces']} reproduced, "
          f"{info['catalog_changes']} catalog change(s), {info['needs_review']} item(s) need review, "
          f"{info['sweep_findings']} sweep finding(s), {info['not_checked']} source(s) not checkable")

    print("\n=== publish")
    if call([sys.executable, "-I", os.path.join(HERE, "publish.py")]):
        sys.exit("publish failed; run `pnpm monitor:publish` after fixing it")
    print("next: read monitor/current/CHANGES.md, then `pnpm build` and commit monitor/, research/checks/, src/data/ and dataset/")


if __name__ == "__main__":
    main()
