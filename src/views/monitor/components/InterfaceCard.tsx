import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import LaunchIcon from '@mui/icons-material/Launch';
import { useI18n } from 'i18n';
import { CountryVerdict, InterfaceEntry } from 'types/restrictions';
import { displayName, restrictionsText } from 'utils/restrictions';
import CountryVerdictCell from './CountryVerdictCell';
import LevelChip from './LevelChip';
import PermissionlessLink from './PermissionlessLink';
import RepoLink from './RepoLink';
import StatusChip from './StatusChip';
import ToneChip, { vpnTone } from './ToneChip';

interface InterfaceCardProps {
  entry: InterfaceEntry;
  to: string;
  onOpen: () => void;
  officialHost: string;
  geoCaption?: string;
  featureCaption?: string;
  verdicts?: { verdict: CountryVerdict; prefix?: string }[];
}

// One interface row on a narrow screen: table facts stay in a fixed order so cards can be compared at a glance.
export default function InterfaceCard({ entry: i, to, onOpen, officialHost, geoCaption, featureCaption, verdicts }: InterfaceCardProps) {
  const { t, L } = useI18n();
  return (
    <Paper variant="outlined" onClick={onOpen} sx={{ p: 2, cursor: 'pointer', '&:hover': { borderColor: 'text.secondary' } }}>
      <Stack direction="row" spacing={1.5} alignItems="flex-start" justifyContent="space-between">
        <Box sx={{ minWidth: 0 }}>
          <Link
            component={RouterLink}
            to={to}
            onClick={(e) => e.stopPropagation()}
            underline="hover"
            color="inherit"
            variant="subtitle1"
            sx={{ fontWeight: 600 }}
          >
            {displayName(i)}
          </Link>
          {i.aka && (
            <Typography component="span" variant="body2" color="text.secondary">
              {` ${i.aka}`}
            </Typography>
          )}
          {i.lifecycle === 'legacy' && (
            <ToneChip
              tone="neutral"
              label={t.chips.legacy}
              tooltip={i.lifecycle_note ?? t.legend.legacy}
              sx={{ ml: 0.75, verticalAlign: 'middle' }}
            />
          )}
          <Tooltip title={i.networks.join(', ')} arrow placement="top" disableHoverListener={i.networks.length <= 3}>
            <Typography variant="caption" color="text.secondary" component="div">
              {i.networks.slice(0, 3).join(', ')}
              {i.networks.length > 3 ? ` +${i.networks.length - 3}` : ''}
            </Typography>
          </Tooltip>
        </Box>
        <Tooltip
          arrow
          placement="top"
          title={restrictionsText(i, t.monitor.restrictionsTip, L.MECHANISM_LABELS, t.seo.listSep, L.LEVEL_DESCRIPTIONS['n/a'])}
        >
          <Stack spacing={0.25} alignItems="flex-start" data-restrictions={i.restrictions.count} sx={{ flexShrink: 0 }}>
            <LevelChip level={i.level} withTooltip={false} />
            <Typography variant="caption" color="text.secondary" sx={{ pl: 1.25 }}>
              {i.restrictions.count}
            </Typography>
          </Stack>
        </Tooltip>
      </Stack>

      {verdicts && verdicts.length > 0 && (
        <Stack spacing={0.75} sx={{ mt: 1.5 }}>
          {verdicts.map((h, index) => (
            <CountryVerdictCell key={h.prefix ?? index} verdict={h.verdict} compact prefix={h.prefix} />
          ))}
        </Stack>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(4, minmax(0, 1fr))' },
          gap: 1.5,
          mt: 1.5
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 0.5 }}>
            {t.monitor.cols.geo}
          </Typography>
          <StatusChip status={i.geo_site.s} caption={geoCaption} tooltip={i.geo_site.method || undefined} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 0.5 }}>
            {t.monitor.cols.feature}
          </Typography>
          <StatusChip status={i.geo_feature.s} caption={featureCaption} tooltip={i.geo_feature.scope || undefined} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 0.5 }}>
            {t.monitor.cols.screening}
          </Typography>
          <StatusChip
            status={i.screening.s}
            caption={i.screening.layer ? L.LAYER_LABELS[i.screening.layer] : undefined}
            tooltip={i.screening.provider || undefined}
          />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 0.5 }}>
            {t.monitor.cols.vpn}
          </Typography>
          <ToneChip tone={vpnTone(i.vpn.s)} label={L.VPN_LABELS[i.vpn.s]} tooltip={i.vpn.note || undefined} />
        </Box>
      </Box>

      <Stack direction="row" spacing={2} useFlexGap alignItems="center" sx={{ mt: 1.5, flexWrap: 'wrap', rowGap: 1 }}>
        <Link
          href={i.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          underline="hover"
          variant="body2"
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, whiteSpace: 'nowrap' }}
        >
          {officialHost}
          <LaunchIcon sx={{ fontSize: 14 }} />
        </Link>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {t.monitor.cols.code}
          </Typography>
          <RepoLink entry={i} compact />
        </Stack>
        {i.alternatives.length > 0 && <PermissionlessLink entry={i} />}
      </Stack>
    </Paper>
  );
}
