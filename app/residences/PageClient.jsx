'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { leadPayload, sendLead } from '@/lib/lead';
import pageCss from './page-styles';

const openModal = (m, ex) => window.openModal && window.openModal(m, ex);

export default function PageClient() {
  /* quick visit form */
  const [q, setQ] = useState({ n: '', p: '', c: '' });
  const [qDone, setQDone] = useState('');
  const [qNote, setQNote] = useState({
    text: 'We respect your privacy. No spam — just a call back to plan your visit.',
    color: '',
  });

  function quickSubmit() {
    const n = q.n.trim();
    const p = q.p.replace(/\D/g, '');
    if (!n || p.length < 10) {
      setQNote({ text: 'Please enter your name and a valid phone number.', color: '#b5562f' });
      return;
    }
    sendLead(leadPayload('Quick enquiry', n, p, '', { config: q.c }), function () {});
    setQDone(n.split(' ')[0]);
  }

  /* floor-plan explorer (ported verbatim into the effect) */
  useEffect(() => {
    const FP = {
      '3': [
        { t: 'Type 1', code: 'A-03', name: '3 BHK · Type 1', tower: 'Block A', facing: 'On request', area: '2480 sft', plan: true, img: '/assets/img/floorplan_a03.webp' },
        { t: 'Type 2', code: 'A-04', name: '3 BHK · Type 2', tower: 'Block A', facing: 'On request', area: '2480 sft', plan: true, img: '/assets/img/floorplan_a04.webp' },
      ],
      '4': [
        { t: 'Type 1', code: 'A-01', name: '4 BHK · Type 1', tower: 'Block A', facing: 'On request', area: '2990 sft', plan: true, img: '/assets/img/floorplan_a01.webp' },
        { t: 'Type 2', code: 'A-02', name: '4 BHK · Type 2', tower: 'Block A', facing: 'On request', area: '2990 sft', plan: true, img: '/assets/img/floorplan_a02.webp' },
        { t: 'Type 3', code: 'A-05', name: '4 BHK · Type 3', tower: 'Block A', facing: 'On request', area: '2990 sft', plan: true, img: '/assets/img/floorplan_a05.webp' },
        { t: 'Type 4', code: 'A-06', name: '4 BHK · Type 4', tower: 'Block A', facing: 'On request', area: '2990 sft', plan: true, img: '/assets/img/floorplan_a06.webp' },
        { t: 'Type 5', code: 'B-01', name: '4 BHK · Type 5', tower: 'Block B', facing: 'On request', area: '3255 sft', plan: true, img: '/assets/img/floorplan_b01.webp' },
        { t: 'Type 6', code: 'B-02', name: '4 BHK · Type 6', tower: 'Block B', facing: 'On request', area: '3255 sft', plan: true, img: '/assets/img/floorplan_b02.webp' },
        { t: 'Type 7', code: 'B-03', name: '4 BHK · Type 7', tower: 'Block B', facing: 'On request', area: '3255 sft', plan: true, img: '/assets/img/floorplan_b03.webp' },
        { t: 'Type 8', code: 'B-04', name: '4 BHK · Type 8', tower: 'Block B', facing: 'On request', area: '3255 sft', plan: true, img: '/assets/img/floorplan_b04.webp' },
      ],
    };
    let fpC = '3';
    let fpIdx = 0;

    function fpConfig(c) {
      fpC = c;
      document.querySelectorAll('.fp .seg button').forEach(function (b) {
        b.classList.toggle('on', b.getAttribute('data-c') === c);
      });
      fpChips();
      fpUnit(0);
    }
    function fpChips() {
      const w = document.getElementById('fpchips');
      if (!w) return;
      w.innerHTML = FP[fpC]
        .map(function (u, i) {
          return '<button class="uchip' + (i === 0 ? ' on' : '') + '" data-i="' + i + '">' + u.t + '</button>';
        })
        .join('');
      w.querySelectorAll('.uchip').forEach(function (b) {
        b.addEventListener('click', function () {
          fpUnit(parseInt(b.getAttribute('data-i'), 10));
        });
      });
    }
    function dlPlan() {
      const u = FP[fpC][fpIdx];
      const img = document.getElementById('fpimg');
      if (!img) return;
      const fn =
        ('Makuta Taranga ' + u.code + ' ' + u.name + ' ' + u.area)
          .replace(/[^0-9A-Za-z]+/g, '-')
          .replace(/^-|-$/g, '') + '.webp';
      const a = document.createElement('a');
      a.href = img.getAttribute('src');
      a.download = fn;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
    function planPrice(m) {
      const u = FP[fpC][fpIdx];
      openModal(m, { unit: u.code + ' · ' + u.name + ' · ' + u.area });
    }
    function fpUnit(i) {
      fpIdx = i;
      const u = FP[fpC][i];
      document.querySelectorAll('#fpchips .uchip').forEach(function (b, j) {
        b.classList.toggle('on', j === i);
      });
      const set = function (id, v) {
        const e = document.getElementById(id);
        if (e) e.textContent = v;
      };
      set('fpcode', u.code);
      set('fpname', u.name);
      set('fptower', u.tower);
      set('fpface', u.facing);
      set('fparea', u.area);
      const img = document.getElementById('fpimg'),
        svg = document.getElementById('fpsvg'),
        pwm = document.getElementById('fppwm');
      if (img && svg) {
        if (u.plan) {
          if (u.img) img.src = u.img;
          img.style.display = 'block';
          svg.style.display = 'none';
          if (pwm) pwm.textContent = 'Artist’s impression · not to scale · tap to enlarge';
        } else {
          img.style.display = 'none';
          svg.style.display = 'block';
          if (pwm) pwm.textContent = 'Indicative layout · detailed plan on request';
        }
      }
    }

    /* wire segment (BHK toggle) buttons */
    const segHandlers = [];
    document.querySelectorAll('.fp .seg button').forEach(function (b) {
      const h = function () {
        fpConfig(b.getAttribute('data-c'));
      };
      b.addEventListener('click', h);
      segHandlers.push([b, h]);
    });

    /* wire CTA row */
    const dl = document.getElementById('fpdl');
    const pp = document.getElementById('fppp');
    const dlH = function (e) {
      e.preventDefault();
      dlPlan();
    };
    const ppH = function (e) {
      e.preventDefault();
      planPrice('price');
    };
    if (dl) dl.addEventListener('click', dlH);
    if (pp) pp.addEventListener('click', ppH);

    /* zoom on plan image */
    const fpimg = document.getElementById('fpimg');
    const zoomH = function () {
      const nm = document.getElementById('fpname');
      window.zoom && window.zoom(fpimg.getAttribute('src'), nm ? nm.textContent : '');
    };
    if (fpimg) fpimg.addEventListener('click', zoomH);

    /* init exactly like the original */
    if (document.getElementById('fpchips')) fpConfig('3');

    return () => {
      segHandlers.forEach(([b, h]) => b.removeEventListener('click', h));
      if (dl) dl.removeEventListener('click', dlH);
      if (pp) pp.removeEventListener('click', ppH);
      if (fpimg) fpimg.removeEventListener('click', zoomH);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />

      <section className="phead">
        <div className="wrap">
          <div className="grid">
            <div>
              <div className="crumb">
                <Link href="/">Home</Link> / Residences
              </div>
              <h1>
                Two ways to live
                <br />
                by the lake
              </h1>
              <p>
                Three and four BHK homes built around light, air and privacy — with the one view in
                the neighbourhood that can’t be built out.
              </p>
              <div className="hairline" style={{ marginTop: '1.6rem' }}></div>
            </div>
            <div className="ph-img">
              <div className="ph" style={{ backgroundImage: 'url(/assets/img/int_foyer.webp)' }}></div>
            </div>
          </div>
        </div>
      </section>

      <section id="floor-plans" className="wrap" style={{ padding: 'clamp(2rem,5vw,3rem) 0 clamp(4rem,8vw,6rem)', scrollMarginTop: '90px' }}>
        <div className="reveal">
          <div className="kicker">
            <span className="kn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="1" />
                <path d="M3 10h9M12 3v18M12 14h9M3 16h5" />
              </svg>
            </span>
            <div>
              <div className="kt">Floor Plans</div>
              <div className="ks">Pick a configuration to see its layout</div>
            </div>
          </div>
          <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(2rem,4.4vw,3.2rem)', margin: '.3rem 0 .2rem' }}>
            Ten layouts. Two towers. One sky bridge.
          </h2>
          <p className="whisper">A plan is not a list of rooms. It is a measure of how far the world is kept from you.</p>
          <div className="rip-line">
            <svg viewBox="0 0 90 16">
              <path d="M2,9 C18,2 30,15 46,8 S74,2 88,8" />
            </svg>
          </div>
        </div>

        <div className="fp reveal">
          <div className="towernote">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 16h20M4 16v-3a8 8 0 0 1 16 0v3M8 16v-4M16 16v-4M12 16v-5" />
            </svg>
            Two G+24 towers, joined high up by a connecting sky bridge — choose a configuration, then a
            layout.
          </div>
          <div className="seg">
            <button className="on" data-c="3">
              3 BHK · 2 layouts
            </button>
            <button data-c="4">4 BHK · 8 layouts</button>
          </div>
          <div className="chips" id="fpchips"></div>
          <div className="view">
            <div className="plan" id="fpplan">
              <span className="pcode" id="fpcode">
                3A
              </span>
              <img
                id="fpimg"
                src="/assets/img/floorplan_a03.webp"
                alt="Floor plan"
                style={{ display: 'none', width: '100%', height: '100%', objectFit: 'contain', cursor: 'zoom-in' }}
              />
              <span id="fpsvg">
                <svg viewBox="0 0 400 300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                  <rect x="18" y="18" width="364" height="264" rx="2" />
                  <line x1="200" y1="18" x2="200" y2="170" />
                  <line x1="18" y1="170" x2="200" y2="170" />
                  <line x1="200" y1="120" x2="382" y2="120" />
                  <line x1="292" y1="120" x2="292" y2="282" />
                  <line x1="18" y1="220" x2="120" y2="220" />
                  <line x1="120" y1="170" x2="120" y2="282" />
                  <rect x="40" y="40" width="64" height="44" rx="1" />
                  <rect x="40" y="195" width="50" height="20" />
                  <path d="M200 90 a30 30 0 0 1-30 30" strokeWidth="1.3" />
                  <path d="M120 220 a26 26 0 0 0 26-26" strokeWidth="1.3" />
                  <circle cx="330" cy="200" r="22" strokeWidth="1.3" />
                </svg>
              </span>
              <span className="pwm" id="fppwm">
                Indicative layout · detailed plan on request
              </span>
            </div>
            <div className="det">
              <div className="label">Configuration</div>
              <h3 id="fpname">3 BHK · Type 1</h3>
              <dl>
                <dt>Tower</dt>
                <dd id="fptower">Block A</dd>
                <dt>Facing</dt>
                <dd id="fpface">On request</dd>
                <dt>Built-up area</dt>
                <dd id="fparea">2480 sft</dd>
                <dt>Ceiling height</dt>
                <dd>10.35 ft</dd>
              </dl>
              <div className="ctarow">
                <a className="btn sm solid" href="#" id="fpdl">
                  Save this plan
                </a>
                <a className="btn sm" href="#" id="fppp">
                  Get price sheet
                </a>
              </div>
            </div>
          </div>
        </div>

        <p className="indic">
          Layouts shown are indicative. Exact carpet/built-up areas, tower allocation and pricing are
          shared on enquiry — all areas as per RERA-approved plans.
        </p>

        <div className="reveal" style={{ marginTop: '3.5rem' }}>
          <div className="kicker">
            <span className="kn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 11l8-7 8 7M6 9.5V20h12V9.5M9.5 14l2 2 4-4" />
              </svg>
            </span>
            <div>
              <div className="kt">Every Home</div>
              <div className="ks">What comes as standard in every residence</div>
            </div>
          </div>
          <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(2rem,4vw,3rem)', marginTop: '.4rem' }}>
            Designed around how you live
          </h2>
          <p className="whisper">Arrival without an audience.</p>
          <div className="flist">
            <div className="f">
              <h4>A foyer of your own</h4>
              <p>Step out of the lift into your privacy foyer — not a shared corridor.</p>
            </div>
            <div className="f">
              <h4>Light on two sides</h4>
              <p>Corner homes mean more daylight, more air, fewer shared walls.</p>
            </div>
            <div className="f">
              <h4>Room to breathe</h4>
              <p>10.35-ft ceilings you feel the moment you walk in.</p>
            </div>
            <div className="f">
              <h4>The lake, framed</h4>
              <p>Floor-to-ceiling glass turns your living room into a view.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="wavediv">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path d="M0,20 C150,38 300,4 450,20 S750,38 900,20 1050,4 1200,20" />
        </svg>
      </div>

      <section className="enq wrap" data-rail="Visit" style={{ padding: 'clamp(4.5rem,10vw,7rem) 0' }}>
        <div className="reveal">
          <div className="label" style={{ marginBottom: '1.3rem' }}>
            Come see the view that can’t be built out
          </div>
          <h2>Find the home that fits your family.</h2>
          <p>
            Tell us whether it’s a 3 or 4 BHK you’re picturing, and we’ll walk you through plans and
            pricing.
          </p>
          {!qDone ? (
            <div className="qform" id="qform">
              <input id="qn" placeholder="Your name" value={q.n} onChange={(e) => setQ((v) => ({ ...v, n: e.target.value }))} />
              <input id="qp" placeholder="Phone" value={q.p} onChange={(e) => setQ((v) => ({ ...v, p: e.target.value }))} />
              <select id="qc" value={q.c} onChange={(e) => setQ((v) => ({ ...v, c: e.target.value }))}>
                <option value="">Interested in…</option>
                <option>3 BHK</option>
                <option>4 BHK</option>
              </select>
              <a href="#" className="btn solid" onClick={(e) => { e.preventDefault(); quickSubmit(); }}>
                Come see it
              </a>
            </div>
          ) : (
            <div className="qform" id="qform">
              <div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', color: 'var(--line)', fontSize: '1.4rem' }}>
                Thank you, {qDone}. We’ll call you shortly to plan your visit.
              </div>
            </div>
          )}
          {!qDone && (
            <div className="formnote" id="qnote" style={{ color: qNote.color || undefined }}>
              {qNote.text}
            </div>
          )}
          <div className="altcta">
            Prefer to read first?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); openModal('brochure'); }}>
              Send me the brochure
            </a>{' '}
            or{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); openModal('price'); }}>
              the price sheet
            </a>
            .
          </div>
        </div>
      </section>
    </>
  );
}
