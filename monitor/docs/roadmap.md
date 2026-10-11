# Plan: a monitor of DeFi interface restrictions for pi.cp0x.com

Goal: answer regularly, reproducibly and with evidence the question "what does official interface X block, for whom, with which mechanism, and does a fork get around it". The output is a public rating, a "what works from my country" page and links to permissionless alternatives from the catalog.

The current snapshot (`report.md`, `interfaces.json`) is in effect a manual run of steps P1–P3 and part of P6 of this plan. The data schema of `interfaces.json` moves into the project almost unchanged.

---

## 1. Architecture

```
registry/ (YAML in git)           ← list of interfaces: id, url, repo, chains, category, api_endpoints
        │
scheduler (Go)                    ← cron, task queue, retries, budgets
        │
  ┌─────┴───────────────┬───────────────────┬──────────────────┬──────────────────┐
P1 repo-watch      P2 static-scan     P3 edge-probe      P4/P5 browser+wallet   P6 api-probe   P7 tos-diff
(GitHub API,       (ripgrep+semgrep    (HTTP by country    (Playwright, HAR,       (quote/screen   (ToS render,
 mirrors)           over repos and JS   through proxies)    screenshots, mock       endpoints with  country
                    bundles)                                EIP-1193 wallet)        SDN/clean)      extraction)
        └─────────────┬─────────────────────────────────────────────────────────────┘
               artifacts (S3/minio: HAR, screenshots, bundles, ToS snapshots)
               findings (Postgres: append-only snapshots + evidence)
                      │
          LLM triage (classification, extraction, UI parsing only) → score + diff
                      │
       ┌──────────────┼──────────────────┬───────────────────────┐
  JSON API     static site /monitor   CSV/XLSX export     alerts (Telegram)
```

Principle: **deterministic probes produce artifacts; the LLM only classifies.** The agent does not "browse sites" freely. It gets a HAR, a screenshot, the list of network domains and the scanner hits, and gives a verdict by the schema. This is cheap and reproducible, and every statement points to an artifact.

Stack: Go for the orchestrator, API, scoring and export (the team's main stack). The P4/P5 probes are written in Node + Playwright, because `addInitScript`, `exposeFunction`, HAR and per-context proxies work out of the box there. Storage: Postgres + S3-compatible storage. The public part is static, generated from `latest.json`.

## 2. The check pipeline

| Step | What it does | Frequency | Output |
|---|---|---|---|
| **P1 repo-watch** | For every `frontend_repo`: visibility (public/private/404/archived), default branch, HEAD sha and date, ETag polling. On first discovery, `git clone --mirror` into our own storage (code gets closed). Production ↔ repo matching: build hash in the footer, `/_next/static/<buildId>`, IPFS CID, `version.json` | every 6 h | `repo` object, alert on a visibility change |
| **P2 static-scan** | Rules as in `scripts/scan.py` (ripgrep) plus AST-based semgrep rules. We look for: fetches to geo APIs, reads of `cf-ipcountry`/`x-vercel-ip-country`/`req.geo`, `netlify.toml` `conditions.Country`, screening calls (TRM/Chainalysis/Elliptic/Hypernative/own), `isSanctioned`, static address arrays, "blocked/restricted" modals. The fail mode is determined separately: what happens in `catch` and on an empty answer | on every new HEAD | findings with `repo@sha:path#L` |
| **P2b bundle-scan** (closed code) | Download the HTML and all JS chunks of the production site (from the P4 HAR), source maps if served, run the same rules over the bundle, extract endpoint URLs | weekly | the same findings, `kind=bundle` |
| **P3 edge-probe** | `GET url` without JS from each vantage country: status, redirect chain, headers (`server`, `cf-ray`, `x-vercel-id`, `x-nf-request-id`), body hash, keywords. Plus `GET https://<host>/cdn-cgi/trace`: the `loc=` field shows which country the site's own CDN sees; this is the best proxy verification | daily | country × status matrix |
| **P4 browser-probe** | Playwright, one context per country through a proxy: load, `networkidle`, HAR, console, screenshot, DOM text. Detection of geo modals and overlays, the list of third-party domains (`api.country.is`, `ipapi`, `*.workers.dev`, `trmlabs`, `hypernative`…) | weekly + on a P3 diff | HAR, screenshot, `geo_requests[]` |
| **P5 wallet-probe** | A mock EIP-1193/EIP-6963 wallet (below). Two runs: a clean address and an SDN address. Connect → wait for the network → capture the UI state → for a DEX go as far as the swap/deposit button (the signature is rejected). Screening requests (URL, body, answer), modals, disconnects and disabled buttons are recorded | weekly | `wallet_tests[]` |
| **P6 api-probe** | Public protocol APIs: quote/route/screen endpoints with SDN and clean addresses from several countries (LI.FI `/v1/quote`, Relay `/sanctioned/{a}`, dYdX `/v4/compliance/screen/{a}`, Kyber Blackjack, Synapse screener, Polymarket `/api/geoblock`, Across `/api/suggested-fees`, CoW quote/order validation…) | daily | `layer=api` findings |
| **P7 tos-diff** | Render the ToS (Playwright, ToS are often client-side), normalize the text, hash it. On a change, LLM extraction of the jurisdiction list into ISO codes and a diff with the previous version | weekly | `tos` object + diff |
| **P8 score+diff** | Compute the level (A/A?/B/C/D/?), sub-scores, comparison with the previous snapshot, alerts | after every run | `latest.json`, history |

### Mock wallet (P5)

No keys are needed or used. The provider returns an address, proxies read-only RPC through Node (to get around the CSP `connect-src`), rejects every signature with code 4001 and logs every call.

```ts
// probe/wallet.ts
export async function attachProbeWallet(page: Page, address: string, chainIdHex = '0x1') {
  await page.exposeFunction('__probeRpc', async (method: string, params: unknown[]) => {
    const r = await fetch(process.env.RPC_URL!, { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) });
    const j = await r.json(); if (j.error) throw new Error(JSON.stringify(j.error)); return j.result;
  });
  await page.addInitScript(({ address, chainIdHex }) => {
    const log: any[] = ((window as any).__walletLog = []);
    const listeners: Record<string, Function[]> = {};
    const reject = () => Object.assign(new Error('User rejected (probe)'), { code: 4001 });
    const provider: any = {
      isMetaMask: true,
      async request({ method, params }: { method: string; params?: unknown[] }) {
        log.push({ method, params, t: Date.now() });
        switch (method) {
          case 'eth_requestAccounts': case 'eth_accounts': return [address];
          case 'eth_chainId': return chainIdHex;
          case 'net_version': return String(parseInt(chainIdHex, 16));
          case 'wallet_switchEthereumChain': case 'wallet_addEthereumChain': return null;
          case 'wallet_requestPermissions': case 'wallet_getPermissions': return [{ parentCapability: 'eth_accounts' }];
          case 'personal_sign': case 'eth_sign': case 'eth_signTypedData_v4':
          case 'eth_sendTransaction': case 'wallet_sendCalls': throw reject();
          default: return (window as any).__probeRpc(method, params ?? []);
        }
      },
      on(e: string, f: Function) { (listeners[e] ||= []).push(f); return provider; },
      removeListener(e: string, f: Function) { listeners[e] = (listeners[e] || []).filter(x => x !== f); return provider; },
    };
    (window as any).ethereum = provider;
    const info = { uuid: crypto.randomUUID(), name: 'Probe Wallet', rdns: 'xyz.cp0x.probe',
      icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E' };
    const announce = () => window.dispatchEvent(new CustomEvent('eip6963:announceProvider', { detail: Object.freeze({ info, provider }) }));
    window.addEventListener('eip6963:requestProvider', announce); announce();
  }, { address, chainIdHex });
}
```

For Solana, a similar wallet-standard object (`registerWallet`) with the `publicKey` of an SDN address, if there is one on the SDN list.

Details already visible in the code:
- **Screening behind a session.** At Uniswap an unauthenticated client is "not blocked" (fail-open). At Sky a VPN or US user signs the ToS on every transaction. There is no signature for an SDN address, so we record the fact of the screening request and the server's answer, even if the UI does not let us go further.
- **Read-only/watch modes** at Aave skip the screening. It is the connected-wallet mode that has to be checked.
- **Screening before a transaction** (Kyber Blackjack in `sendTransaction`, Sky `/address/status/enhanced`). The flow has to be taken up to the confirmation button, not stopped at connect.

### Test addresses

- Before every run the SDN address is checked on-chain: `eth_call` to the Chainalysis Sanctions Oracle `0x40C57923924B5c5c5455c48D93317139ADDaC8fb`, `isSanctioned(address)` = selector `0xdf592f7d`. If it returns `false`, the address is dropped. Example: Tornado Cash was removed from the SDN list in 2025, yet Compound III still blocks it.
- A pool of 3–5 SDN addresses: different clusters (Lazarus, Garantex and others) and different chains. Source: the OFAC SDN XML (the Digital Currency Address fields) or derived lists (`ultrasoundmoney/ofac-ethereum-addresses`, `0xB10C/ofac-sanctioned-digital-currency-addresses`).
- Control addresses: a fresh EOA with no history and a "live" EOA with history. Kyber Blackjack gives a clean address a different `reason`, so both kinds are needed.
- **Read-only.** No signatures, no transactions, no real keys.

## 3. Proxies and vantage points

| Type | Why | Providers |
|---|---|---|
| Residential with country targeting (and region targeting: US states, Ontario/Quebec) | the main vantage; does not trigger VPN detectors | Bright Data, Oxylabs, Decodo (ex-Smartproxy), SOAX, IPRoyal |
| Mobile 4G/5G | strict VPN/IP reputation detectors | the same, mobile pools |
| Datacenter | **on purpose**: checks whether there is VPN detection (Sky, Euler and Polymarket behave differently on DC IPs) | any |
| Tor | Lido marks Tor (`T1`) as limited | a local tor |

First-wave countries: US, US-NY, CA-ON, GB, DE, FR, NL, PL, UA, TR, AE, SG, HK, JP, BR, AR, NG, VN, KZ, GE, plus RU and BY if the provider has a pool (often not).

**Sanctioned jurisdictions (IR, KP, SY, CU, occupied regions)** are usually not offered by commercial providers, and using such exits is legally questionable. Blocks for them are recorded as `inferred` from code and edge configs (`netlify.toml`, middleware, lists in the bundle), not by a live test. This is marked explicitly in the data.

Verification of every run: before the probe, `cdn-cgi/trace` on the target host (if it is behind Cloudflare) plus 2 independent geo APIs. If the countries disagree, the vantage is dropped. The evidence records `vantage = {country, region, proxy_type, exit_ip_asn, verified_by}`.

## 4. Data model

The base is `interfaces.json` from this snapshot. History and evidence are added as separate entities:

```
interface(id, name, category, chains[], url, frontend_repo, repo_path, api_endpoints[])
run(id, started_at, kind: repo|static|edge|browser|wallet|api|tos, vantage)
finding(id, run_id, interface_id, mechanism: geo_site|geo_feature|vpn|wallet_screening|asset_filter|tos_only,
        layer: edge|frontend|api|contract, provider, endpoint, countries[], fail_mode: open|closed|unknown,
        status: confirmed|inferred|tos_only|reported, confidence)
evidence(id, finding_id, kind: code|bundle|http|har|screenshot|doc|api, ref, sha256, observed_at)
snapshot(interface_id, at, level, scores{geo,screening,asset,vpn}, fork{ready, blockers[], gates_to_remove[]})
```

Export:
- `latest.json`: an array in the `interfaces.json` format.
- `history/<date>.json`.
- `matrix.json`: country × interface → `ok | blocked | close_only | feature_limited | screening_only | unknown`.
- CSV/XLSX: the same columns as `interfaces.csv`.

## 5. How to show the data on pi.cp0x.com

1. **/monitor: the rating.** A sortable table: level, mechanisms, screening provider, where it is enforced (edge/frontend/API/contract), check date, trend (an arrow when the level changes). Filters: category, chain, mechanism, "has an alternative in the catalog".
2. **/monitor?country=XX: "what works from my country".** A status column for the chosen country from `matrix.json` plus a link to the cp0x permissionless alternative if there is one. This is the main product screen.
3. **/monitor/<id>: the interface card.** A timeline of changes, screenshots by country, code links pinned to a sha, API answers to SDN/clean addresses, the ToS diff.
4. **Alerts.** A Telegram channel (the aggregator's existing bot can be reused) for events: a new geo-block, a ToS change, a repository turned private, a change of screening provider.
5. **A public JSON API and CSV/XLSX export** for researchers and the press. This is a good distribution channel for the catalog.

## 6. Schedule and budget

- P1, P3, P6 are cheap: daily or every 6 h.
- P4/P5 are expensive: ~60 interfaces × ~20 countries × 2 addresses. The full matrix once a week. Daily, only a rotation of 3–5 key countries. An unscheduled run on a P3, P6 or P1 diff.
- The LLM is used only on diffs: a changed HAR/DOM/ToS or new scanner hits. Stable interfaces spend no tokens.

## 7. Milestones

| Milestone | Contents | Done when |
|---|---|---|
| M1 | registry in YAML; P1 + P2 (port `scan.py`, add semgrep fail-mode rules); P6 for the known endpoints; JSON/CSV export | the current `interfaces.json` is reproduced automatically |
| M2 | P3 with 5 countries; P4 + P2b (bundles of closed frontends); P5 mock wallet | for the 29 closed interfaces the `A?`/`?` levels become definite |
| M3 | the full country matrix, scoring, history, alerts | diffs between runs and notifications |
| M4 | the /monitor page on pi.cp0x.com, the country view, the public API | publication |

## 8. Risks and limits

- Production ≠ repository (release mirrors, snapshots). That is why P2b over the real bundles is mandatory; P2 over the repository only shows "intent".
- Anti-bot (Cloudflare challenges, 403 on Relay's subpages) is not bypassed. CAPTCHAs are not solved; such vantages are marked `not_testable`.
- Scanner false positives: `elliptic` (a crypto library), Blockaid (transaction scanning in a wallet, not compliance), Hypernative Guard in Safe. The rules have to take context into account; the final verdict comes after triage.
- Tests with SDN addresses are read-only. No keys, no signatures, no transactions.

---

