import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdSenseProvider from '@/app/components/AdsenseProvider';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import { isLocale, localeHtmlLang, localizedPath, locales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, ogImageUrl, ogTextLocale } from '@/lib/seo';
import { formatDate } from '@/lib/offers';
import { getAllPosts } from '@/lib/posts';

/**
 * The blog index. Until now the one post existed only in the sitemap: nothing
 * on the site linked to it and /blog itself 404ed, which is how a page ends up
 * in Search Console's "Crawled – currently not indexed" bucket.
 */

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
    path: '/blog',
    title: dict.pages.blogTitle,
    description: dict.pages.blogDescription,
    image: ogImageUrl({
      title: imageDict.pages.blogTitle,
      subtitle: imageDict.siteName,
      badge: 'Blog',
      locale: ogTextLocale(lang),
    }),
    imageAlt: dict.pages.blogTitle,
    // The posts themselves are English-only, so the localized indexes would
    // list English titles under a Sinhala or Tamil heading. Same call as the
    // post pages: reachable, not indexed.
    noIndex: lang !== 'en',
  });
}

export default async function BlogIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const posts = getAllPosts();

  const crumbs = [
    { name: dict.breadcrumb.home, path: '/' },
    { name: dict.breadcrumb.blog, path: '/blog' },
  ];

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dict.pages.blogTitle,
    url: absoluteUrl(localizedPath(locale, '/blog')),
    inLanguage: localeHtmlLang[locale],
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: post.title,
      url: absoluteUrl(localizedPath(locale, `/blog/post/${post.slug}`)),
    })),
  };

  return (
    <>
      <AdSenseProvider />
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
      <main id="main-content" className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-3xl px-4 py-6 sm:py-10">
          <Breadcrumbs locale={locale} items={crumbs} />
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{dict.pages.blogTitle}</h1>
          <p className="mt-2 leading-relaxed text-gray-600">{dict.pages.blogDescription}</p>

          <ul className="mt-8 space-y-4">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={localizedPath(locale, `/blog/post/${post.slug}`)}
                  className="block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg"
                >
                  {/* Posts are authored in English whatever the page locale. */}
                  <h2 lang="en" className="text-lg font-bold text-gray-900">
                    {post.title}
                  </h2>
                  {post.date && (
                    <p className="mt-1 text-sm text-gray-500">
                      <time dateTime={post.date.slice(0, 10)}>{formatDate(locale, post.date)}</time>
                    </p>
                  )}
                  {post.summary && (
                    <p lang="en" className="mt-2 text-[15px] leading-relaxed text-gray-600">
                      {post.summary}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
