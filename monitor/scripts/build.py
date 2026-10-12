#!/usr/bin/env python3
"""Validate monitor/data/interfaces.json (schema v2), compute derived fields and render outputs.

Usage:
  python3 -I monitor/scripts/build.py monitor/data/interfaces.json monitor/templates/report_template.md monitor/out \
      --observations monitor/data/observations.json --export src/data --chains evm

Outputs: <outdir>/report.md and <outdir>/interfaces.csv over the whole catalog (the collected data, derived), and with
--export the files the web app loads (export.py: monitor.json + interfaces/<id>.json), which are then compared with the
collected data (check_export.py); a mismatch fails the build. Deterministic: no timestamps. Python >= 3.9, stdlib only.
"""
import argparse, csv, json, os, re, sys
from collections import Counter, OrderedDict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import observed  # noqa: E402

# ----------------------------------------------------------------------------- vocabularies
S_OK = ("yes", "no", "reported", "tos_only", "optional", "unknown")
LAYER_OK = (None, "edge", "frontend", "api", "contract")
FAIL_OK = (None, "open", "closed", "unknown", "n/a")
VPN_OK = ("no", "tos_only", "detect", "block", "optional", "unknown")
REPO_OK = ("open", "open_stale", "closed", "private_now", "archived", "none_found")
TOS_US_OK = ("yes", "no", "partial", "unknown")
CONF_OK = ("high", "medium", "low")
# current: the version the protocol points users to; legacy: an older official interface that is still served but being phased
# out (listed at the bottom); defunct: the official interface no longer works (kept in the catalog, hidden from the site).
LIFECYCLE_OK = ("current", "legacy", "defunct")
GROUPS = ("dex", "aggregator", "perps", "lending", "staking", "yield", "rwa", "stablecoin", "bridge", "prediction", "wallet", "other")
TAGS = ("evm", "solana", "bitcoin", "sui", "starknet", "cosmos", "hyperliquid", "other")
COMPUTED = ("level", "restrictions", "category_group", "chain_tags")
REQUIRED = ("id", "name", "description", "category", "chains", "url", "frontend_repo", "repo_state", "repo_status", "repo_last_commit",
            "networks", "geo_site", "geo_feature", "vpn", "screening", "asset_filter", "tos", "notes", "live", "geo_endpoints",
            "evidence", "confidence", "alternatives")
OBS_STATES = ("ok", "blocked", "close_only", "feature_limited", "challenge", "error", "unknown")
OBS_KINDS = ("site", "geo_endpoint", "api")
PROBE_METHODS = ("GET", "POST")
PROXY_TYPES = ("residential", "isp", "mobile", "datacenter", "tor", "direct")

ISO2 = frozenset("""
AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ
CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR
GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO
JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR
MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO
RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV
TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW
""".split())
assert len(ISO2) == 249, len(ISO2)

# Sub-national region tokens: "<ISO2>-<Name>". The parent country is the part before the dash.
REGIONS = OrderedDict([
    ("UA-Crimea", "Crimea and Sevastopol"),
    ("UA-DPR", "Donetsk region (DPR)"),
    ("UA-LPR", "Luhansk region (LPR)"),
    ("UA-Kherson", "Kherson region"),
    ("UA-Zaporizhzhia", "Zaporizhzhia region"),
    ("US-NY", "New York"),
    ("CA-ON", "Ontario"),
    ("CA-BC", "British Columbia"),
    ("CA-AB", "Alberta"),
    ("CA-QC", "Quebec"),
    ("GE-Abkhazia", "Abkhazia"),
    ("GE-SouthOssetia", "South Ossetia"),
    ("CY-North", "Northern Cyprus"),
])
TOKEN_RE = re.compile(r"^[A-Z]{2}(-[A-Za-z]+)?$")
ID_RE = re.compile(r"^[a-z0-9-]+$")

# Labels for report.md
LIFECYCLE_TAG = {"current": "", "legacy": " *(legacy version)*", "defunct": " *(defunct)*"}
S_LABEL = {"yes": "yes", "no": "no", "reported": "reported", "tos_only": "ToS only", "optional": "optional", "unknown": "?"}
LAYER_LABEL = {"edge": "edge/CDN", "frontend": "frontend", "api": "API", "contract": "contract", None: "—"}
VPN_LABEL = {"no": "no", "tos_only": "ToS only", "detect": "detect", "block": "block", "optional": "optional", "unknown": "?"}
US_LABEL = {"yes": "prohibited", "no": "no", "partial": "partial", "unknown": "?"}


# ----------------------------------------------------------------------------- derived fields
ENFORCED = ("yes", "reported")
# Rating thresholds on the number of restrictions: A only with none, B <= 5, C <= 20, D above.
RATING_STEPS = ((0, "A"), (5, "B"), (20, "C"))


def restrictions(i):
    """Technical restrictions of the official interface (enforced = confirmed or reported; ToS-only does not count):
    every restricted country/region (site, trading or feature level) once, plus one per mechanism:
    feature/asset gate, wallet screening, VPN detection, KYC. A site geo-block without a published list counts once."""
    countries, mechanisms = set(), []
    gs, gf, sc = i["geo_site"], i["geo_feature"], i["screening"]
    if gs["s"] in ENFORCED:
        countries |= set(gs["countries"]) | set(gs["close_only"])
        if not gs["countries"] and not gs["close_only"]:
            mechanisms.append("geo_site")
    if gf["s"] in ENFORCED:
        countries |= set(gf["countries"])
        mechanisms.append("geo_feature")
    if sc["s"] in ENFORCED:
        mechanisms.append("screening")
    if i["vpn"]["s"] in ("detect", "block"):
        mechanisms.append("vpn")
    if (i.get("kyc") or {}).get("s") in ENFORCED:
        mechanisms.append("kyc")
    return OrderedDict([("count", len(countries) + len(mechanisms)), ("countries", len(countries)), ("mechanisms", mechanisms)])


def lifecycle(i):
    return i.get("lifecycle", "current")


def display_name(i):
    """Name for reports and CSV, with a version label and parenthesized aka: "Sky (ex-Maker)"."""
    name = f"{i['name']} {i['version']}" if i.get("version") else i["name"]
    return f"{name} ({i['aka']})" if i.get("aka") else name


def level(i):
    """Fewer restrictions, better rating: A none, B 1-5, C 6-20, D more than 20; n/a when nothing could be determined."""
    r = restrictions(i)
    if r["count"] == 0 and i["geo_site"]["s"] == "unknown" and i["screening"]["s"] == "unknown":
        return "n/a"
    for limit, grade in RATING_STEPS:
        if r["count"] <= limit:
            return grade
    return "D"


def category_group(i):
    head = i["category"].split("/")[0].strip().lower()
    rules = [("rwa", "rwa"), ("stablecoin", "stablecoin"), ("aggregator", "aggregator"), ("perp", "perps"), ("prediction", "prediction"), ("bridge", "bridge"),
             ("wallet", "wallet"), ("dex", "dex"), ("lending", "lending"), ("cdp", "lending"), ("savings", "lending"),
             ("leverage", "lending"), ("staking", "staking"), ("restaking", "staking"), ("yield", "yield"),
             ("vault", "yield"), ("synthetic", "yield")]
    for key, group in rules:
        if key in head:
            return group
    return "other"


def chain_tags(i):
    c = i["chains"].lower()
    tags = set()
    if "solana" in c:
        tags.add("solana")
    if "btc" in c or "bitcoin" in c:
        tags.add("bitcoin")
    if "sui" in c:
        tags.add("sui")
    if "starknet" in c:
        tags.add("starknet")
    if "dydx chain" in c:
        tags.add("cosmos")
    if "hyperliquid" in c:
        tags.add("hyperliquid")
    evm_words = ("evm", "ethereum", "bnb", "polygon", "base", "optimism", "arbitrum", "avalanche", "scroll", "blast",
                 "l2", "superchain", "apechain", "botanix", "layerzero")
    if "lighter" in c:
        tags.add("other")  # Lighter is a non-EVM zk L2
    elif any(w in c for w in evm_words):
        tags.add("evm")
    if "multi" in c:
        tags.add("other")
    return sorted(tags) or ["other"]


# ----------------------------------------------------------------------------- validation
class Invalid(Exception):
    pass


def check_tokens(where, tokens):
    if not isinstance(tokens, list):
        raise Invalid(f"{where}: must be a list")
    if len(set(tokens)) != len(tokens):
        raise Invalid(f"{where}: duplicate tokens")
    for t in tokens:
        if not TOKEN_RE.match(t):
            raise Invalid(f"{where}: bad token {t!r}")
        if "-" in t:
            if t not in REGIONS:
                raise Invalid(f"{where}: unknown region {t!r}")
        elif t not in ISO2:
            raise Invalid(f"{where}: unknown country code {t!r}")


def check_enum(where, value, allowed):
    if value not in allowed:
        raise Invalid(f"{where}={value!r}, expected one of {allowed}")


def validate(data):
    meta, items = data.get("meta", {}), data.get("interfaces")
    if meta.get("schema_version") != 2:
        raise Invalid("meta.schema_version must be 2")
    if not isinstance(items, list) or not items:
        raise Invalid("interfaces must be a non-empty list")
    ids = set()
    warnings = []
    for i in items:
        iid = i.get("id")
        for k in REQUIRED:
            if k not in i:
                raise Invalid(f"{iid}: missing {k}")
        for k in COMPUTED:
            if k in i:
                raise Invalid(f"{iid}: computed field {k} must not be in the data file")
        if not isinstance(iid, str) or not ID_RE.match(iid):
            raise Invalid(f"bad id {iid!r}")
        if iid in ids:
            raise Invalid(f"duplicate id {iid}")
        ids.add(iid)
        w = iid + "."
        if not isinstance(i["description"], str) or not 80 <= len(i["description"]) <= 600:
            raise Invalid(f"{iid}: description must be one paragraph of 80-600 characters")
        if "description_zh" in i and (not isinstance(i["description_zh"], str) or not 20 <= len(i["description_zh"]) <= 600):
            raise Invalid(f"{iid}: description_zh must be one paragraph of 20-600 characters")
        if not re.match(r"^https://\S+$", i["url"]):
            raise Invalid(f"{iid}: url must be a single https URL without spaces")
        check_enum(w + "repo_state", i["repo_state"], REPO_OK)
        check_enum(w + "confidence", i["confidence"], CONF_OK)
        repo = i["frontend_repo"]
        if repo is None:
            if i["repo_state"] not in ("closed", "private_now", "none_found", "archived"):
                raise Invalid(f"{iid}: frontend_repo is null but repo_state={i['repo_state']}")
        else:
            if not repo.startswith("https://github.com/"):
                raise Invalid(f"{iid}: frontend_repo must be a github.com URL")
            if i["repo_state"] in ("closed", "private_now", "none_found"):
                raise Invalid(f"{iid}: frontend_repo is set but repo_state={i['repo_state']}")
        gs, gf, vpn, sc, tos = i["geo_site"], i["geo_feature"], i["vpn"], i["screening"], i["tos"]
        check_enum(w + "geo_site.s", gs["s"], S_OK)
        check_tokens(w + "geo_site.countries", gs["countries"])
        check_tokens(w + "geo_site.close_only", gs["close_only"])
        check_enum(w + "geo_feature.s", gf["s"], S_OK)
        check_tokens(w + "geo_feature.countries", gf["countries"])
        check_enum(w + "vpn.s", vpn["s"], VPN_OK)
        check_enum(w + "screening.s", sc["s"], S_OK)
        check_enum(w + "screening.layer", sc["layer"], LAYER_OK)
        check_enum(w + "screening.fail", sc["fail"], FAIL_OK)
        check_enum(w + "tos.us", tos["us"], TOS_US_OK)
        if "kyc" in i:
            kyc = i["kyc"]
            if not isinstance(kyc, dict) or not isinstance(kyc.get("scope"), str):
                raise Invalid(f"{iid}: kyc must be an object with s, layer, scope")
            check_enum(w + "kyc.s", kyc.get("s"), S_OK)
            check_enum(w + "kyc.layer", kyc.get("layer"), LAYER_OK)
        check_tokens(w + "tos.restricted_codes", tos["restricted_codes"])
        for k in ("live", "evidence"):
            if not isinstance(i[k], list) or not all(isinstance(x, str) for x in i[k]):
                raise Invalid(f"{iid}: {k} must be a list of strings")
        for a in i["alternatives"]:
            if not isinstance(a, dict) or not a.get("name") or not str(a.get("url", "")).startswith("https://"):
                raise Invalid(f"{iid}: alternatives items need name + https url")
        if not isinstance(i["networks"], list) or not all(isinstance(n, str) and n for n in i["networks"]):
            raise Invalid(f"{iid}: networks must be a list of names")
        if "evm" in chain_tags(i) and not i["networks"]:
            warnings.append(f"{iid}: EVM interface without networks[]")
        if not isinstance(i["geo_endpoints"], list) or not all(isinstance(u, str) and u.startswith("https://") for u in i["geo_endpoints"]):
            raise Invalid(f"{iid}: geo_endpoints must be a list of https URLs")
        check_api_probes(iid, i.get("api_probes", []))
        if "version" in i and (not isinstance(i["version"], str) or not 1 <= len(i["version"]) <= 40):
            raise Invalid(f"{iid}: version must be a short label (1-40 characters)")
        if "aka" in i and (not isinstance(i["aka"], str) or not 1 <= len(i["aka"]) <= 40):
            raise Invalid(f"{iid}: aka must be a short label (1-40 characters)")
        if "referral_url" in i and not (isinstance(i["referral_url"], str) and i["referral_url"].startswith("https://")):
            raise Invalid(f"{iid}: referral_url must be an https URL")
        if "(" in i["name"] or "·" in i.get("version", ""):
            raise Invalid(f"{iid}: keep name/version plain; put a former name, parent brand or product in aka")
        check_enum(w + "lifecycle", i.get("lifecycle", "current"), LIFECYCLE_OK)
        if "lifecycle_note" in i and not isinstance(i["lifecycle_note"], str):
            raise Invalid(f"{iid}: lifecycle_note must be a string")
        if lifecycle(i) != "current" and not i.get("lifecycle_note"):
            raise Invalid(f"{iid}: lifecycle={lifecycle(i)} needs a lifecycle_note (why, with a date or source)")
        if "family" in i and (not isinstance(i["family"], str) or not ID_RE.match(i["family"])):
            raise Invalid(f"{iid}: family must be an id-like string")
    families = Counter(i["family"] for i in items if i.get("family"))
    for fam, n in families.items():
        if n < 2:
            warnings.append(f"family {fam}: only one interface uses it")
        if not any(i.get("family") == fam and lifecycle(i) == "current" for i in items):
            warnings.append(f"family {fam}: no current version")
    return warnings


# ----------------------------------------------------------------------------- report rendering
def md_link(url):
    if not url:
        return "—"
    u = url.split(" ")[0]
    label = u.replace("https://", "").replace("github.com/", "")
    return f"[{label}]({u})"


def short_geo(i):
    g = i["geo_site"]
    s = S_LABEL[g["s"]]
    if g["s"] in ("yes", "reported") and g["countries"]:
        c = g["countries"]
        s += f" ({len(c)})" if len(c) > 3 else f" ({', '.join(c)})"
    if g["close_only"]:
        s += f" + close-only ({len(g['close_only'])})"
    return s


def with_note(label, note):
    return f"{label} ({note})" if note else label


def render_report(items, template):
    rows = ["| # | Interface | Category | URL | Frontend GitHub | Geo: site | Geo: features/assets | Wallet screening | VPN | ToS: US | Rating |",
            "|---|---|---|---|---|---|---|---|---|---|---|"]
    for n, i in enumerate(items, 1):
        sc = i["screening"]
        scr = S_LABEL[sc["s"]]
        if sc["s"] in ("yes", "reported") and sc["layer"]:
            scr += f" ({LAYER_LABEL[sc['layer']]})"
        repo = md_link(i["frontend_repo"]) if i["frontend_repo"] else f"— *{i['repo_status']}*"
        us = with_note(US_LABEL[i["tos"]["us"]], i["tos"]["us_scope"])
        vpn = with_note(VPN_LABEL[i["vpn"]["s"]], i["vpn"]["note"])
        rows.append(f"| {n} | **{display_name(i)}**{LIFECYCLE_TAG[lifecycle(i)]} | {i['category']} | {md_link(i['url'])} | {repo} | {short_geo(i)} | "
                    f"{S_LABEL[i['geo_feature']['s']]} | {scr} | {vpn} | {us} | **{level(i)}** |")
    main_table = "\n".join(rows)

    mrows = ["| Interface | Rating | Where it is enforced / mechanism | Fail mode | Notes | Evidence |",
             "|---|---|---|---|---|---|"]
    for i in items:
        parts = []
        if i["geo_site"]["s"] not in ("no", "unknown") and i["geo_site"]["method"]:
            parts.append("Geo: " + i["geo_site"]["method"])
        if i["geo_feature"]["s"] not in ("no", "unknown") and i["geo_feature"]["scope"]:
            parts.append("Features: " + i["geo_feature"]["scope"])
        if i["screening"]["s"] not in ("no", "unknown") and i["screening"]["provider"]:
            parts.append("Screening: " + i["screening"]["provider"])
        if i["asset_filter"]:
            parts.append("Asset filter: " + i["asset_filter"])
        if i.get("kyc") and i["kyc"]["s"] not in ("no", "unknown"):
            parts.append("KYC: " + i["kyc"]["scope"])
        mech = "<br>".join(p.replace("|", "/") for p in parts) or "—"
        ev = "<br>".join(f"`{e}`" if not e.startswith("http") else f"[src]({e})" for e in i["evidence"][:4]) or "—"
        fail = with_note(i["screening"]["fail"], i["screening"]["fail_note"]) if i["screening"]["fail"] else "—"
        mrows.append(f"| **{display_name(i)}**{LIFECYCLE_TAG[lifecycle(i)]} | {level(i)} | {mech} | {fail} | "
                     f"{i['notes'].replace('|', '/')} | {ev} |")
    mech_table = "\n".join(mrows)

    lrows = ["| Interface | Result |", "|---|---|"]
    for i in items:
        for l in i["live"]:
            if any(k in l for k in ("SDN", "sanctioned", "geoblock", "restricted", "geo-config", "geo/country", "blacklisted", "screen")):
                lrows.append(f"| {display_name(i)} | {l} |")
    live_table = "\n".join(lrows)

    lv = Counter(level(i) for i in items)
    lc = Counter(lifecycle(i) for i in items)
    n_open = sum(1 for i in items if i["frontend_repo"])
    stats = (f"Interfaces: **{len(items)}**, with an open frontend: **{n_open}**, closed: **{len(items) - n_open}**. "
             f"Rating (fewer restrictions = better): A — {lv['A']}, B — {lv['B']}, C — {lv['C']}, D — {lv['D']}, n/a — {lv['n/a']}. "
             f"Legacy versions: {lc['legacy']}, defunct interfaces: {lc['defunct']}.")

    prov = Counter()
    for i in items:
        p = (i["screening"]["provider"] or "").lower()
        if i["screening"]["s"] not in ("yes", "reported"):
            continue
        for key, name in [("trm", "TRM Labs"), ("chainalysis", "Chainalysis"), ("elliptic", "Elliptic"),
                          ("hypernative", "Hypernative"), ("hermod", "Hermod/zeroShadow"), ("hackbounty", "HackBounty"),
                          ("hardcoded", "hardcoded list"), ("own", "own service"), ("unnamed", "undisclosed")]:
            if key in p:
                prov[name] += 1
    prov_line = ", ".join(f"{k} — {v}" for k, v in prov.most_common())

    out = (template.replace("{{MAIN_TABLE}}", main_table).replace("{{MECH_TABLE}}", mech_table)
           .replace("{{LIVE_TABLE}}", live_table).replace("{{STATS}}", stats).replace("{{PROVIDERS}}", prov_line))
    return out, stats, prov_line


def check_api_probes(iid, probes):
    """api_probes[]: {name, method, url, body?, headers?, note?, flags?[], rules?[{match, state, note?}]}, one per URL;
    {ip} in the URL is the proxy's exit IP at probe time."""
    if not isinstance(probes, list):
        raise Invalid(f"{iid}: api_probes must be a list")
    urls = set()
    for n, p in enumerate(probes):
        w = f"{iid}: api_probes[{n}]"
        if not isinstance(p, dict) or not isinstance(p.get("name"), str) or not p["name"]:
            raise Invalid(f"{w} needs a name")
        check_enum(w + ".method", p.get("method", "GET"), PROBE_METHODS)
        if not str(p.get("url", "")).startswith("https://"):
            raise Invalid(f"{w}.url must be an https URL")
        if p["url"] in urls:
            raise Invalid(f"{w}.url repeats another probe's URL (observations are keyed by URL)")
        urls.add(p["url"])
        if "body" in p and (p.get("method") != "POST" or not isinstance(p["body"], (dict, list))):
            raise Invalid(f"{w}.body is a JSON object or array, for POST only")
        if "headers" in p and not (isinstance(p["headers"], dict) and all(isinstance(k, str) and isinstance(x, str) for k, x in p["headers"].items())):
            raise Invalid(f"{w}.headers must be an object of strings")
        if not isinstance(p.get("flags", []), list) or not all(isinstance(f, str) for f in p.get("flags", [])):
            raise Invalid(f"{w}.flags must be a list of JSON paths or header:<name>")
        for k, rule in enumerate(p.get("rules", [])):
            if not isinstance(rule, dict) or not isinstance(rule.get("match"), str):
                raise Invalid(f"{w}.rules[{k}] needs a match regex")
            try:
                re.compile(rule["match"])
            except re.error as e:
                raise Invalid(f"{w}.rules[{k}].match: {e}")
            check_enum(f"{w}.rules[{k}].state", rule.get("state"), OBS_STATES)


# ----------------------------------------------------------------------------- observations (P3 probe)
OBS_REQUIRED = ("interface_id", "kind", "url", "country", "region", "proxy_type", "vantage", "at", "http_status", "final_url",
                "ui_state", "flags", "note")
OBS_UI_FIELDS = ("country", "region", "proxy_type", "at", "kind", "url", "http_status", "final_url", "ui_state", "flags", "note")


def load_observations(path, ids):
    """Read monitor/data/observations.json (written by probe.py merge). Returns a validated list."""
    if not path or not os.path.exists(path):
        return []
    with open(path, encoding="utf-8") as fh:
        store = json.load(fh, object_pairs_hook=OrderedDict)
    if store.get("schema_version") != 1:
        raise Invalid("observations: schema_version must be 1")
    obs = store.get("observations", [])
    for n, o in enumerate(obs):
        for k in OBS_REQUIRED:
            if k not in o:
                raise Invalid(f"observations[{n}]: missing {k}")
        if o["interface_id"] not in ids:
            raise Invalid(f"observations[{n}]: unknown interface {o['interface_id']}")
        check_enum(f"observations[{n}].kind", o["kind"], OBS_KINDS)
        check_enum(f"observations[{n}].ui_state", o["ui_state"], OBS_STATES)
        check_enum(f"observations[{n}].proxy_type", o["proxy_type"], PROXY_TYPES)
        check_tokens(f"observations[{n}].country", [o["country"]])
        if o["region"] is not None:
            check_tokens(f"observations[{n}].region", [o["region"]])
        if not isinstance(o["vantage"], dict) or "verified" not in o["vantage"]:
            raise Invalid(f"observations[{n}]: vantage.verified missing")
    return obs


probe_targets = observed.targets


def latest_observations(obs, targets=None):
    """Verified, non-error observations; the newest per (interface, country, region, proxy_type, kind, url).
    With targets, endpoint observations of URLs no longer probed are dropped: they would stay forever otherwise."""
    latest = observed.latest(obs, targets)
    by_iface = {}
    for key, o in sorted(latest.items(), key=lambda kv: (kv[0][0], kv[0][1], kv[0][2] or "", kv[0][4], kv[0][5], kv[0][3])):
        by_iface.setdefault(key[0], []).append(OrderedDict((f, o[f]) for f in OBS_UI_FIELDS))
    return by_iface


# ----------------------------------------------------------------------------- csv / ui
CSV_COLS = ["id", "name", "description", "category", "category_group", "chains", "chain_tags", "url", "frontend_repo", "repo_state", "repo_status",
            "repo_last_commit", "level", "restriction_count", "geo_site", "geo_site_countries", "geo_site_close_only", "geo_site_method",
            "geo_feature", "geo_feature_countries", "geo_feature_scope", "vpn", "vpn_note", "screening", "screening_provider",
            "screening_layer", "screening_fail", "screening_fail_note", "asset_filter", "tos_url", "tos_updated", "tos_us",
            "tos_us_scope", "tos_restricted", "tos_restricted_codes", "notes", "alternatives", "live",
            "evidence", "confidence", "kyc", "kyc_layer", "kyc_scope", "version", "lifecycle", "lifecycle_note", "family"]


def csv_row(i):
    # The version has its own CSV column; keep only the name and aka in the name column.
    return [i["id"], display_name({**i, "version": ""}), i["description"], i["category"], category_group(i), i["chains"], " ".join(chain_tags(i)), i["url"],
            i["frontend_repo"] or "", i["repo_state"], i["repo_status"], i["repo_last_commit"] or "", level(i), restrictions(i)["count"],
            i["geo_site"]["s"], " ".join(i["geo_site"]["countries"]), " ".join(i["geo_site"]["close_only"]), i["geo_site"]["method"],
            i["geo_feature"]["s"], " ".join(i["geo_feature"]["countries"]), i["geo_feature"]["scope"],
            i["vpn"]["s"], i["vpn"]["note"], i["screening"]["s"], i["screening"]["provider"], i["screening"]["layer"] or "",
            i["screening"]["fail"] or "", i["screening"]["fail_note"], i["asset_filter"], i["tos"]["url"] or "", i["tos"]["updated"],
            i["tos"]["us"], i["tos"]["us_scope"], i["tos"]["restricted"], " ".join(i["tos"]["restricted_codes"]),
            i["notes"], " | ".join(f"{a['name']} {a['url']}" for a in i["alternatives"]),
            " | ".join(i["live"]), " | ".join(i["evidence"]), i["confidence"],
            (i.get("kyc") or {}).get("s", ""), (i.get("kyc") or {}).get("layer") or "", (i.get("kyc") or {}).get("scope", ""),
            i.get("version", ""), lifecycle(i), i.get("lifecycle_note", ""), i.get("family", "")]


def load_collected(catalog_path, observations_path):
    """The collected data as every output sees it: the validated catalog with the countries the probe saw restricted added
    to each entry (observed.py; the catalog file itself is not touched, so a later run that sees a country open again
    simply stops adding it), and the validated observation store. Returns (data, observations, warnings, added)."""
    with open(catalog_path, encoding="utf-8") as fh:
        data = json.load(fh, object_pairs_hook=OrderedDict)
    try:
        warnings = validate(data)
        observations = load_observations(observations_path, {i["id"] for i in data["interfaces"]})
    except Invalid as e:
        sys.exit(f"invalid data: {e}")
    seen = observed.found(observations, probe_targets(data))
    items, added = [], OrderedDict()
    for i in data["interfaces"]:
        e, add = observed.apply(i, seen.get(i["id"], {}))
        items.append(e)
        if add:
            added[i["id"]] = add
    data = OrderedDict(data, interfaces=items)
    for i in items:
        if i["geo_site"]["s"] == "yes" and not i["geo_site"]["countries"] and not i["geo_site"]["close_only"]:
            warnings.append(f"{i['id']}: geo_site.s=yes but no countries listed or observed")
    return data, observations, warnings, added


def dump_json(obj, path):
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(obj, fh, ensure_ascii=False, indent=2)
        fh.write("\n")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("src")
    ap.add_argument("template")
    ap.add_argument("outdir")
    ap.add_argument("--export", help="write the files the web app loads (monitor.json, interfaces/<id>.json) into this directory, "
                                     "then compare them with the collected data")
    ap.add_argument("--chains", help="comma-separated chain tags to keep on the site, e.g. evm (report/CSV stay complete)")
    ap.add_argument("--observations", help="monitor/data/observations.json from probe.py (the latest verified ones go to the site; "
                                           "observed blocks are counted, see observed.py)")
    args = ap.parse_args()

    data, observations, warnings, added = load_collected(args.src, args.observations)
    items = data["interfaces"]
    for w in warnings:
        print(f"warning: {w}", file=sys.stderr)
    for iid, add in added.items():
        print(f"observed: {iid} " + "; ".join(f"{f}.{k} +{' '.join(t)}" for (f, k), t in add.items()))

    os.makedirs(args.outdir, exist_ok=True)
    with open(args.template, encoding="utf-8") as fh:
        template = fh.read()
    report, stats, prov_line = render_report(items, template)
    with open(os.path.join(args.outdir, "report.md"), "w", encoding="utf-8") as fh:
        fh.write(report)
    with open(os.path.join(args.outdir, "interfaces.csv"), "w", newline="", encoding="utf-8") as fh:
        # Match the repository's LF endings; csv defaults to CRLF and would rewrite every row on rebuild.
        w = csv.writer(fh, lineterminator="\n")
        w.writerow(CSV_COLS)
        for i in items:
            w.writerow(csv_row(i))
    if args.export:
        import check_export, export  # noqa: E402 - the site files are a separate stage with their own scripts
        chains = set(args.chains.split(",")) if args.chains else None
        monitor, entries, removed = export.write_site(data, observations, args.export, chains)
        print(f"site: {len(entries)} of {len(items)} interfaces -> {os.path.join(args.export, 'monitor.json')} + "
              f"{len(entries)} files in {os.path.join(args.export, 'interfaces')}/ ({monitor['meta']['scope']}; "
              f"defunct hidden: {len(monitor['meta']['defunct_hidden'])}" + (f"; {removed} stale removed" if removed else "") + ")")
        problems = check_export.check(args.src, args.observations, args.export, chains, quiet=True)
        if problems:
            print(f"export check: {len(problems)} mismatch(es) between the site files and the collected data", file=sys.stderr)
            for p in problems:
                print("  ! " + p, file=sys.stderr)
            sys.exit(1)
        print(f"export check: OK, the site files match the collected data ({sum(len(r['observed']) for r in monitor['interfaces'])} "
              f"country verdicts on the dashboard, {sum(len(e['observations']) for e in entries)} observations on the pages)")

    print(stats)
    print("providers:", prov_line)
    print("groups:", dict(Counter(category_group(i) for i in items)))
    print("tags:", dict(Counter(t for i in items for t in chain_tags(i))))
    if observations:
        lat = latest_observations(observations, probe_targets(data))
        print(f"observations: {len(observations)} stored, {sum(len(v) for v in lat.values())} latest verified across {len(lat)} interfaces")


if __name__ == "__main__":
    main()
