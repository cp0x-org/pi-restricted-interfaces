#!/usr/bin/env python3
"""Static scan of cloned frontend repos for geo-blocking / wallet-screening signals.

Usage: python3 -I scripts/scan.py repos/ out/scan.json
Uses ripgrep; never executes anything from the scanned repos.
"""
import json, re, subprocess, sys, os
from collections import defaultdict

CATEGORIES = {
    # wallet / address screening providers
    "trm":         r"trmlabs|trm[-_ ]?labs|api\.trmlabs\.com|\bTRM\b",
    "chainalysis": r"chainalysis|0x40c57923924b5c5c5455c48d93317139addac8fb|isSanctioned\s*\(",
    "elliptic":    r"\belliptic\b",
    "hypernative": r"hypernative",
    "other_screen_vendor": r"blockaid|merkle ?science|scorechain|range\.org|\bhermod\b|zeroshadow|hackbounty|webacy|scamsniffer",
    # generic screening / blocklists
    "screening":   r"screen[-_]?address|address[-_ ]?screen|screenAddress|sanction|\bofac\b|blocked[-_]?address|address[-_]?blocked|blacklist(ed)?|blocklist|isBlackListed|compliance[-_]?api|COMPLIANCE_API|risk[-_]?check",
    # geo / IP based
    "geo":         r"geo[-_ ]?block|geoblock|geo[-_]?gate|geo[-_]?restrict|restricted[-_ ]?(countr|region|jurisdiction)|blocked[-_ ]?countr|BLOCKED_COUNTRIES|cf-ipcountry|x-vercel-ip-country|request\.geo\b|req\.geo\b|api\.country\.is|ipapi\.(co|com)|ipinfo\.io|freeipapi|ip-api\.com|/geoip|geo-config|cdn-cgi/trace|unavailable.for.legal|\b451\b",
    "vpn":         r"\bvpn\b|ipqualityscore|proxycheck|vpnapi|is_vpn|isVpn",
}

EXCLUDE_GLOBS = [
    "!**/node_modules/**", "!**/*.lock", "!**/yarn.lock", "!**/pnpm-lock.yaml", "!**/package-lock.json",
    "!**/*.min.js", "!**/*.map", "!**/*.svg", "!**/*.png", "!**/*.snap", "!**/CHANGELOG*",
    "!**/locales/**", "!**/i18n/**", "!**/translations/**", "!**/lang/**", "!**/*.po",
    "!**/dist/**", "!**/build/**", "!**/.next/**", "!**/coverage/**", "!**/abis/**", "!**/abi/**",
    "!**/*.test.*", "!**/*.spec.*", "!**/__tests__/**", "!**/__mocks__/**", "!**/e2e/**", "!**/cypress/**",
    "!**/playwright/**", "!**/*.stories.*", "!**/storybook/**",
]
CODE_TYPES = ["-g", "*.{ts,tsx,js,jsx,mjs,cjs,vue,svelte,elm,json,toml,yaml,yml,md,go,rs,py}"]

def rg(pattern, root):
    cmd = ["rg", "-n", "-i", "--no-heading", "--max-columns", "220", "--max-columns-preview",
           "-e", pattern, *CODE_TYPES]
    for g in EXCLUDE_GLOBS:
        cmd += ["-g", g]
    cmd.append(root)
    r = subprocess.run(cmd, capture_output=True, text=True)
    return [l for l in r.stdout.splitlines() if l]

def head_info(path):
    def g(*a):
        return subprocess.run(["git", "-C", path, *a], capture_output=True, text=True).stdout.strip()
    return {"commit": g("rev-parse", "--short", "HEAD"), "date": g("log", "-1", "--format=%cs"),
            "branch": g("rev-parse", "--abbrev-ref", "HEAD")}

def main(repos_dir, out):
    result = {}
    for name in sorted(os.listdir(repos_dir)):
        path = os.path.join(repos_dir, name)
        if not os.path.isdir(os.path.join(path, ".git")):
            continue
        entry = {"head": head_info(path), "categories": {}}
        for cat, pat in CATEGORIES.items():
            hits = rg(pat, path)
            files = defaultdict(int)
            for h in hits:
                f = h.split(":", 1)[0].replace(path + "/", "")
                files[f] += 1
            entry["categories"][cat] = {
                "hits": len(hits),
                "files": sorted(files.items(), key=lambda kv: -kv[1])[:25],
                "sample": [h.replace(path + "/", "") for h in hits[:40]],
            }
        result[name] = entry
        summary = " ".join(f"{c}={entry['categories'][c]['hits']}" for c in CATEGORIES)
        print(f"{name:45s} {entry['head']['date']}  {summary}", flush=True)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w") as fh:
        json.dump(result, fh, indent=1)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
