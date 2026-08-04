import Link from 'next/link';
import type { Offer } from '@/types/offer';
import { localizedPath, type Locale } from '@/i18n/config';
import { formatDiscount, merchantName } from '@/lib/offers';

/**
 * A flat, server-rendered list of links to every offer in scope.
 *
 * The card grid above it is paginated client-side, so without this block a
 * crawler only ever sees the first nine offers on a bank or category page and
 * has to rely entirely on the sitemap to reach the rest. This keeps every offer
 * one click from a topical hub page.
 */
export default function OfferIndexList({
  offers,
  locale,
  heading,
}: {
  offers: Offer[];
  locale: Locale;
  heading: string;
}) {
  if (offers.length === 0) return null;

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="mb-4 text-lg font-bold text-gray-800">{heading}</h2>
      <ul className="columns-1 gap-6 text-sm sm:columns-2 lg:columns-3">
        {offers.map((offer) => {
          const discount = formatDiscount(locale, offer);
          return (
            <li key={offer.id} className="mb-2 break-inside-avoid">
              <Link
                href={localizedPath(locale, `/offer/${offer.id}`)}
                className="text-gray-600 transition-colors hover:text-teal-700 hover:underline"
              >
                <span className="font-medium text-gray-800">{merchantName(locale, offer)}</span>
                {discount && <span className="text-green-700"> — {discount}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
