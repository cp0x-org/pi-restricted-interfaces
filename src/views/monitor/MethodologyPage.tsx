import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import SubCard from 'ui-component/cards/SubCard';
import { CopyableAddress } from 'components/CopyableAddress';

import { dataset } from 'data/dataset';
import { COUNTRY_STATUS, LAYERS, LEVELS, STATUS } from 'types/restrictions';
import LevelChip from './components/LevelChip';
import StatusChip from './components/StatusChip';
import ToneChip, { countryStatusTone } from './components/ToneChip';
import {
  COUNTRY_STATUS_DESCRIPTIONS,
  COUNTRY_STATUS_LABELS,
  DATA_FILE_PATH,
  LAYER_DESCRIPTIONS,
  LAYER_LABELS,
  LEVEL_DESCRIPTIONS,
  STATUS_DESCRIPTIONS
} from './constants';

const TYPOLOGY: { layer: string; detect: string; examples: string }[] = [
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
];

const COUNTRY_RULES: string[] = [
  'blocked — the country is in the list of a confirmed or reported site-level geo-block.',
  'close-only — the country is in a close-only tier of a site-level geo-block (Polymarket).',
  'feature-limited — the country is in the list of a confirmed feature or asset gate, or the interface limits US persons to some products.',
  'regional — only sub-national regions of the country are listed (Crimea, Donetsk, Luhansk, Kherson, Zaporizhzhia, New York, Ontario, …).',
  'ToS only — the country is named in the Terms of Service, or US persons are excluded there, and no enforcement was found.',
  'unknown — geo-blocking was not assessed (closed code), or a block is confirmed but the country list is not published.',
  'no restriction found — none of the above; wallet screening and VPN detection may still apply.'
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <SubCard title={title} sx={{ mb: 3 }}>
      {children}
    </SubCard>
  );
}

export default function MethodologyPage() {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" gutterBottom>
        Methodology
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 900 }}>
        The catalog answers one question per interface: what does the official frontend or backend block, for whom, by which mechanism,
        where is it enforced, and does a permissionless fork remove it. Snapshot of {dataset.meta.generated}. Only observation: nothing is
        bypassed, nothing is signed, no transactions are sent.
      </Typography>

      <Section title="Levels">
        <Stack spacing={1.5}>
          {LEVELS.map((level) => (
            <Stack key={level} direction="row" spacing={2} alignItems="flex-start">
              <Box sx={{ minWidth: 48, pt: 0.25 }}>
                <LevelChip level={level} withTooltip={false} />
              </Box>
              <Typography variant="body2">{LEVEL_DESCRIPTIONS[level]}</Typography>
            </Stack>
          ))}
        </Stack>
        <Typography variant="body2" sx={{ mt: 2 }}>
          The level is computed from the data: D when a site geo-block is confirmed or wallet screening runs in the protocol API; C when
          screening is confirmed or reported on the frontend or the operator’s own API; B for feature- or asset-level limits, reported
          blocks and optional code; A when nothing is found and the code is open; A? when nothing is found but the code is closed; ? when
          the code is closed and nothing could be assessed.
        </Typography>
      </Section>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Section title="Status values">
            <Stack spacing={1.5}>
              {STATUS.map((s) => (
                <Stack key={s} direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ minWidth: 96, pt: 0.25 }}>
                    <StatusChip status={s} />
                  </Box>
                  <Typography variant="body2">{STATUS_DESCRIPTIONS[s]}</Typography>
                </Stack>
              ))}
            </Stack>
          </Section>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Section title="Where screening runs (layer)">
            <Stack spacing={1.5}>
              {LAYERS.map((l) => (
                <Stack key={l} spacing={0.25}>
                  <Typography variant="subtitle2">{LAYER_LABELS[l]}</Typography>
                  <Typography variant="body2">{LAYER_DESCRIPTIONS[l]}</Typography>
                </Stack>
              ))}
            </Stack>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Rule of thumb: if enforcement happens in a service that every client of the protocol must call (orderbook, indexer, router,
              relayer) it is the protocol API and a fork inherits it. If only the official frontend calls the service, it is the operator’s
              own API and a fork can drop it.
            </Typography>
          </Section>
        </Grid>
      </Grid>

      <Section title="Status for a country">
        <Stack spacing={1}>
          {COUNTRY_STATUS.map((s, n) => (
            <Stack key={s} direction="row" spacing={1.5} alignItems="flex-start">
              <Box sx={{ minWidth: 170, pt: 0.25 }}>
                <ToneChip tone={countryStatusTone(s)} label={COUNTRY_STATUS_LABELS[s]} tooltip={COUNTRY_STATUS_DESCRIPTIONS[s]} />
              </Box>
              <Typography variant="body2">{COUNTRY_RULES[n]}</Typography>
            </Stack>
          ))}
        </Stack>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Rules are applied in this order and the first match wins. Each verdict carries its basis: confirmed (code, live check or official
          documentation), reported (press or users), ToS (Terms of Service only) or inferred (nothing found; a closed frontend may hide
          more). Country lists are ISO 3166-1 codes; group terms such as “all of the EU” were expanded explicitly, while “sanctioned
          jurisdictions” or “FATF high-risk” stay as free text and do not produce a match.
        </Typography>
      </Section>

      <Section title="How mechanisms are detected">
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Layer</TableCell>
                <TableCell>Signal</TableCell>
                <TableCell>Examples</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {TYPOLOGY.map((row) => (
                <TableRow key={row.layer}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.layer}</TableCell>
                  <TableCell>{row.detect}</TableCell>
                  <TableCell>{row.examples}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Open frontends were cloned and scanned for geo and screening signals (ripgrep rules, then manual reading of every hit that made it
          into the catalog). Closed frontends rely on documentation, the Terms of Service and public endpoints found in SDKs. Transaction
          security scanners (Blockaid, Web3 Antivirus) and Hypernative Guard are user protection, not compliance screening, and are not
          counted.
        </Typography>
      </Section>

      <Section title="Live checks">
        <Typography variant="body2" sx={{ mb: 1.5 }}>
          Public screening endpoints found in the code were queried with a sanctioned test address and two control addresses. The sanctioned
          address is {dataset.meta.sanctioned_test_address_note}.
        </Typography>
        <CopyableAddress address={dataset.meta.sanctioned_test_address} />
        <Typography variant="body2" sx={{ mt: 1.5 }}>
          Egress: {dataset.meta.live_check_egress}. Checks ran from a single vantage point and without executing JavaScript, so client-side
          geo-blocks and blocks for other countries are visible only through the code. Interfaces with closed code (levels A? and ?) need a
          browser crawl through residential proxies, which is the next milestone of the monitor.
        </Typography>
      </Section>

      <Section title="Limitations and data">
        <Stack spacing={1}>
          <Typography variant="body2">
            Production may differ from the repository: Uniswap publishes a release mirror, Raydium and QuickSwap keep stale snapshots, and
            several projects (PancakeSwap, Across, Spark) made their frontends private.
          </Typography>
          <Typography variant="body2">
            Static sanctions lists diverge from the current SDN list: Compound III still blocks Tornado Cash addresses although OFAC
            delisted them in 2025. Tests use an address that is sanctioned at test time.
          </Typography>
          <Typography variant="body2">
            Terms of Service rendered on the client could not always be read; those entries carry “unknown” rather than a guess.
          </Typography>
          <Typography variant="body2">
            Source of truth: <code>{DATA_FILE_PATH}</code> in the project repository, regenerated with <code>pnpm monitor:build</code>.
            Every row links to the code paths, documents or API responses it is based on. Corrections are welcome as pull requests.{' '}
            <Link href="https://pi.cp0x.com" target="_blank" rel="noopener noreferrer" underline="hover">
              Permissionless alternatives by cp0x
            </Link>
            .
          </Typography>
        </Stack>
      </Section>
    </Box>
  );
}
