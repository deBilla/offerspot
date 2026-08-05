import rawOffers from '@/app/api/data.json';
import type { Offer } from '@/types/offer';
import type { Locale } from '@/i18n/config';
import { getDictionary, translateBank, translateCardType, translateCategory } from '@/i18n/dictionaries';
import { isPlaceholderOffer, resolveEndDate } from './offer-quality';

export { isPlaceholderOffer } from './offer-quality';

export const allOffers = rawOffers as unknown as Offer[];

/**
 * Values the source feed uses to mean "no data".
 *
 * Anchored at the start rather than matched exactly, because the extractor
 * emits qualified variants — "Not specified (Japan)", "Not provided in the
 * text" — which an exact-match set lets through, and they then render as if
 * they were a real merchant name.
 */
const NULLISH_TEXT =
  /^\s*(?:n\/?a|none|null|-+|unknown|unspecified|tbd|tba|not\s+(?:specified|provided|mentioned|available|stated|given)\b.*)\s*$/i;

export function isMeaningful(value?: string | null): value is string {
  return !!value && !NULLISH_TEXT.test(value.trim());
}

/** URL-safe slug: "Dining & Restaurants" -> "dining-restaurants". */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildSlugMap(values: string[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const value of values) {
    const slug = slugify(value);
    if (slug && !map.has(slug)) map.set(slug, value);
  }
  return map;
}

export const allBanks: string[] = Array.from(
  new Set(allOffers.map((offer) => offer.bank).filter(isMeaningful)),
).sort();

export const allCategories: string[] = Array.from(
  new Set(allOffers.map((offer) => offer.category).filter(isMeaningful)),
).sort();

const bankSlugs = buildSlugMap(allBanks);
const categorySlugs = buildSlugMap(allCategories);

export function bankFromSlug(slug: string): string | undefined {
  return bankSlugs.get(slug.toLowerCase());
}

export function categoryFromSlug(slug: string): string | undefined {
  return categorySlugs.get(slug.toLowerCase());
}

export const bankSlugList = Array.from(bankSlugs.keys());
export const categorySlugList = Array.from(categorySlugs.keys());

/** Parse a source date, returning null for missing or unparseable values. */
export function parseDate(value?: string | null): Date | null {
  if (!isMeaningful(value)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * An offer is expired only when it has a parseable end date in the past.
 * Offers with no stated end date are treated as still running, matching how the
 * banks publish open-ended promotions.
 */
export function isExpired(offer: Offer, now: Date = startOfToday()): boolean {
  const end = resolveEndDate(offer, now, parseDate).date;
  return end !== null && end < now;
}

/**
 * The end date to display, which may have been recovered from the offer copy
 * when the extractor left the field null. Null means the bank never published
 * one, and the UI says so rather than implying the offer is current.
 */
export function endDateOf(offer: Offer, now: Date = startOfToday()): Date | null {
  return resolveEndDate(offer, now, parseDate).date;
}

export function daysUntilExpiry(offer: Offer, now: Date = startOfToday()): number | null {
  const end = endDateOf(offer, now);
  if (!end) return null;
  const diff = Math.ceil((end.getTime() - now.getTime()) / 86_400_000);
  return diff >= 0 ? diff : 0;
}

/**
 * Live offers: real promotions that have not lapsed. Placeholder rows the
 * crawler mistook for offers are dropped here so they cannot reach any page,
 * listing, sitemap or count.
 */
export function getActiveOffers(now: Date = startOfToday()): Offer[] {
  return allOffers.filter((offer) => offer?.id && !isPlaceholderOffer(offer) && !isExpired(offer, now));
}

export function getOfferById(id: string): Offer | undefined {
  return allOffers.find((offer) => offer.id === id);
}

export function getOffersByBank(bank: string, offers: Offer[] = getActiveOffers()): Offer[] {
  return offers.filter((offer) => offer.bank === bank);
}

export function getOffersByCategory(category: string, offers: Offer[] = getActiveOffers()): Offer[] {
  return offers.filter((offer) => offer.category === category);
}

/** Offers in the same category (or from the same bank) used for internal linking. */
export function getRelatedOffers(offer: Offer, limit = 6): Offer[] {
  const active = getActiveOffers().filter((candidate) => candidate.id !== offer.id);
  const sameCategoryAndBank = active.filter((c) => c.category === offer.category && c.bank === offer.bank);
  const sameCategory = active.filter((c) => c.category === offer.category && c.bank !== offer.bank);
  const sameBank = active.filter((c) => c.bank === offer.bank && c.category !== offer.category);
  return [...sameCategoryAndBank, ...sameCategory, ...sameBank].slice(0, limit);
}

/** Sort weight so that the biggest, soonest-expiring discounts surface first. */
export function discountWeight(offer: Offer): number {
  const details = offer?.offer_details;
  if (!details) return 0;
  if (details.type === 'percentage') return details.value ?? 0;
  if (details.type === 'bogo') return 50;
  if (details.type === 'fixed') return (details.value ?? 0) / 1000;
  return 0;
}

export function sortOffers(offers: Offer[]): Offer[] {
  return [...offers].sort((a, b) => {
    const daysA = daysUntilExpiry(a);
    const daysB = daysUntilExpiry(b);
    if (daysA !== null && daysB !== null && daysA !== daysB) return daysA - daysB;
    if (daysA !== null && daysB === null) return -1;
    if (daysA === null && daysB !== null) return 1;
    return discountWeight(b) - discountWeight(a);
  });
}

const localeTags: Record<Locale, string> = { en: 'en-GB', si: 'si-LK', ta: 'ta-LK' };

function formatDateObject(locale: Locale, date: Date, style: 'long' | 'short'): string {
  return new Intl.DateTimeFormat(localeTags[locale], {
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatDate(locale: Locale, value?: string | null, style: 'long' | 'short' = 'long'): string | null {
  const date = parseDate(value);
  return date ? formatDateObject(locale, date, style) : null;
}

/**
 * The offer's end date, including one recovered from its copy. Prefer this over
 * formatDate(locale, offer.validity?.end_date) — the raw field is null on offers
 * whose end date the extractor missed but the description states plainly.
 */
export function formatEndDate(locale: Locale, offer: Offer, style: 'long' | 'short' = 'long'): string | null {
  const end = endDateOf(offer);
  return end ? formatDateObject(locale, end, style) : null;
}

export function formatNumber(locale: Locale, value: number): string {
  return new Intl.NumberFormat(localeTags[locale]).format(value);
}

/**
 * A short, localized description of the discount ("20% OFF", "20% වට්ටමක්").
 * Returns null when the feed gave us nothing usable.
 */
export function formatDiscount(locale: Locale, offer: Offer): string | null {
  const dict = getDictionary(locale);
  const details = offer.offer_details;
  if (!details) return null;
  if (details.type === 'percentage' && details.value) return dict.offer.percentOff(details.value);
  if (details.type === 'bogo') return dict.offer.bogo;
  if (details.type === 'fixed' && details.value) {
    return dict.offer.saveAmount(details.currency || 'LKR', formatNumber(locale, details.value));
  }
  return null;
}

export function merchantName(locale: Locale, offer: Offer): string {
  const name = offer.merchant?.name;
  return isMeaningful(name) ? name : translateBank(locale, offer.bank);
}

export function cardTypesLabel(locale: Locale, offer: Offer): string {
  const types = (offer.card_types ?? []).filter(isMeaningful);
  if (types.length === 0) return translateCardType(locale, 'Credit Card');
  return types.map((type) => translateCardType(locale, type)).join(', ');
}

/**
 * Compose the localized <title> for an offer page from structured fields, so
 * Sinhala and Tamil pages get genuine localized titles even though the source
 * feed's free text is English only.
 */
export function offerMetaTitle(locale: Locale, offer: Offer): string {
  const dict = getDictionary(locale);
  const discount = formatDiscount(locale, offer);
  const merchant = merchantName(locale, offer);
  const bank = translateBank(locale, offer.bank);
  if (!discount) {
    // No parseable discount — fall back to the source title, which is English.
    return `${offer.title} — ${bank}`;
  }
  return dict.offer.metaTitle({ merchant, discount, bank });
}

export function offerMetaDescription(locale: Locale, offer: Offer): string {
  const dict = getDictionary(locale);
  const discount = formatDiscount(locale, offer) ?? offer.title;
  const until = formatEndDate(locale, offer) ?? dict.offer.validityNotSpecified;
  return dict.offer.metaDescription({
    merchant: merchantName(locale, offer),
    discount,
    bank: translateBank(locale, offer.bank),
    cards: cardTypesLabel(locale, offer),
    until,
    category: translateCategory(locale, offer.category),
  });
}

/** Trim to a length that survives Google's SERP snippet without mid-word cuts. */
export function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
