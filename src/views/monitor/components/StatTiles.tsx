import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { interfaces, levelCounts, openSourceCount, permissionlessCount } from 'data/dataset';
import { LEVELS, Level } from 'types/restrictions';
import LevelChip from './LevelChip';
import { useI18n } from 'i18n';
import BrandText from 'ui-component/BrandText';

interface StatTilesProps {
  activeLevels?: Level[];
  onLevelClick?: (level: Level) => void;
}

function Tile({ value, label, accent = false }: { value: number; label: string; accent?: boolean }) {
  const theme = useTheme();
  return (
    <Stack spacing={0.5}>
      <Typography variant="h4" component="p" sx={accent ? { color: 'primary.main' } : undefined}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: theme.palette.grey[500] }}>
        <BrandText text={label} />
      </Typography>
    </Stack>
  );
}

export default function StatTiles({ activeLevels = [], onLevelClick }: StatTilesProps) {
  const { t } = useI18n();
  return (
    <Paper sx={{ p: 2.5, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 6, md: 'auto' }} sx={{ pr: { md: 2 } }}>
          <Tile value={interfaces.length} label={t.tiles.interfaces} />
        </Grid>
        <Grid size={{ xs: 6, md: 'auto' }} sx={{ pr: { md: 2 } }}>
          <Tile value={openSourceCount} label={t.tiles.open} />
        </Grid>
        <Grid size={{ xs: 6, md: 'auto' }} sx={{ pr: { md: 2 } }}>
          <Tile value={interfaces.length - openSourceCount} label={t.tiles.closed} />
        </Grid>
        <Grid size={{ xs: 6, md: 'auto' }} sx={{ pr: { md: 2 } }}>
          <Tile value={permissionlessCount} label={t.tiles.permissionless} accent />
        </Grid>
        <Grid size={{ xs: 12, md: 'grow' }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1, justifyContent: { md: 'flex-end' } }} alignItems="center">
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
