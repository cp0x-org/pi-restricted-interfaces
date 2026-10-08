# План: монитор ограничений DeFi-интерфейсов для pi.cp0x.com

Цель: регулярно, воспроизводимо и с доказательствами отвечать на вопрос «что официальный интерфейс X блокирует, для кого, каким механизмом и обходится ли это форком». На выходе получаются публичный рейтинг, страница «что работает из моей страны» и ссылки на permissionless-альтернативы из каталога.

Текущий срез (`report.md`, `interfaces.json`) — это фактически ручной прогон шагов P1–P3 и частично P6 из этого плана. Схема данных из `interfaces.json` переносится в проект почти без изменений.

---

## 1. Архитектура

```
registry/ (YAML в git)            ← список интерфейсов: id, url, repo, chains, category, api_endpoints
        │
scheduler (Go)                    ← cron, очередь задач, ретраи, бюджеты
        │
  ┌─────┴───────────────┬───────────────────┬──────────────────┬──────────────────┐
P1 repo-watch      P2 static-scan     P3 edge-probe      P4/P5 browser+wallet   P6 api-probe   P7 tos-diff
(GitHub API,       (ripgrep+semgrep    (HTTP по странам    (Playwright, HAR,       (quote/screen   (рендер ToS,
 зеркала)           по репо и JS-       через прокси)       скриншоты, mock         эндпоинты с     извлечение
                    бандлам)                                EIP-1193 кошелёк)       SDN/clean)      стран)
        └─────────────┬─────────────────────────────────────────────────────────────┘
               artifacts (S3/minio: HAR, скриншоты, бандлы, ToS-снапшоты)
               findings (Postgres: append-only snapshots + evidence)
                      │
          LLM-триаж (только классификация, извлечение, разбор UI) → score + diff
                      │
       ┌──────────────┼──────────────────┬───────────────────────┐
  JSON API     static site /monitor   CSV/XLSX export     алерты (Telegram)
```

Принцип: **детерминированные пробы производят артефакты, LLM только классифицирует.** Агент не «ходит по сайтам» свободно. Он получает HAR, скриншот, список сетевых доменов, хиты сканера и выносит вердикт по схеме. Так получается дёшево, воспроизводимо, и каждое утверждение ссылается на артефакт.

Стек: Go для оркестратора, API, скоринга и экспорта (основной стек команды). Пробы P4/P5 пишутся на Node + Playwright, потому что `addInitScript`, `exposeFunction`, HAR и прокси на уровне контекста там из коробки. Хранилище: Postgres + S3-совместимое хранилище. Публичная часть — статика, генерируемая из `latest.json`.

## 2. Пайплайн проверок

| Шаг | Что делает | Частота | Выход |
|---|---|---|---|
| **P1 repo-watch** | Для каждого `frontend_repo`: видимость (public/private/404/archived), default branch, HEAD sha и дата, ETag-поллинг. При первом обнаружении — `git clone --mirror` в своё хранилище (код закрывают). Сверка прод ↔ репо: хэш сборки в футере, `/_next/static/<buildId>`, IPFS CID, `version.json` | каждые 6 ч | `repo` объект, алерт на смену видимости |
| **P2 static-scan** | Правила как в `scripts/scan.py` (ripgrep) плюс semgrep-правила с AST. Ищем: fetch к гео-API, чтение `cf-ipcountry`/`x-vercel-ip-country`/`req.geo`, `netlify.toml` `conditions.Country`, вызовы скрининга (TRM/Chainalysis/Elliptic/Hypernative/own), `isSanctioned`, статические массивы адресов, модалки «blocked/restricted». Отдельно определяется fail-mode: что происходит в `catch` и при пустом ответе | на каждый новый HEAD | findings с `repo@sha:path#L` |
| **P2b bundle-scan** (закрытый код) | Скачать HTML и все JS-чанки прод-сайта (из HAR P4), source maps если отдаются, прогнать те же правила по бандлу, вытащить URL эндпоинтов | еженедельно | те же findings, `kind=bundle` |
| **P3 edge-probe** | `GET url` без JS из каждой страны-вантажа: статус, цепочка редиректов, заголовки (`server`, `cf-ray`, `x-vercel-id`, `x-nf-request-id`), хэш тела, ключевые слова. Плюс `GET https://<host>/cdn-cgi/trace`: поле `loc=` показывает, какую страну видит CDN самого сайта, — это лучшая верификация прокси | ежедневно | матрица страна × статус |
| **P4 browser-probe** | Playwright, контекст на страну через прокси: загрузка, `networkidle`, HAR, консоль, скриншот, DOM-текст. Детект гео-модалок и оверлеев, список сторонних доменов (`api.country.is`, `ipapi`, `*.workers.dev`, `trmlabs`, `hypernative`…) | еженедельно + при диффе P3 | HAR, скриншот, `geo_requests[]` |
| **P5 wallet-probe** | Mock EIP-1193/EIP-6963 кошелёк (ниже). Два прогона: clean-адрес и SDN-адрес. Connect → дождаться сети → снять UI-состояние → для DEX дойти до кнопки свапа/депозита (подпись отклоняется). Фиксируются запросы скрининга (URL, тело, ответ), модалки, дисконнект, disabled-кнопки | еженедельно | `wallet_tests[]` |
| **P6 api-probe** | Публичные API протоколов, от которых зависит любой форк: quote/route/screen-эндпоинты с SDN и clean адресами из нескольких стран (LI.FI `/v1/quote`, Relay `/sanctioned/{a}`, dYdX `/v4/compliance/screen/{a}`, Kyber Blackjack, Synapse screener, Polymarket `/api/geoblock`, Across `/api/suggested-fees`, CoW quote/order validation…) | ежедневно | `layer=protocol-api` findings |
| **P7 tos-diff** | Рендер ToS (Playwright, ToS часто client-side), нормализация текста, хэш. При изменении — LLM-извлечение списка юрисдикций в ISO-коды и диф с прошлой версией | еженедельно | `tos` объект + diff |
| **P8 score+diff** | Расчёт уровня (A/A?/B/C/D/?), sub-scores, сравнение с прошлым снапшотом, алерты | после каждого прогона | `latest.json`, история |

### Mock-кошелёк (P5)

Ключи не нужны и не используются. Провайдер отдаёт адрес, проксирует read-only RPC через Node (обход CSP `connect-src`), отклоняет любые подписи кодом 4001 и логирует все вызовы.

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

Для Solana — аналогичный объект wallet-standard (`registerWallet`) с `publicKey` SDN-адреса, если он есть в SDN.

Нюансы, которые уже видны из кода:
- **Скрининг за сессией.** У Uniswap неаутентифицированный клиент «не заблокирован» (fail-open). У Sky VPN- и US-пользователь подписывает ToS на каждую транзакцию. Для SDN-адреса подписи нет, поэтому фиксируем факт запроса скрининга и ответ сервера, даже если UI дальше не пустит.
- **Read-only/watch режимы** у Aave пропускают скрининг. Нужно проверять именно режим подключённого кошелька.
- **Скрининг перед транзакцией** (Kyber Blackjack в `sendTransaction`, Sky `/address/status/enhanced`). Флоу надо довести до кнопки подтверждения, а не останавливаться на connect.

### Тестовые адреса

- SDN-адрес перед каждым прогоном проверяется on-chain: `eth_call` к Chainalysis Sanctions Oracle `0x40C57923924B5c5c5455c48D93317139ADDaC8fb`, `isSanctioned(address)` = selector `0xdf592f7d`. Если `false` — адрес выкидывается. Пример: Tornado Cash сняли с SDN в 2025, а Compound III их всё ещё блокирует.
- Пул из 3–5 SDN-адресов: разные кластеры (Lazarus, Garantex и т.п.) и разные цепочки. Источник — OFAC SDN XML (поля Digital Currency Address) или производные списки (`ultrasoundmoney/ofac-ethereum-addresses`, `0xB10C/ofac-sanctioned-digital-currency-addresses`).
- Контрольные адреса: свежий EOA без истории и «живой» EOA с историей. У Kyber Blackjack у чистого адреса другой `reason`, поэтому нужны оба типа.
- **Только чтение.** Никаких подписей и транзакций, никаких реальных ключей.

## 3. Прокси и точки наблюдения

| Тип | Зачем | Провайдеры |
|---|---|---|
| Residential с таргетингом по стране (и региону: US-штаты, Ontario/Quebec) | основной вантаж; не триггерит VPN-детекторы | Bright Data, Oxylabs, Decodo (ex-Smartproxy), SOAX, IPRoyal |
| Mobile 4G/5G | строгие VPN/IP-reputation детекторы | те же, mobile-пулы |
| Datacenter | **намеренно**: проверяет, есть ли VPN-детект (Sky, Euler, Polymarket ведут себя по-разному на DC-IP) | любой |
| Tor | Lido маркирует Tor (`T1`) как limited | локальный tor |

Набор стран первой волны: US, US-NY, CA-ON, GB, DE, FR, NL, PL, UA, TR, AE, SG, HK, JP, BR, AR, NG, VN, KZ, GE, плюс RU и BY, если провайдер даёт пул (часто нет).

**Санкционные юрисдикции (IR, KP, SY, CU, оккупированные регионы)** коммерческие провайдеры обычно не предоставляют, и использовать такие выходы юридически сомнительно. Блоки для них фиксируются как `inferred` по коду и конфигам edge (`netlify.toml`, middleware, списки в бандле), а не живым тестом. Это явно помечается в данных.

Верификация каждого прогона: перед пробой — `cdn-cgi/trace` на целевом хосте (если он за Cloudflare) плюс 2 независимых гео-API. Если страны расходятся — вантаж отбрасывается. В доказательство пишется `vantage = {country, region, proxy_type, exit_ip_asn, verified_by}`.

## 4. Модель данных

Базой служит `interfaces.json` из этого среза. Добавляется история и доказательства как отдельные сущности:

```
interface(id, name, category, chains[], url, frontend_repo, repo_path, api_endpoints[])
run(id, started_at, kind: repo|static|edge|browser|wallet|api|tos, vantage)
finding(id, run_id, interface_id, mechanism: geo_site|geo_feature|vpn|wallet_screening|asset_filter|tos_only,
        layer: edge|frontend|own-api|protocol-api, provider, endpoint, countries[], fail_mode: open|closed|unknown,
        status: confirmed|inferred|tos_only|reported, confidence)
evidence(id, finding_id, kind: code|bundle|http|har|screenshot|doc|api, ref, sha256, observed_at)
snapshot(interface_id, at, level, scores{geo,screening,asset,vpn}, fork{ready, blockers[], gates_to_remove[]})
```

Экспорт:
- `latest.json` — массив в формате `interfaces.json`.
- `history/<date>.json`.
- `matrix.json` — страна × интерфейс → `ok | blocked | close_only | feature_limited | screening_only | unknown`.
- CSV/XLSX: те же колонки, что в `interfaces.csv`.

## 5. Как выводить данные на pi.cp0x.com

1. **/monitor — рейтинг.** Сортируемая таблица: уровень, механизмы, провайдер скрининга, где исполняется (edge/фронт/свой API/API протокола), fork-ready, дата проверки, тренд (стрелка при смене уровня). Фильтры: категория, сеть, механизм, «есть альтернатива в каталоге».
2. **/monitor?country=XX — «что работает из моей страны».** Колонка статуса для выбранной страны из `matrix.json` плюс ссылка на permissionless-альтернативу cp0x, если она есть. Это главный продуктовый экран.
3. **/monitor/<id> — карточка интерфейса.** Хронология изменений, скриншоты по странам, ссылки на код, закреплённые на sha, ответы API на SDN/clean адреса, диф ToS.
4. **Алерты.** Telegram-канал (можно переиспользовать существующий бот агрегатора) на события: новый гео-блок, смена ToS, репо стал приватным, смена провайдера скрининга.
5. **Публичный JSON API и CSV/XLSX-выгрузка** — для исследователей и прессы. Это хороший дистрибуционный канал для каталога.

## 6. Расписание и бюджет

- P1, P3, P6 — дешёвые, ежедневно или каждые 6 ч.
- P4/P5 — дорогие: ~60 интерфейсов × ~20 стран × 2 адреса. Полная матрица раз в неделю. Ежедневно — только ротация 3–5 ключевых стран. Внеплановый прогон при диффе P3, P6 или P1.
- LLM используется только на дифах: изменился HAR/DOM/ToS или появились новые хиты сканера. Стабильные интерфейсы не тратят токены.

## 7. Этапы

| Этап | Содержание | Критерий готовности |
|---|---|---|
| M1 | registry в YAML; P1 + P2 (портировать `scan.py`, добавить semgrep-правила fail-mode); P6 для известных эндпоинтов; экспорт JSON/CSV | воспроизводит текущий `interfaces.json` автоматически |
| M2 | P3 с 5 странами; P4 + P2b (бандлы закрытых фронтендов); P5 mock-кошелёк | для 29 закрытых интерфейсов уровни `A?`/`?` превращаются в определённые |
| M3 | полная матрица стран, скоринг, история, алерты | диф между прогонами и уведомления |
| M4 | страница /monitor на pi.cp0x.com, country view, публичный API | публикация |

## 8. Риски и ограничения

- Прод ≠ репо (release mirror, снапшоты). Поэтому P2b по реальным бандлам обязателен, P2 по репо даёт только «намерение».
- Антибот (Cloudflare challenge, 403 на подстраницах у Relay) не обходится. CAPTCHA не решается, такие вантажи помечаются `not_testable`.
- Ложные срабатывания сканера: `elliptic` (крипто-либа), Blockaid (скан транзакций в кошельке, не compliance), Hypernative Guard в Safe. Правила должны учитывать контекст, финальный вердикт — после триажа.
- Тесты с SDN-адресами только read-only. Ключей нет, подписей и транзакций нет.

---

