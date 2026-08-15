import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdSenseProvider from '@/app/components/AdsenseProvider';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import OfferBrowser from '@/app/components/OfferBrowser';
import OfferIndexList from '@/app/components/OfferIndexList';
import HubContent from '@/app/components/HubContent';
import { isLocale, localeHtmlLang, localizedPath, locales, type Locale } from '@/i18n/config';
import { getDictionary, translateCategory } from '@/i18n/dictionaries';
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, ogImageUrl, ogTextLocale } from '@/lib/seo';
import { buildHubStats } from '@/lib/hub-stats';
import { locationHubCopy } from '@/i18n/hub-copy';
import { getOffersByTown, townFromSlug, townRoutes } from '@/lib/locations';
import { clamp, getActiveOffers, merchantName, sortOffers } from '@/lib/offers';

export const revalidate = 86400;

export function generateStaticParams() {
  return locales.flatMap((lang) => townRoutes().map((route) => ({ lang, town: route.slug })));
}

/** Categories present in a town's offers, most common first. */
function townCategories(locale: Locale, offers: ReturnType<typeof getOffersByTown>): string[] {
  const counts = new Map<string, number>();
  for (const offer of offers) counts.set(offer.category, (counts.get(offer.category) ?? 0) + 1);
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([category]) => translateCategory(locale, category));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; town: string }>;
}): Promise<Metadata> {
  const { lang, town } = await params;
  if (!isLocale(lang)) notFound();
  const route = townFromSlug(town);
  if (!route) return { title: getDictionary(lang).notFound.title, robots: { index: false, follow: false } };

  const dict = getDictionary(lang);
  const imageLocale = ogTextLocale(lang);
  const imageDict = getDictionary(imageLocale);
  const offers = getOffersByTown(route.town);
  const stats = buildHubStats(lang, offers);

  const title = `${dict.pages.locationPageTitle(route.town)} — ${stats.monthYear}`;
  const description = clamp(
    dict.pages.locationPageDescription({
      town: route.town,
      count: offers.length,
      categories: townCategories(lang, offers).join(', '),
    }),
    300,
  );

  return buildMetadata({
    locale: lang,
    path: `/locations/${route.slug}`,
    title,
    description,
    image: ogImageUrl({
      title: imageDict.pages.locationPageTitle(route.town),
      subtitle: imageDict.browse.offerCount(offers.length),
      locale: imageLocale,
    }),
    imageAlt: title,
  });
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ lang: string; town: string }>;
}) {
  const { lang, town } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  // Towns below the offer threshold have no page rather than a thin one, so an
  // unknown slug is a real 404.
  const route = townFromSlug(town);
  if (!route) notFound();

  const dict = getDictionary(locale);
  const offers = sortOffers(getOffersByTown(route.town, getActiveOffers()));
  const categories = townCategories(locale, offers);

  const crumbs = [
    { name: dict.breadcrumb.home, path: '/' },
    { name: dict.pages.locationsTitle, path: '/locations' },
    { name: route.town, path: `/locations/${route.slug}` },
  ];

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dict.pages.locationPageTitle(route.town),
    url: absoluteUrl(localizedPath(locale, `/locations/${route.slug}`)),
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
            {dict.pages.locationPageTitle(route.town)}
          </h1>
          <p className="mt-2 max-w-3xl leading-relaxed text-gray-600">
            {dict.pages.locationPageDescription({
              town: route.town,
              count: offers.length,
              categories: categories.join(', '),
            })}
          </p>
        </div>

        <OfferBrowser offers={offers} locale={locale} heading={dict.pages.locationPageTitle(route.town)} />

        <div className="container mx-auto px-4 pb-12">
          <OfferIndexList
            offers={offers}
            locale={locale}
            heading={dict.pages.locationPageTitle(route.town)}
          />
          <HubContent
            locale={locale}
            copy={locationHubCopy(locale, route.town, buildHubStats(locale, offers), categories)}
          />
        </div>
      </main>
    </>
  );
}
