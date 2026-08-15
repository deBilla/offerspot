/**
 * Banks that have stopped issuing consumer cards in Sri Lanka.
 *
 * A bank leaving the market is not the same as a bank with no current
 * promotions, and the difference matters to a visitor: one is "check back
 * later", the other is "this product no longer exists and here is where your
 * account went". The feed cannot express that — the crawler only ever sees
 * promotion pages, and a bank that has exited simply stops having any — so it
 * is recorded here by hand.
 *
 * These pages are deliberately kept and not redirected. "hsbc credit card
 * offers" is the single largest query cluster reaching this site, and the
 * people searching it are exactly the people who need to be told what
 * happened. Redirecting to the successor would drop the query match and
 * answer a question nobody asked.
 */
export interface DefunctBank {
  /** Bank name exactly as it appears in the offer feed. */
  bank: string;
  /** The bank that took the consumer portfolio on, as it appears in the feed. */
  successor: string;
  /** ISO date the transfer completed. */
  transferredOn: string;
}

export const defunctBanks: DefunctBank[] = [
  {
    // Retail banking — roughly 200,000 customers, including every credit card
    // account — transferred to Nations Trust Bank. hsbc.lk now redirects to
    // business.hsbc.lk and the consumer card pages return 404.
    bank: 'HSBC',
    successor: 'Nations Trust Bank',
    transferredOn: '2026-05-01',
  },
];

const byBank = new Map(defunctBanks.map((entry) => [entry.bank, entry]));

export function defunctBank(bank: string): DefunctBank | undefined {
  return byBank.get(bank);
}

export function isDefunctBank(bank: string): boolean {
  return byBank.has(bank);
}
