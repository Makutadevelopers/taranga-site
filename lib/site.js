// Single source of truth for the canonical production origin.
// Live host today is the Cloudflare Pages subdomain. When the custom domain
// (makutataranga.com) is wired up and SSL-active on Pages, flip this ONE line to
// 'https://www.makutataranga.com' — canonical tags, OG URLs and JSON-LD all follow.
// Also update public/sitemap.xml and public/robots.txt (static files) to match.
export const SITE_URL = 'https://www.makutataranga.com';
export const OG_IMAGE = `${SITE_URL}/assets/img/og-image.jpg`;
