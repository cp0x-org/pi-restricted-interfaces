import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Box, Button, Stack, Theme, useMediaQuery, useTheme } from '@mui/material';
import { useI18n } from 'i18n';

// Menu button styling as an object for reuse
const menuButtonStyle = (theme: Theme) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  fontSize: '15px',
  textTransform: 'none',
  padding: '6px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.main
  }
});

const MenuItems = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const { t, path } = useI18n();

  if (matchDownMd) return null;

  return (
    <Box component="nav" aria-label={t.layout.mainNav} sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
      <Stack direction="row" spacing={1}>
        {/* Internal link using RouterLink */}
        <Button component={RouterLink} to={path('/monitor')} sx={menuButtonStyle(theme)}>
          {t.layout.home}
        </Button>

        {/* External links using anchor tags */}
        <Button href="https://pi.cp0x.com" rel="noopener" sx={menuButtonStyle(theme)}>
          {t.layout.permissionless}
        </Button>

        <Button href="https://cp0x.com" target="_blank" rel="noopener noreferrer" sx={menuButtonStyle(theme)}>
          {t.layout.referrals}
        </Button>
      </Stack>
    </Box>
  );
};

export default MenuItems;
