'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  leadPayload, sendLead, trackLead, trackWhatsApp, sendWhatsAppTemplate,
  trackCtaClick, trackSubmitAttempt, trackSubmitError,
} from '@/lib/lead';
import { findCountry, validatePhone, toE164 } from '@/lib/phone';
import PhoneField from '@/components/PhoneField';

const MODES = {
  visit: ['A private visit, by the lake', 'Tell us how to reach you and we’ll arrange a private visit by the lake.', 'Book a site visit', 'Visit requested', 'Thank you — our team will call you to confirm a time by the lake.'],
  brochure: ['The Brochure', 'Share your details and we’ll send the brochure to your WhatsApp.', 'Send it to me', 'Thank you', 'We’ll share the brochure with you on WhatsApp shortly.'],
  price: ['The Price Sheet', 'Leave your details and we’ll send the price sheet to your WhatsApp.', 'Send it to me', 'Thank you', 'We’ll share the price sheet with you on WhatsApp shortly.'],
  plan: ['The Floor Plan', 'Share your details and we’ll send the detailed floor plan straight to you.', 'Send it to me', 'Thank you', 'Your floor plan is on its way.'],
};
const SRC = { visit: 'Site Visit', brochure: 'Brochure', price: 'Price Sheet', plan: 'Floor Plan' };

// Derive cta_placement / cta_label from the DOM at click time instead of hand-labelling
// each of the ~31 CTAs. They all funnel through window.openModal, which receives only the
// mode — so the clicked element is captured separately (see lastClick below) and walked
// here. Adding a CTA anywhere needs no analytics change.
// Only 4 of 13 sections carry an id, so `section[id]` alone reports "unknown" for most
// CTAs. Fall back to the section's own identifying class (`ess`, `ctaband`, `enq`…),
// skipping layout-only classes, then to landmarks and the sticky bar's #sbar.
const GENERIC_CLASS = new Set(['wrap', 'reveal', 'alt', 'section', 'container', 'row', 'inner']);

function nameFor(el) {
  if (!el) return '';
  if (el.id) return el.id;
  const cls = (typeof el.className === 'string' ? el.className : '').trim().split(/\s+/);
  return cls.find((c) => c && !GENERIC_CLASS.has(c)) || el.tagName.toLowerCase();
}

function ctaContext(el) {
  if (!el) return { placement: 'unknown', label: '' };
  const btn = el.closest('a,button') || el;
  const label = (btn.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  const host =
    btn.closest('section') || btn.closest('header') || btn.closest('footer') ||
    btn.closest('nav') || btn.closest('[id]');
  return { placement: nameFor(host) || 'unknown', label };
}

export default function GlobalUI() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('brochure');
  const [success, setSuccess] = useState(false);
  const [extra, setExtra] = useState({}); // e.g. { unit, config }
  const [vals, setVals] = useState({ n: '', p: '', e: '', iso: 'IN', consent: false });
  const [errs, setErrs] = useState({ n: false, p: false, e: false, con: false });

  // lightbox state — items: [{ src, title, desc }], index points at the visible one
  const [lb, setLb] = useState({ open: false, items: [], index: 0 });

  // Double-tap guard. A ref, not state: two taps in the same tick would both pass a
  // state check before React re-renders, sending the lead — and the WhatsApp template
  // — twice. The ref flips synchronously, so the second tap is dropped.
  const sending = useRef(false);

  // What the visitor actually clicked, recorded in the CAPTURE phase so it lands before
  // React's onClick runs openModal. Timestamped because openModal can also be called
  // programmatically — a stale element would silently mis-attribute the placement.
  const lastClick = useRef({ el: null, t: 0 });
  const ctaCtx = useRef(null); // {type, placement, label} of the CTA that opened the modal
  useEffect(() => {
    const onDocClick = (e) => { lastClick.current = { el: e.target, t: Date.now() }; };
    document.addEventListener('click', onDocClick, true);
    return () => document.removeEventListener('click', onDocClick, true);
  }, []);

  const openModal = useCallback((m, ex) => {
    const kind = m || 'brochure';
    const { el, t } = lastClick.current;
    const { placement, label } = ctaContext(Date.now() - t < 1000 ? el : null);
    // Held for the life of this modal so the submit events and the completed lead all
    // report the button that opened it, not just the click.
    ctaCtx.current = { type: kind, placement, label };
    trackCtaClick(ctaCtx.current);
    setMode(kind);
    setExtra(ex || {});
    setSuccess(false);
    setVals({ n: '', p: '', e: '', iso: 'IN', consent: false });
    setErrs({ n: false, p: false, e: false, con: false });
    sending.current = false;
    setOpen(true);
  }, []);
  const closeModal = useCallback(() => setOpen(false), []);
  // Single image (masterplan, floor plans): one-item list, no navigation.
  const zoom = useCallback((src, alt) => setLb({ open: true, items: [{ src, title: '', desc: alt || '' }], index: 0 }), []);
  // Gallery: a list of { src, title, desc } with prev/next + captions.
  const zoomGallery = useCallback((items, index) => setLb({ open: true, items: Array.isArray(items) ? items : [], index: index || 0 }), []);
  const lbStep = useCallback(
    (dir) => setLb((s) => (s.open && s.items.length > 1 ? { ...s, index: (s.index + dir + s.items.length) % s.items.length } : s)),
    []
  );

  // expose to converted markup + per-page effects (parity with original globals)
  useEffect(() => {
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.zoom = zoom;
    window.zoomGallery = zoomGallery;
    return () => {
      if (window.openModal === openModal) delete window.openModal;
      if (window.closeModal === closeModal) delete window.closeModal;
      if (window.zoom === zoom) delete window.zoom;
      if (window.zoomGallery === zoomGallery) delete window.zoomGallery;
    };
  }, [openModal, closeModal, zoom, zoomGallery]);

  // Esc closes modal + lightbox; ←/→ step through gallery images
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setLb((s) => ({ ...s, open: false }));
      } else if (e.key === 'ArrowRight') {
        setLb((s) => (s.open && s.items.length > 1 ? { ...s, index: (s.index + 1) % s.items.length } : s));
      } else if (e.key === 'ArrowLeft') {
        setLb((s) => (s.open && s.items.length > 1 ? { ...s, index: (s.index - 1 + s.items.length) % s.items.length } : s));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function submitModal() {
    trackSubmitAttempt(ctaCtx.current); // before validation — counts everyone who presses Submit
    const n = vals.n.trim();
    const country = findCountry(vals.iso);
    const national = vals.p.replace(/\D/g, '');
    const em = vals.e.trim();
    const next = {
      n: !n,
      p: !validatePhone(country, national),
      e: !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em),
      con: !vals.consent,
    };
    setErrs(next);
    if (next.n || next.p || next.e || next.con) {
      // One event per rejected submission, reporting the first failing field in form
      // order — keeps the attempt → error → generate_lead funnel arithmetic 1:1.
      trackSubmitError(ctaCtx.current, next.n ? 'name' : next.p ? 'phone' : next.e ? 'email' : 'consent');
      return;
    }
    if (sending.current) return; // already submitted — drop the repeat tap
    sending.current = true;
    const src = SRC[mode] || 'Enquiry';
    const intlDigits = toE164(country, national, false); // e.g. "919876543210"
    // Brochure/Price: send the file to the lead's WhatsApp from the business account
    // (api-wa.co template) via our server function — the customer receives it directly.
    if (mode === 'brochure' || mode === 'price') {
      sendWhatsAppTemplate(mode, n, intlDigits);
      trackWhatsApp();
    }
    // Show the thank-you immediately — the lead POST runs in the background. The Clove
    // upstream can take a few seconds, so there's no reason to make the visitor wait on
    // it before confirming their enquiry landed. That makes generate_lead optimistic:
    // lead_send_failed (with failure_reason) is what reconciles it.
    trackLead('modal', ctaCtx.current);
    setSuccess(true);
    sendLead(
      leadPayload(src, n, '+' + intlDigits, em, extra),
      null,
      // mail:false — the visitor is handed to WhatsApp anyway, so a Clove hiccup
      // shouldn't also pop open their Mail app. The failure is reported to GA4 instead.
      { mail: false, cta: ctaCtx.current }
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
              <PhoneField id="mp" placeholder="Phone number" iso={vals.iso} number={vals.p} invalid={errs.p} onIso={(iso) => setVals((v) => ({ ...v, iso }))} onNumber={(p) => setVals((v) => ({ ...v, p }))} />
              <div className="err" id="mep" style={{ display: errs.p ? 'block' : 'none' }}>Enter a valid phone number for the selected country.</div>
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
              <a href="#" className="btn solid" id="msb" style={{ touchAction: 'manipulation' }} onClick={(e) => { e.preventDefault(); submitModal(); }}>{m[2]}</a>
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
        {(() => {
          const cur = lb.items[lb.index] || { src: '', title: '', desc: '' };
          const multi = lb.items.length > 1;
          return (
            <>
              <span className="x">&times;</span>
              {multi && (
                <button
                  type="button"
                  className="lb-nav lb-prev"
                  aria-label="Previous image"
                  onClick={(e) => { e.stopPropagation(); lbStep(-1); }}
                >
                  &lsaquo;
                </button>
              )}
              <figure className="lb-figure" onClick={(e) => e.stopPropagation()}>
                <img id="lbimg" src={cur.src} alt={cur.desc || cur.title} />
                {(cur.title || cur.desc) && (
                  <figcaption className="lb-cap">
                    {cur.title && <b>{cur.title}</b>}
                    {cur.desc && <span>{cur.desc}</span>}
                    {multi && <em className="lb-count">{lb.index + 1} / {lb.items.length}</em>}
                  </figcaption>
                )}
              </figure>
              {multi && (
                <button
                  type="button"
                  className="lb-nav lb-next"
                  aria-label="Next image"
                  onClick={(e) => { e.stopPropagation(); lbStep(1); }}
                >
                  &rsaquo;
                </button>
              )}
            </>
          );
        })()}
      </div>
    </>
  );
}
