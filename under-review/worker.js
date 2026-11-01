// Aurigen "under review" page. Replaces the live `aurigen` Worker while the law audit runs.
// Every path gets the same page with HTTP 503 so search engines treat it as temporary.
// Deployed and removed by .github/workflows/aurigen-site.yml. Runs on the Workers Free plan.
// /status.json serves the repo's STATUS.md (built by make-status.mjs at deploy time; see status-publish.yml).

import STATUS from "./status.json" with { type: "json" };
import { handleSheet, listed } from "./sheet.js";

const PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Aurigen: under review</title>
<style>
  :root { --bg: #f4f1ea; --ink: #1d232b; --muted: #4a525c; }
  html, body { margin: 0; background: var(--bg); color: var(--ink); }
  body { font: 18px/1.5 Georgia, "Times New Roman", serif; }
  main { max-width: 34rem; padding: 18vh 16px 16px; margin: 0 auto; }
  h1 { font-size: 1.6rem; font-weight: normal; margin: 0 0 .75rem; }
  p { margin: 0; color: var(--muted); }
  footer { max-width: 34rem; padding: 2rem 16px; margin: 0 auto; font-size: .9rem; }
  footer a { color: var(--muted); }
</style>
</head>
<body>
<main>
  <h1>Aurigen is under review.</h1>
  <p>Every state's rules are being re-checked against current law.</p>
</main>
<footer><a href="/status.json">Status</a>__SHEET_LINK__</footer>
</body>
</html>`;

export default {
  async fetch(request, env) {
    const sheet = await handleSheet(request, env || {});
    if (sheet) return sheet;
    if (new URL(request.url).pathname === "/status.json") {
      return new Response(JSON.stringify(STATUS, null, 1) + "\n", {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
          "access-control-allow-origin": "*",
          "x-robots-tag": "noindex",
        },
      });
    }
    return new Response(PAGE.replace("__SHEET_LINK__", listed() ? ' &middot; <a href="/rules-sheet/">Rules Sheet</a>' : ""), {
      status: 503,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        "retry-after": "86400",
        "x-robots-tag": "noindex",
      },
    });
  },
};
