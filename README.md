# DeFi Interface Restrictions Monitor by cp0x

A public catalog of access restrictions in the official web interfaces of DeFi protocols: site-level geo-blocking,
feature and asset gating by country, wallet screening, VPN detection and Terms-of-Service exclusions. For every
interface the catalog records where the restriction is enforced (edge, frontend, the operator's own API or the
protocol API) and whether a permissionless fork removes it, with links to the code paths, documents and API
responses the verdict is based on.

Built on the cp0x Permissionless Interface boilerplate (Berry MUI template: React 19 + Vite + MUI 7) with wallet
connectivity (wagmi + RainbowKit) left in place.

## Pages

- `/monitor` — ranking of all interfaces: level A/A?/B/C/D/?, mechanisms, screening provider and layer, fork readiness, frontend code status; filters by category, chain, level, layer, mechanism and open-source-only
- `/monitor/:id` — interface card: repository, each mechanism with countries and fail mode, Terms of Service summary, fork notes, live checks, evidence links pinned to the repository branch
- `/country/:code` — "what works from my country": per-country status for every interface (blocked, close-only, feature-limited, regional, ToS only, unknown, no restriction found) with the basis of each verdict
- `/methodology` — levels, status vocabulary, layers, country rules, detection typology, live-check caveats and limitations

## Data

The dataset lives in [`monitor/data/interfaces.json`](monitor/data/interfaces.json) (schema v2, hand-maintained, every claim backed by evidence).
The web app imports the generated [`src/data/interfaces.json`](src/data/interfaces.json); the Russian report and the CSV
snapshot are in [`monitor/out/`](monitor/out/).

```
monitor/data/interfaces.json ──(pnpm monitor:build)──▶ src/data/interfaces.json + monitor/out/report.md + monitor/out/interfaces.csv
```

`pnpm monitor:build` validates the data (enums, ISO country tokens, repository consistency), computes `level`,
`fork_ready`, `category_group` and `chain_tags`, and writes all three outputs. It needs Python ≥ 3.9 (standard library
only) and is a maintainer tool: `pnpm build` never runs it. See [`monitor/README.md`](monitor/README.md) for the
schema, the static scanner and the evidence verifier, [`monitor/docs/roadmap.md`](monitor/docs/roadmap.md) for the
monitor architecture (live probes, proxies, mock wallet, scoring, alerts) and
[`monitor/prompts/auditor-agent.md`](monitor/prompts/auditor-agent.md) for the LLM auditor prompt.

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
