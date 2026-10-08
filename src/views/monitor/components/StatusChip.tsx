import { ReactNode } from 'react';
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
}

export default function StatusChip({ status, caption, tooltip }: StatusChipProps) {
  const { L } = useI18n();
  return (
    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexWrap: 'wrap' }}>
      <ToneChip tone={statusTone(status)} label={L.STATUS_LABELS[status]} tooltip={tooltip ?? L.STATUS_DESCRIPTIONS[status]} />
      {caption && (
        <Typography variant="caption" color="text.secondary" component="span">
          {caption}
        </Typography>
      )}
    </Stack>
  );
}
