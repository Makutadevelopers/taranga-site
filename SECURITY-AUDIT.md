# Makuta Taranga — Security Audit & File Structure

_Audit date: 29 June 2026 · Scope: the static marketing site (7 HTML pages + assets)_

This is a static, client-only website (no backend), so the realistic threat surface is small. Below is what was checked, what was fixed, and what still needs a decision from you.

---

## Findings at a glance

| # | Finding | Severity | Status |
|---|---------|----------|--------|
| 1 | CRM API key exposed in client-side JavaScript | **High** | **Open — needs a proxy** |
| 2 | DOM-based XSS via the quick-enquiry name field | Medium | **Fixed** |
| 3 | No Content-Security-Policy | Medium | **Fixed** (meta + `_headers`) |
| 4 | No server security headers (clickjacking, HSTS, nosniff) | Medium | **Fixed** (`_headers` file added) |
| 5 | CRM call may be blocked by browser CORS | Medium (operational) | **Open — test live / proxy** |
| 6 | No length/character limit on free-text inputs | Low | Optional |
| — | Reflected XSS, mixed content, eval, tabnabbing, 3rd-party JS | — | **None found** |

---

## 1. CRM API key exposed in the client _(High — still open)_

The Clove key (`x-api-key`) sits in the page JavaScript, so anyone who opens "View Source" can read it. Because this key only **creates leads** (it can't read your data), the practical blast radius is limited to **someone spamming junk leads into your CRM** — not a data breach. Still, this is the one finding that a static site cannot fully fix on its own.

**Recommended fix:** a tiny serverless proxy (Netlify Function or Cloudflare Worker). The form calls *your* proxy; the proxy holds the key as a secret environment variable and forwards to Clove. This removes the key from page source **and** eliminates the CORS problem (finding 5) in one move. Ask and this can be built for you.

Note: if the GitHub repo is **public**, committing the key also publishes it to GitHub (where secret-scanners index it). The proxy avoids this entirely.

## 2. DOM-based XSS in the quick-enquiry form _(Fixed)_

The confirmation message was built with `innerHTML` and the visitor's typed name spliced in. A name like `<img src=x onerror=…>` would have executed in the browser. Rebuilt to use `textContent`, so any markup in a name is now rendered as inert text. Verified: a script payload no longer executes.

## 3. Content-Security-Policy _(Fixed)_

Added a CSP `<meta>` to all 7 pages restricting where scripts, styles, fonts, images, media, connections and frames may come from — locked to your own origin plus the legitimate third parties already in use: **Google Fonts, GA4, Meta Pixel, and the Google Maps embed**. Connections (`connect-src`) are limited to your origin and the Clove endpoint, which constrains where data could be exfiltrated if a script were ever injected. Verified: no false-positive blocks of your analytics or map.

## 4. Server security headers _(Fixed — `_headers` file)_

Some protections can only be set as HTTP response headers, not via `<meta>`. Added a Netlify **`_headers`** file (deployed automatically when you drag the folder to Netlify) providing:

- `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` — blocks clickjacking (your site can't be iframed by a phishing page).
- `Strict-Transport-Security` — forces HTTPS.
- `X-Content-Type-Options: nosniff` — stops MIME-sniffing attacks.
- `Referrer-Policy`, `Permissions-Policy` — privacy/feature hardening.

On Cloudflare Pages the same `_headers` file works; on GitHub Pages these headers can't be set (GitHub Pages doesn't support custom headers) — which is another reason Netlify/Cloudflare is the better host.

## 5. CORS dependency _(operational — test after deploy)_

The browser must be allowed to call the Clove endpoint cross-origin. If it isn't, the form silently falls back to opening an email. **Test on the live site:** submit a lead — if your mail app opens, CORS is blocking and you need either Clove to allow your domain, or the proxy (finding 1), which sidesteps it.

## 6. Input limits _(Low — optional)_

Name/phone/email have validation (10-digit phone, email regex, required consent) but no `maxlength`. Adding limits is good hygiene against oversized/garbage submissions. Easy to add if wanted.

## Checked — no issue found

- **No reflected XSS** — nothing reads URL parameters/hash into the page.
- **No mixed content** — every resource is HTTPS.
- **No `eval` / `document.write` / `new Function`.**
- **No tabnabbing** — external `target="_blank"` links already use `rel="noopener"`.
- **No unexpected third-party scripts** — only your own GA4/Pixel + Google Fonts/Maps.
- **No secrets** beyond the (intentional but exposed) CRM key; the phone/email shown are public marketing contacts by design.

---

## New file structure

```
taranga-site/
├── index.html              ← 7 pages stay at root (clean URLs for hosting)
├── about.html
├── amenities.html
├── contact.html
├── gallery.html
├── location.html
├── residences.html
├── favicon.svg
├── robots.txt              ← SEO
├── sitemap.xml             ← SEO
├── .nojekyll               ← GitHub Pages config
├── _headers                ← security headers (Netlify/Cloudflare)
└── assets/
    ├── img/                ← all images (61: webp / png / jpg)
    └── video/              ← hero-water.mp4
```

Every reference across all 7 pages was updated to the new paths and verified — no broken links/images (0 × 404 across the whole site).

---

## Priority next steps

1. **Build the serverless proxy** (closes findings 1 and 5 together). Highest value.
2. **Deploy on Netlify or Cloudflare** so the `_headers` file takes effect (GitHub Pages can't apply it).
3. **Test a live lead submission** to confirm CORS works (or confirms you need the proxy).
4. _(Optional)_ add `maxlength` to form inputs.
