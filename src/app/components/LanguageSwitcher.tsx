'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { localeNames, locales, localizedPath, stripLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

const GlobeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    <path d="M2 12h20" />
  </svg>
);

/**
 * Switches locale while staying on the same page.
 *
 * The list is always present in the server HTML and only toggled with CSS, so
 * the locale links are real, crawlable <a> hrefs rather than markup that only
 * appears after a click. The <head> hreflang tags say the same thing, but a
 * crawler that never runs the dropdown still finds its way between languages.
 */
export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() || '/';
  const dict = getDictionary(locale);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // The pathname the router reports already contains the /en prefix injected by
  // the proxy rewrite, so strip whatever prefix is there to get the canonical path.
  const { path } = stripLocale(pathname);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={dict.nav.language}
      >
        <GlobeIcon />
        <span className="hidden sm:inline">{localeNames[locale]}</span>
        <span className="sm:hidden uppercase">{locale}</span>
      </button>

      <ul
        className={`absolute right-0 z-50 mt-1 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg ${
          open ? 'block' : 'hidden'
        }`}
        role="menu"
        aria-hidden={!open}
      >
        {locales.map((candidate) => (
          <li key={candidate} role="none">
            <Link
              href={localizedPath(candidate, path)}
              hrefLang={candidate}
              role="menuitem"
              onClick={() => setOpen(false)}
              aria-current={candidate === locale ? 'true' : undefined}
              className={`block px-4 py-2 text-sm transition-colors hover:bg-teal-50 ${
                candidate === locale ? 'font-semibold text-teal-700' : 'text-gray-700'
              }`}
            >
              {localeNames[candidate]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
