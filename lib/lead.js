'use client';
// Lead capture + analytics.
// Leads POST to the same-origin /api/lead Cloudflare Pages Function, which holds the
// Clove CRM key server-side (see functions/api/lead.js). The browser never sees the key,
// and because the request is same-origin with no custom headers it triggers no CORS
// preflight. If the proxy is unreachable (e.g. `next dev`, where the function isn't
// served), sendLead falls back to a mailto: link so no enquiry is lost.

export const LEAD_ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT || '/api/lead';
export const LEAD_PROPERTY = 'Taranga'; // must match the project name in Clove (portal.clove.build)
export const LEAD_EMAIL = 'dm@makutadevelopers.com';
export const LEAD_UNIT = '';
export const LEAD_SOURCE = 'Taranga-Website'; // must match the Source configured in Clove exactly
export const WA_NUMBER = '919059676464';

export function leadPayload(src, n, p, em, extra) {
  extra = extra || {};
  const d = (p || '').replace(/\D/g, '');
  const mob = d ? (d.length === 10 ? '+91' + d : '+' + d) : '';
  const cfg = (extra.config || '').replace(/\s+/g, '');
  const pg =
    typeof location !== 'undefined' ? location.pathname.split('/').pop() || 'index.html' : '';
  // Clove has no subSource configured for this project, so fold the enquiry
  // type (Brochure / Price Sheet / Site Visit / …) into the message instead.
  let msg = (src ? 'Interest: ' + src + '. ' : '') +
    'From ' + pg + '. Consent given (WhatsApp/phone/email) at ' + new Date().toISOString() + '.';
  const u = extra.unit || LEAD_UNIT;
  if (u) msg += ' Unit: ' + u + '.';
  // Full field set per Clove's "Website - Makuta API Doc" (tpi/website/lead).
  // Fields we don't collect on the site are sent as empty strings, matching the doc.
  return {
    property: LEAD_PROPERTY,
    name: n || '',
    email: em || '',
    mobileNo: mob,
    source: LEAD_SOURCE,
    subSource: '',
    isOtpVerified: false,
    sitevisitDate: '',
    message: msg,
    type: 'Apartment',
    configuration: cfg,
    location: '',
    budget: '',
    facing: '',
    floor: '',
    visitedProject: '',
    fundingSource: '',
    minSize: '',
    maxSize: '',
  };
}

// opts.mail (default true): on proxy failure, fall back to a mailto: draft so no
// enquiry is lost. Set mail:false when the visitor is handed to WhatsApp anyway
// (brochure/price), so a Clove hiccup doesn't also pop open the Mail app.
export function sendLead(pl, done, opts) {
  const useMail = !opts || opts.mail !== false;
  function fin(ok) {
    try {
      if (done) done(ok);
    } catch (e) {}
  }
  function mailFallback() {
    if (!useMail) return;
    try {
      const sub = encodeURIComponent('Makuta Taranga enquiry — ' + (pl.subSource || pl.source || ''));
      const L = [
        'Name: ' + pl.name,
        'Phone: ' + pl.mobileNo,
        'Email: ' + (pl.email || '-'),
        'Interest: ' + (pl.subSource || '-'),
        'Config: ' + (pl.configuration || '-'),
        pl.message || '',
      ];
      const a = document.createElement('a');
      a.href = 'mailto:' + LEAD_EMAIL + '?subject=' + sub + '&body=' + encodeURIComponent(L.join('\n'));
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {}
  }
  if (LEAD_ENDPOINT) {
    fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pl),
    })
      .then(function (r) {
        if (r.ok) {
          fin(true);
        } else {
          mailFallback();
          fin(false);
        }
      })
      .catch(function () {
        mailFallback();
        fin(false);
      });
    return;
  }
  mailFallback();
  fin(true);
}

// Build a wa.me deep link to the sales number with a prefilled message.
export function whatsappUrl(text) {
  return 'https://wa.me/' + WA_NUMBER + (text ? '?text=' + encodeURIComponent(text) : '');
}

// Ask the server to send the brochure/price template to the lead's WhatsApp via
// api-wa.co. Fire-and-forget: the provider password stays server-side (/api/whatsapp).
export function sendWhatsAppTemplate(kind, name, phone) {
  try {
    fetch('/api/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: kind, name: name, phone: phone }),
    }).catch(function () {});
  } catch (e) {}
}

/* ---- conversion tracking (GA4 + Meta Pixel) ---- */
export function trackLead(source) {
  if (typeof window.gtag !== 'undefined')
    window.gtag('event', 'generate_lead', { value: 1, currency: 'INR', lead_type: source || 'form' });
  if (typeof window.fbq !== 'undefined') window.fbq('track', 'Lead', { value: 1, currency: 'INR' });
}
export function trackCall() {
  if (typeof window.gtag !== 'undefined') window.gtag('event', 'click_call');
  if (typeof window.fbq !== 'undefined') window.fbq('track', 'Contact');
}
export function trackWhatsApp() {
  if (typeof window.gtag !== 'undefined') window.gtag('event', 'click_whatsapp');
  if (typeof window.fbq !== 'undefined') window.fbq('track', 'Contact');
}
export function downloadPDF(type) {
  const pdfs = { brochure: 'Makuta_Taranga_Brochure.pdf', floorplans: 'Makuta_Taranga_Floor_Plans.pdf' };
  const url = pdfs[type] || '#';
  if (url.includes('.pdf')) {
    window.open(url, '_blank');
  } else {
    alert('Brochure not yet available. Please call us for details.');
  }
}
