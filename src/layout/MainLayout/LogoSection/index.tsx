import { Link as RouterLink } from 'react-router-dom';
import { ReactComponent as Cp0xLogo } from '@/assets/images/cp0x-logo.svg';
// material-ui
import Link from '@mui/material/Link';

// project imports
import { useI18n } from 'i18n';

// ==============================|| MAIN LOGO ||============================== //

export default function LogoSection() {
  const { t, path } = useI18n();
  return (
    <Link
      component={RouterLink}
      to={path('/monitor')}
      aria-label={t.layout.homeLogo}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        // gap: 1.5,
        textDecoration: 'none'
      }}
    >
      <Cp0xLogo style={{ width: 50, height: 30 }} />
    </Link>
  );
}
