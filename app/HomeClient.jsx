'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { leadPayload, sendLead, trackLead } from '@/lib/lead';

const media = (file, pos) => ({ backgroundImage: `url(/assets/img/${file})`, backgroundPosition: pos });
const openModal = (m) => window.openModal && window.openModal(m);

// Numbered key for the master-plan render. The plan image carries the printed
// numbers; this legend is the matching reference key below it.
const MP_LEGEND = [
  [1, 'Main Entrance Gate', 1], [2, 'Drop-off Zone'], [3, 'Basement Entry Ramp'], [4, 'Basement Exit Ramp'],
  [5, 'Residential Block A', 1], [6, 'Residential Block B', 1], [7, 'Central Landscape Court', 1], [8, 'Internal Walkways'],
  [9, 'Jogging Track', 1], [10, 'Kids Play Area'], [11, 'Tennis Court', 1], [12, 'Basketball Court'],
  [13, 'Cricket Practice Net'], [14, 'Clubhouse · 30,000 sft', 1], [15, 'Pavilion Seating Area'], [16, 'Temple', 1],
  [17, 'Ventilation Duct'],
];

// Pin positions as % of the master-plan image, aligned to the printed 01–17
// badges on masterplan_plan.jpg (2460×1125). Clicking/hovering a legend item
// pulses the matching pin. Nudge a value here if a ring sits slightly off.
const MP_PINS = {
  1: [17.5, 18.6], 2: [22.6, 8.5], 3: [38.8, 22.4], 4: [24.9, 42.6], 5: [39.2, 50.6],
  6: [69.4, 47.5], 7: [55.5, 48.6], 8: [56.4, 17.8], 9: [54.0, 87.2], 10: [44.8, 8.5],
  11: [89.8, 49.0], 12: [92.9, 79.0], 13: [44.4, 94.2], 14: [13.1, 69.4], 15: [15.1, 41.7],
  16: [88.6, 23.8], 17: [67.4, 10.8],
};

export default function HomeClient() {
  /* hero video: poster is the eager LCP; the video only mounts on capable,
     non-data-saving desktop sessions so mobile/metered users never download it. */
  const [showVideo, setShowVideo] = useState(false);
  const heroVideoRef = useRef(null);
  // Responsive hero video: 'mobile' (portrait) | 'tablet' (square) | 'desktop' (wide).
  const [tier, setTier] = useState('desktop');
  useEffect(() => {
    const conn = navigator.connection || {};
    const saveData = conn.saveData === true;
    const reducedData = matchMedia('(prefers-reduced-data: reduce)').matches;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const computeTier = () => {
      if (matchMedia('(max-width: 767px)').matches) setTier('mobile');
      else if (matchMedia('(max-width: 1024px)').matches) setTier('tablet');
      else setTier('desktop');
    };
    computeTier();
    if (!saveData && !reducedData && !reducedMotion) setShowVideo(true);
    window.addEventListener('resize', computeTier, { passive: true });
    return () => window.removeEventListener('resize', computeTier);
  }, []);
  // iOS/Safari: React's `muted` attribute doesn't set the muted PROPERTY reliably,
  // and without it (or with preload=none) muted-autoplay is blocked and a play button
  // appears. Force the property + kick off playback once the video is mounted.
  useEffect(() => {
    const v = heroVideoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const tryPlay = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
    tryPlay();
    v.addEventListener('loadeddata', tryPlay, { once: true });
    v.addEventListener('canplay', tryPlay, { once: true });
    // Safari fallback: if muted-autoplay is deferred (Low Power Mode, per-site
    // Auto-Play setting), kick playback off on the first user gesture. Self-removes
    // once the video is actually rolling so we don't fight the browser afterward.
    const kick = () => { v.muted = true; tryPlay(); };
    const gestures = ['pointerdown', 'touchstart', 'keydown', 'scroll'];
    gestures.forEach((e) => window.addEventListener(e, kick, { passive: true }));
    // Reveal the video only once it's genuinely playing. Until then the poster shows
    // through and iOS never gets a chance to paint its start-button over a paused frame.
    const onPlaying = () => { v.classList.add('is-playing'); gestures.forEach((e) => window.removeEventListener(e, kick)); };
    v.addEventListener('playing', onPlaying, { once: true });
    return () => {
      v.removeEventListener('loadeddata', tryPlay);
      v.removeEventListener('canplay', tryPlay);
      v.removeEventListener('playing', onPlaying);
      gestures.forEach((e) => window.removeEventListener(e, kick));
    };
  }, [showVideo, tier]);
  const HERO = {
    mobile: { mp4: '/assets/video/hero-mobile.mp4', poster: '/assets/img/hero-mobile-poster.jpg' },
    tablet: { mp4: '/assets/video/hero-square.mp4', poster: '/assets/img/hero-square-poster.jpg' },
    desktop: { mp4: '/assets/video/hero-desktop.mp4', poster: '/assets/img/hero-desktop-poster.jpg' },
  };

  /* master-plan: which numbered point is highlighted (from legend or pin) */
  const [mpHot, setMpHot] = useState(null);

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

  /* masterplan pins + parallax + pinned scroll-stories engine */
  useEffect(() => {
    const cleanups = [];

    /* parallax */
    const px = document.querySelector('[data-parallax]');
    if (px && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
      const onScroll = () => {
        const band = px.closest('.band');
        if (!band) return;
        const r = band.getBoundingClientRect();
        px.style.transform = 'translateY(' + r.top * -0.1 + 'px) scale(1.14)';
      };
      window.addEventListener('scroll', onScroll);
      onScroll();
      cleanups.push(() => window.removeEventListener('scroll', onScroll));
    }

    /* ---- pinned scroll-stories engine (smooth desktop + mobile carousel) ---- */
    const story = (function () {
      'use strict';
      const motionQ = matchMedia('(prefers-reduced-motion: reduce)');
      const pinQ = matchMedia('(min-width: 901px)');
      const SLIDE = 9, LIFT = 16, EASE = 0.12, EPS = 0.0006;
      const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
      const eio = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const sm = (t) => t * t * (3 - 2 * t);
      const bgUrl = (el) => { const b = el && el.style.backgroundImage; if (!b) return null; const m = /url\(["']?([^"')]+)["']?\)/.exec(b); return m ? m[1] : null; };
      const S = [].slice.call(document.querySelectorAll('.sstory')).map((el) => {
        const deck = el.querySelector('.sstory__deck');
        const cs = [].slice.call(el.querySelectorAll('.scard'));
        return { el, deck, cards: cs.map((c, i) => ({ node: c, media: c.querySelector('.scard__media'), side: i % 2 === 0 ? -1 : 1 })), dots: null, hint: null, onScroll: null, cur: null };
      });
      if (!S.length) return null;
      const preIO = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          const sec = e.target;
          if (sec._dec) return;
          sec._dec = true;
          [].slice.call(sec.querySelectorAll('.scard__media')).forEach(function (m) {
            const u = bgUrl(m);
            if (!u) return;
            const im = new Image();
            im.src = u;
            if (im.decode) im.decode().catch(function () {});
          });
          preIO.unobserve(sec);
        });
      }, { rootMargin: '90% 0px 90% 0px' });
      S.forEach((st) => preIO.observe(st.el));
      let on = false, raf = null;
      function rc(card, delta) {
        const s = card.side; let op, x = 0, y = 0, sc = 1, mz = 1;
        if (delta <= -1 || delta >= 1) { op = 0; x = (delta < 0 ? s : -s) * SLIDE; sc = 0.94; mz = 1.06; }
        else if (delta <= 0) { const ti = eio(delta + 1); op = ti; x = s * (1 - ti) * SLIDE; y = (1 - ti) * LIFT; sc = 0.94 + 0.06 * ti; mz = 1.06 - 0.06 * ti; }
        else { const to = eio(delta); op = 1 - to; x = -s * to * (SLIDE * 0.55); sc = 1 - 0.045 * to; mz = 1 + 0.05 * to; }
        const node = card.node; node.style.opacity = op.toFixed(3);
        node.style.transform = 'translate3d(' + x.toFixed(2) + 'vw,' + y.toFixed(2) + 'px,0) scale(' + sc.toFixed(4) + ')';
        node.style.zIndex = op > 0.5 ? '2' : '1'; node.style.pointerEvents = op > 0.6 ? 'auto' : 'none';
        if (card.media) card.media.style.transform = 'scale(' + mz.toFixed(4) + ')';
      }
      function render(st) { const n = st.cards.length, pos = st.cur * (n - 1), b = Math.floor(pos), e = b + sm(pos - b); for (let i = 0; i < n; i++) rc(st.cards[i], e - i); }
      function frame() {
        let mv = false; const vh = innerHeight;
        for (let i = 0; i < S.length; i++) {
          const st = S[i], r = st.el.getBoundingClientRect();
          if (r.bottom < -260 || r.top > vh + 260) continue; const tr = st.el.offsetHeight - vh; if (tr <= 0) continue;
          const tg = clamp(-r.top / tr, 0, 1); if (st.cur === null) st.cur = tg; const d = tg - st.cur;
          if (Math.abs(d) > EPS) { st.cur += d * EASE; mv = true; } else st.cur = tg; render(st);
        }
        raf = on && mv ? requestAnimationFrame(frame) : null;
      }
      function kick() { if (on && raf === null) raf = requestAnimationFrame(frame); }
      function activeIndex(st) { const d = st.deck, c = d.scrollLeft + d.clientWidth / 2; let best = 0, bd = 1e9; st.cards.forEach((card, i) => { const cc = card.node.offsetLeft + card.node.offsetWidth / 2, dd = Math.abs(cc - c); if (dd < bd) { bd = dd; best = i; } }); return best; }
      function updateActive(st) { const a = activeIndex(st); st.cards.forEach((c, i) => c.node.classList.toggle('is-dim', i !== a)); if (st.dots) [].slice.call(st.dots.children).forEach((b, i) => b.classList.toggle('on', i === a)); if (st.hint && st.deck.scrollLeft > 6) st.hint.style.opacity = '0'; }
      function scrollToCard(st, i) { const card = st.cards[i].node; st.deck.scrollTo({ left: card.offsetLeft - (st.deck.clientWidth - card.offsetWidth) / 2, behavior: 'smooth' }); }
      function buildCarousel(st, first) {
        if (!st.dots) { const d = document.createElement('div'); d.className = 'sdots'; st.cards.forEach((c, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'View card ' + (i + 1)); b.addEventListener('click', () => scrollToCard(st, i)); d.appendChild(b); }); st.deck.parentNode.appendChild(d); st.dots = d; }
        if (first && !st.hint) { const h = document.createElement('div'); h.className = 'swipehint'; h.innerHTML = '<svg viewBox="0 0 22 10" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M1 5h18M15 1l4 4-4 4"/></svg> Swipe'; st.deck.parentNode.appendChild(h); st.hint = h; }
        if (!st.onScroll) { st.onScroll = () => updateActive(st); st.deck.addEventListener('scroll', st.onScroll, { passive: true }); }
        updateActive(st);
      }
      function destroyCarousel(st) { if (st.onScroll) { st.deck.removeEventListener('scroll', st.onScroll); st.onScroll = null; } if (st.dots) { st.dots.remove(); st.dots = null; } if (st.hint) { st.hint.remove(); st.hint = null; } st.cards.forEach((c) => c.node.classList.remove('is-dim')); }
      function clrInline() { S.forEach((st) => { st.cur = null; st.cards.forEach((c) => { c.node.style.cssText = ''; if (c.media) c.media.style.transform = ''; }); }); }
      function setMode() {
        const reduce = motionQ.matches, pin = pinQ.matches && !reduce;
        if (pin) { on = true; S.forEach(destroyCarousel); clrInline(); S.forEach((st) => { st.cur = null; }); kick(); }
        else if (!reduce) { on = false; if (raf) { cancelAnimationFrame(raf); raf = null; } clrInline(); S.forEach((st, i) => buildCarousel(st, i === 0)); }
        else { on = false; if (raf) { cancelAnimationFrame(raf); raf = null; } clrInline(); S.forEach(destroyCarousel); }
      }
      const onKick = () => kick();
      const onResize = () => { setMode(); kick(); };
      addEventListener('scroll', onKick, { passive: true });
      addEventListener('resize', onResize, { passive: true });
      if (motionQ.addEventListener) motionQ.addEventListener('change', setMode);
      if (pinQ.addEventListener) pinQ.addEventListener('change', setMode);
      setMode();
      return { destroy() { removeEventListener('scroll', onKick); removeEventListener('resize', onResize); if (motionQ.removeEventListener) motionQ.removeEventListener('change', setMode); if (pinQ.removeEventListener) pinQ.removeEventListener('change', setMode); if (raf) cancelAnimationFrame(raf); S.forEach(destroyCarousel); clrInline(); } };
    })();
    if (story) cleanups.push(() => story.destroy());

    /* ---- click-to-play films (YouTube loads only on click) — used by the
           walkthrough beside "Why Taranga" and the construction film section ---- */
    (function () {
      const playPane = (pane) => {
        if (pane.querySelector('iframe')) return;
        const id = (pane.getAttribute('data-yt') || '').trim();
        if (!/^[\w-]{11}$/.test(id)) return; // ignore placeholder / invalid ids
        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1';
        iframe.title = pane.getAttribute('aria-label') || 'Video';
        iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
        iframe.setAttribute('allowfullscreen', '');
        pane.appendChild(iframe);
        pane.classList.add('playing');
        // open fullscreen on the click gesture (desktop); mobile falls back to inline
        const req = pane.requestFullscreen || pane.webkitRequestFullscreen || pane.msRequestFullscreen;
        if (req) { try { const r = req.call(pane); if (r && r.catch) r.catch(() => {}); } catch (e) { /* no-op */ } }
      };
      // Bind click/keydown play to every film stage on the page (worth section + film section).
      const stages = [].slice.call(document.querySelectorAll('.film-stage'));
      stages.forEach((stage) => {
        const onClick = (e) => { const pane = e.target.closest('.film-pane'); if (pane) playPane(pane); };
        const onKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { const pane = e.target.closest('.film-pane'); if (pane) { e.preventDefault(); playPane(pane); } } };
        stage.addEventListener('click', onClick);
        stage.addEventListener('keydown', onKey);
        cleanups.push(() => { stage.removeEventListener('click', onClick); stage.removeEventListener('keydown', onKey); });
      });
    })();

    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <>
      <section id="hero" className="hero hero-section">
        <picture>
          {/* Clean full-bleed posters — mobile portrait, tablet square, desktop widescreen. */}
          <source media="(max-width: 767px)" srcSet="/assets/img/hero-mobile-poster.jpg" />
          <source media="(min-width: 768px) and (max-width: 1024px)" srcSet="/assets/img/hero-square-poster.jpg" />
          <source media="(min-width: 1025px)" srcSet="/assets/img/hero-desktop-poster.jpg" />
          <img
            className="hero-poster"
            src="/assets/img/hero-desktop-poster.jpg"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            width="1920"
            height="1080"
          />
        </picture>
        {showVideo && (
          <video
            key={tier}
            ref={heroVideoRef}
            className="hero-video"
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            poster={HERO[tier].poster}
          >
            <source src={HERO[tier].mp4} type="video/mp4" />
          </video>
        )}
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-crown reveal-anim" style={{ animationDelay: '0.3s' }}>Makuta &middot; Crown of Excellence</div>
          <div className="hero-loc reveal-anim" style={{ animationDelay: '0.6s' }}>IDL Lake Road &middot; Kukatpally, Hyderabad</div>
          <h1 className="hero-title reveal-anim" style={{ animationDelay: '0.9s' }}>Taranga<span className="sr-only"> — Lakefront 3 &amp; 4 BHK Luxury Residences at IDL Lake, Kukatpally, Hyderabad</span></h1>
          <p className="hero-tag reveal-anim" style={{ animationDelay: '1.2s' }}>The Finest Form of Luxury</p>
          <div className="hero-ctas reveal-anim" style={{ animationDelay: '1.5s' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); openModal('brochure'); }} className="hero-btn hero-btn-primary">Brochure</a>
            <a href="#" onClick={(e) => { e.preventDefault(); openModal('price'); }} className="hero-btn hero-btn-secondary">Price Sheet</a>
            <a href="#" onClick={(e) => { e.preventDefault(); openModal('visit'); }} className="hero-btn hero-btn-cta">Book a site visit</a>
          </div>
          <p className="hero-trust reveal-anim" style={{ animationDelay: '1.8s' }}>TS RERA P02200011012</p>
        </div>
        <a href="#luxury" className="hero-scroll reveal-anim" style={{ animationDelay: '2.1s' }}>
          <span className="hero-scroll-text">Scroll &mdash; what luxury really means</span>
          <span className="hero-scroll-arrow">&darr;</span>
        </a>
      </section>

      <div className="roll-stage">
      <section id="luxury" className="lux reveal" aria-label="What is luxury">
        <span className="lux-corner tl" aria-hidden="true"></span>
        <span className="lux-corner tr" aria-hidden="true"></span>
        <span className="lux-corner bl" aria-hidden="true"></span>
        <span className="lux-corner br" aria-hidden="true"></span>
        <div className="lux-inner">
          <span className="lux-drop" aria-hidden="true"></span>
          <span className="lux-kick">The finest form of luxury</span>
          <h2 className="lux-q">What is <em>luxury?</em></h2>
          <p className="lux-lead">Luxury is not what a home <em>displays</em>.<br />It is the peace it returns to you &mdash;<br />the moment you <em>walk in</em>.</p>
          <div className="lux-wave" aria-hidden="true">
            <span></span>
            <svg viewBox="0 0 48 14" fill="none"><path d="M2 8 C 9 2, 15 2, 22 8 C 29 14, 35 14, 46 6" /></svg>
            <span></span>
          </div>
          <p className="lux-foot">And unlike all that glitters, it never <em>fades</em>.</p>
          <div className="lux-perch">
            <span className="lux-perch-line" aria-hidden="true"></span>
            <span className="lux-perch-label">Step inside</span>
          </div>
        </div>
      </section>

      <div className="page-roll">
      <div className="seam reveal" aria-hidden="true">
        <span className="seam-line"></span>
        <svg className="seam-wave" viewBox="0 0 48 14" fill="none"><path d="M2 8 C 9 2, 15 2, 22 8 C 29 14, 35 14, 46 6" /></svg>
        <span className="seam-line"></span>
      </div>

      <section className="sstory" data-sec data-n="01" data-l="The Outdoors" data-rail="The Outdoors" id="outdoors">
        <div className="sstory__stage">
          <div className="sstory__head reveal">
            <h2>The Outdoors</h2>
            <span className="sstory__sub">The <em>approach</em></span>
            <span className="label">open space, low density &amp; the lake</span>
            <span className="hl-line" aria-hidden="true"></span>
          </div>
          <div className="sstory__deck">
            <article className="scard">
              <div className="scard__media" style={media('garden_walk.webp', 'center 62%')}></div>
              <div className="scard__scrim" aria-hidden="true"></div>
              <span className="scard__num" aria-hidden="true">01</span>
              <div className="scard__body">
                <span className="scard__kick">Open ground</span>
                <h3 className="scard__title">Walk the long way <em>home</em></h3>
                <p className="scard__desc">248 homes on 2.8 acres &mdash; deliberately few, so more of the land stays gardens, lawns and shaded trails.</p>
              </div>
            </article>
            <article className="scard flip">
              <div className="scard__media" style={media('aerial-hero-wide.jpg', 'center 42%')}></div>
              <div className="scard__scrim" aria-hidden="true"></div>
              <span className="scard__num" aria-hidden="true">02</span>
              <div className="scard__body">
                <span className="scard__kick">From above</span>
                <h3 className="scard__title">Two towers, <em>by the lake</em></h3>
                <p className="scard__desc">Wrapped in low-rise homes and open green &mdash; with the lake holding one whole edge that can never be built over.</p>
              </div>
            </article>
            <article className="scard">
              <div className="scard__media" style={media('d_green.webp', 'center 50%')}></div>
              <div className="scard__scrim" aria-hidden="true"></div>
              <span className="scard__num" aria-hidden="true">03</span>
              <div className="scard__body">
                <span className="scard__kick">Green from every floor</span>
                <h3 className="scard__title">More sky, more <em>space</em></h3>
                <p className="scard__desc">Low density, by design &mdash; landscaped greens woven across the site, and more distance between you and everyone else.</p>
                <Link className="scard__cta" href="/location/">See the location <span className="ar">&rarr;</span></Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <div className="bridge reveal"><p>The lake you just walked doesn't stay in the gardens. <b>It comes indoors — and becomes the view from your sofa.</b></p></div>

      <section className="sstory alt" data-sec data-n="02" data-l="The Homes" data-rail="The Homes">
        <div className="sstory__stage">
          <div className="sstory__head reveal">
            <h2>The Homes</h2>
            <span className="sstory__sub">The <em>interiors</em></span>
            <span className="label">Inside the Homes &middot; 10.35-ft ceilings, glass &amp; foyers</span>
            <span className="hl-line" aria-hidden="true"></span>
          </div>
          <div className="sstory__deck">
            <article className="scard">
              <div className="scard__media" style={media('int_living.webp', 'center 56%')}></div>
              <div className="scard__scrim" aria-hidden="true"></div>
              <span className="scard__num" aria-hidden="true">01</span>
              <div className="scard__body">
                <span className="scard__kick">10.35-ft ceilings</span>
                <h3 className="scard__title">Rooms that <em>breathe</em></h3>
                <p className="scard__desc">Ceilings that rise above you the moment you walk in &mdash; light, air and a true sense of arrival in every home.</p>
              </div>
            </article>
            <article className="scard flip">
              <div className="scard__media" style={media('ext_facade_dusk.webp', 'center 42%')}></div>
              <div className="scard__scrim" aria-hidden="true"></div>
              <span className="scard__num" aria-hidden="true">02</span>
              <div className="scard__body">
                <span className="scard__kick">Glass walls</span>
                <h3 className="scard__title">The lake, <em>indoors</em></h3>
                <p className="scard__desc">Floor-to-ceiling glass turns open water into your living room &mdash; from the sofa to the private deck.</p>
              </div>
            </article>
            <article className="scard">
              <div className="scard__media" style={media('int_foyer.webp', 'center 50%')}></div>
              <div className="scard__scrim" aria-hidden="true"></div>
              <span className="scard__num" aria-hidden="true">03</span>
              <div className="scard__body">
                <span className="scard__kick">Privacy foyers</span>
                <h3 className="scard__title">Arrival without an <em>audience</em></h3>
                <p className="scard__desc">Step out of the lift into your own foyer &mdash; never a shared corridor, never a neighbour at the door.</p>
                <Link className="scard__cta" href="/residences/">Step inside the residences <span className="ar">&rarr;</span></Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <div className="bridge reveal"><p>Home is only where it begins — <b>the rest of Taranga is a lift ride up.</b></p></div>

      <section className="sstory" data-sec data-n="03" data-l="The Club" data-rail="The Club">
        <div className="sstory__stage">
          <div className="sstory__head reveal">
            <h2>The Club</h2>
            <span className="sstory__sub">The <em>heights</em></span>
            <span className="label">The Clubhouse &amp; Amenities &middot; 30,000 sft of leisure</span>
            <span className="hl-line" aria-hidden="true"></span>
          </div>
          <div className="sstory__deck">
            <article className="scard">
              <div className="scard__media" style={media('am_clubhouse.webp', 'center 46%')}></div>
              <div className="scard__scrim" aria-hidden="true"></div>
              <span className="scard__num" aria-hidden="true">01</span>
              <div className="scard__body">
                <span className="scard__kick">Club Taranga</span>
                <h3 className="scard__title">Thirty thousand square <em>feet</em></h3>
                <p className="scard__desc">Around 30,000 sft of room to gather, play and unwind &mdash; the social heart of the address, moments from your door.</p>
              </div>
            </article>
            <article className="scard flip">
              <div className="scard__media" style={media('am_pool2.webp', 'center 60%')}></div>
              <div className="scard__scrim" aria-hidden="true"></div>
              <span className="scard__num" aria-hidden="true">02</span>
              <div className="scard__body">
                <span className="scard__kick">Pool &amp; rooftop</span>
                <h3 className="scard__title">Water meets <em>sky</em></h3>
                <p className="scard__desc">An infinity pool and rooftop lounge, where the lake, the city glow and the evening air all sit at your level.</p>
              </div>
            </article>
            <article className="scard">
              <div className="scard__media" style={media('am_rooftop.webp', 'center 44%')}></div>
              <div className="scard__scrim" aria-hidden="true"></div>
              <span className="scard__num" aria-hidden="true">03</span>
              <div className="scard__body">
                <span className="scard__kick">Courts &amp; sky bridge</span>
                <h3 className="scard__title">Joined high <em>above</em></h3>
                <p className="scard__desc">Courts, quiet corners and a sky bridge linking the two towers &mdash; the long view, from the calmest place to stand.</p>
                <Link className="scard__cta" href="/amenities/">See the amenities <span className="ar">&rarr;</span></Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <div className="seam reveal" aria-hidden="true">
        <span className="seam-line"></span>
        <svg className="seam-wave" viewBox="0 0 48 14" fill="none"><path d="M2 8 C 9 2, 15 2, 22 8 C 29 14, 35 14, 46 6" /></svg>
        <span className="seam-line"></span>
      </div>

      <section className="figures reveal"><div className="wrap">
        <div className="fig-head"><div className="label">Taranga, in figures</div><h2>The shape of low density</h2></div>
        <div className="fig-grid">
          <div className="fig"><span className="fig-n">2</span><span className="fig-l">G+24 towers,<br />one sky bridge</span></div>
          <div className="fig"><span className="fig-n">248</span><span className="fig-l">lakefront homes,<br />3 &amp; 4 BHK</span></div>
          <div className="fig"><span className="fig-n">4&ndash;6</span><span className="fig-l">families<br />per floor</span></div>
          <div className="fig"><span className="fig-n">8<span className="fig-s">in 10</span></span><span className="fig-l">homes are<br />corner-facing</span></div>
          <div className="fig"><span className="fig-n">10.35<span className="fig-s">ft</span></span><span className="fig-l">ceilings, in<br />every home</span></div>
          <div className="fig"><span className="fig-n">30k</span><span className="fig-l">sft of club<br />&amp; leisure</span></div>
        </div>
        <p className="fig-foot">Two towers, joined high up by a sky bridge — and never more than six families to a floor.</p>
      </div></section>

      <section className="worth reveal" data-rail="The Value"><div className="wrap">
        <div className="worth-top">
          <div className="worth-head">
            <div className="kicker"><span className="kn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.8 4.8L19 9l-4.2 2.6L16 17l-4-3-4 3 1.2-5.4L5 9l5.2-1.2z" /></svg></span><div><div className="kt">Why Taranga</div><div className="ks">What the price actually buys</div></div></div>
            <p className="worth-lead">A home here isn't priced like the apartment next door &mdash; <em>because it isn't one.</em></p>
          </div>
          <div className="worth-copy">
            <p className="worth-body">The lake in front can never be built over. Only four to six families share your floor. Eight in ten homes are corners &mdash; light on two sides, and a foyer that opens to no one else. Ceilings rise to 10.35 feet; floor-to-ceiling glass hands you the water.</p>
            <blockquote className="worth-quote">
              <p><b>None of this can be added later, at any price.</b> Not square feet, but a position on this lake that simply cannot be built again.</p>
            </blockquote>
          </div>
        </div>
        <figure className="worth-film">
          <figcaption className="worth-film-cap">Walkthrough &mdash; a cinematic tour of the homes, the club and the lakefront.</figcaption>
          <div className="film-stage">
            <div className="ytfacade film-pane is-active" role="button" tabIndex={0} data-yt="dg4nnlX_Ubk" style={{ backgroundImage: 'url(https://i.ytimg.com/vi/dg4nnlX_Ubk/maxresdefault.jpg)' }} aria-label="Play the Taranga walkthrough film">
              <span className="yt-play" aria-hidden="true"><svg viewBox="0 0 68 48"><path className="yt-bg" d="M66.5 7.7a8 8 0 0 0-5.6-5.7C56 .6 34 .6 34 .6s-22 0-26.9 1.4A8 8 0 0 0 1.5 7.7 83 83 0 0 0 0 24a83 83 0 0 0 1.5 16.3 8 8 0 0 0 5.6 5.7C12 47.4 34 47.4 34 47.4s22 0 26.9-1.4a8 8 0 0 0 5.6-5.7A83 83 0 0 0 68 24a83 83 0 0 0-1.5-16.3z" /><path className="yt-tri" d="M45 24 27 14v20z" /></svg></span>
            </div>
          </div>
        </figure>
      </div></section>

      <section className="wrap ess reveal" data-rail="The Essentials" style={{ padding: 'clamp(3rem,6vw,4.5rem) 0' }}>
        <div className="kicker"><span className="kn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.8 4.8L19 9l-4.2 2.6L16 17l-4-3-4 3 1.2-5.4L5 9l5.2-1.2z" /></svg></span><div><div className="kt">The Essentials</div><div className="ks">The things you ask first — answered up front</div></div></div>
        <div className="essgrid">
          <div className="ess-i"><span className="el">Configurations</span><span className="ev">3 &amp; 4 BHK · 2480–3255 sft</span><span className="ed">80% corner homes, each with a privacy foyer</span></div>
          <div className="ess-i"><span className="el">Stage</span><span className="ev">Under construction</span><span className="ed">Construction-linked, staged payment plan</span></div>
          <div className="ess-i"><span className="el">Connectivity</span><span className="ev">Kukatpally Metro ~850 m</span><span className="ed">HITEC City ~8 km · KPHB &amp; NH-65 minutes away</span></div>
          <div className="ess-i"><span className="el">Assurance</span><span className="ev">Gated · 24/7 CCTV security</span><span className="ed">Vastu-considered · RERA-registered</span></div>
        </div>
        <div className="ess-cta"><a className="btn solid" href="#" onClick={(e) => { e.preventDefault(); openModal('price'); }}>Get price sheet &amp; payment plan <span className="ar">→</span></a><Link className="more" href="/location/">See full connectivity →</Link></div>
      </section>

      <section className="ctaband wrap" style={{ padding: 'clamp(2rem,5vw,4rem) 0' }}><div className="reveal"><div className="label">The full picture</div>
        <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(1.9rem,4vw,2.8rem)', lineHeight: 1.08, margin: '.3rem 0 .3rem', color: 'var(--ink)' }}>Brochure, plans &amp; pricing — in your inbox</h2>
        <p style={{ color: 'var(--ink-soft)', maxWidth: '44ch', margin: '0 auto' }}>Everything you need to decide, sent the moment you ask.</p>
        <div className="row"><a className="btn solid" href="#" onClick={(e) => { e.preventDefault(); openModal('brochure'); }}>Brochure</a><a className="btn" href="#" onClick={(e) => { e.preventDefault(); openModal('price'); }}>Get Price Sheet</a></div></div></section>

      <div className="seam reveal" aria-hidden="true">
        <span className="seam-line"></span>
        <svg className="seam-wave" viewBox="0 0 48 14" fill="none"><path d="M2 8 C 9 2, 15 2, 22 8 C 29 14, 35 14, 46 6" /></svg>
        <span className="seam-line"></span>
      </div>
      <section className="wrap" data-sec data-n="04" data-l="The Plan" data-rail="The Plan" style={{ paddingTop: 'clamp(3.5rem,8vw,6rem)', paddingBottom: 'clamp(2rem,4vw,3rem)' }}><div className="reveal"><div className="label">Master Plan</div>
        <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(2rem,4.4vw,3.2rem)', lineHeight: 1.05, margin: '.3rem 0 .2rem' }}>The whole of Taranga,<br />at a glance</h2>
        <div className="mplan2 mplan2--stack">
          <div className="mplan2-figure">
            <div className="mplan2-map" onClick={() => window.zoom && window.zoom('/assets/img/masterplan.jpg', 'Makuta Taranga — Master Plan')}>
              <img src="/assets/img/masterplan_plan.jpg" width="2460" height="1125" loading="lazy" decoding="async" alt="Makuta Taranga master plan — Residential Blocks A & B, clubhouse, courts, temple, jogging track" />
              {MP_LEGEND.map(([n]) => {
                const p = MP_PINS[n];
                if (!p) return null;
                return (
                  <span
                    key={n}
                    className={'mp-pin' + (mpHot === n ? ' on' : '')}
                    data-n={n}
                    style={{ left: p[0] + '%', top: p[1] + '%' }}
                    aria-hidden="true"
                    onMouseEnter={() => setMpHot(n)}
                    onMouseLeave={() => setMpHot((h) => (h === n ? null : h))}
                    onClick={(e) => { e.stopPropagation(); setMpHot(n); }}
                  ></span>
                );
              })}
            </div>
            <div className="mp-cap"><span>Hover a point or list item &middot; tap plan to enlarge</span><span>Artist&rsquo;s impression &middot; not to scale &middot; N&uarr;</span></div>
          </div>
          <div className="mplan2-side">
            <ol className="mplan2-legend">
              {MP_LEGEND.map(([n, label, primary]) => (
                <li
                  key={n}
                  data-n={n}
                  data-primary={primary ? '1' : undefined}
                  className={mpHot === n ? 'is-hot' : undefined}
                  onMouseEnter={() => setMpHot(n)}
                  onMouseLeave={() => setMpHot((h) => (h === n ? null : h))}
                  onClick={() => setMpHot(n)}
                >
                  <span className="ln">{n}</span>{label}
                </li>
              ))}
            </ol>
            <div className="mp-plans-cta">
              <Link className="btn solid" href="/residences/#floor-plans">See the unit plans <span>&rarr;</span></Link>
              <span className="mp-plans-note">See every 3 &amp; 4 BHK layout, floor by floor</span>
            </div>
          </div>
        </div>
        <div className="facts">
          <div className="f2"><div className="n">2.8</div><div className="t">Acres</div></div>
          <div className="f2"><div className="n">248</div><div className="t">Homes · G+24</div></div>
          <div className="f2"><div className="n">3 &amp; 4</div><div className="t">BHK · 2480–3255 sft</div></div>
          <div className="f2"><div className="n">36</div><div className="t">Amenities</div></div>
        </div>
        <p className="mdisc">Master plan, elevations and renders are artist’s impressions for representation only, not to scale, and may vary from the sanctioned plans and actual construction. Areas shown are indicative; carpet areas are as per the RERA-approved plans. This does not constitute a legal offer; all transactions are governed solely by the registered Agreement of Sale.</p>
      </div></section>

      {/* Construction-update film — the walkthrough now lives beside "Why Taranga" above.
          Section stays hidden until the construction video link is provided:
          set data-yt + backgroundImage to the real id, then remove `hidden` from the <section>. */}
      <section className="filmsec reveal" data-rail="Film" id="film"><div className="wrap">
        <div className="label">Taranga in motion</div>
        <h2 className="filmsec-h">Construction update</h2>
        <div className="film-stage">
          <div className="ytfacade film-pane is-active" role="button" tabIndex={0} data-film="cons" data-yt="jL7TM15GYkw" style={{ backgroundImage: 'url(https://i.ytimg.com/vi/jL7TM15GYkw/maxresdefault.jpg)' }} aria-label="Play the construction progress update">
            <span className="yt-play" aria-hidden="true"><svg viewBox="0 0 68 48"><path className="yt-bg" d="M66.5 7.7a8 8 0 0 0-5.6-5.7C56 .6 34 .6 34 .6s-22 0-26.9 1.4A8 8 0 0 0 1.5 7.7 83 83 0 0 0 0 24a83 83 0 0 0 1.5 16.3 8 8 0 0 0 5.6 5.7C12 47.4 34 47.4 34 47.4s22 0 26.9-1.4a8 8 0 0 0 5.6-5.7A83 83 0 0 0 68 24a83 83 0 0 0-1.5-16.3z" /><path className="yt-tri" d="M45 24 27 14v20z" /></svg></span>
          </div>
        </div>
        <p className="filmsec-cap" data-film="cons">Real progress on site &mdash; updated as the towers rise.</p>
      </div></section>

      <div className="seam reveal" aria-hidden="true">
        <span className="seam-line"></span>
        <svg className="seam-wave" viewBox="0 0 48 14" fill="none"><path d="M2 8 C 9 2, 15 2, 22 8 C 29 14, 35 14, 46 6" /></svg>
        <span className="seam-line"></span>
      </div>
      <section className="projects" data-rail="Portfolio"><div className="wrap reveal"><div className="port-band"><div className="port-text"><div className="kicker"><span className="kn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V8l9-5 9 5v13M3 21h18M9 21v-6h6v6" /></svg></span><div><div className="kt">Selected Projects</div><div className="ks">More from Makuta</div></div></div><h2 className="port-h2">A portfolio you can stand inside</h2><p className="port-p">A track record of homes built around light, space and the calm of good design &mdash; completed and ongoing developments by Makuta.</p><Link className="btn solid" href="/about/#projects">See the full portfolio <span>&rarr;</span></Link></div><Link className="port-teaser" href="/about/#projects" aria-label="See the full portfolio on the About page"><span className="pt-img" style={{ backgroundImage: 'url(/assets/img/makuta-taranga-entrance.jpg)' }}></span><span className="pt-cap">More from Makuta <span>&rarr;</span></span></Link></div></div></section>

      <section className="enq wrap" data-rail="Visit" style={{ padding: 'clamp(4.5rem,10vw,7rem) 0' }}><div className="reveal"><div className="label" style={{ marginBottom: '1.3rem' }}>Come see the view that can’t be built out</div><h2>A private visit, by the lake.</h2><p>Leave your details and our team will call you back to arrange a viewing — no obligation.</p>
        {!qDone ? (
          <div className="qform" id="qform">
            <input id="qn" placeholder="Your name" value={q.n} onChange={(e) => setQ((v) => ({ ...v, n: e.target.value }))} />
            <input id="qp" placeholder="Phone" value={q.p} onChange={(e) => setQ((v) => ({ ...v, p: e.target.value }))} />
            <select id="qc" value={q.c} onChange={(e) => setQ((v) => ({ ...v, c: e.target.value }))}><option value="">Interested in…</option><option>3 BHK</option><option>4 BHK</option></select>
            <a href="#" className="btn solid" onClick={(e) => { e.preventDefault(); quickSubmit(); }}>Book a site visit</a>
          </div>
        ) : (
          <div className="qform" id="qform"><div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', color: 'var(--line)', fontSize: '1.4rem' }}>Thank you, {qDone}. We’ll call you shortly to plan your visit.</div></div>
        )}
        {!qDone && <div className="formnote" id="qnote" style={{ color: qNote.color || undefined }}>{qNote.text}</div>}
        <div className="altcta">Prefer to read first? <a href="#" onClick={(e) => { e.preventDefault(); openModal('brochure'); }}>Send me the brochure</a> or <a href="#" onClick={(e) => { e.preventDefault(); openModal('price'); }}>the price sheet</a>.</div></div></section>
      </div>
      </div>
    </>
  );
}
