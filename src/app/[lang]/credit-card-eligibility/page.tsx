import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdSenseProvider from '@/app/components/AdsenseProvider';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import { isLocale, localeHtmlLang, localizedPath, locales, type Locale } from '@/i18n/config';
import { getDictionary, translateBank } from '@/i18n/dictionaries';
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, ogImageUrl, ogTextLocale } from '@/lib/seo';
import {
  type BankEligibility,
  bankEligibility,
  banksWithPublishedIncome,
  banksWithoutPublishedIncome,
  eligibilityCheckedOn,
} from '@/lib/card-eligibility';
import { getActiveOffers, getOffersByBank, slugify } from '@/lib/offers';

export const revalidate = 86400;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const imageDict = getDictionary(ogTextLocale(lang));
  return buildMetadata({
    locale: lang,
    path: '/credit-card-eligibility',
    title: dict.pages.eligibilityTitle,
    description: dict.pages.eligibilityDescription,
    image: ogImageUrl({
      title: imageDict.pages.eligibilityTitle,
      subtitle: imageDict.tagline,
      locale: ogTextLocale(lang),
    }),
    imageAlt: dict.pages.eligibilityTitle,
  });
}

function BankBlock({ entry, locale }: { entry: BankEligibility; locale: Locale }) {
  const dict = getDictionary(locale);
  const label = translateBank(locale, entry.bank);
  const offerCount = getOffersByBank(entry.bank, getActiveOffers()).length;

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xl font-bold text-gray-900">{label}</h3>
        {offerCount > 0 && (
          <Link
            href={localizedPath(locale, `/bank/${slugify(entry.bank)}`)}
            className="text-sm font-medium text-teal-700 hover:underline"
          >
            {dict.pages.eligibilityViewOffers(label)} ({offerCount})
          </Link>
        )}
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="font-semibold text-gray-500">{dict.pages.eligibilityMinIncome}</dt>
          <dd className={entry.minIncome ? 'font-bold text-gray-900' : 'text-gray-500'}>
            {entry.minIncome ?? dict.pages.eligibilityNotPublished}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-gray-500">{dict.pages.eligibilityAge}</dt>
          <dd className={entry.ageRange ? 'text-gray-900' : 'text-gray-500'}>
            {entry.ageRange ?? dict.pages.eligibilityNotPublished}
          </dd>
        </div>
        {entry.residency && (
          <div>
            <dt className="font-semibold text-gray-500">{dict.pages.eligibilityResidency}</dt>
            <dd className="text-gray-900">{entry.residency}</dd>
          </div>
        )}
      </dl>

      {entry.incomeNote && (
        <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-gray-700">
          {entry.incomeNote}
        </p>
      )}

      {entry.tiers && entry.tiers.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-2 font-semibold text-gray-800">{dict.pages.eligibilityTiersHeading}</h4>
          <ul className="space-y-1 text-sm text-gray-700">
            {entry.tiers.map((tier) => (
              <li key={tier.name} className="flex flex-wrap gap-x-2">
                <span className="font-medium text-gray-900">{tier.name}</span>
                {tier.limit && <span>— {tier.limit}</span>}
                {tier.income && <span>— {tier.income}</span>}
                {tier.note && <span className="text-gray-500">({tier.note})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <h4 className="mb-2 font-semibold text-gray-800">{dict.pages.eligibilityDocumentsHeading}</h4>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
            {entry.documents.map((doc) => (
              <li key={doc}>{doc}</li>
            ))}
          </ul>
        </div>
        {entry.selfEmployedDocuments && (
          <div>
            <h4 className="mb-2 font-semibold text-gray-800">{dict.pages.eligibilitySelfEmployedHeading}</h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
              {entry.selfEmployedDocuments.map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {entry.otherConditions && (
        <div className="mt-5">
          <h4 className="mb-2 font-semibold text-gray-800">{dict.pages.eligibilityConditionsHeading}</h4>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
            {entry.otherConditions.map((condition) => (
              <li key={condition}>{condition}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-5 border-t border-gray-100 pt-3 text-xs text-gray-500">
        {dict.pages.eligibilitySource}:{' '}
        <a
          href={entry.source}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-teal-700 hover:underline"
        >
          {new URL(entry.source).hostname}
        </a>{' '}
        · {dict.pages.eligibilityChecked(entry.checked)}
      </p>
    </section>
  );
}

export default async function EligibilityPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);

  const published = banksWithPublishedIncome();
  const unpublished = banksWithoutPublishedIncome();

  const crumbs = [
    { name: dict.breadcrumb.home, path: '/' },
    { name: dict.pages.eligibilityTitle, path: '/credit-card-eligibility' },
  ];

  /*
   * FAQPage rather than a bare article: these are the questions verbatim, and
   * it is the shape Google's rich results and the AI answer engines read. The
   * answers deliberately name the bank and quote the figure, so a citation
   * lifted out of context is still correct and attributable.
   */
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: localeHtmlLang[locale],
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the minimum salary for a credit card in Sri Lanka?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'It depends on the bank and the card tier. Commercial Bank states Rs 50,000 per month gross, falling to Rs 40,000 if you remit your salary to them, and Rs 125,000 for Platinum cards. Nations Trust Bank states LKR 150,000 net, or LKR 200,000 for accountants, IT professionals, engineers and architects. Bank of Ceylon, People’s Bank, HNB and DFCC do not publish a minimum figure and assess applicants individually.',
        },
      },
      {
        '@type': 'Question',
        name: 'What documents do I need to apply for a credit card in Sri Lanka?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Every bank asks for photo ID (NIC, passport or driving licence), proof of income such as recent payslips, and proof of address such as a utility bill where it differs from your NIC. HNB asks for three months of certified salary slips. Nations Trust Bank asks for two years of income history and three months of bank statements. If you are self-employed, expect to add business registration, tax records and up to three years of financial statements.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I get a credit card with a lower salary in Sri Lanka?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Two published routes lower the bar. Commercial Bank reduces its threshold from Rs 50,000 to Rs 40,000 per month if your salary is remitted to the bank. Nations Trust Bank offers a "Credit Plus" route requiring LKR 200,000 of credit turnover through a personal account, or an existing credit card limit of LKR 500,000 at another bank, instead of meeting the income test. Banks that publish no minimum assess income alongside your wider financial position.',
        },
      },
      {
        '@type': 'Question',
        name: 'What age do you need to be for a credit card in Sri Lanka?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Eighteen is the floor everywhere it is published. People’s Bank states 18 to 65 for Sri Lankan citizens. Bank of Ceylon requires you to be over 18 on the date of application and a citizen or resident, or a non-resident holding an NRFC or RFC account. Commercial Bank and Nations Trust Bank both state 18 and over.',
        },
      },
    ],
  };

  return (
    <>
      <AdSenseProvider />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
      <main id="main-content" className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-4xl px-4 py-6 sm:py-10">
          <Breadcrumbs locale={locale} items={crumbs} />
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{dict.pages.eligibilityTitle}</h1>
          <p className="mt-3 max-w-3xl leading-relaxed text-gray-600">
            {dict.pages.eligibilityIntro(bankEligibility.length)}
          </p>

          <h2 className="mt-10 text-xl font-bold text-gray-900">{dict.pages.eligibilityPublishedHeading}</h2>
          <div className="mt-4 space-y-5">
            {published.map((entry) => (
              <BankBlock key={entry.bank} entry={entry} locale={locale} />
            ))}
          </div>

          <h2 className="mt-10 text-xl font-bold text-gray-900">{dict.pages.eligibilityUnpublishedHeading}</h2>
          <div className="mt-4 space-y-5">
            {unpublished.map((entry) => (
              <BankBlock key={entry.bank} entry={entry} locale={locale} />
            ))}
          </div>

          <p className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">
            {dict.pages.eligibilityDisclaimer} {dict.pages.eligibilityChecked(eligibilityCheckedOn)}
          </p>
        </div>
      </main>
    </>
  );
}
