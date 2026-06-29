# Makuta Taranga — Marketing Website

Static marketing site for **Makuta Taranga**, a lakefront residential development by Makuta Developers (TS RERA P02200011012). Seven HTML pages, no backend, no build step.

## Structure
```
index · about · amenities · contact · gallery · location · residences   (pages, root level)
favicon.svg · robots.txt · sitemap.xml · .nojekyll · _headers           (config / SEO)
assets/img/    all images (webp / png / jpg)
assets/video/  hero-water.mp4
SECURITY-AUDIT.md   security review & open items
```

## Deploy
Recommended host: **Netlify** or **Cloudflare Pages** (so `_headers` security headers apply).
- Netlify: drag the folder to https://app.netlify.com/drop, or connect this repo.
- GitHub Pages works but cannot apply `_headers` (no custom security headers).

## Leads
Forms POST to the Clove CRM (`portal-api.clove.build/api/tpi/website/lead`) with an `x-api-key`.
On failure they fall back to a pre-filled email so leads are never lost.

> **Security note:** the API key is currently in client-side JS (visible in page source).
> It can only *create* leads, but the proper fix is a serverless proxy that holds the key
> as a secret. See SECURITY-AUDIT.md → finding #1.

## Analytics
GA4 (`G-LG2FQH38BR`) and Meta Pixel are on every page.
