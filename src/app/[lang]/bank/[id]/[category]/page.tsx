import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdSenseProvider from '@/app/components/AdsenseProvider';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import OfferBrowser from '@/app/components/OfferBrowser';
import OfferIndexList from '@/app/components/OfferIndexList';
import HubContent from '@/app/components/HubContent';
import { isLocale, localeHtmlLang, localizedPath, locales, type Locale } from '@/i18n/config';
import { getDictionary, translateBank, translateCategory } from '@/i18n/dictionaries';
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, ogImageUrl, ogTextLocale } from '@/lib/seo';
import { buildHubStats } from '@/lib/hub-stats';
import { bankCategoryHubCopy } from '@/i18n/hub-copy';
import { bankCategoryRoute, bankCategoryRoutes, getOffersByBankAndCategory } from '@/lib/hub-routes';
import { clamp, getActiveOffers, merchantName, sortOffers } from '@/lib/offers';

/**
 * "HSBC dining offers", "People's Bank travel offers" — the intersection people
 * actually search, sitting between the bank hub and the category hub.
 *
 * Only intersections with enough offers to beat both parents exist as URLs; see
 * the thresholds in lib/hub-routes.ts. Anything else 404s rather than becoming
 * a thin page, so the route set grows with the feed instead of with the number
 * of possible permutations.
 */

export const revalidate = 86400;

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    bankCategoryRoutes().map((route) => ({ lang, id: route.bankSlug, category: route.categorySlug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string; category: string }>;
}): Promise<Metadata> {
  const { lang, id, category } = await params;
  if (!isLocale(lang)) notFound();
  const route = bankCategoryRoute(id, category);
  if (!route) return { title: getDictionary(lang).notFound.title, robots: { index: false, follow: false } };

  const dict = getDictionary(lang);
  const imageLocale = ogTextLocale(lang);
  const imageDict = getDictionary(imageLocale);
  const offers = getOffersByBankAndCategory(route.bank, route.category);
  const bankLabel = translateBank(lang, route.bank);
  const categoryLabel = translateCategory(lang, route.category);

  const stats = buildHubStats(lang, offers);
  const title = `${dict.pages.bankCategoryPageTitle({ bank: bankLabel, category: categoryLabel })} — ${stats.monthYear}`;

  return buildMetadata({
    locale: lang,
    path: `/bank/${route.bankSlug}/${route.categorySlug}`,
    title,
    description: clamp(
      dict.pages.bankCategoryPageDescription({
        bank: bankLabel,
        category: categoryLabel,
        count: offers.length,
      }),
      300,
    ),
    image: ogImageUrl({
      title: imageDict.pages.bankCategoryPageTitle({
        bank: translateBank(imageLocale, route.bank),
        category: translateCategory(imageLocale, route.category),
      }),
      subtitle: imageDict.browse.offerCount(offers.length),
      badge: translateCategory(imageLocale, route.category),
      bank: route.bank,
      locale: imageLocale,
    }),
    imageAlt: title,
  });
}

export default async function BankCategoryPage({
  params,
}: {
  params: Promise<{ lang: string; id: string; category: string }>;
}) {
  const { lang, id, category } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  const route = bankCategoryRoute(id, category);
  if (!route) notFound();

  const dict = getDictionary(locale);
  const offers = sortOffers(getOffersByBankAndCategory(route.bank, route.category, getActiveOffers()));
  const bankLabel = translateBank(locale, route.bank);
  const categoryLabel = translateCategory(locale, route.category);
  const heading = dict.pages.bankCategoryPageTitle({ bank: bankLabel, category: categoryLabel });

  const crumbs = [
    { name: dict.breadcrumb.home, path: '/' },
    { name: dict.breadcrumb.banks, path: '/banks' },
    { name: bankLabel, path: `/bank/${route.bankSlug}` },
    { name: categoryLabel, path: `/bank/${route.bankSlug}/${route.categorySlug}` },
  ];

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: heading,
    url: absoluteUrl(localizedPath(locale, `/bank/${route.bankSlug}/${route.categorySlug}`)),
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
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{heading}</h1>
          <p className="mt-2 max-w-3xl leading-relaxed text-gray-600">
            {dict.pages.bankCategoryPageDescription({
              bank: bankLabel,
              category: categoryLabel,
              count: offers.length,
            })}
          </p>
        </div>

        <OfferBrowser offers={offers} locale={locale} heading={heading} />

        <div className="container mx-auto px-4 pb-12">
          <OfferIndexList offers={offers} locale={locale} heading={heading} />
          <HubContent
            locale={locale}
            copy={bankCategoryHubCopy(locale, bankLabel, categoryLabel, buildHubStats(locale, offers))}
          />
        </div>
      </main>
    </>
  );
}
