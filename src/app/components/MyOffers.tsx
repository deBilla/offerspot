'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import type { Offer } from '@/types/offer';
import { localizedPath, type Locale } from '@/i18n/config';
import { getDictionary, translateBank, translateCategory } from '@/i18n/dictionaries';
import { getWalletCopy } from '@/i18n/wallet-copy';
import { useWallet, walletMatches } from '@/app/context/WalletContext';
import { daysUntilExpiry, formatDiscount, formatEndDate, merchantName } from '@/lib/offers';

function OfferRow({ offer, locale }: { offer: Offer; locale: Locale }) {
  const dict = getDictionary(locale);
  const discount = formatDiscount(locale, offer);
  const until = formatEndDate(locale, offer, 'short');
  const daysLeft = daysUntilExpiry(offer);

  return (
    <li>
      <Link
        href={localizedPath(locale, `/offer/${offer.id}`)}
        className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
      >
        <span className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-gray-700">
            {translateBank(locale, offer.bank)}
          </span>
          <span className="text-xs text-gray-500">{translateCategory(locale, offer.category)}</span>
          {discount && <span className="ml-auto font-bold text-green-600">{discount}</span>}
        </span>
        <span className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {merchantName(locale, offer)}
        </span>
        <span lang="en" className="line-clamp-2 font-semibold text-gray-900">
          {offer.title}
        </span>
        <span className="text-xs text-gray-500">
          {until ? `${dict.browse.validUntil}: ${until}` : dict.offer.validityNotSpecified}
          {daysLeft !== null && daysLeft <= 7 && (
            <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 font-medium text-red-700">
              {daysLeft === 0 ? dict.browse.expiresToday : dict.browse.daysLeft(daysLeft)}
            </span>
          )}
        </span>
      </Link>
    </li>
  );
}

/**
 * Filters every live offer down to the ones the visitor's saved cards qualify
 * for. Runs entirely client-side against the prerendered offer list, so the
 * page itself stays static and cacheable while the result is personal.
 */
export default function MyOffers({ locale, offers }: { locale: Locale; offers: Offer[] }) {
  const copy = getWalletCopy(locale);
  const dict = getDictionary(locale);
  const { wallet, ready, hasSelection } = useWallet();

  const { expiring, rest } = useMemo(() => {
    if (!hasSelection) return { expiring: [], rest: [] };
    const matches = offers.filter((offer) => walletMatches(wallet, offer));
    const expiring: Offer[] = [];
    const rest: Offer[] = [];
    for (const offer of matches) {
      const days = daysUntilExpiry(offer);
      if (days !== null && days <= 14) expiring.push(offer);
      else rest.push(offer);
    }
    return { expiring, rest };
  }, [offers, wallet, hasSelection]);

  // Nothing is rendered until localStorage has been read, so the list never
  // flashes "no cards saved" for a visitor who has some.
  if (!ready) {
    return <div className="h-40 animate-pulse rounded-2xl bg-slate-100" aria-hidden="true" />;
  }

  if (!hasSelection) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">{copy.noSelectionTitle}</h2>
        <p className="mx-auto mt-2 max-w-md text-gray-600">{copy.noSelectionBody}</p>
        <Link
          href={localizedPath(locale, '/my-cards')}
          className="mt-5 inline-flex items-center rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-teal-600 hover:to-blue-700"
        >
          {copy.noSelectionCta}
        </Link>
      </div>
    );
  }

  const total = expiring.length + rest.length;

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">{copy.noMatchesTitle}</h2>
        <p className="mx-auto mt-2 max-w-md text-gray-600">{copy.noMatchesBody}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href={localizedPath(locale, '/my-cards')}
            className="inline-flex items-center rounded-xl bg-teal-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-teal-700"
          >
            {copy.editCards}
          </Link>
          <Link
            href={localizedPath(locale, '/')}
            className="inline-flex items-center rounded-xl border border-gray-200 px-5 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            {dict.notFound.cta}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-gray-800">{copy.matchCount(total)}</p>
        <Link
          href={localizedPath(locale, '/my-cards')}
          className="text-sm font-medium text-teal-700 hover:underline"
        >
          {copy.editCards}
        </Link>
      </div>

      {expiring.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold text-gray-800">{copy.expiringHeading}</h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {expiring.map((offer) => (
              <OfferRow key={offer.id} offer={offer} locale={locale} />
            ))}
          </ul>
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold text-gray-800">{copy.allMatchesHeading}</h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {rest.map((offer) => (
              <OfferRow key={offer.id} offer={offer} locale={locale} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
