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

/* ---- traffic-source attribution → subSource -----------------------------
   Every lead's source is 'Taranga-Website' — true but blunt. We also capture
   WHERE the visitor actually came from (a Google/Meta ad, organic search, a
   WhatsApp link, direct) and write a plain-English bucket into subSource, so
   "website" leads can be segmented by real acquisition channel in Clove.

   First MEANINGFUL touch wins: stored in localStorage on the first visit that
   carries campaign info, so someone who arrives via an ad but only submits days
   later still credits the ad — not the "direct" hit of their return visit.
   Every browser access is guarded so this module is safe during the static
   build (no window/localStorage at SSR). captureAttribution() is called on page
   load from GlobalUI (to catch the landing URL) and again in leadPayload. */
const ATTR_KEY = 'trAttr';
const ATTR_MAX_AGE_DAYS = 90;

function hasCampaign(a) {
  return !!(a && ((a.utm && (a.utm.source || a.utm.medium || a.utm.campaign)) ||
    a.gclid || a.fbclid || a.wbraid || a.msclkid || a.ttclid));
}
function readAttr() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const a = JSON.parse(localStorage.getItem(ATTR_KEY) || 'null');
    if (!a) return null;
    if (a.ts && Date.now() - new Date(a.ts).getTime() > ATTR_MAX_AGE_DAYS * 864e5) return null;
    return a;
  } catch (e) { return null; }
}
export function captureAttribution() {
  try {
    if (typeof location === 'undefined') return;
    const q = new URLSearchParams(location.search);
    const pick = (k) => (q.get(k) || '').trim().slice(0, 80);
    const now = {
      utm: {
        source: pick('utm_source'), medium: pick('utm_medium'), campaign: pick('utm_campaign'),
        content: pick('utm_content'), term: pick('utm_term'),
      },
      gclid: pick('gclid'), fbclid: pick('fbclid'), wbraid: pick('wbraid'),
      msclkid: pick('msclkid'), ttclid: pick('ttclid'),
      referrer: (typeof document !== 'undefined' ? document.referrer || '' : '').slice(0, 160),
      landing: (location.pathname + location.search).slice(0, 200),
      ts: new Date().toISOString(),
    };
    const stored = readAttr();
    // Write only if nothing stored yet, or this visit has campaign info and the
    // stored one didn't (upgrades a first "direct" hit to the real source).
    if (!stored || (hasCampaign(now) && !hasCampaign(stored))) {
      try { if (typeof localStorage !== 'undefined') localStorage.setItem(ATTR_KEY, JSON.stringify(now)); } catch (e) {}
    }
  } catch (e) {}
}

// Eight plain-English buckets — subSource is ALWAYS one of these, never free-form,
// so Clove's reports stay readable. The specific site/campaign goes in the note.
const B_GADS = 'Google Ads', B_MADS = 'Meta Ads', B_SEARCH = 'Organic Search',
  B_SOCIAL = 'Social', B_WA = 'WhatsApp', B_PORTAL = 'Property Portals',
  B_EMAIL = 'Email', B_REF = 'Other Websites', B_DIRECT = 'Direct or Shared Link';
const PAID_MEDIUM = /^(cpc|ppc|paid|paid[_-]?social|social[_-]?paid|display|ads?|cpm|cpv|retargeting)$/i;
const SOURCE_NAMES = {
  google: 'Google', youtube: 'YouTube', facebook: 'Facebook', fb: 'Facebook',
  instagram: 'Instagram', ig: 'Instagram', meta: 'Facebook/Instagram',
  whatsapp: 'WhatsApp', bing: 'Bing', yahoo: 'Yahoo', duckduckgo: 'DuckDuckGo',
  ecosia: 'Ecosia', twitter: 'X (Twitter)', x: 'X (Twitter)', linkedin: 'LinkedIn',
  pinterest: 'Pinterest', reddit: 'Reddit', telegram: 'Telegram', tiktok: 'TikTok',
  threads: 'Threads', snapchat: 'Snapchat', quora: 'Quora', sharechat: 'ShareChat',
  housing: 'Housing.com', magicbricks: 'MagicBricks', '99acres': '99acres',
  nobroker: 'NoBroker', squareyards: 'Square Yards', proptiger: 'PropTiger',
  commonfloor: 'CommonFloor', newsletter: 'Newsletter', email: 'Email',
};
function titleCase(s) {
  return String(s).replace(/[_+-]+/g, ' ').trim()
    .replace(/\S+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
}
function sourceName(s) { return SOURCE_NAMES[String(s).toLowerCase()] || titleCase(s); }

// Returns { bucket, detail } — bucket for reporting (subSource), detail for the note.
function channel() {
  const a = readAttr() || {}, u = a.utm || {};
  const med = String(u.medium || ''), paid = PAID_MEDIUM.test(med);

  // 1) UTM-tagged — the campaign told us what this is.
  if (u.source) {
    const s = String(u.source).toLowerCase(), name = sourceName(s);
    if (/google|youtube|gdn|dv360|doubleclick/.test(s))
      return { bucket: paid ? B_GADS : (/organic|seo/i.test(med) ? B_SEARCH : B_REF), detail: name };
    if (/facebook|instagram|meta|^fb$|^ig$/.test(s))
      return { bucket: paid ? B_MADS : B_SOCIAL, detail: name };
    if (/whatsapp/.test(s)) return { bucket: B_WA, detail: name };
    if (/bing|yahoo|duckduckgo|ecosia|brave|yandex|baidu|naver/.test(s))
      return { bucket: B_SEARCH, detail: name + (paid ? ' ad' : '') };
    if (/housing|magicbricks|99acres|nobroker|squareyards|proptiger|commonfloor/.test(s))
      return { bucket: B_PORTAL, detail: name };
    if (/twitter|linkedin|pinterest|reddit|telegram|tiktok|threads|snapchat|quora|sharechat/.test(s))
      return { bucket: B_SOCIAL, detail: name + (paid ? ' ad' : '') };
    if (/^e?mail$|newsletter/i.test(med) || /newsletter|^e?mail$/.test(s))
      return { bucket: B_EMAIL, detail: name };
    return { bucket: B_REF, detail: name + (paid ? ' ad' : '') };
  }

  // 2) Paid click IDs — an ad even when the link wasn't UTM-tagged.
  if (a.gclid || a.wbraid) return { bucket: B_GADS, detail: 'untagged ad click' };
  if (a.fbclid) return { bucket: B_MADS, detail: 'untagged ad click' };
  if (a.msclkid) return { bucket: B_SEARCH, detail: 'Bing ad' };
  if (a.ttclid) return { bucket: B_SOCIAL, detail: 'TikTok ad' };

  // 3) Otherwise classify by the referring site.
  const ref = a.referrer || (typeof document !== 'undefined' ? document.referrer : '') || '';
  let host = '';
  if (ref) { try { host = new URL(ref).hostname.replace(/^www\./, ''); } catch (e) {} }
  if (host) {
    const first = host.split('.')[0];
    if (/google\./.test(host)) return { bucket: B_SEARCH, detail: 'Google' };
    if (/bing\.|yahoo\.|duckduckgo\.|ecosia\.|brave\.|yandex\.|baidu\.|ask\.|aol\.|naver\./.test(host))
      return { bucket: B_SEARCH, detail: sourceName(first) };
    if (/instagram/.test(host)) return { bucket: B_SOCIAL, detail: 'Instagram' };
    if (/facebook|fb\.com|fb\.me/.test(host)) return { bucket: B_SOCIAL, detail: 'Facebook' };
    if (/wa\.me|whatsapp/.test(host)) return { bucket: B_WA, detail: 'WhatsApp' };
    if (/youtube\.|youtu\.be/.test(host)) return { bucket: B_SOCIAL, detail: 'YouTube' };
    if (/t\.co|twitter|x\.com/.test(host)) return { bucket: B_SOCIAL, detail: 'X (Twitter)' };
    if (/linkedin\.|lnkd\.in/.test(host)) return { bucket: B_SOCIAL, detail: 'LinkedIn' };
    if (/pinterest\.|pin\.it/.test(host)) return { bucket: B_SOCIAL, detail: 'Pinterest' };
    if (/reddit\.|redd\.it/.test(host)) return { bucket: B_SOCIAL, detail: 'Reddit' };
    if (/t\.me|telegram\./.test(host)) return { bucket: B_SOCIAL, detail: 'Telegram' };
    if (/threads\.|snapchat\.|quora\.|tumblr\.|sharechat\./.test(host))
      return { bucket: B_SOCIAL, detail: sourceName(first) };
    if (/housing\.|magicbricks\.|99acres\.|nobroker\.|squareyards\.|proptiger\.|commonfloor\./.test(host))
      return { bucket: B_PORTAL, detail: sourceName(first) };
    return { bucket: B_REF, detail: host };
  }

  // No referrer and no campaign — deliberately NOT called organic: much of this is
  // WhatsApp / dark-social shares that carry no referrer, and folding it into
  // organic would credit SEO with leads it didn't earn.
  return { bucket: B_DIRECT, detail: '' };
}

const PAGE_NAMES = {
  '/': 'Home page', '/index': 'Home page', '/residences': 'Residences',
  '/amenities': 'Amenities', '/location': 'Location', '/gallery': 'Gallery',
  '/about': 'About', '/contact': 'Contact', '/blog': 'Blog',
  '/privacy': 'Privacy', '/terms': 'Terms',
};
function pageName(landing) {
  const path = String(landing || '').split('?')[0].replace(/\.html$/, '').replace(/(.)\/+$/, '$1') || '/';
  if (PAGE_NAMES[path]) return PAGE_NAMES[path];
  if (/^\/blog\//.test(path)) return 'Blog article';
  return titleCase(path.replace(/^\//, '').replace(/\//g, ' ')) || 'Home page';
}
// Submission time in the timezone sales works in, not UTC. en-IN inserts a narrow
// no-break space before am/pm — normalised so the note never shows a stray glyph.
function submittedWhen() {
  try {
    return new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    }).replace(/[  ]/g, ' ') + ' IST';
  } catch (e) { return new Date().toISOString(); }
}

export function leadPayload(src, n, p, em, extra) {
  extra = extra || {};
  captureAttribution(); // idempotent safety re-capture (first touch already stored on load)
  const d = (p || '').replace(/\D/g, '');
  const mob = d ? (d.length === 10 ? '+91' + d : '+' + d) : '';
  const cfg = (extra.config || '').replace(/\s+/g, '');
  const unit = extra.unit || LEAD_UNIT;
  const ch = channel();
  const a = readAttr() || {}, u = a.utm || {};

  // The CRM note, written for whoever picks up the phone. Labelled fields joined by
  // " · " (Clove's note view collapses newlines). Skip the detail when the bucket
  // already contains it — "WhatsApp (WhatsApp)" reads like a bug.
  const redundant = ch.detail && ch.bucket.toLowerCase().indexOf(ch.detail.toLowerCase()) !== -1;
  let found = ch.bucket + (ch.detail && !redundant ? ' (' + ch.detail + ')' : '');
  if (u.campaign) found += ', campaign "' + u.campaign + '"';
  const parts = [];
  if (src) parts.push('Interest: ' + src);
  parts.push('Found us through: ' + found);
  if (a.landing) parts.push('First page seen: ' + pageName(a.landing));
  if (unit) parts.push('Unit: ' + unit);
  parts.push('Submitted: ' + submittedWhen());
  parts.push('Consent given (WhatsApp/phone/email)');
  const message = parts.join(' · ');

  // Full field set per Clove's "Website - Makuta API Doc" (tpi/website/lead).
  // Fields we don't collect on the site are sent as empty strings, matching the doc.
  return {
    property: LEAD_PROPERTY,
    name: n || '',
    email: em || '',
    mobileNo: mob,
    source: LEAD_SOURCE,
    subSource: ch.bucket,
    isOtpVerified: false,
    sitevisitDate: '',
    message: message,
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
  const cta = opts && opts.cta; // carried through so a failure names the button too
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
        'Channel: ' + (pl.subSource || '-'),
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
  function failed(reason) {
    trackLeadFailed(reason, cta);
    mailFallback();
    fin(false);
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
          failed('http_' + r.status); // e.g. http_500 — Clove rejected it
        }
      })
      .catch(function () {
        failed('network'); // request never completed (offline, DNS, CORS, blocked)
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
// `cta` is the {type, placement, label} captured when the popup was opened. Passing it
// here is what makes the funnel answer "which button actually produced leads?" rather
// than only "which button got clicked". Callers outside the modal omit it.
export function trackLead(source, cta) {
  if (typeof window.gtag !== 'undefined')
    window.gtag('event', 'generate_lead', {
      value: 1,
      currency: 'INR',
      lead_type: source || 'form',
      ...(cta ? ctaParams(cta) : {}),
    });
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

/* ---- CTA + funnel diagnostics (GA4 only) ----
   cta_type / cta_placement / error_field are registered as event-scoped custom
   dimensions on the `taranga` property (G-LG2FQH38BR). GA4 never backfills an
   unregistered parameter, so these names must match the property exactly.
   Deliberately NOT sent to Meta — these are diagnostics, not conversions;
   generate_lead above remains the only Lead signal the Pixel sees. */
// The same {type, placement, label} rides every step of the funnel, so cta_click →
// lead_submit_attempt → lead_submit_error / generate_lead can all be filtered by the
// button that started it. Declared (not const) so trackLead above can hoist it.
function ctaParams(cta) {
  const c = cta || {};
  return {
    cta_type: c.type || 'unknown',
    cta_placement: c.placement || 'unknown',
    cta_label: c.label || '',
  };
}
export function trackCtaClick(cta) {
  if (typeof window.gtag === 'undefined') return;
  window.gtag('event', 'cta_click', ctaParams(cta));
}
// Fires on every press of Submit, BEFORE the validation guards. That's the whole
// point: it counts the people the form rejects, who never reach generate_lead and
// are otherwise invisible in analytics.
export function trackSubmitAttempt(cta) {
  if (typeof window.gtag === 'undefined') return;
  window.gtag('event', 'lead_submit_attempt', ctaParams(cta));
}
export function trackSubmitError(cta, field) {
  if (typeof window.gtag === 'undefined') return;
  window.gtag('event', 'lead_submit_error', { ...ctaParams(cta), error_field: field || 'unknown' });
}
// The visitor sees the thank-you screen immediately, before the Clove POST resolves —
// so generate_lead is optimistic. This is the reconciliation: it fires only when the
// lead genuinely failed to reach Clove, which is otherwise completely silent.
export function trackLeadFailed(reason, cta) {
  if (typeof window.gtag === 'undefined') return;
  window.gtag('event', 'lead_send_failed', {
    ...ctaParams(cta),
    failure_reason: reason || 'unknown',
  });
}
// Every brochure/price CTA must go through the modal so the enquiry reaches Clove and
// the customer gets the WhatsApp template. Handing out a PDF link directly loses the lead.
