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
import { getAllPosts } from '@/lib/posts';

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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Only live offers are listed. Expired ones are noindex on the page itself,
  // so advertising them here would just contradict the page-level directive.
  const offers = getActiveOffers();

  const staticEntries: MetadataRoute.Sitemap = [
    entry('/', { lastModified: now, changeFrequency: 'daily', priority: 1 }),
    entry('/banks', { lastModified: now, changeFrequency: 'weekly', priority: 0.8 }),
    entry('/categories', { lastModified: now, changeFrequency: 'weekly', priority: 0.8 }),
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
      entry(`/${hub.slug}`, { lastModified: now, changeFrequency: 'daily', priority: 0.9 }),
    );

  // Bank x category intersections that cleared the offer-count threshold.
  const bankCategoryEntries: MetadataRoute.Sitemap = bankCategoryRoutes(offers).map((route) =>
    entry(`/bank/${route.bankSlug}/${route.categorySlug}`, {
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    }),
  );

  const bankEntries: MetadataRoute.Sitemap = allBanks
    .filter((bank) => getOffersByBank(bank, offers).length > 0)
    .map((bank) =>
      entry(`/bank/${slugify(bank)}`, {
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.8,
      }),
    );

  const categoryEntries: MetadataRoute.Sitemap = allCategories
    .filter((category) => getOffersByCategory(category, offers).length > 0)
    .map((category) =>
      entry(`/categories/${slugify(category)}`, {
        lastModified: now,
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
    ...categoryEntries,
    ...bankEntries,
    ...bankCategoryEntries,
    ...blogEntries,
  ];
}
