# Terms of Service vs the probe: countries

Catalog of 2026-10-28: 78 interfaces, 76 of them reached by the probe through a home-network proxy. Of those, 7 match their Terms on every probed country, 24 name countries in the Terms that the probe found open, 18 restrict countries their Terms do not name.

How to read the columns: **ToS** — the countries the Terms of Service name (ISO codes; regions as `US-NY`); **probe** — the countries the probe saw restricted (`blocked`, `close-only` or `feature-limited`: the newest verified answer from a home-network vantage, per country); **in ToS, probe found open** — named in the Terms, probed, served (the restriction, if any, is enforced some other way or not at all); **in ToS, no answer** — named in the Terms but the probe never reached that country for this interface (no proxy exit, e.g. KP), or, with a `?`, reached it and got no verdict (a Cloudflare page, an anti-bot challenge, a 403 without geo wording); **only probe** — restricted live but not named in the Terms. A region is covered by its country in both directions (US-NY by US). An empty **probe** column with a probed count means the probe saw no restriction anywhere it looked; **landing page only** in the verdict means no geo endpoint or API of this interface is asked, and a served landing page proves little for apps that decide in JavaScript or in an API the probe does not ask.

| Interface | ToS | probe (restricted) | probed | in ToS, probe found open | in ToS, no answer | only probe | verdict |
|---|---|---|---|---|---|---|---|
| Uniswap (`uniswap`) | — (0) | CU IR (2) | 60 | — | — | CU IR | probe finds more (2 not in ToS) |
| SushiSwap (`sushiswap`) | BO BY CD CI CU DZ IQ IR KP LR LY ML MM NP SD SO SY TN UA-Crimea UA-DPR UA-LPR VE YE ZW (24) | — (0) | 53 | CD CU IQ IR LY ML MM SO SY VE YE ZW | BO BY CI DZ KP LR NP SD TN UA-Crimea UA-DPR UA-LPR | — | ToS names more (12 open live) — landing page only |
| PancakeSwap (`pancakeswap`) | — (0) | — (0) | 55 | — | — | — | nothing on either side — landing page only |
| Curve (`curve`) | BI BY CF CG GN GW IQ IR KP LB LY ML MM RU SD SO SS SY UA VE YE ZW (22) | — (0) | 56 | BY CF IQ IR LY ML MM RU SD SO SS SY UA VE YE ZW | BI CG GN GW KP LB | — | ToS names more (16 open live) — landing page only |
| Curve Classic UI (`curve-classic`) | — (0) | — (0) | 57 | — | — | — | nothing on either side — landing page only |
| Balancer (`balancer`) | — (0) | — (0) | 57 | — | — | — | nothing on either side — landing page only |
| CoW Swap (`cowswap`) | — (0) | — (0) | 59 | — | — | — | nothing on either side — landing page only |
| 1inch (`1inch`) | — (0) | — (0) | 59 | — | — | — | nothing on either side — landing page only |
| KyberSwap (`kyberswap`) | BY CU IR KP MM RU UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia VE VG VN (14) | BY CU IR MM RU VE VN (7) | 60 | — | KP UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia VG | — | match on the probed countries |
| QuickSwap (`quickswap`) | AG BD BI BO BY CD CI CU DZ EC GB IQ IR KP LR LY MA ML MM NP SD SO SY TW UA-Crimea US VE ZW (28) | — (0) | 59 | BD BY CD CU GB IQ IR LY ML MM SD SO SY US VE ZW | AG BI BO CI DZ EC KP LR MA NP TW UA-Crimea | — | ToS names more (16 open live) — landing page only |
| Aerodrome (`aerodrome`) | AF BA BI BY CD CF CN CU ET GN GW HT IQ IR KP LB LY MD ME ML MM NE NI RS RU SD SO SS SY TN TR UA VE YE ZW (35) | — (0) | 59 | AF BY CD CF IQ LB LY ML MM NI RU SD SO SS TR UA VE YE ZW | BA BI CN ET GN GW HT KP MD ME NE RS TN CU? IR? SY? | — | ToS names more (19 open live) — landing page only |
| Velodrome (`velodrome`) | AF BA BI BY CD CF CN CU ET GN GW HT IQ IR KP LB LY MD ME ML MM NE NI RS RU SD SO SS SY TN TR UA VE YE ZW (35) | — (0) | 60 | AF BY CD CF CN IQ LB LY ML MM NI RU SD SO SS TR UA VE YE ZW | BA BI ET GN GW HT KP MD ME NE RS TN CU? IR? SY? | — | ToS names more (20 open live) — landing page only |
| Ambient Finance (`ambient`) | — (0) | AF BY CD CF CU IQ IR LB LY ML MM NI RU SD SO SS VE YE ZW (19) | 60 | — | — | AF BY CD CF CU IQ IR LB LY ML MM NI RU SD SO SS VE YE ZW | probe finds more (19 not in ToS) — landing page only |
| Velora (ex-ParaSwap) (`velora`) | CN CU IR KP MM SY UA-Crimea UA-DPR UA-LPR (9) | BY CU IQ IR MM RU SD SY ZW (9) | 61 | CN | KP UA-Crimea UA-DPR UA-LPR | BY IQ RU SD ZW | both directions differ |
| Matcha (0x) (`matcha`) | — (0) | — (0) | 58 | — | — | — | nothing on either side — landing page only |
| Jumper (LI.FI) (`jumper`) | BY CI CU IQ IR KP LR LY MM RU SD SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia VE (18) | AF (feature-limited) BY (feature-limited) CA (feature-limited) CA-ON (feature-limited) CU IR LY (feature-limited) MM (feature-limited) RU (feature-limited) SD (feature-limited) SS (feature-limited) SY UA (feature-limited) US (feature-limited) (14) | 59 | IQ VE | CI KP LR UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia | AF CA CA-ON SS UA US | both directions differ |
| Raydium (`raydium`) | BY CD CF CU IR KP LY SD SO SS SY UA-Crimea UA-DPR UA-LPR US YE ZW (17) | — (0) | 57 | IR US | KP SO UA-Crimea UA-DPR UA-LPR BY? CD? CF? CU? LY? SD? SS? SY? YE? ZW? | — | ToS names more (2 open live) — landing page only |
| Jupiter (`jupiter`) | CD CI CN CU IQ IR KP LY ML MM NI SD SG SO SY UA-Crimea US YE ZW (19) | — (0) | 56 | CD CU IR LY ML MM NI SD SG SY US YE ZW | CI CN IQ KP SO UA-Crimea | — | ToS names more (13 open live) — landing page only |
| Orca (`orca`) | AF BA BI BY CF CG CU GN GW HT IQ IR KP LB LY ML MM NI SD SO SS SY UA-Crimea UA-DPR UA-LPR VE YE ZW (28) | — (0) | 55 | — | BA BI CG GN GW HT IQ IR KP SO UA-Crimea UA-DPR UA-LPR AF? BY? CF? CU? LB? LY? ML? MM? NI? SD? SS? SY? VE? YE? ZW? | — | match on the probed countries — landing page only |
| Meteora (`meteora`) | CD CI CN CU IQ IR KP LY ML MM NI RU SD SO SY UA-Crimea US VG YE ZW (20) | — (0) | 58 | CD CU IR LY ML MM NI RU SD SY US YE ZW | CI CN IQ KP SO UA-Crimea VG | — | ToS names more (13 open live) — landing page only |
| dYdX (`dydx`) | CA CU GB IR KP MM SY UA-Crimea UA-DPR UA-LPR US (11) | CA CA-ON CU GB US (5) | 57 | MM SY | IR KP UA-Crimea UA-DPR UA-LPR | — | ToS names more (2 open live) |
| GMX (`gmx`) | — (0) | — (0) | 58 | — | — | — | nothing on either side |
| Hyperliquid (`hyperliquid`) | CA-ON US (2) | AR (feature-limited) AU (feature-limited) BR (feature-limited) CA (feature-limited) CA-ON CH (feature-limited) CU DE (feature-limited) ES (feature-limited) FR (feature-limited) GB (feature-limited) IN (feature-limited) IR IT (feature-limited) JP (feature-limited) MM NL (feature-limited) PL (feature-limited) RU (feature-limited) SG (feature-limited) SY TH (feature-limited) TR (feature-limited) TW (feature-limited) US YE (26) | 59 | — | — | AR AU BR CA CH CU DE ES FR GB IN IR IT JP MM NL PL RU SG SY TH TR TW YE | probe finds more (24 not in ToS) |
| Drift (now Velocity) (`drift`) | — (0) | — (0) | 57 | — | — | — | nothing on either side — landing page only |
| gTrade (Gains) (`gtrade`) | US (1) | CU (feature-limited) SY (feature-limited) US (feature-limited) (3) | 59 | — | — | CU SY | probe finds more (2 not in ToS) |
| Lighter (`lighter`) | BY CA CN CU GB IR KP MM RU SD SY UA US VE (14) | BY CA CA-ON CN CU GB MM RU SD SY UA US VE (13) | 59 | IR | KP | — | ToS names more (1 open live) |
| Aave V3 (`aave`) | BY CI CU IQ IR KP LR LY MM RU SD SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia VE (18) | — (0) | 57 | — | CI IQ KP LR UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia BY? CU? IR? LY? MM? RU? SD? SY? VE? | — | match on the probed countries — landing page only |
| Aave V4 (Aave Pro) (`aave-pro`) | BY CI CU IQ IR KP LR LY MM RU SD SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia VE (18) | — (0) | 58 | — | CI IQ KP LR UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia BY? CU? IR? LY? MM? RU? SD? SY? VE? | — | match on the probed countries |
| Compound III (`compound`) | — (0) | CD MM SD SS ZW (5) | 59 | — | — | CD MM SD SS ZW | probe finds more (5 not in ToS) — landing page only |
| Compound V2 (`compound-v2`) | — (0) | MM SD SS ZW (4) | 58 | — | — | MM SD SS ZW | probe finds more (4 not in ToS) — landing page only |
| Morpho (`morpho`) | — (0) | — (0) | 58 | — | — | — | nothing on either side — landing page only |
| Spark (`spark`) | — (0) | AF BY CD CF CU IR LB LY ML MM NI RU SS SY UA VE YE ZW (18) | 57 | — | — | AF BY CD CF CU IR LB LY ML MM NI RU SS SY UA VE YE ZW | probe finds more (18 not in ToS) — landing page only |
| Sky (ex-Maker) (`sky`) | AF BI BY CD CF CN CU ET GB GN GW HK HT IQ IR KP LB LY ML MM NE NI RU SD SO SS SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia VE YE ZW (35) | — (0) | 0 | — | AF BI BY CD CF CN CU ET GB GN GW HK HT IQ IR KP LB LY ML MM NE NI RU SD SO SS SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia VE YE ZW | — | not probed |
| Venus (`venus`) | BY CA CN CU GB IR KP RU SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia US (15) | — (0) | 56 | BY CA CN GB IR US | KP UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia CU? RU? SY? | — | ToS names more (6 open live) — landing page only |
| Euler (`euler`) | BY CU IR KP RU SY UA-Crimea UA-DPR UA-LPR (9) | — (0) | 58 | — | KP UA-Crimea UA-DPR UA-LPR BY? CU? IR? RU? SY? | — | match on the probed countries |
| Fluid (`fluid`) | — (0) | — (0) | 57 | — | — | — | nothing on either side — landing page only |
| Kamino (`kamino`) | — (0) | — (0) | 58 | — | — | — | nothing on either side — landing page only |
| marginfi (now Project 0) (`marginfi`) | — (0) | — (0) | 57 | — | — | — | nothing on either side — landing page only |
| Liquity V2 (`liquity`) | — (0) | — (0) | 57 | — | — | — | nothing on either side — landing page only |
| Notional Exponent (`notional`) | CU IR KP SY UA-Crimea US-NY VE (7) | — (0) | 58 | CU IR SY VE | KP UA-Crimea US-NY | — | ToS names more (4 open live) — landing page only |
| Notional V3 (`notional-v3`) | CU IR KP SY UA-Crimea US-NY VE (7) | — (0) | 59 | CU IR SY VE | KP UA-Crimea US-NY | — | ToS names more (4 open live) — landing page only |
| Notional V2 (`notional-v2`) | — (0) | — (0) | 59 | — | — | — | nothing on either side — landing page only |
| Lido (`lido`) | CU GB IR KP SY UA-Crimea UA-DPR UA-LPR (8) | CU IR SY US (feature-limited) (4) | 58 | GB | KP UA-Crimea UA-DPR UA-LPR | US | both directions differ |
| Lido V3 (stVaults) (`lido-stvaults`) | CU GB IR KP SY UA-Crimea UA-DPR UA-LPR (8) | — (0) | 57 | GB | KP UA-Crimea UA-DPR UA-LPR CU? IR? SY? | — | ToS names more (1 open live) — landing page only |
| Rocket Pool (`rocketpool`) | — (0) | — (0) | 59 | — | — | — | nothing on either side — landing page only |
| EigenLayer (EigenCloud) (`eigenlayer`) | — (0) | CU IR RU SY UA (5) | 5 | — | — | CU IR RU SY UA | probe finds more (5 not in ToS) — landing page only |
| ether.fi (`etherfi`) | BI BY CA CD CU IQ IR KP LY SD SO SY UA-Crimea VE ZW (15) | — (0) | 58 | — | BI IQ KP SO UA-Crimea BY? CA? CD? CU? IR? LY? SD? SY? VE? ZW? | — | match on the probed countries — landing page only |
| Pendle (`pendle`) | BY CU IR KP MM RU SD SY UA-Crimea UA-DPR UA-LPR VE ZW (13) | BY CU IR SD SY ZW (6) | 58 | MM VE | KP RU UA-Crimea UA-DPR UA-LPR | — | ToS names more (2 open live) — landing page only |
| Ethena (`ethena`) | BY CU CY-North GE-Abkhazia GE-SouthOssetia IR KP MM RU SY UA-Crimea UA-DPR UA-LPR US VE (15) | AF BY CF CU IR LB LY ML MM NI RU SS SY US VE YE ZW (17) | 57 | — | CY-North GE-Abkhazia GE-SouthOssetia KP UA-Crimea UA-DPR UA-LPR | AF CF LB LY ML NI SS YE ZW | probe finds more (9 not in ToS) — landing page only |
| Yearn (`yearn`) | — (0) | — (0) | 57 | — | — | — | nothing on either side — landing page only |
| Beefy (`beefy`) | — (0) | — (0) | 57 | — | — | — | nothing on either side — landing page only |
| Convex (`convex`) | — (0) | — (0) | 57 | — | — | — | nothing on either side — landing page only |
| Jito (`jito`) | — (0) | — (0) | 58 | — | — | — | nothing on either side — landing page only |
| Across (`across`) | — (0) | — (0) | 57 | — | — | — | nothing on either side — landing page only |
| Stargate (`stargate`) | — (0) | — (0) | 59 | — | — | — | nothing on either side |
| Synapse (`synapse`) | — (0) | — (0) | 59 | — | — | — | nothing on either side — landing page only |
| Portal Bridge (Wormhole) (`portalbridge`) | — (0) | — (0) | 59 | — | — | — | nothing on either side — landing page only |
| Relay (`relay`) | — (0) | — (0) | 58 | — | — | — | nothing on either side — landing page only |
| Polymarket (`polymarket`) | AU BE BI BR BY CA-AB CA-BC CA-ON CA-QC CD CF CU DE ET FR GB IE IQ IR IT JP KP LB LY MM MT NI NL NZ PL RU SD SG SK SO SS SY TH TW UA-Crimea UA-DPR UA-LPR UM US VE YE ZW (47) | AR AU CA CA-ON CD CF CU DE FR GB IR IT JP KR LB LY MM NI NL PL RU SD SG SS SY TH TW US VE YE ZW (31) | 51 | — | BE BI BR BY CA-AB CA-BC CA-QC ET IE IQ KP MT NZ SK SO UA-Crimea UA-DPR UA-LPR UM | AR CA KR | probe finds more (3 not in ToS) |
| Safe{Wallet} (`safe`) | — (0) | BY CU RU (3) | 58 | — | — | BY CU RU | probe finds more (3 not in ToS) |
| ENS (`ens`) | — (0) | — (0) | 58 | — | — | — | nothing on either side — landing page only |
| ENS Legacy Manager (`ens-legacy`) | — (0) | — (0) | 58 | — | — | — | nothing on either side — landing page only |
| Snapshot (`snapshot`) | BI BY CF CG GN GW IQ IR KP LB LY ML MM RU SD SO SS SY UA VE YE ZW (22) | — (0) | 0 | — | BI BY CF CG GN GW IQ IR KP LB LY ML MM RU SD SO SS SY UA VE YE ZW | — | not probed |
| Ondo Finance (`ondo`) | AF BY CA CU IR KP LY MM RU SD SO SS SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia US (19) | — (0) | 57 | AF BY CA CU IR LY MM RU SD SS SY US | KP SO UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia | — | ToS names more (12 open live) — landing page only |
| Maple Finance (`maple`) | AF AO AU BI BY CF CG CI CU CY-North ET GE-Abkhazia GE-SouthOssetia GW IR KP LB LR LY ML MM NI RU SD SO SS SY UA-Crimea UA-DPR UA-LPR US VE YE ZW (34) | — (0) | 57 | — | AO BI CG CI CY-North ET GE-Abkhazia GE-SouthOssetia GW KP LR SO UA-Crimea UA-DPR UA-LPR AF? AU? BY? CF? CU? IR? LB? LY? ML? MM? NI? RU? SD? SS? SY? US? VE? YE? ZW? | — | match on the probed countries — landing page only |
| Centrifuge (`centrifuge`) | — (0) | — (0) | 57 | — | — | — | nothing on either side — landing page only |
| Superstate (`superstate`) | — (0) | AF BY CU LB MM RU SY VE (8) | 57 | — | — | AF BY CU LB MM RU SY VE | probe finds more (8 not in ToS) — landing page only |
| Symbiotic (`symbiotic`) | — (0) | — (0) | 56 | — | — | — | nothing on either side — landing page only |
| Kelp DAO (`kelp`) | — (0) | BY CA CA-ON CD CU GB LY MM SY US VE ZW (12) | 57 | — | — | BY CA CA-ON CD CU GB LY MM SY US VE ZW | probe finds more (12 not in ToS) |
| Lombard (`lombard`) | BI BY CD CU GB IQ IR KP LY RU SD SO SY UA-Crimea UA-DPR UA-LPR US VE ZW (19) | — (0) | 56 | BY CD CU GB IR LY RU SY US VE ZW | BI IQ KP SD SO UA-Crimea UA-DPR UA-LPR | — | ToS names more (11 open live) — landing page only |
| Frax Finance (`frax`) | — (0) | — (0) | 56 | — | — | — | nothing on either side — landing page only |
| Usual (`usual`) | AF AL AO AZ BA BB BF BI BS BW CD CG CM CN CU ER ET FJ GH GN GW HT IQ IR JM JO KH KP KY LA LK LR LY MA MG ML MM MT MZ NG NI PA PH PK PR PW RU SD SN SO SY TD TJ TM TR TT UA-Crimea UG US UZ VE VI VU YE ZW (65) | — (0) | 56 | AF CD CN CU IR LY ML MM NG NI PH PK RU SY TR US VE YE ZW | AL AO AZ BA BB BF BI BS BW CG CM ER ET FJ GH GN GW HT IQ JM JO KH KP KY LA LK LR MA MG MT MZ PA PR PW SD SN SO TD TJ TM TT UA-Crimea UG UZ VI VU | — | ToS names more (19 open live) — landing page only |
| deBridge (`debridge`) | AF CD CN CU IQ IR KP MM RU SD SO SS SY UA-Crimea US VE YE (17) | — (0) | 56 | AF CD CN CU IR MM RU SS SY US VE YE | IQ KP SD SO UA-Crimea | — | ToS names more (12 open live) — landing page only |
| OpenSea (`opensea`) | — (0) | — (0) | 53 | — | — | — | nothing on either side — landing page only |
| Tornado Cash (`tornado`) | — (0) | — (0) | 55 | — | — | — | nothing on either side — landing page only |
| Variational (Omni) (`variational`) | CA CU FM GU IR KP MH MP PR PW SD SY TW UA-Crimea UA-DPR UA-LPR UM US VI (19) | — (0) | 57 | CA CU IR SD SY TW US | FM GU KP MH MP PR PW UA-Crimea UA-DPR UA-LPR UM VI | — | ToS names more (7 open live) — landing page only |
| Extended (`extended`) | AF CA CU GB HK IR KP RU SC SY UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia US (16) | AF CA CA-ON CU GB HK IR RU SY US YE (11) | 57 | — | KP SC UA-Crimea UA-DPR UA-Kherson UA-LPR UA-Zaporizhzhia | YE | probe finds more (1 not in ToS) |
| Aster (`aster`) | CA CN CU GB IR KP RU SY UA US VE (11) | BY CD CU IR SD SS SY US (close-only) ZW (9) | 55 | CA GB RU UA VE | CN KP | BY CD SD SS ZW | both directions differ |

Generated by `monitor/scripts/tos_vs_probe.py` from `monitor/data/interfaces.json` and `monitor/data/observations.json`.
