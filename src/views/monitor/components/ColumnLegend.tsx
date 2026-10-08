import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Status } from 'types/restrictions';
import { useI18n } from 'i18n';
import ToneChip, { statusTone } from './ToneChip';

const VALUE_ORDER: Status[] = ['yes', 'reported', 'tos_only', 'optional', 'no', 'unknown'];

export default function ColumnLegend() {
  const { t, L } = useI18n();
  const c = t.monitor.cols;
  const columns: [string, string][] = [
    [c.level, t.legend.level],
    [c.geo, t.legend.geo],
    [c.feature, t.legend.feature],
    [c.screening, t.legend.screening],
    [c.vpn, t.legend.vpn],
    [c.code, t.legend.code],
    [c.official, t.legend.official],
    [c.permissionless, t.legend.permissionless]
  ];
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, columnGap: 3, rowGap: 0.5 }}>
        {columns.map(([name, text]) => (
          <Typography key={name} variant="caption" color="text.secondary">
            <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
              {name}
            </Box>{' '}
            — {text}
          </Typography>
        ))}
      </Box>
      <Stack direction="row" spacing={1.5} sx={{ mt: 1.5, flexWrap: 'wrap', rowGap: 1 }} alignItems="center">
        {VALUE_ORDER.map((s) => (
          <Stack key={s} direction="row" spacing={0.5} alignItems="center">
            <ToneChip tone={statusTone(s)} label={L.STATUS_LABELS[s]} />
            <Typography variant="caption" color="text.secondary">
              {t.legend.values[s]}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
