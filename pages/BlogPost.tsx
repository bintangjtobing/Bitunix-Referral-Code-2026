import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, ArrowRight, Calendar, Tag } from 'lucide-react';
import { fetchArticleList, fetchArticleContent, type ArticleFile } from '../lib/github-api';
import { parseFrontmatter } from '../lib/frontmatter';
import { trackEvent, updateSEO } from '../lib/analytics';

const REFERRAL_CODE = 'BITUNIXBONUS';
const REGISTER_URL = `https://www.bitunix.com/register?inviteCode=ab9nr3&vipCode=${REFERRAL_CODE}&utm_source=3rdparty&utm_medium=github-article`;

const CTAWidget = ({ position = 'inline' }: { position?: string }) => (
  <div className="not-prose my-8 p-8 bg-[#0f0f0f] border border-[#2a2a2a] rounded-3xl text-center">
    <h3 className="text-2xl font-black text-white mb-3">Ready to Start Trading?</h3>
    <p className="text-gray-400 mb-6">
      Use referral code <span className="text-[#b9f641] font-bold">{REFERRAL_CODE}</span> for up to 7,700 USDT bonus.
    </p>
    <a
      href={REGISTER_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('blog_cta_click', { cta_position: position })}
      className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold bg-[#b9f641] text-black hover:bg-[#a6de3a] transition-all duration-300 transform hover:scale-105 active:scale-95 pulse-glow"
    >
      Claim Your Bonus <ArrowRight className="ml-2 w-5 h-5" />
    </a>
  </div>
);

/**
 * Preprocess markdown content from GitHub before rendering:
 * - Remove first H1 (duplicate with page title)
 * - Remove all image tags
 * - Strip link syntax from headings (keep text, remove hyperlink)
 */
function processMarkdownContent(md: string): string {
  let processed = md;

  // 1. Remove first ATX-style H1: "# Title here"
  processed = processed.replace(/^#\s+[^\n]+\n*/m, '');

  // 2. Remove all markdown image tags ![alt](url)
  processed = processed.replace(/!\[[^\]]*\]\([^)]+\)/g, '');

  // 3. Strip link syntax from ATX-style headings
  //    "## Text [Link](url) more" → "## Text Link more"
  processed = processed.replace(/^(#{1,6}\s+.*)$/gm, (line) => {
    return line.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  });

  // 4. Strip link syntax from setext-style headings (line before === or ---)
  const lines = processed.split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    if (/^[=-]+\s*$/.test(lines[i + 1]) && lines[i].trim().length > 0) {
      lines[i] = lines[i].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    }
  }
  processed = lines.join('\n');

  // Clean up excess blank lines
  processed = processed.replace(/\n{3,}/g, '\n\n');

  return processed.trim();
}

const markdownComponents = {
  // Remove all images
  img: () => null,
  // CTA links (register/signup) → styled button, other links stay normal
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isCTA = href && (href.includes('/register') || href.includes('vipCode='));
    if (isCTA) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('blog_cta_click', { cta_position: 'inline-article' })}
          className="not-prose inline-flex items-center justify-center px-6 py-3 my-4 rounded-full font-bold bg-[#b9f641] text-black hover:bg-[#a6de3a] transition-all duration-300 no-underline hover:no-underline transform hover:scale-105"
        >
          {children} <ArrowRight className="ml-2 w-4 h-4" />
        </a>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleFile | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError('');

    fetchArticleList()
      .then((articles) => {
        const found = articles.find((a) => a.slug === decodeURIComponent(slug));
        if (!found) {
          setError('Article not found');
          setLoading(false);
          return;
        }
        setArticle(found);
        return fetchArticleContent(found.path);
      })
      .then((raw) => {
        if (!raw) return;
        const { frontmatter, content: md } = parseFrontmatter(raw);
        setTitle((frontmatter.title as string) || article?.title || '');
        setDate((frontmatter.date as string) || '');
        setCategories((frontmatter.categories as string[]) || []);
        setContent(md);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (title) {
      const desc = `Read "${title}" — crypto insights and trading guides. Use referral code BITUNIXBONUS for up to 7,700 USDT bonus on Bitunix.`;
      updateSEO({
        title: `${title} — Bitunix Blog`,
        description: desc.slice(0, 160),
        path: `/blog/${slug}`,
      });
      trackEvent('article_view', {
        article_title: title,
        article_slug: slug || '',
        article_categories: categories.join(', '),
      });
    }
  }, [title, slug, categories]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#b9f641] border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <Link to="/blog" className="text-[#b9f641] hover:underline inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16 px-4">
      <article className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#b9f641] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">{title || article?.title}</h1>

        {/* Meta */}
        {(date || categories.length > 0) && (
          <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
            {date && (
              <span className="flex items-center gap-1.5 text-gray-400">
                <Calendar className="w-4 h-4" /> {date}
              </span>
            )}
            {categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#b9f641]/10 text-[#b9f641] text-xs font-bold"
              >
                <Tag className="w-3 h-3" /> {cat}
              </span>
            ))}
          </div>
        )}

        {/* Markdown content */}
        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-[#b9f641] prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-[#b9f641] prose-pre:bg-[#0f0f0f] prose-pre:border prose-pre:border-[#2a2a2a] prose-img:rounded-2xl prose-hr:border-[#2a2a2a] prose-th:text-white prose-td:text-gray-300 prose-table:border-collapse">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>
            {processMarkdownContent(content)}
          </ReactMarkdown>
        </div>

        {/* CTA */}
        <div className="mt-16">
          <CTAWidget position="bottom" />
        </div>
      </article>
    </div>
  );
}
