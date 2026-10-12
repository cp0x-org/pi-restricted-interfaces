---
name: verify
description: Build, launch, and drive this app (DeFi interface restrictions monitor, React + Vite + MUI) to verify changes at the UI surface.
---

# Verify: pi-restrict-interface

## Build & launch

```bash
pnpm install
pnpm lint          # eslint + prettier (must be clean)
pnpm build         # tsc && vite build
pnpm knip          # unused files/exports (Berry leftovers are expected, see knip.json)
pnpm monitor:build # regenerate the site files (src/data/monitor.json + src/data/interfaces/<id>.json) + monitor/out from monitor/data, then check them (Python 3.9+)
BROWSER=none pnpm start   # dev server on http://localhost:3000
```

Expected `pnpm monitor:build` output: 77 interfaces (64 EVM on the site; defunct Hop and Notional V1 hidden), 34 open / 43 closed, 5 legacy versions; rating A 24, B 27, C 6, D 12, n/a 8 (whole catalog; on the site A 20, B 25, C 5, D 8, n/a 6); A only with zero restrictions. Versions: names render as `name + version` ("Aave V3", "Aave V4 · Aave Pro"); legacy rows sit at the bottom of the default order with a legacy chip; `/monitor/hop` is not found.

## Drive (headless browser)

No Playwright in the repo. Use `playwright-core` from a scratch dir with the cached
headless shell at
`~/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-mac-arm64/chrome-headless-shell`
as `executablePath`.

## Flows worth driving

- `/` → redirects to `/monitor`; the "Monitor" tab is `.Mui-selected`
- `/monitor` — stat tiles (64 total, per-rating counts), filters (search row + Category/Rating/Country/Network; mechanism filters hidden), 100 rows per page by default, "How to read the table" toggle legend; every row has the same height (chip on top, one-line caption below) and does not highlight on hover, only the cp0x app button does; phones get cards instead of the table; default sort: rows with a cp0x permissionless app first, then rating D→A→n/a, restriction count, name; the rating cell shows the count with a breakdown tooltip; row click → `/monitor/:id`
- `/monitor/aave` — header "Aave" with rating chip and the restriction breakdown line, mechanism cards, evidence links starting with `https://github.com/aave/interface/blob/HEAD/`; Uniswap evidence uses `/blob/main/`
- `/monitor/does-not-exist` — "Interface not found" with a back button; `/nope` → redirected to `/monitor`
- Country filter on `/monitor` (multi-select "Country", URL `?country=UA,US`) — only interfaces restricting a selected country stay (blocked/close-only/feature-limited/regional/ToS only); the country column shows one chip per restricted country (`td[data-col="country"]`, basis in `[data-basis]`); 5 restriction chips above the table narrow the list; `/country/UA` redirects to `/monitor?country=UA`; invalid codes are ignored. The Screening layer filter is hidden (`SHOW_SCREENING_LAYER_FILTER`)
- Tabs: only Monitor and Methodology (the By country page is hidden behind `SHOW_COUNTRY_PAGE`)
- Stat tiles include "Permissionless via cp0x" (interfaces with a pi.cp0x.com app); those rows are listed first by default (no row highlight, only the app button)
- `/summary` — charts over the current interfaces (legacy versions left out): KPI tiles (share without restrictions, average restrictions where > 0, max with the interface name, countries blocked), rating donut, mechanisms enforced vs ToS-only, top-15 blocked countries (each links to `/monitor?country=XX`), screening layer donut and providers, category and network tables (share without restrictions, average where > 0, max), open/closed code, cp0x coverage. Charts are plain SVG/CSS (no chart library); the prerendered page carries the same numbers as tables.
- `/methodology` — 5 rating chips (D, C, B, A, n/a), sanctioned test address rendered with `CopyableAddress`
- No wallet: the header has only the EN / 中文 dropdown (no Connect Wallet, no wagmi/RainbowKit)

- Language = URL: English unprefixed, Chinese under `/zh` (`/zh/monitor`, `/zh/monitor/<id>`, `/zh/methodology`). The EN / 中文 dropdown (`#language-button`) links to the same page in the other language (query kept); internal links, tabs and table rows stay in the current language; `/` redirects to the remembered language; unknown `/zh/*` → `/zh/monitor`. Chinese pages set `<html lang="zh-CN">`, canonical to themselves and hreflang `en` / `zh-Hans` / `x-default`

## Gotchas

- MUI `Typography variant="h2"` often renders as `span` (component prop) — select by text/role, not by tag.
- Nav tabs are hardcoded in `src/layout/MainLayout/index.tsx` and matched with `pathname.includes(tab.path)`; tab paths must not be substrings of each other.
- `themes/overrides/Chip.tsx` defaults every Chip to `color="primary" variant="light"`; catalog chips go through `views/monitor/components/ToneChip.tsx`, which sets colour/variant explicitly.
- Expected external requests: none (no wallet SDKs, no geo/IP lookups, no protocol API calls) — the dataset is static.
- `src/data/monitor.json` and `src/data/interfaces/*.json` are generated; edit `monitor/data/interfaces.json` and run `pnpm monitor:build` instead. The interface page renders its header from the dashboard row and loads `interfaces/<id>.json` lazily (a spinner with “Loading the record…” until then): wait for the evidence links before counting them.

## Production build (SEO)

```bash
VITE_SITE_URL=https://example.org pnpm build      # prerendered routes, sitemap.xml, robots.txt, 404.html in dist/
npx serve dist -l 4174 -c ../serve.json           # same serving as the Dockerfile (clean URLs, real 404s)
curl -s localhost:4174/monitor/aave | grep '<title>'   # page-specific title without JavaScript
```

Expect: `/monitor/aave` and `/zh/monitor/aave` → 200 with their own title, `<html lang>`, canonical, hreflang and JSON-LD; `/monitor/aave/` → 301; `/monitor/nope` and
`/country/UA` → 404 (`404.html`, noindex) while the app still boots and redirects; `/robots.txt`, `/sitemap.xml` (96 URLs with hreflang alternates).
Accessibility: axe-core (wcag2a/aa + best-practice) should report no violations on /monitor, /monitor/<id>, /methodology.

## Ready-made smoke script

`.claude/skills/verify/smoke.mjs` drives all flows above (70 checks incl. the /zh pages; `SMOKE_SITE=https://restricted.cp0x.com` checks the canonical domain; expectations read from `src/data/monitor.json`) and saves screenshots. Run it from a scratch dir that has
`playwright-core` installed, with the dev server already running (or `SMOKE_BASE=http://localhost:4174` against the
production build served as above):

```bash
cd <scratch> && npm i playwright-core && cp <project>/.claude/skills/verify/smoke.mjs . && node smoke.mjs <scratch>   # copy first: imports resolve from the script's directory
```
