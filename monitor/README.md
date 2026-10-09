# monitor/ — data pipeline for the restrictions catalog

Source of truth: `data/interfaces.json` (schema v2, hand-maintained). Everything else is derived.

```
data/interfaces.json ──(build.py)──▶ src/data/interfaces.json   dataset imported by the web app: EVM interfaces only (--ui-chains evm), + computed level, restrictions, fork_ready, category_group, chain_tags, observations
                                 ▶ out/report.md               human-readable report (Russian)
                                 ▶ out/interfaces.csv          same table for spreadsheets
```

## Commands (from the project root)

```bash
pnpm monitor:build          # validate data (+ observations), regenerate src/data/interfaces.json, out/report.md, out/interfaces.csv
pnpm monitor:verify         # evidence paths exist in local clones, frontend repos reachable (needs network + repos/)
pnpm monitor:scan           # ripgrep the cloned frontends for geo/screening signals -> data/scan_raw.json
pnpm monitor:probe -- --countries UA,US   # P3: HTTP probe of every interface from those countries via a proxy -> probe/out/<run>.json
pnpm monitor:probe:merge -- probe/out/<run>.json   # append a run to data/observations.json
```

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
| `scripts/build.py` | validation (enums, ISO country tokens, repo consistency), derived fields, report/CSV/UI export |
| `scripts/scan.py` | static scan of cloned frontends |
| `scripts/verify.py` | evidence paths and repo reachability |
| `scripts/probe.py` | P3 per-country HTTP probe through a proxy (vantage verification, site + geo endpoints, `merge` into the store) |
| `data/observations.json` | append-only store of probe observations; `build.py` exports the latest verified ones to the site |
| `docs/probing.md` | how to buy and configure proxies, run the probe and read the results (Russian) |
| `templates/report_template.md` | report skeleton with `{{MAIN_TABLE}}`, `{{MECH_TABLE}}`, `{{LIVE_TABLE}}`, `{{STATS}}`, `{{PROVIDERS}}` |
| `prompts/auditor-agent.md` | prompt for the LLM auditor used in deep checks (schema of its JSON output) |
| `docs/roadmap.md` | monitor architecture and milestones M1–M4 (probes, proxies, mock wallet, scoring, alerts) |
| `out/` | generated snapshot of the report and CSV (always the full catalog, incl. non-EVM) |
| `archive/<date>/` | frozen copies of data, CSV, report and observations with a summary table (README.md) |

## Schema v2 (one entry)

- `id` (slug), `name`, `description` (one paragraph about what the protocol is, 80–600 chars; shown on the interface page and used for SEO), `description_zh` (optional Simplified Chinese version shown when the UI is in Chinese), `category` (free text), `chains` (free text), `networks[]` (EVM networks the official app lists; indicative, from app/docs), `url`
- `frontend_repo` (GitHub URL or null, may point at a monorepo subfolder), `repo_state` ∈ `open | open_stale | closed | private_now | archived | none_found`, `repo_status` (note), `repo_last_commit`
- `geo_site { s, countries[], close_only[], method }` — site-level geo-blocking
- `geo_feature { s, countries[], scope }` — feature / asset-level geo-gating
- `vpn { s ∈ no | tos_only | detect | block | optional | unknown, note }`
- `screening { s, provider, layer ∈ edge | frontend | own-api | protocol-api | null, fail ∈ open | closed | unknown | n/a | null, fail_note }`
- `asset_filter` (text)
- `tos { url, updated, us ∈ yes | no | partial | unknown, us_scope, restricted (text), restricted_codes[] }`
- `kyc { s, layer, scope }` (optional: KYC / accreditation / wallet allowlist; counts as one restriction)
- Versions (all optional): `version` (label shown after the name, e.g. `V3`, `V4 · Aave Pro`), `family` (shared id of all versions of one protocol, e.g. `aave`; the interface page links the other versions), `lifecycle ∈ current | legacy | defunct` (default `current`), `lifecycle_note` (required unless current: why, with a date or source). Every official interface of a protocol version is its own entry. `legacy` = still served but phased out by the protocol itself (deprecation notice, moved to a v2-/v3- subdomain, announced wind-down): listed at the bottom of the default order with a legacy chip. `defunct` = the official interface no longer works: kept in the catalog, report and CSV, never exported to the site.
- `fork_notes`, `live[]`, `geo_endpoints[]` (URLs whose response reveals the server-side geo verdict, probed by P3), `evidence[]`, `confidence ∈ high | medium | low`, `alternatives[] { name, url }`

Status vocabulary `s`: `yes` (confirmed by code, live check or official docs) · `no` · `reported` (press/users, not confirmed in code) · `tos_only` (reserved in the ToS, no enforcement found) · `optional` (in code, off by default) · `unknown`.

Country tokens: ISO 3166-1 alpha-2 codes, or sub-national regions as `CC-Name` (`UA-Crimea`, `US-NY`, `CA-ON`, …; the full list is `REGIONS` in `build.py`). Group words such as "EU/EEA" are expanded explicitly; "sanctioned jurisdictions" or "FATF high-risk" stay in the free-text fields.

Computed by `build.py` (never edit by hand): `level` (rating by number of technical restrictions (each blocked country/region once + one per feature gate, wallet screening, VPN detection, KYC; ToS-only terms not counted): A 0 (none), B 1–5, C 6–20, D > 20, n/a when nothing could be determined), `restrictions { count, countries, mechanisms[] }`, `fork_ready` (yes / stale / partial / no_code), `category_group`, `chain_tags`, `observations[]` (latest verified probe results per country / proxy type / target).

## Adding or updating an interface

Step-by-step guide with a JSON template (Russian): [`ADD_PROTOCOL.md`](ADD_PROTOCOL.md).


1. Edit `data/interfaces.json` (keep every claim backed by an `evidence` entry: repo-relative path, URL, or `owner/repo: path`).
2. `pnpm monitor:build` — fails on schema errors, prints the rating distribution.
3. Review `out/report.md` and the diff of `src/data/interfaces.json`, then `pnpm build` for the site.
