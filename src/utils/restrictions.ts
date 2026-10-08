import {
  BASES,
  CATEGORY_GROUPS,
  CHAIN_TAGS,
  CONFIDENCE,
  CountryToken,
  CountryVerdict,
  Dataset,
  EvidenceLink,
  FAIL_MODES,
  FORK_READY,
  InterfaceEntry,
  LAYERS,
  LEVELS,
  Level,
  MechanismKind,
  OBS_KINDS,
  OBS_STATES,
  Observation,
  PROXY_TYPES,
  REPO_STATES,
  STATUS,
  Status,
  TOS_US,
  VPN_STATUS
} from '../types/restrictions';

// ---------------------------------------------------------------------------- dataset validation

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string');

function oneOf<T extends string>(allowed: readonly T[], value: unknown, where: string): T {
  if (typeof value !== 'string' || !(allowed as readonly string[]).includes(value)) {
    throw new Error(`interfaces.json: ${where}=${JSON.stringify(value)}, expected one of ${allowed.join(' | ')}`);
  }
  return value as T;
}

function oneOfOrNull<T extends string>(allowed: readonly T[], value: unknown, where: string): T | null {
  return value === null ? null : oneOf(allowed, value, where);
}

function str(value: unknown, where: string): string {
  if (typeof value !== 'string') throw new Error(`interfaces.json: ${where} must be a string`);
  return value;
}

function strOrNull(value: unknown, where: string): string | null {
  return value === null ? null : str(value, where);
}

function tokens(value: unknown, where: string): CountryToken[] {
  if (!isStringArray(value)) throw new Error(`interfaces.json: ${where} must be a list of country tokens`);
  return value;
}

function observation(raw: unknown, where: string): Observation {
  if (!isRecord(raw)) throw new Error(`interfaces.json: ${where} is not an object`);
  const flags: Record<string, string | number | boolean> = {};
  if (isRecord(raw.flags)) {
    Object.entries(raw.flags).forEach(([k, v]) => {
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') flags[k] = v;
    });
  }
  return {
    country: str(raw.country, `${where}.country`),
    region: strOrNull(raw.region, `${where}.region`),
    proxy_type: oneOf(PROXY_TYPES, raw.proxy_type, `${where}.proxy_type`),
    at: str(raw.at, `${where}.at`),
    kind: oneOf(OBS_KINDS, raw.kind, `${where}.kind`),
    url: str(raw.url, `${where}.url`),
    http_status: typeof raw.http_status === 'number' ? raw.http_status : null,
    final_url: typeof raw.final_url === 'string' ? raw.final_url : '',
    ui_state: oneOf(OBS_STATES, raw.ui_state, `${where}.ui_state`),
    flags,
    note: typeof raw.note === 'string' ? raw.note : ''
  };
}

function entry(raw: unknown, index: number): InterfaceEntry {
  if (!isRecord(raw)) throw new Error(`interfaces.json: interfaces[${index}] is not an object`);
  const id = str(raw.id, `interfaces[${index}].id`);
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
    description: typeof raw.description === 'string' ? raw.description : '',
    category: str(raw.category, w('category')),
    category_group: oneOf(CATEGORY_GROUPS, raw.category_group, w('category_group')),
    chains: str(raw.chains, w('chains')),
    networks: isStringArray(raw.networks) ? raw.networks : [],
    chain_tags: (isStringArray(raw.chain_tags) ? raw.chain_tags : []).map((t) => oneOf(CHAIN_TAGS, t, w('chain_tags'))),
    url: str(raw.url, w('url')),
    frontend_repo: strOrNull(raw.frontend_repo, w('frontend_repo')),
    repo_state: oneOf(REPO_STATES, raw.repo_state, w('repo_state')),
    repo_status: str(raw.repo_status, w('repo_status')),
    repo_last_commit: strOrNull(raw.repo_last_commit, w('repo_last_commit')),
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
      layer: oneOfOrNull(LAYERS, sc.layer, w('screening.layer')),
      fail: oneOfOrNull(FAIL_MODES, sc.fail, w('screening.fail')),
      fail_note: str(sc.fail_note, w('screening.fail_note'))
    },
    asset_filter: str(raw.asset_filter, w('asset_filter')),
    tos: {
      url: strOrNull(tos.url, w('tos.url')),
      updated: str(tos.updated, w('tos.updated')),
      us: oneOf(TOS_US, tos.us, w('tos.us')),
      us_scope: str(tos.us_scope, w('tos.us_scope')),
      restricted: str(tos.restricted, w('tos.restricted')),
      restricted_codes: tokens(tos.restricted_codes, w('tos.restricted_codes'))
    },
    fork_notes: str(raw.fork_notes, w('fork_notes')),
    live: isStringArray(raw.live) ? raw.live : [],
    geo_endpoints: isStringArray(raw.geo_endpoints) ? raw.geo_endpoints : [],
    evidence: isStringArray(raw.evidence) ? raw.evidence : [],
    confidence: oneOf(CONFIDENCE, raw.confidence, w('confidence')),
    alternatives: alternatives.map((a, n) => {
      if (!isRecord(a)) throw new Error(`interfaces.json: ${id}.alternatives[${n}] is not an object`);
      return { name: str(a.name, w('alternatives.name')), url: str(a.url, w('alternatives.url')) };
    }),
    level: oneOf(LEVELS, raw.level, w('level')),
    fork_ready: oneOf(FORK_READY, raw.fork_ready, w('fork_ready')),
    observations: (Array.isArray(raw.observations) ? raw.observations : []).map((o, n) => observation(o, `${id}.observations[${n}]`))
  };
}

/** Narrow the imported JSON to Dataset, failing loudly on a schema mismatch (build.py is the primary gate). */
export function assertDataset(raw: unknown): Dataset {
  if (!isRecord(raw) || !isRecord(raw.meta) || !Array.isArray(raw.interfaces)) {
    throw new Error('interfaces.json: expected { meta, interfaces[] }');
  }
  const meta = raw.meta;
  if (meta.schema_version !== 2) throw new Error('interfaces.json: meta.schema_version must be 2');
  if (!isRecord(meta.regions)) throw new Error('interfaces.json: meta.regions missing');
  const interfaces = raw.interfaces.map(entry);
  const ids = new Set<string>();
  interfaces.forEach((i) => {
    if (ids.has(i.id)) throw new Error(`interfaces.json: duplicate id ${i.id}`);
    ids.add(i.id);
  });
  return {
    meta: {
      schema_version: 2,
      generated: str(meta.generated, 'meta.generated'),
      sanctioned_test_address: str(meta.sanctioned_test_address, 'meta.sanctioned_test_address'),
      sanctioned_test_address_note: str(meta.sanctioned_test_address_note, 'meta.sanctioned_test_address_note'),
      live_check_egress: str(meta.live_check_egress, 'meta.live_check_egress'),
      status_values: str(meta.status_values, 'meta.status_values'),
      layer_values: str(meta.layer_values, 'meta.layer_values'),
      country_tokens: str(meta.country_tokens, 'meta.country_tokens'),
      regions: Object.fromEntries(Object.entries(meta.regions).map(([k, v]) => [k, str(v, `meta.regions.${k}`)])),
      catalog_total: typeof meta.catalog_total === 'number' ? meta.catalog_total : interfaces.length,
      scope: typeof meta.scope === 'string' ? meta.scope : 'all interfaces'
    },
    interfaces
  };
}

// ---------------------------------------------------------------------------- ordering helpers

export const levelRank = (level: Level): number => LEVELS.indexOf(level);

export const compareByLevelThenName = (a: InterfaceEntry, b: InterfaceEntry): number =>
  levelRank(a.level) - levelRank(b.level) || a.name.localeCompare(b.name);

// ---------------------------------------------------------------------------- country tokens

/** 'UA-Crimea' -> 'UA'; 'US' -> 'US'. */
export const parentOf = (token: CountryToken): string => {
  const dash = token.indexOf('-');
  return dash === -1 ? token : token.slice(0, dash);
};

export const isRegionToken = (token: CountryToken): boolean => token.includes('-');

const enforced = (s: Status): boolean => s === 'yes' || s === 'reported';

const basisOf = (s: Status): CountryVerdict['basis'] => (s === 'yes' ? 'confirmed' : s === 'reported' ? 'reported' : 'inferred');

const regionsOf = (list: CountryToken[], cc: string): CountryToken[] => list.filter((t) => t !== cc && parentOf(t) === cc);

/**
 * What a user from country `cc` (ISO2) can expect from this interface.
 * Precedence: blocked > close_only > feature_limited > regional (enforced) > tos_only > regional (ToS) > unknown > ok.
 * Wallet screening and VPN detection are country-independent and are not folded in.
 */
export function staticCountryVerdict(e: InterfaceEntry, cc: string): CountryVerdict {
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

const PROXY_PREFERENCE: Record<Observation['proxy_type'], number> = { residential: 0, isp: 1, mobile: 2, direct: 3, datacenter: 4, tor: 5 };

/** Country-level (not region-specific) observations for `cc`, most trustworthy vantage first, newest first. */
export function observationsFor(e: InterfaceEntry, cc: string): Observation[] {
  return e.observations
    .filter((o) => o.country === cc && o.region === null)
    .sort((a, b) => PROXY_PREFERENCE[a.proxy_type] - PROXY_PREFERENCE[b.proxy_type] || b.at.localeCompare(a.at));
}

const observedRestriction = (o: Observation): CountryVerdict['status'] | null =>
  o.ui_state === 'blocked' || o.ui_state === 'close_only' || o.ui_state === 'feature_limited' ? o.ui_state : null;

const describe = (o: Observation): string =>
  `${o.kind === 'site' ? 'Landing page' : 'Geo endpoint'} ${o.url} → HTTP ${o.http_status ?? '—'}` +
  `${o.final_url && o.final_url !== o.url ? ` → ${o.final_url}` : ''}${o.note ? `; ${o.note}` : ''}`;

/**
 * Static verdict (code, docs, ToS) combined with the latest live observation from the P3 probe:
 * an observed block wins over any inference; an observed "served" page upgrades ok/unknown to an observed ok;
 * otherwise the static verdict stays and the observation is attached, flagged as a conflict when they disagree.
 */
export function countryVerdict(e: InterfaceEntry, cc: string): CountryVerdict {
  const base = staticCountryVerdict(e, cc);
  const obs = observationsFor(e, cc);
  if (obs.length === 0) return base;

  const blocking = obs.find((o) => observedRestriction(o) !== null);
  if (blocking) {
    const observed = observedRestriction(blocking) as CountryVerdict['status'];
    // The static classification is finer than an HTTP probe (close-only vs blocked, feature-limited vs blocked):
    // when both agree that something is restricted, keep the static status and let the observation confirm it.
    const restrictedStatically = base.status === 'blocked' || base.status === 'close_only' || base.status === 'feature_limited';
    const status = restrictedStatically ? base.status : observed;
    const detail = restrictedStatically ? `${base.detail} Confirmed live: ${describe(blocking)}` : describe(blocking);
    return { status, basis: 'observed', detail, regions: [], observation: blocking, conflict: base.status === 'ok' };
  }
  const served = obs.find((o) => o.kind === 'site' && o.ui_state === 'ok');
  if (served) {
    if (base.status === 'ok' || base.status === 'unknown') {
      return {
        status: 'ok',
        basis: 'observed',
        detail: 'No edge-level block observed; client-side gates not evaluated',
        regions: [],
        observation: served
      };
    }
    return { ...base, observation: served, conflict: base.status === 'blocked' || base.status === 'close_only' };
  }
  return { ...base, observation: obs[0] };
}

/** Country statuses that mean the country is named in a restriction (enforced or only in the ToS). */
export const RESTRICTED_STATUSES: CountryVerdict['status'][] = ['blocked', 'close_only', 'feature_limited', 'regional', 'tos_only'];

export const countryStatusRank = (status: CountryVerdict['status']): number =>
  ['blocked', 'close_only', 'feature_limited', 'regional', 'tos_only', 'unknown', 'ok'].indexOf(status);

export const basisRank = (basis: CountryVerdict['basis']): number => BASES.indexOf(basis);

// ---------------------------------------------------------------------------- mechanisms

/** True when the mechanism is technically present (confirmed, reported or optional code), not merely reserved in the ToS. */
export function hasMechanism(e: InterfaceEntry, kind: MechanismKind): boolean {
  switch (kind) {
    case 'geo_site':
      return enforced(e.geo_site.s) || e.geo_site.s === 'optional';
    case 'geo_feature':
      return enforced(e.geo_feature.s) || e.geo_feature.s === 'optional';
    case 'screening':
      return enforced(e.screening.s) || e.screening.s === 'optional';
    case 'vpn':
      return e.vpn.s === 'detect' || e.vpn.s === 'block' || e.vpn.s === 'optional';
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
export function evidenceLinks(e: InterfaceEntry): EvidenceLink[] {
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
