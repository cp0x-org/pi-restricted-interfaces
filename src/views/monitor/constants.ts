import {
  Basis,
  CategoryGroup,
  Confidence,
  ChainTag,
  CountryStatus,
  FailMode,
  ForkReady,
  Layer,
  Level,
  MechanismKind,
  ObservationState,
  ProxyType,
  RepoState,
  Status,
  TosUs,
  VpnStatus
} from '../../types/restrictions';

export const DATA_FILE_PATH = 'monitor/data/interfaces.json';

/** The standalone "By country" page is hidden for now (its country filter lives on the Monitor page). Flip to bring it back. */
export const SHOW_COUNTRY_PAGE = false;

export const LEVEL_LABELS: Record<Level, string> = {
  D: 'D',
  C: 'C',
  B: 'B',
  A: 'A',
  'n/a': 'n/a'
};

export const LEVEL_DESCRIPTIONS: Record<Level, string> = {
  D: 'More than 20 restrictions',
  C: '6–20 restrictions',
  B: '1–5 restrictions',
  A: 'No technical restriction found',
  'n/a': 'Nothing could be determined'
};

export const STATUS_LABELS: Record<Status, string> = {
  yes: 'yes',
  no: 'no',
  reported: 'reported',
  tos_only: 'ToS only',
  optional: 'optional',
  unknown: 'n/a'
};

export const STATUS_DESCRIPTIONS: Record<Status, string> = {
  yes: 'Confirmed by code, a live check or official documentation',
  no: 'Looked for and not found',
  reported: 'Press or user reports, not confirmed in code',
  tos_only: 'The right is reserved in the Terms of Service, no enforcement found',
  optional: 'Present in code but switched off by default',
  unknown: 'Not assessed or not assessable'
};

export const LAYER_LABELS: Record<Layer, string> = {
  edge: 'edge / CDN',
  frontend: 'frontend',
  'own-api': 'own API',
  'protocol-api': 'protocol API'
};

export const LAYER_DESCRIPTIONS: Record<Layer, string> = {
  edge: 'CDN or hosting rule (HTTP 403/451/302 by country before any JavaScript runs)',
  frontend: 'Client-side JavaScript: a fork simply removes it',
  'own-api': 'A backend that only the official frontend calls: a fork does not need it',
  'protocol-api': 'A backend every client of the protocol depends on (orderbook, indexer, router): a fork inherits it'
};

export const FAIL_LABELS: Record<FailMode, string> = {
  open: 'fail-open',
  closed: 'fail-closed',
  unknown: 'n/a',
  'n/a': 'not applicable'
};

export const VPN_LABELS: Record<VpnStatus, string> = {
  no: 'no',
  tos_only: 'ToS only',
  detect: 'detect',
  block: 'block',
  optional: 'optional',
  unknown: 'n/a'
};

export const REPO_STATE_LABELS: Record<RepoState, string> = {
  open: 'open source',
  open_stale: 'open, stale',
  closed: 'closed',
  private_now: 'private now',
  archived: 'archived',
  none_found: 'none found'
};

export const FORK_LABELS: Record<ForkReady, string> = {
  yes: 'fork-ready',
  stale: 'stale code',
  partial: 'partial',
  no_code: 'no code'
};

export const FORK_DESCRIPTIONS: Record<ForkReady, string> = {
  yes: 'Open frontend; the gates can be removed in a fork',
  stale: 'Open but outdated or archived code; production has moved on',
  partial: 'Open frontend, but screening lives in the protocol API that a fork still depends on',
  no_code: 'No public frontend code'
};

export const TOS_US_LABELS: Record<TosUs, string> = {
  yes: 'excluded',
  no: 'allowed',
  partial: 'partial',
  unknown: 'n/a'
};

export const COUNTRY_STATUS_LABELS: Record<CountryStatus, string> = {
  blocked: 'blocked',
  close_only: 'close-only',
  feature_limited: 'feature-limited',
  regional: 'regional',
  tos_only: 'ToS only',
  unknown: 'n/a',
  ok: 'no restriction found'
};

export const COUNTRY_STATUS_DESCRIPTIONS: Record<CountryStatus, string> = {
  blocked: 'The site or trading is blocked for this country',
  close_only: 'Existing positions can be closed, new ones cannot be opened',
  feature_limited: 'Some features or assets are hidden for this country',
  regional: 'Only specific regions of this country are restricted',
  tos_only: 'The country is named in the Terms of Service; no technical enforcement found',
  unknown: 'Not assessed, or the list of countries is not published',
  ok: 'No country-level restriction found (wallet screening and VPN checks may still apply)'
};

export const BASIS_LABELS: Record<Basis, string> = {
  observed: 'observed',
  confirmed: 'confirmed',
  reported: 'reported',
  inferred: 'inferred',
  tos: 'ToS'
};

export const BASIS_DESCRIPTIONS: Record<Basis, string> = {
  observed: 'Observed live from this country through a verified proxy (HTTP probe without JavaScript)',
  confirmed: 'Confirmed by code, a live check or official documentation',
  reported: 'Based on press or user reports',
  inferred: 'Inferred from the absence of findings; closed code may hide more',
  tos: 'Based on the Terms of Service only'
};

export const CATEGORY_GROUP_LABELS: Record<CategoryGroup, string> = {
  dex: 'DEX',
  aggregator: 'Aggregator',
  perps: 'Perps',
  lending: 'Lending',
  staking: 'Staking',
  yield: 'Yield',
  rwa: 'RWA',
  stablecoin: 'Stablecoin',
  bridge: 'Bridge',
  prediction: 'Prediction market',
  wallet: 'Wallet',
  other: 'Other'
};

export const CHAIN_TAG_LABELS: Record<ChainTag, string> = {
  evm: 'EVM',
  solana: 'Solana',
  bitcoin: 'Bitcoin',
  sui: 'Sui',
  starknet: 'Starknet',
  cosmos: 'Cosmos',
  hyperliquid: 'Hyperliquid',
  other: 'Other'
};

export const OBS_STATE_LABELS: Record<ObservationState, string> = {
  ok: 'served',
  blocked: 'blocked',
  close_only: 'close-only',
  feature_limited: 'feature-limited',
  challenge: 'anti-bot challenge',
  error: 'error',
  unknown: 'n/a'
};

export const PROXY_TYPE_LABELS: Record<ProxyType, string> = {
  residential: 'residential',
  isp: 'ISP (static residential)',
  mobile: 'mobile',
  datacenter: 'datacenter',
  tor: 'Tor',
  direct: 'direct'
};

export const CONFIDENCE_LABELS: Record<Confidence, string> = {
  high: 'high',
  medium: 'medium',
  low: 'low'
};

export const MECHANISM_LABELS: Record<MechanismKind, string> = {
  geo_site: 'Geo Block',
  geo_feature: 'Feature Block',
  screening: 'Wallet screening',
  vpn: 'VPN / Tor detection',
  kyc: 'KYC / allowlist'
};
