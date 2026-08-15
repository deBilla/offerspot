import type { Offer } from '@/types/offer';
import { getActiveOffers, isMeaningful, slugify } from './offers';

/**
 * Merchant hubs — "Keells card offers", "Cargills promotions".
 *
 * People search for the shop, not the bank: they are standing in one and want
 * to know which card to pay with. The incumbent aggregator has a /merchants
 * section for the same reason.
 *
 * This was declined once, in an earlier pass, when only two merchants had more
 * than a single live offer — every page would have been thinner than the offer
 * pages we deliberately keep out of the index. With the feed refreshed, 53
 * merchants clear two offers and 18 clear three, so the pages now compare
 * something rather than restate one promotion.
 */

/**
 * The extractor writes whatever the bank's page happened to print, so the same
 * shop arrives under several spellings and a naive group-by splits its offers
 * across pages that each look thin. Comparison is on a normalised key —
 * lowercased, punctuation dropped, trailing plurals removed — so "Siddhalepa
 * Clinic" and "Siddhalepa Clinics" land together.
 */
function merchantKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/s$/, '');
}

export function merchantNameOf(offer: Offer): string | null {
  const name = offer.merchant?.name;
  return isMeaningful(name) ? name.trim().replace(/\s+/g, ' ') : null;
}

/**
 * Two offers is enough here, unlike the four a bank-category hub needs. The
 * value of this page is "which cards work at this shop", and that comparison
 * exists as soon as there are two — whereas a category page with two offers is
 * simply a short list.
 */
const MIN_MERCHANT_OFFERS = 2;

export interface MerchantRoute {
  /** The most common spelling, used for display. */
  merchant: string;
  slug: string;
  count: number;
}

interface Group {
  names: Map<string, number>;
  count: number;
}

function groupMerchants(offers: Offer[]): Map<string, Group> {
  const groups = new Map<string, Group>();
  for (const offer of offers) {
    const name = merchantNameOf(offer);
    if (!name) continue;
    const key = merchantKey(name);
    if (!key) continue;
    const group = groups.get(key) ?? { names: new Map(), count: 0 };
    group.names.set(name, (group.names.get(name) ?? 0) + 1);
    group.count += 1;
    groups.set(key, group);
  }
  return groups;
}

/** The spelling used most often, so the page title matches what banks print. */
function preferredName(group: Group): string {
  return Array.from(group.names.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
}

export function merchantRoutes(offers: Offer[] = getActiveOffers()): MerchantRoute[] {
  return Array.from(groupMerchants(offers).values())
    .filter((group) => group.count >= MIN_MERCHANT_OFFERS)
    .map((group) => {
      const merchant = preferredName(group);
      return { merchant, slug: slugify(merchant), count: group.count };
    })
    // Distinct names can still slugify identically; keep the first and drop
    // the rest so two routes never claim one URL.
    .filter((route, index, all) => all.findIndex((other) => other.slug === route.slug) === index)
    .sort((a, b) => b.count - a.count || a.merchant.localeCompare(b.merchant));
}

export function merchantFromSlug(slug: string, offers?: Offer[]): MerchantRoute | undefined {
  return merchantRoutes(offers).find((route) => route.slug === slug);
}

/** Every offer for a merchant, including its alternative spellings. */
export function getOffersByMerchant(merchant: string, offers: Offer[] = getActiveOffers()): Offer[] {
  const key = merchantKey(merchant);
  return offers.filter((offer) => {
    const name = merchantNameOf(offer);
    return name !== null && merchantKey(name) === key;
  });
}
