'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Offer } from '@/types/offer';
import { useFilterContext } from '@/app/context/FilterContext';
import { localizedPath, type Locale } from '@/i18n/config';
import { getDictionary, translateBank, translateCategory } from '@/i18n/dictionaries';
import {
  daysUntilExpiry,
  discountWeight,
  formatDiscount,
  formatEndDate,
  isMeaningful,
  merchantName,
} from '@/lib/offers';

const useIsMobile = (breakpoint = 768): boolean => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < breakpoint);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [breakpoint]);
  return isMobile;
};

const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-1.5 inline-block h-4 w-4 shrink-0"
    aria-hidden="true"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const TagIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-1.5 inline-block h-4 w-4 shrink-0"
    aria-hidden="true"
  >
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>
);
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-1.5 inline-block h-4 w-4 shrink-0"
    aria-hidden="true"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);
const CreditCardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2 h-5 w-5"
    aria-hidden="true"
  >
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
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
    className="h-5 w-5"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
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
const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="ml-1 inline-block h-4 w-4 opacity-70 group-hover:opacity-100"
    aria-hidden="true"
  >
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
);
const SparkleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-1 h-4 w-4 shrink-0"
    aria-hidden="true"
  >
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </svg>
);
const LoadingSpinnerIcon = () => (
  <svg className="h-8 w-8 animate-spin text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const bankDetails: Record<string, { color: string; textColor: string; accent: string }> = {
  "People's Bank": {
    color: 'from-blue-600 via-blue-700 to-indigo-800',
    textColor: 'text-white',
    accent: 'bg-blue-50 border-blue-200 text-blue-800',
  },
  'Commercial Bank': {
    color: 'from-red-600 via-rose-600 to-pink-700',
    textColor: 'text-white',
    accent: 'bg-red-50 border-red-200 text-red-800',
  },
  HNB: {
    color: 'from-amber-500 via-yellow-500 to-orange-600',
    textColor: 'text-gray-900',
    accent: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  },
  'Bank of Ceylon': {
    color: 'from-yellow-400 via-amber-400 to-yellow-500',
    textColor: 'text-gray-900',
    accent: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  },
  'Sampath Bank': {
    color: 'from-emerald-600 via-green-600 to-teal-700',
    textColor: 'text-white',
    accent: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  },
  'DFCC Bank': {
    color: 'from-purple-600 via-violet-600 to-indigo-700',
    textColor: 'text-white',
    accent: 'bg-purple-50 border-purple-200 text-purple-800',
  },
  HSBC: {
    color: 'from-rose-600 via-red-600 to-rose-800',
    textColor: 'text-white',
    accent: 'bg-rose-50 border-rose-200 text-rose-800',
  },
};

const getBankBadgeColor = (bank: string): string =>
  bankDetails[bank]?.accent || 'bg-gray-100 border-gray-200 text-gray-800';

interface BankInfo {
  name: string;
  count: number;
}

const OfferCard = ({
  offer,
  locale,
  isExpanded,
  onExpand,
}: {
  offer: Offer;
  locale: Locale;
  isExpanded: boolean;
  onExpand: (id: string) => void;
}) => {
  const dict = getDictionary(locale);
  if (!offer?.id) return null;

  const { id, bank, category, title, description, terms, source_url } = offer;
  const merchant = merchantName(locale, offer);
  const address = offer.location?.address;
  const hasAddress = isMeaningful(address) && address !== 'Online Booking';
  const lat = offer.location?.latitude;
  const lng = offer.location?.longitude;
  const daysLeft = daysUntilExpiry(offer);
  const discount = formatDiscount(locale, offer);
  const validUntil = formatEndDate(locale, offer, 'short');
  const googleMapsUrl = lat && lng ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative flex-grow p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${getBankBadgeColor(bank)}`}
            >
              <SparkleIcon />
              {translateBank(locale, bank) || dict.browse.unknownBank}
            </span>
            {daysLeft !== null && daysLeft <= 30 && (
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  daysLeft <= 7
                    ? 'border border-red-200 bg-red-100 text-red-700'
                    : 'border border-amber-200 bg-amber-100 text-amber-700'
                }`}
              >
                {daysLeft === 0 ? dict.browse.expiresToday : dict.browse.daysLeft(daysLeft)}
              </span>
            )}
          </div>
          {discount && (
            <div className="shrink-0 text-right text-lg font-bold leading-tight text-green-600">{discount}</div>
          )}
        </div>

        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">{merchant}</p>
        <Link href={localizedPath(locale, `/offer/${id}`)} className="group/link mt-2 block">
          {/* Source feed text is English whatever the page locale is. */}
          <h3
            lang="en"
            className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors group-hover/link:text-teal-700"
          >
            {title || dict.browse.untitledOffer}
          </h3>
        </Link>
        <p lang="en" className="line-clamp-2 text-sm leading-relaxed text-gray-600">
          {description || dict.browse.noDescription}
        </p>
      </div>

      <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white px-6 py-4">
        <div className="space-y-3 text-sm">
          <div className="flex items-center text-gray-700">
            <TagIcon />
            <span className="font-medium">
              {category ? translateCategory(locale, category) : dict.browse.uncategorized}
            </span>
          </div>
          <div className="flex items-center text-gray-700">
            <CalendarIcon />
            {/* Without the guard this reads "Valid until: validity not specified",
                which is redundant and wraps to two lines in si/ta. */}
            {validUntil ? (
              <span>
                {dict.browse.validUntil}: <span className="font-medium">{validUntil}</span>
              </span>
            ) : (
              <span className="text-gray-500">{dict.offer.validityNotSpecified}</span>
            )}
          </div>
          {hasAddress ? (
            googleMapsUrl ? (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center text-blue-600 transition-colors hover:text-blue-800 hover:underline"
              >
                <MapPinIcon />
                <span className="line-clamp-1">{address}</span>
                <ExternalLinkIcon />
              </a>
            ) : (
              <div className="flex items-center text-gray-700">
                <MapPinIcon />
                <span className="line-clamp-1">{address}</span>
              </div>
            )
          ) : (
            <div className="flex items-center text-gray-700">
              <MapPinIcon />
              <span>{dict.browse.onlineOrMultiple}</span>
            </div>
          )}
        </div>

        {(isMeaningful(terms) || (source_url && source_url !== '#')) && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={() => onExpand(id)}
              aria-expanded={isExpanded}
              className="flex items-center text-sm font-medium text-teal-600 transition-colors hover:text-teal-800"
            >
              {isExpanded ? dict.browse.hideTerms : dict.browse.showTerms}
              <svg
                className={`ml-1 h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isExpanded && (
              <div className="animate-in slide-in-from-top mt-3 space-y-3 text-sm">
                {isMeaningful(terms) && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="mb-2 font-medium text-gray-900">{dict.offer.termsAndConditions}:</p>
                    <p lang="en" className="text-gray-700">
                      {terms}
                    </p>
                  </div>
                )}
                <Link
                  href={localizedPath(locale, `/offer/${id}`)}
                  className="inline-flex items-center rounded-lg bg-teal-600 px-4 py-2 font-medium text-white transition-colors hover:bg-teal-700"
                >
                  {dict.browse.visitOfferPage}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

const BankCard = ({
  bank,
  locale,
  isSelected,
  onSelect,
}: {
  bank: BankInfo;
  locale: Locale;
  isSelected: boolean;
  onSelect: (name: string) => void;
}) => {
  const dict = getDictionary(locale);
  const details = bankDetails[bank.name] || { color: 'from-gray-500 to-gray-700', textColor: 'text-white' };
  return (
    <button
      type="button"
      onClick={() => onSelect(bank.name)}
      className={`group relative w-full overflow-hidden rounded-xl p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isSelected ? 'scale-105 ring-4 ring-teal-500 ring-offset-2' : ''
      } bg-gradient-to-br ${details.color} ${details.textColor}`}
      aria-pressed={isSelected}
    >
      <div className="absolute inset-0 bg-black opacity-0 transition-opacity group-hover:opacity-10" />
      <div className="relative flex items-center justify-between">
        <div className="text-left">
          <h3 className="mb-1 text-lg font-bold">{translateBank(locale, bank.name)}</h3>
          <p className="text-sm opacity-90">
            {bank.count} {bank.count === 1 ? dict.banks.offerSingular : dict.banks.offerPlural}
          </p>
        </div>
        <CreditCardIcon />
      </div>
      {isSelected && (
        <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white">
          <svg className="h-4 w-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </button>
  );
};

const BankSelectionModal = ({
  banks,
  locale,
  selectedBanks,
  onSelect,
  onClose,
  onClear,
}: {
  banks: BankInfo[];
  locale: Locale;
  selectedBanks: string[];
  onSelect: (name: string) => void;
  onClose: () => void;
  onClear: () => void;
}) => {
  const dict = getDictionary(locale);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredBanks = useMemo(
    () =>
      banks.filter((bank) =>
        [bank.name, translateBank(locale, bank.name)].some((name) =>
          name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      ),
    [banks, searchTerm, locale],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="animate-in zoom-in w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
        <div className="rounded-t-2xl border-b border-gray-200 bg-gradient-to-r from-teal-50 to-green-50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">{dict.banks.modalTitle}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label={dict.browse.hideTerms}
            >
              <XIcon />
            </button>
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </span>
            <input
              type="search"
              placeholder={dict.banks.searchPlaceholder}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-xl border border-gray-300 py-2.5 pl-11 pr-4 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-teal-500"
            />
          </div>
          {selectedBanks.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">{dict.banks.selectedCount(selectedBanks.length)}</div>
          )}
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {filteredBanks.map((bank) => (
              <BankCard
                key={bank.name}
                bank={bank}
                locale={locale}
                isSelected={selectedBanks.includes(bank.name)}
                onSelect={onSelect}
              />
            ))}
          </div>
          {filteredBanks.length === 0 && (
            <div className="py-12 text-center">
              <div className="mb-2 flex justify-center text-gray-400">
                <SearchIcon />
              </div>
              <h3 className="mb-1 text-lg font-medium text-gray-900">{dict.banks.noBanksTitle}</h3>
              <p className="text-gray-500">{dict.banks.noBanksBody}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 rounded-b-2xl border-t border-gray-200 bg-gray-50 p-6 sm:flex-row">
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            disabled={selectedBanks.length === 0}
          >
            {dict.banks.clearAll}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 px-8 py-3 font-semibold text-white shadow-md transition-all hover:from-teal-600 hover:to-blue-700 hover:shadow-lg sm:w-auto"
          >
            {dict.banks.showOffers(selectedBanks.length)}
          </button>
        </div>
      </div>
    </div>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  locale,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  locale: Locale;
}) => {
  const dict = getDictionary(locale);
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | string)[] => {
    const pages = new Set<number>([1, totalPages, currentPage]);
    if (currentPage > 1) pages.add(currentPage - 1);
    if (currentPage < totalPages) pages.add(currentPage + 1);

    const result: (number | string)[] = [];
    let last = 0;
    for (const page of Array.from(pages).sort((a, b) => a - b)) {
      if (last && last < page - 1) result.push('…');
      result.push(page);
      last = page;
    }
    return result;
  };

  return (
    <nav aria-label={dict.browse.pagination} className="my-8 flex justify-center sm:my-12">
      <ul className="flex h-10 -space-x-px items-center text-base">
        <li>
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="ml-0 flex h-10 items-center justify-center rounded-l-lg border border-gray-300 bg-white px-4 leading-tight text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {dict.browse.previous}
          </button>
        </li>
        {getPageNumbers().map((page, index) => (
          <li key={`${page}-${index}`}>
            {page === '…' ? (
              <span className="flex h-10 items-center justify-center border border-gray-300 bg-white px-4 leading-tight text-gray-500">
                …
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onPageChange(page as number)}
                aria-current={currentPage === page ? 'page' : undefined}
                className={`flex h-10 items-center justify-center border px-4 leading-tight transition-colors ${
                  currentPage === page
                    ? 'border-teal-600 bg-teal-600 text-white hover:bg-teal-700'
                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex h-10 items-center justify-center rounded-r-lg border border-gray-300 bg-white px-4 leading-tight text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {dict.browse.next}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default function OfferBrowser({
  offers,
  locale,
  heading,
}: {
  /** Already scoped and sorted server-side (e.g. only one bank's offers). */
  offers: Offer[];
  locale: Locale;
  heading: string;
}) {
  const dict = getDictionary(locale);
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedBanks,
    setSelectedBanks,
    isBankModalOpen,
    setIsBankModalOpen,
    setMeta,
  } = useFilterContext();
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = 9;
  const isMobile = useIsMobile();
  const loaderRef = useRef<HTMLDivElement>(null);

  const { banks, categories, sortedOffers, totalPages, displayedOffers } = useMemo(() => {
    const bankCounts = offers.reduce<Record<string, number>>((acc, offer) => {
      if (offer.bank) acc[offer.bank] = (acc[offer.bank] || 0) + 1;
      return acc;
    }, {});
    const banks: BankInfo[] = Object.entries(bankCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const categories = [
      'All',
      ...Array.from(new Set(offers.map((offer) => offer.category).filter(isMeaningful))).sort(),
    ];

    const term = searchTerm.trim().toLowerCase();
    const filtered = offers.filter((offer) => {
      const bankMatch = selectedBanks.length === 0 || selectedBanks.includes(offer.bank);
      const categoryMatch = selectedCategory === 'All' || offer.category === selectedCategory;
      const searchMatch =
        !term ||
        [
          offer.title,
          offer.description,
          offer.bank,
          offer.category,
          offer.terms,
          offer.merchant?.name,
          offer.location?.address,
          translateBank(locale, offer.bank),
          translateCategory(locale, offer.category),
        ].some((value) => typeof value === 'string' && value.toLowerCase().includes(term));
      return bankMatch && categoryMatch && searchMatch;
    });

    const sorted = [...filtered].sort((a, b) => {
      const daysA = daysUntilExpiry(a);
      const daysB = daysUntilExpiry(b);
      if (daysA !== null && daysB !== null && daysA !== daysB) return daysA - daysB;
      if (daysA !== null && daysB === null) return -1;
      if (daysA === null && daysB !== null) return 1;
      return discountWeight(b) - discountWeight(a);
    });

    const totalPages = Math.max(1, Math.ceil(sorted.length / offersPerPage));
    const lastIndex = currentPage * offersPerPage;
    const displayed = isMobile ? sorted.slice(0, lastIndex) : sorted.slice(lastIndex - offersPerPage, lastIndex);

    return { banks, categories, sortedOffers: sorted, totalPages, displayedOffers: displayed };
  }, [offers, selectedBanks, selectedCategory, searchTerm, currentPage, isMobile, locale]);

  useEffect(() => {
    setMeta({ categories, banks, resultsCount: sortedOffers.length });
  }, [categories, banks, sortedOffers.length, setMeta]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBanks, selectedCategory, searchTerm, isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && currentPage < totalPages) setCurrentPage((page) => page + 1);
      },
      { threshold: 1.0 },
    );
    const loader = loaderRef.current;
    if (loader) observer.observe(loader);
    return () => {
      if (loader) observer.unobserve(loader);
    };
  }, [isMobile, currentPage, totalPages]);

  const handleBankSelect = (bankName: string) =>
    setSelectedBanks((prev) => (prev.includes(bankName) ? prev.filter((b) => b !== bankName) : [...prev, bankName]));

  const handleCardExpand = (offerId: string) =>
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(offerId)) next.delete(offerId);
      else next.add(offerId);
      return next;
    });

  const activeHeading = searchTerm.trim()
    ? dict.browse.searchResults(searchTerm.trim())
    : selectedCategory !== 'All'
      ? dict.browse.categoryOffers(translateCategory(locale, selectedCategory))
      : heading;

  const hasActiveFilters = Boolean(searchTerm) || selectedCategory !== 'All' || selectedBanks.length > 0;
  const clearAll = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedBanks([]);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-teal-700 to-blue-800 py-2.5">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-4 px-4 text-sm text-white sm:gap-8">
          <div className="flex items-center gap-1.5">
            <SparkleIcon />
            <span className="font-semibold">{sortedOffers.length}</span>
            <span className="text-blue-200">{dict.stats.offers}</span>
          </div>
          <div className="h-4 w-px bg-white/30" />
          <div className="flex items-center gap-1.5">
            <CreditCardIcon />
            <span className="font-semibold">{banks.length}</span>
            <span className="text-blue-200">{dict.stats.banks}</span>
          </div>
          <div className="h-4 w-px bg-white/30" />
          <div className="flex items-center gap-1.5">
            <TagIcon />
            <span className="font-semibold">{Math.max(0, categories.length - 1)}</span>
            <span className="text-blue-200">{dict.stats.categories}</span>
          </div>
          {hasActiveFilters && (
            <>
              <div className="h-4 w-px bg-white/30" />
              <button
                type="button"
                onClick={clearAll}
                className="flex items-center gap-1 text-xs text-blue-200 transition-colors hover:text-white"
              >
                <XIcon /> {dict.stats.clearFilters}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {isBankModalOpen && (
          <BankSelectionModal
            banks={banks}
            locale={locale}
            selectedBanks={selectedBanks}
            onSelect={handleBankSelect}
            onClose={() => setIsBankModalOpen(false)}
            onClear={() => setSelectedBanks([])}
          />
        )}

        {displayedOffers.length > 0 ? (
          <section aria-labelledby="offers-heading">
            <h2 id="offers-heading" className="mb-5 text-xl font-bold text-gray-800 sm:mb-7 sm:text-2xl">
              {activeHeading}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {displayedOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  locale={locale}
                  isExpanded={expandedCards.has(offer.id)}
                  onExpand={handleCardExpand}
                />
              ))}
            </div>
            {isMobile ? (
              currentPage < totalPages && (
                <div ref={loaderRef} className="flex items-center justify-center p-8">
                  <LoadingSpinnerIcon />
                </div>
              )
            ) : (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                locale={locale}
              />
            )}
          </section>
        ) : (
          <section className="py-16 text-center sm:py-24" aria-label={dict.browse.noOffersTitle}>
            <div className="mx-auto max-w-sm">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <SearchIcon />
              </div>
              <h2 className="mb-2 text-xl font-bold text-gray-800">{dict.browse.noOffersTitle}</h2>
              <p className="mb-6 text-sm text-gray-500">{dict.browse.noOffersBody}</p>
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
              >
                {dict.browse.clearAllFilters}
              </button>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
