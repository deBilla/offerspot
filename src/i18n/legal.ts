import type { Locale } from './config';

export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalDocument {
  intro: string;
  sections: LegalSection[];
}

/**
 * Privacy policy and terms text. Kept out of dictionaries.ts because it is long
 * prose rather than interface strings, and it changes on a different cadence.
 * Last reviewed 2026-08-04.
 */
export const LEGAL_LAST_UPDATED = '2026-08-04';

const privacy: Record<Locale, LegalDocument> = {
  en: {
    intro:
      'Card Promotions LK ("we", "the site") aggregates publicly published credit and debit card promotions from Sri Lankan banks. This policy explains what data we collect when you use the site and how it is handled.',
    sections: [
      {
        heading: 'Information we collect',
        body: [
          'We do not ask you to create an account and we do not collect your name, address, card number or any other personal detail directly.',
          'Like most websites, our hosting and analytics providers automatically receive standard technical information when you visit: your IP address, browser and device type, the pages you view, and the site that referred you.',
        ],
      },
      {
        heading: 'Cookies and analytics',
        body: [
          'We use Google Analytics to understand which offers and pages are useful. Google Analytics sets cookies that record anonymised usage statistics. We do not use these cookies to identify individual visitors.',
          'You can block or delete cookies in your browser settings, or install the Google Analytics opt-out add-on. The site works normally with cookies disabled.',
        ],
      },
      {
        heading: 'Advertising',
        body: [
          'We display advertising through Google AdSense. Google and its partners may use cookies or device identifiers to serve ads based on your prior visits to this and other websites.',
          'You can control personalised advertising in your Google Ads settings at adssettings.google.com.',
        ],
      },
      {
        heading: 'Links to bank websites',
        body: [
          'Offer pages link out to the bank or merchant that published the promotion. Once you follow such a link you are on their site, governed by their privacy policy, not ours.',
        ],
      },
      {
        heading: 'Data retention and sharing',
        body: [
          'We do not sell, rent or trade visitor data. Aggregated analytics data is retained by Google according to their standard retention settings.',
        ],
      },
      {
        heading: 'Contact',
        body: [
          'For any question about this policy, or to request removal of information, contact us through the site. We respond to reasonable requests within 30 days.',
        ],
      },
    ],
  },
  si: {
    intro:
      'කාඩ්පත් ප්‍රවර්ධන LK ("අපි", "මෙම වෙබ් අඩවිය") ශ්‍රී ලංකාවේ බැංකු විසින් ප්‍රසිද්ධියේ ප්‍රකාශයට පත් කරන ලද ක්‍රෙඩිට් සහ ඩෙබිට් කාඩ්පත් ප්‍රවර්ධන එකතු කරයි. ඔබ මෙම වෙබ් අඩවිය භාවිතා කරන විට අප රැස් කරන දත්ත සහ ඒවා හසුරුවන ආකාරය මෙම ප්‍රතිපත්තියෙන් පැහැදිලි කෙරේ.',
    sections: [
      {
        heading: 'අප රැස් කරන තොරතුරු',
        body: [
          'ගිණුමක් සෑදීමට අපි ඔබෙන් ඉල්ලා නොසිටින අතර ඔබේ නම, ලිපිනය, කාඩ්පත් අංකය හෝ වෙනත් කිසිදු පුද්ගලික තොරතුරක් අපි කෙලින්ම රැස් නොකරමු.',
          'බොහෝ වෙබ් අඩවි මෙන්, ඔබ පිවිසෙන විට අපගේ සත්කාරක සහ විශ්ලේෂණ සැපයුම්කරුවන්ට සම්මත තාක්ෂණික තොරතුරු ස්වයංක්‍රීයව ලැබේ: ඔබේ IP ලිපිනය, බ්‍රව්සරය සහ උපාංග වර්ගය, ඔබ නරඹන පිටු, සහ ඔබව යොමු කළ වෙබ් අඩවිය.',
        ],
      },
      {
        heading: 'කුකීස් සහ විශ්ලේෂණ',
        body: [
          'කුමන දීමනා සහ පිටු ප්‍රයෝජනවත් දැයි තේරුම් ගැනීමට අපි Google Analytics භාවිතා කරමු. Google Analytics විසින් නිර්නාමික භාවිත සංඛ්‍යාලේඛන වාර්තා කරන කුකීස් සකසයි. පුද්ගල අමුත්තන් හඳුනා ගැනීමට අපි මෙම කුකීස් භාවිතා නොකරමු.',
          'ඔබේ බ්‍රව්සර සැකසුම් තුළ කුකීස් අවහිර කිරීමට හෝ මකා දැමීමට හැකිය. කුකීස් අක්‍රීය කර ඇතත් වෙබ් අඩවිය සාමාන්‍ය පරිදි ක්‍රියා කරයි.',
        ],
      },
      {
        heading: 'දැන්වීම්',
        body: [
          'අපි Google AdSense හරහා දැන්වීම් ප්‍රදර්ශනය කරමු. මෙම සහ වෙනත් වෙබ් අඩවි වෙත ඔබේ පෙර පැමිණීම් මත පදනම්ව දැන්වීම් සැපයීම සඳහා Google සහ එහි හවුල්කරුවන් කුකීස් හෝ උපාංග හඳුනාගැනීම් භාවිතා කළ හැක.',
          'adssettings.google.com හි ඔබේ Google දැන්වීම් සැකසුම් තුළ පුද්ගලීකරණය කළ දැන්වීම් පාලනය කළ හැක.',
        ],
      },
      {
        heading: 'බැංකු වෙබ් අඩවි වෙත සබැඳි',
        body: [
          'දීමනා පිටු ප්‍රවර්ධනය ප්‍රකාශයට පත් කළ බැංකුව හෝ වෙළෙන්දා වෙත සබැඳේ. එවැනි සබැඳියක් අනුගමනය කළ පසු ඔබ සිටින්නේ ඔවුන්ගේ වෙබ් අඩවියේ වන අතර, එය පාලනය වන්නේ ඔවුන්ගේ රහස්‍යතා ප්‍රතිපත්තියෙනි, අපගේ එකෙන් නොවේ.',
        ],
      },
      {
        heading: 'දත්ත රඳවා ගැනීම සහ බෙදාගැනීම',
        body: [
          'අමුත්තන්ගේ දත්ත අපි විකුණන්නේ, කුලියට දෙන්නේ හෝ හුවමාරු කරන්නේ නැත. සමස්ත විශ්ලේෂණ දත්ත Google විසින් ඔවුන්ගේ සම්මත සැකසුම් අනුව රඳවා ගනී.',
        ],
      },
      {
        heading: 'සම්බන්ධ වන්න',
        body: [
          'මෙම ප්‍රතිපත්තිය පිළිබඳ ඕනෑම ප්‍රශ්නයක් සඳහා, හෝ තොරතුරු ඉවත් කිරීම ඉල්ලීමට, වෙබ් අඩවිය හරහා අප හා සම්බන්ධ වන්න. සාධාරණ ඉල්ලීම්වලට දින 30ක් ඇතුළත අපි ප්‍රතිචාර දක්වමු.',
        ],
      },
    ],
  },
  ta: {
    intro:
      'கார்டு புரமோஷன்ஸ் LK ("நாங்கள்", "இந்தத் தளம்") இலங்கை வங்கிகளால் பொதுவில் வெளியிடப்பட்ட கிரெடிட் மற்றும் டெபிட் கார்டு சலுகைகளை ஒருங்கிணைக்கிறது. இந்தத் தளத்தைப் பயன்படுத்தும்போது நாங்கள் சேகரிக்கும் தரவு மற்றும் அது எவ்வாறு கையாளப்படுகிறது என்பதை இந்தக் கொள்கை விளக்குகிறது.',
    sections: [
      {
        heading: 'நாங்கள் சேகரிக்கும் தகவல்',
        body: [
          'கணக்கை உருவாக்கும்படி நாங்கள் உங்களைக் கேட்பதில்லை; உங்கள் பெயர், முகவரி, கார்டு எண் அல்லது வேறு எந்தத் தனிப்பட்ட விவரத்தையும் நேரடியாகச் சேகரிப்பதில்லை.',
          'பெரும்பாலான இணையதளங்களைப் போலவே, நீங்கள் வருகை தரும்போது எங்கள் ஹோஸ்டிங் மற்றும் அனலிட்டிக்ஸ் வழங்குநர்கள் நிலையான தொழில்நுட்பத் தகவல்களைத் தானாகவே பெறுகிறார்கள்: உங்கள் IP முகவரி, உலாவி மற்றும் சாதன வகை, நீங்கள் பார்க்கும் பக்கங்கள், உங்களைப் பரிந்துரைத்த தளம்.',
        ],
      },
      {
        heading: 'குக்கீகள் மற்றும் அனலிட்டிக்ஸ்',
        body: [
          'எந்தச் சலுகைகள் மற்றும் பக்கங்கள் பயனுள்ளவை என்பதைப் புரிந்துகொள்ள Google Analytics ஐப் பயன்படுத்துகிறோம். Google Analytics அநாமதேயப் பயன்பாட்டுப் புள்ளிவிவரங்களைப் பதிவுசெய்யும் குக்கீகளை அமைக்கிறது. தனிப்பட்ட பார்வையாளர்களை அடையாளம் காண இந்தக் குக்கீகளைப் பயன்படுத்துவதில்லை.',
          'உங்கள் உலாவி அமைப்புகளில் குக்கீகளைத் தடுக்கலாம் அல்லது நீக்கலாம். குக்கீகள் முடக்கப்பட்டிருந்தாலும் தளம் இயல்பாகவே செயல்படும்.',
        ],
      },
      {
        heading: 'விளம்பரம்',
        body: [
          'Google AdSense மூலம் விளம்பரங்களைக் காட்டுகிறோம். இந்த மற்றும் பிற இணையதளங்களுக்கான உங்கள் முந்தைய வருகைகளின் அடிப்படையில் விளம்பரங்களை வழங்க Google மற்றும் அதன் கூட்டாளர்கள் குக்கீகள் அல்லது சாதன அடையாளங்காட்டிகளைப் பயன்படுத்தலாம்.',
          'adssettings.google.com இல் உங்கள் Google விளம்பர அமைப்புகளில் தனிப்பயனாக்கப்பட்ட விளம்பரங்களைக் கட்டுப்படுத்தலாம்.',
        ],
      },
      {
        heading: 'வங்கி இணையதளங்களுக்கான இணைப்புகள்',
        body: [
          'சலுகைப் பக்கங்கள் அந்தச் சலுகையை வெளியிட்ட வங்கி அல்லது வணிகருக்கு இணைக்கின்றன. அத்தகைய இணைப்பைப் பின்தொடர்ந்தவுடன் நீங்கள் அவர்களின் தளத்தில் இருப்பீர்கள்; அது எங்கள் கொள்கையால் அல்ல, அவர்களின் தனியுரிமைக் கொள்கையால் நிர்வகிக்கப்படுகிறது.',
        ],
      },
      {
        heading: 'தரவு தக்கவைப்பு மற்றும் பகிர்வு',
        body: [
          'பார்வையாளர் தரவை நாங்கள் விற்பதோ, வாடகைக்கு விடுவதோ, பரிமாறுவதோ இல்லை. ஒருங்கிணைந்த அனலிட்டிக்ஸ் தரவு Google ஆல் அவர்களின் நிலையான அமைப்புகளின்படி வைக்கப்படுகிறது.',
        ],
      },
      {
        heading: 'தொடர்பு',
        body: [
          'இந்தக் கொள்கை குறித்த எந்தக் கேள்விக்கும், அல்லது தகவலை நீக்கக் கோர, தளத்தின் மூலம் எங்களைத் தொடர்பு கொள்ளுங்கள். நியாயமான கோரிக்கைகளுக்கு 30 நாட்களுக்குள் பதிலளிப்போம்.',
        ],
      },
    ],
  },
};

const terms: Record<Locale, LegalDocument> = {
  en: {
    intro:
      'By using Card Promotions LK you accept these terms. If you do not agree with them, please do not use the site.',
    sections: [
      {
        heading: 'What this site is',
        body: [
          'Card Promotions LK is an independent directory of credit and debit card promotions published by banks in Sri Lanka. We are not a bank, we are not affiliated with, endorsed by or acting on behalf of any bank or merchant listed here.',
        ],
      },
      {
        heading: 'Accuracy of offer information',
        body: [
          'Offer details are collected automatically from bank and merchant websites and are reproduced here for convenience. Promotions change, get withdrawn, or carry conditions that are not visible in the published summary.',
          'We make no warranty that any offer shown here is current, complete or accurate. Always confirm the offer, its terms and its expiry directly with the issuing bank before you make a purchase. We are not liable for any loss arising from reliance on information shown on this site.',
        ],
      },
      {
        heading: 'Not financial advice',
        body: [
          'Nothing on this site is financial, credit or purchasing advice. Choosing a credit card or making a purchase is your decision and your responsibility.',
        ],
      },
      {
        heading: 'Intellectual property',
        body: [
          'Bank names, merchant names, logos and trademarks belong to their respective owners and are used here only to identify the offers being described.',
          'The site layout, code and compiled listings are ours. You may link to any page freely; bulk copying or scraping of the listings is not permitted.',
        ],
      },
      {
        heading: 'Availability',
        body: [
          'The site is provided "as is" with no guarantee of uninterrupted availability. We may change, suspend or remove any part of it at any time.',
        ],
      },
      {
        heading: 'Changes to these terms',
        body: ['We may update these terms. Continued use of the site after a change means you accept the revised terms.'],
      },
    ],
  },
  si: {
    intro:
      'කාඩ්පත් ප්‍රවර්ධන LK භාවිතා කිරීමෙන් ඔබ මෙම නියම පිළිගනී. ඔබ ඒවාට එකඟ නොවන්නේ නම්, කරුණාකර වෙබ් අඩවිය භාවිතා නොකරන්න.',
    sections: [
      {
        heading: 'මෙම වෙබ් අඩවිය යනු කුමක්ද',
        body: [
          'කාඩ්පත් ප්‍රවර්ධන LK යනු ශ්‍රී ලංකාවේ බැංකු විසින් ප්‍රකාශයට පත් කරන ලද ක්‍රෙඩිට් සහ ඩෙබිට් කාඩ්පත් ප්‍රවර්ධන පිළිබඳ ස්වාධීන නාමාවලියකි. අපි බැංකුවක් නොවේ; මෙහි ලැයිස්තුගත කර ඇති කිසිදු බැංකුවක් හෝ වෙළෙන්දෙකු සමඟ අප සම්බන්ධ නොවන අතර ඔවුන් වෙනුවෙන් ක්‍රියා නොකරමු.',
        ],
      },
      {
        heading: 'දීමනා තොරතුරුවල නිරවද්‍යතාව',
        body: [
          'දීමනා විස්තර බැංකු සහ වෙළෙන්දන්ගේ වෙබ් අඩවිවලින් ස්වයංක්‍රීයව රැස් කර පහසුව සඳහා මෙහි නැවත ඉදිරිපත් කෙරේ. ප්‍රවර්ධන වෙනස් වේ, ඉවත් කරනු ලැබේ, හෝ ප්‍රකාශිත සාරාංශයේ නොපෙනෙන කොන්දේසි දරයි.',
          'මෙහි පෙන්වා ඇති කිසිදු දීමනාවක් වත්මන්, සම්පූර්ණ හෝ නිවැරදි බවට අපි කිසිදු වගකීමක් නොදෙමු. මිලදී ගැනීමකට පෙර දීමනාව, එහි නියම සහ කල් ඉකුත්වීම නිකුත් කරන බැංකුවෙන් සැමවිටම කෙලින්ම තහවුරු කර ගන්න. මෙම වෙබ් අඩවියේ පෙන්වා ඇති තොරතුරු මත විශ්වාසය තැබීමෙන් ඇති වන කිසිදු අලාභයකට අපි වගකිව යුතු නොවේ.',
        ],
      },
      {
        heading: 'මූල්‍ය උපදෙස් නොවේ',
        body: [
          'මෙම වෙබ් අඩවියේ කිසිවක් මූල්‍ය, ණය හෝ මිලදී ගැනීමේ උපදෙස් නොවේ. ක්‍රෙඩිට් කාඩ්පතක් තෝරා ගැනීම හෝ මිලදී ගැනීමක් කිරීම ඔබේ තීරණය සහ ඔබේ වගකීමයි.',
        ],
      },
      {
        heading: 'බුද්ධිමය දේපළ',
        body: [
          'බැංකු නම්, වෙළෙන්දන්ගේ නම්, ලාංඡන සහ වෙළඳ ලකුණු ඒවායේ අදාළ හිමිකරුවන්ට අයත් වන අතර විස්තර කරන දීමනා හඳුනා ගැනීමට පමණක් මෙහි භාවිතා කෙරේ.',
          'වෙබ් අඩවියේ සැලසුම, කේතය සහ සම්පාදිත ලැයිස්තු අපට අයත් වේ. ඕනෑම පිටුවකට නිදහසේ සබැඳිය හැක; ලැයිස්තු තොග වශයෙන් පිටපත් කිරීම හෝ ස්ක්‍රැප් කිරීම අනුමත නොකෙරේ.',
        ],
      },
      {
        heading: 'ලබා ගත හැකි බව',
        body: [
          'වෙබ් අඩවිය "ඇති පරිදි" සපයනු ලබන අතර බාධාවකින් තොරව ලබා ගත හැකි බවට කිසිදු සහතිකයක් නොමැත. ඕනෑම වේලාවක ඕනෑම කොටසක් වෙනස් කිරීමට, අත්හිටුවීමට හෝ ඉවත් කිරීමට අපට හැකිය.',
        ],
      },
      {
        heading: 'මෙම නියමවල වෙනස්කම්',
        body: [
          'අපි මෙම නියම යාවත්කාලීන කළ හැක. වෙනසකින් පසු වෙබ් අඩවිය දිගටම භාවිතා කිරීම යනු ඔබ සංශෝධිත නියම පිළිගන්නා බවයි.',
        ],
      },
    ],
  },
  ta: {
    intro:
      'கார்டு புரமோஷன்ஸ் LK ஐப் பயன்படுத்துவதன் மூலம் இந்த விதிமுறைகளை நீங்கள் ஏற்கிறீர்கள். அவற்றுடன் உடன்படவில்லை என்றால், தயவுசெய்து தளத்தைப் பயன்படுத்த வேண்டாம்.',
    sections: [
      {
        heading: 'இந்தத் தளம் என்ன',
        body: [
          'கார்டு புரமோஷன்ஸ் LK என்பது இலங்கை வங்கிகளால் வெளியிடப்பட்ட கிரெடிட் மற்றும் டெபிட் கார்டு சலுகைகளின் சுயாதீன அடைவு. நாங்கள் வங்கி அல்ல; இங்கு பட்டியலிடப்பட்டுள்ள எந்த வங்கியுடனும் வணிகருடனும் தொடர்புடையவர்கள் அல்ல, அவர்கள் சார்பாகச் செயல்படுவதும் இல்லை.',
        ],
      },
      {
        heading: 'சலுகைத் தகவலின் துல்லியம்',
        body: [
          'சலுகை விவரங்கள் வங்கி மற்றும் வணிகர் இணையதளங்களிலிருந்து தானாகவே சேகரிக்கப்பட்டு வசதிக்காக இங்கு மீண்டும் வழங்கப்படுகின்றன. சலுகைகள் மாறலாம், திரும்பப் பெறப்படலாம், அல்லது வெளியிடப்பட்ட சுருக்கத்தில் தெரியாத நிபந்தனைகளைக் கொண்டிருக்கலாம்.',
          'இங்கு காட்டப்படும் எந்தச் சலுகையும் நடப்பிலுள்ளது, முழுமையானது அல்லது துல்லியமானது என்று நாங்கள் உத்தரவாதம் அளிக்கவில்லை. கொள்முதல் செய்வதற்கு முன் சலுகை, அதன் விதிமுறைகள் மற்றும் காலாவதி தேதியை வழங்கும் வங்கியிடம் நேரடியாக எப்போதும் உறுதிப்படுத்திக் கொள்ளுங்கள். இந்தத் தளத்தில் காட்டப்படும் தகவலை நம்பியதால் ஏற்படும் எந்த இழப்புக்கும் நாங்கள் பொறுப்பல்ல.',
        ],
      },
      {
        heading: 'நிதி ஆலோசனை அல்ல',
        body: [
          'இந்தத் தளத்தில் உள்ள எதுவும் நிதி, கடன் அல்லது கொள்முதல் ஆலோசனை அல்ல. கிரெடிட் கார்டைத் தேர்ந்தெடுப்பதோ கொள்முதல் செய்வதோ உங்கள் முடிவும் உங்கள் பொறுப்பும் ஆகும்.',
        ],
      },
      {
        heading: 'அறிவுசார் சொத்து',
        body: [
          'வங்கிப் பெயர்கள், வணிகர் பெயர்கள், சின்னங்கள் மற்றும் வர்த்தக முத்திரைகள் அந்தந்த உரிமையாளர்களுக்குச் சொந்தமானவை; விவரிக்கப்படும் சலுகைகளை அடையாளம் காண மட்டுமே இங்கு பயன்படுத்தப்படுகின்றன.',
          'தளத்தின் வடிவமைப்பு, குறியீடு மற்றும் தொகுக்கப்பட்ட பட்டியல்கள் எங்களுடையவை. எந்தப் பக்கத்திற்கும் சுதந்திரமாக இணைக்கலாம்; பட்டியல்களை மொத்தமாக நகலெடுப்பது அல்லது ஸ்கிராப் செய்வது அனுமதிக்கப்படாது.',
        ],
      },
      {
        heading: 'கிடைக்கும் தன்மை',
        body: [
          'தளம் "உள்ளபடியே" வழங்கப்படுகிறது; தடையற்ற கிடைக்கும் தன்மைக்கு உத்தரவாதம் இல்லை. எந்த நேரத்திலும் எந்தப் பகுதியையும் மாற்றலாம், இடைநிறுத்தலாம் அல்லது அகற்றலாம்.',
        ],
      },
      {
        heading: 'இந்த விதிமுறைகளில் மாற்றங்கள்',
        body: [
          'இந்த விதிமுறைகளைப் புதுப்பிக்கலாம். மாற்றத்திற்குப் பிறகு தளத்தைத் தொடர்ந்து பயன்படுத்துவது திருத்தப்பட்ட விதிமுறைகளை நீங்கள் ஏற்கிறீர்கள் என்பதைக் குறிக்கிறது.',
        ],
      },
    ],
  },
};

export function getPrivacyPolicy(locale: Locale): LegalDocument {
  return privacy[locale] ?? privacy.en;
}

export function getTermsOfService(locale: Locale): LegalDocument {
  return terms[locale] ?? terms.en;
}
