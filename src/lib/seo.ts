import type { Metadata } from 'next';
import { defaultLocale, localeHtmlLang, localeOgLocale, locales, localizedPath, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.cardpromotions.org').replace(/\/$/, '');

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Canonical + hreflang set for a page. `path` is the prefix-free canonical path
 * (e.g. "/offer/abc"); every locale variant of it is advertised, plus
 * x-default pointing at the unprefixed English URL.
 */
export function alternatesFor(locale: Locale, path: string): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const candidate of locales) {
    languages[localeHtmlLang[candidate]] = absoluteUrl(localizedPath(candidate, path));
  }
  languages['x-default'] = absoluteUrl(localizedPath(defaultLocale, path));
  return {
    canonical: absoluteUrl(localizedPath(locale, path)),
    languages,
  };
}

/**
 * Which language the *text baked into the preview image* should use.
 *
 * Satori (the renderer behind next/og) has no complex-script shaping engine.
 * Tamil survives that, but Sinhala does not: two-part vowels are never
 * reordered (හොඳම renders as හෙොදම) and ZWJ conjuncts never form (ප්‍ර renders
 * as a detached mark above the consonant). Both produce text a Sinhala reader
 * sees as misspelled, so the Sinhala card is drawn with Latin text instead.
 *
 * This only affects pixels. og:title and og:description stay fully Sinhala —
 * social platforms render those as real text and shape them correctly.
 */
const imageTextLocale: Record<Locale, Locale> = { en: 'en', si: 'en', ta: 'ta' };

export function ogTextLocale(locale: Locale): Locale {
  return imageTextLocale[locale];
}

export interface OgImageParams {
  title: string;
  subtitle?: string;
  badge?: string;
  discount?: string;
  bank?: string;
  locale: Locale;
}

/** URL of the dynamically generated 1200x630 social preview image. */
export function ogImageUrl({ title, subtitle, badge, discount, bank, locale }: OgImageParams): string {
  const params = new URLSearchParams();
  params.set('title', title);
  if (subtitle) params.set('subtitle', subtitle);
  if (badge) params.set('badge', badge);
  if (discount) params.set('discount', discount);
  if (bank) params.set('bank', bank);
  params.set('lang', locale);
  return absoluteUrl(`/api/og?${params.toString()}`);
}

interface BuildMetadataArgs {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  /** Set for expired offers and other thin pages we do not want indexed. */
  noIndex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
  image,
  imageAlt,
  noIndex = false,
  type = 'website',
  publishedTime,
  modifiedTime,
}: BuildMetadataArgs): Metadata {
  const dict = getDictionary(locale);
  const url = absoluteUrl(localizedPath(locale, path));

  return {
    title,
    description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      title,
      description,
      url,
      siteName: dict.siteName,
      locale: localeOgLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeOgLocale[l]),
      type,
      ...(type === 'article' ? { publishedTime, modifiedTime } : {}),
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt, type: 'image/png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    ...(noIndex
      ? { robots: { index: false, follow: true, googleBot: { index: false, follow: true } } }
      : {}),
  };
}

/** JSON-LD BreadcrumbList. Items are given as prefix-free canonical paths. */
export function breadcrumbJsonLd(locale: Locale, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizedPath(locale, item.path)),
    })),
  };
}
