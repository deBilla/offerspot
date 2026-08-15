import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdSenseProvider from '@/app/components/AdsenseProvider';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import HubContent from '@/app/components/HubContent';
import { isLocale, localeHtmlLang, localizedPath, type Locale } from '@/i18n/config';
import { getDictionary, translateBank } from '@/i18n/dictionaries';
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, ogImageUrl, ogTextLocale } from '@/lib/seo';
import { buildHubStats } from '@/lib/hub-stats';
import { homeHubCopy } from '@/i18n/hub-copy';
import { getOffersByMerchant, merchantRoutes } from '@/lib/merchants';
import { getActiveOffers } from '@/lib/offers';

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const imageDict = getDictionary(ogTextLocale(lang));
  return buildMetadata({
    locale: lang,
    path: '/merchants',
    title: dict.pages.merchantsTitle,
    description: dict.pages.merchantsDescription,
    image: ogImageUrl({
      title: imageDict.pages.merchantsTitle,
      subtitle: imageDict.tagline,
      locale: ogTextLocale(lang),
    }),
    imageAlt: dict.pages.merchantsTitle,
  });
}

export default async function MerchantsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const active = getActiveOffers();
  const routes = merchantRoutes(active);

  const crumbs = [
    { name: dict.breadcrumb.home, path: '/' },
    { name: dict.pages.merchantsTitle, path: '/merchants' },
  ];

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dict.pages.merchantsTitle,
    url: absoluteUrl(localizedPath(locale, '/merchants')),
    inLanguage: localeHtmlLang[locale],
    numberOfItems: routes.length,
    itemListElement: routes.map((route, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: route.merchant,
      url: absoluteUrl(localizedPath(locale, `/merchants/${route.slug}`)),
    })),
  };

  return (
    <>
      <AdSenseProvider />
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
      <main id="main-content" className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-5xl px-4 py-6 sm:py-10">
          <Breadcrumbs locale={locale} items={crumbs} />
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{dict.pages.merchantsTitle}</h1>
          <p className="mt-2 max-w-2xl leading-relaxed text-gray-600">{dict.pages.merchantsDescription}</p>

          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {routes.map((route) => {
              const banks = Array.from(
                new Set(getOffersByMerchant(route.merchant, active).map((offer) => offer.bank)),
              ).slice(0, 3);
              return (
                <li key={route.slug}>
                  <Link
                    href={localizedPath(locale, `/merchants/${route.slug}`)}
                    className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg"
                  >
                    <span className="text-lg font-bold text-gray-900">{route.merchant}</span>
                    <span className="mt-1 text-sm font-medium text-teal-700">
                      {dict.browse.offerCount(route.count)}
                    </span>
                    <span className="mt-3 flex flex-wrap gap-1.5">
                      {banks.map((bank) => (
                        <span key={bank} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-gray-600">
                          {translateBank(locale, bank)}
                        </span>
                      ))}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <HubContent locale={locale} copy={homeHubCopy(locale, buildHubStats(locale, active))} />
        </div>
      </main>
    </>
  );
}
