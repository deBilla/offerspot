/**
 * What each bank states you need in order to be given a credit card.
 *
 * This is the site's only hand-maintained dataset. Everything else regenerates
 * from the crawler feed, but eligibility lives on product pages and Key Facts
 * Documents rather than promotion pages, and it changes rarely enough that
 * curation beats extraction.
 *
 * Two rules, because people use this to decide whether to apply:
 *
 *   1. Every figure is quoted from the bank's own page, and `source` links to
 *      it. Nothing here comes from an aggregator or a summary.
 *   2. Where a bank does not publish a figure, the field is null and
 *      `incomeNote` says so. It is never filled with an estimate. "Bank of
 *      Ceylon does not publish a minimum" is useful and true; a plausible
 *      number would be neither.
 *
 * `checked` is the date the page was last read. Criteria move, so the page
 * shows this and tells readers the bank is authoritative.
 */

export interface CardTier {
  name: string;
  /** Credit limit range, where the bank publishes tiers that way. */
  limit?: string;
  /** Minimum monthly income for this tier, where published. */
  income?: string;
  note?: string;
}

export interface BankEligibility {
  /** Bank name exactly as it appears in the offer feed, so pages can link up. */
  bank: string;
  /** Minimum monthly income, verbatim. Null when the bank publishes none. */
  minIncome: string | null;
  /** Anything qualifying the income figure — salary remittance, net vs gross. */
  incomeNote?: string;
  ageRange: string | null;
  residency?: string;
  /** Documents the bank lists for a salaried applicant. */
  documents: string[];
  /** Extra documents for the self-employed, where stated. */
  selfEmployedDocuments?: string[];
  tiers?: CardTier[];
  /** Anything else the bank makes a condition. */
  otherConditions?: string[];
  source: string;
  /** ISO date the source page was last read. */
  checked: string;
}

const CHECKED = '2026-08-16';

export const bankEligibility: BankEligibility[] = [
  {
    bank: 'Commercial Bank',
    minIncome: 'Rs 50,000 per month (gross)',
    // The single most actionable fact found anywhere in this research: moving
    // where your salary lands drops the threshold by a fifth.
    incomeNote:
      'Falls to Rs 40,000 per month if you remit your salary to Commercial Bank. Platinum cards require Rs 125,000 per month.',
    ageRange: '18 and over',
    documents: ['National Identity Card or passport', 'Proof of income'],
    tiers: [{ name: 'Platinum', income: 'Rs 125,000 per month' }],
    source: 'https://www.combank.lk/personal-banking/cards/credit-cards',
    checked: CHECKED,
  },
  {
    bank: 'Nations Trust Bank',
    minIncome: 'LKR 150,000 per month (net)',
    incomeNote:
      'Accountants, finance professionals, IT professionals, engineers and architects need a minimum net income of LKR 200,000. Doctors are assessed on grade and Sri Lanka Medical Council registration.',
    ageRange: '18 and over',
    residency: 'Resident of Sri Lanka',
    documents: [
      'Annual income for the last 2 years',
      'Bank statements for the last 3 months, personal and company',
      'Proof of other income, if any',
      'Billing proof — telephone, water or electricity bill',
    ],
    otherConditions: [
      'No negative CRIB records',
      'Alternative "Credit Plus" route: LKR 200,000 credit turnover from a personal account, or an existing credit card limit of LKR 500,000 at another bank',
      "Card approval is subject to the bank's selection criteria",
    ],
    source: 'https://www.nationstrust.com/personal-banking/platinum-mastercard-credit-card',
    checked: CHECKED,
  },
  {
    bank: "People's Bank",
    minIncome: null,
    incomeNote:
      "People's Bank publishes card tiers by credit limit rather than by required income. Ask the bank what income each limit needs.",
    ageRange: '18 to 65',
    residency: 'Sri Lankan citizens',
    documents: ['National Identity Card or passport', 'Proof of income'],
    tiers: [
      { name: 'Visa / Mastercard Classic', limit: 'Up to Rs 99,000' },
      { name: 'Visa / Mastercard Gold', limit: 'Rs 100,000 – 199,000' },
      { name: 'Visa / Mastercard Platinum', limit: 'Rs 200,000 – 599,000' },
      { name: 'Visa Signature / Mastercard World', limit: 'Rs 600,000 and above' },
      { name: 'Vanitha Vasana Visa Platinum', limit: 'Rs 100,000 and above' },
      { name: 'Elegance Visa Infinite', limit: 'Rs 1,500,000 and above', note: 'By invitation only' },
    ],
    source: 'https://www.peoplesbank.lk/credit-cards/',
    checked: CHECKED,
  },
  {
    bank: 'Bank of Ceylon',
    minIncome: null,
    incomeNote:
      'Bank of Ceylon states only that an applicant must have "independent financial means". It publishes no minimum figure, so ask the bank directly.',
    ageRange: 'Over 18 on the date of application',
    residency:
      'Citizen or resident of Sri Lanka, or a non-resident holding a Non-Resident Foreign Currency or Resident Foreign Currency account',
    documents: [
      'Completed application form',
      'National Identity Card, valid passport or driving licence',
      'Proof of salary or income',
      'Utility bill confirming the residential address, if required',
    ],
    selfEmployedDocuments: ['Copy of business registration', 'Tax receipts, if available'],
    source: 'https://www.boc.lk/personal-banking/cards/information/credit-cards-for-your-information',
    checked: CHECKED,
  },
  {
    bank: 'Hatton National Bank',
    minIncome: null,
    incomeNote:
      'HNB lists the documents it needs but publishes no minimum income on its card pages. Its Key Fact Document, linked from each card, is the place to check.',
    ageRange: null,
    documents: [
      'National Identity Card, driving licence or passport',
      'Billing proof if the address differs from the NIC',
      'Duly filled application form',
      'Three months of recent certified salary slips',
    ],
    selfEmployedDocuments: [
      'Financial statements for the past 3 years, or latest management accounts',
      'Statements showing business transactions credited to another bank',
    ],
    source: 'https://www.hnb.lk/personal/cards/hnb-credit-cards/hnb-visa-gold',
    checked: CHECKED,
  },
  {
    bank: 'DFCC Bank',
    minIncome: null,
    incomeNote:
      'DFCC directs applicants to the eligibility criteria on each individual card page rather than publishing one figure.',
    ageRange: null,
    documents: [
      'Valid ID — NIC, passport, driving licence or other government-issued ID',
      'Proof of residence — utility bill or statement showing your address',
      'Proof of income — payslips, statements or other documentation',
    ],
    source: 'https://www.dfcc.lk/personal-banking/cards/credit-cards/',
    checked: CHECKED,
  },
];

const byBank = new Map(bankEligibility.map((entry) => [entry.bank, entry]));

export function eligibilityFor(bank: string): BankEligibility | undefined {
  return byBank.get(bank);
}

/** Banks that publish a figure, cheapest first — the comparison people want. */
export function banksWithPublishedIncome(): BankEligibility[] {
  return bankEligibility.filter((entry) => entry.minIncome !== null);
}

export function banksWithoutPublishedIncome(): BankEligibility[] {
  return bankEligibility.filter((entry) => entry.minIncome === null);
}

/** The date this dataset was last verified against the banks' own pages. */
export const eligibilityCheckedOn = CHECKED;
