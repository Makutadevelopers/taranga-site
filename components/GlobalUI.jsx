'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { leadPayload, sendLead, trackLead, trackWhatsApp, sendWhatsAppTemplate } from '@/lib/lead';

const MODES = {
  visit: ['A private visit, by the lake', 'Tell us how to reach you and we’ll arrange a private visit by the lake.', 'Book a site visit', 'Visit requested', 'Thank you — our team will call you to confirm a time by the lake.'],
  brochure: ['The Brochure', 'Share your details and we’ll send the brochure to your WhatsApp.', 'Send it to me', 'Thank you', 'We’ll share the brochure with you on WhatsApp shortly.'],
  price: ['The Price Sheet', 'Leave your details and we’ll send the price sheet to your WhatsApp.', 'Send it to me', 'Thank you', 'We’ll share the price sheet with you on WhatsApp shortly.'],
  plan: ['The Floor Plan', 'Share your details and we’ll send the detailed floor plan straight to you.', 'Send it to me', 'Thank you', 'Your floor plan is on its way.'],
};
const SRC = { visit: 'Site Visit', brochure: 'Brochure', price: 'Price Sheet', plan: 'Floor Plan' };

export default function GlobalUI() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('brochure');
  const [success, setSuccess] = useState(false);
  const [extra, setExtra] = useState({}); // e.g. { unit, config }
  const [vals, setVals] = useState({ n: '', p: '', e: '', consent: false });
  const [errs, setErrs] = useState({ n: false, p: false, e: false, con: false });

  // lightbox state
  const [lb, setLb] = useState({ open: false, src: '', alt: '' });

  const openModal = useCallback((m, ex) => {
    setMode(m || 'brochure');
    setExtra(ex || {});
    setSuccess(false);
    setVals({ n: '', p: '', e: '', consent: false });
    setErrs({ n: false, p: false, e: false, con: false });
    setOpen(true);
  }, []);
  const closeModal = useCallback(() => setOpen(false), []);
  const zoom = useCallback((src, alt) => setLb({ open: true, src, alt: alt || '' }), []);

  // expose to converted markup + per-page effects (parity with original globals)
  useEffect(() => {
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.zoom = zoom;
    return () => {
      if (window.openModal === openModal) delete window.openModal;
      if (window.closeModal === closeModal) delete window.closeModal;
      if (window.zoom === zoom) delete window.zoom;
    };
  }, [openModal, closeModal, zoom]);

  // Esc closes modal + lightbox
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setLb((s) => ({ ...s, open: false }));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function submitModal() {
    const n = vals.n.trim();
    const p = vals.p.replace(/\D/g, '');
    const em = vals.e.trim();
    const next = {
      n: !n,
      p: !(p.length >= 10),
      e: !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em),
      con: !vals.consent,
    };
    setErrs(next);
    if (next.n || next.p || next.e || next.con) return;
    const src = SRC[mode] || 'Enquiry';
    // Brochure/Price: send the file to the lead's WhatsApp from the business account
    // (api-wa.co template) via our server function — the customer receives it directly.
    if (mode === 'brochure' || mode === 'price') {
      sendWhatsAppTemplate(mode, n, p);
      trackWhatsApp();
    }
    sendLead(
      leadPayload(src, n, p, em, extra),
      function () {
        trackLead('modal');
        setSuccess(true);
      },
      { mail: false } // Clove endpoint currently 500s; don't pop open Mail on failure
    );
  }

  const m = MODES[mode] || MODES.brochure;

  return (
    <>
      <div className={'modal' + (open ? ' open' : '')} id="modal" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
        <div className="box">
          <span className="x" onClick={closeModal}>&times;</span>
          <div className="mbrand">
            <img src="/assets/img/taranga_navy.png" alt="Makuta Taranga" />
            <svg className="mwave" viewBox="0 0 200 24" aria-hidden="true"><path d="M4,14 C40,2 80,24 112,12 S170,2 196,12" /></svg>
          </div>
          {!success ? (
            <div id="mform">
              <h3 id="mtitle">{m[0]}</h3>
              <p id="mdesc">{m[1]}</p>
              <input id="mn" placeholder="Full name" value={vals.n} onChange={(e) => setVals((v) => ({ ...v, n: e.target.value }))} />
              <div className="err" id="men" style={{ display: errs.n ? 'block' : 'none' }}>Please enter your name.</div>
              <input id="mp" placeholder="Phone number" value={vals.p} onChange={(e) => setVals((v) => ({ ...v, p: e.target.value }))} />
              <div className="err" id="mep" style={{ display: errs.p ? 'block' : 'none' }}>Enter a valid 10-digit phone.</div>
              <input id="me" placeholder="Email address" value={vals.e} onChange={(e) => setVals((v) => ({ ...v, e: e.target.value }))} />
              <div className="err" id="mee" style={{ display: errs.e ? 'block' : 'none' }}>Enter a valid email.</div>
              <label htmlFor="mconsent" style={{ display: 'flex', alignItems: 'flex-start', gap: '.55rem', margin: '.1rem 0 1.1rem', fontSize: '.76rem', lineHeight: 1.5, color: 'var(--ink-soft)', textAlign: 'left', cursor: 'pointer' }}>
                <input type="checkbox" id="mconsent" checked={vals.consent} onChange={(e) => setVals((v) => ({ ...v, consent: e.target.checked }))} style={{ width: 16, height: 16, marginTop: '.2rem', flex: '0 0 auto', accentColor: '#1C2A38' }} />
                <span>
                  I agree to be contacted by Makuta Taranga on WhatsApp, phone or email about my enquiry, and accept the{' '}
                  <a href="/privacy/" target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()} style={{ textDecoration: 'underline' }}>Privacy Policy</a>
                  {' '}&amp;{' '}
                  <a href="/terms/" target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()} style={{ textDecoration: 'underline' }}>Terms</a>.
                </span>
              </label>
              <div className="err" id="mecon" style={{ display: errs.con ? 'block' : 'none' }}>Please tick the box to continue.</div>
              <a href="#" className="btn solid" id="msb" onClick={(e) => { e.preventDefault(); submitModal(); }}>{m[2]}</a>
            </div>
          ) : (
            <div id="msuccess" className="ok">
              <div className="tick">✓</div>
              <h3 id="stitle">{m[3]}</h3>
              <p id="sdesc" style={{ marginTop: '.3rem' }}>{m[4]}</p>
              <a href="#" className="btn" onClick={(e) => { e.preventDefault(); closeModal(); }}>Close</a>
            </div>
          )}
        </div>
      </div>

      <div className={'lightbox' + (lb.open ? ' open' : '')} id="lightbox" onClick={() => setLb((s) => ({ ...s, open: false }))}>
        <span className="x">&times;</span>
        <img id="lbimg" src={lb.src} alt={lb.alt} />
      </div>
    </>
  );
}
