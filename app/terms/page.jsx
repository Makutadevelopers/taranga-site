import Link from 'next/link';
import { breadcrumb, ld } from '@/lib/schema';

export const metadata = {
  title: 'Terms of Use | Makuta Taranga',
  description:
    'Terms governing the use of the Makuta Taranga website — disclaimers on renders and areas, RERA, intellectual property and limitation of liability.',
  alternates: { canonical: '/terms/' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Terms of Use | Makuta Taranga',
    description: 'Terms governing the use of the Makuta Taranga website.',
    url: '/terms/',
  },
};

const UPDATED = 'June 2026';

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ld(breadcrumb([{ name: 'Home', path: '/' }, { name: 'Terms of Use', path: '/terms/' }]))}
      />

      <section className="phead">
        <div className="wrap">
          <div className="grid">
            <div>
              <div className="crumb"><Link href="/">Home</Link> / Terms of Use</div>
              <h1>Terms<br />of Use</h1>
              <p>This website is for information only. Nothing on it is a legal offer; all transactions are governed by the registered Agreement of Sale. Last updated {UPDATED}.</p>
              <div className="hairline" style={{ marginTop: '1.6rem' }}></div>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap legal" style={{ padding: 'clamp(1rem,4vw,2rem) 0 clamp(4rem,8vw,6rem)', maxWidth: '760px' }}>
        <h2>Acceptance</h2>
        <p>
          By accessing this website you agree to these Terms of Use. The site is operated by Makuta to market the
          project <strong>Makuta Taranga</strong> (TS RERA P02200011012). If you do not agree, please do not use the site.
        </p>

        <h2>No offer; indicative information</h2>
        <p>
          The content here &mdash; renders, elevations, master plans, dimensions, areas, specifications, amenities and pricing
          guidance &mdash; is <strong>artist&rsquo;s impression and indicative only</strong>, for representation, and may vary from the
          sanctioned and RERA-approved plans and the actual constructed product. Nothing on this website constitutes a legal
          offer, invitation or commitment. All transactions are governed solely by the registered Agreement of Sale and the
          RERA-approved plans.
        </p>

        <h2>RERA</h2>
        <p>
          Makuta Taranga is registered under TS RERA No. P02200011012. Project details are available on the Telangana RERA portal
          at rera.telangana.gov.in.
        </p>

        <h2>Intellectual property</h2>
        <p>
          All text, images, renders, logos and design on this site are the property of Makuta or its licensors and are
          protected by law. You may not reproduce, distribute or use them without our prior written permission.
        </p>

        <h2>External links</h2>
        <p>
          The site may link to third-party websites (maps, RERA portal, social platforms). We are not responsible for the content
          or privacy practices of those sites.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          The website is provided &ldquo;as is&rdquo; without warranties of any kind. To the extent permitted by law, Makuta
          is not liable for any loss arising from reliance on the indicative information presented here. Always verify particulars
          with our sales team and in your Agreement of Sale before making a decision.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of India, and the courts at Hyderabad, Telangana shall have exclusive
          jurisdiction.
        </p>

        <h2>Contact</h2>
        <p>
          Makuta &mdash; IDL Road, Opp. IDL Lake, Hyderabad &mdash; 500072.{' '}
          <a className="more" href="mailto:sales@makutataranga.com">sales@makutataranga.com</a> &middot;{' '}
          <a className="more" href="tel:+919059676464">+91&nbsp;90596&nbsp;76464</a>.
        </p>

        <p style={{ marginTop: '2rem' }}>
          See also our <Link className="more" href="/privacy/">Privacy Policy</Link>.
        </p>
      </section>
    </>
  );
}
