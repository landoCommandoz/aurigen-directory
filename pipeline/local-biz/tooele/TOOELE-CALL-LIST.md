# TOOELE COUNTY CALL LIST: 26 verified no-website businesses

Re-verified 2026-08-08 after the first pass missed a live website. Every lead below
was re-checked with a strict standard (any owned domain or builder-built site counts
as having a website). Three businesses were cut: Black Cat Barber (blackcatbarber.co),
Scotty's Heating (scottysheating.com), and K2 HVAC (Thryv mini-site via YellowPages).
Full evidence per lead is in VERIFICATION.md. All 26 phone numbers matched a current
listing.

> Openers now say "I couldn't find a website for you," which is verified true, instead
> of claiming they have none. If an owner ever says "we have one," the caller says
> "must have missed it, where's it at?" and either pitches an upgrade or gets out clean.

---

## TIER 1 - CALL FIRST

| # | Business | Phone | Category | Proof | Angle |
|---|----------|-------|----------|-------|-------|
| 1 | **El Green Burrito** | (435) 882-5031 | restaurant | 4.5 / 562 reviews | A Google reviewer publicly wished they had a real website. Use that. |
| 2 | **Five Star Auto** (Grantsville) | (435) 884-3573 | auto repair | **4.9 / 241** | Since 1999, customers drive from Sandy. Nothing online at all. |
| 3 | **Ivy Nails** | (435) 882-9915 | nail salon | 3.8 / 201 | FB/IG only. Booksy profile exists but doesn't even take bookings. |
| 4 | **Stay Classic Barbershop** | (435) 850-1496 | barber | ~104 reviews | Their old site stayclassicbarbershop.com is DEAD. "Your old website doesn't even load anymore." |
| 5 | **Pete's Auto Repair & Diesel** | (435) 882-4014 | auto repair | 4.1 / 84 | YP listing literally shows an empty "Add Website" slot. |

## TIER 2 - SOLID

| # | Business | Phone | Category | Proof | Angle |
|---|----------|-------|----------|-------|-------|
| 6 | **Hometown Plumbing LLC** | (435) 830-8748 | plumber | 4.7 / 16 | Chamber member, no site even there. Open Saturdays. |
| 7 | **Dakota Towing** | (435) 228-8156 | towing | 27 FB reviews, 98% rec | 24-hour service, Facebook only. |
| 8 | **Hometown Bakery & Grocery** | (435) 882-0874 | bakery | 16 FB, 100% rec | Historic local spot, Chamber member, no site. |
| 9 | **Russell Welding Corporation** | (435) 882-6359 | welding | 4.6 / 11 | Old site russellweldingcorp.com is DEAD. Founded 1982. |
| 10 | **Cruz Auto** | (435) 882-8584 | auto repair | 4.7 / 36 | CAUTION: one directory says closed, Yelp and BBB say open. First question: "you guys still open?" |
| 11 | **Baxter Tree Service** | (801) 830-0483 | tree service | 11 FB, 100% rec | Even BBB's website button just points to their Facebook. |
| 12 | **Affordable Lawn Care of Tooele** | (435) 882-3990 | landscaping | Angi 4.3 | Since 1999, nothing online. |
| 13 | **Niemi's Barbershop** | (435) 249-7256 | barber | Since 2011 | Not even on Booksy. Walk-in Main St shop. |

## TIER 3 - VOLUME CALLS

| # | Business | Phone | Category | Note |
|---|----------|-------|----------|------|
| 14 | Beyond Connected LLC | (435) 840-4980 | electrician | Smart-home specialty. BBB website button points to Facebook. |
| 15 | JDI Handyman | (435) 241-9752 | handyman | Their FB still lists jdihandyman.net and it's DEAD. Easy talking point. |
| 16 | True Clean Carpet Cleaning | (385) 787-9963 | carpet cleaning | Solo operator (Candace), glowing FB reviews |
| 17 | A PM Plumber | (435) 840-2525 | plumber | Works evenings. Alt number (435) 843-7298 on one listing. |
| 18 | JR Roofing & Construction (Grantsville) | (801) 706-1677 | roofing | BBB A+, 10 years, email-only domain that doesn't load as a site |
| 19 | R & B Plumbing | (435) 882-2857 | plumber | 20 years experience, FB and directories only |
| 20 | Pete's Service Shop | (435) 882-4614 | appliance repair | Directory listings only, no FB even |
| 21 | N&J Handyman Services | (801) 919-5108 | handyman | Yelp only |
| 22 | Go Forty Handyman | (801) 349-6333 | handyman | Drywall, doors, irrigation. ASL proficient. |
| 23 | Begay's Navajo Tacos (Grantsville) | (435) 830-7824 | food truck | FB and IG only, active in 2026 |
| 24 | Tooele Valley House Cleaning | (208) 680-5037 | house cleaning | FB page only |
| 25 | One Stop Builders (Stansbury Park) | (562) 507-7661 | contractor | Licensed UT contractor, no site on Houzz or BBB |
| 26 | Bulldog Plumbing and Handy Service | (801) 209-1993 | plumber | Call last. 3.0 rating on 2 reviews. |

---

## How the two scripts work

1. **Right now (no sites built):** every sheet opens with the free-demo offer, then
   closes at $149 one-time setup plus $99 a month.
2. **Once demos are live:** rerun `node callsheet.js` and deployed leads flip to the
   "I already built it" opener.
3. **Deploying needs Surge** (free): `npx surge login`, then `npx surge token`, both
   into `.env`.
4. **On a paid yes:** production site goes on Higgsfield (free Cloudflare hosting).
