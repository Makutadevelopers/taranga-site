'use client';
import Link from 'next/link';
import { useState } from 'react';
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
        <div className="reveal cgrid" style={{ alignItems: 'start' }}>
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
            {/* Contact actions sit under the form */}
            <p style={{ marginTop: '2rem' }}><a className="more" href="tel:+919059676464">Call +91 90596 76464</a></p>
            <p style={{ marginTop: '1rem' }}><a className="more" href="https://wa.me/919059676464" target="_blank" rel="noopener noreferrer">WhatsApp us</a></p>
            <p style={{ marginTop: '1rem' }}><a className="more" href="https://www.google.com/maps/dir/?api=1&destination=17.4792373,78.4162829" target="_blank" rel="noopener noreferrer">Get directions</a></p>
          </div>
          <div>
            <div className="label">Site office</div>
            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(2rem,4vw,2.8rem)', margin: '.3rem 0 1.2rem' }}>Come see us</h2>
            <div className="mapwrap" style={{ marginTop: '.4rem', height: 'clamp(300px,40vh,400px)' }}><iframe loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=17.4792373,78.4162829(Makuta+Taranga)&z=16&output=embed" title="Makuta Taranga location"></iframe></div>
            <p style={{ marginTop: '1.4rem', color: 'var(--ink-soft)' }}>IDL Road, Opp. IDL Lake, Hyderabad — 500072</p>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ padding: 'clamp(2rem,5vw,3rem) 0 clamp(5rem,9vw,7rem)' }}>
        <div
          className="reveal"
          style={{
            borderTop: '1px solid var(--hair)',
            paddingTop: 'clamp(2rem,5vw,3rem)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.4rem 2rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ maxWidth: '48ch' }}>
            <div className="label">Questions</div>
            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(1.9rem,3.6vw,2.6rem)', margin: '.3rem 0 .5rem' }}>
              Answers to the things you ask first
            </h2>
            <p style={{ color: 'var(--ink-soft)', margin: 0 }}>
              Configs, RERA, possession, home loans — the common questions now live in one place, in the Journal.
            </p>
          </div>
          <Link className="btn solid" href="/blog/#faq">
            Read the FAQ <span>&rarr;</span>
          </Link>
        </div>
      </section>
    </>
  );
}
