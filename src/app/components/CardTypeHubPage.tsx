import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdSenseProvider from '@/app/components/AdsenseProvider';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import OfferBrowser from '@/app/components/OfferBrowser';
import OfferIndexList from '@/app/components/OfferIndexList';
import HubContent from '@/app/components/HubContent';
import { isLocale, localeHtmlLang, localizedPath, type Locale } from '@/i18n/config';
import { getDictionary, translateBank, translateCardType } from '@/i18n/dictionaries';
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, ogImageUrl, ogTextLocale } from '@/lib/seo';
import { buildHubStats } from '@/lib/hub-stats';
import { cardTypeHubCopy } from '@/i18n/hub-copy';
import { cardTypeHubFromSlug, getOffersByCardType } from '@/lib/hub-routes';
import { clamp, getActiveOffers, merchantName, sortOffers } from '@/lib/offers';

/**
 * "Credit card offers in Sri Lanka" and "debit card offers in Sri Lanka" are
 * separate searches with genuinely different answers — the two sets barely
 * overlap — so they get separate pages rather than a filter on the homepage.
 *
 * Both routes render through here so the two page files stay a URL declaration
 * and nothing else.
 */

export async function cardTypeHubMetadata(lang: string, slug: string): Promise<Metadata> {
  if (!isLocale(lang)) notFound();
  const hub = cardTypeHubFromSlug(slug);
  if (!hub) notFound();

  const dict = getDictionary(lang);
  const imageLocale = ogTextLocale(lang);
  const imageDict = getDictionary(imageLocale);
  const offers = getOffersByCardType(hub.cardType);
  const label = translateCardType(lang, hub.cardType);

  const banks = Array.from(new Set(offers.map((offer) => offer.bank)))
    .slice(0, 3)
    .map((bank) => translateBank(lang, bank))
    .join(', ');

  const stats = buildHubStats(lang, offers);
  const title = `${dict.pages.cardTypePageTitle(label)} — ${stats.monthYear}`;

  return buildMetadata({
    locale: lang,
    path: `/${hub.slug}`,
    title,
    description: clamp(dict.pages.cardTypePageDescription({ cardType: label, count: offers.length, banks }), 300),
    image: ogImageUrl({
      title: imageDict.pages.cardTypePageTitle(translateCardType(imageLocale, hub.cardType)),
      subtitle: imageDict.browse.offerCount(offers.length),
      badge: translateCardType(imageLocale, hub.cardType),
      locale: imageLocale,
    }),
    imageAlt: title,
    // Nothing to rank for once every offer of this card type has lapsed.
    noIndex: offers.length === 0,
  });
}

export default async function CardTypeHubPage({ lang, slug }: { lang: string; slug: string }) {
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const hub = cardTypeHubFromSlug(slug);
  if (!hub) notFound();

  const dict = getDictionary(locale);
  const offers = sortOffers(getOffersByCardType(hub.cardType, getActiveOffers()));
  const label = translateCardType(locale, hub.cardType);
  const heading = dict.pages.cardTypePageTitle(label);

  const banks = Array.from(new Set(offers.map((offer) => offer.bank)))
    .slice(0, 3)
    .map((bank) => translateBank(locale, bank))
    .join(', ');

  const crumbs = [
    { name: dict.breadcrumb.home, path: '/' },
    { name: heading, path: `/${hub.slug}` },
  ];

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: heading,
    url: absoluteUrl(localizedPath(locale, `/${hub.slug}`)),
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
            {dict.pages.cardTypePageDescription({ cardType: label, count: offers.length, banks })}
          </p>
        </div>

        <OfferBrowser offers={offers} locale={locale} heading={heading} />

        <div className="container mx-auto px-4 pb-12">
          <OfferIndexList offers={offers} locale={locale} heading={heading} />
          <HubContent locale={locale} copy={cardTypeHubCopy(locale, label, buildHubStats(locale, offers))} />
        </div>
      </main>
    </>
  );
}
