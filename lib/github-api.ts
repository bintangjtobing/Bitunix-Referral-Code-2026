export interface ArticleFile {
  path: string;
  slug: string;
  title: string;
  date?: string;
  excerpt?: string;
}

interface TreeResponse {
  tree: { path: string; type: string }[];
}

const REPO = 'OrderBookX/articles';
const BRANCH = 'main';
const CACHE_KEY = 'blog_article_list';
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

const contentCache = new Map<string, string>();

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/i, '');
}

function titleFromFilename(filename: string): string {
  return filename
    .replace(/\.md$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/^(\w+)\s+\1\b/i, '$1');
}

export async function fetchArticleList(): Promise<ArticleFile[]> {
  // Check sessionStorage cache
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    } catch {
      // Invalid cache, continue
    }
  }

  const res = await fetch(
    `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const json: TreeResponse = await res.json();

  const articles: ArticleFile[] = json.tree
    .filter((item) => item.type === 'blob' && item.path.endsWith('.md'))
    .map((item) => ({
      path: item.path,
      slug: slugFromFilename(item.path.split('/').pop()!),
      title: titleFromFilename(item.path.split('/').pop()!),
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  // Cache in sessionStorage
  sessionStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ data: articles, timestamp: Date.now() })
  );

  return articles;
}

export async function fetchArticleContent(path: string): Promise<string> {
  if (contentCache.has(path)) {
    return contentCache.get(path)!;
  }

  const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${encodeURIComponent(path)}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch article: ${res.status}`);
  }

  const content = await res.text();
  contentCache.set(path, content);
  return content;
}
