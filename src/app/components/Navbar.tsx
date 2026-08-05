'use client';

import Link from 'next/link';
import { useFilterContext } from '@/app/context/FilterContext';
import { localizedPath, type Locale } from '@/i18n/config';
import { getDictionary, translateCategory } from '@/i18n/dictionaries';
import LanguageSwitcher from './LanguageSwitcher';
import { getWalletCopy } from '@/i18n/wallet-copy';
import { useWallet } from '@/app/context/WalletContext';

const CreditCardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
    aria-hidden="true"
  >
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const XIcon = () => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const WalletIcon = () => (
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
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4Z" />
  </svg>
);

const CardStackIcon = () => (
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
    <rect width="18" height="12" x="3" y="8" rx="2" />
    <path d="M6 8V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6" />
    <path d="M3 13h18" />
  </svg>
);

export default function Navbar({ locale }: { locale: Locale }) {
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, selectedBanks, setIsBankModalOpen, meta } =
    useFilterContext();
  const dict = getDictionary(locale);
  const walletCopy = getWalletCopy(locale);
  const { wallet, ready, hasSelection } = useWallet();
  const hasFilters = meta.categories.length > 1;

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-3">
          <Link
            href={localizedPath(locale, '/')}
            className="flex shrink-0 items-center gap-2 text-lg font-extrabold text-teal-700"
          >
            <span className="rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 p-1.5 text-white">
              <CreditCardIcon />
            </span>
            <span className="hidden bg-gradient-to-r from-teal-700 to-blue-700 bg-clip-text text-transparent sm:inline">
              {dict.siteName}
            </span>
          </Link>

          {hasFilters && (
            <>
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <SearchIcon />
                </span>
                <input
                  type="search"
                  placeholder={dict.nav.searchPlaceholder}
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-8 text-sm text-gray-900 transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-teal-500"
                  aria-label={dict.nav.searchAriaLabel}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                    aria-label={dict.nav.clearSearch}
                  >
                    <XIcon />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsBankModalOpen(true)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all ${
                  selectedBanks.length > 0
                    ? 'bg-teal-600 hover:bg-teal-700'
                    : 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700'
                }`}
                aria-label={dict.nav.banksAriaLabel(selectedBanks.length)}
              >
                <WalletIcon />
                <span className="hidden sm:inline">{dict.nav.banks}</span>
                {selectedBanks.length > 0 && (
                  <span className="rounded-md bg-white/30 px-1.5 py-0.5 text-xs font-bold">{selectedBanks.length}</span>
                )}
              </button>
            </>
          )}

          <Link
            href={localizedPath(locale, hasSelection ? '/my-offers' : '/my-cards')}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-2.5 py-2 text-sm font-medium transition-colors ${
              ready && hasSelection
                ? 'border-teal-600 bg-teal-50 text-teal-700'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CardStackIcon />
            <span className="hidden md:inline">{walletCopy.navLabel}</span>
            {ready && hasSelection && (
              <span className="rounded-md bg-teal-600 px-1.5 py-0.5 text-xs font-bold text-white">
                {wallet.banks.length}
              </span>
            )}
          </Link>

          <LanguageSwitcher locale={locale} />
        </div>

        {hasFilters && (
          <div className="pb-2.5">
            <div className="hide-scrollbar flex gap-2 overflow-x-auto">
              {meta.categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                  }`}
                  aria-pressed={selectedCategory === category}
                >
                  {category === 'All' ? dict.all : translateCategory(locale, category)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
