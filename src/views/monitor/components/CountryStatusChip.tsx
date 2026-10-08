import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CountryVerdict } from 'types/restrictions';
import { regionLabel } from 'data/countries';
import ToneChip, { countryStatusTone } from './ToneChip';
import {
  BASIS_DESCRIPTIONS,
  BASIS_LABELS,
  COUNTRY_STATUS_DESCRIPTIONS,
  COUNTRY_STATUS_LABELS,
  OBS_STATE_LABELS,
  PROXY_TYPE_LABELS
} from '../constants';

interface CountryStatusChipProps {
  verdict: CountryVerdict;
  /** Status only in the chip (the basis is shown separately), for narrow table columns. */
  compact?: boolean;
}

export default function CountryStatusChip({ verdict, compact = false }: CountryStatusChipProps) {
  const regions = verdict.regions.map(regionLabel).join(', ');
  const tooltip = (
    <Box sx={{ maxWidth: 360 }}>
      <Typography variant="subtitle2">{COUNTRY_STATUS_DESCRIPTIONS[verdict.status]}</Typography>
      {regions && (
        <Typography variant="caption" component="div">
          Regions: {regions}
        </Typography>
      )}
      {verdict.detail && (
        <Typography variant="caption" component="div" sx={{ mt: 0.5 }}>
          {verdict.detail}
        </Typography>
      )}
      <Typography variant="caption" component="div" sx={{ mt: 0.5, opacity: 0.8 }}>
        Basis: {BASIS_LABELS[verdict.basis]} — {BASIS_DESCRIPTIONS[verdict.basis]}
      </Typography>
      {verdict.observation && (
        <Typography variant="caption" component="div" sx={{ mt: 0.5, opacity: 0.8 }}>
          Live probe {verdict.observation.at.slice(0, 10)} via {PROXY_TYPE_LABELS[verdict.observation.proxy_type]} proxy:{' '}
          {OBS_STATE_LABELS[verdict.observation.ui_state]} (HTTP {verdict.observation.http_status ?? '—'}, {verdict.observation.url})
          {verdict.conflict ? ' — disagrees with the static verdict' : ''}
        </Typography>
      )}
    </Box>
  );
  return (
    <ToneChip
      tone={countryStatusTone(verdict.status)}
      label={compact ? COUNTRY_STATUS_LABELS[verdict.status] : `${COUNTRY_STATUS_LABELS[verdict.status]} · ${BASIS_LABELS[verdict.basis]}`}
      tooltip={tooltip}
    />
  );
}
