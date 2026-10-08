import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface FilterSelectProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T[];
  onChange: (value: T[]) => void;
  getLabel?: (option: T) => string;
}

/** Multi-select filter in the style of the catalog tables: MUI Autocomplete with chip tags. */
export default function FilterSelect<T extends string>({ label, options, value, onChange, getLabel }: FilterSelectProps<T>) {
  return (
    <Autocomplete
      multiple
      size="small"
      limitTags={2}
      options={options}
      value={value}
      onChange={(_, v) => onChange(v)}
      getOptionLabel={(o) => (getLabel ? getLabel(o) : o)}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
