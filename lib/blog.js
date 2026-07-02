// Build-time blog data layer. Reads Markdown files from content/blog/, parses
// frontmatter (gray-matter) and renders the body to HTML (marked). Runs only at
// build / on the server — never shipped to the browser. The CMS at /admin writes
// the same Markdown files, so authors never touch this code.
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function readPostFile(filename) {
  const slug = filename.replace(/\.md$/, '');
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf8');
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date ? String(data.date).slice(0, 10) : '',
    author: data.author || 'Makuta',
    cover: data.cover || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    draft: data.draft === true,
    contentHtml: marked.parse(content || ''),
  };
}

// All published posts, newest first. Drafts and the README are excluded.
export function getAllPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
    .map(readPostFile)
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Just the slugs — used by generateStaticParams to emit one page per post.
export function getPostSlugs() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function getPostBySlug(slug) {
  return getAllPosts().find((p) => p.slug === slug) || null;
}

// Human-friendly date, e.g. "30 June 2026". Falls back to the raw string.
export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
