import Link from 'next/link';
import { defaultLocale, localizedPath } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

/**
 * not-found.tsx cannot read route params, so it renders in the default locale.
 * It still returns a real HTTP 404, which is the part that matters for SEO.
 */
export default function NotFound() {
  const dict = getDictionary(defaultLocale);

  return (
    <main id="main-content" className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md text-center">
        <p className="text-6xl font-extrabold text-teal-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">{dict.notFound.title}</h1>
        <p className="mt-2 leading-relaxed text-gray-600">{dict.notFound.body}</p>
        <Link
          href={localizedPath(defaultLocale, '/')}
          className="mt-6 inline-flex items-center rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-teal-600 hover:to-blue-700"
        >
          {dict.notFound.cta}
        </Link>
      </div>
    </main>
  );
}
