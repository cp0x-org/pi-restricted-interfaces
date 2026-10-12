# Terms of Service vs the probe: countries

Catalog of 2026-10-11: 78 interfaces, 33 of them reached by the probe through a home-network proxy. Of those, 7 match their Terms on every probed country, 10 name countries in the Terms that the probe found open, 12 restrict countries their Terms do not name.

How to read the columns: **ToS** — the countries the Terms of Service name (ISO codes; regions as `US-NY`); **probe** — the countries the probe saw restricted (`blocked`, `close-only` or `feature-limited`: the newest verified answer from a home-network vantage, per country); **in ToS, probe found open** — named in the Terms, probed, served (the restriction, if any, is enforced some other way or not at all); **in ToS, no answer** — named in the Terms but the probe never reached that country for this interface (no proxy exit, e.g. KP), or, with a `?`, reached it and got no verdict (a Cloudflare page, an anti-bot challenge, a 403 without geo wording); **only probe** — restricted live but not named in the Terms. A region is covered by its country in both directions (US-NY by US). An empty **probe** column with a probed count means the probe saw no restriction anywhere it looked; **landing page only** in the verdict means no geo endpoint or API of this interface is asked, and a served landing page proves little for apps that decide in JavaScript or in an API the probe does not ask.

| Interface | ToS | probe (restricted) | probed | in ToS, probe found open | in ToS, no answer | only probe | verdict |
|---|---|---|---|---|---|---|---|
| Uniswap (`uniswap`) | — (0) | CU IR (2) | 60 | — | — | CU IR | probe finds more (2 not in ToS) |
| SushiSwap (`sushiswap`) | BO BY CD CI CU DZ IQ IR KP LR LY ML MM NP SD SO SY TN UA-Crimea UA-DPR UA-LPR VE YE ZW (24) | — (0) | 0 | — | BO BY CD CI CU DZ IQ IR KP LR LY ML MM NP SD SO SY TN UA-Crimea UA-DPR UA-LPR VE YE ZW | — | not probed |
| PancakeSwap (`pancakeswap`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Curve (`curve`) | BI BY CF CG GN GW IQ IR KP LB LY ML MM RU SD SO SS SY UA VE YE ZW (22) | — (0) | 0 | — | BI BY CF CG GN GW IQ IR KP LB LY ML MM RU SD SO SS SY UA VE YE ZW | — | not probed |
| Curve Classic UI (`curve-classic`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Balancer (`balancer`) | — (0) | — (0) | 0 | — | — | — | not probed |
| CoW Swap (`cowswap`) | — (0) | — (0) | 0 | — | — | — | not probed |
| 1inch (`1inch`) | — (0) | — (0) | 0 | — | — | — | not probed |
| KyberSwap (`kyberswap`) | BY CU IR KP MM RU UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia VE VG VN (14) | BY CU IR MM RU VE VN (7) | 60 | — | KP UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia VG | — | match on the probed countries |
| QuickSwap (`quickswap`) | AG BD BI BO BY CD CI CU DZ EC GB IQ IR KP LR LY MA ML MM NP SD SO SY TW UA-Crimea US VE ZW (28) | — (0) | 0 | — | AG BD BI BO BY CD CI CU DZ EC GB IQ IR KP LR LY MA ML MM NP SD SO SY TW UA-Crimea US VE ZW | — | not probed |
| Aerodrome (`aerodrome`) | AF BA BI BY CD CF CN CU ET GN GW HT IQ IR KP LB LY MD ME ML MM NE NI RS RU SD SO SS SY TN TR UA VE YE ZW (35) | — (0) | 0 | — | AF BA BI BY CD CF CN CU ET GN GW HT IQ IR KP LB LY MD ME ML MM NE NI RS RU SD SO SS SY TN TR UA VE YE ZW | — | not probed |
| Velodrome (`velodrome`) | AF BA BI BY CD CF CN CU ET GN GW HT IQ IR KP LB LY MD ME ML MM NE NI RS RU SD SO SS SY TN TR UA VE YE ZW (35) | — (0) | 0 | — | AF BA BI BY CD CF CN CU ET GN GW HT IQ IR KP LB LY MD ME ML MM NE NI RS RU SD SO SS SY TN TR UA VE YE ZW | — | not probed |
| Ambient Finance (`ambient`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Velora (ex-ParaSwap) (`velora`) | CN CU IR KP MM SY UA-Crimea UA-DPR UA-LPR (9) | BY CU IQ IR LY MM RU SD SY ZW (10) | 61 | CN | KP UA-Crimea UA-DPR UA-LPR | BY IQ LY RU SD ZW | both directions differ |
| Matcha (0x) (`matcha`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Jumper (LI.FI) (`jumper`) | BY CI CU IQ IR KP LR LY MM RU SD SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia VE (18) | AF (feature-limited) BY (feature-limited) CA (feature-limited) CA-ON (feature-limited) CU IR LY (feature-limited) MM (feature-limited) RU (feature-limited) SD (feature-limited) SO (feature-limited) SS (feature-limited) SY UA (feature-limited) US (feature-limited) US-NY (feature-limited) (16) | 62 | IQ VE | CI KP LR UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia | AF CA CA-ON SO SS UA US US-NY | both directions differ |
| Raydium (`raydium`) | BY CD CF CU IR KP LY SD SO SS SY UA-Crimea UA-DPR UA-LPR US YE ZW (17) | — (0) | 0 | — | BY CD CF CU IR KP LY SD SO SS SY UA-Crimea UA-DPR UA-LPR US YE ZW | — | not probed |
| Jupiter (`jupiter`) | CD CI CN CU IQ IR KP LY ML MM NI SD SG SO SY UA-Crimea US YE ZW (19) | — (0) | 0 | — | CD CI CN CU IQ IR KP LY ML MM NI SD SG SO SY UA-Crimea US YE ZW | — | not probed |
| Orca (`orca`) | AF BA BI BY CF CG CU GN GW HT IQ IR KP LB LY ML MM NI SD SO SS SY UA-Crimea UA-DPR UA-LPR VE YE ZW (28) | — (0) | 0 | — | AF BA BI BY CF CG CU GN GW HT IQ IR KP LB LY ML MM NI SD SO SS SY UA-Crimea UA-DPR UA-LPR VE YE ZW | — | not probed |
| Meteora (`meteora`) | CD CI CN CU IQ IR KP LY ML MM NI RU SD SO SY UA-Crimea US VG YE ZW (20) | — (0) | 0 | — | CD CI CN CU IQ IR KP LY ML MM NI RU SD SO SY UA-Crimea US VG YE ZW | — | not probed |
| dYdX (`dydx`) | CA CU GB IR KP MM SY UA-Crimea UA-DPR UA-LPR US (11) | CA CA-ON CU GB IR US US-NY (7) | 61 | MM SY | KP UA-Crimea UA-DPR UA-LPR | — | ToS names more (2 open live) |
| GMX (`gmx`) | — (0) | — (0) | 62 | — | — | — | nothing on either side |
| Hyperliquid (`hyperliquid`) | CA-ON US (2) | AR (feature-limited) AU (feature-limited) BR (feature-limited) CA (feature-limited) CA-ON CH (feature-limited) CU DE (feature-limited) ES (feature-limited) FR (feature-limited) GB (feature-limited) IN (feature-limited) IR IT (feature-limited) JP (feature-limited) MM NL (feature-limited) PL (feature-limited) RU (feature-limited) SG (feature-limited) SY TH (feature-limited) TR (feature-limited) TW (feature-limited) US US-NY (26) | 62 | — | — | AR AU BR CA CH CU DE ES FR GB IN IR IT JP MM NL PL RU SG SY TH TR TW | probe finds more (23 not in ToS) |
| Drift (now Velocity) (`drift`) | — (0) | — (0) | 61 | — | — | — | nothing on either side — landing page only |
| gTrade (Gains) (`gtrade`) | US (1) | CU (feature-limited) IR (feature-limited) SY (feature-limited) US (feature-limited) US-NY (feature-limited) (5) | 62 | — | — | CU IR SY | probe finds more (3 not in ToS) |
| Lighter (`lighter`) | BY CA CN CU GB IR KP MM RU SD SY UA US VE (14) | BY CA CA-ON CN CU GB MM RU SD SY UA US US-NY VE (14) | 62 | — | KP IR? | — | match on the probed countries |
| Aave V3 (`aave`) | BY CI CU IQ IR KP LR LY MM RU SD SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia VE (18) | — (0) | 0 | — | BY CI CU IQ IR KP LR LY MM RU SD SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia VE | — | not probed |
| Aave V4 (Aave Pro) (`aave-pro`) | BY CI CU IQ IR KP LR LY MM RU SD SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia VE (18) | — (0) | 61 | — | CI KP LR UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia BY? CU? IQ? IR? LY? MM? RU? SD? SY? VE? | — | match on the probed countries |
| Compound III (`compound`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Compound V2 (`compound-v2`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Morpho (`morpho`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Spark (`spark`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Sky (ex-Maker) (`sky`) | AF BI BY CD CF CN CU ET GB GN GW HK HT IQ IR KP LB LY ML MM NE NI RU SD SO SS SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia VE YE ZW (35) | — (0) | 0 | — | AF BI BY CD CF CN CU ET GB GN GW HK HT IQ IR KP LB LY ML MM NE NI RU SD SO SS SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia VE YE ZW | — | not probed |
| Venus (`venus`) | BY CA CN CU GB IR KP RU SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia US (15) | — (0) | 0 | — | BY CA CN CU GB IR KP RU SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia US | — | not probed |
| Euler (`euler`) | BY CU IR KP RU SY UA-Crimea UA-DPR UA-LPR (9) | — (0) | 1 | — | BY CU IR KP RU SY UA-Crimea UA-DPR UA-LPR | — | match on the probed countries |
| Fluid (`fluid`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Kamino (`kamino`) | — (0) | — (0) | 0 | — | — | — | not probed |
| marginfi (now Project 0) (`marginfi`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Liquity V2 (`liquity`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Notional Exponent (`notional`) | CU IR KP SY UA-Crimea US-NY VE (7) | — (0) | 0 | — | CU IR KP SY UA-Crimea US-NY VE | — | not probed |
| Notional V3 (`notional-v3`) | CU IR KP SY UA-Crimea US-NY VE (7) | — (0) | 0 | — | CU IR KP SY UA-Crimea US-NY VE | — | not probed |
| Notional V2 (`notional-v2`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Lido (`lido`) | CU GB IR KP SY UA-Crimea UA-DPR UA-LPR (8) | CU IR SY US (feature-limited) US-NY (feature-limited) (5) | 59 | GB | KP UA-Crimea UA-DPR UA-LPR | US US-NY | both directions differ |
| Lido V3 (stVaults) (`lido-stvaults`) | CU GB IR KP SY UA-Crimea UA-DPR UA-LPR (8) | — (0) | 0 | — | CU GB IR KP SY UA-Crimea UA-DPR UA-LPR | — | not probed |
| Rocket Pool (`rocketpool`) | — (0) | — (0) | 0 | — | — | — | not probed |
| EigenLayer (EigenCloud) (`eigenlayer`) | — (0) | CU IR RU SY UA (5) | 5 | — | — | CU IR RU SY UA | probe finds more (5 not in ToS) — landing page only |
| ether.fi (`etherfi`) | BI BY CA CD CU IQ IR KP LY SD SO SY UA-Crimea VE ZW (15) | — (0) | 0 | — | BI BY CA CD CU IQ IR KP LY SD SO SY UA-Crimea VE ZW | — | not probed |
| Pendle (`pendle`) | BY CU IR KP MM RU SD SY UA-Crimea UA-DPR UA-LPR VE ZW (13) | — (0) | 0 | — | BY CU IR KP MM RU SD SY UA-Crimea UA-DPR UA-LPR VE ZW | — | not probed |
| Ethena (`ethena`) | BY CU CY-North GE-Abkhazia GE-SouthOssetia IR KP MM RU SY UA-Crimea UA-DPR UA-LPR US VE (15) | US (1) | 1 | — | BY CU CY-North GE-Abkhazia GE-SouthOssetia IR KP MM RU SY UA-Crimea UA-DPR UA-LPR VE | — | match on the probed countries — landing page only |
| Yearn (`yearn`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Beefy (`beefy`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Convex (`convex`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Jito (`jito`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Across (`across`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Stargate (`stargate`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Synapse (`synapse`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Portal Bridge (Wormhole) (`portalbridge`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Relay (`relay`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Polymarket (`polymarket`) | — (0) | AU BR CA CA-ON CD CF CU DE FR GB IQ IR IT JP KR LB LY MM NI NL PL RU SD SG SO SS SY TH TW US US-NY VE ZW (33) | 54 | — | — | AU BR CA CA-ON CD CF CU DE FR GB IQ IR IT JP KR LB LY MM NI NL PL RU SD SG SO SS SY TH TW US US-NY VE ZW | probe finds more (33 not in ToS) |
| Safe{Wallet} (`safe`) | — (0) | BY CU RU (3) | 62 | — | — | BY CU RU | probe finds more (3 not in ToS) |
| ENS (`ens`) | — (0) | — (0) | 62 | — | — | — | nothing on either side — landing page only |
| ENS Legacy Manager (`ens-legacy`) | — (0) | — (0) | 0 | — | — | — | not probed |
| Snapshot (`snapshot`) | BI BY CF CG GN GW IQ IR KP LB LY ML MM RU SD SO SS SY UA VE YE ZW (22) | — (0) | 0 | — | BI BY CF CG GN GW IQ IR KP LB LY ML MM RU SD SO SS SY UA VE YE ZW | — | not probed |
| Ondo Finance (`ondo`) | AF BY CA CU IR KP LY MM RU SD SO SS SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia US (19) | — (0) | 59 | AF BY CA CU IR LY MM RU SO SS SY US | KP SD UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia | — | ToS names more (12 open live) — landing page only |
| Maple Finance (`maple`) | AF AO AU BI BY CF CG CI CU CY-North ET GE-Abkhazia GE-SouthOssetia GW IR KP LB LR LY ML MM NI RU SD SO SS SY UA-Crimea UA-DPR UA-LPR US VE YE ZW (34) | — (0) | 5 | — | AF AO BI BY CF CG CI CU CY-North ET GE-Abkhazia GE-SouthOssetia GW IR KP LB LR LY ML MM NI RU SD SO SS SY UA-Crimea UA-DPR UA-LPR VE YE ZW AU? US? | — | match on the probed countries — landing page only |
| Centrifuge (`centrifuge`) | — (0) | — (0) | 5 | — | — | — | nothing on either side — landing page only |
| Superstate (`superstate`) | — (0) | AF BY CU IR LB MM RU SY VE (9) | 60 | — | — | AF BY CU IR LB MM RU SY VE | probe finds more (9 not in ToS) — landing page only |
| Symbiotic (`symbiotic`) | — (0) | — (0) | 5 | — | — | — | nothing on either side — landing page only |
| Kelp DAO (`kelp`) | — (0) | BY CA CA-ON CD CU GB IQ IR LY MM SD SO SY US US-NY VE (16) | 58 | — | — | BY CA CA-ON CD CU GB IQ IR LY MM SD SO SY US US-NY VE | probe finds more (16 not in ToS) |
| Lombard (`lombard`) | BI BY CD CU GB IQ IR KP LY RU SD SO SY UA-Crimea UA-DPR UA-LPR US VE ZW (19) | — (0) | 5 | GB US | BI BY CD CU IQ IR KP LY RU SD SO SY UA-Crimea UA-DPR UA-LPR VE ZW | — | ToS names more (2 open live) — landing page only |
| Frax Finance (`frax`) | — (0) | — (0) | 60 | — | — | — | nothing on either side — landing page only |
| Usual (`usual`) | AF AL AO AZ BA BB BF BI BS BW CD CG CM CN CU ER ET FJ GH GN GW HT IQ IR JM JO KH KP KY LA LK LR LY MA MG ML MM MT MZ NG NI PA PH PK PR PW RU SD SN SO SY TD TJ TM TR TT UA-Crimea UG US UZ VE VI VU YE ZW (65) | — (0) | 61 | AF CD CU IQ IR LY ML MM NG NI PH PK RU SD SO SY TR US VE YE ZW | AL AO AZ BA BB BF BI BS BW CG CM CN ER ET FJ GH GN GW HT JM JO KH KP KY LA LK LR MA MG MT MZ PA PR PW SN TD TJ TM TT UA-Crimea UG UZ VI VU | — | ToS names more (21 open live) — landing page only |
| deBridge (`debridge`) | AF CD CN CU IQ IR KP MM RU SD SO SS SY UA-Crimea US VE YE (17) | — (0) | 5 | US | AF CD CN CU IQ IR KP MM RU SD SO SS SY UA-Crimea VE YE | — | ToS names more (1 open live) — landing page only |
| OpenSea (`opensea`) | — (0) | — (0) | 58 | — | — | — | nothing on either side — landing page only |
| Tornado Cash (`tornado`) | — (0) | — (0) | 5 | — | — | — | nothing on either side — landing page only |
| Variational (Omni) (`variational`) | CA CU FM GU IR KP MH MP PR PW SD SY TW UA-Crimea UA-DPR UA-LPR UM US VI (19) | — (0) | 62 | CA CU IR SD SY TW US | FM GU KP MH MP PR PW UA-Crimea UA-DPR UA-LPR UM VI | — | ToS names more (7 open live) — landing page only |
| Extended (`extended`) | AF CA CU GB HK IR KP RU SC SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia US (16) | AF CA CA-ON CU GB HK IR RU SY US US-NY (11) | 62 | — | KP SC UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia | — | match on the probed countries |
| Aster (`aster`) | CA CN CU GB IR KP RU SY UA US VE (11) | BY CD CU IQ IR SD SS SY US (close-only) US-NY (close-only) ZW (11) | 60 | CA GB RU UA VE | CN KP | BY CD IQ SD SS ZW | both directions differ |

Generated by `monitor/scripts/tos_vs_probe.py` from `monitor/data/interfaces.json` and `monitor/data/observations.json`.
