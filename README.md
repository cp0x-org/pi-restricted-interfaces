# DeFi Interface Restrictions Monitor by cp0x

A public catalog of access restrictions in the official web interfaces of DeFi protocols: site-level geo-blocking,
feature and asset gating by country, wallet screening, VPN detection and Terms-of-Service exclusions. For every
interface the catalog records where the restriction is enforced (edge, frontend, the operator's own API or the
protocol API) and whether a permissionless fork removes it, with links to the code paths, documents and API
responses the verdict is based on.

Built on the cp0x Permissionless Interface boilerplate (Berry MUI template: React 19 + Vite + MUI 7) with wallet
connectivity (wagmi + RainbowKit) left in place.

## Pages

- `/monitor` — ranking of the interfaces on EVM networks (the full catalog incl. Solana/Cosmos apps stays in `monitor/`): level A/A?/B/C/D/?, mechanisms, screening provider and layer, fork readiness, frontend code status; filters by category, chain, level, layer, mechanism and open-source-only
- `/monitor/:id` — interface card: repository, each mechanism with countries and fail mode, Terms of Service summary, fork notes, live checks, evidence links pinned to the repository branch
- Country filter on `/monitor` (multi-select, `?country=UA,US`) — keeps only the interfaces that restrict at least one selected country (blocked, close-only, feature-limited, regional or ToS only) and adds a column with each verdict and its basis; chips above the table narrow by restriction type. The standalone `/country` page is hidden (`SHOW_COUNTRY_PAGE` in `src/views/monitor/constants.ts`); `/country/XX` links redirect to `/monitor?country=XX`
- `/methodology` — levels, status vocabulary, layers, country rules, detection typology, live-check caveats and limitations

## Data

The dataset lives in [`monitor/data/interfaces.json`](monitor/data/interfaces.json) (schema v2, hand-maintained, every claim backed by evidence).
The web app imports the generated [`src/data/interfaces.json`](src/data/interfaces.json), filtered to EVM networks; the Russian report
and the CSV snapshot in [`monitor/out/`](monitor/out/) cover the whole catalog, and dated frozen copies live in [`monitor/archive/`](monitor/archive/).

```
monitor/data/interfaces.json ──(pnpm monitor:build)──▶ src/data/interfaces.json + monitor/out/report.md + monitor/out/interfaces.csv
```

`pnpm monitor:build` validates the data (enums, ISO country tokens, repository consistency), computes `level`,
`fork_ready`, `category_group` and `chain_tags`, and writes all three outputs. It needs Python ≥ 3.9 (standard library
only) and is a maintainer tool: `pnpm build` never runs it. See [`monitor/README.md`](monitor/README.md) for the
schema, the static scanner and the evidence verifier, [`monitor/docs/roadmap.md`](monitor/docs/roadmap.md) for the
monitor architecture (live probes, proxies, mock wallet, scoring, alerts) and
[`monitor/prompts/auditor-agent.md`](monitor/prompts/auditor-agent.md) for the LLM auditor prompt.

## Languages

The site is published in English and Simplified Chinese. The language is part of the URL: English pages keep their
paths (`/monitor`, `/monitor/aave`, `/methodology`), Chinese pages live under `/zh` (`/zh/monitor`, `/zh/monitor/aave`,
`/zh/methodology`). The EN / 中文 dropdown in the header links to the same page in the other language; the last
choice is remembered and used only for `/` (browsers with a Chinese locale start in Chinese).

Strings live in `src/i18n/en.ts` (reference) and `src/i18n/zh.ts`, which is typed against it, so a missing translation
fails `pnpm build`; components read them through `useI18n()`, whose `path()` keeps internal links in the current
language. Protocol descriptions have a `description_zh` field in `monitor/data/interfaces.json`; technical fields quoted
from sources (mechanism details, providers, fork notes, evidence) stay in English.

## SEO and deployment

`pnpm build` prerenders every public route from `src/data/interfaces.json` (Vite plugin in `vite.config.mts`, code in
`src/seo/prerender.ts`), so crawlers and link previews get real HTML without running JavaScript:

- for each language (English at the root, Chinese under `zh/`): `monitor.html` (catalog table with links to every
  interface), `methodology.html` and `monitor/<id>.html` per interface, plus `index.html` / `zh.html` for `/` and `/zh`.
  Every page has its own `<title>`, meta description, `<html lang>`, canonical, `hreflang` alternates (`en`, `zh-Hans`,
  `x-default` → English), Open Graph/Twitter tags with `og:locale`, JSON-LD with `inLanguage` (`Dataset` + `WebSite` on
  the catalog, `WebPage` + `BreadcrumbList` elsewhere) and a static copy of the content in that language;
- `404.html` (`noindex`), `robots.txt`, `sitemap.xml` (every language version with `xhtml:link` hreflang alternates),
  `og-image.png`.

The app replaces the static content when it starts, and `src/seo/usePageMeta.ts` keeps `<head>` in sync during
client-side navigation.

Set the public origin before building, otherwise `sitemap.xml`, canonical URLs and `og:url` are skipped (the build warns):

```bash
VITE_SITE_URL=https://your.domain pnpm build
docker build --build-arg VITE_SITE_URL=https://your.domain .
```

Serve the routes as clean URLs without a single-page rewrite, so that `/monitor/aave` returns `monitor/aave.html` and
unknown paths return `404.html` with status 404:

- Docker: `serve dist -c ../serve.json` (already in the `Dockerfile`; `serve.json` enables clean URLs, disables directory listing, and caches `/assets` for a year);
- nginx: `try_files $uri $uri.html =404; error_page 404 /404.html;`;
- Netlify, Cloudflare Pages and GitHub Pages serve `.html` clean URLs and `404.html` out of the box.

## Getting Started

```bash
pnpm install
pnpm start        # dev server on http://localhost:3000
pnpm build        # tsc + vite build
pnpm lint         # eslint + prettier
pnpm knip         # unused files / exports
```

Updating the catalog:

```bash
# edit monitor/data/interfaces.json, then
pnpm monitor:build
pnpm build
```

Set `VITE_WALLETCONNECT_PROJECT_ID` in `.env` for WalletConnect (see `.env.example`). Chains and RPCs are configured in `src/wagmi-config.ts`.

## Application Links
- Permissionless interfaces: [pi.cp0x.com](https://pi.cp0x.com/)
- Twitter: [@cp0xdotcom](https://x.com/cp0xdotcom)
- Telegram: [@cp0xdotcom](https://t.me/cp0xdotcom)

## Contributions

For steps on local deployment, development, data changes and code contribution, please see [CONTRIBUTING](./CONTRIBUTING.md).
