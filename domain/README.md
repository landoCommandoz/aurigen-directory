# aurigendirectory.com: move it to Cloudflare, then attach it to the Worker

> **PARKED — 2026-11-08. Do not plan around this domain.** Lando: "I can't change
> aurigendirectory.com right now, because it's locked behind an account I can't reach.
> Don't plan around it. The platbook address is permanent until we buy a new domain."
> Everything below is kept for the day a domain is bought. Until then
> `platbook.landonbrewington12.workers.dev` is the permanent address, and the Worker these
> steps would attach to is now called `platbook`, not `aurigen`.

Domain: aurigendirectory.com. Registrar: Name.com (paid through 2027-03-24). Today it uses Name.com's own nameservers
(ns1kpv.name.com, ns2kry.name.com, ns3jmt.name.com, ns4dmx.name.com) and shows a parking page. It has no email (no MX
records), so changing the nameservers cannot break any mail.

## Step 0: add the domain to Cloudflare (1 minute, free plan)
The Cloudflare token stored for this repo can read zones but is not allowed to create one (Cloudflare answered: it needs the
permission "com.cloudflare.api.account.zone.create"), so the "Domain zone" workflow could not do this step. Do it in the
dashboard: https://dash.cloudflare.com, Add a domain, type aurigendirectory.com, choose the Free plan, continue. Cloudflare then
shows the two nameservers for this domain (names like something.ns.cloudflare.com). Cloudflare assigns them when the domain is
added, so they cannot be known before this step. Use exactly those two.
(Alternative: give the stored token the permission to create zones, then run "Domain zone" in GitHub Actions; it reads the two
nameservers back and saves them to `domain/NAMESERVERS.md`. After the domain exists in the account the workflow can always do
that read, so you can also run it after the dashboard step to get the file.)

The "Domain attach" step also needs the stored token to be allowed to edit Workers custom domains and DNS for this zone
(zone permissions "Workers Routes: Edit" and "DNS: Edit", plus "Zone: Read"). If it is not, the attach run stops and the log
names the missing permission; nothing is changed.

## At the registrar (Name.com), about 5 minutes
1. Sign in at https://www.name.com and open My Account, then Domains, then aurigendirectory.com.
2. If DNSSEC is switched on for the domain, switch it off first (DNSSEC tab, remove the DS record). Cloudflare turns its own on later if you want it.
3. Open Nameservers (Manage). Replace the four Name.com nameservers with exactly the two Cloudflare showed you in step 0. Save.
4. Wait. Cloudflare emails when the domain is active; it is usually minutes to a few hours, at most about a day.
   You can also watch it at https://dash.cloudflare.com (Websites, aurigendirectory.com: "Active").

## Then, one command
In GitHub: Actions, "Domain attach", Run workflow (no inputs). It
- stops with a plain message if the zone is not active yet and changes nothing;
- checks the live site is still the under-review Worker (a restored full site is never overwritten);
- runs the tests, deploys the Worker with the custom domain `aurigendirectory.com` and `www.aurigendirectory.com`;
- checks that the home page, `/status.json` and `/rules-sheet/` answer on `https://aurigendirectory.com`, on `https://www.aurigendirectory.com` and on `https://aurigen.landonbrewington12.workers.dev`;
- records `under-review/domain.enabled`, so every later deploy keeps the domain.

The workers.dev address keeps working too. The sheet's checkout success link still points at the workers.dev address; change
`successUrl` in `polar/rules-sheet.json` to the new address after the domain is attached if you want buyers to land on it
(the Polar sheet workflow reuses the existing link, so edit the link in Polar or ask for a new one).

## If you restore the full site later
`cloudflare/wrangler.jsonc` has no custom domain. Add the same `routes` block that is in `under-review/wrangler.domain.jsonc`
to it before restoring, or the domain stops answering when the full site replaces the under-review Worker.
