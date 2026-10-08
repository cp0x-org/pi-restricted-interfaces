import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import { InterfaceEntry } from 'types/restrictions';
import { repoShortLabel } from 'utils/restrictions';
import { REPO_STATE_LABELS } from '../constants';

interface RepoLinkProps {
  entry: InterfaceEntry;
  /** Show the full owner/repo/subdir label instead of the state only. */
  full?: boolean;
}

export default function RepoLink({ entry, full = false }: RepoLinkProps) {
  const state = REPO_STATE_LABELS[entry.repo_state];
  if (!entry.frontend_repo) {
    return (
      <Tooltip title={entry.repo_status} arrow placement="top">
        <Typography variant="body2" color="text.secondary" component="span" sx={{ cursor: 'help' }}>
          {state}
        </Typography>
      </Tooltip>
    );
  }
  return (
    <Tooltip title={entry.repo_status} arrow placement="top">
      <Stack direction="row" spacing={0.5} alignItems="center" component="span" sx={{ display: 'inline-flex' }}>
        <GitHubIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Link
          href={entry.frontend_repo}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          variant="body2"
          onClick={(e) => e.stopPropagation()}
        >
          {full ? repoShortLabel(entry.frontend_repo) : state}
        </Link>
      </Stack>
    </Tooltip>
  );
}
