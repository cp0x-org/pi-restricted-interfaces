import { ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SubCard from 'ui-component/cards/SubCard';
import { CountryToken } from 'types/restrictions';
import CountryTokenChips from './CountryTokenChips';
import { useI18n } from 'i18n';

export interface MechanismRow {
  label: string;
  value: ReactNode;
}

interface MechanismCardProps {
  title: string;
  chip: ReactNode;
  rows: MechanismRow[];
  countries?: { label: string; tokens: CountryToken[] }[];
}

export default function MechanismCard({ title, chip, rows, countries = [] }: MechanismCardProps) {
  const { t } = useI18n();
  const visibleRows = rows.filter((r) => r.value !== '' && r.value !== null && r.value !== undefined);
  const visibleCountries = countries.filter((c) => c.tokens.length > 0);
  return (
    <SubCard title={title} titleComponent="h2" secondary={chip} sx={{ height: '100%' }}>
      <Stack spacing={1.5}>
        {visibleRows.length === 0 && visibleCountries.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            {t.chips.nothing}
          </Typography>
        )}
        {visibleRows.map((r) => (
          <Stack key={r.label} spacing={0.25}>
            <Typography variant="caption" color="text.secondary">
              {r.label}
            </Typography>
            <Typography variant="body2" component="div" sx={{ wordBreak: 'break-word' }}>
              {r.value}
            </Typography>
          </Stack>
        ))}
        {visibleCountries.map((c) => (
          <Stack key={c.label} spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              {c.label} ({c.tokens.length})
            </Typography>
            <CountryTokenChips tokens={c.tokens} />
          </Stack>
        ))}
      </Stack>
    </SubCard>
  );
}
