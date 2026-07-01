'use client';
import Link from 'next/link';
import { useState } from 'react';
import pageCss from './page-styles';
import { leadPayload, sendLead, trackLead } from '@/lib/lead';

const openModal = (m) => window.openModal && window.openModal(m);
const zoom = (src, alt) => window.zoom && window.zoom(src, alt);

const GALLERY = [
  ['ext_lake_am.webp', 'Golden hour over the lake', 'Twin towers over the lake at golden hour', 'Golden hour'],
  ['int_living2.webp', 'Living room', 'Living room interior', 'Living room'],
  ['int_bedroom.webp', 'Master bedroom', 'Master bedroom interior', 'Master bedroom'],
  ['int_kitchen.webp', 'Kitchen & dining', 'Kitchen with dining area', 'Kitchen & dining'],
  ['int_balcony.webp', 'The balcony', 'Balcony with skyline view', 'The balcony'],
  ['int_balcony2.webp', 'Covered balcony', 'Covered balcony with seating', 'Covered balcony'],
  ['am_lounge2.webp', 'Garden lounge', 'Outdoor garden lounge in the evening', 'Garden lounge'],
  ['am_terrace.webp', 'Terrace garden', 'Landscaped terrace garden at dusk', 'Terrace garden'],
  ['am_tennis.webp', 'The courts', 'Tennis court at golden hour', 'The courts'],
  ['am_pool.webp', 'The pool', 'Swimming pool and landscape', 'The pool'],
  ['ext_aerial_dusk.webp', 'Aerial, at dusk', 'Aerial of the towers at dusk', 'Aerial, at dusk'],
  ['r_aerial2.webp', 'From above', 'Aerial of the twin towers', 'From above'],
  ['lake.webp', 'The lakefront', 'Lakefront view', 'The lakefront'],
  ['d_green.webp', 'In bloom', 'Jacaranda in bloom across the grounds', 'In bloom'],
  ['d_foyer.webp', 'Private foyer', 'Private entrance foyer', 'Private foyer'],
  ['r_cam36.webp', 'At sunset', 'Towers at sunset over the lake', 'At sunset'],
];

export default function PageClient() {
  /* quick visit form */
  const [q, setQ] = useState({ n: '', p: '', c: '' });
  const [qDone, setQDone] = useState(false);
  const [qNote, setQNote] = useState({ text: 'We respect your privacy. No spam — just a call back to plan your visit.', color: '' });

  function quickSubmit() {
    const n = q.n.trim();
    const p = q.p.replace(/\D/g, '');
    if (!n || p.length < 10) {
      setQNote({ text: 'Please enter your name and a valid phone number.', color: '#b5562f' });
      return;
    }
    sendLead(leadPayload('Quick enquiry', n, p, '', { config: q.c }), function () {});
    trackLead('quick');
    setQDone(n.split(' ')[0]);
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />

      <section className="phead"><div className="wrap"><div className="grid">
        <div>
          <div className="crumb"><Link href="/">Home</Link> / Gallery</div>
          <h1>Take a closer<br />look</h1>
          <p>Step through the towers, the water&rsquo;s edge and the rooftops. Tap any image to enlarge.</p>
          <p className="whisper" style={{ textAlign: 'left', margin: '1.6rem 0 0', maxWidth: '34ch' }}>Look for what isn&rsquo;t in the frame. The space is the subject.</p>
          <div className="hairline" style={{ marginTop: '1.6rem' }}></div>
        </div>
        <div className="ph-img"><div className="ph" style={{ backgroundImage: 'url(/assets/img/ext_entrance.webp)' }}></div></div>
      </div></div></section>

      <section className="wrap" style={{ padding: 'clamp(2rem,5vw,3rem) 0 clamp(5rem,9vw,7rem)' }}>
        <div className="gal reveal">
          {GALLERY.map(([file, zoomAlt, alt, cap]) => (
            <figure key={file} onClick={() => zoom('/assets/img/' + file, zoomAlt)}>
              <img src={'/assets/img/' + file} alt={alt} loading="lazy" decoding="async" />
              <figcaption>{cap}</figcaption>
            </figure>
          ))}
        </div>
        <p className="indic" style={{ marginTop: '1.5rem' }}>Renders are artist&rsquo;s impressions for representation only. More floor plans and a walkthrough coming soon.</p>
      </section>

      <div className="wavediv"><svg viewBox="0 0 1200 40" preserveAspectRatio="none"><path d="M0,20 C150,38 300,4 450,20 S750,38 900,20 1050,4 1200,20" /></svg></div>

      <section className="enq wrap" data-rail="Visit" style={{ padding: 'clamp(4.5rem,10vw,7rem) 0' }}><div className="reveal">
        <div className="label" style={{ marginBottom: '1.3rem' }}>Come see the view that can&rsquo;t be built out</div>
        <h2>A private visit, by the lake.</h2>
        <p>Leave your details and our team will call you back to arrange a viewing — no obligation.</p>
        {!qDone ? (
          <div className="qform" id="qform">
            <input id="qn" placeholder="Your name" value={q.n} onChange={(e) => setQ((v) => ({ ...v, n: e.target.value }))} />
            <input id="qp" placeholder="Phone" value={q.p} onChange={(e) => setQ((v) => ({ ...v, p: e.target.value }))} />
            <select id="qc" value={q.c} onChange={(e) => setQ((v) => ({ ...v, c: e.target.value }))}><option value="">Interested in…</option><option>3 BHK</option><option>4 BHK</option></select>
            <a href="#" className="btn solid" onClick={(e) => { e.preventDefault(); quickSubmit(); }}>Book a site visit</a>
          </div>
        ) : (
          <div className="qform" id="qform"><div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', color: 'var(--line)', fontSize: '1.4rem' }}>Thank you, {qDone}. We&rsquo;ll call you shortly to plan your visit.</div></div>
        )}
        {!qDone && <div className="formnote" id="qnote" style={{ color: qNote.color || undefined }}>{qNote.text}</div>}
        <div className="altcta">Prefer to read first? <a href="#" onClick={(e) => { e.preventDefault(); openModal('brochure'); }}>Send me the brochure</a> or <a href="#" onClick={(e) => { e.preventDefault(); openModal('price'); }}>the price sheet</a>.</div>
      </div></section>
    </>
  );
}
