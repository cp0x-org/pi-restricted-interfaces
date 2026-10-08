// Build-time prerender (used by the seo plugin in vite.config.mts): one static HTML file per route with the page's
// own <head> tags and a plain-HTML version of its content inside #root, plus sitemap.xml, robots.txt and 404.html.
// Crawlers and link previews get real content without running JavaScript; the app replaces #root when it starts.
// Node-only code path: no browser APIs, relative imports only.
import { LEVELS } from '../types/restrictions';
import type { Dataset, InterfaceEntry } from '../types/restrictions';
import { evidenceLinks, parentOf } from '../utils/restrictions';
import {
  FAIL_LABELS,
  LAYER_DESCRIPTIONS,
  LAYER_LABELS,
  LEVEL_DESCRIPTIONS,
  REPO_STATE_LABELS,
  STATUS_DESCRIPTIONS,
  STATUS_LABELS,
  VPN_LABELS
} from '../views/monitor/constants';
import {
  OG_IMAGE_PATH,
  PageMeta,
  SITE_NAME,
  TWITTER_HANDLE,
  absoluteUrl,
  interfaceMeta,
  levelSentence,
  methodologyMeta,
  monitorMeta,
  notFoundMeta
} from './meta';

interface SeoFile {
  fileName: string;
  source: string;
}

const HEAD_RE = /<!--seo:head-->[\s\S]*?<!--\/seo:head-->/;
const ROOT = '<div id="root"></div>';

const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = (url: string): string => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
/** Escapes a free-text fragment and makes sure it ends a sentence, so appended clauses read correctly. */
const sent = (t: string): string => (t.trim() ? esc(t.trim()) + (/[.!?…)]$/.test(t.trim()) ? '' : '.') : '');
const ext = (href: string, text: string): string => `<a href="${esc(href)}" rel="noopener">${esc(text)}</a>`;

let names: Intl.DisplayNames | null = null;
function countryLabel(token: string, regions: Record<string, string>): string {
  if (token.includes('-')) return `${regions[token] ?? token} (${parentOf(token)})`;
  try {
    names ??= new Intl.DisplayNames(['en'], { type: 'region' });
    return names.of(token) ?? token;
  } catch {
    return token;
  }
}

function headTags(m: PageMeta, siteUrl: string): string {
  const url = m.path ? absoluteUrl(siteUrl, m.path) : '';
  const lines = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="robots" content="${m.noindex ? 'noindex,follow' : 'index,follow'}" />`,
    siteUrl && url && !m.noindex ? `<link rel="canonical" href="${esc(url)}" />` : '',
    `<meta property="og:type" content="${m.type ?? 'website'}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)} by cp0x" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    siteUrl && url && !m.noindex ? `<meta property="og:url" content="${esc(url)}" />` : '',
    `<meta property="og:image" content="${esc(absoluteUrl(siteUrl, OG_IMAGE_PATH))}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:site" content="${TWITTER_HANDLE}" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    m.jsonLd ? `<script type="application/ld+json">${JSON.stringify(m.jsonLd).replace(/</g, '\\u003c')}</script>` : ''
  ];
  return `<!--seo:head-->\n    ${lines.filter(Boolean).join('\n    ')}\n    <!--/seo:head-->`;
}

const shell = (main: string): string =>
  `<div id="root"><div id="prerender"><header><nav aria-label="Main"><a href="/monitor"><strong>${esc(SITE_NAME)}</strong></a> · <a href="/methodology">Methodology</a> · ${ext(
    'https://pi.cp0x.com',
    'Permissionless Interfaces by cp0x'
  )}</nav></header><main>${main}</main></div></div>`;

const byDefaultOrder = (a: InterfaceEntry, b: InterfaceEntry): number =>
  Number(b.alternatives.length > 0) - Number(a.alternatives.length > 0) ||
  LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level) ||
  a.name.localeCompare(b.name);

function monitorBody(ds: Dataset): string {
  const rows = [...ds.interfaces].sort(byDefaultOrder).map((i) => {
    const screening = STATUS_LABELS[i.screening.s] + (i.screening.layer ? ` (${LAYER_LABELS[i.screening.layer]})` : '');
    const alt = i.alternatives[0];
    return `<tr><td><a href="/monitor/${i.id}">${esc(i.name)}</a><br><small>${esc(i.networks.join(', '))}</small></td><td>${i.level}</td><td>${
      STATUS_LABELS[i.geo_site.s]
    }${i.geo_site.countries.length ? ` (${i.geo_site.countries.length})` : ''}</td><td>${STATUS_LABELS[i.geo_feature.s]}</td><td>${esc(screening)}</td><td>${
      VPN_LABELS[i.vpn.s]
    }</td><td>${ext(i.url, strip(i.url))}</td><td>${alt ? ext(alt.url, alt.name) : '—'}</td></tr>`;
  });
  return `<h1>Official DeFi interfaces: who restricts what</h1>
<p>Each row is the official web interface of a protocol on EVM networks. The level says how hard the restriction is and whether a permissionless fork removes it: ${LEVELS.map(
    (l) => `<b>${esc(l)}</b> ${esc(LEVEL_DESCRIPTIONS[l].toLowerCase())}`
  ).join('; ')}. Snapshot of ${esc(ds.meta.generated)}.</p>
<table><thead><tr><th>Interface</th><th>Level</th><th>Geo Block</th><th>Feature Block</th><th>Wallet screening</th><th>VPN</th><th>Official app</th><th>Permissionless app</th></tr></thead><tbody>${rows.join(
    ''
  )}</tbody></table>`;
}

function interfaceBody(e: InterfaceEntry, ds: Dataset): string {
  const regions = ds.meta.regions;
  const countries = (tokens: string[]) =>
    tokens.length ? ` Countries: ${tokens.map((t) => esc(countryLabel(t, regions))).join(', ')}.` : '';
  const alt = e.alternatives[0];
  const evidence = evidenceLinks(e)
    .map((l) => `<li>${l.href ? ext(l.href, l.label) : esc(l.label)}</li>`)
    .join('');
  const sc = e.screening;
  const items = [
    `<li><b>Geo Block:</b> ${STATUS_LABELS[e.geo_site.s]}. ${sent(e.geo_site.method)}${countries(e.geo_site.countries)}${
      e.geo_site.close_only.length ? ` Close-only: ${e.geo_site.close_only.map((t) => esc(countryLabel(t, regions))).join(', ')}.` : ''
    }</li>`,
    `<li><b>Feature Block:</b> ${STATUS_LABELS[e.geo_feature.s]}. ${sent(e.geo_feature.scope)}${countries(e.geo_feature.countries)}</li>`,
    `<li><b>Wallet screening:</b> ${STATUS_LABELS[sc.s]}. ${sent(sc.provider)}${sc.layer ? ` Runs in: ${LAYER_LABELS[sc.layer]}.` : ''}${
      sc.fail ? ` Fail mode: ${FAIL_LABELS[sc.fail]}${sc.fail_note ? ` (${esc(sc.fail_note)})` : ''}.` : ''
    }</li>`,
    `<li><b>VPN / Tor detection:</b> ${VPN_LABELS[e.vpn.s]}. ${sent(e.vpn.note)}</li>`,
    e.asset_filter ? `<li><b>Asset filter:</b> ${sent(e.asset_filter)}</li>` : '',
    `<li><b>Terms of Service:</b> ${e.tos.url ? ext(e.tos.url, strip(e.tos.url)) : 'not found'}${e.tos.updated ? `, updated ${esc(e.tos.updated)}` : ''}. ${sent(e.tos.restricted)}</li>`
  ];
  return `<nav aria-label="Breadcrumb"><a href="/monitor">Monitor</a> › ${esc(e.name)}</nav>
<h1>${esc(e.name)}</h1>
<p>${esc(e.description)}</p>
<p><b>${esc(levelSentence(e))}</b> ${esc(e.category)} · ${esc(e.networks.join(', ') || e.chains)}.</p>
<p>Official app: ${ext(e.url, strip(e.url))}.${alt ? ` Permissionless alternative: ${ext(alt.url, alt.name)}.` : ''} Frontend code: ${
    e.frontend_repo ? ext(e.frontend_repo, strip(e.frontend_repo)) : REPO_STATE_LABELS[e.repo_state]
  }.</p>
<h2>Restrictions</h2><ul>${items.filter(Boolean).join('')}</ul>
${e.fork_notes ? `<h2>Fork notes</h2><p>${sent(e.fork_notes)}</p>` : ''}
${e.live.length ? `<h2>Live checks</h2><ul>${e.live.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}
<h2>Evidence</h2><ul>${evidence || '<li>No evidence recorded.</li>'}</ul>
<p>Checked ${esc(ds.meta.generated)}. <a href="/monitor">All interfaces</a> · <a href="/methodology">Methodology</a></p>`;
}

function methodologyBody(ds: Dataset): string {
  return `<h1>Methodology</h1>
<p>The catalog answers one question per interface: what does the official frontend or backend block, for whom, by which mechanism, where is it enforced, and does a permissionless fork remove it. Snapshot of ${esc(
    ds.meta.generated
  )}. Only observation: nothing is bypassed, nothing is signed, no transactions are sent.</p>
<h2>Levels</h2><ul>${LEVELS.map((l) => `<li><b>${esc(l)}</b>: ${esc(LEVEL_DESCRIPTIONS[l])}</li>`).join('')}</ul>
<h2>Status values</h2><ul>${(Object.keys(STATUS_LABELS) as (keyof typeof STATUS_LABELS)[])
    .map((s) => `<li><b>${esc(STATUS_LABELS[s])}</b>: ${esc(STATUS_DESCRIPTIONS[s])}</li>`)
    .join('')}</ul>
<h2>Where screening runs</h2><ul>${(Object.keys(LAYER_LABELS) as (keyof typeof LAYER_LABELS)[])
    .map((l) => `<li><b>${esc(LAYER_LABELS[l])}</b>: ${esc(LAYER_DESCRIPTIONS[l])}</li>`)
    .join('')}</ul>
<p><a href="/monitor">See all interfaces</a></p>`;
}

function page(template: string, m: PageMeta, siteUrl: string, body: string | null): string {
  if (!HEAD_RE.test(template) || !template.includes(ROOT)) throw new Error('seo prerender: index.html markers not found');
  return template.replace(HEAD_RE, headTags(m, siteUrl)).replace(ROOT, body === null ? ROOT : shell(body));
}

/**
 * Every static file the build should contain for SEO. `index.html` replaces Vite's own entry file. Routes are emitted as
 * `<path>.html` ("clean URLs"): served for `/monitor/aave` by vite preview, `serve`, nginx `try_files $uri $uri.html`,
 * GitHub Pages, Netlify and Cloudflare Pages.
 */
export function buildSeoFiles(template: string, ds: Dataset, siteUrl: string): SeoFile[] {
  const site = siteUrl.replace(/\/+$/, '');
  const monitor = page(template, monitorMeta(ds.meta, ds.interfaces, site), site, monitorBody(ds));
  const files: SeoFile[] = [
    { fileName: 'index.html', source: monitor }, // "/" and the SPA fallback: canonical points to /monitor
    { fileName: 'monitor.html', source: monitor },
    { fileName: 'methodology.html', source: page(template, methodologyMeta(ds.meta, site), site, methodologyBody(ds)) },
    { fileName: '404.html', source: page(template, notFoundMeta(), site, null) },
    ...ds.interfaces.map((e) => ({
      fileName: `monitor/${e.id}.html`,
      source: page(template, interfaceMeta(e, ds.meta, site), site, interfaceBody(e, ds))
    }))
  ];
  const paths = ['/monitor', '/methodology', ...ds.interfaces.map((e) => `/monitor/${e.id}`)];
  files.push({
    fileName: 'robots.txt',
    source: `User-agent: *\nAllow: /\n${site ? `\nSitemap: ${site}/sitemap.xml\n` : ''}`
  });
  if (site) {
    files.push({
      fileName: 'sitemap.xml',
      source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
        .map((p) => `  <url><loc>${site}${p}</loc><lastmod>${ds.meta.generated}</lastmod></url>`)
        .join('\n')}\n</urlset>\n`
    });
  }
  return files;
}
