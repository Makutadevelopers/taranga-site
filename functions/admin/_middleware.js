// Cloudflare Pages Function middleware for /admin/* (the Decap CMS editor).
//
// The site-wide strict CSP (in public/_headers, rule `/*`) blocks the editor:
// it loads from unpkg, talks to the GitHub API, and uses blob: web workers.
// Cloudflare _headers only APPENDS CSP headers, and browsers enforce every CSP
// header they receive (the intersection — most restrictive wins), so a second,
// looser rule in _headers cannot loosen the first. A Function CAN replace the
// header outright, so we do that here, scoped to /admin/* only. The rest of the
// site keeps the strict policy from _headers.
const ADMIN_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com",
  "style-src 'self' 'unsafe-inline' https://unpkg.com",
  "font-src 'self' data: https://unpkg.com",
  "img-src 'self' data: blob: https://*.githubusercontent.com https://avatars.githubusercontent.com",
  "media-src 'self' blob:",
  "connect-src 'self' https://unpkg.com https://api.github.com",
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "frame-src 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
].join('; ');

export async function onRequest(context) {
  const res = await context.next();
  const out = new Response(res.body, res);
  // set() replaces ALL existing Content-Security-Policy values (incl. any added
  // by _headers), leaving exactly one permissive policy for the editor.
  out.headers.set('Content-Security-Policy', ADMIN_CSP);
  return out;
}
