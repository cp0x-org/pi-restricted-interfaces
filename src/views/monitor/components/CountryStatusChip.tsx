import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CountryVerdict } from 'types/restrictions';
import { regionLabel } from 'data/countries';
import { useI18n } from 'i18n';
import ToneChip, { countryStatusTone } from './ToneChip';

interface CountryStatusChipProps {
  verdict: CountryVerdict;
  /** Status only in the chip (the basis is shown separately), for narrow table columns. */
  compact?: boolean;
}

export default function CountryStatusChip({ verdict, compact = false }: CountryStatusChipProps) {
  const { t, L } = useI18n();
  const regions = verdict.regions.map((r) => regionLabel(r, L.REGION_LABELS)).join(', ');
  const o = verdict.observation;
  const tooltip = (
    <Box sx={{ maxWidth: 360 }}>
      <Typography variant="subtitle2">{L.COUNTRY_STATUS_DESCRIPTIONS[verdict.status]}</Typography>
      {regions && (
        <Typography variant="caption" component="div">
          {t.chips.regions}: {regions}
        </Typography>
      )}
      {verdict.detail && (
        <Typography variant="caption" component="div" sx={{ mt: 0.5 }}>
          {verdict.detail}
        </Typography>
      )}
      <Typography variant="caption" component="div" sx={{ mt: 0.5, opacity: 0.8 }}>
        {t.chips.basis}: {L.BASIS_LABELS[verdict.basis]} — {L.BASIS_DESCRIPTIONS[verdict.basis]}
      </Typography>
      {o && (
        <Typography variant="caption" component="div" sx={{ mt: 0.5, opacity: 0.8 }}>
          {t.chips.liveProbe(
            o.at.slice(0, 10),
            L.PROXY_TYPE_LABELS[o.proxy_type],
            L.OBS_STATE_LABELS[o.ui_state],
            String(o.http_status ?? '—'),
            o.url
          )}
          {verdict.conflict ? t.chips.disagrees : ''}
        </Typography>
      )}
    </Box>
  );
  const status = L.COUNTRY_STATUS_LABELS[verdict.status];
  return (
    <ToneChip
      tone={countryStatusTone(verdict.status)}
      label={compact ? status : `${status} · ${L.BASIS_LABELS[verdict.basis]}`}
      tooltip={tooltip}
    />
  );
}
