# Как добавить новый протокол

Всё делается в одном файле `monitor/data/interfaces.json`, остальное генерируется командой.

## 1. Соберите факты (15–30 минут на протокол)

- **Официальный интерфейс**: точный URL приложения (не лендинга).
- **Код фронтенда**: есть ли публичный репозиторий на GitHub. Проверка: `git ls-remote https://github.com/<org>/<repo>`.
- **Terms of Service**: ссылка, дата редакции, список запрещённых стран, ограничения для US persons, пункт про VPN.
- **Документация**: страницы «eligibility», «restricted jurisdictions», «compliance», упоминания KYC и скрининга кошельков (TRM, Chainalysis и т.п.).
- **Сети**: на каких EVM-сетях работает официальное приложение.
- Для каждого утверждения сохраните ссылку-доказательство.

## 2. Добавьте запись

Скопируйте шаблон в конец массива `interfaces` (перед закрывающей `]`) и заполните:

```json
{
  "id": "myprotocol",
  "name": "My Protocol",
  "description": "My Protocol is a lending market on Ethereum where users supply assets to earn interest and borrow against collateral. (80–600 characters, one paragraph in English)",
  "description_zh": "My Protocol 是以太坊上的借贷市场，用户存入资产赚取利息，并以抵押品借款。（可选，20–600 字）",
  "category": "Lending",
  "chains": "Ethereum, Arbitrum",
  "networks": ["Ethereum", "Arbitrum"],
  "url": "https://app.myprotocol.xyz",
  "frontend_repo": null,
  "repo_state": "closed",
  "repo_status": "closed",
  "repo_last_commit": null,
  "geo_site": { "s": "tos_only", "countries": [], "close_only": [], "method": "Как реализована блокировка сайта" },
  "geo_feature": { "s": "unknown", "countries": [], "scope": "" },
  "vpn": { "s": "unknown", "note": "" },
  "screening": { "s": "unknown", "provider": "", "layer": null, "fail": null, "fail_note": "" },
  "asset_filter": "",
  "tos": {
    "url": "https://myprotocol.xyz/terms",
    "updated": "2026-01-01",
    "us": "yes",
    "us_scope": "",
    "restricted": "Список стран своими словами",
    "restricted_codes": ["US", "RU", "IR", "KP", "UA-Crimea"]
  },
  "fork_notes": "Что нужно убрать или поднять, чтобы сделать permissionless-версию.",
  "live": [],
  "geo_endpoints": [],
  "evidence": ["https://myprotocol.xyz/terms", "https://docs.myprotocol.xyz/eligibility"],
  "confidence": "medium",
  "alternatives": []
}
```

Шпаргалка по значениям:

| Поле | Значения |
|---|---|
| `s` (статус любого механизма) | `yes` подтверждено кодом, живой проверкой или документацией · `reported` пресса/пользователи · `tos_only` только в условиях · `optional` в коде, выключено · `no` проверено, нет · `unknown` не проверено |
| страны | ISO-коды (`US`, `GB`, `DE`) или регионы `UA-Crimea`, `UA-DPR`, `UA-LPR`, `UA-Kherson`, `UA-Zaporizhzhia`, `US-NY`, `CA-ON`, `CA-BC`, `CA-AB`, `CA-QC`, `GE-Abkhazia`, `GE-SouthOssetia`, `CY-North` |
| `layer` (где работает проверка) | `edge` · `frontend` · `own-api` (API только официального сайта) · `protocol-api` (API, без которого не работает никто, форк не поможет) · `null` |
| `repo_state` | `open` · `open_stale` · `closed` · `private_now` · `archived` · `none_found` (если `closed`, то `frontend_repo: null`) |
| `tos.us` | `yes` US persons запрещены · `no` · `partial` (опишите в `us_scope`) · `unknown` |
| `confidence` | `high` · `medium` · `low` |

Необязательные поля:
- `"kyc": { "s": "yes", "layer": "protocol-api", "scope": "что закрыто KYC" }` — KYC или allowlist кошельков (считается как одно ограничение).
- `"alternatives": [{ "name": "myprotocol.cp0x.com", "url": "https://myprotocol.cp0x.com" }]` — если на pi.cp0x.com есть permissionless-версия (строка поднимется вверх).
- Версии протокола — см. раздел ниже.

Рейтинг считается автоматически по числу ограничений: каждая заблокированная страна (сайт, торговля или функции, статус `yes` или `reported`) плюс по одному за ограничение функций, скрининг, детект VPN и KYC. Запреты только в ToS не считаются. A — 0 (ограничений нет), B — 1–5, C — 6–20, D — больше 20, n/a — ничего не определено. Группа категории и теги сетей тоже считаются сами, их не пишите.

### Если у протокола несколько версий

Каждая версия со своим официальным интерфейсом — отдельная запись (как `aave` и `aave-pro`, `notional` и `notional-v3`).

```json
"version": "V3",
"family": "notional",
"lifecycle": "legacy",
"lifecycle_note": "Сворачивается после взлома в ноябре 2025; приложение переехало на v3.notional.finance."
```

- `version` — метка после названия: «Notional» + «V3» = «Notional V3».
- `family` — общий id всех версий одного протокола; на странице версии появятся ссылки на остальные.
- `lifecycle`: `current` (по умолчанию, можно не писать), `legacy` (сам протокол выводит версию из оборота: баннер о депрекейте, поддомен `v2.`/`v3.`, объявление о закрытии — строка уходит вниз с пометкой), `defunct` (официальный интерфейс не работает — на сайте не показывается).
- `lifecycle_note` обязателен для `legacy` и `defunct`: причина и дата или источник.

## 3. Соберите и проверьте

```bash
pnpm monitor:build    # проверит схему; при ошибке покажет id и поле
pnpm build            # соберёт сайт (+ страницы /monitor/<id> и /zh/monitor/<id>, sitemap)
pnpm start            # открыть http://localhost:3000/monitor/<id> и /zh/monitor/<id>
```

Если `monitor:build` ругается, исправьте поле, которое он назвал, и запустите снова.

## 4. По желанию: живая проверка из стран

```bash
set -a; source .env.probe; set +a                     # креды прокси, см. monitor/docs/probing.md
pnpm monitor:probe -- --countries US,DE,UA --only myprotocol
pnpm monitor:probe:merge -- monitor/probe/out/<файл>.json
pnpm monitor:build
```

## 5. Опубликуйте

Закоммитьте `monitor/data/interfaces.json`, `src/data/interfaces.json` и `monitor/out/*`, затем задеплойте
(`docker build .`, домен `https://restricted.cp0x.com` уже прописан).
