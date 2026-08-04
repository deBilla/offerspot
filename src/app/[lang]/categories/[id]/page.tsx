import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdSenseProvider from '@/app/components/AdsenseProvider';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import OfferBrowser from '@/app/components/OfferBrowser';
import OfferIndexList from '@/app/components/OfferIndexList';
import { isLocale, localeHtmlLang, localizedPath, locales, type Locale } from '@/i18n/config';
import { getDictionary, translateBank, translateCategory } from '@/i18n/dictionaries';
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, ogImageUrl, ogTextLocale } from '@/lib/seo';
import {
  categoryFromSlug,
  categorySlugList,
  clamp,
  getActiveOffers,
  getOffersByCategory,
  merchantName,
  sortOffers,
} from '@/lib/offers';

export const revalidate = 86400;

export function generateStaticParams() {
  return locales.flatMap((lang) => categorySlugList.map((id) => ({ lang, id })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const category = categoryFromSlug(id);
  if (!category) return { title: getDictionary(lang).notFound.title, robots: { index: false, follow: false } };

  const dict = getDictionary(lang);
  const imageLocale = ogTextLocale(lang);
  const imageDict = getDictionary(imageLocale);
  const offers = getOffersByCategory(category);
  const categoryLabel = translateCategory(lang, category);
  const banks = Array.from(new Set(offers.map((offer) => offer.bank)))
    .slice(0, 3)
    .map((bank) => translateBank(lang, bank))
    .join(', ');

  const title = dict.pages.categoryPageTitle(categoryLabel);
  const description = clamp(
    dict.pages.categoryPageDescription({ category: categoryLabel, count: offers.length, banks }),
    300,
  );

  return buildMetadata({
    locale: lang,
    path: `/categories/${id}`,
    title,
    description,
    image: ogImageUrl({
      title: imageDict.pages.categoryPageTitle(translateCategory(imageLocale, category)),
      subtitle: imageDict.browse.offerCount(offers.length),
      badge: translateCategory(imageLocale, category),
      locale: imageLocale,
    }),
    imageAlt: title,
    noIndex: offers.length === 0,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  const category = categoryFromSlug(id);
  if (!category) notFound();

  const dict = getDictionary(locale);
  const offers = sortOffers(getOffersByCategory(category, getActiveOffers()));
  const categoryLabel = translateCategory(locale, category);

  const crumbs = [
    { name: dict.breadcrumb.home, path: '/' },
    { name: dict.breadcrumb.categories, path: '/categories' },
    { name: categoryLabel, path: `/categories/${id}` },
  ];

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dict.pages.categoryPageTitle(categoryLabel),
    url: absoluteUrl(localizedPath(locale, `/categories/${id}`)),
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
            {dict.pages.categoryPageTitle(categoryLabel)}
          </h1>
          <p className="mt-2 max-w-3xl leading-relaxed text-gray-600">
            {dict.pages.categoryPageDescription({
              category: categoryLabel,
              count: offers.length,
              banks: Array.from(new Set(offers.map((offer) => offer.bank)))
                .slice(0, 3)
                .map((bank) => translateBank(locale, bank))
                .join(', '),
            })}
          </p>
        </div>

        <OfferBrowser offers={offers} locale={locale} heading={dict.browse.categoryOffers(categoryLabel)} />

        <div className="container mx-auto px-4 pb-12">
          <OfferIndexList offers={offers} locale={locale} heading={dict.browse.categoryOffers(categoryLabel)} />
        </div>
      </main>
    </>
  );
}
