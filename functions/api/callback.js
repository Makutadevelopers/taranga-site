// Cloudflare Pages Function — step 2 of the Decap CMS GitHub login.
// GitHub redirects here with `?code=...`. We exchange the code for an access
// token, then hand it back to the CMS popup via window.postMessage in the exact
// `authorization:github:success:{...}` envelope Decap listens for, and close.

function page(status, payload, origin) {
  // Post the token ONLY to our own origin (the CMS runs same-origin at /admin),
  // never '*', so a malicious opener on another origin can't capture a repo-scoped
  // token. Also clear the one-time CSRF state cookie.
  const target = JSON.stringify(origin || '*');
  const body = `<!doctype html><html><body><script>
    (function () {
      function send(){
        window.opener && window.opener.postMessage(
          'authorization:github:${status}:${JSON.stringify(payload)}',
          ${target}
        );
      }
      window.addEventListener('message', send, false);
      send();
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
