import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useI18n } from 'i18n';
import { localizePath } from 'i18n/paths';

import { interfaces } from 'data/dataset';
import { countryName, defaultCountryFromNavigator, flagEmoji, isCountryCode } from 'data/countries';
import { COUNTRY_STATUS, CountryStatus, CountryVerdict, InterfaceEntry } from 'types/restrictions';
import { basisRank, countryStatusRank, countryVerdict, displayName, levelRank } from 'utils/restrictions';
import CountryPicker from './components/CountryPicker';
import PermissionlessLink from './components/PermissionlessLink';
import CountryVerdictCell from './components/CountryVerdictCell';
import LevelChip from './components/LevelChip';
import StatusChip from './components/StatusChip';
import ToneChip, { countryStatusTone, vpnTone } from './components/ToneChip';
import { COUNTRY_STATUS_DESCRIPTIONS, COUNTRY_STATUS_LABELS, LAYER_LABELS, VPN_LABELS } from './constants';

interface Row {
  entry: InterfaceEntry;
  verdict: CountryVerdict;
}

export default function CountryPage() {
  const { lang, path } = useI18n();
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const selected = isCountryCode(code) ? code : null;
  const invalid = !!code && !selected;
  const [statusFilter, setStatusFilter] = useState<CountryStatus[]>([]);

  // Without a code in the URL, offer the browser locale's region (no network lookups).
  useEffect(() => {
    if (!code) {
      const guess = defaultCountryFromNavigator();
      if (guess) navigate(localizePath(`/country/${guess}`, lang), { replace: true });
    }
  }, [code, navigate, lang]);

  const rows = useMemo<Row[]>(() => {
    if (!selected) return [];
    return interfaces
      .map((entry) => ({ entry, verdict: countryVerdict(entry, selected) }))
      .sort(
        (a, b) =>
          countryStatusRank(a.verdict.status) - countryStatusRank(b.verdict.status) ||
          basisRank(a.verdict.basis) - basisRank(b.verdict.basis) ||
          levelRank(a.entry.level) - levelRank(b.entry.level) ||
          displayName(a.entry).localeCompare(displayName(b.entry))
      );
  }, [selected]);

  const counts = useMemo(() => {
    const c = {} as Record<CountryStatus, number>;
    COUNTRY_STATUS.forEach((s) => (c[s] = 0));
    rows.forEach((r) => (c[r.verdict.status] += 1));
    return c;
  }, [rows]);

  const visible = statusFilter.length ? rows.filter((r) => statusFilter.includes(r.verdict.status)) : rows;

  const toggleStatus = (s: CountryStatus) => setStatusFilter((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        What works from my country
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 900 }}>
        Pick a country to see which official interfaces block it, limit it to closing positions, hide features, or only mention it in the
        Terms of Service. Wallet screening and VPN detection apply regardless of country and are shown separately. Your choice is not sent
        anywhere: the page is static.
      </Typography>

      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <CountryPicker value={selected} onChange={(c) => navigate(path(c ? `/country/${c}` : '/country'))} autoFocus={!selected} />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            {selected && (
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                {COUNTRY_STATUS.map((s) => (
                  <ToneChip
                    key={s}
                    tone={countryStatusTone(s)}
                    label={`${COUNTRY_STATUS_LABELS[s]}: ${counts[s]}`}
                    tooltip={COUNTRY_STATUS_DESCRIPTIONS[s]}
                    onClick={() => toggleStatus(s)}
                    sx={{ ...(statusFilter.includes(s) && { outline: '2px solid', outlineColor: 'secondary.main' }) }}
                  />
                ))}
              </Stack>
            )}
          </Grid>
        </Grid>
      </Paper>

      {invalid && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          “{code}” is not an ISO 3166-1 alpha-2 country code. Pick a country above.
        </Alert>
      )}

      {!selected && !invalid && (
        <Typography variant="body2" color="text.secondary">
          No country selected yet.
        </Typography>
      )}

      {selected && (
        <>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {flagEmoji(selected)} {countryName(selected)}
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small" sx={{ minWidth: 900 }} aria-label="interfaces by country">
              <TableHead>
                <TableRow>
                  <TableCell>Interface</TableCell>
                  <TableCell>Status for {countryName(selected)}</TableCell>
                  <TableCell>Level</TableCell>
                  <TableCell>Wallet screening</TableCell>
                  <TableCell>VPN</TableCell>
                  <TableCell>Permissionless app</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map(({ entry, verdict }) => (
                  <TableRow key={entry.id} hover onClick={() => navigate(path(`/monitor/${entry.id}`))} sx={{ cursor: 'pointer' }}>
                    <TableCell>
                      <Typography variant="subtitle1" component="span" sx={{ fontWeight: 600 }}>
                        {displayName(entry)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" component="div">
                        {entry.category}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <CountryVerdictCell verdict={verdict} />
                    </TableCell>
                    <TableCell>
                      <LevelChip level={entry.level} />
                    </TableCell>
                    <TableCell>
                      <StatusChip
                        status={entry.screening.s}
                        caption={entry.screening.layer ? LAYER_LABELS[entry.screening.layer] : undefined}
                        tooltip={entry.screening.provider || undefined}
                      />
                    </TableCell>
                    <TableCell>
                      <ToneChip tone={vpnTone(entry.vpn.s)} label={VPN_LABELS[entry.vpn.s]} tooltip={entry.vpn.note || undefined} />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <PermissionlessLink entry={entry} />
                    </TableCell>
                  </TableRow>
                ))}
                {visible.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                        Nothing matches the selected statuses.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Paper sx={{ p: 2.5 }}>
            <Typography variant="h5" gutterBottom>
              Legend
            </Typography>
            <Stack spacing={1}>
              {COUNTRY_STATUS.map((s) => (
                <Stack key={s} direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ minWidth: 170 }}>
                    <ToneChip tone={countryStatusTone(s)} label={COUNTRY_STATUS_LABELS[s]} />
                  </Box>
                  <Typography variant="body2">{COUNTRY_STATUS_DESCRIPTIONS[s]}</Typography>
                </Stack>
              ))}
            </Stack>
            <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 2 }}>
              The suffix after the dot is the basis of the verdict: observed (live probe from this country through a verified proxy),
              confirmed (code, live check or docs), reported (press or users), ToS (Terms of Service only) or inferred (nothing found;
              closed code may hide more). Rules are described on the{' '}
              <Link component={RouterLink} to={path('/methodology')} underline="always">
                methodology
              </Link>{' '}
              page.
            </Typography>
          </Paper>
        </>
      )}
    </Box>
  );
}
