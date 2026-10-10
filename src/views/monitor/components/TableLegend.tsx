import { ReactNode, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { useI18n } from 'i18n';
import { LEVELS, Status } from 'types/restrictions';
import LevelChip from './LevelChip';
import ToneChip, { statusTone, vpnTone } from './ToneChip';

const STATUSES: Status[] = ['yes', 'reported', 'tos_only', 'optional', 'no', 'unknown'];
// A shared chip width keeps descriptions aligned across all legend groups.
const CHIP_WIDTH = 76;

function readOpen() {
  try {
    return localStorage.getItem('monitor.legendOpen') === '1';
  } catch {
    return false;
  }
}

function LegendGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box>
      <Typography
        variant="caption"
        component="div"
        sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, mb: 1 }}
      >
        {title}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: `${CHIP_WIDTH}px 1fr`, columnGap: 1.5, rowGap: 1, alignItems: 'center' }}>
        {children}
      </Box>
    </Box>
  );
}

function LegendItem({ chip, description }: { chip: ReactNode; description: string }) {
  return (
    <>
      <Box sx={{ display: 'flex', '& .MuiChip-root': { width: CHIP_WIDTH } }}>{chip}</Box>
      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
        {description}
      </Typography>
    </>
  );
}

export default function TableLegend() {
  const { t, L, path } = useI18n();
  const [open, setOpen] = useState(readOpen);

  const toggleOpen = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    try {
      localStorage.setItem('monitor.legendOpen', nextOpen ? '1' : '0');
    } catch {
      // Keep the toggle usable when storage is unavailable.
    }
  };

  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          size="small"
          startIcon={<InfoOutlined />}
          endIcon={<ExpandMore sx={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />}
          aria-expanded={open}
          aria-controls="monitor-legend"
          onClick={toggleOpen}
          sx={{ textTransform: 'none' }}
        >
          {t.monitor.legendToggle}
        </Button>
      </Box>
      <Collapse in={open}>
        <Paper id="monitor-legend" variant="outlined" sx={{ p: 2.5, mt: 1 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, columnGap: 5, rowGap: 2.5 }}>
            <Stack spacing={2.5}>
              <LegendGroup title={t.monitor.cols.level}>
                {LEVELS.map((l) => (
                  <LegendItem key={l} chip={<LevelChip level={l} withTooltip={false} />} description={L.LEVEL_DESCRIPTIONS[l]} />
                ))}
              </LegendGroup>
              <LegendGroup title={t.monitor.cols.vpn}>
                <LegendItem chip={<ToneChip tone={vpnTone('detect')} label={L.VPN_LABELS.detect} />} description={t.legend.vpnDetect} />
                <LegendItem chip={<ToneChip tone={vpnTone('block')} label={L.VPN_LABELS.block} />} description={t.legend.vpnBlock} />
              </LegendGroup>
            </Stack>
            <Stack spacing={2.5}>
              <LegendGroup title={t.method.statusTitle}>
                {STATUSES.map((s) => (
                  <LegendItem
                    key={s}
                    chip={<ToneChip tone={statusTone(s)} label={L.STATUS_LABELS[s]} />}
                    description={L.STATUS_DESCRIPTIONS[s]}
                  />
                ))}
              </LegendGroup>
              {/* Legacy rows sit at the bottom of the table; their chip is explained here like every other chip. */}
              <LegendGroup title={t.monitor.cols.iface}>
                <LegendItem chip={<ToneChip tone="neutral" label={t.chips.legacy} />} description={t.legend.legacy} />
              </LegendGroup>
            </Stack>
          </Box>
          <Box sx={{ mt: 2.5 }}>
            <Link component={RouterLink} to={path('/methodology')} variant="caption" underline="hover">
              {t.monitor.methodologyLink}
            </Link>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
}
