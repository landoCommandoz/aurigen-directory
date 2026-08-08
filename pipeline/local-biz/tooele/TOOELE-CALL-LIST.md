# TOOELE COUNTY CALL LIST: 29 verified no-website businesses

Compiled 2026-08-08 from web research (Yelp, Yellow Pages, BBB, Birdeye, Facebook, Yahoo Local).
Every business was checked for a real website. None has one. All 29 have phone numbers.

> **Brian can start calling now.** Every sheet in `calls/` currently uses the build-it-after
> script: offer a free demo on the call, build sites only for the ones who want to see it,
> text the link in a day or two, close at $99 a month. Once a demo goes live, rerun
> `node callsheet.js` and that sheet switches to the stronger "I already built it" opener.
>
> Numbers came from live directory listings but were not test dialed. Expect a stale one
> here and there. That's normal for a small-town list.

---

## TIER 1 - CALL FIRST (big review counts mean proud owners and easier closes)

| # | Business | Phone | Category | Proof | Angle |
|---|----------|-------|----------|-------|-------|
| 1 | **Black Cat Barber Company** | (801) 347-3213 | barber | **4.9 / 795 reviews** | Open 7 days, only a FB page and a Square booking link. Hottest lead on the list. |
| 2 | **El Green Burrito** | (435) 882-5031 | restaurant | 4.5 / 562 | On Uber Eats but no menu site of their own. People want to see a menu. |
| 3 | **Five Star Auto** (Grantsville) | (435) 884-3573 | auto repair | **4.9 / 241** | Since 1999, customers drive out from Sandy. Zero web presence. |
| 4 | **Ivy Nails** | (435) 882-9915 | nail salon | 3.8 / 201 | Books via Fresha/Booksy. A site puts their best reviews forward. |
| 5 | **Stay Classic Barbershop** | (435) 850-1496 | barber | ~104 reviews | Main St shop, Square booking only. |
| 6 | **Pete's Auto Repair & Diesel** | (435) 882-4014 | auto repair | 4.1 / 84 | Longtime local shop, FB/Yelp only. |

## TIER 2 - SOLID (established businesses, decades old, thin web presence)

| # | Business | Phone | Category | Proof | Angle |
|---|----------|-------|----------|-------|-------|
| 7 | **Hometown Plumbing LLC** | (435) 830-8748 | plumber | 4.7 / 16 | Best plumber lead, open Saturdays. |
| 8 | **Dakota Towing** | (435) 228-8156 | towing | 27 FB reviews, 98% rec | 24-hour service. |
| 9 | **Hometown Bakery & Grocery** | (435) 882-0874 | bakery | 16 FB, 100% rec | Historic local institution, open 7 days. |
| 10 | **Russell Welding Corporation** | (435) 882-6359 | welding | 4.6 / 11 | Founded 1982, no site in 44 years. |
| 11 | **Cruz Auto** | (435) 882-8584 | auto repair | 4.7 / 36 | CAUTION: one directory says closed, Yelp says open. Verify when they answer. |
| 12 | **Baxter Tree Service** | (801) 830-0483 | tree service | 11 FB, 100% rec | In business since 1996. |
| 13 | **Affordable Lawn Care of Tooele** | (435) 882-3990 | landscaping | Angi 4.3 | Since 1999. Address listed two ways in directories. |
| 14 | **K2 HVAC** | (435) 830-4591 | HVAC | 27 yrs in business | Only FB plus an auto-generated directory page. |
| 15 | **Niemi's Barbershop** | (435) 249-7256 | barber | Since 2011 | Historic Main St shop, almost no web presence at all. |

## TIER 3 - VOLUME CALLS (real businesses, thinner proof)

| # | Business | Phone | Category | Note |
|---|----------|-------|----------|------|
| 16 | Beyond Connected LLC | (435) 840-4980 | electrician | Smart-home and custom lighting specialty, great site angle |
| 17 | JDI Handyman | (435) 241-9752 | handyman | Their old domain is dead. "Your jdihandyman.net doesn't even load, I can fix that." |
| 18 | True Clean Carpet Cleaning | (385) 787-9963 | carpet cleaning | Solo operator (Candace), glowing FB reviews |
| 19 | Scotty's Heating, Air & Quality Repair | (435) 338-7268 | HVAC | FB and HomeAdvisor only |
| 20 | A PM Plumber | (435) 840-2525 | plumber | Works evenings, good differentiator for the site |
| 21 | JR Roofing & Construction (Grantsville) | (801) 706-1677 | roofing | 20+ yrs experience, FB and KSL only |
| 22 | R & B Plumbing | (435) 882-2857 | plumber | FB and directories only |
| 23 | Pete's Service Shop | (435) 882-4614 | appliance repair | Dryer, stove, oven repair |
| 24 | N&J Handyman Services | (801) 919-5108 | handyman | Yelp only |
| 25 | Go Forty Handyman | (801) 349-6333 | handyman | Drywall, doors, irrigation. ASL proficient. |
| 26 | Begay's Navajo Tacos (Grantsville) | (435) 830-7824 | food truck | FB and Instagram only |
| 27 | Tooele Valley House Cleaning | (208) 680-5037 | house cleaning | FB page only |
| 28 | One Stop Builders (Stansbury Park) | (562) 507-7661 | contractor | Basements, kitchens, custom homes |
| 29 | Bulldog Plumbing and Handy Service | (801) 209-1993 | plumber | Call last. 3.0 rating on 2 reviews. |

---

## How the two scripts work

1. **Right now (no sites built):** every call sheet opens with the free-demo offer. Brian
   collects the yeses, we build and deploy sites only for those, then he texts the links.
2. **Once demos are live:** rerun `node callsheet.js` and each deployed lead's sheet flips
   to the "I already built it, want the link?" opener, which closes harder.
3. **Deploying needs Surge** (free): `npx surge login`, then `npx surge token`, put both in
   `.env` as SURGE_LOGIN and SURGE_TOKEN.
4. **On a paid yes:** build their production site on Higgsfield (free Cloudflare hosting),
   so the $99 a month has no hosting cost behind it.
