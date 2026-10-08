import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CountryVerdict } from 'types/restrictions';
import { regionLabel } from 'data/countries';
import ToneChip, { countryStatusTone } from './ToneChip';
import { BASIS_DESCRIPTIONS, BASIS_LABELS, COUNTRY_STATUS_DESCRIPTIONS, COUNTRY_STATUS_LABELS } from '../constants';

interface CountryStatusChipProps {
  verdict: CountryVerdict;
}

export default function CountryStatusChip({ verdict }: CountryStatusChipProps) {
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
    </Box>
  );
  return (
    <ToneChip
      tone={countryStatusTone(verdict.status)}
      label={`${COUNTRY_STATUS_LABELS[verdict.status]} · ${BASIS_LABELS[verdict.basis]}`}
      tooltip={tooltip}
    />
  );
}
