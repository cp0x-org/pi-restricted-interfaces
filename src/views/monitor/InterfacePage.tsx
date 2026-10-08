import { useMemo } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import LaunchIcon from '@mui/icons-material/Launch';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SubCard from 'ui-component/cards/SubCard';

import { dataset, interfacesById } from 'data/dataset';
import { interfaceMeta, notFoundMeta } from 'seo/meta';
import { siteUrl, usePageMeta } from 'seo/usePageMeta';
import { tokenLabel } from 'data/countries';
import { evidenceLinks } from 'utils/restrictions';
import CountryTokenChips from './components/CountryTokenChips';
import EvidenceList from './components/EvidenceList';
import ForkChip from './components/ForkChip';
import LevelChip from './components/LevelChip';
import MechanismCard from './components/MechanismCard';
import RepoLink from './components/RepoLink';
import StatusChip from './components/StatusChip';
import ToneChip, { Tone, vpnTone } from './components/ToneChip';
import { localized, useI18n } from 'i18n';

const OBS_TONE: Record<string, Tone> = {
  ok: 'good',
  blocked: 'bad',
  close_only: 'warn',
  feature_limited: 'mild',
  challenge: 'neutral',
  error: 'unknown',
  unknown: 'unknown'
};

export default function InterfacePage() {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const entry = id ? interfacesById.get(id) : undefined;
  const { lang, t, L, path } = useI18n();
  const T = t.iface;
  usePageMeta(useMemo(() => (entry ? interfaceMeta(entry, dataset.meta, siteUrl(), lang) : notFoundMeta(lang)), [entry, lang]));

  if (!entry) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {T.notFound}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {T.notFoundText(id ?? '')}
        </Typography>
        <Button component={RouterLink} to={path('/monitor')} startIcon={<ArrowBackIcon />} variant="outlined">
          {T.back}
        </Button>
      </Box>
    );
  }

  const links = evidenceLinks(entry);
  const liveChecks = entry.live;

  return (
    <Box sx={{ width: '100%' }}>
      <Button component={RouterLink} to={path('/monitor')} startIcon={<ArrowBackIcon />} size="small" sx={{ mb: 2 }}>
        {T.all}
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: 'wrap', rowGap: 1 }}>
              <Typography variant="h2" component="h1">
                {entry.name}
              </Typography>
              <LevelChip level={entry.level} size="medium" />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {lang === 'en' ? entry.category : L.CATEGORY_GROUP_LABELS[entry.category_group]} · {entry.chains}
            </Typography>
            {entry.description && (
              <Typography variant="body1" sx={{ mt: 1.5, maxWidth: 720 }}>
                {localized(lang, entry.description, entry.description_zh)}
              </Typography>
            )}
            {entry.networks.length > 0 && (
              <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 0.5 }}>
                {entry.networks.map((n) => (
                  <Chip key={n} size="small" variant="outlined" color="default" label={n} />
                ))}
              </Stack>
            )}
            <Typography variant="body2" sx={{ mt: 1.5, maxWidth: 720 }}>
              {L.LEVEL_DESCRIPTIONS[entry.level]}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', rowGap: 1 }}>
              <Button
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="small"
                color="secondary"
                endIcon={<LaunchIcon />}
                sx={{ textTransform: 'none' }}
              >
                {entry.url.replace(/^https?:\/\//, '')}
              </Button>
              {entry.frontend_repo && (
                <Button
                  href={entry.frontend_repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="small"
                  color="secondary"
                  startIcon={<GitHubIcon />}
                >
                  {T.frontendCode}
                </Button>
              )}
              {entry.alternatives.map((a) => (
                <Button
                  key={a.url}
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  size="small"
                  color="secondary"
                  endIcon={<LaunchIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  {T.altPrefix} {a.name}
                </Button>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Stack spacing={0.5}>
                  <Box>
                    <ForkChip fork={entry.fork_ready} />
                  </Box>
                  <Typography variant="body2" sx={{ color: theme.palette.grey[500] }}>
                    {T.forkReadiness}
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Stack spacing={0.5}>
                  <Box>
                    <RepoLink entry={entry} />
                  </Box>
                  <Typography variant="body2" sx={{ color: theme.palette.grey[500] }}>
                    {T.frontendCode}
                    {entry.repo_last_commit ? T.lastCommit(entry.repo_last_commit) : ''}
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Stack spacing={0.5}>
                  <Typography variant="h5" component="p">
                    {L.CONFIDENCE_LABELS[entry.confidence]}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.grey[500] }}>
                    {T.confidence}
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Stack spacing={0.5}>
                  <Typography variant="h5" component="p">
                    {dataset.meta.generated}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.grey[500] }}>
                    {T.checked}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <MechanismCard
            title={L.MECHANISM_LABELS.geo_site}
            chip={<StatusChip status={entry.geo_site.s} />}
            rows={[{ label: T.howEnforced, value: entry.geo_site.method }]}
            countries={[
              { label: T.blockedCountries, tokens: entry.geo_site.countries },
              { label: T.closeOnlyCountries, tokens: entry.geo_site.close_only }
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MechanismCard
            title={L.MECHANISM_LABELS.geo_feature}
            chip={<StatusChip status={entry.geo_feature.s} />}
            rows={[
              { label: T.scope, value: entry.geo_feature.scope },
              { label: T.assetFilter, value: entry.asset_filter }
            ]}
            countries={[{ label: T.affected, tokens: entry.geo_feature.countries }]}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MechanismCard
            title={L.MECHANISM_LABELS.screening}
            chip={<StatusChip status={entry.screening.s} />}
            rows={[
              { label: T.provider, value: entry.screening.provider },
              {
                label: T.whereRuns,
                value: entry.screening.layer
                  ? `${L.LAYER_LABELS[entry.screening.layer]} — ${L.LAYER_DESCRIPTIONS[entry.screening.layer]}`
                  : ''
              },
              {
                label: T.failMode,
                value: entry.screening.fail
                  ? `${L.FAIL_LABELS[entry.screening.fail]}${entry.screening.fail_note ? ` (${entry.screening.fail_note})` : ''}`
                  : ''
              }
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MechanismCard
            title={L.MECHANISM_LABELS.vpn}
            chip={<ToneChip tone={vpnTone(entry.vpn.s)} label={L.VPN_LABELS[entry.vpn.s]} />}
            rows={[{ label: T.note, value: entry.vpn.note }]}
          />
        </Grid>
        {entry.kyc && (
          <Grid size={{ xs: 12, md: 6 }}>
            <MechanismCard
              title={L.MECHANISM_LABELS.kyc}
              chip={<StatusChip status={entry.kyc.s} />}
              rows={[
                { label: T.kycScope, value: entry.kyc.scope },
                {
                  label: T.whereRuns,
                  value: entry.kyc.layer ? `${L.LAYER_LABELS[entry.kyc.layer]} — ${L.LAYER_DESCRIPTIONS[entry.kyc.layer]}` : ''
                }
              ]}
            />
          </Grid>
        )}
        <Grid size={{ xs: 12 }}>
          <MechanismCard
            title={T.tos}
            chip={
              <Chip
                size="small"
                variant="outlined"
                color={entry.tos.us === 'yes' ? 'error' : entry.tos.us === 'partial' ? 'warning' : 'default'}
                label={`${T.usPersons}: ${L.TOS_US_LABELS[entry.tos.us]}${entry.tos.us_scope ? ` (${entry.tos.us_scope})` : ''}`}
              />
            }
            rows={[
              {
                label: T.document,
                value: entry.tos.url ? (
                  <Link href={entry.tos.url} target="_blank" rel="noopener noreferrer" underline="hover">
                    {entry.tos.url.replace(/^https?:\/\//, '')}
                  </Link>
                ) : (
                  T.notFoundDoc
                )
              },
              { label: T.lastUpdated, value: entry.tos.updated },
              { label: T.restrictedAsWritten, value: entry.tos.restricted }
            ]}
            countries={[{ label: T.named, tokens: entry.tos.restricted_codes }]}
          />
        </Grid>
      </Grid>

      {T.dataNote && (
        <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: -1.5, mb: 2 }}>
          {T.dataNote}
        </Typography>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SubCard title={T.forkNotes} titleComponent="h2" sx={{ height: '100%' }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              {entry.fork_notes || T.noNotes}
            </Typography>
            {entry.repo_status && (
              <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 1.5 }}>
                {T.repoStatus}: {entry.repo_status}
              </Typography>
            )}
          </SubCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SubCard title={T.liveChecks} titleComponent="h2" sx={{ height: '100%' }}>
            {liveChecks.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                {T.noLive}
              </Typography>
            ) : (
              <List dense disablePadding>
                {liveChecks.map((l, n) => (
                  <ListItem key={n} disableGutters sx={{ py: 0.25 }}>
                    <Typography variant="body2">{l}</Typography>
                  </ListItem>
                ))}
              </List>
            )}
            <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 1.5 }}>
              {T.egress}: {dataset.meta.live_check_egress}
            </Typography>
            {entry.geo_endpoints.length > 0 && (
              <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 1 }}>
                {T.probeEndpoints}: {entry.geo_endpoints.join(', ')}
              </Typography>
            )}
          </SubCard>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <SubCard title={T.observations} titleComponent="h2">
            {entry.observations.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                {T.notProbed}
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small" aria-label="live observations">
                  <TableHead>
                    <TableRow>
                      <TableCell>{T.obsCols.country}</TableCell>
                      <TableCell>{T.obsCols.vantage}</TableCell>
                      <TableCell>{T.obsCols.target}</TableCell>
                      <TableCell>{T.obsCols.result}</TableCell>
                      <TableCell>{T.obsCols.http}</TableCell>
                      <TableCell>{T.obsCols.when}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entry.observations.map((o) => (
                      <TableRow key={`${o.country}-${o.region ?? ''}-${o.proxy_type}-${o.kind}-${o.url}`}>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {tokenLabel(o.region ?? o.country, t.intlLocale, L.REGION_LABELS)}
                        </TableCell>
                        <TableCell>{L.PROXY_TYPE_LABELS[o.proxy_type]}</TableCell>
                        <TableCell sx={{ wordBreak: 'break-all' }}>
                          <Typography variant="caption" color="text.secondary" component="div">
                            {o.kind === 'site' ? T.landing : T.geoEndpoint}
                          </Typography>
                          {o.url}
                        </TableCell>
                        <TableCell>
                          <ToneChip tone={OBS_TONE[o.ui_state]} label={L.OBS_STATE_LABELS[o.ui_state]} tooltip={o.note || undefined} />
                          {Object.keys(o.flags).length > 0 && (
                            <Typography variant="caption" color="text.secondary" component="div">
                              {Object.entries(o.flags)
                                .map(([k, v]) => `${k}=${String(v)}`)
                                .join(' ')}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {o.http_status ?? '—'}
                          {o.final_url && o.final_url !== o.url && (
                            <Typography variant="caption" color="text.secondary" component="div" sx={{ wordBreak: 'break-all' }}>
                              → {o.final_url}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{o.at.slice(0, 10)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </SubCard>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <SubCard title={T.evidence} titleComponent="h2">
            <EvidenceList links={links} />
            {entry.frontend_repo && (
              <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 1.5 }}>
                {T.pathsNote(dataset.meta.generated)}
              </Typography>
            )}
          </SubCard>
        </Grid>
        {entry.tos.restricted_codes.length > 0 && entry.geo_site.countries.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" color="text.secondary">
              {T.tosCountries} <CountryTokenChips tokens={entry.tos.restricted_codes} max={40} />
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
