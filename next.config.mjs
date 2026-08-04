/** @type {import('next').NextConfig} */
const nextConfig = {
  // The OG image route reads the Noto .ttf files from disk at request time, so
  // they have to be traced into the deployment bundle explicitly.
  outputFileTracingIncludes: {
    '/api/og': ['./src/assets/fonts/**'],
  },

  async redirects() {
    return [
      // The old sitemap advertised /category/<slug>, but the route has always
      // been /categories/<slug>. Anything indexed under the old path now lands
      // on the real page instead of a 404.
      { source: '/category/:id', destination: '/categories/:id', permanent: true },
      { source: '/si/category/:id', destination: '/si/categories/:id', permanent: true },
      { source: '/ta/category/:id', destination: '/ta/categories/:id', permanent: true },

      // Location URLs the old sitemap advertised but that were never built.
      { source: '/offers/:city(colombo|kandy|galle)', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
