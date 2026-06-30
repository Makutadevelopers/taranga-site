import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="ft">
          <div>
            <img className="ft-logo" src="/assets/img/taranga_navy.png" alt="Makuta Taranga" width="160" height="48" loading="lazy" decoding="async" />
            <p style={{ marginTop: '.9rem', maxWidth: '34ch' }}>
              A lakefront landmark by Makuta Developers — Crown of Excellence. Built around privacy, light and the calm of water.
            </p>
            <span className="rera">TS RERA P02200011012</span>
            <div className="by-makuta">
              <span>A project by</span>
              <img src="/assets/img/makuta.png" alt="Makuta Developers — Crown of Excellence" height="36" loading="lazy" decoding="async" />
            </div>
          </div>
          <div>
            <h4>Explore</h4>
            <Link href="/residences/">Residences</Link>
            <Link href="/amenities/">Amenities</Link>
            <Link href="/location/">Location</Link>
            <Link href="/gallery/">Gallery</Link>
            <Link href="/contact/#faq">FAQ</Link>
            <Link href="/privacy/">Privacy Policy</Link>
            <Link href="/terms/">Terms of Use</Link>
          </div>
          <div>
            <h4>Visit</h4>
            <p>IDL Road, Opp. IDL Lake,<br />Moosapet, Hyderabad — 500072</p>
            <a href="tel:+919059676464">+91 90596 76464</a>
            <a href="mailto:sales@makutataranga.com">sales@makutataranga.com</a>
          </div>
        </div>
        <p className="disc">
          TS RERA Registration No. P02200011012 — project details available at rera.telangana.gov.in. Artist’s impressions and renders are for representation only and may vary from actuals. All plans, areas, specifications and amenities are indicative and subject to the sanctioned and RERA-approved plans. This does not constitute a legal offer or invitation; all transactions are governed solely by the registered Agreement of Sale. © Makuta Developers.
        </p>
      </div>
    </footer>
  );
}
