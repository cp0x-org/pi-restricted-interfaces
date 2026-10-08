import { useEffect } from 'react';
import { OG_IMAGE_PATH, PageMeta, absoluteUrl, catalog, ogLocale } from './meta';

/** Public origin of the site (VITE_SITE_URL), falling back to the current origin in the browser. */
export const siteUrl = (): string => (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/+$/, '');

function upsert(selector: string, create: () => HTMLElement, set: (el: HTMLElement) => void) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  set(el);
}

const metaTag = (attr: 'name' | 'property', key: string, content: string) =>
  upsert(
    `meta[${attr}="${key}"]`,
    () => {
      const m = document.createElement('meta');
      m.setAttribute(attr, key);
      return m;
    },
    (el) => el.setAttribute('content', content)
  );

/**
 * Keeps <head> in sync with the current page during client-side navigation: title, description, canonical, hreflang
 * alternates, robots, Open Graph / Twitter tags and JSON-LD. The same values are prerendered into the static HTML.
 */
export function usePageMeta(m: PageMeta) {
  const ld = m.jsonLd ? JSON.stringify(m.jsonLd) : '';
  const alts = JSON.stringify(m.alternates);
  useEffect(() => {
    const origin = siteUrl();
    const indexable = Boolean(m.path && !m.noindex);
    document.title = m.title;
    metaTag('name', 'description', m.description);
    metaTag('name', 'robots', m.noindex ? 'noindex,follow' : 'index,follow');
    metaTag('property', 'og:title', m.title);
    metaTag('property', 'og:description', m.description);
    metaTag('property', 'og:type', m.type ?? 'website');
    metaTag('property', 'og:site_name', catalog(m.lang).seo.ogSiteName);
    metaTag('property', 'og:locale', ogLocale(m.lang));
    metaTag('property', 'og:image', absoluteUrl(origin, OG_IMAGE_PATH));
    metaTag('name', 'twitter:title', m.title);
    metaTag('name', 'twitter:description', m.description);

    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (indexable) {
      metaTag('property', 'og:url', absoluteUrl(origin, m.path));
      upsert(
        'link[rel="canonical"]',
        () => {
          const l = document.createElement('link');
          l.setAttribute('rel', 'canonical');
          return l;
        },
        (el) => el.setAttribute('href', absoluteUrl(origin, m.path))
      );
    } else {
      canonical?.remove();
    }

    // hreflang alternates: replace the whole set so stale languages never linger after navigation
    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    if (indexable) {
      for (const a of m.alternates) {
        const l = document.createElement('link');
        l.setAttribute('rel', 'alternate');
        l.setAttribute('hreflang', a.hreflang);
        l.setAttribute('href', absoluteUrl(origin, a.path));
        document.head.appendChild(l);
      }
    }

    const old = document.head.querySelector('script[type="application/ld+json"]');
    if (ld) {
      upsert(
        'script[type="application/ld+json"]',
        () => {
          const s = document.createElement('script');
          s.setAttribute('type', 'application/ld+json');
          return s;
        },
        (el) => (el.textContent = ld)
      );
    } else {
      old?.remove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- alternates/jsonLd are compared by their serialized form
  }, [m.lang, m.title, m.description, m.path, m.noindex, m.type, ld, alts]);
}
