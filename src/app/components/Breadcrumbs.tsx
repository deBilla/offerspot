import Link from 'next/link';
import { localizedPath, type Locale } from '@/i18n/config';

export interface Crumb {
  name: string;
  /** Prefix-free canonical path, e.g. "/categories/dining-restaurants". */
  path: string;
}

/**
 * Visible breadcrumb trail. Pair it with breadcrumbJsonLd() from lib/seo so the
 * markup Google reads matches what the user sees.
 */
export default function Breadcrumbs({ locale, items }: { locale: Locale; items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="line-clamp-1 font-medium text-gray-700">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={localizedPath(locale, item.path)} className="transition-colors hover:text-teal-700">
                    {item.name}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
