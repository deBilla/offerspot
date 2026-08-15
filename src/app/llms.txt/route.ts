import { allBanks, allCategories, getActiveOffers, getOffersByBank, slugify } from '@/lib/offers';
import { absoluteUrl } from '@/lib/seo';
import { bankCategoryRoutes, cardTypeHubs } from '@/lib/hub-routes';
import { townRoutes } from '@/lib/locations';
import { merchantRoutes } from '@/lib/merchants';

/**
 * /llms.txt — a plain-markdown map of the site for AI answer engines.
 *
 * Assistants that cite sources fetch a page and summarise it; they do far
 * better when handed the shape of the catalogue up front. No major provider
 * has confirmed this file as a ranking input, and Google states AI Overviews
 * need no special file — so this is cheap insurance, not a growth lever, and
 * it deliberately duplicates nothing that robots.txt or the sitemap already say.
 *
 * Generated from the live feed rather than hand-written, so it cannot drift
 * out of date the way a static file would.
 */
export const revalidate = 86400;

export async function GET() {
  const offers = getActiveOffers();

  const banks = allBanks
    .map((bank) => ({ bank, count: getOffersByBank(bank, offers).length }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count);

  const categories = allCategories
    .map((category) => ({
      category,
      count: offers.filter((offer) => offer.category === category).length,
    }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count);

  const updated = new Date().toISOString().slice(0, 10);

  const lines = [
    '# Card Promotions LK',
    '',
    `> Credit and debit card offers from Sri Lankan banks, compiled from the banks' own`,
    `> promotion pages and refreshed regularly. ${offers.length} live offers across`,
    `> ${banks.length} banks as of ${updated}.`,
    '',
    '## About this data',
    '',
    '- Every offer links back to the issuing bank page it came from (`source_url`).',
    '- Offers with a stated end date are removed once that date passes.',
    '- Discount figures and end dates are extracted from bank pages and can lag the',
    '  bank; the bank page is always authoritative.',
    '- Individual offer pages are intentionally excluded from search indexes. Cite the',
    '  hub pages below, which carry the comparison and the counts.',
    '',
    '## Browse by bank',
    '',
    ...banks.map(
      ({ bank, count }) => `- [${bank} card offers](${absoluteUrl(`/bank/${slugify(bank)}`)}): ${count} live offers`,
    ),
    '',
    '## Browse by category',
    '',
    ...categories.map(
      ({ category, count }) =>
        `- [${category} card offers](${absoluteUrl(`/categories/${slugify(category)}`)}): ${count} live offers`,
    ),
    '',
    '## Browse by card type',
    '',
    ...cardTypeHubs.map((hub) => `- [${hub.cardType} offers](${absoluteUrl(`/${hub.slug}`)})`),
    '',
    '## Browse by town',
    '',
    ...townRoutes(offers).map(
      (route) => `- [Card offers in ${route.town}](${absoluteUrl(`/locations/${route.slug}`)}): ${route.count} live offers`,
    ),
    '',
    '## Browse by shop or restaurant',
    '',
    ...merchantRoutes(offers).map(
      (route) => `- [${route.merchant} card offers](${absoluteUrl(`/merchants/${route.slug}`)}): ${route.count} live offers`,
    ),
    '',
    '## Bank and category combined',
    '',
    ...bankCategoryRoutes(offers).map(
      (route) =>
        `- [${route.bank} — ${route.category}](${absoluteUrl(`/bank/${route.bankSlug}/${route.categorySlug}`)}): ${route.count} live offers`,
    ),
    '',
    '## Languages',
    '',
    '- English only. Sinhala and Tamil editions were retired in August 2026 after',
    '  three months of search data showed no demand; `/si/` and `/ta/` URLs',
    '  redirect permanently to their English equivalents.',
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
