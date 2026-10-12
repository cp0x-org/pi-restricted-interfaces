#!/usr/bin/env python3
"""Compare the files the site loads (src/data/monitor.json, src/data/interfaces/<id>.json) with the collected data
(monitor/data/interfaces.json and monitor/data/observations.json), so that a wrong export never reaches the site.

The numbers are recomputed here from the collected data with the published rule written out (not by calling the
exporter): restrictions = every country or region blocked at site level (incl. close-only) or by a feature gate, once,
+ 1 per mechanism (feature gate, wallet screening, VPN detection, KYC) + 1 for a site geo-block without a country list;
rating A = 0, B <= 5, C <= 20, D above, n/a when nothing was established. Countries the probe saw restricted are added the
way the build adds them (monitor/scripts/observed.py). Then, per interface: the rating, the count, the three country
lists, the per-country probe verdicts of the dashboard and the number of observations on the page must match; the set
of interfaces on the site must be the catalog minus defunct ones (and minus other chains when --chains is given); the
totals (interfaces, restrictions, rating histogram, distinct restricted countries) must match.

Usage (from pi-restrict-interface/):
  python3 -I monitor/scripts/check_export.py monitor/data/interfaces.json monitor/data/observations.json src/data --chains evm
Prints one line per interface and the totals; exits 1 on any mismatch. Stdlib only.
"""
import argparse, glob, json, os, sys
from collections import Counter, OrderedDict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build, export, observed  # noqa: E402

ENFORCED = ("yes", "reported")


def expected_count(i):
    """The rating formula, written out: (countries, mechanisms)."""
    gs, gf = i["geo_site"], i["geo_feature"]
    countries, mechanisms = set(), []
    if gs["s"] in ENFORCED:
        countries |= set(gs["countries"]) | set(gs["close_only"])
        if not gs["countries"] and not gs["close_only"]:
            mechanisms.append("geo_site")
    if gf["s"] in ENFORCED:
        countries |= set(gf["countries"])
        mechanisms.append("geo_feature")
    if i["screening"]["s"] in ENFORCED:
        mechanisms.append("screening")
    if i["vpn"]["s"] in ("detect", "block"):
        mechanisms.append("vpn")
    if (i.get("kyc") or {}).get("s") in ENFORCED:
        mechanisms.append("kyc")
    return countries, mechanisms


def expected_level(count, i):
    if count == 0 and i["geo_site"]["s"] == "unknown" and i["screening"]["s"] == "unknown":
        return "n/a"
    return "A" if count == 0 else "B" if count <= 5 else "C" if count <= 20 else "D"


def on_site(i, chains):
    if i.get("lifecycle", "current") == "defunct":
        return False
    return not chains or bool(set(build.chain_tags(i)) & chains) or ("evm" in chains and bool(i["networks"]))


def check(catalog_path, observations_path, outdir, chains=None, quiet=False):
    """Returns the list of mismatches (empty when the export matches the collected data)."""
    data, observations, _, _ = build.load_collected(catalog_path, observations_path)
    latest = build.latest_observations(observations, build.probe_targets(data))
    with open(os.path.join(outdir, "monitor.json"), encoding="utf-8") as fh:
        monitor = json.load(fh, object_pairs_hook=OrderedDict)
    rows = OrderedDict((r["id"], r) for r in monitor["interfaces"])
    details = {}
    for path in glob.glob(os.path.join(outdir, "interfaces", "*.json")):
        with open(path, encoding="utf-8") as fh:
            details[os.path.basename(path)[:-5]] = json.load(fh, object_pairs_hook=OrderedDict)

    problems = []
    expected_ids = [i["id"] for i in data["interfaces"] if on_site(i, chains)]
    if list(rows) != expected_ids:
        problems.append(f"monitor.json lists {len(rows)} interfaces, the catalog selects {len(expected_ids)}: "
                        f"missing {sorted(set(expected_ids) - set(rows))}, extra {sorted(set(rows) - set(expected_ids))}")
    if set(details) != set(expected_ids):
        problems.append(f"interfaces/: missing {sorted(set(expected_ids) - set(details))}, stale {sorted(set(details) - set(expected_ids))}")
    if monitor["meta"].get("generated") != data["meta"].get("generated"):
        problems.append(f"meta.generated: site {monitor['meta'].get('generated')!r}, catalog {data['meta'].get('generated')!r}")
    if monitor["meta"].get("schema_version") != export.SITE_SCHEMA:
        problems.append(f"meta.schema_version: site {monitor['meta'].get('schema_version')!r}, expected {export.SITE_SCHEMA}")

    lines = []
    totals = Counter()
    all_countries, site_countries = set(), set()
    for i in data["interfaces"]:
        iid = i["id"]
        if iid not in rows or iid not in details:
            continue
        r, d = rows[iid], details[iid]
        countries, mechanisms = expected_count(i)
        count = len(countries) + len(mechanisms)
        lvl = expected_level(count, i)
        mine = []
        if r["level"] != lvl or d["level"] != lvl:
            mine.append(f"rating site {r['level']}/{d['level']} vs {lvl}")
        if r["restrictions"]["count"] != count or d["restrictions"]["count"] != count:
            mine.append(f"restrictions site {r['restrictions']['count']}/{d['restrictions']['count']} vs {count}")
        if r["restrictions"]["mechanisms"] != mechanisms:
            mine.append(f"mechanisms site {r['restrictions']['mechanisms']} vs {mechanisms}")
        for field, key in (("geo_site", "countries"), ("geo_site", "close_only"), ("geo_feature", "countries")):
            want = i[field][key]
            if r[field][key] != want or d[field][key] != want:
                mine.append(f"{field}.{key} site {r[field][key]} vs {want}")
            if r[field]["s"] != i[field]["s"]:
                mine.append(f"{field}.s site {r[field]['s']} vs {i[field]['s']}")
        obs = latest.get(iid, [])
        want_observed = export.pick_observed(obs)
        if r["observed"] != want_observed:
            diff = [(a.get("country"), a.get("ui_state"), b.get("country"), b.get("ui_state"))
                    for a, b in zip(r["observed"], want_observed) if a != b]
            mine.append(f"observed {len(r['observed'])} vs {len(want_observed)} country verdicts" + (f", first difference {diff[0]}" if diff else ""))
        if len(d["observations"]) != len(obs):
            mine.append(f"observations on the page {len(d['observations'])} vs {len(obs)}")
        totals["interfaces"] += 1
        totals["restrictions"] += count
        totals["rating " + lvl] += 1
        all_countries |= countries
        rc, rf = r["geo_site"], r["geo_feature"]
        site_countries |= (set(rc["countries"]) | set(rc["close_only"])) if rc["s"] in ENFORCED else set()
        site_countries |= set(rf["countries"]) if rf["s"] in ENFORCED else set()
        seen = Counter(o["ui_state"] for o in r["observed"])
        lines.append(f"{'ok ' if not mine else 'BAD'} {iid:16s} {lvl:3s} {count:3d}  countries {len(countries):2d}  "
                     f"observed {len(r['observed']):2d} ({', '.join(f'{k} {v}' for k, v in sorted(seen.items())) or '—'})"
                     + ("" if not mine else "  <- " + "; ".join(mine)))
        problems += [f"{iid}: {m}" for m in mine]

    site_sum = sum(r["restrictions"]["count"] for r in rows.values())
    site_levels = Counter("rating " + r["level"] for r in rows.values())
    if site_sum != totals["restrictions"]:
        problems.append(f"sum of restrictions: site {site_sum} vs {totals['restrictions']}")
    if site_countries != all_countries:
        problems.append(f"distinct restricted countries: site {len(site_countries)} vs {len(all_countries)}")
    if not quiet:
        print("\n".join(lines))
        hist = ", ".join(f"{k[7:]} {v}" for k, v in sorted(totals.items()) if k.startswith("rating "))
        print(f"\ntotals: {totals['interfaces']} interfaces on the site, {totals['restrictions']} restrictions (site {site_sum}), "
              f"ratings {hist} (site {', '.join(f'{k[7:]} {v}' for k, v in sorted(site_levels.items()))}), "
              f"{len(all_countries)} distinct restricted countries (site {len(site_countries)})")
        print("export check: " + ("OK, the site files match the collected data" if not problems else f"{len(problems)} mismatch(es)"))
        for p in problems:
            print("  ! " + p)
    return problems


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("catalog", help="monitor/data/interfaces.json")
    ap.add_argument("observations", help="monitor/data/observations.json")
    ap.add_argument("outdir", help="src/data")
    ap.add_argument("--chains", help="the same --chains the export was made with, e.g. evm")
    args = ap.parse_args()
    chains = set(args.chains.split(",")) if args.chains else None
    if check(args.catalog, args.observations, args.outdir, chains):
        sys.exit(1)


if __name__ == "__main__":
    main()
