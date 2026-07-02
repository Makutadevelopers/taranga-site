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
const WA_BASE = 'https://connect.api-wa.co/project-apis/v1/project';

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

// WhatsApp template params can't contain newlines/tabs or long runs of spaces;
// flatten to a single clean line and cap length so the alert always sends.
function waText(v) {
  return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, 120) || '-';
}

// Secondary capture: if the Clove write fails, fan the enquiry to the sales team's
// WhatsApp so no lead is lost while the UI has already shown its (optimistic) thank-you.
// Fire-and-forget — a failed alert must never turn a lead 500 into a worse error.
// Needs env: WA_PROJECT_ID, WA_API_PWD (shared with /api/whatsapp), plus:
//   WA_ALERT_TO       — sales number to notify (country code + number, no '+')
//   WA_TPL_LEAD_ALERT — approved template, 4 body params: name, phone, email, interest
// If any are unset the alert is skipped silently.
async function notifyLeadFailure(env, pl) {
  const pid = env.WA_PROJECT_ID;
  const pwd = env.WA_API_PWD;
  const to = (env.WA_ALERT_TO || '').replace(/\D/g, '');
  const tpl = env.WA_TPL_LEAD_ALERT;
  if (!pid || !pwd || !to || !tpl) return;

  const params = [pl.name, pl.mobileNo, pl.email, pl.message || pl.subSource || pl.source]
    .map((v) => ({ type: 'text', text: waText(v) }));
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'template',
    template: {
      name: tpl,
      language: { code: env.WA_TPL_LANG || 'en' },
      components: [{ type: 'body', parameters: params }],
    },
  };
  try {
    await fetch(`${WA_BASE}/${pid}/messages`, {
      method: 'POST',
      headers: { 'X-API-WA-Project-API-Pwd': pwd, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // best-effort; nothing more we can safely do from here
  }
}

export async function onRequestPost({ request, env }) {
  const key = env.CLOVE_API_KEY;
  if (!key) return json({ ok: false, error: 'lead proxy not configured' }, 500);

  // Reject oversized bodies before parsing — a lead payload is a few hundred bytes;
  // anything past 8 KB is abuse. (Full bot protection = Cloudflare Turnstile.)
  const len = Number(request.headers.get('content-length') || 0);
  if (len > 8192) return json({ ok: false, error: 'payload too large' }, 413);

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
    // Clove rejected the lead (down / 500 / auth) — capture it to the sales WhatsApp
    // so it isn't lost. Still return Clove's real status to the caller.
    if (!upstream.ok) await notifyLeadFailure(env, payload);
    return new Response(body, {
      status: upstream.status,
      headers: { 'content-type': upstream.headers.get('content-type') || 'application/json' },
    });
  } catch {
    await notifyLeadFailure(env, payload);
    return json({ ok: false, error: 'upstream request failed' }, 502);
  }
}
// Only POST is defined, so Pages returns 405 for any other method automatically.
