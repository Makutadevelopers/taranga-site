// Cloudflare Pages Function — step 2 of the Decap CMS GitHub login.
// GitHub redirects here with `?code=...`. We exchange the code for an access
// token, then hand it back to the CMS popup via window.postMessage in the exact
// `authorization:github:success:{...}` envelope Decap listens for, and close.

function page(status, payload) {
  const body = `<!doctype html><html><body><script>
    (function () {
      function send(){
        window.opener && window.opener.postMessage(
          'authorization:github:${status}:${JSON.stringify(payload)}',
          '*'
        );
      }
      window.addEventListener('message', send, false);
      send();
    })();
  </script><p>Completing sign-in… you can close this window.</p></body></html>`;
  return new Response(body, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}

export async function onRequestGet({ request, env }) {
  const clientId = env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return new Response('GitHub OAuth env vars not set', { status: 500 });
  }

  const code = new URL(request.url).searchParams.get('code');
  if (!code) return page('error', { message: 'No code returned from GitHub' });

  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await res.json();
    if (data.error || !data.access_token) {
      return page('error', { message: data.error_description || data.error || 'Token exchange failed' });
    }
    return page('success', { token: data.access_token, provider: 'github' });
  } catch (e) {
    return page('error', { message: 'Token exchange request failed' });
  }
}
