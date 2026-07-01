'use client';
import { useEffect, useState } from 'react';

export default function Loader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    // Hold long enough for the wordmark + wave intro to play out (~1.7s),
    // then fade — never dismiss instantly, so it doesn't flash away on fast loads.
    const t = setTimeout(() => setDone(true), 1900);
    return () => clearTimeout(t);
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
