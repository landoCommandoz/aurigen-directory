# Sources ledger

Every outside source the site or its refresh uses, with its robots.txt / terms status and the date checked.
Rule: public data only, no logins, no CAPTCHAs, no paywalls, no rate-limit dodging, User-Agent
`AurigenDirectory/2.0 (+https://aurigen.landonbrewington12.workers.dev)`, never store owner names.

## Used by the live site and build

| Source | Used for | robots.txt / terms | Checked |
|---|---|---|---|
| Repo data files (`states-en.js`, `states-es.js`, `states-data-v2.js`, `counties-data.js`, `*-verified-v*.js`) | All state and county facts, sale timing text used by the calendar | Our own data | 2026-10-27 |
| `us-atlas@3` npm package (U.S. Census Bureau cartographic boundary files) | Map shapes, build time only | ISC license; Census data is public domain | 2026-10-27 |
| `https://api.polar.sh/v1/customer-portal/license-keys/validate` | License key checks from the Worker (public endpoint, no token) | Polar public API | 2026-10-27 |
| Official statute / revenue pages listed in `cloudflare/data/freshness.json` | Phase 4 freshness check (manual, one-off reads) | Read one page per state; see freshness.md | 2026-10-27 |

## Automated sale-list sources

None yet. This run did **not** add any automated scraping of county or platform sites.
The Worker cron only clears its own license cache. Dates in the Sale Calendar come from the directory's
existing text (for example "1st Tuesday monthly"), not from fetching county sites.

Checked for possible future use (robots.txt only, 2026-10-27):

| Site | Result | OK to automate? |
|---|---|---|
| https://lienhub.com/robots.txt | Bot challenge page ("Just a moment...") | **No**: blocks automated access |
| https://www.realauction.com/robots.txt | 403 Forbidden | **No**: blocks automated access |
| https://www.govease.com/robots.txt | 200; disallows only preview/preference paths | Maybe, but read GovEase terms first; sale lists are behind accounts, so skip |
| https://www.leg.state.fl.us/robots.txt | 200; allows `*` except `/employees/` | Yes for statute pages (light, occasional reads) |
| https://capitol.texas.gov/robots.txt | No response (timeout) | Unknown, so don't automate |

Before adding a county sale list: read its robots.txt and terms, record both here, confirm the list is public
(no login), and drop any owner name columns at parse time.
