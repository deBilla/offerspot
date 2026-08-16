import type { Locale } from './config';

/**
 * Every user-facing string on the site. Offer titles/descriptions/terms come
 * from the bank source feeds and stay in their original language — they are
 * rendered with an explicit lang="en" so assistive tech and search engines are
 * not misled by the surrounding page language.
 */
export interface Dictionary {
  siteName: string;
  tagline: string;
  metaDescription: string;
  keywords: string[];

  nav: {
    searchPlaceholder: string;
    searchAriaLabel: string;
    clearSearch: string;
    banks: string;
    banksAriaLabel: (count: number) => string;
    language: string;
    skipToContent: string;
  };

  stats: {
    offers: string;
    banks: string;
    categories: string;
    clearFilters: string;
  };

  browse: {
    latestOffers: string;
    categoryOffers: (category: string) => string;
    bankOffers: (bank: string) => string;
    searchResults: (term: string) => string;
    noOffersTitle: string;
    noOffersBody: string;
    clearAllFilters: string;
    showTerms: string;
    hideTerms: string;
    visitOfferPage: string;
    validUntil: string;
    onlineOrMultiple: string;
    uncategorized: string;
    unknownBank: string;
    untitledOffer: string;
    noDescription: string;
    expiresToday: string;
    daysLeft: (days: number) => string;
    previous: string;
    next: string;
    pagination: string;
    offerCount: (count: number) => string;
  };

  offer: {
    backToOffers: string;
    bankAndCard: string;
    validityPeriod: string;
    validityNotSpecified: string;
    validFromTo: (from: string, to: string) => string;
    offerDescription: string;
    termsAndConditions: string;
    noTerms: string;
    viewOriginal: string;
    merchant: string;
    category: string;
    location: string;
    expiredTitle: string;
    expiredBody: string;
    percentOff: (value: number) => string;
    bogo: string;
    saveAmount: (currency: string, value: string) => string;
    upTo: string;
    maxDiscount: (amount: string) => string;
    validDays: string;
    sourceNote: string;
    relatedOffers: string;
    metaTitle: (args: { merchant: string; discount: string; bank: string }) => string;
    metaDescription: (args: {
      merchant: string;
      discount: string;
      bank: string;
      cards: string;
      until: string;
      category: string;
    }) => string;
  };

  banks: {
    modalTitle: string;
    searchPlaceholder: string;
    noBanksTitle: string;
    noBanksBody: string;
    clearAll: string;
    showOffers: (count: number) => string;
    selectedCount: (count: number) => string;
    offerSingular: string;
    offerPlural: string;
  };

  footer: {
    heading: string;
    body: string;
    quickLinks: string;
    allOffers: string;
    diningDeals: string;
    shoppingDiscounts: string;
    topBankPromotions: string;
    ourPlatform: string;
    banksCovered: (count: number) => string;
    offersLive: (count: number) => string;
    merchants: (count: number) => string;
    happySaving: string;
    rights: string;
    privacyPolicy: string;
    termsOfService: string;
    disclaimer: string;
  };

  pages: {
    offersTitle: string;
    offersDescription: string;
    banksTitle: string;
    banksDescription: string;
    categoriesTitle: string;
    categoriesDescription: string;
    searchTitle: string;
    searchDescription: string;
    homeTitle: string;
    bankPageTitle: (bank: string) => string;
    bankPageDescription: (args: { bank: string; count: number; categories: string }) => string;
    /** Shown on the hub of a bank that has left the consumer market. */
    bankClosedHeading: (bank: string) => string;
    bankClosedBody: (args: { bank: string; successor: string; date: string }) => string;
    bankClosedCta: (successor: string) => string;
    bankClosedTitle: (bank: string) => string;
    locationsTitle: string;
    locationsDescription: string;
    locationPageTitle: (town: string) => string;
    merchantsTitle: string;
    merchantsDescription: string;
    merchantPageTitle: (merchant: string) => string;
    eligibilityTitle: string;
    eligibilityDescription: string;
    eligibilityIntro: (count: number) => string;
    eligibilityPublishedHeading: string;
    eligibilityUnpublishedHeading: string;
    eligibilityNotPublished: string;
    eligibilityDocumentsHeading: string;
    eligibilitySelfEmployedHeading: string;
    eligibilityTiersHeading: string;
    eligibilityConditionsHeading: string;
    eligibilityAge: string;
    eligibilityResidency: string;
    eligibilityMinIncome: string;
    eligibilitySource: string;
    eligibilityChecked: (date: string) => string;
    eligibilityDisclaimer: string;
    eligibilityViewOffers: (bank: string) => string;
    merchantPageDescription: (args: { merchant: string; count: number; banks: string }) => string;
    locationPageDescription: (args: { town: string; count: number; categories: string }) => string;
    bankClosedDescription: (args: { bank: string; successor: string }) => string;
    categoryPageTitle: (category: string) => string;
    categoryPageDescription: (args: { category: string; count: number; banks: string }) => string;
    cardTypePageTitle: (cardType: string) => string;
    cardTypePageDescription: (args: { cardType: string; count: number; banks: string }) => string;
    bankCategoryPageTitle: (args: { bank: string; category: string }) => string;
    bankCategoryPageDescription: (args: { bank: string; category: string; count: number }) => string;
    blogTitle: string;
    blogDescription: string;
  };

  notFound: {
    title: string;
    body: string;
    cta: string;
  };

  legal: {
    privacyTitle: string;
    termsTitle: string;
    lastUpdated: (date: string) => string;
  };

  breadcrumb: {
    home: string;
    offers: string;
    banks: string;
    categories: string;
    blog: string;
  };

  /** Category names as they appear in the source data. */
  categories: Record<string, string>;
  /** Bank names as they appear in the source data. */
  banks_names: Record<string, string>;
  cardTypes: Record<string, string>;
  all: string;
}

const en: Dictionary = {
  siteName: 'Card Promotions LK',
  tagline: "Sri Lanka's best credit & debit card offers",
  metaDescription:
    'Your ultimate guide to the latest credit and debit card promotions, offers and discounts in Sri Lanka. Save on dining, shopping, travel and more.',
  keywords: [
    'credit card offers sri lanka',
    'debit card promotions',
    'bank offers sri lanka',
    'card promotions lk',
    'sri lanka discounts',
    'dining offers',
    'shopping deals',
    'travel promotions',
  ],
  nav: {
    searchPlaceholder: 'Search offers, merchants, banks…',
    searchAriaLabel: 'Search card offers and merchants',
    clearSearch: 'Clear search',
    banks: 'Banks',
    banksAriaLabel: (count) => `Filter by banks. Currently ${count} banks selected`,
    language: 'Language',
    skipToContent: 'Skip to content',
  },
  stats: {
    offers: 'Offers',
    banks: 'Banks',
    categories: 'Categories',
    clearFilters: 'Clear filters',
  },
  browse: {
    latestOffers: 'Latest Offers',
    categoryOffers: (category) => `${category} Offers`,
    bankOffers: (bank) => `${bank} Offers`,
    searchResults: (term) => `Results for “${term}”`,
    noOffersTitle: 'No offers found',
    noOffersBody: 'Try adjusting your filters or search terms.',
    clearAllFilters: 'Clear all filters',
    showTerms: 'Show Terms & Details',
    hideTerms: 'Hide Details',
    visitOfferPage: 'Visit Offer Page',
    validUntil: 'Valid until',
    onlineOrMultiple: 'Online / Multiple Locations',
    uncategorized: 'Uncategorized',
    unknownBank: 'Unknown Bank',
    untitledOffer: 'Untitled Offer',
    noDescription: 'No description available.',
    expiresToday: 'Expires today!',
    daysLeft: (days) => `${days} days left`,
    previous: 'Previous',
    next: 'Next',
    pagination: 'Pagination',
    offerCount: (count) => `${count} ${count === 1 ? 'offer' : 'offers'}`,
  },
  offer: {
    backToOffers: 'Back to offers',
    bankAndCard: 'Bank & Card Details',
    validityPeriod: 'Validity Period',
    validityNotSpecified: 'Validity not specified',
    validFromTo: (from, to) => `From ${from} to ${to}`,
    offerDescription: 'Offer Description',
    termsAndConditions: 'Terms & Conditions',
    noTerms: 'No terms provided.',
    viewOriginal: 'View Original Offer',
    merchant: 'Merchant',
    category: 'Category',
    location: 'Location',
    expiredTitle: 'This offer has expired',
    expiredBody: 'The validity period for this promotion has passed. Browse current offers instead.',
    percentOff: (value) => `${value}% OFF`,
    bogo: 'Buy One Get One',
    saveAmount: (currency, value) => `Save ${currency} ${value}`,
    upTo: 'Up to',
    maxDiscount: (amount) => `Maximum discount ${amount}`,
    validDays: 'Valid on',
    sourceNote: 'Offer details are published by the bank in English.',
    relatedOffers: 'More offers you may like',
    metaTitle: ({ merchant, discount, bank }) => `${discount} at ${merchant} with ${bank} Cards`,
    metaDescription: ({ merchant, discount, bank, cards, until, category }) =>
      `Get ${discount} at ${merchant} with ${bank} ${cards}. ${category} offer valid until ${until}. See full terms on Card Promotions LK.`,
  },
  banks: {
    modalTitle: 'Select Your Banks',
    searchPlaceholder: 'Search banks…',
    noBanksTitle: 'No banks found',
    noBanksBody: 'Try adjusting your search terms',
    clearAll: 'Clear All',
    showOffers: (count) => (count > 0 ? `Show ${count} bank offers` : 'Show all offers'),
    selectedCount: (count) => `${count} bank${count !== 1 ? 's' : ''} selected`,
    offerSingular: 'offer',
    offerPlural: 'offers',
  },
  footer: {
    heading: 'Unlock Savings in Sri Lanka',
    body: 'Your go-to platform for discovering the latest credit and debit card promotions from all major banks in Sri Lanka.',
    quickLinks: 'Quick Links',
    allOffers: 'All Offers',
    diningDeals: 'Dining Deals',
    shoppingDiscounts: 'Shopping Discounts',
    topBankPromotions: 'Top Bank Promotions',
    ourPlatform: 'Our Platform',
    banksCovered: (count) => `${count}+ Banks Covered`,
    offersLive: (count) => `${count}+ Offers Live`,
    merchants: (count) => `${count}+ Merchants`,
    happySaving: 'Happy saving!',
    rights: 'All Rights Reserved.',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    disclaimer:
      'Card Promotions LK is an independent aggregator and is not affiliated with any bank. Always confirm offer details with the issuing bank before you spend.',
  },
  pages: {
    offersTitle: 'All Card Offers in Sri Lanka',
    offersDescription:
      'Browse every active credit and debit card promotion in Sri Lanka, updated daily across all major banks.',
    banksTitle: 'Card Offers by Bank',
    banksDescription:
      'Compare current credit and debit card promotions from every major bank in Sri Lanka, side by side.',
    categoriesTitle: 'Card Offers by Category',
    categoriesDescription:
      'Find card promotions by category — dining, shopping, travel, groceries, health and more.',
    searchTitle: 'Search Card Offers',
    searchDescription: 'Search current credit and debit card promotions in Sri Lanka by merchant, bank or keyword.',
    homeTitle: 'Find the Best Card Offers in Sri Lanka',
    bankPageTitle: (bank) => `${bank} Card Offers & Promotions`,
    bankPageDescription: ({ bank, count, categories }) =>
      `${count} current ${bank} credit and debit card offers in Sri Lanka, covering ${categories}. Updated daily.`,
    bankClosedHeading: (bank) => `${bank} no longer issues personal cards in Sri Lanka`,
    bankClosedBody: ({ bank, successor, date }) =>
      `${bank} sold its Sri Lankan retail banking business to ${successor} on ${date}. Personal accounts and credit cards — around 200,000 of them — moved across, so cards that were ${bank} branded are now serviced by ${successor}. ${bank} still operates in Sri Lanka for business and corporate banking only.`,
    bankClosedCta: (successor) => `See current ${successor} card offers`,
    bankClosedTitle: (bank) => `${bank} Credit Card Offers in Sri Lanka — What Happened`,
    bankClosedDescription: ({ bank, successor }) =>
      `${bank} has stopped issuing personal credit and debit cards in Sri Lanka. Its retail banking business, including all card accounts, transferred to ${successor}. Here is what that means for cardholders and where to find current offers.`,
    locationsTitle: 'Card Offers by Location in Sri Lanka',
    locationsDescription: 'Find credit and debit card promotions near you — hotel, dining and shopping offers grouped by town across Sri Lanka.',
    locationPageTitle: (town) => `Card Offers in ${town}`,
    locationPageDescription: ({ town, count, categories }) =>
      `${count} live credit and debit card offers you can use in ${town}, Sri Lanka — covering ${categories}. Updated from the banks' own promotion pages.`,
    merchantsTitle: 'Card Offers by Shop and Restaurant',
    merchantsDescription: 'Which card gets you a discount where you are shopping — bank promotions grouped by merchant across Sri Lanka.',
    merchantPageTitle: (merchant) => `${merchant} Card Offers`,
    merchantPageDescription: ({ merchant, count, banks }) =>
      `${count} live card offers at ${merchant} in Sri Lanka, from ${banks}. Compare which card gives the bigger discount before you pay.`,
    eligibilityTitle: 'Credit Card Eligibility in Sri Lanka — Salary and Requirements by Bank',
    eligibilityDescription:
      'What each Sri Lankan bank actually requires for a credit card: minimum monthly salary, age limits and the documents to bring. Quoted from the banks\u2019 own pages, with sources.',
    eligibilityIntro: (count) =>
      `What ${count} Sri Lankan banks state you need before they will issue you a credit card \u2014 minimum income, age, and the paperwork to bring. Every figure below is quoted from the bank\u2019s own page and linked to it.`,
    eligibilityPublishedHeading: 'Banks that publish a minimum income',
    eligibilityUnpublishedHeading: 'Banks that do not publish a minimum income',
    eligibilityNotPublished: 'Not published',
    eligibilityDocumentsHeading: 'Documents required',
    eligibilitySelfEmployedHeading: 'If you are self-employed',
    eligibilityTiersHeading: 'Card tiers',
    eligibilityConditionsHeading: 'Other conditions',
    eligibilityAge: 'Age',
    eligibilityResidency: 'Residency',
    eligibilityMinIncome: 'Minimum monthly income',
    eligibilitySource: 'Source',
    eligibilityChecked: (date) => `Checked against the bank\u2019s own page on ${date}.`,
    eligibilityDisclaimer:
      'Banks change these criteria without notice, and approval always rests with the bank. Treat this as a starting point and confirm with the bank before applying \u2014 every entry links to the page it came from.',
    eligibilityViewOffers: (bank) => `See current ${bank} card offers`,
    categoryPageTitle: (category) => `${category} Card Offers in Sri Lanka`,
    categoryPageDescription: ({ category, count, banks }) =>
      `${count} current ${category.toLowerCase()} card promotions in Sri Lanka from ${banks}. Updated daily.`,
    cardTypePageTitle: (cardType) => `${cardType} Offers in Sri Lanka`,
    cardTypePageDescription: ({ cardType, count, banks }) =>
      `${count} current ${cardType.toLowerCase()} promotions in Sri Lanka from ${banks}. Compare discounts by merchant and category, updated daily.`,
    bankCategoryPageTitle: ({ bank, category }) => `${bank} ${category} Offers in Sri Lanka`,
    bankCategoryPageDescription: ({ bank, category, count }) =>
      `${count} current ${bank} ${category.toLowerCase()} card promotions in Sri Lanka, with the card types and dates the bank published. Updated daily.`,
    blogTitle: 'Blog',
    blogDescription:
      'Notes on how this site is built — collecting, cleaning and comparing card promotions from Sri Lankan bank websites.',
  },
  notFound: {
    title: 'Page not found',
    body: 'The offer or page you are looking for is no longer available. It may have expired.',
    cta: 'Browse current offers',
  },
  legal: {
    privacyTitle: 'Privacy Policy',
    termsTitle: 'Terms of Service',
    lastUpdated: (date) => `Last updated: ${date}`,
  },
  breadcrumb: {
    home: 'Home',
    offers: 'Offers',
    banks: 'Banks',
    categories: 'Categories',
    blog: 'Blog',
  },
  categories: {
    'Travel & Lodging': 'Travel & Lodging',
    Other: 'Other',
    'Dining & Restaurants': 'Dining & Restaurants',
    'Shopping & Retail': 'Shopping & Retail',
    'Online Shopping': 'Online Shopping',
    'Groceries & Supermarkets': 'Groceries & Supermarkets',
    'Health & Wellness': 'Health & Wellness',
    Fuel: 'Fuel',
    Leisure: 'Leisure',
  },
  banks_names: {
    "People's Bank": "People's Bank",
    'Commercial Bank': 'Commercial Bank',
    'DFCC Bank': 'DFCC Bank',
    'Bank of Ceylon': 'Bank of Ceylon',
    HSBC: 'HSBC',
    'Sampath Bank': 'Sampath Bank',
    HNB: 'HNB',
    'Seylan Bank': 'Seylan Bank',
  },
  cardTypes: {
    'Credit Card': 'Credit Card',
    'Debit Card': 'Debit Card',
  },
  all: 'All',
};

const si: Dictionary = {
  siteName: 'කාඩ්පත් ප්‍රවර්ධන LK',
  tagline: 'ශ්‍රී ලංකාවේ හොඳම ක්‍රෙඩිට් සහ ඩෙබිට් කාඩ්පත් දීමනා',
  metaDescription:
    'ශ්‍රී ලංකාවේ නවතම ක්‍රෙඩිට් සහ ඩෙබිට් කාඩ්පත් ප්‍රවර්ධන, දීමනා සහ වට්ටම් සොයා ගැනීමට ඔබේ සම්පූර්ණ මාර්ගෝපදේශය. ආහාර, සාප්පු සවාරි, ගමන් සහ තවත් බොහෝ දේ සඳහා ඉතිරි කරන්න.',
  keywords: [
    'ක්‍රෙඩිට් කාඩ් දීමනා ශ්‍රී ලංකා',
    'ඩෙබිට් කාඩ් ප්‍රවර්ධන',
    'බැංකු දීමනා',
    'කාඩ්පත් වට්ටම්',
    'ශ්‍රී ලංකා වට්ටම්',
    'ආහාර දීමනා',
    'සාප්පු සවාරි වට්ටම්',
    'ගමන් ප්‍රවර්ධන',
  ],
  nav: {
    searchPlaceholder: 'දීමනා, වෙළෙන්දන්, බැංකු සොයන්න…',
    searchAriaLabel: 'කාඩ්පත් දීමනා සහ වෙළෙන්දන් සොයන්න',
    clearSearch: 'සෙවීම හිස් කරන්න',
    banks: 'බැංකු',
    banksAriaLabel: (count) => `බැංකු අනුව පෙරන්න. දැනට බැංකු ${count}ක් තෝරා ඇත`,
    language: 'භාෂාව',
    skipToContent: 'අන්තර්ගතයට යන්න',
  },
  stats: {
    offers: 'දීමනා',
    banks: 'බැංකු',
    categories: 'ප්‍රවර්ග',
    clearFilters: 'පෙරහන් ඉවත් කරන්න',
  },
  browse: {
    latestOffers: 'නවතම දීමනා',
    categoryOffers: (category) => `${category} දීමනා`,
    bankOffers: (bank) => `${bank} දීමනා`,
    searchResults: (term) => `“${term}” සඳහා ප්‍රතිඵල`,
    noOffersTitle: 'දීමනා හමු නොවීය',
    noOffersBody: 'ඔබේ පෙරහන් හෝ සෙවුම් වචන වෙනස් කර නැවත උත්සාහ කරන්න.',
    clearAllFilters: 'සියලු පෙරහන් ඉවත් කරන්න',
    showTerms: 'නියම සහ විස්තර පෙන්වන්න',
    hideTerms: 'විස්තර සඟවන්න',
    visitOfferPage: 'දීමනා පිටුවට යන්න',
    validUntil: 'වලංගු වන්නේ',
    onlineOrMultiple: 'මාර්ගගත / ස්ථාන කිහිපයක',
    uncategorized: 'ප්‍රවර්ග නොකළ',
    unknownBank: 'නොදන්නා බැංකුව',
    untitledOffer: 'නම් නොකළ දීමනාව',
    noDescription: 'විස්තරයක් නොමැත.',
    expiresToday: 'අද අවසන් වේ!',
    daysLeft: (days) => `දින ${days}ක් ඉතිරියි`,
    previous: 'පෙර',
    next: 'ඊළඟ',
    pagination: 'පිටු අංකනය',
    offerCount: (count) => `දීමනා ${count}ක්`,
  },
  offer: {
    backToOffers: 'දීමනා වෙත ආපසු',
    bankAndCard: 'බැංකු සහ කාඩ්පත් විස්තර',
    validityPeriod: 'වලංගු කාලය',
    validityNotSpecified: 'වලංගු කාලය සඳහන් කර නොමැත',
    validFromTo: (from, to) => `${from} සිට ${to} දක්වා`,
    offerDescription: 'දීමනාවේ විස්තරය',
    termsAndConditions: 'නියම සහ කොන්දේසි',
    noTerms: 'නියම සපයා නොමැත.',
    viewOriginal: 'මුල් දීමනාව බලන්න',
    merchant: 'වෙළෙන්දා',
    category: 'ප්‍රවර්ගය',
    location: 'ස්ථානය',
    expiredTitle: 'මෙම දීමනාව කල් ඉකුත් වී ඇත',
    expiredBody: 'මෙම ප්‍රවර්ධනයේ වලංගු කාලය අවසන් වී ඇත. වත්මන් දීමනා බලන්න.',
    percentOff: (value) => `${value}% වට්ටමක්`,
    bogo: 'එකක් ගෙන එකක් නොමිලේ',
    saveAmount: (currency, value) => `${currency} ${value}ක් ඉතිරි කරන්න`,
    upTo: 'උපරිම',
    maxDiscount: (amount) => `උපරිම වට්ටම ${amount}`,
    validDays: 'වලංගු දින',
    sourceNote: 'දීමනාවේ විස්තර බැංකුව විසින් ඉංග්‍රීසි භාෂාවෙන් ප්‍රකාශයට පත් කර ඇත.',
    relatedOffers: 'ඔබ කැමති විය හැකි තවත් දීමනා',
    metaTitle: ({ merchant, discount, bank }) => `${merchant} හි ${discount} — ${bank} කාඩ්පත් සමඟ`,
    metaDescription: ({ merchant, discount, bank, cards, until, category }) =>
      `${bank} ${cards} සමඟ ${merchant} හි ${discount} ලබා ගන්න. ${category} දීමනාව ${until} දක්වා වලංගුයි. සම්පූර්ණ නියම කාඩ්පත් ප්‍රවර්ධන LK හි බලන්න.`,
  },
  banks: {
    modalTitle: 'ඔබේ බැංකු තෝරන්න',
    searchPlaceholder: 'බැංකු සොයන්න…',
    noBanksTitle: 'බැංකු හමු නොවීය',
    noBanksBody: 'ඔබේ සෙවුම් වචන වෙනස් කර උත්සාහ කරන්න',
    clearAll: 'සියල්ල ඉවත් කරන්න',
    showOffers: (count) => (count > 0 ? `බැංකු ${count}ක දීමනා පෙන්වන්න` : 'සියලු දීමනා පෙන්වන්න'),
    selectedCount: (count) => `බැංකු ${count}ක් තෝරා ඇත`,
    offerSingular: 'දීමනාව',
    offerPlural: 'දීමනා',
  },
  footer: {
    heading: 'ශ්‍රී ලංකාවේ ඉතිරිකිරීම් විවෘත කරන්න',
    body: 'ශ්‍රී ලංකාවේ සියලුම ප්‍රධාන බැංකුවලින් නවතම ක්‍රෙඩිට් සහ ඩෙබිට් කාඩ්පත් ප්‍රවර්ධන සොයා ගැනීම සඳහා ඔබේ ප්‍රධාන වේදිකාව.',
    quickLinks: 'ඉක්මන් සබැඳි',
    allOffers: 'සියලු දීමනා',
    diningDeals: 'ආහාර දීමනා',
    shoppingDiscounts: 'සාප්පු සවාරි වට්ටම්',
    topBankPromotions: 'ප්‍රමුඛ බැංකු ප්‍රවර්ධන',
    ourPlatform: 'අපගේ වේදිකාව',
    banksCovered: (count) => `බැංකු ${count}ක් ආවරණය`,
    offersLive: (count) => `දීමනා ${count}ක් සක්‍රීයයි`,
    merchants: (count) => `වෙළෙන්දන් ${count}ක්`,
    happySaving: 'සුබ ඉතිරිකිරීමක්!',
    rights: 'සියලු හිමිකම් ඇවිරිණි.',
    privacyPolicy: 'රහස්‍යතා ප්‍රතිපත්තිය',
    termsOfService: 'සේවා නියම',
    disclaimer:
      'කාඩ්පත් ප්‍රවර්ධන LK යනු ස්වාධීන එකතු කිරීමේ සේවාවක් වන අතර කිසිදු බැංකුවක් හා සම්බන්ධ නොවේ. වියදම් කිරීමට පෙර දීමනාවේ විස්තර නිකුත් කරන බැංකුවෙන් සැමවිටම තහවුරු කර ගන්න.',
  },
  pages: {
    offersTitle: 'ශ්‍රී ලංකාවේ සියලුම කාඩ්පත් දීමනා',
    offersDescription:
      'ශ්‍රී ලංකාවේ සක්‍රීය සියලුම ක්‍රෙඩිට් සහ ඩෙබිට් කාඩ්පත් ප්‍රවර්ධන බලන්න — සියලුම ප්‍රධාන බැංකු ආවරණය කරමින් දිනපතා යාවත්කාලීන වේ.',
    banksTitle: 'බැංකුව අනුව කාඩ්පත් දීමනා',
    banksDescription: 'ශ්‍රී ලංකාවේ සෑම ප්‍රධාන බැංකුවකම වත්මන් කාඩ්පත් ප්‍රවර්ධන එකට සසඳා බලන්න.',
    categoriesTitle: 'ප්‍රවර්ගය අනුව කාඩ්පත් දීමනා',
    categoriesDescription:
      'ප්‍රවර්ගය අනුව කාඩ්පත් ප්‍රවර්ධන සොයන්න — ආහාර, සාප්පු සවාරි, ගමන්, සිල්ලර බඩු, සෞඛ්‍ය සහ තවත් බොහෝ දේ.',
    searchTitle: 'කාඩ්පත් දීමනා සොයන්න',
    searchDescription:
      'වෙළෙන්දා, බැංකුව හෝ මූල පදය අනුව ශ්‍රී ලංකාවේ වත්මන් ක්‍රෙඩිට් සහ ඩෙබිට් කාඩ්පත් ප්‍රවර්ධන සොයන්න.',
    homeTitle: 'ශ්‍රී ලංකාවේ හොඳම කාඩ්පත් දීමනා සොයා ගන්න',
    bankPageTitle: (bank) => `${bank} කාඩ්පත් දීමනා සහ ප්‍රවර්ධන`,
    bankPageDescription: ({ bank, count, categories }) =>
      `ශ්‍රී ලංකාවේ වත්මන් ${bank} ක්‍රෙඩිට් සහ ඩෙබිට් කාඩ්පත් දීමනා ${count}ක්, ${categories} ආවරණය කරමින්. දිනපතා යාවත්කාලීන වේ.`,
    bankClosedHeading: (bank) => `${bank} තවදුරටත් ශ්‍රී ලංකාවේ පුද්ගලික කාඩ්පත් නිකුත් නොකරයි`,
    bankClosedBody: ({ bank, successor, date }) =>
      `${bank} සිය ශ්‍රී ලංකා සිල්ලර බැංකු ව්‍යාපාරය ${date} දින ${successor} වෙත විකුණා ඇත. පුද්ගලික ගිණුම් සහ ක්‍රෙඩිට් කාඩ්පත් — දළ වශයෙන් 200,000ක් — එයට මාරු වූ අතර, ${bank} කාඩ්පත් දැන් ${successor} විසින් සේවා සපයනු ලැබේ. ${bank} ශ්‍රී ලංකාවේ ව්‍යාපාරික බැංකුකරණය සඳහා පමණක් ක්‍රියාත්මක වේ.`,
    bankClosedCta: (successor) => `වත්මන් ${successor} කාඩ්පත් දීමනා බලන්න`,
    bankClosedTitle: (bank) => `${bank} ක්‍රෙඩිට් කාඩ් දීමනා — සිදු වූයේ කුමක්ද`,
    bankClosedDescription: ({ bank, successor }) =>
      `${bank} ශ්‍රී ලංකාවේ පුද්ගලික කාඩ්පත් නිකුත් කිරීම නවතා ඇත. එහි සිල්ලර බැංකු ව්‍යාපාරය ${successor} වෙත මාරු කර ඇත.`,
    locationsTitle: 'ස්ථානය අනුව කාඩ්පත් දීමනා',
    locationsDescription: 'ඔබ අසල ඇති ක්‍රෙඩිට් සහ ඩෙබිට් කාඩ්පත් දීමනා — නගරය අනුව හෝටල්, ආහාර සහ සාප්පු දීමනා.',
    locationPageTitle: (town) => `${town} හි කාඩ්පත් දීමනා`,
    locationPageDescription: ({ town, count, categories }) =>
      `${town} හි භාවිත කළ හැකි ක්‍රියාත්මක කාඩ්පත් දීමනා ${count}ක් — ${categories} ඇතුළුව.`,
    merchantsTitle: 'වෙළඳසැල් අනුව කාඩ්පත් දීමනා',
    merchantsDescription: 'ඔබ සාප්පු යන තැන කුමන කාඩ්පතට වට්ටමක් ලැබේද — වෙළෙන්දා අනුව බැංකු දීමනා.',
    merchantPageTitle: (merchant) => `${merchant} කාඩ්පත් දීමනා`,
    merchantPageDescription: ({ merchant, count, banks }) =>
      `${merchant} හි ක්‍රියාත්මක කාඩ්පත් දීමනා ${count}ක් — ${banks} වෙතින්.`,
    eligibilityTitle: 'ශ්‍රී ලංකාවේ ක්‍රෙඩිට් කාඩ් සුදුසුකම් — බැංකුව අනුව වැටුප් සහ අවශ්‍යතා',
    eligibilityDescription:
      'ක්‍රෙඩිට් කාඩ්පතක් සඳහා එක් එක් බැංකුව අවශ්‍ය කරන දේ: අවම මාසික වැටුප, වයස් සීමා සහ අවශ්‍ය ලේඛන.',
    eligibilityIntro: (count) =>
      `ක්‍රෙඩිට් කාඩ්පතක් නිකුත් කිරීමට පෙර ශ්‍රී ලංකාවේ බැංකු ${count}ක් අවශ්‍ය කරන දේ.`,
    eligibilityPublishedHeading: 'අවම ආදායමක් ප්‍රකාශ කරන බැංකු',
    eligibilityUnpublishedHeading: 'අවම ආදායමක් ප්‍රකාශ නොකරන බැංකු',
    eligibilityNotPublished: 'ප්‍රකාශ කර නැත',
    eligibilityDocumentsHeading: 'අවශ්‍ය ලේඛන',
    eligibilitySelfEmployedHeading: 'ස්වයං රැකියාවේ නියුතු නම්',
    eligibilityTiersHeading: 'කාඩ්පත් වර්ග',
    eligibilityConditionsHeading: 'වෙනත් කොන්දේසි',
    eligibilityAge: 'වයස',
    eligibilityResidency: 'පදිංචිය',
    eligibilityMinIncome: 'අවම මාසික ආදායම',
    eligibilitySource: 'මූලාශ්‍රය',
    eligibilityChecked: (date) => `${date} දින බැංකුවේ පිටුවට එරෙහිව පරීක්ෂා කරන ලදී.`,
    eligibilityDisclaimer:
      'බැංකු මෙම නිර්ණායක දැනුම් දීමකින් තොරව වෙනස් කරයි. අයදුම් කිරීමට පෙර බැංකුව සමඟ තහවුරු කරගන්න.',
    eligibilityViewOffers: (bank) => `වත්මන් ${bank} කාඩ්පත් දීමනා බලන්න`,
    categoryPageTitle: (category) => `ශ්‍රී ලංකාවේ ${category} කාඩ්පත් දීමනා`,
    categoryPageDescription: ({ category, count, banks }) =>
      `${banks} වෙතින් ශ්‍රී ලංකාවේ වත්මන් ${category} කාඩ්පත් ප්‍රවර්ධන ${count}ක්. දිනපතා යාවත්කාලීන වේ.`,
    cardTypePageTitle: (cardType) => `ශ්‍රී ලංකාවේ ${cardType} දීමනා`,
    cardTypePageDescription: ({ cardType, count, banks }) =>
      `${banks} වෙතින් ශ්‍රී ලංකාවේ වත්මන් ${cardType} ප්‍රවර්ධන ${count}ක්. වෙළෙන්දා සහ ප්‍රවර්ගය අනුව වට්ටම් සසඳන්න, දිනපතා යාවත්කාලීන වේ.`,
    bankCategoryPageTitle: ({ bank, category }) => `ශ්‍රී ලංකාවේ ${bank} ${category} දීමනා`,
    bankCategoryPageDescription: ({ bank, category, count }) =>
      `ශ්‍රී ලංකාවේ වත්මන් ${bank} ${category} කාඩ්පත් ප්‍රවර්ධන ${count}ක්, බැංකුව ප්‍රකාශ කළ කාඩ්පත් වර්ග සහ දින සමඟ. දිනපතා යාවත්කාලීන වේ.`,
    blogTitle: 'බ්ලොග්',
    blogDescription:
      'මෙම වෙබ් අඩවිය ගොඩනඟන ආකාරය පිළිබඳ සටහන් — ශ්‍රී ලංකාවේ බැංකු වෙබ් අඩවි වලින් කාඩ්පත් ප්‍රවර්ධන රැස් කිරීම, පිරිසිදු කිරීම සහ සැසඳීම.',
  },
  notFound: {
    title: 'පිටුව හමු නොවීය',
    body: 'ඔබ සොයන දීමනාව හෝ පිටුව තවදුරටත් ලබා ගත නොහැක. එය කල් ඉකුත් වී තිබිය හැක.',
    cta: 'වත්මන් දීමනා බලන්න',
  },
  legal: {
    privacyTitle: 'රහස්‍යතා ප්‍රතිපත්තිය',
    termsTitle: 'සේවා නියම',
    lastUpdated: (date) => `අවසන් වරට යාවත්කාලීන කළේ: ${date}`,
  },
  breadcrumb: {
    home: 'මුල් පිටුව',
    offers: 'දීමනා',
    banks: 'බැංකු',
    categories: 'ප්‍රවර්ග',
    blog: 'බ්ලොග්',
  },
  categories: {
    'Travel & Lodging': 'ගමන් හා නවාතැන්',
    Other: 'වෙනත්',
    'Dining & Restaurants': 'ආහාර හා අවන්හල්',
    'Shopping & Retail': 'සාප්පු සවාරි හා සිල්ලර වෙළඳාම',
    'Online Shopping': 'මාර්ගගත සාප්පු සවාරි',
    'Groceries & Supermarkets': 'සිල්ලර බඩු හා සුපිරි වෙළඳසැල්',
    'Health & Wellness': 'සෞඛ්‍ය හා සුවතාව',
    Fuel: 'ඉන්ධන',
    Leisure: 'විනෝදාස්වාදය',
  },
  banks_names: {
    "People's Bank": 'ජනතා බැංකුව',
    'Commercial Bank': 'කොමර්ෂල් බැංකුව',
    'DFCC Bank': 'ඩීඑෆ්සීසී බැංකුව',
    'Bank of Ceylon': 'ලංකා බැංකුව',
    HSBC: 'එච්එස්බීසී',
    'Sampath Bank': 'සම්පත් බැංකුව',
    HNB: 'හැටන් නැෂනල් බැංකුව',
    'Seylan Bank': 'සෙලාන් බැංකුව',
  },
  cardTypes: {
    'Credit Card': 'ක්‍රෙඩිට් කාඩ්පත',
    'Debit Card': 'ඩෙබිට් කාඩ්පත',
  },
  all: 'සියල්ල',
};

const ta: Dictionary = {
  siteName: 'கார்டு புரமோஷன்ஸ் LK',
  tagline: 'இலங்கையின் சிறந்த கிரெடிட் & டெபிட் கார்டு சலுகைகள்',
  metaDescription:
    'இலங்கையின் சமீபத்திய கிரெடிட் மற்றும் டெபிட் கார்டு சலுகைகள், தள்ளுபடிகளுக்கான உங்கள் முழுமையான வழிகாட்டி. உணவு, ஷாப்பிங், பயணம் மற்றும் பலவற்றில் சேமியுங்கள்.',
  keywords: [
    'கிரெடிட் கார்டு சலுகைகள் இலங்கை',
    'டெபிட் கார்டு சலுகைகள்',
    'வங்கி சலுகைகள்',
    'கார்டு தள்ளுபடி',
    'இலங்கை தள்ளுபடிகள்',
    'உணவக சலுகைகள்',
    'ஷாப்பிங் தள்ளுபடி',
    'பயண சலுகைகள்',
  ],
  nav: {
    searchPlaceholder: 'சலுகைகள், வணிகர்கள், வங்கிகளைத் தேடுங்கள்…',
    searchAriaLabel: 'கார்டு சலுகைகள் மற்றும் வணிகர்களைத் தேடுங்கள்',
    clearSearch: 'தேடலை அழிக்கவும்',
    banks: 'வங்கிகள்',
    banksAriaLabel: (count) => `வங்கி வாரியாக வடிகட்டவும். தற்போது ${count} வங்கிகள் தேர்ந்தெடுக்கப்பட்டுள்ளன`,
    language: 'மொழி',
    skipToContent: 'உள்ளடக்கத்திற்குச் செல்லவும்',
  },
  stats: {
    offers: 'சலுகைகள்',
    banks: 'வங்கிகள்',
    categories: 'பிரிவுகள்',
    clearFilters: 'வடிகட்டிகளை அழிக்கவும்',
  },
  browse: {
    latestOffers: 'சமீபத்திய சலுகைகள்',
    categoryOffers: (category) => `${category} சலுகைகள்`,
    bankOffers: (bank) => `${bank} சலுகைகள்`,
    searchResults: (term) => `“${term}” க்கான முடிவுகள்`,
    noOffersTitle: 'சலுகைகள் எதுவும் கிடைக்கவில்லை',
    noOffersBody: 'உங்கள் வடிகட்டிகள் அல்லது தேடல் சொற்களை மாற்றி முயற்சிக்கவும்.',
    clearAllFilters: 'அனைத்து வடிகட்டிகளையும் அழிக்கவும்',
    showTerms: 'விதிமுறைகள் & விவரங்களைக் காட்டு',
    hideTerms: 'விவரங்களை மறை',
    visitOfferPage: 'சலுகைப் பக்கத்திற்குச் செல்லவும்',
    validUntil: 'செல்லுபடியாகும் வரை',
    onlineOrMultiple: 'ஆன்லைன் / பல இடங்கள்',
    uncategorized: 'பிரிக்கப்படாதது',
    unknownBank: 'தெரியாத வங்கி',
    untitledOffer: 'தலைப்பில்லாத சலுகை',
    noDescription: 'விவரம் எதுவும் இல்லை.',
    expiresToday: 'இன்று முடிவடைகிறது!',
    daysLeft: (days) => `${days} நாட்கள் மீதம்`,
    previous: 'முந்தையது',
    next: 'அடுத்தது',
    pagination: 'பக்க எண்',
    offerCount: (count) => `${count} சலுகைகள்`,
  },
  offer: {
    backToOffers: 'சலுகைகளுக்குத் திரும்பு',
    bankAndCard: 'வங்கி & கார்டு விவரங்கள்',
    validityPeriod: 'செல்லுபடியாகும் காலம்',
    validityNotSpecified: 'செல்லுபடியாகும் காலம் குறிப்பிடப்படவில்லை',
    validFromTo: (from, to) => `${from} முதல் ${to} வரை`,
    offerDescription: 'சலுகை விவரம்',
    termsAndConditions: 'விதிமுறைகள் & நிபந்தனைகள்',
    noTerms: 'விதிமுறைகள் வழங்கப்படவில்லை.',
    viewOriginal: 'அசல் சலுகையைப் பார்க்கவும்',
    merchant: 'வணிகர்',
    category: 'பிரிவு',
    location: 'இடம்',
    expiredTitle: 'இந்தச் சலுகை காலாவதியாகிவிட்டது',
    expiredBody: 'இந்தச் சலுகையின் செல்லுபடியாகும் காலம் முடிந்துவிட்டது. தற்போதைய சலுகைகளைப் பாருங்கள்.',
    percentOff: (value) => `${value}% தள்ளுபடி`,
    bogo: 'ஒன்று வாங்கினால் ஒன்று இலவசம்',
    saveAmount: (currency, value) => `${currency} ${value} சேமியுங்கள்`,
    upTo: 'அதிகபட்சம்',
    maxDiscount: (amount) => `அதிகபட்சத் தள்ளுபடி ${amount}`,
    validDays: 'செல்லுபடியாகும் நாட்கள்',
    sourceNote: 'சலுகை விவரங்கள் வங்கியால் ஆங்கிலத்தில் வெளியிடப்பட்டுள்ளன.',
    relatedOffers: 'நீங்கள் விரும்பக்கூடிய மேலும் சலுகைகள்',
    metaTitle: ({ merchant, discount, bank }) => `${merchant} இல் ${discount} — ${bank} கார்டுகளுடன்`,
    metaDescription: ({ merchant, discount, bank, cards, until, category }) =>
      `${bank} ${cards} உடன் ${merchant} இல் ${discount} பெறுங்கள். ${category} சலுகை ${until} வரை செல்லுபடியாகும். முழு விதிமுறைகளை கார்டு புரமோஷன்ஸ் LK இல் காண்க.`,
  },
  banks: {
    modalTitle: 'உங்கள் வங்கிகளைத் தேர்ந்தெடுக்கவும்',
    searchPlaceholder: 'வங்கிகளைத் தேடுங்கள்…',
    noBanksTitle: 'வங்கிகள் எதுவும் கிடைக்கவில்லை',
    noBanksBody: 'உங்கள் தேடல் சொற்களை மாற்றி முயற்சிக்கவும்',
    clearAll: 'அனைத்தையும் அழிக்கவும்',
    showOffers: (count) => (count > 0 ? `${count} வங்கிச் சலுகைகளைக் காட்டு` : 'அனைத்துச் சலுகைகளையும் காட்டு'),
    selectedCount: (count) => `${count} வங்கிகள் தேர்ந்தெடுக்கப்பட்டுள்ளன`,
    offerSingular: 'சலுகை',
    offerPlural: 'சலுகைகள்',
  },
  footer: {
    heading: 'இலங்கையில் சேமிப்பைத் திறக்கவும்',
    body: 'இலங்கையின் அனைத்து முக்கிய வங்கிகளிலிருந்தும் சமீபத்திய கிரெடிட் மற்றும் டெபிட் கார்டு சலுகைகளைக் கண்டறிய உங்கள் முதன்மைத் தளம்.',
    quickLinks: 'விரைவு இணைப்புகள்',
    allOffers: 'அனைத்துச் சலுகைகள்',
    diningDeals: 'உணவகச் சலுகைகள்',
    shoppingDiscounts: 'ஷாப்பிங் தள்ளுபடிகள்',
    topBankPromotions: 'முன்னணி வங்கிச் சலுகைகள்',
    ourPlatform: 'எங்கள் தளம்',
    banksCovered: (count) => `${count}+ வங்கிகள் உள்ளடக்கப்பட்டுள்ளன`,
    offersLive: (count) => `${count}+ சலுகைகள் செயலில்`,
    merchants: (count) => `${count}+ வணிகர்கள்`,
    happySaving: 'மகிழ்ச்சியான சேமிப்பு!',
    rights: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    privacyPolicy: 'தனியுரிமைக் கொள்கை',
    termsOfService: 'சேவை விதிமுறைகள்',
    disclaimer:
      'கார்டு புரமோஷன்ஸ் LK ஒரு சுயாதீன ஒருங்கிணைப்பாளர், எந்த வங்கியுடனும் தொடர்புடையது அல்ல. செலவு செய்வதற்கு முன் சலுகை விவரங்களை வழங்கும் வங்கியிடம் எப்போதும் உறுதிப்படுத்திக் கொள்ளுங்கள்.',
  },
  pages: {
    offersTitle: 'இலங்கையின் அனைத்து கார்டு சலுகைகள்',
    offersDescription:
      'இலங்கையில் செயலில் உள்ள ஒவ்வொரு கிரெடிட் மற்றும் டெபிட் கார்டு சலுகையையும் பாருங்கள் — அனைத்து முக்கிய வங்கிகளிலும் தினமும் புதுப்பிக்கப்படுகிறது.',
    banksTitle: 'வங்கி வாரியாக கார்டு சலுகைகள்',
    banksDescription: 'இலங்கையின் ஒவ்வொரு முக்கிய வங்கியின் தற்போதைய கார்டு சலுகைகளையும் ஒப்பிட்டுப் பாருங்கள்.',
    categoriesTitle: 'பிரிவு வாரியாக கார்டு சலுகைகள்',
    categoriesDescription:
      'பிரிவு வாரியாக கார்டு சலுகைகளைக் கண்டறியுங்கள் — உணவு, ஷாப்பிங், பயணம், மளிகை, சுகாதாரம் மற்றும் பல.',
    searchTitle: 'கார்டு சலுகைகளைத் தேடுங்கள்',
    searchDescription:
      'வணிகர், வங்கி அல்லது முக்கிய சொல் மூலம் இலங்கையின் தற்போதைய கிரெடிட் மற்றும் டெபிட் கார்டு சலுகைகளைத் தேடுங்கள்.',
    homeTitle: 'இலங்கையின் சிறந்த கார்டு சலுகைகளைக் கண்டறியுங்கள்',
    bankPageTitle: (bank) => `${bank} கார்டு சலுகைகள்`,
    bankPageDescription: ({ bank, count, categories }) =>
      `இலங்கையில் தற்போதைய ${bank} கிரெடிட் மற்றும் டெபிட் கார்டு சலுகைகள் ${count}, ${categories} உள்ளடக்கியது. தினமும் புதுப்பிக்கப்படுகிறது.`,
    bankClosedHeading: (bank) => `${bank} இலங்கையில் தனிநபர் அட்டைகளை வழங்குவதில்லை`,
    bankClosedBody: ({ bank, successor, date }) =>
      `${bank} தனது இலங்கை சில்லறை வங்கி வணிகத்தை ${date} அன்று ${successor} இற்கு விற்றது. தனிநபர் கணக்குகள் மற்றும் கடன் அட்டைகள் — சுமார் 200,000 — மாற்றப்பட்டன, எனவே ${bank} அட்டைகள் இப்போது ${successor} ஆல் சேவை வழங்கப்படுகின்றன. ${bank} இலங்கையில் வணிக வங்கிச் சேவைக்காக மட்டுமே செயல்படுகிறது.`,
    bankClosedCta: (successor) => `தற்போதைய ${successor} அட்டை சலுகைகளைப் பார்க்கவும்`,
    bankClosedTitle: (bank) => `${bank} கடன் அட்டை சலுகைகள் — என்ன நடந்தது`,
    bankClosedDescription: ({ bank, successor }) =>
      `${bank} இலங்கையில் தனிநபர் அட்டைகளை வழங்குவதை நிறுத்தியுள்ளது. அதன் சில்லறை வங்கி வணிகம் ${successor} இற்கு மாற்றப்பட்டது.`,
    locationsTitle: 'இடம் வாரியாக அட்டை சலுகைகள்',
    locationsDescription: 'உங்களுக்கு அருகிலுள்ள கடன் மற்றும் பற்று அட்டை சலுகைகள் — நகரம் வாரியாக ஹோட்டல், உணவு மற்றும் ஷாப்பிங் சலுகைகள்.',
    locationPageTitle: (town) => `${town} இல் அட்டை சலுகைகள்`,
    locationPageDescription: ({ town, count, categories }) =>
      `${town} இல் பயன்படுத்தக்கூடிய ${count} நேரடி அட்டை சலுகைகள் — ${categories} உட்பட.`,
    merchantsTitle: 'கடை வாரியாக அட்டை சலுகைகள்',
    merchantsDescription: 'நீங்கள் ஷாப்பிங் செய்யும் இடத்தில் எந்த அட்டைக்கு தள்ளுபடி — வணிகர் வாரியாக வங்கி சலுகைகள்.',
    merchantPageTitle: (merchant) => `${merchant} அட்டை சலுகைகள்`,
    merchantPageDescription: ({ merchant, count, banks }) =>
      `${merchant} இல் ${count} நேரடி அட்டை சலுகைகள் — ${banks} இடமிருந்து.`,
    eligibilityTitle: 'இலங்கையில் கடன் அட்டை தகுதி — வங்கி வாரியாக சம்பளம் மற்றும் தேவைகள்',
    eligibilityDescription:
      'கடன் அட்டைக்கு ஒவ்வொரு வங்கியும் கோரும் விவரங்கள்: குறைந்தபட்ச மாத சம்பளம், வயது வரம்பு மற்றும் தேவையான ஆவணங்கள்.',
    eligibilityIntro: (count) =>
      `கடன் அட்டை வழங்குவதற்கு முன் இலங்கையின் ${count} வங்கிகள் கோரும் விவரங்கள்.`,
    eligibilityPublishedHeading: 'குறைந்தபட்ச வருமானத்தை வெளியிடும் வங்கிகள்',
    eligibilityUnpublishedHeading: 'குறைந்தபட்ச வருமானத்தை வெளியிடாத வங்கிகள்',
    eligibilityNotPublished: 'வெளியிடப்படவில்லை',
    eligibilityDocumentsHeading: 'தேவையான ஆவணங்கள்',
    eligibilitySelfEmployedHeading: 'சுயதொழில் செய்பவர் எனில்',
    eligibilityTiersHeading: 'அட்டை நிலைகள்',
    eligibilityConditionsHeading: 'பிற நிபந்தனைகள்',
    eligibilityAge: 'வயது',
    eligibilityResidency: 'வதிவிடம்',
    eligibilityMinIncome: 'குறைந்தபட்ச மாத வருமானம்',
    eligibilitySource: 'ஆதாரம்',
    eligibilityChecked: (date) => `${date} அன்று வங்கியின் சொந்தப் பக்கத்துடன் சரிபார்க்கப்பட்டது.`,
    eligibilityDisclaimer:
      'வங்கிகள் இந்த நிபந்தனைகளை அறிவிப்பின்றி மாற்றுகின்றன. விண்ணப்பிக்கும் முன் வங்கியுடன் உறுதிப்படுத்தவும்.',
    eligibilityViewOffers: (bank) => `தற்போதைய ${bank} அட்டை சலுகைகளைப் பார்க்கவும்`,
    categoryPageTitle: (category) => `இலங்கையில் ${category} கார்டு சலுகைகள்`,
    categoryPageDescription: ({ category, count, banks }) =>
      `${banks} வழங்கும் இலங்கையின் தற்போதைய ${category} கார்டு சலுகைகள் ${count}. தினமும் புதுப்பிக்கப்படுகிறது.`,
    cardTypePageTitle: (cardType) => `இலங்கையில் ${cardType} சலுகைகள்`,
    cardTypePageDescription: ({ cardType, count, banks }) =>
      `${banks} வழங்கும் இலங்கையின் தற்போதைய ${cardType} சலுகைகள் ${count}. வணிகர் மற்றும் பிரிவு வாரியாகத் தள்ளுபடிகளை ஒப்பிடுங்கள், தினமும் புதுப்பிக்கப்படுகிறது.`,
    bankCategoryPageTitle: ({ bank, category }) => `இலங்கையில் ${bank} ${category} சலுகைகள்`,
    bankCategoryPageDescription: ({ bank, category, count }) =>
      `இலங்கையில் தற்போதைய ${bank} ${category} கார்டு சலுகைகள் ${count}, வங்கி வெளியிட்ட கார்டு வகைகள் மற்றும் தேதிகளுடன். தினமும் புதுப்பிக்கப்படுகிறது.`,
    blogTitle: 'வலைப்பதிவு',
    blogDescription:
      'இந்தத் தளம் எவ்வாறு உருவாக்கப்பட்டது என்பது பற்றிய குறிப்புகள் — இலங்கை வங்கி இணையதளங்களிலிருந்து கார்டு சலுகைகளைச் சேகரித்தல், சுத்தம் செய்தல் மற்றும் ஒப்பிடுதல்.',
  },
  notFound: {
    title: 'பக்கம் கிடைக்கவில்லை',
    body: 'நீங்கள் தேடும் சலுகை அல்லது பக்கம் இனி கிடைக்கவில்லை. அது காலாவதியாகியிருக்கலாம்.',
    cta: 'தற்போதைய சலுகைகளைப் பாருங்கள்',
  },
  legal: {
    privacyTitle: 'தனியுரிமைக் கொள்கை',
    termsTitle: 'சேவை விதிமுறைகள்',
    lastUpdated: (date) => `கடைசியாகப் புதுப்பிக்கப்பட்டது: ${date}`,
  },
  breadcrumb: {
    home: 'முகப்பு',
    offers: 'சலுகைகள்',
    banks: 'வங்கிகள்',
    categories: 'பிரிவுகள்',
    blog: 'வலைப்பதிவு',
  },
  categories: {
    'Travel & Lodging': 'பயணம் & தங்குமிடம்',
    Other: 'பிற',
    'Dining & Restaurants': 'உணவகங்கள்',
    'Shopping & Retail': 'ஷாப்பிங் & சில்லறை விற்பனை',
    'Online Shopping': 'ஆன்லைன் ஷாப்பிங்',
    'Groceries & Supermarkets': 'மளிகை & பல்பொருள் அங்காடி',
    'Health & Wellness': 'சுகாதாரம் & நலவாழ்வு',
    Fuel: 'எரிபொருள்',
    Leisure: 'பொழுதுபோக்கு',
  },
  banks_names: {
    "People's Bank": 'மக்கள் வங்கி',
    'Commercial Bank': 'கொமர்ஷல் வங்கி',
    'DFCC Bank': 'DFCC வங்கி',
    'Bank of Ceylon': 'இலங்கை வங்கி',
    HSBC: 'HSBC',
    'Sampath Bank': 'சம்பத் வங்கி',
    HNB: 'ஹட்டன் நஷனல் வங்கி',
    'Seylan Bank': 'சேலான் வங்கி',
  },
  cardTypes: {
    'Credit Card': 'கிரெடிட் கார்டு',
    'Debit Card': 'டெபிட் கார்டு',
  },
  all: 'அனைத்தும்',
};

const dictionaries: Record<Locale, Dictionary> = { en, si, ta };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}

/** Translate a category name coming from the source data. */
export function translateCategory(locale: Locale, category: string): string {
  return getDictionary(locale).categories[category] ?? category;
}

/** Translate a bank name coming from the source data. */
export function translateBank(locale: Locale, bank: string): string {
  return getDictionary(locale).banks_names[bank] ?? bank;
}

/** Translate a card type coming from the source data. */
export function translateCardType(locale: Locale, cardType: string): string {
  return getDictionary(locale).cardTypes[cardType] ?? cardType;
}
