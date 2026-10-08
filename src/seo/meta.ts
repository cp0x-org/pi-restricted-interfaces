// Page metadata (title, description, canonical path, JSON-LD) shared by the running app (usePageMeta) and by the
// build-time prerender in vite.config.mts. Keep this file free of browser APIs, import.meta.env and baseUrl imports.
import type { DatasetMeta, InterfaceEntry } from '../types/restrictions';
import { LAYER_LABELS, LEVEL_DESCRIPTIONS } from '../views/monitor/constants';

export const SITE_NAME = 'DeFi Interface Restrictions Monitor';
const SITE_BRAND = 'cp0x';
export const TWITTER_HANDLE = '@cp0xdotcom';
export const OG_IMAGE_PATH = '/og-image.png';
const ORG = {
  '@type': 'Organization',
  name: 'cp0x',
  url: 'https://cp0x.com',
  sameAs: ['https://x.com/cp0xdotcom', 'https://t.me/cp0xdotcom']
};

export interface PageMeta {
  title: string;
  description: string;
  /** Canonical path ('/monitor/aave'); the site origin is added by the caller. */
  path: string;
  noindex?: boolean;
  type?: 'website' | 'article';
  jsonLd?: Record<string, unknown>;
}

/** Joins the configured site origin and a path; returns the bare path when the origin is unknown. */
export const absoluteUrl = (siteUrl: string, path: string): string => (siteUrl ? siteUrl.replace(/\/+$/, '') + path : path);

/** Cuts text at a word boundary so meta descriptions stay within what search engines display. */
function clip(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s-]+$/, '') + '…';
}

/** Short plain-language summary of what an interface restricts, e.g. "geo-blocks 22 countries; screens wallets (own API)". */
function restrictionSummary(e: InterfaceEntry): string {
  const parts: string[] = [];
  const geo = e.geo_site;
  if (geo.s === 'yes') parts.push(geo.countries.length ? `geo-blocks ${geo.countries.length} countries` : 'geo-blocks the site');
  else if (geo.s === 'reported') parts.push('reported geo-block');
  else if (geo.s === 'tos_only') parts.push('geo-block only in its ToS');
  if (geo.close_only.length) parts.push(`close-only in ${geo.close_only.length} more`);
  if (e.geo_feature.s === 'yes') parts.push('hides features or assets by country');
  if (e.screening.s === 'yes' || e.screening.s === 'reported')
    parts.push(`screens wallets${e.screening.layer ? ` (${LAYER_LABELS[e.screening.layer]})` : ''}`);
  if (e.vpn.s === 'detect' || e.vpn.s === 'block') parts.push(e.vpn.s === 'block' ? 'blocks VPN users' : 'detects VPN users');
  return parts.length ? parts.join('; ') : 'no technical restriction found';
}

export function monitorMeta(meta: DatasetMeta, interfaces: InterfaceEntry[], siteUrl: string): PageMeta {
  const withAlt = interfaces.filter((i) => i.alternatives.length > 0).length;
  const description = clip(
    `Which official DeFi interfaces geo-block countries, screen wallets or hide features: ${interfaces.length} EVM apps ranked A–D with evidence, per-country status and ${withAlt} permissionless alternatives.`
  );
  return {
    title: `${SITE_NAME} | ${SITE_BRAND}`,
    description,
    path: '/monitor',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebSite', name: SITE_NAME, url: absoluteUrl(siteUrl, '/'), publisher: ORG },
        {
          '@type': 'Dataset',
          name: 'Access restrictions in official DeFi interfaces',
          description:
            'Catalog of geo-blocking, feature and asset gating, wallet screening and VPN detection in the official web interfaces of DeFi protocols on EVM networks, with the enforcement layer, fork readiness and evidence for every claim.',
          url: absoluteUrl(siteUrl, '/monitor'),
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

export function interfaceMeta(e: InterfaceEntry, meta: DatasetMeta, siteUrl: string): PageMeta {
  const path = `/monitor/${e.id}`;
  const alt = e.alternatives[0];
  const description = clip(
    `${e.name}: ${restrictionSummary(e)}. Restriction level ${e.level}.${alt ? ` Permissionless alternative: ${alt.name}.` : ''} Evidence, countries and fork notes.`
  );
  return {
    title: `${e.name} geo-blocking & wallet screening (level ${e.level}) | ${SITE_BRAND}`,
    description,
    path,
    type: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: `${e.name}: access restrictions of the official interface`,
          description,
          url: absoluteUrl(siteUrl, path),
          dateModified: meta.generated,
          isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: absoluteUrl(siteUrl, '/') },
          about: {
            '@type': 'WebApplication',
            name: e.name,
            url: e.url,
            description: e.description,
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web'
          }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Monitor', item: absoluteUrl(siteUrl, '/monitor') },
            { '@type': 'ListItem', position: 2, name: e.name, item: absoluteUrl(siteUrl, path) }
          ]
        }
      ]
    }
  };
}

export function methodologyMeta(meta: DatasetMeta, siteUrl: string): PageMeta {
  const description =
    'How the monitor checks DeFi interfaces: restriction levels A–D, status values, where screening runs, per-country rules, live proxy probes and limitations.';
  return {
    title: `Methodology: how DeFi interface restrictions are checked | ${SITE_BRAND}`,
    description,
    path: '/methodology',
    type: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebPage', name: 'Methodology', description, url: absoluteUrl(siteUrl, '/methodology'), dateModified: meta.generated },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Monitor', item: absoluteUrl(siteUrl, '/monitor') },
            { '@type': 'ListItem', position: 2, name: 'Methodology', item: absoluteUrl(siteUrl, '/methodology') }
          ]
        }
      ]
    }
  };
}

export const notFoundMeta = (): PageMeta => ({
  title: `Page not found | ${SITE_BRAND}`,
  description: 'This page does not exist in the DeFi Interface Restrictions Monitor.',
  path: '',
  noindex: true
});

export const levelSentence = (e: InterfaceEntry): string => `Restriction level ${e.level}: ${LEVEL_DESCRIPTIONS[e.level]}.`;
