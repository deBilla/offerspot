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

  /*
   * Every class below hangs off the <ul> rather than the elements themselves.
   * The list runs to several hundred entries on the larger hubs, and a class
   * attribute repeated per row is paid for twice — once in the HTML and again
   * in the RSC payload that mirrors it for client navigation. Hoisting them
   * took ~190 KB off /credit-card-offers on its own.
   */
  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="mb-4 text-lg font-bold text-gray-800">{heading}</h2>
      <ul className="columns-1 gap-6 text-sm sm:columns-2 lg:columns-3 [&_a]:text-gray-600 [&_a]:transition-colors [&_a:hover]:text-teal-700 [&_a:hover]:underline [&_b]:font-medium [&_b]:text-gray-800 [&_i]:not-italic [&_i]:text-green-700 [&_li]:mb-2 [&_li]:break-inside-avoid">
        {offers.map((offer) => {
          const discount = formatDiscount(locale, offer);
          return (
            <li key={offer.id}>
              <Link href={localizedPath(locale, `/offer/${offer.id}`)}>
                <b>{merchantName(locale, offer)}</b>
                {discount && <i> — {discount}</i>}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
