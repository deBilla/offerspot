'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'cplk.wallet.v1';

export interface Wallet {
  /** Source-data bank names, e.g. "Commercial Bank". */
  banks: string[];
  /** Source-data card types, e.g. "Credit Card". Empty means "any". */
  cardTypes: string[];
}

const EMPTY: Wallet = { banks: [], cardTypes: [] };

interface WalletContextValue {
  wallet: Wallet;
  /** False until the stored value has been read, so the UI can avoid flashing. */
  ready: boolean;
  toggleBank: (bank: string) => void;
  toggleCardType: (cardType: string) => void;
  clear: () => void;
  hasSelection: boolean;
}

const WalletContext = createContext<WalletContextValue | null>(null);

function read(): Wallet {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Wallet>;
    return {
      banks: Array.isArray(parsed.banks) ? parsed.banks.filter((v) => typeof v === 'string') : [],
      cardTypes: Array.isArray(parsed.cardTypes) ? parsed.cardTypes.filter((v) => typeof v === 'string') : [],
    };
  } catch {
    // Corrupt or unavailable storage (private mode, quota) must not break the page.
    return EMPTY;
  }
}

/**
 * The visitor's own cards, held in localStorage.
 *
 * Deliberately account-free: the selection is not personal data we want to
 * hold, and requiring a sign-in would kill the one feature that differentiates
 * this site from the banks' own promotion pages.
 */
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<Wallet>(EMPTY);
  const [ready, setReady] = useState(false);

  // Read after mount so the server and first client render agree.
  useEffect(() => {
    setWallet(read());
    setReady(true);
  }, []);

  const persist = useCallback((next: Wallet) => {
    setWallet(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Selection still applies for this session even if it cannot be saved.
    }
  }, []);

  const toggleBank = useCallback(
    (bank: string) =>
      persist({
        ...wallet,
        banks: wallet.banks.includes(bank) ? wallet.banks.filter((b) => b !== bank) : [...wallet.banks, bank],
      }),
    [wallet, persist],
  );

  const toggleCardType = useCallback(
    (cardType: string) =>
      persist({
        ...wallet,
        cardTypes: wallet.cardTypes.includes(cardType)
          ? wallet.cardTypes.filter((c) => c !== cardType)
          : [...wallet.cardTypes, cardType],
      }),
    [wallet, persist],
  );

  const clear = useCallback(() => persist(EMPTY), [persist]);

  const value = useMemo(
    () => ({ wallet, ready, toggleBank, toggleCardType, clear, hasSelection: wallet.banks.length > 0 }),
    [wallet, ready, toggleBank, toggleCardType, clear],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}

/** True when an offer is usable with at least one card in the wallet. */
export function walletMatches(
  wallet: Wallet,
  offer: { bank: string; card_types?: string[] | null },
): boolean {
  if (wallet.banks.length > 0 && !wallet.banks.includes(offer.bank)) return false;
  if (wallet.cardTypes.length === 0) return true;
  const offerTypes = offer.card_types ?? [];
  // An offer that names no card type applies to the bank's cards generally.
  if (offerTypes.length === 0) return true;
  return offerTypes.some((type) => wallet.cardTypes.includes(type));
}
