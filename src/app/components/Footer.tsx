import Link from 'next/link';
import { localizedPath, type Locale } from '@/i18n/config';
import { getDictionary, translateBank, translateCardType, translateCategory } from '@/i18n/dictionaries';
import { allBanks, allCategories, getActiveOffers, getOffersByBank, isMeaningful, slugify } from '@/lib/offers';
import { cardTypeHubs } from '@/lib/hub-routes';

const ChevronIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="ml-1 inline-block h-3 w-3 opacity-60"
    aria-hidden="true"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

/**
 * Server-rendered so the internal links to every bank and category page are in
 * the initial HTML — this is the site's main crawl path into those pages.
 */
export default function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const activeOffers = getActiveOffers();
  const merchantCount = new Set(
    activeOffers.map((offer) => offer.merchant?.name).filter((name): name is string => isMeaningful(name)),
  ).size;

  const banksWithCounts = allBanks
    .map((bank) => ({ bank, count: getOffersByBank(bank, activeOffers).length }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count);

  const categoriesWithCounts = allCategories
    .map((category) => ({
      category,
      count: activeOffers.filter((offer) => offer.category === category).length,
    }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold text-gray-800 sm:text-3xl">{dict.footer.heading}</h2>
          <p className="mx-auto max-w-2xl leading-relaxed text-gray-600">{dict.footer.body}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 text-sm md:grid-cols-4">
          <div>
            <h3 className="mb-3 font-semibold text-gray-800">{dict.footer.quickLinks}</h3>
            <ul className="space-y-2 text-gray-600">
              {/* Points at "/" directly: /offers is a 308 to the homepage, and
                  linking a redirect from every page wastes the crawl. */}
              <li>
                <Link href={localizedPath(locale, '/')} className="hover:text-teal-600 hover:underline">
                  {dict.footer.allOffers}
                </Link>
              </li>
              {cardTypeHubs.map((hub) => (
                <li key={hub.slug}>
                  <Link href={localizedPath(locale, `/${hub.slug}`)} className="hover:text-teal-600 hover:underline">
                    {dict.pages.cardTypePageTitle(translateCardType(locale, hub.cardType))}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={localizedPath(locale, '/banks')} className="hover:text-teal-600 hover:underline">
                  {dict.pages.banksTitle}
                </Link>
              </li>
              <li>
                <Link href={localizedPath(locale, '/categories')} className="hover:text-teal-600 hover:underline">
                  {dict.pages.categoriesTitle}
                </Link>
              </li>
              <li>
                <Link href={localizedPath(locale, '/locations')} className="hover:text-teal-600 hover:underline">
                  {dict.pages.locationsTitle}
                </Link>
              </li>
              <li>
                <Link href={localizedPath(locale, '/blog')} className="hover:text-teal-600 hover:underline">
                  {dict.pages.blogTitle}
                </Link>
              </li>
              {/* /search is disallowed in robots.txt, so it is deliberately not
                  linked here — the nav search box is how people reach it. */}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-gray-800">{dict.footer.topBankPromotions}</h3>
            <ul className="space-y-2 text-gray-600">
              {banksWithCounts.slice(0, 6).map(({ bank, count }) => (
                <li key={bank}>
                  <Link
                    href={localizedPath(locale, `/bank/${slugify(bank)}`)}
                    className="inline-flex items-center hover:text-teal-600 hover:underline"
                  >
                    {translateBank(locale, bank)}
                    <span className="ml-1.5 text-xs text-gray-400">({count})</span>
                    <ChevronIcon />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-gray-800">{dict.stats.categories}</h3>
            <ul className="space-y-2 text-gray-600">
              {categoriesWithCounts.slice(0, 6).map(({ category, count }) => (
                <li key={category}>
                  <Link
                    href={localizedPath(locale, `/categories/${slugify(category)}`)}
                    className="inline-flex items-center hover:text-teal-600 hover:underline"
                  >
                    {translateCategory(locale, category)}
                    <span className="ml-1.5 text-xs text-gray-400">({count})</span>
                    <ChevronIcon />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-gray-800">{dict.footer.ourPlatform}</h3>
            <ul className="flex flex-col gap-2 text-gray-600">
              <li>{dict.footer.banksCovered(banksWithCounts.length)}</li>
              <li>{dict.footer.offersLive(activeOffers.length)}</li>
              <li>{dict.footer.merchants(merchantCount)}</li>
            </ul>
            <p className="mt-4 text-sm text-gray-500">{dict.footer.happySaving}</p>
          </div>
        </div>

        <p className="mt-10 rounded-xl bg-slate-50 p-4 text-center text-xs leading-relaxed text-gray-500">
          {dict.footer.disclaimer}
        </p>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} cardpromotions.org. {dict.footer.rights}
          </p>
          <p className="mt-1">
            <Link href={localizedPath(locale, '/privacy-policy')} className="hover:underline">
              {dict.footer.privacyPolicy}
            </Link>
            {' · '}
            <Link href={localizedPath(locale, '/terms-of-service')} className="hover:underline">
              {dict.footer.termsOfService}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
