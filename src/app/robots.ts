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
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
