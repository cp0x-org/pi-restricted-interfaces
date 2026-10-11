import { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

interface BarSegment {
  value: number;
  color: string;
  label: string;
}

interface BarRow {
  key: string;
  label: ReactNode;
  /** Solid segments drawn left to right (e.g. site-level, then feature-level). */
  segments: BarSegment[];
  /** Optional outline marker drawn behind the segments (e.g. how many Terms of Service name it). */
  ghost?: number;
  /** Text at the end of the row. */
  value: ReactNode;
  /** Internal link for the label. */
  to?: string;
}

interface BarListProps {
  rows: BarRow[];
  /** Scale; defaults to the largest bar or ghost. */
  max?: number;
  ariaLabel: string;
  labelWidth?: number;
}

/** Horizontal bars with a fixed label column; every number is also printed as text. */
export default function BarList({ rows, max, ariaLabel, labelWidth = 150 }: BarListProps) {
  const theme = useTheme();
  const scale =
    max ??
    Math.max(
      1,
      ...rows.map((r) =>
        Math.max(
          r.ghost ?? 0,
          r.segments.reduce((s, x) => s + x.value, 0)
        )
      )
    );
  return (
    <Box component="ul" aria-label={ariaLabel} sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', rowGap: 1 }}>
      {rows.map((r) => {
        const sum = r.segments.reduce((s, x) => s + x.value, 0);
        return (
          <Box
            component="li"
            key={r.key}
            sx={{
              display: 'grid',
              // Narrower label column on phones so the bar keeps most of the width.
              gridTemplateColumns: { xs: `${Math.min(labelWidth, 116)}px 1fr auto`, sm: `${labelWidth}px 1fr auto` },
              columnGap: { xs: 1, sm: 1.5 },
              alignItems: 'center'
            }}
          >
            <Typography variant="body2" noWrap title={typeof r.label === 'string' ? r.label : undefined}>
              {r.to ? (
                <Link component={RouterLink} to={r.to} underline="hover" color="inherit">
                  {r.label}
                </Link>
              ) : (
                r.label
              )}
            </Typography>
            <Box
              sx={{ position: 'relative', height: 12, borderRadius: 6, bgcolor: alpha(theme.palette.text.secondary, 0.08) }}
              title={r.segments.map((s) => `${s.label}: ${s.value}`).join(' · ')}
            >
              {r.ghost !== undefined && r.ghost > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    width: `${(r.ghost / scale) * 100}%`,
                    borderRadius: 6,
                    border: `1px dashed ${alpha(theme.palette.text.secondary, 0.55)}`
                  }}
                />
              )}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  width: `${(sum / scale) * 100}%`,
                  borderRadius: 6,
                  overflow: 'hidden'
                }}
              >
                {r.segments
                  .filter((s) => s.value > 0)
                  .map((s) => (
                    <Box key={s.label} sx={{ width: `${(s.value / Math.max(sum, 1)) * 100}%`, bgcolor: s.color }} />
                  ))}
              </Box>
            </Box>
            <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', minWidth: 28, textAlign: 'right' }}>
              {r.value}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
