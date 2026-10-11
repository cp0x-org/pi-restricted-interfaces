import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Status } from 'types/restrictions';
import { useI18n } from 'i18n';
import ToneChip, { statusTone } from './ToneChip';

interface StatusChipProps {
  status: Status;
  /** Short text under or beside the chip, e.g. a layer or a country count. */
  caption?: ReactNode;
  tooltip?: ReactNode;
  /** Table layout: chip on top, a one-line caption below, so rows keep the same height whatever the caption length. */
  stacked?: boolean;
}

export default function StatusChip({ status, caption, tooltip, stacked = false }: StatusChipProps) {
  const { L } = useI18n();
  // Keep the status meaning visible before any technical detail.
  const meaning = L.STATUS_DESCRIPTIONS[status];
  const statusTooltip = tooltip ? (
    <>
      <Box component="span" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>
        {meaning}
      </Box>
      {tooltip}
    </>
  ) : (
    meaning
  );
  return (
    <Stack
      direction={stacked ? 'column' : 'row'}
      spacing={stacked ? 0.25 : 0.75}
      alignItems={stacked ? 'flex-start' : 'center'}
      sx={stacked ? undefined : { flexWrap: 'wrap' }}
    >
      <ToneChip tone={statusTone(status)} label={L.STATUS_LABELS[status]} tooltip={statusTooltip} />
      {caption && (
        <Typography
          variant="caption"
          color="text.secondary"
          component="span"
          sx={stacked ? { whiteSpace: 'nowrap', lineHeight: 1.4 } : undefined}
        >
          {caption}
        </Typography>
      )}
    </Stack>
  );
}
