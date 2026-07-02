'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { leadPayload, sendLead, trackLead } from '@/lib/lead';
import pageCss from './page-styles';

const openModal = (m) => window.openModal && window.openModal(m);

/* EDIT PROJECTS: replace name/area/img/url with real ones. url "#" makes the card open the brochure. */
const PROJECTS = [
  { name: 'Makuta Horizon', area: 'Residential · Under construction', img: '/assets/img/d_roof.webp', url: 'https://www.makutahorizon.com/' },
  { name: 'Makuta Nirvana', area: 'Residential · Under construction', img: '/assets/img/hero_blue.webp', url: 'https://www.makutanirvana.in/' },
  // TODO: add a card for "myspace2" once its real name, link and image are confirmed.
  { name: 'Makuta Aruna Arcade', area: 'Commercial', img: '/assets/img/d_glass.webp', url: 'https://www.makutadevelopers.com/best-residential-projects-in-hyderabad' },
  { name: 'Makuta Prime', area: 'Commercial', img: '/assets/img/ext_facade_dusk.webp', url: 'https://www.makutadevelopers.com/best-residential-projects-in-hyderabad' },
];
// NOTE: images for Aruna Arcade & Prime are Taranga renders used as placeholders — swap for real project photos when available.

// Company testimonial film (YouTube). Replace the id if the video changes.
const TESTIMONIAL_YT = 'UKv6I6OjLOI';

export default function PageClient() {
  /* quick visit form */
  const [q, setQ] = useState({ n: '', p: '', c: '' });
  const [qDone, setQDone] = useState(false);
  const [qNote, setQNote] = useState({
    text: 'We respect your privacy. No spam — just a call back to plan your visit.',
    color: '',
  });
  const [playTest, setPlayTest] = useState(false);

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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />

      <section className="phead">
        <div className="wrap">
          <div className="grid">
            <div>
              <div className="crumb">
                <Link href="/">Home</Link> / About
              </div>
              <div className="label" style={{ color: 'var(--gold-deep)', marginBottom: '.9rem' }}>
                Crown of Excellence
              </div>
              <h1>Makuta</h1>
              <p>
                Taranga is the latest chapter in a long Makuta story — homes built on trust, finish and the feeling of
                belonging.
              </p>
              <p className="whisper" style={{ textAlign: 'left', margin: '1.6rem 0 0', maxWidth: '42ch' }}>
                We measure our work not by what we add to a site, but by what we&rsquo;re willing to leave open.
              </p>
              <div className="hairline" style={{ marginTop: '1.6rem' }}></div>
            </div>
            <div className="ph-img">
              <div className="ph" style={{ backgroundImage: 'url(/assets/img/ext_facade_dusk.webp)' }}></div>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ padding: 'clamp(2rem,5vw,3rem) 0 clamp(4rem,8vw,6rem)' }}>
        <div className="reveal" style={{ maxWidth: '64ch' }}>
          <div className="label">About Makuta Projects LLP</div>
          <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(2rem,4.4vw,3.2rem)', margin: '.4rem 0 1rem' }}>
            We build for the long quiet, not the quick sale
          </h2>
          <p style={{ color: 'var(--ink-soft)' }}>
            For years, Makuta Projects LLP has shaped homes and communities across Hyderabad — measured by how they feel to
            live in a decade later, not just how they show on launch day. “Crown of Excellence” is the standard we hold
            every project to: honest build quality, a RERA-clean process, and finishes that age well.
          </p>
          <p className="whisper" style={{ textAlign: 'left', margin: '1.8rem 0 0', maxWidth: '40ch', fontSize: 'clamp(1.3rem,2.6vw,1.8rem)' }}>
            The 552 homes we didn&rsquo;t build are the reason you&rsquo;ll love living here.
          </p>
        </div>
        <div className="reveal" style={{ marginTop: '3rem' }}>
          <div className="label">What sets us apart</div>
          <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(1.8rem,3.6vw,2.6rem)', margin: '.3rem 0 1.4rem' }}>
            What &ldquo;Crown of Excellence&rdquo; means
          </h2>
          <div className="vals">
            <div className="val">
              <div className="vh">Honest build quality</div>
              <p>Specified, not improvised &mdash; an RCC shear-wall frame and materials you can verify, floor by floor.</p>
            </div>
            <div className="val">
              <div className="vh">A RERA-clean process</div>
              <p>Registered and disclosed &mdash; RERA P02200011012, with paperwork you can read before you commit.</p>
            </div>
            <div className="val">
              <div className="vh">Finishes that age well</div>
              <p>Chosen to look right in year ten &mdash; not just on launch day.</p>
            </div>
          </div>
        </div>
        <div className="reveal" style={{ marginTop: '3rem' }}>
          <div className="label">Assurance</div>
          <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(1.8rem,3.6vw,2.6rem)', margin: '.3rem 0 1rem' }}>
            Why families trust the process
          </h2>
          <div className="conn">
            <div className="r">
              <span>RERA registration</span>
              <b>P02200011012</b>
            </div>
            <div className="r">
              <span>Structure</span>
              <b>RCC shear-wall, wind/seismic</b>
            </div>
            <div className="r">
              <span>Home-loan support</span>
              <b>Leading banks</b>
            </div>
            <div className="r">
              <span>Possession</span>
              <b>On request</b>
            </div>
          </div>
          <p style={{ marginTop: '1.5rem' }}>
            <Link className="more" href="/blog/#faq">Read the full FAQ &rarr;</Link>
          </p>
        </div>
      </section>

      <div className="wavediv">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path d="M0,20 C150,38 300,4 450,20 S750,38 900,20 1050,4 1200,20" />
        </svg>
      </div>

      <section className="projects" id="projects">
        <div className="wrap reveal">
          <div className="kicker">
            <span className="kn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21V8l9-5 9 5v13M3 21h18M9 21v-6h6v6" />
              </svg>
            </span>
            <div>
              <div className="kt">Selected Projects</div>
              <div className="ks">More from Makuta Projects LLP</div>
            </div>
          </div>
          <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(2rem,4.4vw,3.2rem)', margin: '.3rem 0 .2rem' }}>
            A portfolio you can
            <br />
            stand inside
          </h2>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '46ch' }}>
            A track record of homes built around light, space and the calm of good design.
          </p>
          <div className="proj-grid" id="projGrid">
            {PROJECTS.map((p, i) => {
              const isBrochure = p.url === '#';
              return (
                <a
                  key={i}
                  className="proj"
                  href={p.url}
                  target={isBrochure ? undefined : '_blank'}
                  rel={isBrochure ? undefined : 'noopener noreferrer'}
                  onClick={
                    isBrochure
                      ? (e) => {
                          e.preventDefault();
                          openModal('brochure');
                        }
                      : undefined
                  }
                >
                  <div className="pimg" style={{ backgroundImage: `url(${p.img})` }}></div>
                  <div className="pmeta">
                    <div className="pstatus">{p.area}</div>
                    <div className="pname">{p.name}</div>
                    <div className="plink">
                      View project <span>&rarr;</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="enq wrap" data-rail="Visit" style={{ padding: 'clamp(4.5rem,10vw,7rem) 0' }}>
        <div className="reveal">
          <div className="label" style={{ marginBottom: '1.3rem' }}>
            Come see the view that can’t be built out
          </div>
          <h2>A private visit, by the lake.</h2>
          <p>Leave your details and our team will call you back to arrange a viewing — no obligation.</p>
          {!qDone ? (
            <div className="qform" id="qform">
              <input id="qn" placeholder="Your name" value={q.n} onChange={(e) => setQ((v) => ({ ...v, n: e.target.value }))} />
              <input id="qp" placeholder="Phone" value={q.p} onChange={(e) => setQ((v) => ({ ...v, p: e.target.value }))} />
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
                Book a site visit
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
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openModal('brochure');
              }}
            >
              Send me the brochure
            </a>{' '}
            or{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openModal('price');
              }}
            >
              the price sheet
            </a>
            .
          </div>
        </div>
      </section>

      <section className="socproof-sec" data-rail="Testimonials" style={{ background: 'var(--canvas)', padding: 'clamp(3rem,7vw,5rem) 0' }}>
        <div className="wrap reveal">
          <div className="label">In their words</div>
          <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(1.9rem,3.6vw,2.8rem)', margin: '.3rem 0 1.6rem' }}>
            Life at Makuta, in their words
          </h2>
          <div
            className="test-film"
            role="button"
            tabIndex={0}
            aria-label="Play the Makuta testimonial film"
            onClick={() => setPlayTest(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setPlayTest(true);
              }
            }}
            style={!playTest ? { backgroundImage: `url(https://i.ytimg.com/vi/${TESTIMONIAL_YT}/maxresdefault.jpg)` } : undefined}
          >
            {playTest ? (
              <iframe
                src={`https://www.youtube.com/embed/${TESTIMONIAL_YT}?autoplay=1&rel=0&playsinline=1`}
                title="Makuta testimonial film"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <span className="test-film-play" aria-hidden="true">
                <svg viewBox="0 0 68 48">
                  <path className="yt-bg" d="M66.5 7.7a8 8 0 0 0-5.6-5.7C56 .6 34 .6 34 .6s-22 0-26.9 1.4A8 8 0 0 0 1.5 7.7 83 83 0 0 0 0 24a83 83 0 0 0 1.5 16.3 8 8 0 0 0 5.6 5.7C12 47.4 34 47.4 34 47.4s22 0 26.9-1.4a8 8 0 0 0 5.6-5.7A83 83 0 0 0 68 24a83 83 0 0 0-1.5-16.3z" />
                  <path className="yt-tri" d="M45 24 27 14v20z" />
                </svg>
              </span>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
