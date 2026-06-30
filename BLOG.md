# Blog / Journal — how it works

The blog lives at **`/blog/`**. Each post is one Markdown file in
[`content/blog/`](content/blog/). Posts are written through a visual editor at
**`/admin`** — no code, no developer needed per post.

Publishing flow:

```
SEO author writes a post at /admin
        │  clicks Publish
        ▼
Decap CMS commits a .md file to content/blog/ on GitHub (branch: main)
        ▼
Existing GitHub Action builds the site and deploys to Cloudflare Pages
        ▼
Post is live at /blog/<slug>/  (also auto-added to sitemap.xml)
```

---

## One-time setup (do this once)

The visual editor signs authors in with GitHub. That needs a GitHub OAuth App
plus two secrets on the Cloudflare Pages project. ~5 minutes.

### 1. Create a GitHub OAuth App

GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
(for an org repo, do this under the **Makutadevelopers** org settings).

| Field | Value |
|---|---|
| Application name | `Makuta Taranga CMS` |
| Homepage URL | `https://taranga-site.pages.dev` |
| Authorization callback URL | `https://taranga-site.pages.dev/api/callback` |

Click **Register**, then **Generate a new client secret**. Keep the
**Client ID** and **Client Secret** handy.

> When the custom domain (`www.makutataranga.com`) goes live, update the two
> URLs above to the new domain, and update `base_url` in
> [`public/admin/config.yml`](public/admin/config.yml).

### 2. Add the secrets to Cloudflare Pages

Cloudflare dashboard → **Workers & Pages → taranga-site → Settings →
Environment variables** (Production). Add both as **encrypted**:

| Name | Value |
|---|---|
| `GITHUB_OAUTH_CLIENT_ID` | the Client ID from step 1 |
| `GITHUB_OAUTH_CLIENT_SECRET` | the Client Secret from step 1 |

Redeploy (or push any commit) so the Functions pick up the new vars.

### 3. Give the SEO author repo access

In GitHub, make sure the author is a **collaborator with write access** to
`Makutadevelopers/taranga-site` (org → repo → Settings → Collaborators, or via
a team). Decap commits *as that signed-in user*.

That's it. The author now goes to `https://taranga-site.pages.dev/admin`,
clicks **Login with GitHub**, and starts writing.

---

## Writing a post (for the SEO author)

1. Go to `https://taranga-site.pages.dev/admin` and log in with GitHub.
2. **Journal Posts → New Post.**
3. Fill in:
   - **Title** — also becomes the SEO `<title>`.
   - **Meta description** — the Google snippet + social-share text (40–170 chars).
   - **Publish date**, **Author**.
   - **Cover image** — drag-drop; also used as the social-share image.
   - **Tags**, **Body** (rich Markdown editor — headings, links, images, quotes).
4. Click **Publish → Publish now.**
5. Wait ~1–2 minutes for the auto-deploy. The post is live at
   `/blog/<slug>/`, shows on the `/blog/` list, and is in the sitemap.

To **unpublish**, edit the post and toggle **Draft = on** (or delete it in the
editor) and publish again.

---

## What each piece is (for developers)

| Path | Role |
|---|---|
| `content/blog/*.md` | the posts (frontmatter + Markdown body) |
| `lib/blog.js` | reads + parses posts at build time |
| `app/blog/page.jsx` | the `/blog/` listing |
| `app/blog/[slug]/page.jsx` | a single post — per-post SEO meta + BlogPosting JSON-LD |
| `app/sitemap.js` | generates `sitemap.xml`, posts included automatically |
| `public/admin/` | Decap CMS (the `/admin` editor) + its `config.yml` |
| `functions/api/auth.js` + `callback.js` | GitHub OAuth handshake for the editor |

No build-config changes are needed to add posts — only content.
