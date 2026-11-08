# Domain: theplatbook.com (and the abandoned one)

**The live domain is https://theplatbook.com.** Lando bought it on 2026-11-08 in the same
Cloudflare account and attached it to the `platbook` Worker in the dashboard; the same day it
was written into `cloudflare/wrangler.jsonc` and `under-review/wrangler.jsonc` so that every
later publish re-attaches it. A Worker deploy replaces the whole trigger set, so a config
without those lines would quietly pull the domain off the site.

`www.theplatbook.com` is attached to the same Worker for one reason only: so the Worker can
301 it to the apex. The same redirect catches `platbook.landonbrewington12.workers.dev` and
anything else. It lives in `canonicalRedirect()` in `cloudflare/src/worker.js` and is tested in
`under-review/test/canonical.test.mjs`.

The separate `aurigen` Worker (`forward/`) still answers the very first address and 301s it
here too; redeploy it from the `forward/aurigen-redirect` branch.

---

## aurigendirectory.com — abandoned 2026-11-08

Lando: "I can't change aurigendirectory.com right now, because it's locked behind an account I
can't reach." theplatbook.com replaced it, so nothing is waiting on it any more. The old
step-by-step move-to-Cloudflare instructions were deleted rather than left to be followed by
mistake. What is worth keeping:

- It is registered at Name.com, paid through 2027-03-24, parked, with no MX records.
- The stored Cloudflare token can read zones but cannot create one; creating a zone needs the
  permission `com.cloudflare.api.account.zone.create`. Attaching a domain to a Worker needs
  zone `Workers Routes: Edit`, `DNS: Edit` and `Zone: Read`.
- `.github/workflows/domain-zone.yml` and `domain-attach.yml` were written for that domain and
  are now dead. They cannot be deleted from this machine (no `workflow` token scope), so
  `under-review/wrangler.domain.jsonc` was repointed at theplatbook.com: if anyone ever runs
  Domain attach, it can no longer detach the live domain.
