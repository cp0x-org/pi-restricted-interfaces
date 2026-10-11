# Monitor of restrictions in official DeFi interfaces

**Snapshot:** 2026-10-08 · **Scope:** DEXs and aggregators, perps, lending, staking/yield, bridges, prediction markets, wallets and governance.
**Data:** `interfaces.json` (source of truth), `interfaces.csv` (opens in Excel), `pi-monitor-prototype.zip` (scanner, report builder, verifier and the raw scanner hits `scan_raw.json`).

{{STATS}}

---

## 1. Key findings

1. **Restrictions move from the site level to the wallet and asset level.** A full geo-block of a site is rare. The typical 2026 setup is wallet screening through the operator's own backend plus a geo filter on individual assets, especially RWAs and tokenized stocks. Uniswap, Sushi, CoW, Beefy, Venus, Euler, Aerodrome and Lido Earn work this way. Sushi closes Robinhood tokens to 15 countries, including all of Ukraine.
2. **Where a restriction is enforced** (the `layer` field, the actual place of the check; with several checks the deepest one is given):
   - **Frontend**: code in the browser decides (a hardcoded list, a request to a provider or a read of an on-chain oracle from the page): Sushi, Ambient, Compound, Notional, Safe.
   - **API**: the server refuses, either a separate compliance endpoint (Uniswap, Aave, Euler, Sky, Balancer, Synapse, Lido, KyberSwap) or the protocol's main API (CoW orderbook: Chainalysis oracle + Hermod; LI.FI API: 422 for an SDN address; Relay: Chainalysis + HackBounty; dYdX indexer: Elliptic + 403 GEOBLOCKED; Polymarket CLOB).
   - **Smart contract**: the contract itself rejects the address: the frxUSD blacklist (Frax), allowlists and memberlists at Ondo, Centrifuge and Superstate, USDe mint/redeem for whitelisted addresses only (Ethena).
3. **Fail-closed gates.** In several repositories the gate blocks everyone when the backend is not configured or not reachable:
   - Aave: `/api/preflight-compliance` returns an error, and an overlay covers the whole app.
   - Synapse: a screener error means "flagged".
   - Euler: an unknown country leads to 451 on `/api/*`.
   - Sky: no verdict for the IP, and the app is blocked.
   - Beefy: an unknown location blocks tokenized stocks.
4. **Frontends are closing.** Since 2025 the code was made private or removed at PancakeSwap (`pancake-frontend`), Across (`frontend`) and Spark (`spark-app`). Morpho Lite/Fallback and the Portal Bridge UI are archived. Uniswap publishes only a release mirror; Raydium and QuickSwap keep outdated snapshots.
5. **Static sanctions lists drift from the SDN list.** Compound III still blocks Tornado Cash addresses, although OFAC lifted the sanctions in March 2025. Ambient and wormhole-connect keep hardcoded lists.
6. **Clean official interfaces.** No technical restrictions were found in the code of GMX, Curve, Yearn, ENS and Snapshot. The Terms of Curve and Snapshot (the SECO list) name all of Ukraine, but the code does not enforce it.
7. **Screening providers** (by the number of interfaces with confirmed or documented screening): {{PROVIDERS}}.

## 2. Legend

Rating = the number of technical restrictions of an official interface: each country or region with a block (of the site, of trading or of features) plus one each for a feature or asset restriction, wallet screening, VPN detection and KYC. Bans that exist only in the Terms are not counted. Fewer restrictions is better.

| Rating | Restrictions |
|---|---|
| **A** | 0 (no restrictions found) |
| **B** | 1–5 |
| **C** | 6–20 |
| **D** | more than 20 |
| **n/a** | nothing could be determined |

Values in the columns: `yes` confirmed by code, a live check or official documentation · `reported` press or users · `ToS only` the right is reserved, no enforcement found · `optional` present in the code, off by default · `?` unknown.

## 3. Summary table

{{MAIN_TABLE}}

## 4. Live checks: sanctioned address and geo endpoints

Test address: `0x098B716B8Aaf21512996dC57EB0615e2383E2f96` (Ronin bridge exploiter, Lazarus Group, on the SDN list since 2022-04-14). Control addresses: `0x1111…1111` and `0x2222…2222`. The public GET screening endpoints found in the code were tested. Egress was from a US datacenter (Ohio).

{{LIVE_TABLE}}

Confirmed: the screening of Synapse, Relay, KyberSwap, dYdX and LI.FI actually rejects the SDN address and lets the control address through. Across does not check the address at the quote stage. Checks through a connected wallet in the UI (Uniswap, Aave, Balancer, Euler, Sky, Sushi/TRM) need a browser with a substituted EIP-1193 provider and are not part of this snapshot.

## 5. Mechanisms and evidence

File paths are relative to the root of the repository from the summary table, at HEAD on the snapshot date.

{{MECH_TABLE}}

## 6. Types of mechanisms

| Layer | How it is detected | Examples |
|---|---|---|
| Edge/CDN | HTTP 403/451/302 by country without JS; `netlify.toml` `conditions.Country`, Next `middleware` `req.geo`, `cf-ipcountry`, `x-vercel-ip-country` | Hop (451), Ambient (302 → /blocked.html), Euler (451 on `/api`), marginfi |
| Client-side geo check | a JS request to a geo API: `api.country.is`, `free.freeipapi.com`, `*/geo/country`, `/api/geoblock`, `geolocation.*.workers.dev` | CoW, Venus, Beefy, Polymarket, Drift, Notional, Sushi |
| Operator's geo service with feature flags | the answer contains `isRegionRestricted`/`gatedFeatures`/`limited` | Sky (`/ip/status`, `geo-config`), Uniswap compliance v2, Lido `/api/geo` |
| VPN detection | `is_vpn`, vpnapi.io, IPQS; Tor `T1` | Sky (detection → ToS signature), Euler (log), Liquity (optional), Lido (Tor → limited) |
| Wallet screening, external API | a request with the address in the body or URL right after connect | TRM (Sushi, 1inch, Aave historically), Hypernative (Balancer), Elliptic (dYdX), Chainalysis Entity (Synapse) |
| On-chain screening | `eth_call isSanctioned()` to `0x40C5…C8fb` | Notional, Safe, CoW backend |
| Static list | an array of addresses in the bundle | Compound, Ambient, wormhole-connect, Hop (optional) |
| Asset restrictions | a token deny-list or RWA lists by country | Uniswap, CoW, Beefy, Venus, Sushi, Curve (content blacklist) |

## 7. Limits of this snapshot

- Live checks ran **from a single point (a US datacenter)** and without executing JS. Geo-blocks that fire only on the client or only for other countries are visible only through the code. Closed interfaces with no restrictions found (rating A with closed code, and `n/a`) were checked only through the Terms and public endpoints, without a browser from other countries.
- Repositories were scanned at HEAD of the default branch. Production can differ from the code: the hash of QuickSwap's production build is missing from the repository, Raydium is published as a snapshot, Uniswap as a release mirror.
- The static scanner gives candidates. Every finding with the status `yes` in the table is confirmed by reading the code or by a live request. The raw scanner hits contain false positives: `elliptic` as a crypto library, `blockaid` as a transaction scanner in the Uniswap wallet rather than compliance, Hypernative Guard in Safe.
- The Terms of many apps are rendered on the client. Where the Terms could not be read, the value is `unknown`, with no guessing.
