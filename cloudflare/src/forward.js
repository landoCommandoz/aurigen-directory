// The old address, kept alive. This Worker keeps the name `aurigen`, so
// https://aurigen.landonbrewington12.workers.dev goes on answering after the site itself
// was renamed to `platbook`. Every request is sent to the same path on the new address,
// so a link someone already shared — /state/fl/, /rules-sheet/, /status.json, anything —
// lands on the matching page rather than on a home page or a 404.
//
// 301 (permanent) so search engines move their index across and browsers stop asking.
// Query string and hash come along; the hash never reaches the server, the browser keeps it.
// Costs nothing: Workers Free plan, no assets, no bindings.
const NEW_ORIGIN = "https://platbook.landonbrewington12.workers.dev";

export default {
  async fetch(request) {
    const from = new URL(request.url);
    const to = new URL(NEW_ORIGIN);
    to.pathname = from.pathname;
    to.search = from.search;
    return new Response(null, {
      status: 301,
      headers: {
        location: to.toString(),
        "cache-control": "public, max-age=3600",
        // Nothing here should ever be indexed under the old name.
        "x-robots-tag": "noindex",
      },
    });
  },
};
