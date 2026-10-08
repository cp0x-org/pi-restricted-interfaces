#!/usr/bin/env python3
"""Validate monitor/data/interfaces.json (schema v2), compute derived fields and render outputs.

Usage:
  python3 -I monitor/scripts/build.py monitor/data/interfaces.json monitor/templates/report_template.md monitor/out \
      --ui src/data/interfaces.json

Outputs: <outdir>/report.md (Russian), <outdir>/interfaces.csv, and with --ui the dataset consumed by the web app
(entries + computed level / fork_ready / category_group / chain_tags, meta + regions). Deterministic: no timestamps.
Python >= 3.9, stdlib only.
"""
import argparse, csv, json, os, re, sys
from collections import Counter, OrderedDict

# ----------------------------------------------------------------------------- vocabularies
S_OK = ("yes", "no", "reported", "tos_only", "optional", "unknown")
LAYER_OK = (None, "edge", "frontend", "own-api", "protocol-api")
FAIL_OK = (None, "open", "closed", "unknown", "n/a")
VPN_OK = ("no", "tos_only", "detect", "block", "optional", "unknown")
REPO_OK = ("open", "open_stale", "closed", "private_now", "archived", "none_found")
TOS_US_OK = ("yes", "no", "partial", "unknown")
CONF_OK = ("high", "medium", "low")
GROUPS = ("dex", "aggregator", "perps", "lending", "staking", "yield", "rwa", "stablecoin", "bridge", "prediction", "wallet", "other")
TAGS = ("evm", "solana", "bitcoin", "sui", "starknet", "cosmos", "hyperliquid", "other")
COMPUTED = ("level", "fork_ready", "category_group", "chain_tags")
REQUIRED = ("id", "name", "description", "category", "chains", "url", "frontend_repo", "repo_state", "repo_status", "repo_last_commit",
            "networks", "geo_site", "geo_feature", "vpn", "screening", "asset_filter", "tos", "fork_notes", "live", "geo_endpoints",
            "evidence", "confidence", "alternatives")
OBS_STATES = ("ok", "blocked", "close_only", "feature_limited", "challenge", "error", "unknown")
OBS_KINDS = ("site", "geo_endpoint")
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

# Russian labels for report.md
S_RU = {"yes": "да", "no": "нет", "reported": "по отчётам", "tos_only": "только ToS", "optional": "опц.", "unknown": "?"}
LAYER_RU = {"edge": "edge/CDN", "frontend": "фронтенд", "own-api": "свой API", "protocol-api": "API протокола", None: "—"}
FORK_RU = {"yes": "да", "stale": "да, код устарел", "partial": "частично (API протокола)", "no_code": "нет кода"}
VPN_RU = {"no": "нет", "tos_only": "только ToS", "detect": "детект", "block": "блок", "optional": "опц.", "unknown": "?"}
US_RU = {"yes": "запрещено", "no": "нет", "partial": "частично", "unknown": "?"}


# ----------------------------------------------------------------------------- derived fields
def level(i):
    """D: site geo-block, screening in the protocol API, or an on-chain KYC allowlist (a fork can't bypass);
    C: wallet screening or KYC on the frontend / operator API; B: feature/asset-level, reported or optional;
    A: nothing found (A? when the code is closed); ?: no data."""
    g, f, s = i["geo_site"]["s"], i["geo_feature"]["s"], i["screening"]["s"]
    k = i.get("kyc") or {}
    closed = i["frontend_repo"] is None
    if g == "yes" or (s == "yes" and i["screening"]["layer"] == "protocol-api") or (k.get("s") == "yes" and k.get("layer") == "protocol-api"):
        return "D"
    if s in ("yes", "reported") or k.get("s") in ("yes", "reported"):
        return "C"
    if f == "yes" or g == "reported" or "optional" in (g, s):
        return "B"
    if closed and g == "unknown" and s == "unknown":
        return "?"
    return "A?" if closed else "A"


def fork_ready(i):
    if i["frontend_repo"] is None:
        return "no_code"
    k = i.get("kyc") or {}
    if (i["screening"]["s"] == "yes" and i["screening"]["layer"] == "protocol-api") or (k.get("s") == "yes" and k.get("layer") == "protocol-api"):
        return "partial"
    if i["repo_state"] in ("open_stale", "archived"):
        return "stale"
    return "yes"


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
        if gs["s"] == "yes" and not gs["countries"]:
            warnings.append(f"{iid}: geo_site.s=yes but no countries listed")
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
    s = S_RU[g["s"]]
    if g["s"] in ("yes", "reported") and g["countries"]:
        c = g["countries"]
        s += f" ({len(c)})" if len(c) > 3 else f" ({', '.join(c)})"
    if g["close_only"]:
        s += f" + close-only ({len(g['close_only'])})"
    return s


def with_note(label, note):
    return f"{label} ({note})" if note else label


def render_report(items, template):
    rows = ["| # | Интерфейс | Категория | URL | GitHub фронтенда | Гео: сайт | Гео: фичи/активы | Скрининг кошелька | VPN | ToS: US | Уровень |",
            "|---|---|---|---|---|---|---|---|---|---|---|"]
    for n, i in enumerate(items, 1):
        sc = i["screening"]
        scr = S_RU[sc["s"]]
        if sc["s"] in ("yes", "reported") and sc["layer"]:
            scr += f" ({LAYER_RU[sc['layer']]})"
        repo = md_link(i["frontend_repo"]) if i["frontend_repo"] else f"— *{i['repo_status']}*"
        us = with_note(US_RU[i["tos"]["us"]], i["tos"]["us_scope"])
        vpn = with_note(VPN_RU[i["vpn"]["s"]], i["vpn"]["note"])
        rows.append(f"| {n} | **{i['name']}** | {i['category']} | {md_link(i['url'])} | {repo} | {short_geo(i)} | "
                    f"{S_RU[i['geo_feature']['s']]} | {scr} | {vpn} | {us} | **{level(i)}** |")
    main_table = "\n".join(rows)

    mrows = ["| Интерфейс | Уровень | Где enforcement / механизм | Fail-mode | Форк | Заметка для форка | Доказательства |",
             "|---|---|---|---|---|---|---|"]
    for i in items:
        parts = []
        if i["geo_site"]["s"] not in ("no", "unknown") and i["geo_site"]["method"]:
            parts.append("Гео: " + i["geo_site"]["method"])
        if i["geo_feature"]["s"] not in ("no", "unknown") and i["geo_feature"]["scope"]:
            parts.append("Фичи: " + i["geo_feature"]["scope"])
        if i["screening"]["s"] not in ("no", "unknown") and i["screening"]["provider"]:
            parts.append("Скрининг: " + i["screening"]["provider"])
        if i["asset_filter"]:
            parts.append("Фильтр активов: " + i["asset_filter"])
        if i.get("kyc") and i["kyc"]["s"] not in ("no", "unknown"):
            parts.append("KYC: " + i["kyc"]["scope"])
        mech = "<br>".join(p.replace("|", "/") for p in parts) or "—"
        ev = "<br>".join(f"`{e}`" if not e.startswith("http") else f"[src]({e})" for e in i["evidence"][:4]) or "—"
        fail = with_note(i["screening"]["fail"], i["screening"]["fail_note"]) if i["screening"]["fail"] else "—"
        mrows.append(f"| **{i['name']}** | {level(i)} | {mech} | {fail} | {FORK_RU[fork_ready(i)]} | "
                     f"{i['fork_notes'].replace('|', '/')} | {ev} |")
    mech_table = "\n".join(mrows)

    lrows = ["| Интерфейс | Результат |", "|---|---|"]
    for i in items:
        for l in i["live"]:
            if any(k in l for k in ("SDN", "sanctioned", "geoblock", "restricted", "geo-config", "geo/country", "blacklisted", "screen")):
                lrows.append(f"| {i['name']} | {l} |")
    live_table = "\n".join(lrows)

    lv = Counter(level(i) for i in items)
    n_open = sum(1 for i in items if i["frontend_repo"])
    stats = (f"Всего интерфейсов: **{len(items)}**, с открытым фронтендом: **{n_open}**, закрытых: **{len(items) - n_open}**. "
             f"Уровни: D — {lv['D']}, C — {lv['C']}, B — {lv['B']}, A — {lv['A']}, A? — {lv['A?']}, ? — {lv['?']}.")

    prov = Counter()
    for i in items:
        p = (i["screening"]["provider"] or "").lower()
        if i["screening"]["s"] not in ("yes", "reported"):
            continue
        for key, name in [("trm", "TRM Labs"), ("chainalysis", "Chainalysis"), ("elliptic", "Elliptic"),
                          ("hypernative", "Hypernative"), ("hermod", "Hermod/zeroShadow"), ("hackbounty", "HackBounty"),
                          ("hardcoded", "статический список"), ("own", "собственный сервис"), ("unnamed", "не раскрыт")]:
            if key in p:
                prov[name] += 1
    prov_line = ", ".join(f"{k} — {v}" for k, v in prov.most_common())

    out = (template.replace("{{MAIN_TABLE}}", main_table).replace("{{MECH_TABLE}}", mech_table)
           .replace("{{LIVE_TABLE}}", live_table).replace("{{STATS}}", stats).replace("{{PROVIDERS}}", prov_line))
    return out, stats, prov_line


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


def latest_observations(obs):
    """Verified, non-error observations; the newest per (interface, country, region, proxy_type, kind, url)."""
    latest = OrderedDict()
    for o in obs:
        if not o["vantage"].get("verified") or o["ui_state"] == "error":
            continue
        key = (o["interface_id"], o["country"], o["region"], o["proxy_type"], o["kind"], o["url"])
        if key not in latest or o["at"] > latest[key]["at"]:
            latest[key] = o
    by_iface = {}
    for key, o in sorted(latest.items(), key=lambda kv: (kv[0][0], kv[0][1], kv[0][2] or "", kv[0][4], kv[0][5], kv[0][3])):
        by_iface.setdefault(key[0], []).append(OrderedDict((f, o[f]) for f in OBS_UI_FIELDS))
    return by_iface


# ----------------------------------------------------------------------------- csv / ui
CSV_COLS = ["id", "name", "description", "category", "category_group", "chains", "chain_tags", "url", "frontend_repo", "repo_state", "repo_status",
            "repo_last_commit", "level", "geo_site", "geo_site_countries", "geo_site_close_only", "geo_site_method",
            "geo_feature", "geo_feature_countries", "geo_feature_scope", "vpn", "vpn_note", "screening", "screening_provider",
            "screening_layer", "screening_fail", "screening_fail_note", "asset_filter", "tos_url", "tos_updated", "tos_us",
            "tos_us_scope", "tos_restricted", "tos_restricted_codes", "fork_ready", "fork_notes", "alternatives", "live",
            "evidence", "confidence", "kyc", "kyc_layer", "kyc_scope"]


def csv_row(i):
    return [i["id"], i["name"], i["description"], i["category"], category_group(i), i["chains"], " ".join(chain_tags(i)), i["url"],
            i["frontend_repo"] or "", i["repo_state"], i["repo_status"], i["repo_last_commit"] or "", level(i),
            i["geo_site"]["s"], " ".join(i["geo_site"]["countries"]), " ".join(i["geo_site"]["close_only"]), i["geo_site"]["method"],
            i["geo_feature"]["s"], " ".join(i["geo_feature"]["countries"]), i["geo_feature"]["scope"],
            i["vpn"]["s"], i["vpn"]["note"], i["screening"]["s"], i["screening"]["provider"], i["screening"]["layer"] or "",
            i["screening"]["fail"] or "", i["screening"]["fail_note"], i["asset_filter"], i["tos"]["url"] or "", i["tos"]["updated"],
            i["tos"]["us"], i["tos"]["us_scope"], i["tos"]["restricted"], " ".join(i["tos"]["restricted_codes"]),
            fork_ready(i), i["fork_notes"], " | ".join(f"{a['name']} {a['url']}" for a in i["alternatives"]),
            " | ".join(i["live"]), " | ".join(i["evidence"]), i["confidence"],
            (i.get("kyc") or {}).get("s", ""), (i.get("kyc") or {}).get("layer") or "", (i.get("kyc") or {}).get("scope", "")]


def ui_dataset(data, observations, ui_chains=None):
    """Dataset for the web app. With ui_chains (e.g. {"evm"}) only interfaces carrying one of those chain tags are exported;
    the report and CSV always cover the whole catalog."""
    meta = OrderedDict(data["meta"])
    meta["regions"] = OrderedDict(REGIONS)
    meta["catalog_total"] = len(data["interfaces"])
    meta["scope"] = "EVM networks only" if ui_chains == {"evm"} else ("chains: " + ", ".join(sorted(ui_chains)) if ui_chains else "all interfaces")
    by_iface = latest_observations(observations)
    items = []
    for i in data["interfaces"]:
        if ui_chains and not (set(chain_tags(i)) & ui_chains):
            continue
        e = OrderedDict(i)
        e["level"] = level(i)
        e["fork_ready"] = fork_ready(i)
        e["category_group"] = category_group(i)
        e["chain_tags"] = chain_tags(i)
        e["observations"] = by_iface.get(i["id"], [])
        items.append(e)
    return OrderedDict([("meta", meta), ("interfaces", items)])


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
    ap.add_argument("--ui", help="write the web app dataset (entries + computed fields) to this path")
    ap.add_argument("--ui-chains", help="comma-separated chain tags to keep in the UI dataset, e.g. evm (report/CSV stay complete)")
    ap.add_argument("--observations", help="monitor/data/observations.json from probe.py (latest verified ones go to the UI dataset)")
    args = ap.parse_args()

    with open(args.src, encoding="utf-8") as fh:
        data = json.load(fh, object_pairs_hook=OrderedDict)
    try:
        warnings = validate(data)
        observations = load_observations(args.observations, {i["id"] for i in data["interfaces"]})
    except Invalid as e:
        print(f"invalid data: {e}", file=sys.stderr)
        sys.exit(1)
    for w in warnings:
        print(f"warning: {w}", file=sys.stderr)
    items = data["interfaces"]

    os.makedirs(args.outdir, exist_ok=True)
    with open(args.template, encoding="utf-8") as fh:
        template = fh.read()
    report, stats, prov_line = render_report(items, template)
    with open(os.path.join(args.outdir, "report.md"), "w", encoding="utf-8") as fh:
        fh.write(report)
    with open(os.path.join(args.outdir, "interfaces.csv"), "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(CSV_COLS)
        for i in items:
            w.writerow(csv_row(i))
    if args.ui:
        ui_chains = set(args.ui_chains.split(",")) if args.ui_chains else None
        ui = ui_dataset(data, observations, ui_chains)
        dump_json(ui, args.ui)
        print(f"ui dataset: {len(ui['interfaces'])} of {len(items)} interfaces ({ui['meta']['scope']})")

    print(stats)
    print("providers:", prov_line)
    fr = Counter(fork_ready(i) for i in items)
    print("fork:", ", ".join(f"{k} — {fr[k]}" for k in ("yes", "stale", "partial", "no_code")))
    print("groups:", dict(Counter(category_group(i) for i in items)))
    print("tags:", dict(Counter(t for i in items for t in chain_tags(i))))
    if observations:
        lat = latest_observations(observations)
        print(f"observations: {len(observations)} stored, {sum(len(v) for v in lat.values())} latest verified across {len(lat)} interfaces")


if __name__ == "__main__":
    main()
