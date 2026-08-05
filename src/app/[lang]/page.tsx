import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdSenseProvider from '@/app/components/AdsenseProvider';
import JsonLd from '@/app/components/JsonLd';
import OfferBrowser from '@/app/components/OfferBrowser';
import HubContent from '@/app/components/HubContent';
import { isLocale, localeHtmlLang, localizedPath, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { absoluteUrl, buildMetadata, ogImageUrl, ogTextLocale } from '@/lib/seo';
import { getActiveOffers, merchantName, sortOffers } from '@/lib/offers';
import { buildHubStats } from '@/lib/hub-stats';
import { homeHubCopy } from '@/i18n/hub-copy';
import { translateBank } from '@/i18n/dictionaries';

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const imageDict = getDictionary(ogTextLocale(lang));

  const metadata = buildMetadata({
    locale: lang,
    path: '/',
    title: `${dict.siteName} | ${dict.pages.homeTitle}`,
    description: dict.metaDescription,
    image: ogImageUrl({
      title: imageDict.pages.homeTitle,
      subtitle: imageDict.tagline,
      locale: ogTextLocale(lang),
    }),
    imageAlt: `${dict.siteName} — ${dict.tagline}`,
  });

  // The layout's title template would otherwise append the site name twice.
  return { ...metadata, title: { absolute: `${dict.siteName} | ${dict.pages.homeTitle}` } };
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const offers = sortOffers(getActiveOffers());
  const stats = buildHubStats(locale, offers);

  const bankCounts = new Map<string, number>();
  for (const offer of offers) bankCounts.set(offer.bank, (bankCounts.get(offer.bank) ?? 0) + 1);
  const leader = [...bankCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  const copy = homeHubCopy(
    locale,
    stats,
    leader ? { name: translateBank(locale, leader[0]), count: leader[1] } : undefined,
  );

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dict.pages.offersTitle,
    description: dict.metaDescription,
    url: absoluteUrl(localizedPath(locale, '/')),
    inLanguage: localeHtmlLang[locale],
    numberOfItems: offers.length,
    itemListElement: offers.slice(0, 30).map((offer, index) => ({
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
      <main id="main-content" className="min-h-screen bg-slate-50">
        <h1 className="sr-only">
          {dict.siteName} — {dict.pages.homeTitle}
        </h1>
        <OfferBrowser offers={offers} locale={locale} heading={dict.browse.latestOffers} />
        <div className="container mx-auto px-4 pb-12">
          <HubContent locale={locale} copy={copy} />
        </div>
      </main>
    </>
  );
}
