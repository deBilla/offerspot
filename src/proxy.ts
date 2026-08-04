import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, isLocale } from '@/i18n/config';

/**
 * English is served without a URL prefix so every already-indexed URL
 * (/offer/po-cb-0001, /offers, …) keeps resolving unchanged. Internally those
 * requests are rewritten onto the /en branch of the [lang] segment; the address
 * bar and the canonical tag both stay prefix-free.
 *
 * We deliberately do NOT auto-redirect based on Accept-Language: that would
 * make a URL return different content to different crawlers and destabilise
 * the canonical/hreflang pairing. Visitors switch language from the navbar.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split('/')[1];

  if (isLocale(firstSegment)) {
    // A prefixed URL for the default locale duplicates the prefix-free one.
    // Redirect /en/... -> /... permanently so only one version can be indexed.
    if (firstSegment === defaultLocale) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.slice(`/${defaultLocale}`.length) || '/';
      return NextResponse.redirect(url, 308);
    }
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  /*
   * Run on page routes only. Everything with a file extension, the Next.js
   * internals, the OG image endpoint and the SEO files at the root are excluded
   * so they are never rewritten under a locale.
   */
  matcher: ['/((?!api|_next/static|_next/image|sitemap\\.xml|robots\\.txt|.*\\.[\\w]+$).*)'],
};
