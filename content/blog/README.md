# Blog content

Each `.md` file in this folder is one blog post. The filename (minus `.md`)
becomes the URL slug, e.g. `welcome-to-makuta-taranga.md` → `/blog/welcome-to-makuta-taranga/`.

You normally **don't edit these by hand** — use the visual editor at `/admin`.
But the format is simple if you ever need to:

```markdown
---
title: "Your headline"               # also used as the SEO <title>
description: "150-char meta summary"  # used as the SEO meta description + OG
date: "2026-06-30"                    # YYYY-MM-DD, controls ordering
author: "Makuta Developers"
cover: "/assets/img/blog/your-image.jpg"  # OG image + card image
tags: ["Project Updates"]
draft: false                          # true = hidden from the live site
---

Your post body in **Markdown**. Headings, lists, links, images, quotes.
```

Posts with `draft: true` are skipped at build time and never appear live.
