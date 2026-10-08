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
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import LaunchIcon from '@mui/icons-material/Launch';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SubCard from 'ui-component/cards/SubCard';

import { dataset, interfacesById } from 'data/dataset';
import { evidenceLinks } from 'utils/restrictions';
import CountryTokenChips from './components/CountryTokenChips';
import EvidenceList from './components/EvidenceList';
import ForkChip from './components/ForkChip';
import LevelChip from './components/LevelChip';
import MechanismCard from './components/MechanismCard';
import RepoLink from './components/RepoLink';
import StatusChip from './components/StatusChip';
import ToneChip, { vpnTone } from './components/ToneChip';
import { FAIL_LABELS, LAYER_DESCRIPTIONS, LAYER_LABELS, LEVEL_DESCRIPTIONS, TOS_US_LABELS, VPN_LABELS } from './constants';

export default function InterfacePage() {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const entry = id ? interfacesById.get(id) : undefined;

  if (!entry) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h4" gutterBottom>
          Interface not found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          There is no interface with id “{id}” in the catalog.
        </Typography>
        <Button component={RouterLink} to="/monitor" startIcon={<ArrowBackIcon />} variant="outlined">
          Back to the monitor
        </Button>
      </Box>
    );
  }

  const links = evidenceLinks(entry);
  const liveChecks = entry.live;

  return (
    <Box sx={{ width: '100%' }}>
      <Button component={RouterLink} to="/monitor" startIcon={<ArrowBackIcon />} size="small" sx={{ mb: 2 }}>
        All interfaces
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
              {entry.category} · {entry.chains}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1.5, maxWidth: 720 }}>
              {LEVEL_DESCRIPTIONS[entry.level]}
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
                  Frontend code
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
                  Permissionless alternative: {a.name}
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
                    Fork readiness
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Stack spacing={0.5}>
                  <Box>
                    <RepoLink entry={entry} />
                  </Box>
                  <Typography variant="body2" sx={{ color: theme.palette.grey[500] }}>
                    Frontend code{entry.repo_last_commit ? ` · last commit ${entry.repo_last_commit}` : ''}
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Stack spacing={0.5}>
                  <Typography variant="h5">{entry.confidence}</Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.grey[500] }}>
                    Confidence
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Stack spacing={0.5}>
                  <Typography variant="h5">{dataset.meta.generated}</Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.grey[500] }}>
                    Checked
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
            title="Site geo-block"
            chip={<StatusChip status={entry.geo_site.s} />}
            rows={[{ label: 'How it is enforced', value: entry.geo_site.method }]}
            countries={[
              { label: 'Blocked countries', tokens: entry.geo_site.countries },
              { label: 'Close-only countries', tokens: entry.geo_site.close_only }
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MechanismCard
            title="Feature / asset geo-gate"
            chip={<StatusChip status={entry.geo_feature.s} />}
            rows={[
              { label: 'Scope', value: entry.geo_feature.scope },
              { label: 'Asset filter', value: entry.asset_filter }
            ]}
            countries={[{ label: 'Affected countries', tokens: entry.geo_feature.countries }]}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MechanismCard
            title="Wallet screening"
            chip={<StatusChip status={entry.screening.s} />}
            rows={[
              { label: 'Provider / endpoint', value: entry.screening.provider },
              {
                label: 'Where it runs',
                value: entry.screening.layer ? `${LAYER_LABELS[entry.screening.layer]} — ${LAYER_DESCRIPTIONS[entry.screening.layer]}` : ''
              },
              {
                label: 'Fail mode',
                value: entry.screening.fail
                  ? `${FAIL_LABELS[entry.screening.fail]}${entry.screening.fail_note ? ` (${entry.screening.fail_note})` : ''}`
                  : ''
              }
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MechanismCard
            title="VPN / Tor detection"
            chip={<ToneChip tone={vpnTone(entry.vpn.s)} label={VPN_LABELS[entry.vpn.s]} />}
            rows={[{ label: 'Note', value: entry.vpn.note }]}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <MechanismCard
            title="Terms of Service"
            chip={
              <Chip
                size="small"
                variant="outlined"
                color={entry.tos.us === 'yes' ? 'error' : entry.tos.us === 'partial' ? 'warning' : 'default'}
                label={`US persons: ${TOS_US_LABELS[entry.tos.us]}${entry.tos.us_scope ? ` (${entry.tos.us_scope})` : ''}`}
              />
            }
            rows={[
              {
                label: 'Document',
                value: entry.tos.url ? (
                  <Link href={entry.tos.url} target="_blank" rel="noopener noreferrer" underline="hover">
                    {entry.tos.url.replace(/^https?:\/\//, '')}
                  </Link>
                ) : (
                  'Not found'
                )
              },
              { label: 'Last updated', value: entry.tos.updated },
              { label: 'Restricted jurisdictions (as written)', value: entry.tos.restricted }
            ]}
            countries={[{ label: 'Named jurisdictions', tokens: entry.tos.restricted_codes }]}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SubCard title="Fork notes" sx={{ height: '100%' }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              {entry.fork_notes || 'No notes.'}
            </Typography>
            {entry.repo_status && (
              <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 1.5 }}>
                Repository status: {entry.repo_status}
              </Typography>
            )}
          </SubCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SubCard title="Live checks" sx={{ height: '100%' }}>
            {liveChecks.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No live checks recorded.
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
              Egress: {dataset.meta.live_check_egress}
            </Typography>
          </SubCard>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <SubCard title="Evidence">
            <EvidenceList links={links} />
            {entry.frontend_repo && (
              <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 1.5 }}>
                Paths are relative to the repository root at the default branch on {dataset.meta.generated}.
              </Typography>
            )}
          </SubCard>
        </Grid>
        {entry.tos.restricted_codes.length > 0 && entry.geo_site.countries.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" color="text.secondary">
              Countries named in the ToS: <CountryTokenChips tokens={entry.tos.restricted_codes} max={40} />
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
