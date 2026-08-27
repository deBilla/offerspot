import type { Offer } from '@/types/offer';
import { isMeaningful } from './offers';

export interface BankInfo {
  name: string;
  count: number;
}

/**
 * The bank counts and category list the filter UI offers for a given page.
 *
 * These describe the page's whole scope, not the current filter result, so they
 * never change once the page is rendered — which makes them a build-time
 * property of the route rather than something the browser should recompute.
 * Deriving them here lets a page send its filter UI without also sending every
 * offer the counts were derived from.
 */
export interface OfferFacets {
  banks: BankInfo[];
  /** Always led by "All"; the browser treats that entry as "no category filter". */
  categories: string[];
}

export function buildFacets(offers: Offer[]): OfferFacets {
  const bankCounts = new Map<string, number>();
  for (const offer of offers) {
    if (offer.bank) bankCounts.set(offer.bank, (bankCounts.get(offer.bank) ?? 0) + 1);
  }

  return {
    banks: Array.from(bankCounts, ([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    categories: ['All', ...Array.from(new Set(offers.map((offer) => offer.category).filter(isMeaningful))).sort()],
  };
}

/** How many cards the grid shows per page; shared so the server can send exactly one page. */
export const OFFERS_PER_PAGE = 9;

/**
 * The props `OfferBrowser` needs for a scope, given that scope's offers.
 *
 * `offers` must already be sorted the way the page wants them shown: the order
 * is carried by `offerIds` and the browser does not re-sort.
 */
export function browserPropsFor(offers: Offer[]) {
  return {
    offerIds: offers.map((offer) => offer.id),
    initialOffers: offers.slice(0, OFFERS_PER_PAGE),
    facets: buildFacets(offers),
  };
}
