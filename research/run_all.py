#!/usr/bin/env python3
"""Run every check script in order, then combine the results into the table.

  check_code.py   -> research/out/code.json     GitHub source at pinned commits
  check_bundle.py -> research/out/bundle.json   JavaScript the official sites ship
  check_docs.py   -> research/out/docs.json     docs, help centers, Terms, press (with Wayback fallback)
  check_api.py    -> research/out/api.json      public APIs with a sanctioned vs a control wallet
  check_live.py   -> research/out/live.json     answers to visitors from a given country, through a proxy
  combine.py      -> research/out/report.md (+ table.csv with --csv)

Usage (from pi-restrict-interface/):
  python3 -I research/run_all.py --csv
  python3 -I research/run_all.py --only sky,ethena --refresh
"""
import argparse, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
STEPS = ("check_code.py", "check_bundle.py", "check_docs.py", "check_api.py", "check_live.py")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--only", help="comma-separated interface ids")
    ap.add_argument("--refresh", action="store_true", help="ignore the HTTP cache")
    ap.add_argument("--csv", nargs="?", const=os.path.join(HERE, "out", "table.csv"), help="also write the CSV table")
    args = ap.parse_args()
    passthrough = (["--only", args.only] if args.only else []) + (["--refresh"] if args.refresh else [])
    for step in STEPS:
        print(f"\n===== {step} =====", flush=True)
        rc = subprocess.call([sys.executable, "-I", os.path.join(HERE, step)] + passthrough)
        if rc:
            print(f"{step} exited with {rc}; continuing", flush=True)
    print("\n===== combine.py =====", flush=True)
    sys.exit(subprocess.call([sys.executable, "-I", os.path.join(HERE, "combine.py")] + (["--csv", args.csv] if args.csv else [])))


if __name__ == "__main__":
    main()
