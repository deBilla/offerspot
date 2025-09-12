// app/sitemap.xml/route.js
import { NextResponse } from 'next/server';
import data from '../src/app/api/data.json';

export async function GET() {
  const baseUrl = 'https://www.cardpromotions.org';
  const currentDate = new Date().toISOString();
  
  // Get unique banks and categories from offers
  const banks = [...new Set(data.map(offer => offer.bank))];
  const categories = [...new Set(data.map(offer => offer.category))];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

  <!-- Main Pages -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/offers</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/banks</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/categories</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Individual Offers -->
  ${data.map(offer => `
  <url>
    <loc>${baseUrl}/offer/${offer.id}</loc>
    <lastmod>${offer.validity?.end_date ? new Date(offer.validity.end_date).toISOString() : currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${baseUrl}/api/og?title=${encodeURIComponent(offer.title)}&amp;bank=${encodeURIComponent(offer.bank)}</image:loc>
      <image:caption>${offer.title} - ${offer.bank} Card Offer</image:caption>
    </image:image>
  </url>`).join('')}

  <!-- Bank Pages -->
  ${banks.map(bank => `
  <url>
    <loc>${baseUrl}/bank/${encodeURIComponent(bank.toLowerCase().replace(/\s+/g, '-'))}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}

  <!-- Category Pages -->
  ${categories.map(category => `
  <url>
    <loc>${baseUrl}/category/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}

  <!-- Location-based pages for major cities -->
  <url>
    <loc>${baseUrl}/offers/colombo</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/offers/kandy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/offers/galle</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>

</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}