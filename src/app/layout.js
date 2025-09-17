import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const websiteUrl = "https://www.cardpromotions.org";

export const metadata = {
  metadataBase: new URL(websiteUrl),
  title: {
    default: "Card Promotions LK | Find the Best Card Offers in Sri Lanka",
    template: "%s | Card Promotions LK",
  },
  description:
    "Your ultimate guide to the latest credit and debit card promotions, offers, and discounts in Sri Lanka. Save on dining, shopping, travel, and more.",
  keywords: [
    "credit card offers sri lanka",
    "debit card promotions",
    "bank offers",
    "card promotions lk",
    "sri lanka discounts",
    "dining offers",
    "shopping deals",
    "travel promotions",
  ],
  authors: [{ name: "Card Promotions LK Team", url: websiteUrl }],
  creator: "Card Promotions LK Team",
  publisher: "Card Promotions LK",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
    "x-default": "/",
  },
  openGraph: {
    title: "Card Promotions LK | Find the Best Card Offers in Sri Lanka",
    description:
      "Your ultimate guide to the latest credit and debit card promotions, offers, and discounts in Sri Lanka.",
    url: websiteUrl,
    siteName: "Card Promotions LK",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Card Promotions in Sri Lanka",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Card Promotions LK | Find the Best Card Offers in Sri Lanka",
    description:
      "Your ultimate guide to the latest credit and debit card promotions, offers, and discounts in Sri Lanka.",
    images: ["/twitter-image.png"],
    creator: "@YourTwitterHandle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${websiteUrl}/site.webmanifest`,
};

export function generateViewport() {
  return {
    themeColor: "#ffffff",
    width: "device-width",
    initialScale: 1,
  };
}

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Card Promotions LK",
    url: websiteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${websiteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4N0L6X203Z"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4N0L6X203Z');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Script
          id="ld-json"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}