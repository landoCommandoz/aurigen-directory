# aurigendirectory.com: move it to Cloudflare, then attach it to the Worker

Domain: aurigendirectory.com. Registrar: Name.com (paid through 2027-03-24). Today it uses Name.com's own nameservers
(ns1kpv.name.com, ns2kry.name.com, ns3jmt.name.com, ns4dmx.name.com) and shows a parking page. It has no email (no MX
records), so changing the nameservers cannot break any mail.

The two Cloudflare nameservers for this domain are in `domain/NAMESERVERS.md` (written by the "Domain zone" workflow
after it added the domain to the free Cloudflare plan).

## At the registrar (Name.com), about 5 minutes
1. Sign in at https://www.name.com and open My Account, then Domains, then aurigendirectory.com.
2. If DNSSEC is switched on for the domain, switch it off first (DNSSEC tab, remove the DS record). Cloudflare turns its own on later if you want it.
3. Open Nameservers (Manage). Replace the four Name.com nameservers with exactly the two listed in `domain/NAMESERVERS.md`. Save.
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
