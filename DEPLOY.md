# Deployment runbook — Makuta Taranga (Cloudflare Pages)

Static Next.js export (`output: 'export'` → `out/`). Hosted on **Cloudflare Pages**.

**Live now.** The GoDaddy → Wix → Cloudflare migration is **done**:

| | |
|---|---|
| Canonical host | `https://www.makutataranga.com` (apex 301-redirects to `www`) |
| Registrar | GoDaddy |
| Nameservers | Cloudflare (`rick` / `bingo.ns.cloudflare.com`) — Wix is out of the path |
| Email | Google Workspace — MX records live on Cloudflare, unchanged |
| Deploys | Cloudflare Pages, connected to Git. **Push to `main` → production build.** |

> The old `taranga-site.pages.dev` URL still resolves, but `www.makutataranga.com` is canonical:
> `SITE_URL` in `lib/site.js` already points at it, and canonical tags, OG URLs, JSON-LD,
> `robots.txt` and the generated sitemap all derive from it.

---

## Build settings (Cloudflare Pages)
| Setting | Value |
|---|---|
| Framework preset | Next.js (Static HTML Export) |
| Build command | `npm run build` |
| Output directory | `out` |
| Production branch | `main` |
| Node version | 20 (pinned via `.nvmrc`; or set env `NODE_VERSION=20`) |

`_redirects` and `_headers` (in `public/`, emitted to `out/`) are applied automatically by Pages.

## Environment variables (Pages → Settings → Environment variables)
| Name | Value | Notes |
|---|---|---|
| `CLOVE_API_KEY` | _the Clove tpi website key_ | **Encrypted.** Required — the lead form posts to the same-origin `/api/lead` Pages Function (`functions/api/lead.js`), which attaches this key server-side. The key is no longer in client JS. |
| `CLOVE_LEAD_ENDPOINT` | _(optional)_ | Override the upstream Clove URL; defaults to the production endpoint. |
| `WA_PROJECT_ID` | _api-wa.co project id_ | Required for the brochure/price WhatsApp template. See `WHATSAPP_TEMPLATES.md`. |
| `WA_API_PWD` | _api-wa.co project API password_ | **Encrypted.** Required for the brochure/price WhatsApp template. |
| `WA_TPL_BROCHURE` / `WA_TPL_PRICE` | `taranga_website_1` | Approved template sent to the lead on a brochure / price-sheet enquiry. |
| `NODE_VERSION` | `20` | If not using `.nvmrc`. |

> The `functions/` directory at the repo root is bundled automatically by Pages (Functions are read
> from the project root, not from `out/`). After changing `CLOVE_API_KEY`, redeploy and submit a test
> lead — confirm it lands in Clove and that **no** API key appears in the browser Network tab or page
> source.

## Changing the canonical host
Everything derives from one constant. To move hosts, set `SITE_URL` in `lib/site.js`, then redeploy
and resubmit the sitemap in Search Console. `robots.txt` (static, in `public/`) is the only place the
host is written by hand — update it to match. The sitemap is **generated** by `app/sitemap.js` and
needs no edit.

## Google Search Console
The GA4 gtag snippet lives in `<head>` in `app/layout.jsx` and **must stay there** — Search Console's
Google Analytics ownership check reads the tag from `<head>` and fails with *"the tracking code is in
the wrong location on the page"* if `next/script` defers it into `<body>`.

Verification methods available, in order of durability:
1. **DNS TXT (best)** — a `TXT @` record on Cloudflare. Verifies the whole domain at once, immune to
   the apex→www redirect. ⚠️ **Add a new record; never overwrite the existing TXT records** — the
   root already carries the Google Workspace SPF record and an older `google-site-verification`
   token. Multiple root TXT records are normal.
2. **Google Analytics** — works now that the tag is in `<head>`. The verifying Google account needs
   **Edit** permission on GA property `G-LG2FQH38BR`.
3. **HTML file** — `public/google4a4f1c76e9a697e0.html`. If you use the URL-prefix property, register
   it as `https://www.makutataranga.com/` (with the `www`), since the apex 301-redirects.

---

## Ongoing checks after a deploy
- [ ] All pages load over HTTPS on `www.makutataranga.com`
- [ ] Old `.html` URLs 301 to clean URLs (spot-check `/about.html` → `/about/`)
- [ ] Apex still 301s to `www`
- [ ] Lead form → lead appears in Clove CRM (test submission)
- [ ] GA4 Realtime shows the visit; Meta Pixel Helper shows PageView + Lead
- [ ] Security headers present (check response headers / securityheaders.com)

## DNS records that must not be broken
These carry **Google Workspace email**. Deleting or overwriting them takes mail down.

| Type | Name | Value | Priority |
|---|---|---|---|
| MX | @ | aspmx.l.google.com | 10 |
| MX | @ | alt1.aspmx.l.google.com | 20 |
| MX | @ | alt2.aspmx.l.google.com | 30 |
| MX | @ | alt3.aspmx.l.google.com | 40 |
| MX | @ | alt4.aspmx.l.google.com | 50 |
| TXT | @ | `v=spf1 include:_spf.google.com ~all` | — |
| TXT | @ | `google-site-verification=D9EiOVS1fSl_Gwu6TmhEVNziEwNlSt3vQ6mgZLPHOqc` | — |

Still worth adding if absent:
- **DKIM** — Google Admin → Apps → Google Workspace → Gmail → Authenticate email; copy the TXT into Cloudflare.
- **DMARC** — `TXT _dmarc` → `v=DMARC1; p=none; rua=mailto:dm@makutadevelopers.com`
