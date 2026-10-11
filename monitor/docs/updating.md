# How to update the site's data and keep a history

## In short

```bash
pnpm monitor:update:dry   # 1. see what changed without writing anything
pnpm monitor:update       # 2. publish a new version
# 3. read monitor/current/CHANGES.md and go through "Needs manual review" if it is not empty
pnpm build                # 4. build the site
git add monitor research src/data package.json && git commit         # 5. save
```

The proxy for the live checks comes from `research/.env` or `.env.probe` (see `research/.env.example`). Without a proxy
the live checks use the last recorded observation and are marked `REC`; the version is published anyway.

## What `pnpm monitor:update` does

The script `monitor/scripts/update.py`:

1. **Checks and sweeps.** Runs `research/run_all.py --refresh`: the claim checks from `research/checks/` go to their
   sources again, and the sweeps cover every interface: the JavaScript of every site, the answers from several
   countries through the proxy, the code of every open repository, the Terms of everyone who publishes them. Files at
   pinned commits and Wayback snapshots come from the cache, because they do not change. A full run takes about
   20–25 minutes with the default 20 countries.
2. **Sync.** If all the checks a country list is read from (for example, an array of countries in the code or a table
   in a help article) passed and the list in the source differs from the catalog, the new list is written to
   `monitor/data/interfaces.json`. Added and removed countries go into `CHANGES.md`. Nothing else changes
   automatically: a failed, unreachable or skipped check leaves the catalog alone and goes to "Needs manual review".
   A failure can mean the restriction was lifted, or that the page moved. A person decides.
3. **Build.** Sets `meta.generated` = the scan date (the site shows it as the date of the data) and runs the same
   command as `pnpm monitor:build`: `src/data/interfaces.json` (what the site shows) and `monitor/out/` are updated.
4. **Comparison.** Rebuilds the table from the checks and compares it with the site's new data
   (`same rating and count as the site: N of 64`).
5. **Version.** The current version `monitor/current/` moves to `monitor/archive/<scan date>_<date moved>/`, and the
   new run is written to `monitor/current/`.

`--dry-run` runs steps 1–2 and prints what would change without writing anything. `--no-sync` publishes a version
without touching the catalog. `--reuse` does not rerun the checks but takes `research/out/` of the last run.

## Where things are

| Path | What it is |
|---|---|
| `monitor/data/interfaces.json` | the catalog the site is built from (texts, descriptions, statuses, country lists) |
| `src/data/interfaces.json` | the data the site shows; generated, never edited by hand |
| `monitor/current/` | the current version: what is on the site now, with all the evidence |
| `monitor/archive/<from>_<to>/` | past versions: "from" is when they were scanned, "to" is when a new one replaced them |
| `research/checks/` | check definitions |
| `research/out/`, `research/.cache/` | working files of the last run and the cache; not in git |

Inside each version:

| File | What is inside |
|---|---|
| `VERSION.json` | the scan date (`scanned_at`), the date it was archived (`archived_at`), how many interfaces were reproduced, check outcomes by type, the commit the run was made from |
| `CHANGES.md` | what changed since the previous version: ratings and countries, what was written to the catalog, which checks and sweeps changed their result (a block from a new country, a new signal in the JS, other countries in the Terms), what needs review, sweep findings, what could not be checked |
| `table.csv`, `report.md` | the table built from the checks and the report with the link and the matched text of every check |
| `results/` | raw results of the five scripts |
| `evidence/` | what each check saw: code lines, page text, API answers, the proxy vantage |
| `checks/` | a copy of the check definitions the version was made with |
| `catalog/` | the catalog (`interfaces.json`, `observations.json`) and the site's report and CSV (`report.md`, `interfaces.csv`) at the time of the version |

The folder `monitor/archive/2026-10-08_2026-10-11/` is the snapshot from before the checks existed, on the old rating
scale.

## How to read the history

- Changes of one version: `monitor/current/CHANGES.md` or `monitor/archive/<folder>/CHANGES.md`.
- Changes of one interface over time: the row with its `id` in `table.csv` of each version, for example
  `grep '^polymarket,' monitor/archive/*/table.csv monitor/current/table.csv`.
- What exactly changed in a source: `evidence/<interface>/<check>.txt` of two versions (`diff -r`).
- Who changed the catalog by hand and when: `git log -p monitor/data/interfaces.json`.

## What to do with "Needs manual review"

| Item | What it means | What to do |
|---|---|---|
| `fail — not found: …` | the source no longer contains the phrase the claim rests on | open the source (`source` in `research/out/<type>.json`) and the `evidence`. If the restriction was lifted, fix the status or the list in `monitor/data/interfaces.json` and remove or change the check. If only the wording changed, fix the regular expression in `research/checks/<id>.json` |
| `error — HTTP 403/5xx/timeout` | the source did not answer | rerun later; if the site is closed to scripts, add `source.archive` (a Wayback snapshot) to the check |
| `skip — no proxy` | there is no proxy for the country of a live check | set `PROBE_PROXY_URL`; without it the recorded observation counts |
| `… is counted on the site, but no check supports it` | the claim affects the rating, but no check covers it | add a check or remove the claim from the catalog |

### Sweep findings

The section "Found by the sweeps but not explained by the site's data" lists leads; they do not change the rating.
For each one open `research/out/evidence/<interface>/sweep-*.txt` (it has the file, the line and the code snippet,
or the answer from a country) and decide:

| What was found | What to do |
|---|---|
| a real restriction (blocking code, a screening call, a block from a country) | write it to `monitor/data/interfaces.json` and add a claim check to `research/checks/<id>.json` (usually `bundle` with the same string, or `live` from that country) |
| unrelated code (a third-party SDK, the Terms text inside the bundle, a generated API client) | exclude it: `skip_scripts` for a bundle check, `ignore` for a code check, `targets.code_ignore` with `code_ignore_why` for the code sweep; give the reason in `about` |
| a block by the network (an empty page from a different server) | not a restriction of the interface; record it in `targets.network_blocks` with the reason so it stops showing up |

"Could not be checked" lists sources that exist but the scripts cannot read (anti-bot, PDF). They repeat from version
to version and need no action; if the site gets a readable copy (a repository, an archive), it can be given in
`targets.terms_fallback` or in the check.

After the fixes, rerun `pnpm monitor:update:dry`, and publish the version when the section is empty. Publishing again
on the same day also creates an archive (`2026-10-18_2026-10-18`, with `-2` added when the name is taken), so look at
`--dry-run` first.

## A new protocol or a change to an existing one

1. Edit `monitor/data/interfaces.json` (`monitor/ADD_PROTOCOL.md`).
2. Add or change `research/checks/<id>.json` and test it: `python3 -I research/check_docs.py --only <id> -v`
   (or the script for the check's type).
3. `pnpm monitor:update`: the version records the edit, and `CHANGES.md` shows the change of the rating.

## How often

Once a week is enough: a run takes about 20–25 minutes (the first one longer, while the repository archives are
downloaded, about 1.4 GB of cache), and the proxy traffic is about 8 MB per country. The more often it runs, the more
precise the "from" and "to" dates in the archive.
