import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { COUNTRY_OPTIONS, countryName, flagEmoji } from 'data/countries';

interface CountryPickerProps {
  value: string | null;
  onChange: (code: string | null) => void;
  autoFocus?: boolean;
  size?: 'small' | 'medium';
  /** Stretch to the parent width (filter grid) instead of the standalone 280–420px box. */
  fullWidth?: boolean;
  label?: string;
}

export default function CountryPicker({
  value,
  onChange,
  autoFocus = false,
  size = 'medium',
  fullWidth = false,
  label = 'Country'
}: CountryPickerProps) {
  return (
    <Autocomplete
      options={COUNTRY_OPTIONS}
      value={value}
      onChange={(_, v) => onChange(v)}
      getOptionLabel={(code) => `${flagEmoji(code)} ${countryName(code)}`}
      autoHighlight
      openOnFocus
      size={size}
      fullWidth={fullWidth}
      sx={fullWidth ? undefined : { minWidth: 280, maxWidth: 420 }}
      renderInput={(params) => <TextField {...params} label={label} placeholder="Start typing a country" autoFocus={autoFocus} />}
    />
  );
}
