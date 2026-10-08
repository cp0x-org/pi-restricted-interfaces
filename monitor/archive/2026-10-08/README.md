# Архив среза 2026-10-08: все 57 интерфейсов

Полный каталог до фильтрации сайта по EVM. Файлы рядом: `interfaces.json` (данные v2), `interfaces.csv`, `report.md` (отчёт на русском), `observations.json` (живые наблюдения P3).
На сайте показаны только EVM-интерфейсы (колонка «Сайт»); не-EVM остаются в данных.

| # | Интерфейс | Сети | Уровень | Гео сайт | Гео фичи | Скрининг | VPN | Форк | Сайт | Живые наблюдения (P3) |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Uniswap** | Ethereum, Unichain, Base, Arbitrum +9 | **C** | reported (1) | yes | yes (own-api) | no | yes | да | — |
| 2 | **SushiSwap** | Ethereum, Arbitrum, Base, Optimism +8 | **C** | no | yes | yes (frontend) | tos_only | yes | да | — |
| 3 | **PancakeSwap** | BNB Chain, Ethereum, Arbitrum, Base +4 | **B** | reported (10) | ? | ? | unknown | no_code | да | — |
| 4 | **Curve** | Ethereum, Arbitrum, Optimism, Base +7 | **A** | ToS only | no | no | no | yes | да | — |
| 5 | **Balancer** | Ethereum, Arbitrum, Base, Avalanche +4 | **C** | no | no | yes (own-api) | no | yes | да | — |
| 6 | **CoW Swap** | Ethereum, Gnosis, Arbitrum, Base +3 | **D** | no | yes | yes (protocol-api) | no | partial | да | — |
| 7 | **1inch** | Ethereum, Arbitrum, Base, Optimism +8 | **C** | reported | ToS only | yes (own-api) | tos_only | no_code | да | — |
| 8 | **KyberSwap** | Ethereum, Arbitrum, Optimism, Base +10 | **C** | no | yes | yes (own-api) | tos_only | yes | да | — |
| 9 | **QuickSwap** | Polygon, Polygon zkEVM, Manta Pacific, Immutable zkEVM +2 | **A** | ? | ? | no | tos_only | stale | да | — |
| 10 | **Aerodrome** | Base | **B** | ToS only | yes | ? | tos_only | no_code | да | — |
| 11 | **Velodrome** | Optimism, Mode, Lisk, Fraxtal +5 | **?** | ? | ? | ? | unknown | no_code | да | — |
| 12 | **Ambient Finance** | Ethereum, Scroll, Blast, Swell +1 | **D** | yes (21) | no | yes (frontend) | no | yes | да | — |
| 13 | **Velora (ex-ParaSwap)** | Ethereum, Arbitrum, Base, Optimism +6 | **?** | ? | ? | ? | unknown | no_code | да | — |
| 14 | **Matcha (0x)** | Ethereum, Arbitrum, Base, Optimism +9 | **B** | reported (1) | ? | ToS only | tos_only | no_code | да | — |
| 15 | **Jumper (LI.FI)** | Ethereum, Arbitrum, Base, Optimism +8 | **D** | no | no | yes (protocol-api) | tos_only | partial | да | — |
| 16 | **Raydium** | Solana | **B** | ? | yes | no | unknown | stale | нет (не-EVM) | — |
| 17 | **Jupiter** | Solana | **A?** | ? | ? | ToS only | tos_only | no_code | нет (не-EVM) | — |
| 18 | **Orca** | Solana | **D** | yes (28) | yes | yes (own-api) | unknown | no_code | нет (не-EVM) | — |
| 19 | **Meteora** | Solana | **A?** | ToS only | ? | ToS only | tos_only | no_code | нет (не-EVM) | — |
| 20 | **dYdX** | dYdX Chain | **D** | yes (24) | yes | yes (protocol-api) | tos_only | partial | нет (не-EVM) | US/isp: geo_endpoint ok (HTTP 200); US/isp: site ok (HTTP 200) |
| 21 | **GMX** | Arbitrum, Avalanche, Botanix | **A** | no | no | no | tos_only | yes | да | — |
| 22 | **Hyperliquid** | Hyperliquid L1 | **D** | yes (2) | ? | ? (protocol-api) | tos_only | no_code | нет (не-EVM) | — |
| 23 | **Drift (-> Velocity)** | Solana | **D** | yes (26) | ? | ? | unknown | no_code | нет (не-EVM) | — |
| 24 | **gTrade (Gains)** | Arbitrum, Base, Polygon, ApeChain | **A?** | ToS only | ? | ToS only | tos_only | no_code | да | — |
| 25 | **Lighter** | Lighter (zk L2) | **A?** | ToS only | ? | ToS only | unknown | no_code | нет (не-EVM) | — |
| 26 | **Aave** | Ethereum, Arbitrum, Optimism, Base +11 | **C** | ToS only | no | yes (own-api) | tos_only | yes | да | — |
| 27 | **Compound III** | Ethereum, Arbitrum, Base, Polygon +6 | **C** | ToS only | no | yes (frontend) | tos_only | yes | да | — |
| 28 | **Morpho** | Ethereum, Base, Arbitrum, Optimism +6 | **C** | ? | yes | yes (own-api) | tos_only | no_code | да | — |
| 29 | **Spark** | Ethereum, Base, Arbitrum, Gnosis +3 | **C** | reported (1) | ? | reported (own-api) | block | no_code | да | — |
| 30 | **Sky (ex-Maker)** | Ethereum, Base, Arbitrum, Optimism +1 | **D** | yes (35) | yes | yes (own-api) | detect | yes | да | — |
| 31 | **Venus** | BNB Chain, Ethereum, Arbitrum, Base +4 | **B** | no | yes | no | no | yes | да | — |
| 32 | **Euler** | Ethereum, Base, Arbitrum, Avalanche +7 | **D** | yes (22) | yes | yes (own-api) | detect | yes | да | US/isp: geo_endpoint unknown (HTTP 403); US/isp: site ok (HTTP 200) |
| 33 | **Fluid** | Ethereum, Arbitrum, Base, Polygon | **?** | ? | ? | ? | unknown | no_code | да | — |
| 34 | **Kamino** | Solana | **?** | ? | ? | ? | unknown | no_code | нет (не-EVM) | — |
| 35 | **marginfi (-> Project 0)** | Solana | **D** | yes (5) | yes | ToS only | tos_only | stale | нет (не-EVM) | — |
| 36 | **Liquity V2 (liquity.app)** | Ethereum | **B** | optional | no | optional (frontend) | optional | yes | да | — |
| 37 | **Notional** | Ethereum, Arbitrum | **D** | yes (18) | no | yes (frontend) | no | yes | да | — |
| 38 | **Lido** | Ethereum | **C** | no | yes | yes (own-api) | detect | yes | да | — |
| 39 | **Rocket Pool** | Ethereum | **?** | ? | ? | ? | unknown | no_code | да | — |
| 40 | **EigenLayer (EigenCloud)** | Ethereum | **B** | reported (7) | ? | ToS only | block | no_code | да | — |
| 41 | **ether.fi** | Ethereum, Arbitrum, Base, Linea +2 | **A?** | ToS only | ToS only | ToS only | tos_only | no_code | да | — |
| 42 | **Pendle** | Ethereum, Arbitrum, Base, BNB Chain +4 | **A?** | ToS only | ToS only | ToS only | tos_only | no_code | да | — |
| 43 | **Ethena** | Ethereum, Arbitrum, Base, Optimism +3 | **D** | yes (1) | yes | yes (own-api) | tos_only | no_code | да | US/isp: site blocked (HTTP 200) |
| 44 | **Yearn** | Ethereum, Arbitrum, Base, Polygon +3 | **A** | no | no | no | no | yes | да | — |
| 45 | **Beefy** | Ethereum, Arbitrum, Base, Optimism +7 | **B** | no | yes | no | no | yes | да | — |
| 46 | **Convex** | Ethereum, Arbitrum, Polygon, Fraxtal | **?** | ? | ? | ? | unknown | no_code | да | — |
| 47 | **Jito** | Solana | **?** | ? | ? | ? | unknown | no_code | нет (не-EVM) | — |
| 48 | **Across** | Ethereum, Arbitrum, Optimism, Base +11 | **A?** | ToS only | no | ? | tos_only | no_code | да | — |
| 49 | **Stargate** | Ethereum, Arbitrum, Optimism, Base +7 | **A?** | ToS only | ? | ? | tos_only | no_code | да | — |
| 50 | **Synapse** | Ethereum, Arbitrum, Optimism, Base +6 | **C** | no | no | yes (own-api) | tos_only | yes | да | — |
| 51 | **Hop** | Ethereum, Arbitrum, Optimism, Base +5 | **D** | yes (22) | no | optional (frontend) | no | yes | да | US/isp: site unknown (HTTP 400) |
| 52 | **Portal Bridge (Wormhole)** | Ethereum, BNB Chain, Polygon, Avalanche +5 | **C** | ? | ? | yes (own-api) | unknown | no_code | да | — |
| 53 | **Relay** | Ethereum, Arbitrum, Base, Optimism +7 | **D** | no | no | yes (protocol-api) | unknown | no_code | да | — |
| 54 | **Polymarket** | Polygon | **D** | yes (7) | yes | ? | block | no_code | да | US/isp: geo_endpoint blocked (HTTP 200) |
| 55 | **Safe{Wallet}** | Ethereum, Arbitrum, Optimism, Base +13 | **C** | no | yes | yes (frontend) | no | yes | да | — |
| 56 | **ENS** | Ethereum | **A** | no | no | ToS only | no | yes | да | — |
| 57 | **Snapshot** | any EVM (off-chain voting) | **A** | ToS only | no | no | no | yes | да | — |

Не показаны на сайте (11): Raydium, Jupiter, Orca, Meteora, dYdX, Hyperliquid, Drift (-> Velocity), Lighter, Kamino, marginfi (-> Project 0), Jito.

Живые проверки исходного среза шли из US-датацентра без JS (см. report.md §4). Наблюдения P3 из US через ISP-прокси Decodo (2026-10-08): Ethena 302 → /restricted, Polymarket /api/geoblock blocked:true, dYdX/Euler главная отдана, Sky недоступен через прокси.
