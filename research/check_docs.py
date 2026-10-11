#!/usr/bin/env python3
"""Page checks: official docs, help-center articles, Terms of Service and press reports.

Sweep (every interface that publishes Terms, targets.terms): the Terms page is read, the paragraphs about restricted,
prohibited or sanctioned jurisdictions (and the list items under them) are picked out and the countries named there
are read with the country dictionary; the clauses the Terms contain are flagged (geofencing / IP blocking, VPN, wallet
screening, US persons, KYC). Terms reservations never count towards the rating; combine.py compares them with the
site's Terms column. A PDF, or Terms that only render in the browser, are reported as such.

Claim checks (type "page"):

For each check of type "page" the script downloads source.url with one GET (no JavaScript), turns the HTML into
plain text (lib/text.py), and then
  * every regex in `expect` must match the text (proves the page says what the catalog claims),
  * countries are read from `section` (from the `start` regex to the `end` regex) by the name dictionary in
    lib/countries.py ("names"), or are fixed by the check (["US"]) when the sentence itself names them.

If the live page is unreachable (blocked, anti-bot 403, moved) or no longer says it, and the check has
source.archive (a Wayback Machine snapshot), the archived copy is used and the result says via=archive.
--archive reads the snapshots first, i.e. exactly the text the catalog was built from.

The extracted text of every page is saved to research/out/evidence/<interface>/<check>.txt.
Status of a page claim: official docs/help/terms -> "yes" (or "tos_only" when only the Terms reserve it),
press and third-party reports -> "reported".

Usage (from pi-restrict-interface/):
  python3 -I research/check_docs.py
  python3 -I research/check_docs.py --only polymarket --archive
"""
import json, os, re, sys
from collections import OrderedDict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import common, countries as C  # noqa: E402
from lib.net import fetch, proxy_for, text_of, wayback_raw  # noqa: E402
from lib.text import html_to_text, looks_like_html  # noqa: E402


def js_strings(code, min_len=60):
    """Human-readable string literals of JavaScript or JSON (text compiled into an app, server-rendered page data)."""
    out = []
    for m in re.finditer(r'"((?:[^"\\\n]|\\.){%d,})"|`([^`]{%d,})`|\'((?:[^\'\\\n]|\\.){%d,})\'' % (min_len, min_len, min_len), code):
        sval = next(g for g in m.groups() if g is not None)
        if " " not in sval or sval.count(" ") < 6 or re.search(r"[{};=]|function\(|=>", sval[:200]):
            continue  # code, class lists, URLs: not prose
        try:
            sval = json.loads('"' + sval.replace('"', '\\"') + '"') if "\\" in sval else sval
        except ValueError:
            pass
        out.append(html_to_text(sval) if "<" in sval else sval)
    return out


def page_text(r):
    raw = text_of(r)
    ctype = r["headers"].get("content-type", "")
    if "pdf" in ctype or r["body"][:5] == b"%PDF-":
        return None, "PDF: its text cannot be extracted with the Python standard library; open the link"
    if not looks_like_html(raw, r["headers"]):
        return raw, None
    text = html_to_text(raw)
    if len(text) < 500:
        # Server-rendered pages often carry the content as data in <script> (Next.js __NEXT_DATA__, React server
        # component payloads) rather than as visible HTML; their prose strings are read too.
        data = "\n".join(m.group(1) for m in re.finditer(r"<script\b[^>]*>(.*?)</script>", raw, re.S | re.I))
        prose = js_strings(data)
        if sum(len(x) for x in prose) > 500:
            return text + "\n" + "\n".join(prose), None
    return text, None


def attempt(spec, check, url, via, max_age):
    r = fetch(url, cache="forever" if via == "archive" else max_age, timeout=60)
    if r["error"] or not r["status"] or r["status"] >= 400:
        return None, r, r["error"] or f"HTTP {r['status']}"
    text, why = page_text(r)
    if text is None:
        return None, r, why
    if len(text) < 200:
        return None, r, f"page text is only {len(text)} characters (rendered by JavaScript?)"
    ev = common.evaluate(check, text)
    return (ev, text), r, None if ev["ok"] else "; ".join(ev["reasons"])


def run(spec, check, prefer_archive, max_age):
    src = check["source"]
    order = [("live", src["url"])]
    if src.get("archive"):
        order.append(("archive", wayback_raw(src["archive"])))
        if prefer_archive:
            order.reverse()
    notes, last = [], None
    for via, url in order:
        got, r, why = attempt(spec, check, url, via, max_age)
        last = (via, url, r, got)
        if got and got[0]["ok"]:
            ev, text = got
            res = common.result(spec, check, "pass", src["url"], ev, fetched=url, via=via, http_status=r["status"],
                                sha256=r["sha256"], note="; ".join(notes) or None)
            if res["note"] is None:
                del res["note"]
            body = text if not ev["section"] else text + "\n\n--- section the countries were read from ---\n" + ev["section"]
            common.save_evidence(res, body[:400_000])
            return res
        notes.append(f"{via}: {why}")
    via, url, r, got = last
    res = common.result(spec, check, "error" if got is None else "fail", src["url"], got[0] if got else None,
                        fetched=url, via=via, http_status=r["status"])
    res["reasons"] = notes
    if got:
        common.save_evidence(res, got[1][:400_000])
    return res


# ----------------------------------------------------------------------------- terms sweep
RESTRICT_RE = re.compile(r"(restricted|prohibited|excluded|sanctioned|embargoed|blocked|ineligible|not (?:be )?(?:available|permitted|offered|allowed))"
                         r"[^.]{0,80}(jurisdiction|countr|territor|region|person|user|resident)|"
                         r"(resid\w*|citizen\w*|located|domiciled|national\w*|organi[sz]ed)\s+(?:of|in|under)\b|prohibited jurisdiction|"
                         r"(countr|jurisdiction|territor)\w*[^.]{0,40}(embargoed|restricted|prohibited|sanctioned)", re.I)
CLAUSES = OrderedDict([
    ("geofencing", r"geo-?fenc|geo-?block|IP[- ]address(?:es)?[^.]{0,80}(?:block|restrict|deny|location)|technically restrict|(?:block|restrict)[^.]{0,60}access[^.]{0,60}(?:location|jurisdiction|country)"),
    ("vpn", r"\bVPN\b|virtual private network"),
    ("screening", r"screen(?:ing)?\b[^.]{0,60}(?:wallet|address)|(?:wallet|address)[^.]{0,40}screen|blockchain analytics|TRM Labs|Chainalysis|Elliptic|sanctions? screening"),
    ("sanctions", r"sanction|\bOFAC\b|embargo"),
    ("us_persons", r"U\.?S\.? persons?|United States persons?|residents? of the United States"),
    ("kyc", r"\bKYC\b|know[- ]your[- ]customer|identity verification"),
])


def terms_url(url):
    """GitHub file pages are read raw."""
    m = re.match(r"^https://github\.com/([^/]+/[^/]+)/blob/(.+)$", url)
    return f"https://raw.githubusercontent.com/{m.group(1)}/{m.group(2)}" if m else url


def restricted_countries(text):
    """Countries named in paragraphs about restricted jurisdictions (plus the list items that follow such a paragraph)."""
    blocks = [b.strip() for b in text.split("\n") if b.strip()]
    picked, i = [], 0
    while i < len(blocks):
        b = blocks[i]
        if RESTRICT_RE.search(b) and "governed by" not in b.lower() and len(b) < 4000:
            picked.append(b)
            if b.rstrip().endswith(":"):  # a list follows, one item per line
                j = i + 1
                while j < len(blocks) and len(blocks[j]) < 160 and j - i < 80:
                    picked.append(blocks[j])
                    j += 1
                i = j
                continue
        i += 1
    tokens, _ = C.from_names("\n".join(picked))
    return tokens, picked


def analyse_terms(text):
    countries, picked = restricted_countries(text)
    clauses = OrderedDict()
    for name, rx in CLAUSES.items():
        m = re.search(rx, text, re.I)
        clauses[name] = None if not m else " ".join(text[max(0, m.start() - 80):m.end() + 120].split())
    return countries, picked, clauses


def terms_sweep(spec, max_age, via_country="US"):
    url = spec["targets"]["terms"]
    about = "The Terms (or eligibility page): reachable, countries in restricted-jurisdiction clauses, which kinds of clauses it has"
    # Sources in order, until one has readable Terms text with restriction or compliance clauses: the page itself;
    # the same page through a proxy (blocked here, e.g. by an internet provider); the Terms text kept in the frontend's
    # repository (targets.terms_fallback); the latest Wayback Machine snapshot; the prose compiled into the app's
    # JavaScript (single-page apps).
    proxy = proxy_for(via_country) if via_country else None
    tries = [("live", terms_url(url) if "#" not in url else None, None)]
    if "#" not in url and proxy:
        tries.append((f"proxy {via_country}", url, proxy))
    if spec["targets"].get("terms_fallback"):
        tries.append(("repository", terms_url(spec["targets"]["terms_fallback"]), None))
    if "#" not in url:
        tries.append(("archive", f"https://web.archive.org/web/9999id_/{url}", None))
    tries.append(("app JavaScript", spec["targets"]["app"], "bundle"))
    notes, found = [], None
    for via, fetched, how in tries:
        if fetched is None:
            notes.append(f"{via}: a client-side route (#...), rendered by JavaScript")
            continue
        if how == "bundle":
            import check_bundle
            page, files, err, _ = check_bundle.collect(fetched, max_age)
            if err:
                notes.append(f"{via}: {err}")
                continue
            r, text = page, "\n".join(x for _, js, _ in files for x in js_strings(js, 80))
        else:
            if via.startswith("proxy") and notes and not re.search(r"HTTP (4\d\d|5\d\d)|Error", notes[-1]):
                continue  # the page answered here; a proxy only helps when it did not
            r = fetch(fetched, proxy=how, cache="forever" if via == "repository" else max_age, timeout=90)
            if r["error"] or not r["status"] or r["status"] >= 400:
                notes.append(f"{via}: {r['error'] or 'HTTP %s' % r['status']}")
                continue
            text, why = page_text(r)
            if text is None:
                notes.append(f"{via}: {why}")
                break  # a PDF stays a PDF in the archive
        if len(text) < 500:
            notes.append(f"{via}: only {len(text)} characters of text without JavaScript")
            continue
        countries, picked, clauses = analyse_terms(text)
        if not countries and not picked and not any(clauses.values()):
            notes.append(f"{via}: no restriction or compliance clauses in {len(text)} characters of text")
            continue
        found = (via, fetched, r, text, countries, picked, clauses)
        break
    if not found:
        outcome = "error" if notes and all(re.search(r"HTTP|Error|curl", n) for n in notes) else "skip"
        return common.sweep_result(spec, "sweep-terms", about, outcome, url, reasons=notes)
    via, fetched, r, text, countries, picked, clauses = found
    res = common.sweep_result(spec, "sweep-terms", about, "pass", url, fetched=fetched, via=via, http_status=r["status"],
                              sha256=r["sha256"], chars=len(text), terms_countries=countries, clauses=clauses,
                              note="; ".join(notes) or None)
    common.save_evidence(res, "countries: " + " ".join(countries) + "\n\nclauses:\n" +
                         "".join(f"  {k}: {v}\n" for k, v in clauses.items()) + "\n--- restriction paragraphs ---\n" +
                         "\n".join(picked) + "\n\n--- full text ---\n" + text[:400_000], name="sweep-terms")
    return res


def print_terms(res, spec):
    name = spec.get("name", res["interface"])
    if res["outcome"] != "pass":
        mark = "ERR " if res["outcome"] == "error" else "SKIP"
        print(f"{mark} {name:24s} {res['source'][:70]}  ! {'; '.join(res.get('reasons') or [])[:120]}")
        return
    cl = " ".join(k for k, v in res["clauses"].items() if v) or "no clauses found"
    cc = res["terms_countries"]
    via = "" if res["via"] == "live" else f" (via {res['via']})"
    print(f"SCAN {name:24s} {len(cc):3d} countries in restriction clauses; clauses: {cl}{via}")


def main():
    def extra(ap):
        ap.add_argument("--archive", action="store_true", help="use the Wayback Machine snapshots first")
        ap.add_argument("--no-sweep", action="store_true", help="skip the sweep of every interface's Terms")
        ap.add_argument("--via-country", default="US", help="proxy country for Terms unreachable from this machine (default US)")
    args = common.cli(__doc__, extra)
    common.load_env()
    results = []
    specs = common.load_specs(args.only)
    if not args.no_sweep:
        with_terms = [s for s in specs if s["targets"].get("terms")]
        print(f"Sweep: Terms of the {len(with_terms)} interfaces that publish them "
              f"({len(specs) - len(with_terms)} have none: nothing to check)\n")
        for spec in with_terms:
            res = terms_sweep(spec, args.max_age, args.via_country)
            print_terms(res, spec)
            results.append(res)
        print()
    for spec, check in ((s, c) for s in specs for c in s["checks"] if c["type"] == "page"):
        res = run(spec, check, args.archive, args.max_age)
        common.print_result(res, args.verbose)
        results.append(res)
    common.write_outputs("docs", results, {"order": "archive first" if args.archive else "live page first, archive as fallback"},
                         args.only or (args.no_sweep and {'partial'}))


if __name__ == "__main__":
    main()
