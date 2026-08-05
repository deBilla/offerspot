'use client';

import Link from 'next/link';
import { localizedPath, type Locale } from '@/i18n/config';
import { translateBank, translateCardType } from '@/i18n/dictionaries';
import { getWalletCopy } from '@/i18n/wallet-copy';
import { useWallet } from '@/app/context/WalletContext';

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

function Chip({
  label,
  count,
  selected,
  onToggle,
}: {
  label: string;
  count?: number;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
        selected
          ? 'border-teal-600 bg-teal-600 text-white shadow-sm'
          : 'border-gray-200 bg-white text-gray-700 hover:border-teal-300 hover:bg-teal-50'
      }`}
    >
      {selected && <CheckIcon />}
      {label}
      {typeof count === 'number' && (
        <span className={selected ? 'text-teal-100' : 'text-gray-400'}>({count})</span>
      )}
    </button>
  );
}

export default function CardWallet({
  locale,
  banks,
  cardTypes,
}: {
  locale: Locale;
  banks: { name: string; count: number }[];
  cardTypes: string[];
}) {
  const copy = getWalletCopy(locale);
  const { wallet, ready, toggleBank, toggleCardType, clear, hasSelection } = useWallet();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 font-semibold text-gray-900">{copy.chooseBanks}</h2>
        <div className="flex flex-wrap gap-2">
          {banks.map((bank) => (
            <Chip
              key={bank.name}
              label={translateBank(locale, bank.name)}
              count={bank.count}
              selected={ready && wallet.banks.includes(bank.name)}
              onToggle={() => toggleBank(bank.name)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-1 font-semibold text-gray-900">{copy.chooseCardTypes}</h2>
        <p className="mb-3 text-sm text-gray-500">{copy.cardTypeHint}</p>
        <div className="flex flex-wrap gap-2">
          {cardTypes.map((cardType) => (
            <Chip
              key={cardType}
              label={translateCardType(locale, cardType)}
              selected={ready && wallet.cardTypes.includes(cardType)}
              onToggle={() => toggleCardType(cardType)}
            />
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3 border-t border-gray-200 pt-6">
        <Link
          href={localizedPath(locale, '/my-offers')}
          aria-disabled={!hasSelection}
          className={`inline-flex items-center rounded-xl px-6 py-3 font-semibold text-white shadow-md transition-all ${
            hasSelection
              ? 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700'
              : 'pointer-events-none bg-gray-300'
          }`}
        >
          {copy.viewMatches}
        </Link>
        {hasSelection && (
          <>
            <button
              type="button"
              onClick={clear}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              {copy.clear}
            </button>
            <span className="text-sm text-gray-500">
              {copy.selectedSummary(wallet.banks.length, wallet.cardTypes.length)}
            </span>
          </>
        )}
      </div>

      <p className="rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-gray-500">{copy.privacyNote}</p>
    </div>
  );
}
