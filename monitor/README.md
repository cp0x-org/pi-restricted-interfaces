# monitor/ — data pipeline for the restrictions catalog

Source of truth: `data/interfaces.json` (schema v2, hand-maintained). Everything else is derived.

```
data/interfaces.json ──(build.py)──▶ src/data/interfaces.json   dataset imported by the web app (+ computed level, fork_ready, category_group, chain_tags)
                                 ▶ out/report.md               human-readable report (Russian)
                                 ▶ out/interfaces.csv          same table for spreadsheets
```

## Commands (from the project root)

```bash
pnpm monitor:build    # validate data, regenerate src/data/interfaces.json, out/report.md, out/interfaces.csv
pnpm monitor:verify   # evidence paths exist in local clones, frontend repos reachable (needs network + repos/)
pnpm monitor:scan     # ripgrep the cloned frontends for geo/screening signals -> data/scan_raw.json
```

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
| `templates/report_template.md` | report skeleton with `{{MAIN_TABLE}}`, `{{MECH_TABLE}}`, `{{LIVE_TABLE}}`, `{{STATS}}`, `{{PROVIDERS}}` |
| `prompts/auditor-agent.md` | prompt for the LLM auditor used in deep checks (schema of its JSON output) |
| `docs/roadmap.md` | monitor architecture and milestones M1–M4 (probes, proxies, mock wallet, scoring, alerts) |
| `out/` | generated snapshot of the report and CSV |

## Schema v2 (one entry)

- `id` (slug), `name`, `category` (free text), `chains` (free text), `url`
- `frontend_repo` (GitHub URL or null, may point at a monorepo subfolder), `repo_state` ∈ `open | open_stale | closed | private_now | archived | none_found`, `repo_status` (note), `repo_last_commit`
- `geo_site { s, countries[], close_only[], method }` — site-level geo-blocking
- `geo_feature { s, countries[], scope }` — feature / asset-level geo-gating
- `vpn { s ∈ no | tos_only | detect | block | optional | unknown, note }`
- `screening { s, provider, layer ∈ edge | frontend | own-api | protocol-api | null, fail ∈ open | closed | unknown | n/a | null, fail_note }`
- `asset_filter` (text)
- `tos { url, updated, us ∈ yes | no | partial | unknown, us_scope, restricted (text), restricted_codes[] }`
- `fork_notes`, `live[]`, `evidence[]`, `confidence ∈ high | medium | low`, `alternatives[] { name, url }`

Status vocabulary `s`: `yes` (confirmed by code, live check or official docs) · `no` · `reported` (press/users, not confirmed in code) · `tos_only` (reserved in the ToS, no enforcement found) · `optional` (in code, off by default) · `unknown`.

Country tokens: ISO 3166-1 alpha-2 codes, or sub-national regions as `CC-Name` (`UA-Crimea`, `US-NY`, `CA-ON`, …; the full list is `REGIONS` in `build.py`). Group words such as "EU/EEA" are expanded explicitly; "sanctioned jurisdictions" or "FATF high-risk" stay in the free-text fields.

Computed by `build.py` (never edit by hand): `level` (A / A? / B / C / D / ?), `fork_ready` (yes / stale / partial / no_code), `category_group`, `chain_tags`.

## Adding or updating an interface

1. Edit `data/interfaces.json` (keep every claim backed by an `evidence` entry: repo-relative path, URL, or `owner/repo: path`).
2. `pnpm monitor:build` — fails on schema errors, prints the level distribution.
3. Review `out/report.md` and the diff of `src/data/interfaces.json`, then `pnpm build` for the site.
