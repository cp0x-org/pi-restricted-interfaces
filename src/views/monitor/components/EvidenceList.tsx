import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { EvidenceLink } from 'types/restrictions';

const mono = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13, wordBreak: 'break-all' as const };

export default function EvidenceList({ links }: { links: EvidenceLink[] }) {
  if (links.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No evidence recorded.
      </Typography>
    );
  }
  return (
    <List dense disablePadding>
      {links.map((l, n) => (
        <ListItem key={`${l.label}-${n}`} disableGutters sx={{ py: 0.25 }}>
          {l.href ? (
            <Link
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ ...mono, display: 'inline-flex', gap: 0.5 }}
            >
              {l.label}
              <OpenInNewIcon sx={{ fontSize: 14, mt: '2px' }} />
            </Link>
          ) : (
            <Typography component="span" sx={mono}>
              {l.label}
            </Typography>
          )}
        </ListItem>
      ))}
    </List>
  );
}
