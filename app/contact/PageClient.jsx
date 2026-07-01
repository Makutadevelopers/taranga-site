'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { leadPayload, sendLead, trackLead } from '@/lib/lead';
import pageCss from './page-styles';

export default function PageClient() {
  /* enquiry form (controlled) */
  const [q, setQ] = useState({ n: '', p: '', c: '' });
  const [qDone, setQDone] = useState('');
  const [qNote, setQNote] = useState({
    text: 'We respect your privacy. No spam — just a call back to plan your visit.',
    color: '',
  });

  function quickSubmit() {
    const n = q.n.trim();
    const p = q.p.replace(/\D/g, '');
    if (!n || p.length < 10) {
      setQNote({ text: 'Please enter your name and a valid phone number.', color: '#b5562f' });
      return;
    }
    sendLead(leadPayload('Quick enquiry', n, p, '', { config: q.c }), function () {
      trackLead('contact');
    });
    setQDone(n.split(' ')[0]);
  }

  /* FAQ accordion */
  useEffect(() => {
    const handlers = [];
    document.querySelectorAll('.q button').forEach(function (b) {
      const fn = function () {
        const qEl = b.parentElement;
        const a = qEl.querySelector('.a');
        const o = qEl.classList.toggle('open');
        a.style.maxHeight = o ? a.scrollHeight + 'px' : 0;
      };
      b.addEventListener('click', fn);
      handlers.push([b, fn]);
    });
    return () => handlers.forEach(([b, fn]) => b.removeEventListener('click', fn));
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />

      <section className="phead">
        <div className="wrap">
          <div className="grid">
            <div>
              <div className="crumb"><Link href="/">Home</Link> / Contact</div>
              <h1>Let&rsquo;s plan<br />your visit</h1>
              <p>Tell us a little about what you&rsquo;re looking for. We&rsquo;ll call you back to arrange a private, no-obligation visit by the lake.</p>
              <p className="whisper" style={{ textAlign: 'left', margin: '1.6rem 0 0', maxWidth: '34ch' }}>Come stand where the noise stops. The rest can wait.</p>
              <div className="hairline" style={{ marginTop: '1.6rem' }}></div>
            </div>
            <div className="ph-img"><div className="ph" style={{ backgroundImage: 'url(/assets/img/int_lobby.webp)' }}></div></div>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ padding: 'clamp(2rem,5vw,3rem) 0 clamp(3rem,6vw,5rem)' }}>
        <div className="reveal cgrid">
          <div>
            <div className="label">Enquire</div>
            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(2rem,4vw,2.8rem)', margin: '.3rem 0 1.4rem' }}>Send us your details</h2>
            {!qDone ? (
              <div className="qform" id="qform" style={{ flexDirection: 'column', maxWidth: '400px', margin: 0 }}>
                <input id="qn" placeholder="Your name" style={{ width: '100%' }} value={q.n} onChange={(e) => setQ((v) => ({ ...v, n: e.target.value }))} />
                <input id="qp" placeholder="Phone" style={{ width: '100%' }} value={q.p} onChange={(e) => setQ((v) => ({ ...v, p: e.target.value }))} />
                <select id="qc" style={{ width: '100%' }} value={q.c} onChange={(e) => setQ((v) => ({ ...v, c: e.target.value }))}>
                  <option value="">Interested in…</option>
                  <option>3 BHK</option>
                  <option>4 BHK</option>
                </select>
                <a href="#" className="btn solid" style={{ textAlign: 'center' }} onClick={(e) => { e.preventDefault(); quickSubmit(); }}>Book a site visit</a>
              </div>
            ) : (
              <div className="qform" id="qform" style={{ flexDirection: 'column', maxWidth: '400px', margin: 0 }}>
                <div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', color: 'var(--line)', fontSize: '1.4rem' }}>Thank you, {qDone}. We&rsquo;ll call you shortly to plan your visit.</div>
              </div>
            )}
            {!qDone && <div className="formnote" id="qnote" style={{ color: qNote.color || undefined }}>{qNote.text}</div>}
          </div>
          <div>
            <div className="label">Site office</div>
            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(2rem,4vw,2.8rem)', margin: '.3rem 0 1rem' }}>Come see us</h2>
            <p style={{ color: 'var(--ink-soft)' }}>IDL Road, Opp. IDL Lake, Habeeb Nagar, Moosapet, Hyderabad — 500072</p>
            <p style={{ marginTop: '1.2rem' }}><a className="more" href="tel:+919059676464">Call +91 90596 76464</a></p>
            <p style={{ marginTop: '1rem' }}><a className="more" href="https://wa.me/919059676464" target="_blank" rel="noopener noreferrer">WhatsApp us</a></p>
          </div>
        </div>
      </section>

      <section className="wrap" id="faq" style={{ padding: 'clamp(2rem,5vw,3rem) 0 clamp(5rem,9vw,7rem)' }}>
        <div className="reveal">
          <div className="label">FAQ</div>
          <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(2rem,4.4vw,3.2rem)', margin: '.3rem 0 1.6rem' }}>Everything you&rsquo;re wondering</h2>
          <div className="faq">
            <div className="q"><button>Where exactly is Makuta Taranga?</button><div className="a"><p>IDL Road, opposite IDL Lake, Habeeb Nagar, Moosapet, Hyderabad — 500072, between Kukatpally and Balanagar. Kukatpally metro is about 800 m away. See the <Link href="/location/">Location</Link> page for the map.</p></div></div>
            <div className="q"><button>What configurations and sizes are available?</button><div className="a"><p>Spacious 3 and 4 BHK lakefront homes, many corner-facing, all with 10.35-ft ceilings and privacy foyers. Exact carpet areas and pricing are shared on enquiry.</p></div></div>
            <div className="q"><button>Is the project RERA registered?</button><div className="a"><p>Yes — TS RERA P02200011012, verifiable on the Telangana RERA portal.</p></div></div>
            <div className="q"><button>What is the possession timeline?</button><div className="a"><p>Construction is progressing on schedule; the committed possession timeline is shared on request and stated in your agreement.</p></div></div>
            <div className="q"><button>Can I get a home loan? Which banks are approved?</button><div className="a"><p>Yes — the project is supported by leading banks and housing-finance companies. Our team will share the approved-financier list and help with the process.</p></div></div>
            <div className="q"><button>How do I book a site visit?</button><div className="a"><p>Fill the form above or tap &ldquo;Book a site visit&rdquo; anywhere on the site, and we&rsquo;ll call you to arrange a convenient time. Visits are private and no-obligation.</p></div></div>
          </div>
        </div>
      </section>
    </>
  );
}
