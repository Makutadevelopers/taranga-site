// Cloudflare Pages Function — same-origin lead proxy.
// The Clove CRM API key lives here, server-side, as an encrypted env var and never
// reaches the browser. The site posts plain JSON to /api/lead (same origin, so no CORS
// preflight), and this function attaches the secret x-api-key header to the upstream call.
//
// Required env var on the Pages project (Settings → Environment variables, encrypted):
//   CLOVE_API_KEY          — the Clove tpi website key
// Optional:
//   CLOVE_LEAD_ENDPOINT    — override the upstream URL (defaults below)
//   SHEET_WEBHOOK_URL      — Google Apps Script /exec URL; every lead is also appended
//   SHEET_SECRET           — shared secret the Apps Script checks (see content/lead-backup.gs)
//
// NOTE: unlike the Nirvana port, there is deliberately NO WhatsApp sales alert here — it
// was removed from this project on purpose (see the lead-flow memory). The Sheet backup +
// a server log line are the safety net for a lead the CRM rejects.
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

export async function onRequestPost(context) {
  const { request, env } = context;
  const key = env.CLOVE_API_KEY;
  if (!key) return json({ ok: false, error: 'lead proxy not configured' }, 500);

  // Reject oversized bodies before parsing — a lead payload is a few hundred bytes;
  // anything past 8 KB is abuse. (Full bot protection = Cloudflare Turnstile.)
  const len = Number(request.headers.get('content-length') || 0);
  if (len > 8192) return json({ ok: false, error: 'payload too large' }, 413);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid JSON' }, 400);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return json({ ok: false, error: 'bad payload' }, 400);
  }
  // Light shape guard — a name + some contact handle must be present.
  if (!body.name || !(body.mobileNo || body.email)) {
    return json({ ok: false, error: 'missing required fields' }, 422);
  }

  // Whitelist + length-cap the fields we forward — never relay the raw body. Field set
  // matches Clove's /website/lead contract and what client lead.js sends; unknown keys drop.
  const cap = (v, n) => (v == null ? '' : String(v).slice(0, n));
  const lead = {
    property: cap(body.property, 120),
    name: cap(body.name, 120),
    email: cap(body.email, 160),
    mobileNo: cap(body.mobileNo, 20),
    source: cap(body.source, 120),
    subSource: cap(body.subSource, 120),
    isOtpVerified: body.isOtpVerified === true,
    sitevisitDate: cap(body.sitevisitDate, 40),
    message: cap(body.message, 1000),
    type: cap(body.type, 60),
    configuration: cap(body.configuration, 60),
    location: cap(body.location, 120),
    budget: cap(body.budget, 60),
    facing: cap(body.facing, 40),
    floor: cap(body.floor, 40),
    visitedProject: cap(body.visitedProject, 120),
    fundingSource: cap(body.fundingSource, 120),
    minSize: cap(body.minSize, 40),
    maxSize: cap(body.maxSize, 40),
  };

  const endpoint = env.CLOVE_LEAD_ENDPOINT || DEFAULT_ENDPOINT;
  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key },
      body: JSON.stringify(lead),
    });
    const text = await upstream.text();
    if (!upstream.ok) {
      // Clove rejected — record it (a rejected lead is exactly the one worth recovering)
      // and relay Clove's real status to the client.
      captureFailure(lead, `Clove ${upstream.status}`);
      backup(context, lead, `No — Clove ${upstream.status}`);
      return new Response(text || JSON.stringify({ ok: false, error: 'CRM rejected lead' }), {
        status: upstream.status,
        headers: { 'content-type': upstream.headers.get('content-type') || 'application/json' },
      });
    }
    backup(context, lead, 'Yes');
    return new Response(text || JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': upstream.headers.get('content-type') || 'application/json' },
    });
  } catch {
    captureFailure(lead, 'network error');
    backup(context, lead, 'No — network error');
    return json({ ok: false, error: 'upstream request failed' }, 502);
  }
}
// Only POST is defined, so Pages returns 405 for any other method automatically.

/* ---- backup copy in a Google Sheet --------------------------------------
 * Clove was the ONLY record of an enquiry: this handler forwards and keeps
 * nothing, so a lead the CRM rejected existed only in an ephemeral log line.
 * Every lead is now also appended to a Sheet, INCLUDING the rejected ones —
 * those are precisely the leads worth recovering.
 *
 * Fire-and-forget via waitUntil: the visitor's response must never wait on
 * Google, and a slow or broken Sheet must never cost us a lead. Silently
 * inactive until SHEET_WEBHOOK_URL and SHEET_SECRET are set in Pages env vars.
 * ------------------------------------------------------------------------ */
function backup(context, lead, delivered) {
  try {
    const { env } = context;
    if (!env.SHEET_WEBHOOK_URL || !env.SHEET_SECRET) return;
    context.waitUntil(appendToSheet(env, lead, delivered));
  } catch {
    /* a backup must never break the thing it is backing up */
  }
}

/** Pull one labelled segment out of the CRM note. lead.js builds the note as
 *  "Label: value · Label: value", so read the labels rather than positions —
 *  optional segments (Unit) shift everything after them. */
function noteField(message, label) {
  const parts = String(message || '').split(' · ');
  const want = label.toLowerCase() + ':';
  for (const part of parts) {
    const p = part.trim();
    if (p.toLowerCase().startsWith(want)) return p.slice(want.length).trim();
  }
  return '';
}

async function appendToSheet(env, lead, delivered) {
  try {
    // "Google Ads (Instagram), campaign "diwali"" → detail + campaign apart, so the
    // sheet can filter on either without string-matching in a formula.
    const found = noteField(lead.message, 'Found us through');
    const m = found.match(/,\s*campaign\s+"([^"]*)"/);
    const received = (() => {
      try {
        return new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric',
          hour: 'numeric', minute: '2-digit', hour12: true,
        }).replace(/[  ]/g, ' ');
      } catch {
        return new Date().toISOString();
      }
    })();

    await fetch(env.SHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        secret: env.SHEET_SECRET,
        received,
        name: lead.name,
        phone: lead.mobileNo,
        email: lead.email,
        channel: lead.subSource,
        detail: m ? found.slice(0, m.index).trim() : found,
        campaign: m ? m[1] : '',
        interest: noteField(lead.message, 'Interest'),
        page: noteField(lead.message, 'First page seen'),
        unit: noteField(lead.message, 'Unit'),
        delivered,
        note: lead.message,
      }),
    });
  } catch (err) {
    try { console.error('SHEET_BACKUP_FAILED ' + String(err)); } catch {}
  }
}

/** Always-on log capture of a lead that didn't reach Clove — visible in
 *  `wrangler pages deployment tail` / the CF dashboard even before the Sheet is
 *  configured. The marker string is easy to grep or alert on. No WhatsApp alert. */
function captureFailure(lead, reason) {
  try {
    console.error('LEAD_CAPTURE_FAILED ' + reason + ' ' + JSON.stringify({
      name: lead.name || '', mobileNo: lead.mobileNo || '', email: lead.email || '',
      property: lead.property || '', source: lead.source || '',
      subSource: lead.subSource || '', message: lead.message || '',
    }));
  } catch {
    /* logging must never throw */
  }
}
