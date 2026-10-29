// Aggregates for the Summary tab (also used by the build-time prerender, so imports stay relative).
import { LEVELS } from '../types/restrictions';
import type { CountryToken, InterfaceRow, Layer, Level, MechanismKind } from '../types/restrictions';

/** Enforced = confirmed or reported; ToS only = written in the terms, not enforced; none = checked, not found (or off by default). */
export const MECHANISM_STATES = ['enforced', 'tos_only', 'none', 'unknown'] as const;
export type MechanismState = (typeof MECHANISM_STATES)[number];

const SUMMARY_MECHANISMS: MechanismKind[] = ['geo_site', 'geo_feature', 'screening', 'vpn', 'kyc'];

const PROVIDERS = ['trm', 'chainalysis', 'hypernative', 'hermod', 'hackbounty', 'list', 'undisclosed'] as const;
type Provider = (typeof PROVIDERS)[number];

export interface GroupRow {
  key: string;
  total: number;
  /** Interfaces with a rating (n/a left out), the denominator of the "no restrictions" share. */
  rated: number;
  clean: number;
  /** clean / rated, 0..1 (null when nothing is rated). */
  cleanShare: number | null;
  /** Mean number of restrictions over the interfaces that have at least one (zeros left out). */
  avgRestricted: number | null;
  max: number;
  maxIds: string[];
  levels: Record<Level, number>;
}

interface CountryRow {
  token: CountryToken;
  /** Interfaces blocking the whole site or trading there (enforced). */
  site: number;
  /** Interfaces blocking only features or assets there (enforced). */
  feature: number;
  /** site + feature, each interface counted once. */
  total: number;
  /** Interfaces whose Terms of Service name it. */
  tos: number;
}

interface Summary {
  total: number;
  legacyExcluded: number;
  rated: number;
  clean: number;
  restricted: number;
  avgRestricted: number | null;
  max: number;
  maxIds: string[];
  /** Countries or regions blocked (site or feature level, enforced) by at least one interface. */
  countriesBlocked: number;
  levels: Record<Level, number>;
  mechanisms: { kind: MechanismKind; counts: Record<MechanismState, number> }[];
  screened: number;
  providers: { key: Provider; count: number }[];
  layers: { key: Layer; count: number }[];
  countries: CountryRow[];
  categories: GroupRow[];
  networks: GroupRow[];
  open: number;
  closed: number;
  /** Interfaces with at least one restriction, and how many of them have a cp0x permissionless version. */
  cp0x: { restricted: number; covered: number };
}

const ENFORCED = ['yes', 'reported'];

function mechanismState(e: InterfaceRow, kind: MechanismKind): MechanismState {
  if (kind === 'vpn') {
    const s = e.vpn.s;
    return s === 'detect' || s === 'block' ? 'enforced' : s === 'tos_only' ? 'tos_only' : s === 'unknown' ? 'unknown' : 'none';
  }
  if (kind === 'kyc' && !e.kyc) return 'none';
  const s = kind === 'geo_site' ? e.geo_site.s : kind === 'geo_feature' ? e.geo_feature.s : kind === 'screening' ? e.screening.s : e.kyc!.s;
  return ENFORCED.includes(s) ? 'enforced' : s === 'tos_only' ? 'tos_only' : s === 'unknown' ? 'unknown' : 'none';
}

const VENDOR_RE: [Provider, RegExp][] = [
  ['trm', /\btrm\b/i],
  ['chainalysis', /chainalysis/i],
  ['hypernative', /hypernative/i],
  ['hermod', /hermod|zeroshadow/i],
  ['hackbounty', /hackbounty/i]
];
const LIST_RE = /hardcoded|hard-coded|bundled blacklist|blacklist|blocklist|local list|static list|ofac list/i;

/** Screening providers named in the record; a list-only check is "list", anything unnamed is "undisclosed". */
function screeningProviders(e: InterfaceRow): Provider[] {
  const text = e.screening.provider || '';
  const found: Provider[] = VENDOR_RE.filter(([, re]) => re.test(text)).map(([p]) => p);
  if (LIST_RE.test(text)) found.push('list');
  const vendorNamed = found.some((p) => p !== 'list');
  if (!vendorNamed && (!found.length || /unnamed|own |not disclosed|paid provider|account-level|service|validation/i.test(text)))
    found.push('undisclosed');
  return found;
}

function emptyLevels(): Record<Level, number> {
  return Object.fromEntries(LEVELS.map((l) => [l, 0])) as Record<Level, number>;
}

function groupRow(key: string, rows: InterfaceRow[]): GroupRow {
  const levels = emptyLevels();
  rows.forEach((e) => (levels[e.level] += 1));
  const rated = rows.filter((e) => e.level !== 'n/a');
  const restricted = rows.filter((e) => e.restrictions.count > 0);
  const max = Math.max(0, ...rows.map((e) => e.restrictions.count));
  return {
    key,
    total: rows.length,
    rated: rated.length,
    clean: levels.A,
    cleanShare: rated.length ? levels.A / rated.length : null,
    avgRestricted: restricted.length ? restricted.reduce((s, e) => s + e.restrictions.count, 0) / restricted.length : null,
    max,
    maxIds: max > 0 ? rows.filter((e) => e.restrictions.count === max).map((e) => e.id) : [],
    levels
  };
}

/** Most permissionless first: share without restrictions, then the lower average, then size. */
const byPermissionless = (a: GroupRow, b: GroupRow): number =>
  (b.cleanShare ?? -1) - (a.cleanShare ?? -1) || (a.avgRestricted ?? 0) - (b.avgRestricted ?? 0) || b.total - a.total;

/**
 * Summary over the current interfaces (legacy versions are left out so a protocol is not counted twice).
 * Networks with fewer than `minNetwork` interfaces are dropped from the network breakdown.
 */
export function buildSummary(all: InterfaceRow[], minNetwork = 5): Summary {
  const items = all.filter((e) => e.lifecycle !== 'legacy');
  const overall = groupRow('all', items);

  const mechanisms = SUMMARY_MECHANISMS.map((kind) => {
    const counts = Object.fromEntries(MECHANISM_STATES.map((s) => [s, 0])) as Record<MechanismState, number>;
    items.forEach((e) => (counts[mechanismState(e, kind)] += 1));
    return { kind, counts };
  });

  const screenedItems = items.filter((e) => ENFORCED.includes(e.screening.s));
  const providerCounts = new Map<Provider, number>();
  screenedItems.forEach((e) => screeningProviders(e).forEach((p) => providerCounts.set(p, (providerCounts.get(p) ?? 0) + 1)));
  const layerCounts = new Map<Layer, number>();
  screenedItems.forEach((e) => e.screening.layer && layerCounts.set(e.screening.layer, (layerCounts.get(e.screening.layer) ?? 0) + 1));

  const countries = new Map<CountryToken, CountryRow>();
  const row = (token: CountryToken) => {
    if (!countries.has(token)) countries.set(token, { token, site: 0, feature: 0, total: 0, tos: 0 });
    return countries.get(token)!;
  };
  items.forEach((e) => {
    const site = ENFORCED.includes(e.geo_site.s) ? new Set([...e.geo_site.countries, ...e.geo_site.close_only]) : new Set<string>();
    const feature = ENFORCED.includes(e.geo_feature.s) ? new Set(e.geo_feature.countries) : new Set<string>();
    site.forEach((tok) => (row(tok).site += 1));
    feature.forEach((tok) => !site.has(tok) && (row(tok).feature += 1));
    new Set([...site, ...feature]).forEach((tok) => (row(tok).total += 1));
    new Set(e.tos.restricted_codes).forEach((tok) => (row(tok).tos += 1));
  });

  const byCategory = new Map<string, InterfaceRow[]>();
  items.forEach((e) => byCategory.set(e.category_group, [...(byCategory.get(e.category_group) ?? []), e]));
  const byNetwork = new Map<string, InterfaceRow[]>();
  items.forEach((e) => e.networks.forEach((n) => byNetwork.set(n, [...(byNetwork.get(n) ?? []), e])));

  const restrictedItems = items.filter((e) => e.restrictions.count > 0);
  return {
    total: items.length,
    legacyExcluded: all.length - items.length,
    rated: overall.rated,
    clean: overall.clean,
    restricted: restrictedItems.length,
    avgRestricted: overall.avgRestricted,
    max: overall.max,
    maxIds: overall.maxIds,
    countriesBlocked: [...countries.values()].filter((c) => c.total > 0).length,
    levels: overall.levels,
    mechanisms,
    screened: screenedItems.length,
    providers: PROVIDERS.map((key) => ({ key, count: providerCounts.get(key) ?? 0 }))
      .filter((p) => p.count > 0)
      .sort((a, b) => b.count - a.count),
    layers: [...layerCounts.entries()].map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count),
    countries: [...countries.values()].filter((c) => c.total > 0).sort((a, b) => b.total - a.total || b.site - a.site || b.tos - a.tos),
    categories: [...byCategory.entries()].map(([k, rows]) => groupRow(k, rows)).sort(byPermissionless),
    networks: [...byNetwork.entries()]
      .filter(([n, rows]) => rows.length >= minNetwork && !/any evm/i.test(n))
      .map(([k, rows]) => groupRow(k, rows))
      .sort(byPermissionless),
    open: items.filter((e) => e.frontend_repo !== null).length,
    closed: items.filter((e) => e.frontend_repo === null).length,
    cp0x: { restricted: restrictedItems.length, covered: restrictedItems.filter((e) => e.alternatives.length > 0).length }
  };
}

/** "43%" or "—"; used by the page and the prerender. */
export const pct = (part: number, whole: number): string => (whole > 0 ? `${Math.round((part / whole) * 100)}%` : '—');
export const share = (v: number | null): string => (v === null ? '—' : `${Math.round(v * 100)}%`);
export const avg = (v: number | null): string => (v === null ? '—' : v.toFixed(1));
