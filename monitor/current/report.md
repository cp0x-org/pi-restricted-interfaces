# Reproduced restrictions table

Generated 2026-10-28T23:44:52Z by `research/combine.py` from the check results below. Compared with the published dashboard `src/data/monitor.json`: **67 of 69** interfaces have the same rating and the same number of restrictions.

Check runs: code — 2026-10-28T22:38:21Z, bundle — 2026-10-28T22:52:41Z, docs — 2026-10-28T22:57:04Z, api — 2026-10-28T22:57:18Z, live — 2026-10-28T23:07:56Z

Rating: number of restrictions (each blocked country/region once + 1 per feature gate, wallet screening, VPN detection, KYC; Terms-only reservations do not count). A = 0, B = 1–5, C = 6–20, D > 20, n/a = nothing established.

| Interface | Rating | Restrictions | Site | Match | Checks (pass/recorded/fail/other) |
|---|---|---|---|---|---|
| [Uniswap](#uniswap) | **B** | 5 | B / 5 | yes | 5/1/1/0 |
| [SushiSwap](#sushiswap) | **C** | 17 | C / 17 | yes | 6/0/0/0 |
| [PancakeSwap](#pancakeswap) | **C** | 10 | C / 10 | yes | 1/0/0/0 |
| [Curve](#curve) | **A** | 0 | A / 0 | yes | 5/0/0/0 |
| [Curve Classic UI](#curve-classic) | **A** | 0 | A / 0 | yes | 2/0/0/0 |
| [Balancer](#balancer) | **B** | 1 | B / 1 | yes | 2/0/0/0 |
| [CoW Swap](#cowswap) | **D** | 52 | D / 52 | yes | 4/0/0/0 |
| [1inch](#1inch) | **B** | 2 | B / 2 | yes | 2/0/0/0 |
| [KyberSwap](#kyberswap) | **C** | 9 | C / 9 | yes | 6/1/0/0 |
| [QuickSwap](#quickswap) | **A** | 0 | A / 0 | yes | 4/0/0/0 |
| [Aerodrome](#aerodrome) | **B** | 2 | B / 2 | yes | 1/0/0/0 |
| [Velodrome](#velodrome) | **n/a** | 0 | n/a / 0 | yes | 0/0/0/0 |
| [Ambient Finance](#ambient) | **D** | 22 | D / 22 | yes | 4/0/0/0 |
| [Velora (ex-ParaSwap)](#velora) | **C** | 9 | C / 9 | yes | 0/1/0/0 |
| [Matcha (0x)](#matcha) | **B** | 1 | B / 1 | yes | 1/0/0/0 |
| [Jumper (LI.FI)](#jumper) | **C** | 15 | C / 17 | **no** | 1/2/0/0 |
| [GMX](#gmx) | **A** | 0 | A / 0 | yes | 4/0/0/0 |
| [Hyperliquid](#hyperliquid) | **D** | 28 | D / 28 | yes | 3/2/0/0 |
| [gTrade (Gains)](#gtrade) | **B** | 4 | B / 4 | yes | 3/1/0/0 |
| [Lighter](#lighter) | **C** | 12 | C / 12 | yes | 2/1/0/0 |
| [Aave V3](#aave) | **B** | 1 | B / 1 | yes | 4/0/0/0 |
| [Aave V4 (Aave Pro)](#aave-pro) | **B** | 2 | B / 3 | **no** | 1/0/2/0 |
| [Compound III](#compound) | **C** | 6 | C / 6 | yes | 3/1/0/0 |
| [Compound V2](#compound-v2) | **B** | 5 | B / 5 | yes | 1/1/0/0 |
| [Morpho](#morpho) | **B** | 2 | B / 2 | yes | 2/0/0/0 |
| [Spark](#spark) | **D** | 21 | D / 21 | yes | 3/1/0/0 |
| [Sky (ex-Maker)](#sky) | **D** | 38 | D / 38 | yes | 12/0/0/0 |
| [Venus](#venus) | **B** | 1 | B / 1 | yes | 2/0/1/0 |
| [Euler](#euler) | **D** | 25 | D / 25 | yes | 6/0/0/0 |
| [Fluid](#fluid) | **n/a** | 0 | n/a / 0 | yes | 0/0/0/0 |
| [Liquity V2](#liquity) | **A** | 0 | A / 0 | yes | 4/0/0/0 |
| [Notional Exponent](#notional) | **C** | 19 | C / 19 | yes | 4/0/0/0 |
| [Notional V3](#notional-v3) | **D** | 21 | D / 21 | yes | 4/0/0/0 |
| [Notional V2](#notional-v2) | **A** | 0 | A / 0 | yes | 2/0/0/0 |
| [Lido](#lido) | **C** | 7 | C / 7 | yes | 8/1/0/0 |
| [Lido V3 (stVaults)](#lido-stvaults) | **B** | 1 | B / 1 | yes | 5/0/0/0 |
| [Rocket Pool](#rocketpool) | **n/a** | 0 | n/a / 0 | yes | 0/0/0/0 |
| [EigenLayer (EigenCloud)](#eigenlayer) | **C** | 11 | C / 11 | yes | 3/1/0/0 |
| [ether.fi](#etherfi) | **A** | 0 | A / 0 | yes | 1/0/0/0 |
| [Pendle](#pendle) | **C** | 6 | C / 6 | yes | 1/1/0/0 |
| [Ethena](#ethena) | **D** | 50 | D / 50 | yes | 5/1/0/0 |
| [Yearn](#yearn) | **A** | 0 | A / 0 | yes | 4/0/0/0 |
| [Beefy](#beefy) | **C** | 6 | C / 6 | yes | 3/0/0/0 |
| [Convex](#convex) | **n/a** | 0 | n/a / 0 | yes | 0/0/0/0 |
| [Across](#across) | **A** | 0 | A / 0 | yes | 1/0/0/0 |
| [Stargate](#stargate) | **B** | 2 | B / 2 | yes | 3/0/0/0 |
| [Synapse](#synapse) | **B** | 1 | B / 1 | yes | 3/0/0/0 |
| [Portal Bridge (Wormhole)](#portalbridge) | **B** | 2 | B / 2 | yes | 2/0/1/0 |
| [Relay](#relay) | **B** | 1 | B / 1 | yes | 2/0/0/0 |
| [Polymarket](#polymarket) | **D** | 50 | D / 50 | yes | 6/1/0/0 |
| [Safe{Wallet}](#safe) | **B** | 5 | B / 5 | yes | 4/1/0/0 |
| [ENS](#ens) | **A** | 0 | A / 0 | yes | 4/0/0/0 |
| [ENS Legacy Manager](#ens-legacy) | **A** | 0 | A / 0 | yes | 4/0/0/0 |
| [Snapshot](#snapshot) | **A** | 0 | A / 0 | yes | 5/0/0/0 |
| [Ondo Finance](#ondo) | **D** | 21 | D / 21 | yes | 2/0/0/0 |
| [Maple Finance](#maple) | **A** | 0 | A / 0 | yes | 1/0/0/0 |
| [Centrifuge](#centrifuge) | **B** | 2 | B / 2 | yes | 2/0/0/0 |
| [Superstate](#superstate) | **C** | 10 | C / 10 | yes | 2/1/0/0 |
| [Symbiotic](#symbiotic) | **C** | 6 | C / 6 | yes | 1/0/0/0 |
| [Kelp DAO](#kelp) | **C** | 12 | C / 12 | yes | 5/1/0/0 |
| [Lombard](#lombard) | **B** | 3 | B / 3 | yes | 1/0/0/0 |
| [Frax Finance](#frax) | **B** | 2 | B / 2 | yes | 2/0/0/0 |
| [Usual](#usual) | **A** | 0 | A / 0 | yes | 1/0/0/0 |
| [deBridge](#debridge) | **A** | 0 | A / 0 | yes | 1/0/0/0 |
| [OpenSea](#opensea) | **B** | 2 | B / 2 | yes | 2/0/0/0 |
| [Tornado Cash](#tornado) | **B** | 1 | B / 1 | yes | 1/0/0/0 |
| [Variational (Omni)](#variational) | **B** | 1 | B / 1 | yes | 2/0/0/0 |
| [Extended](#extended) | **C** | 11 | C / 11 | yes | 3/1/0/0 |
| [Aster](#aster) | **C** | 9 | C / 9 | yes | 1/2/1/0 |

## Coverage: every check family for every interface

A cell is empty only when there is nothing to check (no open repository, no published Terms, no public screening API). Live: the app's state from this machine and from each verified proxy country.

Interfaces with items to review (sweep findings the published data does not explain): **9**.

| Interface | App JS | Live | Code | Terms | API | Claim checks | Review |
|---|---|---|---|---|---|---|---|
| [Uniswap](#uniswap) | 1500 scripts (capped) | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:error CU:blocked SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | 7997 files | 2 countries (via archive) | — no public screening API known | 7 | |
| [SushiSwap](#sushiswap) | 355 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:error FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:error CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | 2824 files | 26 countries (via archive) | 1 check(s) | 6 | |
| [PancakeSwap](#pancakeswap) | 23 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:error AE:ok SA:ok IL:error PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:challenge CU:challenge SY:challenge VE:ok MM:challenge AF:ok IQ:challenge LB:error LY:ok SS:ok ZW:challenge NI:ok CD:challenge CF:ok SO:ok ML:ok | — no open repository | skip: live: only 11 characters of text without JavaScript; archive: only 11 characters of text w | — no public screening API known | 1 | |
| [Curve](#curve) | 390 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | 1977 files | 22 countries (via repository) | — no public screening API known | 5 | |
| [Curve Classic UI](#curve-classic) | 119 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | — no Terms published | — no public screening API known | 2 | |
| [Balancer](#balancer) | error: direct: HTTP 429; proxy US: HTTP 429 | RO:challenge US:challenge CA:challenge MX:challenge AR:challenge CO:challenge GB:challenge DE:challenge FR:challenge NL:challenge ES:challenge IT:challenge PL:challenge CH:challenge SE:challenge UA:challenge TR:challenge AE:challenge SA:challenge IL:challenge PK:challenge BD:challenge VN:challenge TH:challenge PH:challenge MY:challenge SG:challenge HK:challenge CN:challenge KR:challenge TW:challenge AU:challenge NG:challenge ZA:challenge KE:challenge KZ:error GE:challenge US-NY:challenge CA-ON:challenge RU:unknown BY:unknown CU:unknown SY:challenge VE:challenge MM:error AF:challenge IQ:challenge LB:challenge LY:challenge SS:challenge ZW:challenge NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge | 1525 files | error: live: HTTP 429; proxy US: HTTP 429; archive: HTTP 429; app JavaScript: HTTP 429 | — no public screening API known | 2 | |
| [CoW Swap](#cowswap) | 148 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:error AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:error CD:ok CF:ok SO:ok ML:ok | 3961 files | 2 countries (via archive) | — no public screening API known | 4 | |
| [1inch](#1inch) | 711 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:challenge SY:challenge VE:challenge MM:challenge AF:challenge IQ:challenge LB:challenge LY:challenge SS:challenge ZW:challenge NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge | — no open repository | skip: live: PDF: its text cannot be extracted with the Python standard library; open the link | — no public screening API known | 2 | |
| [KyberSwap](#kyberswap) | 234 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:blocked TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:blocked BY:blocked CU:blocked SY:ok VE:blocked MM:blocked AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | 2044 files | skip: live: PDF: its text cannot be extracted with the Python standard library; open the link | 1 check(s) | 7 | |
| [QuickSwap](#quickswap) | 38 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:error NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:error BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:error ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | 863 files | skip: live: only 49 characters of text without JavaScript; archive: only 65 characters of text w | — no public screening API known | 4 | |
| [Aerodrome](#aerodrome) | 173 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:challenge SY:challenge VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 40 countries | — no public screening API known | 1 | |
| [Velodrome](#velodrome) | 173 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:challenge SY:challenge VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 35 countries | — no public screening API known | 0 | |
| [Ambient Finance](#ambient) | 1 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:error IL:error PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:error US-NY:ok CA-ON:ok RU:blocked BY:blocked CU:blocked SY:ok VE:blocked MM:blocked AF:blocked IQ:blocked LB:blocked LY:blocked SS:blocked ZW:blocked NI:blocked CD:blocked CF:blocked SO:blocked ML:blocked | 728 files | 0 countries (via app JavaScript) | — no public screening API known | 4 | |
| [Velora (ex-ParaSwap)](#velora) | 266 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 12 countries | — no public screening API known | 1 | |
| [Matcha (0x)](#matcha) | error: direct: HTTP 429; proxy US: HTTP 429 | RO:challenge US:challenge CA:challenge MX:challenge AR:challenge CO:challenge GB:challenge DE:challenge FR:challenge NL:challenge ES:challenge IT:challenge PL:challenge CH:challenge SE:challenge UA:challenge TR:challenge AE:challenge SA:challenge IL:challenge PK:challenge BD:challenge VN:challenge TH:challenge PH:challenge MY:challenge SG:challenge HK:challenge CN:error KR:challenge TW:challenge AU:challenge NG:challenge ZA:challenge KE:challenge KZ:error GE:challenge US-NY:challenge CA-ON:challenge RU:challenge BY:challenge CU:unknown SY:unknown VE:challenge MM:challenge AF:unknown IQ:unknown LB:unknown LY:challenge SS:challenge ZW:challenge NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge | — no open repository | 1 countries (via archive) | — no public screening API known | 1 | |
| [Jumper (LI.FI)](#jumper) | 318 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:error VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:challenge SY:challenge VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | 1689 files | 21 countries | 1 check(s) | 3 | |
| [GMX](#gmx) | 266 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | 2691 files | 0 countries (via repository) | — no public screening API known | 4 | |
| [Hyperliquid](#hyperliquid) | 448 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 3 countries (via app JavaScript) | 1 check(s) | 5 | |
| [gTrade (Gains)](#gtrade) | 54 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:challenge MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:error AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 2 countries | — no public screening API known | 4 | |
| [Lighter](#lighter) | 248 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:error FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:error AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 14 countries | — no public screening API known | 3 | 1 |
| [Aave V3](#aave) | 57 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:challenge BY:challenge CU:challenge SY:challenge VE:challenge MM:challenge AF:ok IQ:challenge LB:ok LY:challenge SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | 922 files | 21 countries | 1 check(s) | 4 | |
| [Aave V4 (Aave Pro)](#aave-pro) | 52 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:challenge BY:challenge CU:challenge SY:challenge VE:challenge MM:challenge AF:ok IQ:challenge LB:ok LY:challenge SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 21 countries | — no public screening API known | 3 | |
| [Compound III](#compound) | 10 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:challenge BY:challenge CU:challenge SY:challenge VE:ok MM:blocked AF:ok IQ:blocked LB:ok LY:ok SS:blocked ZW:blocked NI:ok CD:blocked CF:ok SO:ok ML:ok | 201 files | 2 countries | — no public screening API known | 4 | 1 |
| [Compound V2](#compound-v2) | 10 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:challenge BY:challenge CU:challenge SY:challenge VE:ok MM:error AF:ok IQ:blocked LB:ok LY:ok SS:blocked ZW:blocked NI:ok CD:blocked CF:ok SO:ok ML:ok | 44 files | 1 countries (via repository) | — no public screening API known | 2 | 2 |
| [Morpho](#morpho) | 64 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:unknown BY:unknown CU:unknown SY:unknown VE:unknown MM:ok AF:ok IQ:ok LB:ok LY:ok SS:unknown ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 3 countries | — no public screening API known | 2 | |
| [Spark](#spark) | 89 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:error FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:unknown TR:ok AE:ok SA:error IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:error NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:unknown BY:unknown CU:unknown SY:unknown VE:unknown MM:unknown AF:unknown IQ:unknown LB:error LY:unknown SS:unknown ZW:unknown NI:unknown CD:unknown CF:unknown SO:unknown ML:unknown | — no open repository | 3 countries | — no public screening API known | 4 | |
| [Sky (ex-Maker)](#sky) | 241 scripts | RO:ok US:error CA:error MX:error AR:error CO:error GB:error DE:error FR:error NL:error ES:error IT:error PL:error CH:error SE:error UA:error TR:error AE:error SA:error IL:error PK:error BD:error VN:error TH:error PH:error MY:error SG:error HK:error CN:error KR:error TW:error AU:error NG:error ZA:error KE:error KZ:error GE:error US-NY:error CA-ON:error RU:error BY:error CU:error SY:error VE:error MM:error AF:error IQ:error LB:error LY:error SS:error ZW:error NI:error CD:error CF:error SO:error ML:error | 926 files | 37 countries | 1 check(s) | 12 | |
| [Venus](#venus) | 260 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:unknown BY:ok CU:unknown SY:unknown VE:ok MM:error AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | 1731 files | 0 countries (via repository) | — no public screening API known | 3 | |
| [Euler](#euler) | 315 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:challenge BY:challenge CU:challenge SY:challenge VE:challenge MM:challenge AF:challenge IQ:challenge LB:challenge LY:challenge SS:challenge ZW:challenge NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge | 647 files | 13 countries | — no public screening API known | 6 | |
| [Fluid](#fluid) | 413 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:error AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 0 countries (via app JavaScript) | — no public screening API known | 0 | |
| [Liquity V2](#liquity) | 25 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:error NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | 558 files | — no Terms published | — no public screening API known | 4 | |
| [Notional Exponent](#notional) | 13 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | 1039 files | 1 countries (via app JavaScript) | — no public screening API known | 4 | |
| [Notional V3](#notional-v3) | 110 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:error CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | 1039 files | 1 countries (via app JavaScript) | — no public screening API known | 4 | |
| [Notional V2](#notional-v2) | 90 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:error CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | — no Terms published | — no public screening API known | 2 | |
| [Lido](#lido) | 17 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:error FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:unknown SY:unknown VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | 1544 files | 9 countries | 1 check(s) | 9 | |
| [Lido V3 (stVaults)](#lido-stvaults) | 14 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:unknown SY:unknown VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | 1558 files | 9 countries | 1 check(s) | 5 | |
| [Rocket Pool](#rocketpool) | 5 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:error FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:challenge TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:challenge TH:ok PH:ok MY:ok SG:ok HK:challenge CN:challenge KR:ok TW:ok AU:error NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:challenge BY:ok CU:ok SY:challenge VE:ok MM:challenge AF:ok IQ:challenge LB:error LY:challenge SS:error ZW:challenge NI:ok CD:challenge CF:challenge SO:challenge ML:ok | — no open repository | — no Terms published | — no public screening API known | 0 | |
| [EigenLayer (EigenCloud)](#eigenlayer) | error: direct: HTTP 500; proxy US: HTTP 500 | RO:error US:error CA:error MX:error AR:error CO:error GB:error DE:error FR:error NL:error ES:error IT:error PL:error CH:error SE:error UA:blocked TR:error AE:error SA:error IL:error PK:error BD:error VN:error TH:error PH:error MY:error SG:error HK:error CN:error KR:error TW:error AU:error NG:error ZA:error KE:error KZ:error GE:error US-NY:error CA-ON:error RU:blocked BY:error CU:blocked SY:blocked VE:error MM:error AF:error IQ:error LB:error LY:error SS:error ZW:error NI:error CD:error CF:error SO:error ML:error | — no open repository | 1 countries (via archive) | — no public screening API known | 4 | |
| [ether.fi](#etherfi) | error: direct: HTTP 429; proxy US: HTTP 429 | RO:challenge US:challenge CA:challenge MX:challenge AR:challenge CO:challenge GB:challenge DE:challenge FR:challenge NL:challenge ES:challenge IT:challenge PL:challenge CH:challenge SE:challenge UA:challenge TR:challenge AE:challenge SA:challenge IL:challenge PK:challenge BD:challenge VN:challenge TH:challenge PH:challenge MY:challenge SG:challenge HK:challenge CN:challenge KR:challenge TW:challenge AU:challenge NG:challenge ZA:challenge KE:challenge KZ:error GE:challenge US-NY:challenge CA-ON:challenge RU:challenge BY:challenge CU:challenge SY:challenge VE:challenge MM:challenge AF:challenge IQ:challenge LB:challenge LY:challenge SS:challenge ZW:challenge NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge | — no open repository | 19 countries (via archive) | — no public screening API known | 1 | |
| [Pendle](#pendle) | 147 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:error BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:error BY:blocked CU:blocked SY:blocked VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:blocked NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 1 countries | — no public screening API known | 2 | |
| [Ethena](#ethena) | 373 scripts | RO:ok US:blocked CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:blocked CA-ON:ok RU:blocked BY:blocked CU:blocked SY:blocked VE:blocked MM:blocked AF:blocked IQ:ok LB:blocked LY:blocked SS:blocked ZW:blocked NI:error CD:ok CF:blocked SO:blocked ML:blocked | — no open repository | 36 countries | — no public screening API known | 6 | 1 |
| [Yearn](#yearn) | 15 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:error AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | 768 files | — no Terms published | — no public screening API known | 4 | |
| [Beefy](#beefy) | 451 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | 1494 files | — no Terms published | — no public screening API known | 3 | 1 |
| [Convex](#convex) | 40 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:error AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | — no Terms published | — no public screening API known | 0 | |
| [Across](#across) | 483 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:challenge SY:challenge VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 2 countries | — no public screening API known | 1 | |
| [Stargate](#stargate) | 41 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:error FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:unknown BY:ok CU:unknown SY:unknown VE:ok MM:unknown AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 3 countries | — no public screening API known | 3 | |
| [Synapse](#synapse) | 73 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:challenge BY:challenge CU:challenge SY:challenge VE:challenge MM:challenge AF:challenge IQ:challenge LB:error LY:challenge SS:challenge ZW:challenge NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge | 3076 files | 1 countries | 1 check(s) | 3 | |
| [Portal Bridge (Wormhole)](#portalbridge) | 425 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:error FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:challenge BY:challenge CU:challenge SY:challenge VE:challenge MM:challenge AF:ok IQ:challenge LB:error LY:challenge SS:error ZW:ok NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge | — no open repository | 2 countries (via app JavaScript) | — no public screening API known | 3 | |
| [Relay](#relay) | error: direct: HTTP 429; proxy US: HTTP 429 | RO:challenge US:challenge CA:challenge MX:challenge AR:challenge CO:challenge GB:challenge DE:challenge FR:challenge NL:challenge ES:challenge IT:challenge PL:challenge CH:challenge SE:challenge UA:challenge TR:challenge AE:challenge SA:challenge IL:challenge PK:challenge BD:challenge VN:challenge TH:challenge PH:challenge MY:challenge SG:challenge HK:challenge CN:challenge KR:challenge TW:challenge AU:challenge NG:challenge ZA:challenge KE:error KZ:challenge GE:challenge US-NY:challenge CA-ON:challenge RU:error BY:challenge CU:unknown SY:challenge VE:challenge MM:challenge AF:challenge IQ:challenge LB:error LY:challenge SS:error ZW:challenge NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge | — no open repository | — no Terms published | 1 check(s) | 2 | |
| [Polymarket](#polymarket) | 101 scripts | RO:blocked US:ok CA:ok MX:ok AR:ok CO:error GB:ok DE:ok FR:ok NL:ok ES:error IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:error SA:error IL:ok PK:ok BD:ok VN:error TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:blocked TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:error CU:blocked SY:blocked VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:error ML:ok | — no open repository | 31 countries (via proxy US) | — no public screening API known | 7 | |
| [Safe{Wallet}](#safe) | 287 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:error ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | 4279 files | 0 countries | — no public screening API known | 5 | |
| [ENS](#ens) | 232 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | 678 files | 0 countries | — no public screening API known | 4 | |
| [ENS Legacy Manager](#ens-legacy) | 232 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | 250 files | 0 countries | — no public screening API known | 4 | |
| [Snapshot](#snapshot) | 1105 scripts | RO:ok US:error CA:error MX:error AR:error CO:error GB:error DE:error FR:error NL:error ES:error IT:error PL:error CH:error SE:error UA:error TR:error AE:error SA:error IL:error PK:error BD:error VN:error TH:error PH:error MY:error SG:error HK:error CN:error KR:error TW:error AU:error NG:error ZA:error KE:error KZ:error GE:error US-NY:error CA-ON:error RU:error BY:error CU:error SY:error VE:error MM:error AF:error IQ:error LB:error LY:error SS:error ZW:error NI:error CD:error CF:error SO:error ML:error | 838 files | 22 countries (via repository) | — no public screening API known | 5 | |
| [Ondo Finance](#ondo) | 64 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:error IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 20 countries | — no public screening API known | 2 | |
| [Maple Finance](#maple) | error: direct: HTTP 403; proxy US: HTTP 403 | RO:challenge US:challenge CA:challenge MX:challenge AR:challenge CO:challenge GB:challenge DE:challenge FR:challenge NL:challenge ES:challenge IT:challenge PL:challenge CH:challenge SE:challenge UA:challenge TR:challenge AE:challenge SA:challenge IL:challenge PK:challenge BD:challenge VN:challenge TH:challenge PH:challenge MY:challenge SG:challenge HK:challenge CN:challenge KR:challenge TW:challenge AU:challenge NG:challenge ZA:challenge KE:challenge KZ:challenge GE:challenge US-NY:challenge CA-ON:challenge RU:challenge BY:challenge CU:challenge SY:challenge VE:challenge MM:challenge AF:challenge IQ:challenge LB:challenge LY:challenge SS:challenge ZW:challenge NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge | — no open repository | 36 countries | — no public screening API known | 1 | |
| [Centrifuge](#centrifuge) | error: direct: HTTP 403; proxy US: HTTP 403 | RO:challenge US:challenge CA:challenge MX:challenge AR:challenge CO:challenge GB:challenge DE:error FR:challenge NL:challenge ES:challenge IT:challenge PL:challenge CH:challenge SE:challenge UA:challenge TR:challenge AE:challenge SA:challenge IL:challenge PK:challenge BD:challenge VN:challenge TH:challenge PH:challenge MY:challenge SG:challenge HK:challenge CN:challenge KR:challenge TW:challenge AU:challenge NG:challenge ZA:challenge KE:challenge KZ:challenge GE:challenge US-NY:challenge CA-ON:challenge RU:challenge BY:challenge CU:challenge SY:challenge VE:challenge MM:challenge AF:challenge IQ:challenge LB:challenge LY:challenge SS:challenge ZW:challenge NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge | 653 files | 0 countries (via archive) | — no public screening API known | 2 | |
| [Superstate](#superstate) | 700 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:blocked BY:blocked CU:blocked SY:blocked VE:blocked MM:blocked AF:blocked IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 1 countries (via app JavaScript) | — no public screening API known | 3 | |
| [Symbiotic](#symbiotic) | 163 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | — no Terms published | — no public screening API known | 1 | |
| [Kelp DAO](#kelp) | 45 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 0 countries | — no public screening API known | 6 | 2 |
| [Lombard](#lombard) | 287 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 20 countries | — no public screening API known | 1 | |
| [Frax Finance](#frax) | 198 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:challenge SY:challenge VE:challenge MM:challenge AF:challenge IQ:challenge LB:ok LY:challenge SS:ok ZW:ok NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge | — no open repository | 0 countries (via app JavaScript) | — no public screening API known | 2 | |
| [Usual](#usual) | 37 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:error IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:error NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:error AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 65 countries | — no public screening API known | 1 | 16 |
| [deBridge](#debridge) | 299 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:error AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 17 countries | — no public screening API known | 1 | |
| [OpenSea](#opensea) | 527 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:error BY:ok CU:challenge SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 1 countries | — no public screening API known | 2 | 2 |
| [Tornado Cash](#tornado) | 3 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:error NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | 235 files | — no Terms published | — no public screening API known | 1 | |
| [Variational (Omni)](#variational) | 172 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:error NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 1 countries | — no public screening API known | 2 | |
| [Extended](#extended) | 440 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 0 countries | — no public screening API known | 4 | 1 |
| [Aster](#aster) | 80 scripts | RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok | — no open repository | 11 countries | — no public screening API known | 4 | |

## Uniswap
<a id="uniswap"></a>

Rating **B**, restrictions **5** (3 countries/regions: CU IR UA); mechanisms: geo_feature, screening.

Sweeps:

- App JS: 1500 scripts (capped); strong signals: geo/block text in 1 file(s), e.g. `Not available in your region` in /assets/index-D1nSI1HA.js; screening/screening call in 6 file(s), e.g. `ScreenAddress` in /assets/api_pb-BtIHP-9g.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:error CU:blocked SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok; CU: app blocked (HTTP 403 with geo wording)
- Code: 7997 files; strong signals: geo/country header in 2 file(s), e.g. `CloudFront-Viewer-Country` in https://github.com/Uniswap/interface/blob/7cb227b6abbb9398dd0dc4bf26eb006b3bb05ada/apps/web/functions/components/metaTagInjector.ts#L172; screening/screening call in 4 file(s), e.g. `Address-Screening` in https://github.com/Uniswap/interface/blob/7cb227b6abbb9398dd0dc4bf26eb006b3bb05ada/apps/web/src/components/PrivacyPolicy.tsx#L85
- Terms: 2 countries (via archive): US US-NY; clauses: sanctions, kyc; compared with the site's Terms column: +US US-NY / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_feature=yes | Swap marks RWA tokens as restricted when the compliance API gates the caller's region (GatedFeature.ISSUER_SPECIFIC_RWA) | [Uniswap/interface@7cb227b:packages/uniswap/src/features/transactions/swap/hooks/useGeoR…](https://github.com/Uniswap/interface/blob/7cb227b6abbb9398dd0dc4bf26eb006b3bb05ada/packages/uniswap/src/features/transactions/swap/hooks/useGeoRestrictionMode.ts#L50) | const isRWARegionBlocked = useIsFeatureGated(GatedFeature.ISSUER_SPECIFIC_RWA) |
| pass | screening=yes | screenAddress() asks the Uniswap compliance API (Entry Gateway) whether a wallet must be blocked | [Uniswap/interface@7cb227b:packages/compliance/src/client.ts#L47](https://github.com/Uniswap/interface/blob/7cb227b6abbb9398dd0dc4bf26eb006b3bb05ada/packages/compliance/src/client.ts#L47) | export async function screenAddress( |
| pass | screening=yes | A blocked EVM or Solana wallet gets the BlockedAccount modal | [Uniswap/interface@7cb227b:apps/web/src/hooks/useAccountRiskCheck.ts#L9](https://github.com/Uniswap/interface/blob/7cb227b6abbb9398dd0dc4bf26eb006b3bb05ada/apps/web/src/hooks/useAccountRiskCheck.ts#L9) | const { isBlocked: isEvmBlocked, isBlockedLoading: isEvmBlockedLoading } = useIsBlockedAddress( |
| pass | geo_feature=yes | Production JS: the RWA region gate (GatedFeature ISSUER_SPECIFIC_RWA) is shipped | [app.uniswap.org](https://app.uniswap.org) | https://cdn.app.uniswap.org/assets/index-D1nSI1HA.js: …t,key:Ey.SpotlitCategoryIds,defaultValue:DC,customTypeGuard:OC}),r=Hp(Vp.ISSUER_SPECIFIC_RWA,{pendingValue:!0}),{categories:s,isLoading:c}=uc(),l |
| fail | screening=yes | Production JS: the screenAddress query module and the BlockedAccount modal are shipped | [app.uniswap.org](https://app.uniswap.org) | https://cdn.app.uniswap.org/assets/modal-wE2secTh.js: …,BiometricsModal:"biometrics-modal",BlastShutdown:"blast-shutdown-modal",BlockedAccount:"blocked-account",BlockedAddress:"blocked-address",Bridge |
| pass | geo_site=reported → 1: UA | Press report (Oct 2025): the Uniswap Labs front-end blocks Ukraine-based IP addresses (asset selection fails) | [blockworks.com/news/uniswap-labs-blocked-ukraine](https://blockworks.com/news/uniswap-labs-blocked-ukraine) | Uniswap Labs’ front-end is still blocking Ukraine-based IP addresses, according to multiple user reports and my own test with a VPN set to the country. |
| recorded | geo_site=yes → 2: IR CU | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | IR: api https://interface.gateway.uniswap.org/v2/uniswap.explore.v1.ExploreStatsService/ExploreStats?connect=v1&encoding=json&message=%7B%22chainId%22%3A%221%22%7D → HTTP 409 blocked (residential, 202 |

## SushiSwap
<a id="sushiswap"></a>

Rating **C**, restrictions **17** (15 countries/regions: BY CA CH CU GB IR KP MM RU SD SS SY UA US VE); mechanisms: geo_feature, screening.

Sweeps:

- App JS: 355 scripts; strong signals: geo/geo endpoint in 1 file(s), e.g. `/api/geolocation` in /_next/static/chunks/0fw274nrdqorz.js; screening/screening vendor in 1 file(s), e.g. `api.trmlabs` in /_next/static/chunks/2lirvnloe0_gc.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:error FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:error CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: 2824 files; strong signals: geo/geo endpoint in 1 file(s), e.g. `/api/geolocation` in https://github.com/sushi-labs/sushiswap/blob/9520c07dabb425a404544cdaf91c8608dc4b197b/apps/web/src/lib/hooks/use-country-code.ts#L20; screening/screening vendor in 2 file(s), e.g. `api.trmlabs` in https://github.com/sushi-labs/sushiswap/blob/9520c07dabb425a404544cdaf91c8608dc4b197b/apps/web/content-security-policy.mjs#L67
- Terms: 26 countries (via archive): DZ BO BY UA-Crimea CU UA-DPR CD IR IQ CI LR LY UA-LPR ML MM NP KP SO SD SY TN VE YE ZW US GB; clauses: vpn, sanctions; compared with the site's Terms column: +GB US / −0
- API: 1 check(s)

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_feature=yes → 15: US CA GB CH CU BY IR KP RU SY UA SS SD MM VE | Robinhood stock tokens: list of countries where they are not offered | [sushi-labs/sushiswap@9520c07:apps/web/src/lib/robinhood/restricted-countries.ts#L3](https://github.com/sushi-labs/sushiswap/blob/9520c07dabb425a404544cdaf91c8608dc4b197b/apps/web/src/lib/robinhood/restricted-countries.ts#L3) | export const ROBINHOOD_STOCK_TOKEN_RESTRICTED_COUNTRIES: ReadonlySet<string> = |
| pass | geo_feature=yes | The swap checker refuses stock tokens when the visitor's country code is in that list | [sushi-labs/sushiswap@9520c07:apps/web/src/lib/wagmi/systems/checker/stock-token-region.…](https://github.com/sushi-labs/sushiswap/blob/9520c07dabb425a404544cdaf91c8608dc4b197b/apps/web/src/lib/wagmi/systems/checker/stock-token-region.tsx#L101) | const { data: countryCode, isPending, isError } = useCountryCode() |
| pass | screening=yes | Connected wallet is screened with the TRM Labs public sanctions API and disconnected if sanctioned | [sushi-labs/sushiswap@9520c07:apps/web/src/lib/wagmi/components/sanctioned-address-dialo…](https://github.com/sushi-labs/sushiswap/blob/9520c07dabb425a404544cdaf91c8608dc4b197b/apps/web/src/lib/wagmi/components/sanctioned-address-dialog.tsx#L28) | 'https://api.trmlabs.com/public/v1/sanctions/screening', |
| pass | geo_feature=yes → 15: US CA GB CH CU BY IR KP RU SY UA SS SD MM VE | Production JS: the stock-token country list and the /api/geolocation lookup | [www.sushi.com](https://www.sushi.com) | https://www.sushi.com/_next/static/chunks/0fw274nrdqorz.js: …x(/^[A-Z]{2}$/).nullable()});async function o(e){let{signal:t}=e,r=await fetch("/api/geolocation",{cache:"no-store",signal:t});if(!r.ok)thr |
| pass | screening=yes | Production JS: the TRM Labs public sanctions screening call | [www.sushi.com](https://www.sushi.com) | https://www.sushi.com/_next/static/chunks/2lirvnloe0_gc.js: …(0,o.useConnection)();x[0]!==_?(e=["trmlabs",_],h=async()=>(await fetch("https://api.trmlabs.com/public/v1/sanctions/screening",{method:"PO |
| pass | screening=yes | The TRM Labs public screening API called by the Sushi frontend answers isSanctioned:true for the sanctioned wallet and false for the control | POST https://api.trmlabs.com/public/v1/sanctions/screening | sdn: status: 201 |

## PancakeSwap
<a id="pancakeswap"></a>

Rating **C**, restrictions **10** (10 countries/regions: BY CD CU IQ IR KP SD SY UA-Crimea ZW).

Sweeps:

- App JS: 23 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:error AE:ok SA:ok IL:error PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:challenge CU:challenge SY:challenge VE:ok MM:challenge AF:ok IQ:challenge LB:error LY:ok SS:ok ZW:challenge NI:ok CD:challenge CF:ok SO:ok ML:ok; BY: app challenge (HTTP 403 anti-bot challenge); CU: app challenge (HTTP 403 anti-bot challenge); SY: app challenge (HTTP 403 anti-bot challenge); MM: app challenge (HTTP 403 anti-bot challenge); IQ: app challenge (HTTP 403 anti-bot challenge); ZW: app challenge (HTTP 403 anti-bot challenge); CD: app challenge (HTTP 403 anti-bot challenge)
- Code: — no open repository
- Terms: skip: live: only 11 characters of text without JavaScript; archive: only 11 characters of text w
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=reported → 10: BY CU CD IR IQ KP SD SY ZW UA-Crimea | Press report (Feb 2022): PancakeSwap blocks IP addresses from ten jurisdictions from March 9, 2022 | [forklog.com/en/pancakeswap-to-block-users-from-ten-jurisdictions/amp](https://forklog.com/en/pancakeswap-to-block-users-from-ten-jurisdictions/amp) | The decentralized platform PancakeSwap warned that, effective March 9, 2022, it will block access to its services from IP addresses in ten jurisdictions. |

## Curve
<a id="curve"></a>

Rating **A**, restrictions **0**.

Sweeps:

- App JS: 390 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: 1977 files; no strong signals
- Terms: 22 countries (via repository): BY BI CF CG KP GN GW IR IQ LB LY ML MM SS RU SO SD SY UA VE YE ZW; clauses: geofencing, sanctions
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=tos_only | The Terms only reserve the right to restrict access by location (no technical block in code) | [curvefi/curve-frontend@f8cfaab:packages/evm-ui/src/widgets/Legal/components/tabs/Terms.…](https://github.com/curvefi/curve-frontend/blob/f8cfaab057efb97dd9b96eac6ce966245cc45b8c/packages/evm-ui/src/widgets/Legal/components/tabs/Terms.tsx#L70) | {t`We reserve the right to technically restrict the access to the Website and the content provided thereon based on your geographical location.`} |
| pass | geo_site=no | No geo-IP lookup or country block anywhere in the frontend monorepo (the Terms text is excluded) | [curvefi/curve-frontend@f8cfaab:/](https://github.com/curvefi/curve-frontend/tree/f8cfaab057efb97dd9b96eac6ce966245cc45b8c) |  |
| pass | screening=no | No wallet-screening call or sanctions list in the frontend monorepo | [curvefi/curve-frontend@f8cfaab:/](https://github.com/curvefi/curve-frontend/tree/f8cfaab057efb97dd9b96eac6ce966245cc45b8c) |  |
| pass | geo_site=no | Production JS of Curve: no geo-IP lookup or country block (the Legal page chunk with the Terms text is not counted) | [www.curve.finance](https://www.curve.finance) |  |
| pass | screening=no | Production JS of Curve: no wallet-screening call or sanctions oracle | [www.curve.finance](https://www.curve.finance) |  |

## Curve Classic UI
<a id="curve-classic"></a>

Rating **A**, restrictions **0**.

Sweeps:

- App JS: 119 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: — no open repository
- Terms: — no Terms published
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=no | The classic UI's JavaScript has no geo-IP lookup or country block | [classic.curve.finance](https://classic.curve.finance) |  |
| pass | screening=no | The classic UI's JavaScript has no wallet-screening call or sanctions list | [classic.curve.finance](https://classic.curve.finance) |  |

## Balancer
<a id="balancer"></a>

Rating **B**, restrictions **1**; mechanisms: screening.

Sweeps:

- App JS: error: direct: HTTP 429; proxy US: HTTP 429
- Live: RO:challenge US:challenge CA:challenge MX:challenge AR:challenge CO:challenge GB:challenge DE:challenge FR:challenge NL:challenge ES:challenge IT:challenge PL:challenge CH:challenge SE:challenge UA:challenge TR:challenge AE:challenge SA:challenge IL:challenge PK:challenge BD:challenge VN:challenge TH:challenge PH:challenge MY:challenge SG:challenge HK:challenge CN:challenge KR:challenge TW:challenge AU:challenge NG:challenge ZA:challenge KE:challenge KZ:error GE:challenge US-NY:challenge CA-ON:challenge RU:unknown BY:unknown CU:unknown SY:challenge VE:challenge MM:error AF:challenge IQ:challenge LB:challenge LY:challenge SS:challenge ZW:challenge NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge; direct: app challenge (HTTP 429 anti-bot challenge); US: app challenge (HTTP 429 anti-bot challenge); CA: app challenge (HTTP 429 anti-bot challenge); MX: app challenge (HTTP 429 anti-bot challenge); AR: app challenge (HTTP 429 anti-bot challenge); CO: app challenge (HTTP 429 anti-bot challenge); GB: app challenge (HTTP 429 anti-bot challenge); DE: app challenge (HTTP 429 anti-bot challenge); FR: app challenge (HTTP 429 anti-bot challenge); NL: app challenge (HTTP 429 anti-bot challenge); ES: app challenge (HTTP 429 anti-bot challenge); IT: app challenge (HTTP 429 anti-bot challenge); PL: app challenge (HTTP 429 anti-bot challenge); CH: app challenge (HTTP 429 anti-bot challenge); SE: app challenge (HTTP 429 anti-bot challenge); UA: app challenge (HTTP 429 anti-bot challenge); TR: app challenge (HTTP 429 anti-bot challenge); AE: app challenge (HTTP 429 anti-bot challenge); SA: app challenge (HTTP 429 anti-bot challenge); IL: app challenge (HTTP 429 anti-bot challenge); PK: app challenge (HTTP 429 anti-bot challenge); BD: app challenge (HTTP 429 anti-bot challenge); VN: app challenge (HTTP 429 anti-bot challenge); TH: app challenge (HTTP 429 anti-bot challenge); PH: app challenge (HTTP 429 anti-bot challenge); MY: app challenge (HTTP 429 anti-bot challenge); SG: app challenge (HTTP 429 anti-bot challenge); HK: app challenge (HTTP 429 anti-bot challenge); CN: app challenge (HTTP 429 anti-bot challenge); KR: app challenge (HTTP 429 anti-bot challenge); TW: app challenge (HTTP 429 anti-bot challenge); AU: app challenge (HTTP 429 anti-bot challenge); NG: app challenge (HTTP 429 anti-bot challenge); ZA: app challenge (HTTP 429 anti-bot challenge); KE: app challenge (HTTP 429 anti-bot challenge); GE: app challenge (HTTP 429 anti-bot challenge); US-NY: app challenge (HTTP 429 anti-bot challenge); CA-ON: app challenge (HTTP 429 anti-bot challenge); SY: app challenge (HTTP 429 anti-bot challenge); VE: app challenge (HTTP 429 anti-bot challenge); AF: app challenge (HTTP 429 anti-bot challenge); IQ: app challenge (HTTP 429 anti-bot challenge); LB: app challenge (HTTP 429 anti-bot challenge); LY: app challenge (HTTP 429 anti-bot challenge); SS: app challenge (HTTP 429 anti-bot challenge); ZW: app challenge (HTTP 429 anti-bot challenge); NI: app challenge (HTTP 429 anti-bot challenge); CD: app challenge (HTTP 429 anti-bot challenge); CF: app challenge (HTTP 429 anti-bot challenge); SO: app challenge (HTTP 429 anti-bot challenge); ML: app challenge (HTTP 429 anti-bot challenge)
- Code: 1525 files; strong signals: screening/screening vendor in 1 file(s), e.g. `hypernative.xyz` in https://github.com/balancer/frontend-monorepo/blob/046d0100891916cda92a0aef5a0f2d059bd309d0/packages/lib/shared/services/hypernative/checkAddressReputation.ts#L22; screening/screening call in 4 file(s), e.g. `wallet-check` in https://github.com/balancer/frontend-monorepo/blob/046d0100891916cda92a0aef5a0f2d059bd309d0/apps/frontend-v3/app/(app)/debug/page.tsx#L27
- Terms: error: live: HTTP 429; proxy US: HTTP 429; archive: HTTP 429; app JavaScript: HTTP 429
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | screening=yes | Wallet reputation is checked with the Hypernative screener (OFAC + up to 3 hops) | [balancer/frontend-monorepo@046d010:packages/lib/shared/services/hypernative/checkAddres…](https://github.com/balancer/frontend-monorepo/blob/046d0100891916cda92a0aef5a0f2d059bd309d0/packages/lib/shared/services/hypernative/checkAddressReputation.ts#L30) | const res = await fetch('https://api.hypernative.xyz/screener/reputation', { |
| pass | screening=yes | UserAccountProvider calls /api/wallet-check and sets isBlocked for an unauthorized address | [balancer/frontend-monorepo@046d010:packages/lib/modules/web3/UserAccountProvider.tsx#L18](https://github.com/balancer/frontend-monorepo/blob/046d0100891916cda92a0aef5a0f2d059bd309d0/packages/lib/modules/web3/UserAccountProvider.tsx#L18) | const res = await fetch(`/api/wallet-check/${address}`, { cache: 'no-store' }) |

## CoW Swap
<a id="cowswap"></a>

Rating **D**, restrictions **52** (50 countries/regions: AF AT BE BG BY CA CN CU CY CZ DE DK DZ EE ER ES FI FR GR HR HU IE IR IS IT KP LI LT LU LV LY MA MM MT NL NO NP PL PT RO RU SD SE SI SK SO SS SY US VE); mechanisms: geo_feature, screening.

Sweeps:

- App JS: 148 scripts; strong signals: geo/geo-IP service in 1 file(s), e.g. `api.country.is` in /static/index-EhqoReUy.js; geo/block text in 6 file(s), e.g. `not available in your region` in /static/de-DE-DxmmRTCB.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:error AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:error CD:ok CF:ok SO:ok ML:ok
- Code: 3961 files; strong signals: geo/geo-IP service in 1 file(s), e.g. `api.country.is` in https://github.com/cowprotocol/cowswap/blob/7f861f9d12a0f9b0db33f9b0b1679ec309025120/apps/cowswap-frontend/src/modules/rwa/state/geoDataAtom.ts#L21; geo/block text in 6 file(s), e.g. `not available in your region` in https://github.com/cowprotocol/cowswap/blob/7f861f9d12a0f9b0db33f9b0b1679ec309025120/apps/cowswap-frontend/src/modules/rwa/hooks/useImportTokenConsentFlow.tsx#L65
- Terms: 2 countries (via archive): US GB; clauses: sanctions; compared with the site's Terms column: +GB US / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_feature=yes → 50: AF DZ BY CA CN CU KP ER IR LY MM MA NP RU SO SS SD SY US VE AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE IS LI NO | Restricted (RWA / tokenized stock) token lists are hidden for visitors from RESTRICTED_COUNTRIES | [cowprotocol/cowswap@7f861f9:libs/core/src/cms/consts.ts#L13](https://github.com/cowprotocol/cowswap/blob/7f861f9d12a0f9b0db33f9b0b1679ec309025120/libs/core/src/cms/consts.ts#L13) | export const RESTRICTED_COUNTRIES = [ |
| pass | geo_feature=yes | The visitor's country for that gate comes from api.country.is | [cowprotocol/cowswap@7f861f9:apps/cowswap-frontend/src/modules/rwa/state/geoDataAtom.ts#L21](https://github.com/cowprotocol/cowswap/blob/7f861f9d12a0f9b0db33f9b0b1679ec309025120/apps/cowswap-frontend/src/modules/rwa/state/geoDataAtom.ts#L21) | const response = await fetch('https://api.country.is') |
| pass | screening=yes | The orderbook backend rejects banned users: hardcoded list + Chainalysis oracle + Hermod (zeroShadow) | [cowprotocol/services@a9c2f4e:crates/order-validation/src/banned/mod.rs#L1](https://github.com/cowprotocol/services/blob/a9c2f4ebddd75c9b2b0b0cab980479468adcbe0f/crates/order-validation/src/banned/mod.rs#L1) | //! Banned user detection: hardcoded list + optional Chainalysis Oracle |
| pass | geo_feature=yes → 50: AF DZ BY CA CN CU KP ER IR LY MM MA NP RU SO SS SD SY US VE AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE IS LI NO | Production JS: the RWA country list, api.country.is lookup and the isRwaGeoblockEnabled flag | [swap.cow.fi](https://swap.cow.fi) | https://swap.cow.fi/static/index-EhqoReUy.js: …);async function xyt(e,t){e({...t,isLoading:!0});try{const r=await(await fetch("https://api.country.is")).json();e({country:r.country//null,isLoading:!1, |

## 1inch
<a id="1inch"></a>

Rating **B**, restrictions **2**; mechanisms: geo_site, screening.

Sweeps:

- App JS: 711 scripts; strong signals: geo/block text in 1 file(s), e.g. `Not available in your region` in /chunk-Dz4sghl0.js; screening/sanctions oracle in 2 file(s), e.g. `isSanctioned(` in /chunk-aPZh1-Tj.js; screening/screening vendor in 1 file(s), e.g. `chainalysis.com` in /chunk-Djtml5pm.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:challenge SY:challenge VE:challenge MM:challenge AF:challenge IQ:challenge LB:challenge LY:challenge SS:challenge ZW:challenge NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge; CU: app challenge (HTTP 403 anti-bot challenge); SY: app challenge (HTTP 403 anti-bot challenge); VE: app challenge (HTTP 403 anti-bot challenge); MM: app challenge (HTTP 403 anti-bot challenge); AF: app challenge (HTTP 403 anti-bot challenge); IQ: app challenge (HTTP 403 anti-bot challenge); LB: app challenge (HTTP 403 anti-bot challenge); LY: app challenge (HTTP 403 anti-bot challenge); SS: app challenge (HTTP 403 anti-bot challenge); ZW: app challenge (HTTP 403 anti-bot challenge); NI: app challenge (HTTP 403 anti-bot challenge); CD: app challenge (HTTP 403 anti-bot challenge); CF: app challenge (HTTP 403 anti-bot challenge); SO: app challenge (HTTP 403 anti-bot challenge); ML: app challenge (HTTP 403 anti-bot challenge)
- Code: — no open repository
- Terms: skip: live: PDF: its text cannot be extracted with the Python standard library; open the link
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=reported | Press report (Sep 2021): 1inch began geofencing US IP addresses (historical; the catalog notes US access was later restored, so it records no country list) | [www.theblock.co/linked/119055/dex-aggregator-1inch-blocks-out-us-trades-in-preparation-…](https://www.theblock.co/linked/119055/dex-aggregator-1inch-blocks-out-us-trades-in-preparation-for-separate-american-platform) | As of September 29, the decentralized exchange aggregator 1inch has begun geofencing U.S. IP addresses. |
| pass | screening=yes | 1inch help center: wallet addresses are screened through TRM Labs | [help.1inch.com/en/articles/6588963-1inch-address-screening](https://help.1inch.com/en/articles/6588963-1inch-address-screening) | 1inch monitors and screens wallet addresses for illicit activities through TRM Labs . |

## KyberSwap
<a id="kyberswap"></a>

Rating **C**, restrictions **9** (7 countries/regions: BY CU IR MM RU VE VN); mechanisms: geo_feature, screening.

Sweeps:

- App JS: 234 scripts; strong signals: geo/block text in 6 file(s), e.g. `not available in your jurisdiction` in /assets/index-633c077b.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:blocked TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:blocked BY:blocked CU:blocked SY:ok VE:blocked MM:blocked AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok; VN: app blocked (HTTP 403 with geo wording); RU: app blocked (HTTP 403 with geo wording); BY: app blocked (HTTP 403 with geo wording); CU: app blocked (HTTP 403 with geo wording); VE: app blocked (HTTP 403 with geo wording); MM: app blocked (HTTP 403 with geo wording)
- Code: 2044 files; strong signals: geo/block text in 2 file(s), e.g. `not available in your jurisdiction` in https://github.com/KyberNetwork/kyberswap-interface/blob/12c16463eb52d1f13f0961daf9445f907adaeb0e/apps/kyberswap-interface/src/hooks/useRestrictedTokens.ts#L18
- Terms: skip: live: PDF: its text cannot be extracted with the Python standard library; open the link
- API: 1 check(s)

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_feature=yes | Per-country token restriction; the country is taken from the browser (described in code as a UX deterrent) | [KyberNetwork/kyberswap-interface@12c1646:apps/kyberswap-interface/src/hooks/useRestrict…](https://github.com/KyberNetwork/kyberswap-interface/blob/12c16463eb52d1f13f0961daf9445f907adaeb0e/apps/kyberswap-interface/src/hooks/useRestrictedTokens.ts#L27) | const countryCode = useMemo(() => getUserCountryCode(), []) |
| pass | screening=yes | Every transaction first asks the Blackjack service; a blacklisted wallet gets BlacklistedWalletError | [KyberNetwork/kyberswap-interface@12c1646:apps/kyberswap-interface/src/utils/sendTransac…](https://github.com/KyberNetwork/kyberswap-interface/blob/12c16463eb52d1f13f0961daf9445f907adaeb0e/apps/kyberswap-interface/src/utils/sendTransaction.ts#L52) | export async function ensureNotBlacklisted(account: string) { |
| pass | screening=yes | Production JS: the Blackjack screening API is configured | [kyberswap.com](https://kyberswap.com) | https://kyberswap.com/assets/index-633c077b.js: …/api",VITE_COMMON_SERVICE_API:"https://common-service.kyberswap.com/api",VITE_BLACKJACK_API:"https://blackjack.kyberswap.com/api",VITE_GTM_ID:"GTM-TRQC |
| pass | geo_feature=yes | Production JS: the per-country restricted-tokens API client | [kyberswap.com](https://kyberswap.com) | https://kyberswap.com/assets/index-633c077b.js: …ation:ACt,useGetDashboardQuery:CCt,useCreateShareMutation:ECt}=d7,p7=Tn({reducerPath:"restrictedTokensApi",baseQuery:Or({baseUrl:k4}),keepUnusedDataFor |
| pass | screening=yes | Blackjack API answers blacklisted:true for the sanctioned wallet and false for the control | [blackjack.kyberswap.com/api/v1/check?wallets={address}](https://blackjack.kyberswap.com/api/v1/check?wallets={address}) | sdn: status: 200 |
| pass | geo_site=yes → 1: VN | Live: kyberswap.com answers a visitor from Vietnam with HTTP 403 'country is currently restricted in accordance with our Terms of Use' | [kyberswap.com](https://kyberswap.com) from VN | status: 403 |
| recorded | geo_site=yes → 6: RU BY IR CU VE MM | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | RU: api https://aggregator-api.kyberswap.com/ethereum/api/v1/routes?tokenIn=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&tokenOut=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&amountIn=1000000000000000000  |

## QuickSwap
<a id="quickswap"></a>

Rating **A**, restrictions **0**.

Sweeps:

- App JS: 38 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:error NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:error BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:error ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: 863 files; no strong signals
- Terms: skip: live: only 49 characters of text without JavaScript; archive: only 65 characters of text w
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=no | No geo-IP lookup or country block in the public frontend code (the repository is stale: production may differ) | [QuickSwap/interface-v2@8799993:/](https://github.com/QuickSwap/interface-v2/tree/8799993562503860a266feb3d8bf376acc80596a) |  |
| pass | screening=no | No wallet-screening call or sanctions list in the public frontend code | [QuickSwap/interface-v2@8799993:/](https://github.com/QuickSwap/interface-v2/tree/8799993562503860a266feb3d8bf376acc80596a) |  |
| pass | geo_site=no | Production JS of QuickSwap: no geo-IP lookup or country block | [dapp.quickswap.exchange](https://dapp.quickswap.exchange) |  |
| pass | screening=no | Production JS of QuickSwap: no wallet-screening call or sanctions oracle | [dapp.quickswap.exchange](https://dapp.quickswap.exchange) |  |

## Aerodrome
<a id="aerodrome"></a>

Rating **B**, restrictions **2** (1 countries/regions: US); mechanisms: geo_feature.

Sweeps:

- App JS: 173 scripts; strong signals: geo/block text in 1 file(s), e.g. `not available in your region` in /assets/index-C8Xw11Zw.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:challenge SY:challenge VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok; CU: app challenge (HTTP 403 anti-bot challenge); SY: app challenge (HTTP 403 anti-bot challenge)
- Code: — no open repository
- Terms: 40 countries: AF BY BA BI CF CN CD CU ET GN GW HT IR IQ KP LB LY ML MD ME MM NI NE RU RS SO SS SD SY TN TR UA VE YE ZW US AU SG GB CA; clauses: geofencing, sanctions, us_persons; compared with the site's Terms column: +AU CA GB SG US / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_feature=reported → 1: US | Tokenized equities on Aerodrome (Base, Aug 2026) are available only to eligible users outside the United States (press) | [cryptobriefing.com/aerodrome-tokenized-equities-base/](https://cryptobriefing.com/aerodrome-tokenized-equities-base/) | US residents are excluded. The tokenized equities are available only to eligible users outside the United States. |

## Velodrome
<a id="velodrome"></a>

Rating **n/a**, restrictions **0**.

Sweeps:

- App JS: 173 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:challenge SY:challenge VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok; CU: app challenge (HTTP 403 anti-bot challenge); SY: app challenge (HTTP 403 anti-bot challenge)
- Code: — no open repository
- Terms: 35 countries: AF BY BA BI CF CN CD CU ET GN GW HT IR IQ KP LB LY ML MD ME MM NI NE RU RS SO SS SD SY TN TR UA VE YE ZW; clauses: sanctions
- API: — no public screening API known

No claim checks: the site establishes nothing for this interface that a check could confirm.

## Ambient Finance
<a id="ambient"></a>

Rating **D**, restrictions **22** (21 countries/regions: AF BY CD CF CU ET IQ IR KP LB LY ML MM NI RU SD SO SS VE YE ZW); mechanisms: screening.

Sweeps:

- App JS: 1 scripts; strong signals: geo/block text in 1 file(s), e.g. `not available in your country` in /assets/index-C4YoGpvK.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:error IL:error PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:error US-NY:ok CA-ON:ok RU:blocked BY:blocked CU:blocked SY:ok VE:blocked MM:blocked AF:blocked IQ:blocked LB:blocked LY:blocked SS:blocked ZW:blocked NI:blocked CD:blocked CF:blocked SO:blocked ML:blocked; RU: app blocked (redirect -> https://ambient.finance/blocked.html); BY: app blocked (redirect -> https://ambient.finance/blocked.html); CU: app blocked (redirect -> https://ambient.finance/blocked.html); VE: app blocked (redirect -> https://ambient.finance/blocked.html); MM: app blocked (redirect -> https://ambient.finance/blocked.html); AF: app blocked (redirect -> https://ambient.finance/blocked.html); IQ: app blocked (redirect -> https://ambient.finance/blocked.html); LB: app blocked (redirect -> https://ambient.finance/blocked.html); LY: app blocked (redirect -> https://ambient.finance/blocked.html); SS: app blocked (redirect -> https://ambient.finance/blocked.html); ZW: app blocked (redirect -> https://ambient.finance/blocked.html); NI: app blocked (redirect -> https://ambient.finance/blocked.html); CD: app blocked (redirect -> https://ambient.finance/blocked.html); CF: app blocked (redirect -> https://ambient.finance/blocked.html); SO: app blocked (redirect -> https://ambient.finance/blocked.html); ML: app blocked (redirect -> https://ambient.finance/blocked.html)
- Code: 728 files; strong signals: geo/geo-IP service in 1 file(s), e.g. `ipapi.co` in https://github.com/CrocSwap/ambient-ts-app/blob/90e569a9bbcab62907c7713ce25c6ab5b0246baf/public/blocked.html#L57; geo/block text in 3 file(s), e.g. `Access Restricted` in https://github.com/CrocSwap/ambient-ts-app/blob/90e569a9bbcab62907c7713ce25c6ab5b0246baf/public/blocked.html#L5
- Terms: 0 countries (via app JavaScript): ; clauses: sanctions
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=yes → 21: AF BY MM CF CU CD ET IR IQ LB LY ML NI KP RU SO SS SD VE YE ZW | Netlify edge rule redirects every page to /blocked.html for visitors from the listed countries | [CrocSwap/ambient-ts-app@90e569a:netlify.toml#L81](https://github.com/CrocSwap/ambient-ts-app/blob/90e569a9bbcab62907c7713ce25c6ab5b0246baf/netlify.toml#L81) | # Block all pages for specified countries |
| pass | screening=yes | Hardcoded OFAC address list in the frontend; a listed wallet is disconnected and sent to ofac.treasury.gov | [CrocSwap/ambient-ts-app@90e569a:src/ambient-utils/constants/blacklist.ts#L1](https://github.com/CrocSwap/ambient-ts-app/blob/90e569a9bbcab62907c7713ce25c6ab5b0246baf/src/ambient-utils/constants/blacklist.ts#L1) | const ofacBlacklist = [ |
| pass | screening=yes | useBlacklist() disconnects a blacklisted account and redirects to ofac.treasury.gov | [CrocSwap/ambient-ts-app@90e569a:src/App/hooks/useBlacklist.ts#L9](https://github.com/CrocSwap/ambient-ts-app/blob/90e569a9bbcab62907c7713ce25c6ab5b0246baf/src/App/hooks/useBlacklist.ts#L9) | if (account && checkBlacklist(account)) { |
| pass | screening=yes | Production JS: the OFAC address list (incl. the Ronin exploiter) and the redirect to ofac.treasury.gov | [ambient.finance](https://ambient.finance) | https://ambient.finance/assets/index-C4YoGpvK.js: …822efe5ad0eae55517cf5dc544251.0x0931ca4d13bb4ba75d9b7132ab690265d749a5e7.0x098b716b8aaf21512996dc57eb0615e2383e2f96.0x0ee5067b06776a89ccc7dc8ee369984 |

## Velora (ex-ParaSwap)
<a id="velora"></a>

Rating **C**, restrictions **9** (9 countries/regions: BY CU IQ IR MM RU SD SY ZW).

Sweeps:

- App JS: 266 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: — no open repository
- Terms: 12 countries: CU IR MM KP CN SY UA-Crimea UA-DPR UA-LPR US CA GB; clauses: sanctions; compared with the site's Terms column: +CA GB US / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| recorded | geo_site=yes → 9: RU BY IR CU SY MM IQ SD ZW | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | RU: api https://api.velora.xyz/prices?srcToken=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&destToken=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&amount=1000000000000000000&srcDecimals=18&destDecimals=6& |

## Matcha (0x)
<a id="matcha"></a>

Rating **B**, restrictions **1** (1 countries/regions: RU).

Sweeps:

- App JS: error: direct: HTTP 429; proxy US: HTTP 429
- Live: RO:challenge US:challenge CA:challenge MX:challenge AR:challenge CO:challenge GB:challenge DE:challenge FR:challenge NL:challenge ES:challenge IT:challenge PL:challenge CH:challenge SE:challenge UA:challenge TR:challenge AE:challenge SA:challenge IL:challenge PK:challenge BD:challenge VN:challenge TH:challenge PH:challenge MY:challenge SG:challenge HK:challenge CN:error KR:challenge TW:challenge AU:challenge NG:challenge ZA:challenge KE:challenge KZ:error GE:challenge US-NY:challenge CA-ON:challenge RU:challenge BY:challenge CU:unknown SY:unknown VE:challenge MM:challenge AF:unknown IQ:unknown LB:unknown LY:challenge SS:challenge ZW:challenge NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge; direct: app challenge (HTTP 429 anti-bot challenge); US: app challenge (HTTP 429 anti-bot challenge); CA: app challenge (HTTP 429 anti-bot challenge); MX: app challenge (HTTP 429 anti-bot challenge); AR: app challenge (HTTP 429 anti-bot challenge); CO: app challenge (HTTP 429 anti-bot challenge); GB: app challenge (HTTP 429 anti-bot challenge); DE: app challenge (HTTP 429 anti-bot challenge); FR: app challenge (HTTP 429 anti-bot challenge); NL: app challenge (HTTP 429 anti-bot challenge); ES: app challenge (HTTP 429 anti-bot challenge); IT: app challenge (HTTP 429 anti-bot challenge); PL: app challenge (HTTP 429 anti-bot challenge); CH: app challenge (HTTP 429 anti-bot challenge); SE: app challenge (HTTP 429 anti-bot challenge); UA: app challenge (HTTP 429 anti-bot challenge); TR: app challenge (HTTP 429 anti-bot challenge); AE: app challenge (HTTP 429 anti-bot challenge); SA: app challenge (HTTP 429 anti-bot challenge); IL: app challenge (HTTP 429 anti-bot challenge); PK: app challenge (HTTP 429 anti-bot challenge); BD: app challenge (HTTP 429 anti-bot challenge); VN: app challenge (HTTP 429 anti-bot challenge); TH: app challenge (HTTP 429 anti-bot challenge); PH: app challenge (HTTP 429 anti-bot challenge); MY: app challenge (HTTP 429 anti-bot challenge); SG: app challenge (HTTP 429 anti-bot challenge); HK: app challenge (HTTP 429 anti-bot challenge); KR: app challenge (HTTP 429 anti-bot challenge); TW: app challenge (HTTP 429 anti-bot challenge); AU: app challenge (HTTP 429 anti-bot challenge); NG: app challenge (HTTP 429 anti-bot challenge); ZA: app challenge (HTTP 429 anti-bot challenge); KE: app challenge (HTTP 429 anti-bot challenge); GE: app challenge (HTTP 429 anti-bot challenge); US-NY: app challenge (HTTP 429 anti-bot challenge); CA-ON: app challenge (HTTP 429 anti-bot challenge); RU: app challenge (HTTP 429 anti-bot challenge); BY: app challenge (HTTP 429 anti-bot challenge); VE: app challenge (HTTP 429 anti-bot challenge); MM: app challenge (HTTP 429 anti-bot challenge); LY: app challenge (HTTP 429 anti-bot challenge); SS: app challenge (HTTP 429 anti-bot challenge); ZW: app challenge (HTTP 429 anti-bot challenge); NI: app challenge (HTTP 429 anti-bot challenge); CD: app challenge (HTTP 429 anti-bot challenge); CF: app challenge (HTTP 429 anti-bot challenge); SO: app challenge (HTTP 429 anti-bot challenge); ML: app challenge (HTTP 429 anti-bot challenge)
- Code: — no open repository
- Terms: 1 countries (via archive): US; clauses: geofencing, vpn, sanctions, us_persons; compared with the site's Terms column: +US / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=reported → 1: RU | Press report (Mar 2022): Matcha blocks trades from Russia ('Region Unsupported') | [www.theblock.co/linked/137962/dex-aggregator-matcha-geoblocks-trades-from-russia](https://www.theblock.co/linked/137962/dex-aggregator-matcha-geoblocks-trades-from-russia) | As of March 15, decentralized crypto exchange aggregator Matcha had begun blocking trades from Russia. |

## Jumper (LI.FI)
<a id="jumper"></a>

Rating **C**, restrictions **15** (13 countries/regions: AF BY CA CU IR LY MM RU SD SS SY UA US); mechanisms: geo_feature, screening.

**Differs from the site:** site says C / 17; countries on the site without a passing check: KP SO.

Sweeps:

- App JS: 318 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:error VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:challenge SY:challenge VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok; CU: app challenge (HTTP 403 anti-bot challenge); SY: app challenge (HTTP 403 anti-bot challenge)
- Code: 1689 files; no strong signals
- Terms: 21 countries: US GB BY CI UA-Crimea CU UA-DPR UA IR IQ UA-Kherson LR LY UA-LPR MM KP RU SD SY VE UA-Zaporizhzhia; clauses: vpn, sanctions; compared with the site's Terms column: +GB UA US / −0
- API: 1 check(s)

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | screening=yes | LI.FI quote API (used by Jumper) refuses a quote for the SDN wallet (HTTP 422) and returns one for the control | [li.quest/v1/quote?fromChain=1&toChain=1&fromToken=0xA0b86991c6218b36c1d19D4a2e9Eb0cE360…](https://li.quest/v1/quote?fromChain=1&toChain=1&fromToken=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&toToken=0xdAC17F958D2ee523a2206206994597C13D831ec7&fromAmount=1000000000&fromAddress={address}) | sdn: status: 422 |
| recorded | geo_site=yes → 3: IR CU SY | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | IR: api https://api.jumper.xyz/v1/geo-gates → HTTP 403 blocked (residential, 2026-10-28); CU: api https://api.jumper.xyz/v1/geo-gates → HTTP 403 blocked (residential, 2026-10-28); SY: api https://api. |
| recorded | geo_feature=yes → 10: US CA UA RU BY MM AF LY SS SD | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | US: api https://api.jumper.xyz/v1/geo-gates → HTTP 200 feature_limited (residential, 2026-10-28); CA: api https://api.jumper.xyz/v1/geo-gates → HTTP 200 feature_limited (residential, 2026-10-28); UA:  |

## GMX
<a id="gmx"></a>

Rating **A**, restrictions **0**.

Sweeps:

- App JS: 266 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: 2691 files; no strong signals
- Terms: 0 countries (via repository): ; clauses: vpn, sanctions, us_persons
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=no | No geo-IP lookup or country block in the frontend | [gmx-io/gmx-interface@d170885:/](https://github.com/gmx-io/gmx-interface/tree/d1708855da1aa085a1d4f17d4fa3ceb3cff1260c) |  |
| pass | screening=no | No wallet-screening call or sanctions list in the frontend | [gmx-io/gmx-interface@d170885:/](https://github.com/gmx-io/gmx-interface/tree/d1708855da1aa085a1d4f17d4fa3ceb3cff1260c) |  |
| pass | geo_site=no | Production JS of GMX: no geo-IP lookup or country block (the fiat on-ramp screen, whose payment provider says a payment method is not available in your region, is not counted) | [app.gmx.io](https://app.gmx.io) |  |
| pass | screening=no | Production JS of GMX: no wallet-screening call or sanctions oracle | [app.gmx.io](https://app.gmx.io) |  |

## Hyperliquid
<a id="hyperliquid"></a>

Rating **D**, restrictions **28** (26 countries/regions: AR AU BR CA CA-ON CH CU DE ES FR GB IN IR IT JP MM NL PL RU SG SY TH TR TW US YE); mechanisms: geo_feature, screening.

Sweeps:

- App JS: 448 scripts; strong signals: geo/block text in 2 file(s), e.g. `Not available in your jurisdiction` in /assets/config-By_my7gp.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: — no open repository
- Terms: 3 countries (via app JavaScript): PA GB US; clauses: geofencing, screening, sanctions, kyc; compared with the site's Terms column: +GB PA / −CA-ON
- API: 1 check(s)

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=yes | Production JS: the app calls the info API legalCheck and, for the BlockActions restriction 'a', disables trading with 'Not available in your jurisdiction' | [app.hyperliquid.xyz](https://app.hyperliquid.xyz) | https://app.hyperliquid.xyz/assets/config-By_my7gp.js: …ading`)return`Loading...`;if(e===`ipBlocked`//e===`userIpBlocked`)return`Not available in your jurisdiction`;if(e===`needToAcceptTerms`)return`N |
| pass | geo_site=tos_only → 2: US CA-ON | Production JS: Terms 1.6 bundled in the app name the United States and Ontario (documentation only until a per-country check confirms where the legalCheck block applies) | [app.hyperliquid.xyz](https://app.hyperliquid.xyz) | https://app.hyperliquid.xyz/assets/TermsOfUse-wBaffXrT.js: …ne`,marginBottom:`10px`},children:(0,o.jsx)(a,{fontSize:`13px`,children:`1.6 The Interface is not available to “Restricted Persons.” For the |
| pass | screening=yes | Hyperliquid's info API legalCheck, which the app calls for the connected wallet, answers userAllowed:false for the sanctioned wallet and true for the control (the app then shows the 'flagged by Chainalysis' banner and disables actions) | POST https://api.hyperliquid.xyz/info | sdn: status: 200 |
| recorded | geo_site=yes → 7: US CA-ON IR SY CU MM YE | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | US: api https://api.hyperliquid.xyz/info → HTTP 200 blocked (residential, 2026-10-28); CA-ON: api https://api.hyperliquid.xyz/info → HTTP 200 blocked (residential, 2026-10-28); IR: api https://api.hyp |
| recorded | geo_feature=yes → 19: AR BR CA GB DE FR NL ES IT PL CH TR IN TH SG JP TW AU RU | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | AR: api https://api.hyperliquid.xyz/info → HTTP 200 feature_limited (residential, 2026-10-28); BR: api https://api.hyperliquid.xyz/info → HTTP 200 feature_limited (residential, 2026-10-28); CA: api ht |

## gTrade (Gains)
<a id="gtrade"></a>

Rating **B**, restrictions **4** (3 countries/regions: CU SY US); mechanisms: geo_feature.

Sweeps:

- App JS: 54 scripts; strong signals: geo/geo-IP service in 1 file(s), e.g. `ipapi.co` in /_next/static/chunks/pages/_app-30c08122310271fe.js; geo/geo endpoint in 1 file(s), e.g. `/api/geo` in /_next/static/chunks/pages/_app-30c08122310271fe.js; geo/block text in 1 file(s), e.g. `Access restricted` in /_next/static/chunks/pages/_app-30c08122310271fe.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:challenge MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:error AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok; PH: app challenge (HTTP 403 anti-bot challenge)
- Code: — no open repository
- Terms: 2 countries: US PA; clauses: vpn, sanctions, us_persons; compared with the site's Terms column: +PA / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_feature=yes | Production JS: the useGeoblock hook reads per-group flags from gTrade's geoblock API and blocks the pairs of a flagged group | [gains.trade](https://gains.trade) | https://gains.trade/_next/static/chunks/pages/_app-30c08122310271fe.js: …720),V=a(514275),W=a(782961),H=a(474976);let G=function(){return(0,W.Ay)("geoblock-features",async()=>{try{let e="https://wrkr. |
| pass | geo_site=tos_only | The Terms prohibit use from the US regardless of IP address and threaten blocking of VPN users (no technical block verified) | [gains.trade/terms-of-service](https://gains.trade/terms-of-service) | …Y LOCATED OR RESIDENT IN THE UNITED STATES OR A UNITED STATES TERRITORY, IS STRICTLY PROHIBITED, REGARDLESS OF THE USER’S IP ADDRESS. UTILIZING A VIRTUAL PRIVATE NETWORK OR OTHER METHOD TO CONCEAL A  |
| pass | geo_feature=yes → 1: US | Live: gTrade's geoblock API flags stocks and indices for a visitor from the US | [wrkr.randomdegenerator.xyz/main/api/geo](https://wrkr.randomdegenerator.xyz/main/api/geo) from US | body: {"features":{"stocks":true,"indices":true,"forex":false,"crypto":false,"commodities":false},"country":"US"} |
| recorded | geo_feature=yes → 2: SY CU | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | SY: api https://wrkr.randomdegenerator.xyz/main/api/geo → HTTP 200 feature_limited (residential, 2026-10-28); CU: api https://wrkr.randomdegenerator.xyz/main/api/geo → HTTP 200 feature_limited (reside |

## Lighter
<a id="lighter"></a>

Rating **C**, restrictions **12** (12 countries/regions: BY CA CN CU GB MM RU SD SY UA US VE).

**To review** (found by the sweeps, not explained by the published data):

- production JavaScript: screening signals [screening call (addressScreening)], but the site says screening=tos_only

Sweeps:

- App JS: 248 scripts; strong signals: geo/geo-IP service in 1 file(s), e.g. `ipapi.co` in /assets/vendor-ui-web3-DNF9eLTJ.js; geo/geo endpoint in 1 file(s), e.g. `/api/geo` in /assets/vendor-ui-web3-DNF9eLTJ.js; geo/block text in 1 file(s), e.g. `Access restricted` in /assets/vendor-ui-web3-DNF9eLTJ.js; screening/screening call in 1 file(s), e.g. `addressScreening` in /assets/vendor-ui-web3-DNF9eLTJ.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:error FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:error AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: — no open repository
- Terms: 14 countries: US CA GB CN KP RU UA CU IR VE SD BY MM SY; clauses: geofencing, sanctions
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=yes | Production JS: the API error geo_restriction_not_allowed ('You are accessing Lighter from a restricted jurisdiction') and the geo-blocked banner | [app.lighter.xyz](https://app.lighter.xyz) | https://app.lighter.xyz/assets/i18next-COfrmogW.js: …ds_staked_lit_value":"Force burn shares amount exceeds staked LIT value","geo_restriction_not_allowed":"You are accessing Lighter from a restricted |
| pass | geo_site=tos_only → 14: US CA GB CN KP RU UA CU IR VE SD BY MM SY | Jurisdictions named in the Lighter Terms, which also log the IP to enforce access restrictions (documentation only until a per-country check confirms where the API block applies) | [lighter.xyz/terms](https://lighter.xyz/terms) | …ich we are not responsible. OUR SERVICES WERE NOT DEVELOPED FOR, AND ARE NOT AVAILABLE TO PERSONS OR ENTITIES WHO RESIDE IN, ARE LOCATED IN, ARE INCORPORATED IN, OR HAVE A REGISTERED OFFICE OR PRINCI |
| recorded | geo_site=yes → 12: US CA GB UA CN RU BY SY VE CU MM SD | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | US: api https://mainnet.zklighter.elliot.ai/api/v1/geoLocation → HTTP 400 blocked (residential, 2026-10-28); CA: api https://mainnet.zklighter.elliot.ai/api/v1/geoLocation → HTTP 400 blocked (resident |

## Aave V3
<a id="aave"></a>

Rating **B**, restrictions **1**; mechanisms: screening.

Sweeps:

- App JS: 57 scripts; strong signals: screening/screening call in 1 file(s), e.g. `preflight-compliance` in /_next/static/chunks/pages/_app-987ceba000e49ece.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:challenge BY:challenge CU:challenge SY:challenge VE:challenge MM:challenge AF:ok IQ:challenge LB:ok LY:challenge SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok; RU: app challenge (HTTP 403 anti-bot challenge); BY: app challenge (HTTP 403 anti-bot challenge); CU: app challenge (HTTP 403 anti-bot challenge); SY: app challenge (HTTP 403 anti-bot challenge); VE: app challenge (HTTP 403 anti-bot challenge); MM: app challenge (HTTP 403 anti-bot challenge); IQ: app challenge (HTTP 403 anti-bot challenge); LY: app challenge (HTTP 403 anti-bot challenge)
- Code: 922 files; strong signals: screening/screening call in 1 file(s), e.g. `preflight-compliance` in https://github.com/aave/interface/blob/32cc548b980baadea36cfea5227fc144d3f49958/src/hooks/compliance/service-compliance.ts#L16
- Terms: 21 countries: US GB BY CI UA-Crimea CU UA-DPR UA IR IQ UA-Kherson LR LY UA-LPR MM KP RU SD SY VE UA-Zaporizhzhia; clauses: vpn, sanctions; compared with the site's Terms column: +GB UA US / −0
- API: 1 check(s)

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | screening=yes | /api/preflight-compliance forwards the wallet to a private compliance API (COMPLIANCE_API_URL/check/{address}) | [aave/interface@32cc548:pages/api/preflight-compliance.ts#L58](https://github.com/aave/interface/blob/32cc548b980baadea36cfea5227fc144d3f49958/pages/api/preflight-compliance.ts#L58) | `${COMPLIANCE_API_URL}/check/${encodeURIComponent(address)}?surface=v3`, |
| pass | screening=yes | A non-compliant wallet (or a compliance error) gets a full-screen blocked overlay | [aave/interface@32cc548:src/components/AddressBlocked.tsx#L20](https://github.com/aave/interface/blob/32cc548b980baadea36cfea5227fc144d3f49958/src/components/AddressBlocked.tsx#L20) | const showBlockedOverlay = status === 'non-compliant'; |
| pass | screening=yes | Production JS: the wallet is sent to /api/preflight-compliance and a 'non-compliant' state is handled | [app.aave.com](https://app.aave.com) | https://app.aave.com/_next/static/chunks/pages/_app-987ceba000e49ece.js: …function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch("/api/preflight-compliance/?address=".concat(en |
| pass | screening=yes | Aave's /api/preflight-compliance answers result:false for the sanctioned wallet and true for the control | [app.aave.com/api/preflight-compliance/?address={address}](https://app.aave.com/api/preflight-compliance/?address={address}) | sdn: status: 200 |

## Aave V4 (Aave Pro)
<a id="aave-pro"></a>

Rating **B**, restrictions **2** (1 countries/regions: US); mechanisms: geo_feature.

**Differs from the site:** site says B / 3; mechanisms on the site without a passing check: screening.

Sweeps:

- App JS: 52 scripts; strong signals: geo/block text in 1 file(s), e.g. `Not Available in Your Region` in /_next/static/immutable/chunks/44t5aq_1nzrzj.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:challenge BY:challenge CU:challenge SY:challenge VE:challenge MM:challenge AF:ok IQ:challenge LB:ok LY:challenge SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok; RU: app challenge (HTTP 403 anti-bot challenge); BY: app challenge (HTTP 403 anti-bot challenge); CU: app challenge (HTTP 403 anti-bot challenge); SY: app challenge (HTTP 403 anti-bot challenge); VE: app challenge (HTTP 403 anti-bot challenge); MM: app challenge (HTTP 403 anti-bot challenge); IQ: app challenge (HTTP 403 anti-bot challenge); LY: app challenge (HTTP 403 anti-bot challenge)
- Code: — no open repository
- Terms: 21 countries: US GB BY CI UA-Crimea CU UA-DPR UA IR IQ UA-Kherson LR LY UA-LPR MM KP RU SD SY VE UA-Zaporizhzhia; clauses: vpn, sanctions; compared with the site's Terms column: +GB UA US / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| fail | geo_feature=yes | Per-asset geo check: POST /api/geo -> areAssetsGeoblocked; a flagged asset cannot be supplied or borrowed from the region | [pro.aave.com](https://pro.aave.com) | https://pro.aave.com/_next/static/immutable/chunks/1fkl3if9kdzwa.js: …:{"kind":"NON_NULL","ofType":{"kind":"SCALAR","name":"Any"}}}]},{"name":"areAssetsGeoblocked","type":{"kind":"NON_NULL","ofType":{ |
| fail | screening=yes | ComplianceProvider checks the connected wallet and shows ComplianceBlockedScreen (provider not disclosed) | [pro.aave.com](https://pro.aave.com) | https://pro.aave.com/_next/static/immutable/chunks/1p2zc7zrrks_w.js: …:()=>{},hideDemo:()=>{}}),s=t=>!t//new Date(t).getTime()<Date.now();t.s(["ComplianceProvider",0,({children:t})=>{let{address:u,isC |
| pass | geo_feature=reported → 1: US | Coinbase tokenized stocks on Aave (Equities Hub) are offered only outside the US (Aave's announcement quoted by the press) | [cryptobriefing.com/coinbase-tokenized-stocks-go-live-on-aave-v4-on-base/](https://cryptobriefing.com/coinbase-tokenized-stocks-go-live-on-aave-v4-on-base/) | Tokenized stocks are only available in eligible jurisdictions outside of the U.S. pic.twitter.com/VOL363Ihd9 |

## Compound III
<a id="compound"></a>

Rating **C**, restrictions **6** (5 countries/regions: CD MM SD SS ZW); mechanisms: screening.

**To review** (found by the sweeps, not explained by the published data):

- live: the app is blocked from IQ (HTTP 403 with geo wording), but the site does not count IQ

Sweeps:

- App JS: 10 scripts; strong signals: screening/screening call in 1 file(s), e.g. `Address screening` in /assets/main-Bkduosrm.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:challenge BY:challenge CU:challenge SY:challenge VE:ok MM:blocked AF:ok IQ:blocked LB:ok LY:ok SS:blocked ZW:blocked NI:ok CD:blocked CF:ok SO:ok ML:ok; RU: app challenge (HTTP 403 anti-bot challenge); BY: app challenge (HTTP 403 anti-bot challenge); CU: app challenge (HTTP 403 anti-bot challenge); SY: app challenge (HTTP 403 anti-bot challenge); MM: app blocked (HTTP 403 with geo wording); IQ: app blocked (HTTP 403 with geo wording); SS: app blocked (HTTP 403 with geo wording); ZW: app blocked (HTTP 403 with geo wording); CD: app blocked (HTTP 403 with geo wording)
- Code: 201 files; strong signals: screening/sanctions oracle in 2 file(s), e.g. `isSanctioned(` in https://github.com/compound-finance/webb3-frontend/blob/5e556e553f223d37842fd91c2eed2f21efb98a6d/src/contexts/Web3Context.tsx#L278
- Terms: 2 countries: US GB; clauses: geofencing, vpn, screening, sanctions; compared with the site's Terms column: +GB US / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | screening=yes | Hardcoded list of sanctioned addresses, incl. the Tornado Cash router 0x8589…DA16 | [compound-finance/webb3-frontend@5e556e5:src/helpers/sanctions.ts#L1](https://github.com/compound-finance/webb3-frontend/blob/5e556e553f223d37842fd91c2eed2f21efb98a6d/src/helpers/sanctions.ts#L1) | export function isSanctioned(address: string): boolean { |
| pass | screening=yes | Web3Context refuses a sanctioned account | [compound-finance/webb3-frontend@5e556e5:src/contexts/Web3Context.tsx#L278](https://github.com/compound-finance/webb3-frontend/blob/5e556e553f223d37842fd91c2eed2f21efb98a6d/src/contexts/Web3Context.tsx#L278) | if (writeWeb3.account !== undefined && isSanctioned(writeWeb3.account)) { |
| pass | screening=yes | Production JS: the hardcoded sanctioned-address list incl. the Tornado Cash router | [app.compound.xyz](https://app.compound.xyz) | https://app.compound.xyz/assets/main-Bkduosrm.js: …[0])?e(Gie[r[0]]):[]:typeof r=="string"?e([r]):[]}function Qze(t){return["0x8589427373D6D84E98730D7795D8f6f8731FDA16","0x722122dF12D4e14e13Ac3b6895a8 |
| recorded | geo_site=yes → 5: MM SS SD ZW CD | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | MM: site https://app.compound.xyz → HTTP 403 blocked (residential, 2026-10-28); SS: site https://app.compound.xyz → HTTP 403 blocked (residential, 2026-10-28); SD: site https://app.compound.xyz → HTTP |

## Compound V2
<a id="compound-v2"></a>

Rating **B**, restrictions **5** (4 countries/regions: MM SD SS ZW); mechanisms: screening.

**To review** (found by the sweeps, not explained by the published data):

- live: the app is blocked from IQ (HTTP 403 with geo wording), but the site does not count IQ
- live: the app is blocked from CD (HTTP 403 with geo wording), but the site does not count CD

Sweeps:

- App JS: 10 scripts; strong signals: screening/screening call in 1 file(s), e.g. `address screening` in /static/js/dapp.49abee4e.chunk.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:challenge BY:challenge CU:challenge SY:challenge VE:ok MM:error AF:ok IQ:blocked LB:ok LY:ok SS:blocked ZW:blocked NI:ok CD:blocked CF:ok SO:ok ML:ok; RU: app challenge (HTTP 403 anti-bot challenge); BY: app challenge (HTTP 403 anti-bot challenge); CU: app challenge (HTTP 403 anti-bot challenge); SY: app challenge (HTTP 403 anti-bot challenge); IQ: app blocked (HTTP 403 with geo wording); SS: app blocked (HTTP 403 with geo wording); ZW: app blocked (HTTP 403 with geo wording); CD: app blocked (HTTP 403 with geo wording)
- Code: 44 files; no strong signals
- Terms: 1 countries (via repository): US; clauses: sanctions; compared with the site's Terms column: +US / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | screening=yes | The V2 app is configured with SCREENING_ENDPOINT=https://screening.compound.xyz and shows a screening-error overlay | [v2-app.compound.xyz](https://v2-app.compound.xyz) | https://v2-app.compound.xyz/static/js/vendors~dapp.1e26303b.chunk.js: …xyz/ethereum-mainnet"},NETWORK_MAP:{mainnet:1},DEFAULT_NETWORK:"mainnet",SCREENING_ENDPOINT:"https://screening.compound.xyz",WALL |
| recorded | geo_site=yes → 4: MM SS SD ZW | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | MM: site https://v2-app.compound.xyz → HTTP 403 blocked (residential, 2026-10-28); SS: site https://v2-app.compound.xyz → HTTP 403 blocked (residential, 2026-10-28); SD: site https://v2-app.compound.x |

## Morpho
<a id="morpho"></a>

Rating **B**, restrictions **2**; mechanisms: geo_feature, screening.

Sweeps:

- App JS: 64 scripts; strong signals: geo/country header in 1 file(s), e.g. `x-vercel-ip-country` in /_next/static/immutable/chunks/3xe28p1do74bo.js; screening/screening call in 5 file(s), e.g. `SCREEN_ADDRESS` in /_next/static/immutable/chunks/0hfwhxuw38h9y.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:unknown BY:unknown CU:unknown SY:unknown VE:unknown MM:ok AF:ok IQ:ok LB:ok LY:ok SS:unknown ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: — no open repository
- Terms: 3 countries: US GB FR; clauses: geofencing, vpn, screening, sanctions; compared with the site's Terms column: +FR GB US / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_feature=yes | Morpho docs: the Morpho Association blocks access to certain markets and vaults in its interface (legal and regulatory requirements) | [docs.morpho.org/interface/warnings/](https://docs.morpho.org/interface/warnings/) | As such, there may be certain circumstances under which Morpho Association blocks access to certain markets and vaults through our the interface provided. |
| pass | screening=yes | Morpho docs: addresses subject to U.S. government sanctions are blocked | [docs.morpho.org/interface/warnings/](https://docs.morpho.org/interface/warnings/) | Morpho Association will block individual or smart contract addresses that are subject to U.S. government sanctions or associated with certain types of illegal activity. |

## Spark
<a id="spark"></a>

Rating **D**, restrictions **21** (19 countries/regions: AF BY CD CF CU IR LB LY ML MM NI RU SS SY UA US VE YE ZW); mechanisms: screening, vpn.

Sweeps:

- App JS: 89 scripts; strong signals: geo/geo endpoint in 1 file(s), e.g. `/ip/status` in /assets/index-BP2MoS4A.js; geo/block text in 1 file(s), e.g. `not available in your region` in /assets/index-BP2MoS4A.js; screening/screening call in 1 file(s), e.g. `/address/status` in /assets/index-BP2MoS4A.js; vpn/VPN detection in 1 file(s), e.g. `isConnectedToVpn` in /assets/index-BP2MoS4A.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:error FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:unknown TR:ok AE:ok SA:error IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:error NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:unknown BY:unknown CU:unknown SY:unknown VE:unknown MM:unknown AF:unknown IQ:unknown LB:error LY:unknown SS:unknown ZW:unknown NI:unknown CD:unknown CF:unknown SO:unknown ML:unknown
- Code: — no open repository
- Terms: 3 countries: GB KY US; clauses: sanctions; compared with the site's Terms column: +GB KY US / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=reported → 1: US | Press report (Aug 2023): Spark restricts United States users | [cointelegraph.com/news/makerdao-spark-protocol-block-vpn-users-controversy](https://cointelegraph.com/news/makerdao-spark-protocol-block-vpn-users-controversy) | …e: Spark Protocol The measure appears to be linked to Maker’s attempt to restrict United States users from accessing the crypto lending platform, discussed in a May 9 update to Spark Protocol’s terms |
| pass | screening=reported | Press report (Aug 2023): Spark is said to use TRM Labs to block wallets | [cointelegraph.com/news/makerdao-spark-protocol-block-vpn-users-controversy](https://cointelegraph.com/news/makerdao-spark-protocol-block-vpn-users-controversy) | Spark Protocol is said to use TRM’s blockchain intelligence services to block wallets from Spark Protocol that engage in legally prohibited conduct. |
| pass | vpn=block | Press report (Aug 2023): VPN visitors see 'Accessing this website via VPN is not allowed' | [cointelegraph.com/news/makerdao-spark-protocol-block-vpn-users-controversy](https://cointelegraph.com/news/makerdao-spark-protocol-block-vpn-users-controversy) | At the time of writing, VPN users that attempt to access the Spark Protocol website will be met with an error: “Accessing this website via VPN is not allowed.” |
| recorded | geo_site=yes → 18: UA RU BY SY VE CU IR MM AF LY LB SS YE ZW NI CD CF ML | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | UA: site https://app.spark.fi → HTTP 403 blocked (residential, 2026-10-28); RU: site https://app.spark.fi → HTTP 403 blocked (residential, 2026-10-28); BY: site https://app.spark.fi → HTTP 403 blocked |

## Sky (ex-Maker)
<a id="sky"></a>

Rating **D**, restrictions **38** (35 countries/regions: AF BI BY CD CF CN CU ET GB GN GW HK HT IQ IR KP LB LY ML MM NE NI RU SD SO SS SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia VE YE ZW); mechanisms: geo_feature, screening, vpn.

Sweeps:

- App JS: 241 scripts; strong signals: geo/geo endpoint in 2 file(s), e.g. `/ip/status` in /assets/useModalFeeCell-NOhitoyU.js; geo/block text in 5 file(s), e.g. `Access restricted` in /assets/en-C9bj3yQr.js; screening/screening call in 2 file(s), e.g. `/address/status` in /assets/index-B2w_FuB6.js; vpn/VPN detection in 2 file(s), e.g. `isConnectedToVpn` in /assets/index-B2w_FuB6.js
- Live: RO:ok US:error CA:error MX:error AR:error CO:error GB:error DE:error FR:error NL:error ES:error IT:error PL:error CH:error SE:error UA:error TR:error AE:error SA:error IL:error PK:error BD:error VN:error TH:error PH:error MY:error SG:error HK:error CN:error KR:error TW:error AU:error NG:error ZA:error KE:error KZ:error GE:error US-NY:error CA-ON:error RU:error BY:error CU:error SY:error VE:error MM:error AF:error IQ:error LB:error LY:error SS:error ZW:error NI:error CD:error CF:error SO:error ML:error
- Code: 926 files; strong signals: geo/geo endpoint in 28 file(s), e.g. `/ip/status` in https://github.com/jetstreamgg/tarmac/blob/db72c8c98bccbff26e0ecc3ab83db7f6b10209cb/apps/webapp/playwright-parallel.config.ts#L97; geo/block text in 1 file(s), e.g. `Access restricted` in https://github.com/jetstreamgg/tarmac/blob/db72c8c98bccbff26e0ecc3ab83db7f6b10209cb/apps/webapp/src/modules/ui/components/TermsModal.tsx#L217; screening/screening call in 13 file(s), e.g. `address-screening` in https://github.com/jetstreamgg/tarmac/blob/db72c8c98bccbff26e0ecc3ab83db7f6b10209cb/apps/webapp/playwright-parallel.config.ts#L73; vpn/VPN detection in 8 file(s), e.g. `isConnectedToVpn` in https://github.com/jetstreamgg/tarmac/blob/db72c8c98bccbff26e0ecc3ab83db7f6b10209cb/apps/webapp/src/hooks/authentication/useVpnCheck.ts#L5
- Terms: 37 countries: US GB KY AF BY MM BI CF CN UA-Crimea CU CD UA-DPR ET GN GW HT HK IR IQ UA-Kherson LB LY UA-LPR ML NI NE KP RU SO SS SD SY VE YE UA-Zaporizhzhia ZW; clauses: geofencing, vpn, screening, sanctions; compared with the site's Terms column: +KY US / −0
- API: 1 check(s)

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=yes | The app asks the Sky compliance API /ip/status and blocks the whole app for a restricted region | [jetstreamgg/tarmac@db72c8c:apps/webapp/src/modules/ui/context/ConnectedContext.tsx#L454](https://github.com/jetstreamgg/tarmac/blob/db72c8c98bccbff26e0ecc3ab83db7f6b10209cb/apps/webapp/src/modules/ui/context/ConnectedContext.tsx#L454) | if (vpnData?.isRestrictedRegion) return 'region-restricted'; |
| pass | geo_site=yes | useVpnCheck() fetches {authUrl}/ip/status | [jetstreamgg/tarmac@db72c8c:apps/webapp/src/hooks/authentication/useVpnCheck.ts#L15](https://github.com/jetstreamgg/tarmac/blob/db72c8c98bccbff26e0ecc3ab83db7f6b10209cb/apps/webapp/src/hooks/authentication/useVpnCheck.ts#L15) | const vpnRes = await fetch(`${authUrl}/ip/status`); |
| pass | geo_feature=yes | Route guard: modules disabled for the visitor's country by /geo-config redirect away (restrictive fallback on error) | [jetstreamgg/tarmac@db72c8c:apps/webapp/src/modules/geo-config/routeGuard.ts#L29](https://github.com/jetstreamgg/tarmac/blob/db72c8c98bccbff26e0ecc3ab83db7f6b10209cb/apps/webapp/src/modules/geo-config/routeGuard.ts#L29) | export async function requireModuleEnabled( |
| pass | screening=yes | Wallet screening through {authUrl}/address/status before the terms and before a transaction | [jetstreamgg/tarmac@db72c8c:apps/webapp/src/hooks/authentication/useRestrictedAddressChe…](https://github.com/jetstreamgg/tarmac/blob/db72c8c98bccbff26e0ecc3ab83db7f6b10209cb/apps/webapp/src/hooks/authentication/useRestrictedAddressCheck.ts#L42) | const wholeUrl = `${authUrl}/address/status?address=${address}`; |
| pass | screening=yes | A wallet that is not allowed gets the 'wallet-blocked' state | [jetstreamgg/tarmac@db72c8c:apps/webapp/src/modules/ui/context/ConnectedContext.tsx#L462](https://github.com/jetstreamgg/tarmac/blob/db72c8c98bccbff26e0ecc3ab83db7f6b10209cb/apps/webapp/src/modules/ui/context/ConnectedContext.tsx#L462) | if (authData?.addressAllowed === false) return 'wallet-blocked'; |
| pass | vpn=detect | VPN (and US) users are detected and must sign the Terms before every transaction | [jetstreamgg/tarmac@db72c8c:apps/webapp/src/modules/ui/hooks/useTermsSignatureGate.tsx#L40](https://github.com/jetstreamgg/tarmac/blob/db72c8c98bccbff26e0ecc3ab83db7f6b10209cb/apps/webapp/src/modules/ui/hooks/useTermsSignatureGate.tsx#L40) | connection to ensure compliance, including checks for VPN use or location within the US. |
| pass | geo_site=yes | Production JS: /ip/status decides 'region-restricted' for the whole app | [app.sky.money](https://app.sky.money) | https://app.sky.money/assets/useModalFeeCell-NOhitoyU.js: …fetch:c}},Mn=async e=>{if(!e)throw Error(`Missing auth URL`);let t=await fetch(`${e}/ip/status`);if(!t.ok)throw Error(`Could not fetch VPN st |
| pass | geo_feature=yes | Production JS: per-country modules from api.sky.money/geo-config, restrictive fallback | [app.sky.money](https://app.sky.money) | https://app.sky.money/assets/_shell.earn.fixed._slug-Dt-4s7SH.js: … throw a()}return N.createElement(r,e)};return o.preload=a,o}var H=b(),U=`https://api.sky.money/geo-config`,W=[`geo-config`];async fu |
| pass | screening=yes | Production JS: /address/status(/enhanced) screening and the 'wallet-blocked' state | [app.sky.money](https://app.sky.money) | https://app.sky.money/assets/index-B2w_FuB6.js: …sync(e,t)=>{if(!t)throw Error(`Missing auth URL`);let n=await fetch(`${t}/address/status/enhanced?address=${e}`);if(n.status!==200)throw Error(`non 200 |
| pass | vpn=detect | Production JS: is_vpn from /ip/status | [app.sky.money](https://app.sky.money) | https://app.sky.money/assets/useModalFeeCell-NOhitoyU.js: …`);if(!t.ok)throw Error(`Could not fetch VPN status`);let{country_code:n,is_vpn:r,is_restricted_region:i}=await t.json();return{countryCode:n |
| pass | geo_site=yes → 35: AF BY MM BI CF CN UA-Crimea CU CD UA-DPR ET GN GW HT HK IR IQ UA-Kherson LB LY UA-LPR ML NI NE KP RU SO SS SD SY GB VE YE UA-Zaporizhzhia ZW | Prohibited Jurisdictions named in the Sky Terms of Use (the region list the /ip/status block applies; not published in code) | [docs.sky.money/legal/skybase-international/terms-of-use](https://docs.sky.money/legal/skybase-international/terms-of-use) | …t you are not a resident of any of the following countries or regions (“ Prohibited Jurisdictions ”): Afghanistan, Belarus, Burma, Burundi, Central African Republic, China, Crimea, Cuba, Democratic R |
| pass | screening=yes | Sky compliance API /address/status answers addressAllowed:false for the sanctioned wallet and true for the control | [api.sky.money/address/status?address={address}](https://api.sky.money/address/status?address={address}) | sdn: status: 200 |

## Venus
<a id="venus"></a>

Rating **B**, restrictions **1**; mechanisms: geo_feature.

Sweeps:

- App JS: 260 scripts; strong signals: geo/geo-IP service in 1 file(s), e.g. `freeipapi` in /assets/analytics-Dno5jaoH.js; geo/block text in 1 file(s), e.g. `not available in your country` in /assets/translations-Be1EPWU9.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:unknown BY:ok CU:unknown SY:unknown VE:ok MM:error AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: 1731 files; strong signals: geo/geo-IP service in 1 file(s), e.g. `freeipapi` in https://github.com/VenusProtocol/venus-protocol-interface/blob/86ea4f7aefaaff6685aa97306fc05849a519f0f2/apps/evm/src/clients/api/queries/useGetIpLocation/getIpLocation/index.ts#L11
- Terms: 0 countries (via repository): ; clauses: geofencing, sanctions; compared with the site's Terms column: +0 / −BY CA CN CU GB IR KP RU SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia US
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_feature=yes | Pools are filtered per asset by restrictedCountries / gatedCountries from the Venus API for the visitor's country | [VenusProtocol/venus-protocol-interface@86ea4f7:apps/evm/src/clients/api/queries/useGetP…](https://github.com/VenusProtocol/venus-protocol-interface/blob/86ea4f7aefaaff6685aa97306fc05849a519f0f2/apps/evm/src/clients/api/queries/useGetPools/applyCountryCodeToPools/index.ts#L22) | const isRestricted = !!tokenMetadata?.restrictedCountries?.includes(countryCode); |
| pass | geo_feature=yes | The visitor's country comes from free.freeipapi.com | [VenusProtocol/venus-protocol-interface@86ea4f7:apps/evm/src/clients/api/queries/useGetI…](https://github.com/VenusProtocol/venus-protocol-interface/blob/86ea4f7aefaaff6685aa97306fc05849a519f0f2/apps/evm/src/clients/api/queries/useGetIpLocation/getIpLocation/index.ts#L11) | export const IP_API_URL = 'https://free.freeipapi.com/api/json'; |
| fail | geo_feature=yes | Production JS: per-asset restrictedCountries / gatedCountries and the freeipapi lookup | [app.venus.io](https://app.venus.io) | https://venus.io/assets/analytics-Dno5jaoH.js: …s.map(t=>{let r=n[t.vToken.underlyingToken.address.toLowerCase()],i=!!r?.restrictedCountries?.includes(e),a=!!r?.gatedCountries?.includes(e);return{...t |

## Euler
<a id="euler"></a>

Rating **D**, restrictions **25** (22 countries/regions: AF BY CD CF CU ET IQ IR KP LB LY ML MM NI RU SD SO SS SY VE YE ZW); mechanisms: geo_feature, screening, vpn.

Sweeps:

- App JS: 315 scripts; strong signals: geo/country header in 2 file(s), e.g. `x-country-code` in /_nuxt/CR5FQ5lJ.js; geo/block text in 18 file(s), e.g. `not available in your region` in /_nuxt/BXrdhlkW.js; screening/screening call in 2 file(s), e.g. `screen-address` in /_nuxt/CR5FQ5lJ.js; vpn/VPN detection in 1 file(s), e.g. `is_vpn` in /_nuxt/UhyyvBdK.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:challenge BY:challenge CU:challenge SY:challenge VE:challenge MM:challenge AF:challenge IQ:challenge LB:challenge LY:challenge SS:challenge ZW:challenge NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge; RU: app challenge (HTTP 403 anti-bot challenge); BY: app challenge (HTTP 403 anti-bot challenge); CU: app challenge (HTTP 403 anti-bot challenge); SY: app challenge (HTTP 403 anti-bot challenge); VE: app challenge (HTTP 403 anti-bot challenge); MM: app challenge (HTTP 403 anti-bot challenge); AF: app challenge (HTTP 403 anti-bot challenge); IQ: app challenge (HTTP 403 anti-bot challenge); LB: app challenge (HTTP 403 anti-bot challenge); LY: app challenge (HTTP 403 anti-bot challenge); SS: app challenge (HTTP 403 anti-bot challenge); ZW: app challenge (HTTP 403 anti-bot challenge); NI: app challenge (HTTP 403 anti-bot challenge); CD: app challenge (HTTP 403 anti-bot challenge); CF: app challenge (HTTP 403 anti-bot challenge); SO: app challenge (HTTP 403 anti-bot challenge); ML: app challenge (HTTP 403 anti-bot challenge)
- Code: 647 files; strong signals: geo/country header in 5 file(s), e.g. `cf-ipcountry` in https://github.com/euler-xyz/euler-lite/blob/43ba73fadda21d943224742286c7c078562e3769/scripts/public-endpoint-parity.mjs#L373; geo/block text in 25 file(s), e.g. `not available in your region` in https://github.com/euler-xyz/euler-lite/blob/43ba73fadda21d943224742286c7c078562e3769/components/entities/portfolio/PortfolioBorrowItem.vue#L422; screening/screening call in 9 file(s), e.g. `Address screening` in https://github.com/euler-xyz/euler-lite/blob/43ba73fadda21d943224742286c7c078562e3769/.env.example#L59; vpn/VPN detection in 1 file(s), e.g. `is_vpn` in https://github.com/euler-xyz/euler-lite/blob/43ba73fadda21d943224742286c7c078562e3769/utils/sanitizeApiResponse.ts#L6
- Terms: 13 countries: IR BY CU KP SY UA-Crimea UA-DPR UA-LPR UA RU US GB VE; clauses: geofencing, vpn, sanctions, kyc; compared with the site's Terms column: +GB UA US VE / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=yes | Server middleware answers HTTP 451 to /api/* for sanctioned countries (and fails closed when the country is unknown) | [euler-xyz/euler-lite@43ba73f:server/middleware/geo-gate.ts#L56](https://github.com/euler-xyz/euler-lite/blob/43ba73fadda21d943224742286c7c078562e3769/server/middleware/geo-gate.ts#L56) | if (country && SANCTIONED_COUNTRIES.includes(country)) { |
| pass | geo_site=yes → 22: AF BY CF CU KP CD ET IR IQ LB LY ML MM NI RU SO SS SD SY VE YE ZW | SANCTIONED_COUNTRIES used by that middleware (Ukraine is commented out) | [euler-xyz/euler-lite@43ba73f:entities/country-constants.ts#L3](https://github.com/euler-xyz/euler-lite/blob/43ba73fadda21d943224742286c7c078562e3769/entities/country-constants.ts#L3) | export const SANCTIONED_COUNTRIES: readonly string[] = [ |
| pass | geo_feature=yes | Per-vault and per-asset hard and soft blocks by country (repo documentation) | [euler-xyz/euler-lite@43ba73f:docs/geo-blocking.md#L21](https://github.com/euler-xyz/euler-lite/blob/43ba73fadda21d943224742286c7c078562e3769/docs/geo-blocking.md#L21) | ### Blocked (Hard Block) |
| pass | screening=yes | Wallet screening through the Euler data API (TRM Labs), fail-closed | [euler-xyz/euler-lite@43ba73f:server/utils/screening.ts#L75](https://github.com/euler-xyz/euler-lite/blob/43ba73fadda21d943224742286c7c078562e3769/server/utils/screening.ts#L75) | * (`POST /v3/compliance/address-screening`). |
| pass | vpn=detect | VPN/proxy use reported by the edge is detected and logged (not blocked) | [euler-xyz/euler-lite@43ba73f:server/middleware/geo-gate.ts#L48](https://github.com/euler-xyz/euler-lite/blob/43ba73fadda21d943224742286c7c078562e3769/server/middleware/geo-gate.ts#L48) | if (edge.vpnIsUsed === true) { |
| pass | geo_feature=yes | Production JS: the country from the x-country-code header and region errors for operations | [app.euler.finance](https://app.euler.finance) | https://app.euler.finance/_nuxt/CR5FQ5lJ.js: …value;try{W={value:(await fetch(window.location.origin,{method:`HEAD`})).headers.get(`x-country-code`)?.toUpperCase()//null,timestamp:Date.now()}}catch{W= |

## Fluid
<a id="fluid"></a>

Rating **n/a**, restrictions **0**.

Sweeps:

- App JS: 413 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:error AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: — no open repository
- Terms: 0 countries (via app JavaScript): ; clauses: screening
- API: — no public screening API known

No claim checks: the site establishes nothing for this interface that a check could confirm.

## Liquity V2
<a id="liquity"></a>

Rating **A**, restrictions **0**.

Sweeps:

- App JS: 25 scripts; strong signals: vpn/VPN detection in 1 file(s), e.g. `vpnapi.io` in /_next/static/chunks/app/layout-97738d4e27a56544.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:error NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: 558 files; strong signals: vpn/VPN detection in 2 file(s), e.g. `vpnapi.io` in https://github.com/liquity/bold/blob/d262669ef3c4d37bf0544df3bb2624c07b8a5ee0/frontend/app/.env#L15
- Terms: — no Terms published
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=optional | Country block via vpnapi.io exists in the code but runs only when NEXT_PUBLIC_BLOCKING_VPNAPI is set (off by default) | [liquity/bold@d262669:frontend/app/src/comps/Blocking/Blocking.tsx#L5](https://github.com/liquity/bold/blob/d262669ef3c4d37bf0544df3bb2624c07b8a5ee0/frontend/app/src/comps/Blocking/Blocking.tsx#L5) | import { BLOCKING_LIST, BLOCKING_VPNAPI } from "@/src/env"; |
| pass | screening=optional | On-chain blocklist contract (isBlacklisted) is consulted only when NEXT_PUBLIC_BLOCKING_LIST is set | [liquity/bold@d262669:frontend/app/src/comps/Blocking/Blocking.tsx#L5](https://github.com/liquity/bold/blob/d262669ef3c4d37bf0544df3bb2624c07b8a5ee0/frontend/app/src/comps/Blocking/Blocking.tsx#L5) | import { BLOCKING_LIST, BLOCKING_VPNAPI } from "@/src/env"; |
| pass | vpn=optional | Both blocking variables are optional environment settings for third-party frontends | [liquity/bold@d262669:frontend/app/src/env.ts#L119](https://github.com/liquity/bold/blob/d262669ef3c4d37bf0544df3bb2624c07b8a5ee0/frontend/app/src/env.ts#L119) | BLOCKING_LIST: v.optional( |
| pass | geo_site=optional | Production JS: the optional blocking settings ship unset (BLOCKING_LIST:void 0) | [liquity.app](https://liquity.app) | https://liquity.app/_next/static/chunks/app/layout-97738d4e27a56544.js: …null,(0,c.Q)({address:null!==s.BLOCKING_LIST&&void 0!==s.BLOCKING_LIST?s.BLOCKING_LIST:void 0,abi:[{inputs:[{internalType:"addr |

## Notional Exponent
<a id="notional"></a>

Rating **C**, restrictions **19** (18 countries/regions: BY CD CF CG CU IQ IR KP LB LR LY RU SO SY US VE YE ZW); mechanisms: screening.

Sweeps:

- App JS: 13 scripts; strong signals: geo/geo endpoint in 1 file(s), e.g. `/geoip` in /main.af0a49d5513340f6.js; screening/sanctions oracle in 1 file(s), e.g. `0x40c57923924b5c5c5455c48d93317139addac8fb` in /main.af0a49d5513340f6.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: 1039 files; strong signals: geo/geo endpoint in 3 file(s), e.g. `/geoip` in https://github.com/notional-finance/notional-monorepo/blob/cff15de4b098d101b2a023732efd242496c42888/apps/api/src/index.ts#L51; screening/sanctions oracle in 1 file(s), e.g. `0x40c57923924b5c5c5455c48d93317139addac8fb` in https://github.com/notional-finance/notional-monorepo/blob/cff15de4b098d101b2a023732efd242496c42888/packages/notionable/src/account/communities.ts#L114; screening/screening vendor in 2 file(s), e.g. `hypernative.xyz` in https://github.com/notional-finance/notional-monorepo/blob/cff15de4b098d101b2a023732efd242496c42888/apps/exponent-liquidator/src/index.ts#L56
- Terms: 1 countries (via app JavaScript): US; clauses: sanctions, us_persons; compared with the site's Terms column: +US / −CU IR KP SY UA-Crimea US-NY VE
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=yes → 18: CU IR IQ SY KP RU BY CF CD CG LB LR LY SO VE YE ZW US | Visitors from SanctionedCountries (country from api.notional.finance/geoip) are sent to /blocked | [notional-finance/notional-monorepo@cff15de:packages/shared/notionable-hooks/src/use-geo…](https://github.com/notional-finance/notional-monorepo/blob/cff15de4b098d101b2a023732efd242496c42888/packages/shared/notionable-hooks/src/use-geoip-block.ts#L38) | SanctionedCountries.find((s) => s === country) // isSanctionedAddress; |
| pass | screening=yes | The connected wallet is checked with the Chainalysis Sanctions Oracle on-chain (isSanctioned) | [notional-finance/notional-monorepo@cff15de:packages/notionable/src/account/communities.…](https://github.com/notional-finance/notional-monorepo/blob/cff15de4b098d101b2a023732efd242496c42888/packages/notionable/src/account/communities.ts#L114) | '0x40c57923924b5c5c5455c48d93317139addac8fb', |
| pass | geo_site=yes → 18: CU IR IQ SY KP RU BY CF CD CG LB LR LY SO VE YE ZW US | Production JS: country list, api.notional.finance/geoip lookup and the redirect to /blocked | [notional.finance](https://notional.finance) | https://notional.finance/main.af0a49d5513340f6.js: …twork:n});r&&i.setProvider(r),e.networkAccounts.set(n,i)});const i=yield fetch("https://api.notional.finance/geoip").then(e=>e.json());console.log(" |
| pass | screening=yes | Production JS: Chainalysis Sanctions Oracle isSanctioned call | [notional.finance](https://notional.finance) | https://notional.finance/main.af0a49d5513340f6.js: …nknown",JSON.stringify({}));const n=await function(e){return new XWe.NZ("0x40c57923924b5c5c5455c48d93317139addac8fb",["function isSanctioned(address |

## Notional V3
<a id="notional-v3"></a>

Rating **D**, restrictions **21** (18 countries/regions: BY CD CF CG CU IQ IR KP LB LR LY RU SO SY US VE YE ZW); mechanisms: geo_feature, screening, vpn.

Sweeps:

- App JS: 110 scripts; strong signals: geo/geo endpoint in 1 file(s), e.g. `/geoip` in /main.00a437cad7319876.js; screening/sanctions oracle in 1 file(s), e.g. `0x40c57923924b5c5c5455c48d93317139addac8fb` in /main.00a437cad7319876.js; vpn/VPN detection in 1 file(s), e.g. `detect.notional.finance/` in /main.00a437cad7319876.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:error CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: 1039 files; strong signals: geo/geo endpoint in 3 file(s), e.g. `/geoip` in https://github.com/notional-finance/notional-monorepo/blob/cff15de4b098d101b2a023732efd242496c42888/apps/api/src/index.ts#L51; screening/sanctions oracle in 1 file(s), e.g. `0x40c57923924b5c5c5455c48d93317139addac8fb` in https://github.com/notional-finance/notional-monorepo/blob/cff15de4b098d101b2a023732efd242496c42888/packages/notionable/src/account/communities.ts#L114; screening/screening vendor in 2 file(s), e.g. `hypernative.xyz` in https://github.com/notional-finance/notional-monorepo/blob/cff15de4b098d101b2a023732efd242496c42888/apps/exponent-liquidator/src/index.ts#L56
- Terms: 1 countries (via app JavaScript): US; clauses: vpn, screening, sanctions, us_persons; compared with the site's Terms column: +US / −CU IR KP SY UA-Crimea US-NY VE
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=yes → 17: CU IR IQ SY KP RU BY CF CD CG LB LR LY SO VE YE ZW | The V3 app sends visitors from a hardcoded country list (country from api.notional.finance/geoip) to /error?code=451 | [v3.notional.finance](https://v3.notional.finance) | https://v3.notional.finance/main.00a437cad7319876.js: …status:403})));console.log("[DEBUG] VPN Check: ",a.status);const r=yield fetch("https://api.notional.finance/geoip").then((e=>e.json()));console. |
| pass | geo_feature=yes → 1: US | Leveraged products are disabled in the US and for VPN users | [v3.notional.finance](https://v3.notional.finance) | https://v3.notional.finance/main.00a437cad7319876.js: …ERAGED))),F={geoErrorHeading:{id:"ePDMaB",defaultMessage:[{type:0,value:"Leveraged products are not available in the US or to VPN users. Non-Leve |
| pass | screening=yes | The connected wallet is checked with the Chainalysis Sanctions Oracle (isSanctioned) | [v3.notional.finance](https://v3.notional.finance) | https://v3.notional.finance/main.00a437cad7319876.js: …"unknown",JSON.stringify({}));const n=await function(e){return new Yh.NZ("0x40c57923924b5c5c5455c48d93317139addac8fb",["function isSanctioned(add |
| pass | vpn=detect | detect.notional.finance: a non-200 answer marks the visitor as 'VPN' | [v3.notional.finance](https://v3.notional.finance) | https://v3.notional.finance/main.00a437cad7319876.js: …work:n});i&&a.setProvider(i),e.networkAccounts.set(n,a)}));const a=yield fetch("https://detect.notional.finance/").catch((()=>({status:403})));co |

## Notional V2
<a id="notional-v2"></a>

Rating **A**, restrictions **0**.

Sweeps:

- App JS: 90 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:error CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: — no open repository
- Terms: — no Terms published
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=no | The V2 app's JavaScript has no geo-IP lookup or country block | [v2.notional.finance](https://v2.notional.finance) |  |
| pass | screening=no | The V2 app's JavaScript has no wallet-screening call or sanctions list | [v2.notional.finance](https://v2.notional.finance) |  |

## Lido
<a id="lido"></a>

Rating **C**, restrictions **7** (4 countries/regions: CU IR SY US); mechanisms: geo_feature, screening, vpn.

Sweeps:

- App JS: 17 scripts; strong signals: geo/block text in 1 file(s), e.g. `not available in your region` in /_next/static/chunks/4548-8e46c35556b36c9d.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:error FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:unknown SY:unknown VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok; US: /api/geo feature_limited {"availability": "limited", "country": "US"}; US-NY: /api/geo feature_limited {"availability": "limited", "country": "US"}
- Code: 1544 files; strong signals: geo/country header in 1 file(s), e.g. `cf-ipcountry` in https://github.com/lidofinance/ethereum-staking-widget/blob/7fa7f1a7fec66f4db742b0f2178338c2c2beb54a/utilsApi/geo-handler.ts#L12; geo/geo endpoint in 5 file(s), e.g. `/api/geo` in https://github.com/lidofinance/ethereum-staking-widget/blob/7fa7f1a7fec66f4db742b0f2178338c2c2beb54a/.env.example#L50; geo/block text in 1 file(s), e.g. `not available in your region` in https://github.com/lidofinance/ethereum-staking-widget/blob/7fa7f1a7fec66f4db742b0f2178338c2c2beb54a/features/earn/shared/v2/geo-notice/consts.tsx#L24
- Terms: 9 countries: UA-Crimea CU UA-DPR IR UA-LPR KP SY US GB; clauses: vpn, sanctions; compared with the site's Terms column: +US / −0
- API: 1 check(s)

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_feature=yes → 1: US | Remote config: countries that get the 'limited' experience (Earn vault deposits closed) | [lidofinance/ethereum-staking-widget@7fa7f1a:REMOTE_CONFIG_MANIFEST.json#L35](https://github.com/lidofinance/ethereum-staking-widget/blob/7fa7f1a7fec66f4db742b0f2178338c2c2beb54a/REMOTE_CONFIG_MANIFEST.json#L35) | "geo": { |
| pass | geo_feature=yes | /api/geo answers 'limited' for a listed country (country from Cloudflare's cf-ipcountry) | [lidofinance/ethereum-staking-widget@7fa7f1a:utilsApi/geo-handler.ts#L12](https://github.com/lidofinance/ethereum-staking-widget/blob/7fa7f1a7fec66f4db742b0f2178338c2c2beb54a/utilsApi/geo-handler.ts#L12) | const CF_COUNTRY_HEADER = 'cf-ipcountry'; |
| pass | screening=yes | /api/validation forwards the wallet to an external validation API ({validationAPI}/v{n}/check/{address}) | [lidofinance/ethereum-staking-widget@7fa7f1a:pages/api/validation.ts#L51](https://github.com/lidofinance/ethereum-staking-widget/blob/7fa7f1a7fec66f4db742b0f2178338c2c2beb54a/pages/api/validation.ts#L51) | secretConfig.validationAPI + `/v${version}/check/${validatedAddress}`; |
| pass | vpn=detect | Tor exit nodes (Cloudflare country T1) are treated as unresolved and get the limited experience | [lidofinance/ethereum-staking-widget@7fa7f1a:utilsApi/geo-handler.ts#L11](https://github.com/lidofinance/ethereum-staking-widget/blob/7fa7f1a7fec66f4db742b0f2178338c2c2beb54a/utilsApi/geo-handler.ts#L11) | // could not be resolved and `T1` for Tor exit nodes. |
| pass | geo_feature=yes → 1: US | Production HTML: the remote config shipped to the browser limits these countries | [stake.lido.fi](https://stake.lido.fi) | https://stake.lido.fi (HTML and inline scripts): …wAfterStake":true},"earnAllocation":{"labelAllowList":[],"hiddenIds":[]},"geo":{"limited":["US"]},"pages":{"/earn":{"shouldDisable":false,"showNew":tr |
| pass | geo_feature=yes | Production JS: the 'not available in your region' notice for Earn vaults | [stake.lido.fi](https://stake.lido.fi) | https://stake.lido.fi/_next/static/chunks/4548-8e46c35556b36c9d.js: …o-notice-state":n,children:(0,s.jsx)(c,{state:n,centered:!0,limitedText:"This vault is not available in your region. Withdrawals re |
| pass | screening=yes | Lido's /api/validation answers isValid:false for the sanctioned wallet and true for the control | [stake.lido.fi/api/validation?address={address}](https://stake.lido.fi/api/validation?address={address}) | sdn: status: 200 |
| pass | geo_feature=yes → 1: US | Live: stake.lido.fi/api/geo answers availability=limited to a visitor from the US | [stake.lido.fi/api/geo](https://stake.lido.fi/api/geo) from US | body: {"country":"US","availability":"limited"} |
| recorded | geo_site=yes → 3: SY CU IR | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | SY: api https://stake.lido.fi/api/geo → HTTP 403 blocked (residential, 2026-10-28); CU: api https://stake.lido.fi/api/geo → HTTP 403 blocked (residential, 2026-10-28); IR: api https://stake.lido.fi/ap |

## Lido V3 (stVaults)
<a id="lido-stvaults"></a>

Rating **B**, restrictions **1**; mechanisms: screening.

Sweeps:

- App JS: 14 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:unknown SY:unknown VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: 1558 files; strong signals: screening/screening call in 1 file(s), e.g. `/v2/check/` in https://github.com/lidofinance/staking-vault-widget/blob/f258fb091d3ca01e5baf98128d01818e407a7877/pages/api/validation.ts#L57
- Terms: 9 countries: UA-Crimea CU UA-DPR IR UA-LPR KP SY US GB; clauses: vpn, sanctions; compared with the site's Terms column: +US / −0
- API: 1 check(s)

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=no | No geo-IP lookup or country block in the stVaults widget | [lidofinance/staking-vault-widget@f258fb0:/](https://github.com/lidofinance/staking-vault-widget/tree/f258fb091d3ca01e5baf98128d01818e407a7877) |  |
| pass | screening=yes | /api/validation forwards the wallet to Lido's external validation API ({validationAPI}/v2/check/{address}), as on stake.lido.fi | [lidofinance/staking-vault-widget@f258fb0:pages/api/validation.ts#L57](https://github.com/lidofinance/staking-vault-widget/blob/f258fb091d3ca01e5baf98128d01818e407a7877/pages/api/validation.ts#L57) | ? `/v2/check/${validatedAddress}` |
| pass | screening=yes | The app validates every connected address with the API (falls back to a local address file, else lets it through) | [lidofinance/staking-vault-widget@f258fb0:providers/address-validation-provider.tsx#L111](https://github.com/lidofinance/staking-vault-widget/blob/f258fb091d3ca01e5baf98128d01818e407a7877/providers/address-validation-provider.tsx#L111) | * 2. API enabled + success → return API.isValid |
| pass | geo_site=no | Production JS of Lido stVaults: no geo-IP lookup or country block | [stvaults.lido.fi](https://stvaults.lido.fi) |  |
| pass | screening=yes | stVaults /api/validation answers isValid:false for the sanctioned wallet and true for the control | [stvaults.lido.fi/api/validation?address={address}](https://stvaults.lido.fi/api/validation?address={address}) | sdn: status: 200 |

## Rocket Pool
<a id="rocketpool"></a>

Rating **n/a**, restrictions **0**.

Sweeps:

- App JS: 5 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:error FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:challenge TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:challenge TH:ok PH:ok MY:ok SG:ok HK:challenge CN:challenge KR:ok TW:ok AU:error NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:challenge BY:ok CU:ok SY:challenge VE:ok MM:challenge AF:ok IQ:challenge LB:error LY:challenge SS:error ZW:challenge NI:ok CD:challenge CF:challenge SO:challenge ML:ok; UA: app challenge (HTTP 403 anti-bot challenge); VN: app challenge (HTTP 403 anti-bot challenge); HK: app challenge (HTTP 403 anti-bot challenge); CN: app challenge (HTTP 403 anti-bot challenge); RU: app challenge (HTTP 403 anti-bot challenge); SY: app challenge (HTTP 403 anti-bot challenge); MM: app challenge (HTTP 403 anti-bot challenge); IQ: app challenge (HTTP 403 anti-bot challenge); LY: app challenge (HTTP 403 anti-bot challenge); ZW: app challenge (HTTP 403 anti-bot challenge); CD: app challenge (HTTP 403 anti-bot challenge); CF: app challenge (HTTP 403 anti-bot challenge); SO: app challenge (HTTP 403 anti-bot challenge)
- Code: — no open repository
- Terms: — no Terms published
- API: — no public screening API known

No claim checks: the site establishes nothing for this interface that a check could confirm.

## EigenLayer (EigenCloud)
<a id="eigenlayer"></a>

Rating **C**, restrictions **11** (10 countries/regions: CA CN CU IR KP RU SY UA US VE); mechanisms: vpn.

Sweeps:

- App JS: error: direct: HTTP 500; proxy US: HTTP 500
- Live: RO:error US:error CA:error MX:error AR:error CO:error GB:error DE:error FR:error NL:error ES:error IT:error PL:error CH:error SE:error UA:blocked TR:error AE:error SA:error IL:error PK:error BD:error VN:error TH:error PH:error MY:error SG:error HK:error CN:error KR:error TW:error AU:error NG:error ZA:error KE:error KZ:error GE:error US-NY:error CA-ON:error RU:blocked BY:error CU:blocked SY:blocked VE:error MM:error AF:error IQ:error LB:error LY:error SS:error ZW:error NI:error CD:error CF:error SO:error ML:error; UA: app blocked (block text in the page); RU: app blocked (block text in the page); CU: app blocked (block text in the page); SY: app blocked (block text in the page)
- Code: — no open repository
- Terms: 1 countries (via archive): US; clauses: sanctions; compared with the site's Terms column: +US / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=reported → 7: US CA CN CU KP IR VE | Press report (Apr 2024): the EIGEN claim site blocks IP addresses from listed regions | [decrypt.co/228642/eigen-token-airdrop-plan-ethereum-restaking-protocol-eigenlayer](https://decrypt.co/228642/eigen-token-airdrop-plan-ethereum-restaking-protocol-eigenlayer) | …se that certain regions will be excluded from participating in the drop, enforced through IP address blocks for regions under international sanctions or “deemed high-risk,” including the United State |
| pass | vpn=block | Press report (Apr 2024): proxy and VPN detection and blocking on the EIGEN claim site | [decrypt.co/228642/eigen-token-airdrop-plan-ethereum-restaking-protocol-eigenlayer](https://decrypt.co/228642/eigen-token-airdrop-plan-ethereum-restaking-protocol-eigenlayer) | …o avoid circumvention of our geo-location controls, the organization has implemented proxy and VPN detection and blocking controls, which are designed to prevent Eigen claims by any person detected t |
| pass | geo_site=yes → 1: UA | Live: app.eigenlayer.xyz answers a visitor from Ukraine with 'RESTRICTED: The application is not available to persons in your jurisdiction' | [app.eigenlayer.xyz](https://app.eigenlayer.xyz) from UA | …TED</span><span class="text-DisplayS font-geist font-normal text-center">The application is not available to persons in your jurisdiction. Please visit our <!-- -->  <a target="_blank" rel="noreferre |
| recorded | geo_site=yes → 2: RU SY | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | RU: site https://app.eigenlayer.xyz → HTTP 200 blocked (residential, 2026-10-28); SY: site https://app.eigenlayer.xyz → HTTP 200 blocked (residential, 2026-10-28) |

## ether.fi
<a id="etherfi"></a>

Rating **A**, restrictions **0**.

Sweeps:

- App JS: error: direct: HTTP 429; proxy US: HTTP 429
- Live: RO:challenge US:challenge CA:challenge MX:challenge AR:challenge CO:challenge GB:challenge DE:challenge FR:challenge NL:challenge ES:challenge IT:challenge PL:challenge CH:challenge SE:challenge UA:challenge TR:challenge AE:challenge SA:challenge IL:challenge PK:challenge BD:challenge VN:challenge TH:challenge PH:challenge MY:challenge SG:challenge HK:challenge CN:challenge KR:challenge TW:challenge AU:challenge NG:challenge ZA:challenge KE:challenge KZ:error GE:challenge US-NY:challenge CA-ON:challenge RU:challenge BY:challenge CU:challenge SY:challenge VE:challenge MM:challenge AF:challenge IQ:challenge LB:challenge LY:challenge SS:challenge ZW:challenge NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge; direct: app challenge (HTTP 429 anti-bot challenge); US: app challenge (HTTP 429 anti-bot challenge); CA: app challenge (HTTP 429 anti-bot challenge); MX: app challenge (HTTP 429 anti-bot challenge); AR: app challenge (HTTP 429 anti-bot challenge); CO: app challenge (HTTP 429 anti-bot challenge); GB: app challenge (HTTP 429 anti-bot challenge); DE: app challenge (HTTP 429 anti-bot challenge); FR: app challenge (HTTP 429 anti-bot challenge); NL: app challenge (HTTP 429 anti-bot challenge); ES: app challenge (HTTP 429 anti-bot challenge); IT: app challenge (HTTP 429 anti-bot challenge); PL: app challenge (HTTP 429 anti-bot challenge); CH: app challenge (HTTP 429 anti-bot challenge); SE: app challenge (HTTP 429 anti-bot challenge); UA: app challenge (HTTP 429 anti-bot challenge); TR: app challenge (HTTP 429 anti-bot challenge); AE: app challenge (HTTP 429 anti-bot challenge); SA: app challenge (HTTP 429 anti-bot challenge); IL: app challenge (HTTP 429 anti-bot challenge); PK: app challenge (HTTP 429 anti-bot challenge); BD: app challenge (HTTP 429 anti-bot challenge); VN: app challenge (HTTP 429 anti-bot challenge); TH: app challenge (HTTP 429 anti-bot challenge); PH: app challenge (HTTP 429 anti-bot challenge); MY: app challenge (HTTP 429 anti-bot challenge); SG: app challenge (HTTP 429 anti-bot challenge); HK: app challenge (HTTP 429 anti-bot challenge); CN: app challenge (HTTP 429 anti-bot challenge); KR: app challenge (HTTP 429 anti-bot challenge); TW: app challenge (HTTP 429 anti-bot challenge); AU: app challenge (HTTP 429 anti-bot challenge); NG: app challenge (HTTP 429 anti-bot challenge); ZA: app challenge (HTTP 429 anti-bot challenge); KE: app challenge (HTTP 429 anti-bot challenge); GE: app challenge (HTTP 429 anti-bot challenge); US-NY: app challenge (HTTP 429 anti-bot challenge); CA-ON: app challenge (HTTP 429 anti-bot challenge); RU: app challenge (HTTP 429 anti-bot challenge); BY: app challenge (HTTP 429 anti-bot challenge); CU: app challenge (HTTP 429 anti-bot challenge); SY: app challenge (HTTP 429 anti-bot challenge); VE: app challenge (HTTP 429 anti-bot challenge); MM: app challenge (HTTP 429 anti-bot challenge); AF: app challenge (HTTP 429 anti-bot challenge); IQ: app challenge (HTTP 429 anti-bot challenge); LB: app challenge (HTTP 429 anti-bot challenge); LY: app challenge (HTTP 429 anti-bot challenge); SS: app challenge (HTTP 429 anti-bot challenge); ZW: app challenge (HTTP 429 anti-bot challenge); NI: app challenge (HTTP 429 anti-bot challenge); CD: app challenge (HTTP 429 anti-bot challenge); CF: app challenge (HTTP 429 anti-bot challenge); SO: app challenge (HTTP 429 anti-bot challenge); ML: app challenge (HTTP 429 anti-bot challenge)
- Code: — no open repository
- Terms: 19 countries (via archive): KY CA US US-NY GB BY BI UA-Crimea CU CD IR IQ LY KP SO SD SY VE ZW; clauses: geofencing, vpn, screening, sanctions, us_persons; compared with the site's Terms column: +GB KY US US-NY / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=tos_only | The Terms exclude residents of Canada and of Restricted Jurisdictions (www.ether.fi blocks scripts with a Vercel challenge; the same Terms are read from the ether.fi GitBook) | [etherfi.gitbook.io/etherfi/legal/ether.fi-legal/terms-of-use](https://etherfi.gitbook.io/etherfi/legal/ether.fi-legal/terms-of-use) | …risdiction of residence or citizenship. Specifically, these Services are not available to residents or citizens of Canada or any Restricted Jurisdiction as defined below. Residents or citizens of the |

## Pendle
<a id="pendle"></a>

Rating **C**, restrictions **6** (6 countries/regions: BY CU IR SD SY ZW).

Sweeps:

- App JS: 147 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:error BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:error BY:blocked CU:blocked SY:blocked VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:blocked NI:ok CD:ok CF:ok SO:ok ML:ok; BY: app blocked (HTTP 451); CU: app blocked (HTTP 451); SY: app blocked (HTTP 451); ZW: app blocked (HTTP 451)
- Code: — no open repository
- Terms: 1 countries: US; clauses: geofencing, vpn, screening, sanctions; compared with the site's Terms column: +US / −BY CU IR KP MM RU SD SY UA-Crimea UA-DPR UA-LPR VE ZW
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=tos_only | The Terms forbid circumventing geo-blocks with a VPN; no technical block verified (closed frontend) | [docs.pendle.finance/pendle-v2/TermsOfUse](https://docs.pendle.finance/pendle-v2/TermsOfUse) | …spicion that you or the person you are acting for is an Excluded Person. You shall not use a virtual private network, proxy or any other method to circumvent geo-blocks or eligibility criteria. " Exc |
| recorded | geo_site=yes → 6: BY SY CU IR SD ZW | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | BY: site https://app.pendle.finance → HTTP 451 blocked (residential, 2026-10-28); SY: site https://app.pendle.finance → HTTP 451 blocked (residential, 2026-10-28); CU: site https://app.pendle.finance  |

## Ethena
<a id="ethena"></a>

Rating **D**, restrictions **50** (47 countries/regions: AF AT BE BG BY CF CU CY CZ DE DK EE ES FI FR GR HR HU IE IR IS IT LB LI LT LU LV LY ML MM MT NI NL NO PL PT RO RU SE SI SK SS SY US VE YE ZW); mechanisms: geo_feature, screening, kyc.

**To review** (found by the sweeps, not explained by the published data):

- live: the app is blocked from SO (redirect -> https://ethena.fi/restricted), but the site does not count SO

Sweeps:

- App JS: 373 scripts; strong signals: geo/geo endpoint in 2 file(s), e.g. `/api/geolocation` in /_next/static/chunks/app/page-f3956634-1ecd72bb655968b3.js
- Live: RO:ok US:blocked CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:blocked CA-ON:ok RU:blocked BY:blocked CU:blocked SY:blocked VE:blocked MM:blocked AF:blocked IQ:ok LB:blocked LY:blocked SS:blocked ZW:blocked NI:error CD:ok CF:blocked SO:blocked ML:blocked; US: app blocked (redirect -> https://ethena.fi/restricted); US-NY: app blocked (redirect -> https://ethena.fi/restricted); RU: app blocked (redirect -> https://ethena.fi/restricted); BY: app blocked (redirect -> https://ethena.fi/restricted); CU: app blocked (redirect -> https://ethena.fi/restricted); SY: app blocked (redirect -> https://ethena.fi/restricted); VE: app blocked (redirect -> https://ethena.fi/restricted); MM: app blocked (redirect -> https://ethena.fi/restricted); AF: app blocked (redirect -> https://ethena.fi/restricted); LB: app blocked (redirect -> https://ethena.fi/restricted); LY: app blocked (redirect -> https://ethena.fi/restricted); SS: app blocked (redirect -> https://ethena.fi/restricted); ZW: app blocked (redirect -> https://ethena.fi/restricted); CF: app blocked (redirect -> https://ethena.fi/restricted); SO: app blocked (redirect -> https://ethena.fi/restricted); ML: app blocked (redirect -> https://ethena.fi/restricted)
- Code: — no open repository
- Terms: 36 countries: US GB CH GE-Abkhazia AF AO BY BI CF CG CU UA-Crimea ET GW IR CI LB LR LY ML MM NI KP CY-North RU SO GE-SouthOssetia SS SD SY UA UA-DPR UA-LPR VE YE ZW; clauses: geofencing, sanctions; compared with the site's Terms column: +AF AO BI CF CG CH CI ET GB GW LB LR LY ML NI SD SO SS UA YE ZW / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | screening=yes | The /restricted page served to blocked visitors also covers wallets 'linked to high risk activities' | [ethena.fi/restricted](https://ethena.fi/restricted) | https://ethena.fi/restricted (HTML and inline scripts): …xt-center">Unfortunately, Ethena is not available in your country yet or your wallet is linked to high risk activities.</p></div></div></sectio |
| pass | geo_site=yes → 1: US | Ethena FAQ: US users are not able to access the application | [docs.ethena.fi/resources/faq](https://docs.ethena.fi/resources/faq) | All addresses will need to be whitelisted by the Ethena Protocol after satisfying KYC/AML checks. US users are not able to access the application. Feel free to reach out in our Telegram or Discord for |
| pass | geo_feature=yes → 30: AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE IS LI NO | Ethena Terms: acquiring sUSDe is not offered to persons resident in the EU or the EEA (the list is from the Terms; per-country enforcement in the app is not verified) | [docs.ethena.fi/resources/terms-of-service](https://docs.ethena.fi/resources/terms-of-service) | …hena OpCo Ltd. pertaining to sUSDe, including any references to APY. The acquisition of sUSDe is not offered to persons with their habitual residence or registered office in the European Union or the |
| pass | kyc=yes | Ethena FAQ: minting addresses must be whitelisted after KYC/AML checks | [docs.ethena.fi/resources/faq](https://docs.ethena.fi/resources/faq) | All addresses will need to be whitelisted by the Ethena Protocol after satisfying KYC/AML checks. US users are not able to access the application. Feel free to reach out in our Telegram or Discord for |
| pass | geo_site=yes → 1: US | Live: app.ethena.fi redirects a visitor from the US to /restricted | [app.ethena.fi](https://app.ethena.fi) from US | final_url: https://ethena.fi/restricted |
| recorded | geo_site=yes → 16: RU BY SY VE CU IR MM AF LY LB SS YE ZW NI CF ML | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | RU: site https://app.ethena.fi → HTTP 200 blocked (residential, 2026-10-28); BY: site https://app.ethena.fi → HTTP 200 blocked (residential, 2026-10-28); SY: site https://app.ethena.fi → HTTP 200 bloc |

## Yearn
<a id="yearn"></a>

Rating **A**, restrictions **0**.

Sweeps:

- App JS: 15 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:error AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: 768 files; no strong signals
- Terms: — no Terms published
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=no | No geo-IP lookup or country block in the frontend | [yearn/yearn.fi@ad153cb:/](https://github.com/yearn/yearn.fi/tree/ad153cba6e55862634ad6a7b8e8061832a5e91cb) |  |
| pass | screening=no | No wallet-screening call or sanctions list in the frontend | [yearn/yearn.fi@ad153cb:/](https://github.com/yearn/yearn.fi/tree/ad153cba6e55862634ad6a7b8e8061832a5e91cb) |  |
| pass | geo_site=no | Production JS of Yearn: no geo-IP lookup or country block | [yearn.fi](https://yearn.fi) |  |
| pass | screening=no | Production JS of Yearn: no wallet-screening call or sanctions oracle | [yearn.fi](https://yearn.fi) |  |

## Beefy
<a id="beefy"></a>

Rating **C**, restrictions **6** (5 countries/regions: AU CA GB SG US); mechanisms: geo_feature.

**To review** (found by the sweeps, not explained by the published data):

- live: TR: different scripts than direct (+0 / -/assets/js/entry-index-*.js)

Sweeps:

- App JS: 451 scripts; strong signals: geo/geo endpoint in 1 file(s), e.g. `/geo/country` in /assets/js/beefy-api-D-9gvYYA.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok; TR: different scripts than direct (+0 / -/assets/js/entry-index-*.js)
- Code: 1494 files; strong signals: geo/geo endpoint in 1 file(s), e.g. `/geo/country` in https://github.com/beefyfinance/beefy-v2/blob/b7098b467950b1ac01dbb248241bbc9bfae72e0b/src/features/data/apis/beefy/beefy-api.ts#L178
- Terms: — no Terms published
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_feature=yes → 5: US CA GB AU SG | Vaults with tokenized equities on Base are restricted for these countries | [beefyfinance/beefy-v2@b7098b4:src/config/restrictions.json#L2](https://github.com/beefyfinance/beefy-v2/blob/b7098b467950b1ac01dbb248241bbc9bfae72e0b/src/config/restrictions.json#L2) | "base-tequities": { |
| pass | geo_feature=yes | Country from api.beefy.finance/geo/country; unknown location or an error counts as blocked | [beefyfinance/beefy-v2@b7098b4:src/features/data/selectors/restrictions.ts#L81](https://github.com/beefyfinance/beefy-v2/blob/b7098b467950b1ac01dbb248241bbc9bfae72e0b/src/features/data/selectors/restrictions.ts#L81) | return 'blocked'; // fail closed on error |
| pass | geo_feature=yes → 5: US CA GB AU SG | Production JS: tokenized-equity vault countries and the geo/country lookup | [app.beefy.com](https://app.beefy.com) | https://app.beefy.com/assets/js/beefy-api-D-9gvYYA.js: …"short",timeout:this.timeout})}async getGeoCountry(){return await e({url:`${this.api}/geo/country`,params:{_:`${Date.now()}.${Math.random().toSt |

## Convex
<a id="convex"></a>

Rating **n/a**, restrictions **0**.

Sweeps:

- App JS: 40 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:error AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: — no open repository
- Terms: — no Terms published
- API: — no public screening API known

No claim checks: the site establishes nothing for this interface that a check could confirm.

## Across
<a id="across"></a>

Rating **A**, restrictions **0**.

Sweeps:

- App JS: 483 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:challenge SY:challenge VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok; CU: app challenge (HTTP 403 anti-bot challenge); SY: app challenge (HTTP 403 anti-bot challenge)
- Code: — no open repository
- Terms: 2 countries: US US-NY; clauses: vpn, sanctions; compared with the site's Terms column: +US US-NY / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=tos_only | The Terms reserve blocking activity from a jurisdiction (incl. by IP address) at Risk Labs' discretion | [across.to/terms-of-service](https://across.to/terms-of-service) | … and the U.S. Department of Treasury's Office of Foreign Asset Controls. Activity from a jurisdiction (including an IP address in a jurisdiction) that we have, in our sole discretion, determined is a |

## Stargate
<a id="stargate"></a>

Rating **B**, restrictions **2** (1 countries/regions: UA); mechanisms: geo_feature.

Sweeps:

- App JS: 41 scripts; strong signals: geo/block text in 1 file(s), e.g. `not available in your region` in /_next/static/chunks/9647-323ab3729798bf23.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:error FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:unknown BY:ok CU:unknown SY:unknown VE:ok MM:unknown AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: — no open repository
- Terms: 3 countries: GB KY US; clauses: vpn, sanctions; compared with the site's Terms column: +GB KY US / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_feature=yes | Production JS: before a CCTP transfer the app asks Circle's /v1/publicKeys and throws UsdcCctpRegionRestrictedError when it fails | [stargate.finance](https://stargate.finance) | https://stargate.finance/_next/static/chunks/9647-323ab3729798bf23.js: …urable:!0})},14320:(e,t,n)=>{"use strict";n.d(t,{G:()=>s,Q:()=>a});var a="https://iris-api.circle.com",s=1000000000000n},14602:( |
| pass | geo_site=tos_only | The Terms exclude persons located in comprehensively sanctioned jurisdictions (no country list, no technical block verified) | [stargate.finance/terms](https://stargate.finance/terms) | …eign Assets Control ("OFAC") of the U.S. Department of the Treasury; (b) located in, incorporated in, or otherwise organized or established in, or resident of, any country, territory, or jurisdiction |
| pass | geo_feature=yes → 1: UA | Live: Circle's CCTP API refuses a visitor from Ukraine (HTTP 403 'Lockout'), so the CCTP route is refused | [iris-api.circle.com/v1/publicKeys](https://iris-api.circle.com/v1/publicKeys) from UA | status: 403 |

## Synapse
<a id="synapse"></a>

Rating **B**, restrictions **1**; mechanisms: screening.

Sweeps:

- App JS: 73 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:challenge BY:challenge CU:challenge SY:challenge VE:challenge MM:challenge AF:challenge IQ:challenge LB:error LY:challenge SS:challenge ZW:challenge NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge; RU: app challenge (HTTP 403 anti-bot challenge); BY: app challenge (HTTP 403 anti-bot challenge); CU: app challenge (HTTP 403 anti-bot challenge); SY: app challenge (HTTP 403 anti-bot challenge); VE: app challenge (HTTP 403 anti-bot challenge); MM: app challenge (HTTP 403 anti-bot challenge); AF: app challenge (HTTP 403 anti-bot challenge); IQ: app challenge (HTTP 403 anti-bot challenge); LY: app challenge (HTTP 403 anti-bot challenge); SS: app challenge (HTTP 403 anti-bot challenge); ZW: app challenge (HTTP 403 anti-bot challenge); NI: app challenge (HTTP 403 anti-bot challenge); CD: app challenge (HTTP 403 anti-bot challenge); CF: app challenge (HTTP 403 anti-bot challenge); SO: app challenge (HTTP 403 anti-bot challenge); ML: app challenge (HTTP 403 anti-bot challenge)
- Code: 3076 files; strong signals: screening/screening call in 15 file(s), e.g. `ScreenAddress` in https://github.com/synapsecns/sanguine/blob/7c8126288846909d65660c4018b042eb5a498d32/contrib/opbot/botmd/commands.go#L135
- Terms: 1 countries: US; clauses: vpn, screening, sanctions; compared with the site's Terms column: +US / −0
- API: 1 check(s)

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | screening=yes | The bridge UI screens the wallet with screener.omnirpc.io and flags it on risk (or on error) | [synapsecns/sanguine@7c81262:packages/synapse-interface/utils/screenAddress.ts#L23](https://github.com/synapsecns/sanguine/blob/7c8126288846909d65660c4018b042eb5a498d32/packages/synapse-interface/utils/screenAddress.ts#L23) | const url = `https://screener.omnirpc.io/fe/address/${address}` |
| pass | screening=yes | Production JS: screener.omnirpc.io call and the riskDetected event | [bridge.synapseprotocol.com](https://bridge.synapseprotocol.com) | https://bridge.synapseprotocol.com/_next/static/chunks/pages/_app-307869cea444642a.js: …pport</a>.`}}),l=e=>{let t=u(e);i.Z.dispatchEvent(t)},c=async e=>{let t=`https://screener.omnirpc.io/fe/address/ |
| pass | screening=yes | Synapse screener answers risk:true for the sanctioned wallet and risk:false for the control | [screener.omnirpc.io/fe/address/{address}](https://screener.omnirpc.io/fe/address/{address}) | sdn: status: 200 |

## Portal Bridge (Wormhole)
<a id="portalbridge"></a>

Rating **B**, restrictions **2**; mechanisms: geo_feature, screening.

Sweeps:

- App JS: 425 scripts; strong signals: geo/block text in 1 file(s), e.g. `not available in your region` in /_next/static/chunks/3w_9smreb-6br.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:error FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:challenge BY:challenge CU:challenge SY:challenge VE:challenge MM:challenge AF:ok IQ:challenge LB:error LY:challenge SS:error ZW:ok NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge; RU: app challenge (HTTP 403 anti-bot challenge); BY: app challenge (HTTP 403 anti-bot challenge); CU: app challenge (HTTP 403 anti-bot challenge); SY: app challenge (HTTP 403 anti-bot challenge); VE: app challenge (HTTP 403 anti-bot challenge); MM: app challenge (HTTP 403 anti-bot challenge); IQ: app challenge (HTTP 403 anti-bot challenge); LY: app challenge (HTTP 403 anti-bot challenge); NI: app challenge (HTTP 403 anti-bot challenge); CD: app challenge (HTTP 403 anti-bot challenge); CF: app challenge (HTTP 403 anti-bot challenge); SO: app challenge (HTTP 403 anti-bot challenge); ML: app challenge (HTTP 403 anti-bot challenge)
- Code: — no open repository
- Terms: 2 countries (via app JavaScript): US US-NY; clauses: screening, sanctions; compared with the site's Terms column: +US US-NY / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | screening=yes | Portal Bridge UI screens wallets with TRM Labs and blocks sanctioned risk (repository archived; the current site is closed source) | [XLabs/portal-bridge-ui@10744b9:apps/connect/src/providers/sanctions.ts#L13](https://github.com/XLabs/portal-bridge-ui/blob/10744b90e48444f8da054aaa9c07518fb9eaf997/apps/connect/src/providers/sanctions.ts#L13) | export const TRM_URL = |
| fail | screening=yes | Production JS of portalbridge.com: both wallets of a transfer are checked (checkWalletSanctions) before it starts | [portalbridge.com](https://portalbridge.com) | not found: checkWalletSanctions\)\(\w,\w\),\(0,\w\.checkWalletSanctions\) |
| pass | geo_feature=yes | Production JS: Fusion swap quotes can fail with GEO_BLOCKED ('Trading the selected tokens is not available in your region') | [portalbridge.com](https://portalbridge.com) | https://portalbridge.com/_next/static/chunks/3w_9smreb-6br.js: …han_native_balance:"Native balance must exceed the required gas reserve",geo_blocked:"Trading the selected tokens is not available in yo |

## Relay
<a id="relay"></a>

Rating **B**, restrictions **1**; mechanisms: screening.

Sweeps:

- App JS: error: direct: HTTP 429; proxy US: HTTP 429
- Live: RO:challenge US:challenge CA:challenge MX:challenge AR:challenge CO:challenge GB:challenge DE:challenge FR:challenge NL:challenge ES:challenge IT:challenge PL:challenge CH:challenge SE:challenge UA:challenge TR:challenge AE:challenge SA:challenge IL:challenge PK:challenge BD:challenge VN:challenge TH:challenge PH:challenge MY:challenge SG:challenge HK:challenge CN:challenge KR:challenge TW:challenge AU:challenge NG:challenge ZA:challenge KE:error KZ:challenge GE:challenge US-NY:challenge CA-ON:challenge RU:error BY:challenge CU:unknown SY:challenge VE:challenge MM:challenge AF:challenge IQ:challenge LB:error LY:challenge SS:error ZW:challenge NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge; direct: app challenge (HTTP 429 anti-bot challenge); US: app challenge (HTTP 429 anti-bot challenge); CA: app challenge (HTTP 429 anti-bot challenge); MX: app challenge (HTTP 429 anti-bot challenge); AR: app challenge (HTTP 429 anti-bot challenge); CO: app challenge (HTTP 429 anti-bot challenge); GB: app challenge (HTTP 429 anti-bot challenge); DE: app challenge (HTTP 429 anti-bot challenge); FR: app challenge (HTTP 429 anti-bot challenge); NL: app challenge (HTTP 429 anti-bot challenge); ES: app challenge (HTTP 429 anti-bot challenge); IT: app challenge (HTTP 429 anti-bot challenge); PL: app challenge (HTTP 429 anti-bot challenge); CH: app challenge (HTTP 429 anti-bot challenge); SE: app challenge (HTTP 429 anti-bot challenge); UA: app challenge (HTTP 429 anti-bot challenge); TR: app challenge (HTTP 429 anti-bot challenge); AE: app challenge (HTTP 429 anti-bot challenge); SA: app challenge (HTTP 429 anti-bot challenge); IL: app challenge (HTTP 429 anti-bot challenge); PK: app challenge (HTTP 429 anti-bot challenge); BD: app challenge (HTTP 429 anti-bot challenge); VN: app challenge (HTTP 429 anti-bot challenge); TH: app challenge (HTTP 429 anti-bot challenge); PH: app challenge (HTTP 429 anti-bot challenge); MY: app challenge (HTTP 429 anti-bot challenge); SG: app challenge (HTTP 429 anti-bot challenge); HK: app challenge (HTTP 429 anti-bot challenge); CN: app challenge (HTTP 429 anti-bot challenge); KR: app challenge (HTTP 429 anti-bot challenge); TW: app challenge (HTTP 429 anti-bot challenge); AU: app challenge (HTTP 429 anti-bot challenge); NG: app challenge (HTTP 429 anti-bot challenge); ZA: app challenge (HTTP 429 anti-bot challenge); KZ: app challenge (HTTP 429 anti-bot challenge); GE: app challenge (HTTP 429 anti-bot challenge); US-NY: app challenge (HTTP 429 anti-bot challenge); CA-ON: app challenge (HTTP 429 anti-bot challenge); BY: app challenge (HTTP 429 anti-bot challenge); SY: app challenge (HTTP 429 anti-bot challenge); VE: app challenge (HTTP 429 anti-bot challenge); MM: app challenge (HTTP 429 anti-bot challenge); AF: app challenge (HTTP 429 anti-bot challenge); IQ: app challenge (HTTP 429 anti-bot challenge); LY: app challenge (HTTP 429 anti-bot challenge); ZW: app challenge (HTTP 429 anti-bot challenge); NI: app challenge (HTTP 429 anti-bot challenge); CD: app challenge (HTTP 429 anti-bot challenge); CF: app challenge (HTTP 429 anti-bot challenge); SO: app challenge (HTTP 429 anti-bot challenge); ML: app challenge (HTTP 429 anti-bot challenge)
- Code: — no open repository
- Terms: — no Terms published
- API: 1 check(s)

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | screening=yes | Relay compliance docs: sanctions screening with Chainalysis, HackBounty and Hermod | [docs.relay.link/security/compliance](https://docs.relay.link/security/compliance) | Third-party data — Risk and sanctions databases, including HackBounty and Chainalysis, identify flagged addresses. |
| pass | screening=yes | Relay's public endpoint /sanctioned/{address} answers sanctioned:true for the SDN wallet and false for the control | [api.relay.link/sanctioned/{address}](https://api.relay.link/sanctioned/{address}) | sdn: status: 200 |

## Polymarket
<a id="polymarket"></a>

Rating **D**, restrictions **50** (50 countries/regions: AR AU BE BI BR BY CA CA-AB CA-BC CA-ON CA-QC CD CF CU DE ET FR GB IE IQ IR IT JP KP KR LB LY MM MT NI NL NZ PL RU SD SG SK SO SS SY TH TW UA-Crimea UA-DPR UA-LPR UM US VE YE ZW).

Sweeps:

- App JS: 101 scripts; strong signals: geo/geo endpoint in 1 file(s), e.g. `/api/geo` in /_next/static/immutable/chunks/2kebnbwue623q.js; geo/block text in 1 file(s), e.g. `not available in your region` in / (HTML and inline scripts)
- Live: RO:blocked US:ok CA:ok MX:ok AR:ok CO:error GB:ok DE:ok FR:ok NL:ok ES:error IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:error SA:error IL:ok PK:ok BD:ok VN:error TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:blocked TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:error CU:blocked SY:blocked VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:error ML:ok; direct: app blocked (empty page (1696 bytes) from server 'nginx/1.8.0' while other vantages get the app from 'cloudflare': blocked before the app (internet provider, regulator, CDN or web server)); US: /api/geoblock blocked {"blocked": true, "country": "US", "region": "NJ"}; CA: /api/geoblock blocked {"blocked": true, "country": "CA", "region": "ON"}; AR: /api/geoblock blocked {"blocked": true, "country": "AR", "region": "M"}; GB: /api/geoblock blocked {"blocked": true, "country": "GB", "region": "ENG"}; DE: /api/geoblock blocked {"blocked": true, "country": "DE", "region": "NW"}; FR: /api/geoblock blocked {"blocked": true, "country": "FR", "region": "ARA"}; NL: /api/geoblock blocked {"blocked": true, "country": "NL", "region": "GE"}; IT: /api/geoblock blocked {"blocked": true, "country": "IT", "region": "62"}; PL: /api/geoblock blocked {"blocked": true, "country": "PL", "region": "06"}; TH: /api/geoblock blocked {"blocked": true, "country": "TH", "region": "10"}; SG: /api/geoblock blocked {"blocked": true, "country": "SG", "region": ""}; KR: app blocked (HTTP 451); KR: /api/geoblock blocked {}; TW: /api/geoblock blocked {"blocked": true, "country": "TW", "region": "04"}; AU: /api/geoblock blocked {"blocked": true, "country": "AU", "region": "VIC"}; US-NY: /api/geoblock blocked {"blocked": true, "country": "US", "region": "NY"}; CA-ON: /api/geoblock blocked {"blocked": true, "country": "CA", "region": "ON"}; RU: /api/geoblock blocked {"blocked": true, "country": "RU", "region": "OMS"}; CU: app blocked (HTTP 403 with geo wording); SY: app blocked (HTTP 403 with geo wording); VE: /api/geoblock blocked {"blocked": true, "country": "VE", "region": "R"}; MM: /api/geoblock blocked {"blocked": true, "country": "MM", "region": "18"}; IQ: /api/geoblock blocked {"blocked": true, "country": "IQ", "region": "AR"}; LY: /api/geoblock blocked {"blocked": true, "country": "LY", "region": "TB"}; SS: /api/geoblock blocked {"blocked": true, "country": "SS", "region": "EC"}; ZW: /api/geoblock blocked {"blocked": true, "country": "ZW", "region": "HA"}; NI: /api/geoblock blocked {"blocked": true, "country": "NI", "region": "MN"}; CD: /api/geoblock blocked {"blocked": true, "country": "CD", "region": "KN"}; CF: /api/geoblock blocked {"blocked": true, "country": "CF", "region": "BGF"}
- Code: — no open repository
- Terms: 31 countries (via proxy US): US CA-AB AU BE CA-BC FR DE HU IE IT CA-ON PL CA-QC RU SG SK SI TW TH NL NZ GB PA IR SY CU KP UA-Crimea UA-DPR UA-LPR UA; clauses: geofencing, vpn, sanctions; compared with the site's Terms column: +HU PA SI UA / −BI BR BY CD CF ET IQ JP LB LY MM MT NI SD SO SS UM VE YE ZW
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=yes | Polymarket docs: orders from blocked regions are rejected; the verdict comes from GET polymarket.com/api/geoblock | [docs.polymarket.com/developers/CLOB/geoblock](https://docs.polymarket.com/developers/CLOB/geoblock) | Orders submitted from blocked regions will be rejected. Implement geoblock checks |
| pass | geo_site=yes → 40: AU BE BY BR BI CF CD CU DE ET FR GB IE IR IQ IT JP KP LB LY MM MT NI NL NZ PL RU SG SK SO SS SD SY TW TH UM US VE YE ZW | Help center: countries completely restricted from accessing Polymarket | [help.polymarket.com/en/articles/13364163-geographic-restrictions](https://help.polymarket.com/en/articles/13364163-geographic-restrictions) | The following 39 countries are completely restricted from accessing Polymarket: |
| pass | geo_site=yes → 7: CA-AB CA-BC CA-ON CA-QC UA-Crimea UA-DPR UA-LPR | Help center: restricted regions inside otherwise accessible countries (Canadian provinces, occupied Ukrainian regions) | [help.polymarket.com/en/articles/13364163-geographic-restrictions](https://help.polymarket.com/en/articles/13364163-geographic-restrictions) | In addition to fully blocked countries, the following specific regions within otherwise accessible countries are also restricted: |
| pass | geo_site.close_only=yes → 4: SG PL TH TW | Help center: close-only countries, where users can close existing positions but cannot open new ones | [help.polymarket.com/en/articles/13364163-geographic-restrictions](https://help.polymarket.com/en/articles/13364163-geographic-restrictions) | Some countries have a “close-only” restriction status. Users in these countries can: |
| pass | vpn=tos_only | Help center: using a VPN to bypass the restrictions violates the Terms (no detection mechanism documented) | [help.polymarket.com/en/articles/13364163-geographic-restrictions](https://help.polymarket.com/en/articles/13364163-geographic-restrictions) | …omprehensive list of all geographically restricted locations. Polymarket strictly prohibits the use of VPNs or similar tools to bypass geographic restrictions. Such actions are considered violations  |
| pass | geo_site=yes → 1: US | Live: /api/geoblock answers blocked=true to a visitor from the US | [polymarket.com/api/geoblock](https://polymarket.com/api/geoblock) from US | body: {"blocked":true,"ip":"74.105.216.243","country":"US","region":"NJ"} |
| recorded | geo_site=yes → 3: AR CA KR | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | AR: geo_endpoint https://polymarket.com/api/geoblock → HTTP 200 blocked (residential, 2026-10-28); CA: geo_endpoint https://polymarket.com/api/geoblock → HTTP 200 blocked (residential, 2026-10-28); KR |

## Safe{Wallet}
<a id="safe"></a>

Rating **B**, restrictions **5** (3 countries/regions: BY CU RU); mechanisms: geo_feature, screening.

Sweeps:

- App JS: 287 scripts; strong signals: geo/block text in 1 file(s), e.g. `Access Restricted` in /_next/static/chunks/pages/403-d5c808f1aecac516.js; screening/sanctions oracle in 1 file(s), e.g. `isSanctioned(` in /_next/static/chunks/pages/_app-a5e812eff6b3ea79.js; screening/screening vendor in 2 file(s), e.g. `hypernative.xyz` in /_next/static/chunks/pages/_app-a5e812eff6b3ea79.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:error ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: 4279 files; strong signals: geo/block text in 1 file(s), e.g. `Access Restricted` in https://github.com/safe-global/safe-wallet-monorepo/blob/967145775447eb0375f018ab65d65a15af889412/apps/web/src/pages/403.tsx#L12; screening/sanctions oracle in 2 file(s), e.g. `isSanctioned(` in https://github.com/safe-global/safe-wallet-monorepo/blob/967145775447eb0375f018ab65d65a15af889412/apps/web/src/components/wrappers/SanctionWrapper/index.tsx#L28; screening/screening vendor in 4 file(s), e.g. `hypernative.xyz` in https://github.com/safe-global/safe-wallet-monorepo/blob/967145775447eb0375f018ab65d65a15af889412/apps/web/src/features/hypernative/config/oauth.ts#L18
- Terms: 0 countries: ; clauses: sanctions
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_feature=yes | HEAD /swap returns 403 for OFAC-sanctioned countries; the app then hides swap, stake and earn | [safe-global/safe-wallet-monorepo@9671457:apps/web/src/components/common/GeoblockingProv…](https://github.com/safe-global/safe-wallet-monorepo/blob/967145775447eb0375f018ab65d65a15af889412/apps/web/src/components/common/GeoblockingProvider/index.tsx#L8) | const res = await fetch(AppRoutes.swap, { method: 'HEAD' }) |
| pass | screening=yes | Chainalysis Sanctions Oracle contract used for the wallet check | [safe-global/safe-wallet-monorepo@9671457:apps/web/src/config/constants.ts#L145](https://github.com/safe-global/safe-wallet-monorepo/blob/967145775447eb0375f018ab65d65a15af889412/apps/web/src/config/constants.ts#L145) | export const CHAINALYSIS_OFAC_CONTRACT = '0x40c57923924b5c5c5455c48d93317139addac8fb' |
| pass | screening=yes | useSanctionedAddress() checks both the connected wallet and the Safe account | [safe-global/safe-wallet-monorepo@9671457:apps/web/src/hooks/useSanctionedAddress.ts#L15](https://github.com/safe-global/safe-wallet-monorepo/blob/967145775447eb0375f018ab65d65a15af889412/apps/web/src/hooks/useSanctionedAddress.ts#L15) | const { data: isWalletSanctioned } = useGetIsSanctionedQuery(isRestricted && wallet ? wallet.address : skipToken) |
| pass | screening=yes | Production JS: Chainalysis oracle address, isSanctioned ABI and the 'Blocked address' screen | [app.safe.global](https://app.safe.global) | https://app.safe.global/_next/static/chunks/pages/_app-a5e812eff6b3ea79.js: …afedev\.eth\.limo/,ef="Safe{Wallet}";s.env.NEXT_PUBLIC_BRAND_LOGO;let es="0x40c57923924b5c5c5455c48d93317139addac8fb",eo="h |
| recorded | geo_site=yes → 3: BY RU CU | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | BY: api https://safe-client.safe.global/v1/chains?limit=1 → HTTP 403 blocked (residential, 2026-10-28); RU: api https://safe-client.safe.global/v1/chains?limit=1 → HTTP 403 blocked (residential, 2026- |

## ENS
<a id="ens"></a>

Rating **A**, restrictions **0**.

Sweeps:

- App JS: 232 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: 678 files; no strong signals
- Terms: 0 countries: ; clauses: sanctions
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=no | No geo-IP lookup or country block in the ENS app | [ensdomains/ens-app-v3@67b9174:/](https://github.com/ensdomains/ens-app-v3/tree/67b917459591440b637ea5f315eabc4229473506) |  |
| pass | screening=no | No wallet-screening call or sanctions list in the ENS app | [ensdomains/ens-app-v3@67b9174:/](https://github.com/ensdomains/ens-app-v3/tree/67b917459591440b637ea5f315eabc4229473506) |  |
| pass | geo_site=no | Production JS of ENS: no geo-IP lookup or country block | [app.ens.domains](https://app.ens.domains) |  |
| pass | screening=no | Production JS of ENS: no wallet-screening call or sanctions oracle | [app.ens.domains](https://app.ens.domains) |  |

## ENS Legacy Manager
<a id="ens-legacy"></a>

Rating **A**, restrictions **0**.

Sweeps:

- App JS: 232 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: 250 files; no strong signals
- Terms: 0 countries: ; clauses: sanctions
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=no | No geo-IP lookup or country block in the legacy ENS app | [ensdomains/ens-app@1cc872b:/](https://github.com/ensdomains/ens-app/tree/1cc872b5738e811fc416e8fc6ca3671e3cc4454b) |  |
| pass | screening=no | No wallet-screening call or sanctions list in the legacy ENS app | [ensdomains/ens-app@1cc872b:/](https://github.com/ensdomains/ens-app/tree/1cc872b5738e811fc416e8fc6ca3671e3cc4454b) |  |
| pass | geo_site=no | Production JS of ENS (legacy): no geo-IP lookup or country block | [legacy.ens.domains](https://legacy.ens.domains) |  |
| pass | screening=no | Production JS of ENS (legacy): no wallet-screening call or sanctions oracle | [legacy.ens.domains](https://legacy.ens.domains) |  |

## Snapshot
<a id="snapshot"></a>

Rating **A**, restrictions **0**.

Sweeps:

- App JS: 1105 scripts; no strong signals
- Live: RO:ok US:error CA:error MX:error AR:error CO:error GB:error DE:error FR:error NL:error ES:error IT:error PL:error CH:error SE:error UA:error TR:error AE:error SA:error IL:error PK:error BD:error VN:error TH:error PH:error MY:error SG:error HK:error CN:error KR:error TW:error AU:error NG:error ZA:error KE:error KZ:error GE:error US-NY:error CA-ON:error RU:error BY:error CU:error SY:error VE:error MM:error AF:error IQ:error LB:error LY:error SS:error ZW:error NI:error CD:error CF:error SO:error ML:error
- Code: 838 files; no strong signals
- Terms: 22 countries (via repository): BY BI CF CG KP GN GW IR IQ LB LY ML MM SS RU SO SD SY UA VE YE ZW; clauses: geofencing, sanctions
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=tos_only | The Terms list SECO-embargoed countries and only reserve the right to restrict access by location | [snapshot-labs/sx-monorepo@9790f73:apps/ui/src/views/Terms.vue#L13](https://github.com/snapshot-labs/sx-monorepo/blob/9790f736a6cff474c710fb7bb7b51f0bbf8d6fef/apps/ui/src/views/Terms.vue#L13) | ## 1. Eligibility and prohibited jurisdictions |
| pass | geo_site=no | No geo-IP lookup or country block in the Snapshot UI (apps/ui) | [snapshot-labs/sx-monorepo@9790f73:apps/ui](https://github.com/snapshot-labs/sx-monorepo/tree/9790f736a6cff474c710fb7bb7b51f0bbf8d6fef/apps/ui) |  |
| pass | screening=no | No wallet-screening call or sanctions list in the Snapshot UI (apps/ui) | [snapshot-labs/sx-monorepo@9790f73:apps/ui](https://github.com/snapshot-labs/sx-monorepo/tree/9790f736a6cff474c710fb7bb7b51f0bbf8d6fef/apps/ui) |  |
| pass | geo_site=no | Production JS of Snapshot: no geo-IP lookup or country block (the Sequence wallet SDK, whose API client has a GeoblockedError class, is not counted) | [snapshot.box](https://snapshot.box) |  |
| pass | screening=no | Production JS of Snapshot: no wallet-screening call or sanctions oracle | [snapshot.box](https://snapshot.box) |  |

## Ondo Finance
<a id="ondo"></a>

Rating **D**, restrictions **21** (19 countries/regions: AF BY CA CU IR KP LY MM RU SD SO SS SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia US); mechanisms: geo_feature, kyc.

Sweeps:

- App JS: 64 scripts; strong signals: geo/geo-IP service in 1 file(s), e.g. `ip-api.com` in /_next/static/chunks/4818-6bd1d66d3d7959b2.js; geo/block text in 1 file(s), e.g. `Access Restricted` in / (HTML and inline scripts)
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:error IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: — no open repository
- Terms: 20 countries: AF BY CA UA-Crimea UA-DPR UA-LPR UA-Kherson UA-Zaporizhzhia UA CU KP IR LY MM RU SO SS SD SY US; clauses: sanctions, us_persons, kyc; compared with the site's Terms column: +UA / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_feature=yes → 19: AF BY CA UA-Crimea UA-DPR UA-LPR UA-Kherson UA-Zaporizhzhia CU KP IR LY MM RU SO SS SD SY US | USDY eligibility: persons in the listed jurisdictions (and US persons) may not subscribe, acquire or redeem | [docs.ondo.finance/general-access-products/usdy/eligibility](https://docs.ondo.finance/general-access-products/usdy/eligibility) | …e of business in, any jurisdiction listed below ( “Prohibited Persons” ) are prohibited from subscribing for, acquiring or redeeming USDY tokens: Afghanistan Belarus Canada Crimea, Donetsk People’s R |
| pass | kyc=yes | Ondo onboarding: KYC/KYB via Persona; linked wallets are reviewed and approved by Ondo | [docs.ondo.finance/ondo-stocks/onboarding-and-kyc](https://docs.ondo.finance/ondo-stocks/onboarding-and-kyc) | Ondo Stocks conducts KYC/KYB verification via Persona , our identity and KYC compliance provider. Follow the onboarding prompts to guide you through: |

## Maple Finance
<a id="maple"></a>

Rating **A**, restrictions **0**.

Sweeps:

- App JS: error: direct: HTTP 403; proxy US: HTTP 403
- Live: RO:challenge US:challenge CA:challenge MX:challenge AR:challenge CO:challenge GB:challenge DE:challenge FR:challenge NL:challenge ES:challenge IT:challenge PL:challenge CH:challenge SE:challenge UA:challenge TR:challenge AE:challenge SA:challenge IL:challenge PK:challenge BD:challenge VN:challenge TH:challenge PH:challenge MY:challenge SG:challenge HK:challenge CN:challenge KR:challenge TW:challenge AU:challenge NG:challenge ZA:challenge KE:challenge KZ:challenge GE:challenge US-NY:challenge CA-ON:challenge RU:challenge BY:challenge CU:challenge SY:challenge VE:challenge MM:challenge AF:challenge IQ:challenge LB:challenge LY:challenge SS:challenge ZW:challenge NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge; direct: app challenge (HTTP 403 anti-bot challenge); US: app challenge (HTTP 403 anti-bot challenge); CA: app challenge (HTTP 403 anti-bot challenge); MX: app challenge (HTTP 403 anti-bot challenge); AR: app challenge (HTTP 403 anti-bot challenge); CO: app challenge (HTTP 403 anti-bot challenge); GB: app challenge (HTTP 403 anti-bot challenge); DE: app challenge (HTTP 403 anti-bot challenge); FR: app challenge (HTTP 403 anti-bot challenge); NL: app challenge (HTTP 403 anti-bot challenge); ES: app challenge (HTTP 403 anti-bot challenge); IT: app challenge (HTTP 403 anti-bot challenge); PL: app challenge (HTTP 403 anti-bot challenge); CH: app challenge (HTTP 403 anti-bot challenge); SE: app challenge (HTTP 403 anti-bot challenge); UA: app challenge (HTTP 403 anti-bot challenge); TR: app challenge (HTTP 403 anti-bot challenge); AE: app challenge (HTTP 403 anti-bot challenge); SA: app challenge (HTTP 403 anti-bot challenge); IL: app challenge (HTTP 403 anti-bot challenge); PK: app challenge (HTTP 403 anti-bot challenge); BD: app challenge (HTTP 403 anti-bot challenge); VN: app challenge (HTTP 403 anti-bot challenge); TH: app challenge (HTTP 403 anti-bot challenge); PH: app challenge (HTTP 403 anti-bot challenge); MY: app challenge (HTTP 403 anti-bot challenge); SG: app challenge (HTTP 403 anti-bot challenge); HK: app challenge (HTTP 403 anti-bot challenge); CN: app challenge (HTTP 403 anti-bot challenge); KR: app challenge (HTTP 403 anti-bot challenge); TW: app challenge (HTTP 403 anti-bot challenge); AU: app challenge (HTTP 403 anti-bot challenge); NG: app challenge (HTTP 403 anti-bot challenge); ZA: app challenge (HTTP 403 anti-bot challenge); KE: app challenge (HTTP 403 anti-bot challenge); KZ: app challenge (HTTP 403 anti-bot challenge); GE: app challenge (HTTP 403 anti-bot challenge); US-NY: app challenge (HTTP 403 anti-bot challenge); CA-ON: app challenge (HTTP 403 anti-bot challenge); RU: app challenge (HTTP 403 anti-bot challenge); BY: app challenge (HTTP 403 anti-bot challenge); CU: app challenge (HTTP 403 anti-bot challenge); SY: app challenge (HTTP 403 anti-bot challenge); VE: app challenge (HTTP 403 anti-bot challenge); MM: app challenge (HTTP 403 anti-bot challenge); AF: app challenge (HTTP 403 anti-bot challenge); IQ: app challenge (HTTP 403 anti-bot challenge); LB: app challenge (HTTP 403 anti-bot challenge); LY: app challenge (HTTP 403 anti-bot challenge); SS: app challenge (HTTP 403 anti-bot challenge); ZW: app challenge (HTTP 403 anti-bot challenge); NI: app challenge (HTTP 403 anti-bot challenge); CD: app challenge (HTTP 403 anti-bot challenge); CF: app challenge (HTTP 403 anti-bot challenge); SO: app challenge (HTTP 403 anti-bot challenge); ML: app challenge (HTTP 403 anti-bot challenge)
- Code: — no open repository
- Terms: 36 countries: US GB GE-Abkhazia AF AO AU BY BI CF CG CU UA-Crimea ET GW IR CI LB LR LY ML MM NI KP CY-North RU SO GE-SouthOssetia SS SD SY UA UA-DPR UA-LPR VE YE ZW; clauses: geofencing, sanctions, kyc; compared with the site's Terms column: +GB UA / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=tos_only | The Interface Terms allow IP-based geofencing of Prohibited Persons (not verified live) | [docs.maple.finance/legal/interface-terms-of-use-syrupusdc-and-syrupusdt](https://docs.maple.finance/legal/interface-terms-of-use-syrupusdc-and-syrupusdt) | …r (e) owned or controlled by such persons or entities listed in (a)-(d). The Company may utilize certain tools, such as IP-based geofencing, to enforce the above restrictions. By using the Services a |

## Centrifuge
<a id="centrifuge"></a>

Rating **B**, restrictions **2**; mechanisms: geo_feature, kyc.

Sweeps:

- App JS: error: direct: HTTP 403; proxy US: HTTP 403
- Live: RO:challenge US:challenge CA:challenge MX:challenge AR:challenge CO:challenge GB:challenge DE:error FR:challenge NL:challenge ES:challenge IT:challenge PL:challenge CH:challenge SE:challenge UA:challenge TR:challenge AE:challenge SA:challenge IL:challenge PK:challenge BD:challenge VN:challenge TH:challenge PH:challenge MY:challenge SG:challenge HK:challenge CN:challenge KR:challenge TW:challenge AU:challenge NG:challenge ZA:challenge KE:challenge KZ:challenge GE:challenge US-NY:challenge CA-ON:challenge RU:challenge BY:challenge CU:challenge SY:challenge VE:challenge MM:challenge AF:challenge IQ:challenge LB:challenge LY:challenge SS:challenge ZW:challenge NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge; direct: app challenge (HTTP 403 anti-bot challenge); US: app challenge (HTTP 403 anti-bot challenge); CA: app challenge (HTTP 403 anti-bot challenge); MX: app challenge (HTTP 403 anti-bot challenge); AR: app challenge (HTTP 403 anti-bot challenge); CO: app challenge (HTTP 403 anti-bot challenge); GB: app challenge (HTTP 403 anti-bot challenge); FR: app challenge (HTTP 403 anti-bot challenge); NL: app challenge (HTTP 403 anti-bot challenge); ES: app challenge (HTTP 403 anti-bot challenge); IT: app challenge (HTTP 403 anti-bot challenge); PL: app challenge (HTTP 403 anti-bot challenge); CH: app challenge (HTTP 403 anti-bot challenge); SE: app challenge (HTTP 403 anti-bot challenge); UA: app challenge (HTTP 403 anti-bot challenge); TR: app challenge (HTTP 403 anti-bot challenge); AE: app challenge (HTTP 403 anti-bot challenge); SA: app challenge (HTTP 403 anti-bot challenge); IL: app challenge (HTTP 403 anti-bot challenge); PK: app challenge (HTTP 403 anti-bot challenge); BD: app challenge (HTTP 403 anti-bot challenge); VN: app challenge (HTTP 403 anti-bot challenge); TH: app challenge (HTTP 403 anti-bot challenge); PH: app challenge (HTTP 403 anti-bot challenge); MY: app challenge (HTTP 403 anti-bot challenge); SG: app challenge (HTTP 403 anti-bot challenge); HK: app challenge (HTTP 403 anti-bot challenge); CN: app challenge (HTTP 403 anti-bot challenge); KR: app challenge (HTTP 403 anti-bot challenge); TW: app challenge (HTTP 403 anti-bot challenge); AU: app challenge (HTTP 403 anti-bot challenge); NG: app challenge (HTTP 403 anti-bot challenge); ZA: app challenge (HTTP 403 anti-bot challenge); KE: app challenge (HTTP 403 anti-bot challenge); KZ: app challenge (HTTP 403 anti-bot challenge); GE: app challenge (HTTP 403 anti-bot challenge); US-NY: app challenge (HTTP 403 anti-bot challenge); CA-ON: app challenge (HTTP 403 anti-bot challenge); RU: app challenge (HTTP 403 anti-bot challenge); BY: app challenge (HTTP 403 anti-bot challenge); CU: app challenge (HTTP 403 anti-bot challenge); SY: app challenge (HTTP 403 anti-bot challenge); VE: app challenge (HTTP 403 anti-bot challenge); MM: app challenge (HTTP 403 anti-bot challenge); AF: app challenge (HTTP 403 anti-bot challenge); IQ: app challenge (HTTP 403 anti-bot challenge); LB: app challenge (HTTP 403 anti-bot challenge); LY: app challenge (HTTP 403 anti-bot challenge); SS: app challenge (HTTP 403 anti-bot challenge); ZW: app challenge (HTTP 403 anti-bot challenge); NI: app challenge (HTTP 403 anti-bot challenge); CD: app challenge (HTTP 403 anti-bot challenge); CF: app challenge (HTTP 403 anti-bot challenge); SO: app challenge (HTTP 403 anti-bot challenge); ML: app challenge (HTTP 403 anti-bot challenge)
- Code: 653 files; no strong signals
- Terms: 0 countries (via archive): ; clauses: none
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_feature=yes | Centrifuge docs: pools may require jurisdictional restrictions before investment (set per pool) | [docs.centrifuge.io/user/investor/](https://docs.centrifuge.io/user/investor/) | Some pools require whitelisting before investment or redemption. This may include: |
| pass | kyc=yes | Centrifuge docs: pool whitelisting includes KYC/AML verification and wallet pre-approval | [docs.centrifuge.io/user/investor/](https://docs.centrifuge.io/user/investor/) | KYC/AML verification |

## Superstate
<a id="superstate"></a>

Rating **C**, restrictions **10** (8 countries/regions: AF BY CU LB MM RU SY VE); mechanisms: geo_feature, kyc.

Sweeps:

- App JS: 700 scripts; strong signals: geo/block text in 1 file(s), e.g. `Access restricted` in /_app/immutable/chunks/C8-NFc28.js; kyc/KYC vendor in 1 file(s), e.g. `withpersona.com` in /_app/immutable/nodes/65.CJ-qT5-H.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:blocked BY:blocked CU:blocked SY:blocked VE:blocked MM:blocked AF:blocked IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok; RU: app blocked (HTTP 403 with geo wording); BY: app blocked (HTTP 403 with geo wording); CU: app blocked (HTTP 403 with geo wording); SY: app blocked (HTTP 403 with geo wording); VE: app blocked (HTTP 403 with geo wording); MM: app blocked (HTTP 403 with geo wording); AF: app blocked (HTTP 403 with geo wording)
- Code: — no open repository
- Terms: 1 countries (via app JavaScript): US; clauses: us_persons, kyc; compared with the site's Terms column: +US / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_feature=yes | Superstate docs: funds only for Qualified Purchasers in supported countries; equities only in supported countries | [docs.superstate.com/introduction-to-superstate/onboarding](https://docs.superstate.com/introduction-to-superstate/onboarding) | Superstate Funds: Only available to Qualified Purchasers in supported countries with at least $5m in investable assets for individuals, or $25m for institutions. |
| pass | kyc=yes | Superstate docs: required investor application to verify eligibility, and an allowlist of wallets authorized to hold the tokens | [docs.superstate.com/introduction-to-superstate/onboarding](https://docs.superstate.com/introduction-to-superstate/onboarding) | …tor Portal and you'll be prompted to complete two types of applications: Investing Entity Application (required) : This application collects information about you as an individual investor or your en |
| recorded | geo_site=yes → 8: BY RU SY VE CU MM AF LB | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | BY: site https://superstate.com → HTTP 403 blocked (residential, 2026-10-28); RU: site https://superstate.com → HTTP 403 blocked (residential, 2026-10-28); SY: site https://superstate.com → HTTP 403 b |

## Symbiotic
<a id="symbiotic"></a>

Rating **C**, restrictions **6** (6 countries/regions: CA CU IR KP SY UA).

Sweeps:

- App JS: 163 scripts; strong signals: geo/geo-IP service in 1 file(s), e.g. `/cdn-cgi/trace` in /assets/root-BHcYIKfd.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: — no open repository
- Terms: — no Terms published
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=yes → 6: CU IR KP SY UA CA | Production JS: the country from cloudflare.com/cdn-cgi/trace is compared with a list; listed countries get the UNSUPPORTED REGION modal | [app.symbiotic.fi](https://app.symbiotic.fi) | https://app.symbiotic.fi/assets/root-BHcYIKfd.js: …}/terms_of_use.pdf`});if((0,K.useEffect)(()=>{(async()=>{try{let e=await fetch(`https://www.cloudflare.com/cdn-cgi/trace`);if(!e.ok)throw Error(`HTTP |

## Kelp DAO
<a id="kelp"></a>

Rating **C**, restrictions **12** (11 countries/regions: BY CA CD CU GB LY MM SY US VE ZW); mechanisms: geo_feature.

**To review** (found by the sweeps, not explained by the published data):

- live: https://universe.kelpdao.xyz/rseth/geoData answers blocked to IQ {"isRestricted": true, "country": "Iraq", "countryCode": "IQ", "region": "Erbil Governorate"}, but the site does not count IQ
- live: https://universe.kelpdao.xyz/rseth/geoData answers blocked to SO {"isRestricted": true, "country": "Somalia", "countryCode": "SO", "region": "Banaadir"}, but the site does not count SO

Sweeps:

- App JS: 45 scripts; strong signals: geo/block text in 1 file(s), e.g. `Not available in your region` in /kelp/_next/static/chunks/pages/blocked-5914f5825653c380.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok; US: /rseth/geoData blocked {"isRestricted": true, "country": "United States", "countryCode": "US", "region": "New Jersey"}; CA: /rseth/geoData blocked {"isRestricted": true, "country": "Canada", "countryCode": "CA", "region": "Ontario"}; GB: /rseth/geoData blocked {"isRestricted": true, "country": "United Kingdom", "countryCode": "GB", "region": "England"}; US-NY: /rseth/geoData blocked {"isRestricted": true, "country": "United States", "countryCode": "US", "region": "New York"}; CA-ON: /rseth/geoData blocked {"isRestricted": true, "country": "Canada", "countryCode": "CA", "region": "Ontario"}; BY: /rseth/geoData blocked {"isRestricted": true, "country": "Belarus", "countryCode": "BY", "region": "Vitebsk"}; CU: /rseth/geoData blocked {"isRestricted": true, "country": "Cuba", "countryCode": "CU", "region": "Havana"}; SY: /rseth/geoData blocked {"isRestricted": true, "country": "Syria", "countryCode": "SY", "region": "Dimashq"}; VE: /rseth/geoData blocked {"isRestricted": true, "country": "Venezuela", "countryCode": "VE", "region": "Carabobo"}; MM: /rseth/geoData blocked {"isRestricted": true, "country": "Myanmar", "countryCode": "MM", "region": "Nay Pyi Taw"}; IQ: /rseth/geoData blocked {"isRestricted": true, "country": "Iraq", "countryCode": "IQ", "region": "Erbil Governorate"}; LY: /rseth/geoData blocked {"isRestricted": true, "country": "Libya", "countryCode": "LY", "region": "Tripoli"}; ZW: /rseth/geoData blocked {"isRestricted": true, "country": "Zimbabwe", "countryCode": "ZW", "region": "Harare"}; CD: /rseth/geoData blocked {"isRestricted": true, "country": "Congo (DRC)", "countryCode": "CD", "region": "Kinshasa City"}; SO: /rseth/geoData blocked {"isRestricted": true, "country": "Somalia", "countryCode": "SO", "region": "Banaadir"}
- Code: — no open repository
- Terms: 0 countries: ; clauses: sanctions, kyc
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_feature=yes | Production JS: Gain vault pages ask universe.kelpdao.xyz/rseth/geoData and redirect to /blocked when isRestricted | [kerneldao.com/kelp](https://kerneldao.com/kelp) | https://kerneldao.com/kelp/_next/static/chunks/pages/_app-e9e943a2afdef35e.js: …-8 xl:!px-20 mb-10",children:t})]})})})},i9=A(78132),oe=A(96463);let ot=["/gain/growth-vault/","/gain/airdrop-gain/","/g |
| pass | screening=tos_only | Users represent they are not sanctioned (OFAC, UN, EU, UK, HKMA, MAS); no screening mechanism verified | [kerneldao.com/kelp/terms-of-service/](https://kerneldao.com/kelp/terms-of-service/) | Hong Kong Monetary Authority or the Monetary Authority of Singapore |
| pass | geo_feature=yes → 1: US | Live: Kelp's geoData API answers isRestricted:true to a visitor from the US | [universe.kelpdao.xyz/rseth/geoData](https://universe.kelpdao.xyz/rseth/geoData) from US | body: {"isRestricted":true,"region":"New Jersey","countryCode":"US","country":"United States"} |
| pass | geo_feature=yes → 1: GB | Live: Kelp's geoData API answers isRestricted:true to a visitor from the UK | [universe.kelpdao.xyz/rseth/geoData](https://universe.kelpdao.xyz/rseth/geoData) from GB | body: {"isRestricted":true,"region":"England","countryCode":"GB","country":"United Kingdom"} |
| pass | geo_feature=yes → 1: CA | Live: Kelp's geoData API answers isRestricted:true to a visitor from Canada | [universe.kelpdao.xyz/rseth/geoData](https://universe.kelpdao.xyz/rseth/geoData) from CA | body: {"isRestricted":true,"region":"Ontario","countryCode":"CA","country":"Canada"} |
| recorded | geo_site=yes → 11: US CA GB BY SY VE CU MM LY ZW CD | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | US: geo_endpoint https://universe.kelpdao.xyz/rseth/geoData → HTTP 200 blocked (residential, 2026-10-28); CA: geo_endpoint https://universe.kelpdao.xyz/rseth/geoData → HTTP 200 blocked (residential, 2 |

## Lombard
<a id="lombard"></a>

Rating **B**, restrictions **3** (2 countries/regions: GB US); mechanisms: geo_feature.

Sweeps:

- App JS: 287 scripts; strong signals: geo/geo-IP service in 1 file(s), e.g. `ipinfo.io` in /app/assets/index-pBCu7pcq.js; geo/country header in 1 file(s), e.g. `cloudfront-viewer-country` in /app/assets/index-pBCu7pcq.js; geo/block text in 1 file(s), e.g. `not available in your region` in /app/assets/index-pBCu7pcq.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: — no open repository
- Terms: 20 countries: BY BI UA-Crimea UA-DPR UA-LPR UA CU CD IR IQ LY KP RU SO SD SY VE ZW US GB; clauses: geofencing, vpn, screening, sanctions, kyc; compared with the site's Terms column: +UA / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_feature=yes → 2: US GB | Lombard docs: the yield strategy, incl. direct mint and redemption, is not available to US or UK persons | [docs.lombard.finance/use/lbtc](https://docs.lombard.finance/use/lbtc) | …work. Note: The yield strategy, including direct mint and redemption, is not available to US or UK persons or to other restricted jurisdictions. See the Terms of Service and yield disclosure for the  |

## Frax Finance
<a id="frax"></a>

Rating **B**, restrictions **2**; mechanisms: screening, kyc.

Sweeps:

- App JS: 198 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:challenge SY:challenge VE:challenge MM:challenge AF:challenge IQ:challenge LB:ok LY:challenge SS:ok ZW:ok NI:challenge CD:challenge CF:challenge SO:challenge ML:challenge; CU: app challenge (HTTP 403 anti-bot challenge); SY: app challenge (HTTP 403 anti-bot challenge); VE: app challenge (HTTP 403 anti-bot challenge); MM: app challenge (HTTP 403 anti-bot challenge); AF: app challenge (HTTP 403 anti-bot challenge); IQ: app challenge (HTTP 403 anti-bot challenge); LY: app challenge (HTTP 403 anti-bot challenge); NI: app challenge (HTTP 403 anti-bot challenge); CD: app challenge (HTTP 403 anti-bot challenge); CF: app challenge (HTTP 403 anti-bot challenge); SO: app challenge (HTTP 403 anti-bot challenge); ML: app challenge (HTTP 403 anti-bot challenge)
- Code: — no open repository
- Terms: 0 countries (via app JavaScript): ; clauses: screening, sanctions, kyc
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | screening=reported | LlamaRisk review: blacklist controls are being embedded in the frxUSD contracts for sanctions screening and wallet blocking | [llamarisk.com/research/pegkeeper-onboarding-frxusd](https://llamarisk.com/research/pegkeeper-onboarding-frxusd) | …th both current regulations and the projected GENIUS standards. Notably, blacklist controls are being embedded directly in the frxUSD smart contracts to enable sanctions screening and wallet-level bl |
| pass | kyc=reported | LlamaRisk review: full KYC/KYB will be required for minting or redeeming through FraxNet bank and fiat rails | [llamarisk.com/research/pegkeeper-onboarding-frxusd](https://llamarisk.com/research/pegkeeper-onboarding-frxusd) | …tainable from any extant ToS. The team’s explanatory notes indicate that full KYC/KYB verification will be required for wallets interacting with the FraxNet infrastructure—particularly for minting or |

## Usual
<a id="usual"></a>

Rating **A**, restrictions **0**.

**To review** (found by the sweeps, not explained by the published data):

- live: PK: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- live: CN: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- live: RU: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- live: BY: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- live: CU: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- live: SY: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- live: VE: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- live: AF: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- live: IQ: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- live: LY: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- live: SS: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- live: NI: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- live: CD: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- live: CF: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- live: SO: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- live: ML: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)

Sweeps:

- App JS: 37 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:error IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:error NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:error AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok; PK: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …); CN: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …); RU: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …); BY: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …); CU: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …); SY: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …); VE: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …); AF: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …); IQ: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …); LY: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …); SS: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …); NI: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …); CD: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …); CF: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …); SO: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …); ML: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- Code: — no open repository
- Terms: 65 countries: AF AL AO AZ BA BS BB MM BW BF BI KY KH CM UA-Crimea UA TD CN CG CD CU ET ER FJ PW GH GN GW HT IR IQ JM JO LA UG LR LY MG ML MT MA MZ NI NG KP PK PA PH PR RU SN SO LK SD SY TJ TT TR TM US UZ VU VE YE ZW; clauses: vpn, sanctions, us_persons; compared with the site's Terms column: +UA / −VI
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=tos_only | The Terms bar Prohibited Persons (residents or nationals of a long list of countries); no technical geo-block described | [docs.usual.money/resources-and-ecosystem/legal-documentation/terms-of-services](https://docs.usual.money/resources-and-ecosystem/legal-documentation/terms-of-services) | …/ Jurisdiction: means France, as provided in Article 8.9 of these Terms. Prohibited Person: means a person who is a resident or national of the following countries: Afghanistan, Albania, Angola, Azer |

## deBridge
<a id="debridge"></a>

Rating **A**, restrictions **0**.

Sweeps:

- App JS: 299 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:error AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: — no open repository
- Terms: 17 countries: US AF CN UA-Crimea CU CD IR IQ MM KP RU SO SS SD SY VE YE; clauses: sanctions
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=tos_only | The Terms list restricted countries including the United States; technical enforcement not verified | [docs.debridge.foundation/legal/terms-of-service](https://docs.debridge.foundation/legal/terms-of-service) | …c) owned or controlled by such persons or entities listed in (a)-(b), or (d) any of the following countries: The United States, Afghanistan, China, Crimea, Cuba, DRC, Iran, Iraq, Myanmar, North Korea |

## OpenSea
<a id="opensea"></a>

Rating **B**, restrictions **2** (1 countries/regions: IR); mechanisms: screening.

**To review** (found by the sweeps, not explained by the published data):

- live: ML: different scripts than direct (+/_next/static/chunks/0fyobyme57xls.js +/_next/static/chunks/0zocj74g84co3.js +/_next/static/chunks/11d5831qhetn8.js … / -/_next/static/chunks/01z0iyiff11zi.js -/_next/static/chunks/030kxwbjb94rw.js -/_next/static/chunks/04us81rt3-so3.js …)
- production JavaScript: kyc signals [KYC vendor (withpersona.com)], but the site says kyc=unknown

Sweeps:

- App JS: 527 scripts; strong signals: geo/block text in 5 file(s), e.g. `not available in your region` in /_next/static/chunks/2n2f6sxods2b0.js; kyc/KYC vendor in 2 file(s), e.g. `withpersona.com` in /_next/static/chunks/386o-oyn87rgo.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:error BY:ok CU:challenge SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok; CU: app challenge (HTTP 403 anti-bot challenge); ML: different scripts than direct (+/_next/static/chunks/0fyobyme57xls.js +/_next/static/chunks/0zocj74g84co3.js +/_next/static/chunks/11d5831qhetn8.js … / -/_next/static/chunks/01z0iyiff11zi.js -/_next/static/chunks/030kxwbjb94rw.js -/_next/static/chunks/04us81rt3-so3.js …)
- Code: — no open repository
- Terms: 1 countries: US; clauses: sanctions; compared with the site's Terms column: +US / −0
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=yes → 1: IR | OpenSea's statement (Mar 2022): it blocks users and territories on the US sanctions list; Iranian users lost access | [fortune.com/crypto/2022/03/04/opensea-metamask-block-users-sanctions/](https://fortune.com/crypto/2022/03/04/opensea-metamask-block-users-sanctions/) | … as decentralized and free from political pressure as proponents claim. “OpenSea blocks users and territories on the U.S. sanctions list from using our services, including buying, selling, or transfe |
| pass | screening=reported | Press report (Mar 2022): Iranian accounts were deactivated, incl. artists living abroad | [www.artnews.com/art-news/news/opensea-deplatforms-iranian-users-us-sanctions-1234621105/](https://www.artnews.com/art-news/news/opensea-deplatforms-iranian-users-us-sanctions-1234621105/) | OpenSea Deplatforms Iranian Users in Compliance with U.S. Sanctions |

## Tornado Cash
<a id="tornado"></a>

Rating **B**, restrictions **1**; mechanisms: screening.

Sweeps:

- App JS: 3 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:error NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: 235 files; strong signals: screening/sanctions oracle in 1 file(s), e.g. `IsSanctioned(` in https://github.com/tornadocash/tornado-classic-ui/blob/a83fae0772c8da084c0e76b3a756b456f5b9f5bb/store/metamask.js#L333
- Terms: — no Terms published
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | screening=reported | Press report (Apr 2022): the Tornado Cash UI blocks OFAC-sanctioned addresses with the Chainalysis oracle (current IPFS UI not verified) | [www.theblock.co/post/142081/ethereum-mixer-tornado-cash-now-blocks-sanctioned-addresses](https://www.theblock.co/post/142081/ethereum-mixer-tornado-cash-now-blocks-sanctioned-addresses) | Tornado Cash said it uses the Chainalysis oracle — a smart contract that validates if a crypto wallet address has been included in a sanctions designation — to block OFAC-sanctioned crypto addresses. |

## Variational (Omni)
<a id="variational"></a>

Rating **B**, restrictions **1**; mechanisms: geo_site.

Sweeps:

- App JS: 172 scripts; strong signals: geo/block text in 2 file(s), e.g. `access restricted` in /_app/immutable/chunks/BalDihKd.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:ok KR:ok TW:ok AU:error NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:error LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: — no open repository
- Terms: 1 countries: US; clauses: geofencing, vpn, sanctions; compared with the site's Terms column: +0 / −CA CU FM GU IR KP MH MP PR PW SD SY TW UA-Crimea UA-DPR UA-LPR UM VI
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=yes | Production JS: the app reads isRestrictedJurisdiction from the /banner API and reloads into the Cloudflare block page when a request answers 'access restricted' | [omni.variational.io](https://omni.variational.io) | https://omni.variational.io/_app/immutable/chunks/KPqtBrng.js: …nfo(e,{component:"banner"}));let ie={show:!1,message:"",isMaintenance:!1,isRestrictedJurisdiction:!1};const{subscribe:yr}=C(le.value,e=> |
| pass | geo_site=tos_only → 19: UA-Crimea UA-DPR UA-LPR CU IR KP SD SY CA US FM GU MH MP PR PW UM VI TW | Territories named on Variational's Restricted Persons page (documentation only until a per-country check confirms where the block applies) | [docs.variational.io/legal/restricted-persons](https://docs.variational.io/legal/restricted-persons) | …the European Union, the United Kingdom, Singapore or the United Nations. These restricted territories are currently: Crimea, Donetsk, Luhansk, and Sevastopol regions of Ukraine Cuba Iran North Korea  |

## Extended
<a id="extended"></a>

Rating **C**, restrictions **11** (10 countries/regions: AF CA CU GB HK IR RU SY US YE); mechanisms: vpn.

**To review** (found by the sweeps, not explained by the published data):

- live: https://api.starknet.extended.exchange/geo answers blocked to IQ {}, but the site does not count IQ

Sweeps:

- App JS: 440 scripts; strong signals: geo/geo-IP service in 1 file(s), e.g. `ip-api.com` in /assets/dynamic-labs-ByoJPifP.js; geo/block text in 2 file(s), e.g. `not available in your region` in /assets/use-format-error-message-cJsOnEo0.js; vpn/VPN detection in 1 file(s), e.g. `isVpn` in /assets/index-BSDNlaFH.js
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:ok GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok; US: /geo blocked {}; CA: /geo blocked {}; GB: /geo blocked {}; HK: /geo blocked {}; US-NY: /geo blocked {}; CA-ON: /geo blocked {}; RU: /geo blocked {}; CU: /geo blocked {}; SY: /geo blocked {}; AF: /geo blocked {}; IQ: /geo blocked {}
- Code: — no open repository
- Terms: 0 countries: ; clauses: vpn, sanctions, kyc; compared with the site's Terms column: +0 / −AF CA CU GB HK IR KP RU SC SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia US
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| pass | geo_site=yes | Production JS: the API error GLOBAL.NOT_AVAILABLE_IN_YOUR_REGION replaces the app with 'Extended is not available in your region' | [app.extended.exchange](https://app.extended.exchange) | https://app.extended.exchange/assets/index-BSDNlaFH.js: …[r.Unauthorized,r.TooManyRequests],wS=[`GLOBAL.TEMPORARILY_UNAVAILABLE`,`GLOBAL.NOT_AVAILABLE_IN_YOUR_REGION`],TS=e=>!!(CS.includes(e.meta?.htt |
| pass | vpn=detect | Production JS: GET /geo answering 451 (UnavailableForLegalReasons) with the load balancer's error code VPN is read as a VPN block | [app.extended.exchange](https://app.extended.exchange) | https://app.extended.exchange/assets/x10-Bv83onNR.js: …trading-schedule/${e}`);return hn.parse(t)},_n=async()=>{let e=await ge(G.get(`/geo`),e=>e);if(e.isOk())return`ALLOWED`;let{error:t}=e;if(l(t)&&t |
| pass | geo_site=tos_only → 19: AF CA HK CU IR IQ YE KP RU SY SC UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia PA GB US | Jurisdictions named on Extended's Restricted Countries page (documentation only until a per-country check confirms where the /geo block applies) | [docs.extended.exchange/extended-resources/legal/restricted-countries](https://docs.extended.exchange/extended-resources/legal/restricted-countries) | …iction in which access to or use of the Extended Protocol is restricted, including without limitation: (A) Afghanistan, Canada, China (Hong Kong), Cuba, Iran, Iraq, Yemen, North Korea, Russia, Syria, |
| recorded | geo_site=yes → 10: US CA GB HK RU SY IR CU AF YE | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | US: geo_endpoint https://api.starknet.extended.exchange/geo → HTTP 451 blocked (residential, 2026-10-28); CA: geo_endpoint https://api.starknet.extended.exchange/geo → HTTP 451 blocked (residential, 2 |

## Aster
<a id="aster"></a>

Rating **C**, restrictions **9** (9 countries/regions: BY CD CU IR SD SS SY US ZW).

Sweeps:

- App JS: 80 scripts; no strong signals
- Live: RO:ok US:ok CA:ok MX:ok AR:ok CO:ok GB:ok DE:ok FR:ok NL:ok ES:ok IT:ok PL:ok CH:ok SE:ok UA:ok TR:ok AE:ok SA:ok IL:ok PK:ok BD:ok VN:ok TH:ok PH:ok MY:ok SG:ok HK:ok CN:error KR:ok TW:ok AU:ok NG:ok ZA:ok KE:ok KZ:error GE:ok US-NY:ok CA-ON:ok RU:ok BY:ok CU:ok SY:ok VE:ok MM:ok AF:ok IQ:ok LB:ok LY:ok SS:ok ZW:ok NI:ok CD:ok CF:ok SO:ok ML:ok
- Code: — no open repository
- Terms: 11 countries: US CA GB CN KP RU UA CU IR VE SY; clauses: sanctions, kyc
- API: — no public screening API known

| Outcome | Claim | What the check shows | Source | Matched |
|---|---|---|---|---|
| fail | geo_site=yes | Production JS: the app asks common-check-ip and, for a blocked region, refuses the wallet connection (dex-ip-blocked) or leaves only closing positions and withdrawals | [www.asterdex.com/en/trade/pro/futures/BTCUSDT](https://www.asterdex.com/en/trade/pro/futures/BTCUSDT) | https://static2.asterdexfx.com/assets/esm-hwcpUeWr.js: …sourceCode?e.sourceCode:``,$(Q.post(`/bapi/futures/v1/public/future/web3/common-check-ip`,t))})})),kqe,Aqe,jqe=e((()=>{R7(),kqe=function(e,t,n,r |
| pass | geo_site=tos_only → 11: US CA GB CN KP RU UA CU IR VE SY | Prohibited Jurisdictions named in the Aster Terms (documentation only until a per-country check confirms which countries the IP check blocks) | [docs.asterdex.com/resources/terms-and-conditions](https://docs.asterdex.com/resources/terms-and-conditions) | …incipal place of business in any of the following jurisdictions (each a "Prohibited Jurisdiction"): the United States of America, Canada, the United Kingdom, China, North Korea, Russia, Ukraine, Cuba |
| recorded | geo_site=yes → 8: BY SY IR CU SS ZW CD SD | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | BY: api https://www.asterdex.com/bapi/futures/v1/public/future/web3/common-check-ip → HTTP 200 blocked (residential, 2026-10-28); SY: api https://www.asterdex.com/bapi/futures/v1/public/future/web3/co |
| recorded | geo_site.close_only=yes → 1: US | Live probe (monitor:probe): the newest verified observation from these countries is restricted | monitor/data/observations.json | US: api https://www.asterdex.com/bapi/futures/v1/public/future/web3/common-check-ip → HTTP 200 close_only (residential, 2026-10-28) |
