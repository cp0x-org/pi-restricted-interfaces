// English UI strings: the reference catalog. zh.ts must provide the same keys (enforced by the Messages type).
// Label maps come from views/monitor/constants.ts, which the build-time prerender also uses.
import type { Status, CountryStatus } from '../types/restrictions';
import {
  BASIS_DESCRIPTIONS,
  BASIS_LABELS,
  CATEGORY_GROUP_LABELS,
  CONFIDENCE_LABELS,
  COUNTRY_STATUS_DESCRIPTIONS,
  COUNTRY_STATUS_LABELS,
  FAIL_LABELS,
  FORK_DESCRIPTIONS,
  FORK_LABELS,
  LAYER_DESCRIPTIONS,
  LAYER_LABELS,
  LEVEL_DESCRIPTIONS,
  LEVEL_LABELS,
  MECHANISM_LABELS,
  OBS_STATE_LABELS,
  PROXY_TYPE_LABELS,
  REPO_STATE_LABELS,
  STATUS_DESCRIPTIONS,
  STATUS_LABELS,
  TOS_US_LABELS,
  VPN_LABELS
} from '../views/monitor/constants';

const labels = {
  LEVEL_LABELS,
  LEVEL_DESCRIPTIONS,
  STATUS_LABELS,
  STATUS_DESCRIPTIONS,
  LAYER_LABELS,
  LAYER_DESCRIPTIONS,
  FAIL_LABELS,
  VPN_LABELS,
  REPO_STATE_LABELS,
  FORK_LABELS,
  FORK_DESCRIPTIONS,
  TOS_US_LABELS,
  COUNTRY_STATUS_LABELS,
  COUNTRY_STATUS_DESCRIPTIONS,
  BASIS_LABELS,
  BASIS_DESCRIPTIONS,
  CATEGORY_GROUP_LABELS,
  OBS_STATE_LABELS,
  PROXY_TYPE_LABELS,
  MECHANISM_LABELS,
  CONFIDENCE_LABELS,
  /** Sub-national region names; English comes from the dataset (meta.regions). */
  REGION_LABELS: {} as Record<string, string>
};

export const en = {
  htmlLang: 'en',
  /** Locale for Intl APIs (country names, sorting). */
  intlLocale: 'en',
  labels,
  layout: {
    home: 'Home',
    permissionless: 'Permissionless Interfaces',
    referrals: 'cp0x Referrals',
    menu: 'Menu',
    connectWallet: 'Connect Wallet',
    skip: 'Skip to content',
    sections: 'Sections',
    mainNav: 'Main',
    tabs: { monitor: 'Monitor', country: 'By country', methodology: 'Methodology' },
    language: 'Language',
    homeLogo: 'cp0x DeFi Interface Restrictions Monitor, home',
    telegram: 'cp0x on Telegram',
    twitter: 'cp0x on X (Twitter)',
    github: 'cp0x on GitHub'
  },
  pageTitle: {
    monitor: 'DeFi Interface Restrictions Monitor | cp0x',
    methodology: 'Methodology: how DeFi interface restrictions are checked | cp0x',
    iface: (name: string, level: string) => `${name} geo-blocking & wallet screening (level ${level}) | cp0x`,
    notFound: 'Page not found | cp0x'
  },
  monitor: {
    title: 'Official DeFi interfaces: who restricts what',
    intro: (shown: number, total: number, date: string) =>
      `Each row is the official web interface of a protocol on EVM networks (${shown} of ${total} in the full catalog; Solana, Cosmos and other non-EVM apps stay in the data but are not shown). The level says how hard the restriction is and whether a permissionless fork removes it. Snapshot of ${date}; every claim is backed by code, a live check or the Terms of Service (see the interface page).`,
    search: 'Search',
    searchPlaceholder: 'Name or domain',
    category: 'Category',
    network: 'Network',
    level: 'Level',
    screeningLayer: 'Screening layer',
    country: 'Country',
    restrictedIn: (flags: string) => `Restricted in ${flags}:`,
    hasMechanism: 'Has mechanism:',
    openOnly: 'Open-source frontends only',
    tableLabel: 'interface restrictions table',
    cols: {
      iface: 'Interface',
      category: 'Category',
      level: 'Level',
      geo: 'Geo Block',
      feature: 'Feature Block',
      screening: 'Wallet screening',
      vpn: 'VPN',
      code: 'Code',
      official: 'Official app',
      permissionless: 'Permissionless app'
    },
    multiCountry: (flags: string) => `${flags} restrictions`,
    countries: (n: number) => `${n} ${n === 1 ? 'country' : 'countries'}`,
    closeOnly: (n: number) => `${n} close-only`,
    empty: 'No interfaces match the current filters.',
    showing: (shown: number, total: number) => `Showing ${shown} of ${total} interfaces`,
    rows: 'Rows'
  },
  tiles: {
    interfaces: 'Interfaces',
    open: 'Open frontend',
    closed: 'Closed frontend',
    permissionless: 'Permissionless via cp0x'
  },
  legend: {
    level: 'D is the hardest restriction, A is clean; hover a chip for details.',
    geo: 'The whole site or trading is blocked for some countries.',
    feature: 'The site works, but some features or assets are hidden by country.',
    screening: 'The wallet is checked against sanctions lists; the caption shows where.',
    vpn: 'Whether VPN or Tor users are detected or blocked.',
    code: 'Public frontend repository.',
    official: 'The official interface.',
    permissionless: 'Our permissionless interface from pi.cp0x.com; these rows are highlighted and listed first.',
    values: {
      yes: 'confirmed by code, a live check or docs',
      reported: 'press or user reports',
      tos_only: 'only written in the Terms of Service, not enforced in code',
      optional: 'in code, off by default',
      no: 'not found',
      unknown: 'not checked'
    } as Record<Status, string>
  },
  chips: {
    regions: 'Regions',
    basis: 'Basis',
    liveProbe: (date: string, proxy: string, state: string, http: string, url: string) =>
      `Live probe ${date} via ${proxy} proxy: ${state} (HTTP ${http}, ${url})`,
    disagrees: ' — disagrees with the static verdict',
    probed: (date: string) => `probed ${date}`,
    conflict: 'conflict',
    servedNotEdge: ' (landing page served: the block is not at the edge)',
    disagreesShort: ' (disagrees with the static verdict)',
    more: (n: number) => `+${n} more`,
    less: 'show less',
    nothing: 'Nothing recorded.',
    noEvidence: 'No evidence recorded.',
    frontendCodeOf: (name: string) => `Frontend code of ${name}`
  },
  iface: {
    notFound: 'Interface not found',
    notFoundText: (id: string) => `There is no interface with id “${id}” in the catalog.`,
    back: 'Back to the monitor',
    all: 'All interfaces',
    frontendCode: 'Frontend code',
    altPrefix: 'Permissionless alternative:',
    forkReadiness: 'Fork readiness',
    lastCommit: (date: string) => ` · last commit ${date}`,
    confidence: 'Confidence',
    checked: 'Checked',
    howEnforced: 'How it is enforced',
    blockedCountries: 'Blocked countries',
    closeOnlyCountries: 'Close-only countries',
    scope: 'Scope',
    assetFilter: 'Asset filter',
    affected: 'Affected countries',
    provider: 'Provider / endpoint',
    whereRuns: 'Where it runs',
    failMode: 'Fail mode',
    note: 'Note',
    tos: 'Terms of Service',
    usPersons: 'US persons',
    document: 'Document',
    notFoundDoc: 'Not found',
    lastUpdated: 'Last updated',
    restrictedAsWritten: 'Restricted jurisdictions (as written)',
    named: 'Named jurisdictions',
    forkNotes: 'Fork notes',
    noNotes: 'No notes.',
    repoStatus: 'Repository status',
    liveChecks: 'Live checks',
    noLive: 'No live checks recorded.',
    egress: 'Egress',
    probeEndpoints: 'Probe endpoints',
    observations: 'Live observations by country',
    notProbed:
      'Not probed yet. The P3 probe (monitor/scripts/probe.py) records, per country and proxy type, whether the landing page and the known geo endpoints are served, blocked or challenged.',
    obsCols: { country: 'Country', vantage: 'Vantage', target: 'Target', result: 'Result', http: 'HTTP', when: 'When' },
    landing: 'landing page',
    geoEndpoint: 'geo endpoint',
    evidence: 'Evidence',
    pathsNote: (date: string) => `Paths are relative to the repository root at the default branch on ${date}.`,
    tosCountries: 'Countries named in the ToS:',
    /** Shown only when technical fields stay in the source language. */
    dataNote: ''
  },
  seo: {
    siteName: 'DeFi Interface Restrictions Monitor',
    ogSiteName: 'DeFi Interface Restrictions Monitor by cp0x',
    langName: 'English',
    noscript: 'Filters and sorting need JavaScript; the full catalog is shown below.',
    monitorDescription: (n: number, withAlt: number) =>
      `Which official DeFi interfaces geo-block countries, screen wallets or hide features: ${n} EVM apps ranked A–D with evidence, per-country status and ${withAlt} permissionless alternatives.`,
    methodologyDescription:
      'How the monitor checks DeFi interfaces: restriction levels A–D, status values, where screening runs, per-country rules, live proxy probes and limitations.',
    notFoundDescription: 'This page does not exist in the DeFi Interface Restrictions Monitor.',
    ifaceDescription: (name: string, summary: string, level: string, alt: string) =>
      `${name}: ${summary}. Restriction level ${level}.${alt ? ` Permissionless alternative: ${alt}.` : ''} Evidence, countries and fork notes.`,
    ifacePageName: (name: string) => `${name}: access restrictions of the official interface`,
    datasetName: 'Access restrictions in official DeFi interfaces',
    datasetDescription:
      'Catalog of geo-blocking, feature and asset gating, wallet screening and VPN detection in the official web interfaces of DeFi protocols on EVM networks, with the enforcement layer, fork readiness and evidence for every claim.',
    summary: {
      geoBlocks: (n: number) => `geo-blocks ${n} countries`,
      geoBlocksSite: 'geo-blocks the site',
      geoReported: 'reported geo-block',
      geoTos: 'geo-block only in its ToS',
      closeOnly: (n: number) => `close-only in ${n} more`,
      feature: 'hides features or assets by country',
      screens: (layer: string) => `screens wallets${layer ? ` (${layer})` : ''}`,
      vpnBlock: 'blocks VPN users',
      vpnDetect: 'detects VPN users',
      none: 'no technical restriction found',
      sep: '; '
    },
    /** Max characters of a meta description (CJK glyphs are about twice as wide). */
    descriptionMax: 160,
    restrictionsTitle: 'Restrictions',
    levelSentence: (level: string, description: string) => `Restriction level ${level}: ${description}.`,
    checked: (date: string) => `Checked ${date}.`,
    countries: 'Countries',
    closeOnlyList: 'Close-only',
    /** Punctuation used when the prerender joins labels and values. */
    colon: ': ',
    stop: '. ',
    listSep: ', ',
    comma: ', '
  },
  method: {
    title: 'Methodology',
    intro: (date: string, shown: number, total: number) =>
      `The catalog answers one question per interface: what does the official frontend or backend block, for whom, by which mechanism, where is it enforced, and does a permissionless fork remove it. Snapshot of ${date}. The site shows EVM networks only: ${shown} of ${total} interfaces in the full catalog; Solana, Cosmos and other non-EVM apps stay in \`monitor/data\` and in the report. Only observation: nothing is bypassed, nothing is signed, no transactions are sent.`,
    levelsTitle: 'Levels',
    levelsNote:
      'The level is computed from the data: D when a site geo-block is confirmed or wallet screening runs in the protocol API; C when screening is confirmed or reported on the frontend or the operator’s own API; B for feature- or asset-level limits, reported blocks and optional code; A when nothing is found and the code is open; A? when nothing is found but the code is closed; ? when the code is closed and nothing could be assessed.',
    statusTitle: 'Status values',
    layerTitle: 'Where screening runs (layer)',
    layerNote:
      'Rule of thumb: if enforcement happens in a service that every client of the protocol must call (orderbook, indexer, router, relayer) it is the protocol API and a fork inherits it. If only the official frontend calls the service, it is the operator’s own API and a fork can drop it.',
    countryTitle: 'Status for a country',
    countryRules: {
      blocked: 'The country is in the list of a confirmed or reported site-level geo-block.',
      close_only: 'The country is in a close-only tier of a site-level geo-block (Polymarket).',
      feature_limited:
        'The country is in the list of a confirmed feature or asset gate, or the interface limits US persons to some products.',
      regional:
        'Only sub-national regions of the country are listed (Crimea, Donetsk, Luhansk, Kherson, Zaporizhzhia, New York, Ontario, …).',
      tos_only: 'The country is named in the Terms of Service, or US persons are excluded there, and no enforcement was found.',
      unknown: 'Geo-blocking was not assessed (closed code), or a block is confirmed but the country list is not published.',
      ok: 'None of the above; wallet screening and VPN detection may still apply.'
    } as Record<CountryStatus, string>,
    countryNote:
      'Rules are applied in this order and the first match wins. Each verdict carries its basis: observed (live probe from that country through a verified proxy), confirmed (code, live check or official documentation), reported (press or users), ToS (Terms of Service only) or inferred (nothing found; a closed frontend may hide more). A live observation that shows a block confirms a static blocked / close-only / feature-limited verdict and overrides anything weaker; a served landing page upgrades “n/a” or “no restriction found” to an observed verdict; any other disagreement is shown as a conflict with both sides visible. Country lists are ISO 3166-1 codes; group terms such as “all of the EU” were expanded explicitly, while “sanctioned jurisdictions” or “FATF high-risk” stay as free text and do not produce a match.',
    detectTitle: 'How mechanisms are detected',
    detectCols: { layer: 'Layer', signal: 'Signal', examples: 'Examples' },
    typology: [
      {
        layer: 'Edge / CDN',
        detect:
          'HTTP 403/451/302 by country before any JavaScript; netlify.toml conditions.Country, Next.js middleware req.geo, cf-ipcountry, x-vercel-ip-country',
        examples: 'Hop (451), Ambient (302 → /blocked.html), Euler (451 on /api), marginfi'
      },
      {
        layer: 'Client-side geo check',
        detect:
          'A JavaScript request to a geo API: api.country.is, free.freeipapi.com, */geo/country, /api/geoblock, geolocation.*.workers.dev',
        examples: 'CoW, Venus, Beefy, Polymarket, Drift, Notional, Sushi'
      },
      {
        layer: 'Operator geo service with feature flags',
        detect: 'The response carries isRegionRestricted / gatedFeatures / limited',
        examples: 'Sky (/ip/status, geo-config), Uniswap compliance v2, Lido /api/geo'
      },
      {
        layer: 'VPN detection',
        detect: 'is_vpn, vpnapi.io, IPQS; Tor exit flag',
        examples: 'Sky (detect → ToS signature), Euler (logged), Liquity (optional), Lido (Tor → limited)'
      },
      {
        layer: 'Wallet screening, external API',
        detect: 'A request carrying the address right after wallet connect',
        examples: 'TRM (Sushi, 1inch, Aave historically), Hypernative (Balancer), Elliptic (dYdX), Chainalysis Entity (Synapse)'
      },
      {
        layer: 'Wallet screening, on-chain',
        detect: 'eth_call isSanctioned() on the Chainalysis oracle 0x40C5…C8fb',
        examples: 'Notional, Safe, CoW backend'
      },
      {
        layer: 'Static list',
        detect: 'An array of addresses in the bundle',
        examples: 'Compound, Ambient, wormhole-connect, Hop (optional)'
      },
      {
        layer: 'Asset restrictions',
        detect: 'Token deny-list or RWA lists by country',
        examples: 'Uniswap, CoW, Beefy, Venus, Sushi, Curve (content blacklist)'
      }
    ],
    detectNote:
      'Open frontends were cloned and scanned for geo and screening signals (ripgrep rules, then manual reading of every hit that made it into the catalog). Closed frontends rely on documentation, the Terms of Service and public endpoints found in SDKs. Transaction security scanners (Blockaid, Web3 Antivirus) and Hypernative Guard are user protection, not compliance screening, and are not counted.',
    liveTitle: 'Live checks',
    liveP1: (note: string) =>
      `Public screening endpoints found in the code were queried with a sanctioned test address and two control addresses. The sanctioned address is ${note}.`,
    liveP2: (egress: string) =>
      `Egress of the initial snapshot: ${egress}. Those checks ran from a single vantage point and without executing JavaScript, so client-side geo-blocks and blocks for other countries were visible only through the code.`,
    liveP3:
      'Per-country probing (P3): the landing page and the known geo endpoints of every interface are fetched through a residential proxy in the target country, without JavaScript. The vantage is verified first by independent IP-geolocation services (two must agree) and, on Cloudflare-fronted hosts, by the `loc=` field of `/cdn-cgi/trace`; a disagreeing vantage is discarded. The result is one of: served, blocked (HTTP 451, a 403 with geo wording, a redirect to a block page, or a geo endpoint answering “restricted”), close-only, feature-limited, or anti-bot challenge (not testable). “Served” only means that no edge-level block was observed: client-side gates, wallet screening and feature gates need the browser and wallet probes of the next milestones. Sanctioned jurisdictions are not probed; their status stays inferred from code and configuration.',
    limitsTitle: 'Limitations and data',
    limits: [
      'Production may differ from the repository: Uniswap publishes a release mirror, Raydium and QuickSwap keep stale snapshots, and several projects (PancakeSwap, Across, Spark) made their frontends private.',
      'Static sanctions lists diverge from the current SDN list: Compound III still blocks Tornado Cash addresses although OFAC delisted them in 2025. Tests use an address that is sanctioned at test time.',
      'Terms of Service rendered on the client could not always be read; those entries carry “n/a” rather than a guess.'
    ],
    source: (path: string) =>
      `Source of truth: \`${path}\` in the project repository, regenerated with \`pnpm monitor:build\`. Every row links to the code paths, documents or API responses it is based on. Corrections are welcome as pull requests.`,
    altLink: 'Permissionless alternatives by cp0x'
  }
};

export type Messages = typeof en;
export type Labels = Messages['labels'];
