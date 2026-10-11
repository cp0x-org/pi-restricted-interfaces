import { ReactNode, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
import { Theme, alpha, lighten, useTheme } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';

import { dataset, interfaces, interfacesById } from 'data/dataset';
import { tokenLabel } from 'data/countries';
import { summaryMeta } from 'seo/meta';
import { siteUrl, usePageMeta } from 'seo/usePageMeta';
import { useI18n } from 'i18n';
import { LEVELS, Level } from 'types/restrictions';
import { displayName } from 'utils/restrictions';
import { GroupRow, MECHANISM_STATES, MechanismState, avg, buildSummary, pct, share } from 'utils/summary';
import BarList from './components/charts/BarList';
import DonutChart from './components/charts/DonutChart';
import ShareBar from './components/charts/ShareBar';
import LevelChip from './components/LevelChip';

/** Chart colours follow the chips: D red, C orange, B amber, A green, unrated grey. */
const levelColor = (theme: Theme, level: Level): string =>
  ({
    D: lighten(theme.palette.error.main, 0.1),
    C: theme.palette.orange.main,
    B: theme.palette.warning.main,
    A: theme.palette.success.main,
    'n/a': alpha(theme.palette.text.secondary, 0.45)
  })[level];

const stateColor = (theme: Theme, s: MechanismState): string =>
  ({
    enforced: lighten(theme.palette.error.main, 0.1),
    tos_only: alpha(theme.palette.text.secondary, 0.55),
    none: theme.palette.success.main,
    unknown: alpha(theme.palette.text.secondary, 0.2)
  })[s];

function Section({ title, children, note }: { title: string; children: ReactNode; note?: ReactNode }) {
  return (
    <SubCard title={title} titleComponent="h2" sx={{ height: '100%' }}>
      {children}
      {note && (
        <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 2 }}>
          {note}
        </Typography>
      )}
    </SubCard>
  );
}

function Kpi({ value, label, note }: { value: ReactNode; label: string; note?: ReactNode }) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="h3" component="p">
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      {note && (
        <Typography variant="caption" color="text.secondary">
          {note}
        </Typography>
      )}
    </Stack>
  );
}

export default function SummaryPage() {
  const theme = useTheme();
  const { lang, t, L, path } = useI18n();
  const S = t.summary;
  const loc = t.intlLocale;
  usePageMeta(useMemo(() => summaryMeta(dataset.meta, siteUrl(), lang), [lang]));
  const s = useMemo(() => buildSummary(interfaces), []);

  const ifaceLinks = (ids: string[]) =>
    ids.map((id, k) => {
      const e = interfacesById.get(id);
      return (
        <span key={id}>
          {k > 0 && t.seo.listSep}
          <Link component={RouterLink} to={path(`/monitor/${id}`)} underline="hover" color="inherit">
            {e ? displayName(e) : id}
          </Link>
        </span>
      );
    });

  const groupTable = (rows: GroupRow[], firstCol: string, label: (key: string) => string, aria: string) => (
    <TableContainer>
      <Table size="small" aria-label={aria}>
        <TableHead>
          <TableRow>
            <TableCell>{firstCol}</TableCell>
            <TableCell align="right">{S.cols.interfaces}</TableCell>
            <TableCell sx={{ minWidth: 160 }}>{S.cols.ratings}</TableCell>
            <TableCell align="right">{S.cols.clean}</TableCell>
            <TableCell align="right">{S.cols.avg}</TableCell>
            <TableCell>{S.cols.max}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((g) => (
            <TableRow key={g.key}>
              <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{label(g.key)}</TableCell>
              <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {g.total}
              </TableCell>
              <TableCell>
                <ShareBar
                  ariaLabel={`${label(g.key)}: ${LEVELS.map((l) => `${L.LEVEL_LABELS[l]} ${g.levels[l]}`).join(', ')}`}
                  segments={LEVELS.map((l) => ({ key: l, label: L.LEVEL_LABELS[l], value: g.levels[l], color: levelColor(theme, l) }))}
                />
              </TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                <Box component="span" sx={{ fontWeight: 600 }}>
                  {share(g.cleanShare)}
                </Box>
                <Typography component="span" variant="caption" color="text.secondary">
                  {' '}
                  ({g.clean}/{g.rated})
                </Typography>
              </TableCell>
              <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {avg(g.avgRestricted)}
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                {g.max > 0 ? (
                  <>
                    <Box component="span" sx={{ fontWeight: 600, mr: 0.75 }}>
                      {g.max}
                    </Box>
                    <Typography component="span" variant="body2" color="text.secondary">
                      {ifaceLinks(g.maxIds.slice(0, 2))}
                      {g.maxIds.length > 2 ? ` +${g.maxIds.length - 2}` : ''}
                    </Typography>
                  </>
                ) : (
                  '—'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const maxEntry = interfacesById.get(s.maxIds[0] ?? '');
  const topCountries = s.countries.slice(0, 15);
  const siteColor = lighten(theme.palette.error.main, 0.1);
  const featureColor = theme.palette.warning.main;

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {S.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 900 }}>
        {S.intro(s.total, s.legacyExcluded, dataset.meta.generated)}
      </Typography>

      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 6, md: 2 }}>
            <Kpi value={s.total} label={S.tiles.interfaces} />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <Kpi value={pct(s.clean, s.rated)} label={S.tiles.clean} note={S.tiles.cleanOf(s.clean, s.rated)} />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <Kpi value={pct(s.restricted, s.rated)} label={S.tiles.restricted} note={`${s.restricted}`} />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <Kpi value={avg(s.avgRestricted)} label={S.tiles.avg} note={S.tiles.avgNote} />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <Kpi value={s.max} label={S.tiles.max} note={maxEntry ? ifaceLinks(s.maxIds) : undefined} />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <Kpi value={s.countriesBlocked} label={S.tiles.countries} note={S.tiles.countriesNote} />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Section title={S.ratingTitle}>
            <DonutChart
              ariaLabel={`${S.ratingTitle}: ${LEVELS.map((l) => `${L.LEVEL_LABELS[l]} ${s.levels[l]}`).join(', ')}`}
              centerLabel={S.ratingCenter}
              slices={LEVELS.map((l) => ({
                key: l,
                label: (
                  <Stack direction="row" spacing={1} alignItems="center" component="span">
                    <LevelChip level={l} />
                    <span>{L.LEVEL_DESCRIPTIONS[l]}</span>
                  </Stack>
                ),
                name: `${S.ratingTitle} ${l}`,
                value: s.levels[l],
                color: levelColor(theme, l)
              }))}
            />
          </Section>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Section title={S.mechanismsTitle} note={S.mechanismsNote}>
            <Stack spacing={1.75}>
              {s.mechanisms.map((m) => (
                <Box key={m.kind}>
                  <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {L.MECHANISM_LABELS[m.kind]}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {S.states.enforced} {m.counts.enforced} · {S.states.tos_only} {m.counts.tos_only}
                    </Typography>
                  </Stack>
                  <ShareBar
                    ariaLabel={`${L.MECHANISM_LABELS[m.kind]}: ${MECHANISM_STATES.map((st) => `${S.states[st]} ${m.counts[st]}`).join(', ')}`}
                    segments={MECHANISM_STATES.map((st) => ({
                      key: st,
                      label: S.states[st],
                      value: m.counts[st],
                      color: stateColor(theme, st)
                    }))}
                  />
                </Box>
              ))}
              <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', rowGap: 0.5, pt: 0.5 }}>
                {MECHANISM_STATES.map((st) => (
                  <Stack key={st} direction="row" spacing={0.75} alignItems="center">
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: stateColor(theme, st) }} />
                    <Typography variant="caption" color="text.secondary">
                      {S.states[st]}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Section>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Section title={S.countriesTitle} note={S.countriesNote}>
            <Stack direction="row" spacing={2} sx={{ mb: 1.5, flexWrap: 'wrap' }}>
              {[
                [siteColor, S.site],
                [featureColor, S.feature]
              ].map(([color, label]) => (
                <Stack key={label} direction="row" spacing={0.75} alignItems="center">
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
                  <Typography variant="caption" color="text.secondary">
                    {label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            <BarList
              ariaLabel={S.countriesTitle}
              labelWidth={170}
              rows={topCountries.map((c) => ({
                key: c.token,
                label: tokenLabel(c.token, loc, dataset.meta.regions),
                to: path(`/monitor?country=${encodeURIComponent(c.token)}`),
                segments: [
                  { value: c.site, color: siteColor, label: S.site },
                  { value: c.feature, color: featureColor, label: S.feature }
                ],
                ghost: c.tos,
                value: (
                  <>
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      {c.total}
                    </Box>
                    <Typography component="span" variant="caption" color="text.secondary">
                      {' · '}
                      {S.tos(c.tos)}
                    </Typography>
                  </>
                )
              }))}
            />
          </Section>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Section title={S.screeningTitle} note={S.providersNote}>
            <Typography variant="subtitle2" component="h3" sx={{ mb: 1.5 }}>
              {S.layerTitle}
            </Typography>
            <DonutChart
              size={144}
              ariaLabel={`${S.screeningTitle}: ${s.layers.map((l) => `${L.LAYER_LABELS[l.key]} ${l.count}`).join(', ')}`}
              center={s.screened}
              centerLabel={S.screenedCenter}
              slices={s.layers.map((l) => ({
                key: l.key,
                label: L.LAYER_LABELS[l.key],
                description: L.LAYER_DESCRIPTIONS[l.key],
                value: l.count,
                color: {
                  contract: lighten(theme.palette.error.main, 0.1),
                  api: theme.palette.orange.main,
                  frontend: theme.palette.warning.main,
                  edge: theme.palette.secondary.main
                }[l.key]
              }))}
            />
            <Typography variant="subtitle2" component="h3" sx={{ mt: 3, mb: 1.5 }}>
              {S.providersTitle}
            </Typography>
            <BarList
              ariaLabel={S.providersTitle}
              labelWidth={190}
              max={s.screened}
              rows={s.providers.map((p) => ({
                key: p.key,
                label: S.providers[p.key],
                segments: [{ value: p.count, color: theme.palette.secondary.main, label: S.providers[p.key] }],
                value: (
                  <>
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      {p.count}
                    </Box>
                    <Typography component="span" variant="caption" color="text.secondary">
                      {' · '}
                      {pct(p.count, s.screened)}
                    </Typography>
                  </>
                )
              }))}
            />
          </Section>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Section title={S.categoryTitle} note={S.notes}>
          {groupTable(
            s.categories,
            S.cols.category,
            (k) => L.CATEGORY_GROUP_LABELS[k as keyof typeof L.CATEGORY_GROUP_LABELS] ?? k,
            S.categoryTitle
          )}
        </Section>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Section title={S.networkTitle} note={S.networkNote(5)}>
          {groupTable(s.networks, S.cols.network, (k) => k, S.networkTitle)}
        </Section>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Section title={S.codeTitle}>
            <DonutChart
              ariaLabel={`${S.codeTitle}: ${S.open} ${s.open}, ${S.closed} ${s.closed}`}
              centerLabel={S.ratingCenter}
              slices={[
                { key: 'open', label: S.open, value: s.open, color: theme.palette.success.main },
                { key: 'closed', label: S.closed, value: s.closed, color: alpha(theme.palette.text.secondary, 0.45) }
              ]}
            />
          </Section>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Section title={S.cp0xTitle}>
            <DonutChart
              ariaLabel={`${S.cp0xTitle}: ${S.cp0xCovered} ${s.cp0x.covered}, ${S.cp0xNot} ${s.cp0x.restricted - s.cp0x.covered}`}
              center={s.cp0x.restricted}
              centerLabel={S.cp0xCenter}
              slices={[
                { key: 'covered', label: S.cp0xCovered, value: s.cp0x.covered, color: theme.palette.primary.main },
                {
                  key: 'not',
                  label: S.cp0xNot,
                  value: s.cp0x.restricted - s.cp0x.covered,
                  color: alpha(theme.palette.text.secondary, 0.45)
                }
              ]}
            />
          </Section>
        </Grid>
      </Grid>
    </Box>
  );
}
