import { useState } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { CountryToken } from 'types/restrictions';
import { tokenLabel } from 'data/countries';
import { useI18n } from 'i18n';

interface CountryTokenChipsProps {
  tokens: CountryToken[];
  /** Collapse the list beyond this many chips. */
  max?: number;
}

export default function CountryTokenChips({ tokens, max = 12 }: CountryTokenChipsProps) {
  const { t, L } = useI18n();
  const [expanded, setExpanded] = useState(false);
  if (tokens.length === 0) return null;
  const shown = expanded ? tokens : tokens.slice(0, max);
  const hidden = tokens.length - shown.length;
  return (
    <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', rowGap: 0.5 }}>
      {shown.map((tok) => (
        <Chip key={tok} size="small" variant="outlined" color="default" label={tokenLabel(tok, t.intlLocale, L.REGION_LABELS)} />
      ))}
      {hidden > 0 && (
        <Chip size="small" variant="outlined" color="secondary" label={t.chips.more(hidden)} onClick={() => setExpanded(true)} />
      )}
      {expanded && tokens.length > max && (
        <Chip size="small" variant="outlined" color="secondary" label={t.chips.less} onClick={() => setExpanded(false)} />
      )}
    </Stack>
  );
}
