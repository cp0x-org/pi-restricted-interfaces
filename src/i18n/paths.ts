// Language lives in the URL: English pages keep their unprefixed paths, Chinese pages are served under /zh.
// Pure helpers, shared by the app and the build-time prerender.
export type Lang = 'en' | 'zh';

export const LANGS_ALL: Lang[] = ['en', 'zh'];

/** hreflang values (BCP 47) for alternate links and sitemap entries. */
export const HREFLANG: Record<Lang, string> = { en: 'en', zh: 'zh-Hans' };

/** Open Graph locale values. */
export const OG_LOCALE: Record<Lang, string> = { en: 'en_US', zh: 'zh_CN' };

export const langFromPath = (pathname: string): Lang => (pathname === '/zh' || pathname.startsWith('/zh/') ? 'zh' : 'en');

/** '/zh/monitor/aave' -> '/monitor/aave'; English paths are returned unchanged. */
export const stripLang = (pathname: string): string => (langFromPath(pathname) === 'zh' ? pathname.slice(3) || '/' : pathname);

/** '/monitor' -> '/zh/monitor' for Chinese; '/' -> '/zh'. */
export const localizePath = (path: string, lang: Lang): string => (lang === 'zh' ? `/zh${path === '/' ? '' : path}` : path);
