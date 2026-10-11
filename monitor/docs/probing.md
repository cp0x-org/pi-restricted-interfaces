# P3: checking interfaces by country through a proxy

The script `monitor/scripts/probe.py` makes HTTP requests (without JavaScript) to the home page of every interface and to
the known geo endpoints (`geo_endpoints` in `data/interfaces.json`) from a chosen country through a proxy, checks that
the proxy really is in that country, and records observations. The observations go into `data/observations.json`;
`build.py` takes the latest verified ones from there and shows them on the site as the basis of an `observed` verdict.

What a probe proves: a block at the edge/server level for country X at time T from a given type of network. What it
does not prove: the absence of a block (the status `served` only means "the edge did not block"; client-side gates,
wallet screening and asset gates are checked by later stages, see `roadmap.md`, P4/P5).

## 1. Which proxies are needed

| Type | Why | Needed now |
|---|---|---|
| **Residential** with country targeting (and state/province targeting for US-NY, CA-ON) | the main vantage: ordinary home IPs that do not trigger VPN detectors | yes |
| Datacenter | on purpose: to check whether there is VPN/DC detection (Sky, Euler, Polymarket) | later; any cheap provider or your own VPS in the right country will do |
| Mobile | strict IP reputation detectors | later |
| Tor | Lido switches Tor to limited | a local `tor`, free |

Residential proxies are sold by traffic (per GB). P3 traffic is tiny: a home page without JS plus a couple of JSON
requests, around 10–20 MB per country, that is **0.2–0.4 GB for a full run of 57 interfaces in 20 countries**. 1–2 GB
covers several full runs; weekly runs cost a few dollars a month. A future browser run (P4) costs more: 1–3 GB per full
pass with images and fonts blocked.

Commercial providers do not sell sanctioned jurisdictions (IR, KP, SY, CU, occupied regions), and using such exits is
legally questionable. For them the catalog keeps the basis `inferred` from code and configs.

## 2. Where to buy

Prices and terms change; check the pricing page and the payment methods at checkout before buying. As of October 2026
(from reviews, not verified by paying):

| Provider | Pay-as-you-go, residential | Payment | Note |
|---|---|---|---|
| **Decodo** (formerly Smartproxy) | ≈ $3.5–4 / GB, cheaper in volume | card; crypto for residential not confirmed | country / state / city targeting, a 3-day trial, clear documentation. The recommended start |
| **IPRoyal** | from ≈ $7 / GB at small volumes (the advertised "$1.75" is for large packages) | card, crypto through CoinGate | traffic does not expire, country / state / city targeting |
| **DataImpulse** | ≈ $1 / GB, minimum $5 | card, BTC, USDT (TRC20) | the cheapest; a free trial volume; a lower-quality pool, enough for HTTP probes |
| **Bright Data** | ≈ $8 / GB list price (promotions down to $4) | card, no crypto | the largest pool, but as of July 2026 new residential accounts are only for companies with a corporate email. Not for a start |
| Oxylabs, SOAX | ≈ $4–8 / GB | card | corporate onboarding, mobile pools available. Later, if mobile is needed |

My choice for the first iteration: **Decodo**, 2 GB pay-as-you-go. If paying in crypto matters: **IPRoyal** or
**DataImpulse**.

Sources: price reviews [byteful](https://byteful.com/blog/cheapest-proxies), [trustmyip](https://trustmyip.com/blog/best-residential-proxy-providers),
[roundproxies: Decodo vs Bright Data](https://roundproxies.com/blog/decodo-vs-bright-data/), [roundproxies: Decodo vs IPRoyal](https://roundproxies.com/blog/decodo-vs-iproyal/),
[IPRoyal, paying in crypto](https://iproyal.com/other-proxies/buy-a-proxy-with-crypto-bitcoin/), [DataImpulse](https://dataimpulse.com/blog/cheapest-proxies/),
[Decodo FAQ on port 7000](https://decodo.com/faq/getting-started/what-are-sticky-and-rotating-sessions).

## 3. How to get access (Decodo as the example)

1. Sign up at decodo.com and confirm your email. The trial and purchases need a card.
2. Dashboard → Residential → choose the Pay As You Go plan and buy 2 GB.
3. Residential → **Proxy setup**: create a user (username + password), choose the **Rotating** session type (port
   `7000`), and pick a country under Location. The dashboard shows a ready string like
   `user-<your_login>-country-us:<password>@gate.decodo.com:7000`. The format comes from it: the country goes into the
   user name.
4. Check from a terminal that the exit really is in the right country:

   ```bash
   curl -s -x "http://user-<login>-country-ua:<password>@gate.decodo.com:7000" https://api.country.is/
   # expect {"ip":"...","country":"UA"}
   ```

With other providers only the user string and the host differ, for example (copy the exact string from the
provider's dashboard; these are templates):

| Provider | Template |
|---|---|
| Decodo, residential | `http://user-LOGIN-country-{cc}:PASS@gate.decodo.com:7000` |
| Decodo, ISP (trial) | `http://user-LOGIN-country-{cc}:PASS@isp.decodo.com:10001`, `PROBE_PROXY_TYPE=isp` |
| IPRoyal | `http://LOGIN:PASS_country-{cc}@geo.iproyal.com:12321` |
| DataImpulse | `http://LOGIN__cr.{cc}:PASS@gw.dataimpulse.com:823` |
| Bright Data | `http://brd-customer-ID-zone-ZONE-country-{cc}:PASS@brd.superproxy.io:33335` |
| Oxylabs | `http://customer-LOGIN-cc-{CC}:PASS@pr.oxylabs.io:7777` |

The script replaces `{cc}` with the country code in lower case and `{CC}` in upper case. Every provider sets regions
(state, province) in its own way, so for tokens like `US-NY` and `CA-ON` the string is given in a separate variable
(see below).

## 4. Setup and running

Nothing needs to be installed: the script is Python 3.9+ with the standard library only. Secrets are kept in
`.env.probe` at the project root (the file is in `.gitignore`):

```bash
cat > .env.probe <<'ENV'
PROBE_PROXY_URL=http://user-LOGIN-country-{cc}:PASS@gate.decodo.com:7000
PROBE_PROXY_URL_US_NY=http://user-LOGIN-country-us-state-us_new_york:PASS@gate.decodo.com:7000
PROBE_PROXY_URL_CA_ON=http://user-LOGIN-country-ca-city-toronto:PASS@gate.decodo.com:7000
PROBE_PROXY_TYPE=residential   # or isp / datacenter / mobile
PROBE_DELAY=1.0
# URL-encode special characters in the password: '+' -> %2B, '@' -> %40, '/' -> %2F
ENV
set -a; source .env.probe; set +a
```

Take the exact names of the state and province parameters from your provider's Proxy setup (Decodo targets Canadian
provinces through a city).

A trial run on three interfaces from one country:

```bash
pnpm monitor:probe -- --countries UA --only polymarket,hop,ethena
```

The first line of the output is the vantage: `ip_country=UA asn=... verified=True by=['api.country.is', 'ipapi.co']`.
If `verified=False` (both geo services see another country, or the proxy does not answer), the targets for that country
are skipped and nothing gets into the data.

A full run of the first wave of countries:

```bash
pnpm monitor:probe -- --countries US,US-NY,CA-ON,GB,DE,FR,NL,PL,UA,TR,AE,SG,HK,JP,BR,AR,NG,VN,KZ,GE
```

The result is the file `monitor/probe/out/<date>_<type>.json` (in `.gitignore`). To add it to the observation store
and rebuild the site's data:

```bash
pnpm monitor:probe:merge -- monitor/probe/out/<file>.json
pnpm monitor:build
pnpm build
```

After that the "By country" page shows the basis `observed` with the date and proxy type for the checked countries,
and the interface card shows the "Live observations by country" table. Commit `monitor/data/observations.json` and
`src/data/interfaces.json` together.

A datacenter run to check VPN detection uses the same script with another proxy:

```bash
PROBE_PROXY_URL=http://LOGIN:PASS@dc-gateway:PORT PROBE_PROXY_TYPE=datacenter pnpm monitor:probe -- --countries US,DE
```

Local Tor: `PROBE_PROXY_URL=socks5h://127.0.0.1:9050` is not supported for now (the Python standard library has no
SOCKS); Tor needs an HTTP gateway such as `privoxy`, then `PROBE_PROXY_URL=http://127.0.0.1:8118 PROBE_PROXY_TYPE=tor`.

## 5. How to read the result

| `ui_state` | Meaning |
|---|---|
| `blocked` | HTTP 451/403 without a challenge, a redirect to a page like `/blocked` or `/restricted`, or a geo endpoint answered `blocked: true` / `isRegionRestricted: true` |
| `close_only`, `feature_limited` | only from geo endpoints (`limited: true` and the like) |
| `challenge` | a Cloudflare challenge or CAPTCHA: not tested, we do not solve CAPTCHAs |
| `ok` | the home page was served; client-side gates were not evaluated |
| `error` | a timeout, 5xx; does not get into the site's data |

Each observation keeps: the country according to two geo services, the ASN, `loc=` from `/cdn-cgi/trace` for hosts
behind Cloudflare, the redirect chain, the edge headers (`server`, `cf-ray`), a hash and an excerpt of the body. This is
the evidence for the verdict.

## 6. Rules

- Observation only: no logins, no CAPTCHA bypass, no wallets and no transactions.
- One GET per target per country with a pause (`PROBE_DELAY`), once a week. This is neither load nor a bypass of
  protections.
- We do not probe sanctioned jurisdictions.
- The Terms of some interfaces forbid "circumventing geofencing". A probe circumvents nothing: the request comes from a
  real country and records the operator's answer. Still, these are their Terms, and the probe should run on behalf of
  the project, not from personal accounts.

## 7. Notes on the first run (2026-10-08, Decodo ISP trial)

- The Decodo trial gives **ISP proxies** (`isp.decodo.com:10001`), not rotating residential ones. The pool is limited:
  AU, US and DE answer, UA does not. The proxy type is recorded as `isp` in the data.
- The US vantage was confirmed by three services (AS5650 Verizon Business). The DE vantage was **not confirmed**:
  ifconfig.co geolocates the same IP (AS8881 1&1 Versatel) to India, the other two services to Germany. This is common
  for ISP/datacenter ranges: geolocation databases disagree, and interface operators (Cloudflare, Vercel) may see the
  country differently. A real run needs a residential plan.
- The Decodo proxy did not open a tunnel to `app.sky.money` and `api.sky.money` (`CONNECT` → 403 Forbidden from the
  proxy itself). This is a limitation of the provider, not of Sky; such targets stay `error` and do not get into the
  site's data.
- Confirmed from the US: Ethena redirects to `/restricted`, Polymarket's `/api/geoblock` answers `blocked: true` (the
  site's status for the US stays close-only, and the observation confirms it). Euler's `/api/ping` answers 403 without
  geo wording and is classified as `unknown`.
- Polymarket's home page sends its body slowly, and reading it hit the timeout (`PROBE_TIMEOUT`); for a rerun raise it
  to 40–60 seconds.

## 8. Second run (2026-10-09, Decodo ISP trial, 12 new protocols)

- 5 of 13 vantages confirmed: US (AS5650), GB (AS212286), NL (AS10753), AU (AS3356), JP (AS3356).
- Rejected DE, FR, CA, SG, BR: two services see the right country, ifconfig.co another one (IN, GB, GB, TR, US). The
  pool did not provide UA, AE, TR.
- The home pages of Ondo, Superstate, Lombard, Usual, deBridge, Frax, Kelp, Symbiotic, OpenSea and Tornado (IPFS) are
  served in all 5 countries: there is no edge-level block; their restrictions work through KYC, the app or the terms.
- app.maple.finance and app.centrifuge.io answer ISP addresses with a Cloudflare challenge: such targets are marked
  `challenge` (not tested) and can only be checked by a browser probe (P4).
- A possible improvement of the verification: accept a vantage when most services agree and `loc=` from the target
  host's `/cdn-cgi/trace` matches.

## 9. Decodo residential pool (since 2026-10-12)

- The ISP trial pool stopped authorizing requests (HTTP 407) in the middle of the 2026-10-11 run.
- The dashboard shows the purchased residential access as `gate.decodo.com:10001:LOGIN:PASSWORD`. Port `10001` is a
  sticky session with a random country (it gave Saudi Arabia); the country cannot be chosen on it.
- The working template for probes: port `7000` and the country in the user name:
  `PROBE_PROXY_URL=http://user-LOGIN-country-{cc}:PASSWORD@gate.decodo.com:7000` (`+` in the password is `%2B`).
  States: `user-LOGIN-country-us-state-us_new_york`; Canadian provinces through a city:
  `user-LOGIN-country-ca-city-toronto`.
- Verified on 2026-10-12: the vantage was confirmed by three geo services in all 20 countries of the first wave; the
  exits are home networks (RCN, Charter, BT, Virgin Media, KPN, Vodafone, Bell, Vodafone Ukraine and others).
- The secrets are in `research/.env` and `.env.probe` (both in `.gitignore`); an example without the password is
  `research/.env.example`.
