import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Blog post metadata, read from the MDX front matter.
 *
 * The post page, the blog index and the sitemap all need to enumerate posts, so
 * the directory read lives here rather than being repeated with three slightly
 * different notions of what counts as a post.
 */
export const postsDirectory = path.join(process.cwd(), 'src', 'app', 'posts');

export interface PostFrontMatter {
  title: string;
  date: string;
  summary: string;
}

export interface PostMeta extends PostFrontMatter {
  slug: string;
  /** File mtime, used as the sitemap lastmod when the front matter has no date. */
  modified: Date;
}

/** Slugs that cannot climb out of the posts directory. */
function isSafeSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/i.test(slug);
}

export function postSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => name.replace(/\.mdx$/, ''));
}

export async function getPost(slug: string): Promise<{ frontMatter: PostFrontMatter; content: string } | null> {
  if (!isSafeSlug(slug)) return null;
  try {
    const raw = await fs.promises.readFile(path.join(postsDirectory, `${slug}.mdx`), 'utf-8');
    const { data, content } = matter(raw);
    return { frontMatter: data as PostFrontMatter, content };
  } catch {
    return null;
  }
}

/** Every post, newest first. Posts with an unparseable date sort last. */
export function getAllPosts(): PostMeta[] {
  return postSlugs()
    .map((slug) => {
      const file = path.join(postsDirectory, `${slug}.mdx`);
      const { data } = matter(fs.readFileSync(file, 'utf-8'));
      const front = data as PostFrontMatter;
      return {
        slug,
        title: front.title ?? slug,
        date: front.date ?? '',
        summary: front.summary ?? '',
        modified: fs.statSync(file).mtime,
      };
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (Number.isNaN(dateA) && Number.isNaN(dateB)) return 0;
      if (Number.isNaN(dateA)) return 1;
      if (Number.isNaN(dateB)) return -1;
      return dateB - dateA;
    });
}
