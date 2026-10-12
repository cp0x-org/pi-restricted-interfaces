# monitor/ — data pipeline for the restrictions catalog

Source of truth: `data/interfaces.json` (schema v2, hand-maintained). Everything else is derived.

```
data/interfaces.json ──(build.py)──▶ out/report.md, out/interfaces.csv   the whole catalog, derived (observed blocks counted)
+ data/observations.json  └(export.py)─▶ src/data/monitor.json          the dashboard: one row per interface (EVM interfaces, plus apps whose networks[] lists EVM networks, --chains evm) with the statuses, country lists, rating, restriction count and per country the probe verdict
                                       src/data/interfaces/<id>.json   one file per interface for its page: the whole entry + computed fields + every latest verified observation
                          └(check_export.py)─▶ the site files compared with the collected data; a mismatch fails the build
                                 ▶ out/report.md               human-readable report
                                 ▶ out/interfaces.csv          same table for spreadsheets
```

## Commands (from the project root)

```bash
pnpm monitor:sync           # no checks, no network: merge new probe runs from probe/out/ into data/observations.json, then monitor:build
pnpm monitor:build          # validate data (+ observations, observed blocks counted), regenerate out/report.md, out/interfaces.csv and the site files in src/data, then check them
pnpm monitor:export         # only the site files (src/data/monitor.json, src/data/interfaces/<id>.json)
pnpm monitor:check          # only the check: ratings, counts, country lists and probe verdicts of the site files vs the collected data
pnpm monitor:tos            # only out/tos_vs_probe.md: Terms vs probe, per interface
pnpm monitor:verify         # evidence paths exist in local clones, frontend repos reachable (needs network + repos/)
pnpm monitor:scan           # ripgrep the cloned frontends for geo/screening signals -> data/scan_raw.json
pnpm monitor:probe                        # P3: HTTP probe of every interface from the countries of data/countries.json via a proxy -> probe/out/<run>.json
pnpm monitor:probe -- --countries UA,US   # the same from chosen countries (groups: popular, regions, sanctioned)
pnpm monitor:probe:merge -- probe/out/<run>.json   # append one run to data/observations.json (monitor:sync does this for every new run)
pnpm monitor:update:dry     # run every research check, show what would change in the catalog and the table
pnpm monitor:update         # publish a version: checks -> sync country lists -> build -> current/, previous one to archive/<scanned>_<archived>/
```

How to update the site and read the history: [`docs/updating.md`](docs/updating.md).

To check the published numbers against their primary sources, use [`../research/`](../research/README.md)
(`pnpm research:all`): one check per counted restriction, rebuilt into the same table and compared with
`src/data/monitor.json`. Change `data/interfaces.json` and the matching `research/checks/<id>.json` together.

Proxies for `monitor:probe` are configured through `PROBE_PROXY_URL` (template with `{cc}`), see `docs/probing.md` for providers,
pricing, credentials format and the full workflow.

Requirements: Python ≥ 3.9 (standard library only), `rg` (ripgrep) for `monitor:scan`, `git` for `monitor:verify`.
Python is a maintainer tool only; `pnpm build` never runs it. Commit the regenerated files together with the data change.

Clone the frontends before scanning or verifying:

```bash
git clone --depth 1 --filter=blob:limit=400k https://github.com/<owner>/<repo> monitor/repos/<owner>_<repo>
```

`repos/` is git-ignored.

## Layout

| Path | What |
|---|---|
| `data/interfaces.json` | the catalog (57 interfaces), schema v2 |
| `data/scan_raw.json` | raw ripgrep hits from the last static scan (candidates, not findings) |
| `scripts/build.py` | validation (enums, ISO country tokens, repo consistency), derived fields, report and CSV; with `--export` it runs the two scripts below |
| `scripts/export.py` | the files the site loads: `src/data/monitor.json` (dashboard rows) and `src/data/interfaces/<id>.json` (one record per page) |
| `scripts/check_export.py` | recomputes ratings, counts, country lists and probe verdicts from the collected data and compares them with the site files (`pnpm monitor:check`) |
| `scripts/tos_vs_probe.py` | `out/tos_vs_probe.md`: per interface, the countries the Terms name against the countries the probe saw restricted, and the differences in both directions (`pnpm monitor:tos`, also written by the build) |
| `scripts/scan.py` | static scan of cloned frontends |
| `scripts/verify.py` | evidence paths and repo reachability |
| `scripts/probe.py` | P3 per-country HTTP probe through a proxy (vantage verification, site + geo endpoints, `merge` into the store) |
| `scripts/observed.py` | which countries the probe saw restricted; `build.py` and `research/combine.py` count them the same way |
| `scripts/sync.py` | `monitor:sync`: merge new probe runs, then `monitor:build`; no checks, no network |
| `data/observations.json` | append-only store of probe observations; `export.py` puts the latest verified ones on the site (one verdict per country on the dashboard, every observation on the interface page) |
| `docs/probing.md` | how to buy and configure proxies, run the probe and read the results |
| `templates/report_template.md` | report skeleton with `{{MAIN_TABLE}}`, `{{MECH_TABLE}}`, `{{LIVE_TABLE}}`, `{{STATS}}`, `{{PROVIDERS}}` |
| `prompts/auditor-agent.md` | prompt for the LLM auditor used in deep checks (schema of its JSON output) |
| `docs/roadmap.md` | monitor architecture and milestones M1–M4 (probes, proxies, mock wallet, scoring, alerts) |
| `out/` | generated snapshot of the report and CSV (always the full catalog, incl. non-EVM) |
| `current/` | the version the site shows: VERSION.json, CHANGES.md, the table rebuilt from the checks, check results, evidence, check definitions and a copy of the catalog (written by `scripts/update.py`) |
| `archive/<scanned>_<archived>/` | previous versions, same layout; `2026-10-08_2026-10-11/` is the pre-check snapshot (old rating scale) |
| `scripts/update.py` | publishes a version: research checks, sync of country lists, build, rotation of `current/` into `archive/` |

## Schema v2 (one entry)

- `id` (slug), `name`, `description` (one paragraph about what the protocol is, 80–600 chars; shown on the interface page and used for SEO), `description_zh` (optional Simplified Chinese version shown when the UI is in Chinese), `category` (free text), `chains` (free text), `networks[]` (EVM networks the official app lists; indicative, from app/docs); a non-empty list also puts an app on its own chain on the site, `url`, `referral_url` (optional: where the official-app link goes when it differs from `url`, such as a cp0x referral link; the link text, search and probes keep `url`)
- `frontend_repo` (GitHub URL or null, may point at a monorepo subfolder), `repo_state` ∈ `open | open_stale | closed | private_now | archived | none_found`, `repo_status` (note), `repo_last_commit`
- `geo_site { s, countries[], close_only[], method }` — site-level geo-blocking
- `geo_feature { s, countries[], scope }` — feature / asset-level geo-gating
- `vpn { s ∈ no | tos_only | detect | block | optional | unknown, note }`
- `screening { s, provider, layer ∈ edge | frontend | api | contract | null, fail ∈ open | closed | unknown | n/a | null, fail_note }`
- `asset_filter` (text)
- `tos { url, updated, us ∈ yes | no | partial | unknown, us_scope, restricted (text), restricted_codes[] }`
- `kyc { s, layer, scope }` (optional: KYC / accreditation / wallet allowlist; counts as one restriction)
- Versions (all optional): `version` (label shown after the name, e.g. `V3`), `aka` (second name: former name `ex-Maker`, parent brand `0x` or product `Aave Pro`; shown in grey next to the name on the site, in parentheses in page titles and the report; keep `name` and `version` free of it), `family` (shared id of all versions of one protocol, e.g. `aave`; the interface page links the other versions), `lifecycle ∈ current | legacy | defunct` (default `current`), `lifecycle_note` (required unless current: why, with a date or source). Every official interface of a protocol version is its own entry. `legacy` = still served but phased out by the protocol itself (deprecation notice, moved to a v2-/v3- subdomain, announced wind-down): listed at the bottom of the default order with a legacy chip. `defunct` = the official interface no longer works: kept in the catalog, report and CSV, never exported to the site.
- `notes` (how the restrictions are implemented: services, config, code status), `live[]`, `geo_endpoints[]` (URLs whose response reveals the server-side geo verdict, probed by P3), `api_probes[]` (optional: the protocol's own geo-check or read-only API asked from every country, `{ name, method GET|POST, url, body?, note, flags[], rules[{ match, state, note }] }`, see `docs/probing.md` 4a), `evidence[]`, `confidence ∈ high | medium | low`, `alternatives[] { name, url }`

Status vocabulary `s`: `yes` (confirmed by code, live check or official docs) · `no` · `reported` (press/users, not confirmed in code) · `tos_only` (reserved in the ToS, no enforcement found) · `optional` (in code, off by default) · `unknown`.

Country tokens: ISO 3166-1 alpha-2 codes, or sub-national regions as `CC-Name` (`UA-Crimea`, `US-NY`, `CA-ON`, …; the full list is `REGIONS` in `build.py`). Group words such as "EU/EEA" are expanded explicitly; "sanctioned jurisdictions" or "FATF high-risk" stay in the free-text fields.

Computed by `build.py` (never edit by hand): `level` (rating by number of technical restrictions (each blocked country/region once + one per feature gate, wallet screening, VPN detection, KYC; ToS-only terms not counted): A 0 (none), B 1–5, C 6–20, D > 20, n/a when nothing could be determined), `restrictions { count, countries, mechanisms[] }`, `category_group`, `chain_tags`, `observations[]` (latest verified probe results per country / proxy type / target).

## Adding or updating an interface

Step-by-step guide with a JSON template: [`ADD_PROTOCOL.md`](ADD_PROTOCOL.md).


1. Edit `data/interfaces.json` (keep every claim backed by an `evidence` entry: repo-relative path, URL, or `owner/repo: path`).
2. `pnpm monitor:build` — fails on schema errors, prints the rating distribution.
3. Review `out/report.md` and the diff of `src/data/` (the check at the end of the build must say OK), then `pnpm build` for the site.
