import React, { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { UnfoldMore } from '@mui/icons-material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LaunchIcon from '@mui/icons-material/Launch';
import SearchIcon from '@mui/icons-material/Search';

import { dataset, interfaces, networkOptions } from 'data/dataset';
import { countryName, countryOptions, flagEmoji, isCountryCode } from 'data/countries';
import { useI18n } from 'i18n';
import { monitorMeta } from 'seo/meta';
import { siteUrl, usePageMeta } from 'seo/usePageMeta';
import {
  CATEGORY_GROUPS,
  COUNTRY_STATUS,
  CategoryGroup,
  CountryStatus,
  CountryVerdict,
  InterfaceEntry,
  LAYERS,
  LEVELS,
  Layer,
  Level,
  MechanismKind
} from 'types/restrictions';
import {
  RESTRICTED_STATUSES,
  basisRank,
  compareByLevelThenName,
  displayName,
  lifecycleRank,
  restrictionsText,
  countryStatusRank,
  countryVerdict,
  hasMechanism,
  levelRank,
  searchText
} from 'utils/restrictions';
import InterfaceCard from './components/InterfaceCard';
import FilterSelect from './components/FilterSelect';
import LevelChip from './components/LevelChip';
import RepoLink from './components/RepoLink';
import PermissionlessLink from './components/PermissionlessLink';
import CountryVerdictCell from './components/CountryVerdictCell';
import StatTiles from './components/StatTiles';
import StatusChip from './components/StatusChip';
import TableLegend from './components/TableLegend';
import ToneChip, { countryStatusTone, vpnTone } from './components/ToneChip';

type SortableField =
  | 'permissionless'
  | 'country'
  | 'level'
  | 'name'
  | 'category'
  | 'screening'
  | 'repo'
  | 'geo'
  | 'feature'
  | 'vpn'
  | 'official';

/** The Category column is hidden for now; flip to show it again. */
const SHOW_CATEGORY_COLUMN = false;

/**
 * Hidden: "Screening layer" filtered by WHERE the wallet screening runs (frontend JS, the operator's own API,
 * or the protocol API that every client depends on). The same information is in the caption of the Wallet screening column.
 */
const SHOW_SCREENING_LAYER_FILTER = false;

// Mechanism checkboxes and the open-source switch are hidden for now; flip this flag to restore them.
const SHOW_MECHANISM_FILTERS = false;

interface CountryHit {
  cc: string;
  verdict: CountryVerdict;
}

const hasPermissionless = (i: InterfaceEntry): boolean => i.alternatives.length > 0;
const geoCount = (i: InterfaceEntry): number => i.geo_site.countries.length + i.geo_site.close_only.length;
const officialHost = (i: InterfaceEntry): string => i.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
type SortOrder = 'asc' | 'desc';

const MECHANISMS: MechanismKind[] = ['geo_site', 'geo_feature', 'screening', 'vpn', 'kyc'];
const REPO_ORDER = ['open', 'open_stale', 'archived', 'private_now', 'closed', 'none_found'];
// Strictest first.
const STATUS_ORDER = ['yes', 'reported', 'optional', 'tos_only', 'unknown', 'no'];
const VPN_ORDER = ['block', 'detect', 'optional', 'tos_only', 'unknown', 'no'];

function compare(a: InterfaceEntry, b: InterfaceEntry, field: SortableField): number {
  switch (field) {
    case 'country': // needs the selected country, handled in the component
    case 'permissionless':
      // Default order: current interfaces (ours first), then legacy versions at the bottom.
      return (
        lifecycleRank(a) - lifecycleRank(b) || Number(hasPermissionless(b)) - Number(hasPermissionless(a)) || compareByLevelThenName(a, b)
      );
    case 'level':
      return compareByLevelThenName(a, b);
    case 'name':
      return displayName(a).localeCompare(displayName(b));
    case 'category':
      return a.category_group.localeCompare(b.category_group) || a.name.localeCompare(b.name);
    case 'geo':
      return (
        STATUS_ORDER.indexOf(a.geo_site.s) - STATUS_ORDER.indexOf(b.geo_site.s) || geoCount(b) - geoCount(a) || compareByLevelThenName(a, b)
      );
    case 'feature':
      return (
        STATUS_ORDER.indexOf(a.geo_feature.s) - STATUS_ORDER.indexOf(b.geo_feature.s) ||
        b.geo_feature.countries.length - a.geo_feature.countries.length ||
        compareByLevelThenName(a, b)
      );
    case 'vpn':
      return VPN_ORDER.indexOf(a.vpn.s) - VPN_ORDER.indexOf(b.vpn.s) || compareByLevelThenName(a, b);
    case 'official':
      return officialHost(a).localeCompare(officialHost(b));
    case 'screening':
      return (
        STATUS_ORDER.indexOf(a.screening.s) - STATUS_ORDER.indexOf(b.screening.s) ||
        LAYERS.indexOf(b.screening.layer ?? 'edge') - LAYERS.indexOf(a.screening.layer ?? 'edge') ||
        levelRank(a.level) - levelRank(b.level)
      );
    case 'repo':
      return REPO_ORDER.indexOf(a.repo_state) - REPO_ORDER.indexOf(b.repo_state) || a.name.localeCompare(b.name);
    default:
      return 0;
  }
}

export default function MonitorPage() {
  const navigate = useNavigate();
  const { lang, t, L, path } = useI18n();
  const theme = useTheme();
  const narrow = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });
  const loc = t.intlLocale;
  usePageMeta(useMemo(() => monitorMeta(dataset.meta, interfaces, siteUrl(), lang), [lang]));
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  // Default: interfaces with a cp0x permissionless app first, then by level (D → A) and name.
  const [sortField, setSortField] = useState<SortableField>('permissionless');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [nameFilter, setNameFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState<CategoryGroup[]>([]);
  const [networkFilter, setNetworkFilter] = useState<string[]>([]);
  const [levelFilter, setLevelFilter] = useState<Level[]>([]);
  const [layerFilter, setLayerFilter] = useState<Layer[]>([]);
  const [mechanismFilter, setMechanismFilter] = useState<MechanismKind[]>([]);
  const [openOnly, setOpenOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState<CountryStatus[]>([]);

  // Selected countries live in the URL (?country=UA,US) so the view can be shared and /country/UA links keep working.
  const [searchParams, setSearchParams] = useSearchParams();
  const countries = useMemo(
    () =>
      Array.from(
        new Set(
          (searchParams.get('country') ?? '')
            .split(',')
            .map((c) => c.trim().toUpperCase())
            .filter(isCountryCode)
        )
      ),
    [searchParams]
  );

  const setCountries = (codes: string[]) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (codes.length > 0) next.set('country', codes.join(','));
        else next.delete('country');
        return next;
      },
      { replace: true }
    );
    setStatusFilter([]);
    if (codes.length === 0 && sortField === 'country') setSortField('permissionless');
    setPage(1);
  };

  const toggleStatus = (st: CountryStatus) => {
    setStatusFilter((prev) => (prev.includes(st) ? prev.filter((x) => x !== st) : [...prev, st]));
    setPage(1);
  };

  const resetPage = () => setPage(1);

  const toggleLevel = (level: Level) => {
    setLevelFilter((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]));
    resetPage();
  };

  const toggleMechanism = (kind: MechanismKind) => {
    setMechanismFilter((prev) => (prev.includes(kind) ? prev.filter((k) => k !== kind) : [...prev, kind]));
    resetPage();
  };

  const handleRequestSort = (field: SortableField) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
    resetPage();
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value));
    resetPage();
  };

  // For every interface: the selected countries it restricts (statuses from RESTRICTED_STATUSES, narrowed by the status chips).
  const hits = useMemo<Map<string, CountryHit[]> | null>(() => {
    if (countries.length === 0) return null;
    const wanted = statusFilter.length > 0 ? statusFilter : RESTRICTED_STATUSES;
    return new Map(
      interfaces.map((i) => [
        i.id,
        countries.map((cc) => ({ cc, verdict: countryVerdict(i, cc) })).filter((h) => wanted.includes(h.verdict.status))
      ])
    );
  }, [countries, statusFilter]);

  const baseRows = useMemo(() => {
    const needle = nameFilter.trim().toLowerCase();
    return interfaces.filter((i) => {
      if (needle && !searchText(i).includes(needle)) return false;
      if (groupFilter.length > 0 && !groupFilter.includes(i.category_group)) return false;
      if (networkFilter.length > 0 && !i.networks.some((n) => networkFilter.includes(n))) return false;
      if (levelFilter.length > 0 && !levelFilter.includes(i.level)) return false;
      if (layerFilter.length > 0 && (!i.screening.layer || !layerFilter.includes(i.screening.layer))) return false;
      if (mechanismFilter.length > 0 && !mechanismFilter.every((k) => hasMechanism(i, k))) return false;
      if (openOnly && !i.frontend_repo) return false;
      return true;
    });
  }, [nameFilter, groupFilter, networkFilter, levelFilter, layerFilter, mechanismFilter, openOnly]);

  // Chip counters: interfaces (after the other filters) restricting at least one selected country with that status.
  const statusCounts = useMemo(() => {
    const c = Object.fromEntries(COUNTRY_STATUS.map((st) => [st, 0])) as Record<CountryStatus, number>;
    if (countries.length > 0) {
      baseRows.forEach((i) => {
        const statuses = new Set(countries.map((cc) => countryVerdict(i, cc).status));
        statuses.forEach((st) => (c[st] += 1));
      });
    }
    return c;
  }, [baseRows, countries]);

  const filtered = useMemo(() => {
    // With countries selected, only interfaces that restrict at least one of them stay.
    const rows = hits ? baseRows.filter((i) => (hits.get(i.id) ?? []).length > 0) : baseRows;
    const worst = (id: string): CountryVerdict | undefined =>
      (hits?.get(id) ?? [])
        .map((h) => h.verdict)
        .sort((x, y) => countryStatusRank(x.status) - countryStatusRank(y.status) || basisRank(x.basis) - basisRank(y.basis))[0];
    const byCountry = (a: InterfaceEntry, b: InterfaceEntry): number => {
      const va = worst(a.id);
      const vb = worst(b.id);
      if (!va || !vb) return compare(a, b, 'permissionless');
      return (
        countryStatusRank(va.status) - countryStatusRank(vb.status) ||
        basisRank(va.basis) - basisRank(vb.basis) ||
        compareByLevelThenName(a, b)
      );
    };
    const sorted = [...rows].sort((a, b) => (sortField === 'country' ? byCountry(a, b) : compare(a, b, sortField)));
    return sortOrder === 'asc' ? sorted : sorted.reverse();
  }, [baseRows, hits, sortField, sortOrder]);

  // Shared captions keep table rows and cards consistent.
  const geoCaption = (i: InterfaceEntry): string | undefined => {
    const geoCount = i.geo_site.countries.length;
    const closeOnly = i.geo_site.close_only.length;
    return geoCount || closeOnly
      ? [geoCount && t.monitor.countries(geoCount), closeOnly && t.monitor.closeOnly(closeOnly)].filter(Boolean).join(', ')
      : undefined;
  };
  const featureCaption = (i: InterfaceEntry): string | undefined =>
    i.geo_feature.countries.length ? t.monitor.countries(i.geo_feature.countries.length) : undefined;

  const countryLabel =
    countries.length === 1
      ? `${flagEmoji(countries[0])} ${countryName(countries[0], loc)}`
      : t.monitor.multiCountry(countries.map(flagEmoji).join(' '));
  // Cards have no column headers, so their sort list repeats the sortable headers in the same order.
  const sortOptions: [SortableField, string][] = [
    ['name', t.monitor.cols.iface],
    ...(SHOW_CATEGORY_COLUMN ? ([['category', t.monitor.cols.category]] as [SortableField, string][]) : []),
    ['level', t.monitor.cols.level],
    ...(countries.length > 0 ? ([['country', countryLabel]] as [SortableField, string][]) : []),
    ['geo', t.monitor.cols.geo],
    ['feature', t.monitor.cols.feature],
    ['screening', t.monitor.cols.screening],
    ['vpn', t.monitor.cols.vpn],
    ['repo', t.monitor.cols.code],
    ['official', t.monitor.cols.official],
    ['permissionless', t.monitor.cols.permissionless]
  ];

  const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Every column sorts; definitions open on hover and when the sort button receives keyboard focus.
  const dottedSx = { borderBottom: '1px dotted', borderColor: 'text.secondary', cursor: 'help' };

  const header = (field: SortableField, label: string, tip?: string) => {
    const sortLabel = (
      <TableSortLabel
        active={sortField === field}
        direction={sortField === field ? sortOrder : 'asc'}
        onClick={() => handleRequestSort(field)}
        IconComponent={sortField === field ? undefined : UnfoldMore}
      >
        {tip ? (
          <Box component="span" sx={dottedSx}>
            {label}
          </Box>
        ) : (
          label
        )}
      </TableSortLabel>
    );
    return tip ? (
      <Tooltip title={tip} arrow placement="top">
        {sortLabel}
      </Tooltip>
    ) : (
      sortLabel
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {t.monitor.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 900 }}>
        {t.monitor.intro(interfaces.length, dataset.meta.catalog_total, dataset.meta.generated)}
      </Typography>

      <StatTiles activeLevels={levelFilter} onLevelClick={toggleLevel} />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Search stays separate from the filters, narrowing by name or domain as you type. */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            size="small"
            label={t.monitor.search}
            placeholder={t.monitor.searchPlaceholder}
            value={nameFilter}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }
            }}
            onChange={(e) => {
              setNameFilter(e.target.value);
              resetPage();
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FilterSelect
            label={t.monitor.category}
            options={CATEGORY_GROUPS}
            value={groupFilter}
            getLabel={(g) => L.CATEGORY_GROUP_LABELS[g]}
            onChange={(v) => {
              setGroupFilter(v);
              resetPage();
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FilterSelect
            label={t.monitor.level}
            options={LEVELS}
            value={levelFilter}
            getLabel={(l) => L.LEVEL_LABELS[l]}
            onChange={(v) => {
              setLevelFilter(v);
              resetPage();
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FilterSelect
            label={t.monitor.country}
            options={countryOptions(loc)}
            value={countries}
            getLabel={(c) => `${flagEmoji(c)} ${countryName(c, loc)}`}
            onChange={setCountries}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FilterSelect
            label={t.monitor.network}
            options={networkOptions}
            value={networkFilter}
            onChange={(v) => {
              setNetworkFilter(v);
              resetPage();
            }}
          />
        </Grid>
        {SHOW_SCREENING_LAYER_FILTER && (
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FilterSelect
              label={t.monitor.screeningLayer}
              options={LAYERS}
              value={layerFilter}
              getLabel={(l) => L.LAYER_LABELS[l]}
              onChange={(v) => {
                setLayerFilter(v);
                resetPage();
              }}
            />
          </Grid>
        )}
        {countries.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }} alignItems="center">
              <Typography variant="body2" color="text.secondary" sx={{ pr: 0.5 }}>
                {t.monitor.restrictedIn(countries.map(flagEmoji).join(' '))}
              </Typography>
              {RESTRICTED_STATUSES.map((st) => (
                <ToneChip
                  key={st}
                  tone={countryStatusTone(st)}
                  label={`${L.COUNTRY_STATUS_LABELS[st]}: ${statusCounts[st]}`}
                  tooltip={L.COUNTRY_STATUS_DESCRIPTIONS[st]}
                  onClick={() => toggleStatus(st)}
                  sx={{ ...(statusFilter.includes(st) && { outline: '2px solid', outlineColor: 'secondary.main' }) }}
                />
              ))}
            </Stack>
          </Grid>
        )}
        {SHOW_MECHANISM_FILTERS && (
          <Grid size={{ xs: 12 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={{ xs: 0, md: 3 }}
              alignItems={{ md: 'center' }}
              sx={{ flexWrap: 'wrap' }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ pr: 1 }}>
                {t.monitor.hasMechanism}
              </Typography>
              <FormGroup row>
                {MECHANISMS.map((kind) => (
                  <FormControlLabel
                    key={kind}
                    control={<Checkbox size="small" checked={mechanismFilter.includes(kind)} onChange={() => toggleMechanism(kind)} />}
                    label={<Typography variant="body2">{L.MECHANISM_LABELS[kind]}</Typography>}
                  />
                ))}
              </FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={openOnly}
                    onChange={(e) => {
                      setOpenOnly(e.target.checked);
                      resetPage();
                    }}
                  />
                }
                label={<Typography variant="body2">{t.monitor.openOnly}</Typography>}
              />
            </Stack>
          </Grid>
        )}
      </Grid>

      <TableLegend />

      {/* On narrow screens each interface gets a card: a 1000 px table would hide most columns behind horizontal scrolling. */}
      {narrow ? (
        <Stack spacing={1.5} sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              select
              size="small"
              label={t.monitor.sortBy}
              value={sortField}
              onChange={(e) => handleRequestSort(e.target.value as SortableField)}
              sx={{ flex: 1 }}
            >
              {sortOptions.map(([field, label]) => (
                <MenuItem key={field} value={field}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
            <IconButton aria-label={t.monitor.reverseOrder} onClick={() => handleRequestSort(sortField)}>
              {sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            </IconButton>
          </Stack>
          {paginated.map((i) => (
            <InterfaceCard
              key={i.id}
              entry={i}
              to={path(`/monitor/${i.id}`)}
              onOpen={() => navigate(path(`/monitor/${i.id}`))}
              officialHost={officialHost(i)}
              geoCaption={geoCaption(i)}
              featureCaption={featureCaption(i)}
              verdicts={hits?.get(i.id)?.map((h) => ({ verdict: h.verdict, prefix: countries.length > 1 ? flagEmoji(h.cc) : undefined }))}
            />
          ))}
          {paginated.length === 0 && (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
              {t.monitor.empty}
            </Typography>
          )}
        </Stack>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table
            size="small"
            aria-label={t.monitor.tableLabel}
            sx={{
              minWidth: 1000,
              // tighter cells so that all columns fit the container even with the country column
              '& .MuiTableCell-root': { px: 1 },
              '& .MuiTableCell-root:first-of-type': { pl: 2 }
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>{header('name', t.monitor.cols.iface)}</TableCell>
                {SHOW_CATEGORY_COLUMN && <TableCell>{header('category', t.monitor.cols.category)}</TableCell>}
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{header('level', t.monitor.cols.level, t.legend.level)}</TableCell>
                {countries.length > 0 && <TableCell>{header('country', countryLabel)}</TableCell>}
                <TableCell>{header('geo', t.monitor.cols.geo, t.legend.geo)}</TableCell>
                <TableCell>{header('feature', t.monitor.cols.feature, t.legend.feature)}</TableCell>
                <TableCell>{header('screening', t.monitor.cols.screening, t.legend.screening)}</TableCell>
                <TableCell>{header('vpn', t.monitor.cols.vpn, t.legend.vpn)}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{header('repo', t.monitor.cols.code, t.legend.code)}</TableCell>
                <TableCell>{header('official', t.monitor.cols.official, t.legend.official)}</TableCell>
                <TableCell>{header('permissionless', t.monitor.cols.permissionless, t.legend.permissionless)}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((i) => {
                return (
                  <TableRow key={i.id} hover onClick={() => navigate(path(`/monitor/${i.id}`))} sx={{ cursor: 'pointer' }}>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={path(`/monitor/${i.id}`)}
                        onClick={(e) => e.stopPropagation()}
                        underline="hover"
                        color="inherit"
                        variant="subtitle1"
                        sx={{ fontWeight: 600 }}
                      >
                        {displayName(i)}
                      </Link>
                      {i.aka && (
                        <Typography component="span" variant="body2" color="text.secondary">
                          {` ${i.aka}`}
                        </Typography>
                      )}
                      {i.lifecycle === 'legacy' && (
                        <ToneChip
                          tone="neutral"
                          label={t.chips.legacy}
                          tooltip={i.lifecycle_note ?? t.legend.legacy}
                          sx={{ ml: 0.75, verticalAlign: 'middle' }}
                        />
                      )}
                      <Tooltip title={i.networks.join(', ')} arrow placement="top" disableHoverListener={i.networks.length <= 3}>
                        <Typography variant="caption" color="text.secondary" component="div">
                          {i.networks.slice(0, 3).join(', ')}
                          {i.networks.length > 3 ? ` +${i.networks.length - 3}` : ''}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    {SHOW_CATEGORY_COLUMN && (
                      <TableCell>
                        <Typography variant="body2">{i.category}</Typography>
                      </TableCell>
                    )}
                    <TableCell>
                      <Tooltip
                        arrow
                        placement="top"
                        title={restrictionsText(
                          i,
                          t.monitor.restrictionsTip,
                          L.MECHANISM_LABELS,
                          t.seo.listSep,
                          L.LEVEL_DESCRIPTIONS['n/a']
                        )}
                      >
                        <Stack spacing={0.25} alignItems="flex-start" data-restrictions={i.restrictions.count}>
                          <LevelChip level={i.level} withTooltip={false} />
                          <Typography variant="caption" color="text.secondary" sx={{ pl: 1.25 }}>
                            {i.restrictions.count}
                          </Typography>
                        </Stack>
                      </Tooltip>
                    </TableCell>
                    {hits && (
                      <TableCell data-col="country">
                        <Stack spacing={0.75}>
                          {(hits.get(i.id) ?? []).map((h) => (
                            <CountryVerdictCell
                              key={h.cc}
                              verdict={h.verdict}
                              compact
                              prefix={countries.length > 1 ? flagEmoji(h.cc) : undefined}
                            />
                          ))}
                        </Stack>
                      </TableCell>
                    )}
                    <TableCell>
                      <StatusChip status={i.geo_site.s} caption={geoCaption(i)} tooltip={i.geo_site.method || undefined} />
                    </TableCell>
                    <TableCell>
                      <StatusChip status={i.geo_feature.s} caption={featureCaption(i)} tooltip={i.geo_feature.scope || undefined} />
                    </TableCell>
                    <TableCell>
                      <StatusChip
                        status={i.screening.s}
                        caption={i.screening.layer ? L.LAYER_LABELS[i.screening.layer] : undefined}
                        tooltip={i.screening.provider || undefined}
                      />
                    </TableCell>
                    <TableCell>
                      <ToneChip tone={vpnTone(i.vpn.s)} label={L.VPN_LABELS[i.vpn.s]} tooltip={i.vpn.note || undefined} />
                    </TableCell>
                    <TableCell>
                      <RepoLink entry={i} compact />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={i.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        variant="body2"
                        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, whiteSpace: 'nowrap' }}
                      >
                        {officialHost(i)}
                        <LaunchIcon sx={{ fontSize: 14 }} />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <PermissionlessLink entry={i} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9 + (SHOW_CATEGORY_COLUMN ? 1 : 0) + (countries.length > 0 ? 1 : 0)}>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                      {t.monitor.empty}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {t.monitor.showing(paginated.length, filtered.length)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel id="rows-per-page-label">{t.monitor.rows}</InputLabel>
            <Select labelId="rows-per-page-label" value={rowsPerPage} label={t.monitor.rows} onChange={handleChangeRowsPerPage}>
              {[10, 25, 50, 100].map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={(_: React.ChangeEvent<unknown>, p: number) => setPage(p)}
            color="primary"
          />
        </Box>
      </Box>
    </Box>
  );
}
