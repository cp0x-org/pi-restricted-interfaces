import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { interfaces, levelCounts, openSourceCount } from 'data/dataset';
import { LEVELS, Level } from 'types/restrictions';
import LevelChip from './LevelChip';

interface StatTilesProps {
  activeLevels?: Level[];
  onLevelClick?: (level: Level) => void;
}

function Tile({ value, label }: { value: number; label: string }) {
  const theme = useTheme();
  return (
    <Stack spacing={0.5}>
      <Typography variant="h4">{value}</Typography>
      <Typography variant="body2" sx={{ color: theme.palette.grey[500] }}>
        {label}
      </Typography>
    </Stack>
  );
}

export default function StatTiles({ activeLevels = [], onLevelClick }: StatTilesProps) {
  return (
    <Paper sx={{ p: 2.5, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 4, md: 2 }}>
          <Tile value={interfaces.length} label="Interfaces" />
        </Grid>
        <Grid size={{ xs: 4, md: 2 }}>
          <Tile value={openSourceCount} label="Open frontend" />
        </Grid>
        <Grid size={{ xs: 4, md: 2 }}>
          <Tile value={interfaces.length - openSourceCount} label="Closed frontend" />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }} alignItems="center">
            {LEVELS.map((level) => (
              <Stack key={level} direction="row" spacing={0.5} alignItems="center">
                <LevelChip
                  level={level}
                  onClick={onLevelClick ? () => onLevelClick(level) : undefined}
                  selected={activeLevels.includes(level)}
                />
                <Typography variant="body2" sx={{ minWidth: 20 }}>
                  {levelCounts[level]}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}
