import Breadcrumbs from './Breadcrumbs';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { LEGAL_LAST_UPDATED, type LegalDocument } from '@/i18n/legal';
import { formatDate } from '@/lib/offers';

export default function LegalPage({
  locale,
  title,
  path,
  document,
}: {
  locale: Locale;
  title: string;
  path: string;
  document: LegalDocument;
}) {
  const dict = getDictionary(locale);
  const crumbs = [
    { name: dict.breadcrumb.home, path: '/' },
    { name: title, path },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-3xl px-4 py-6 sm:py-10">
        <Breadcrumbs locale={locale} items={crumbs} />
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">
          {dict.legal.lastUpdated(formatDate(locale, LEGAL_LAST_UPDATED) ?? LEGAL_LAST_UPDATED)}
        </p>

        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="leading-relaxed text-gray-700">{document.intro}</p>

          {document.sections.map((section) => (
            <section key={section.heading} className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900">{section.heading}</h2>
              {section.body.map((paragraph, index) => (
                <p key={index} className="mt-2 leading-relaxed text-gray-600">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
