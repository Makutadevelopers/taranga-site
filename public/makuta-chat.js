/*!
 * Makuta website chat — a small, self-contained chat widget for the project
 * websites. The brain lives in the Makuta CRM (POST /api/public/site-chat/:site):
 * it answers only from facts the sales team approved, and turns a call-back
 * request into a lead in the CRM.
 *
 * Include once per page (no build step, no dependencies):
 *   <script src="/makuta-chat.js" data-site="NIRVANA" defer></script>
 * Optional attributes: data-api (default https://crm.makutadevelopers.com),
 * data-css (default: makuta-chat.css next to this script), data-avoid (a CSS
 * selector — e.g. the hero's RERA box — the closed bubble lifts itself above
 * whenever it would cover it).
 *
 * It asks the CRM for its config first and renders NOTHING unless the chat is
 * switched on for this site (Admin → Website chat in the CRM). The chat so far
 * is kept in sessionStorage so it survives moving between pages; nothing is
 * stored after the tab closes. All text is inserted with textContent.
 */
(function () {
  'use strict';
  if (window.__makutaChatLoaded) return;
  window.__makutaChatLoaded = true;

  var script =
    document.currentScript ||
    document.querySelector('script[data-site][src*="makuta-chat"]') ||
    document.querySelector('script[src*="makuta-chat"]');
  if (!script) return;
  var SITE = (script.getAttribute('data-site') || '').trim().toUpperCase();
  if (!/^[A-Z0-9][A-Z0-9_-]{1,39}$/.test(SITE)) return;
  var API = (script.getAttribute('data-api') || 'https://crm.makutadevelopers.com').replace(/\/+$/, '');
  var CSS = script.getAttribute('data-css') || script.src.replace(/[^/]*$/, '') + 'makuta-chat.css';
  var AVOID = (script.getAttribute('data-avoid') || '').trim();
  var BASE = API + '/api/public/site-chat/' + encodeURIComponent(SITE);
  var STORE_KEY = 'makuta-chat:' + SITE;
  var TIMEOUT_MS = 70000;

  var cfg = null;
  var state = load() || fresh();
  var ui = {};
  var busy = false;

  // ── storage ────────────────────────────────────────────────────────────────
  function fresh() {
    return { conversationId: newId(), messages: [], notes: [], captured: false };
  }
  function newId() {
    var bytes = new Uint8Array(16);
    (window.crypto || window.msCrypto).getRandomValues(bytes);
    var s = 'web-';
    for (var i = 0; i < bytes.length; i++) s += ('0' + bytes[i].toString(16)).slice(-2);
    return s;
  }
  function load() {
    try {
      var raw = window.sessionStorage.getItem(STORE_KEY);
      var s = raw ? JSON.parse(raw) : null;
      if (s && typeof s.conversationId === 'string' && Array.isArray(s.messages)) {
        s.notes = Array.isArray(s.notes) ? s.notes : [];
        return s;
      }
    } catch (e) { /* private mode / blocked storage — start fresh */ }
    return null;
  }
  function save() {
    try { window.sessionStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function track(name) {
    // No personal data — just that the chat was used (if the site has GA4).
    try { if (typeof window.gtag === 'function') window.gtag('event', name, { chat_site: SITE }); } catch (e) { /* ignore */ }
  }

  // ── network ────────────────────────────────────────────────────────────────
  function request(method, url, body) {
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS) : null;
    return fetch(url, {
      method: method,
      mode: 'cors',
      credentials: 'omit',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl ? ctrl.signal : undefined,
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (json) {
          if (timer) clearTimeout(timer);
          if (res.ok && json && json.success) return json.data;
          var err = new Error((json && json.error && json.error.message) || 'Something went wrong. Please try again.');
          err.status = res.status;
          err.code = json && json.error && json.error.code;
          throw err;
        });
      }, function (e) {
        if (timer) clearTimeout(timer);
        var err = new Error("We couldn't reach our team just now. Please check your connection and try again.");
        err.status = 0;
        err.cause = e;
        throw err;
      });
  }

  // ── DOM helpers ────────────────────────────────────────────────────────────
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
        if (k === 'text') n.textContent = attrs[k];
        else if (k === 'className') n.className = attrs[k];
        else n.setAttribute(k, attrs[k]);
      }
    }
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function svg(path) {
    var ns = 'http://www.w3.org/2000/svg';
    var s = document.createElementNS(ns, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('focusable', 'false');
    var p = document.createElementNS(ns, 'path');
    p.setAttribute('d', path);
    s.appendChild(p);
    return s;
  }
  var ICON_CHAT = 'M4 5h16v11H8l-4 4zM8 9h8M8 12h5';
  var ICON_CLOSE = 'M6 6l12 12M18 6L6 18';
  var ICON_SEND = 'M4 12l16-8-6 16-2-6z';
  var ICON_PHONE = 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z';

  // ── build ──────────────────────────────────────────────────────────────────
  function build() {
    // Hidden until its stylesheet has loaded (no flash of an unstyled button).
    var root = el('div', { className: 'mkc-root', id: 'makuta-chat', hidden: 'hidden' });
    ui.root = root;
    var link = el('link', { rel: 'stylesheet', href: CSS });
    link.addEventListener('load', function () { root.hidden = false; watchAvoid(); });
    link.addEventListener('error', teardown);
    document.head.appendChild(link);
    var panelId = 'mkc-panel';

    ui.launcher = el('button', {
      type: 'button', className: 'mkc-launcher', 'aria-controls': panelId, 'aria-expanded': 'false',
      'aria-label': 'Chat with us about ' + cfg.projectName,
    }, [svg(ICON_CHAT), el('span', { className: 'mkc-launcher-label', text: 'Ask us' })]);

    ui.title = el('h2', { className: 'mkc-title', id: 'mkc-title', text: cfg.projectName });
    ui.close = el('button', { type: 'button', className: 'mkc-icon-btn', 'aria-label': 'Close chat' }, [svg(ICON_CLOSE)]);
    var header = el('div', { className: 'mkc-header' }, [
      el('div', { className: 'mkc-heading' }, [ui.title, el('p', { className: 'mkc-sub', text: 'Automated assistant · Makuta Developers' })]),
      ui.close,
    ]);

    ui.log = el('div', { className: 'mkc-log', role: 'log', 'aria-live': 'polite', 'aria-relevant': 'additions', tabindex: '0' });
    ui.typing = el('div', { className: 'mkc-typing', 'aria-hidden': 'true', hidden: 'hidden' }, [el('span'), el('span'), el('span')]);
    ui.status = el('p', { className: 'mkc-status', role: 'status', hidden: 'hidden' });

    // Call-back form
    ui.cbToggle = el('button', { type: 'button', className: 'mkc-cb-toggle', 'aria-expanded': 'false', 'aria-controls': 'mkc-cb' },
      [svg(ICON_PHONE), el('span', { text: 'Request a call back' })]);
    ui.cbName = el('input', { id: 'mkc-cb-name', type: 'text', autocomplete: 'name', maxlength: '80', required: 'required' });
    ui.cbPhone = el('input', { id: 'mkc-cb-phone', type: 'tel', inputmode: 'tel', autocomplete: 'tel', maxlength: '16', required: 'required', placeholder: '10-digit mobile' });
    ui.cbConsent = el('input', { id: 'mkc-cb-consent', type: 'checkbox', required: 'required' });
    ui.cbError = el('p', { className: 'mkc-error', role: 'alert', hidden: 'hidden' });
    ui.cbSubmit = el('button', { type: 'submit', className: 'mkc-primary', text: 'Call me back' });
    ui.cbForm = el('form', { className: 'mkc-cb', id: 'mkc-cb', hidden: 'hidden', novalidate: 'novalidate' }, [
      el('label', { for: 'mkc-cb-name', text: 'Your name' }), ui.cbName,
      el('label', { for: 'mkc-cb-phone', text: 'Mobile number' }), ui.cbPhone,
      el('label', { className: 'mkc-consent', for: 'mkc-cb-consent' }, [ui.cbConsent, el('span', { text: cfg.consentText })]),
      ui.cbError,
      ui.cbSubmit,
    ]);

    // Composer
    ui.input = el('textarea', {
      className: 'mkc-input', rows: '1', maxlength: String(cfg.maxChars || 600),
      'aria-label': 'Type your question', placeholder: 'Type your question…',
    });
    ui.send = el('button', { type: 'submit', className: 'mkc-send', 'aria-label': 'Send' }, [svg(ICON_SEND)]);
    ui.composer = el('form', { className: 'mkc-composer' }, [ui.input, ui.send]);

    ui.panel = el('div', { className: 'mkc-panel', id: panelId, role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': 'mkc-title', hidden: 'hidden' }, [
      header,
      ui.log,
      ui.typing,
      ui.status,
      el('div', { className: 'mkc-cb-wrap' }, [ui.cbToggle, ui.cbForm]),
      ui.composer,
      el('p', { className: 'mkc-foot', text: 'Answers come from the project details our team has approved. Please confirm prices and offers with our team.' }),
    ]);

    root.appendChild(ui.panel);
    root.appendChild(ui.launcher);
    document.body.appendChild(root);

    ui.launcher.addEventListener('click', function () { setOpen(ui.panel.hidden); });
    ui.close.addEventListener('click', function () { setOpen(false); });
    // Escape closes (from the panel or the launcher) and returns focus to the launcher.
    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !ui.panel.hidden) { e.preventDefault(); setOpen(false); }
    });
    ui.composer.addEventListener('submit', function (e) { e.preventDefault(); sendMessage(); });
    ui.input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); sendMessage(); }
    });
    ui.input.addEventListener('input', autosize);
    ui.cbToggle.addEventListener('click', function () { showCallback(ui.cbForm.hidden); });
    ui.cbForm.addEventListener('submit', function (e) { e.preventDefault(); sendCallback(); });

    renderAll();
  }

  // ── keep the closed bubble off statutory text (data-avoid) ──────────────────
  var avoidQueued = false;
  function avoid() {
    avoidQueued = false;
    if (!AVOID || !ui.root || ui.root.hidden) return;
    var lift = 0;
    if (ui.panel.hidden) {
      // Measure where the bubble sits un-lifted (no transition on `bottom`, so this is exact).
      ui.root.style.setProperty('--mkc-lift', '0px');
      var lb = ui.launcher.getBoundingClientRect();
      var found;
      try { found = document.querySelectorAll(AVOID); } catch (e) { return; }
      for (var i = 0; i < found.length; i++) {
        var r = found[i].getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (r.left < lb.right && r.right > lb.left && r.top < lb.bottom && r.bottom > lb.top) {
          lift = Math.max(lift, Math.ceil(lb.bottom - r.top) + 12);
        }
      }
    }
    ui.root.style.setProperty('--mkc-lift', lift + 'px');
  }
  function queueAvoid() {
    if (avoidQueued) return;
    avoidQueued = true;
    window.requestAnimationFrame(avoid);
  }
  function watchAvoid() {
    if (!AVOID) return;
    window.addEventListener('scroll', queueAvoid, { passive: true });
    window.addEventListener('resize', queueAvoid);
    // Reveal animations move things without a scroll or resize.
    document.addEventListener('animationend', queueAvoid, true);
    document.addEventListener('transitionend', function (e) {
      if (!ui.root.contains(e.target)) queueAvoid();
    }, true);
    queueAvoid();
    var checks = 0;
    var timer = setInterval(function () { queueAvoid(); if (++checks >= 10) clearInterval(timer); }, 1000);
  }

  function autosize() {
    ui.input.style.height = 'auto';
    ui.input.style.height = Math.min(ui.input.scrollHeight, 120) + 'px';
  }

  function setOpen(open) {
    ui.panel.hidden = !open;
    avoid();
    ui.launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
    ui.launcher.classList.toggle('mkc-launcher-open', open);
    if (open) {
      track('makuta_chat_open');
      scrollDown();
      setTimeout(function () { (ui.input.disabled ? ui.cbToggle : ui.input).focus(); }, 30);
    } else {
      ui.launcher.focus();
    }
  }

  // ── rendering ──────────────────────────────────────────────────────────────
  function bubble(role, text) {
    var who = role === 'visitor' ? 'You' : role === 'note' ? 'Makuta' : cfg.projectName + ' assistant';
    return el('div', { className: 'mkc-msg mkc-' + role }, [
      el('span', { className: 'mkc-sr', text: who + ': ' }),
      el('p', { text: text }),
    ]);
  }

  function renderAll() {
    ui.log.textContent = '';
    ui.log.appendChild(bubble('assistant', cfg.welcome));
    // Messages and local notes, in the order they happened.
    var items = state.messages.map(function (m, i) { return { at: i, role: m.role, text: m.text }; });
    state.notes.forEach(function (n) { items.push({ at: n.after - 0.5, role: 'note', text: n.text }); });
    items.sort(function (a, b) { return a.at - b.at; });
    items.forEach(function (m) { ui.log.appendChild(bubble(m.role, m.text)); });
    refreshControls();
    scrollDown();
  }

  function addNote(text) {
    state.notes.push({ after: state.messages.length, text: text });
    save();
    ui.log.appendChild(bubble('note', text));
    scrollDown();
  }

  function scrollDown() {
    ui.log.scrollTop = ui.log.scrollHeight;
  }

  function visitorTurns() {
    return state.messages.filter(function (m) { return m.role === 'visitor'; }).length;
  }

  function refreshControls() {
    var full = visitorTurns() >= (cfg.maxTurns || 20);
    ui.input.disabled = busy || full;
    ui.send.disabled = busy || full;
    ui.input.placeholder = full ? 'This chat has reached its limit — request a call back' : 'Type your question…';
    ui.typing.hidden = !busy;
    if (state.captured) {
      ui.cbToggle.disabled = true;
      ui.cbToggle.lastChild.textContent = 'Call back requested';
      ui.cbForm.hidden = true;
    }
  }

  function setStatus(text) {
    ui.status.textContent = text || '';
    ui.status.hidden = !text;
  }

  function showCallback(show, phone) {
    if (state.captured) return;
    ui.cbForm.hidden = !show;
    ui.cbToggle.setAttribute('aria-expanded', show ? 'true' : 'false');
    if (show) {
      if (phone && !ui.cbPhone.value) ui.cbPhone.value = phone;
      setTimeout(function () { (ui.cbName.value ? ui.cbPhone : ui.cbName).focus(); }, 30);
      scrollDown();
    }
  }

  // ── sending ────────────────────────────────────────────────────────────────
  function history() {
    return state.messages.map(function (m) {
      return m.role === 'assistant' ? { role: 'assistant', text: m.text, sig: m.sig } : { role: 'visitor', text: m.text };
    });
  }

  var PHONE_IN_TEXT = /(?:\+?91[\s-]?)?0?([6-9]\d{4}[\s-]?\d{5})\b/;

  function sendMessage() {
    var text = ui.input.value.replace(/\s+$/, '').replace(/^\s+/, '');
    if (!text || busy) return;
    var limit = cfg.maxChars || 600;
    if (text.length > limit) text = text.slice(0, limit);
    var typedPhone = PHONE_IN_TEXT.exec(text);

    state.messages.push({ role: 'visitor', text: text });
    save();
    ui.log.appendChild(bubble('visitor', text));
    ui.input.value = '';
    autosize();
    busy = true;
    setStatus('');
    refreshControls();
    scrollDown();
    track('makuta_chat_message');

    // A number typed in the chat is never used without consent: open the form with it.
    if (typedPhone && !state.captured) showCallback(true, typedPhone[1].replace(/[\s-]/g, ''));

    request('POST', BASE, { conversationId: state.conversationId, messages: history() })
      .then(function (data) {
        busy = false;
        if (data && data.reply) {
          state.messages.push({ role: 'assistant', text: data.reply.text, sig: data.reply.sig });
          save();
          ui.log.appendChild(bubble('assistant', data.reply.text));
        }
        refreshControls();
        scrollDown();
      }, function (err) {
        busy = false;
        if (err.code === 'INVALID_HISTORY') {
          state = fresh();
          save();
          renderAll();
          setStatus('This chat had to restart. Please ask your question again.');
          ui.input.value = text;
          return;
        }
        if (err.status === 404) { teardown(); return; }
        // Not answered — take the message back so it can be sent again.
        state.messages.pop();
        save();
        renderAll();
        ui.input.value = text;
        autosize();
        setStatus(err.message);
        if (err.code === 'TURN_LIMIT' || err.code === 'SITE_CHAT_DAILY_CAP') showCallback(true);
        refreshControls();
      });
  }

  function normalisePhone(raw) {
    var d = String(raw).replace(/\D/g, '');
    if (d.length === 12 && d.indexOf('91') === 0) d = d.slice(2);
    else if (d.length === 11 && d.charAt(0) === '0') d = d.slice(1);
    return /^[6-9]\d{9}$/.test(d) ? d : null;
  }

  function cbError(text) {
    ui.cbError.textContent = text || '';
    ui.cbError.hidden = !text;
  }

  function sendCallback() {
    if (busy) return;
    var name = ui.cbName.value.replace(/\s+/g, ' ').trim();
    var phone = normalisePhone(ui.cbPhone.value);
    if (name.length < 2) { cbError('Please enter your name.'); ui.cbName.focus(); return; }
    if (!phone) { cbError('Please enter a 10-digit Indian mobile number.'); ui.cbPhone.focus(); return; }
    if (!ui.cbConsent.checked) { cbError('Please tick the box so our team may call you.'); ui.cbConsent.focus(); return; }
    cbError('');
    busy = true;
    ui.cbSubmit.disabled = true;
    refreshControls();

    request('POST', BASE, {
      conversationId: state.conversationId,
      messages: history(),
      visitor: { name: name, phone: phone, consent: true },
    }).then(function () {
      busy = false;
      ui.cbSubmit.disabled = false;
      state.captured = true;
      save();
      showCallback(false);
      addNote('Thank you, ' + name.split(' ')[0] + '! Our team will call you on ' + phone.slice(0, 2) + '••••••' + phone.slice(-2) + ' soon.');
      refreshControls();
      track('makuta_chat_callback');
    }, function (err) {
      busy = false;
      ui.cbSubmit.disabled = false;
      if (err.status === 404) { teardown(); return; }
      if (err.code === 'INVALID_HISTORY') {
        // Keep the request: start a clean chat and send the form alone.
        state = fresh();
        save();
        renderAll();
        sendCallback();
        return;
      }
      cbError(err.message);
      refreshControls();
    });
  }

  function teardown() {
    var root = document.getElementById('makuta-chat');
    if (root && root.parentNode) root.parentNode.removeChild(root);
  }

  // ── start ──────────────────────────────────────────────────────────────────
  function start() {
    request('GET', BASE + '/config')
      .then(function (data) {
        if (!data || data.enabled !== true || !data.welcome || !data.projectName) return; // switched off → nothing at all
        cfg = data;
        if (!cfg.consentText) cfg.consentText = 'I agree that Makuta Developers may call me about ' + cfg.projectName + '.';
        build();
      }, function () { /* unreachable or refused → render nothing */ });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
