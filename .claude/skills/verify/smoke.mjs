import { chromium } from 'playwright-core';
import { execSync } from 'node:child_process';

const BASE = process.env.SMOKE_BASE || 'http://localhost:3000';
import { readFileSync } from 'node:fs';
const DATA = JSON.parse(readFileSync(process.env.SMOKE_DATA || new URL('../../../src/data/interfaces.json', import.meta.url))).interfaces;
const N = DATA.length, N_D = DATA.filter((i) => i.level === 'D').length, N_OPEN = DATA.filter((i) => i.frontend_repo).length;
const PER_PAGE = 100; // MonitorPage default rows per page
const PAGES = Math.ceil(N / PER_PAGE);
const FIRST_PAGE = Math.min(N, PER_PAGE);
const exe = execSync('ls -d ~/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-mac-arm64/chrome-headless-shell | tail -1', { shell: '/bin/zsh' }).toString().trim();
const results = [];
const check = (name, ok, info = '') => { results.push({ name, ok, info }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${info ? '  — ' + info : ''}`); };

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(BASE + '/'); if (r.ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error('dev server not reachable');
}

await waitForServer();
const browser = await chromium.launch({ executablePath: exe, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'en-US' });
const page = await ctx.newPage();
const console_ = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) console_.push(`${m.type()}: ${m.text().slice(0, 200)}`); });
page.on('pageerror', (e) => console_.push(`pageerror: ${e.message.slice(0, 200)}`));
// Unknown pages are served as 404.html with a real 404 status on production-like servers; any other 404 is a bug.
const missing = [];
page.on('response', (r) => { if (r.status() === 404 && r.request().resourceType() !== 'document') missing.push(r.url()); });
const requests = new Set();
page.on('request', (r) => { const u = new URL(r.url()); if (u.hostname !== 'localhost') requests.add(u.hostname); });

const go = async (path) => {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.waitForSelector('.MuiTab-root');
  await page.waitForTimeout(150);
};
const showing = async () => {
  const t = await page.getByText(/Showing \d+ of \d+ interfaces/).textContent();
  const m = /Showing (\d+) of (\d+)/.exec(t); return { shown: +m[1], total: +m[2] };
};

// 1. redirect + tab
await go('/');
await page.waitForURL('**/monitor');
check('/ redirects to /monitor', page.url().endsWith('/monitor'), page.url());
check('Monitor tab selected', (await page.locator('.MuiTab-root.Mui-selected').textContent()) === 'Monitor');

// 2. monitor table
const rows = () => page.locator('table[aria-label="interface restrictions table"] tbody tr');
check(`${FIRST_PAGE} rows on page 1`, (await rows().count()) === FIRST_PAGE, String(await rows().count()));
check(`Showing ${FIRST_PAGE} of ${N}`, JSON.stringify(await showing()) === JSON.stringify({ shown: FIRST_PAGE, total: N }));
const rowHeights = await rows().evaluateAll((trs) => [...new Set(trs.map((tr) => Math.round(tr.getBoundingClientRect().height)))]);
check('all rows have the same height', rowHeights.length === 1, rowHeights.join(', '));
const altRow = rows().filter({ has: page.locator('a.MuiChip-root') }).first();
const rowBg = await altRow.evaluate((r) => getComputedStyle(r).backgroundColor);
const btnBg = await altRow.locator('a.MuiChip-root').first().evaluate((c) => getComputedStyle(c).backgroundColor);
await altRow.locator('a.MuiChip-root').first().hover();
await page.waitForTimeout(250);
check('hover: row stays plain, our button lights up', (await altRow.evaluate((r) => getComputedStyle(r).backgroundColor)) === rowBg && (await altRow.locator('a.MuiChip-root').first().evaluate((c) => getComputedStyle(c).backgroundColor)) !== btnBg);
await page.mouse.move(0, 0);
check(`${PAGES} pagination pages`, (await page.locator('.MuiPagination-ul button[aria-label^="Go to page"]').count()) === PAGES - 1, 'page buttons besides current');
const N_ALT = DATA.filter((i) => i.alternatives.length > 0).length;
const altCells = await rows().evaluateAll((trs) => trs.map((tr) => tr.lastElementChild.textContent.trim()));
const firstNonAlt = altCells.findIndex((t) => t === '—');
check(`permissionless rows first (${N_ALT})`, firstNonAlt === N_ALT && altCells.slice(0, N_ALT).every((t) => t.endsWith('.cp0x.com')), altCells.slice(0, N_ALT + 1).join(' | '));
check(`stat tile total ${N}`, (await page.getByText('Interfaces', { exact: true }).locator('xpath=preceding-sibling::*').first().textContent()) === String(N));
// rating = restriction count: every visible rating cell carries the count from the dataset, and the non-permissionless
// rows are ordered rating D->A->n/a, then count desc
const ORDER = ['D', 'C', 'B', 'A', 'n/a'];
const disp = (i) => (i.version ? `${i.name} ${i.version}` : i.name);
const byName = Object.fromEntries(DATA.map((i) => [disp(i), i]));
const ratingRows = await rows().evaluateAll((trs) => trs.map((tr) => ({ name: tr.querySelector('th, td a')?.textContent.trim() ?? '', count: tr.querySelector('[data-restrictions]')?.getAttribute('data-restrictions') })));
const known = ratingRows.filter((r) => byName[r.name]);
check('rating cell shows restriction count', known.length > 20 && known.every((r) => String(byName[r.name].restrictions.count) === r.count), JSON.stringify(known.slice(0, 3)));
const rest = known.slice(N_ALT).map((r) => byName[r.name]);
// default order: cp0x rows, then the other current interfaces, then legacy versions; each block by rating, then count
const sortedBlock = (xs) => xs.every((e, k) => k === 0 || ORDER.indexOf(xs[k - 1].level) < ORDER.indexOf(e.level) || (xs[k - 1].level === e.level && xs[k - 1].restrictions.count >= e.restrictions.count));
const firstLegacy = rest.findIndex((e) => e.lifecycle === 'legacy');
const currentBlock = firstLegacy < 0 ? rest : rest.slice(0, firstLegacy);
const legacyBlock = firstLegacy < 0 ? [] : rest.slice(firstLegacy);
check('default sort: current by rating then count, legacy last', sortedBlock(currentBlock) && sortedBlock(legacyBlock) && legacyBlock.every((e) => e.lifecycle === 'legacy') && legacyBlock.length === DATA.filter((i) => i.lifecycle === 'legacy').length, rest.map((e) => `${e.lifecycle === 'legacy' ? 'L:' : ''}${e.level}${e.restrictions.count}`).join(' '));
// level filter via tile click (chip labelled D inside the stats paper)
await page.getByRole('button', { name: 'D', exact: true }).first().click();
await page.waitForTimeout(200);
check(`level D filter -> ${N_D}`, (await showing()).total === N_D, JSON.stringify(await showing()));
await page.getByRole('button', { name: 'D', exact: true }).first().click();
await page.waitForTimeout(200);
await page.getByLabel('Search').fill('aave');
await page.waitForTimeout(200);
const N_AAVE = DATA.filter((i) => `${i.name} ${i.version ?? ''}`.toLowerCase().includes('aave') || i.id.includes('aave') || i.url.includes('aave')).length;
check(`search aave -> ${N_AAVE} (V3 + V4)`, (await showing()).total === N_AAVE && N_AAVE === 2, JSON.stringify(await showing()));
await page.getByLabel('Search').fill('');
// the mechanism checkboxes and the open-source switch sit behind SHOW_MECHANISM_FILTERS (off by default)
if ((await page.getByLabel('Open-source frontends only').count()) > 0) {
  await page.getByLabel('Open-source frontends only').check();
  await page.waitForTimeout(200);
  check(`open-source only -> ${N_OPEN}`, (await showing()).total === N_OPEN, JSON.stringify(await showing()));
  await page.getByLabel('Open-source frontends only').uncheck();
  await page.waitForTimeout(200);
} else {
  check('mechanism filters hidden (SHOW_MECHANISM_FILTERS=false)', (await page.getByText('Has mechanism').count()) === 0);
}

// legacy versions sort below the current one
await page.getByLabel('Search').fill('notional');
await page.waitForTimeout(250);
const notionalRows = await rows().evaluateAll((trs) => trs.map((tr) => tr.querySelector('td a')?.textContent.trim()));
check('current version first, legacy below', notionalRows[0] === 'Notional Exponent' && notionalRows.length === DATA.filter((i) => i.family === 'notional').length, notionalRows.join(' | '));
check('legacy chip on legacy rows', (await rows().filter({ hasText: 'legacy' }).count()) === DATA.filter((i) => i.family === 'notional' && i.lifecycle === 'legacy').length);
await page.getByLabel('Search').fill('');
await page.waitForTimeout(200);

// 3. row click -> interface page
await rows().filter({ hasText: 'Aave V3' }).first().click();
await page.waitForURL('**/monitor/aave');
check('row click -> /monitor/aave', page.url().endsWith('/monitor/aave'));
const h1 = await page.locator('h1', { hasText: /^Aave V3$/ }).waitFor({ timeout: 10000 }).then(() => 'Aave V3').catch(async () => page.locator('h1').first().textContent());
check('h1 Aave V3', h1 === 'Aave V3', h1);
check('Monitor tab still selected on detail', (await page.locator('.MuiTab-root.Mui-selected').textContent()) === 'Monitor');
const aaveLinks = await page.locator('a[href^="https://github.com/aave/interface/blob/HEAD/"]').count();
check('Aave evidence links -> blob/HEAD', aaveLinks >= 3, String(aaveLinks));
await go('/monitor/uniswap');
const uniLinks = await page.locator('a[href^="https://github.com/Uniswap/interface/blob/main/"]').count();
check('Uniswap evidence links -> blob/main', uniLinks >= 3, String(uniLinks));
await go('/monitor/morpho');
check('Morpho alternative button', (await page.getByText('Permissionless alternative: morpho.cp0x.com').count()) === 1);
// versions: other versions are linked, legacy pages carry a notice, defunct interfaces are not on the site
await go('/monitor/aave-pro');
await page.locator('h1', { hasText: 'Aave V4' }).waitFor({ timeout: 10000 }).catch(() => {});
const aaveProH1 = (await page.locator('h1').first().textContent()).replace(/\s+/g, ' ').trim();
check('Aave Pro h1: name + version, aka in grey', aaveProH1.startsWith('Aave V4') && aaveProH1.includes('Aave Pro'), aaveProH1);
check('Aave Pro links to Aave V3', (await page.locator('a[href="/monitor/aave"]', { hasText: 'Aave V3' }).count()) === 1);
await go('/monitor/notional-v3');
check('legacy notice on Notional V3', (await page.getByText('Legacy version', { exact: true }).count()) === 1);
check('Notional V3 links to the other versions', (await page.locator('a[href="/monitor/notional"]', { hasText: 'Notional Exponent' }).count()) === 1);
await go('/monitor/hop');
await page.waitForTimeout(500);
check('defunct Hop is not on the site', (await page.getByText('Interface not found').count()) >= 1 && !DATA.some((i) => i.id === 'hop'));

// summary tab: charts over the current interfaces (legacy versions left out)
await go('/summary');
await page.locator('h1', { hasText: 'Summary' }).waitFor({ timeout: 10000 }).catch(() => {});
const N_CURRENT = DATA.filter((i) => i.lifecycle !== 'legacy').length;
check('Summary tab selected', (await page.locator('.MuiTab-root.Mui-selected').textContent()) === 'Summary');
check(`summary counts ${N_CURRENT} current interfaces`, (await page.getByText(`Charts over the ${N_CURRENT} current official interfaces`, { exact: false }).count()) === 1);
check('summary draws its charts', (await page.locator('svg[role="img"]').count()) >= 4 && (await page.locator('ul[aria-label="Most blocked countries"] li').count()) === 15);
await page.locator('ul[aria-label="Most blocked countries"] li a').first().click();
await page.waitForURL('**/monitor?country=*');
check('country bar -> filtered monitor', /\/monitor\?country=[A-Z]{2}/.test(page.url()), page.url());
await go('/zh/summary');
await page.locator('h1', { hasText: '概览' }).waitFor({ timeout: 10000 }).catch(() => {});
check('zh summary', (await page.locator('h1').first().textContent()) === '概览');

// 4. not found + catch-all
await go('/monitor/does-not-exist');
check('Interface not found', (await page.getByText('Interface not found').count()) === 1);
await go('/nope');
await page.waitForURL('**/monitor');
check('/nope -> /monitor', page.url().endsWith('/monitor'), page.url());

// 5. country filter on the monitor page (the standalone /country page is hidden)
const STATUS_RE = /^(blocked|close-only|feature-limited|regional|ToS only): \d+$/;
const tableRows = () => page.locator('table[aria-label="interface restrictions table"] tbody tr');
const showAll = async () => {
  await page.getByRole('combobox', { name: 'Rows' }).click();
  await page.getByRole('option', { name: '100', exact: true }).click();
  await page.waitForTimeout(200);
};
const rowOf = (name) => tableRows().filter({ has: page.locator('td:first-child', { hasText: new RegExp('^' + name) }) });
const statusOf = async (name) => {
  const cell = rowOf(name).first().locator('td[data-col="country"]');
  const chip = (await cell.locator('.MuiChip-label').first().textContent()).trim();
  return `${chip} · ${await cell.locator('[data-basis]').first().getAttribute('data-basis')}`;
};
const chipSum = async () =>
  (await page.getByRole('button', { name: STATUS_RE }).allTextContents()).reduce((a, t) => a + +/(\d+)$/.exec(t)[1], 0);
check('tabs: Monitor + Summary + Methodology', (await page.locator('.MuiTab-root').allTextContents()).join(',') === 'Monitor,Summary,Methodology');
check('Screening layer filter hidden', (await page.getByLabel('Screening layer').count()) === 0);
check('Country filter present', (await page.getByLabel('Country', { exact: true }).count()) === 1);
await go('/country/UA');
await page.waitForURL('**/monitor?country=UA');
check('/country/UA -> /monitor?country=UA', page.url().endsWith('/monitor?country=UA'), page.url());
await showAll();
const expectUA = { SushiSwap: 'feature-limited · confirmed', Uniswap: 'blocked · reported', Aave: 'regional · ToS', KyberSwap: 'regional · ToS', Curve: 'ToS only · ToS' };
for (const [n, exp] of Object.entries(expectUA)) { const got = await statusOf(n); check(`UA ${n} = ${exp}`, got === exp, got); }
check('UA: unrestricted rows hidden (GMX)', (await rowOf('GMX').count()) === 0);
check('5 restriction chips', (await page.getByRole('button', { name: STATUS_RE }).count()) === 5);
check('UA: rows = sum of restriction chips', (await showing()).total === (await chipSum()), `${(await showing()).total} vs ${await chipSum()}`);
await go('/monitor?country=US');
await showAll();
const expectUS = { Polymarket: /^close-only · (confirmed|observed)$/, Notional: 'blocked · confirmed', Lido: 'feature-limited · confirmed', Ethena: /^blocked · (confirmed|observed)$/ };
for (const [n, exp] of Object.entries(expectUS)) { const got = await statusOf(n); check(`US ${n} = ${exp}`, exp instanceof RegExp ? exp.test(got) : got === exp, got); }
await go('/monitor?country=CA');
await showAll();
check('CA Polymarket = regional · confirmed', (await statusOf('Polymarket')) === 'regional · confirmed', await statusOf('Polymarket'));
const blockedChip = page.getByRole('button', { name: /^blocked: \d+$/ });
const blockedCount = +(/blocked: (\d+)/.exec(await blockedChip.textContent())[1]);
await blockedChip.click();
await page.waitForTimeout(200);
check('status chip narrows to blocked', (await showing()).total === blockedCount, `${(await showing()).total} vs ${blockedCount}`);
await go('/monitor?country=UA,US');
await showAll();
const multiTotal = (await showing()).total;
const polyChips = await rowOf('Polymarket').first().locator('td[data-col="country"] .MuiChip-label').count();
check('multi UA+US: Polymarket has 2 country verdicts', polyChips === 2, String(polyChips));
check('multi UA+US: header lists both flags', (await page.locator('th', { hasText: 'restrictions' }).count()) === 1);
await go('/monitor?country=UA');
await showAll();
check('multi >= single', multiTotal >= (await showing()).total, `${multiTotal} vs ${(await showing()).total}`);
await go('/monitor?country=XX');
check('invalid country is ignored', (await page.locator('td[data-col="country"]').count()) === 0);
await go('/monitor');
check('no country column without a country', (await page.locator('td[data-col="country"]').count()) === 0);
const altTile = await page.getByText('Permissionless via cp0x', { exact: true }).locator('xpath=preceding-sibling::*').first().textContent();
check(`cp0x tile = ${N_ALT}`, altTile === String(N_ALT), altTile);

// 5b. Chinese pages under /zh (language = URL prefix); the dropdown links to the same page in the other language
await go('/monitor/aave?x=1');
const switchTo = async (label) => {
  await page.locator('#language-button').click();
  await page.getByRole('menuitem', { name: label }).click();
  await page.waitForTimeout(400);
};
await switchTo('中文');
check('zh: switch keeps the page', new URL(page.url()).pathname === '/zh/monitor/aave' && page.url().endsWith('?x=1'), page.url());
check('zh: html lang', (await page.evaluate(() => document.documentElement.lang)) === 'zh-CN');
check('zh: description in Chinese', (await page.getByText('Aave 是最大的去中心化借贷协议之一').count()) === 1);
check('zh: mechanism card title', (await page.getByRole('heading', { name: '钱包筛查' }).count()) >= 1);
check('zh: canonical domain', (await page.evaluate(() => document.querySelector('link[rel=canonical]').href)).startsWith(process.env.SMOKE_SITE || 'http'));
check('zh: hreflang alternates', (await page.evaluate(() => [...document.querySelectorAll('link[rel=alternate][hreflang]')].map((l) => l.hreflang + '>' + new URL(l.href).pathname).join(' '))) === 'en>/monitor/aave zh-Hans>/zh/monitor/aave x-default>/monitor/aave');
check('zh: canonical', (await page.evaluate(() => new URL(document.querySelector('link[rel=canonical]').href).pathname)) === '/zh/monitor/aave');
await page.getByRole('link', { name: '全部界面' }).first().click();
await page.waitForURL('**/zh/monitor');
check('zh: back link stays in Chinese', new URL(page.url()).pathname === '/zh/monitor', page.url());
await page.locator('h1', { hasText: '官方 DeFi 界面' }).waitFor({ timeout: 10000 }).catch(() => {});
check('zh: h1', (await page.locator('h1').first().textContent()) === '官方 DeFi 界面：谁在限制什么');
check('zh: tabs', (await page.locator('.MuiTab-root').allTextContents()).join(',') === '监测,概览,方法论');
check('zh: tab links', (await page.locator('.MuiTab-root').evaluateAll((a) => a.map((x) => x.getAttribute('href')).join(','))) === '/zh/monitor,/zh/summary,/zh/methodology');
check('zh: table links', (await page.locator('table tbody tr td:first-child a').first().getAttribute('href')).startsWith('/zh/monitor/'));
check('no wallet button (no on-chain actions)', (await page.getByRole('button', { name: /connect wallet|连接钱包/i }).count()) === 0);
check('zh: document title', (await page.title()) === 'DeFi 界面限制监测 | cp0x', await page.title());
await go('/');
await page.waitForURL('**/zh/monitor');
check('zh: "/" follows the remembered language', new URL(page.url()).pathname === '/zh/monitor', page.url());
await go('/monitor');
check('en URL stays English after choosing 中文', (await page.locator('h1').first().textContent()) === 'Official DeFi interfaces: who restricts what');
await go('/zh/monitor?country=UA');
check('zh: country header in Chinese', (await page.locator('th', { hasText: '乌克兰' }).count()) === 1);
await go('/zh/methodology');
check('zh: methodology h1', (await page.locator('h1').first().textContent()) === '方法论');
await go('/zh/nope');
await page.waitForURL('**/zh/monitor');
check('zh: unknown /zh path -> /zh/monitor', new URL(page.url()).pathname === '/zh/monitor', page.url());
await go('/zh/methodology');
await switchTo('English');
check('en: back to English', new URL(page.url()).pathname === '/methodology' && (await page.locator('h1').first().textContent()) === 'Methodology' && (await page.evaluate(() => document.documentElement.lang)) === 'en', page.url());
await go('/');
await page.waitForURL('**/monitor');
check('en: "/" follows the remembered language', new URL(page.url()).pathname === '/monitor', page.url());

// 6. methodology
await go('/methodology');
check('Methodology tab selected', (await page.locator('.MuiTab-root.Mui-selected').textContent()) === 'Methodology');
check('test address rendered', (await page.getByText(/0x098B\S*2f96/).count()) >= 1);

// 7. mobile
await page.setViewportSize({ width: 375, height: 800 });
await go('/monitor');
await page.locator('button:has(svg.tabler-icon-menu-2)').first().click();
await page.waitForTimeout(300);
const ext = page.locator('.MuiDrawer-paper a', { hasText: 'Permissionless Interfaces' });
check('mobile menu external link', (await ext.getAttribute('target')) === '_blank' && (await ext.getAttribute('href')) === 'https://pi.cp0x.com');
// phones get one card per interface instead of the table, and the page must not scroll sideways
await page.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {});
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
check('phone: cards instead of the table', (await page.locator('table[aria-label="interface restrictions table"]').isVisible().catch(() => false)) === false && (await page.getByRole('link', { name: 'Aave V3' }).count()) >= 1);
check('phone: no horizontal page scroll', (await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)) <= 0);
await page.screenshot({ path: process.argv[2] + '/mobile-monitor.png', fullPage: false });
await page.setViewportSize({ width: 1280, height: 900 });
await go('/monitor');
await page.screenshot({ path: process.argv[2] + '/monitor.png', fullPage: false });
await go('/monitor?country=UA');
await page.screenshot({ path: process.argv[2] + '/monitor-ua.png', fullPage: false });
await go('/monitor/aave');
await page.screenshot({ path: process.argv[2] + '/interface-aave.png', fullPage: true });

// 8. console + network
const noise = /walletconnect|web3modal|reown|Allowlist|403|pulse\.|Lit is in dev mode|status of 404/i;
const bad = console_.filter((l) => !noise.test(l));
check('no unexpected console errors/warnings', bad.length === 0, bad.slice(0, 5).join(' | '));
check('no missing assets (404)', missing.length === 0, missing.slice(0, 5).join(' | '));
const externalHosts = [...requests].filter((h) => !/walletconnect|web3modal|reown|fonts\.|gstatic/.test(h));
check('no unexpected external requests', externalHosts.length === 0, externalHosts.join(', '));

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
