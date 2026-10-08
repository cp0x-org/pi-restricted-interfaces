import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TranslateIcon from '@mui/icons-material/Translate';
import useConfig from 'hooks/useConfig';
import { LANGS, useI18n } from 'i18n';
import { HREFLANG, localizePath, stripLang } from 'i18n/paths';

/** EN / 中文 dropdown in the header: links to the same page in the other language; the choice is remembered for "/". */
export default function LanguageSwitcher() {
  const { lang, t } = useI18n();
  const { onChangeLocale } = useConfig();
  const { pathname, search, hash } = useLocation();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];
  const open = Boolean(anchor);

  return (
    <>
      <Button
        id="language-button"
        aria-label={`${t.layout.language}: ${current.label}`}
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={(e) => setAnchor(e.currentTarget)}
        color="inherit"
        variant="outlined"
        startIcon={<TranslateIcon sx={{ fontSize: 18 }} />}
        endIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
        sx={{
          textTransform: 'none',
          fontWeight: 500,
          minWidth: 0,
          px: 1.25,
          height: 40,
          borderRadius: '8px',
          borderColor: 'divider',
          color: 'text.primary',
          whiteSpace: 'nowrap',
          '& .MuiButton-startIcon': { mr: 0.5 },
          '& .MuiButton-endIcon': { ml: 0.25 }
        }}
      >
        {current.short}
      </Button>
      <Menu
        id="language-menu"
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ list: { 'aria-labelledby': 'language-button' } }}
      >
        {LANGS.map((l) => (
          <MenuItem
            key={l.code}
            component={RouterLink}
            to={localizePath(stripLang(pathname), l.code) + search + hash}
            hrefLang={HREFLANG[l.code]}
            lang={l.code === 'zh' ? 'zh-CN' : 'en'}
            selected={l.code === lang}
            onClick={() => {
              onChangeLocale(l.code);
              setAnchor(null);
            }}
          >
            <ListItemIcon sx={{ minWidth: 28 }}>{l.code === lang && <CheckIcon fontSize="small" />}</ListItemIcon>
            <ListItemText>{l.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
