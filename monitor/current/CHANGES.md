# Changes in version 2026-10-28

Compared with the previous version `2026-10-28` (now in `monitor/archive/2026-10-28_2026-10-28`).

## Rating and restriction count

No changes.

## Country lists copied from the sources into the catalog

Nothing: the catalog already matches the sources.

## Checks whose result changed

No changes.

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
