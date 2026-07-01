'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import pageCss from './page-styles';
import { leadPayload, sendLead, trackLead } from '@/lib/lead';

const openModal = (m) => window.openModal && window.openModal(m);

const COMPARE_CSS = `
@media(max-width:760px){
  #clubhouse-compare > div > div:nth-child(2){
    grid-template-columns:1fr !important;
    gap:2rem !important;
  }
  #clubhouse-compare > div > div:nth-child(2) > div:nth-child(2){display:none !important}
  #clubhouse-compare > div > div:nth-child(2) > div:first-child{text-align:left !important}
  #clubhouse-compare > div > div:nth-child(2) > div:first-child{padding-bottom:2rem;border-bottom:1px solid rgba(28,42,56,0.08)}
}`;

export default function PageClient() {
  /* quick visit form */
  const [q, setQ] = useState({ n: '', p: '', c: '' });
  const [qDone, setQDone] = useState(false);
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
    trackLead('quick');
    setQDone(n.split(' ')[0]);
  }

  /* day-of-day tabs */
  useEffect(() => {
    function day(k) {
      document.querySelectorAll('.daypanel').forEach(function (p) {
        p.classList.remove('on');
      });
      document.querySelectorAll('.daytab').forEach(function (t) {
        t.classList.remove('on');
      });
      const dp = document.getElementById('dp_' + k);
      const dt = document.getElementById('dt_' + k);
      if (dp) dp.classList.add('on');
      if (dt) dt.classList.add('on');
    }

    const handlers = [];
    document.querySelectorAll('.daytab').forEach(function (tab) {
      const k = tab.id.replace('dt_', '');
      const fn = function () {
        day(k);
      };
      tab.addEventListener('click', fn);
      handlers.push([tab, fn]);
    });

    /* initial active tab — original default is morning */
    day('morning');

    return function () {
      handlers.forEach(function (h) {
        h[0].removeEventListener('click', h[1]);
      });
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
                <Link href="/">Home</Link> / Amenities
              </div>
              <h1>
                Where the hours
                <br />
                quietly go
              </h1>
              <p>
                Thirty-six places to play, gather and slow down — across the gardens, the rooftops and a dedicated
                activity zone, for every age in the family.
              </p>
              <p className="whisper" style={{ textAlign: 'left', margin: '1.6rem 0 0', maxWidth: '38ch' }}>
                Everything here exists so you never have to leave for it. Convenience, in the end, is only another word for peace.
              </p>
              <div className="hairline" style={{ marginTop: '1.6rem' }}></div>
            </div>
            <div className="ph-img">
              <div className="ph" style={{ backgroundImage: 'url(/assets/img/am_pool2.webp)' }}></div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="clubhouse-compare"
        data-rail="The Clubhouse"
        style={{
          background: '#F9F7F4',
          padding: 'clamp(4rem,8vw,6rem) 0',
          borderTop: '1px solid rgba(28,42,56,0.06)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(1.2rem,4vw,2rem)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem,5vw,3.5rem)' }}>
            <div
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontSize: '0.72rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#8C8678',
                marginBottom: '1rem',
                fontWeight: 500,
              }}
            >
              The Clubhouse &middot; 30,000 sft
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontWeight: 300,
                fontSize: 'clamp(2.2rem,4.5vw,3.2rem)',
                lineHeight: 1.1,
                color: '#1C2A38',
                margin: '0 0 1rem 0',
                letterSpacing: '-0.01em',
              }}
            >
              Where calm <em style={{ fontStyle: 'italic', color: '#9A7438' }}>is found</em>
            </h2>
            <div style={{ width: '48px', height: '1px', background: '#C19A63', margin: '1rem auto 0' }}></div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1px 1fr',
              gap: 'clamp(2rem,4vw,3rem)',
              alignItems: 'start',
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontSize: '0.7rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#8C8678',
                  marginBottom: '1.2rem',
                }}
              >
                Standard apartments
              </div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontWeight: 300,
                  fontSize: 'clamp(1.3rem,2.2vw,1.7rem)',
                  lineHeight: 1.25,
                  color: '#46504E',
                  margin: '0 0 1rem 0',
                }}
              >
                A small pool. A basic gym. A clubhouse shared with hundreds.
              </h3>
              <p
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  color: '#8C8678',
                  margin: 0,
                }}
              >
                The amenity is the address — not the experience.
              </p>
            </div>

            <div
              style={{
                background: 'linear-gradient(180deg,transparent 0%,#C19A63 50%,transparent 100%)',
                width: '1px',
                height: '100%',
                minHeight: '200px',
              }}
            ></div>

            <div>
              <div
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontSize: '0.7rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#2C5F5D',
                  marginBottom: '1.2rem',
                  fontWeight: 600,
                }}
              >
                Makuta Taranga
              </div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontWeight: 300,
                  fontSize: 'clamp(1.3rem,2.2vw,1.7rem)',
                  lineHeight: 1.25,
                  color: '#1C2A38',
                  margin: '0 0 1rem 0',
                }}
              >
                30,000 square feet of leisure. An infinity pool. A sky bridge.
              </h3>
              <p
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  color: '#46504E',
                  margin: 0,
                }}
              >
                Rooftop infinity pool. Courts and quiet corners. A sky bridge linking the two towers — the long view,
                from the calmest place to stand.
              </p>
            </div>
          </div>

          <p
            style={{
              maxWidth: '640px',
              margin: 'clamp(3rem,5vw,4rem) auto 0',
              textAlign: 'center',
              fontFamily: "'Cormorant Garamond',serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.1rem,1.8vw,1.4rem)',
              lineHeight: 1.5,
              color: '#46504E',
            }}
          >
            None of this can be added later, at any price.
          </p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: COMPARE_CSS }} />
      </section>

      <section className="wrap" style={{ padding: 'clamp(2rem,5vw,3rem) 0 clamp(2rem,4vw,3rem)' }}>
        <div className="reveal">
          <div className="kicker">
            <span className="kn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3.6" />
                <path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" />
              </svg>
            </span>
            <div>
              <div className="kt">A Day at Taranga</div>
              <div className="ks">Amenities for every hour of the day</div>
            </div>
          </div>
          <h2
            style={{
              fontFamily: 'var(--display)',
              fontWeight: 300,
              fontSize: 'clamp(2rem,4.4vw,3.2rem)',
              margin: '.3rem 0 1.6rem',
            }}
          >
            However you like to pass the time
          </h2>
        </div>
        <div className="reveal">
          <div className="daytabs">
            <button className="daytab on" id="dt_morning">
              Morning
            </button>
            <button className="daytab" id="dt_noon">
              Afternoon
            </button>
            <button className="daytab" id="dt_eve">
              Evening
            </button>
            <button className="daytab" id="dt_family">
              Family
            </button>
          </div>
          <div className="daystack">
            <div className="daypanel on" id="dp_morning">
              <div className="pimg" style={{ backgroundImage: 'url(/assets/img/am_fitness.webp)' }}></div>
              <div>
                <div className="ptag">Morning</div>
                <h3>Begin slow</h3>
                <p className="pd">
                  Wake to birdsong by the lake — a walk, a stretch, a quiet moment at the temple before the day starts.
                </p>
                <div className="daychips">
                  <span className="chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="4.5" r="2" />
                      <path d="M12 6.5v6M5 21c2-4 5-5 7-5s5 1 7 5M8 11h8" />
                    </svg>
                    Yoga lawn
                  </span>
                  <span className="chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="13" cy="4" r="1.6" />
                      <path d="M11 8l3 2 2 4M11 8l-2 5 2 6M14 10l-3 3" />
                    </svg>
                    Walking track
                  </span>
                  <span className="chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="6" cy="17" r="3" />
                      <circle cx="18" cy="17" r="3" />
                      <path d="M6 17l4-7h5l3 7M10 10l-1-3H7" />
                    </svg>
                    Cycling track
                  </span>
                  <span className="chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a5 5 0 0 0-4 8 4 4 0 0 0 2 6h4a4 4 0 0 0 2-6 5 5 0 0 0-4-8zM12 16v6" />
                    </svg>
                    Nature trails
                  </span>
                  <span className="chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l9 5H3zM5 7v11M19 7v11M9 18v-7h6v7M3 18h18M3 21h18" />
                    </svg>
                    Temple garden
                  </span>
                </div>
              </div>
            </div>
            <div className="daypanel" id="dp_noon">
              <div className="pimg" style={{ backgroundImage: 'url(/assets/img/am_court2.webp)' }}></div>
              <div>
                <div className="ptag">Afternoon</div>
                <h3>Play hard</h3>
                <p className="pd">Courts, nets and the pool — somewhere to spend the afternoon, whatever your game.</p>
                <div className="daychips">
                  <span className="chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M3 12h18M12 3v18M5.6 5.6c3 3 3 9.8 0 12.8M18.4 5.6c-3 3-3 9.8 0 12.8" />
                    </svg>
                    Half-court basketball
                  </span>
                  <span className="chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 20l6-6M10 14l2-7 5 5-7 2zM12 7l5 5" />
                    </svg>
                    Badminton × 2
                  </span>
                  <span className="chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 18L16 8M14 4l6 6-3 3-6-6z" />
                      <circle cx="5" cy="19" r="1.4" />
                    </svg>
                    Cricket nets
                  </span>
                  <span className="chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" />
                    </svg>
                    Open gym
                  </span>
                  <span className="chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0M6 14V5a2 2 0 0 1 4 0M14 14V5a2 2 0 0 1 4 0M6 9h4M14 9h4" />
                    </svg>
                    Swimming
                  </span>
                </div>
              </div>
            </div>
            <div className="daypanel" id="dp_eve">
              <div className="pimg" style={{ backgroundImage: 'url(/assets/img/am_rooftop.webp)' }}></div>
              <div>
                <div className="ptag">Evening</div>
                <h3>Unwind high</h3>
                <p className="pd">
                  As the light fades, head up — a drink on the rooftop, the city below, the stars above.
                </p>
                <div className="daychips">
                  <span className="chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 11v6M21 11v6M3 13a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v3H3zM6 16v2M18 16v2" />
                    </svg>
                    Rooftop lounge &amp; bar
                  </span>
                  <span className="chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 16h20M4 16v-3a8 8 0 0 1 16 0v3M8 16v-4M16 16v-4M12 16v-5" />
                    </svg>
                    Sky bridge
                  </span>
                  <span className="chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M2 12s3-6 10-6 10 6 10 6-3 6-10 6S2 12 2 12z" />
                    </svg>
                    Observation deck
                  </span>
                  <span className="chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3l1.8 4.8L19 9l-4.2 2.6L16 17l-4-3-4 3 1.2-5.4L5 9l5.2-1.2z" />
                    </svg>
                    Star-gazing
                  </span>
                </div>
              </div>
            </div>
            <div className="daypanel" id="dp_family">
              <div className="pimg" style={{ backgroundImage: 'url(/assets/img/am_kids.webp)' }}></div>
              <div>
                <div className="ptag">Family</div>
                <h3>All together</h3>
                <p className="pd">Room for the littlest and the eldest alike — to play, gather and celebrate.</p>
                <div className="daychips">
                  <span className="chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3l3 5-3 2-3-2zM12 10v6M9 21l3-5 3 5" />
                    </svg>
                    Kids&rsquo; play area
                  </span>
                  <span className="chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 20a9 9 0 0 1 18 0M6 20a6 6 0 0 1 12 0M9 20a3 3 0 0 1 6 0" />
                    </svg>
                    Amphitheatre
                  </span>
                  <span className="chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a5 5 0 0 0-4 8 4 4 0 0 0 2 6h4a4 4 0 0 0 2-6 5 5 0 0 0-4-8zM12 16v6" />
                    </svg>
                    Party lawn
                  </span>
                  <span className="chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3v13M8 3l7 3-7 3M6 21h6" />
                      <circle cx="8" cy="20" r="1" />
                    </svg>
                    Mini golf
                  </span>
                  <span className="chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="10" rx="3" />
                      <path d="M7 11v2M6 12h2M15 11h.01M17 13h.01" />
                    </svg>
                    Indoor games
                  </span>
                  <span className="chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 11v6M21 11v6M3 13a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v3H3zM6 16v2M18 16v2" />
                    </svg>
                    Senior seating
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="marquee reveal">
        <div className="track">
          <span>Infinity Pool<i> · </i></span>
          <span>Rooftop Lounge<i> · </i></span>
          <span>Temple Garden<i> · </i></span>
          <span>Sky Bridge<i> · </i></span>
          <span>Cricket Nets<i> · </i></span>
          <span>Yoga Lawn<i> · </i></span>
          <span>Mini Golf<i> · </i></span>
          <span>Star-Gazing<i> · </i></span>
          <span>Amphitheatre<i> · </i></span>
          <span>Lily Pond<i> · </i></span>
          <span>Kids&rsquo; Play<i> · </i></span>
          <span>Cycling Track<i> · </i></span>
          <span>Infinity Pool<i> · </i></span>
          <span>Rooftop Lounge<i> · </i></span>
          <span>Temple Garden<i> · </i></span>
          <span>Sky Bridge<i> · </i></span>
          <span>Cricket Nets<i> · </i></span>
          <span>Yoga Lawn<i> · </i></span>
          <span>Mini Golf<i> · </i></span>
          <span>Star-Gazing<i> · </i></span>
          <span>Amphitheatre<i> · </i></span>
          <span>Lily Pond<i> · </i></span>
          <span>Kids&rsquo; Play<i> · </i></span>
          <span>Cycling Track<i> · </i></span>
        </div>
      </div>

      <section className="wrap" style={{ padding: 'clamp(2.5rem,6vw,4rem) 0 clamp(4rem,8vw,6rem)' }}>
        <div className="reveal">
          <div className="kicker">
            <span className="kn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01" />
              </svg>
            </span>
            <div>
              <div className="kt">The Full List</div>
              <div className="ks">All amenities across site, terrace &amp; activity zones</div>
            </div>
          </div>
          <h2
            style={{
              fontFamily: 'var(--display)',
              fontWeight: 300,
              fontSize: 'clamp(1.9rem,4vw,2.8rem)',
              margin: '.3rem 0 .2rem',
            }}
          >
            All thirty-six, in full
          </h2>
        </div>

        <div className="zone reveal">
          <div className="zh">
            <div className="zt">
              <h3>Site Landscape</h3>
              <span className="zl">at ground level</span>
            </div>
            <span className="zc">18</span>
          </div>
          <div className="icongrid">
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 21V8l8-5 8 5v13M4 21h16M10 21v-5h4v5" />
              </svg>
              <span>Grand entrance plaza</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l9 5H3zM5 7v11M19 7v11M9 18v-7h6v7M3 18h18M3 21h18" />
              </svg>
              <span>Temple &amp; calm garden</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 10c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
              </svg>
              <span>Lily pond</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a5 5 0 0 0-4 8 4 4 0 0 0 2 6h4a4 4 0 0 0 2-6 5 5 0 0 0-4-8zM12 16v6" />
              </svg>
              <span>Nature trails</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="13" cy="4" r="1.6" />
                <path d="M11 8l3 2 2 4M11 8l-2 5 2 6M14 10l-3 3" />
              </svg>
              <span>Walking track</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="17" r="3" />
                <circle cx="18" cy="17" r="3" />
                <path d="M6 17l4-7h5l3 7M10 10l-1-3H7" />
              </svg>
              <span>Cycling track</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 20a9 9 0 0 1 18 0M6 20a6 6 0 0 1 12 0M9 20a3 3 0 0 1 6 0" />
              </svg>
              <span>Amphitheatre</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11v6M21 11v6M3 13a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v3H3zM6 16v2M18 16v2" />
              </svg>
              <span>Garden lounge</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11v6M21 11v6M3 13a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v3H3zM6 16v2M18 16v2" />
              </svg>
              <span>Senior-citizen seating</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11v6M21 11v6M3 13a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v3H3zM6 16v2M18 16v2" />
              </svg>
              <span>Family gathering pavilion</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 5a2 2 0 0 1 2-2h5v16H6a2 2 0 0 0-2 2zM20 5a2 2 0 0 0-2-2h-5v16h5a2 2 0 0 1 2 2z" />
              </svg>
              <span>Reading nook</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a5 5 0 0 0-4 8 4 4 0 0 0 2 6h4a4 4 0 0 0 2-6 5 5 0 0 0-4-8zM12 16v6" />
              </svg>
              <span>Shaded walkways</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a5 5 0 0 0-4 8 4 4 0 0 0 2 6h4a4 4 0 0 0 2-6 5 5 0 0 0-4-8zM12 16v6" />
              </svg>
              <span>Party lawn</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="17" r="3" />
                <circle cx="18" cy="17" r="3" />
                <path d="M6 17l4-7h5l3 7M10 10l-1-3H7" />
              </svg>
              <span>Bicycle parking</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 21V8l8-5 8 5v13M4 21h16M10 21v-5h4v5" />
              </svg>
              <span>Drop-off &amp; bus bay</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 21V8l8-5 8 5v13M4 21h16M10 21v-5h4v5" />
              </svg>
              <span>Feature wall</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11v6M21 11v6M3 13a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v3H3zM6 16v2M18 16v2" />
              </svg>
              <span>Seating decks</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a5 5 0 0 0-4 8 4 4 0 0 0 2 6h4a4 4 0 0 0 2-6 5 5 0 0 0-4-8zM12 16v6" />
              </svg>
              <span>Landscaped greens</span>
            </div>
          </div>
        </div>

        <div className="zone reveal">
          <div className="zh">
            <div className="zt">
              <h3>Terrace Landscape</h3>
              <span className="zl">above it all</span>
            </div>
            <span className="zc">10</span>
          </div>
          <div className="icongrid">
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11v6M21 11v6M3 13a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v3H3zM6 16v2M18 16v2" />
              </svg>
              <span>Rooftop lounge &amp; bar</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v13M8 3l7 3-7 3M6 21h6" />
                <circle cx="8" cy="20" r="1" />
              </svg>
              <span>Terrace mini golf</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" />
              </svg>
              <span>Terrace gym</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="4.5" r="2" />
                <path d="M12 6.5v6M5 21c2-4 5-5 7-5s5 1 7 5M8 11h8" />
              </svg>
              <span>Yoga lawn / deck</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 16h20M4 16v-3a8 8 0 0 1 16 0v3M8 16v-4M16 16v-4M12 16v-5" />
              </svg>
              <span>Connecting sky bridge</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11v6M21 11v6M3 13a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v3H3zM6 16v2M18 16v2" />
              </svg>
              <span>Gathering zone</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M2 12s3-6 10-6 10 6 10 6-3 6-10 6S2 12 2 12z" />
              </svg>
              <span>Observation deck</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.8 4.8L19 9l-4.2 2.6L16 17l-4-3-4 3 1.2-5.4L5 9l5.2-1.2z" />
              </svg>
              <span>Star-gazing area</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 5a2 2 0 0 1 2-2h5v16H6a2 2 0 0 0-2 2zM20 5a2 2 0 0 0-2-2h-5v16h5a2 2 0 0 1 2 2z" />
              </svg>
              <span>Reading nook</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a5 5 0 0 0-4 8 4 4 0 0 0 2 6h4a4 4 0 0 0 2-6 5 5 0 0 0-4-8zM12 16v6" />
              </svg>
              <span>Seating decks with planters</span>
            </div>
          </div>
        </div>

        <div className="zone reveal">
          <div className="zh">
            <div className="zt">
              <h3>Activity Zone</h3>
              <span className="zl">for every age</span>
            </div>
            <span className="zc">8</span>
          </div>
          <div className="icongrid">
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3v18M5.6 5.6c3 3 3 9.8 0 12.8M18.4 5.6c-3 3-3 9.8 0 12.8" />
              </svg>
              <span>Half basketball court</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 20l6-6M10 14l2-7 5 5-7 2zM12 7l5 5" />
              </svg>
              <span>Badminton courts × 2</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 18L16 8M14 4l6 6-3 3-6-6z" />
                <circle cx="5" cy="19" r="1.4" />
              </svg>
              <span>Cricket nets</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" />
              </svg>
              <span>Open gym</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l3 5-3 2-3-2zM12 10v6M9 21l3-5 3 5" />
              </svg>
              <span>Kids&rsquo; play area</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="9" r="5" />
                <path d="M5.5 12.5L3 20" />
                <circle cx="17" cy="8" r="1.4" />
              </svg>
              <span>Table tennis</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 20l6-6M10 14l2-7 5 5-7 2zM12 7l5 5" />
              </svg>
              <span>Shuttle court</span>
            </div>
            <div className="amitem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="10" rx="3" />
                <path d="M7 11v2M6 12h2M15 11h.01M17 13h.01" />
              </svg>
              <span>Indoor game zone</span>
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
            Come see the view that can&rsquo;t be built out
          </div>
          <h2>Picture your family here.</h2>
          <p>Book a visit and walk the gardens, the rooftop and the clubhouse for yourself.</p>
          {!qDone ? (
            <div className="qform" id="qform">
              <input
                id="qn"
                placeholder="Your name"
                value={q.n}
                onChange={(e) => setQ((v) => ({ ...v, n: e.target.value }))}
              />
              <input
                id="qp"
                placeholder="Phone"
                value={q.p}
                onChange={(e) => setQ((v) => ({ ...v, p: e.target.value }))}
              />
              <select id="qc" value={q.c} onChange={(e) => setQ((v) => ({ ...v, c: e.target.value }))}>
                <option value="">Interested in…</option>
                <option>3 BHK</option>
                <option>4 BHK</option>
              </select>
              <a
                href="#"
                className="btn solid"
                onClick={(e) => {
                  e.preventDefault();
                  quickSubmit();
                }}
              >
                Request a Visit
              </a>
            </div>
          ) : (
            <div className="qform" id="qform">
              <div
                style={{
                  fontFamily: 'var(--display)',
                  fontStyle: 'italic',
                  color: 'var(--line)',
                  fontSize: '1.4rem',
                }}
              >
                Thank you, {qDone}. We&rsquo;ll call you shortly to plan your visit.
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
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openModal('brochure');
              }}
            >
              Download the brochure
            </a>{' '}
            or{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openModal('price');
              }}
            >
              get the price sheet
            </a>
            .
          </div>
        </div>
      </section>
    </>
  );
}
