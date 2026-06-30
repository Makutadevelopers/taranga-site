'use client';
// Lead capture + analytics — ported verbatim in behavior from the original site.
// NOTE: the CRM key is exposed client-side (same as the original static site). For a
// real fix, route leads through a serverless proxy that holds the key as a secret.
// Static export has no API routes, so parity is preserved here.

export const LEAD_ENDPOINT =
  process.env.NEXT_PUBLIC_LEAD_ENDPOINT || 'https://portal-api.clove.build/api/tpi/website/lead';
export const LEAD_API_KEY =
  process.env.NEXT_PUBLIC_LEAD_API_KEY || 'eWQbDXtk5kwBZdd4XMTEIvYM1dxyrWQ8';
export const LEAD_PROPERTY = 'Makuta Taranga';
export const LEAD_EMAIL = 'dm@makutadevelopers.com';
export const LEAD_UNIT = '';

export function leadPayload(src, n, p, em, extra) {
  extra = extra || {};
  const d = (p || '').replace(/\D/g, '');
  const mob = d ? (d.length === 10 ? '+91' + d : '+' + d) : '';
  const cfg = (extra.config || '').replace(/\s+/g, '');
  const pg =
    typeof location !== 'undefined' ? location.pathname.split('/').pop() || 'index.html' : '';
  let msg = 'From ' + pg + '. Consent given (WhatsApp/phone/email) at ' + new Date().toISOString() + '.';
  const u = extra.unit || LEAD_UNIT;
  if (u) msg += ' Unit: ' + u + '.';
  return {
    property: LEAD_PROPERTY,
    name: n || '',
    email: em || '',
    mobileNo: mob,
    source: 'Website',
    subSource: src || '',
    type: 'Apartment',
    configuration: cfg,
    location: '',
    message: msg,
  };
}

export function sendLead(pl, done) {
  function fin(ok) {
    try {
      if (done) done(ok);
    } catch (e) {}
  }
  function mailFallback() {
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
      headers: { 'Content-Type': 'application/json', 'x-api-key': LEAD_API_KEY },
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
