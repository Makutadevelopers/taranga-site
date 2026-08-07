/**
 * Makuta Taranga — lead backup sheet (Google Apps Script)
 * ---------------------------------------------------------------------------
 * Appends one row per website lead, so Clove is no longer the ONLY copy of an
 * enquiry. Rows are written whether or not Clove accepted the lead — a lead the
 * CRM rejected is exactly the one you most need to recover, so the "Delivered
 * to CRM" column records the outcome instead of the row being skipped.
 *
 * SETUP (once, ~5 minutes)
 *   1. Create a Google Sheet. Name it something like "Taranga — Website Leads".
 *   2. Extensions → Apps Script. Delete the placeholder, paste this file in.
 *   3. Change SECRET below to a long random string. Keep it — you'll paste the
 *      same value into Cloudflare in step 6.
 *   4. Deploy → New deployment → type "Web app".
 *        Execute as:       Me
 *        Who has access:   Anyone
 *      ("Anyone" means anyone with the URL can POST. The SECRET check below is
 *      what actually protects it, which is why it must not be guessable.)
 *   5. Authorise when prompted, then copy the /exec deployment URL.
 *   6. Cloudflare Pages → Settings → Environment variables, add:
 *        SHEET_WEBHOOK_URL = the /exec URL from step 5
 *        SHEET_SECRET      = the SECRET from step 3
 *      Then REDEPLOY — Pages env vars do not take effect until you do.
 *
 * IMPORTANT: this sheet holds customer names, phone numbers and email
 * addresses. Share it with named people only — never "anyone with the link".
 *
 * AFTER EDITING THIS FILE: Deploy → Manage deployments → edit → New version.
 * Saving alone does not update the live web app.
 */

var SECRET = 'CHANGE_ME_TO_A_LONG_RANDOM_STRING';
var SHEET_NAME = 'Leads';
var TIMEZONE = 'Asia/Kolkata';

var HEADERS = [
  'Received',
  'Name',
  'Phone',
  'Email',
  'Channel',
  'Source detail',
  'Campaign',
  'Interest',
  'First page',
  'Unit',
  'Delivered to CRM',
  'Full note'
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return reply_({ error: 'empty body' });

    var body;
    try {
      body = JSON.parse(e.postData.contents);
    } catch (err) {
      return reply_({ error: 'invalid json' });
    }

    // The deployment URL is effectively public, so this shared secret is the only
    // thing standing between a stranger and your sheet.
    if (SECRET === 'CHANGE_ME_TO_A_LONG_RANDOM_STRING') return reply_({ error: 'secret not set' });
    if (!body.secret || body.secret !== SECRET) return reply_({ error: 'forbidden' });

    var row = [
      body.received || Utilities.formatDate(new Date(), TIMEZONE, 'd MMM yyyy, h:mm a'),
      body.name || '',
      body.phone || '',
      body.email || '',
      body.channel || '',
      body.detail || '',
      body.campaign || '',
      body.interest || '',
      body.page || '',
      body.unit || '',
      body.delivered || '',
      body.note || ''
    ];

    // Two forms submitted at once would otherwise race for the same row.
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      sheet_().appendRow(row);
    } finally {
      lock.releaseLock();
    }

    return reply_({ ok: true });
  } catch (err) {
    return reply_({ error: String(err) });
  }
}

/** The target sheet, created with a frozen header row on first use. */
function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 160); // Received
    sh.setColumnWidth(12, 420); // Full note
  }
  return sh;
}

function reply_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run this once from the Apps Script editor (Run → testAppend) to confirm the
 * sheet and headers are created correctly before wiring Cloudflare up to it.
 * Delete the test row afterwards.
 */
function testAppend() {
  sheet_().appendRow([
    Utilities.formatDate(new Date(), TIMEZONE, 'd MMM yyyy, h:mm a'),
    'Test Lead', '+919876543210', 'test@example.com',
    'Google Ads', 'Google', 'test-campaign', 'Brochure',
    'Home page', '', 'Yes — test row, safe to delete', ''
  ]);
}
