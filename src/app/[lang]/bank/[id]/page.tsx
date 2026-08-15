import type { Metadata } from 'next';
import Link from 'next/link';
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
import { bankHubCopy } from '@/i18n/hub-copy';
import { bankCategoryRoutesForBank } from '@/lib/hub-routes';
import { defunctBank } from '@/lib/bank-status';
import {
  bankFromSlug,
  bankSlugList,
  clamp,
  formatDate,
  getActiveOffers,
  getOffersByBank,
  merchantName,
  slugify,
  sortOffers,
} from '@/lib/offers';

export const revalidate = 86400;

export function generateStaticParams() {
  return locales.flatMap((lang) => bankSlugList.map((id) => ({ lang, id })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const bank = bankFromSlug(id);
  if (!bank) return { title: getDictionary(lang).notFound.title, robots: { index: false, follow: false } };

  const dict = getDictionary(lang);
  const imageLocale = ogTextLocale(lang);
  const imageDict = getDictionary(imageLocale);
  const offers = getOffersByBank(bank);
  const bankLabel = translateBank(lang, bank);
  const categories = Array.from(new Set(offers.map((offer) => offer.category)))
    .slice(0, 3)
    .map((category) => translateCategory(lang, category))
    .join(', ');

  const stats = buildHubStats(lang, offers);
  const closed = defunctBank(bank);

  // A bank that has left the market keeps its page and its ranking, but the
  // title and description have to answer the question people are actually
  // asking — where did my card go — rather than advertise offers that ended.
  const title = closed
    ? clamp(dict.pages.bankClosedTitle(bankLabel), 65)
    : `${dict.pages.bankPageTitle(bankLabel)} — ${stats.monthYear}`;
  const description = clamp(
    closed
      ? dict.pages.bankClosedDescription({
          bank: bankLabel,
          successor: translateBank(lang, closed.successor),
        })
      : dict.pages.bankPageDescription({ bank: bankLabel, count: offers.length, categories }),
    300,
  );

  return buildMetadata({
    locale: lang,
    path: `/bank/${id}`,
    title,
    description,
    image: ogImageUrl({
      title: closed
        ? imageDict.pages.bankClosedHeading(translateBank(imageLocale, bank))
        : imageDict.pages.bankPageTitle(translateBank(imageLocale, bank)),
      subtitle: closed
        ? imageDict.pages.bankClosedCta(translateBank(imageLocale, closed.successor))
        : imageDict.browse.offerCount(offers.length),
      bank,
      locale: imageLocale,
    }),
    imageAlt: title,
    /*
     * A bank whose offers have all expired has nothing to rank for — but a
     * bank that has *left the market* does, and it is the opposite call.
     * "hsbc credit card offers" is the largest query cluster reaching this
     * site; those searchers need to be told their bank sold its card business
     * and where the accounts went. Since the defunct filter drops every offer,
     * the count test alone would noindex exactly the page that answers them.
     */
    noIndex: offers.length === 0 && !closed,
  });
}

export default async function BankPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  const bank = bankFromSlug(id);
  if (!bank) notFound();

  const dict = getDictionary(locale);
  const offers = sortOffers(getOffersByBank(bank, getActiveOffers()));
  const bankLabel = translateBank(locale, bank);
  const categoryRoutes = bankCategoryRoutesForBank(bank);
  const closed = defunctBank(bank);
  const successorSlug = closed ? slugify(closed.successor) : null;
  const transferredOn = closed ? formatDate(locale, closed.transferredOn) : null;
  const successorOffers = closed
    ? sortOffers(getOffersByBank(closed.successor, getActiveOffers()))
    : [];

  const crumbs = [
    { name: dict.breadcrumb.home, path: '/' },
    { name: dict.breadcrumb.banks, path: '/banks' },
    { name: bankLabel, path: `/bank/${id}` },
  ];

  // For a closed bank the list describes the successor's offers, which is what
  // the page actually shows; an empty ItemList would claim otherwise.
  const listedOffers = closed ? successorOffers : offers;
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: closed
      ? dict.browse.bankOffers(translateBank(locale, closed.successor))
      : dict.pages.bankPageTitle(bankLabel),
    url: absoluteUrl(localizedPath(locale, `/bank/${id}`)),
    inLanguage: localeHtmlLang[locale],
    numberOfItems: listedOffers.length,
    itemListElement: listedOffers.slice(0, 50).map((offer, index) => ({
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
            {closed ? dict.pages.bankClosedHeading(bankLabel) : dict.pages.bankPageTitle(bankLabel)}
          </h1>

          {closed && successorSlug ? (
            /* The whole page for a bank that has left the market: say what
               happened, then send people somewhere useful. Listing its expired
               promotions underneath would only muddy that. */
            <div className="mt-4 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
              <p className="leading-relaxed text-amber-900">
                {dict.pages.bankClosedBody({
                  bank: bankLabel,
                  successor: translateBank(locale, closed.successor),
                  date: transferredOn ?? closed.transferredOn,
                })}
              </p>
              <Link
                href={localizedPath(locale, `/bank/${successorSlug}`)}
                className="mt-4 inline-flex items-center rounded-xl bg-teal-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-teal-700"
              >
                {dict.pages.bankClosedCta(translateBank(locale, closed.successor))}
              </Link>
            </div>
          ) : (
            <p className="mt-2 max-w-3xl leading-relaxed text-gray-600">
              {dict.pages.bankPageDescription({
                bank: bankLabel,
                count: offers.length,
                categories: Array.from(new Set(offers.map((offer) => offer.category)))
                  .slice(0, 3)
                  .map((category) => translateCategory(locale, category))
                  .join(', '),
              })}
            </p>
          )}
        </div>

        {!closed && (
          <OfferBrowser offers={offers} locale={locale} heading={dict.browse.bankOffers(bankLabel)} />
        )}

        <div className="container mx-auto px-4 pb-12">
          {categoryRoutes.length > 0 && (
            <nav aria-label={dict.pages.categoriesTitle} className="mt-8">
              <h2 className="mb-3 text-lg font-bold text-gray-800">{dict.pages.categoriesTitle}</h2>
              <ul className="flex flex-wrap gap-2">
                {categoryRoutes.map((route) => (
                  <li key={route.categorySlug}>
                    <Link
                      href={localizedPath(locale, `/bank/${route.bankSlug}/${route.categorySlug}`)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-800 transition-colors hover:bg-teal-100"
                    >
                      {translateCategory(locale, route.category)}
                      <span className="text-xs text-teal-600">({route.count})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/*
            * A closed bank has no offers of its own, so listing them and
            * generating hub copy from zero counts would produce nonsense. Show
            * the successor's current offers instead: it answers what the
            * visitor came for, and keeps the page substantive rather than a
            * bare notice.
            */}
          {closed && successorOffers.length > 0 ? (
            <OfferIndexList
              offers={successorOffers}
              locale={locale}
              heading={dict.browse.bankOffers(translateBank(locale, closed.successor))}
            />
          ) : (
            !closed && (
              <>
                <OfferIndexList offers={offers} locale={locale} heading={dict.browse.bankOffers(bankLabel)} />
                <HubContent
                  locale={locale}
                  copy={bankHubCopy(locale, bankLabel, buildHubStats(locale, offers))}
                />
              </>
            )
          )}
        </div>
      </main>
    </>
  );
}
