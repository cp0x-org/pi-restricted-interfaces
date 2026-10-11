# Monitor of restrictions in official DeFi interfaces

**Snapshot:** 2026-10-08 · **Scope:** DEXs and aggregators, perps, lending, staking/yield, bridges, prediction markets, wallets and governance.
**Data:** `interfaces.json` (source of truth), `interfaces.csv` (opens in Excel), `pi-monitor-prototype.zip` (scanner, report builder, verifier and the raw scanner hits `scan_raw.json`).

Interfaces: **57**, with an open frontend: **28**, closed: **29**. Levels: D — 15, C — 13, B — 8, A — 6, A? — 8, ? — 7.

---

## 1. Key findings

1. **Restrictions move from the site level to the wallet and asset level.** A full geo-block of a site is rare. The typical 2026 setup is wallet screening through the operator's own backend plus a geo filter on individual assets, especially RWAs and tokenized stocks. Uniswap, Sushi, CoW, Beefy, Venus, Euler, Aerodrome and Lido Earn work this way. Sushi closes Robinhood tokens to 15 countries, including all of Ukraine.
2. **For a fork what matters is not whether a restriction exists but where it is enforced.**
   - **Frontend or the operator's own API.** A fork removes the restriction: Aave, Euler, Sky, Uniswap, Sushi, Balancer, Synapse, Notional, Ambient, Hop.
   - **Protocol API.** A fork inherits the restriction: CoW orderbook (Chainalysis oracle + Hermod), LI.FI API (422 for an SDN address), Relay (Chainalysis + HackBounty), dYdX indexer (Elliptic + 403 GEOBLOCKED), Polymarket CLOB. This needs an infrastructure layer of its own: a self-hosted dYdX indexer or a proxy outside the blocked jurisdictions. Screening in a protocol API cannot be bypassed.
3. **Fail-closed traps in a fork.** In several repositories the gate blocks everyone when the backend is not configured or not reachable. The gate has to be removed, not just left without env:
   - Aave: `/api/preflight-compliance` returns an error, and an overlay covers the whole app.
   - Synapse: a screener error means "flagged".
   - Euler: an unknown country leads to 451 on `/api/*`.
   - Sky: no verdict for the IP, and the app is blocked.
   - Beefy: an unknown location blocks tokenized stocks.
4. **Frontends are closing.** Since 2025 the code was made private or removed at PancakeSwap (`pancake-frontend`), Across (`frontend`) and Spark (`spark-app`). Morpho Lite/Fallback and the Portal Bridge UI are archived. Uniswap publishes only a release mirror; Raydium and QuickSwap keep outdated snapshots. The monitor has to track repository visibility and keep its own mirrors.
5. **Static sanctions lists drift from the SDN list.** Compound III still blocks Tornado Cash addresses, although OFAC lifted the sanctions in March 2025. Ambient and wormhole-connect keep hardcoded lists. A "does a sanctioned address work" check has to use a current SDN address, for example through the Chainalysis oracle's `isSanctioned()`.
6. **Clean official interfaces.** No technical restrictions were found in the code of GMX, Curve, Yearn, ENS and Snapshot. They are a low priority for the catalog. The Terms of Curve and Snapshot (the SECO list) name all of Ukraine, but the code does not enforce it.
7. **Screening providers** (by the number of interfaces with confirmed or documented screening): TRM Labs — 7, Chainalysis — 5, undisclosed — 5, hardcoded list — 4, own service — 2, Hermod/zeroShadow — 2, Hypernative — 1, Elliptic — 1, HackBounty — 1.

## 2. Legend

| Level | Meaning |
|---|---|
| **D** | Geo-block of the whole site or of trading, **or** screening in a protocol API (a fork does not help without infrastructure of its own) |
| **C** | Wallet screening in the frontend or in the operator's own API |
| **B** | Restrictions only at the feature or asset level, historical reports or optional code |
| **A** | No technical restrictions found, the code is open |
| **A?** | Restrictions only in the Terms, closed code: needs a browser crawl |
| **?** | Not enough data: closed code, Terms not found or rendered on the client |

Values in the columns: `yes` confirmed by code, a live check or official documentation · `reported` press or users · `ToS only` the right is reserved, no enforcement found · `optional` present in the code, off by default · `?` unknown.

## 3. Summary table

| # | Interface | Category | URL | Frontend GitHub | Geo: site | Geo: features/assets | Wallet screening | VPN | ToS: US | Level |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Uniswap** | DEX | [app.uniswap.org](https://app.uniswap.org) | [Uniswap/interface/tree/main/apps/web](https://github.com/Uniswap/interface/tree/main/apps/web) | reported (UA) | yes | yes (own API) | no | no | **C** |
| 2 | **SushiSwap** | DEX | [www.sushi.com](https://www.sushi.com) | [sushi-labs/sushiswap/tree/master/apps/web](https://github.com/sushi-labs/sushiswap/tree/master/apps/web) | no | yes | yes (frontend) | ToS only | no | **C** |
| 3 | **PancakeSwap** | DEX | [pancakeswap.finance](https://pancakeswap.finance) | — *private-now (pancakeswap/pancake-frontend was public, docs still link to it; now 404/auth)* | reported (10) | ? | ? | ? | ? | **B** |
| 4 | **Curve** | DEX | [www.curve.finance](https://www.curve.finance) | [curvefi/curve-frontend](https://github.com/curvefi/curve-frontend) | ToS only | no | no | no | no | **A** |
| 5 | **Balancer** | DEX | [balancer.fi](https://balancer.fi) | [balancer/frontend-monorepo/tree/main/apps/frontend-v3](https://github.com/balancer/frontend-monorepo/tree/main/apps/frontend-v3) | no | no | yes (own API) | no | no | **C** |
| 6 | **CoW Swap** | DEX / intents | [swap.cow.fi](https://swap.cow.fi) | [cowprotocol/cowswap/tree/develop/apps/cowswap-frontend](https://github.com/cowprotocol/cowswap/tree/develop/apps/cowswap-frontend) | no | yes | yes (protocol API) | no | no | **D** |
| 7 | **1inch** | DEX aggregator | [1inch.com](https://1inch.com) | — *closed* | reported | ToS only | yes (own API) | ToS only | no | **C** |
| 8 | **KyberSwap** | DEX aggregator | [kyberswap.com](https://kyberswap.com) | [KyberNetwork/kyberswap-interface/tree/main/apps/kyberswap-interface](https://github.com/KyberNetwork/kyberswap-interface/tree/main/apps/kyberswap-interface) | no | yes | yes (own API) | ToS only | no | **C** |
| 9 | **QuickSwap** | DEX | [dapp.quickswap.exchange](https://dapp.quickswap.exchange) | [QuickSwap/interface-v2](https://github.com/QuickSwap/interface-v2) | ? | ? | no | ToS only | prohibited | **A** |
| 10 | **Aerodrome** | DEX | [aerodrome.finance](https://aerodrome.finance) | — *closed (only aerodrome-finance/docs)* | ToS only | yes | ? | ToS only | partial (securities) | **B** |
| 11 | **Velodrome** | DEX | [velodrome.finance](https://velodrome.finance) | — *closed (only velodrome-finance/docs, sugar)* | ? | ? | ? | ? | no | **?** |
| 12 | **Ambient Finance** | DEX | [ambient.finance](https://ambient.finance) | [CrocSwap/ambient-ts-app](https://github.com/CrocSwap/ambient-ts-app) | yes (21) | no | yes (frontend) | no | no | **D** |
| 13 | **Velora (ex-ParaSwap)** | DEX aggregator | [app.velora.xyz](https://app.velora.xyz) | — *closed* | ? | ? | ? | ? | partial (incentive programs) | **?** |
| 14 | **Matcha (0x)** | DEX aggregator | [matcha.xyz](https://matcha.xyz) | — *closed* | reported (RU) | ? | ToS only | ToS only | no | **B** |
| 15 | **Jumper (LI.FI)** | Bridge / aggregator | [jumper.xyz](https://jumper.xyz) | [jumperexchange/jumper-exchange](https://github.com/jumperexchange/jumper-exchange) | no | no | yes (protocol API) | ToS only | no | **D** |
| 16 | **Raydium** | DEX | [raydium.io](https://raydium.io) | [raydium-io/raydium-ui-v3-public](https://github.com/raydium-io/raydium-ui-v3-public) | ? | yes | no | ? | prohibited | **B** |
| 17 | **Jupiter** | DEX aggregator | [jup.ag](https://jup.ag) | — *closed (jup-ag/plugin = widget)* | ? | ? | ToS only | ToS only | prohibited | **A?** |
| 18 | **Orca** | DEX | [www.orca.so](https://www.orca.so) | — *closed* | yes (28) | yes | yes (own API) | ? | ? | **D** |
| 19 | **Meteora** | DEX | [app.meteora.ag](https://app.meteora.ag) | — *closed* | ToS only | ? | ToS only | ToS only | prohibited | **A?** |
| 20 | **dYdX** | Perps | [dydx.trade](https://dydx.trade) | [dydxprotocol/v4-web](https://github.com/dydxprotocol/v4-web) | yes (24) | yes | yes (protocol API) | ToS only | prohibited | **D** |
| 21 | **GMX** | Perps | [app.gmx.io](https://app.gmx.io) | [gmx-io/gmx-interface](https://github.com/gmx-io/gmx-interface) | no | no | no | ToS only | no | **A** |
| 22 | **Hyperliquid** | Perps | [app.hyperliquid.xyz](https://app.hyperliquid.xyz) | — *closed* | yes (US, CA-ON) | ? | ? | ToS only | prohibited | **D** |
| 23 | **Drift (-> Velocity)** | Perps | [app.drift.trade](https://app.drift.trade) | — *closed (velocity-exchange/velocity-common = shared lib)* | yes (26) | ? | ? | ? | ? | **D** |
| 24 | **gTrade (Gains)** | Perps | [gains.trade](https://gains.trade) | — *closed* | ToS only | ? | ToS only | ToS only | prohibited | **A?** |
| 25 | **Lighter** | Perps | [app.lighter.xyz](https://app.lighter.xyz) | — *closed* | ToS only | ? | ToS only | ? | prohibited | **A?** |
| 26 | **Aave** | Lending | [app.aave.com](https://app.aave.com) | [aave/interface](https://github.com/aave/interface) | ToS only | no | yes (own API) | ToS only | no | **C** |
| 27 | **Compound III** | Lending | [app.compound.finance](https://app.compound.finance) | [compound-finance/webb3-frontend](https://github.com/compound-finance/webb3-frontend) | ToS only | no | yes (frontend) | ToS only | no | **C** |
| 28 | **Morpho** | Lending | [app.morpho.org](https://app.morpho.org) | — *closed (morpho-lite-apps archived 2026-05-06)* | ? | yes | yes (own API) | ToS only | no | **C** |
| 29 | **Spark** | Lending / savings | [app.spark.fi](https://app.spark.fi) | — *private-now (marsfoundation/spark-app, sparkdotfi/spark-app -> 404)* | reported (US) | ? | reported (own API) | block (2023 reports; current status not confirmed) | no | **C** |
| 30 | **Sky (ex-Maker)** | Savings / lending | [app.sky.money](https://app.sky.money) | [jetstreamgg/tarmac/tree/development/apps/webapp](https://github.com/jetstreamgg/tarmac/tree/development/apps/webapp) | yes (35) | yes | yes (own API) | detect (not blocked; VPN/US users must sign the terms on every tx) | no | **D** |
| 31 | **Venus** | Lending | [app.venus.io](https://app.venus.io) | [VenusProtocol/venus-protocol-interface/tree/main/apps/evm](https://github.com/VenusProtocol/venus-protocol-interface/tree/main/apps/evm) | no | yes | no | no | partial (Fixed-Term Vault) | **B** |
| 32 | **Euler** | Lending | [app.euler.finance](https://app.euler.finance) | [euler-xyz/euler-lite](https://github.com/euler-xyz/euler-lite) | yes (22) | yes | yes (own API) | detect (logged only, not blocked) | no | **D** |
| 33 | **Fluid** | Lending / DEX | [fluid.io](https://fluid.io) | — *closed* | ? | ? | ? | ? | ? | **?** |
| 34 | **Kamino** | Lending | [kamino.com](https://kamino.com) | — *closed* | ? | ? | ? | ? | ? | **?** |
| 35 | **marginfi (-> Project 0)** | Lending | [app.marginfi.com](https://app.marginfi.com) | [mrgnlabs/mrgn-ts/tree/main/apps/marginfi-v2-ui](https://github.com/mrgnlabs/mrgn-ts/tree/main/apps/marginfi-v2-ui) | yes (5) | yes | ToS only | ToS only | no | **D** |
| 36 | **Liquity V2 (liquity.app)** | CDP / stablecoin | [liquity.app](https://liquity.app) | [liquity/bold/tree/main/frontend/app](https://github.com/liquity/bold/tree/main/frontend/app) | optional | no | optional | optional | ? | **B** |
| 37 | **Notional** | Lending / leverage | [notional.finance](https://notional.finance) | [notional-finance/notional-monorepo](https://github.com/notional-finance/notional-monorepo) | yes (18) | no | yes (frontend) | no | prohibited | **D** |
| 38 | **Lido** | Liquid staking | [stake.lido.fi](https://stake.lido.fi) | [lidofinance/ethereum-staking-widget](https://github.com/lidofinance/ethereum-staking-widget) | no | yes | yes (own API) | detect (Tor exits get the 'limited' mode) | partial (Earn vaults) | **C** |
| 39 | **Rocket Pool** | Liquid staking | [stake.rocketpool.net](https://stake.rocketpool.net) | — *none-found* | ? | ? | ? | ? | ? | **?** |
| 40 | **EigenLayer (EigenCloud)** | Restaking | [app.eigenlayer.xyz](https://app.eigenlayer.xyz) | — *closed* | reported (7) | ? | ToS only | block (2024, EIGEN claims site) | no | **B** |
| 41 | **ether.fi** | Restaking / vaults | [www.ether.fi/app](https://www.ether.fi/app) | — *closed* | ToS only | ToS only | ToS only | ToS only | partial | **A?** |
| 42 | **Pendle** | Yield | [app.pendle.finance](https://app.pendle.finance) | — *closed* | ToS only | ToS only | ToS only | ToS only | partial (Boros) | **A?** |
| 43 | **Ethena** | Synthetic dollar | [app.ethena.fi](https://app.ethena.fi) | — *closed* | yes (US) | yes | yes (own API) | ToS only | prohibited | **D** |
| 44 | **Yearn** | Yield vaults | [yearn.fi](https://yearn.fi) | [yearn/yearn.fi](https://github.com/yearn/yearn.fi) | no | no | no | no | ? | **A** |
| 45 | **Beefy** | Yield vaults | [app.beefy.com](https://app.beefy.com) | [beefyfinance/beefy-v2](https://github.com/beefyfinance/beefy-v2) | no | yes | no | no | ? | **B** |
| 46 | **Convex** | Yield | [curve.convexfinance.com](https://curve.convexfinance.com) | — *closed* | ? | ? | ? | ? | ? | **?** |
| 47 | **Jito** | Liquid staking | [www.jito.network](https://www.jito.network) | — *closed* | ? | ? | ? | ? | no | **?** |
| 48 | **Across** | Bridge | [across.to](https://across.to) | — *private-now (across-protocol/frontend public until ~2025-08; frontend-v1 = legacy 2023)* | ToS only | no | ? | ToS only | no | **A?** |
| 49 | **Stargate** | Bridge | [stargate.finance](https://stargate.finance) | — *closed* | ToS only | ? | ? | ToS only | no | **A?** |
| 50 | **Synapse** | Bridge | [bridge.synapseprotocol.com](https://bridge.synapseprotocol.com) | [synapsecns/sanguine/tree/master/packages/synapse-interface](https://github.com/synapsecns/sanguine/tree/master/packages/synapse-interface) | no | no | yes (own API) | ToS only | no | **C** |
| 51 | **Hop** | Bridge | [app.hop.exchange](https://app.hop.exchange) | [hop-protocol/hop/tree/master/packages/frontend](https://github.com/hop-protocol/hop/tree/master/packages/frontend) | yes (22) | no | optional | no | no | **D** |
| 52 | **Portal Bridge (Wormhole)** | Bridge | [portalbridge.com](https://portalbridge.com) | — *archived (XLabs/portal-bridge-ui, 2025-08); current build closed* | ? | ? | yes (own API) | ? | ? | **C** |
| 53 | **Relay** | Bridge / intents | [relay.link](https://relay.link) | — *closed (relayprotocol/relay-kit = SDK/UI kit)* | no | no | yes (protocol API) | ? | ? | **D** |
| 54 | **Polymarket** | Prediction market | [polymarket.com](https://polymarket.com) | — *closed* | yes (7) + close-only (17) | yes | ? | block (reported 2026-06) | prohibited | **D** |
| 55 | **Safe{Wallet}** | Wallet / multisig | [app.safe.global](https://app.safe.global) | [safe-global/safe-wallet-monorepo/tree/main/apps/web](https://github.com/safe-global/safe-wallet-monorepo/tree/main/apps/web) | no | yes | yes (frontend) | no | no | **C** |
| 56 | **ENS** | Naming | [app.ens.domains](https://app.ens.domains) | [ensdomains/ens-app-v3](https://github.com/ensdomains/ens-app-v3) | no | no | ToS only | no | no | **A** |
| 57 | **Snapshot** | Governance | [snapshot.box](https://snapshot.box) | [snapshot-labs/sx-monorepo/tree/master/apps/ui](https://github.com/snapshot-labs/sx-monorepo/tree/master/apps/ui) | ToS only | no | no | no | no | **A** |

## 4. Live checks: sanctioned address and geo endpoints

Test address: `0x098B716B8Aaf21512996dC57EB0615e2383E2f96` (Ronin bridge exploiter, Lazarus Group, on the SDN list since 2022-04-14). Control addresses: `0x1111…1111` and `0x2222…2222`. The public GET screening endpoints found in the code were tested. Egress was from a US datacenter (Ohio).

| Interface | Result |
|---|---|
| KyberSwap | Blackjack: sanctioned -> blacklisted:true (reason 2, since 2023-12); control -> blacklisted:false |
| Jumper (LI.FI) | LI.FI /v1/quote: SDN fromAddress -> 422, control -> quote OK |
| dYdX | indexer /v4/compliance/screen: SDN -> {status: BLOCKED, reason: COMPLIANCE_PROVIDER}; control -> COMPLIANT |
| Sky (ex-Maker) | api.sky.money/geo-config (US): isRegionRestricted=false, all modules enabled |
| Ethena | WebFetch (US): 302 -> /restricted (geo-block confirmed) |
| Beefy | api.beefy.finance/geo/country (US) -> {country: US} |
| Across | /api/suggested-fees with SDN recipient -> normal quote |
| Synapse | screener: SDN -> {risk: true}; control -> {risk: false} |
| Relay | api.relay.link/sanctioned: SDN -> {sanctioned: true}; control -> false |
| Polymarket | /api/geoblock (US) -> {blocked: true, country: US, region: OH}; overlay 'Trading is blocked in the United States' |

Confirmed: the screening of Synapse, Relay, KyberSwap, dYdX and LI.FI actually rejects the SDN address and lets the control address through. Across does not check the address at the quote stage. Checks through a connected wallet in the UI (Uniswap, Aave, Balancer, Euler, Sky, Sushi/TRM) need a browser with a substituted EIP-1193 provider. The method is described in `plan.md`.

## 5. Mechanisms and evidence

File paths are relative to the root of the repository from the summary table, at HEAD on the snapshot date.

| Interface | Level | Where it is enforced / mechanism | Fail mode | Fork | Note for a fork | Evidence |
|---|---|---|---|---|---|---|
| **Uniswap** | C | Geo: Code has no site-level geo-block. 2025 reports said the whole of Ukraine was blocked through 'third-party providers'<br>Features: RWA tokens, LP, migration, Toucan auctions: region gate GatedFeature.ISSUER_SPECIFIC_RWA plus per-token restriction reasons from compliance v2 (server decides by IP)<br>Screening: own compliance v2 API (entry-gateway.backend-prod.api.uniswap.org); TRM Labs historically (2022)<br>Asset filter: featureGatedTokens token deny-list | open (an unauthenticated session also counts as not-blocked) | yes | Screening and RWA gate are calls to their entry gateway. Remove them in a fork. Routing (Trading API) goes through the same gateway with an API key, which is a dependency. | `packages/compliance/src/client.ts`<br>`packages/compliance/src/screenAddressQuery.ts`<br>`apps/web/src/hooks/useAccountRiskCheck.ts`<br>`packages/uniswap/src/features/transactions/swap/hooks/useGeoRestrictionMode.ts` |
| **SushiSwap** | C | Features: Robinhood stock tokens: US, CA, GB, CH, CU, BY, IR, KP, RU, SY, UA, SS, SD, MM, VE (via /api/geolocation). Perps: Hyperliquid legalCheck (ipAllowed)<br>Screening: TRM Labs public API api.trmlabs.com/public/v1/sanctions/screening; a sanctioned wallet gets disconnected<br>Asset filter: token security / list moderation | open | yes | Everything is client-side. Removed in a fork with no backend dependencies. Perps depend on the Hyperliquid API (IP check on their side). | `apps/web/src/lib/wagmi/components/sanctioned-address-dialog.tsx`<br>`apps/web/src/lib/robinhood/restricted-countries.ts`<br>`apps/web/src/lib/wagmi/systems/checker/stock-token-region.tsx`<br>`apps/web/src/lib/perps/info/use-legal-check.ts` |
| **PancakeSwap** | B | Geo: IP block announced 2022-03 | — | no code | Fork of the last public version of pancake-frontend (an old tag/mirror) is the only route. Needs a browser crawl. | [src](https://forklog.com/en/pancakeswap-to-block-users-from-ten-jurisdictions/amp)<br>[src](https://docs.pancakeswap.finance/protocol/developers/contributing/codebase-overview) |
| **Curve** | A | Geo: ToS reserves technical geo-restriction; none in code<br>Asset filter: pool/token blacklist (local + prices.curve.finance), deprecation | — | yes | Clean; only the content blacklist. Note: the ToS lists Ukraine in full. | `packages/evm-ui/src/widgets/Legal/components/tabs/Terms.tsx`<br>`BLACKLISTS-DEPRECATIONS.md` |
| **Balancer** | C | Screening: Hypernative screener (api.hypernative.xyz/screener/reputation, policy OFAC + 3 hops) via /api/wallet-check -> BlockedAddressModal | unknown | yes | Screening runs in a Next API route with secret keys. Without them a fork simply doesn't screen. | `packages/lib/shared/services/hypernative/checkAddressReputation.ts`<br>`packages/lib/modules/web3/UserAccountProvider.tsx`<br>`packages/lib/modules/web3/BlockedAddressModal.tsx` |
| **CoW Swap** | D | Features: RWA/tokenized-stock token lists hidden by IP (api.country.is), 50 countries incl. US, CA, CN, RU, all of the EU (list here is partial; full list in code); flag isRwaGeoblockEnabled<br>Screening: orderbook backend: hardcoded list + Chainalysis oracle + Hermod (zeroShadow)<br>Asset filter: RWA lists | unknown | partial (protocol API) | The frontend geo filter is trivial to remove, but banned users are rejected by the CoW orderbook API itself. A fork does not bypass that. | `apps/cowswap-frontend/src/modules/rwa/state/geoDataAtom.ts`<br>`libs/core/src/cms/consts.ts`<br>`libs/tokens/src/updaters/RestrictedTokensListUpdater/index.tsx`<br>[src](https://github.com/cowprotocol/services/blob/main/crates/order-validation/src/banned/mod.rs) |
| **1inch** | C | Geo: 2022: US geo-block, since lifted (FAQ now says the US is available)<br>Features: UAE: some features<br>Screening: TRM Labs (help center); ToS also names BlockAid, Web3 Antivirus, MetaMask, Innerworks | unknown | no code | Closed. The alternative is our own UI on top of the 1inch API (needs a key, ToS screening on their side). URL note: app.1inch.io -> 302. | [src](https://help.1inch.com/en/articles/6588963-1inch-address-screening)<br>[src](https://configs.1inch.io/frontend/legal/1inch_com_terms_of_use.pdf) |
| **KyberSwap** | C | Features: per-country token restriction, country taken from the browser timezone (the code calls it a 'UX deterrent')<br>Screening: own Blackjack service (blackjack.kyberswap.com/api/v1/check) before each signature | open | yes | Blackjack is called from the frontend. Removed in a fork. Aggregator API is a separate dependency. | `apps/kyberswap-interface/src/services/blackjack.ts`<br>`apps/kyberswap-interface/src/utils/sendTransaction.ts`<br>`apps/kyberswap-interface/src/hooks/useRestrictedTokens.ts` |
| **QuickSwap** | A | Asset filter: TOKEN_BLACKLIST / PAIR_BLACKLIST | — | yes, stale code | Public code is clean but stale. | `src/constants/index.ts`<br>`public/locales/en.json` |
| **Aerodrome** | B | Geo: ToS 2026-07 forbids evading 'geofencing'<br>Features: tokenized stocks (2026-08) only for non-US users | — | no code | Closed. Sugar contracts (velodrome-finance/sugar) let you read data directly. | [src](https://github.com/aerodrome-finance/docs/blob/main/content/legal.mdx) |
| **Velodrome** | ? | — | — | no code | Closed, same stack as Aerodrome. | [src](https://github.com/velodrome-finance/docs/blob/main/content/legal.mdx) |
| **Ambient Finance** | D | Geo: Netlify redirect by Country -> /blocked.html (edge)<br>Screening: hardcoded OFAC list (~244 addresses) -> disconnect + redirect to ofac.treasury.gov | n/a | yes | Geo lives in netlify.toml, screening in a static list. A fork drops both. | `netlify.toml`<br>`src/ambient-utils/constants/blacklist.ts`<br>`src/App/hooks/useBlacklist.ts` |
| **Velora (ex-ParaSwap)** | ? | — | — | no code | Closed. Velora API is an option. | [src](https://velora.xyz/tos) |
| **Matcha (0x)** | B | Geo: 'Region Unsupported' for trades (Russia, 2022 reports) | — | no code | Closed. The 0x API is an option. | [src](https://www.theblock.co/post/137962/dex-aggregator-matcha-geoblocks-trades-from-russia) |
| **Jumper (LI.FI)** | D | Screening: LI.FI API (li.quest): /v1/quote for an SDN address -> HTTP 422 | unknown | partial (protocol API) | Frontend is clean, but routes come from the LI.FI API, which screens addresses (and LI.FI's ToS excludes US persons). URL note: jumper.exchange -> 302. | `src/components/TermsOfBusiness/lists.tsx`<br>[src](https://li.fi/legal/terms-and-conditions/) |
| **Raydium** | B | Features: Perps (Orderly white-label): US + 15 sanctioned | — | yes, stale code | Snapshot code is clean (disclaimer modal only). Needs a live crawl of production. | `src/components/AppLayout/components/DisclaimerModal.tsx`<br>`src/pages/docs/disclaimer.tsx`<br>[src](https://docs.raydium.io/products/perps) |
| **Jupiter** | A? | — | — | no code | Closed. Jupiter Plugin/API is an option. | [src](https://hub.jup.ag/docs/terms-of-use) |
| **Orca** | D | Geo: UI blocked per the docs list (US was blocked in 2023, not on the list now)<br>Features: newly blocked regions: close-only<br>Screening: third-party (unnamed), at wallet connect | unknown | no code | Closed. Whirlpools SDK is open. | [src](https://docs.orca.so/support/blocked-regions)<br>[src](https://docs.orca.so/trade/availability-and-restrictions) |
| **Meteora** | A? | — | — | no code | Closed. | [src](https://docs.meteora.ag/resources/legal/terms-of-service) |
| **dYdX** | D | Geo: indexer: geo-origin-status header + HTTP 403 GEOBLOCKED (US, CA + OFAC list); the frontend sets isPerpetualsGeoBlocked<br>Features: CLOSE_ONLY / FIRST_STRIKE_CLOSE_ONLY statuses; UK: perpetuals (ToS)<br>Screening: Elliptic (indexer comlink /v4/compliance/screen) | unknown | partial (protocol API) | Enforcement is in the public indexer. A fork must run its own indexer (open source v4-chain/indexer, compliance can be disabled). Otherwise it inherits the 403s. | `src/bonsai/calculators/compliance.ts`<br>`src/bonsai/rest/compliance.ts`<br>[src](https://github.com/dydxprotocol/v4-chain/blob/main/indexer/services/comlink/src/lib/compliance-and-geo-check.ts)<br>[src](https://docs.dydx.xyz/interaction/integration/integration-compliance) |
| **GMX** | A | — | — | yes | Clean. Only the ToS. | `landing/src/pages/TermsAndConditions/TermsAndConditions.tsx` |
| **Hyperliquid** | D | Geo: IP check (US, Ontario, sanctioned jurisdictions — the latter not enumerated); info API has legalCheck {user} -> restrictions/ipAllowed | — | no code | Builder-code frontends (Sushi and others) call legalCheck themselves. The API does not block a fork from trading, but the check exists. | `sushi-labs/sushiswap apps/web/src/lib/perps/info/use-legal-check.ts`<br>[src](https://www.datawallet.com/crypto/is-hyperliquid-available-in-the-usa) |
| **Drift (-> Velocity)** | D | Geo: client-side: geolocation.drift-labs.workers.dev -> GEOBLOCK_LIST | — | no code | Geo-check is client-side and fail-open. Rebranded to Velocity after the 2026-04 exploit. URL note: now app.velocity.exchange. | `velocity-exchange/velocity-common: common-ts/src/utils/geoblock/index.ts, common-ts/src/constants/geoblockList.ts, react/src/hooks/useGeoBlocking.tsx` |
| **gTrade (Gains)** | A? | Geo: ToS 2.6: denial by IP/ISP/VPN | — | no code | Closed. | [src](https://gains.trade/terms-of-service) |
| **Lighter** | A? | Geo: ToS: IP logging for enforcement | — | no code | Closed. SDKs are open. | [src](https://lighter.xyz/terms) |
| **Aave** | C | Geo: ToS: region-based blocking; none in code (presumably edge)<br>Screening: /api/preflight-compliance -> private COMPLIANCE_API_URL/check/{addr}?surface=v3 (TRM Labs historically, 2022) | closed (status=error -> overlay; skipped in read-only mode) | yes | IMPORTANT: a naive fork/IPFS build without the API route will lock out EVERY user (fail-closed). Remove the `AddressBlocked` wrapper in pages/_app.page.tsx. | `pages/api/preflight-compliance.ts`<br>`src/components/AddressBlocked.tsx`<br>`src/hooks/compliance/service-compliance.ts`<br>[src](https://governance.aave.com/t/address-blocking-and-trm-labs/9301) |
| **Compound III** | C | Geo: ToS: IP-based geo-blocking<br>Screening: hardcoded list of 38 addresses, incl. the Tornado Cash router 0x8589…DA16 (TC delisted from SDN in 2025, still blocked here) | n/a | yes | Static list in src/helpers/sanctions.ts. Trivial to remove. Legacy v2 UI: compound-finance/palisade. | `src/helpers/sanctions.ts`<br>`src/contexts/Web3Context.tsx` |
| **Morpho** | C | Features: some markets/vaults hidden or not openable by direct link 'due to legal constraints'<br>Screening: unnamed (docs: blocks US-sanctioned addresses)<br>Asset filter: hidden markets | unknown | no code | Already covered by morpho.cp0x.com. Lite/Fallback apps are archived but forkable. | [src](https://docs.morpho.org/interface/warnings/)<br>[src](https://github.com/morpho-org/morpho-lite-apps) |
| **Spark** | C | Geo: 2023: 'Accessing this website via VPN is not allowed'; US block per 2023 reports<br>Screening: TRM Labs (2023 reports) | unknown | no code | Find the last public spark-app commit (mirrors/forks on GitHub). URL note: now app.spark.finance. | [src](https://cointelegraph.com/news/makerdao-spark-protocol-block-vpn-users-controversy) |
| **Sky (ex-Maker)** | D | Geo: auth service /ip/status -> is_restricted_region -> full-page block 'Access blocked'; the country list is taken from the ToS (not published in code)<br>Features: api.sky.money/geo-config: per-country modules (savings/rewards/expert); unknown region disables them<br>Screening: auth service /address/status + /address/status/enhanced before a tx (paid provider, unnamed) | closed | yes | Everything goes through VITE_AUTH_URL. The repo has a skip-auth build (used for e2e). That is ready to use for a fork. | `apps/webapp/src/lib/authCheck.ts`<br>`apps/webapp/src/modules/ui/context/ConnectedContext.tsx`<br>`apps/webapp/src/modules/ui/hooks/useTermsSignatureGate.tsx`<br>`apps/webapp/src/hooks/authentication/useRestrictedAddressCheck.md` |
| **Venus** | B | Features: per-asset restrictedCountries from the Venus API; country from free.freeipapi.com; gated assets (bStocks) need acknowledgement<br>Asset filter: restricted/gated assets | — | yes | Country from a free IP API, list from their API. Remove in a fork. URL note: now venus.io. | `apps/evm/src/clients/api/queries/useGetIpLocation/getIpLocation/index.ts`<br>`apps/evm/src/clients/api/queries/useGetPools/applyCountryCodeToPools/index.ts` |
| **Euler** | D | Geo: Nuxt server middleware: HTTP 451 on /api/* by edge country header; fail-closed if country unknown<br>Features: per-vault/asset hard/soft blocks by country (incl. EU/EEA groups); withdraw/repay stay allowed<br>Screening: TRM Labs via Euler data-v3 /v3/compliance/address-screening | closed | yes | Open repo with docs (docs/geo-blocking.md, docs/address-screening.md). Everything is behind env config. A fork turns off geo-gate and screening. | `server/middleware/geo-gate.ts`<br>`server/utils/screening.ts`<br>`docs/geo-blocking.md`<br>`docs/address-screening.md` |
| **Fluid** | ? | — | — | no code | Closed. Needs a browser crawl. | — |
| **Kamino** | ? | Asset filter: manual address blacklist (2025-12, Jupiter Lend case, not sanctions) | — | no code | Closed; klend SDK is open. URL note: app.kamino.finance -> 302. | — |
| **marginfi (-> Project 0)** | D | Geo: Next middleware req.geo -> redirect marginfi.com<br>Features: US: /looper -> /not-allowed; Arena: US + 5 -> 'Arena Restricted' | — | yes, stale code | marginfi UI is archived. Project 0 is closed. URL note: retired -> app.0.xyz. | `apps/marginfi-v2-ui/src/middleware.ts`<br>`apps/marginfi-v2-trading/src/middleware.ts` |
| **Liquity V2 (liquity.app)** | B | Geo: NEXT_PUBLIC_BLOCKING_VPNAPI: vpnapi.io country/VPN block, off by default<br>Screening: on-chain blocklist contract isBlackListed (NEXT_PUBLIC_BLOCKING_LIST) | — | yes | Built for third-party frontends. Clean by default. | `frontend/app/src/comps/Blocking/Blocking.tsx`<br>`frontend/app/src/env.ts` |
| **Notional** | D | Geo: api.notional.finance/geoip (Cloudflare cf.country) -> /blocked<br>Screening: Chainalysis Sanctions Oracle 0x40C57923924B5c5c5455c48D93317139ADDaC8fb (on-chain) | unknown | yes | Geo is a request to their worker, screening is an eth_call. Both removed in a fork. | `packages/shared/notionable-hooks/src/use-geoip-block.ts`<br>`packages/notionable/src/account/communities.ts` |
| **Lido** | C | Features: /api/geo (cf-ipcountry): full/limited; remote config geo.limited=[US] -> Earn vaults; Tor/unknown -> limited<br>Screening: /api/validation -> external validationAPI /v2/check/{addr} (unnamed) + local list | unknown | yes | The IPFS build lets you control the API base paths. Stake/Withdraw are not geo-gated. | `utilsApi/geo-handler.ts`<br>`REMOTE_CONFIG_MANIFEST.json`<br>`pages/api/validation.ts`<br>`features/earn/shared/hooks/use-earn-geo-gate.ts` |
| **Rocket Pool** | ? | — | — | no code | Needs a browser crawl. | — |
| **EigenLayer (EigenCloud)** | B | Geo: 2024: EIGEN claims site only (IP + VPN detection) | — | no code | Closed. | [src](https://decrypt.co/228642/eigen-token-airdrop-plan-ethereum-restaking-protocol-eigenlayer) |
| **ether.fi** | A? | Features: Liquid vaults: not US/UK; Liquid Reserve: not NY<br>Screening: ToS: 'wallet screening' for Trade | — | no code | Closed. URL note: app.ether.fi -> 302. | [src](https://www.ether.fi/legal/terms-of-use) |
| **Pendle** | A? | Geo: ToS mentions geo-blocks<br>Features: Boros: not US<br>Screening: ToS: wallet-screening DB, wallet blacklisting | — | no code | Closed. Pendle API/SDK are open. | [src](https://docs.pendle.finance/pendle-v2/TermsOfUse) |
| **Ethena** | D | Geo: 302 -> ethena.fi/restricted ('not available in your country' / high-risk wallet); confirmed live from the US, the ToS list (33 jurisdictions) is not live-verified<br>Features: mint/redeem: KYC whitelist only; sUSDe not for EU/EEA<br>Screening: unnamed (restricted page + Mint blocked addresses) | unknown | no code | Closed. Staking USDe->sUSDe is a plain ERC-4626 that works directly via the contract. | [src](https://ethena.fi/restricted)<br>[src](https://docs.ethena.fi/resources/terms-of-service) |
| **Yearn** | A | — | — | yes | Clean. | — |
| **Beefy** | B | Features: vaults with tokenized equities (Base): US, CA, GB, AU, SG; country from api.beefy.finance/geo/country; fail-closed<br>Asset filter: src/config/restrictions.json | — | yes | Restriction is just a JSON config plus their API. There is a geoCountryOverride flag. | `src/config/restrictions.json`<br>`src/features/data/selectors/restrictions.ts`<br>`src/features/data/actions/restrictions.ts` |
| **Convex** | ? | — | — | no code | Closed, no ToS. | — |
| **Jito** | ? | — | — | no code | Closed. | [src](https://www.jito.network/docs/jitosol/resources/terms-of-use/) |
| **Across** | A? | Geo: ToS: by IP, at Risk Labs' discretion | — | no code | Across API is open (suggested-fees, available-routes). Our own UI on top of it is realistic. URL note: app.across.to -> 302. | [src](https://across.to/terms-of-service)<br>[src](http://web.archive.org/web/20250829200542/https://github.com/across-protocol/frontend) |
| **Stargate** | A? | — | — | no code | Closed. | [src](https://stargate.finance/terms) |
| **Synapse** | C | Screening: bundled blacklist + screener.omnirpc.io/fe/address/{addr} (Chainalysis Entity API behind it); connected + destination address | closed (error = flagged) | yes | IMPORTANT: fail-closed. If the screener is down, everyone is flagged. A fork removes screenAddress(). | `packages/synapse-interface/utils/screenAddress.ts`<br>`packages/synapse-interface/contexts/UserProvider.tsx`<br>`packages/synapse-interface/store/middleware/destinationAddressMiddleware.ts` |
| **Hop** | D | Geo: netlify.toml: HTTP 451 by Country<br>Screening: OFAC list (ultrasoundmoney), REACT_APP_BLOCKLIST_ENABLED | — | yes | WARNING: hop.exchange apex serves gambling spam (domain lapsed/hijacked). app.hop.exchange -> HTTP 400. Good candidate for a permissionless replacement. | `packages/frontend/netlify.toml`<br>`packages/frontend/src/config/blocklist.ts` |
| **Portal Bridge (Wormhole)** | C | Screening: archived UI: TRM Labs via proxy (risk score >= 10 -> block, fail-open). wormhole-connect widget: hardcoded OFAC SDN list | open | no code | Base: wormhole-foundation/wormhole-connect (widget) + the archived portal-bridge-ui. | `XLabs/portal-bridge-ui: apps/connect/src/providers/sanctions.ts`<br>`wormhole-foundation/wormhole-connect: src/utils/transferValidation.ts, src/consts/wallet.ts` |
| **Relay** | D | Screening: Chainalysis + HackBounty + Hermod + internal blocklist; public endpoint api.relay.link/sanctioned/{addr} | unknown | no code | Screening runs at quote and fill level in the protocol API. A fork does not bypass it. | [src](https://docs.relay.link/security/compliance)<br>`relayprotocol/relay-kit: packages/sdk/src/types/api.ts` |
| **Polymarket** | D | Geo: polymarket.com/api/geoblock; overlay 'Trading is blocked' + view-only; close-only list is partial ('and others' per help center)<br>Features: close-only tiers; frontend-only tier (IE, JP, NL, KR) | — | no code | The CLOB API is also geo-blocked for the main tiers. An alternative frontend requires an API proxy outside the blocked jurisdictions. | [src](https://docs.polymarket.com/developers/CLOB/geoblock)<br>[src](https://help.polymarket.com/en/articles/13364163-geographic-restrictions) |
| **Safe{Wallet}** | C | Features: HEAD /swap -> 403 for OFAC countries -> swap/stake/earn/Safe token hidden; the core wallet works<br>Screening: Chainalysis Sanctions Oracle (on-chain) -> feature-level 'Blocked address' | unknown | yes | Only native integrations are restricted (swap via CoW, stake via Kiln and so on). The core wallet is permissionless. | `apps/web/src/components/common/GeoblockingProvider/index.tsx`<br>`apps/web/src/hooks/useSanctionedAddress.ts`<br>`apps/web/src/config/constants.ts` |
| **ENS** | A | Screening: ToS 3.1(b) implies address blocking | — | yes | Clean. | — |
| **Snapshot** | A | Geo: ToS reserves geo-restriction | — | yes | Clean. Legacy snapshot.org client: snapshot-labs/snapshot. | `apps/ui/src/views/Terms.vue` |

## 6. Types of mechanisms (for the crawler schema)

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

## 7. Priorities for the pi.cp0x.com catalog

Criteria: a high restriction level plus the protocol's importance plus how realistic an alternative is.

- **Fork of an open frontend with the gates cut out (fast):** Euler (`euler-lite`, everything behind env, docs on geo and screening exist), Sky (`jetstreamgg/tarmac`, a skip-auth build exists), Aave (`aave/interface`, remove `<AddressBlocked>`), Notional, Lido (Earn), Synapse, Balancer, Uniswap (given its dependence on the Trading API).
- **Own UI on top of the contracts, no code available:** Ethena (sUSDe staking, a plain ERC-4626), Spark, Orca, Pendle, Morpho (`morpho.cp0x.com` already exists).
- **Needs infrastructure, not only a UI:** dYdX (a self-hosted indexer without compliance), Polymarket (a proxy to the CLOB outside the blocked jurisdictions), Hyperliquid (API without an IP gate, the `legalCheck` runs in the frontend).
- **Orphaned protocols:** Hop: the `hop.exchange` domain serves spam, `app.hop.exchange` is down, while the contracts are alive. A candidate to replace the official interface.

## 8. Limits of this snapshot

- Live checks ran **from a single point (a US datacenter)** and without executing JS. Geo-blocks that fire only on the client or only for other countries are visible only through the code. Closed interfaces (levels `A?` and `?`) need a browser crawl through residential proxies by country (see `plan.md`).
- Repositories were scanned at HEAD of the default branch. Production can differ from the code: the hash of QuickSwap's production build is missing from the repository, Raydium is published as a snapshot, Uniswap as a release mirror.
- The static scanner gives candidates. Every C/D finding in the table is confirmed by reading the code or by a live request. The raw scanner hits contain false positives: `elliptic` as a crypto library, `blockaid` as a transaction scanner in the Uniswap wallet rather than compliance, Hypernative Guard in Safe.
- The Terms of many apps are rendered on the client. Where the Terms could not be read, the value is `unknown`, with no guessing.
