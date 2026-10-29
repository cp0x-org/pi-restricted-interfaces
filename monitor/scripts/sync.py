#!/usr/bin/env python3
"""Carry everything already collected to the site, without checking anything again (no network requests):

  1. merge  every probe run in monitor/probe/out/ that is not in monitor/data/observations.json yet
            (the same as `probe.py merge` with those files; a run already merged is skipped)
  2. build  the monitor:build command from package.json: the site files in src/data/ (what the site shows),
            monitor/out/report.md and interfaces.csv; countries the probe saw blocked are counted (observed.py)

Usage (from pi-restrict-interface/):
  python3 -I monitor/scripts/sync.py     # pnpm monitor:sync
Afterwards: `pnpm start` / `pnpm build`; commit monitor/data/observations.json, src/data/ and monitor/out/ together.
"""
import glob, json, os, shlex, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
MONITOR = os.path.dirname(HERE)
PROJECT = os.path.dirname(MONITOR)
STORE = os.path.join(MONITOR, "data", "observations.json")
RUNS = os.path.join(MONITOR, "probe", "out")


def rel(path):
    return os.path.relpath(path, PROJECT)


def call(cmd):
    print("$ " + " ".join("python3" if c == sys.executable else (rel(c) if os.path.isabs(c) else c) for c in cmd), flush=True)
    return subprocess.call(cmd, cwd=PROJECT)


def pending_runs():
    merged = set()
    if os.path.exists(STORE):
        with open(STORE, encoding="utf-8") as fh:
            merged = {r["id"] for r in json.load(fh).get("runs", [])}
    out = []
    for path in sorted(glob.glob(os.path.join(RUNS, "*.json"))):
        try:
            with open(path, encoding="utf-8") as fh:
                run_id = json.load(fh)["run"]["id"]
        except (OSError, ValueError, KeyError, TypeError) as e:
            print(f"skip {rel(path)}: not a probe run ({type(e).__name__})")
            continue
        if run_id not in merged:
            out.append(path)
    return out


def main():
    if len(sys.argv) > 1 and sys.argv[1] in ("-h", "--help"):
        print(__doc__)
        return
    runs = pending_runs()
    print(f"=== merge: {len(runs)} new probe run(s) in {rel(RUNS)}")
    if runs and call([sys.executable, "-I", os.path.join(HERE, "probe.py"), "merge", STORE, *runs]):
        sys.exit("merge failed; nothing was built")
    with open(os.path.join(PROJECT, "package.json"), encoding="utf-8") as fh:
        build = [sys.executable if a == "python3" else a for a in shlex.split(json.load(fh)["scripts"]["monitor:build"])]
    print("\n=== build")
    if call(build):
        sys.exit("monitor:build failed")
    print("\nsite data updated: src/data/monitor.json and src/data/interfaces/ (restart `pnpm start` if it does not reload)")


if __name__ == "__main__":
    main()
