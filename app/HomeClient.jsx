'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { leadPayload, sendLead, trackLead } from '@/lib/lead';

const media = (file, pos) => ({ backgroundImage: `url(/assets/img/${file})`, backgroundPosition: pos });
const openModal = (m) => window.openModal && window.openModal(m);

const MP_PINS = [
  [1, 9.8, 32], [3, 16.3, 24], [4, 33.3, 34], [5, 19.6, 46], [6, 33.3, 53], [7, 64.7, 51],
  [8, 50.3, 51], [9, 51.6, 32], [10, 52.9, 77], [11, 39.9, 24], [12, 88.2, 49], [13, 88.2, 70],
  [14, 41.2, 82], [15, 7.2, 63], [16, 7.8, 42], [17, 85.6, 34], [18, 60.8, 25],
];
// Third element flags the ~8 headline points kept in the mobile legend
// (the rest stay as interactive pins on the plan, but are hidden from the
// small-screen list to cut it from 17 rows to the ones buyers care about).
const MP_LEGEND = [
  [1, 'Main Entrance Gate', 1], [3, 'Drop-off Zone'], [4, 'Basement Entry Ramp'], [5, 'Basement Exit Ramp'],
  [6, 'Residential Block A', 1], [7, 'Residential Block B', 1], [8, 'Central Landscape Court', 1], [9, 'Internal Walkways'],
  [10, 'Jogging Track', 1], [11, 'Kids Play Area'], [12, 'Tennis Court', 1], [13, 'Basketball Court'],
  [14, 'Cricket Practice Net'], [15, 'Clubhouse · 30,000 sft', 1], [16, 'Pavilion Seating Area'], [17, 'Temple', 1],
  [18, 'Ventilation Duct'],
];

function mpHi(n, o) {
  document.querySelectorAll('.mplan2 [data-n="' + n + '"]').forEach((s) => s.classList.toggle('on', o));
}
function mpSet(n) {
  document.querySelectorAll('.mplan2 .on').forEach((a) => a.classList.remove('on'));
  mpHi(n, true);
}

export default function HomeClient() {
  /* hero video: poster is the eager LCP; the video only mounts on capable,
     non-data-saving desktop sessions so mobile/metered users never download it. */
  const [showVideo, setShowVideo] = useState(false);
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
  const HERO = {
    mobile: { mp4: '/assets/video/hero-mobile.mp4', poster: '/assets/img/hero-mobile-poster.jpg' },
    tablet: { mp4: '/assets/video/hero-square.mp4', poster: '/assets/img/hero-square-poster.jpg' },
    desktop: { mp4: '/assets/video/hero-desktop.mp4', poster: '/assets/img/hero-desktop-poster.jpg' },
  };

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
            className="hero-video"
            autoPlay
            muted
            playsInline
            loop
            preload="none"
            poster={HERO[tier].poster}
          >
            <source src={HERO[tier].mp4} type="video/mp4" />
          </video>
        )}
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-crown reveal-anim" style={{ animationDelay: '0.3s' }}>Makuta &middot; Crown of Excellence</div>
          <div className="hero-loc reveal-anim" style={{ animationDelay: '0.6s' }}>IDL Lakefront &middot; Moosapet&ndash;Kukatpally, Hyderabad</div>
          <h1 className="hero-title reveal-anim" style={{ animationDelay: '0.9s' }}>Taranga<span className="sr-only"> — Lakefront 3 &amp; 4 BHK Luxury Residences at IDL Lake, Moosapet&ndash;Kukatpally, Hyderabad</span></h1>
          <p className="hero-tag reveal-anim" style={{ animationDelay: '1.2s' }}>The Finest Form of Luxury</p>
          <div className="hero-ctas reveal-anim" style={{ animationDelay: '1.5s' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); openModal('brochure'); }} className="hero-btn hero-btn-primary">Download Brochure</a>
            <a href="#" onClick={(e) => { e.preventDefault(); openModal('price'); }} className="hero-btn hero-btn-secondary">Price Sheet</a>
            <a href="#" onClick={(e) => { e.preventDefault(); openModal('visit'); }} className="hero-btn hero-btn-cta">Book a Visit</a>
          </div>
          <p className="hero-trust reveal-anim" style={{ animationDelay: '1.8s' }}>TS RERA <a href="https://ts-rera.telangana.gov.in/PublicSearch" target="_blank" rel="noopener">P02200011012</a></p>
        </div>
        <a href="#outdoors" className="hero-scroll reveal-anim" style={{ animationDelay: '2.1s' }}>
          <span className="hero-scroll-text">Scroll to see why 8 in 10 homes are corners</span>
          <span className="hero-scroll-arrow">&darr;</span>
        </a>
      </section>

      <section className="orient"><div className="wrap"><div className="orow">
        <div className="oi"><span className="ol">The Project</span><span className="ov">Lakefront 3 &amp; 4 BHK Residences</span></div>
        <div className="oi"><span className="ol">Where</span><span className="ov">IDL Lake · Kukatpally, Hyderabad</span></div>
        <div className="oi"><span className="ol">The Build</span><span className="ov">G+24 Twin Towers · 2.8 Acres · 248 Homes</span></div>
        <div className="oi"><span className="ol">By</span><span className="ov">Makuta Developers</span></div>
      </div><div className="orera"><span>TS RERA P02200011012</span></div></div></section>

      <section className="sstory" data-sec data-n="01" data-l="The Outdoors" data-rail="The Outdoors" id="outdoors">
        <div className="sstory__stage">
          <div className="sstory__head">
            <h2>The Outdoors</h2>
            <span className="sstory__sub">More open <em>ground</em></span>
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
                <Link className="scard__cta" href="/location/">Explore the location <span className="ar">&rarr;</span></Link>
              </div>
            </article>
          </div>
        </div>
      </section>

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

      <div className="bridge reveal"><p>The lake you just walked doesn't stay in the gardens. <b>It comes indoors — and becomes the view from your sofa.</b></p></div>

      <section className="sstory alt" data-sec data-n="02" data-l="The Homes" data-rail="The Homes">
        <div className="sstory__stage">
          <div className="sstory__head">
            <h2>The Homes</h2>
            <span className="sstory__sub">Light all <em>around</em></span>
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
                <Link className="scard__cta" href="/residences/">Explore residences <span className="ar">&rarr;</span></Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <div className="bridge reveal"><p>And when four walls aren't enough, <b>the rest of Taranga is a lift ride up.</b></p></div>

      <section className="sstory" data-sec data-n="03" data-l="The Club" data-rail="The Club">
        <div className="sstory__stage">
          <div className="sstory__head">
            <h2>The Club</h2>
            <span className="sstory__sub">Where calm <em>is found</em></span>
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
              <div className="scard__media" style={media('am_pool.webp', 'center 55%')}></div>
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
                <Link className="scard__cta" href="/amenities/">Explore all amenities <span className="ar">&rarr;</span></Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="worth reveal" data-rail="The Value"><div className="wrap"><div className="worth-in">
        <div className="kicker"><span className="kn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.8 4.8L19 9l-4.2 2.6L16 17l-4-3-4 3 1.2-5.4L5 9l5.2-1.2z" /></svg></span><div><div className="kt">Why Taranga</div><div className="ks">What the price actually buys</div></div></div>
        <p className="worth-lead">A home here isn't priced like the apartment next door — because it isn't one.</p>
        <p className="worth-body">The lake in front can never be built over. Only four to six families share your floor. Eight in ten homes are corners — light on two sides, and a foyer that opens to no one else. Ceilings rise to 10.35 feet; floor-to-ceiling glass hands you the water. <b>None of this can be added later, at any price.</b> That is what your home secures here — not square feet, but a position on this lake that simply cannot be built again.</p>
      </div></div></section>

      <section className="wrap ess reveal" data-rail="The Essentials" style={{ padding: 'clamp(3rem,6vw,4.5rem) 0' }}>
        <div className="kicker"><span className="kn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.8 4.8L19 9l-4.2 2.6L16 17l-4-3-4 3 1.2-5.4L5 9l5.2-1.2z" /></svg></span><div><div className="kt">The Essentials</div><div className="ks">The things buyers ask first — answered up front</div></div></div>
        <div className="essgrid">
          <div className="ess-i"><span className="el">Configurations</span><span className="ev">3 &amp; 4 BHK · 2480–3255 sft</span><span className="ed">80% corner homes, each with a privacy foyer</span></div>
          <div className="ess-i"><span className="el">Stage</span><span className="ev">Under construction</span><span className="ed">Construction-linked, staged payment plan</span></div>
          <div className="ess-i"><span className="el">Connectivity</span><span className="ev">Kukatpally Metro ~850 m</span><span className="ed">HITEC City ~8 km · KPHB &amp; NH-65 minutes away</span></div>
          <div className="ess-i"><span className="el">Assurance</span><span className="ev">Gated · 24/7 CCTV security</span><span className="ed">Vastu-considered · RERA-registered</span></div>
        </div>
        <div className="ess-cta"><a className="btn solid" href="#" onClick={(e) => { e.preventDefault(); openModal('price'); }}>Get price sheet &amp; payment plan <span className="ar">→</span></a><Link className="more" href="/location/">See full connectivity →</Link></div>
      </section>

      <section className="assure" data-rail="The Fundamentals"><div className="wrap"><div className="assure-in reveal">
        <div className="kicker" style={{ justifyContent: 'center' }}><span className="kn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg></span><div style={{ textAlign: 'left' }}><div className="kt">The fundamentals</div><div className="ks">Registered, financeable, built to last</div></div></div>
        <div className="agrid">
          <div className="ai"><span className="aic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11l8-7 8 7M6 9.5V20h12V9.5M9.5 14l2 2 4-4" /></svg></span><b>RERA-registered</b><p>TS RERA P02200011012. Every area is as per the approved plans.</p></div>
          <div className="ai"><span className="aic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01" /></svg></span><b>Construction-linked payments</b><p>You pay in step with progress on site — not in a single demand up front.</p></div>
          <div className="ai"><span className="aic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M9.2 8h5.6M9.2 11h5.6M13.6 8c.4 2.6-1.4 3.6-3.4 3.6h-1l4 4.4" /></svg></span><b>Bank-approved</b><p>Home loans available from leading banks and housing-finance companies.</p></div>
          <div className="ai"><span className="aic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="1" /><path d="M3 10h9M12 3v18M12 14h9M3 16h5" /></svg></span><b>RCC shear-wall structure</b><p>Engineered for wind and seismic loads.</p></div>
        </div>
      </div></div></section>

      <section className="ctaband wrap" style={{ padding: 'clamp(2rem,5vw,4rem) 0' }}><div className="reveal"><div className="label">The full picture</div>
        <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(1.9rem,4vw,2.8rem)', margin: '.3rem 0 .3rem', color: 'var(--ink)' }}>Brochure, plans &amp; pricing — in your inbox</h2>
        <p style={{ color: 'var(--ink-soft)', maxWidth: '44ch', margin: '0 auto' }}>Everything you need to decide, sent the moment you ask.</p>
        <div className="row"><a className="btn solid" href="#" onClick={(e) => { e.preventDefault(); openModal('brochure'); }}>Download Brochure</a><a className="btn" href="#" onClick={(e) => { e.preventDefault(); openModal('price'); }}>Get Price Sheet</a></div></div></section>

      <div className="wavediv"><svg viewBox="0 0 1200 40" preserveAspectRatio="none"><path d="M0,20 C150,38 300,4 450,20 S750,38 900,20 1050,4 1200,20" /></svg></div>
      <section className="wrap" data-sec data-n="04" data-l="The Plan" data-rail="The Plan" style={{ padding: 'clamp(3.5rem,8vw,6rem) 0' }}><div className="reveal"><div className="label">Master Plan</div>
        <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(2rem,4.4vw,3.2rem)', margin: '.3rem 0 .2rem' }}>The whole of Taranga,<br />at a glance</h2>
        <div className="mplan2">
          <div className="mplan2-map" onClick={() => window.zoom && window.zoom('/assets/img/masterplan.jpg', 'Makuta Taranga — Master Plan')}>
            <img src="/assets/img/masterplan_plan.jpg" width="1224" height="858" loading="lazy" decoding="async" alt="Makuta Taranga master plan — Residential Blocks A & B, clubhouse, courts, temple, jogging track" />
            {MP_PINS.map(([n, left, top]) => (
              <span key={n} className="mp-pin" data-n={n} style={{ left: left + '%', top: top + '%' }}
                onMouseEnter={() => mpHi(n, true)} onMouseLeave={() => mpHi(n, false)}
                onClick={(e) => { e.stopPropagation(); mpSet(n); }} />
            ))}
          </div>
          <ol className="mplan2-legend">
            {MP_LEGEND.map(([n, label, primary]) => (
              <li key={n} data-n={n} data-primary={primary ? '1' : undefined} onMouseEnter={() => mpHi(n, true)} onMouseLeave={() => mpHi(n, false)} onClick={() => mpSet(n)}>
                <span className="ln">{n}</span>{label}
              </li>
            ))}
          </ol>
        </div>
        <div className="mp-cap"><span>Hover a point or list item &middot; tap plan to enlarge</span><span>Artist&rsquo;s impression &middot; not to scale &middot; N&uarr;</span></div>
        <div className="facts">
          <div className="f2"><div className="n">2.8</div><div className="t">Acres</div></div>
          <div className="f2"><div className="n">248</div><div className="t">Homes · G+24</div></div>
          <div className="f2"><div className="n">3 &amp; 4</div><div className="t">BHK · 2480–3255 sft</div></div>
          <div className="f2"><div className="n">36</div><div className="t">Amenities</div></div>
        </div>
        <p className="mdisc">Master plan, elevations and renders are artist’s impressions for representation only, not to scale, and may vary from the sanctioned plans and actual construction. Areas shown are indicative; carpet areas are as per the RERA-approved plans. This does not constitute a legal offer; all transactions are governed solely by the registered Agreement of Sale.</p>
      </div></section>

      <div className="wavediv"><svg viewBox="0 0 1200 40" preserveAspectRatio="none"><path d="M0,20 C150,38 300,4 450,20 S750,38 900,20 1050,4 1200,20" /></svg></div>
      <section className="projects" data-rail="Portfolio"><div className="wrap reveal"><div className="port-band"><div className="port-text"><div className="kicker"><span className="kn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V8l9-5 9 5v13M3 21h18M9 21v-6h6v6" /></svg></span><div><div className="kt">Selected Projects</div><div className="ks">More from Makuta Developers</div></div></div><h2 className="port-h2">A portfolio you can stand inside</h2><p className="port-p">A track record of homes built around light, space and the calm of good design &mdash; completed and ongoing developments by Makuta Developers.</p><Link className="btn solid" href="/about/#projects">See the full portfolio <span>&rarr;</span></Link></div><Link className="port-teaser" href="/about/#projects" aria-label="See the full portfolio on the About page"><span className="pt-img" style={{ backgroundImage: 'url(/assets/img/aerial.webp)' }}></span><span className="pt-cap">More from Makuta Developers <span>&rarr;</span></span></Link></div></div></section>

      <section className="enq wrap" data-rail="Visit" style={{ padding: 'clamp(4.5rem,10vw,7rem) 0' }}><div className="reveal"><div className="label" style={{ marginBottom: '1.3rem' }}>Come see the view that can’t be built out</div><h2>A private visit, by the lake.</h2><p>Leave your details and our team will call you back to arrange a viewing — no obligation.</p>
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
        <div className="altcta">Prefer to read first? <a href="#" onClick={(e) => { e.preventDefault(); openModal('brochure'); }}>Download the brochure</a> or <a href="#" onClick={(e) => { e.preventDefault(); openModal('price'); }}>get the price sheet</a>.</div></div></section>
    </>
  );
}
