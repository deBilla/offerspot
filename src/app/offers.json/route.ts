import { getActiveOffers, sortOffers } from '@/lib/offers';

/**
 * The full live-offer catalogue as one static JSON asset.
 *
 * Every browsing page scopes this list down to its own slice — a bank, a
 * category, a merchant — and used to hand that slice to `OfferBrowser` as a
 * prop. React serialises client-component props into the HTML, so each page
 * inlined its own copy of the offer data: 715 KB of the 911 KB that
 * /credit-card-offers shipped was that one array, and a reader moving between
 * hubs downloaded a near-identical copy every time.
 *
 * Serving it from one URL instead means the browser fetches it once, the CDN
 * caches it for everyone, and the pages themselves carry only the ids they
 * scope to. It is prerendered at build time like every other route here, so it
 * costs nothing to serve and refreshes with the daily rebuild.
 */
export const dynamic = 'force-static';

export async function GET() {
  // Sorted once here so the client can rely on the order without re-sorting the
  // whole catalogue on load.
  return Response.json(sortOffers(getActiveOffers()), {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
