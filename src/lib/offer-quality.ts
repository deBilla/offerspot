import type { Offer } from '@/types/offer';

/**
 * Defensive data-quality layer over the crawler feed.
 *
 * The extraction pipeline is LLM-based and imperfect: it emits navigation stubs
 * as if they were offers, and it frequently leaves `validity.end_date` null even
 * when the page states an end date in prose. The site must not present those as
 * live promotions, so every rule here is applied at read time and works on
 * whatever data.json happens to contain.
 *
 * The upstream fixes belong in the crawler's extraction prompt; this layer is
 * the seatbelt, not the fix.
 */

/** How long an offer with a start date but no end date stays listed. */
const OPEN_ENDED_MAX_AGE_DAYS = 365;

/**
 * Descriptions that are navigation chrome rather than an offer. These are whole-
 * string matches so a real description merely containing "offer details" survives.
 */
const STUB_DESCRIPTION =
  /^\s*(?:view\s+(?:the\s+)?(?:offer\s+)?details?(?:\s+of\s+this\s+offer)?|offer\s+details?|best\s+offer|read\s+more|click\s+here|n\/?a)\s*[.!]?\s*$/i;

/** Pages that explicitly announce there is nothing on offer. */
const NO_OFFER_NOTICE = /\bno\s+offers?\s+available\b|\bthere\s+are\s+no\s+offers\b/i;

/**
 * A record that is not actually a promotion — a "No Offers Available" notice or
 * a listing stub whose description is just a call to action.
 */
export function isPlaceholderOffer(offer: Offer): boolean {
  const title = offer.title ?? '';
  const description = offer.description ?? '';
  if (NO_OFFER_NOTICE.test(`${title} ${description}`)) return true;
  return STUB_DESCRIPTION.test(description);
}

const MONTHS: Record<string, number> = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
  may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7, sep: 8, sept: 8,
  september: 8, oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11,
};

const MONTH_NAMES = Object.keys(MONTHS).join('|');

// "25th September 2025", "2 April", "September 25, 2025", "1 Apr 2026"
const DAY_FIRST = new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${MONTH_NAMES})\\b(?:\\s*,?\\s*(\\d{4}))?`, 'gi');
const MONTH_FIRST = new RegExp(`\\b(${MONTH_NAMES})\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b(?:\\s*,?\\s*(\\d{4}))?`, 'gi');

function utcDate(year: number, month: number, day: number): Date | null {
  const date = new Date(Date.UTC(year, month, day));
  if (date.getUTCMonth() !== month || date.getUTCDate() !== day) return null;
  return date;
}

/**
 * Every date mentioned in a fragment. A trailing year applies to earlier dates
 * that omit one — "19th March & 2nd April 2026" is two dates in 2026, which is
 * how the banks write multi-day promotions.
 */
function datesIn(text: string, fallbackYear: number): Date[] {
  const trailingYear = [...text.matchAll(/\b(20\d{2})\b/g)].pop();
  const year = trailingYear ? Number(trailingYear[1]) : fallbackYear;

  const found: Date[] = [];
  for (const [, day, month, explicitYear] of text.matchAll(DAY_FIRST)) {
    const date = utcDate(explicitYear ? Number(explicitYear) : year, MONTHS[month.toLowerCase()], Number(day));
    if (date) found.push(date);
  }
  for (const [, month, day, explicitYear] of text.matchAll(MONTH_FIRST)) {
    const date = utcDate(explicitYear ? Number(explicitYear) : year, MONTHS[month.toLowerCase()], Number(day));
    if (date) found.push(date);
  }
  return found;
}

/**
 * Recover an end date the extractor left null but that the copy states outright.
 *
 * Two shapes cover what the feed actually contains:
 *   "Validity: From April 1, 2026 to April 2, 2026"   (People's Bank descriptions)
 *   "Offer valid on 25th September 2025"              (Commercial Bank terms)
 *
 * "valid FROM <date>" is deliberately excluded — that is a start date, and
 * reading it as an end date would expire open-ended offers on their first day.
 */
export function inferEndDateFromText(offer: Offer, now: Date): Date | null {
  const haystacks = [offer.description, offer.terms].filter((text): text is string => !!text);
  const candidates: Date[] = [];

  for (const text of haystacks) {
    const validity = text.match(/validity\s*:?\s*\(?\s*([^)]*?)(?:\)|\s*Location\s*:|\s*Terms\b|$)/i);
    if (validity?.[1]) candidates.push(...datesIn(validity[1], now.getUTCFullYear()));

    // "valid on/till/until/through <date>" — note the absence of "from".
    for (const match of text.matchAll(/\bvalid(?:\s+\w+){0,2}?\s+(?:on|till|until|thru|through|to)\s+([^.;,]{0,40})/gi)) {
      candidates.push(...datesIn(match[1], now.getUTCFullYear()));
    }
    for (const match of text.matchAll(/\b(?:expires?|ends?)\s+(?:on\s+)?([^.;,]{0,40})/gi)) {
      candidates.push(...datesIn(match[1], now.getUTCFullYear()));
    }
  }

  if (candidates.length === 0) return null;
  // The promotion runs until the last date it mentions.
  return new Date(Math.max(...candidates.map((date) => date.getTime())));
}

export type EndDateSource = 'feed' | 'text' | 'stale-start';

export interface ResolvedEndDate {
  date: Date | null;
  source: EndDateSource | null;
}

/**
 * The end date the site should act on, preferring the feed's own value, then a
 * date stated in the copy, then an age cutoff for offers that only ever gave a
 * start date. Returns null when the feed genuinely says nothing — those stay
 * listed and are labelled as having no published end date.
 */
export function resolveEndDate(
  offer: Offer,
  now: Date,
  parse: (value?: string | null) => Date | null,
): ResolvedEndDate {
  const fromFeed = parse(offer.validity?.end_date);
  if (fromFeed) return { date: fromFeed, source: 'feed' };

  const fromText = inferEndDateFromText(offer, now);
  if (fromText) return { date: fromText, source: 'text' };

  // An offer that opened over a year ago and never published an end date has
  // almost certainly lapsed; the 2022 "0% Easy Payment Plan" records are these.
  const start = parse(offer.validity?.start_date);
  if (start) {
    const ageDays = (now.getTime() - start.getTime()) / 86_400_000;
    if (ageDays > OPEN_ENDED_MAX_AGE_DAYS) return { date: start, source: 'stale-start' };
  }

  return { date: null, source: null };
}
