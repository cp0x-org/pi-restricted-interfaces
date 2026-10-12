"""Restrictions seen by the P3 probe (monitor/data/observations.json).

Shared by monitor/scripts/build.py (the site dataset, report and CSV) and research/combine.py (the table rebuilt from the
checks), so that both count the same countries.

A country, or a region such as US-NY, counts as restricted when the newest verified observation of one of the
interface's probe targets, from a residential, ISP, mobile or direct vantage, says blocked (site level), close_only or
feature_limited. Datacenter and Tor runs test VPN detection, not geography, so they never add a country. An "ok" never
removes a country: the probe fetches pages without JavaScript, so client-side gates are not evaluated.
"""
import copy
from collections import OrderedDict

ENFORCED = ("yes", "reported")
# ui_state -> where the token is counted in the catalog entry
FIELDS = OrderedDict([("blocked", ("geo_site", "countries")), ("close_only", ("geo_site", "close_only")),
                      ("feature_limited", ("geo_feature", "countries"))])
GEO_VANTAGES = ("residential", "isp", "mobile", "direct")


def targets(data):
    """{interface id: {(kind, url)}} of the endpoints the probe asks today; landing pages are always kept."""
    return {i["id"]: {("geo_endpoint", u) for u in i["geo_endpoints"]} | {("api", p["url"]) for p in i.get("api_probes", [])}
            for i in data["interfaces"]}


def latest(obs, probe_targets=None):
    """Verified, non-error observations; the newest per (interface, country, region, proxy_type, kind, url).
    With probe_targets, endpoint observations of URLs no longer probed are dropped: they would stay forever otherwise."""
    out = OrderedDict()
    for o in obs:
        if not o["vantage"].get("verified") or o["ui_state"] == "error":
            continue
        if probe_targets is not None and o["kind"] != "site" and (o["kind"], o["url"]) not in probe_targets.get(o["interface_id"], ()):
            continue
        key = (o["interface_id"], o["country"], o["region"], o["proxy_type"], o["kind"], o["url"])
        if key not in out or o["at"] > out[key]["at"]:
            out[key] = o
    return out


def found(obs, probe_targets=None):
    """{interface id: {(field, key): {token: newest restrictive observation}}} from geo vantages."""
    out = {}
    for o in sorted(latest(obs, probe_targets).values(), key=lambda o: o["at"]):
        if o["proxy_type"] not in GEO_VANTAGES or o["ui_state"] not in FIELDS:
            continue
        out.setdefault(o["interface_id"], OrderedDict()).setdefault(FIELDS[o["ui_state"]], OrderedDict())[o["region"] or o["country"]] = o
    return out


def additions(seen, have):
    """Tokens to add per (field, key) of FIELDS, given what the probe saw and what is already counted (have: same keys -> set).
    A country already listed as close-only stays close-only (the static data is finer than an HTTP probe), and a region
    is skipped when its whole country is counted."""
    gs, gc, gf = ("geo_site", "countries"), ("geo_site", "close_only"), ("geo_feature", "countries")
    whole = {gs[0]: have[gs] | have[gc] | set(seen.get(gs, ())) | set(seen.get(gc, ())),
             gf[0]: have[gf] | set(seen.get(gf, ()))}
    counted = {gs: have[gs] | have[gc] | set(seen.get(gc, ())), gc: have[gs] | have[gc], gf: have[gf]}
    out = OrderedDict()
    for fk in (gs, gc, gf):
        add = [t for t in seen.get(fk, ()) if t not in counted[fk] and not ("-" in t and t.split("-")[0] in whole[fk[0]])]
        if add:
            out[fk] = add
    return out


def apply(entry, seen):
    """Copy of a catalog entry with the observed restrictions added; a field gets s=yes when the probe adds to it."""
    have = {fk: set(entry[fk[0]][fk[1]]) if entry[fk[0]]["s"] in ENFORCED else set() for fk in FIELDS.values()}
    add = additions(seen, have)
    if not add:
        return entry, add
    e = OrderedDict(entry)
    for field in {fk[0] for fk in add}:
        e[field] = copy.deepcopy(entry[field])
        if e[field]["s"] not in ENFORCED:
            e[field]["s"] = "yes"
            for key in ("countries", "close_only"):
                if key in e[field]:
                    e[field][key] = []  # countries of a status that was not counted (tos_only, optional) stay out
    for (field, key), tokens in add.items():
        e[field][key] = e[field][key] + tokens
    return e, add
