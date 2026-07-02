// Cloudflare Pages Function — step 1 of the Decap CMS GitHub login.
// The CMS at /admin opens this URL in a popup; we bounce the editor to GitHub's
// OAuth consent screen. GitHub then redirects back to /api/callback with a code.
//
// Required env vars on the Pages project (Settings → Environment variables, encrypted):
//   GITHUB_OAUTH_CLIENT_ID      — from the GitHub OAuth App
//   GITHUB_OAUTH_CLIENT_SECRET  — from the GitHub OAuth App (used by callback.js)
//
// The OAuth App's "Authorization callback URL" must be:  https://<your-site>/api/callback

export async function onRequestGet({ request, env }) {
  const clientId = env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) return new Response('GITHUB_OAUTH_CLIENT_ID not set', { status: 500 });

  const origin = new URL(request.url).origin;
  // CSRF guard: mint a state token, send it to GitHub AND stash it in an HttpOnly
  // cookie. callback.js compares the two — a forged callback without the matching
  // cookie is rejected. SameSite=Lax lets the cookie ride the top-level redirect back.
  const state = crypto.randomUUID();
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', `${origin}/api/callback`);
  // `repo` scope lets the CMS commit Markdown to the repository on the author's behalf.
  authUrl.searchParams.set('scope', 'repo');
  authUrl.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl.toString(),
      'Set-Cookie': `oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}
