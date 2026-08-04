import { permanentRedirect } from 'next/navigation';
import { localizedPath, resolveLocale } from '@/i18n/config';

/**
 * /offers used to render exactly the same component and data as the homepage,
 * which split ranking signals between two duplicate URLs. It now consolidates
 * onto "/" with a 308 so any existing links and index entries carry over.
 */
export default async function OffersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  permanentRedirect(localizedPath(resolveLocale(lang), '/'));
}
