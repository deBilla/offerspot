import type { Locale } from './config';

/**
 * Copy for the card wallet — the one feature here that a bank's own site
 * structurally cannot offer, because each bank only knows its own offers.
 */
export interface WalletCopy {
  navLabel: string;
  title: string;
  description: string;
  chooseBanks: string;
  chooseCardTypes: string;
  cardTypeHint: string;
  clear: string;
  viewMatches: string;
  privacyNote: string;

  myOffersTitle: string;
  myOffersDescription: string;
  editCards: string;
  matchCount: (count: number) => string;
  noSelectionTitle: string;
  noSelectionBody: string;
  noSelectionCta: string;
  noMatchesTitle: string;
  noMatchesBody: string;
  expiringHeading: string;
  allMatchesHeading: string;
  selectedSummary: (banks: number, cardTypes: number) => string;
}

const en: WalletCopy = {
  navLabel: 'My cards',
  title: 'My cards',
  description:
    'Pick the cards you actually hold and the site will show only the offers you can use. Every bank site lists only its own promotions — this compares across all of them at once.',
  chooseBanks: 'Which banks issue your cards?',
  chooseCardTypes: 'Which card types do you hold?',
  cardTypeHint: 'Leave blank to include every card type.',
  clear: 'Clear selection',
  viewMatches: 'View my offers',
  privacyNote:
    'Saved in this browser only. No account, no sign-in, and nothing is sent to a server.',

  myOffersTitle: 'My offers',
  myOffersDescription: 'Live promotions matching the cards you saved.',
  editCards: 'Edit my cards',
  matchCount: (count) => `${count} ${count === 1 ? 'offer matches' : 'offers match'} your cards`,
  noSelectionTitle: 'No cards saved yet',
  noSelectionBody: 'Choose your banks and card types and this page will filter every live offer down to the ones you can actually use.',
  noSelectionCta: 'Choose my cards',
  noMatchesTitle: 'No live offers for your cards',
  noMatchesBody: 'Nothing is running for that combination right now. Try adding another bank, or browse all current offers.',
  expiringHeading: 'Ending soon',
  allMatchesHeading: 'All your offers',
  selectedSummary: (banks, cardTypes) =>
    `${banks} ${banks === 1 ? 'bank' : 'banks'}, ${cardTypes === 0 ? 'all card types' : `${cardTypes} card ${cardTypes === 1 ? 'type' : 'types'}`}`,
};

const si: WalletCopy = {
  navLabel: 'මගේ කාඩ්පත්',
  title: 'මගේ කාඩ්පත්',
  description:
    'ඔබ සතුව ඇති කාඩ්පත් තෝරන්න, එවිට ඔබට භාවිතා කළ හැකි දීමනා පමණක් පෙන්වයි. සෑම බැංකු වෙබ් අඩවියක්ම එහිම ප්‍රවර්ධන පමණක් ලැයිස්තුගත කරයි — මෙය ඒ සියල්ල එකවර සංසන්දනය කරයි.',
  chooseBanks: 'ඔබේ කාඩ්පත් නිකුත් කරන්නේ කුමන බැංකු ද?',
  chooseCardTypes: 'ඔබ සතුව ඇත්තේ කුමන කාඩ්පත් වර්ග ද?',
  cardTypeHint: 'සියලුම කාඩ්පත් වර්ග ඇතුළත් කිරීමට හිස්ව තබන්න.',
  clear: 'තේරීම ඉවත් කරන්න',
  viewMatches: 'මගේ දීමනා බලන්න',
  privacyNote: 'මෙම බ්‍රව්සරයේ පමණක් සුරකිනු ලැබේ. ගිණුමක් නැත, පිවිසීමක් නැත, සේවාදායකයකට කිසිවක් නොයවයි.',

  myOffersTitle: 'මගේ දීමනා',
  myOffersDescription: 'ඔබ සුරැකි කාඩ්පත් වලට ගැළපෙන සක්‍රීය ප්‍රවර්ධන.',
  editCards: 'මගේ කාඩ්පත් සංස්කරණය කරන්න',
  matchCount: (count) => `ඔබේ කාඩ්පත් වලට දීමනා ${count}ක් ගැළපේ`,
  noSelectionTitle: 'තවම කාඩ්පත් සුරකින්නේ නැත',
  noSelectionBody:
    'ඔබේ බැංකු සහ කාඩ්පත් වර්ග තෝරන්න, එවිට මෙම පිටුව සක්‍රීය සියලුම දීමනා ඔබට භාවිතා කළ හැකි ඒවාට පෙරයි.',
  noSelectionCta: 'මගේ කාඩ්පත් තෝරන්න',
  noMatchesTitle: 'ඔබේ කාඩ්පත් සඳහා සක්‍රීය දීමනා නොමැත',
  noMatchesBody:
    'එම සංයෝජනය සඳහා දැනට කිසිවක් ක්‍රියාත්මක නොවේ. තවත් බැංකුවක් එක් කිරීමට උත්සාහ කරන්න, නැතහොත් සියලුම වත්මන් දීමනා බලන්න.',
  expiringHeading: 'ඉක්මනින් අවසන් වේ',
  allMatchesHeading: 'ඔබේ සියලු දීමනා',
  selectedSummary: (banks, cardTypes) =>
    `බැංකු ${banks}ක්, ${cardTypes === 0 ? 'සියලුම කාඩ්පත් වර්ග' : `කාඩ්පත් වර්ග ${cardTypes}ක්`}`,
};

const ta: WalletCopy = {
  navLabel: 'என் கார்டுகள்',
  title: 'என் கார்டுகள்',
  description:
    'நீங்கள் வைத்திருக்கும் கார்டுகளைத் தேர்ந்தெடுங்கள், நீங்கள் பயன்படுத்தக்கூடிய சலுகைகள் மட்டும் காட்டப்படும். ஒவ்வொரு வங்கித் தளமும் அதன் சொந்தச் சலுகைகளை மட்டுமே பட்டியலிடுகிறது — இது அனைத்தையும் ஒரே நேரத்தில் ஒப்பிடுகிறது.',
  chooseBanks: 'உங்கள் கார்டுகளை எந்த வங்கிகள் வழங்குகின்றன?',
  chooseCardTypes: 'நீங்கள் எந்தக் கார்டு வகைகளை வைத்திருக்கிறீர்கள்?',
  cardTypeHint: 'அனைத்துக் கார்டு வகைகளையும் சேர்க்க காலியாக விடவும்.',
  clear: 'தேர்வை அழிக்கவும்',
  viewMatches: 'என் சலுகைகளைப் பார்க்கவும்',
  privacyNote:
    'இந்த உலாவியில் மட்டுமே சேமிக்கப்படுகிறது. கணக்கு இல்லை, உள்நுழைவு இல்லை, சேவையகத்திற்கு எதுவும் அனுப்பப்படுவதில்லை.',

  myOffersTitle: 'என் சலுகைகள்',
  myOffersDescription: 'நீங்கள் சேமித்த கார்டுகளுக்குப் பொருந்தும் செயலில் உள்ள சலுகைகள்.',
  editCards: 'என் கார்டுகளைத் திருத்தவும்',
  matchCount: (count) => `உங்கள் கார்டுகளுக்கு ${count} சலுகைகள் பொருந்துகின்றன`,
  noSelectionTitle: 'இதுவரை கார்டுகள் சேமிக்கப்படவில்லை',
  noSelectionBody:
    'உங்கள் வங்கிகளையும் கார்டு வகைகளையும் தேர்ந்தெடுங்கள், இந்தப் பக்கம் செயலில் உள்ள அனைத்துச் சலுகைகளையும் நீங்கள் பயன்படுத்தக்கூடியவற்றுக்கு வடிகட்டும்.',
  noSelectionCta: 'என் கார்டுகளைத் தேர்ந்தெடுக்கவும்',
  noMatchesTitle: 'உங்கள் கார்டுகளுக்குச் செயலில் சலுகைகள் இல்லை',
  noMatchesBody:
    'அந்தச் சேர்க்கைக்கு தற்போது எதுவும் இல்லை. மற்றொரு வங்கியைச் சேர்க்க முயற்சிக்கவும், அல்லது தற்போதைய அனைத்துச் சலுகைகளையும் பாருங்கள்.',
  expiringHeading: 'விரைவில் முடிவடைகிறது',
  allMatchesHeading: 'உங்கள் அனைத்துச் சலுகைகள்',
  selectedSummary: (banks, cardTypes) =>
    `${banks} வங்கிகள், ${cardTypes === 0 ? 'அனைத்துக் கார்டு வகைகள்' : `${cardTypes} கார்டு வகைகள்`}`,
};

const copies: Record<Locale, WalletCopy> = { en, si, ta };

export function getWalletCopy(locale: Locale): WalletCopy {
  return copies[locale] ?? en;
}
