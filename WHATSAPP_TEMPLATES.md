# WhatsApp templates (api-wa.co)

Every WhatsApp Business message the site sends goes through **api-wa.co** and must use a
**pre-approved template**. This file lists the templates the site expects, the exact
placeholder order, and the env var that names each one.

Credentials are shared across all sends (set once on the Pages project):

| Env var | Purpose |
|---|---|
| `WA_PROJECT_ID` | api-wa.co project id (URL path segment) |
| `WA_API_PWD` | project API password (`X-API-WA-Project-API-Pwd` header) — **store as Secret, not Plaintext** |
| `WA_TPL_LANG` | template language code, defaults `en` — must match the language the template was approved under (`en` vs `en_US`), or every send is rejected |

---

## Brochure / price-sheet enquiry → sent to the **lead**

Sent by `functions/api/whatsapp.js` when a visitor submits the brochure or price-sheet
modal. Both currently use the same approved template, `taranga_website`.

| Env var | Value | Purpose |
|---|---|---|
| `WA_TPL_BROCHURE` | `taranga_website` | template sent on a brochure enquiry |
| `WA_TPL_PRICE` | `taranga_website` | template sent on a price-sheet enquiry; falls back to `WA_TPL_BROCHURE` if unset |
| `WA_IMG_BROCHURE` / `WA_IMG_PRICE` | _(unset)_ | header image URL — **only** set these if the template actually has an image header |

- **Body params:** `{{1}}` = customer name.
- **Buttons:** quick replies (Brochure / Floor Plans / Price sheet). A quick-reply tap sends
  a message back to the business number — it does **not** deliver a file on its own. An
  api-wa.co auto-reply flow (or a human) has to respond with the PDF.

> ⚠️ Do not set `WA_IMG_*` unless the template has an image header. `whatsapp.js` attaches a
> header component whenever they are set, and Meta rejects the whole message if the template
> has no header — the send is fire-and-forget, so the customer gets nothing and the site
> still shows the thank-you.

---

## Sales alerts

The site does **not** send a WhatsApp alert to the sales team. Leads are captured in Clove
via `/api/lead`; that is the only notification path.
