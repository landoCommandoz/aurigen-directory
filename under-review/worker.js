// Platbook "under review" page. Replaces the live `aurigen` Worker while the law audit runs.
// Every path gets the same page with HTTP 503 so search engines treat it as temporary.
// Deployed and removed by .github/workflows/aurigen-site.yml. Runs on the Workers Free plan.
// /status.json serves the repo's STATUS.md (built by make-status.mjs at deploy time; see status-publish.yml).

import STATUS from "./status.json" with { type: "json" };
import { handleSheet, homeFooterLink } from "./sheet.js";

const PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Platbook: under review</title>
<style>
  :root { --bg: #f3ebdc; --ink: #10222f; --muted: #4a5863; --accent: #0b3550; }
  html, body { margin: 0; background: var(--bg); color: var(--ink); }
  body { font: 18px/1.6 "Public Sans", "Segoe UI", "Helvetica Neue", sans-serif; }
  main { max-width: 34rem; padding: 18vh 16px 16px; margin: 0 auto; }
  h1 { font-family: Fraunces, "Hoefler Text", Georgia, serif; font-size: 1.7rem; font-weight: 600; margin: 0 0 .75rem; color: var(--accent); }
  p { margin: 0; color: var(--muted); }
  footer { max-width: 34rem; padding: 2rem 16px; margin: 0 auto; font-size: .9rem; }
  footer a { color: var(--muted); }
</style>
</head>
<body>
<main>
  <h1>Platbook is under review.</h1>
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
    return new Response(PAGE.replace("__SHEET_LINK__", homeFooterLink()), {
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
