'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Cross-page scroll behaviors that scan the DOM: reveal-on-scroll + the
// lakefront "waterline" depth indicator. Re-initialised on every route change.
export default function SharedEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups = [];

    // run after the new route's DOM is committed
    const raf = requestAnimationFrame(() => {
      /* ---- reveal-on-scroll ---- */
      const io = new IntersectionObserver(
        (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
        { threshold: 0.18 }
      );
      document.querySelectorAll('.reveal,.chapter,.phead').forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());

      /* ---- waterline depth indicator ---- */
      const stops = [].slice.call(document.querySelectorAll('[data-rail]'));
      if (stops.length >= 3) {
        const wl = document.createElement('div');
        wl.className = 'wl';
        wl.setAttribute('aria-hidden', 'true');
        const tube = document.createElement('div'); tube.className = 'wl-tube';
        const water = document.createElement('div'); water.className = 'wl-water';
        const surf = document.createElement('div'); surf.className = 'wl-surface';
        water.appendChild(surf); tube.appendChild(water); wl.appendChild(tube);
        const now = document.createElement('div'); now.className = 'wl-now'; wl.appendChild(now);
        const n = stops.length;
        const mks = stops.map((sec, idx) => {
          const m = document.createElement('button');
          m.className = 'wl-mk';
          m.style.top = (n > 1 ? (idx / (n - 1)) * 100 : 0) + '%';
          m.innerHTML = '<span class="nm">' + sec.getAttribute('data-rail') + '</span><span class="tick"></span>';
          m.addEventListener('click', () => sec.scrollIntoView({ behavior: 'smooth', block: 'start' }));
          wl.appendChild(m);
          return m;
        });
        document.body.appendChild(wl);
        const top = (el) => el.getBoundingClientRect().top + window.scrollY;
        const upd = () => {
          const y = window.scrollY, vh = window.innerHeight, mid = y + vh * 0.42;
          const hero = document.querySelector('.hero');
          const hb = hero ? hero.offsetHeight : vh;
          let act = -1;
          for (let i = 0; i < n; i++) { if (top(stops[i]) - 90 <= mid) act = i; }
          // Don't reveal the rail (or a stale first-stop label like "The Outdoors")
          // until the reader has actually reached the first chapter — the intro /
          // "What is luxury?" section sits above every data-rail stop.
          wl.classList.toggle('show', act >= 0 && y > hb * 0.6);
          if (act < 0) { water.style.height = '0%'; mks.forEach((m) => m.classList.remove('on')); return; }
          let frac = 0;
          if (act < n - 1) { const a = top(stops[act]), b = top(stops[act + 1]); if (b > a) frac = Math.max(0, Math.min(1, (mid - a) / (b - a))); }
          const ratio = n > 1 ? (act + frac) / (n - 1) : 1;
          water.style.height = ratio * 100 + '%';
          mks.forEach((m, i) => m.classList.toggle('on', i === act));
          const nm = stops[act].getAttribute('data-rail');
          if (now.textContent !== nm) { now.style.opacity = '0'; setTimeout(() => { now.textContent = nm; now.style.opacity = '0.9'; }, 180); }
          else { now.style.opacity = '0.9'; }
        };
        window.addEventListener('scroll', upd, { passive: true });
        window.addEventListener('resize', upd);
        upd();
        cleanups.push(() => {
          window.removeEventListener('scroll', upd);
          window.removeEventListener('resize', upd);
          wl.remove();
        });
      }
    });

    return () => { cancelAnimationFrame(raf); cleanups.forEach((c) => c()); };
  }, [pathname]);

  return null;
}
