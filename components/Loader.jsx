'use client';
import { useEffect, useState } from 'react';

export default function Loader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setDone(true), 700);
    const t2 = setTimeout(() => setDone(true), 1500); // hard fallback
    const onLoad = () => setTimeout(() => setDone(true), 300);
    if (document.readyState === 'complete') setDone(true);
    else window.addEventListener('load', onLoad);
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener('load', onLoad); };
  }, []);
  return (
    <div className={'loader' + (done ? ' done' : '')} id="loader">
      <div className="lwrap">
        <div className="lmk">MAKUTA</div>
        <div className="ltg">Taranga</div>
        <svg className="lwave" viewBox="0 0 200 24" aria-hidden="true"><path d="M4,14 C40,2 80,24 112,12 S170,2 196,12" /></svg>
      </div>
    </div>
  );
}
