# WhatsApp templates (api-wa.co)

All WhatsApp Business messages the site sends go through **api-wa.co** and must use a
**pre-approved template**. This file lists every template the site expects, the exact
placeholder order, and the env var that names it.

Credentials are shared across all sends (set once on the Pages project, encrypted):

| Env var | Purpose |
|---|---|
| `WA_PROJECT_ID` | api-wa.co project id (URL path segment) |
| `WA_API_PWD` | project API password (`X-API-WA-Project-API-Pwd` header) |
| `WA_TPL_LANG` | template language code, defaults `en` |

---

## 1. Brochure enquiry → sent to the **lead**
Sent by `functions/api/whatsapp.js` when a visitor requests the brochure.

| Env var | Purpose |
|---|---|
| `WA_TPL_BROCHURE` | approved template name |
| `WA_IMG_BROCHURE` | _(optional)_ header image URL, if the template has an image header |

- **Body params:** `{{1}}` = customer name.

## 2. Price-sheet enquiry → sent to the **lead**
Same handler, `kind: 'price'`. Falls back to the brochure template/image if unset.

| Env var | Purpose |
|---|---|
| `WA_TPL_PRICE` | _(optional)_ template name; falls back to `WA_TPL_BROCHURE` |
| `WA_IMG_PRICE` | _(optional)_ header image URL; falls back to `WA_IMG_BROCHURE` |

- **Body params:** `{{1}}` = customer name.

---

## 3. Lead-failure alert → sent to the **sales team** (secondary capture)
Sent by `functions/api/lead.js` **only when the Clove CRM write fails** (down / 500 /
network error). Because the site now shows the thank-you optimistically, this guarantees
the enquiry still reaches a human even if Clove drops it.

| Env var | Purpose |
|---|---|
| `WA_ALERT_TO` | sales number to notify — country code + number, **no `+`** (e.g. `919059676464`) |
| `WA_TPL_LEAD_ALERT` | approved template name (4 body params, below) |

- **Body params (order matters):**
  - `{{1}}` = lead name
  - `{{2}}` = phone
  - `{{3}}` = email
  - `{{4}}` = interest / message

### Suggested template text to submit for approval
> ⚠️ New Taranga enquiry (Clove did not capture it — save manually)
> Name: {{1}}
> Phone: {{2}}
> Email: {{3}}
> Interest: {{4}}

If any of `WA_PROJECT_ID`, `WA_API_PWD`, `WA_ALERT_TO`, `WA_TPL_LEAD_ALERT` is unset, the
alert is skipped silently — the lead flow (and Clove's real status code to the browser) is
never affected.
