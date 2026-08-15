/**
 * Locales that are built, linked, advertised in hreflang and served.
 *
 * Sinhala and Tamil were dropped in August 2026 after three months of Search
 * Console data: across 235 queries, not one was in Sinhala script, Tamil
 * script, or transliterated Sinhala, and the /si and /ta pages drew 1
 * impression between them against 3,507 for English. They were verified
 * indexable first — 200, index,follow, self-canonical, correct hreflang — so
 * that is absence of demand, not a crawl problem. It matches the market
 * reality that English dominates financial queries in Sri Lanka.
 *
 * The translations remain in dictionaries.ts and hub-copy.ts, and `Locale`
 * still spans all three, so restoring them is this one line. Anything that
 * varies by locale must therefore keep handling si and ta rather than assume
 * English.
 */
export const locales = ['en'] as const satisfies readonly SupportedLocale[];

/** Every locale the translations cover, whether or not it is currently built. */
export const allLocales = ['en', 'si', 'ta'] as const;

type SupportedLocale = (typeof allLocales)[number];

export type Locale = SupportedLocale;

export const defaultLocale: Locale = 'en';

/**
 * The default locale is served without a URL prefix so that every URL that is
 * already indexed (e.g. /offer/po-cb-0001) keeps working untouched. Sinhala and
 * Tamil live under /si and /ta.
 */
export const localePrefix: Record<Locale, string> = {
  en: '',
  si: '/si',
  ta: '/ta',
};

/** BCP-47 tags used for hreflang, <html lang> and Intl date formatting. */
export const localeHtmlLang: Record<Locale, string> = {
  en: 'en-LK',
  si: 'si-LK',
  ta: 'ta-LK',
};

/** OpenGraph locale tags. */
export const localeOgLocale: Record<Locale, string> = {
  en: 'en_US',
  si: 'si_LK',
  ta: 'ta_LK',
};

export const localeNames: Record<Locale, string> = {
  en: 'English',
  si: 'සිංහල',
  ta: 'தமிழ்',
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Coerce anything into a valid locale, falling back to the default. */
export function resolveLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

/**
 * Build a locale-aware href. `path` is always the canonical, prefix-free path
 * (e.g. "/offer/abc"); the locale prefix is added here and only here.
 */
export function localizedPath(locale: Locale, path = '/'): string {
  const clean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  const prefixed = `${localePrefix[locale]}${clean}`;
  return prefixed === '' ? '/' : prefixed;
}

/**
 * Strip a leading locale prefix from a pathname, returning the canonical path.
 * "/si/offer/abc" -> "/offer/abc", "/ta" -> "/".
 */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  const segments = pathname.split('/').filter(Boolean);
  if (isLocale(segments[0])) {
    const locale = segments[0];
    const rest = segments.slice(1).join('/');
    return { locale, path: rest ? `/${rest}` : '/' };
  }
  return { locale: defaultLocale, path: pathname || '/' };
}
