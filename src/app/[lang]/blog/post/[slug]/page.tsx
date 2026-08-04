import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import AdSenseProvider from '@/app/components/AdsenseProvider';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import JsonLd from '@/app/components/JsonLd';
import { isLocale, localeHtmlLang, localizedPath, locales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, ogImageUrl, ogTextLocale, siteUrl } from '@/lib/seo';
import { clamp, formatDate } from '@/lib/offers';

const postsDirectory = path.join(process.cwd(), 'src', 'app', 'posts');

interface PostFrontMatter {
  title: string;
  date: string;
  summary: string;
}

async function getPost(slug: string) {
  // Reject anything that could climb out of the posts directory.
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  try {
    const raw = await fs.promises.readFile(path.join(postsDirectory, `${slug}.mdx`), 'utf-8');
    const { data, content } = matter(raw);
    return { frontMatter: data as PostFrontMatter, content };
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  const filenames = fs.existsSync(postsDirectory) ? fs.readdirSync(postsDirectory) : [];
  const slugs = filenames.filter((name) => name.endsWith('.mdx')).map((name) => name.replace(/\.mdx$/, ''));
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const post = await getPost(slug);
  if (!post) return { title: getDictionary(lang).notFound.title, robots: { index: false, follow: false } };

  const { title, summary, date } = post.frontMatter;
  const published = new Date(date);

  return buildMetadata({
    locale: lang,
    path: `/blog/post/${slug}`,
    title: clamp(title, 65),
    description: clamp(summary, 300),
    image: ogImageUrl({
      title,
      subtitle: getDictionary(ogTextLocale(lang)).siteName,
      badge: 'Blog',
      locale: ogTextLocale(lang),
    }),
    imageAlt: title,
    type: 'article',
    publishedTime: Number.isNaN(published.getTime()) ? undefined : published.toISOString(),
    // The post body is English in every locale, so only the English URL is
    // offered to the index; /si and /ta stay reachable for navigation.
    noIndex: lang !== 'en',
  });
}

const rehypePrettyCodeOptions = {
  theme: 'one-dark-pro',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onVisitLine(node: any) {
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
};

export default async function PostPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  const post = await getPost(slug);
  if (!post) notFound();

  const dict = getDictionary(locale);
  const { frontMatter, content } = post;
  const published = new Date(frontMatter.date);
  const publishedIso = Number.isNaN(published.getTime()) ? undefined : published.toISOString();

  const crumbs = [
    { name: dict.breadcrumb.home, path: '/' },
    { name: 'Blog', path: `/blog/post/${slug}` },
  ];

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: frontMatter.title,
    description: frontMatter.summary,
    datePublished: publishedIso,
    dateModified: publishedIso,
    inLanguage: localeHtmlLang[locale],
    mainEntityOfPage: absoluteUrl(localizedPath(locale, `/blog/post/${slug}`)),
    image: ogImageUrl({
      title: frontMatter.title,
      subtitle: getDictionary(ogTextLocale(locale)).siteName,
      badge: 'Blog',
      locale: ogTextLocale(locale),
    }),
    author: { '@type': 'Organization', name: dict.siteName, url: siteUrl },
    publisher: { '@id': `${siteUrl}/#organization` },
  };

  return (
    <>
      <AdSenseProvider />
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd(locale, crumbs)} />
      <main id="main-content" className="bg-white py-10">
        <div className="container mx-auto max-w-3xl px-4">
          <Breadcrumbs locale={locale} items={crumbs} />
        </div>
        {/* The posts are authored in English; mark the article so the locale
            wrapper does not misrepresent its language. */}
        <article lang="en" className="prose prose-lg lg:prose-xl prose-indigo mx-auto px-4">
          <header className="mb-8">
            <h1>{frontMatter.title}</h1>
            {publishedIso && (
              <p className="mt-2 text-gray-500">
                <time dateTime={publishedIso.slice(0, 10)}>{formatDate(locale, frontMatter.date)}</time>
              </p>
            )}
          </header>

          <MDXRemote
            source={content}
            options={{ mdxOptions: { rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]] } }}
          />
        </article>
      </main>
    </>
  );
}
