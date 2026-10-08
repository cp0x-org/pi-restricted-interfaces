import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
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
import { UnfoldMore } from '@mui/icons-material';

import { dataset, interfaces } from 'data/dataset';
import {
  CATEGORY_GROUPS,
  CHAIN_TAGS,
  CategoryGroup,
  ChainTag,
  FORK_READY,
  ForkReady,
  InterfaceEntry,
  LAYERS,
  LEVELS,
  Layer,
  Level,
  MechanismKind
} from 'types/restrictions';
import { compareByLevelThenName, hasMechanism, levelRank } from 'utils/restrictions';
import FilterSelect from './components/FilterSelect';
import ForkChip from './components/ForkChip';
import LevelChip from './components/LevelChip';
import RepoLink from './components/RepoLink';
import StatTiles from './components/StatTiles';
import StatusChip from './components/StatusChip';
import ToneChip, { vpnTone } from './components/ToneChip';
import {
  CATEGORY_GROUP_LABELS,
  CHAIN_TAG_LABELS,
  FORK_LABELS,
  LAYER_LABELS,
  LEVEL_LABELS,
  MECHANISM_LABELS,
  TOS_US_LABELS,
  VPN_LABELS
} from './constants';

type SortableField = 'level' | 'name' | 'category' | 'screening' | 'repo';
type SortOrder = 'asc' | 'desc';

const MECHANISMS: MechanismKind[] = ['geo_site', 'geo_feature', 'screening', 'vpn'];
const REPO_ORDER = ['open', 'open_stale', 'archived', 'private_now', 'closed', 'none_found'];
const SCREENING_ORDER = ['yes', 'reported', 'optional', 'tos_only', 'unknown', 'no'];

function compare(a: InterfaceEntry, b: InterfaceEntry, field: SortableField): number {
  switch (field) {
    case 'level':
      return compareByLevelThenName(a, b);
    case 'name':
      return a.name.localeCompare(b.name);
    case 'category':
      return a.category_group.localeCompare(b.category_group) || a.name.localeCompare(b.name);
    case 'screening':
      return (
        SCREENING_ORDER.indexOf(a.screening.s) - SCREENING_ORDER.indexOf(b.screening.s) ||
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
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortField, setSortField] = useState<SortableField>('level');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [nameFilter, setNameFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState<CategoryGroup[]>([]);
  const [chainFilter, setChainFilter] = useState<ChainTag[]>([]);
  const [levelFilter, setLevelFilter] = useState<Level[]>([]);
  const [layerFilter, setLayerFilter] = useState<Layer[]>([]);
  const [forkFilter, setForkFilter] = useState<ForkReady[]>([]);
  const [mechanismFilter, setMechanismFilter] = useState<MechanismKind[]>([]);
  const [openOnly, setOpenOnly] = useState(false);

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

  const filtered = useMemo(() => {
    const needle = nameFilter.trim().toLowerCase();
    const rows = interfaces.filter((i) => {
      if (needle && !i.name.toLowerCase().includes(needle) && !i.id.includes(needle) && !i.url.includes(needle)) return false;
      if (groupFilter.length > 0 && !groupFilter.includes(i.category_group)) return false;
      if (chainFilter.length > 0 && !i.chain_tags.some((t) => chainFilter.includes(t))) return false;
      if (levelFilter.length > 0 && !levelFilter.includes(i.level)) return false;
      if (layerFilter.length > 0 && (!i.screening.layer || !layerFilter.includes(i.screening.layer))) return false;
      if (forkFilter.length > 0 && !forkFilter.includes(i.fork_ready)) return false;
      if (mechanismFilter.length > 0 && !mechanismFilter.every((k) => hasMechanism(i, k))) return false;
      if (openOnly && !i.frontend_repo) return false;
      return true;
    });
    const sorted = [...rows].sort((a, b) => compare(a, b, sortField));
    return sortOrder === 'asc' ? sorted : sorted.reverse();
  }, [nameFilter, groupFilter, chainFilter, levelFilter, layerFilter, forkFilter, mechanismFilter, openOnly, sortField, sortOrder]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const header = (field: SortableField, label: string) => (
    <TableSortLabel
      active={sortField === field}
      direction={sortField === field ? sortOrder : 'asc'}
      onClick={() => handleRequestSort(field)}
      IconComponent={sortField === field ? undefined : UnfoldMore}
    >
      {label}
    </TableSortLabel>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" gutterBottom>
        Official DeFi interfaces: who restricts what
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 900 }}>
        Each row is the official web interface of a protocol. The level says how hard the restriction is and whether a permissionless fork
        removes it. Snapshot of {dataset.meta.generated}; every claim is backed by code, a live check or the Terms of Service (see the
        interface page).
      </Typography>

      <StatTiles activeLevels={levelFilter} onLevelClick={toggleLevel} />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="Search"
            placeholder="Name or domain"
            value={nameFilter}
            onChange={(e) => {
              setNameFilter(e.target.value);
              resetPage();
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FilterSelect
            label="Category"
            options={CATEGORY_GROUPS}
            value={groupFilter}
            getLabel={(g) => CATEGORY_GROUP_LABELS[g]}
            onChange={(v) => {
              setGroupFilter(v);
              resetPage();
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FilterSelect
            label="Chains"
            options={CHAIN_TAGS}
            value={chainFilter}
            getLabel={(t) => CHAIN_TAG_LABELS[t]}
            onChange={(v) => {
              setChainFilter(v);
              resetPage();
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FilterSelect
            label="Level"
            options={LEVELS}
            value={levelFilter}
            getLabel={(l) => LEVEL_LABELS[l]}
            onChange={(v) => {
              setLevelFilter(v);
              resetPage();
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FilterSelect
            label="Screening layer"
            options={LAYERS}
            value={layerFilter}
            getLabel={(l) => LAYER_LABELS[l]}
            onChange={(v) => {
              setLayerFilter(v);
              resetPage();
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FilterSelect
            label="Fork readiness"
            options={FORK_READY}
            value={forkFilter}
            getLabel={(f) => FORK_LABELS[f]}
            onChange={(v) => {
              setForkFilter(v);
              resetPage();
            }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 0, md: 3 }} alignItems={{ md: 'center' }} sx={{ flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary" sx={{ pr: 1 }}>
              Has mechanism:
            </Typography>
            <FormGroup row>
              {MECHANISMS.map((kind) => (
                <FormControlLabel
                  key={kind}
                  control={<Checkbox size="small" checked={mechanismFilter.includes(kind)} onChange={() => toggleMechanism(kind)} />}
                  label={<Typography variant="body2">{MECHANISM_LABELS[kind]}</Typography>}
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
              label={<Typography variant="body2">Open-source frontends only</Typography>}
            />
          </Stack>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small" sx={{ minWidth: 1000 }} aria-label="interface restrictions table">
          <TableHead>
            <TableRow>
              <TableCell>{header('name', 'Interface')}</TableCell>
              <TableCell>{header('category', 'Category')}</TableCell>
              <TableCell>{header('level', 'Level')}</TableCell>
              <TableCell>Site geo-block</TableCell>
              <TableCell>Feature / asset gate</TableCell>
              <TableCell>{header('screening', 'Wallet screening')}</TableCell>
              <TableCell>VPN</TableCell>
              <TableCell>ToS: US</TableCell>
              <TableCell>Fork</TableCell>
              <TableCell>{header('repo', 'Frontend code')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((i) => {
              const geoCount = i.geo_site.countries.length;
              const closeOnly = i.geo_site.close_only.length;
              const geoCaption =
                geoCount || closeOnly
                  ? [geoCount && `${geoCount} countries`, closeOnly && `${closeOnly} close-only`].filter(Boolean).join(', ')
                  : undefined;
              const featureCaption = i.geo_feature.countries.length ? `${i.geo_feature.countries.length} countries` : undefined;
              return (
                <TableRow key={i.id} hover onClick={() => navigate(`/monitor/${i.id}`)} sx={{ cursor: 'pointer' }}>
                  <TableCell>
                    <Typography variant="subtitle1" component="span" sx={{ fontWeight: 600 }}>
                      {i.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" component="div">
                      {i.url.replace(/^https?:\/\//, '')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{i.category}</Typography>
                    <Typography variant="caption" color="text.secondary" component="div">
                      {i.chains}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <LevelChip level={i.level} />
                  </TableCell>
                  <TableCell>
                    <StatusChip status={i.geo_site.s} caption={geoCaption} tooltip={i.geo_site.method || undefined} />
                  </TableCell>
                  <TableCell>
                    <StatusChip status={i.geo_feature.s} caption={featureCaption} tooltip={i.geo_feature.scope || undefined} />
                  </TableCell>
                  <TableCell>
                    <StatusChip
                      status={i.screening.s}
                      caption={i.screening.layer ? LAYER_LABELS[i.screening.layer] : undefined}
                      tooltip={i.screening.provider || undefined}
                    />
                  </TableCell>
                  <TableCell>
                    <ToneChip tone={vpnTone(i.vpn.s)} label={VPN_LABELS[i.vpn.s]} tooltip={i.vpn.note || undefined} />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={i.tos.us_scope || ''} arrow placement="top" disableHoverListener={!i.tos.us_scope}>
                      <Typography variant="body2" component="span">
                        {TOS_US_LABELS[i.tos.us]}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <ForkChip fork={i.fork_ready} />
                  </TableCell>
                  <TableCell>
                    <RepoLink entry={i} />
                  </TableCell>
                </TableRow>
              );
            })}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={10}>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                    No interfaces match the current filters.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {paginated.length} of {filtered.length} interfaces
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel id="rows-per-page-label">Rows</InputLabel>
            <Select labelId="rows-per-page-label" value={rowsPerPage} label="Rows" onChange={handleChangeRowsPerPage}>
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
