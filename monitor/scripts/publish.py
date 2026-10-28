#!/usr/bin/env python3
"""Publish the data the site shows into dataset/: one stable place in the repository for bots, MCP servers and other
sites, with the history of versions.

  dataset/current/                          what the site shows now: monitor.json, interfaces/<id>.json, VERSION.json
  dataset/archive/<generated>_<archived>/   earlier versions, the same files

The files are byte copies of src/data/monitor.json and src/data/interfaces/ (written by monitor/scripts/export.py), so
dataset/current/ is exactly what the site serves at /monitor.json and /<id>.json after `pnpm build`. Nothing else is
published: no catalog, no checks, no evidence (those stay in monitor/current/ and monitor/archive/).

When the site files differ from dataset/current/, the old version moves to dataset/archive/ first; when they are the
same, nothing changes. `pnpm monitor:update` runs this as its last step.

Usage (from pi-restrict-interface/):
  python3 -I monitor/scripts/publish.py             # pnpm monitor:publish
  python3 -I monitor/scripts/publish.py --dry-run   # print what would happen, write nothing
"""
import argparse, filecmp, glob, json, os, shutil, sys
from collections import OrderedDict
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.dirname(os.path.dirname(HERE))
SITE = os.path.join(PROJECT, "src", "data")
DATASET = os.path.join(PROJECT, "dataset")
CURRENT = os.path.join(DATASET, "current")
ARCHIVE = os.path.join(DATASET, "archive")


def rel(path):
    return os.path.relpath(path, PROJECT)


def load_json(path):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh, object_pairs_hook=OrderedDict)


def dump_json(obj, path):
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(json.dumps(obj, ensure_ascii=False, indent=2) + "\n")


def site_files(root):
    """monitor.json and interfaces/<id>.json under root, as paths relative to it."""
    files = ["monitor.json"] if os.path.exists(os.path.join(root, "monitor.json")) else []
    return files + sorted(os.path.relpath(p, root) for p in glob.glob(os.path.join(root, "interfaces", "*.json")))


def same(a, b):
    files = site_files(a)
    return files == site_files(b) and all(filecmp.cmp(os.path.join(a, f), os.path.join(b, f), shallow=False) for f in files)


def archive_name(previous_version, today):
    base = f"{previous_version}_{today}"
    name, n = base, 2
    while os.path.exists(os.path.join(ARCHIVE, name)):
        name, n = f"{base}-{n}", n + 1
    return name


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dry-run", action="store_true", help="print what would happen; write nothing")
    args = ap.parse_args()

    if not os.path.exists(os.path.join(SITE, "monitor.json")):
        sys.exit(f"{rel(SITE)}/monitor.json is missing; run `pnpm monitor:build` first")
    site = load_json(os.path.join(SITE, "monitor.json"))
    version = site["meta"]["generated"]
    now = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")

    previous = None
    if os.path.exists(CURRENT):
        if not os.path.exists(os.path.join(CURRENT, "VERSION.json")):
            sys.exit(f"{rel(CURRENT)} exists but has no VERSION.json; move it away first")
        if same(SITE, CURRENT):
            print(f"{rel(CURRENT)} already holds the site data (version {version}); nothing to publish")
            return
        previous = load_json(os.path.join(CURRENT, "VERSION.json"))["version"]

    dest = os.path.join(ARCHIVE, archive_name(previous, now[:10])) if previous else None
    if args.dry_run:
        if dest:
            print(f"would move version {previous} to {rel(dest)}")
        print(f"would publish version {version} ({len(site['interfaces'])} interfaces) to {rel(CURRENT)}")
        print("dry run: nothing written")
        return

    if dest:
        os.makedirs(ARCHIVE, exist_ok=True)
        shutil.move(CURRENT, dest)
        info = load_json(os.path.join(dest, "VERSION.json"))
        info["archived_at"] = now
        dump_json(info, os.path.join(dest, "VERSION.json"))
        print(f"version {previous} moved to {rel(dest)}")

    os.makedirs(os.path.join(CURRENT, "interfaces"))
    for f in site_files(SITE):
        shutil.copy(os.path.join(SITE, f), os.path.join(CURRENT, f))
    dump_json(OrderedDict([
        ("version", version), ("published_at", now), ("archived_at", None),
        ("previous", rel(dest) if dest else None),
        ("schema_version", site["meta"].get("schema_version")),
        ("interfaces", len(site["interfaces"])),
        ("made_by", "monitor/scripts/publish.py"),
        ("files", OrderedDict([
            ("monitor.json", "the dashboard: meta + one row per interface (statuses, country lists, rating, restriction count, per country the probe verdict)"),
            ("interfaces/<id>.json", "one interface's whole record: the catalog entry, the computed fields and every latest verified probe observation"),
        ])),
    ]), os.path.join(CURRENT, "VERSION.json"))
    print(f"version {version} ({len(site['interfaces'])} interfaces) published to {rel(CURRENT)}")


if __name__ == "__main__":
    main()
