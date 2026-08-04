import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdSenseProvider from '@/app/components/AdsenseProvider';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import OfferBrowser from '@/app/components/OfferBrowser';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { buildMetadata, ogImageUrl, ogTextLocale } from '@/lib/seo';
import { getActiveOffers, sortOffers } from '@/lib/offers';

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const imageDict = getDictionary(ogTextLocale(lang));
  return buildMetadata({
    locale: lang,
    path: '/search',
    title: dict.pages.searchTitle,
    description: dict.pages.searchDescription,
    image: ogImageUrl({
      title: imageDict.pages.searchTitle,
      subtitle: imageDict.tagline,
      locale: ogTextLocale(lang),
    }),
    imageAlt: dict.pages.searchTitle,
    // Internal search result pages are thin, endlessly variable duplicates of
    // the listing pages; Google's own guidance is to keep them out of the index.
    noIndex: true,
  });
}

export default async function SearchPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const offers = sortOffers(getActiveOffers());

  const crumbs = [
    { name: dict.breadcrumb.home, path: '/' },
    { name: dict.pages.searchTitle, path: '/search' },
  ];

  return (
    <>
      <AdSenseProvider />
      <main id="main-content" className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 pt-6">
          <Breadcrumbs locale={locale} items={crumbs} />
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{dict.pages.searchTitle}</h1>
          <p className="mt-2 max-w-2xl leading-relaxed text-gray-600">{dict.pages.searchDescription}</p>
        </div>
        <OfferBrowser offers={offers} locale={locale} heading={dict.browse.latestOffers} />
      </main>
    </>
  );
}
