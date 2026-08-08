# TOOELE COUNTY CALL LIST — 29 verified no-website businesses

Compiled 2026-08-08 by web research (Yelp, Yellow Pages, BBB, Birdeye, Facebook, Yahoo Local).
Every business was checked for a real website — none has one. All 29 have phone numbers.

> **HOLD THE CALLS until the demo sites are deployed.** The pitch is "I already built
> your site" — it has to be live and textable before Brian dials. Each business has a
> full call sheet in `calls/` with the opener, objection handling, and review quotes.
>
> Phone numbers came from live directory listings but weren't dialed to verify — expect
> a couple of stale ones. That's normal for small-town lists.

---

## TIER 1 — CALL FIRST (big review counts = proud owners, easy close)

| # | Business | Phone | Category | Proof | Angle |
|---|----------|-------|----------|-------|-------|
| 1 | **Black Cat Barber Company** | (801) 347-3213 | barber | **4.9 / 795 reviews** | Open 7 days, only a FB + Square booking page. The hottest lead on the list. |
| 2 | **El Green Burrito** | (435) 882-5031 | restaurant | 4.5 / 562 | On Uber Eats but no menu site of their own — "people want to see a menu." |
| 3 | **Five Star Auto** (Grantsville) | (435) 884-3573 | auto repair | **4.9 / 241** | Since 1999; customers drive from Sandy. Zero web presence. |
| 4 | **Ivy Nails** | (435) 882-9915 | nail salon | 3.8 / 201 | Books via Fresha/Booksy; a site puts their best reviews forward. |
| 5 | **Stay Classic Barbershop** | (435) 850-1496 | barber | ~104 reviews | Main St shop, Square booking only. |
| 6 | **Pete's Auto Repair & Diesel** | (435) 882-4014 | auto repair | 4.1 / 84 | Longtime local shop, FB/Yelp only. |

## TIER 2 — SOLID (established businesses, decades old, thin web presence)

| # | Business | Phone | Category | Proof | Angle |
|---|----------|-------|----------|-------|-------|
| 7 | **Hometown Plumbing LLC** | (435) 830-8748 | plumber | 4.7 / 16 | Best plumber lead; open Saturdays. |
| 8 | **Dakota Towing** | (435) 228-8156 | towing | 27 FB reviews, 98% rec | 24-hour service — "stranded drivers call whoever looks legit online." |
| 9 | **Hometown Bakery & Grocery** | (435) 882-0874 | bakery | 16 FB, 100% rec | Historic local institution, open 7 days. |
| 10 | **Russell Welding Corporation** | (435) 882-6359 | welding | 4.6 / 11 | Founded 1982, zero site in 44 years. |
| 11 | **Cruz Auto** | (435) 882-8584 | auto repair | 4.7 / 36 | ⚠️ One directory flags "closed", Yelp says open — **verify when they answer.** |
| 12 | **Baxter Tree Service** | (801) 830-0483 | tree service | 11 FB, 100% rec | In business since 1996. |
| 13 | **Affordable Lawn Care of Tooele** | (435) 882-3990 | landscaping | Angi 4.3 | Since 1999. Address listed two ways in directories. |
| 14 | **K2 HVAC** | (435) 830-4591 | HVAC | 27 yrs in business | Only FB + an auto-generated directory subdomain. |
| 15 | **Niemi's Barbershop** | (435) 249-7256 | barber | Since 2011 | Historic Main St shop, almost no web presence at all. |

## TIER 3 — VOLUME CALLS (real businesses, thinner proof)

| # | Business | Phone | Category | Note |
|---|----------|-------|----------|------|
| 16 | Beyond Connected LLC | (435) 840-4980 | electrician | Smart-home/custom lighting specialty — great site angle |
| 17 | JDI Handyman | (435) 241-9752 | handyman | **Their old domain is dead** — "your jdihandyman.net doesn't even load; I built you one that does" |
| 18 | True Clean Carpet Cleaning | (385) 787-9963 | carpet cleaning | Solo operator (Candace); glowing FB reviews |
| 19 | Scotty's Heating, Air & Quality Repair | (435) 338-7268 | HVAC | FB + HomeAdvisor only |
| 20 | A PM Plumber | (435) 840-2525 | plumber | Works evenings — differentiator for the site |
| 21 | JR Roofing & Construction (Grantsville) | (801) 706-1677 | roofing | 20+ yrs experience, FB + KSL only |
| 22 | R & B Plumbing | (435) 882-2857 | plumber | FB + directories only |
| 23 | Pete's Service Shop | (435) 882-4614 | appliance repair | Dryer/stove/oven repair |
| 24 | N&J Handyman Services | (801) 919-5108 | handyman | Yelp only |
| 25 | Go Forty Handyman | (801) 349-6333 | handyman | Drywall, doors, irrigation; ASL proficient |
| 26 | Begay's Navajo Tacos (Grantsville) | (435) 830-7824 | food truck | FB + Instagram only |
| 27 | Tooele Valley House Cleaning | (208) 680-5037 | house cleaning | FB page only |
| 28 | One Stop Builders (Stansbury Park) | (562) 507-7661 | contractor | Basements/kitchens/custom homes |
| 29 | Bulldog Plumbing and Handy Service | (801) 209-1993 | plumber | Call last — 3.0 rating on 2 reviews |

---

## What happens next

1. **Deploy the demos** — needs free Surge credentials (`npx surge login`, then `npx surge token`, put both in `.env`). Sites deploy to `<business>.surge.sh`.
2. **Generate the sites** — Claude Code writes them from `leads.csv` (Zero-Budget Mode), or `generator.js` if an Anthropic API key is available.
3. **Call sheets auto-update** — re-run `node callsheet.js` after deploying and every sheet gets its live URL stamped in.
4. **On a YES** — build the client's production site on Higgsfield (free Cloudflare hosting; the $99/mo is pure margin).
