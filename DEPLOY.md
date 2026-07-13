# Deployment runbook — Makuta Taranga (Cloudflare Pages)

Static Next.js export (`output: 'export'` → `out/`). Hosted on **Cloudflare Pages**.
Domain `makutataranga.com` is registered at **GoDaddy**, currently using **Wix nameservers**
(`ns0/ns1.wixdns.net`). Email is **Google Workspace**. Goal: move hosting + DNS to Cloudflare
with zero email downtime, then retire Wix.

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
| `WA_TPL_BROCHURE` / `WA_TPL_PRICE` | `taranga_website` | Approved template sent to the lead on a brochure / price-sheet enquiry. |
| `NODE_VERSION` | `20` | If not using `.nvmrc`. |

> The `functions/` directory at the repo root is bundled automatically by `wrangler pages deploy out`
> (Functions are read from the project root, not from `out/`). After setting `CLOVE_API_KEY`, redeploy
> and submit a test lead — confirm it lands in Clove and that **no** API key appears in the browser
> Network tab or page source.

## Canonical domain (one-line flip)
Canonical tags, OG URLs and JSON-LD all derive from `lib/site.js` (`SITE_URL`). It currently points at
`https://taranga-site.pages.dev`. When the custom domain is live + SSL-active on Pages:
1. Set `SITE_URL` in `lib/site.js` to `https://www.makutataranga.com`.
2. Update `public/sitemap.xml` and `public/robots.txt` (static files) to the same host.
3. Redeploy and resubmit the sitemap in Search Console.

---

## Phase 1 — Deploy & test (no DNS changes)
1. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git** → `Makutadevelopers/taranga-site`.
2. Enter the build settings above → Deploy.
3. Open `https://taranga-site.pages.dev` and test: every page, lead forms (confirm a lead reaches
   Clove CRM), WhatsApp/call buttons, GA4 + Meta Pixel firing, mobile layout.

## Phase 2 — Add domain to Cloudflare DNS
4. Cloudflare → **Add a site** → `makutataranga.com` → Free plan. Let it scan.
5. **Verify these records imported (re-add any missing). Email records are critical:**

   KEEP (DNS only / grey cloud):
   | Type | Name | Value | Priority |
   |---|---|---|---|
   | MX | @ | aspmx.l.google.com | 10 |
   | MX | @ | alt1.aspmx.l.google.com | 20 |
   | MX | @ | alt2.aspmx.l.google.com | 30 |
   | MX | @ | alt3.aspmx.l.google.com | 40 |
   | MX | @ | alt4.aspmx.l.google.com | 50 |
   | TXT | @ | `v=spf1 include:_spf.google.com ~all` | — |
   | TXT | @ | `google-site-verification=D9EiOVS1fSl_Gwu6TmhEVNziEwNlSt3vQ6mgZLPHOqc` | — |

   DELETE (old Wix records — Pages recreates apex/www on its own):
   - `A @` → 185.230.63.x (Wix)
   - `CNAME www` → *.wixdns.net (Wix)

   OPTIONAL but recommended (add now or later):
   - DKIM: check **Google Admin → Apps → Google Workspace → Gmail → Authenticate email**; if a
     DKIM TXT exists, copy it into Cloudflare.
   - DMARC: `TXT _dmarc` → `v=DMARC1; p=none; rua=mailto:dm@makutadevelopers.com`

6. Cloudflare shows two nameservers (e.g. `xxx.ns.cloudflare.com`).

## Phase 3 — Switch nameservers (at GoDaddy)
7. GoDaddy → `makutataranga.com` → **Nameservers** → replace the Wix nameservers with the two
   Cloudflare ones. (No Wix changes needed.) Wait for Cloudflare to report the zone "Active".

## Phase 4 — Attach custom domain
8. Pages project → **Custom domains** → add `makutataranga.com` **and** `www.makutataranga.com`.
   SSL provisions automatically. Set one to redirect to the other for a single canonical host.

## Phase 5 — Verify, then retire Wix
9. Check: `https://makutataranga.com` loads; `/about.html` 301-redirects to `/about/`; SSL padlock;
   GA4 + Pixel fire; forms submit; **send a test email to a @makutataranga.com address** to confirm
   Google Workspace still receives.
10. Resubmit `https://makutataranga.com/sitemap.xml` in Google Search Console.
11. After a few stable days: cancel the Wix plan / remove the Wix domain connection.

---

## Post-launch checklist
- [ ] All 7 pages load over HTTPS
- [ ] Old `.html` URLs 301 to clean URLs (spot-check `/about.html`, `/contact.html`)
- [ ] `www` and apex resolve to one canonical host
- [ ] Lead form → lead appears in Clove CRM (test submission)
- [ ] GA4 Realtime shows the visit; Meta Pixel Helper shows PageView + Lead
- [ ] Test email received at @makutataranga.com (Google Workspace intact)
- [ ] Security headers present (check response headers / securityheaders.com)
- [ ] sitemap.xml resubmitted in Search Console; old URLs re-crawled
- [ ] Wix plan cancelled
