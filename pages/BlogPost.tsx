import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, ArrowRight, Calendar, Tag, User, Clock } from 'lucide-react';
import { fetchArticleList, fetchArticleContent, type ArticleFile } from '../lib/github-api';
import { parseFrontmatter } from '../lib/frontmatter';
import { trackEvent, updateSEO } from '../lib/analytics';
import { rewriteUtmParams } from '../lib/rewrite-utm';

const AUTHOR = 'BookXLabsJerry';
const REFERRAL_CODE = 'BITUNIXBONUS';
const REGISTER_URL = `https://www.bitunix.com/register?inviteCode=ab9nr3&vipCode=${REFERRAL_CODE}&utm_source=3rdparty&utm_medium=github-article`;

function estimateReadingTime(text: string): number {
  const words = text.replace(/<[^>]*>/g, '').replace(/[#*\[\]()!`>|_~-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

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
 * Preprocess markdown content from GitHub before rendering.
 * Handles two article formats:
 *   A) With YAML frontmatter + setext headings (Title\n==== / Title\n----)
 *   B) Without frontmatter + ATX headings (# Title / ## Title)
 */
function processMarkdownContent(md: string): string {
  let processed = rewriteUtmParams(md);

  // 1. Remove <figure> image blocks: <figure ...>![alt](url)</figure>
  processed = processed.replace(/<figure[^>]*>.*?<\/figure>/gi, '');

  // 2. Remove standalone markdown images ![alt](url)
  processed = processed.replace(/!\[[^\]]*\]\([^)]+\)/g, '');

  // 3. Convert <div> CTA wrappers to plain markdown links
  processed = processed.replace(/<div[^>]*>\s*\[([^\]]+)\]\(([^)]+)\)\s*<\/div>/gi, '\n\n[$1]($2)\n\n');

  // 4. Ensure closing HTML tags followed by text get a blank line between
  processed = processed.replace(/(<\/(?:div|figure|table|p)>)([A-Za-z#*\[`_])/gi, '$1\n\n$2');

  // 5. Remove setext H1: "Title\n====" (first occurrence — duplicate of page title)
  processed = processed.replace(/^[^\n]+\n=+[ \t]*\n?/m, '');

  // 6. Remove ATX H1: "# Title" (first occurrence — duplicate of page title)
  processed = processed.replace(/^#\s+[^\n]+\n*/m, '');

  // 7. Convert setext H2 headings to ATX ## with HR separator before
  //    "Title\n----" → "---\n\n## Title"
  processed = processed.replace(/^([^\n]+)\n-{2,}\s*$/gm, (_match, titleLine) => {
    const trimmed = titleLine.trim();
    // Skip lines that look like list items, table separators, HTML, or code
    if (!trimmed || /^[-=<>|#`*+]/.test(trimmed)) return _match;
    return `---\n\n## ${trimmed}`;
  });

  // 8. Strip link syntax from ATX headings: "## [Text](url) more" → "## Text more"
  processed = processed.replace(/^(#{1,6}\s+.*)$/gm, (line) => {
    return line.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  });

  // 9. Ensure blank line before ATX headings (fixes ### not rendering)
  processed = processed.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2');

  // 10. Ensure blank line before HR ---
  processed = processed.replace(/([^\n])\n(---\s*\n)/g, '$1\n\n$2');

  // 11. Convert markdown bold/italic inside HTML table cells to HTML tags
  //     rehypeRaw doesn't process markdown syntax within HTML blocks
  processed = processed.replace(/(<t[dh][^>]*>)([\s\S]*?)(<\/t[dh]>)/gi, (_, open, content, close) => {
    let c = content;
    c = c.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    c = c.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    return open + c + close;
  });

  // 12. Clean up excess blank lines
  processed = processed.replace(/\n{3,}/g, '\n\n');

  return processed.trim();
}

const markdownComponents = {
  // Remove all images
  img: () => null,
  // All links → normal hyperlinks (no CTA button styling)
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  ),
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
        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
          <span className="flex items-center gap-1.5 text-gray-400">
            <User className="w-4 h-4" /> {AUTHOR}
          </span>
          {date && (
            <span className="flex items-center gap-1.5 text-gray-400">
              <Calendar className="w-4 h-4" /> {date}
            </span>
          )}
          {content && (
            <span className="flex items-center gap-1.5 text-gray-400">
              <Clock className="w-4 h-4" /> {estimateReadingTime(content)} min read
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
