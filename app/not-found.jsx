import Link from 'next/link';

export const metadata = {
  title: 'Page not found | Makuta Taranga',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="phead in" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="wrap" style={{ textAlign: 'center', width: '100%' }}>
        <div className="crumb" style={{ marginBottom: '1rem' }}>Error 404</div>
        <h1 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(2.6rem,7vw,4.6rem)', lineHeight: 1, color: 'var(--ink)' }}>
          This page can’t be found
        </h1>
        <p style={{ color: 'var(--ink-soft)', maxWidth: '46ch', margin: '1.2rem auto 2rem' }}>
          The page you’re looking for may have moved. Let’s get you back to the lake.
        </p>
        <div className="row" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link className="btn solid" href="/">Back to Home</Link>
          <Link className="btn" href="/contact/">Contact Us</Link>
        </div>
      </div>
    </section>
  );
}
