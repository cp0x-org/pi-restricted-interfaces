#!/usr/bin/env python3
"""Per interface: the countries its Terms of Service name against the countries the probe saw restricted, as one table.

For every interface of the catalog (defunct entries left out):
  ToS        the country tokens read from the Terms (tos.restricted_codes in the catalog);
  probe      the countries and regions whose newest verified observation, from a home-network vantage, says blocked,
             close-only or feature-limited (monitor/scripts/observed.py, the same rule the rating uses);
  open       countries where every observation (landing page, geo endpoint, API) is "ok"; the rest of the probed
             countries are inconclusive (a Cloudflare page, an anti-bot challenge, a 403 without geo wording) and are
             shown with a ? next to the "not probed" ones.
Only the Terms and the probe are compared here; the code and documentation findings (geo_site.countries) are left out.

Usage (from pi-restrict-interface/):
  python3 -I monitor/scripts/tos_vs_probe.py monitor/data/interfaces.json monitor/data/observations.json monitor/out/tos_vs_probe.md
`pnpm monitor:build` writes the same file. Stdlib only; deterministic.
"""
import argparse, json, os, sys
from collections import OrderedDict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build, observed  # noqa: E402

STATE_LABEL = {"blocked": "blocked", "close_only": "close-only", "feature_limited": "feature-limited"}


def tokens_of(x):
    return " ".join(x if isinstance(x, list) else sorted(x)) if x else "—"


def rows(data, observations):
    targets = build.probe_targets(data)
    latest = observed.latest(observations, targets)
    seen = observed.found(observations, targets)
    by_iface = {}  # interface -> latest verified, non-error observations from a home-network vantage
    for o in latest.values():
        if o["proxy_type"] in observed.GEO_VANTAGES:
            by_iface.setdefault(o["interface_id"], []).append(o)
    out = []
    for i in data["interfaces"]:
        if build.lifecycle(i) == "defunct":
            continue
        tos = set(i["tos"]["restricted_codes"])
        found = OrderedDict()
        for (field, key), toks in seen.get(i["id"], {}).items():
            for t, o in toks.items():
                found.setdefault(t, STATE_LABEL[o["ui_state"]])
        probe = set(found)
        obs = by_iface.get(i["id"], [])
        reached = {o["region"] or o["country"] for o in obs}
        # open only when every answer from that country (landing page, geo endpoint, API) is "ok": a served landing page
        # next to an API that answered a Cloudflare page or a challenge is no proof of access
        open_ = {t for t in reached if all(o["ui_state"] == "ok" for o in obs if (o["region"] or o["country"]) == t)}
        # a region counts as covered by its country in the Terms (US-NY by US) and the other way round
        covered_by_tos = {t for t in probe if t in tos or t.split("-")[0] in tos}
        covered_by_probe = {t for t in tos if t in probe or any(p.split("-")[0] == t for p in probe)}
        only_tos = tos - covered_by_probe
        only_tos_open = {t for t in only_tos if t in open_}
        only_tos_unprobed = {t for t in only_tos - only_tos_open if t not in reached}
        only_tos_unclear = only_tos - only_tos_open - only_tos_unprobed
        only_probe = probe - covered_by_tos
        out.append(OrderedDict([
            ("id", i["id"]), ("name", build.display_name(i)), ("tos", tos), ("probe", found), ("reached", reached),
            ("landing_only", bool(obs) and all(o["kind"] == "site" for o in obs)),
            ("only_tos_open", only_tos_open), ("only_tos_unprobed", only_tos_unprobed), ("only_tos_unclear", only_tos_unclear),
            ("only_probe", only_probe),
        ]))
    return out


def render(table, generated):
    n_probe = sum(1 for r in table if r["reached"])
    n_more_tos = sum(1 for r in table if r["only_tos_open"])
    n_more_probe = sum(1 for r in table if r["only_probe"])
    n_match = sum(1 for r in table if r["reached"] and r["tos"] and not r["only_tos_open"] and not r["only_probe"])
    lines = ["# Terms of Service vs the probe: countries", "",
             f"Catalog of {generated}: {len(table)} interfaces, {n_probe} of them reached by the probe through a home-network "
             f"proxy. Of those, {n_match} match their Terms on every probed country, {n_more_tos} name countries in the Terms that "
             f"the probe found open, {n_more_probe} restrict countries their Terms do not name.", "",
             "How to read the columns: **ToS** — the countries the Terms of Service name (ISO codes; regions as `US-NY`); "
             "**probe** — the countries the probe saw restricted (`blocked`, `close-only` or `feature-limited`: the newest verified "
             "answer from a home-network vantage, per country); **in ToS, probe found open** — named in the Terms, probed, served "
             "(the restriction, if any, is enforced some other way or not at all); **in ToS, no answer** — named in the Terms but "
             "the probe never reached that country for this interface (no proxy exit, e.g. KP), or, with a `?`, reached it and got "
             "no verdict (a Cloudflare page, an anti-bot challenge, a 403 without geo wording); **only probe** — restricted live "
             "but not named in the Terms. "
             "A region is covered by its country in both directions (US-NY by US). An empty **probe** column with a probed count "
             "means the probe saw no restriction anywhere it looked; **landing page only** in the verdict means no geo endpoint or "
             "API of this interface is asked, and a served landing page proves little for apps that decide in JavaScript or in an "
             "API the probe does not ask.", "",
             "| Interface | ToS | probe (restricted) | probed | in ToS, probe found open | in ToS, no answer | only probe | verdict |",
             "|---|---|---|---|---|---|---|---|"]
    for r in table:
        probe = " ".join(f"{t}" + ("" if s == "blocked" else f" ({s})") for t, s in sorted(r["probe"].items())) or "—"
        if not r["reached"]:
            verdict = "not probed"
        elif not r["tos"] and not r["probe"]:
            verdict = "nothing on either side"
        elif r["only_tos_open"] and r["only_probe"]:
            verdict = "both directions differ"
        elif r["only_tos_open"]:
            verdict = f"ToS names more ({len(r['only_tos_open'])} open live)"
        elif r["only_probe"]:
            verdict = f"probe finds more ({len(r['only_probe'])} not in ToS)"
        elif r["tos"]:
            verdict = "match on the probed countries"
        else:
            verdict = "Terms name no country; probe restricts " + str(len(r["probe"]))
        no_answer = tokens_of(sorted(r["only_tos_unprobed"]) + sorted(t + "?" for t in r["only_tos_unclear"]))
        if r["landing_only"]:
            verdict += " — landing page only"
        lines.append(f"| {r['name']} (`{r['id']}`) | {tokens_of(r['tos'])} ({len(r['tos'])}) | {probe} ({len(r['probe'])}) | "
                     f"{len(r['reached'])} | {tokens_of(r['only_tos_open'])} | {no_answer} | {tokens_of(r['only_probe'])} | {verdict} |")
    lines += ["", "Generated by `monitor/scripts/tos_vs_probe.py` from `monitor/data/interfaces.json` and `monitor/data/observations.json`.", ""]
    return "\n".join(lines)


def write(data, observations, path):
    table = rows(data, observations)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(render(table, data["meta"].get("generated", "")))
    return table


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("catalog")
    ap.add_argument("observations")
    ap.add_argument("out", help="monitor/out/tos_vs_probe.md")
    args = ap.parse_args()
    data, observations, _, _ = build.load_collected(args.catalog, args.observations)
    table = write(data, observations, args.out)
    print(f"{len(table)} interfaces -> {args.out}")


if __name__ == "__main__":
    main()
