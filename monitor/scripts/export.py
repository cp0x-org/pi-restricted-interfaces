#!/usr/bin/env python3
"""Write the files the web app loads, from the collected data (the catalog and the probe store).

The site never loads the collected files themselves. It gets:
  <outdir>/monitor.json            the dashboard: meta + one row per interface with only the fields the monitor table,
                                   the country filter and the summary page show (statuses, country lists, rating, the
                                   restriction count, and per country the one probe observation the verdict relies on)
  <outdir>/interfaces/<id>.json    one file per interface for its own page: the whole catalog entry, the computed
                                   fields and every latest verified probe observation (loaded only when the page opens)

Usage (from pi-restrict-interface/):
  python3 -I monitor/scripts/export.py monitor/data/interfaces.json monitor/data/observations.json src/data --chains evm
`pnpm monitor:build` runs this after the report and the CSV, then `check_export.py` compares the written files with
the collected data. Stdlib only; deterministic (no timestamps).
"""
import argparse, glob, json, os, sys
from collections import OrderedDict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build, observed  # noqa: E402

# One monitor.json shape; bumped when the fields change (src/utils/restrictions.ts checks it).
SITE_SCHEMA = 3
# Vantages in order of trust: a home connection first; datacenter and Tor exits test VPN detection, not geography.
PROXY_PREFERENCE = ("residential", "isp", "mobile", "direct", "datacenter", "tor")
RESTRICTIVE = ("blocked", "close_only", "feature_limited")
# Row fields copied from the entry as they are.
ROW_FIELDS = ("id", "name", "version", "aka", "family", "lifecycle", "lifecycle_note", "category", "category_group", "networks",
              "url", "referral_url", "frontend_repo", "repo_state", "level", "restrictions", "alternatives")


def site_entries(data, observations, chains=None):
    """Full entries for the site: the catalog entries selected for the site plus the computed fields and the latest verified
    observations. With chains (e.g. {"evm"}) only interfaces carrying one of those chain tags are kept, plus, for "evm", apps
    on their own chain whose networks[] lists EVM networks; defunct interfaces never reach the site."""
    by_iface = build.latest_observations(observations, build.probe_targets(data))
    items = []
    for i in data["interfaces"]:
        if chains and not (set(build.chain_tags(i)) & chains) and not ("evm" in chains and i["networks"]):
            continue
        if build.lifecycle(i) == "defunct":
            continue
        e = OrderedDict(i)
        e["lifecycle"] = build.lifecycle(i)
        e["level"] = build.level(i)
        e["restrictions"] = build.restrictions(i)
        e["category_group"] = build.category_group(i)
        e["chain_tags"] = build.chain_tags(i)
        e["observations"] = by_iface.get(i["id"], [])
        items.append(e)
    return items


def site_meta(data, chains=None):
    meta = OrderedDict(data["meta"])
    meta["schema_version"] = SITE_SCHEMA
    meta["regions"] = OrderedDict(build.REGIONS)
    meta["catalog_total"] = len(data["interfaces"])
    meta["defunct_hidden"] = [build.display_name(i) for i in data["interfaces"] if build.lifecycle(i) == "defunct"]
    meta["scope"] = ("EVM networks, plus apps whose official interface lists EVM networks" if chains == {"evm"}
                     else ("chains: " + ", ".join(sorted(chains)) if chains else "all interfaces"))
    return meta


def pick_observed(observations):
    """Per country, the one latest verified observation the country verdict relies on (the same choice as
    countryVerdict() in src/utils/restrictions.ts): region-level observations are left to the interface page; the most
    trusted vantage and the newest date come first; a restrictive answer wins, then the protocol's API saying "no
    restriction", then a served landing page, else the first one."""
    by_country = OrderedDict()
    for o in observations:
        if o["region"] is None:
            by_country.setdefault(o["country"], []).append(o)
    out = []
    for country, obs in by_country.items():
        obs = sorted(obs, key=lambda o: o["at"], reverse=True)  # newest first ...
        obs.sort(key=lambda o: PROXY_PREFERENCE.index(o["proxy_type"]))  # ... within the most trusted vantage (stable sort)
        chosen = (next((o for o in obs if o["ui_state"] in RESTRICTIVE), None)
                  or next((o for o in obs if o["kind"] == "api" and o["ui_state"] == "ok"), None)
                  or next((o for o in obs if o["kind"] == "site" and o["ui_state"] == "ok"), None)
                  or obs[0])
        out.append(OrderedDict([("country", country), ("proxy_type", chosen["proxy_type"]), ("at", chosen["at"]),
                                ("kind", chosen["kind"]), ("url", chosen["url"]), ("http_status", chosen["http_status"]),
                                ("ui_state", chosen["ui_state"]), ("note", chosen["note"])]))
    return sorted(out, key=lambda o: o["country"])


def row_of(e):
    """The dashboard row: what the monitor table, its country filter and the summary page read; nothing else."""
    r = OrderedDict((k, e[k]) for k in ROW_FIELDS if k in e)
    r["geo_site"] = OrderedDict((k, e["geo_site"][k]) for k in ("s", "countries", "close_only", "method"))
    r["geo_feature"] = OrderedDict((k, e["geo_feature"][k]) for k in ("s", "countries", "scope"))
    r["vpn"] = OrderedDict((k, e["vpn"][k]) for k in ("s", "note"))
    r["screening"] = OrderedDict((k, e["screening"][k]) for k in ("s", "provider", "layer"))
    if e.get("kyc"):
        r["kyc"] = OrderedDict([("s", e["kyc"]["s"])])
    r["tos"] = OrderedDict((k, e["tos"][k]) for k in ("us", "us_scope", "restricted", "restricted_codes"))
    r["observed"] = pick_observed(e["observations"])
    return r


def write_site(data, observations, outdir, chains=None):
    """Write monitor.json and interfaces/<id>.json; detail files of interfaces no longer on the site are removed."""
    entries = site_entries(data, observations, chains)
    monitor = OrderedDict([("meta", site_meta(data, chains)), ("interfaces", [row_of(e) for e in entries])])
    build.dump_json(monitor, os.path.join(outdir, "monitor.json"))
    detail_dir = os.path.join(outdir, "interfaces")
    os.makedirs(detail_dir, exist_ok=True)
    keep = set()
    for e in entries:
        build.dump_json(e, os.path.join(detail_dir, e["id"] + ".json"))
        keep.add(e["id"] + ".json")
    removed = 0
    for path in glob.glob(os.path.join(detail_dir, "*.json")):
        if os.path.basename(path) not in keep:
            os.remove(path)
            removed += 1
    return monitor, entries, removed


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("catalog", help="monitor/data/interfaces.json")
    ap.add_argument("observations", help="monitor/data/observations.json")
    ap.add_argument("outdir", help="src/data")
    ap.add_argument("--chains", help="comma-separated chain tags to keep, e.g. evm (default: every interface)")
    args = ap.parse_args()
    data, observations, _, _ = build.load_collected(args.catalog, args.observations)
    chains = set(args.chains.split(",")) if args.chains else None
    monitor, entries, removed = write_site(data, observations, args.outdir, chains)
    rows = monitor["interfaces"]
    print(f"site: {len(rows)} of {len(data['interfaces'])} interfaces -> {os.path.join(args.outdir, 'monitor.json')} "
          f"({monitor['meta']['scope']}; defunct hidden: {len(monitor['meta']['defunct_hidden'])}); "
          f"{len(entries)} files in {os.path.join(args.outdir, 'interfaces')}/" + (f", {removed} stale removed" if removed else ""))
    print(f"observations on the dashboard: {sum(len(r['observed']) for r in rows)} country verdicts across "
          f"{sum(1 for r in rows if r['observed'])} interfaces; on the pages: {sum(len(e['observations']) for e in entries)}")


if __name__ == "__main__":
    main()
