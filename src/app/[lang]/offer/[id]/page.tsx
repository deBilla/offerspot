import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdSenseProvider from '@/app/components/AdsenseProvider';
import JsonLd from '@/app/components/JsonLd';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { isLocale, localeHtmlLang, localizedPath, locales, type Locale } from '@/i18n/config';
import { getDictionary, translateBank, translateCardType, translateCategory } from '@/i18n/dictionaries';
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, ogImageUrl, ogTextLocale, siteUrl } from '@/lib/seo';
import {
  clamp,
  daysUntilExpiry,
  endDateOf,
  formatDate,
  formatDiscount,
  formatEndDate,
  formatNumber,
  getActiveOffers,
  getOfferById,
  getRelatedOffers,
  isExpired,
  isMeaningful,
  isPlaceholderOffer,
  merchantName,
  offerMetaDescription,
  offerMetaTitle,
  parseDate,
  slugify,
} from '@/lib/offers';
import type { Offer } from '@/types/offer';

/**
 * The social card for an offer, built once so the metadata tag and the
 * schema.org image cannot drift apart.
 *
 * `imageLocale` is deliberately the caller's — see ogTextLocale(): the Sinhala
 * card is drawn in Latin, so its deadline has to be too.
 */
function offerOgImage(offer: Offer, imageLocale: Locale): string {
  const dict = getDictionary(imageLocale);
  const days = daysUntilExpiry(offer);
  // An expired offer gets no countdown: "0 days left" reads as "today", and
  // the page already says it has ended.
  const expired = isExpired(offer);

  return ogImageUrl({
    title: offer.title,
    subtitle: merchantName(imageLocale, offer),
    badge: translateCategory(imageLocale, offer.category),
    discount: formatDiscount(imageLocale, offer) ?? undefined,
    bank: offer.bank,
    expiry:
      days === null || expired
        ? undefined
        : days === 0
          ? dict.browse.expiresToday
          : dict.browse.daysLeft(days),
    days: days === null || expired ? undefined : days,
    locale: imageLocale,
  });
}

// Offer data is a build-time JSON snapshot refreshed by the crawler pipeline;
// re-render daily so "days left" badges and expiry states do not go stale.
export const revalidate = 86400;

/**
 * Only live offers are prerendered. The ~736 expired ones still resolve — they
 * are rendered on demand and cached — but paying to build them on every deploy
 * buys nothing, since they are noindex and reachable only from old links.
 */
export function generateStaticParams() {
  return locales.flatMap((lang) => getActiveOffers().map((offer) => ({ lang, id: offer.id })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const offer = getOfferById(id);
  if (!offer) return { title: getDictionary(lang).notFound.title, robots: { index: false, follow: false } };

  const title = clamp(offerMetaTitle(lang, offer), 65);
  const description = clamp(offerMetaDescription(lang, offer), 300);
  // See ogTextLocale(): the Sinhala card is drawn with Latin text because
  // Satori cannot shape Sinhala. The tags above stay fully localized.
  const imageLocale = ogTextLocale(lang);

  return buildMetadata({
    locale: lang,
    path: `/offer/${offer.id}`,
    title,
    description,
    image: offerOgImage(offer, imageLocale),
    imageAlt: title,
    /*
     * Offer pages are noindex, follow — deliberately, in all three locales.
     *
     * Each one republishes a bank's promo blurb: a median of ~129 characters of
     * third-party text, with no end date on most of them. Multiplying that by
     * three locales whose body copy is identical English would put ~2,500 near-
     * duplicate thin pages into the index, which is what Google's scaled-content
     * policy targets and what burns crawl budget on a site this size.
     *
     * The indexable surface is the aggregation hubs (/, /banks, /categories,
     * and the per-bank and per-category pages) where the compilation itself is
     * the value being added. "follow" keeps link equity flowing back to them.
     *
     * This has no effect on sharing: og:/twitter: tags are read by social
     * scrapers regardless of robots directives, so previews still work here.
     */
    noIndex: true,
    type: 'article',
    publishedTime: parseDate(offer.validity?.start_date)?.toISOString(),
    modifiedTime: endDateOf(offer)?.toISOString(),
  });
}

const iconClass = 'mr-3 h-5 w-5 shrink-0 text-teal-600';
const svgProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

const BankIcon = () => (
  <svg {...svgProps} className={iconClass}>
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);
const CalendarIcon = () => (
  <svg {...svgProps} className={iconClass}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);
const TagIcon = () => (
  <svg {...svgProps} className={iconClass}>
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>
);
const TermsIcon = () => (
  <svg {...svgProps} className={iconClass}>
    <path d="m12 14 4-4" />
    <path d="M12 14 8 10" />
    <path d="M12 20a8 8 0 0 0 8-8V7a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v5a8 8 0 0 0 8 8Z" />
  </svg>
);
const MapPinIcon = () => (
  <svg {...svgProps} className={iconClass}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const ExternalLinkIcon = () => (
  <svg {...svgProps} className="ml-2 inline-block h-5 w-5">
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

export default async function OfferPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  const offer = getOfferById(id);
  // A missing offer must return a real 404, not a redirect to the homepage —
  // a 307 to "/" is a soft 404 and gets the URL treated as a duplicate of home.
  // Placeholder rows ("No Offers Available", bare "View details" stubs) are not
  // promotions and have nothing to render, so they 404 too.
  if (!offer || isPlaceholderOffer(offer)) notFound();

  const dict = getDictionary(locale);
  const imageLocale = ogTextLocale(locale);
  const expired = isExpired(offer);
  const discount = formatDiscount(locale, offer);
  const merchant = merchantName(locale, offer);
  const bankLabel = translateBank(locale, offer.bank);
  const categoryLabel = translateCategory(locale, offer.category);
  const startDate = formatDate(locale, offer.validity?.start_date);
  const endDate = formatEndDate(locale, offer);
  const startIso = parseDate(offer.validity?.start_date)?.toISOString();
  const endIso = endDateOf(offer)?.toISOString();
  const address = offer.location?.address;
  const hasAddress = isMeaningful(address) && address !== 'Online Booking';
  const maxDiscount = offer.offer_details?.max_discount_lkr;
  const related = getRelatedOffers(offer);
  const sourceUrl = offer.source_url && offer.source_url !== '#' ? offer.source_url : null;
  const canonical = absoluteUrl(localizedPath(locale, `/offer/${offer.id}`));

  const crumbs = [
    { name: dict.breadcrumb.home, path: '/' },
    { name: categoryLabel, path: `/categories/${slugify(offer.category)}` },
    { name: merchant, path: `/offer/${offer.id}` },
  ];

  const offerJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    '@id': `${canonical}#offer`,
    name: offer.title,
    description: offer.description,
    url: canonical,
    inLanguage: localeHtmlLang[locale],
    image: offerOgImage(offer, imageLocale),
    category: offer.category,
    availability: expired ? 'https://schema.org/Discontinued' : 'https://schema.org/InStock',
    ...(offer.offer_details?.value
      ? {
          discount: offer.offer_details.value,
          discountCurrency: offer.offer_details.currency || 'LKR',
        }
      : {}),
    validFrom: startIso,
    validThrough: endIso,
    offeredBy: {
      '@type': 'BankOrCreditUnion',
      name: offer.bank,
      url: absoluteUrl(localizedPath(locale, `/bank/${slugify(offer.bank)}`)),
    },
    seller: {
      '@type': 'Organization',
      name: isMeaningful(offer.merchant?.name) ? offer.merchant.name : offer.bank,
      ...(hasAddress ? { address: { '@type': 'PostalAddress', streetAddress: address, addressCountry: 'LK' } } : {}),
    },
    areaServed: { '@type': 'Country', name: 'Sri Lanka' },
    isPartOf: { '@id': `${siteUrl}/#website` },
  };

  return (
    <>
      <AdSenseProvider />
      <JsonLd data={offerJsonLd} />
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />

      <main id="main-content" className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-3xl px-4 py-6 sm:py-8">
          <Breadcrumbs locale={locale} items={crumbs} />

          <Link
            href={localizedPath(locale, '/')}
            className="mb-5 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-teal-700"
          >
            <svg {...svgProps} className="h-4 w-4">
              <path d="m15 18-6-6 6-6" />
            </svg>
            {dict.offer.backToOffers}
          </Link>

          {expired && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="font-semibold text-amber-900">{dict.offer.expiredTitle}</p>
              <p className="mt-1 text-sm text-amber-800">{dict.offer.expiredBody}</p>
              <Link
                href={localizedPath(locale, '/')}
                className="mt-3 inline-flex items-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
              >
                {dict.notFound.cta}
              </Link>
            </div>
          )}

          <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
            <div className="p-6 sm:p-8">
              <header className="mb-6 flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">{merchant}</p>
                  {/* Bank feed copy is English regardless of the page locale. */}
                  <h1 lang="en" className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                    {offer.title}
                  </h1>
                  <p className="mt-2 text-sm text-gray-500">
                    {bankLabel} · {categoryLabel}
                  </p>
                </div>
                {discount && (
                  <div className="shrink-0 text-left sm:text-right">
                    <span className="text-3xl font-extrabold text-green-600 sm:text-4xl">{discount}</span>
                    {typeof maxDiscount === 'number' && maxDiscount > 0 && (
                      <p className="mt-1 text-xs text-gray-500">
                        {dict.offer.maxDiscount(`LKR ${formatNumber(locale, maxDiscount)}`)}
                      </p>
                    )}
                  </div>
                )}
              </header>

              <div className="space-y-5">
                <section className="flex items-start">
                  <BankIcon />
                  <div>
                    <h2 className="font-semibold text-gray-800">{dict.offer.bankAndCard}</h2>
                    <Link
                      href={localizedPath(locale, `/bank/${slugify(offer.bank)}`)}
                      className="text-gray-600 hover:text-teal-700 hover:underline"
                    >
                      {bankLabel}
                    </Link>
                    {offer.card_types?.length > 0 && (
                      <ul className="mt-1.5 flex flex-wrap gap-1.5">
                        {offer.card_types.map((cardType) => (
                          <li
                            key={cardType}
                            className="inline-block rounded-full border border-teal-200 bg-teal-50 px-2 py-1 text-xs font-medium text-teal-800"
                          >
                            {translateCardType(locale, cardType)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>

                <section className="flex items-start">
                  <CalendarIcon />
                  <div>
                    <h2 className="font-semibold text-gray-800">{dict.offer.validityPeriod}</h2>
                    {startDate && endDate ? (
                      <p className="text-gray-600">
                        <time dateTime={startIso?.slice(0, 10)}>{startDate}</time>
                        {' – '}
                        <time dateTime={endIso?.slice(0, 10)}>{endDate}</time>
                      </p>
                    ) : endDate ? (
                      <p className="text-gray-600">
                        {dict.browse.validUntil}: <time dateTime={endIso?.slice(0, 10)}>{endDate}</time>
                      </p>
                    ) : (
                      <p className="text-gray-500">{dict.offer.validityNotSpecified}</p>
                    )}
                    {offer.validity?.days && offer.validity.days.length > 0 && (
                      <p className="mt-1 text-sm text-gray-500">
                        {dict.offer.validDays}: <span lang="en">{offer.validity.days.join(', ')}</span>
                      </p>
                    )}
                  </div>
                </section>

                <section className="flex items-start">
                  <TagIcon />
                  <div>
                    <h2 className="font-semibold text-gray-800">{dict.offer.offerDescription}</h2>
                    <p lang="en" className="leading-relaxed text-gray-600">
                      {isMeaningful(offer.description) ? offer.description : dict.browse.noDescription}
                    </p>
                  </div>
                </section>

                {hasAddress && (
                  <section className="flex items-start">
                    <MapPinIcon />
                    <div>
                      <h2 className="font-semibold text-gray-800">{dict.offer.location}</h2>
                      {offer.location?.latitude && offer.location?.longitude ? (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${offer.location.latitude},${offer.location.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {address}
                        </a>
                      ) : (
                        <p className="text-gray-600">{address}</p>
                      )}
                    </div>
                  </section>
                )}

                <section className="flex items-start">
                  <TermsIcon />
                  <div>
                    <h2 className="font-semibold text-gray-800">{dict.offer.termsAndConditions}</h2>
                    <p lang="en" className="text-sm leading-relaxed text-gray-500">
                      {isMeaningful(offer.terms) ? offer.terms : dict.offer.noTerms}
                    </p>
                    {locale !== 'en' && <p className="mt-2 text-xs text-gray-400">{dict.offer.sourceNote}</p>}
                  </div>
                </section>
              </div>
            </div>

            {sourceUrl && (
              <div className="border-t bg-gradient-to-r from-gray-50 to-slate-50 p-6 sm:p-8">
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 px-6 py-3 text-center font-semibold text-white shadow-md transition-all hover:from-teal-600 hover:to-blue-700 hover:shadow-lg"
                >
                  {dict.offer.viewOriginal}
                  <ExternalLinkIcon />
                </a>
              </div>
            )}
          </article>

          {related.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-lg font-bold text-gray-800">{dict.offer.relatedOffers}</h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {related.map((item) => {
                  const itemDiscount = formatDiscount(locale, item);
                  return (
                    <li key={item.id}>
                      <Link
                        href={localizedPath(locale, `/offer/${item.id}`)}
                        className="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-teal-200 hover:shadow-md"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {merchantName(locale, item)}
                        </span>
                        <span lang="en" className="mt-1 line-clamp-2 font-semibold text-gray-900">
                          {item.title}
                        </span>
                        <span className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          <span className="rounded-full bg-slate-100 px-2 py-0.5">
                            {translateBank(locale, item.bank)}
                          </span>
                          {itemDiscount && <span className="font-semibold text-green-600">{itemDiscount}</span>}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
