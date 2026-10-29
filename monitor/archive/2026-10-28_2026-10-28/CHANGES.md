# Changes in version 2026-10-28

Compared with the previous version `2026-10-11` (now in `monitor/archive/2026-10-11_2026-10-28`).

## Rating and restriction count

| Interface | Before | After | Countries | Mechanisms |
|---|---|---|---|---|
| uniswap | B / 3 | B / 5 | +CU +IR |  |
| kyberswap | B / 3 | C / 9 | +BY +CU +IR +MM +RU +VE |  |
| velora | n/a / 0 | C / 9 | +BY +CU +IQ +IR +MM +RU +SD +SY +ZW |  |
| jumper | B / 1 | C / 15 | +AF +BY +CA +CU +IR +LY +MM +RU +SD +SS +SY +UA +US | +geo_feature |
| hyperliquid | — | D / 28 |  |  |
| gtrade | B / 2 | B / 4 | +CU +SY |  |
| lighter | — | C / 12 |  |  |
| aave-pro | B / 3 | B / 2 |  | −screening |
| compound | B / 1 | C / 6 | +CD +MM +SD +SS +ZW |  |
| compound-v2 | B / 1 | B / 5 | +MM +SD +SS +ZW |  |
| spark | B / 3 | D / 21 | +AF +BY +CD +CF +CU +IR +LB +LY +ML +MM +NI +RU +SS +SY +UA +VE +YE +ZW |  |
| lido | B / 4 | C / 7 | +CU +IR +SY |  |
| eigenlayer | C / 9 | C / 11 | +RU +SY |  |
| pendle | A / 0 | C / 6 | +BY +CU +IR +SD +SY +ZW |  |
| ethena | D / 34 | D / 50 | +AF +BY +CF +CU +IR +LB +LY +ML +MM +NI +RU +SS +SY +VE +YE +ZW |  |
| polymarket | D / 47 | D / 50 | +AR +CA +KR |  |
| safe | B / 2 | B / 5 | +BY +CU +RU |  |
| superstate | B / 2 | C / 10 | +AF +BY +CU +LB +MM +RU +SY +VE |  |
| kelp | B / 4 | C / 12 | +BY +CD +CU +LY +MM +SY +VE +ZW |  |
| variational | — | B / 1 |  |  |
| extended | — | C / 11 |  |  |
| aster | — | C / 9 |  |  |

## Country lists copied from the sources into the catalog

Nothing: the catalog already matches the sources.

## Checks whose result changed

| Check | Before | After | Countries |
|---|---|---|---|
| aave-pro/sweep-bundle | pass | pass | −geo/geo endpoint |
| aster/sweep-bundle | — | ran |  |
| extended/sweep-bundle | — | ran |  |
| hyperliquid/sweep-bundle | — | ran |  |
| lighter/sweep-bundle | — | ran |  |
| morpho/sweep-bundle | pass | pass | +geo/country header |
| opensea/sweep-bundle | pass | pass | +kyc/KYC vendor |
| superstate/sweep-bundle | pass | pass | +geo/block text +kyc/KYC vendor |
| variational/sweep-bundle | — | ran |  |
| aave-pro/feature-asset-geo | pass | fail |  |
| aave-pro/screening-compliance | pass | fail |  |
| aster/prod-check-ip | new | fail |  |
| extended/prod-geo-block | new | pass |  |
| extended/prod-vpn-geo | new | pass |  |
| hyperliquid/prod-legalcheck-block | new | pass |  |
| hyperliquid/prod-terms-countries | new | pass |  |
| lighter/prod-geo-restriction | new | pass |  |
| portalbridge/prod-wallet-sanctions | pass | fail |  |
| uniswap/prod-screening | pass | fail |  |
| variational/prod-restricted-jurisdiction | new | pass |  |
| venus/prod-asset-countries | pass | fail |  |
| aster/sweep-terms | — | ran |  |
| extended/sweep-terms | — | ran |  |
| hyperliquid/sweep-terms | — | ran |  |
| lighter/sweep-terms | — | ran |  |
| pancakeswap/sweep-terms | pass | skip | +skip −AE −AS −AT −AU −BE −BG −BH −CU −CY −CZ −DE −DK −EE −ES −FI −FR −GB −GG −GI −GR −GU −HK −HR −HU −ID −IE −IM −IR −IS −IT −JE −JP −KP −KZ −LI −LT −LU −LV −MP −MT −NO −NZ −PH −PL −PR −PT −RO −SE −SI −SK −SY −TH −UM −US −VI |
| polymarket/sweep-terms | skip | pass | +AU +BE +CA-AB +CA-BC +CA-ON +CA-QC +CU +DE +FR +GB +HU +IE +IR +IT +KP +NL +NZ +PA +PL +RU +SG +SI +SK +SY +TH +TW +UA +UA-Crimea +UA-DPR +UA-LPR +US −skip |
| variational/sweep-terms | — | ran |  |
| aster/geo-terms-list | new | pass |  |
| extended/geo-restricted-countries | new | pass |  |
| lighter/geo-terms-list | new | pass |  |
| variational/geo-restricted-persons | new | pass |  |
| hyperliquid/screening-legalcheck | new | pass |  |
| 1inch/sweep-live | pass | pass | +AF:challenge +AU:ok +BD:ok +BY:ok +CA:ok +CD:challenge +CF:challenge +CH:ok +CN:ok +CO:ok +CU:challenge +ES:ok +IL:ok +IQ:challenge +IT:ok +KE:ok +KR:ok +LB:challenge +LY:challenge +ML:challenge +MM:challenge +MX:ok +MY:ok +NI:challenge +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:challenge +SS:challenge +SY:challenge +TH:ok +TW:ok +VE:challenge +ZA:ok +ZW:challenge −BR:ok −JP:ok |
| aave-pro/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:challenge +CA:ok +CD:ok +CF:ok +CH:ok +CN:error +CO:ok +CU:challenge +ES:ok +IL:ok +IQ:challenge +IT:ok +KE:ok +KR:ok +LB:ok +LY:challenge +ML:ok +MM:challenge +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:challenge +SA:ok +SE:ok +SO:ok +SS:ok +SY:challenge +TH:ok +TW:ok +VE:challenge +ZA:ok +ZW:ok −BR:ok −JP:ok |
| aave/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:challenge +CA:ok +CD:ok +CF:ok +CH:ok +CN:error +CO:ok +CU:challenge +ES:ok +IL:ok +IQ:challenge +IT:ok +KE:ok +KR:ok +LB:ok +LY:challenge +ML:ok +MM:challenge +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:challenge +SA:ok +SE:ok +SO:ok +SS:ok +SY:challenge +TH:ok +TW:ok +VE:challenge +ZA:ok +ZW:ok −BR:ok −JP:ok |
| across/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:challenge +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:ok +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:challenge +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| aerodrome/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:error +CO:ok +CU:challenge +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:ok +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:challenge +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| ambient/sweep-live | pass | pass | +AF:blocked +AU:ok +BD:ok +BY:blocked +CA:ok +CD:blocked +CF:blocked +CH:ok +CN:error +CO:ok +CU:blocked +ES:ok +GE:error +IL:error +IQ:blocked +IT:ok +KE:ok +KR:ok +LB:blocked +LY:blocked +ML:blocked +MM:blocked +MX:ok +MY:ok +NI:blocked +PH:ok +PK:ok +RU:blocked +SA:error +SE:ok +SO:blocked +SS:blocked +SY:ok +TH:ok +TW:ok +VE:blocked +ZA:ok +ZW:blocked −BR:ok −GE:ok −JP:ok |
| aster/sweep-live | — | ran |  |
| balancer/sweep-live | pass | pass | +AF:challenge +AU:challenge +BD:challenge +BY:unknown +CA:challenge +CD:challenge +CF:challenge +CH:challenge +CN:challenge +CO:challenge +CU:unknown +ES:challenge +IL:challenge +IQ:challenge +IT:challenge +KE:challenge +KR:challenge +LB:challenge +LY:challenge +ML:challenge +MM:error +MX:challenge +MY:challenge +NI:challenge +PH:challenge +PK:challenge +RU:unknown +SA:challenge +SE:challenge +SO:challenge +SS:challenge +SY:challenge +TH:challenge +TW:challenge +VE:challenge +ZA:challenge +ZW:challenge −BR:challenge −JP:challenge |
| beefy/sweep-live | pass | pass | +AF:country=ok +AF:ok +AU:country=ok +AU:ok +BD:country=ok +BD:ok +BY:country=ok +BY:ok +CA:country=ok +CA:ok +CD:country=ok +CD:ok +CF:country=ok +CF:ok +CH:country=ok +CH:ok +CN:country=ok +CN:ok +CO:country=ok +CO:ok +CU:country=ok +CU:ok +ES:country=ok +ES:ok +IL:country=ok +IL:ok +IQ:country=ok +IQ:ok +IT:country=ok +IT:ok +KE:country=ok +KE:ok +KR:country=ok +KR:ok +LB:country=ok +LB:ok +LY:country=ok +LY:ok +ML:country=ok +ML:ok +MM:country=ok +MM:ok +MX:country=ok +MX:ok +MY:country=ok +MY:ok +NI:country=ok +NI:ok +PH:country=ok +PH:ok +PK:country=ok +PK:ok +RU:country=ok +RU:ok +SA:country=ok +SA:ok +SE:country=ok +SE:ok +SO:country=ok +SO:ok +SS:country=ok +SS:ok +SY:country=ok +SY:ok +TH:country=ok +TH:ok +TW:country=ok +TW:ok +VE:country=ok +VE:ok +ZA:country=ok +ZA:ok +ZW:country=ok +ZW:ok −BR:country=ok −BR:ok −JP:country=ok −JP:ok |
| centrifuge/sweep-live | pass | pass | +AF:challenge +AU:challenge +BD:challenge +BY:challenge +CA:challenge +CD:challenge +CF:challenge +CH:challenge +CN:challenge +CO:challenge +CU:challenge +DE:error +ES:challenge +IL:challenge +IQ:challenge +IT:challenge +KE:challenge +KR:challenge +LB:challenge +LY:challenge +ML:challenge +MM:challenge +MX:challenge +MY:challenge +NI:challenge +PH:challenge +PK:challenge +RU:challenge +SA:challenge +SE:challenge +SO:challenge +SS:challenge +SY:challenge +TH:challenge +TW:challenge +VE:challenge +ZA:challenge +ZW:challenge −BR:challenge −DE:challenge −JP:challenge |
| compound-v2/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:challenge +CA:ok +CD:blocked +CF:ok +CH:ok +CN:ok +CO:ok +CU:challenge +ES:ok +IL:ok +IQ:blocked +IT:ok +KE:ok +KR:ok +LB:ok +LY:ok +ML:ok +MM:error +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:challenge +SA:ok +SE:ok +SO:ok +SS:blocked +SY:challenge +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:blocked −BR:ok −JP:ok |
| compound/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:challenge +CA:ok +CD:blocked +CF:ok +CH:ok +CN:ok +CO:ok +CU:challenge +ES:ok +IL:ok +IQ:blocked +IT:ok +KE:ok +KR:ok +LB:ok +LY:ok +ML:ok +MM:blocked +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:challenge +SA:ok +SE:ok +SO:ok +SS:blocked +SY:challenge +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:blocked −BR:ok −JP:ok |
| convex/sweep-live | pass | pass | +AF:ok +AR:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:ok +LY:ok +ML:ok +MM:error +MX:ok +MY:ok +NG:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −AR:error −BR:error −JP:ok −NG:error |
| cowswap/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:ok +LY:ok +ML:ok +MM:error +MX:ok +MY:ok +NI:error +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| curve-classic/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:error +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:ok +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| curve/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:error +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:ok +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| debridge/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +KZ:ok +LB:ok +LY:ok +ML:ok +MM:error +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok −KZ:error |
| eigenlayer/sweep-live | pass | pass | +AF:error +AU:error +BD:error +BY:error +CA:error +CD:error +CF:error +CH:error +CN:error +CO:error +CU:blocked +ES:error +IL:error +IQ:error +IT:error +KE:error +KR:error +LB:error +LY:error +ML:error +MM:error +MX:error +MY:error +NI:error +PH:error +PK:error +RU:blocked +SA:error +SE:error +SO:error +SS:error +SY:blocked +TH:error +TW:error +VE:error +ZA:error +ZW:error −BR:error −JP:error |
| ens-legacy/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:ok +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TR:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok −TR:error |
| ens/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:ok +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| ethena/sweep-live | pass | pass | +AF:blocked +AU:ok +BD:ok +BY:blocked +CA:ok +CD:ok +CF:blocked +CH:ok +CN:error +CO:ok +CU:blocked +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:blocked +LY:blocked +ML:blocked +MM:blocked +MX:ok +MY:ok +NI:error +PH:ok +PK:ok +RU:blocked +SA:ok +SE:ok +SO:blocked +SS:blocked +SY:blocked +TH:ok +TW:ok +VE:blocked +ZA:ok +ZW:blocked −BR:ok −JP:ok |
| etherfi/sweep-live | pass | pass | +AF:challenge +AU:challenge +BD:challenge +BY:challenge +CA:challenge +CD:challenge +CF:challenge +CH:challenge +CN:challenge +CO:challenge +CU:challenge +ES:challenge +IL:challenge +IQ:challenge +IT:challenge +KE:challenge +KR:challenge +LB:challenge +LY:challenge +ML:challenge +MM:challenge +MX:challenge +MY:challenge +NI:challenge +PH:challenge +PK:challenge +RU:challenge +SA:challenge +SE:challenge +SO:challenge +SS:challenge +SY:challenge +TH:challenge +TW:challenge +VE:challenge +ZA:challenge +ZW:challenge −BR:challenge −JP:challenge |
| euler/sweep-live | pass | pass | +AF:challenge +AF:ping=unknown +AU:ok +AU:ping=unknown +BD:ok +BD:ping=unknown +BY:challenge +BY:ping=unknown +CA:ok +CA:ping=unknown +CD:challenge +CD:ping=unknown +CF:challenge +CF:ping=unknown +CH:ok +CH:ping=unknown +CN:ok +CN:ping=unknown +CO:ok +CO:ping=unknown +CU:challenge +CU:ping=unknown +ES:ok +ES:ping=unknown +IL:ok +IL:ping=unknown +IQ:challenge +IQ:ping=unknown +IT:ok +IT:ping=unknown +KE:ok +KE:ping=unknown +KR:ok +KR:ping=unknown +LB:challenge +LB:ping=unknown +LY:challenge +LY:ping=unknown +ML:challenge +ML:ping=unknown +MM:challenge +MM:ping=unknown +MX:ok +MX:ping=unknown +MY:ok +MY:ping=unknown +NI:challenge +NI:ping=unknown +PH:ok +PH:ping=unknown +PK:ok +PK:ping=unknown +RU:challenge +RU:ping=unknown +SA:ok +SA:ping=unknown +SE:ok +SE:ping=unknown +SO:challenge +SO:ping=unknown +SS:challenge +SS:ping=unknown +SY:challenge +SY:ping=unknown +TH:ok +TH:ping=unknown +TW:ok +TW:ping=unknown +VE:challenge +VE:ping=unknown +ZA:ok +ZA:ping=unknown +ZW:challenge +ZW:ping=unknown −BR:ok −BR:ping=unknown −JP:ok −JP:ping=unknown |
| extended/sweep-live | — | ran |  |
| fluid/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:ok +LY:ok +ML:ok +MM:error +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| frax/sweep-live | pass | pass | +AF:challenge +AU:ok +BD:ok +BY:ok +CA:ok +CD:challenge +CF:challenge +CH:ok +CN:ok +CO:ok +CU:challenge +ES:ok +IL:ok +IQ:challenge +IT:ok +KE:ok +KR:ok +LB:ok +LY:challenge +ML:challenge +MM:challenge +MX:ok +MY:ok +NI:challenge +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:challenge +SS:ok +SY:challenge +TH:ok +TW:ok +VE:challenge +ZA:ok +ZW:ok −BR:ok −JP:ok |
| gmx/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:error +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:ok +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| gtrade/sweep-live | pass | pass | +AF:geo=ok +AF:ok +AU:geo=ok +AU:ok +BD:geo=ok +BD:ok +BY:geo=ok +BY:ok +CA:geo=ok +CA:ok +CD:geo=ok +CD:ok +CF:geo=ok +CF:ok +CH:geo=ok +CH:ok +CN:error +CN:geo=ok +CO:geo=ok +CO:ok +CU:geo=ok +CU:ok +ES:geo=ok +ES:ok +IL:geo=ok +IL:ok +IQ:geo=ok +IQ:ok +IT:geo=ok +IT:ok +KE:geo=ok +KE:ok +KR:geo=ok +KR:ok +LB:geo=error +LB:ok +LY:geo=ok +LY:ok +ML:geo=ok +ML:ok +MM:error +MM:geo=error +MX:geo=ok +MX:ok +MY:geo=ok +MY:ok +NI:geo=ok +NI:ok +PH:challenge +PH:geo=ok +PK:geo=ok +PK:ok +RU:geo=error +RU:ok +SA:geo=ok +SA:ok +SE:geo=ok +SE:ok +SO:geo=ok +SO:ok +SS:geo=error +SS:ok +SY:geo=ok +SY:ok +TH:geo=ok +TH:ok +TW:geo=ok +TW:ok +VE:geo=ok +VE:ok +ZA:geo=ok +ZA:ok +ZW:geo=error +ZW:ok −BR:geo=ok −BR:ok −JP:geo=ok −JP:ok |
| hyperliquid/sweep-live | — | ran |  |
| jumper/sweep-live | pass | pass | +AF:ok +AU:ok +BD:error +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:challenge +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:ok +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:challenge +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| kelp/sweep-live | pass | pass | +AF:geoData=ok +AF:ok +AU:geoData=ok +AU:ok +BD:geoData=ok +BD:ok +BY:geoData=blocked +BY:ok +CA:geoData=blocked +CA:ok +CD:geoData=blocked +CD:ok +CF:geoData=ok +CF:ok +CH:geoData=ok +CH:ok +CN:geoData=ok +CN:ok +CO:geoData=ok +CO:ok +CU:geoData=blocked +CU:ok +ES:geoData=ok +ES:ok +HK:geoData=error +IL:geoData=ok +IL:ok +IQ:geoData=blocked +IQ:ok +IT:geoData=ok +IT:ok +KE:geoData=ok +KE:ok +KR:geoData=ok +KR:ok +LB:geoData=ok +LB:ok +LY:geoData=blocked +LY:ok +ML:geoData=ok +ML:ok +MM:geoData=blocked +MM:ok +MX:geoData=ok +MX:ok +MY:geoData=ok +MY:ok +NI:geoData=ok +NI:ok +PH:geoData=ok +PH:ok +PK:geoData=ok +PK:ok +RU:geoData=ok +RU:ok +SA:geoData=ok +SA:ok +SE:geoData=ok +SE:ok +SO:geoData=blocked +SO:ok +SS:geoData=ok +SS:ok +SY:geoData=blocked +SY:ok +TH:geoData=ok +TH:ok +TW:geoData=ok +TW:ok +VE:geoData=blocked +VE:ok +ZA:geoData=ok +ZA:ok +ZW:geoData=blocked +ZW:ok −BR:geoData=ok −BR:ok −HK:geoData=ok −JP:geoData=ok −JP:ok |
| kyberswap/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:blocked +CA:ok +CD:ok +CF:ok +CH:ok +CN:error +CO:ok +CU:blocked +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:error +LY:ok +ML:ok +MM:blocked +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:blocked +SA:ok +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:blocked +ZA:ok +ZW:ok −BR:ok −JP:ok |
| lido-stvaults/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:unknown +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:error +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:unknown +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| lido/sweep-live | pass | pass | +AF:geo=ok +AF:ok +AU:geo=ok +AU:ok +BD:geo=ok +BD:ok +BY:geo=ok +BY:ok +CA:geo=ok +CA:ok +CD:geo=ok +CD:ok +CF:geo=ok +CF:ok +CH:geo=ok +CH:ok +CN:geo=ok +CN:ok +CO:geo=ok +CO:ok +CU:geo=unknown +CU:unknown +DE:error +ES:geo=ok +ES:ok +IL:geo=ok +IL:ok +IQ:geo=ok +IQ:ok +IT:geo=ok +IT:ok +KE:geo=ok +KE:ok +KR:geo=ok +KR:ok +LB:error +LB:geo=ok +LY:geo=ok +LY:ok +ML:geo=ok +ML:ok +MM:geo=ok +MM:ok +MX:geo=ok +MX:ok +MY:geo=ok +MY:ok +NI:geo=ok +NI:ok +PH:geo=ok +PH:ok +PK:geo=ok +PK:ok +RU:geo=ok +RU:ok +SA:geo=ok +SA:ok +SE:geo=ok +SE:ok +SO:geo=ok +SO:ok +SS:geo=ok +SS:ok +SY:geo=unknown +SY:unknown +TH:geo=ok +TH:ok +TW:geo=ok +TW:ok +VE:geo=ok +VE:ok +ZA:geo=ok +ZA:ok +ZW:geo=ok +ZW:ok −BR:geo=ok −BR:ok −DE:ok −JP:geo=ok −JP:ok |
| lighter/sweep-live | — | ran |  |
| liquity/sweep-live | pass | pass | +AF:ok +AU:error +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:error +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| lombard/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:ok +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| maple/sweep-live | pass | pass | +AF:challenge +AU:challenge +BD:challenge +BY:challenge +CA:challenge +CD:challenge +CF:challenge +CH:challenge +CN:challenge +CO:challenge +CU:challenge +ES:challenge +IL:challenge +IQ:challenge +IT:challenge +KE:challenge +KR:challenge +LB:challenge +LY:challenge +ML:challenge +MM:challenge +MX:challenge +MY:challenge +NI:challenge +PH:challenge +PK:challenge +RU:challenge +SA:challenge +SE:challenge +SO:challenge +SS:challenge +SY:challenge +TH:challenge +TW:challenge +VE:challenge +ZA:challenge +ZW:challenge −BR:challenge −JP:challenge |
| matcha/sweep-live | pass | pass | +AF:unknown +AU:challenge +BD:challenge +BY:challenge +CA:challenge +CD:challenge +CF:challenge +CH:challenge +CN:error +CO:challenge +CU:unknown +ES:challenge +IL:challenge +IQ:unknown +IT:challenge +KE:challenge +KR:challenge +LB:unknown +LY:challenge +ML:challenge +MM:challenge +MX:challenge +MY:challenge +NI:challenge +PH:challenge +PK:challenge +RU:challenge +SA:challenge +SE:challenge +SO:challenge +SS:challenge +SY:unknown +TH:challenge +TW:challenge +VE:challenge +ZA:challenge +ZW:challenge −BR:challenge −JP:challenge |
| morpho/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:unknown +CA:ok +CD:ok +CF:ok +CH:ok +CN:error +CO:ok +CU:unknown +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:ok +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:unknown +SA:ok +SE:ok +SO:ok +SS:unknown +SY:unknown +TH:ok +TW:ok +VE:unknown +ZA:ok +ZW:ok −BR:ok −JP:ok |
| notional-v2/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:error +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:ok +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| notional-v3/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:error +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:error +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| notional/sweep-live | pass | pass | +AF:geoip=ok +AF:ok +AU:geoip=error +AU:ok +BD:geoip=ok +BD:ok +BY:geoip=ok +BY:ok +CA:geoip=ok +CA:ok +CD:geoip=ok +CD:ok +CF:geoip=ok +CF:ok +CH:geoip=ok +CH:ok +CN:geoip=ok +CN:ok +CO:geoip=ok +CO:ok +CU:geoip=ok +CU:ok +ES:geoip=ok +ES:ok +IL:geoip=ok +IL:ok +IQ:geoip=ok +IQ:ok +IT:geoip=error +IT:ok +KE:geoip=error +KE:ok +KR:geoip=ok +KR:ok +LB:error +LB:geoip=ok +LY:geoip=ok +LY:ok +ML:geoip=ok +ML:ok +MM:geoip=ok +MM:ok +MX:geoip=ok +MX:ok +MY:geoip=ok +MY:ok +NI:geoip=ok +NI:ok +PH:geoip=ok +PH:ok +PK:geoip=error +PK:ok +RU:geoip=ok +RU:ok +SA:geoip=error +SA:ok +SE:geoip=ok +SE:ok +SO:geoip=ok +SO:ok +SS:geoip=error +SS:ok +SY:geoip=ok +SY:ok +TH:geoip=ok +TH:ok +TW:geoip=ok +TW:ok +VE:geoip=ok +VE:ok +ZA:geoip=ok +ZA:ok +ZW:geoip=ok +ZW:ok −BR:geoip=ok −BR:ok −JP:geoip=ok −JP:ok |
| ondo/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:error +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:ok +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:error +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| opensea/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:error +CO:ok +CU:challenge +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:ok +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:error +SA:ok +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| pancakeswap/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:challenge +CA:ok +CD:challenge +CF:ok +CH:ok +CN:error +CO:ok +CU:challenge +ES:ok +IL:error +IQ:challenge +IT:ok +KE:ok +KR:ok +LB:error +LY:ok +ML:ok +MM:challenge +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:challenge +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:challenge −BR:ok −JP:ok |
| pendle/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:blocked +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:blocked +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:error +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:error +RU:error +SA:ok +SE:ok +SO:ok +SS:ok +SY:blocked +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:blocked −BR:ok −JP:ok |
| polymarket/sweep-live | pass | pass | +AF:geoblock=ok +AF:ok +AR:geoblock=blocked +AU:geoblock=blocked +AU:ok +BD:geoblock=ok +BD:ok +BY:error +BY:geoblock=error +CA:geoblock=blocked +CA:ok +CD:geoblock=blocked +CD:ok +CF:geoblock=blocked +CF:ok +CH:geoblock=ok +CH:ok +CN:error +CN:geoblock=error +CO:error +CO:geoblock=error +CU:blocked +CU:geoblock=unknown +ES:error +ES:geoblock=error +IL:geoblock=ok +IL:ok +IQ:geoblock=blocked +IQ:ok +IT:geoblock=blocked +IT:ok +KE:geoblock=ok +KE:ok +KR:blocked +KR:geoblock=blocked +LB:error +LB:geoblock=error +LY:geoblock=blocked +LY:ok +ML:geoblock=ok +ML:ok +MM:geoblock=blocked +MM:ok +MX:geoblock=ok +MX:ok +MY:geoblock=ok +MY:ok +NI:geoblock=blocked +NI:ok +PH:geoblock=ok +PH:ok +PK:geoblock=ok +PK:ok +RU:geoblock=blocked +RU:ok +SA:error +SA:geoblock=error +SE:geoblock=ok +SE:ok +SO:error +SO:geoblock=error +SS:geoblock=blocked +SS:ok +SY:blocked +SY:geoblock=unknown +TH:geoblock=blocked +TH:ok +TR:geoblock=ok +TR:ok +TW:geoblock=blocked +TW:ok +UA:geoblock=ok +VE:geoblock=blocked +VE:ok +VN:error +VN:geoblock=error +ZA:geoblock=ok +ZA:ok +ZW:geoblock=blocked +ZW:ok −AR:geoblock=ok −BR:geoblock=blocked −BR:ok −JP:geoblock=blocked −JP:ok −TR:error −TR:geoblock=error −UA:geoblock=error −VN:geoblock=ok −VN:ok |
| portalbridge/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:challenge +CA:ok +CD:challenge +CF:challenge +CH:ok +CN:ok +CO:ok +CU:challenge +DE:error +ES:ok +IL:ok +IQ:challenge +IT:ok +KE:ok +KR:ok +LB:error +LY:challenge +ML:challenge +MM:challenge +MX:ok +MY:ok +NI:challenge +PH:ok +PK:ok +RU:challenge +SA:ok +SE:ok +SO:challenge +SS:error +SY:challenge +TH:ok +TW:ok +VE:challenge +ZA:ok +ZW:ok −BR:ok −DE:ok −JP:ok |
| quickswap/sweep-live | pass | pass | +AF:ok +AU:error +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:error +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:error +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:error +SA:ok +SE:ok +SO:ok +SS:error +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| relay/sweep-live | pass | pass | +AF:challenge +AU:challenge +BD:challenge +BY:challenge +CA:challenge +CD:challenge +CF:challenge +CH:challenge +CN:challenge +CO:challenge +CU:unknown +ES:challenge +IL:challenge +IQ:challenge +IT:challenge +KE:error +KR:challenge +LB:error +LY:challenge +ML:challenge +MM:challenge +MX:challenge +MY:challenge +NI:challenge +PH:challenge +PK:challenge +RU:error +SA:challenge +SE:challenge +SO:challenge +SS:error +SY:challenge +TH:challenge +TW:challenge +VE:challenge +ZA:challenge +ZW:challenge −BR:challenge −JP:challenge |
| rocketpool/sweep-live | pass | pass | +AF:ok +AU:error +BD:ok +BY:ok +CA:ok +CD:challenge +CF:challenge +CH:ok +CN:challenge +CO:ok +CU:ok +DE:error +ES:ok +IL:ok +IQ:challenge +IT:ok +KE:ok +KR:ok +LB:error +LY:challenge +ML:ok +MM:challenge +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:challenge +SA:ok +SE:ok +SO:challenge +SS:error +SY:challenge +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:challenge −BR:ok −DE:ok −JP:ok |
| safe/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:error +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:error +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| sky/sweep-live | pass | pass | +AF:error +AF:geo-config=error +AU:error +AU:geo-config=error +BD:error +BD:geo-config=error +BY:error +BY:geo-config=error +CA:error +CA:geo-config=error +CD:error +CD:geo-config=error +CF:error +CF:geo-config=error +CH:error +CH:geo-config=error +CN:error +CN:geo-config=error +CO:error +CO:geo-config=error +CU:error +CU:geo-config=error +ES:error +ES:geo-config=error +IL:error +IL:geo-config=error +IQ:error +IQ:geo-config=error +IT:error +IT:geo-config=error +KE:error +KE:geo-config=error +KR:error +KR:geo-config=error +LB:error +LB:geo-config=error +LY:error +LY:geo-config=error +ML:error +ML:geo-config=error +MM:error +MM:geo-config=error +MX:error +MX:geo-config=error +MY:error +MY:geo-config=error +NI:error +NI:geo-config=error +PH:error +PH:geo-config=error +PK:error +PK:geo-config=error +RU:error +RU:geo-config=error +SA:error +SA:geo-config=error +SE:error +SE:geo-config=error +SO:error +SO:geo-config=error +SS:error +SS:geo-config=error +SY:error +SY:geo-config=error +TH:error +TH:geo-config=error +TW:error +TW:geo-config=error +VE:error +VE:geo-config=error +ZA:error +ZA:geo-config=error +ZW:error +ZW:geo-config=error −BR:error −BR:geo-config=error −JP:error −JP:geo-config=error |
| snapshot/sweep-live | pass | pass | +AF:error +AU:error +BD:error +BY:error +CA:error +CD:error +CF:error +CH:error +CN:error +CO:error +CU:error +ES:error +IL:error +IQ:error +IT:error +KE:error +KR:error +LB:error +LY:error +ML:error +MM:error +MX:error +MY:error +NI:error +PH:error +PK:error +RU:error +SA:error +SE:error +SO:error +SS:error +SY:error +TH:error +TW:error +VE:error +ZA:error +ZW:error −BR:error −JP:error |
| spark/sweep-live | pass | pass | +AF:unknown +AU:error +BD:ok +BY:unknown +CA:ok +CD:unknown +CF:unknown +CH:ok +CN:ok +CO:ok +CU:unknown +DE:error +ES:ok +IL:ok +IQ:unknown +IT:ok +KE:ok +KR:ok +LB:error +LY:unknown +ML:unknown +MM:unknown +MX:ok +MY:ok +NI:unknown +PH:ok +PK:ok +RU:unknown +SA:error +SE:ok +SO:unknown +SS:unknown +SY:unknown +TH:ok +TW:ok +VE:unknown +ZA:ok +ZW:unknown −BR:ok −DE:ok −JP:ok |
| stargate/sweep-live | pass | pass | +AF:ok +AF:publicKeys=unknown +AU:ok +AU:publicKeys=ok +BD:ok +BD:publicKeys=ok +BY:ok +BY:publicKeys=unknown +CA:ok +CA:publicKeys=ok +CD:ok +CD:publicKeys=unknown +CF:ok +CF:publicKeys=unknown +CH:ok +CH:publicKeys=ok +CN:ok +CN:publicKeys=ok +CO:ok +CO:publicKeys=ok +CU:publicKeys=unknown +CU:unknown +DE:error +ES:ok +ES:publicKeys=ok +IL:ok +IL:publicKeys=ok +IQ:ok +IQ:publicKeys=unknown +IT:ok +IT:publicKeys=ok +KE:ok +KE:publicKeys=ok +KR:ok +KR:publicKeys=ok +LB:error +LB:publicKeys=error +LY:ok +LY:publicKeys=unknown +ML:ok +ML:publicKeys=unknown +MM:publicKeys=unknown +MM:unknown +MX:ok +MX:publicKeys=ok +MY:ok +MY:publicKeys=ok +NI:ok +NI:publicKeys=ok +PH:ok +PH:publicKeys=ok +PK:ok +PK:publicKeys=ok +RU:publicKeys=unknown +RU:unknown +SA:ok +SA:publicKeys=ok +SE:ok +SE:publicKeys=ok +SO:ok +SO:publicKeys=unknown +SS:ok +SS:publicKeys=unknown +SY:publicKeys=unknown +SY:unknown +TH:ok +TH:publicKeys=ok +TW:ok +TW:publicKeys=ok +VE:ok +VE:publicKeys=unknown +ZA:ok +ZA:publicKeys=ok +ZW:ok +ZW:publicKeys=ok −BR:ok −BR:publicKeys=ok −DE:ok −JP:ok −JP:publicKeys=ok |
| superstate/sweep-live | pass | pass | +AF:blocked +AU:ok +BD:ok +BY:blocked +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:blocked +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:error +LY:ok +ML:ok +MM:blocked +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:blocked +SA:ok +SE:ok +SO:ok +SS:ok +SY:blocked +TH:ok +TW:ok +VE:blocked +ZA:ok +ZW:ok −BR:ok −JP:ok |
| sushiswap/sweep-live | pass | pass | +AF:geolocation=ok +AF:ok +AU:geolocation=ok +AU:ok +BD:geolocation=ok +BD:ok +BY:error +BY:geolocation=error +CA:geolocation=ok +CA:ok +CD:geolocation=ok +CD:ok +CF:geolocation=error +CF:ok +CH:geolocation=ok +CH:ok +CN:error +CN:geolocation=error +CO:geolocation=ok +CO:ok +CU:geolocation=ok +CU:ok +DE:error +ES:geolocation=ok +ES:ok +IL:geolocation=ok +IL:ok +IQ:geolocation=ok +IQ:ok +IT:geolocation=ok +IT:ok +KE:geolocation=ok +KE:ok +KR:geolocation=ok +KR:ok +LB:error +LB:geolocation=error +LY:geolocation=ok +LY:ok +ML:geolocation=ok +ML:ok +MM:geolocation=ok +MM:ok +MX:geolocation=ok +MX:ok +MY:geolocation=ok +MY:ok +NI:geolocation=ok +NI:ok +PH:geolocation=ok +PH:ok +PK:geolocation=ok +PK:ok +RU:geolocation=ok +RU:ok +SA:geolocation=ok +SA:ok +SE:geolocation=ok +SE:ok +SO:geolocation=ok +SO:ok +SS:geolocation=ok +SS:ok +SY:geolocation=ok +SY:ok +TH:geolocation=ok +TH:ok +TW:geolocation=ok +TW:ok +VE:geolocation=ok +VE:ok +ZA:geolocation=ok +ZA:ok +ZW:geolocation=ok +ZW:ok −BR:geolocation=ok −BR:ok −DE:ok −JP:geolocation=ok −JP:ok |
| symbiotic/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:error +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| synapse/sweep-live | pass | pass | +AF:challenge +AU:ok +BD:ok +BY:challenge +CA:ok +CD:challenge +CF:challenge +CH:ok +CN:ok +CO:ok +CU:challenge +ES:ok +IL:ok +IQ:challenge +IT:ok +KE:ok +KR:ok +LB:error +LY:challenge +ML:challenge +MM:challenge +MX:ok +MY:ok +NI:challenge +PH:ok +PK:ok +RU:challenge +SA:ok +SE:ok +SO:challenge +SS:challenge +SY:challenge +TH:ok +TW:ok +VE:challenge +ZA:ok +ZW:challenge −BR:ok −JP:ok |
| tornado/sweep-live | pass | pass | +AF:ok +AU:error +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:error +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| uniswap/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:error +CA:ok +CD:ok +CF:ok +CH:ok +CN:error +CO:ok +CU:blocked +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:error +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| usual/sweep-live | pass | pass | +AF:ok +AU:error +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:error +LY:ok +ML:ok +MM:error +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:error +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| variational/sweep-live | — | ran |  |
| velodrome/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:challenge +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:error +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:challenge +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| velora/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:error +LY:ok +ML:ok +MM:ok +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RO:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok −RO:unknown |
| venus/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:ok +CO:ok +CU:unknown +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:error +LY:ok +ML:ok +MM:error +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:unknown +SA:ok +SE:ok +SO:ok +SS:ok +SY:unknown +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |
| yearn/sweep-live | pass | pass | +AF:ok +AU:ok +BD:ok +BY:ok +CA:ok +CD:ok +CF:ok +CH:ok +CN:error +CO:ok +CU:ok +ES:ok +IL:ok +IQ:ok +IT:ok +KE:ok +KR:ok +LB:error +LY:ok +ML:ok +MM:error +MX:ok +MY:ok +NI:ok +PH:ok +PK:ok +RU:ok +SA:ok +SE:ok +SO:ok +SS:ok +SY:ok +TH:ok +TW:ok +VE:ok +ZA:ok +ZW:ok −BR:ok −JP:ok |

## Needs manual review

- aave-pro/feature-asset-geo (geo_feature=yes): fail — not found: fetch\("/api/geo",\{method:"POST"
- aave-pro/screening-compliance (screening=yes): fail — not found: "ComplianceBlockedScreen"
- aave-pro: screening=yes is counted on the site, but no check supports it
- aster/prod-check-ip (geo_site=yes): fail — not found: dex-ip-blocked, Only closing positions and withdrawals are available
- aster: geo_site=yes is counted on the site, but no check supports it
- hyperliquid: geo_feature=yes is counted on the site, but no check supports it
- jumper: geo_site=yes is counted on the site, but no check supports it
- jumper: geo_feature=yes is counted on the site, but no check supports it
- portalbridge/prod-wallet-sanctions (screening=yes): fail — not found: checkWalletSanctions\)\(\w,\w\),\(0,\w\.checkWalletSanctions\)
- uniswap/prod-screening (screening=yes): fail — not found: screenAddressQuery
- venus/prod-asset-countries (geo_feature=yes): fail — not found: https://free\.freeipapi\.com/api/json

## Found by the sweeps but not explained by the site's data

Every interface is swept: the site's JavaScript, its answers from different countries, the code of open repositories, the Terms. These are leads for a researcher, not verdicts: they do not change the catalog.

- lighter: production JavaScript: screening signals [screening call (addressScreening)], but the site says screening=tos_only
- compound: live: the app is blocked from IQ (HTTP 403 with geo wording), but the site does not count IQ
- compound-v2: live: the app is blocked from IQ (HTTP 403 with geo wording), but the site does not count IQ
- compound-v2: live: the app is blocked from CD (HTTP 403 with geo wording), but the site does not count CD
- ethena: live: the app is blocked from SO (redirect -> https://ethena.fi/restricted), but the site does not count SO
- beefy: live: TR: different scripts than direct (+0 / -/assets/js/entry-index-*.js)
- kelp: live: https://universe.kelpdao.xyz/rseth/geoData answers blocked to IQ {"isRestricted": true, "country": "Iraq", "countryCode": "IQ", "region": "Erbil Governorate"}, but the site does not count IQ
- kelp: live: https://universe.kelpdao.xyz/rseth/geoData answers blocked to SO {"isRestricted": true, "country": "Somalia", "countryCode": "SO", "region": "Banaadir"}, but the site does not count SO
- usual: live: PK: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- usual: live: CN: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- usual: live: RU: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- usual: live: BY: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- usual: live: CU: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- usual: live: SY: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- usual: live: VE: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- usual: live: AF: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- usual: live: IQ: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- usual: live: LY: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- usual: live: SS: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- usual: live: NI: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- usual: live: CD: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- usual: live: CF: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- usual: live: SO: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- usual: live: ML: different scripts than direct (+0 / -/_next/static/chunks/1161-*.js -/_next/static/chunks/183-*.js -/_next/static/chunks/1849-*.js …)
- opensea: live: ML: different scripts than direct (+/_next/static/chunks/0fyobyme57xls.js +/_next/static/chunks/0zocj74g84co3.js +/_next/static/chunks/11d5831qhetn8.js … / -/_next/static/chunks/01z0iyiff11zi.js -/_next/static/chunks/030kxwbjb94rw.js -/_next/static/chunks/04us81rt3-so3.js …)
- opensea: production JavaScript: kyc signals [KYC vendor (withpersona.com)], but the site says kyc=unknown
- extended: live: https://api.starknet.extended.exchange/geo answers blocked to IQ {}, but the site does not count IQ

## Could not be checked

The source exists, but the scripts could not read it (anti-bot, PDF, server error).

- pancakeswap: Terms: skip: live: only 11 characters of text without JavaScript; archive: only 11 characters of text w
- balancer: App JS: error: direct: HTTP 429; proxy US: HTTP 429
- balancer: Terms: error: live: HTTP 429; proxy US: HTTP 429; archive: HTTP 429; app JavaScript: HTTP 429
- 1inch: Terms: skip: live: PDF: its text cannot be extracted with the Python standard library; open the link
- kyberswap: Terms: skip: live: PDF: its text cannot be extracted with the Python standard library; open the link
- quickswap: Terms: skip: live: only 49 characters of text without JavaScript; archive: only 65 characters of text w
- matcha: App JS: error: direct: HTTP 429; proxy US: HTTP 429
- eigenlayer: App JS: error: direct: HTTP 500; proxy US: HTTP 500
- etherfi: App JS: error: direct: HTTP 429; proxy US: HTTP 429
- relay: App JS: error: direct: HTTP 429; proxy US: HTTP 429
- maple: App JS: error: direct: HTTP 403; proxy US: HTTP 403
- centrifuge: App JS: error: direct: HTTP 403; proxy US: HTTP 403
