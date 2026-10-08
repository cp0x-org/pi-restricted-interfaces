#!/usr/bin/env python3
"""Check that every code-evidence path in interfaces.json exists in the local clone at the scanned HEAD,
and that every frontend_repo is reachable via git.

Usage: python3 -I monitor/scripts/verify.py monitor/data/interfaces.json monitor/repos
Clones are expected at repos/<owner>_<repo> (see monitor/README.md). Network access: git ls-remote.
"""
import json, os, re, subprocess, sys

GH = re.compile(r"https://github\.com/([^/]+)/([^/]+)")
OWNER_REPO_EVIDENCE = re.compile(r"^([\w.-]+/[\w.-]+):\s*(.+)$")  # "owner/repo: path1, path2"


def local_clone(repos_dir, owner, repo):
    for c in (f"{owner}_{repo}", f"{owner}__{repo}"):
        p = os.path.join(repos_dir, c)
        if os.path.isdir(p):
            return p
    return None


def main(src, repos_dir):
    data = json.load(open(src))
    bad, ok = [], 0
    for i in data["interfaces"]:
        url = i["frontend_repo"]
        if url:
            m = GH.match(url)
            owner, repo = m.group(1), m.group(2)
            r = subprocess.run(["git", "ls-remote", f"https://github.com/{owner}/{repo}", "HEAD"],
                               capture_output=True, text=True, timeout=60)
            if r.returncode != 0:
                bad.append(f"{i['id']}: repo unreachable {url}")
            local = local_clone(repos_dir, owner, repo)
            if not local:
                bad.append(f"{i['id']}: no local clone for {owner}/{repo}")
        else:
            local = None
        for e in i["evidence"]:
            if e.startswith("http"):
                continue
            m = OWNER_REPO_EVIDENCE.match(e)
            if m:  # evidence in another repository
                o, rp = m.group(1).split("/")
                clone = local_clone(repos_dir, o, rp)
                if not clone:
                    bad.append(f"{i['id']}: no local clone for {o}/{rp}")
                    continue
                for path in [p.strip() for p in m.group(2).split(",")]:
                    if os.path.exists(os.path.join(clone, path)):
                        ok += 1
                    else:
                        bad.append(f"{i['id']}: missing {o}/{rp}:{path}")
                continue
            if " " in e or ":" in e:
                continue
            if not local:
                continue
            if os.path.exists(os.path.join(local, e)):
                ok += 1
            else:
                bad.append(f"{i['id']}: missing {e}")
    print(f"evidence paths ok: {ok}")
    print("\n".join(bad) if bad else "no problems")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1], sys.argv[2]))
