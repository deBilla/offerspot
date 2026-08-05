import type { Offer } from '@/types/offer';
import type { Locale } from '@/i18n/config';
import { translateBank, translateCardType, translateCategory } from '@/i18n/dictionaries';
import { daysUntilExpiry, endDateOf, formatNumber, isMeaningful, merchantName } from './offers';

/**
 * Facts about a set of offers, used to compose hub-page copy and FAQs.
 *
 * Every sentence on a hub page is generated from these numbers rather than
 * padded with filler. That matters: auto-generated prose that says nothing is
 * the same scaled-content problem the offer pages were noindexed for. If a
 * figure is not knowable from the data the copy omits the sentence instead of
 * inventing one.
 */
export interface HubStats {
  count: number;
  bankCount: number;
  categoryCount: number;
  /** Localized, most offers first. */
  topBanks: string[];
  topCategories: string[];
  cardTypes: string[];
  /** Largest percentage discount in the set, with who it is from. */
  best: { percentage: number; merchant: string; bank: string } | null;
  /** Offers ending within the next 14 days. */
  expiringSoon: number;
  /** Offers whose end date the banks never published. */
  undated: number;
  monthYear: string;
}

const localeTags: Record<Locale, string> = { en: 'en-GB', si: 'si-LK', ta: 'ta-LK' };

function rankBy<T extends string>(values: T[]): T[] {
  const counts = new Map<T, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([value]) => value);
}

export function buildHubStats(locale: Locale, offers: Offer[], now: Date = new Date()): HubStats {
  const banks = rankBy(offers.map((offer) => offer.bank).filter(isMeaningful));
  const categories = rankBy(offers.map((offer) => offer.category).filter(isMeaningful));
  const cardTypes = rankBy(offers.flatMap((offer) => offer.card_types ?? []).filter(isMeaningful));

  let best: HubStats['best'] = null;
  for (const offer of offers) {
    const details = offer.offer_details;
    if (details?.type !== 'percentage' || !details.value) continue;
    if (!best || details.value > best.percentage) {
      best = {
        percentage: details.value,
        merchant: merchantName(locale, offer),
        bank: translateBank(locale, offer.bank),
      };
    }
  }

  const expiringSoon = offers.filter((offer) => {
    const days = daysUntilExpiry(offer);
    return days !== null && days <= 14;
  }).length;

  return {
    count: offers.length,
    bankCount: banks.length,
    categoryCount: categories.length,
    topBanks: banks.slice(0, 4).map((bank) => translateBank(locale, bank)),
    topCategories: categories.slice(0, 4).map((category) => translateCategory(locale, category)),
    cardTypes: cardTypes.map((cardType) => translateCardType(locale, cardType)),
    best,
    expiringSoon,
    undated: offers.filter((offer) => !endDateOf(offer, now)).length,
    monthYear: new Intl.DateTimeFormat(localeTags[locale], { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
      now,
    ),
  };
}

/** "A, B and C" in the page's language. */
export function listJoin(locale: Locale, items: string[]): string {
  if (items.length === 0) return '';
  const formatter = new Intl.ListFormat(localeTags[locale], { style: 'long', type: 'conjunction' });
  return formatter.format(items);
}

export function formatCount(locale: Locale, value: number): string {
  return formatNumber(locale, value);
}
