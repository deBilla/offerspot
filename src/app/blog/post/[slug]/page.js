import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import AdSenseProvider from '@/app/components/AdsenseProvider';

const postsDirectory = path.join(process.cwd(), 'src', 'app', 'posts');

// --- THIS FUNCTION IS NOW ASYNC ---
async function getPost(slug) {
  // We now use the asynchronous version of readFile
  const markdownWithMeta = await fs.promises.readFile(
    path.join(postsDirectory, `${slug}.mdx`),
    'utf-8'
  );

  const { data: frontMatter, content } = matter(markdownWithMeta);
  return { frontMatter, content };
}

// Generates page title and metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  // We now `await` the result of our async function
  const { frontMatter } = await getPost(slug);
  return {
    title: `${frontMatter.title} | CardPromotions.org Blog`,
    description: frontMatter.summary,
  };
}

// Options for the code syntax highlighter
const rehypePrettyCodeOptions = {
  theme: 'one-dark-pro',
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
};

// The main page component is now explicitly async
export default async function PostPage({ params }) {
  const { slug } = await params
  // We `await` the result here as well
  const { frontMatter, content } = await getPost(slug);
  
  return (
    <>
    <AdSenseProvider />
    <div className="bg-white py-12">
      <article className="prose prose-lg lg:prose-xl prose-indigo mx-auto px-4">
        <header className="mb-8">
          <h1>{frontMatter.title}</h1>
          <p className="text-gray-500 mt-2">
            {new Date(frontMatter.date).toLocaleDateString('en-US', { 
              year: 'numeric', month: 'long', day: 'numeric' 
            })}
          </p>
        </header>
        
        <MDXRemote 
          source={content}
          options={{
            mdxOptions: {
              rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
            },
          }}
        />
      </article>
    </div></>
  );
}

// Generates all the blog post pages at build time
export async function generateStaticParams() {
  const filenames = fs.readdirSync(postsDirectory);
  
  return filenames.map((filename) => ({
    slug: filename.replace(/\.mdx$/, ''),
  }));
}