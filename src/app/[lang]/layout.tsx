import type { Metadata } from 'next';
import { Geist, Geist_Mono, Noto_Sans_Sinhala, Noto_Sans_Tamil } from 'next/font/google';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import '../globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JsonLd from '../components/JsonLd';
import { FilterProvider } from '../context/FilterContext';
import { WalletProvider } from '../context/WalletContext';
import { isLocale, localeHtmlLang, localeOgLocale, locales, localizedPath, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { absoluteUrl, alternatesFor, ogImageUrl, ogTextLocale, siteUrl } from '@/lib/seo';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

// Sinhala and Tamil have no coverage in Geist; without these the localized
// pages fall back to whatever the OS happens to ship and frequently render tofu.
const notoSinhala = Noto_Sans_Sinhala({
  variable: '--font-sinhala',
  subsets: ['sinhala'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const notoTamil = Noto_Sans_Tamil({
  variable: '--font-tamil',
  subsets: ['tamil'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const title = `${dict.siteName} | ${dict.pages.homeTitle}`;
  const imageDict = getDictionary(ogTextLocale(lang));
  const image = ogImageUrl({
    title: imageDict.pages.homeTitle,
    subtitle: imageDict.tagline,
    locale: ogTextLocale(lang),
  });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${dict.siteName}`,
    },
    description: dict.metaDescription,
    keywords: dict.keywords,
    applicationName: dict.siteName,
    authors: [{ name: dict.siteName, url: siteUrl }],
    creator: dict.siteName,
    publisher: dict.siteName,
    alternates: alternatesFor(lang, '/'),
    openGraph: {
      title,
      description: dict.metaDescription,
      url: absoluteUrl(localizedPath(lang, '/')),
      siteName: dict.siteName,
      locale: localeOgLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => localeOgLocale[l]),
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: `${dict.siteName} — ${dict.tagline}`, type: 'image/png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: dict.metaDescription,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
        { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      ],
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    formatDetection: { telephone: false },
  };
}

export function generateViewport() {
  return {
    themeColor: '#0f766e',
    width: 'device-width',
    initialScale: 1,
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: dict.siteName,
    alternateName: 'Card Promotions LK',
    url: absoluteUrl(localizedPath(locale, '/')),
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/logo.png'),
      width: 1024,
      height: 1024,
    },
    description: dict.metaDescription,
    areaServed: { '@type': 'Country', name: 'Sri Lanka' },
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: dict.siteName,
    url: absoluteUrl(localizedPath(locale, '/')),
    inLanguage: localeHtmlLang[locale],
    publisher: { '@id': `${siteUrl}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${absoluteUrl(localizedPath(locale, '/search'))}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html
      lang={localeHtmlLang[locale]}
      data-locale={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${notoSinhala.variable} ${notoTamil.variable}`}
    >
      <body className="antialiased">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-teal-700 focus:px-4 focus:py-2 focus:text-white"
        >
          {dict.nav.skipToContent}
        </a>
        <WalletProvider>
          <FilterProvider>
            <Navbar locale={locale} />
            {children}
            <Footer locale={locale} />
          </FilterProvider>
        </WalletProvider>

        <Script src="https://www.googletagmanager.com/gtag/js?id=G-4N0L6X203Z" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4N0L6X203Z');
          `}
        </Script>
      </body>
    </html>
  );
}
