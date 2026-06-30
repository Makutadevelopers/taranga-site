# Makuta Taranga — React (Next.js) site

A React/Next.js port of the original static Makuta Taranga marketing site. Same design,
same content, same SEO — rebuilt as components with the App Router and exported to static HTML.

## Stack
- **Next.js 14 (App Router)** with `output: 'export'` → static HTML in `out/` (deploy like the old site).
- **React 18**, plain JS/JSX (no TypeScript).
- CSS kept **verbatim** from the original site (the "keep CSS as-is" choice):
  - `app/globals.css` — the full design system + shared chrome + home styles (derived from the original `index.html`).
  - `app/<page>/page-styles.js` — each subpage's original CSS, injected mount-scoped so each page
    looks identical to the original with no cross-page leakage.
  - These are committed and self-contained (the one-time extraction scripts are no longer needed).

## Scripts
```bash
npm install
npm run dev      # local dev at http://localhost:3000
npm run build    # static export → ./out
```
After `npm run build`, deploy the `out/` folder (Netlify drop, Cloudflare Pages, or any static host).
`public/_headers` ships the security headers (applied by Netlify / Cloudflare Pages).

## Structure
```
app/
  layout.jsx        root layout: fonts, GA4 + Meta Pixel, shared chrome, metadata defaults
  globals.css       design system + shared chrome + home CSS (verbatim from index.html)
  page.jsx          home (server: metadata + JSON-LD) → HomeClient.jsx
  HomeClient.jsx    home content + scroll-stories engine + masterplan + parallax + quick form
  about/ amenities/ residences/ gallery/ location/ contact/
    page.jsx        per-page metadata (+ JSON-LD where present)
    PageClient.jsx  converted content + page-specific interactivity (effects / state)
    page-styles.js  that page's original CSS (mount-scoped)
components/
  Header, Footer, FloatingActions (WhatsApp/mobile nav/sticky bar),
  Loader, ScrollProgress, GlobalUI (lead modal + lightbox), SharedEffects (reveal + waterline)
lib/
  lead.js           CRM lead POST + email fallback + GA4/Pixel tracking helpers
public/
  assets/ favicon.svg robots.txt sitemap.xml _headers
```

## How shared behavior is wired
The lead modal and lightbox live once in `components/GlobalUI.jsx` and expose `window.openModal(mode[, extra])`
and `window.zoom(src, alt)` — so converted markup and per-page effects call them just like the original site.
Reveal-on-scroll and the lakefront "waterline" indicator run globally in `components/SharedEffects.jsx`,
re-initialised on every route change.

## Leads & analytics (parity with the original)
- Forms POST to the Clove CRM (`lib/lead.js`), with a pre-filled-email fallback on failure.
- GA4 (`G-LG2FQH38BR`) and Meta Pixel (`29987720737478821`) load in `app/layout.jsx`.

### Security note (unchanged from the original)
The CRM API key is still in client-side JS (`lib/lead.js`), exactly as in the original static site —
it can only *create* leads. The proper fix is a serverless proxy that holds the key as a secret.
You can override the endpoint/key at build time with `NEXT_PUBLIC_LEAD_ENDPOINT` / `NEXT_PUBLIC_LEAD_API_KEY`,
but those remain client-visible; a real fix needs a server function (which static export does not run).
Content-Security-Policy is best set via `public/_headers` on the host rather than a meta tag.
