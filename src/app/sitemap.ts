import type { MetadataRoute } from 'next';
import { defaultLocale, localeHtmlLang, locales, localizedPath } from '@/i18n/config';
import { absoluteUrl } from '@/lib/seo';
import {
  allBanks,
  allCategories,
  getActiveOffers,
  getOffersByBank,
  getOffersByCategory,
  slugify,
} from '@/lib/offers';
import { bankCategoryRoutes, cardTypeHubs, getOffersByCardType } from '@/lib/hub-routes';
import { getOffersByTown, townRoutes } from '@/lib/locations';
import { getAllPosts } from '@/lib/posts';
import { parseDate } from '@/lib/offers';
import type { Offer } from '@/types/offer';

export const revalidate = 86400;

/**
 * A sitemap is a statement of what should be indexed, so it lists the
 * aggregation hubs only. Individual offer pages are noindex,follow (see the
 * comment in [lang]/offer/[id]/page.tsx) and are discovered by crawling the
 * hubs — listing them here would contradict their own robots directive and
 * spend crawl budget on ~2,500 URLs we have asked Google to skip.
 *
 * Each URL is emitted once, at its prefix-free English address, carrying the
 * full hreflang set in `alternates.languages` — one entry per page with its
 * language variants attached, rather than three entries competing.
 */
function entry(
  urlPath: string,
  options: {
    lastModified: Date;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
    /** Set false for pages that exist only in English (the blog). */
    localized?: boolean;
  },
): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  if (options.localized !== false) {
    for (const locale of locales) {
      languages[localeHtmlLang[locale]] = absoluteUrl(localizedPath(locale, urlPath));
    }
    languages['x-default'] = absoluteUrl(localizedPath(defaultLocale, urlPath));
  }

  return {
    url: absoluteUrl(localizedPath(defaultLocale, urlPath)),
    lastModified: options.lastModified,
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    ...(Object.keys(languages).length > 0 ? { alternates: { languages } } : {}),
  };
}

/**
 * The most recent real change in a set of offers.
 *
 * Stamping `new Date()` on every entry of every build tells Google that all
 * 41 pages changed today, every day, which is false on almost all of them and
 * teaches the crawler to disregard the field. Deriving it from the offers a
 * page actually lists means lastmod moves when the page moves — which is the
 * freshness signal AI answer engines and Google both reward.
 */
function lastChanged(offers: Offer[], fallback: Date): Date {
  const ceiling = fallback.getTime();
  let newest = 0;
  for (const offer of offers) {
    const start = parseDate(offer.validity?.start_date)?.getTime();
    // Promotions are routinely published with a start date weeks out. That is
    // a date the page will matter, not a date it changed, so anything in the
    // future is ignored — a lastmod ahead of today is self-evidently wrong and
    // invites Google to distrust the whole field.
    if (start && start <= ceiling && start > newest) newest = start;
  }
  // Nothing usable: fall back rather than claim the epoch.
  return newest > 0 ? new Date(newest) : fallback;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Only live offers are listed. Expired ones are noindex on the page itself,
  // so advertising them here would just contradict the page-level directive.
  const offers = getActiveOffers();

  const staticEntries: MetadataRoute.Sitemap = [
    entry('/', { lastModified: now, changeFrequency: 'daily', priority: 1 }),
    entry('/banks', { lastModified: now, changeFrequency: 'weekly', priority: 0.8 }),
    entry('/categories', { lastModified: now, changeFrequency: 'weekly', priority: 0.8 }),
    entry('/locations', { lastModified: lastChanged(offers, now), changeFrequency: 'weekly', priority: 0.8 }),
    // English-only, like the posts it lists.
    entry('/blog', { lastModified: now, changeFrequency: 'monthly', priority: 0.4, localized: false }),
    entry('/privacy-policy', { lastModified: now, changeFrequency: 'yearly', priority: 0.2 }),
    entry('/terms-of-service', { lastModified: now, changeFrequency: 'yearly', priority: 0.2 }),
  ];

  // Card-type hubs, listed only while they actually have offers — an empty one
  // is noindex on the page itself.
  const cardTypeEntries: MetadataRoute.Sitemap = cardTypeHubs
    .filter((hub) => getOffersByCardType(hub.cardType, offers).length > 0)
    .map((hub) =>
      entry(`/${hub.slug}`, {
        lastModified: lastChanged(getOffersByCardType(hub.cardType, offers), now),
        changeFrequency: 'daily',
        priority: 0.9,
      }),
    );

  // Town hubs. Gated on offer count in townRoutes(), so an empty or thin town
  // never appears here.
  const locationEntries: MetadataRoute.Sitemap = townRoutes(offers).map((route) =>
    entry(`/locations/${route.slug}`, {
      lastModified: lastChanged(getOffersByTown(route.town, offers), now),
      changeFrequency: 'daily',
      priority: 0.8,
    }),
  );

  // Bank x category intersections that cleared the offer-count threshold.
  const bankCategoryEntries: MetadataRoute.Sitemap = bankCategoryRoutes(offers).map((route) =>
    entry(`/bank/${route.bankSlug}/${route.categorySlug}`, {
      lastModified: lastChanged(
        getOffersByBank(route.bank, getOffersByCategory(route.category, offers)),
        now,
      ),
      changeFrequency: 'daily',
      priority: 0.7,
    }),
  );

  const bankEntries: MetadataRoute.Sitemap = allBanks
    .filter((bank) => getOffersByBank(bank, offers).length > 0)
    .map((bank) =>
      entry(`/bank/${slugify(bank)}`, {
        lastModified: lastChanged(getOffersByBank(bank, offers), now),
        changeFrequency: 'daily',
        priority: 0.8,
      }),
    );

  const categoryEntries: MetadataRoute.Sitemap = allCategories
    .filter((category) => getOffersByCategory(category, offers).length > 0)
    .map((category) =>
      entry(`/categories/${slugify(category)}`, {
        lastModified: lastChanged(getOffersByCategory(category, offers), now),
        changeFrequency: 'daily',
        priority: 0.8,
      }),
    );

  const blogEntries: MetadataRoute.Sitemap = getAllPosts().map((post) =>
    entry(`/blog/post/${post.slug}`, {
      lastModified: post.modified,
      changeFrequency: 'monthly',
      priority: 0.5,
      // Posts are written in English only; the /si and /ta variants serve the
      // same English article, so they are noindex and not advertised here.
      localized: false,
    }),
  );

  return [
    ...staticEntries,
    ...cardTypeEntries,
    ...locationEntries,
    ...categoryEntries,
    ...bankEntries,
    ...bankCategoryEntries,
    ...blogEntries,
  ];
}
