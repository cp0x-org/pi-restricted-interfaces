import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { alpha, useTheme } from '@mui/material/styles';

interface ShareSegment {
  key: string;
  label: string;
  value: number;
  color: string;
}

/** A 100% bar split into segments (rating mix of a category, states of a mechanism); hover shows each value. */
export default function ShareBar({ segments, height = 12, ariaLabel }: { segments: ShareSegment[]; height?: number; ariaLabel: string }) {
  const theme = useTheme();
  const total = segments.reduce((s, x) => s + x.value, 0);
  return (
    <Box
      role="img"
      aria-label={ariaLabel}
      sx={{
        display: 'flex',
        height,
        borderRadius: height / 2,
        overflow: 'hidden',
        bgcolor: alpha(theme.palette.text.secondary, 0.08),
        minWidth: 80
      }}
    >
      {total > 0 &&
        segments
          .filter((s) => s.value > 0)
          .map((s) => (
            <Tooltip key={s.key} title={`${s.label}: ${s.value} (${Math.round((s.value / total) * 100)}%)`} arrow placement="top">
              <Box
                sx={{
                  width: `${(s.value / total) * 100}%`,
                  bgcolor: s.color,
                  '& + &': { borderLeft: `2px solid ${theme.palette.background.paper}` }
                }}
              />
            </Tooltip>
          ))}
    </Box>
  );
}
