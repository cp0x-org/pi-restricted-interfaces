import { ReactNode, useMemo } from 'react';
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

import { dataset, interfaces } from 'data/dataset';
import { methodologyMeta } from 'seo/meta';
import { siteUrl, usePageMeta } from 'seo/usePageMeta';
import { rich, useI18n } from 'i18n';
import { COUNTRY_STATUS, LAYERS, LEVELS, STATUS } from 'types/restrictions';
import LevelChip from './components/LevelChip';
import StatusChip from './components/StatusChip';
import ToneChip, { countryStatusTone } from './components/ToneChip';
import { DATA_FILE_PATH } from './constants';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <SubCard title={title} titleComponent="h2" sx={{ mb: 3 }}>
      {children}
    </SubCard>
  );
}

export default function MethodologyPage() {
  const { lang, t, L } = useI18n();
  const M = t.method;
  usePageMeta(useMemo(() => methodologyMeta(dataset.meta, siteUrl(), lang), [lang]));
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {M.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 900 }}>
        {rich(M.intro(dataset.meta.generated, interfaces.length, dataset.meta.catalog_total))}
      </Typography>

      <Section title={M.levelsTitle}>
        <Stack spacing={1.5}>
          {LEVELS.map((level) => (
            <Stack key={level} direction="row" spacing={2} alignItems="flex-start">
              <Box sx={{ minWidth: 48, pt: 0.25 }}>
                <LevelChip level={level} withTooltip={false} />
              </Box>
              <Typography variant="body2">{L.LEVEL_DESCRIPTIONS[level]}</Typography>
            </Stack>
          ))}
        </Stack>
        <Typography variant="body2" sx={{ mt: 2 }}>
          {M.levelsNote}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1.5 }}>
          {M.versionsNote}
        </Typography>
      </Section>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Section title={M.statusTitle}>
            <Stack spacing={1.5}>
              {STATUS.map((s) => (
                <Stack key={s} direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ minWidth: 96, pt: 0.25 }}>
                    <StatusChip status={s} />
                  </Box>
                  <Typography variant="body2">{L.STATUS_DESCRIPTIONS[s]}</Typography>
                </Stack>
              ))}
            </Stack>
          </Section>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Section title={M.layerTitle}>
            <Stack spacing={1.5}>
              {LAYERS.map((l) => (
                <Stack key={l} spacing={0.25}>
                  <Typography variant="subtitle2" component="h3">
                    {L.LAYER_LABELS[l]}
                  </Typography>
                  <Typography variant="body2">{L.LAYER_DESCRIPTIONS[l]}</Typography>
                </Stack>
              ))}
            </Stack>
            <Typography variant="body2" sx={{ mt: 2 }}>
              {M.layerNote}
            </Typography>
          </Section>
        </Grid>
      </Grid>

      <Section title={M.countryTitle}>
        <Stack spacing={1}>
          {COUNTRY_STATUS.map((s) => (
            <Stack key={s} direction="row" spacing={1.5} alignItems="flex-start">
              <Box sx={{ minWidth: 170, pt: 0.25 }}>
                <ToneChip tone={countryStatusTone(s)} label={L.COUNTRY_STATUS_LABELS[s]} tooltip={L.COUNTRY_STATUS_DESCRIPTIONS[s]} />
              </Box>
              <Typography variant="body2">{M.countryRules[s]}</Typography>
            </Stack>
          ))}
        </Stack>
        <Typography variant="body2" sx={{ mt: 2 }}>
          {M.countryNote}
        </Typography>
      </Section>

      <Section title={M.detectTitle}>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{M.detectCols.layer}</TableCell>
                <TableCell>{M.detectCols.signal}</TableCell>
                <TableCell>{M.detectCols.examples}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {M.typology.map((row) => (
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
          {M.detectNote}
        </Typography>
      </Section>

      <Section title={M.liveTitle}>
        <Typography variant="body2" sx={{ mb: 1.5 }}>
          {M.liveP1(dataset.meta.sanctioned_test_address_note)}
        </Typography>
        <CopyableAddress address={dataset.meta.sanctioned_test_address} />
        <Typography variant="body2" sx={{ mt: 1.5 }}>
          {M.liveP2(dataset.meta.live_check_egress)}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1.5 }}>
          {rich(M.liveP3)}
        </Typography>
      </Section>

      <Section title={M.limitsTitle}>
        <Stack spacing={1}>
          {M.limits.map((text) => (
            <Typography key={text} variant="body2">
              {text}
            </Typography>
          ))}
          <Typography variant="body2">
            {rich(M.source(DATA_FILE_PATH))}{' '}
            <Link href="https://pi.cp0x.com" target="_blank" rel="noopener noreferrer" underline="always">
              {M.altLink}
            </Link>
            .
          </Typography>
        </Stack>
      </Section>
    </Box>
  );
}
