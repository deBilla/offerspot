'use client';

import Link from 'next/link';
import { useFilterContext } from '@/app/context/FilterContext';

const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4Z" />
  </svg>
);

export default function Navbar() {
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, selectedBanks, setIsBankModalOpen, meta } = useFilterContext();
  const hasFilters = meta.categories.length > 1;

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Main row: Logo + Search + Banks */}
        <div className="flex items-center gap-3 h-16">
          <Link href="/" className="flex items-center gap-2 text-teal-700 font-extrabold text-lg shrink-0">
            <span className="bg-gradient-to-br from-teal-500 to-blue-600 text-white rounded-lg p-1.5">
              <CreditCardIcon />
            </span>
            <span className="hidden sm:inline bg-gradient-to-r from-teal-700 to-blue-700 bg-clip-text text-transparent">
              Card Promotions LK
            </span>
            <span className="sm:hidden bg-gradient-to-r from-teal-700 to-blue-700 bg-clip-text text-transparent">
              CP LK
            </span>
          </Link>

          {hasFilters && (
            <>
              {/* Search input */}
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Search offers, merchants, banks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm text-gray-900 bg-gray-50 focus:bg-white"
                  aria-label="Search card offers and merchants"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <XIcon />
                  </button>
                )}
              </div>

              {/* Banks button */}
              <button
                onClick={() => setIsBankModalOpen(true)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 font-semibold rounded-xl shadow-sm transition-all text-sm ${
                  selectedBanks.length > 0
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white'
                }`}
                aria-label={`Filter by banks. Currently ${selectedBanks.length} banks selected`}
              >
                <WalletIcon />
                <span className="hidden sm:inline">Banks</span>
                {selectedBanks.length > 0 && (
                  <span className="bg-white/30 rounded-md px-1.5 py-0.5 text-xs font-bold">{selectedBanks.length}</span>
                )}
              </button>
            </>
          )}
        </div>

        {/* Category pills row */}
        {hasFilters && (
          <div className="pb-2.5">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {meta.categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                  }`}
                  aria-pressed={selectedCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
