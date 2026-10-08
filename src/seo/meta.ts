// Page metadata (title, description, canonical path, hreflang alternates, JSON-LD) for both UI languages, shared by
// the running app (usePageMeta) and the build-time prerender in vite.config.mts. Keep this file free of browser APIs,
// import.meta.env and baseUrl imports.
import type { DatasetMeta, InterfaceEntry } from '../types/restrictions';
import { en, Messages } from '../i18n/en';
import { zh } from '../i18n/zh';
import { HREFLANG, Lang, LANGS_ALL, OG_LOCALE, localizePath } from '../i18n/paths';

export const TWITTER_HANDLE = '@cp0xdotcom';
export const OG_IMAGE_PATH = '/og-image.png';
const ORG = {
  '@type': 'Organization',
  name: 'cp0x',
  url: 'https://cp0x.com',
  sameAs: ['https://x.com/cp0xdotcom', 'https://t.me/cp0xdotcom']
};

export const catalog = (lang: Lang): Messages => (lang === 'zh' ? zh : en);

interface Alternate {
  hreflang: string;
  path: string;
}

export interface PageMeta {
  lang: Lang;
  title: string;
  description: string;
  /** Canonical path of this language version ('/zh/monitor/aave'); the site origin is added by the caller. */
  path: string;
  /** hreflang cluster: every language version plus x-default (English). */
  alternates: Alternate[];
  noindex?: boolean;
  type?: 'website' | 'article';
  jsonLd?: Record<string, unknown>;
}

/** Joins the configured site origin and a path; returns the bare path when the origin is unknown. */
export const absoluteUrl = (siteUrl: string, path: string): string => (siteUrl ? siteUrl.replace(/\/+$/, '') + path : path);

/** Cuts text at a word (or, for CJK, character) boundary so meta descriptions stay within what search engines display. */
function clip(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return (space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[,;:.，；：。\s-]+$/, '') + '…';
}

/** hreflang alternates for a language-neutral path ('/monitor/aave'). */
export const alternatesFor = (basePath: string): Alternate[] => [
  ...LANGS_ALL.map((l) => ({ hreflang: HREFLANG[l], path: localizePath(basePath, l) })),
  { hreflang: 'x-default', path: basePath }
];

export const ogLocale = (lang: Lang): string => OG_LOCALE[lang];

/** Short plain-language summary of what an interface restricts, in the given language. */
function restrictionSummary(e: InterfaceEntry, lang: Lang): string {
  const t = catalog(lang);
  const S = t.seo.summary;
  const parts: string[] = [];
  const geo = e.geo_site;
  if (geo.s === 'yes') parts.push(geo.countries.length ? S.geoBlocks(geo.countries.length) : S.geoBlocksSite);
  else if (geo.s === 'reported') parts.push(S.geoReported);
  else if (geo.s === 'tos_only') parts.push(S.geoTos);
  if (geo.close_only.length) parts.push(S.closeOnly(geo.close_only.length));
  if (e.geo_feature.s === 'yes') parts.push(S.feature);
  if (e.screening.s === 'yes' || e.screening.s === 'reported')
    parts.push(S.screens(e.screening.layer ? t.labels.LAYER_LABELS[e.screening.layer] : ''));
  if (e.vpn.s === 'detect' || e.vpn.s === 'block') parts.push(e.vpn.s === 'block' ? S.vpnBlock : S.vpnDetect);
  return parts.length ? parts.join(S.sep) : S.none;
}

const breadcrumb = (siteUrl: string, items: [string, string][]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], n) => ({ '@type': 'ListItem', position: n + 1, name, item: absoluteUrl(siteUrl, path) }))
});

export function monitorMeta(meta: DatasetMeta, interfaces: InterfaceEntry[], siteUrl: string, lang: Lang = 'en'): PageMeta {
  const t = catalog(lang);
  const withAlt = interfaces.filter((i) => i.alternatives.length > 0).length;
  const path = localizePath('/monitor', lang);
  return {
    lang,
    title: t.pageTitle.monitor,
    description: clip(t.seo.monitorDescription(interfaces.length, withAlt), t.seo.descriptionMax),
    path,
    alternates: alternatesFor('/monitor'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: t.seo.siteName,
          url: absoluteUrl(siteUrl, localizePath('/', lang)),
          inLanguage: HREFLANG[lang],
          publisher: ORG
        },
        {
          '@type': 'Dataset',
          name: t.seo.datasetName,
          description: t.seo.datasetDescription,
          url: absoluteUrl(siteUrl, path),
          inLanguage: HREFLANG[lang],
          creator: ORG,
          dateModified: meta.generated,
          isAccessibleForFree: true,
          keywords: ['DeFi', 'geo-blocking', 'wallet screening', 'sanctions compliance', 'OFAC', 'permissionless interfaces', 'censorship'],
          variableMeasured: [
            'restriction level',
            'site geo-block',
            'feature geo-gate',
            'wallet screening',
            'VPN detection',
            'country status'
          ]
        }
      ]
    }
  };
}

export function interfaceMeta(e: InterfaceEntry, meta: DatasetMeta, siteUrl: string, lang: Lang = 'en'): PageMeta {
  const t = catalog(lang);
  const base = `/monitor/${e.id}`;
  const path = localizePath(base, lang);
  const description = clip(
    t.seo.ifaceDescription(e.name, restrictionSummary(e, lang), e.level, e.alternatives[0]?.name ?? ''),
    t.seo.descriptionMax
  );
  return {
    lang,
    title: t.pageTitle.iface(e.name, e.level),
    description,
    path,
    alternates: alternatesFor(base),
    type: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: t.seo.ifacePageName(e.name),
          description,
          url: absoluteUrl(siteUrl, path),
          inLanguage: HREFLANG[lang],
          dateModified: meta.generated,
          isPartOf: { '@type': 'WebSite', name: t.seo.siteName, url: absoluteUrl(siteUrl, localizePath('/', lang)) },
          about: {
            '@type': 'WebApplication',
            name: e.name,
            url: e.url,
            description: lang === 'zh' && e.description_zh ? e.description_zh : e.description,
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web'
          }
        },
        breadcrumb(siteUrl, [
          [t.layout.tabs.monitor, localizePath('/monitor', lang)],
          [e.name, path]
        ])
      ]
    }
  };
}

export function methodologyMeta(meta: DatasetMeta, siteUrl: string, lang: Lang = 'en'): PageMeta {
  const t = catalog(lang);
  const path = localizePath('/methodology', lang);
  const description = t.seo.methodologyDescription;
  return {
    lang,
    title: t.pageTitle.methodology,
    description,
    path,
    alternates: alternatesFor('/methodology'),
    type: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: t.method.title,
          description,
          url: absoluteUrl(siteUrl, path),
          inLanguage: HREFLANG[lang],
          dateModified: meta.generated
        },
        breadcrumb(siteUrl, [
          [t.layout.tabs.monitor, localizePath('/monitor', lang)],
          [t.method.title, path]
        ])
      ]
    }
  };
}

export const notFoundMeta = (lang: Lang = 'en'): PageMeta => ({
  lang,
  title: catalog(lang).pageTitle.notFound,
  description: catalog(lang).seo.notFoundDescription,
  path: '',
  alternates: [],
  noindex: true
});
