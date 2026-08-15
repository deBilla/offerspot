import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdSenseProvider from '@/app/components/AdsenseProvider';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import OfferBrowser from '@/app/components/OfferBrowser';
import OfferIndexList from '@/app/components/OfferIndexList';
import HubContent from '@/app/components/HubContent';
import { isLocale, localeHtmlLang, localizedPath, locales, type Locale } from '@/i18n/config';
import { getDictionary, translateBank } from '@/i18n/dictionaries';
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, ogImageUrl, ogTextLocale } from '@/lib/seo';
import { buildHubStats } from '@/lib/hub-stats';
import { merchantHubCopy } from '@/i18n/hub-copy';
import { getOffersByMerchant, merchantFromSlug, merchantRoutes } from '@/lib/merchants';
import { clamp, getActiveOffers, merchantName, sortOffers } from '@/lib/offers';

export const revalidate = 86400;

export function generateStaticParams() {
  return locales.flatMap((lang) => merchantRoutes().map((route) => ({ lang, merchant: route.slug })));
}

function bankList(locale: Locale, offers: ReturnType<typeof getOffersByMerchant>): string {
  return Array.from(new Set(offers.map((offer) => offer.bank)))
    .slice(0, 4)
    .map((bank) => translateBank(locale, bank))
    .join(', ');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; merchant: string }>;
}): Promise<Metadata> {
  const { lang, merchant } = await params;
  if (!isLocale(lang)) notFound();
  const route = merchantFromSlug(merchant);
  if (!route) return { title: getDictionary(lang).notFound.title, robots: { index: false, follow: false } };

  const dict = getDictionary(lang);
  const imageLocale = ogTextLocale(lang);
  const imageDict = getDictionary(imageLocale);
  const offers = getOffersByMerchant(route.merchant);
  const stats = buildHubStats(lang, offers);

  const title = `${dict.pages.merchantPageTitle(route.merchant)} — ${stats.monthYear}`;
  const description = clamp(
    dict.pages.merchantPageDescription({
      merchant: route.merchant,
      count: offers.length,
      banks: bankList(lang, offers),
    }),
    300,
  );

  return buildMetadata({
    locale: lang,
    path: `/merchants/${route.slug}`,
    title,
    description,
    image: ogImageUrl({
      title: imageDict.pages.merchantPageTitle(route.merchant),
      subtitle: imageDict.browse.offerCount(offers.length),
      locale: imageLocale,
    }),
    imageAlt: title,
  });
}

export default async function MerchantPage({
  params,
}: {
  params: Promise<{ lang: string; merchant: string }>;
}) {
  const { lang, merchant } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  // Merchants below the threshold get no page rather than a one-offer page.
  const route = merchantFromSlug(merchant);
  if (!route) notFound();

  const dict = getDictionary(locale);
  const offers = sortOffers(getOffersByMerchant(route.merchant, getActiveOffers()));

  const crumbs = [
    { name: dict.breadcrumb.home, path: '/' },
    { name: dict.pages.merchantsTitle, path: '/merchants' },
    { name: route.merchant, path: `/merchants/${route.slug}` },
  ];

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dict.pages.merchantPageTitle(route.merchant),
    url: absoluteUrl(localizedPath(locale, `/merchants/${route.slug}`)),
    inLanguage: localeHtmlLang[locale],
    numberOfItems: offers.length,
    itemListElement: offers.slice(0, 50).map((offer, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `${merchantName(locale, offer)} — ${offer.title}`,
      url: absoluteUrl(localizedPath(locale, `/offer/${offer.id}`)),
    })),
  };

  return (
    <>
      <AdSenseProvider />
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
      <main id="main-content" className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 pt-6">
          <Breadcrumbs locale={locale} items={crumbs} />
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {dict.pages.merchantPageTitle(route.merchant)}
          </h1>
          <p className="mt-2 max-w-3xl leading-relaxed text-gray-600">
            {dict.pages.merchantPageDescription({
              merchant: route.merchant,
              count: offers.length,
              banks: bankList(locale, offers),
            })}
          </p>
        </div>

        <OfferBrowser offers={offers} locale={locale} heading={dict.pages.merchantPageTitle(route.merchant)} />

        <div className="container mx-auto px-4 pb-12">
          <OfferIndexList offers={offers} locale={locale} heading={dict.pages.merchantPageTitle(route.merchant)} />
          <HubContent locale={locale} copy={merchantHubCopy(locale, route.merchant, buildHubStats(locale, offers))} />
        </div>
      </main>
    </>
  );
}
