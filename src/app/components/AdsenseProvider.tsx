// components/AdSenseProvider.tsx
"use client";
import Script from "next/script";

export default function AdSenseProvider() {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4067803003775557"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
