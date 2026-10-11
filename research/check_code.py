#!/usr/bin/env python3
"""Code checks: read the official frontend's source on GitHub at a pinned commit.

  sweep             for every interface with an open repository (targets.repo in research/checks/<id>.json): all
                    source files are searched for access-restriction signals (lib/signals.py), reported with
                    file:line permalinks. Interfaces without a public repository have nothing to check here.

  type "code"       one file:  https://raw.githubusercontent.com/<repo>/<ref>/<path>
                    the regexes in `expect` must match; countries are read from `section` of that file.
  type "code-scan"  the whole repository (or `dir` inside it) from https://codeload.github.com/<repo>/tar.gz/<ref>:
                    no file may match `absent` (and every `expect` must match somewhere). Used to show that a frontend
                    has no geo-blocking or wallet-screening code at all. Tests, locales, build output and
                    node_modules are skipped (see SKIP below).

Every claim links to https://github.com/<repo>/blob/<ref>/<path>#L<line>, so anyone can open the exact line.
Nothing from the repositories is executed. No git, no GitHub token, no AI: two kinds of plain HTTPS GET.

Usage (from pi-restrict-interface/):
  python3 -I research/check_code.py                    # all code checks
  python3 -I research/check_code.py --only ambient,sky # some interfaces
  python3 -I research/check_code.py --head             # read the current default branch instead of the pinned commit
"""
import io, os, re, sys, tarfile
from collections import OrderedDict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import common, signals  # noqa: E402
from lib.net import fetch, text_of  # noqa: E402

SKIP = re.compile(r"(^|/)(node_modules|dist|build|\.next|out|coverage|locales?|i18n|translations|lang|__tests__|__mocks__|"
                  r"tests?|e2e|cypress|playwright|storybook|\.storybook|abis?|vendor|public/static|\.github)(/|$)|"
                  r"\.(test|spec|stories)\.[a-z]+$|\.min\.js$|\.map$|(^|/)(CHANGELOG|LICENSE)[^/]*$|"
                  r"(yarn\.lock|pnpm-lock\.yaml|package-lock\.json)$", re.I)
SCAN_EXT = re.compile(r"\.(ts|tsx|js|jsx|mjs|cjs|vue|svelte|json|toml|ya?ml|go|rs|py|html|env|example)$", re.I)


def permalink(repo, ref, path, line=None):
    return f"https://github.com/{repo}/blob/{ref}/{path}" + (f"#L{line}" if line else "")


def run_file(spec, check, head, max_age):
    src = check["source"]
    ref = "HEAD" if head else src["ref"]
    url = f"https://raw.githubusercontent.com/{src['repo']}/{ref}/{src['path']}"
    r = fetch(url, cache=max_age if head else "forever")
    link = permalink(src["repo"], ref, src["path"])
    if r["error"] or r["status"] != 200:
        return common.result(spec, check, "error", link, fetched=url, http_status=r["status"],
                             reasons=[r["error"] or f"HTTP {r['status']}"])
    text = text_of(r)
    ev = common.evaluate(check, text)
    first = ev["found"][0]["line"] if ev["found"] else None
    res = common.result(spec, check, "pass" if ev["ok"] else "fail", permalink(src["repo"], ref, src["path"], first), ev,
                        fetched=url, sha256=r["sha256"])
    lines = text.split("\n")
    shown = sorted({f["line"] for f in ev["found"]})
    body = "\n".join(f"L{n}: {lines[n - 1]}" for n in shown)
    if ev["section"]:
        body += "\n\n--- section the countries were read from ---\n" + ev["section"]
    common.save_evidence(res, body)
    return res


_FILES = {}


def source_files(r):
    """[(path, text)] of the source files in a repository tarball (tests, locales, build output skipped). Memoized."""
    if r["sha256"] in _FILES:
        return _FILES[r["sha256"]]
    out = []
    with tarfile.open(fileobj=io.BytesIO(r["body"]), mode="r:gz") as tar:
        for m in tar:
            if not m.isfile() or m.size > 1_500_000:
                continue
            path = m.name.split("/", 1)[1] if "/" in m.name else m.name  # drop the "<repo>-<sha>/" root
            if SKIP.search(path) or not SCAN_EXT.search(path):
                continue
            out.append((path, tar.extractfile(m).read().decode("utf-8", "replace")))
    _FILES[r["sha256"]] = out
    return out


def tarball(repo, ref, head, max_age):
    url = f"https://codeload.github.com/{repo}/tar.gz/{ref}"
    return url, fetch(url, cache=max_age if head else "forever", max_bytes=600_000_000, timeout=300)


def sweep(spec, head, max_age):
    """Every source file of the open repository, searched for access-restriction signals (lib/signals.py)."""
    t = spec["targets"]["repo"]
    ref = "HEAD" if head else t["ref"]
    url, r = tarball(t["repo"], ref, head, max_age)
    tree = f"https://github.com/{t['repo']}/tree/{ref}"
    about = "All source files of the open frontend repository, searched for access-restriction signals"
    if r["error"] or r["status"] != 200:
        return common.sweep_result(spec, "sweep-code", about, "error", tree, fetched=url, http_status=r["status"],
                                   reasons=[r["error"] or f"HTTP {r['status']}"])
    hits = OrderedDict()
    files = source_files(r)
    tg = spec["targets"]
    if tg.get("code_ignore"):  # e.g. a generated API client the app does not call; the reason is in code_ignore_why
        skip = re.compile(tg["code_ignore"])
        files = [(path, text) for path, text in files if not skip.search(path)]
    for path, text in files:
        signals.scan(path, text, hits, line_numbers=True)
    found = signals.summary(hits)
    for rec in found:
        for e in rec["examples"]:
            e["link"] = permalink(t["repo"], ref, e["file"], e.get("line"))
    res = common.sweep_result(spec, "sweep-code", about, "pass", tree, fetched=url, sha256=r["sha256"],
                              files_scanned=len(files), signals=found, strong=signals.categories(found),
                              note=f"not scanned: {tg['code_ignore']} ({tg.get('code_ignore_why', '')})" if tg.get("code_ignore") else None)
    body = f"repository: {tree}\nfiles scanned: {len(files)}\n\nsignals:\n"
    for rec in found:
        body += f"  [{rec['strength']}] {rec['category']}: {rec['signal']} — {rec['files']} file(s)\n"
        body += "".join(f"      {e['link']}  {e['snippet']}\n" for e in rec["examples"])
    common.save_evidence(res, body, name="sweep-code")
    return res


def print_sweep(res, spec, verbose=False):
    if res["outcome"] == "error":
        print(f"ERR  {spec.get('name', res['interface']):24s} {res['source']}  ! {'; '.join(res.get('reasons') or [])[:160]}")
        return
    strong = [s for s in res["signals"] if s["strength"] == "strong"]
    tag = ", ".join(f"{s['category']}: {s['signal']} ({s['files']})" for s in strong) or "no strong signals"
    print(f"SCAN {spec.get('name', res['interface']):24s} {res['files_scanned']:5d} files  {tag}")
    for s in (res["signals"] if verbose else strong):
        e = s["examples"][0]
        print(f"       {s['category']}/{s['signal']}: {e['file']}:{e['line']}  {e['snippet'][:120]}")
    sys.stdout.flush()


def run_scan(spec, check, head, max_age):
    src = check["source"]
    ref = "HEAD" if head else src["ref"]
    url, r = tarball(src["repo"], ref, head, max_age)
    tree = f"https://github.com/{src['repo']}/tree/{ref}/{src.get('dir', '')}".rstrip("/")
    if r["error"] or r["status"] != 200:
        return common.result(spec, check, "error", tree, fetched=url, http_status=r["status"],
                             reasons=[r["error"] or f"HTTP {r['status']}"])
    flags = re.M if check.get("case") else re.M | re.I
    ignore = [re.compile(p) for p in check.get("ignore", [])]
    prefix = src.get("dir", "").strip("/")
    expect_hits = {p: None for p in check.get("expect", [])}
    absent_hits, files = [], 0
    for path, text in source_files(r):
        if prefix and not path.startswith(prefix + "/"):
            continue
        if any(i.search(path) for i in ignore):
            continue
        files += 1
        for pat in expect_hits:
            if expect_hits[pat] is None:
                mm = re.search(pat, text, flags)
                if mm:
                    ln, s = common.snippet(text, mm)
                    expect_hits[pat] = {"pattern": pat, "file": path, "line": ln, "text": s}
        for pat in check.get("absent", []):
            for mm in re.finditer(pat, text, flags):
                ln, s = common.snippet(text, mm)
                absent_hits.append({"pattern": pat, "file": path, "line": ln, "text": s})
                break
    found = [dict(h, text=f"{h['file']}:{h['line']}: {h['text']}") for h in expect_hits.values() if h]
    missing = [p for p, h in expect_hits.items() if h is None]
    reasons = ([f"not found anywhere: {', '.join(missing)}"] if missing else []) + \
              [f"{h['file']}:{h['line']} matches {h['pattern']!r}: {h['text'][:160]}" for h in absent_hits[:10]]
    if len(absent_hits) > 10:
        reasons.append(f"... and {len(absent_hits) - 10} more files")
    outcome = "pass" if not reasons else "fail"
    res = common.result(spec, check, outcome, tree, fetched=url, sha256=r["sha256"], files_scanned=files,
                        note=f"{files} source files scanned" + (f" under {prefix}/" if prefix else ""))
    res["found"] = found
    if reasons:
        res["reasons"] = reasons
    body = f"files scanned: {files}\npatterns that must be absent:\n" + "\n".join(f"  {p}" for p in check.get("absent", []))
    body += "\n\nhits:\n" + ("\n".join(f"  {permalink(src['repo'], ref, h['file'], h['line'])}  {h['text']}" for h in absent_hits) or "  none")
    common.save_evidence(res, body)
    return res


def main():
    def extra(ap):
        ap.add_argument("--head", action="store_true", help="read the default branch HEAD instead of the pinned commit")
        ap.add_argument("--no-sweep", action="store_true", help="skip the sweep of every open repository")
    args = common.cli(__doc__, extra)
    results = []
    specs = common.load_specs(args.only)
    if not args.no_sweep:
        with_repo = [s for s in specs if s["targets"]["repo"]]
        print(f"Sweep: source code of the {len(with_repo)} interfaces with an open repository "
              f"({len(specs) - len(with_repo)} have none: nothing to check)\n")
        for spec in with_repo:
            res = sweep(spec, args.head, args.max_age)
            print_sweep(res, spec, args.verbose)
            results.append(res)
        print()
    for spec in specs:
        for check in spec["checks"]:
            if check["type"] not in ("code", "code-scan"):
                continue
            run = run_file if check["type"] == "code" else run_scan
            res = run(spec, check, args.head, args.max_age)
            common.print_result(res, args.verbose)
            results.append(res)
    common.write_outputs("code", results, {"ref": "default branch HEAD" if args.head else "pinned commits from research/checks"},
                         args.only or (args.no_sweep and {'partial'}))


if __name__ == "__main__":
    main()
