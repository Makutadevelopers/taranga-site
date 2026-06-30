import Link from 'next/link';
import { getAllPosts, formatDate } from '@/lib/blog';
import { breadcrumb, ld } from '@/lib/schema';
import { SITE_URL } from '@/lib/site';

export const metadata = {
  title: 'Journal — News & Updates | Makuta Taranga',
  description:
    'The Makuta Taranga Journal — construction updates, lakefront living insights and Hyderabad neighbourhood guides from the team behind Makuta Taranga.',
  alternates: { canonical: '/blog/' },
  openGraph: {
    title: 'Journal — News & Updates | Makuta Taranga',
    description:
      'Construction updates, lakefront living insights and Hyderabad neighbourhood guides from Makuta Taranga.',
    url: '/blog/',
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ld(breadcrumb([{ name: 'Home', path: '/' }, { name: 'Journal', path: '/blog/' }]))}
      />

      <section className="phead in">
        <div className="wrap">
          <div className="crumb"><Link href="/">Home</Link> &nbsp;/&nbsp; Journal</div>
          <h1>The Taranga Journal</h1>
          <p>News, build updates and lakefront living, from the team behind Makuta Taranga.</p>
          <div className="hairline" style={{ marginTop: '1.6rem' }}></div>
        </div>
      </section>

      <section className="wrap" style={{ padding: '0 clamp(1.5rem,6vw,5rem) clamp(4rem,8vw,6rem)' }}>
        {posts.length === 0 ? (
          <p style={{ color: 'var(--ink-soft)' }}>No posts yet — check back soon.</p>
        ) : (
          <div className="blog-grid">
            {posts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}/`} className="blog-card">
                {p.cover ? (
                  <div className="blog-card-img" style={{ backgroundImage: `url(${p.cover})` }} aria-hidden="true"></div>
                ) : null}
                <div className="blog-card-body">
                  {p.tags[0] ? <span className="blog-tag">{p.tags[0]}</span> : null}
                  <h2 className="blog-card-title">{p.title}</h2>
                  <p className="blog-card-desc">{p.description}</p>
                  <span className="blog-card-meta">{formatDate(p.date)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
