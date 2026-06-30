// Cloudflare Pages Function — same-origin lead proxy.
// The Clove CRM API key lives here, server-side, as an encrypted env var and never
// reaches the browser. The site posts plain JSON to /api/lead (same origin, so no CORS
// preflight), and this function attaches the secret x-api-key header to the upstream call.
//
// Required env var on the Pages project (Settings → Environment variables, encrypted):
//   CLOVE_API_KEY          — the Clove tpi website key
// Optional:
//   CLOVE_LEAD_ENDPOINT    — override the upstream URL (defaults below)
//
// Local dev: `npx wrangler pages dev out --binding CLOVE_API_KEY=...` serves this route.
// In `next dev` the route doesn't exist; the client falls back to a mailto: link.

const DEFAULT_ENDPOINT = 'https://portal-api.clove.build/api/tpi/website/lead';

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export async function onRequestPost({ request, env }) {
  const key = env.CLOVE_API_KEY;
  if (!key) return json({ ok: false, error: 'lead proxy not configured' }, 500);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid JSON' }, 400);
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return json({ ok: false, error: 'bad payload' }, 400);
  }
  // Light shape guard — a name + some contact handle must be present.
  if (!payload.name || !(payload.mobileNo || payload.email)) {
    return json({ ok: false, error: 'missing required fields' }, 422);
  }

  const endpoint = env.CLOVE_LEAD_ENDPOINT || DEFAULT_ENDPOINT;
  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key },
      body: JSON.stringify(payload),
    });
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: { 'content-type': upstream.headers.get('content-type') || 'application/json' },
    });
  } catch {
    return json({ ok: false, error: 'upstream request failed' }, 502);
  }
}
// Only POST is defined, so Pages returns 405 for any other method automatically.
