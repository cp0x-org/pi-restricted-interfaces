# research/ — independent check of the restrictions table

This folder lets anyone rebuild the table from [restricted.cp0x.com/monitor](https://restricted.cp0x.com/monitor)
(the A–D rating and the number of restrictions of every interface) from primary sources, without looking at the
site's data, and look for restrictions the site does not know about. The scripts go to the sources themselves, print
what they found and keep the evidence. Then `combine.py` computes the rating with the same rules as the site, compares
it with what is published and lists everything the sources show that the published data does not explain.

How the data is collected, what counts as evidence, which proxies and addresses are used and what the checks do not
prove is described in [METHODOLOGY.md](METHODOLOGY.md).

## Two kinds of checks

**Sweeps run for every interface that has something to check.** Every interface has an app URL, so every interface
gets its production HTML and JavaScript searched and its app requested from several countries. An interface with an
open repository gets its source code searched; one that publishes Terms gets them read; one with a known public
screening API gets it called. A sweep is missing only when there is nothing to check (no open repository, no Terms,
no known public API), and `combine.py` shows that in a coverage matrix.

| Sweep | For | What it does |
|---|---|---|
| app JavaScript (`check_bundle.py`) | all 64 interfaces | downloads the app's HTML, every script and the lazily loaded chunks, searches them for restriction signals (geo-IP services, country headers, geo endpoints, blocking texts, the sanctions oracle, screening vendors and calls, VPN detection, KYC vendors) |
| live (`check_live.py`) | all 64 interfaces | requests the app and its geo endpoints from this machine and through a proxy in each of several countries, compares the answers: a block, an anti-bot challenge, an empty page from a different server (a block by the network, nginx or the CDN) or different JavaScript for one country |
| code (`check_code.py`) | the 30 interfaces with an open repository | searches every source file at a pinned commit for the same signals |
| Terms (`check_docs.py`) | the 54 interfaces that publish Terms | reads the Terms, picks the restricted-jurisdiction paragraphs, reads the countries and flags the clauses (geofencing, VPN, sanctions, wallet screening, US persons, KYC) |

**Claim checks confirm what the site counts.** Every restriction that counts towards the rating is written down as a
check: where the primary source is and **what** must be in it if the claim is true (`expect`: a phrase or a line of
code; `section`: where to read the list of countries from). Most claims are confirmed twice: in the source code at a
pinned commit and in the JavaScript the site serves today, plus by a public API or a request from the country where
there is one.

The scripts **do not read** `monitor/data/interfaces.json` or `src/data/interfaces.json`. The site's data is opened by
`combine.py` alone, and only at the very end, to compare.

`expect` is not the answer the script is supposed to produce, it is a criterion: which text in the source confirms the
claim. For example, "Ambient blocks 21 countries at the CDN level" becomes "`netlify.toml` at commit `90e569a` has a
`/* → /blocked.html` rule with a `Country` condition; the countries are the codes in that rule". Possible outcomes:

- the source still says it — `PASS`, and the countries are read from the source **again**. If the list in the source
  has changed, it shows at once;
- the source no longer says it — `FAIL`, the claim is not counted, the rating in the table drops and differs from the
  site: a signal to look into it;
- the source is unavailable — `ERR`/`SKIP`, the claim is not counted either.

Sweeps find what claim checks cannot: a mechanism nobody has recorded yet. They do not change the rating; their
findings go to a review list (`research/out/report.md`, `monitor/current/CHANGES.md`) for a person to confirm, after
which the restriction is added to the catalog together with a claim check.

## Quick start

You need Python 3.9+ (standard library only: nothing to install) and an internet connection; `curl` (present on every
Mac and Linux) is used only for sites that require TLS 1.3, which the macOS system Python cannot speak. Node, a
browser, git, tokens and AI are not needed. For the live sweep from other countries you need a proxy (see
`research/.env.example`); without one it runs from this machine only. Run the commands from the project root
`pi-restrict-interface/`.

```bash
python3 -I research/run_all.py --csv      # same as: pnpm research:all
```

| File | Contents |
|---|---|
| `research/out/table.csv` | the table as on `/monitor` plus coverage: rating, number of restrictions, countries, mechanisms, statuses, what each sweep saw, comparison with the site, items to review |
| `research/out/report.md` | the same table, the coverage matrix, and per interface: items to review, sweep results, every claim check with its link and matched text |
| `research/out/<type>.json`, `<type>.md` | the results of each script separately |
| `research/out/evidence/<interface>/<check>.txt` | what the script saw: code lines, page text, API response, proxy vantage, the list of downloaded scripts |

The output ends with `same rating and count as the site: N of 64` and the list of sweep findings to review.

Publishing a new version of the site's data, with history and an archive, is done by `pnpm monitor:update`:
[`monitor/docs/updating.md`](../monitor/docs/updating.md).

## Scripts

| Script | Sweep | Claim checks (type in `checks/*.json`) | Where it goes | Output |
|---|---|---|---|---|
| `check_code.py` | every open repository | `code` (one file at a pinned commit), `code-scan` (the whole repository must or must not contain something) | `raw.githubusercontent.com`, `codeload.github.com` | `out/code.*` |
| `check_bundle.py` | every app | `bundle` (the production JavaScript must or must not contain something) | the app's HTML and scripts; through a proxy if unreachable from here | `out/bundle.*` |
| `check_docs.py` | every published Terms | `page` (docs, help center, Terms, press) | the page; a proxy, the repository copy, the Wayback Machine or the app's JavaScript as fallbacks | `out/docs.*` |
| `check_api.py` | — (the claim checks are the sweep: every known public screening API) | `api` (a sanctioned and a control wallet must be treated differently) | the interface's API + an Ethereum RPC (Chainalysis oracle) | `out/api.*` |
| `check_live.py` | every app, from this machine and every proxy country | `live` (one URL from one country) | through the proxy; without one, recorded observations | `out/live.*` |
| `combine.py` | — | — | reads `out/*.json` and `src/data/interfaces.json` | `out/report.md`, `out/table.csv` |
| `run_all.py` | runs everything in order | | | |

Shared code lives in `lib/`: `net.py` (HTTP, proxy, cache, Wayback, curl fallback), `text.py` (HTML → text),
`countries.py` (dictionary of countries and regions), `signals.py` (restriction signals for the sweeps), `common.py`
(loading checks, matching, output).

## Running one script at a time

```bash
python3 -I research/check_code.py                    # pnpm research:code
python3 -I research/check_bundle.py                  # pnpm research:bundle
python3 -I research/check_docs.py                    # pnpm research:docs
python3 -I research/check_api.py                     # pnpm research:api
python3 -I research/check_live.py                    # pnpm research:live
python3 -I research/combine.py --csv                 # pnpm research:combine
```

Useful flags:

| Flag | What it does |
|---|---|
| `--only sky,ethena` | only these interfaces; the results of the others from the previous run are kept |
| `--no-sweep` | only the claim checks (code, bundle, docs, live) |
| `-v` | show every matched line or signal, not only the first / the strong ones |
| `--refresh` | ignore the cache and download everything again (by default responses stay cached for 12 hours, files at a pinned commit and Wayback snapshots forever) |
| `check_code.py --head` | read the current default branch instead of the pinned commit: shows whether the code has changed |
| `check_docs.py --archive` | read the Wayback snapshots first, i.e. exactly the text the catalog was built from |
| `check_bundle.py --via-country US`, `check_docs.py --via-country US` | proxy country for sources unreachable from this machine (default US) |
| `check_live.py --countries US,GB,DE` | countries of the live sweep (default: 20 countries of the research plan's first wave, about 8 MB of proxy traffic each; or `$PROBE_COUNTRIES`) |
| `check_live.py --no-recorded` | do not fall back to recorded observations when there is no proxy |
| `combine.py --csv path.csv` | write the CSV elsewhere; `--scope all` adds interfaces that are not on the site |

## How to read the output

Sweeps print one line per interface:

```
SCAN Euler                     77 scripts   3.8 MB  geo: country header, geo: block text, screening: screening call
SCAN Polymarket               direct:blocked US:ok GB:ok NL:ok AU:ok JP:ok
       ! direct: app blocked (empty page (1696 bytes) from server 'nginx/1.8.0' while other vantages get the app ...)
       ! US: /api/geoblock blocked {"blocked": true, "country": "US", "region": "VA"}
SKIP KyberSwap                https://kyberswap.com/files/...pdf  ! live: PDF: its text cannot be extracted ...
```

`SCAN` — downloaded and searched; `ERR` — the source did not answer (anti-bot, server error); `SKIP` — there is a
source but a script cannot read it (a PDF, text that only renders in a browser); `!` lines are differences between
countries.

Claim checks print a block each:

```
PASS ambient/geo-netlify                      code      geo_site=yes  21: AF BY MM CF CU CD ET IR IQ LB LY ML …
     https://github.com/CrocSwap/ambient-ts-app/blob/90e569a9…/netlify.toml#L81
     L81: # Block all pages for specified countries
```

- `PASS` — the source says what the catalog claims; `FAIL` — it does not (the reason follows `!`);
  `ERR` — the source is unavailable; `SKIP` — the check cannot run (for example, no proxy);
  `REC` — a live check without a proxy, the recorded observation with its date is counted.
- `geo_site=yes` — which claim the check supports (see "Claims and statuses" in the methodology).
- `21: AF BY …` — the countries and regions read from the source.
- The second line is a link to exactly that line of code or page; `L81: …` — the matched text.

A claim check that does not pass simply does not support its claim: `combine.py` computes the rating from passing
checks only.

## Check files `checks/<id>.json`

One file per interface; `id` is the same as on the site (`/monitor/<id>`). Example:

```json
{
  "id": "euler",
  "name": "Euler",
  "targets": {
    "app": "https://app.euler.finance",
    "repo": {"repo": "euler-xyz/euler-lite", "ref": "43ba73fadda21d943224742286c7c078562e3769"},
    "terms": "https://www.euler.finance/terms",
    "endpoints": ["https://app.euler.finance/api/ping"]
  },
  "checks": [
    {
      "id": "geo-countries",
      "type": "code",
      "claim": "geo_site",
      "status": "yes",
      "about": "SANCTIONED_COUNTRIES used by that middleware (Ukraine is commented out)",
      "source": {"repo": "euler-xyz/euler-lite", "ref": "43ba73fadda21d943224742286c7c078562e3769", "path": "entities/country-constants.ts"},
      "expect": ["export const SANCTIONED_COUNTRIES"],
      "section": {"start": "export const SANCTIONED_COUNTRIES", "end": "^\\]"},
      "exclude": ["//.*"],
      "countries": "codes"
    }
  ]
}
```

`targets` says what the sweeps look at (`app` is required; `repo`, `terms` and `endpoints` are null or empty when the
interface has none; `code_ignore` (+ `code_ignore_why`) excludes repository paths from the code sweep, e.g. a generated API client the app does not call; `terms_fallback` is a readable copy of Terms that only render in a browser, usually the file in
the frontend's repository). These are inputs — where to look — not conclusions.

| Field of a claim check | Meaning |
|---|---|
| `type` | `code`, `code-scan`, `bundle`, `page`, `api`, `live` (which script runs it) |
| `claim` | what is supported: `geo_site`, `geo_site.close_only`, `geo_feature`, `screening`, `vpn`, `kyc` |
| `status` | `yes`, `reported`, `tos_only`, `optional`, `no`; for VPN `detect`, `block`, `tos_only`, `optional`, `no` |
| `about` | one sentence: what the check shows |
| `source` | where to look. `code`: `repo`, `ref` (commit SHA), `path`; `code-scan`: `repo`, `ref`, optional `dir`; `bundle`: `url`, optional `scripts` (filter on script URLs) and `follow` (chunk discovery override); `page`: `url`, `archive` (Wayback snapshot), `kind`; `api`: `method`, `url`, `body` with `{address}` substitution; `live`: `url`, `country` |
| `expect` | regular expressions, each must be found (case-insensitive; `"case": true` makes them case-sensitive) |
| `absent` | regular expressions, none may be found (for `code-scan` and `bundle`) |
| `expect_sdn`, `expect_control` | for `api`: what the response must contain for the sanctioned and the control address |
| `section` | where to read countries from: from the first match of `start` to the next match of `end` |
| `exclude` | what to cut out of the section before reading countries (comments, "Canada (CA)" in a table header) |
| `countries` | `"codes"` — quoted codes in code (`'US'`), `"names"` — country names from the dictionary, `"names+groups"` — plus "EU"/"EEA" expanded into countries, a list such as `["US"]` — the matched sentence itself names the country |
| `ignore` | for `code-scan`: paths not to scan (for example, the Terms text inside the frontend) |
| `skip_scripts` | for `bundle`: a regex of script URLs not to search (the Terms page chunk, a third-party SDK); say why in `about` |

To add a check: append an object to `checks/<id>.json`, run the matching script with `--only <id> -v` and look at what
was found and which countries were read. For GitHub use the current commit SHA:
`git ls-remote https://github.com/<repo> HEAD`. In production JavaScript, function and variable names are minified:
match URLs, string constants, error texts, addresses and country-code arrays instead.

## CSV columns

`id`, `name`, `lifecycle`, `url`, `rating`, `restrictions` (number of restrictions), `countries_count`, `countries`,
`mechanisms` (counted once each: `geo_site` without a country list, `geo_feature`, `screening`, `vpn`, `kyc`), the
statuses `geo_site`, `geo_feature`, `screening`, `vpn`, `kyc` and their countries (`geo_site_countries`, `close_only`,
`geo_feature_countries`), claim checks per outcome (`checks_passed`, `checks_recorded`, `checks_failed`,
`checks_skipped_or_error`, `checks_not_run`), the site's values (`site_rating`, `site_restrictions`, `matches_site`),
what each sweep saw (`scan_app_js`, `scan_live`, `scan_code`, `scan_terms`, `api_checks`; "— …" means nothing to
check), `terms_countries` (countries in the Terms' restriction clauses) and `needs_review` (sweep findings the
published data does not explain).

## Comparison with the site

See the last run's numbers at the end of the `combine.py` output and in `research/out/report.md`; the published
version's numbers are in `monitor/current/VERSION.json` and `monitor/current/CHANGES.md`.

## Time, traffic, cache

A full run downloads the production JavaScript of 64 apps (on 2026-10-11: 12,149 files, 664 MB) and the archives of 30
repositories (about 760 MB); the HTTP cache in `research/.cache/` grows to about 1.4 GB. A full run takes 10–20
minutes with a warm cache. Each published version in `monitor/current/` takes about 10 MB (mostly evidence). Files at a pinned commit and
Wayback snapshots stay cached forever, everything else for 12 hours. The live sweep sends only page requests through
the proxy (a few MB per country). The folders `research/out/`, `research/.cache/` and the file `research/.env` are
not committed to git.
