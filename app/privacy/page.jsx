import Link from 'next/link';
import { breadcrumb, ld } from '@/lib/schema';

export const metadata = {
  title: 'Privacy Policy | Makuta Taranga',
  description:
    'How Makuta Taranga (Makuta Developers) collects, uses and protects the details you share through enquiry forms, calls and WhatsApp.',
  alternates: { canonical: '/privacy/' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Privacy Policy | Makuta Taranga',
    description: 'How Makuta Taranga collects, uses and protects the details you share.',
    url: '/privacy/',
  },
};

const UPDATED = 'June 2026';

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ld(breadcrumb([{ name: 'Home', path: '/' }, { name: 'Privacy Policy', path: '/privacy/' }]))}
      />

      <section className="phead">
        <div className="wrap">
          <div className="grid">
            <div>
              <div className="crumb"><Link href="/">Home</Link> / Privacy Policy</div>
              <h1>Privacy<br />Policy</h1>
              <p>Your details are used only to respond to your enquiry about Makuta Taranga. We don&rsquo;t sell or rent your data. Last updated {UPDATED}.</p>
              <div className="hairline" style={{ marginTop: '1.6rem' }}></div>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap legal" style={{ padding: 'clamp(1rem,4vw,2rem) 0 clamp(4rem,8vw,6rem)', maxWidth: '760px' }}>
        <h2>Who we are</h2>
        <p>
          This website is operated by Makuta Developers (&ldquo;Makuta&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) to market the residential
          project <strong>Makuta Taranga</strong>, TS RERA P02200011012, at IDL Road, Opp. IDL Lake, Habeeb Nagar, Moosapet,
          Hyderabad &mdash; 500072. For any privacy question, contact us at{' '}
          <a className="more" href="mailto:sales@makutataranga.com">sales@makutataranga.com</a> or{' '}
          <a className="more" href="tel:+919059676464">+91&nbsp;90596&nbsp;76464</a>.
        </p>

        <h2>What we collect</h2>
        <p>
          When you submit an enquiry form, request a brochure or price sheet, or book a visit, we collect the details you provide
          &mdash; typically your <strong>name, phone number, email address</strong> and the configuration you&rsquo;re interested in.
          We also collect standard analytics data (pages viewed, approximate location, device and referrer) through cookies and
          similar technologies.
        </p>

        <h2>How we use it</h2>
        <p>
          We use your contact details only to respond to your enquiry &mdash; to call, message or email you about Makuta Taranga,
          share requested material, and arrange a site visit. We use analytics data to understand how the site is used and to
          improve it, and to measure the performance of our advertising.
        </p>

        <h2>Consent &amp; communication</h2>
        <p>
          By submitting a form and ticking the consent box, you agree to be contacted by Makuta Taranga on WhatsApp, phone or
          email regarding your enquiry. You can ask us to stop contacting you at any time by replying &ldquo;STOP&rdquo; or emailing
          us at the address above.
        </p>

        <h2>Who we share it with</h2>
        <p>
          We share your enquiry details with trusted service providers who help us operate, strictly to serve your request:
        </p>
        <ul>
          <li><strong>Clove CRM</strong> &mdash; to record and follow up on your enquiry with our sales team.</li>
          <li><strong>Google Analytics</strong> &mdash; for anonymised, aggregated website analytics (IP anonymisation enabled).</li>
          <li><strong>Meta (Facebook) Pixel</strong> &mdash; to measure and optimise our advertising.</li>
        </ul>
        <p>We do not sell, rent or trade your personal information to any third party for their own marketing.</p>

        <h2>Cookies</h2>
        <p>
          Cookies and similar technologies keep the site working and power analytics and advertising measurement. You can control
          or delete cookies through your browser settings; some site features may not work as intended if you disable them.
        </p>

        <h2>Data retention</h2>
        <p>
          We keep your enquiry details for as long as needed to assist you and to meet our legal and contractual obligations,
          after which they are deleted or anonymised.
        </p>

        <h2>Your choices</h2>
        <p>
          You may request access to, correction of, or deletion of the personal details you have shared with us, and you may
          withdraw consent to further contact. Email{' '}
          <a className="more" href="mailto:sales@makutataranga.com">sales@makutataranga.com</a> and we&rsquo;ll action your request.
        </p>

        <h2>Changes</h2>
        <p>
          We may update this policy from time to time. The current version, with its &ldquo;last updated&rdquo; date, always lives on
          this page.
        </p>

        <p style={{ marginTop: '2rem' }}>
          See also our <Link className="more" href="/terms/">Terms of Use</Link>.
        </p>
      </section>
    </>
  );
}
