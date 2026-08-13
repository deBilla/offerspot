import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // The OG endpoint must stay crawlable: social scrapers fetch it to build
        // link previews. Listing it before the /api/ disallow keeps that path
        // open while the rest of /api stays closed.
        allow: ['/', '/api/og'],
        // Internal search results are noindex at the page level; keeping crawlers
        // out of them too saves crawl budget on a site with ~850 offer pages.
        disallow: ['/search', '/si/search', '/ta/search', '/api/'],
      },
      /*
       * Retrieval crawlers for AI answer engines, allowed explicitly.
       *
       * These fetch a page to answer a live question and cite it, which is a
       * traffic source — distinct from the training-corpus crawlers (GPTBot,
       * ClaudeBot, Google-Extended) that take content without linking back.
       * The wildcard above already permits them; naming them means a future
       * decision to block training crawlers cannot silently take the citation
       * traffic with it.
       */
      {
        userAgent: ['OAI-SearchBot', 'PerplexityBot', 'ChatGPT-User', 'Perplexity-User'],
        allow: ['/'],
        disallow: ['/search', '/si/search', '/ta/search', '/api/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
