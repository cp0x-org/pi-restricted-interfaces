import { ReactNode, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

interface Slice {
  key: string;
  label: ReactNode;
  value: number;
  color: string;
  /** Plain-text name for the tooltip and the centre while the slice is active (defaults to a string label). */
  name?: string;
  /** One line under the legend label explaining the slice; repeated in the tooltip. */
  description?: ReactNode;
}

interface DonutChartProps {
  slices: Slice[];
  /** Big number in the middle (defaults to the sum of the slices). */
  center?: ReactNode;
  centerLabel?: ReactNode;
  /** Accessible summary of the chart; the legend repeats every value as text. */
  ariaLabel: string;
  size?: number;
}

const GROW = 6; // extra stroke width of the active slice, px

const pctOf = (value: number, total: number) => (total ? `${Math.round((value / total) * 100)}%` : '—');

/**
 * Dependency-free donut: one stroked circle per slice, legend with counts and shares beside it.
 * Hovering a slice or its legend row (or focusing the row) widens that slice, dims the others, shows a tooltip and
 * puts the slice's share in the middle.
 */
export default function DonutChart({ slices, center, centerLabel, ariaLabel, size = 168 }: DonutChartProps) {
  const theme = useTheme();
  const [active, setActive] = useState<string | null>(null);
  const total = slices.reduce((s, x) => s + x.value, 0);
  const thickness = Math.round(size * 0.16);
  const r = (size - thickness - GROW - 2) / 2;
  const circ = 2 * Math.PI * r;
  const visible = slices.filter((s) => s.value > 0);
  const gap = visible.length > 1 ? 2 : 0;
  const nameOf = (s: Slice) => s.name ?? (typeof s.label === 'string' ? s.label : s.key);
  const activeSlice = visible.find((s) => s.key === active);

  const hoverProps = (key: string) => ({
    onMouseEnter: () => setActive(key),
    onMouseLeave: () => setActive(null),
    onFocus: () => setActive(key),
    onBlur: () => setActive(null)
  });

  let offset = 0;
  const arcs = visible.map((s) => {
    const len = (s.value / total) * circ;
    const arc = { slice: s, dash: Math.max(len - gap, 0.5), offset };
    offset += len;
    return arc;
  });

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2.5, sm: 5 }} alignItems="center">
      <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={ariaLabel}>
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={alpha(theme.palette.text.secondary, 0.12)}
              strokeWidth={thickness}
            />
            {total > 0 &&
              arcs.map(({ slice: s, dash, offset: o }) => (
                <Tooltip
                  key={s.key}
                  followCursor
                  title={
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: 'inherit', fontWeight: 600 }}>
                        {s.value} · {pctOf(s.value, total)}
                      </Typography>
                      <Typography variant="caption" component="p" sx={{ color: 'inherit', opacity: 0.85 }}>
                        {nameOf(s)}
                      </Typography>
                      {s.description && (
                        <Typography variant="caption" component="p" sx={{ color: 'inherit', opacity: 0.85, maxWidth: 260 }}>
                          {s.description}
                        </Typography>
                      )}
                    </Box>
                  }
                >
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={active === s.key ? thickness + GROW : thickness}
                    strokeDasharray={`${dash} ${circ - dash}`}
                    strokeDashoffset={-o}
                    opacity={active && active !== s.key ? 0.5 : 1}
                    style={{ transition: 'stroke-width 120ms, opacity 120ms' }}
                    {...hoverProps(s.key)}
                  />
                </Tooltip>
              ))}
          </g>
        </svg>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            textAlign: 'center',
            px: `${thickness + 10}px`
          }}
        >
          <Typography variant="h3" component="p" sx={{ lineHeight: 1.1 }}>
            {activeSlice ? pctOf(activeSlice.value, total) : (center ?? total)}
          </Typography>
          {(activeSlice || centerLabel) && (
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
              {activeSlice ? nameOf(activeSlice) : centerLabel}
            </Typography>
          )}
        </Box>
      </Box>
      <Stack
        spacing={slices.some((s) => s.description) ? 0.75 : 0.25}
        sx={{ minWidth: 0, width: '100%' }}
        component="ul"
        style={{ listStyle: 'none', margin: 0, padding: 0 }}
      >
        {slices.map((s) => (
          <Box
            key={s.key}
            component="li"
            tabIndex={s.value > 0 ? 0 : undefined}
            {...(s.value > 0 ? hoverProps(s.key) : {})}
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: '6px',
              outline: 'none',
              transition: 'background-color 120ms, opacity 120ms',
              bgcolor: active === s.key ? alpha(theme.palette.text.primary, 0.06) : 'transparent',
              opacity: active && active !== s.key ? 0.6 : 1,
              '&:focus-visible': { boxShadow: `0 0 0 2px ${alpha(theme.palette.secondary.main, 0.6)}` }
            }}
          >
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: s.color, flexShrink: 0 }} />
              <Typography variant="body2" component="div" sx={{ flexGrow: 1, minWidth: 0 }}>
                {s.label}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                {s.value}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ minWidth: 36, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}
              >
                {pctOf(s.value, total)}
              </Typography>
            </Stack>
            {s.description && (
              <Typography variant="caption" color="text.secondary" component="p" sx={{ pl: '20px', mt: 0.25 }}>
                {s.description}
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
