import { Fragment, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { en, Labels, Messages } from './en';
import { zh } from './zh';
import { Lang, langFromPath, localizePath } from './paths';

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'zh', label: '中文', short: '中文' }
];

const CATALOGS: Record<Lang, Messages> = { en, zh };

/**
 * Current UI language and its strings. The language comes from the URL (/zh/... is Chinese, everything else English),
 * so every page has an indexable address per language; `path()` keeps internal links in the current language.
 */
export function useI18n(): { lang: Lang; t: Messages; L: Labels; path: (p: string) => string } {
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  const t = CATALOGS[lang];
  return { lang, t, L: t.labels, path: (p) => localizePath(p, lang) };
}

/** Renders `code` spans written with backticks inside a translated string. */
export function rich(text: string): ReactNode {
  return text
    .split(/(`[^`]+`)/)
    .map((part, i) =>
      part.startsWith('`') && part.endsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : <Fragment key={i}>{part}</Fragment>
    );
}

/** Picks the Chinese text when it exists and the UI is in Chinese. */
export const localized = (lang: Lang, base: string, zhText?: string): string => (lang === 'zh' && zhText ? zhText : base);
