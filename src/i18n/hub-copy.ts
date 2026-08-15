import type { Locale } from './config';
import type { HubStats } from '@/lib/hub-stats';
import { listJoin } from '@/lib/hub-stats';

/**
 * Hub-page prose and FAQs, composed from real figures in HubStats.
 *
 * Rules this file follows:
 *  - Every sentence states something the data actually supports. A sentence
 *    whose inputs are missing is dropped, not padded.
 *  - FAQ answers are rendered visibly on the page as well as in JSON-LD;
 *    Google requires the two to match.
 *  - No superlatives the site cannot back up ("best deals in Sri Lanka").
 */

export interface Faq {
  question: string;
  answer: string;
}

export interface HowTo {
  name: string;
  steps: { name: string; text: string }[];
}

export interface HubCopy {
  /** Paragraphs of body text, already localized. */
  intro: string[];
  faqs: Faq[];
  howTo?: HowTo;
}

type Ctx = { locale: Locale; stats: HubStats };

/* ------------------------------------------------------------------ *
 * Phrase bank
 * ------------------------------------------------------------------ */

interface Phrases {
  faqHeading: string;
  howToHeading: string;
  updatedNote: (monthYear: string) => string;

  // Category hub
  catIntro: (a: { category: string; count: string; monthYear: string; banks: string }) => string;
  catBest: (a: { percentage: string; merchant: string; bank: string }) => string;
  catCards: (a: { cardTypes: string; category: string }) => string;
  catExpiring: (a: { count: string; category: string }) => string;
  catUndated: (a: { count: string }) => string;

  // Bank hub
  bankIntro: (a: { bank: string; count: string; monthYear: string; categories: string }) => string;
  bankBest: (a: { bank: string; percentage: string; merchant: string }) => string;
  bankCards: (a: { bank: string; cardTypes: string }) => string;

  // Card-type hub
  cardTypeIntro: (a: { cardType: string; count: string; monthYear: string; banks: string }) => string;
  cardTypeCategories: (a: { cardType: string; categories: string }) => string;
  qCardTypeBanks: (cardType: string) => string;
  aCardTypeBanks: (a: { cardType: string; count: string; banks: string; monthYear: string }) => string;

  // Bank x category hub
  bankCatIntro: (a: { bank: string; category: string; count: string; monthYear: string }) => string;
  locIntro: (a: { town: string; count: string; monthYear: string; banks: string }) => string;
  locCategories: (a: { town: string; categories: string }) => string;
  qLocBanks: (town: string) => string;
  aLocBanks: (a: { town: string; banks: string; count: string }) => string;
  qBankCatCount: (a: { bank: string; category: string }) => string;
  aBankCatCount: (a: { bank: string; category: string; count: string; monthYear: string }) => string;

  // Home
  homeIntro: (a: { count: string; bankCount: string; categoryCount: string; monthYear: string }) => string;
  homeBanks: (a: { banks: string }) => string;
  homeBest: (a: { percentage: string; merchant: string; bank: string }) => string;

  // FAQs
  qWhichBanks: (category: string) => string;
  aWhichBanks: (a: { count: string; category: string; banks: string; monthYear: string }) => string;
  qBiggest: (scope: string) => string;
  aBiggest: (a: { percentage: string; merchant: string; bank: string }) => string;
  aBiggestNone: string;
  qCardType: string;
  aCardType: (cardTypes: string) => string;
  qHowOften: string;
  aHowOften: string;
  qVerified: string;
  aVerified: string;
  qAffiliated: string;
  aAffiliated: string;
  qBankOffers: (bank: string) => string;
  aBankOffers: (a: { bank: string; count: string; categories: string }) => string;
  qMostOffers: string;
  aMostOffers: (a: { bank: string; count: string }) => string;

  // HowTo
  howToName: (category: string) => string;
  step1: string;
  step1Text: (banks: string) => string;
  step2: string;
  step2Text: (cardTypes: string) => string;
  step3: string;
  step3Text: string;
  step4: string;
  step4Text: string;
}

const en: Phrases = {
  faqHeading: 'Frequently asked questions',
  howToHeading: 'How to use these offers',
  updatedNote: (m) => `Figures on this page reflect offers live in ${m}.`,

  catIntro: ({ category, count, monthYear, banks }) =>
    `There are ${count} ${category.toLowerCase()} card offers running in Sri Lanka in ${monthYear}, from ${banks}. Each one below is listed with the card types it applies to and the dates the bank published.`,
  catBest: ({ percentage, merchant, bank }) =>
    `The largest discount in this category right now is ${percentage}% at ${merchant} on ${bank} cards.`,
  catCards: ({ cardTypes, category }) =>
    `Most ${category.toLowerCase()} promotions here apply to ${cardTypes}. Check the card list on an offer before you rely on it — some are restricted to a single card tier.`,
  catExpiring: ({ count, category }) =>
    `${count} of these ${category.toLowerCase()} offers end within the next two weeks.`,
  catUndated: ({ count }) =>
    `${count} offers here carry no published end date. They are shown as open-ended because the bank did not state one, not because they are confirmed to still be running.`,

  bankIntro: ({ bank, count, monthYear, categories }) =>
    `${bank} has ${count} card promotions running in ${monthYear}, covering ${categories}. Offers are collected from the bank's own promotions pages and listed with the card types and dates it published.`,
  bankBest: ({ bank, percentage, merchant }) =>
    `The largest ${bank} discount currently listed is ${percentage}% at ${merchant}.`,
  bankCards: ({ bank, cardTypes }) => `${bank} promotions here apply to ${cardTypes}.`,

  cardTypeIntro: ({ cardType, count, monthYear, banks }) =>
    `${count} ${cardType.toLowerCase()} promotions are running in Sri Lanka in ${monthYear}, from ${banks}. Card type matters at the till: an offer listed for one will not be honoured on the other, even on cards from the same bank.`,
  cardTypeCategories: ({ cardType, categories }) =>
    `${cardType} promotions here cover ${categories}.`,
  qCardTypeBanks: (t) => `Which Sri Lankan banks have ${t.toLowerCase()} promotions right now?`,
  aCardTypeBanks: ({ cardType, count, banks, monthYear }) =>
    `In ${monthYear} there are ${count} ${cardType.toLowerCase()} promotions listed, from ${banks}.`,

  bankCatIntro: ({ bank, category, count, monthYear }) =>
    `${bank} has ${count} ${category.toLowerCase()} card promotions running in ${monthYear}. Each is listed below with the card types it applies to and the dates the bank published.`,
  locIntro: ({ town, count, monthYear, banks }) =>
    `There are ${count} live credit and debit card offers you can use in ${town} as of ${monthYear}, from ${banks}.`,
  locCategories: ({ town, categories }) =>
    `Offers in ${town} cover ${categories}, so the same card can often be used across a whole trip rather than at a single merchant.`,
  qLocBanks: (town) => `Which banks have card offers in ${town}?`,
  aLocBanks: ({ town, banks, count }) =>
    `${banks} currently run card promotions redeemable in ${town} — ${count} live offers between them. Each offer below links to the bank page it came from.`,
  qBankCatCount: ({ bank, category }) => `How many ${category.toLowerCase()} offers does ${bank} have?`,
  aBankCatCount: ({ bank, category, count, monthYear }) =>
    `${count} ${bank} ${category.toLowerCase()} promotions are listed for ${monthYear}.`,

  homeIntro: ({ count, bankCount, categoryCount, monthYear }) =>
    `${count} credit and debit card promotions are running across ${bankCount} Sri Lankan banks in ${monthYear}, spanning ${categoryCount} categories. Offers are gathered from each bank's own promotions pages and refreshed daily.`,
  homeBanks: ({ banks }) => `The banks with the most live offers right now are ${banks}.`,
  homeBest: ({ percentage, merchant, bank }) =>
    `The biggest single discount currently listed is ${percentage}% at ${merchant} on ${bank} cards.`,

  qWhichBanks: (c) => `Which banks have ${c.toLowerCase()} card offers in Sri Lanka right now?`,
  aWhichBanks: ({ count, category, banks, monthYear }) =>
    `In ${monthYear} there are ${count} ${category.toLowerCase()} card offers listed, from ${banks}.`,
  qBiggest: (s) => `What is the biggest ${s} discount available?`,
  aBiggest: ({ percentage, merchant, bank }) =>
    `${percentage}% at ${merchant} with a ${bank} card. Percentage discounts are usually capped at a maximum rupee value, so check the offer's terms.`,
  aBiggestNone: 'None of the offers currently listed state a percentage discount.',
  qCardType: 'Do I need a credit card, or will a debit card work?',
  aCardType: (t) =>
    `The offers listed here apply to ${t}. Card type is shown on every offer — a promotion marked credit card only will not work on a debit card from the same bank.`,
  qHowOften: 'How often are these offers updated?',
  aHowOften:
    'The listings are refreshed daily from the banks’ own promotions pages. Offers whose end date has passed are removed automatically.',
  qVerified: 'Are these offers verified?',
  aVerified:
    'No. Offers are collected automatically from bank websites and reproduced here for comparison. Promotions change, get withdrawn, or carry conditions not stated in the published summary. Always confirm with the issuing bank before you spend.',
  qAffiliated: 'Is this site run by a bank?',
  aAffiliated:
    'No. Card Promotions LK is an independent aggregator with no affiliation to any bank or merchant listed. Bank names and logos belong to their owners and are used only to identify the offers described.',
  qBankOffers: (b) => `What card offers does ${b} have at the moment?`,
  aBankOffers: ({ bank, count, categories }) =>
    `${count} ${bank} promotions are currently listed, across ${categories}.`,
  qMostOffers: 'Which Sri Lankan bank has the most card offers?',
  aMostOffers: ({ bank, count }) => `${bank}, with ${count} promotions currently listed on this site.`,

  howToName: (c) => `How to use a ${c.toLowerCase()} card offer in Sri Lanka`,
  step1: 'Check which bank is running the offer',
  step1Text: (b) => `Offers in this category come from ${b}. You need a card from that bank — offers are not interchangeable.`,
  step2: 'Confirm your card type qualifies',
  step2Text: (t) => `These promotions apply to ${t}. A credit-card-only offer will be declined on a debit card.`,
  step3: 'Check the dates and any day restrictions',
  step3Text:
    'Some promotions run only on specific weekdays or for a single day. The validity period and valid days are shown on each offer.',
  step4: 'Confirm with the bank before paying',
  step4Text:
    'Open the original bank page linked on the offer and check the current terms, the maximum discount and any minimum spend before you rely on it.',
};

const si: Phrases = {
  faqHeading: 'නිතර අසන ප්‍රශ්න',
  howToHeading: 'මෙම දීමනා භාවිතා කරන ආකාරය',
  updatedNote: (m) => `මෙම පිටුවේ සංඛ්‍යා ${m} හි සක්‍රීය දීමනා පිළිබිඹු කරයි.`,

  catIntro: ({ category, count, monthYear, banks }) =>
    `${monthYear} හි ශ්‍රී ලංකාවේ ${category} කාඩ්පත් දීමනා ${count}ක් ක්‍රියාත්මක වේ, ${banks} වෙතින්. පහත සෑම එකක්ම අදාළ කාඩ්පත් වර්ග සහ බැංකුව ප්‍රකාශ කළ දින සමඟ ලැයිස්තුගත කර ඇත.`,
  catBest: ({ percentage, merchant, bank }) =>
    `මෙම ප්‍රවර්ගයේ දැනට විශාලතම වට්ටම ${bank} කාඩ්පත් සඳහා ${merchant} හි ${percentage}% කි.`,
  catCards: ({ cardTypes, category }) =>
    `මෙහි ඇති බොහෝ ${category} ප්‍රවර්ධන ${cardTypes} සඳහා අදාළ වේ. විශ්වාස කිරීමට පෙර දීමනාවේ කාඩ්පත් ලැයිස්තුව පරීක්ෂා කරන්න — සමහරක් තනි කාඩ්පත් මට්ටමකට පමණක් සීමා වේ.`,
  catExpiring: ({ count, category }) => `මෙම ${category} දීමනා වලින් ${count}ක් ලබන සති දෙක තුළ අවසන් වේ.`,
  catUndated: ({ count }) =>
    `මෙහි දීමනා ${count}ක් සඳහා ප්‍රකාශිත අවසන් දිනයක් නොමැත. බැංකුව එකක් සඳහන් නොකළ නිසා ඒවා විවෘත ලෙස පෙන්වා ඇත, තවමත් ක්‍රියාත්මක බව තහවුරු වී ඇති නිසා නොවේ.`,

  bankIntro: ({ bank, count, monthYear, categories }) =>
    `${monthYear} හි ${bank} කාඩ්පත් ප්‍රවර්ධන ${count}ක් ක්‍රියාත්මක වන අතර ${categories} ආවරණය කරයි. දීමනා බැංකුවේම ප්‍රවර්ධන පිටු වලින් රැස් කර, එය ප්‍රකාශ කළ කාඩ්පත් වර්ග සහ දින සමඟ ලැයිස්තුගත කර ඇත.`,
  bankBest: ({ bank, percentage, merchant }) =>
    `දැනට ලැයිස්තුගත විශාලතම ${bank} වට්ටම ${merchant} හි ${percentage}% කි.`,
  bankCards: ({ bank, cardTypes }) => `මෙහි ඇති ${bank} ප්‍රවර්ධන ${cardTypes} සඳහා අදාළ වේ.`,

  cardTypeIntro: ({ cardType, count, monthYear, banks }) =>
    `${monthYear} හි ශ්‍රී ලංකාවේ ${cardType} ප්‍රවර්ධන ${count}ක් ක්‍රියාත්මක වේ, ${banks} වෙතින්. කාඩ්පත් වර්ගය වැදගත් වේ: එක් වර්ගයක් සඳහා ලැයිස්තුගත දීමනාවක් අනෙක් වර්ගය සඳහා — එකම බැංකුවේ කාඩ්පතක් වුවද — පිළිගනු නොලැබේ.`,
  cardTypeCategories: ({ cardType, categories }) => `මෙහි ඇති ${cardType} ප්‍රවර්ධන ${categories} ආවරණය කරයි.`,
  qCardTypeBanks: (t) => `දැනට ${t} ප්‍රවර්ධන ඇත්තේ ශ්‍රී ලංකාවේ කුමන බැංකු වලද?`,
  aCardTypeBanks: ({ cardType, count, banks, monthYear }) =>
    `${monthYear} හි ${banks} වෙතින් ${cardType} ප්‍රවර්ධන ${count}ක් ලැයිස්තුගත කර ඇත.`,

  bankCatIntro: ({ bank, category, count, monthYear }) =>
    `${monthYear} හි ${bank} ${category} කාඩ්පත් ප්‍රවර්ධන ${count}ක් ක්‍රියාත්මක වේ. පහත සෑම එකක්ම අදාළ කාඩ්පත් වර්ග සහ බැංකුව ප්‍රකාශ කළ දින සමඟ ලැයිස්තුගත කර ඇත.`,
  locIntro: ({ town, count, monthYear, banks }) =>
    `${monthYear} වන විට ${town} හි භාවිත කළ හැකි ක්‍රියාත්මක කාඩ්පත් දීමනා ${count}ක් ඇත — ${banks} වෙතින්.`,
  locCategories: ({ town, categories }) =>
    `${town} හි දීමනා ${categories} ආවරණය කරයි.`,
  qLocBanks: (town) => `${town} හි කුමන බැංකුවලට කාඩ්පත් දීමනා තිබේද?`,
  aLocBanks: ({ town, banks, count }) =>
    `${banks} දැනට ${town} හි භාවිත කළ හැකි දීමනා ${count}ක් ලබා දෙයි.`,
  qBankCatCount: ({ bank, category }) => `${bank} සතුව ${category} දීමනා කීයක් තිබේද?`,
  aBankCatCount: ({ bank, category, count, monthYear }) =>
    `${monthYear} සඳහා ${bank} ${category} ප්‍රවර්ධන ${count}ක් ලැයිස්තුගත කර ඇත.`,

  homeIntro: ({ count, bankCount, categoryCount, monthYear }) =>
    `${monthYear} හි ශ්‍රී ලංකාවේ බැංකු ${bankCount}ක් හරහා ක්‍රෙඩිට් සහ ඩෙබිට් කාඩ්පත් ප්‍රවර්ධන ${count}ක් ක්‍රියාත්මක වන අතර ප්‍රවර්ග ${categoryCount}ක් ආවරණය කරයි. දීමනා එක් එක් බැංකුවේම ප්‍රවර්ධන පිටු වලින් රැස් කර දිනපතා යාවත්කාලීන කෙරේ.`,
  homeBanks: ({ banks }) => `දැනට වැඩිම සක්‍රීය දීමනා ඇති බැංකු වන්නේ ${banks} ය.`,
  homeBest: ({ percentage, merchant, bank }) =>
    `දැනට ලැයිස්තුගත විශාලතම තනි වට්ටම ${bank} කාඩ්පත් සඳහා ${merchant} හි ${percentage}% කි.`,

  qWhichBanks: (c) => `දැනට ශ්‍රී ලංකාවේ ${c} කාඩ්පත් දීමනා ඇත්තේ කුමන බැංකු වලද?`,
  aWhichBanks: ({ count, category, banks, monthYear }) =>
    `${monthYear} හි ${banks} වෙතින් ${category} කාඩ්පත් දීමනා ${count}ක් ලැයිස්තුගත කර ඇත.`,
  qBiggest: (s) => `${s} සඳහා ලබා ගත හැකි විශාලතම වට්ටම කුමක්ද?`,
  aBiggest: ({ percentage, merchant, bank }) =>
    `${bank} කාඩ්පතක් සමඟ ${merchant} හි ${percentage}% කි. ප්‍රතිශත වට්ටම් සාමාන්‍යයෙන් උපරිම රුපියල් අගයකට සීමා වන බැවින් දීමනාවේ නියම පරීක්ෂා කරන්න.`,
  aBiggestNone: 'දැනට ලැයිස්තුගත කිසිදු දීමනාවක ප්‍රතිශත වට්ටමක් සඳහන් නොවේ.',
  qCardType: 'මට ක්‍රෙඩිට් කාඩ්පතක් අවශ්‍යද, නැතහොත් ඩෙබිට් කාඩ්පතක් ප්‍රමාණවත්ද?',
  aCardType: (t) =>
    `මෙහි ලැයිස්තුගත දීමනා ${t} සඳහා අදාළ වේ. සෑම දීමනාවකම කාඩ්පත් වර්ගය පෙන්වා ඇත — ක්‍රෙඩිට් කාඩ්පත් සඳහා පමණක් යැයි සලකුණු කළ ප්‍රවර්ධනයක් එම බැංකුවේම ඩෙබිට් කාඩ්පතක ක්‍රියා නොකරයි.`,
  qHowOften: 'මෙම දීමනා කොපමණ වාරයක් යාවත්කාලීන කෙරේද?',
  aHowOften:
    'ලැයිස්තු බැංකුවල ප්‍රවර්ධන පිටු වලින් දිනපතා යාවත්කාලීන කෙරේ. අවසන් දිනය පසු වූ දීමනා ස්වයංක්‍රීයව ඉවත් කෙරේ.',
  qVerified: 'මෙම දීමනා තහවුරු කර තිබේද?',
  aVerified:
    'නැත. දීමනා බැංකු වෙබ් අඩවි වලින් ස්වයංක්‍රීයව රැස් කර සංසන්දනය සඳහා මෙහි ඉදිරිපත් කෙරේ. ප්‍රවර්ධන වෙනස් වේ, ඉවත් කරනු ලැබේ, හෝ ප්‍රකාශිත සාරාංශයේ සඳහන් නොවන කොන්දේසි දරයි. වියදම් කිරීමට පෙර සැමවිටම නිකුත් කරන බැංකුවෙන් තහවුරු කර ගන්න.',
  qAffiliated: 'මෙම වෙබ් අඩවිය බැංකුවක් විසින් පවත්වාගෙන යනවාද?',
  aAffiliated:
    'නැත. කාඩ්පත් ප්‍රවර්ධන LK යනු ලැයිස්තුගත කිසිදු බැංකුවක් හෝ වෙළෙන්දෙකු හා සම්බන්ධ නොවන ස්වාධීන එකතු කිරීමේ සේවාවකි. බැංකු නම් සහ ලාංඡන ඒවායේ හිමිකරුවන්ට අයත් වන අතර විස්තර කරන දීමනා හඳුනා ගැනීමට පමණක් භාවිතා කෙරේ.',
  qBankOffers: (b) => `දැනට ${b} සතුව ඇති කාඩ්පත් දීමනා මොනවාද?`,
  aBankOffers: ({ bank, count, categories }) =>
    `${categories} හරහා ${bank} ප්‍රවර්ධන ${count}ක් දැනට ලැයිස්තුගත කර ඇත.`,
  qMostOffers: 'ශ්‍රී ලංකාවේ වැඩිම කාඩ්පත් දීමනා ඇත්තේ කුමන බැංකුවටද?',
  aMostOffers: ({ bank, count }) => `${bank}, මෙම වෙබ් අඩවියේ දැනට ලැයිස්තුගත ප්‍රවර්ධන ${count}ක් සමඟ.`,

  howToName: (c) => `ශ්‍රී ලංකාවේ ${c} කාඩ්පත් දීමනාවක් භාවිතා කරන ආකාරය`,
  step1: 'දීමනාව ක්‍රියාත්මක කරන බැංකුව පරීක්ෂා කරන්න',
  step1Text: (b) => `මෙම ප්‍රවර්ගයේ දීමනා ${b} වෙතින් පැමිණේ. ඔබට එම බැංකුවේ කාඩ්පතක් අවශ්‍යයි — දීමනා හුවමාරු කළ නොහැක.`,
  step2: 'ඔබේ කාඩ්පත් වර්ගය සුදුසුකම් ලබන බව තහවුරු කරන්න',
  step2Text: (t) => `මෙම ප්‍රවර්ධන ${t} සඳහා අදාළ වේ. ක්‍රෙඩිට් කාඩ්පත් සඳහා පමණක් වන දීමනාවක් ඩෙබිට් කාඩ්පතක ප්‍රතික්ෂේප වේ.`,
  step3: 'දින සහ දින සීමා පරීක්ෂා කරන්න',
  step3Text:
    'සමහර ප්‍රවර්ධන නිශ්චිත සතියේ දිනවල හෝ තනි දිනක් සඳහා පමණක් ක්‍රියාත්මක වේ. වලංගු කාලය සහ වලංගු දින සෑම දීමනාවකම පෙන්වා ඇත.',
  step4: 'ගෙවීමට පෙර බැංකුවෙන් තහවුරු කර ගන්න',
  step4Text:
    'දීමනාවේ සබැඳි මුල් බැංකු පිටුව විවෘත කර, විශ්වාස කිරීමට පෙර වත්මන් නියම, උපරිම වට්ටම සහ අවම වියදම පරීක්ෂා කරන්න.',
};

const ta: Phrases = {
  faqHeading: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
  howToHeading: 'இந்தச் சலுகைகளைப் பயன்படுத்தும் விதம்',
  updatedNote: (m) => `இந்தப் பக்கத்தின் புள்ளிவிவரங்கள் ${m} இல் செயலில் உள்ள சலுகைகளைப் பிரதிபலிக்கின்றன.`,

  catIntro: ({ category, count, monthYear, banks }) =>
    `${monthYear} இல் இலங்கையில் ${category} கார்டு சலுகைகள் ${count} செயல்பாட்டில் உள்ளன, ${banks} வழங்குகின்றன. கீழே உள்ள ஒவ்வொன்றும் பொருந்தக்கூடிய கார்டு வகைகள் மற்றும் வங்கி வெளியிட்ட தேதிகளுடன் பட்டியலிடப்பட்டுள்ளது.`,
  catBest: ({ percentage, merchant, bank }) =>
    `இந்தப் பிரிவில் தற்போதைய அதிகபட்சத் தள்ளுபடி ${bank} கார்டுகளுக்கு ${merchant} இல் ${percentage}% ஆகும்.`,
  catCards: ({ cardTypes, category }) =>
    `இங்குள்ள பெரும்பாலான ${category} சலுகைகள் ${cardTypes} க்குப் பொருந்தும். நம்புவதற்கு முன் சலுகையின் கார்டு பட்டியலைச் சரிபார்க்கவும் — சில ஒரே கார்டு நிலைக்கு மட்டுமே வரையறுக்கப்பட்டுள்ளன.`,
  catExpiring: ({ count, category }) => `இந்த ${category} சலுகைகளில் ${count} அடுத்த இரண்டு வாரங்களில் முடிவடைகின்றன.`,
  catUndated: ({ count }) =>
    `இங்குள்ள ${count} சலுகைகளுக்கு வெளியிடப்பட்ட முடிவுத் தேதி இல்லை. வங்கி ஒன்றைக் குறிப்பிடாததால் அவை திறந்தவையாகக் காட்டப்படுகின்றன, இன்னும் நடைமுறையில் உள்ளன என்று உறுதிசெய்யப்பட்டதால் அல்ல.`,

  bankIntro: ({ bank, count, monthYear, categories }) =>
    `${monthYear} இல் ${bank} கார்டு சலுகைகள் ${count} செயல்பாட்டில் உள்ளன, ${categories} உள்ளடக்கியது. சலுகைகள் வங்கியின் சொந்தச் சலுகைப் பக்கங்களிலிருந்து சேகரிக்கப்பட்டு, அது வெளியிட்ட கார்டு வகைகள் மற்றும் தேதிகளுடன் பட்டியலிடப்பட்டுள்ளன.`,
  bankBest: ({ bank, percentage, merchant }) =>
    `தற்போது பட்டியலிடப்பட்ட அதிகபட்ச ${bank} தள்ளுபடி ${merchant} இல் ${percentage}% ஆகும்.`,
  bankCards: ({ bank, cardTypes }) => `இங்குள்ள ${bank} சலுகைகள் ${cardTypes} க்குப் பொருந்தும்.`,

  cardTypeIntro: ({ cardType, count, monthYear, banks }) =>
    `${monthYear} இல் இலங்கையில் ${cardType} சலுகைகள் ${count} செயல்பாட்டில் உள்ளன, ${banks} வழங்குகின்றன. கார்டு வகை முக்கியம்: ஒரு வகைக்குப் பட்டியலிடப்பட்ட சலுகை, அதே வங்கியின் கார்டாக இருந்தாலும், மற்ற வகையில் ஏற்றுக்கொள்ளப்படாது.`,
  cardTypeCategories: ({ cardType, categories }) => `இங்குள்ள ${cardType} சலுகைகள் ${categories} உள்ளடக்குகின்றன.`,
  qCardTypeBanks: (t) => `தற்போது இலங்கையில் எந்த வங்கிகளில் ${t} சலுகைகள் உள்ளன?`,
  aCardTypeBanks: ({ cardType, count, banks, monthYear }) =>
    `${monthYear} இல் ${banks} வழங்கும் ${cardType} சலுகைகள் ${count} பட்டியலிடப்பட்டுள்ளன.`,

  bankCatIntro: ({ bank, category, count, monthYear }) =>
    `${monthYear} இல் ${bank} ${category} கார்டு சலுகைகள் ${count} செயல்பாட்டில் உள்ளன. கீழே உள்ள ஒவ்வொன்றும் பொருந்தக்கூடிய கார்டு வகைகள் மற்றும் வங்கி வெளியிட்ட தேதிகளுடன் பட்டியலிடப்பட்டுள்ளது.`,
  locIntro: ({ town, count, monthYear, banks }) =>
    `${monthYear} நிலவரப்படி ${town} இல் பயன்படுத்தக்கூடிய ${count} நேரடி அட்டை சலுகைகள் உள்ளன — ${banks} இடமிருந்து.`,
  locCategories: ({ town, categories }) =>
    `${town} இல் உள்ள சலுகைகள் ${categories} ஆகியவற்றை உள்ளடக்கும்.`,
  qLocBanks: (town) => `${town} இல் எந்த வங்கிகளுக்கு அட்டை சலுகைகள் உள்ளன?`,
  aLocBanks: ({ town, banks, count }) =>
    `${banks} தற்போது ${town} இல் ${count} சலுகைகளை வழங்குகின்றன.`,
  qBankCatCount: ({ bank, category }) => `${bank} இல் எத்தனை ${category} சலுகைகள் உள்ளன?`,
  aBankCatCount: ({ bank, category, count, monthYear }) =>
    `${monthYear} க்கு ${bank} ${category} சலுகைகள் ${count} பட்டியலிடப்பட்டுள்ளன.`,

  homeIntro: ({ count, bankCount, categoryCount, monthYear }) =>
    `${monthYear} இல் இலங்கையின் ${bankCount} வங்கிகளில் ${count} கிரெடிட் மற்றும் டெபிட் கார்டு சலுகைகள் செயல்பாட்டில் உள்ளன, ${categoryCount} பிரிவுகளை உள்ளடக்கியது. சலுகைகள் ஒவ்வொரு வங்கியின் சொந்தச் சலுகைப் பக்கங்களிலிருந்து சேகரிக்கப்பட்டு தினமும் புதுப்பிக்கப்படுகின்றன.`,
  homeBanks: ({ banks }) => `தற்போது அதிக செயலில் உள்ள சலுகைகளைக் கொண்ட வங்கிகள் ${banks}.`,
  homeBest: ({ percentage, merchant, bank }) =>
    `தற்போது பட்டியலிடப்பட்ட மிகப்பெரிய தனிச் தள்ளுபடி ${bank} கார்டுகளுக்கு ${merchant} இல் ${percentage}% ஆகும்.`,

  qWhichBanks: (c) => `தற்போது இலங்கையில் ${c} கார்டு சலுகைகள் எந்த வங்கிகளில் உள்ளன?`,
  aWhichBanks: ({ count, category, banks, monthYear }) =>
    `${monthYear} இல் ${banks} வழங்கும் ${category} கார்டு சலுகைகள் ${count} பட்டியலிடப்பட்டுள்ளன.`,
  qBiggest: (s) => `${s} க்குக் கிடைக்கும் மிகப்பெரிய தள்ளுபடி என்ன?`,
  aBiggest: ({ percentage, merchant, bank }) =>
    `${bank} கார்டுடன் ${merchant} இல் ${percentage}%. சதவீதத் தள்ளுபடிகள் பொதுவாக அதிகபட்ச ரூபாய் மதிப்பில் வரையறுக்கப்படுகின்றன, எனவே சலுகையின் விதிமுறைகளைச் சரிபார்க்கவும்.`,
  aBiggestNone: 'தற்போது பட்டியலிடப்பட்ட எந்தச் சலுகையும் சதவீதத் தள்ளுபடியைக் குறிப்பிடவில்லை.',
  qCardType: 'எனக்குக் கிரெடிட் கார்டு தேவையா, அல்லது டெபிட் கார்டு போதுமா?',
  aCardType: (t) =>
    `இங்கு பட்டியலிடப்பட்ட சலுகைகள் ${t} க்குப் பொருந்தும். ஒவ்வொரு சலுகையிலும் கார்டு வகை காட்டப்படுகிறது — கிரெடிட் கார்டுக்கு மட்டும் எனக் குறிக்கப்பட்ட சலுகை அதே வங்கியின் டெபிட் கார்டில் வேலை செய்யாது.`,
  qHowOften: 'இந்தச் சலுகைகள் எவ்வளவு அடிக்கடி புதுப்பிக்கப்படுகின்றன?',
  aHowOften:
    'பட்டியல்கள் வங்கிகளின் சொந்தச் சலுகைப் பக்கங்களிலிருந்து தினமும் புதுப்பிக்கப்படுகின்றன. முடிவுத் தேதி கடந்த சலுகைகள் தானாகவே அகற்றப்படுகின்றன.',
  qVerified: 'இந்தச் சலுகைகள் சரிபார்க்கப்பட்டவையா?',
  aVerified:
    'இல்லை. சலுகைகள் வங்கி இணையதளங்களிலிருந்து தானாகச் சேகரிக்கப்பட்டு ஒப்பீட்டுக்காக இங்கு வழங்கப்படுகின்றன. சலுகைகள் மாறலாம், திரும்பப் பெறப்படலாம், அல்லது வெளியிடப்பட்ட சுருக்கத்தில் இல்லாத நிபந்தனைகளைக் கொண்டிருக்கலாம். செலவு செய்வதற்கு முன் எப்போதும் வழங்கும் வங்கியிடம் உறுதிப்படுத்திக் கொள்ளுங்கள்.',
  qAffiliated: 'இந்தத் தளம் ஒரு வங்கியால் நடத்தப்படுகிறதா?',
  aAffiliated:
    'இல்லை. கார்டு புரமோஷன்ஸ் LK என்பது பட்டியலிடப்பட்ட எந்த வங்கியுடனும் வணிகருடனும் தொடர்பில்லாத ஒரு சுயாதீன ஒருங்கிணைப்பாளர். வங்கிப் பெயர்களும் சின்னங்களும் அவற்றின் உரிமையாளர்களுக்குச் சொந்தமானவை, விவரிக்கப்படும் சலுகைகளை அடையாளம் காண மட்டுமே பயன்படுத்தப்படுகின்றன.',
  qBankOffers: (b) => `தற்போது ${b} இல் என்ன கார்டு சலுகைகள் உள்ளன?`,
  aBankOffers: ({ bank, count, categories }) =>
    `${categories} முழுவதும் ${bank} சலுகைகள் ${count} தற்போது பட்டியலிடப்பட்டுள்ளன.`,
  qMostOffers: 'இலங்கையில் எந்த வங்கியில் அதிக கார்டு சலுகைகள் உள்ளன?',
  aMostOffers: ({ bank, count }) => `${bank}, இந்தத் தளத்தில் தற்போது பட்டியலிடப்பட்ட ${count} சலுகைகளுடன்.`,

  howToName: (c) => `இலங்கையில் ${c} கார்டு சலுகையைப் பயன்படுத்தும் விதம்`,
  step1: 'சலுகையை வழங்கும் வங்கியைச் சரிபார்க்கவும்',
  step1Text: (b) => `இந்தப் பிரிவின் சலுகைகள் ${b} இடமிருந்து வருகின்றன. அந்த வங்கியின் கார்டு உங்களுக்குத் தேவை — சலுகைகளை மாற்றிப் பயன்படுத்த முடியாது.`,
  step2: 'உங்கள் கார்டு வகை தகுதிபெறுகிறதா என உறுதிசெய்யவும்',
  step2Text: (t) => `இந்தச் சலுகைகள் ${t} க்குப் பொருந்தும். கிரெடிட் கார்டுக்கு மட்டுமான சலுகை டெபிட் கார்டில் நிராகரிக்கப்படும்.`,
  step3: 'தேதிகளையும் நாள் வரம்புகளையும் சரிபார்க்கவும்',
  step3Text:
    'சில சலுகைகள் குறிப்பிட்ட வாரநாட்களில் அல்லது ஒரே நாளில் மட்டுமே செயல்படும். செல்லுபடியாகும் காலமும் நாட்களும் ஒவ்வொரு சலுகையிலும் காட்டப்படுகின்றன.',
  step4: 'பணம் செலுத்தும் முன் வங்கியிடம் உறுதிப்படுத்தவும்',
  step4Text:
    'சலுகையில் இணைக்கப்பட்ட அசல் வங்கிப் பக்கத்தைத் திறந்து, நம்புவதற்கு முன் தற்போதைய விதிமுறைகள், அதிகபட்சத் தள்ளுபடி மற்றும் குறைந்தபட்சச் செலவைச் சரிபார்க்கவும்.',
};

const phrases: Record<Locale, Phrases> = { en, si, ta };

export function getPhrases(locale: Locale): Phrases {
  return phrases[locale] ?? en;
}

/* ------------------------------------------------------------------ *
 * Composers
 * ------------------------------------------------------------------ */

function commonFaqs({ locale, stats }: Ctx): Faq[] {
  const p = getPhrases(locale);
  const faqs: Faq[] = [];
  if (stats.cardTypes.length > 0) {
    faqs.push({ question: p.qCardType, answer: p.aCardType(listJoin(locale, stats.cardTypes)) });
  }
  faqs.push({ question: p.qHowOften, answer: p.aHowOften });
  faqs.push({ question: p.qVerified, answer: p.aVerified });
  faqs.push({ question: p.qAffiliated, answer: p.aAffiliated });
  return faqs;
}

export function categoryHubCopy(locale: Locale, categoryLabel: string, stats: HubStats): HubCopy {
  const p = getPhrases(locale);
  const banks = listJoin(locale, stats.topBanks);
  const intro: string[] = [];

  if (stats.count > 0 && banks) {
    intro.push(p.catIntro({ category: categoryLabel, count: String(stats.count), monthYear: stats.monthYear, banks }));
  }
  if (stats.best) {
    intro.push(
      p.catBest({
        percentage: String(stats.best.percentage),
        merchant: stats.best.merchant,
        bank: stats.best.bank,
      }),
    );
  }
  if (stats.cardTypes.length > 0) {
    intro.push(p.catCards({ cardTypes: listJoin(locale, stats.cardTypes), category: categoryLabel }));
  }
  if (stats.expiringSoon > 0) {
    intro.push(p.catExpiring({ count: String(stats.expiringSoon), category: categoryLabel }));
  }
  if (stats.undated > 0) {
    intro.push(p.catUndated({ count: String(stats.undated) }));
  }

  const faqs: Faq[] = [];
  if (banks) {
    faqs.push({
      question: p.qWhichBanks(categoryLabel),
      answer: p.aWhichBanks({
        count: String(stats.count),
        category: categoryLabel,
        banks,
        monthYear: stats.monthYear,
      }),
    });
  }
  faqs.push({
    question: p.qBiggest(categoryLabel.toLowerCase()),
    answer: stats.best
      ? p.aBiggest({
          percentage: String(stats.best.percentage),
          merchant: stats.best.merchant,
          bank: stats.best.bank,
        })
      : p.aBiggestNone,
  });
  faqs.push(...commonFaqs({ locale, stats }));

  return {
    intro,
    faqs,
    howTo: {
      name: p.howToName(categoryLabel),
      steps: [
        { name: p.step1, text: p.step1Text(banks || categoryLabel) },
        { name: p.step2, text: p.step2Text(listJoin(locale, stats.cardTypes)) },
        { name: p.step3, text: p.step3Text },
        { name: p.step4, text: p.step4Text },
      ],
    },
  };
}

export function bankHubCopy(locale: Locale, bankLabel: string, stats: HubStats): HubCopy {
  const p = getPhrases(locale);
  const categories = listJoin(locale, stats.topCategories);
  const intro: string[] = [];

  if (stats.count > 0 && categories) {
    intro.push(
      p.bankIntro({ bank: bankLabel, count: String(stats.count), monthYear: stats.monthYear, categories }),
    );
  }
  if (stats.best) {
    intro.push(p.bankBest({ bank: bankLabel, percentage: String(stats.best.percentage), merchant: stats.best.merchant }));
  }
  if (stats.cardTypes.length > 0) {
    intro.push(p.bankCards({ bank: bankLabel, cardTypes: listJoin(locale, stats.cardTypes) }));
  }
  if (stats.undated > 0) intro.push(p.catUndated({ count: String(stats.undated) }));

  const faqs: Faq[] = [];
  if (categories) {
    faqs.push({
      question: p.qBankOffers(bankLabel),
      answer: p.aBankOffers({ bank: bankLabel, count: String(stats.count), categories }),
    });
  }
  faqs.push({
    question: p.qBiggest(bankLabel),
    answer: stats.best
      ? p.aBiggest({
          percentage: String(stats.best.percentage),
          merchant: stats.best.merchant,
          bank: stats.best.bank,
        })
      : p.aBiggestNone,
  });
  faqs.push(...commonFaqs({ locale, stats }));

  return { intro, faqs };
}

export function cardTypeHubCopy(locale: Locale, cardTypeLabel: string, stats: HubStats): HubCopy {
  const p = getPhrases(locale);
  const banks = listJoin(locale, stats.topBanks);
  const categories = listJoin(locale, stats.topCategories);
  const intro: string[] = [];

  if (stats.count > 0 && banks) {
    intro.push(
      p.cardTypeIntro({ cardType: cardTypeLabel, count: String(stats.count), monthYear: stats.monthYear, banks }),
    );
  }
  if (categories) intro.push(p.cardTypeCategories({ cardType: cardTypeLabel, categories }));
  if (stats.best) {
    intro.push(
      p.catBest({
        percentage: String(stats.best.percentage),
        merchant: stats.best.merchant,
        bank: stats.best.bank,
      }),
    );
  }
  if (stats.undated > 0) intro.push(p.catUndated({ count: String(stats.undated) }));

  const faqs: Faq[] = [];
  if (banks) {
    faqs.push({
      question: p.qCardTypeBanks(cardTypeLabel),
      answer: p.aCardTypeBanks({
        cardType: cardTypeLabel,
        count: String(stats.count),
        banks,
        monthYear: stats.monthYear,
      }),
    });
  }
  faqs.push({
    question: p.qBiggest(cardTypeLabel.toLowerCase()),
    answer: stats.best
      ? p.aBiggest({
          percentage: String(stats.best.percentage),
          merchant: stats.best.merchant,
          bank: stats.best.bank,
        })
      : p.aBiggestNone,
  });
  faqs.push(...commonFaqs({ locale, stats }));

  return { intro, faqs };
}

export function bankCategoryHubCopy(
  locale: Locale,
  bankLabel: string,
  categoryLabel: string,
  stats: HubStats,
): HubCopy {
  const p = getPhrases(locale);
  const intro: string[] = [];

  if (stats.count > 0) {
    intro.push(
      p.bankCatIntro({
        bank: bankLabel,
        category: categoryLabel,
        count: String(stats.count),
        monthYear: stats.monthYear,
      }),
    );
  }
  if (stats.best) {
    intro.push(
      p.bankBest({ bank: bankLabel, percentage: String(stats.best.percentage), merchant: stats.best.merchant }),
    );
  }
  if (stats.cardTypes.length > 0) {
    intro.push(p.bankCards({ bank: bankLabel, cardTypes: listJoin(locale, stats.cardTypes) }));
  }
  if (stats.expiringSoon > 0) {
    intro.push(p.catExpiring({ count: String(stats.expiringSoon), category: categoryLabel }));
  }
  if (stats.undated > 0) intro.push(p.catUndated({ count: String(stats.undated) }));

  const faqs: Faq[] = [
    {
      question: p.qBankCatCount({ bank: bankLabel, category: categoryLabel }),
      answer: p.aBankCatCount({
        bank: bankLabel,
        category: categoryLabel,
        count: String(stats.count),
        monthYear: stats.monthYear,
      }),
    },
    {
      question: p.qBiggest(`${bankLabel} ${categoryLabel.toLowerCase()}`),
      answer: stats.best
        ? p.aBiggest({
            percentage: String(stats.best.percentage),
            merchant: stats.best.merchant,
            bank: stats.best.bank,
          })
        : p.aBiggestNone,
    },
    ...commonFaqs({ locale, stats }),
  ];

  return { intro, faqs };
}

export function homeHubCopy(locale: Locale, stats: HubStats, topBank?: { name: string; count: number }): HubCopy {
  const p = getPhrases(locale);
  const intro: string[] = [];

  if (stats.count > 0) {
    intro.push(
      p.homeIntro({
        count: String(stats.count),
        bankCount: String(stats.bankCount),
        categoryCount: String(stats.categoryCount),
        monthYear: stats.monthYear,
      }),
    );
  }
  if (stats.topBanks.length > 0) intro.push(p.homeBanks({ banks: listJoin(locale, stats.topBanks) }));
  if (stats.best) {
    intro.push(
      p.homeBest({
        percentage: String(stats.best.percentage),
        merchant: stats.best.merchant,
        bank: stats.best.bank,
      }),
    );
  }
  if (stats.undated > 0) intro.push(p.catUndated({ count: String(stats.undated) }));

  const faqs: Faq[] = [];
  if (topBank) {
    faqs.push({
      question: p.qMostOffers,
      answer: p.aMostOffers({ bank: topBank.name, count: String(topBank.count) }),
    });
  }
  faqs.push({
    question: p.qBiggest(''),
    answer: stats.best
      ? p.aBiggest({
          percentage: String(stats.best.percentage),
          merchant: stats.best.merchant,
          bank: stats.best.bank,
        })
      : p.aBiggestNone,
  });
  faqs.push(...commonFaqs({ locale, stats }));

  return { intro, faqs };
}


/**
 * Copy for a town hub. Reuses the generic best-offer, expiring and undated
 * phrases rather than duplicating them per page type — only the framing
 * sentences and the "which banks" FAQ are location-specific.
 */
export function locationHubCopy(locale: Locale, town: string, stats: HubStats, categories: string[]): HubCopy {
  const p = getPhrases(locale);
  const banks = listJoin(locale, stats.topBanks);
  const intro: string[] = [];

  if (stats.count > 0 && banks) {
    intro.push(p.locIntro({ town, count: String(stats.count), monthYear: stats.monthYear, banks }));
  }
  if (categories.length > 0) {
    intro.push(p.locCategories({ town, categories: listJoin(locale, categories) }));
  }
  if (stats.best) {
    intro.push(
      p.catBest({
        percentage: String(stats.best.percentage),
        merchant: stats.best.merchant,
        bank: stats.best.bank,
      }),
    );
  }
  if (stats.expiringSoon > 0) intro.push(p.catExpiring({ count: String(stats.expiringSoon), category: town }));
  if (stats.undated > 0) intro.push(p.catUndated({ count: String(stats.undated) }));

  const faqs: Faq[] = [];
  if (banks) {
    faqs.push({
      question: p.qLocBanks(town),
      answer: p.aLocBanks({ town, banks, count: String(stats.count) }),
    });
  }
  faqs.push(...commonFaqs({ locale, stats }));

  return { intro, faqs };
}
