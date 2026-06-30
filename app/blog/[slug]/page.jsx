import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPostSlugs, formatDate } from '@/lib/blog';
import { blogPosting, breadcrumb, ld } from '@/lib/schema';

// One static page per Markdown file. Required for `output: 'export'`.
export function generateStaticParams() {
  return getPostSlugs();
}

// Per-post SEO: title, meta description, canonical and Open Graph all come from
// the post's frontmatter, so the SEO author controls them from /admin.
export function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  const url = `/blog/${post.slug}/`;
  return {
    title: `${post.title} | Makuta Taranga`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url,
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default function BlogPost({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(blogPosting(post))} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ld(
          breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Journal', path: '/blog/' },
            { name: post.title, path: `/blog/${post.slug}/` },
          ])
        )}
      />

      <article>
        <section className="phead in">
          <div className="wrap">
            <div className="crumb">
              <Link href="/">Home</Link> &nbsp;/&nbsp; <Link href="/blog/">Journal</Link>
            </div>
            <h1 style={{ maxWidth: '20ch' }}>{post.title}</h1>
            <p className="blog-post-meta">
              {[post.author, formatDate(post.date)].filter(Boolean).join(' · ')}
            </p>
            <div className="hairline" style={{ marginTop: '1.4rem' }}></div>
          </div>
        </section>

        {post.cover ? (
          <div className="wrap">
            <div className="blog-hero-img" style={{ backgroundImage: `url(${post.cover})` }} role="img" aria-label={post.title}></div>
          </div>
        ) : null}

        <section className="wrap">
          <div className="blog-body" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

          {post.tags.length ? (
            <div className="blog-tags">
              {post.tags.map((t) => (
                <span key={t} className="blog-tag">{t}</span>
              ))}
            </div>
          ) : null}

          <div className="blog-back">
            <Link href="/blog/">← Back to the Journal</Link>
          </div>
        </section>
      </article>
    </>
  );
}
