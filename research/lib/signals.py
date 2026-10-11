"""Signals: patterns of access-restriction code, searched in every interface's production JavaScript (check_bundle.py)
and in every open repository (check_code.py). A signal is a lead, not a verdict: the sweep reports where it was found
(file and snippet) and combine.py lists signals that the published data does not explain, for a person to review.

Strong signals name a specific mechanism (a geo-IP service, the sanctions oracle, a screening vendor, a blocking
text). Weak ones are generic words that also appear in unrelated code; they are shown but never raise a review item.
"""
import re
from collections import OrderedDict

# category -> [(label, strength, regex)]
SIGNALS = OrderedDict([
    ("geo", [
        ("geo-IP service", "strong", r"api\.country\.is|ipapi\.co|ipinfo\.io|freeipapi|ip-api\.com|ipgeolocation\.io|geolocation-db\.com|"
                                     r"api\.ipdata\.co|ipregistry\.co|ipwho\.is|ip2location|get\.geojs\.io|/cdn-cgi/trace|geolocation\.[\w-]+\.workers\.dev"),
        ("country header", "strong", r"cf-ipcountry|x-vercel-ip-country|cloudfront-viewer-country|x-country-code|\breq(?:uest)?\.geo\b"),
        ("geo endpoint", "strong", r"/api/geo(?:block|location|ip)?\b|/geo-config\b|/geo/country\b|/ip/status\b|/geoip\b"),
        ("block text", "strong", r"not available in your (?:country|region|jurisdiction|location)|"
                                 r"(?:is|are) (?:blocked|restricted) in your (?:country|region)|region unsupported|access restricted",
         r"payment method|on-?ramp|moonpay|transak|banxa|checkout|card payment"),  # a payment provider's own message
        ("HTTP 451 text", "weak", r"unavailable for legal reasons"),  # also in every HTTP status table
        ("geo-block words", "weak", r"geo-?block|geofenc|isRegionRestricted|restricted[ _-]?(?:countr|region|jurisdiction)|"
                                    r"blocked[ _-]?countr|sanctioned[ _-]?countr|prohibited[ _-]?jurisdiction"),
    ]),
    ("screening", [
        ("sanctions oracle", "strong", r"0x40c57923924b5c5c5455c48d93317139addac8fb|isSanctioned\s*\("),
        ("screening vendor", "strong", r"trmlabs\.com|api\.trmlabs|chainalysis\.com|api\.chainalysis|hypernative\.xyz|api\.elliptic\.co|"
                                       r"merklescience\.com|scorechain\.com|api\.range\.org"),
        ("risk-lookup link", "weak", r"webacy\.com|blockaid|web3antivirus"),  # user-protection tools, not compliance screening
        ("screening call", "strong", r"(?<![A-Za-z])screen[-_]?address|(?<![A-Za-z])address[-_ ]?screening(?![-_]?byok)|/sanctioned/|"
                                     r"wallet-check(?![\w-])|preflight-compliance|/address/status\b|compliance/screen|/v\d/check/"),
        ("screening words", "weak", r"sanctions?[-_ ]?(?:screen|check|list)|blacklisted[-_ ]?(?:address|wallet)|\bOFAC\b|"
                                    r"compliance[-_]?(?:api|check|status|provider)"),
    ]),
    ("vpn", [
        ("VPN detection", "strong", r"vpnapi\.io|ipqualityscore|proxycheck\.io|\bis_vpn\b|\bisVpn\b|isConnectedToVpn|detect\.[\w-]+\.\w+/"),
        ("VPN words", "weak", r"\bVPN\b"),
    ]),
    ("kyc", [
        ("KYC vendor", "strong", r"withpersona\.com|sumsub\.com|onfido\.com|jumio\.com|veriff\.com|parallelmarkets\.com|synaps\.io|fractal\.id"),
        ("KYC words", "weak", r"\bKYC\b|\bKYB\b|accredited investor|qualified purchaser"),
    ]),
])
# An optional 4th element: a regex for the text around a match that makes it someone else's (demoted to weak).
_COMPILED = [(cat, row[0], row[1], re.compile(row[2], re.I), re.compile(row[3], re.I) if len(row) > 3 else None)
             for cat, rows in SIGNALS.items() for row in rows]


def scan(name, text, hits, line_numbers=False, max_files=3):
    """Add the signals found in one file to `hits` ({(category, label): {...}}). Counts files, keeps the first ones."""
    for cat, label, strength, rx, demote in _COMPILED:
        m = rx.search(text)
        if not m:
            continue
        if demote is not None:
            keep = None
            for mm in rx.finditer(text):
                if not demote.search(text[max(0, mm.start() - 160):mm.end() + 80]):
                    keep = mm
                    break
            if keep is None:
                label, strength = label + " (third-party context)", "weak"
            else:
                m = keep
        h = hits.setdefault((cat, label), OrderedDict([("category", cat), ("signal", label), ("strength", strength),
                                                        ("files", 0), ("examples", [])]))
        h["files"] += 1
        if len(h["examples"]) < max_files:
            a = max(0, m.start() - 60)
            snippet = " ".join(text[a:m.end() + 80].split())
            ex = OrderedDict([("file", name), ("match", m.group(0)[:80]), ("snippet", snippet[:220])])
            if line_numbers:
                ex["line"] = text.count("\n", 0, m.start()) + 1
            h["examples"].append(ex)


def summary(hits):
    """Ordered list of signal records: categories in SIGNALS order, strong before weak."""
    order = {(cat, label): n for n, (cat, label, _, _, _) in enumerate(_COMPILED)}
    return [hits[k] for k in sorted(hits, key=lambda k: order.get(k, order.get((k[0], k[1].replace(" (third-party context)", "")), 0) + 0.5))]


def categories(records, strength="strong"):
    return sorted({r["category"] for r in records if r["strength"] == strength})
