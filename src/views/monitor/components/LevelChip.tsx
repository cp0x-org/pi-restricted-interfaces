import { Level } from 'types/restrictions';
import { useI18n } from 'i18n';
import ToneChip, { levelTone } from './ToneChip';

interface LevelChipProps {
  level: Level;
  size?: 'small' | 'medium';
  withTooltip?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export default function LevelChip({ level, size = 'small', withTooltip = true, onClick, selected }: LevelChipProps) {
  const { L } = useI18n();
  return (
    <ToneChip
      tone={levelTone(level)}
      label={L.LEVEL_LABELS[level]}
      size={size}
      tooltip={withTooltip ? L.LEVEL_DESCRIPTIONS[level] : undefined}
      onClick={onClick}
      sx={{ fontWeight: 700, minWidth: 36, ...(selected && { outline: '2px solid', outlineColor: 'secondary.main' }) }}
    />
  );
}
