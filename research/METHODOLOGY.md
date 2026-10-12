# Methodology: how the restrictions data is collected and checked

A document for a researcher who wants to repeat the result or dispute a specific assessment. How to run the scripts is
described in [README.md](README.md).

## 1. What is studied

The unit of analysis is the protocol's **official web interface** (for example, `app.uniswap.org`), not its smart
contracts. The question: which technical access restrictions this interface applies, to whom, and where they are
enforced. The site shows the interfaces that run on EVM networks and apps on their own chains whose official
interface lists EVM networks, such as Hyperliquid, Lighter and Extended (69 as of 2026-10-12); defunct interfaces and
interfaces with no EVM network stay in the catalog `monitor/data/interfaces.json` but are not shown on the site.

## 2. Claims and statuses

Each restriction is one of these claims:

| Claim | Meaning |
|---|---|
| `geo_site` | the whole site or trading is closed to countries/regions (with or without a list of them) |
| `geo_site.close_only` | a country can only close positions |
| `geo_feature` | part of the features or assets is closed (RWA tokens, tokenized stocks, individual vaults) |
| `screening` | the connected wallet is checked against sanctions lists or a risk score |
| `vpn` | VPN/proxy/Tor detection (`detect`) or blocking (`block`) |
| `kyc` | KYC, accreditation or a wallet allowlist |

The status shows what the claim rests on:

| Status | Basis | Counts towards the rating |
|---|---|---|
| `yes` | frontend code, the JavaScript served to the browser, an API response, a live check from a country, or official documentation | yes |
| `reported` | press and third-party reviews not confirmed by code | yes |
| `detect`, `block` (VPN) | like `yes` or `reported`, for VPN | yes |
| `tos_only` | only a reservation in the terms of use, no enforcement found | no |
| `optional` | the mechanism is in the code but off by default | no |
| `no` | checked: the code/bundle has no such mechanism | no |

## 3. Rating

Exactly the same formula as in `monitor/scripts/build.py` (the site) and in `research/combine.py` (the check):

- every country or region closed at site level (including close-only) or by a feature gate counts **once**;
- plus one per mechanism: feature/asset gate, wallet screening, VPN detection, KYC; a site closure without a published
  list of countries also counts as one restriction;
- only the statuses `yes` and `reported` count (for VPN, `detect` and `block`).

**A** — 0 restrictions, **B** — 1–5, **C** — 6–20, **D** — more than 20. **n/a** — nothing could be established: no
restrictions, and the status of both the site-level geo-block and screening is unknown. That is why interfaces rated A
have checks with the status `no` or `tos_only`: they show the interface was examined, not merely left unstudied.

## 4. Sources and how the scripts check them

All checks are deterministic: the same check over the same source gives the same result. The decision "confirmed or
not" is made by a regular expression, not by a person and not by a model.

### 4.1 Code on GitHub (`check_code.py`)

- The file is read at a pinned commit: `raw.githubusercontent.com/<repo>/<SHA>/<path>`. The link in the report points
  to the same line: `github.com/<repo>/blob/<SHA>/<path>#L<line>`. Code at a SHA does not change, so the result can be
  reproduced at any time while the repository is public.
- Country lists are read from the code as quoted literals (`'US'`, `"CA"`) inside the given section (for example, the
  `SANCTIONED_COUNTRIES` array); commented-out lines are cut out.
- The absence check (`code-scan`) downloads the repository archive at the same commit and searches all sources
  (without tests, locales, `node_modules`, build output) for patterns of geo-IP services, country headers
  (`cf-ipcountry`, `x-vercel-ip-country`), geo-blocks, sanctions oracles and screening providers (TRM, Chainalysis,
  Hypernative). No match at all gives the status `no`.
- `--head` reads the current default branch instead of the pinned commit, to see whether the code has changed.

A public repository may lag behind production (release mirrors, stale snapshots). That is why the bundle (4.2) is
examined for closed and doubtful cases.

### 4.2 The official site's JavaScript (`check_bundle.py`)

The app's HTML and every script it references are downloaded, plus lazily loaded chunks found in the code (webpack,
Next.js, Vite, Vue CLI and Angular chunk maps, SvelteKit entry imports). They are then searched as text: nothing is executed. This is the code
that actually runs, so it is checked for every interface (4.6), and claim checks confirm in it what the repository
says: the same country lists (CoW Swap, Sushi, Notional, Beefy, Lido), the same oracle and screening calls (Sky, Safe,
Aave, Compound, Synapse, Ambient), and the absence of geo or screening code at interfaces rated A (Curve, GMX, Yearn,
ENS, Snapshot, QuickSwap, Curve Classic, Notional V2). For closed frontends (Notional V3, Compound V2,
Aave Pro, Portal Bridge, Ethena's `/restricted` page) it is the only public copy of the code. Minification renames
functions and variables, so the checks match what survives it: URLs, string constants, error texts, addresses,
arrays of country codes. A site unreachable from this machine is fetched through a proxy in another country.

### 4.3 Documentation, Terms, help centers, press (`check_docs.py`)

- The page is downloaded with one GET without JavaScript and the HTML is turned into text (`lib/text.py`).
- Every expression in `expect` must be found: it is the phrase the claim rests on.
- Countries are read from a bounded section (`section`: from a start phrase to an end phrase) with a dictionary of
  names (`lib/countries.py`: the 249 ISO 3166-1 countries, the regions `UA-Crimea`, `UA-DPR`, `UA-LPR`,
  `UA-Kherson`, `UA-Zaporizhzhia`, `US-NY`, Canadian provinces, Abkhazia, South Ossetia, Northern Cyprus, plus
  synonyms: Burma → MM, DPRK → KP, Congo (Kinshasa) → CD). A longer name wins over a shorter one (South Sudan, not
  Sudan). "EU"/"EEA" are expanded into countries only where the check explicitly allows it.
- If the page is unavailable (anti-bot 403, blocking by the internet provider, a move) or no longer says it, the
  pinned Wayback Machine snapshot (`source.archive`) is used and the result is marked `via: archive`. `--archive`
  reads the snapshots first: exactly the text the catalog was built from.
- The extracted text of every page is saved to `research/out/evidence/`, and its SHA-256 is recorded in the results:
  if the page changes, it will show.
- Official pages give the status `yes` (or `tos_only` if it is only a reservation in the Terms); press and reviews give
  `reported`.

### 4.4 Public APIs with a sanctioned and a control wallet (`check_api.py`)

- Before the run, the sanctioned address is checked on-chain: an `eth_call` to the Chainalysis Sanctions Oracle
  `0x40C57923924B5c5c5455c48D93317139ADDaC8fb` on Ethereum (`isSanctioned(address)`, selector `0xdf592f7d`), through a
  public RPC or `RPC_URL`. If the oracle does not confirm the sanctioned address or considers the control address
  sanctioned, all API checks are skipped: the test only makes sense with an address that is sanctioned today.
- Sanctioned address: `0x098B716B8Aaf21512996dC57EB0615e2383E2f96` (the Ronin bridge exploiter, Lazarus Group, on the
  OFAC SDN list since 2022-04-14). Control address: `0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed` (the example from
  EIP-55). Addresses like `0x2222…2222` do not work: LI.FI rejects them as "zero addresses".
- The same request is sent with each address. The check passes only if the answers differ in the expected way: for
  example, Relay `/sanctioned/{address}` answers `true` and `false`, LI.FI `/v1/quote` answers 422 and returns a quote.
- Read-only: no keys, no signatures, no transactions.

### 4.5 Live checks from a country through a proxy (`check_live.py`)

- **Proxy.** The catalog uses **Decodo (formerly Smartproxy)**. The runs of 2026-10-08 and 2026-10-09 and the first
  checks of 2026-10-11 went through Decodo's trial ISP pool (`isp.decodo.com:10001`, US exit: AS5650 Verizon Business),
  which stopped authorizing (HTTP 407) during the 2026-10-11 run. Since 2026-10-12 the residential pool is used:
  `gate.decodo.com:7000` with the country and a sticky session in the user name
  (`user-LOGIN-country-us-session-<id>-sessionduration-30`, one exit IP per country and run; US states as
  `-country-us-state-us_new_york`, Canadian provinces through a city, `-country-ca-city-toronto`); the dashboard's
  `gate.decodo.com:10001` is a sticky session with a random country and cannot be targeted. Exits are home networks
  (for example RCN and Charter in the US, BT and Virgin Media in the UK, Bell in Canada, Vodafone in Ukraine). Any
  provider with country targeting works, only the `PROBE_PROXY_URL` string (a template with `{cc}`) changes. Prices and
  setup are described in `monitor/docs/probing.md`.
- **Vantage.** Three IP -> country lookups (`api.country.is`, `ipinfo.io`, `ifconfig.co`) are asked through the same
  proxy which country the exit IP is in. The proxy must answer, and at least half of the answers must be the requested
  country (geolocation databases disagree on some ranges: one of them puts the Iranian AS58224 in Azerbaijan).
  Otherwise the check is skipped: the provider has no exit there, or gave one in another country; neither says
  anything about the interface.
- **Request.** One GET with the redirect chain recorded. Matches are searched in a transcript of the response: status,
  final URL, redirects, body.
- **Without a proxy.** The latest verified observation for the same interface, country and URL is taken from
  `monitor/data/observations.json` (written by `monitor/scripts/probe.py`). The output marks it `REC` with its date and
  network instead of passing it off as a fresh check.
- Sanctioned and high-risk jurisdictions (the `sanctioned` group of `monitor/data/countries.json`: RU, BY, IR, KP,
  CU, SY, VE, MM and others) are checked live where the proxy has exits. The Decodo residential pool on 2026-10-12 had
  exits in all of them except KP and CF; CU answered now and then. Occupied regions (UA-Crimea and others) cannot be
  targeted; for them, code, configs and documentation remain.

### 4.6 Sweeps: every check family for every interface

Claim checks confirm what the catalog already says. Sweeps look at every source an interface has, whether or not the
catalog expects anything there, so that a restriction nobody has recorded still shows up. The rule: a check family is
missing for an interface only when there is nothing to check.

| Sweep | Applies to | Method |
|---|---|---|
| App JavaScript | every interface (all have an app URL) | the app's HTML, every `<script>`, and lazily loaded chunks found in the code (Next.js `static/chunks`, webpack/Angular chunk maps, Vite `assets/`, Vue CLI `js/`), up to 1,500 files / 80 MB per app; searched for the signals in `lib/signals.py` |
| Live | every interface | the app page and its known geo endpoints from this machine and through a residential proxy in each country of `monitor/data/countries.json` — 40 popular countries, the regions US-NY and CA-ON, and 21 sanctioned or high-risk jurisdictions (vantage verified as in 4.5); state per vantage: ok, blocked (HTTP 451, a redirect to a blocking page, a blocking text, or an empty page from a different server while other vantages get the app), challenge (anti-bot), error; the list of `<script>` files is compared between vantages |
| Code | every open repository (30) | every source file at the pinned commit (tests, locales and build output excluded), the same signals, file:line permalinks |
| Terms | every published Terms (54) | the paragraphs about restricted, prohibited or sanctioned jurisdictions and the list items under them; countries read with the dictionary; clauses flagged: geofencing/IP blocking, VPN, sanctions, wallet screening, US persons, KYC. Sources in order: the page, the same page through a proxy, the Terms file in the frontend's repository, the latest Wayback snapshot, the prose compiled into the app's JavaScript |
| Public API | every interface with a known public screening endpoint (9) | the claim check of 4.4 |

**Signals** (`lib/signals.py`) are strong when they name a mechanism — a geo-IP service, a country header, a geo
endpoint, a blocking text, the sanctions-oracle address, a screening vendor or call, VPN detection, a KYC vendor — and
weak when they are generic words that also appear in unrelated code (the "Unavailable For Legal Reasons" entry of HTTP
status tables, the word VPN, risk-lookup links such as Webacy or Blockaid, which protect users rather than screen
them). Only strong signals are compared with the data.

**Findings for review.** `combine.py` lists what the sweeps saw and the published data does not explain: a block from a
country the site does not count; a different set of JavaScript files for one country; strong geo, screening, VPN or
KYC signals in the production JavaScript or the repository while the site says the interface has no such mechanism.
A finding is a lead, never a verdict and never an automatic change: a person opens the evidence, and if the mechanism
is real and affects users, adds it to the catalog together with a claim check (which then counts towards the rating).
A block that comes from the network (an empty page from a different server, e.g. an internet provider enforcing a
national ban) is not a restriction of the interface; the finding says so.

## 5. What is not here

- **No browser (Playwright, Selenium).** The scripts do not execute JavaScript. Client-side checks are visible through
  the bundle (4.2): the code is searched, not the page's behaviour. The behaviour with a connected wallet (a mock
  wallet, walking through the flow) is not checked. Pages that are empty without a browser (`ether.fi` is behind a
  Vercel challenge) are read from another official source (the ether.fi GitBook) or from Wayback.
- **No AI in the checks.** No script calls a language model, and no API token is needed. The sources for the catalog
  (`data-ai/`, `monitor/data/interfaces.json`) were searched for and read with the help of an AI assistant (Claude).
  That is why no conclusion is taken on trust: every conclusion that counts towards the rating is turned here into a
  check with a regular expression over the primary source, which anyone can repeat. The file
  `monitor/prompts/auditor-agent.md` is a draft prompt for future in-depth audits; the scripts do not use it.
- **No circumvention of protections.** CAPTCHAs are not solved, there are no logins, anti-bot pages are recorded as
  unavailable (on 2026-10-11 Balancer, Centrifuge, ether.fi, Maple, Matcha and Relay answered scripts with an anti-bot
  429/403 both from here and through a proxy; their JavaScript cannot be read without a browser, which the coverage
  matrix shows). Towards `web.archive.org` the scripts identify themselves with an honest User-Agent
  (`pi-restrict-research/1.0`): with a browser User-Agent the archive treats the requests as bot traffic.

## 6. Reproducibility

- Code is read by commit SHA, page snapshots by Wayback timestamp. These sources do not change.
- For every check the results record the time, the URL, the SHA-256 of the content received and the matched lines;
  the text itself is saved in `evidence/`.
- Live pages and APIs change: the result of such a check refers to the date of the run. Compare `out/*.json` of two
  runs, or run `check_docs.py --archive` to get the original text.
- The result is compared with the site automatically (`combine.py`, the `matches_site` column).

## 7. Limitations and assessments that need attention

- **Absence of code does not prove absence of a restriction.** `no` means "not in the public code/bundle"; a
  restriction may sit in a closed backend or on the CDN. QuickSwap's public repository is stale.
- **The press describes the past.** The `reported` assessments rest on publications: 1inch (US geofencing in 2021,
  lifted later according to the catalog), PancakeSwap (2022), Matcha (Russia, 2022), Spark (2023), EigenLayer (the
  EIGEN claim site, 2024), Tornado Cash (oracle in the frontend, 2022), OpenSea (2022), Uniswap (Ukraine, 2025), Frax
  (the LlamaRisk review describes the blacklist and KYC as being introduced).
- **A country list from the Terms with a technical mechanism.** Sky's mechanism is in the code (`/ip/status` →
  `region-restricted`), while the 35 countries come from the Terms of Use because the code has no list. Ethena's 30
  EU/EEA countries are a restriction on sUSDe from the Terms; per-country technical enforcement was not checked.
- **Archived code.** Portal Bridge's screening was first confirmed from an archived repository; the production
  JavaScript of portalbridge.com now confirms it too (`checkWalletSanctions` on both wallets of a transfer).
- **Sweeps have blind spots.** Bundles larger than the cap are searched partly (Uniswap: 1,500 files); a mechanism that
  lives only on a server and leaves no string in the JavaScript is visible only through its API or a live request
  from the right country; Terms countries are read heuristically and may include a country mentioned in a nearby
  sentence; PDFs (1inch, KyberSwap) and Terms that only render in a browser are reported as not readable.
- **What the sweeps found** on 2026-10-11/12 and the catalog now counts, each backed by claim checks: Lido stVaults
  screens wallets through the same validation API as stake.lido.fi (rated A before, B now); gTrade flags stocks and
  indices for the US through its own geoblock API; Kelp sends visitors from the US, the UK and Canada away from its
  Gain vaults; Stargate refuses USDC CCTP transfers where Circle's API refuses the visitor (Ukraine); Portal Bridge's
  swap quotes can fail with GEO_BLOCKED; Symbiotic shows an UNSUPPORTED REGION screen to CU, IR, KP, SY, UA and CA. A
  VPN flag in Safe's repository turned out to be a generated API client the app does not use.
- **Differences from the site** are shown by the checks themselves: on 2026-10-11 they found CoW Swap (50 countries in
  the code, 31 in the catalog at the time) and Polymarket (current help center: 40 countries and 7 regions; the
  catalog had the older split by tiers); the catalog was corrected, and version 2026-10-11 matches the site for 64 of
  64. Version history: `monitor/current/` and `monitor/archive/` (`monitor/docs/updating.md`, in Russian).
