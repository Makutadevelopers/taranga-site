// Cloudflare Pages Function — step 2 of the Decap CMS GitHub login.
// GitHub redirects here with `?code=...`. We exchange the code for an access
// token, then hand it back to the CMS popup via window.postMessage in the exact
// `authorization:github:success:{...}` envelope Decap listens for, and close.

function page(status, payload, origin) {
  // Decap/Netlify CMS popup handshake (order matters):
  //   1. popup posts 'authorizing:github' to the opener,
  //   2. opener registers its success listener and posts a message back,
  //   3. THEN the popup posts 'authorization:github:success:{...}' with the token.
  // Sending the token before step 2 (as we did before) leaves the CMS stuck on the
  // login screen. The token goes to e.origin — the opener's real origin, which is
  // our own /admin (same-origin), so a foreign opener can't capture a repo token.
  const message = JSON.stringify(`authorization:github:${status}:${JSON.stringify(payload)}`);
  const body = `<!doctype html><html><body><script>
    (function () {
      var message = ${message};
      function receive(e){
        if (!e.data || String(e.data).indexOf('authorizing:github') !== 0) return;
        window.removeEventListener('message', receive, false);
        e.source.postMessage(message, e.origin);
      }
      window.addEventListener('message', receive, false);
      window.opener && window.opener.postMessage('authorizing:github', '*');
    })();
  </script><p>Completing sign-in… you can close this window.</p></body></html>`;
  return new Response(body, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'Set-Cookie': 'oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
}

export async function onRequestGet({ request, env }) {
  const clientId = env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = env.GITHUB_OAUTH_CLIENT_SECRET;
  const url = new URL(request.url);
  const origin = url.origin;
  if (!clientId || !clientSecret) {
    return new Response('GitHub OAuth env vars not set', { status: 500 });
  }

  // CSRF check: the state GitHub echoes back must match the cookie auth.js set.
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = request.headers.get('Cookie') || '';
  const expected = /(?:^|;\s*)oauth_state=([^;]+)/.exec(cookie);
  if (!state || !expected || state !== expected[1]) {
    return page('error', { message: 'Invalid or missing OAuth state' }, origin);
  }
  if (!code) return page('error', { message: 'No code returned from GitHub' }, origin);

  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await res.json();
    if (data.error || !data.access_token) {
      return page('error', { message: data.error_description || data.error || 'Token exchange failed' }, origin);
    }
    return page('success', { token: data.access_token, provider: 'github' }, origin);
  } catch (e) {
    return page('error', { message: 'Token exchange request failed' }, origin);
  }
}
