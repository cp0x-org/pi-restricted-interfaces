// Build-time prerender (used by the seo plugin in vite.config.mts): for every route and every UI language one static
// HTML file with the page's own <head> (title, description, canonical, hreflang alternates, Open Graph, JSON-LD) and a
// plain-HTML version of its content inside #root, plus sitemap.xml (with hreflang alternates), robots.txt and 404.html.
// Crawlers and link previews get real content without running JavaScript; the app replaces #root when it starts.
// Node-only code path: no browser APIs, relative imports only.
import { LEVELS } from '../types/restrictions';
import type { Dataset, InterfaceEntry, Status } from '../types/restrictions';
import { displayName, evidenceLinks, lifecycleRank, parentOf, restrictionsText } from '../utils/restrictions';
import { LANGS_ALL, Lang, localizePath } from '../i18n/paths';
import type { Messages } from '../i18n/en';
import {
  OG_IMAGE_PATH,
  PageMeta,
  TWITTER_HANDLE,
  absoluteUrl,
  alternatesFor,
  catalog,
  interfaceMeta,
  methodologyMeta,
  monitorMeta,
  notFoundMeta,
  ogLocale
} from './meta';

interface SeoFile {
  fileName: string;
  source: string;
}

const HEAD_RE = /<!--seo:head-->[\s\S]*?<!--\/seo:head-->/;
const ROOT = '<div id="root"></div>';
const HTML_LANG_RE = /<html lang="[^"]*">/;
const NOSCRIPT_RE = /<noscript>[\s\S]*?<\/noscript>/;

const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Escapes a free-text fragment and makes sure it ends a sentence, so appended clauses read correctly. */
const sent = (t: string): string => (t.trim() ? esc(t.trim()) + (/[.!?…)。！？）]$/.test(t.trim()) ? '' : '.') : '');
const strip = (url: string): string => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
const ext = (href: string, text: string): string => `<a href="${esc(href)}" rel="noopener">${esc(text)}</a>`;
/** Backtick spans in translated strings become <code>. */
const code = (text: string): string => esc(text).replace(/`([^`]+)`/g, '<code>$1</code>');

const names = new Map<string, Intl.DisplayNames | null>();
function countryLabel(token: string, t: Messages, regions: Record<string, string>): string {
  if (token.includes('-')) return `${t.labels.REGION_LABELS[token] ?? regions[token] ?? token} (${parentOf(token)})`;
  try {
    if (!names.has(t.intlLocale)) names.set(t.intlLocale, new Intl.DisplayNames([t.intlLocale], { type: 'region' }));
    return names.get(t.intlLocale)?.of(token) ?? token;
  } catch {
    return token;
  }
}

function headTags(m: PageMeta, siteUrl: string): string {
  const url = m.path ? absoluteUrl(siteUrl, m.path) : '';
  const indexable = Boolean(siteUrl && url && !m.noindex);
  const t = catalog(m.lang);
  const lines = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="robots" content="${m.noindex ? 'noindex,follow' : 'index,follow'}" />`,
    indexable ? `<link rel="canonical" href="${esc(url)}" />` : '',
    ...(indexable
      ? m.alternates.map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${esc(absoluteUrl(siteUrl, a.path))}" />`)
      : []),
    `<meta property="og:type" content="${m.type ?? 'website'}" />`,
    `<meta property="og:site_name" content="${esc(t.seo.ogSiteName)}" />`,
    `<meta property="og:locale" content="${ogLocale(m.lang)}" />`,
    ...LANGS_ALL.filter((l) => l !== m.lang).map((l) => `<meta property="og:locale:alternate" content="${ogLocale(l)}" />`),
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    indexable ? `<meta property="og:url" content="${esc(url)}" />` : '',
    `<meta property="og:image" content="${esc(absoluteUrl(siteUrl, OG_IMAGE_PATH))}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:site" content="${TWITTER_HANDLE}" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    m.jsonLd ? `<script type="application/ld+json">${JSON.stringify(m.jsonLd).replace(/</g, '\\u003c')}</script>` : ''
  ];
  return `<!--seo:head-->\n    ${lines.filter(Boolean).join('\n    ')}\n    <!--/seo:head-->`;
}

/** Static header: site name, sections and links to the same page in the other languages (crawlable hreflang targets). */
function shell(main: string, lang: Lang, basePath: string): string {
  const t = catalog(lang);
  const p = (path: string) => localizePath(path, lang);
  const langLinks = LANGS_ALL.filter((l) => l !== lang)
    .map(
      (l) =>
        `<a href="${localizePath(basePath, l)}" hreflang="${l === 'zh' ? 'zh-Hans' : 'en'}" lang="${catalog(l).htmlLang}">${esc(catalog(l).seo.langName)}</a>`
    )
    .join(' · ');
  return `<div id="root"><div id="prerender"><header><nav aria-label="${esc(t.layout.mainNav)}"><a href="${p('/monitor')}"><strong>${esc(
    t.seo.siteName
  )}</strong></a> · <a href="${p('/methodology')}">${esc(t.layout.tabs.methodology)}</a> · ${ext('https://pi.cp0x.com', t.layout.permissionless)} · ${langLinks}</nav></header><main>${main}</main></div></div>`;
}

const byDefaultOrder = (a: InterfaceEntry, b: InterfaceEntry): number =>
  lifecycleRank(a) - lifecycleRank(b) ||
  Number(b.alternatives.length > 0) - Number(a.alternatives.length > 0) ||
  LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level) ||
  b.restrictions.count - a.restrictions.count ||
  displayName(a).localeCompare(displayName(b));

function monitorBody(ds: Dataset, lang: Lang): string {
  const t = catalog(lang);
  const L = t.labels;
  const c = t.monitor.cols;
  const status = (s: Status) => esc(L.STATUS_LABELS[s]);
  const rows = [...ds.interfaces].sort(byDefaultOrder).map((i) => {
    const screening = L.STATUS_LABELS[i.screening.s] + (i.screening.layer ? ` (${L.LAYER_LABELS[i.screening.layer]})` : '');
    const alt = i.alternatives[0];
    return `<tr><td><a href="${localizePath(`/monitor/${i.id}`, lang)}">${esc(displayName(i))}</a>${i.lifecycle === 'legacy' ? ` <small>(${esc(t.chips.legacy)})</small>` : ''}<br><small>${esc(i.networks.join(', '))}</small></td><td>${
      i.level
    }</td><td>${status(i.geo_site.s)}${i.geo_site.countries.length ? ` (${i.geo_site.countries.length})` : ''}</td><td>${status(i.geo_feature.s)}</td><td>${esc(
      screening
    )}</td><td>${esc(L.VPN_LABELS[i.vpn.s])}</td><td>${ext(i.url, strip(i.url))}</td><td>${alt ? ext(alt.url, alt.name) : '—'}</td></tr>`;
  });
  return `<h1>${esc(t.monitor.title)}</h1>
<p>${esc(t.monitor.intro(ds.interfaces.length, ds.meta.catalog_total, ds.meta.generated))}</p>
<ul>${LEVELS.map((l) => `<li><b>${esc(l)}</b>: ${esc(L.LEVEL_DESCRIPTIONS[l])}</li>`).join('')}</ul>
<table><thead><tr><th>${esc(c.iface)}</th><th>${esc(c.level)}</th><th>${esc(c.geo)}</th><th>${esc(c.feature)}</th><th>${esc(c.screening)}</th><th>${esc(
    c.vpn
  )}</th><th>${esc(c.official)}</th><th>${esc(c.permissionless)}</th></tr></thead><tbody>${rows.join('')}</tbody></table>`;
}

function interfaceBody(e: InterfaceEntry, ds: Dataset, lang: Lang): string {
  const t = catalog(lang);
  const L = t.labels;
  const T = t.iface;
  const { colon, stop, listSep, comma } = t.seo;
  const regions = ds.meta.regions;
  const field = (label: string, value: string) => `${esc(label)}${colon}${value}`;
  const list = (label: string, tokens: string[]) =>
    tokens.length ? ` ${field(label, tokens.map((tok) => esc(countryLabel(tok, t, regions))).join(listSep))}${stop.trim()}` : '';
  const alt = e.alternatives[0];
  const versions = ds.interfaces
    .filter((v) => e.family && v.family === e.family && v.id !== e.id)
    .sort((a, b) => lifecycleRank(a) - lifecycleRank(b) || displayName(a).localeCompare(displayName(b)));
  const evidence = evidenceLinks(e)
    .map((l) => `<li>${l.href ? ext(l.href, l.label) : esc(l.label)}</li>`)
    .join('');
  const sc = e.screening;
  const M = L.MECHANISM_LABELS;
  const item = (label: string, status: string, rest: string) => `<li><b>${esc(label)}${colon.trim()}</b> ${esc(status)}${stop}${rest}</li>`;
  const items = [
    item(
      M.geo_site,
      L.STATUS_LABELS[e.geo_site.s],
      `${sent(e.geo_site.method)}${list(T.blockedCountries, e.geo_site.countries)}${list(T.closeOnlyCountries, e.geo_site.close_only)}`
    ),
    item(M.geo_feature, L.STATUS_LABELS[e.geo_feature.s], `${sent(e.geo_feature.scope)}${list(T.affected, e.geo_feature.countries)}`),
    item(
      M.screening,
      L.STATUS_LABELS[sc.s],
      `${sent(sc.provider)}${sc.layer ? ` ${field(T.whereRuns, esc(L.LAYER_LABELS[sc.layer]))}${stop.trim()}` : ''}${
        sc.fail ? ` ${field(T.failMode, esc(L.FAIL_LABELS[sc.fail]))}${sc.fail_note ? ` (${esc(sc.fail_note)})` : ''}${stop.trim()}` : ''
      }`
    ),
    item(M.vpn, L.VPN_LABELS[e.vpn.s], sent(e.vpn.note)),
    e.kyc
      ? item(
          M.kyc,
          L.STATUS_LABELS[e.kyc.s],
          `${sent(e.kyc.scope)}${e.kyc.layer ? ` ${field(T.whereRuns, esc(L.LAYER_LABELS[e.kyc.layer]))}${stop.trim()}` : ''}`
        )
      : '',
    e.asset_filter ? `<li><b>${esc(T.assetFilter)}${colon.trim()}</b> ${sent(e.asset_filter)}</li>` : '',
    `<li><b>${esc(T.tos)}${colon.trim()}</b> ${e.tos.url ? ext(e.tos.url, strip(e.tos.url)) : esc(T.notFoundDoc)}${
      e.tos.updated ? `${comma}${esc(T.lastUpdated)} ${esc(e.tos.updated)}` : ''
    }${stop}${sent(e.tos.restricted)}</li>`
  ];
  const description = lang === 'zh' && e.description_zh ? e.description_zh : e.description;
  const category = lang === 'zh' ? L.CATEGORY_GROUP_LABELS[e.category_group] : e.category;
  return `<nav aria-label="Breadcrumb"><a href="${localizePath('/monitor', lang)}">${esc(t.layout.tabs.monitor)}</a> › ${esc(displayName(e))}</nav>
<h1>${esc(displayName(e))}</h1>
<p>${esc(description)}</p>
${e.lifecycle === 'legacy' && e.lifecycle_note ? `<p><b>${esc(t.seo.legacySentence(e.lifecycle_note))}</b></p>\n` : ''}${versions.length ? `<p>${esc(T.otherVersions)}${colon}${versions.map((v) => `<a href="${localizePath(`/monitor/${v.id}`, lang)}">${esc(displayName(v))}</a>${v.lifecycle === 'legacy' ? ` (${esc(t.chips.legacy)})` : ''}`).join(listSep)}${stop.trim()}</p>\n` : ''}<p><b>${esc(t.seo.levelSentence(e.level, restrictionsText(e, t.monitor.restrictionsTip, L.MECHANISM_LABELS, t.seo.listSep, L.LEVEL_DESCRIPTIONS['n/a'])))}</b> ${esc(category)} · ${esc(e.networks.join(', ') || e.chains)}${stop.trim()}</p>
<p>${field(t.monitor.cols.official, ext(e.url, strip(e.url)))}${stop}${alt ? `${esc(T.altPrefix)} ${ext(alt.url, alt.name)}${stop}` : ''}${field(
    T.frontendCode,
    e.frontend_repo ? ext(e.frontend_repo, strip(e.frontend_repo)) : esc(L.REPO_STATE_LABELS[e.repo_state])
  )}${stop.trim()}</p>
<h2>${esc(t.seo.restrictionsTitle)}</h2>${T.dataNote ? `<p><small>${esc(T.dataNote)}</small></p>` : ''}<ul>${items.filter(Boolean).join('')}</ul>
${e.fork_notes ? `<h2>${esc(T.forkNotes)}</h2><p>${sent(e.fork_notes)}</p>` : ''}
${e.live.length ? `<h2>${esc(T.liveChecks)}</h2><ul>${e.live.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}
<h2>${esc(T.evidence)}</h2><ul>${evidence || `<li>${esc(t.chips.noEvidence)}</li>`}</ul>
<p>${esc(t.seo.checked(ds.meta.generated))} <a href="${localizePath('/monitor', lang)}">${esc(T.all)}</a> · <a href="${localizePath(
    '/methodology',
    lang
  )}">${esc(t.layout.tabs.methodology)}</a></p>`;
}

function methodologyBody(ds: Dataset, lang: Lang): string {
  const t = catalog(lang);
  const L = t.labels;
  const M = t.method;
  return `<h1>${esc(M.title)}</h1>
<p>${code(M.intro(ds.meta.generated, ds.interfaces.length, ds.meta.catalog_total))}</p>
<h2>${esc(M.levelsTitle)}</h2><ul>${LEVELS.map((l) => `<li><b>${esc(l)}</b>: ${esc(L.LEVEL_DESCRIPTIONS[l])}</li>`).join('')}</ul><p>${esc(M.levelsNote)}</p><p>${esc(M.versionsNote)}</p>
<h2>${esc(M.statusTitle)}</h2><ul>${(Object.keys(L.STATUS_LABELS) as Status[])
    .map((s) => `<li><b>${esc(L.STATUS_LABELS[s])}</b>: ${esc(L.STATUS_DESCRIPTIONS[s])}</li>`)
    .join('')}</ul>
<h2>${esc(M.layerTitle)}</h2><ul>${(Object.keys(L.LAYER_LABELS) as (keyof typeof L.LAYER_LABELS)[])
    .map((l) => `<li><b>${esc(L.LAYER_LABELS[l])}</b>: ${esc(L.LAYER_DESCRIPTIONS[l])}</li>`)
    .join('')}</ul><p>${esc(M.layerNote)}</p>
<h2>${esc(M.countryTitle)}</h2><ul>${(Object.keys(M.countryRules) as (keyof typeof M.countryRules)[])
    .map((s) => `<li><b>${esc(L.COUNTRY_STATUS_LABELS[s])}</b>: ${esc(M.countryRules[s])}</li>`)
    .join('')}</ul>
<p><a href="${localizePath('/monitor', lang)}">${esc(t.iface.all)}</a></p>`;
}

function page(template: string, m: PageMeta, siteUrl: string, body: string | null, basePath: string): string {
  if (!HEAD_RE.test(template) || !template.includes(ROOT) || !HTML_LANG_RE.test(template))
    throw new Error('seo prerender: index.html markers not found');
  const t = catalog(m.lang);
  return template
    .replace(HTML_LANG_RE, `<html lang="${t.htmlLang}">`)
    .replace(NOSCRIPT_RE, `<noscript>${esc(t.seo.noscript)}</noscript>`)
    .replace(HEAD_RE, headTags(m, siteUrl))
    .replace(ROOT, body === null ? ROOT : shell(body, m.lang, basePath));
}

/**
 * Every static file the build should contain for SEO. `index.html` replaces Vite's own entry file. Routes are emitted as
 * `<path>.html` ("clean URLs"): served for `/monitor/aave` by vite preview, `serve`, nginx `try_files $uri $uri.html`,
 * GitHub Pages, Netlify and Cloudflare Pages. Chinese pages live under `/zh` with the same structure.
 */
export function buildSeoFiles(template: string, ds: Dataset, siteUrl: string): SeoFile[] {
  const site = siteUrl.replace(/\/+$/, '');
  const files: SeoFile[] = [];
  for (const lang of LANGS_ALL) {
    const prefix = lang === 'zh' ? 'zh/' : '';
    const monitor = page(template, monitorMeta(ds.meta, ds.interfaces, site, lang), site, monitorBody(ds, lang), '/monitor');
    // "/" and "/zh" (and the SPA fallback for "/"): canonical points to the monitor page of that language
    files.push({ fileName: lang === 'zh' ? 'zh.html' : 'index.html', source: monitor });
    files.push({ fileName: `${prefix}monitor.html`, source: monitor });
    files.push({
      fileName: `${prefix}methodology.html`,
      source: page(template, methodologyMeta(ds.meta, site, lang), site, methodologyBody(ds, lang), '/methodology')
    });
    for (const e of ds.interfaces) {
      files.push({
        fileName: `${prefix}monitor/${e.id}.html`,
        source: page(template, interfaceMeta(e, ds.meta, site, lang), site, interfaceBody(e, ds, lang), `/monitor/${e.id}`)
      });
    }
  }
  files.push({ fileName: '404.html', source: page(template, notFoundMeta('en'), site, null, '/monitor') });

  const basePaths = ['/monitor', '/methodology', ...ds.interfaces.map((e) => `/monitor/${e.id}`)];
  files.push({ fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n${site ? `\nSitemap: ${site}/sitemap.xml\n` : ''}` });
  if (site) {
    // One <url> per language version, each listing the whole hreflang cluster (Google's sitemap hreflang format).
    const urls = basePaths.flatMap((base) => {
      const alts = alternatesFor(base)
        .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${site}${a.path}"/>`)
        .join('\n');
      return LANGS_ALL.map(
        (l) => `  <url>\n    <loc>${site}${localizePath(base, l)}</loc>\n    <lastmod>${ds.meta.generated}</lastmod>\n${alts}\n  </url>`
      );
    });
    files.push({
      fileName: 'sitemap.xml',
      source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
    });
  }
  return files;
}
