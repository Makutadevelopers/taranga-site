// Cloudflare Pages Function — sends a WhatsApp template message to the lead via
// api-wa.co (WhatsApp Business API). Credentials live here server-side as encrypted
// env vars and never reach the browser; the client only posts { name, phone, kind }.
//
// Required env vars (Settings → Environment variables, encrypted):
//   WA_PROJECT_ID   — api-wa.co project id (path segment)
//   WA_API_PWD      — api-wa.co project API password (X-API-WA-Project-API-Pwd header)
//   WA_TPL_BROCHURE — approved template name for the brochure enquiry
// Optional:
//   WA_TPL_PRICE    — template name for the price-sheet enquiry (falls back to brochure)
//   WA_IMG_BROCHURE / WA_IMG_PRICE — header image URL for each template (if the template
//                     has an image header). Omit if the template has no header media.
//   WA_TPL_LANG     — template language code (defaults 'en')

const BASE = 'https://connect.api-wa.co/project-apis/v1/project';

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

// api-wa.co expects the recipient as country-code + number with no '+'.
function normPhone(p) {
  const d = (p || '').replace(/\D/g, '');
  if (!d) return '';
  return d.length === 10 ? '91' + d : d;
}

export async function onRequestPost({ request, env }) {
  const pid = env.WA_PROJECT_ID;
  const pwd = env.WA_API_PWD;
  if (!pid || !pwd) return json({ ok: false, error: 'whatsapp not configured' }, 500);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid JSON' }, 400);
  }
  const name = ((body && body.name) || '').trim();
  const to = normPhone(body && body.phone);
  const kind = (body && body.kind) || 'brochure';
  if (!name || to.length < 11) return json({ ok: false, error: 'missing name or phone' }, 422);

  const tpl = kind === 'price' ? env.WA_TPL_PRICE || env.WA_TPL_BROCHURE : env.WA_TPL_BROCHURE;
  const img = kind === 'price' ? env.WA_IMG_PRICE || env.WA_IMG_BROCHURE : env.WA_IMG_BROCHURE;
  if (!tpl) return json({ ok: false, error: 'no template configured' }, 500);

  // Mirrors the documented sample: body param {{1}} = customer name, optional image header.
  const components = [{ type: 'body', parameters: [{ type: 'text', text: name }] }];
  if (img) {
    components.push({ type: 'header', parameters: [{ type: 'image', image: { link: img } }] });
  }

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'template',
    template: { name: tpl, language: { code: env.WA_TPL_LANG || 'en' }, components },
  };

  try {
    const r = await fetch(`${BASE}/${pid}/messages`, {
      method: 'POST',
      headers: { 'X-API-WA-Project-API-Pwd': pwd, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await r.text();
    return new Response(text, {
      status: r.status,
      headers: { 'content-type': r.headers.get('content-type') || 'application/json' },
    });
  } catch {
    return json({ ok: false, error: 'whatsapp send failed' }, 502);
  }
}
