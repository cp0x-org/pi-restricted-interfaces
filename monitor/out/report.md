# Монитор ограничений в официальных DeFi-интерфейсах

**Срез:** 2026-10-08 · **Охват:** DEX и агрегаторы, perps, lending, staking/yield, бриджи, prediction markets, кошельки и governance.
**Данные:** `interfaces.json` (источник истины), `interfaces.csv` (открывается в Excel), `pi-monitor-prototype.zip` (сканер, сборщик отчёта, верификатор и сырые хиты `scan_raw.json`).

Всего интерфейсов: **57**, с открытым фронтендом: **28**, закрытых: **29**. Уровни: D — 15, C — 13, B — 8, A — 6, A? — 8, ? — 7.

---

## 1. Главное

1. **Ограничения уходят с уровня сайта на уровень кошелька и актива.** Полный гео-блок сайта встречается редко. Типовая схема 2026 года выглядит так: скрининг кошелька через собственный бэкенд оператора плюс гео-фильтр отдельных активов. Особенно это касается RWA и токенизированных акций. Так устроены Uniswap, Sushi, CoW, Beefy, Venus, Euler, Aerodrome и Lido Earn. Robinhood-токены у Sushi закрыты для 15 стран, включая всю Украину.
2. **Для форка важно не «есть ли ограничение», а где оно исполняется.**
   - **Фронтенд или свой API оператора.** Ограничение удаляется в форке: Aave, Euler, Sky, Uniswap, Sushi, Balancer, Synapse, Notional, Ambient, Hop.
   - **API протокола.** Форк наследует ограничение: CoW orderbook (Chainalysis oracle + Hermod), LI.FI API (422 на SDN-адрес), Relay (Chainalysis + HackBounty), индексер dYdX (Elliptic + 403 GEOBLOCKED), CLOB Polymarket. Здесь нужен свой инфраструктурный слой: self-hosted индексер dYdX или прокси вне заблокированных юрисдикций. Для скрининга в API протокола обхода нет.
3. **Ловушки fail-closed при форке.** В нескольких репозиториях гейт блокирует всех, если бэкенд не настроен или недоступен. Гейт нужно удалять, а не просто не задавать env:
   - Aave: `/api/preflight-compliance` возвращает ошибку, и показывается оверлей на всё приложение.
   - Synapse: ошибка скринера означает «flagged».
   - Euler: неизвестная страна приводит к 451 на `/api/*`.
   - Sky: нет вердикта по IP — приложение блокируется.
   - Beefy: неизвестная гео приводит к блоку токенизированных акций.
4. **Фронтенды закрываются.** С 2025 года код стал приватным или удалён у PancakeSwap (`pancake-frontend`), Across (`frontend`), Spark (`spark-app`). Morpho Lite/Fallback и Portal Bridge UI заархивированы. Uniswap публикует только release-mirror, Raydium и QuickSwap держат устаревшие снапшоты. Монитор должен отслеживать видимость репозиториев и хранить свои зеркала.
5. **Статические санкционные списки расходятся с SDN.** Compound III до сих пор блокирует адреса Tornado Cash, хотя OFAC снял санкции в марте 2025. Ambient и wormhole-connect держат захардкоженные списки. Проверка «работает ли санкционный адрес» должна использовать актуальный SDN-адрес, например через `isSanctioned()` Chainalysis oracle.
6. **Чистые официальные интерфейсы.** Технических ограничений в коде не найдено у GMX, Curve, Yearn, ENS и Snapshot. Для каталога у них низкий приоритет. В ToS Curve и Snapshot (список SECO) Украина указана целиком, но техническое исполнение в коде отсутствует.
7. **Провайдеры скрининга** (по числу интерфейсов с подтверждённым или задокументированным скринингом): TRM Labs — 7, Chainalysis — 5, не раскрыт — 5, статический список — 4, собственный сервис — 2, Hermod/zeroShadow — 2, Hypernative — 1, Elliptic — 1, HackBounty — 1.

## 2. Легенда

| Уровень | Значение |
|---|---|
| **D** | Гео-блок всего сайта или торговли, **или** скрининг в API протокола (форк не помогает без своей инфры) |
| **C** | Скрининг кошелька на фронтенде или в своём API оператора |
| **B** | Ограничения только на уровне фич или активов, исторические отчёты или опциональный код |
| **A** | Технических ограничений не найдено, код открыт |
| **A?** | Ограничения есть только в ToS, код закрыт: нужен браузерный краул |
| **?** | Недостаточно данных: код закрыт, ToS не найден или рендерится на клиенте |

Значения в колонках: `да` подтверждено кодом, живой проверкой или официальной документацией · `по отчётам` пресса или пользователи · `только ToS` право зарезервировано, исполнение не найдено · `опц.` есть в коде, выключено по умолчанию · `?` неизвестно.

## 3. Сводная таблица

| # | Интерфейс | Категория | URL | GitHub фронтенда | Гео: сайт | Гео: фичи/активы | Скрининг кошелька | VPN | ToS: US | Уровень |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Uniswap** | DEX | [app.uniswap.org](https://app.uniswap.org) | [Uniswap/interface/tree/main/apps/web](https://github.com/Uniswap/interface/tree/main/apps/web) | по отчётам (UA) | да | да (свой API) | нет | нет | **C** |
| 2 | **SushiSwap** | DEX | [www.sushi.com](https://www.sushi.com) | [sushi-labs/sushiswap/tree/master/apps/web](https://github.com/sushi-labs/sushiswap/tree/master/apps/web) | нет | да | да (фронтенд) | только ToS | нет | **C** |
| 3 | **PancakeSwap** | DEX | [pancakeswap.finance](https://pancakeswap.finance) | — *private-now (pancakeswap/pancake-frontend was public, docs still link to it; now 404/auth)* | по отчётам (10) | ? | ? | ? | ? | **B** |
| 4 | **Curve** | DEX | [www.curve.finance](https://www.curve.finance) | [curvefi/curve-frontend](https://github.com/curvefi/curve-frontend) | только ToS | нет | нет | нет | нет | **A** |
| 5 | **Balancer** | DEX | [balancer.fi](https://balancer.fi) | [balancer/frontend-monorepo/tree/main/apps/frontend-v3](https://github.com/balancer/frontend-monorepo/tree/main/apps/frontend-v3) | нет | нет | да (свой API) | нет | нет | **C** |
| 6 | **CoW Swap** | DEX / intents | [swap.cow.fi](https://swap.cow.fi) | [cowprotocol/cowswap/tree/develop/apps/cowswap-frontend](https://github.com/cowprotocol/cowswap/tree/develop/apps/cowswap-frontend) | нет | да | да (API протокола) | нет | нет | **D** |
| 7 | **1inch** | DEX aggregator | [1inch.com](https://1inch.com) | — *closed* | по отчётам | только ToS | да (свой API) | только ToS | нет | **C** |
| 8 | **KyberSwap** | DEX aggregator | [kyberswap.com](https://kyberswap.com) | [KyberNetwork/kyberswap-interface/tree/main/apps/kyberswap-interface](https://github.com/KyberNetwork/kyberswap-interface/tree/main/apps/kyberswap-interface) | нет | да | да (свой API) | только ToS | нет | **C** |
| 9 | **QuickSwap** | DEX | [dapp.quickswap.exchange](https://dapp.quickswap.exchange) | [QuickSwap/interface-v2](https://github.com/QuickSwap/interface-v2) | ? | ? | нет | только ToS | запрещено | **A** |
| 10 | **Aerodrome** | DEX | [aerodrome.finance](https://aerodrome.finance) | — *closed (only aerodrome-finance/docs)* | только ToS | да | ? | только ToS | частично (securities) | **B** |
| 11 | **Velodrome** | DEX | [velodrome.finance](https://velodrome.finance) | — *closed (only velodrome-finance/docs, sugar)* | ? | ? | ? | ? | нет | **?** |
| 12 | **Ambient Finance** | DEX | [ambient.finance](https://ambient.finance) | [CrocSwap/ambient-ts-app](https://github.com/CrocSwap/ambient-ts-app) | да (21) | нет | да (фронтенд) | нет | нет | **D** |
| 13 | **Velora (ex-ParaSwap)** | DEX aggregator | [app.velora.xyz](https://app.velora.xyz) | — *closed* | ? | ? | ? | ? | частично (incentive programs) | **?** |
| 14 | **Matcha (0x)** | DEX aggregator | [matcha.xyz](https://matcha.xyz) | — *closed* | по отчётам (RU) | ? | только ToS | только ToS | нет | **B** |
| 15 | **Jumper (LI.FI)** | Bridge / aggregator | [jumper.xyz](https://jumper.xyz) | [jumperexchange/jumper-exchange](https://github.com/jumperexchange/jumper-exchange) | нет | нет | да (API протокола) | только ToS | нет | **D** |
| 16 | **Raydium** | DEX | [raydium.io](https://raydium.io) | [raydium-io/raydium-ui-v3-public](https://github.com/raydium-io/raydium-ui-v3-public) | ? | да | нет | ? | запрещено | **B** |
| 17 | **Jupiter** | DEX aggregator | [jup.ag](https://jup.ag) | — *closed (jup-ag/plugin = widget)* | ? | ? | только ToS | только ToS | запрещено | **A?** |
| 18 | **Orca** | DEX | [www.orca.so](https://www.orca.so) | — *closed* | да (28) | да | да (свой API) | ? | ? | **D** |
| 19 | **Meteora** | DEX | [app.meteora.ag](https://app.meteora.ag) | — *closed* | только ToS | ? | только ToS | только ToS | запрещено | **A?** |
| 20 | **dYdX** | Perps | [dydx.trade](https://dydx.trade) | [dydxprotocol/v4-web](https://github.com/dydxprotocol/v4-web) | да (24) | да | да (API протокола) | только ToS | запрещено | **D** |
| 21 | **GMX** | Perps | [app.gmx.io](https://app.gmx.io) | [gmx-io/gmx-interface](https://github.com/gmx-io/gmx-interface) | нет | нет | нет | только ToS | нет | **A** |
| 22 | **Hyperliquid** | Perps | [app.hyperliquid.xyz](https://app.hyperliquid.xyz) | — *closed* | да (US, CA-ON) | ? | ? | только ToS | запрещено | **D** |
| 23 | **Drift (-> Velocity)** | Perps | [app.drift.trade](https://app.drift.trade) | — *closed (velocity-exchange/velocity-common = shared lib)* | да (26) | ? | ? | ? | ? | **D** |
| 24 | **gTrade (Gains)** | Perps | [gains.trade](https://gains.trade) | — *closed* | только ToS | ? | только ToS | только ToS | запрещено | **A?** |
| 25 | **Lighter** | Perps | [app.lighter.xyz](https://app.lighter.xyz) | — *closed* | только ToS | ? | только ToS | ? | запрещено | **A?** |
| 26 | **Aave** | Lending | [app.aave.com](https://app.aave.com) | [aave/interface](https://github.com/aave/interface) | только ToS | нет | да (свой API) | только ToS | нет | **C** |
| 27 | **Compound III** | Lending | [app.compound.finance](https://app.compound.finance) | [compound-finance/webb3-frontend](https://github.com/compound-finance/webb3-frontend) | только ToS | нет | да (фронтенд) | только ToS | нет | **C** |
| 28 | **Morpho** | Lending | [app.morpho.org](https://app.morpho.org) | — *closed (morpho-lite-apps archived 2026-05-06)* | ? | да | да (свой API) | только ToS | нет | **C** |
| 29 | **Spark** | Lending / savings | [app.spark.fi](https://app.spark.fi) | — *private-now (marsfoundation/spark-app, sparkdotfi/spark-app -> 404)* | по отчётам (US) | ? | по отчётам (свой API) | блок (2023 reports; current status not confirmed) | нет | **C** |
| 30 | **Sky (ex-Maker)** | Savings / lending | [app.sky.money](https://app.sky.money) | [jetstreamgg/tarmac/tree/development/apps/webapp](https://github.com/jetstreamgg/tarmac/tree/development/apps/webapp) | да (35) | да | да (свой API) | детект (not blocked; VPN/US users must sign the terms on every tx) | нет | **D** |
| 31 | **Venus** | Lending | [app.venus.io](https://app.venus.io) | [VenusProtocol/venus-protocol-interface/tree/main/apps/evm](https://github.com/VenusProtocol/venus-protocol-interface/tree/main/apps/evm) | нет | да | нет | нет | частично (Fixed-Term Vault) | **B** |
| 32 | **Euler** | Lending | [app.euler.finance](https://app.euler.finance) | [euler-xyz/euler-lite](https://github.com/euler-xyz/euler-lite) | да (22) | да | да (свой API) | детект (logged only, not blocked) | нет | **D** |
| 33 | **Fluid** | Lending / DEX | [fluid.io](https://fluid.io) | — *closed* | ? | ? | ? | ? | ? | **?** |
| 34 | **Kamino** | Lending | [kamino.com](https://kamino.com) | — *closed* | ? | ? | ? | ? | ? | **?** |
| 35 | **marginfi (-> Project 0)** | Lending | [app.marginfi.com](https://app.marginfi.com) | [mrgnlabs/mrgn-ts/tree/main/apps/marginfi-v2-ui](https://github.com/mrgnlabs/mrgn-ts/tree/main/apps/marginfi-v2-ui) | да (5) | да | только ToS | только ToS | нет | **D** |
| 36 | **Liquity V2 (liquity.app)** | CDP / stablecoin | [liquity.app](https://liquity.app) | [liquity/bold/tree/main/frontend/app](https://github.com/liquity/bold/tree/main/frontend/app) | опц. | нет | опц. | опц. | ? | **B** |
| 37 | **Notional** | Lending / leverage | [notional.finance](https://notional.finance) | [notional-finance/notional-monorepo](https://github.com/notional-finance/notional-monorepo) | да (18) | нет | да (фронтенд) | нет | запрещено | **D** |
| 38 | **Lido** | Liquid staking | [stake.lido.fi](https://stake.lido.fi) | [lidofinance/ethereum-staking-widget](https://github.com/lidofinance/ethereum-staking-widget) | нет | да | да (свой API) | детект (Tor exits get the 'limited' mode) | частично (Earn vaults) | **C** |
| 39 | **Rocket Pool** | Liquid staking | [stake.rocketpool.net](https://stake.rocketpool.net) | — *none-found* | ? | ? | ? | ? | ? | **?** |
| 40 | **EigenLayer (EigenCloud)** | Restaking | [app.eigenlayer.xyz](https://app.eigenlayer.xyz) | — *closed* | по отчётам (7) | ? | только ToS | блок (2024, EIGEN claims site) | нет | **B** |
| 41 | **ether.fi** | Restaking / vaults | [www.ether.fi/app](https://www.ether.fi/app) | — *closed* | только ToS | только ToS | только ToS | только ToS | частично | **A?** |
| 42 | **Pendle** | Yield | [app.pendle.finance](https://app.pendle.finance) | — *closed* | только ToS | только ToS | только ToS | только ToS | частично (Boros) | **A?** |
| 43 | **Ethena** | Synthetic dollar | [app.ethena.fi](https://app.ethena.fi) | — *closed* | да (US) | да | да (свой API) | только ToS | запрещено | **D** |
| 44 | **Yearn** | Yield vaults | [yearn.fi](https://yearn.fi) | [yearn/yearn.fi](https://github.com/yearn/yearn.fi) | нет | нет | нет | нет | ? | **A** |
| 45 | **Beefy** | Yield vaults | [app.beefy.com](https://app.beefy.com) | [beefyfinance/beefy-v2](https://github.com/beefyfinance/beefy-v2) | нет | да | нет | нет | ? | **B** |
| 46 | **Convex** | Yield | [curve.convexfinance.com](https://curve.convexfinance.com) | — *closed* | ? | ? | ? | ? | ? | **?** |
| 47 | **Jito** | Liquid staking | [www.jito.network](https://www.jito.network) | — *closed* | ? | ? | ? | ? | нет | **?** |
| 48 | **Across** | Bridge | [across.to](https://across.to) | — *private-now (across-protocol/frontend public until ~2025-08; frontend-v1 = legacy 2023)* | только ToS | нет | ? | только ToS | нет | **A?** |
| 49 | **Stargate** | Bridge | [stargate.finance](https://stargate.finance) | — *closed* | только ToS | ? | ? | только ToS | нет | **A?** |
| 50 | **Synapse** | Bridge | [bridge.synapseprotocol.com](https://bridge.synapseprotocol.com) | [synapsecns/sanguine/tree/master/packages/synapse-interface](https://github.com/synapsecns/sanguine/tree/master/packages/synapse-interface) | нет | нет | да (свой API) | только ToS | нет | **C** |
| 51 | **Hop** | Bridge | [app.hop.exchange](https://app.hop.exchange) | [hop-protocol/hop/tree/master/packages/frontend](https://github.com/hop-protocol/hop/tree/master/packages/frontend) | да (22) | нет | опц. | нет | нет | **D** |
| 52 | **Portal Bridge (Wormhole)** | Bridge | [portalbridge.com](https://portalbridge.com) | — *archived (XLabs/portal-bridge-ui, 2025-08); current build closed* | ? | ? | да (свой API) | ? | ? | **C** |
| 53 | **Relay** | Bridge / intents | [relay.link](https://relay.link) | — *closed (relayprotocol/relay-kit = SDK/UI kit)* | нет | нет | да (API протокола) | ? | ? | **D** |
| 54 | **Polymarket** | Prediction market | [polymarket.com](https://polymarket.com) | — *closed* | да (7) + close-only (17) | да | ? | блок (reported 2026-06) | запрещено | **D** |
| 55 | **Safe{Wallet}** | Wallet / multisig | [app.safe.global](https://app.safe.global) | [safe-global/safe-wallet-monorepo/tree/main/apps/web](https://github.com/safe-global/safe-wallet-monorepo/tree/main/apps/web) | нет | да | да (фронтенд) | нет | нет | **C** |
| 56 | **ENS** | Naming | [app.ens.domains](https://app.ens.domains) | [ensdomains/ens-app-v3](https://github.com/ensdomains/ens-app-v3) | нет | нет | только ToS | нет | нет | **A** |
| 57 | **Snapshot** | Governance | [snapshot.box](https://snapshot.box) | [snapshot-labs/sx-monorepo/tree/master/apps/ui](https://github.com/snapshot-labs/sx-monorepo/tree/master/apps/ui) | только ToS | нет | нет | нет | нет | **A** |

## 4. Живые проверки: санкционный адрес и гео-эндпоинты

Тестовый адрес: `0x098B716B8Aaf21512996dC57EB0615e2383E2f96` (эксплойтер Ronin bridge, Lazarus Group, в SDN с 2022-04-14). Контрольные адреса: `0x1111…1111` и `0x2222…2222`. Проверялись публичные GET-эндпоинты скрининга, найденные в коде. Egress был из US-датацентра (Огайо).

| Интерфейс | Результат |
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

Подтверждено: скрининг Synapse, Relay, KyberSwap, dYdX и LI.FI реально отклоняет SDN-адрес и пропускает контрольный. Across на этапе котировки адрес не проверяет. Проверки через подключённый кошелёк в UI (Uniswap, Aave, Balancer, Euler, Sky, Sushi/TRM) требуют браузера с подменённым EIP-1193 провайдером. Методика описана в `plan.md`.

## 5. Механизмы и доказательства

Пути к файлам указаны относительно корня репозитория из сводной таблицы, на HEAD от даты среза.

| Интерфейс | Уровень | Где enforcement / механизм | Fail-mode | Форк | Заметка для форка | Доказательства |
|---|---|---|---|---|---|---|
| **Uniswap** | C | Гео: Code has no site-level geo-block. 2025 reports said the whole of Ukraine was blocked through 'third-party providers'<br>Фичи: RWA tokens, LP, migration, Toucan auctions: region gate GatedFeature.ISSUER_SPECIFIC_RWA plus per-token restriction reasons from compliance v2 (server decides by IP)<br>Скрининг: own compliance v2 API (entry-gateway.backend-prod.api.uniswap.org); TRM Labs historically (2022)<br>Фильтр активов: featureGatedTokens token deny-list | open (an unauthenticated session also counts as not-blocked) | да | Screening and RWA gate are calls to their entry gateway. Remove them in a fork. Routing (Trading API) goes through the same gateway with an API key, which is a dependency. | `packages/compliance/src/client.ts`<br>`packages/compliance/src/screenAddressQuery.ts`<br>`apps/web/src/hooks/useAccountRiskCheck.ts`<br>`packages/uniswap/src/features/transactions/swap/hooks/useGeoRestrictionMode.ts` |
| **SushiSwap** | C | Фичи: Robinhood stock tokens: US, CA, GB, CH, CU, BY, IR, KP, RU, SY, UA, SS, SD, MM, VE (via /api/geolocation). Perps: Hyperliquid legalCheck (ipAllowed)<br>Скрининг: TRM Labs public API api.trmlabs.com/public/v1/sanctions/screening; a sanctioned wallet gets disconnected<br>Фильтр активов: token security / list moderation | open | да | Everything is client-side. Removed in a fork with no backend dependencies. Perps depend on the Hyperliquid API (IP check on their side). | `apps/web/src/lib/wagmi/components/sanctioned-address-dialog.tsx`<br>`apps/web/src/lib/robinhood/restricted-countries.ts`<br>`apps/web/src/lib/wagmi/systems/checker/stock-token-region.tsx`<br>`apps/web/src/lib/perps/info/use-legal-check.ts` |
| **PancakeSwap** | B | Гео: IP block announced 2022-03 | — | нет кода | Fork of the last public version of pancake-frontend (an old tag/mirror) is the only route. Needs a browser crawl. | [src](https://forklog.com/en/pancakeswap-to-block-users-from-ten-jurisdictions/amp)<br>[src](https://docs.pancakeswap.finance/protocol/developers/contributing/codebase-overview) |
| **Curve** | A | Гео: ToS reserves technical geo-restriction; none in code<br>Фильтр активов: pool/token blacklist (local + prices.curve.finance), deprecation | — | да | Clean; only the content blacklist. Note: the ToS lists Ukraine in full. | `packages/evm-ui/src/widgets/Legal/components/tabs/Terms.tsx`<br>`BLACKLISTS-DEPRECATIONS.md` |
| **Balancer** | C | Скрининг: Hypernative screener (api.hypernative.xyz/screener/reputation, policy OFAC + 3 hops) via /api/wallet-check -> BlockedAddressModal | unknown | да | Screening runs in a Next API route with secret keys. Without them a fork simply doesn't screen. | `packages/lib/shared/services/hypernative/checkAddressReputation.ts`<br>`packages/lib/modules/web3/UserAccountProvider.tsx`<br>`packages/lib/modules/web3/BlockedAddressModal.tsx` |
| **CoW Swap** | D | Фичи: RWA/tokenized-stock token lists hidden by IP (api.country.is), 50 countries incl. US, CA, CN, RU, all of the EU (list here is partial; full list in code); flag isRwaGeoblockEnabled<br>Скрининг: orderbook backend: hardcoded list + Chainalysis oracle + Hermod (zeroShadow)<br>Фильтр активов: RWA lists | unknown | частично (API протокола) | The frontend geo filter is trivial to remove, but banned users are rejected by the CoW orderbook API itself. A fork does not bypass that. | `apps/cowswap-frontend/src/modules/rwa/state/geoDataAtom.ts`<br>`libs/core/src/cms/consts.ts`<br>`libs/tokens/src/updaters/RestrictedTokensListUpdater/index.tsx`<br>[src](https://github.com/cowprotocol/services/blob/main/crates/order-validation/src/banned/mod.rs) |
| **1inch** | C | Гео: 2022: US geo-block, since lifted (FAQ now says the US is available)<br>Фичи: UAE: some features<br>Скрининг: TRM Labs (help center); ToS also names BlockAid, Web3 Antivirus, MetaMask, Innerworks | unknown | нет кода | Closed. The alternative is our own UI on top of the 1inch API (needs a key, ToS screening on their side). | [src](https://help.1inch.com/en/articles/6588963-1inch-address-screening)<br>[src](https://configs.1inch.io/frontend/legal/1inch_com_terms_of_use.pdf) |
| **KyberSwap** | C | Фичи: per-country token restriction, country taken from the browser timezone (the code calls it a 'UX deterrent')<br>Скрининг: own Blackjack service (blackjack.kyberswap.com/api/v1/check) before each signature | open | да | Blackjack is called from the frontend. Removed in a fork. Aggregator API is a separate dependency. | `apps/kyberswap-interface/src/services/blackjack.ts`<br>`apps/kyberswap-interface/src/utils/sendTransaction.ts`<br>`apps/kyberswap-interface/src/hooks/useRestrictedTokens.ts` |
| **QuickSwap** | A | Фильтр активов: TOKEN_BLACKLIST / PAIR_BLACKLIST | — | да, код устарел | Public code is clean but stale. | `src/constants/index.ts`<br>`public/locales/en.json` |
| **Aerodrome** | B | Гео: ToS 2026-07 forbids evading 'geofencing'<br>Фичи: tokenized stocks (2026-08) only for non-US users | — | нет кода | Closed. Sugar contracts (velodrome-finance/sugar) let you read data directly. | [src](https://github.com/aerodrome-finance/docs/blob/main/content/legal.mdx) |
| **Velodrome** | ? | — | — | нет кода | Closed, same stack as Aerodrome. | [src](https://github.com/velodrome-finance/docs/blob/main/content/legal.mdx) |
| **Ambient Finance** | D | Гео: Netlify redirect by Country -> /blocked.html (edge)<br>Скрининг: hardcoded OFAC list (~244 addresses) -> disconnect + redirect to ofac.treasury.gov | n/a | да | Geo lives in netlify.toml, screening in a static list. A fork drops both. | `netlify.toml`<br>`src/ambient-utils/constants/blacklist.ts`<br>`src/App/hooks/useBlacklist.ts` |
| **Velora (ex-ParaSwap)** | ? | — | — | нет кода | Closed. Velora API is an option. | [src](https://velora.xyz/tos) |
| **Matcha (0x)** | B | Гео: 'Region Unsupported' for trades (Russia, 2022 reports) | — | нет кода | Closed. The 0x API is an option. | [src](https://www.theblock.co/post/137962/dex-aggregator-matcha-geoblocks-trades-from-russia) |
| **Jumper (LI.FI)** | D | Скрининг: LI.FI API (li.quest): /v1/quote for an SDN address -> HTTP 422 | unknown | частично (API протокола) | Frontend is clean, but routes come from the LI.FI API, which screens addresses (and LI.FI's ToS excludes US persons). | `src/components/TermsOfBusiness/lists.tsx`<br>[src](https://li.fi/legal/terms-and-conditions/) |
| **Raydium** | B | Фичи: Perps (Orderly white-label): US + 15 sanctioned | — | да, код устарел | Snapshot code is clean (disclaimer modal only). Needs a live crawl of production. | `src/components/AppLayout/components/DisclaimerModal.tsx`<br>`src/pages/docs/disclaimer.tsx`<br>[src](https://docs.raydium.io/products/perps) |
| **Jupiter** | A? | — | — | нет кода | Closed. Jupiter Plugin/API is an option. | [src](https://hub.jup.ag/docs/terms-of-use) |
| **Orca** | D | Гео: UI blocked per the docs list (US was blocked in 2023, not on the list now)<br>Фичи: newly blocked regions: close-only<br>Скрининг: third-party (unnamed), at wallet connect | unknown | нет кода | Closed. Whirlpools SDK is open. | [src](https://docs.orca.so/support/blocked-regions)<br>[src](https://docs.orca.so/trade/availability-and-restrictions) |
| **Meteora** | A? | — | — | нет кода | Closed. | [src](https://docs.meteora.ag/resources/legal/terms-of-service) |
| **dYdX** | D | Гео: indexer: geo-origin-status header + HTTP 403 GEOBLOCKED (US, CA + OFAC list); the frontend sets isPerpetualsGeoBlocked<br>Фичи: CLOSE_ONLY / FIRST_STRIKE_CLOSE_ONLY statuses; UK: perpetuals (ToS)<br>Скрининг: Elliptic (indexer comlink /v4/compliance/screen) | unknown | частично (API протокола) | Enforcement is in the public indexer. A fork must run its own indexer (open source v4-chain/indexer, compliance can be disabled). Otherwise it inherits the 403s. | `src/bonsai/calculators/compliance.ts`<br>`src/bonsai/rest/compliance.ts`<br>[src](https://github.com/dydxprotocol/v4-chain/blob/main/indexer/services/comlink/src/lib/compliance-and-geo-check.ts)<br>[src](https://docs.dydx.xyz/interaction/integration/integration-compliance) |
| **GMX** | A | — | — | да | Clean. Only the ToS. | `landing/src/pages/TermsAndConditions/TermsAndConditions.tsx` |
| **Hyperliquid** | D | Гео: IP check (US, Ontario, sanctioned jurisdictions — the latter not enumerated); info API has legalCheck {user} -> restrictions/ipAllowed | — | нет кода | Builder-code frontends (Sushi and others) call legalCheck themselves. The API does not block a fork from trading, but the check exists. | `sushi-labs/sushiswap apps/web/src/lib/perps/info/use-legal-check.ts`<br>[src](https://www.datawallet.com/crypto/is-hyperliquid-available-in-the-usa) |
| **Drift (-> Velocity)** | D | Гео: client-side: geolocation.drift-labs.workers.dev -> GEOBLOCK_LIST | — | нет кода | Geo-check is client-side and fail-open. Rebranded to Velocity after the 2026-04 exploit. | `velocity-exchange/velocity-common: common-ts/src/utils/geoblock/index.ts, common-ts/src/constants/geoblockList.ts, react/src/hooks/useGeoBlocking.tsx` |
| **gTrade (Gains)** | A? | Гео: ToS 2.6: denial by IP/ISP/VPN | — | нет кода | Closed. | [src](https://gains.trade/terms-of-service) |
| **Lighter** | A? | Гео: ToS: IP logging for enforcement | — | нет кода | Closed. SDKs are open. | [src](https://lighter.xyz/terms) |
| **Aave** | C | Гео: ToS: region-based blocking; none in code (presumably edge)<br>Скрининг: /api/preflight-compliance -> private COMPLIANCE_API_URL/check/{addr}?surface=v3 (TRM Labs historically, 2022) | closed (status=error -> overlay; skipped in read-only mode) | да | IMPORTANT: a naive fork/IPFS build without the API route will lock out EVERY user (fail-closed). Remove the `AddressBlocked` wrapper in pages/_app.page.tsx. | `pages/api/preflight-compliance.ts`<br>`src/components/AddressBlocked.tsx`<br>`src/hooks/compliance/service-compliance.ts`<br>[src](https://governance.aave.com/t/address-blocking-and-trm-labs/9301) |
| **Compound III** | C | Гео: ToS: IP-based geo-blocking<br>Скрининг: hardcoded list of 38 addresses, incl. the Tornado Cash router 0x8589…DA16 (TC delisted from SDN in 2025, still blocked here) | n/a | да | Static list in src/helpers/sanctions.ts. Trivial to remove. Legacy v2 UI: compound-finance/palisade. | `src/helpers/sanctions.ts`<br>`src/contexts/Web3Context.tsx` |
| **Morpho** | C | Фичи: some markets/vaults hidden or not openable by direct link 'due to legal constraints'<br>Скрининг: unnamed (docs: blocks US-sanctioned addresses)<br>Фильтр активов: hidden markets | unknown | нет кода | Already covered by morpho.cp0x.com. Lite/Fallback apps are archived but forkable. | [src](https://docs.morpho.org/interface/warnings/)<br>[src](https://github.com/morpho-org/morpho-lite-apps) |
| **Spark** | C | Гео: 2023: 'Accessing this website via VPN is not allowed'; US block per 2023 reports<br>Скрининг: TRM Labs (2023 reports) | unknown | нет кода | Find the last public spark-app commit (mirrors/forks on GitHub). | [src](https://cointelegraph.com/news/makerdao-spark-protocol-block-vpn-users-controversy) |
| **Sky (ex-Maker)** | D | Гео: auth service /ip/status -> is_restricted_region -> full-page block 'Access blocked'; the country list is taken from the ToS (not published in code)<br>Фичи: api.sky.money/geo-config: per-country modules (savings/rewards/expert); unknown region disables them<br>Скрининг: auth service /address/status + /address/status/enhanced before a tx (paid provider, unnamed) | closed | да | Everything goes through VITE_AUTH_URL. The repo has a skip-auth build (used for e2e). That is ready to use for a fork. | `apps/webapp/src/lib/authCheck.ts`<br>`apps/webapp/src/modules/ui/context/ConnectedContext.tsx`<br>`apps/webapp/src/modules/ui/hooks/useTermsSignatureGate.tsx`<br>`apps/webapp/src/hooks/authentication/useRestrictedAddressCheck.md` |
| **Venus** | B | Фичи: per-asset restrictedCountries from the Venus API; country from free.freeipapi.com; gated assets (bStocks) need acknowledgement<br>Фильтр активов: restricted/gated assets | — | да | Country from a free IP API, list from their API. Remove in a fork. | `apps/evm/src/clients/api/queries/useGetIpLocation/getIpLocation/index.ts`<br>`apps/evm/src/clients/api/queries/useGetPools/applyCountryCodeToPools/index.ts` |
| **Euler** | D | Гео: Nuxt server middleware: HTTP 451 on /api/* by edge country header; fail-closed if country unknown<br>Фичи: per-vault/asset hard/soft blocks by country (incl. EU/EEA groups); withdraw/repay stay allowed<br>Скрининг: TRM Labs via Euler data-v3 /v3/compliance/address-screening | closed | да | Open repo with docs (docs/geo-blocking.md, docs/address-screening.md). Everything is behind env config. A fork turns off geo-gate and screening. | `server/middleware/geo-gate.ts`<br>`server/utils/screening.ts`<br>`docs/geo-blocking.md`<br>`docs/address-screening.md` |
| **Fluid** | ? | — | — | нет кода | Closed. Needs a browser crawl. | — |
| **Kamino** | ? | Фильтр активов: manual address blacklist (2025-12, Jupiter Lend case, not sanctions) | — | нет кода | Closed; klend SDK is open. | — |
| **marginfi (-> Project 0)** | D | Гео: Next middleware req.geo -> redirect marginfi.com<br>Фичи: US: /looper -> /not-allowed; Arena: US + 5 -> 'Arena Restricted' | — | да, код устарел | marginfi UI is archived. Project 0 is closed. | `apps/marginfi-v2-ui/src/middleware.ts`<br>`apps/marginfi-v2-trading/src/middleware.ts` |
| **Liquity V2 (liquity.app)** | B | Гео: NEXT_PUBLIC_BLOCKING_VPNAPI: vpnapi.io country/VPN block, off by default<br>Скрининг: on-chain blocklist contract isBlackListed (NEXT_PUBLIC_BLOCKING_LIST) | — | да | Built for third-party frontends. Clean by default. | `frontend/app/src/comps/Blocking/Blocking.tsx`<br>`frontend/app/src/env.ts` |
| **Notional** | D | Гео: api.notional.finance/geoip (Cloudflare cf.country) -> /blocked<br>Скрининг: Chainalysis Sanctions Oracle 0x40C57923924B5c5c5455c48D93317139ADDaC8fb (on-chain) | unknown | да | Geo is a request to their worker, screening is an eth_call. Both removed in a fork. | `packages/shared/notionable-hooks/src/use-geoip-block.ts`<br>`packages/notionable/src/account/communities.ts` |
| **Lido** | C | Фичи: /api/geo (cf-ipcountry): full/limited; remote config geo.limited=[US] -> Earn vaults; Tor/unknown -> limited<br>Скрининг: /api/validation -> external validationAPI /v2/check/{addr} (unnamed) + local list | unknown | да | The IPFS build lets you control the API base paths. Stake/Withdraw are not geo-gated. | `utilsApi/geo-handler.ts`<br>`REMOTE_CONFIG_MANIFEST.json`<br>`pages/api/validation.ts`<br>`features/earn/shared/hooks/use-earn-geo-gate.ts` |
| **Rocket Pool** | ? | — | — | нет кода | Needs a browser crawl. | — |
| **EigenLayer (EigenCloud)** | B | Гео: 2024: EIGEN claims site only (IP + VPN detection) | — | нет кода | Closed. | [src](https://decrypt.co/228642/eigen-token-airdrop-plan-ethereum-restaking-protocol-eigenlayer) |
| **ether.fi** | A? | Фичи: Liquid vaults: not US/UK; Liquid Reserve: not NY<br>Скрининг: ToS: 'wallet screening' for Trade | — | нет кода | Closed. | [src](https://www.ether.fi/legal/terms-of-use) |
| **Pendle** | A? | Гео: ToS mentions geo-blocks<br>Фичи: Boros: not US<br>Скрининг: ToS: wallet-screening DB, wallet blacklisting | — | нет кода | Closed. Pendle API/SDK are open. | [src](https://docs.pendle.finance/pendle-v2/TermsOfUse) |
| **Ethena** | D | Гео: 302 -> ethena.fi/restricted ('not available in your country' / high-risk wallet); confirmed live from the US, the ToS list (33 jurisdictions) is not live-verified<br>Фичи: mint/redeem: KYC whitelist only; sUSDe not for EU/EEA<br>Скрининг: unnamed (restricted page + Mint blocked addresses) | unknown | нет кода | Closed. Staking USDe->sUSDe is a plain ERC-4626 that works directly via the contract. | [src](https://ethena.fi/restricted)<br>[src](https://docs.ethena.fi/resources/terms-of-service) |
| **Yearn** | A | — | — | да | Clean. | — |
| **Beefy** | B | Фичи: vaults with tokenized equities (Base): US, CA, GB, AU, SG; country from api.beefy.finance/geo/country; fail-closed<br>Фильтр активов: src/config/restrictions.json | — | да | Restriction is just a JSON config plus their API. There is a geoCountryOverride flag. | `src/config/restrictions.json`<br>`src/features/data/selectors/restrictions.ts`<br>`src/features/data/actions/restrictions.ts` |
| **Convex** | ? | — | — | нет кода | Closed, no ToS. | — |
| **Jito** | ? | — | — | нет кода | Closed. | [src](https://www.jito.network/docs/jitosol/resources/terms-of-use/) |
| **Across** | A? | Гео: ToS: by IP, at Risk Labs' discretion | — | нет кода | Across API is open (suggested-fees, available-routes). Our own UI on top of it is realistic. | [src](https://across.to/terms-of-service)<br>[src](http://web.archive.org/web/20250829200542/https://github.com/across-protocol/frontend) |
| **Stargate** | A? | — | — | нет кода | Closed. | [src](https://stargate.finance/terms) |
| **Synapse** | C | Скрининг: bundled blacklist + screener.omnirpc.io/fe/address/{addr} (Chainalysis Entity API behind it); connected + destination address | closed (error = flagged) | да | IMPORTANT: fail-closed. If the screener is down, everyone is flagged. A fork removes screenAddress(). | `packages/synapse-interface/utils/screenAddress.ts`<br>`packages/synapse-interface/contexts/UserProvider.tsx`<br>`packages/synapse-interface/store/middleware/destinationAddressMiddleware.ts` |
| **Hop** | D | Гео: netlify.toml: HTTP 451 by Country<br>Скрининг: OFAC list (ultrasoundmoney), REACT_APP_BLOCKLIST_ENABLED | — | да | WARNING: hop.exchange apex serves gambling spam (domain lapsed/hijacked). app.hop.exchange -> HTTP 400. Good candidate for a permissionless replacement. | `packages/frontend/netlify.toml`<br>`packages/frontend/src/config/blocklist.ts` |
| **Portal Bridge (Wormhole)** | C | Скрининг: archived UI: TRM Labs via proxy (risk score >= 10 -> block, fail-open). wormhole-connect widget: hardcoded OFAC SDN list | open | нет кода | Base: wormhole-foundation/wormhole-connect (widget) + the archived portal-bridge-ui. | `XLabs/portal-bridge-ui: apps/connect/src/providers/sanctions.ts`<br>`wormhole-foundation/wormhole-connect: src/utils/transferValidation.ts, src/consts/wallet.ts` |
| **Relay** | D | Скрининг: Chainalysis + HackBounty + Hermod + internal blocklist; public endpoint api.relay.link/sanctioned/{addr} | unknown | нет кода | Screening runs at quote and fill level in the protocol API. A fork does not bypass it. | [src](https://docs.relay.link/security/compliance)<br>`relayprotocol/relay-kit: packages/sdk/src/types/api.ts` |
| **Polymarket** | D | Гео: polymarket.com/api/geoblock; overlay 'Trading is blocked' + view-only; close-only list is partial ('and others' per help center)<br>Фичи: close-only tiers; frontend-only tier (IE, JP, NL, KR) | — | нет кода | The CLOB API is also geo-blocked for the main tiers. An alternative frontend requires an API proxy outside the blocked jurisdictions. | [src](https://docs.polymarket.com/developers/CLOB/geoblock)<br>[src](https://help.polymarket.com/en/articles/13364163-geographic-restrictions) |
| **Safe{Wallet}** | C | Фичи: HEAD /swap -> 403 for OFAC countries -> swap/stake/earn/Safe token hidden; the core wallet works<br>Скрининг: Chainalysis Sanctions Oracle (on-chain) -> feature-level 'Blocked address' | unknown | да | Only native integrations are restricted (swap via CoW, stake via Kiln and so on). The core wallet is permissionless. | `apps/web/src/components/common/GeoblockingProvider/index.tsx`<br>`apps/web/src/hooks/useSanctionedAddress.ts`<br>`apps/web/src/config/constants.ts` |
| **ENS** | A | Скрининг: ToS 3.1(b) implies address blocking | — | да | Clean. | — |
| **Snapshot** | A | Гео: ToS reserves geo-restriction | — | да | Clean. Legacy snapshot.org client: snapshot-labs/snapshot. | `apps/ui/src/views/Terms.vue` |

## 6. Типология механизмов (для схемы краулера)

| Слой | Как детектится | Примеры |
|---|---|---|
| Edge/CDN | HTTP 403/451/302 по стране без JS; `netlify.toml` `conditions.Country`, Next `middleware` `req.geo`, `cf-ipcountry`, `x-vercel-ip-country` | Hop (451), Ambient (302 → /blocked.html), Euler (451 на `/api`), marginfi |
| Клиентский гео-чек | JS-запрос к гео-API: `api.country.is`, `free.freeipapi.com`, `*/geo/country`, `/api/geoblock`, `geolocation.*.workers.dev` | CoW, Venus, Beefy, Polymarket, Drift, Notional, Sushi |
| Гео-сервис оператора с фичефлагами | ответ содержит `isRegionRestricted`/`gatedFeatures`/`limited` | Sky (`/ip/status`, `geo-config`), Uniswap compliance v2, Lido `/api/geo` |
| VPN-детект | `is_vpn`, vpnapi.io, IPQS; Tor `T1` | Sky (детект → подпись ToS), Euler (лог), Liquity (опц.), Lido (Tor → limited) |
| Скрининг кошелька, внешний API | запрос с адресом в теле или URL сразу после connect | TRM (Sushi, 1inch, Aave ист.), Hypernative (Balancer), Elliptic (dYdX), Chainalysis Entity (Synapse) |
| Скрининг on-chain | `eth_call isSanctioned()` к `0x40C5…C8fb` | Notional, Safe, CoW backend |
| Статический список | массив адресов в бандле | Compound, Ambient, wormhole-connect, Hop (опц.) |
| Ограничения активов | token deny-list или RWA-листы по стране | Uniswap, CoW, Beefy, Venus, Sushi, Curve (контент-блэклист) |

## 7. Приоритеты для каталога pi.cp0x.com

Критерии: высокий уровень ограничений плюс значимость протокола плюс реалистичность альтернативы.

- **Форк открытого фронтенда с вырезанием гейтов (быстро):** Euler (`euler-lite`, всё за env, есть доки по гео и скринингу), Sky (`jetstreamgg/tarmac`, есть skip-auth сборка), Aave (`aave/interface`, убрать `<AddressBlocked>`), Notional, Lido (Earn), Synapse, Balancer, Uniswap (с учётом зависимости от Trading API).
- **Свой UI поверх контрактов, кода нет:** Ethena (стейкинг sUSDe, обычный ERC-4626), Spark, Orca, Pendle, Morpho (уже есть `morpho.cp0x.com`).
- **Нужна инфраструктура, не только UI:** dYdX (self-hosted индексер без compliance), Polymarket (прокси к CLOB вне заблокированных юрисдикций), Hyperliquid (API без IP-гейта, проверка `legalCheck` на стороне фронта).
- **Сиротские протоколы:** Hop — домен `hop.exchange` отдаёт спам, `app.hop.exchange` недоступен, а контракты живы. Это кандидат на замену официального интерфейса.

## 8. Ограничения этого среза

- Живые проверки шли **из одной точки (US-датацентр)** и без исполнения JS. Гео-блоки, которые срабатывают только на клиенте или только для других стран, видны только через код. Для закрытых интерфейсов (уровни `A?` и `?`) нужен браузерный краул через резидентные прокси по странам (см. `plan.md`).
- Репозитории просканированы на HEAD default-ветки. Прод может расходиться с кодом: у QuickSwap хэш прод-сборки отсутствует в репо, Raydium выложен снапшотом, Uniswap — release-mirror.
- Статический сканер даёт кандидатов. Каждая находка уровня C/D в таблице подтверждена ручным чтением кода или живым запросом. Сырые хиты сканера содержат ложные срабатывания: `elliptic` как крипто-библиотека, `blockaid` как сканер транзакций в кошельке Uniswap, а не compliance; Hypernative Guard в Safe.
- ToS многих приложений рендерятся на клиенте. Если ToS не удалось прочитать, стоит `unknown`, без догадок.
