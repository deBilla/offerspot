import type { Metadata } from 'next';
import CardTypeHubPage, { cardTypeHubMetadata } from '@/app/components/CardTypeHubPage';
import { locales } from '@/i18n/config';

const SLUG = 'debit-card-offers';

export const revalidate = 86400;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return cardTypeHubMetadata(lang, SLUG);
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <CardTypeHubPage lang={lang} slug={SLUG} />;
}
