import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LaunchIcon from '@mui/icons-material/Launch';
import { InterfaceEntry } from 'types/restrictions';

/** Link(s) to our permissionless interface for this protocol (from pi.cp0x.com), or a dash. */
export default function PermissionlessLink({ entry }: { entry: InterfaceEntry }) {
  if (entry.alternatives.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" component="span">
        —
      </Typography>
    );
  }
  return (
    <Stack spacing={0.5} alignItems="flex-start">
      {entry.alternatives.map((a) => (
        <Chip
          key={a.url}
          component="a"
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          clickable
          size="small"
          color="primary"
          variant="filled"
          label={a.name}
          icon={<LaunchIcon />}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          sx={{
            fontWeight: 600,
            '& .MuiChip-icon': { fontSize: 14, order: 1, ml: -0.5, mr: 0.75 }
          }}
        />
      ))}
    </Stack>
  );
}
