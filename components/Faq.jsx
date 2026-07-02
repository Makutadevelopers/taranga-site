'use client';
import { useEffect } from 'react';
import { FAQ_ITEMS } from '@/lib/faq';

export default function Faq() {
  /* accordion open/close (same behaviour as the old Contact FAQ) */
  useEffect(() => {
    const handlers = [];
    document.querySelectorAll('.faq .q button').forEach((b) => {
      const fn = () => {
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
    <div className="faq">
      {FAQ_ITEMS.map((item, i) => (
        <div className="q" key={i}>
          <button>{item.q}</button>
          <div className="a">
            <p>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
