import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdSenseProvider from '@/app/components/AdsenseProvider';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import HubContent from '@/app/components/HubContent';
import { isLocale, localeHtmlLang, localizedPath, type Locale } from '@/i18n/config';
import { getDictionary, translateBank, translateCategory } from '@/i18n/dictionaries';
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, ogImageUrl, ogTextLocale } from '@/lib/seo';
import { buildHubStats } from '@/lib/hub-stats';
import { homeHubCopy } from '@/i18n/hub-copy';
import { allCategories, getActiveOffers, getOffersByCategory, slugify } from '@/lib/offers';

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const imageDict = getDictionary(ogTextLocale(lang));
  return buildMetadata({
    locale: lang,
    path: '/categories',
    title: dict.pages.categoriesTitle,
    description: dict.pages.categoriesDescription,
    image: ogImageUrl({
      title: imageDict.pages.categoriesTitle,
      subtitle: imageDict.tagline,
      locale: ogTextLocale(lang),
    }),
    imageAlt: dict.pages.categoriesTitle,
  });
}

export default async function CategoriesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const active = getActiveOffers();

  const categories = allCategories
    .map((category) => {
      const offers = getOffersByCategory(category, active);
      const banks = Array.from(new Set(offers.map((offer) => offer.bank))).slice(0, 3);
      return { category, count: offers.length, banks };
    })
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count);

  const crumbs = [
    { name: dict.breadcrumb.home, path: '/' },
    { name: dict.breadcrumb.categories, path: '/categories' },
  ];

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dict.pages.categoriesTitle,
    url: absoluteUrl(localizedPath(locale, '/categories')),
    inLanguage: localeHtmlLang[locale],
    numberOfItems: categories.length,
    itemListElement: categories.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: translateCategory(locale, entry.category),
      url: absoluteUrl(localizedPath(locale, `/categories/${slugify(entry.category)}`)),
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
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{dict.pages.categoriesTitle}</h1>
          <p className="mt-2 max-w-2xl leading-relaxed text-gray-600">{dict.pages.categoriesDescription}</p>

          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ category, count, banks }) => (
              <li key={category}>
                <Link
                  href={localizedPath(locale, `/categories/${slugify(category)}`)}
                  className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg"
                >
                  <span className="text-lg font-bold text-gray-900">{translateCategory(locale, category)}</span>
                  <span className="mt-1 text-sm font-medium text-teal-700">{dict.browse.offerCount(count)}</span>
                  <span className="mt-3 flex flex-wrap gap-1.5">
                    {banks.map((bank) => (
                      <span key={bank} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-gray-600">
                        {translateBank(locale, bank)}
                      </span>
                    ))}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <HubContent locale={locale} copy={homeHubCopy(locale, buildHubStats(locale, active))} />
        </div>
      </main>
    </>
  );
}
