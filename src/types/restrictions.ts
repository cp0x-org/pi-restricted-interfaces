// Types for the DeFi interface restrictions dataset (monitor/data/interfaces.json, schema v2).
// The const arrays double as runtime enums for assertDataset() and as display order where noted.

export const STATUS = ['yes', 'no', 'reported', 'tos_only', 'optional', 'unknown'] as const;
export type Status = (typeof STATUS)[number];

/** Severity order: D is the most restricted, A the cleanest. Used as the default sort. */
export const LEVELS = ['D', 'C', 'B', 'A?', '?', 'A'] as const;
export type Level = (typeof LEVELS)[number];

export const LAYERS = ['edge', 'frontend', 'own-api', 'protocol-api'] as const;
export type Layer = (typeof LAYERS)[number];

export const FAIL_MODES = ['open', 'closed', 'unknown', 'n/a'] as const;
export type FailMode = (typeof FAIL_MODES)[number];

export const VPN_STATUS = ['no', 'tos_only', 'detect', 'block', 'optional', 'unknown'] as const;
export type VpnStatus = (typeof VPN_STATUS)[number];

export const REPO_STATES = ['open', 'open_stale', 'closed', 'private_now', 'archived', 'none_found'] as const;
export type RepoState = (typeof REPO_STATES)[number];

export const FORK_READY = ['yes', 'stale', 'partial', 'no_code'] as const;
export type ForkReady = (typeof FORK_READY)[number];

export const TOS_US = ['yes', 'no', 'partial', 'unknown'] as const;
export type TosUs = (typeof TOS_US)[number];

export const CONFIDENCE = ['high', 'medium', 'low'] as const;
export type Confidence = (typeof CONFIDENCE)[number];

export const CATEGORY_GROUPS = [
  'dex',
  'aggregator',
  'perps',
  'lending',
  'staking',
  'yield',
  'bridge',
  'prediction',
  'wallet',
  'other'
] as const;
export type CategoryGroup = (typeof CATEGORY_GROUPS)[number];

export const CHAIN_TAGS = ['evm', 'solana', 'bitcoin', 'sui', 'starknet', 'cosmos', 'hyperliquid', 'other'] as const;
export type ChainTag = (typeof CHAIN_TAGS)[number];

/** ISO 3166-1 alpha-2 code ('US') or a sub-national region token 'CC-Name' ('UA-Crimea'). */
export type CountryToken = string;

export interface GeoSite {
  s: Status;
  countries: CountryToken[];
  close_only: CountryToken[];
  method: string;
}

export interface GeoFeature {
  s: Status;
  countries: CountryToken[];
  scope: string;
}

export interface Vpn {
  s: VpnStatus;
  note: string;
}

export interface Screening {
  s: Status;
  provider: string;
  layer: Layer | null;
  fail: FailMode | null;
  fail_note: string;
}

export interface Tos {
  url: string | null;
  updated: string;
  us: TosUs;
  us_scope: string;
  restricted: string;
  restricted_codes: CountryToken[];
}

export interface Alternative {
  name: string;
  url: string;
}

export interface InterfaceEntry {
  id: string;
  name: string;
  category: string;
  category_group: CategoryGroup;
  chains: string;
  chain_tags: ChainTag[];
  url: string;
  frontend_repo: string | null;
  repo_state: RepoState;
  repo_status: string;
  repo_last_commit: string | null;
  geo_site: GeoSite;
  geo_feature: GeoFeature;
  vpn: Vpn;
  screening: Screening;
  asset_filter: string;
  tos: Tos;
  fork_notes: string;
  live: string[];
  evidence: string[];
  confidence: Confidence;
  alternatives: Alternative[];
  level: Level;
  fork_ready: ForkReady;
}

export interface DatasetMeta {
  schema_version: 2;
  generated: string;
  sanctioned_test_address: string;
  sanctioned_test_address_note: string;
  live_check_egress: string;
  status_values: string;
  layer_values: string;
  country_tokens: string;
  regions: Record<CountryToken, string>;
}

export interface Dataset {
  meta: DatasetMeta;
  interfaces: InterfaceEntry[];
}

/** Per-country verdict, in severity order (used for sorting and the legend). */
export const COUNTRY_STATUS = ['blocked', 'close_only', 'feature_limited', 'regional', 'tos_only', 'unknown', 'ok'] as const;
export type CountryStatus = (typeof COUNTRY_STATUS)[number];

export const BASES = ['confirmed', 'reported', 'inferred', 'tos'] as const;
export type Basis = (typeof BASES)[number];

export interface CountryVerdict {
  status: CountryStatus;
  basis: Basis;
  /** Free text from the dataset explaining the verdict (method, scope or ToS summary). */
  detail: string;
  /** Sub-national region tokens that triggered a `regional` verdict. */
  regions: CountryToken[];
}

export type MechanismKind = 'geo_site' | 'geo_feature' | 'screening' | 'vpn';

export interface EvidenceLink {
  label: string;
  href?: string;
}
