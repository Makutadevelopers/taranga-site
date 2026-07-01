'use client';
import Link from 'next/link';
import { useState } from 'react';
import { leadPayload, sendLead, trackLead } from '@/lib/lead';
import pageCss from './page-styles';

const openModal = (m) => window.openModal && window.openModal(m);

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
          <div className="crumb"><Link href="/">Home</Link> / Location</div>
          <h1>Where the lake<br />meets the city</h1>
          <p>An established, connected address in north-west Hyderabad — and a lakefront calm you won’t find at the price anywhere near it.</p>
          <div className="hairline" style={{ marginTop: '1.6rem' }}></div>
        </div>
        <div className="ph-img"><div className="ph" style={{ backgroundImage: 'url(/assets/img/ext_lake_day.webp)' }}></div></div>
      </div></div></section>

      <section className="wrap" style={{ padding: 'clamp(2rem,5vw,3rem) 0 clamp(4rem,8vw,6rem)' }}>
        <div className="reveal">
          <div className="kicker"><span className="kn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="11" r="2.4" /></svg></span><div><div className="kt">The Address</div><div className="ks">Where Taranga sits on the map</div></div></div>
          <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(2rem,4.4vw,3.2rem)', margin: '.3rem 0 .6rem' }}>See exactly where you’ll be</h2>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '46ch' }}>IDL Road, opposite IDL Lake, Moosapet — between Kukatpally and Balanagar. Drag the map to trace your own commute.</p>
        </div>
        <div className="reveal">
          <div className="mapcap"><b>◍</b>&nbsp; Makuta Taranga · IDL Road, Opp. IDL Lake, Moosapet</div>
          <div className="mapwrap"><iframe loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=17.4792373,78.4162829(Makuta+Taranga)&z=16&output=embed" title="Makuta Taranga location"></iframe></div>
        </div>
        <div style={{ marginTop: '1rem' }}><a className="more" href="https://www.google.com/maps/dir/?api=1&destination=17.4792373,78.4162829" target="_blank" rel="noopener noreferrer">Get directions</a></div>
        <div className="reveal" style={{ marginTop: '3.4rem' }}>
          <div className="kicker"><span className="kn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M5 19c0-5 14-9 14-14" /><circle cx="5" cy="19" r="1.8" /><circle cx="19" cy="5" r="1.8" /></svg></span><div><div className="kt">Connectivity</div><div className="ks">How close everything already is</div></div></div>
          <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(2rem,4.4vw,3.2rem)', margin: '.3rem 0 1rem' }}>Your commute, already halved</h2>
          <div className="conn">
            <div className="r"><span>Ashoka One Mall</span><b>100 m</b></div>
            <div className="r"><span>Nearest metro store</span><b>550 m</b></div>
            <div className="r"><span>Balanagar Metro</span><b>650 m</b></div>
            <div className="r"><span>Kukatpally Metro</span><b>800 m</b></div>
            <div className="r"><span>Omni Hospitals</span><b>1 km</b></div>
            <div className="r"><span>The Creek Planet School</span><b>1 km</b></div>
            <div className="r"><span>Euro International School</span><b>1.5 km</b></div>
            <div className="r"><span>Yashoda Hospitals</span><b>5.5 km</b></div>
            <div className="r"><span>Cyber Towers / HITEC City</span><b>6.5 km</b></div>
          </div>
        </div>

        <div className="reveal" style={{ marginTop: '3.4rem' }}>
          <div className="kicker"><span className="kn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V9l9-6 9 6v12M3 21h18M9 21v-6h6v6" /></svg></span><div><div className="kt">The Neighbourhood</div><div className="ks">Moosapet &amp; Kukatpally, north-west Hyderabad</div></div></div>
          <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(2rem,4.4vw,3.2rem)', margin: '.3rem 0 1rem' }}>An address that&rsquo;s already arrived</h2>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '60ch' }}>
            Makuta Taranga sits on IDL Road in Moosapet, on the Kukatpally&ndash;Balanagar corridor of north-west Hyderabad &mdash;
            one of the city&rsquo;s most established residential and retail belts. You&rsquo;re a short walk from the Hyderabad Metro
            Red Line (Balanagar and Kukatpally stations), minutes from KPHB and JNTU, and a clean run down NH-65 to HITEC City and
            the Financial District &mdash; without paying the price those micro-markets now command.
          </p>

          <div className="conn" style={{ marginTop: '1.6rem' }}>
            <div className="r"><span><b>Metro &amp; transit</b> &mdash; Balanagar &amp; Kukatpally Red Line stations</span><b>≤ 800 m</b></div>
            <div className="r"><span><b>Workplaces</b> &mdash; HITEC City, Cyber Towers, Financial District</span><b>6.5&ndash;14 km</b></div>
            <div className="r"><span><b>Retail</b> &mdash; Ashoka One Mall, Forum Sujana, KPHB high street</span><b>0.1&ndash;3 km</b></div>
            <div className="r"><span><b>Schools</b> &mdash; The Creek Planet, Euro International, Vidyaranya</span><b>1&ndash;3 km</b></div>
            <div className="r"><span><b>Healthcare</b> &mdash; Omni, Yashoda &amp; Remedy Hospitals</span><b>1&ndash;6 km</b></div>
            <div className="r"><span><b>Airport</b> &mdash; Rajiv Gandhi International (via ORR / PVNR)</span><b>~35 km</b></div>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '.78rem', marginTop: '1rem', maxWidth: '60ch' }}>
            Distances are approximate, measured by road from the project gate, and may vary with route and traffic.
          </p>
        </div>
      </section>

      <div className="wavediv"><svg viewBox="0 0 1200 40" preserveAspectRatio="none"><path d="M0,20 C150,38 300,4 450,20 S750,38 900,20 1050,4 1200,20" /></svg></div>

      <section className="enq wrap" data-rail="Visit" style={{ padding: 'clamp(4.5rem,10vw,7rem) 0' }}><div className="reveal">
        <div className="label" style={{ marginBottom: '1.3rem' }}>Come see the view that can’t be built out</div>
        <h2>Come stand on the spot.</h2>
        <p>The view explains itself in person. Let’s arrange a visit.</p>
        {!qDone ? (
          <div className="qform" id="qform">
            <input id="qn" placeholder="Your name" value={q.n} onChange={(e) => setQ((v) => ({ ...v, n: e.target.value }))} />
            <input id="qp" placeholder="Phone" value={q.p} onChange={(e) => setQ((v) => ({ ...v, p: e.target.value }))} />
            <select id="qc" value={q.c} onChange={(e) => setQ((v) => ({ ...v, c: e.target.value }))}><option value="">Interested in…</option><option>3 BHK</option><option>4 BHK</option></select>
            <a href="#" className="btn solid" onClick={(e) => { e.preventDefault(); quickSubmit(); }}>Request a Visit</a>
          </div>
        ) : (
          <div className="qform" id="qform"><div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', color: 'var(--line)', fontSize: '1.4rem' }}>Thank you, {qDone}. We’ll call you shortly to plan your visit.</div></div>
        )}
        {!qDone && <div className="formnote" id="qnote" style={{ color: qNote.color || undefined }}>{qNote.text}</div>}
        <div className="altcta">Prefer to read first? <a href="#" onClick={(e) => { e.preventDefault(); openModal('brochure'); }}>Download the brochure</a> or <a href="#" onClick={(e) => { e.preventDefault(); openModal('price'); }}>get the price sheet</a>.</div>
      </div></section>
    </>
  );
}
