import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CountryVerdict } from 'types/restrictions';
import CountryStatusChip from './CountryStatusChip';
import { BASIS_LABELS, OBS_STATE_LABELS, PROXY_TYPE_LABELS } from '../constants';

interface CountryVerdictCellProps {
  verdict: CountryVerdict;
  /** Narrow layout for the monitor table: status in the chip, basis and probe date as a caption. */
  compact?: boolean;
  /** Shown before the chip, e.g. a country flag when several countries are selected. */
  prefix?: string;
}

/** Country verdict chip plus, when the P3 probe has data, a note about the live observation. */
export default function CountryVerdictCell({ verdict, compact = false, prefix }: CountryVerdictCellProps) {
  const o = verdict.observation;
  if (compact) {
    const caption = [BASIS_LABELS[verdict.basis], o && `probed ${o.at.slice(0, 10)}`, verdict.conflict && 'conflict']
      .filter(Boolean)
      .join(' · ');
    return (
      <div>
        <Stack direction="row" spacing={0.75} alignItems="center">
          {prefix && (
            <Typography variant="body2" component="span">
              {prefix}
            </Typography>
          )}
          <CountryStatusChip verdict={verdict} compact />
        </Stack>
        <Typography
          variant="caption"
          color={verdict.conflict ? 'warning.main' : 'text.secondary'}
          component="div"
          data-basis={BASIS_LABELS[verdict.basis]}
        >
          {caption}
        </Typography>
      </div>
    );
  }
  return (
    <>
      <CountryStatusChip verdict={verdict} />
      {o && (
        <Typography variant="caption" color={verdict.conflict ? 'warning.main' : 'text.secondary'} component="div">
          probed {o.at.slice(0, 10)} · {PROXY_TYPE_LABELS[o.proxy_type]} · {OBS_STATE_LABELS[o.ui_state]}
          {verdict.conflict
            ? o.ui_state === 'ok'
              ? ' (landing page served: the block is not at the edge)'
              : ' (disagrees with the static verdict)'
            : ''}
        </Typography>
      )}
    </>
  );
}
