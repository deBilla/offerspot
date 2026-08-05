import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import CardWallet from '@/app/components/CardWallet';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getWalletCopy } from '@/i18n/wallet-copy';
import { buildMetadata, ogImageUrl, ogTextLocale } from '@/lib/seo';
import { getActiveOffers, isMeaningful } from '@/lib/offers';

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = getWalletCopy(lang);
  const imageLocale = ogTextLocale(lang);
  return buildMetadata({
    locale: lang,
    path: '/my-cards',
    title: copy.title,
    description: copy.description,
    image: ogImageUrl({
      title: getWalletCopy(imageLocale).title,
      subtitle: getDictionary(imageLocale).siteName,
      locale: imageLocale,
    }),
    imageAlt: copy.title,
    // A personal settings screen has nothing to rank for and renders empty to
    // a crawler, so it stays out of the index while remaining linkable.
    noIndex: true,
  });
}

export default async function MyCardsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const copy = getWalletCopy(locale);

  const offers = getActiveOffers();
  const bankCounts = new Map<string, number>();
  for (const offer of offers) {
    if (isMeaningful(offer.bank)) bankCounts.set(offer.bank, (bankCounts.get(offer.bank) ?? 0) + 1);
  }
  const banks = [...bankCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const cardTypes = [...new Set(offers.flatMap((offer) => offer.card_types ?? []).filter(isMeaningful))].sort();

  const crumbs = [
    { name: dict.breadcrumb.home, path: '/' },
    { name: copy.title, path: '/my-cards' },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-3xl px-4 py-6 sm:py-10">
        <Breadcrumbs locale={locale} items={crumbs} />
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{copy.title}</h1>
        <p className="mt-2 max-w-2xl leading-relaxed text-gray-600">{copy.description}</p>

        <div className="mt-8">
          <CardWallet locale={locale} banks={banks} cardTypes={cardTypes} />
        </div>
      </div>
    </main>
  );
}
