import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LegalPage from '@/app/components/LegalPage';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getPrivacyPolicy } from '@/i18n/legal';
import { buildMetadata, ogImageUrl, ogTextLocale } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return buildMetadata({
    locale: lang,
    path: '/privacy-policy',
    title: dict.legal.privacyTitle,
    description: getPrivacyPolicy(lang).intro,
    image: ogImageUrl({
      title: getDictionary(ogTextLocale(lang)).legal.privacyTitle,
      subtitle: getDictionary(ogTextLocale(lang)).siteName,
      locale: ogTextLocale(lang),
    }),
    imageAlt: dict.legal.privacyTitle,
  });
}

export default async function PrivacyPolicy({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  return (
    <LegalPage
      locale={locale}
      title={getDictionary(locale).legal.privacyTitle}
      path="/privacy-policy"
      document={getPrivacyPolicy(locale)}
    />
  );
}
