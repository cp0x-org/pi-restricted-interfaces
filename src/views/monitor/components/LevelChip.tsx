import { Level } from 'types/restrictions';
import ToneChip, { levelTone } from './ToneChip';
import { LEVEL_DESCRIPTIONS, LEVEL_LABELS } from '../constants';

interface LevelChipProps {
  level: Level;
  size?: 'small' | 'medium';
  withTooltip?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export default function LevelChip({ level, size = 'small', withTooltip = true, onClick, selected }: LevelChipProps) {
  return (
    <ToneChip
      tone={levelTone(level)}
      label={LEVEL_LABELS[level]}
      size={size}
      tooltip={withTooltip ? LEVEL_DESCRIPTIONS[level] : undefined}
      onClick={onClick}
      sx={{ fontWeight: 700, minWidth: 36, ...(selected && { outline: '2px solid', outlineColor: 'secondary.main' }) }}
    />
  );
}
