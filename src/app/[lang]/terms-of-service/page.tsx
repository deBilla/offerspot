import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LegalPage from '@/app/components/LegalPage';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getTermsOfService } from '@/i18n/legal';
import { buildMetadata, ogImageUrl, ogTextLocale } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return buildMetadata({
    locale: lang,
    path: '/terms-of-service',
    title: dict.legal.termsTitle,
    description: getTermsOfService(lang).intro,
    image: ogImageUrl({
      title: getDictionary(ogTextLocale(lang)).legal.termsTitle,
      subtitle: getDictionary(ogTextLocale(lang)).siteName,
      locale: ogTextLocale(lang),
    }),
    imageAlt: dict.legal.termsTitle,
  });
}

export default async function TermsOfService({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  return (
    <LegalPage
      locale={locale}
      title={getDictionary(locale).legal.termsTitle}
      path="/terms-of-service"
      document={getTermsOfService(locale)}
    />
  );
}
