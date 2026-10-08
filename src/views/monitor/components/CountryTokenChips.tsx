import { useState } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { CountryToken } from 'types/restrictions';
import { tokenLabel } from 'data/countries';

interface CountryTokenChipsProps {
  tokens: CountryToken[];
  /** Collapse the list beyond this many chips. */
  max?: number;
}

export default function CountryTokenChips({ tokens, max = 12 }: CountryTokenChipsProps) {
  const [expanded, setExpanded] = useState(false);
  if (tokens.length === 0) return null;
  const shown = expanded ? tokens : tokens.slice(0, max);
  const hidden = tokens.length - shown.length;
  return (
    <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', rowGap: 0.5 }}>
      {shown.map((t) => (
        <Chip key={t} size="small" variant="outlined" color="default" label={tokenLabel(t)} />
      ))}
      {hidden > 0 && <Chip size="small" variant="outlined" color="secondary" label={`+${hidden} more`} onClick={() => setExpanded(true)} />}
      {expanded && tokens.length > max && (
        <Chip size="small" variant="outlined" color="secondary" label="show less" onClick={() => setExpanded(false)} />
      )}
    </Stack>
  );
}
