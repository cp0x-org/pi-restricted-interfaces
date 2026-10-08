import { ReactNode } from 'react';
import Chip, { ChipProps } from '@mui/material/Chip';
import { Theme, lighten } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { CountryStatus, ForkReady, Level, Status, VpnStatus } from 'types/restrictions';

/** Semantic colour of a chip. The theme's Chip override defaults to primary/light, so colours are always explicit here. */
export type Tone = 'bad' | 'warn' | 'mild' | 'good' | 'goodOutlined' | 'neutral' | 'unknown';

const TONE_STYLE: Record<Tone, Pick<ChipProps, 'color' | 'variant'>> = {
  bad: { color: 'error', variant: 'light' },
  warn: { color: 'orange', variant: 'light' },
  mild: { color: 'warning', variant: 'light' },
  good: { color: 'success', variant: 'light' },
  goodOutlined: { color: 'success', variant: 'outlined' },
  neutral: { color: 'default', variant: 'outlined' },
  unknown: { color: 'default', variant: 'outlined' }
};

export const statusTone = (s: Status): Tone =>
  ({ yes: 'bad', reported: 'warn', optional: 'mild', tos_only: 'neutral', no: 'good', unknown: 'unknown' })[s] as Tone;

export const vpnTone = (s: VpnStatus): Tone =>
  ({ block: 'bad', detect: 'warn', optional: 'mild', tos_only: 'neutral', no: 'good', unknown: 'unknown' })[s] as Tone;

export const forkTone = (f: ForkReady): Tone => ({ yes: 'good', stale: 'mild', partial: 'warn', no_code: 'neutral' })[f] as Tone;

export const levelTone = (l: Level): Tone =>
  ({ D: 'bad', C: 'warn', B: 'mild', A: 'good', 'A?': 'goodOutlined', '?': 'unknown' })[l] as Tone;

export const countryStatusTone = (s: CountryStatus): Tone =>
  ({ blocked: 'bad', close_only: 'warn', feature_limited: 'mild', regional: 'mild', tos_only: 'neutral', unknown: 'unknown', ok: 'good' })[
    s
  ] as Tone;

interface ToneChipProps extends Omit<ChipProps, 'color' | 'variant'> {
  tone: Tone;
  tooltip?: ReactNode;
}

export default function ToneChip({ tone, tooltip, size = 'small', sx, ...rest }: ToneChipProps) {
  const chip = (
    <Chip
      size={size}
      {...TONE_STYLE[tone]}
      sx={{
        fontWeight: 500,
        // WCAG AA contrast on the dark theme: the palette's error.main and success.dark are too dim for 13px chip text
        ...(tone === 'bad' && { color: (theme: Theme) => lighten(theme.palette.error.main, 0.2) }),
        ...(tone === 'goodOutlined' && { color: 'success.main', borderColor: 'success.main' }),
        ...(tone === 'unknown' && { color: 'text.secondary' }),
        ...sx
      }}
      {...rest}
    />
  );
  return tooltip ? (
    <Tooltip title={tooltip} arrow placement="top">
      <span style={{ display: 'inline-flex' }}>{chip}</span>
    </Tooltip>
  ) : (
    chip
  );
}
