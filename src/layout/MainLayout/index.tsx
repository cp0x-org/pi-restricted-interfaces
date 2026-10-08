import { useEffect } from 'react';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
import Footer from './Footer';
import Header from './Header';
import MainContentStyled from './MainContentStyled';
import Loader from 'ui-component/Loader';

import { MenuOrientation, ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import Tabs from '@mui/material/Tabs';
import Tab, { TabProps } from '@mui/material/Tab';
import MainCard from '../../ui-component/cards/MainCard';
import { SHOW_COUNTRY_PAGE } from 'views/monitor/constants';
import { useI18n } from 'i18n';

// ==============================|| MAIN LAYOUT ||============================== //

// icon tab style
const AntTabs = styled(Tabs)(({ theme }) => ({
  background: theme.palette.mode === ThemeMode.DARK ? theme.palette.dark[800] : theme.palette.primary.light,
  width: 'fit-content',
  borderBottom: 'none', // убираем бордер
  '& .MuiTabs-flexContainer': {
    border: '1px solid',
    borderRadius: '12px',
    borderColor: '#3F3F3F',
    height: '61px'
  },
  '& .MuiTabs-scroller': {
    borderBottom: 'none'
  },
  borderRadius: '12px',
  boxShadow: 'none',
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.secondary.main,
    height: 0 // скрываем индикатор активного таба
  }
}));

// style constant
// Tabs are real links (crawlable, open in a new tab, announce aria-current) styled as the original tab bar.
const AntTab = styled((props: TabProps<typeof RouterLink>) => <Tab disableRipple component={RouterLink} {...props} />)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  fontWeight: theme.typography.fontWeightRegular,
  fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  // fontWeight: 500, // Medium
  fontSize: '16px',
  color: theme.palette.grey[100],
  '&.MuiTab-root': {
    borderRight: '1px solid #3F3F3F',
    borderColor: '#3F3F3F',
    minWidth: '125px'
  },
  '&:hover': {
    color: theme.palette.grey[500],
    opacity: 1
  },
  '&.Mui-selected': {
    color: theme.palette.background.default,
    backgroundColor: theme.palette.secondary.main,
    fontWeight: theme.typography.fontWeightMedium
  },
  '&.Mui-focusVisible': {
    backgroundColor: theme.palette.secondary.main
  }
}));
export default function MainLayout() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const { borderRadius, container, miniDrawer, menuOrientation, i18n, onChangeLocale } = useConfig();
  const { menuMaster, menuMasterLoading } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;

  // Paths must not be substrings of each other: the active tab is matched with pathname.includes().
  const { lang, t, path } = useI18n();
  const location = useLocation();
  const tabs = [
    { label: t.layout.tabs.monitor, path: 'monitor', iconPosition: 'top' },
    ...(SHOW_COUNTRY_PAGE ? [{ label: t.layout.tabs.country, path: 'country', iconPosition: 'top' }] : []),
    { label: t.layout.tabs.methodology, path: 'methodology', iconPosition: 'top' }
  ];

  // Keep <html lang> in sync with the UI language (screen readers, hyphenation, CJK font selection).
  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
  }, [t.htmlLang]);

  // Remember the language of the page being viewed: "/" redirects to it and RainbowKit follows it.
  useEffect(() => {
    if (location.pathname !== '/' && i18n !== lang) onChangeLocale(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, location.pathname]);

  const currentTabIndex = tabs.findIndex((tab) => location.pathname.includes(tab.path));

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    handlerDrawerOpen(!miniDrawer);
  }, [miniDrawer]);

  useEffect(() => {
    downMD && handlerDrawerOpen(false);
  }, [downMD]);

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD;

  if (menuMasterLoading) return <Loader />;

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'absolute',
          left: 8,
          top: -48,
          zIndex: (t) => t.zIndex.appBar + 1,
          px: 2,
          py: 1,
          borderRadius: 1,
          bgcolor: 'primary.main',
          color: 'background.default',
          fontWeight: 600,
          '&:focus': { top: 8 }
        }}
      >
        {t.layout.skip}
      </Box>
      {/* header */}
      <AppBar enableColorOnDark position="fixed" color="inherit" elevation={0} sx={{ bgcolor: 'background.default' }}>
        <Toolbar sx={{ p: isHorizontal ? 1.25 : 2 }}>
          <Header />
        </Toolbar>
      </AppBar>

      {/* main content */}
      <MainContentStyled {...{ borderRadius, menuOrientation, open: drawerOpen, marginTop: 80 }}>
        <Container
          maxWidth={'lg'}
          sx={{
            ...(!container && { px: { xs: 0 } }),
            minHeight: 'calc(100vh - 228px)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <MainCard>
            <AntTabs value={currentTabIndex === -1 ? false : currentTabIndex} centered role="navigation" aria-label={t.layout.sections}>
              {tabs.map((tab, index) => (
                <AntTab
                  wrapped={true}
                  key={tab.path}
                  label={tab.label}
                  to={path(`/${tab.path}`)}
                  aria-current={currentTabIndex === index ? 'page' : undefined}
                />
              ))}
            </AntTabs>
            <Box id="main-content" tabIndex={-1} sx={{ pt: 3, outline: 'none' }}>
              <Outlet />
            </Box>
          </MainCard>
        </Container>
        {/* footer */}
        <Footer />
      </MainContentStyled>
    </Box>
  );
}
