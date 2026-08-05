import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import MyOffers from '@/app/components/MyOffers';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getWalletCopy } from '@/i18n/wallet-copy';
import { buildMetadata, ogImageUrl, ogTextLocale } from '@/lib/seo';
import { getActiveOffers, sortOffers } from '@/lib/offers';

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = getWalletCopy(lang);
  const imageLocale = ogTextLocale(lang);
  return buildMetadata({
    locale: lang,
    path: '/my-offers',
    title: copy.myOffersTitle,
    description: copy.myOffersDescription,
    image: ogImageUrl({
      title: getWalletCopy(imageLocale).myOffersTitle,
      subtitle: getDictionary(imageLocale).siteName,
      locale: imageLocale,
    }),
    imageAlt: copy.myOffersTitle,
    // The result set is per-visitor and empty to a crawler.
    noIndex: true,
  });
}

export default async function MyOffersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const copy = getWalletCopy(locale);

  // The full live set is prerendered into the page; the filtering to the
  // visitor's own cards happens in the browser, so this stays static.
  const offers = sortOffers(getActiveOffers());

  const crumbs = [
    { name: dict.breadcrumb.home, path: '/' },
    { name: copy.myOffersTitle, path: '/my-offers' },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-4xl px-4 py-6 sm:py-10">
        <Breadcrumbs locale={locale} items={crumbs} />
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{copy.myOffersTitle}</h1>
        <p className="mt-2 max-w-2xl leading-relaxed text-gray-600">{copy.myOffersDescription}</p>

        <div className="mt-8">
          <MyOffers locale={locale} offers={offers} />
        </div>
      </div>
    </main>
  );
}
