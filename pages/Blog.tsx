import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchArticleList, fetchArticleContent, type ArticleFile } from '../lib/github-api';
import { parseFrontmatter } from '../lib/frontmatter';
import { trackEvent, updateSEO } from '../lib/analytics';

const PER_PAGE = 24;

function extractExcerpt(raw: string, maxLen = 120): string {
  const { content } = parseFrontmatter(raw);
  let text = content
    // Remove setext H1 (Title\n====)
    .replace(/^[^\n]+\n=+\s*\n?/m, '')
    // Remove ATX H1
    .replace(/^#\s+[^\n]+\n*/m, '')
    // Remove figure/image blocks
    .replace(/<figure[^>]*>.*?<\/figure>/gi, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove markdown formatting
    .replace(/[#*`>|~_]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();

  // Get first non-empty paragraph
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 20);
  const first = (paragraphs[0] || '').replace(/\s+/g, ' ').trim();
  if (first.length <= maxLen) return first;
  return first.slice(0, maxLen).replace(/\s\S*$/, '') + '...';
}

function ArticleCard({ article }: { article: ArticleFile }) {
  const [excerpt, setExcerpt] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticleContent(article.path)
      .then((raw) => setExcerpt(extractExcerpt(raw)))
      .catch(() => setExcerpt(''))
      .finally(() => setLoading(false));
  }, [article.path]);

  return (
    <Link
      to={`/blog/${encodeURIComponent(article.slug)}`}
      className="group block bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#b9f641]/50 transition-all duration-300"
      onClick={() => trackEvent('article_click', { article_title: article.title, article_slug: article.slug })}
    >
      <h2 className="text-lg font-bold text-white group-hover:text-[#b9f641] transition-colors leading-snug mb-2">
        {article.title}
      </h2>
      {loading ? (
        <div className="space-y-2">
          <div className="h-3 bg-[#1a1a1a] rounded w-full animate-pulse" />
          <div className="h-3 bg-[#1a1a1a] rounded w-3/4 animate-pulse" />
        </div>
      ) : (
        excerpt && <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{excerpt}</p>
      )}
    </Link>
  );
}

export default function Blog() {
  const [articles, setArticles] = useState<ArticleFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    updateSEO({
      title: 'Crypto Blog — Bitunix Referral Code 2026',
      description: 'Latest crypto insights, trading guides, and market analysis. Use referral code BITUNIXBONUS for up to 7,700 USDT bonus.',
      path: '/blog',
    });
    trackEvent('page_view', { page_title: 'Blog', page_path: '/blog' });
    fetchArticleList()
      .then(setArticles)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return articles;
    const q = search.toLowerCase();
    return articles.filter((a) => a.title.toLowerCase().includes(q));
  }, [articles, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Track page changes
  useEffect(() => {
    if (currentPage > 1) {
      trackEvent('blog_paginate', { page_number: currentPage });
    }
  }, [currentPage]);

  // Windowed page numbers
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            Crypto <span className="text-[#b9f641]">Articles</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Latest insights, guides, and analysis from the crypto world.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => {
                const val = e.target.value;
                setSearch(val);
                if (val.length >= 3) {
                  trackEvent('blog_search', { search_term: val });
                }
              }}
              className="w-full pl-12 pr-4 py-4 bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#b9f641]/50 transition-colors"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-[#b9f641] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-400">Loading articles...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-400 mb-2">Failed to load articles</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && !error && (
          <>
            <p className="text-gray-500 text-sm mb-6">
              {filtered.length} article{filtered.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginated.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500">No articles match your search.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-[#2a2a2a] text-gray-400 hover:text-white hover:border-[#b9f641]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {pageNumbers[0] > 1 && (
                  <>
                    <button
                      onClick={() => setPage(1)}
                      className="w-10 h-10 rounded-lg border border-[#2a2a2a] text-gray-400 hover:text-white hover:border-[#b9f641]/50 transition-colors text-sm font-bold"
                    >
                      1
                    </button>
                    {pageNumbers[0] > 2 && <span className="text-gray-600 px-1">...</span>}
                  </>
                )}

                {pageNumbers.map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-10 h-10 rounded-lg border text-sm font-bold transition-colors ${
                      n === currentPage
                        ? 'bg-[#b9f641] text-black border-[#b9f641]'
                        : 'border-[#2a2a2a] text-gray-400 hover:text-white hover:border-[#b9f641]/50'
                    }`}
                  >
                    {n}
                  </button>
                ))}

                {pageNumbers[pageNumbers.length - 1] < totalPages && (
                  <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                      <span className="text-gray-600 px-1">...</span>
                    )}
                    <button
                      onClick={() => setPage(totalPages)}
                      className="w-10 h-10 rounded-lg border border-[#2a2a2a] text-gray-400 hover:text-white hover:border-[#b9f641]/50 transition-colors text-sm font-bold"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-[#2a2a2a] text-gray-400 hover:text-white hover:border-[#b9f641]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
