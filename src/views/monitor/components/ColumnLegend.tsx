import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ToneChip, { statusTone } from './ToneChip';
import { STATUS_LABELS } from '../constants';
import { Status } from 'types/restrictions';

const COLUMNS: [string, string][] = [
  ['Level', 'D is the hardest restriction, A is clean; hover a chip for details.'],
  ['Geo Block', 'The whole site or trading is blocked for some countries.'],
  ['Feature Block', 'The site works, but some features or assets are hidden by country.'],
  ['Wallet screening', 'The wallet is checked against sanctions lists; the caption shows where.'],
  ['VPN', 'Whether VPN or Tor users are detected or blocked.'],
  ['Code', 'Public frontend repository.'],
  ['Official app', 'The official interface.'],
  ['Permissionless app', 'Our permissionless interface from pi.cp0x.com; these rows are highlighted and listed first.']
];

const VALUES: [Status, string][] = [
  ['yes', 'confirmed by code, a live check or docs'],
  ['reported', 'press or user reports'],
  ['tos_only', 'only written in the Terms of Service, not enforced in code'],
  ['optional', 'in code, off by default'],
  ['no', 'not found'],
  ['unknown', 'not checked']
];

export default function ColumnLegend() {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, columnGap: 3, rowGap: 0.5 }}>
        {COLUMNS.map(([name, text]) => (
          <Typography key={name} variant="caption" color="text.secondary">
            <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
              {name}
            </Box>{' '}
            — {text}
          </Typography>
        ))}
      </Box>
      <Stack direction="row" spacing={1.5} sx={{ mt: 1.5, flexWrap: 'wrap', rowGap: 1 }} alignItems="center">
        {VALUES.map(([s, text]) => (
          <Stack key={s} direction="row" spacing={0.5} alignItems="center">
            <ToneChip tone={statusTone(s)} label={STATUS_LABELS[s]} />
            <Typography variant="caption" color="text.secondary">
              {text}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
