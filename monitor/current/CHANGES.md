# Changes in version 2026-10-11

Compared with the previous version `2026-10-11` (now in `monitor/archive/2026-10-11_2026-10-11-3`).

## Rating and restriction count

| Interface | Before | After | Countries | Mechanisms |
|---|---|---|---|---|
| kyberswap | B / 2 | B / 3 | +VN |  |
| eigenlayer | C / 8 | C / 9 | +UA |  |

## Country lists copied from the sources into the catalog

Nothing: the catalog already matches the sources.

## Checks whose result changed

| Check | Before | After | Countries |
|---|---|---|---|
| eigenlayer/geo-ua-live | new | pass |  |
| kyberswap/geo-vn-live | new | pass |  |

## Needs manual review

Nothing.

## Found by the sweeps but not explained by the site's data

Every interface is swept: the site's JavaScript, its answers from different countries, the code of open repositories, the Terms. These are leads for a researcher, not verdicts: they do not change the catalog.

Nothing.

## Could not be checked

The source exists, but the scripts could not read it (anti-bot, PDF, server error).

- balancer: App JS: error: direct: HTTP 429; proxy US: HTTP 429
- balancer: Terms: error: live: HTTP 429; proxy US: HTTP 429; archive: HTTP 429; app JavaScript: HTTP 429
- 1inch: Terms: skip: live: PDF: its text cannot be extracted with the Python standard library; open the link
- kyberswap: Terms: skip: live: PDF: its text cannot be extracted with the Python standard library; open the link
- quickswap: Terms: skip: live: only 49 characters of text without JavaScript; archive: only 65 characters of text w
- matcha: App JS: error: direct: HTTP 429; proxy US: HTTP 429
- eigenlayer: App JS: error: direct: HTTP 500; proxy US: HTTP 500
- etherfi: App JS: error: direct: HTTP 429; proxy US: HTTP 429
- relay: App JS: error: direct: HTTP 429; proxy US: HTTP 429
- polymarket: Terms: skip: live: HTTP 404; proxy US: no restriction or compliance clauses in 2413 characters of text;
- maple: App JS: error: direct: HTTP 403; proxy US: HTTP 403
- centrifuge: App JS: error: direct: HTTP 403; proxy US: HTTP 403
