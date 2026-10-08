import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { COUNTRY_OPTIONS, countryName, flagEmoji } from 'data/countries';

interface CountryPickerProps {
  value: string | null;
  onChange: (code: string | null) => void;
  autoFocus?: boolean;
}

export default function CountryPicker({ value, onChange, autoFocus = false }: CountryPickerProps) {
  return (
    <Autocomplete
      options={COUNTRY_OPTIONS}
      value={value}
      onChange={(_, v) => onChange(v)}
      getOptionLabel={(code) => `${flagEmoji(code)} ${countryName(code)}`}
      autoHighlight
      openOnFocus
      sx={{ minWidth: 280, maxWidth: 420 }}
      renderInput={(params) => <TextField {...params} label="Country" placeholder="Start typing a country" autoFocus={autoFocus} />}
    />
  );
}
