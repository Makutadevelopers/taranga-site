// Generated sitemap. Next emits this to out/sitemap.xml at build. Static routes
// are listed by hand; blog posts are pulled from content/blog/ automatically, so
// a new post added via /admin appears in the sitemap on the next deploy — no edits.
import { getAllPosts } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const STATIC_ROUTES = [
  { path: '/', changeFrequency: 'monthly', priority: 1.0 },
  { path: '/residences/', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/amenities/', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/location/', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/gallery/', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/blog/', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/about/', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contact/', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/privacy/', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms/', changeFrequency: 'yearly', priority: 0.3 },
];

export default function sitemap() {
  const staticEntries = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const postEntries = getAllPosts().map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}/`,
    lastModified: p.date || undefined,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries];
}
