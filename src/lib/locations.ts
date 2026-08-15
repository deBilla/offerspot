import type { Offer } from '@/types/offer';
import { getActiveOffers, slugify } from './offers';

/**
 * Where an offer can be redeemed, recovered from its text.
 *
 * `location.address` is null on every offer in the feed — banks publish "30%
 * at Cinnamon Grand Colombo", not a structured address — so the town is read
 * out of the title, description, merchant name and terms instead.
 *
 * This exists because Search Console says people search this way and we rank
 * nowhere for it: "dambulla hotels bank offers" alone draws 72 impressions at
 * position 49, and location queries are 21% of all impressions with zero
 * clicks. Travel & Lodging is already the largest category, so the inventory
 * to answer them is here; only the pages were missing.
 */

/**
 * Sri Lankan towns worth a page, longest first so "Nuwara Eliya" is matched
 * before a bare "Eliya" could be, and so multi-word names win over substrings.
 */
const TOWNS = [
  'Nuwara Eliya', 'Arugam Bay', 'Passikudah', 'Pasikuda', 'Bandarawela',
  'Anuradhapura', 'Trincomalee', 'Polonnaruwa', 'Batticaloa', 'Hikkaduwa',
  'Kurunegala', 'Ratnapura', 'Habarana', 'Beruwala', 'Ahungalla', 'Wadduwa',
  'Kalutara', 'Balapitiya', 'Induruwa', 'Negombo', 'Dambulla', 'Sigiriya',
  'Kosgoda', 'Tangalle', 'Unawatuna', 'Weligama', 'Haputale', 'Kitulgala',
  'Nilaveli', 'Bentota', 'Mirissa', 'Colombo', 'Badulla', 'Chilaw', 'Jaffna',
  'Marawila', 'Matara', 'Waikkal', 'Kandy', 'Galle', 'Ella', 'Yala',
].sort((a, b) => b.length - a.length);

/**
 * Word-boundary match, case-insensitive. Anchored so "Ella" cannot fire inside
 * "Bella Vista" and "Galle" cannot fire inside "Galleria".
 */
const TOWN_PATTERNS: ReadonlyArray<readonly [string, RegExp]> = TOWNS.map((town) => [
  town,
  new RegExp(`\\b${town.replace(/\s+/g, '\\s+')}\\b`, 'i'),
] as const);

/**
 * Place names that contain a town name but are not in that town. Galle Face
 * and Galle Road are both in Colombo — the Galle Face Hotel is about 120km
 * from Galle — so a plain word-boundary match files several Colombo hotels
 * under the wrong page. Checked before the town patterns and mapped to the
 * town they are actually in.
 */
const MISLEADING_PLACES: ReadonlyArray<readonly [RegExp, string]> = [
  [/\bGalle\s+Face\b/i, 'Colombo'],
  [/\bGalle\s+Road\b/i, 'Colombo'],
];

function searchableText(offer: Offer): string {
  return [offer.title, offer.description, offer.merchant?.name, offer.terms]
    .filter(Boolean)
    .join(' ');
}

/** The town an offer names, or null. First match wins, longest name first. */
export function offerTown(offer: Offer): string | null {
  const text = searchableText(offer);

  // Landmarks that borrow another town's name win outright — "Galle Face
  // Hotel" is Colombo, and matching it on "Galle" would be simply wrong.
  for (const [pattern, town] of MISLEADING_PLACES) {
    if (pattern.test(text)) return town;
  }

  for (const [town, pattern] of TOWN_PATTERNS) {
    if (pattern.test(text)) return town;
  }
  return null;
}

export function getOffersByTown(town: string, offers: Offer[] = getActiveOffers()): Offer[] {
  return offers.filter((offer) => offerTown(offer) === town);
}

/**
 * A town needs this many live offers to earn a page. Same reasoning as the
 * bank-category gate: a hub holding two offers is thinner than the offer pages
 * we deliberately keep out of the index, so it would be a liability rather
 * than a landing page.
 */
const MIN_TOWN_OFFERS = 4;

export interface TownRoute {
  town: string;
  slug: string;
  count: number;
}

export function townRoutes(offers: Offer[] = getActiveOffers()): TownRoute[] {
  const counts = new Map<string, number>();
  for (const offer of offers) {
    const town = offerTown(offer);
    if (town) counts.set(town, (counts.get(town) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .filter(([, count]) => count >= MIN_TOWN_OFFERS)
    .map(([town, count]) => ({ town, slug: slugify(town), count }))
    .sort((a, b) => b.count - a.count || a.town.localeCompare(b.town));
}

export function townFromSlug(slug: string, offers?: Offer[]): TownRoute | undefined {
  return townRoutes(offers).find((route) => route.slug === slug);
}
