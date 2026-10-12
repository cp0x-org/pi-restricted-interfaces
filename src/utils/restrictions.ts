import {
  BASES,
  CATEGORY_GROUPS,
  CHAIN_TAGS,
  CONFIDENCE,
  CountryToken,
  CountryVerdict,
  DatasetMeta,
  EvidenceLink,
  FAIL_MODES,
  InterfaceEntry,
  InterfaceRow,
  LAYERS,
  LEVELS,
  LIFECYCLES,
  Level,
  MechanismKind,
  Monitor,
  OBS_KINDS,
  OBS_STATES,
  ObservedCountry,
  Observation,
  PROXY_TYPES,
  REPO_STATES,
  STATUS,
  Status,
  TOS_US,
  VPN_STATUS
} from '../types/restrictions';

// ---------------------------------------------------------------------------- site file validation
// The JSON literal types widen to `string`, so the files are narrowed here, failing loudly on a schema mismatch
// (monitor/scripts/build.py and check_export.py are the primary gates).

const SITE_SCHEMA = 3;

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string');

function oneOf<T extends string>(allowed: readonly T[], value: unknown, where: string): T {
  if (typeof value !== 'string' || !(allowed as readonly string[]).includes(value)) {
    throw new Error(`site data: ${where}=${JSON.stringify(value)}, expected one of ${allowed.join(' | ')}`);
  }
  return value as T;
}

function oneOfOrNull<T extends string>(allowed: readonly T[], value: unknown, where: string): T | null {
  return value === null ? null : oneOf(allowed, value, where);
}

function str(value: unknown, where: string): string {
  if (typeof value !== 'string') throw new Error(`site data: ${where} must be a string`);
  return value;
}

function strOrNull(value: unknown, where: string): string | null {
  return value === null ? null : str(value, where);
}

function tokens(value: unknown, where: string): CountryToken[] {
  if (!isStringArray(value)) throw new Error(`site data: ${where} must be a list of country tokens`);
  return value;
}

function observedCountry(raw: unknown, where: string): ObservedCountry {
  if (!isRecord(raw)) throw new Error(`site data: ${where} is not an object`);
  return {
    country: str(raw.country, `${where}.country`),
    proxy_type: oneOf(PROXY_TYPES, raw.proxy_type, `${where}.proxy_type`),
    at: str(raw.at, `${where}.at`),
    kind: oneOf(OBS_KINDS, raw.kind, `${where}.kind`),
    url: str(raw.url, `${where}.url`),
    http_status: typeof raw.http_status === 'number' ? raw.http_status : null,
    ui_state: oneOf(OBS_STATES, raw.ui_state, `${where}.ui_state`),
    note: typeof raw.note === 'string' ? raw.note : ''
  };
}

function observation(raw: unknown, where: string): Observation {
  const base = observedCountry(raw, where);
  const r = raw as Record<string, unknown>;
  const flags: Record<string, string | number | boolean> = {};
  if (isRecord(r.flags)) {
    Object.entries(r.flags).forEach(([k, v]) => {
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') flags[k] = v;
    });
  }
  return {
    ...base,
    region: strOrNull(r.region, `${where}.region`),
    final_url: typeof r.final_url === 'string' ? r.final_url : '',
    flags
  };
}

/** The dashboard row of one interface (monitor.json). */
function row(raw: unknown, where: string): InterfaceRow {
  if (!isRecord(raw)) throw new Error(`site data: ${where} is not an object`);
  const id = str(raw.id, `${where}.id`);
  const w = (field: string) => `${id}.${field}`;
  const gs = isRecord(raw.geo_site) ? raw.geo_site : {};
  const gf = isRecord(raw.geo_feature) ? raw.geo_feature : {};
  const vpn = isRecord(raw.vpn) ? raw.vpn : {};
  const sc = isRecord(raw.screening) ? raw.screening : {};
  const tos = isRecord(raw.tos) ? raw.tos : {};
  const alternatives = Array.isArray(raw.alternatives) ? raw.alternatives : [];
  return {
    id,
    name: str(raw.name, w('name')),
    version: typeof raw.version === 'string' && raw.version ? raw.version : undefined,
    aka: typeof raw.aka === 'string' && raw.aka ? raw.aka : undefined,
    family: typeof raw.family === 'string' && raw.family ? raw.family : undefined,
    lifecycle: raw.lifecycle === undefined ? 'current' : oneOf(LIFECYCLES, raw.lifecycle, w('lifecycle')),
    lifecycle_note: typeof raw.lifecycle_note === 'string' && raw.lifecycle_note ? raw.lifecycle_note : undefined,
    category: str(raw.category, w('category')),
    category_group: oneOf(CATEGORY_GROUPS, raw.category_group, w('category_group')),
    networks: isStringArray(raw.networks) ? raw.networks : [],
    url: str(raw.url, w('url')),
    referral_url: typeof raw.referral_url === 'string' && raw.referral_url ? raw.referral_url : undefined,
    frontend_repo: strOrNull(raw.frontend_repo, w('frontend_repo')),
    repo_state: oneOf(REPO_STATES, raw.repo_state, w('repo_state')),
    geo_site: {
      s: oneOf(STATUS, gs.s, w('geo_site.s')),
      countries: tokens(gs.countries, w('geo_site.countries')),
      close_only: tokens(gs.close_only, w('geo_site.close_only')),
      method: str(gs.method, w('geo_site.method'))
    },
    geo_feature: {
      s: oneOf(STATUS, gf.s, w('geo_feature.s')),
      countries: tokens(gf.countries, w('geo_feature.countries')),
      scope: str(gf.scope, w('geo_feature.scope'))
    },
    vpn: { s: oneOf(VPN_STATUS, vpn.s, w('vpn.s')), note: str(vpn.note, w('vpn.note')) },
    screening: {
      s: oneOf(STATUS, sc.s, w('screening.s')),
      provider: str(sc.provider, w('screening.provider')),
      layer: oneOfOrNull(LAYERS, sc.layer, w('screening.layer'))
    },
    kyc: isRecord(raw.kyc) ? { s: oneOf(STATUS, raw.kyc.s, w('kyc.s')) } : undefined,
    tos: {
      us: oneOf(TOS_US, tos.us, w('tos.us')),
      us_scope: str(tos.us_scope, w('tos.us_scope')),
      restricted: str(tos.restricted, w('tos.restricted')),
      restricted_codes: tokens(tos.restricted_codes, w('tos.restricted_codes'))
    },
    alternatives: alternatives.map((a, n) => {
      if (!isRecord(a)) throw new Error(`site data: ${id}.alternatives[${n}] is not an object`);
      return { name: str(a.name, w('alternatives.name')), url: str(a.url, w('alternatives.url')) };
    }),
    level: oneOf(LEVELS, raw.level, w('level')),
    restrictions: isRecord(raw.restrictions)
      ? {
          count: typeof raw.restrictions.count === 'number' ? raw.restrictions.count : 0,
          countries: typeof raw.restrictions.countries === 'number' ? raw.restrictions.countries : 0,
          mechanisms: (isStringArray(raw.restrictions.mechanisms) ? raw.restrictions.mechanisms : []).map((m) =>
            oneOf(['geo_site', 'geo_feature', 'screening', 'vpn', 'kyc'] as const, m, w('restrictions.mechanisms'))
          )
        }
      : { count: 0, countries: 0, mechanisms: [] },
    observed: (Array.isArray(raw.observed) ? raw.observed : []).map((o, n) => observedCountry(o, `${id}.observed[${n}]`))
  };
}

/** Narrow one interfaces/<id>.json to InterfaceEntry (the row fields plus everything the interface page shows). */
export function assertEntry(raw: unknown): InterfaceEntry {
  const base = row(raw, 'interface');
  const r = raw as Record<string, unknown>;
  const id = base.id;
  const w = (field: string) => `${id}.${field}`;
  const sc = isRecord(r.screening) ? r.screening : {};
  const tos = isRecord(r.tos) ? r.tos : {};
  return {
    ...base,
    description: typeof r.description === 'string' ? r.description : '',
    description_zh: typeof r.description_zh === 'string' ? r.description_zh : undefined,
    chains: str(r.chains, w('chains')),
    chain_tags: (isStringArray(r.chain_tags) ? r.chain_tags : []).map((t) => oneOf(CHAIN_TAGS, t, w('chain_tags'))),
    repo_status: str(r.repo_status, w('repo_status')),
    repo_last_commit: strOrNull(r.repo_last_commit, w('repo_last_commit')),
    screening: {
      ...base.screening,
      fail: oneOfOrNull(FAIL_MODES, sc.fail, w('screening.fail')),
      fail_note: str(sc.fail_note, w('screening.fail_note'))
    },
    kyc: isRecord(r.kyc)
      ? {
          s: oneOf(STATUS, r.kyc.s, w('kyc.s')),
          layer: oneOfOrNull(LAYERS, r.kyc.layer, w('kyc.layer')),
          scope: str(r.kyc.scope, w('kyc.scope'))
        }
      : undefined,
    asset_filter: str(r.asset_filter, w('asset_filter')),
    tos: { ...base.tos, url: strOrNull(tos.url, w('tos.url')), updated: str(tos.updated, w('tos.updated')) },
    notes: str(r.notes, w('notes')),
    live: isStringArray(r.live) ? r.live : [],
    geo_endpoints: isStringArray(r.geo_endpoints) ? r.geo_endpoints : [],
    api_probes: (Array.isArray(r.api_probes) ? r.api_probes : []).filter(isRecord).map((p, n) => ({
      name: str(p.name, w(`api_probes[${n}].name`)),
      method: p.method === 'POST' ? 'POST' : 'GET',
      url: str(p.url, w(`api_probes[${n}].url`)),
      note: typeof p.note === 'string' ? p.note : ''
    })),
    evidence: isStringArray(r.evidence) ? r.evidence : [],
    confidence: oneOf(CONFIDENCE, r.confidence, w('confidence')),
    observations: (Array.isArray(r.observations) ? r.observations : []).map((o, n) => observation(o, `${id}.observations[${n}]`))
  };
}

function datasetMeta(meta: Record<string, unknown>, total: number): DatasetMeta {
  if (meta.schema_version !== SITE_SCHEMA) throw new Error(`monitor.json: meta.schema_version must be ${SITE_SCHEMA}`);
  if (!isRecord(meta.regions)) throw new Error('monitor.json: meta.regions missing');
  return {
    schema_version: SITE_SCHEMA,
    generated: str(meta.generated, 'meta.generated'),
    sanctioned_test_address: str(meta.sanctioned_test_address, 'meta.sanctioned_test_address'),
    sanctioned_test_address_note: str(meta.sanctioned_test_address_note, 'meta.sanctioned_test_address_note'),
    live_check_egress: str(meta.live_check_egress, 'meta.live_check_egress'),
    status_values: str(meta.status_values, 'meta.status_values'),
    layer_values: str(meta.layer_values, 'meta.layer_values'),
    country_tokens: str(meta.country_tokens, 'meta.country_tokens'),
    regions: Object.fromEntries(Object.entries(meta.regions).map(([k, v]) => [k, str(v, `meta.regions.${k}`)])),
    catalog_total: typeof meta.catalog_total === 'number' ? meta.catalog_total : total,
    scope: typeof meta.scope === 'string' ? meta.scope : 'all interfaces',
    defunct_hidden: isStringArray(meta.defunct_hidden) ? meta.defunct_hidden : []
  };
}

/** Narrow the imported monitor.json to Monitor, failing loudly on a schema mismatch. */
export function assertMonitor(raw: unknown): Monitor {
  if (!isRecord(raw) || !isRecord(raw.meta) || !Array.isArray(raw.interfaces)) {
    throw new Error('monitor.json: expected { meta, interfaces[] }');
  }
  const interfaces = raw.interfaces.map((r, n) => row(r, `interfaces[${n}]`));
  const ids = new Set<string>();
  interfaces.forEach((i) => {
    if (ids.has(i.id)) throw new Error(`monitor.json: duplicate id ${i.id}`);
    ids.add(i.id);
  });
  return { meta: datasetMeta(raw.meta, interfaces.length), interfaces };
}

// ---------------------------------------------------------------------------- ordering helpers

export const levelRank = (level: Level): number => LEVELS.indexOf(level);

/** The official-app link opens the referral link when there is one; its text still shows url. */
export const appHref = (e: Pick<InterfaceEntry, 'url' | 'referral_url'>): string => e.referral_url ?? e.url;

/** Name with the version label: "Aave" + "V3" -> "Aave V3". */
export const displayName = (e: Pick<InterfaceEntry, 'name' | 'version'>): string => (e.version ? `${e.name} ${e.version}` : e.name);

/** Name with the second name for page titles and search engines; on the page the second name is shown in grey. */
export const fullName = (e: Pick<InterfaceEntry, 'name' | 'version' | 'aka'>): string =>
  e.aka ? `${displayName(e)} (${e.aka})` : displayName(e);

/**
 * Search the name as shown in the table (Sky ex-Maker), in titles (Sky (ex-Maker)), the id and the URL.
 * Keep each form on its own line so a query cannot join two fields.
 */
export const searchText = (e: Pick<InterfaceEntry, 'name' | 'version' | 'aka' | 'id' | 'url'>): string =>
  [`${displayName(e)} ${e.aka ?? ''}`, fullName(e), e.id, e.url].join('\n').toLowerCase();

/** 0 for current interfaces, 1 for legacy ones (they go to the bottom of the default order). */
export const lifecycleRank = (e: InterfaceRow): number => (e.lifecycle === 'legacy' ? 1 : 0);

/** Breakdown behind the rating, e.g. "33 restrictions: 31 countries + Feature Block, Wallet screening". */
export const restrictionsText = (
  e: InterfaceRow,
  tip: (n: number, countries: number, mechanisms: string) => string,
  labels: Record<MechanismKind, string>,
  sep: string,
  notDetermined: string
): string =>
  e.level === 'n/a'
    ? notDetermined
    : tip(e.restrictions.count, e.restrictions.countries, e.restrictions.mechanisms.map((m) => labels[m]).join(sep));

/** Most restricted first: rating, then the number of restrictions, then name. */
export const compareByLevelThenName = (a: InterfaceRow, b: InterfaceRow): number =>
  levelRank(a.level) - levelRank(b.level) || b.restrictions.count - a.restrictions.count || displayName(a).localeCompare(displayName(b));

// ---------------------------------------------------------------------------- country tokens

/** 'UA-Crimea' -> 'UA'; 'US' -> 'US'. */
export const parentOf = (token: CountryToken): string => {
  const dash = token.indexOf('-');
  return dash === -1 ? token : token.slice(0, dash);
};

export const isRegionToken = (token: CountryToken): boolean => token.includes('-');

/**
 * Compare Terms with the Geo Block lists (blocked and close-only) so the page does not repeat a country list.
 * These are recorded lists, not proof of access: a country outside the Geo Block lists has not been noted as blocked,
 * which does not mean it is open. A region is covered by its country (US-NY by US).
 * Without a Geo Block list there is nothing to compare: compared is false and onlyInTerms is the full Terms list.
 */
export function tosAgainstGeo(e: Pick<InterfaceRow, 'geo_site' | 'tos'>): {
  compared: boolean;
  onlyInTerms: CountryToken[];
  blockedNotNamed: CountryToken[];
} {
  const geo = [...e.geo_site.countries, ...e.geo_site.close_only];
  const named = e.tos.restricted_codes;
  const covered = (list: CountryToken[], t: CountryToken): boolean => list.includes(t) || list.includes(parentOf(t));
  const compared = geo.length > 0 && named.length > 0;
  return {
    compared,
    onlyInTerms: compared ? named.filter((t) => !covered(geo, t)) : named,
    blockedNotNamed: compared ? e.geo_site.countries.filter((t) => !covered(named, t)) : []
  };
}

const enforced = (s: Status): boolean => s === 'yes' || s === 'reported';

const basisOf = (s: Status): CountryVerdict['basis'] => (s === 'yes' ? 'confirmed' : s === 'reported' ? 'reported' : 'inferred');

const regionsOf = (list: CountryToken[], cc: string): CountryToken[] => list.filter((t) => t !== cc && parentOf(t) === cc);

/**
 * What a user from country `cc` (ISO2) can expect from this interface.
 * Precedence: blocked > close_only > feature_limited > regional (enforced) > tos_only > regional (ToS) > unknown > ok.
 * Wallet screening and VPN detection are country-independent and are not folded in.
 */
export function staticCountryVerdict(e: InterfaceRow, cc: string): CountryVerdict {
  const { geo_site: gs, geo_feature: gf, tos } = e;
  const none: CountryToken[] = [];

  if (enforced(gs.s) && gs.countries.includes(cc)) {
    return { status: 'blocked', basis: basisOf(gs.s), detail: gs.method, regions: none };
  }
  if (enforced(gs.s) && gs.close_only.includes(cc)) {
    return { status: 'close_only', basis: basisOf(gs.s), detail: gs.method, regions: none };
  }
  if (enforced(gf.s) && gf.countries.includes(cc)) {
    return { status: 'feature_limited', basis: basisOf(gf.s), detail: gf.scope, regions: none };
  }
  if (cc === 'US' && tos.us === 'partial') {
    return { status: 'feature_limited', basis: 'tos', detail: tos.us_scope || tos.restricted, regions: none };
  }

  const enforcedRegions = [
    ...(enforced(gs.s) ? [...regionsOf(gs.countries, cc), ...regionsOf(gs.close_only, cc)] : []),
    ...(enforced(gf.s) ? regionsOf(gf.countries, cc) : [])
  ];
  if (enforcedRegions.length > 0) {
    const confirmed = (enforced(gs.s) && gs.s === 'yes' && regionsOf([...gs.countries, ...gs.close_only], cc).length > 0) || gf.s === 'yes';
    return { status: 'regional', basis: confirmed ? 'confirmed' : 'reported', detail: gs.method || gf.scope, regions: enforcedRegions };
  }

  if (tos.restricted_codes.includes(cc) || (cc === 'US' && tos.us === 'yes')) {
    const parts = [tos.restricted];
    if (cc === 'US' && tos.us === 'yes') parts.push(tos.us_scope ? `US persons: ${tos.us_scope}` : 'US persons are excluded');
    return { status: 'tos_only', basis: 'tos', detail: parts.filter(Boolean).join('. '), regions: none };
  }
  const tosRegions = regionsOf(tos.restricted_codes, cc);
  if (tosRegions.length > 0) {
    return { status: 'regional', basis: 'tos', detail: tos.restricted, regions: tosRegions };
  }

  if (gs.s === 'unknown' || (enforced(gs.s) && gs.countries.length === 0)) {
    return {
      status: 'unknown',
      basis: 'inferred',
      detail: gs.method || 'Geo-blocking not assessed, or the country list is not published',
      regions: none
    };
  }
  return {
    status: 'ok',
    basis: 'inferred',
    detail: gs.s === 'optional' ? 'Optional gate in code, off by default' : 'No country-level restriction found',
    regions: none
  };
}

const observedRestriction = (o: ObservedCountry): CountryVerdict['status'] | null =>
  o.ui_state === 'blocked' || o.ui_state === 'close_only' || o.ui_state === 'feature_limited' ? o.ui_state : null;

const KIND_LABELS: Record<ObservedCountry['kind'], string> = { site: 'Landing page', geo_endpoint: 'Geo endpoint', api: 'API' };

const describe = (o: ObservedCountry): string =>
  `${KIND_LABELS[o.kind]} ${o.url} → HTTP ${o.http_status ?? '—'}${o.note ? `; ${o.note}` : ''}`;

/**
 * Static verdict (code, docs, ToS) combined with the live observation the probe left for this country (export.py picks
 * one per country: the most trusted vantage, newest; a restriction first, then the protocol's API saying "no
 * restriction", then a served landing page). An observed block wins over any inference; an observed "no restriction"
 * upgrades ok/unknown to an observed ok; otherwise the static verdict stays and the observation is attached, flagged as
 * a conflict when they disagree.
 */
export function countryVerdict(e: InterfaceRow, cc: string): CountryVerdict {
  const base = staticCountryVerdict(e, cc);
  const o = e.observed.find((x) => x.country === cc);
  if (!o) return base;

  const observed = observedRestriction(o);
  if (observed) {
    // The static classification is finer than an HTTP probe (close-only vs blocked, feature-limited vs blocked):
    // when both agree that something is restricted, keep the static status and let the observation confirm it.
    const restrictedStatically = base.status === 'blocked' || base.status === 'close_only' || base.status === 'feature_limited';
    const status = restrictedStatically ? base.status : observed;
    const detail = restrictedStatically ? `${base.detail} Confirmed live: ${describe(o)}` : describe(o);
    return { status, basis: 'observed', detail, regions: [], observation: o, conflict: base.status === 'ok' };
  }
  if (o.ui_state === 'ok' && (o.kind === 'api' || o.kind === 'site')) {
    if (base.status === 'ok' || base.status === 'unknown') {
      return {
        status: 'ok',
        basis: 'observed',
        detail:
          o.kind === 'api'
            ? `The protocol's API reported no restriction (${o.note}); wallet screening not evaluated`
            : 'No edge-level block observed; client-side gates not evaluated',
        regions: [],
        observation: o
      };
    }
    return { ...base, observation: o, conflict: base.status === 'blocked' || base.status === 'close_only' };
  }
  return { ...base, observation: o };
}

/** Country statuses that mean the country is named in a restriction (enforced or only in the ToS). */
export const RESTRICTED_STATUSES: CountryVerdict['status'][] = ['blocked', 'close_only', 'feature_limited', 'regional', 'tos_only'];

export const countryStatusRank = (status: CountryVerdict['status']): number =>
  ['blocked', 'close_only', 'feature_limited', 'regional', 'tos_only', 'unknown', 'ok'].indexOf(status);

export const basisRank = (basis: CountryVerdict['basis']): number => BASES.indexOf(basis);

// ---------------------------------------------------------------------------- mechanisms

/** True when the mechanism is technically present (confirmed, reported or optional code), not merely reserved in the ToS. */
export function hasMechanism(e: InterfaceRow, kind: MechanismKind): boolean {
  switch (kind) {
    case 'geo_site':
      return enforced(e.geo_site.s) || e.geo_site.s === 'optional';
    case 'geo_feature':
      return enforced(e.geo_feature.s) || e.geo_feature.s === 'optional';
    case 'screening':
      return enforced(e.screening.s) || e.screening.s === 'optional';
    case 'vpn':
      return e.vpn.s === 'detect' || e.vpn.s === 'block' || e.vpn.s === 'optional';
    case 'kyc':
      return !!e.kyc && enforced(e.kyc.s);
    default:
      return false;
  }
}

// ---------------------------------------------------------------------------- GitHub helpers

export interface GithubRef {
  owner: string;
  repo: string;
  branch?: string;
  subdir?: string;
}

const GITHUB_RE = /^https:\/\/github\.com\/([^/]+)\/([^/#?]+)(?:\/tree\/([^/]+)(?:\/(.*))?)?/;

export function parseGithubRepo(url: string | null): GithubRef | null {
  if (!url) return null;
  const m = GITHUB_RE.exec(url);
  if (!m) return null;
  return { owner: m[1], repo: m[2], branch: m[3], subdir: m[4] };
}

/** 'https://github.com/aave/interface/tree/main/apps/web' -> 'aave/interface/apps/web' */
export function repoShortLabel(url: string): string {
  const ref = parseGithubRepo(url);
  if (!ref) return url.replace(/^https?:\/\//, '');
  return [ref.owner, ref.repo, ref.subdir].filter(Boolean).join('/');
}

const OWNER_REPO_EVIDENCE = /^([\w.-]+\/[\w.-]+):\s*(.+)$/;

/** Evidence strings -> clickable links. Repo-relative paths are pinned to the branch from frontend_repo (or HEAD). */
export function evidenceLinks(e: Pick<InterfaceEntry, 'evidence' | 'frontend_repo'>): EvidenceLink[] {
  const own = parseGithubRepo(e.frontend_repo);
  const links: EvidenceLink[] = [];
  e.evidence.forEach((ev) => {
    if (/^https?:\/\//.test(ev)) {
      links.push({ label: ev.replace(/^https?:\/\//, ''), href: ev });
      return;
    }
    const other = OWNER_REPO_EVIDENCE.exec(ev);
    if (other) {
      const [owner, repo] = other[1].split('/');
      other[2]
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
        .forEach((path) =>
          links.push({ label: `${owner}/${repo}: ${path}`, href: `https://github.com/${owner}/${repo}/blob/HEAD/${path}` })
        );
      return;
    }
    if (own && !ev.includes(' ')) {
      links.push({ label: ev, href: `https://github.com/${own.owner}/${own.repo}/blob/${own.branch ?? 'HEAD'}/${ev}` });
      return;
    }
    links.push({ label: ev });
  });
  return links;
}
