// AURIGEN DIRECTORY — STATE DATA v1.0 | Schema defined Task 0 | 51 states + DC
//
// SCHEMA (v1.0.0)
// ────────────────────────────────────────────────────────────────
// Each state object must contain ALL of the following fields:
//
//   code             : String   — 2-letter state abbreviation (e.g. "FL")
//   name             : String   — Full state name (e.g. "Florida")
//   type             : String   — ONLY: lien | deed | redeemable | hybrid | forfeiture
//   rate             : String   — Exact statutory rate in plain English
//   rateNote         : String   — How rate is determined or bid
//   redemption       : String   — Exact redemption period
//   bidMethod        : String   — Auction mechanics
//   statute          : String   — Primary legal citation
//   officialLink     : String   — Direct government URL
//   auctionPlatform  : String   — Platform(s) used for sales
//   auctionTiming    : String   — When auctions occur
//   keyNotes         : Array    — 2-3 investor-critical strings
//   investorAlert    : String|null — Critical warning (string) or null if none
//   clarityCallCTA   : Boolean  — Always true for all states
//
// ────────────────────────────────────────────────────────────────

export const schemaVersion = "1.0.0";

export const statesData = [

  // ── 1. Florida ─────────────────────────────────────────────
  {
    code: "FL",
    name: "Florida",
    type: "hybrid",
    rate: "18% max",
    rateNote: "Bid-down interest",
    redemption: "2 years (lien); none post-deed sale",
    bidMethod: "Bid-down interest",
    statute: "FL Stat \u00A7197.172",
    officialLink: "https://leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0100-0199/0197/Sections/0197.172.html",
    auctionPlatform: "RealAuction / GovEase (varies by county)",
    auctionTiming: "May annual lien sale; monthly deed auctions",
    keyNotes: [
      "Largest tax lien state by volume",
      "Bid down the interest rate you're willing to accept",
      "Deeds sold monthly \u2014 no post-sale redemption period"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 2. Louisiana ───────────────────────────────────────────
  {
    code: "LA",
    name: "Louisiana",
    type: "lien",
    rate: "0.7%\u20131.0%/month (8.4%\u201312% annualized)",
    rateNote: "Bid-down interest rate \u2014 new 2026 system",
    redemption: "3 years",
    bidMethod: "Bid-down interest rate",
    statute: "La. Rev. Stat. \u00A747:2154",
    officialLink: "https://www.legis.la.gov/legis/Law.aspx?d=99775",
    auctionPlatform: "Varies by parish",
    auctionTiming: "Varies by parish",
    keyNotes: [
      "New system effective January 1 2026 \u2014 old ownership bid-down eliminated",
      "Judicial foreclosure required after 3-year redemption",
      "7-year statute of limitations on challenges"
    ],
    investorAlert: "\u26A0\uFE0F MAJOR 2026 LAW CHANGE: Louisiana converted from ownership bid-down to interest rate bid-down effective January 1, 2026 (Acts 2024, No. 409). Do not apply pre-2026 research to this state.",
    clarityCallCTA: true
  },

  // ── 3. Iowa ────────────────────────────────────────────────
  {
    code: "IA",
    name: "Iowa",
    type: "lien",
    rate: "24% fixed",
    rateNote: "Highest fixed rate in the US \u2014 flat rate, no bidding",
    redemption: "21 months",
    bidMethod: "Premium bid (highest dollar wins)",
    statute: "Iowa Code \u00A7447.9",
    officialLink: "https://www.legis.iowa.gov/law/iowaCode/sections?codeChapter=447",
    auctionPlatform: "Varies by county",
    auctionTiming: "Third Monday in June",
    keyNotes: [
      "24% is the highest fixed lien rate in the US",
      "Affidavit of service deadline is strict \u2014 miss it and you lose the lien entirely",
      "Overbid earns no interest"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 4. Illinois ───────────────────────────────────────────
  {
    code: "IL",
    name: "Illinois",
    type: "lien",
    rate: "9% per 6 months (18% annualized)",
    rateNote: "Penalty on TAX amount only — not on overbid",
    redemption: "2.5 years (30 months)",
    bidMethod: "Bid-down interest rate",
    statute: "35 ILCS 200/21-215",
    officialLink: "https://www.ilga.gov/legislation/ilcs/ilcs4.asp?ActID=596&SeqStart=148700000&SeqEnd=149900000",
    auctionPlatform: "SRI / BidSpencer / county-run (varies)",
    auctionTiming: "Varies by county — mostly fall",
    keyNotes: [
      "Interest earned on tax amount only — not on premium overbid",
      "Cook County is largest volume in state — institutional dominated",
      "2.5-year redemption is longer than most lien states"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 5. Arizona ────────────────────────────────────────────
  {
    code: "AZ",
    name: "Arizona",
    type: "lien",
    rate: "16% max",
    rateNote: "Bid-down interest rate — investor accepts lowest rate",
    redemption: "3 years",
    bidMethod: "Bid-down interest rate",
    statute: "ARS §42-18112",
    officialLink: "https://www.azleg.gov/ars/42/18112.htm",
    auctionPlatform: "Online (GovEase / county-run — Pima confirmed online Feb 2026)",
    auctionTiming: "February (most counties)",
    keyNotes: [
      "16% max is strong for a bid-down state",
      "After 3 years investor can apply for treasurer's deed",
      "Pima County 2026 sale confirmed online via GovEase"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 6. New Jersey ─────────────────────────────────────────
  {
    code: "NJ",
    name: "New Jersey",
    type: "lien",
    rate: "18% max",
    rateNote: "Premium bid below 1% of lien; 18% on amounts over $200",
    redemption: "2 years minimum before foreclosure can begin",
    bidMethod: "Premium bid (dollar overbid for liens under threshold)",
    statute: "NJSA §54:5-32",
    officialLink: "https://www.njleg.state.nj.us/Bills/Bills/2024/S2052_I1.PDF",
    auctionPlatform: "Varies by municipality — online and in-person",
    auctionTiming: "Year-round, varies by municipality",
    keyNotes: [
      "Premium bid system — you bid a dollar amount over lien, not an interest rate",
      "18% statutory rate applies on amounts over $200",
      "S2052 pending 2026 — monitor for reform"
    ],
    investorAlert: "\u26A0\uFE0F S2052 pending in 2026 NJ legislature — proposed changes to tax sale law. Verify current status before transacting.",
    clarityCallCTA: true
  },

  // ── 7. Colorado ───────────────────────────────────────────
  {
    code: "CO",
    name: "Colorado",
    type: "lien",
    rate: "Federal Discount Rate (Sept 1) + 9 points — 2025 rate ~14%",
    rateNote: "Variable rate — resets annually September 1",
    redemption: "3 years",
    bidMethod: "Highest bidder (premium bid)",
    statute: "CRS §39-11.5",
    officialLink: "https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf",
    auctionPlatform: "Mix of online and in-person by county",
    auctionTiming: "October–November (most counties)",
    keyNotes: [
      "Rate resets every September 1 — confirm current year rate before investing",
      "HB 24-1056 (July 2024): deeds no longer auto-issued after lien maturity — public auction now required",
      "Overbid earns no interest — bid only up to tax amount"
    ],
    investorAlert: "\u26A0\uFE0F HB 24-1056 effective July 2024: Tax deeds are NO LONGER automatically issued after lien maturity. A public auction is now required. Pre-2024 research on deed acquisition process is outdated.",
    clarityCallCTA: true
  },

  // ── 8. Maryland ───────────────────────────────────────────
  {
    code: "MD",
    name: "Maryland",
    type: "lien",
    rate: "6%–24% depending on county",
    rateNote: "Rate set by each county — NEVER a flat statewide rate",
    redemption: "6 months (owner-occupied residential) to 2 years (other)",
    bidMethod: "Bid-down interest rate (most counties)",
    statute: "MD Tax-Property §14-808",
    officialLink: "https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=gtp&section=14-808",
    auctionPlatform: "Online and in-person — varies by county",
    auctionTiming: "May–June (most counties)",
    keyNotes: [
      "Rate varies by county — Baltimore City 18%, Montgomery County 6%, always verify county-specific rate",
      "Redemption period also varies — residential shorter than commercial",
      "One of the more complex states — county variation is significant"
    ],
    investorAlert: "\u26A0\uFE0F Do NOT apply a single rate to Maryland. Every county sets its own rate between 6%–24%. Always verify with the specific county tax collector before investing.",
    clarityCallCTA: true
  },

  // ── 9. Indiana ────────────────────────────────────────────
  {
    code: "IN",
    name: "Indiana",
    type: "lien",
    rate: "10% (months 0–6) / 15% (months 6–12)",
    rateNote: "Flat penalty — NOT annualized. Applied to minimum bid amount",
    redemption: "1 year",
    bidMethod: "Highest bidder (premium bid)",
    statute: "IC §6-1.1-24",
    officialLink: "https://iga.in.gov/legislative/laws/2024/ic/titles/006/#6-1.1-24",
    auctionPlatform: "SRI (most counties) / county-run",
    auctionTiming: "August–October (most counties)",
    keyNotes: [
      "10% penalty is flat — not annualized. You earn 10% if redeemed in month 1 OR month 6",
      "15% if redeemed in months 6–12 — still flat",
      "After 1 year, petition court for tax deed"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 10. South Carolina ────────────────────────────────────
  {
    code: "SC",
    name: "South Carolina",
    type: "lien",
    rate: "3%–12% sliding scale by redemption month",
    rateNote: "Penalty increases by month held: 3% months 0–3, up to 12% by month 12",
    redemption: "12 months",
    bidMethod: "Premium bid",
    statute: "SC Code §12-51-90",
    officialLink: "https://www.scstatehouse.gov/code/t12c051.php",
    auctionPlatform: "Varies by county — online and in-person",
    auctionTiming: "October–November (most counties)",
    keyNotes: [
      "Sliding penalty scale — earlier redemption earns less; later earns more up to 12%",
      "Strict compliance doctrine — procedural errors can void the lien",
      "Rural counties offer strong rural land opportunities"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 11. Ohio ──────────────────────────────────────────────
  {
    code: "OH",
    name: "Ohio",
    type: "lien",
    rate: "18% max / 6% floor",
    rateNote: "Bid-down interest rate — floor is 6%, cannot go lower",
    redemption: "1 year",
    bidMethod: "Bid-down interest rate",
    statute: "ORC §5721.30",
    officialLink: "https://codes.ohio.gov/ohio-revised-code/section-5721.30",
    auctionPlatform: "SRI / county-run (varies)",
    auctionTiming: "Year-round, varies by county",
    keyNotes: [
      "6% floor is investor protection — rate cannot be bid below 6%",
      "Bulk sales dominate large counties like Cuyahoga and Franklin",
      "1-year redemption is shorter than most lien states"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 12. Mississippi ───────────────────────────────────────
  {
    code: "MS",
    name: "Mississippi",
    type: "lien",
    rate: "18% annualized (1.5%/month)",
    rateNote: "Fixed rate — overbid earns NO interest",
    redemption: "2 years",
    bidMethod: "Premium bid (highest dollar)",
    statute: "Miss. Code §27-45-3",
    officialLink: "https://law.justia.com/codes/mississippi/chapter-45/",
    auctionPlatform: "County-run, in-person",
    auctionTiming: "August–September (most counties)",
    keyNotes: [
      "1.5% per month fixed — strong predictable return",
      "Overbid amount earns zero interest — bid only up to tax amount",
      "2-year redemption gives owner two full years"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 13. Minnesota ─────────────────────────────────────────
  {
    code: "MN",
    name: "Minnesota",
    type: "forfeiture",
    rate: "7% (2026 rate — down from 8% in 2025)",
    rateNote: "State forfeiture system — not a retail lien purchase state",
    redemption: "3 years before state takes title",
    bidMethod: "N/A — forfeiture system, not public lien auction",
    statute: "MN Statutes Ch. 279–282",
    officialLink: "https://www.revisor.mn.gov/statutes/cite/281",
    auctionPlatform: "County-run deed sales only after forfeiture",
    auctionTiming: "Varies by county",
    keyNotes: [
      "Minnesota is a FORFEITURE state — the state takes title after 3 years, then counties sell deeds",
      "Retail investors cannot purchase tax liens — only post-forfeiture deed sales",
      "2026 interest rate: 7% (confirmed down from 8% in 2025)"
    ],
    investorAlert: "\u26A0\uFE0F Minnesota is NOT a tax lien investing state. The state takes title through forfeiture after 3 years. Retail investors can only bid on post-forfeiture county deed sales — not purchase liens.",
    clarityCallCTA: true
  },

  // ── 14. Montana ───────────────────────────────────────────
  {
    code: "MT",
    name: "Montana",
    type: "lien",
    rate: "10% fixed",
    rateNote: "Fixed rate — no bidding",
    redemption: "3 years (residential)",
    bidMethod: "Highest bidder (premium bid)",
    statute: "MCA §15-18-111",
    officialLink: "https://leg.mt.gov/bills/mca/title_0150/chapter_0180/part_0010/section_0110/0150-0180-0010-0110.html",
    auctionPlatform: "County treasurer — in-person",
    auctionTiming: "July (most counties)",
    keyNotes: [
      "10% fixed rate — predictable",
      "3-year residential redemption is standard for lien states",
      "Low inventory state — rural land heavy"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 15. Nebraska ──────────────────────────────────────────
  {
    code: "NE",
    name: "Nebraska",
    type: "lien",
    rate: "14% fixed",
    rateNote: "Fixed rate — no bidding",
    redemption: "3 years",
    bidMethod: "Highest bidder (premium bid)",
    statute: "NRS §77-1824",
    officialLink: "https://nebraskalegislature.gov/laws/statutes.php?statute=77-1824",
    auctionPlatform: "County treasurer — in-person and online (varies)",
    auctionTiming: "March (most counties)",
    keyNotes: [
      "14% fixed is above average for lien states",
      "3-year redemption standard",
      "After 3 years, apply for treasurer's deed"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 16. Wyoming ───────────────────────────────────────────
  {
    code: "WY",
    name: "Wyoming",
    type: "lien",
    rate: "15% fixed",
    rateNote: "Fixed rate — no bidding",
    redemption: "4 years",
    bidMethod: "Highest bidder (premium bid)",
    statute: "WY Statute §39-13-108",
    officialLink: "https://wyoleg.gov/statutes/compress/title39.pdf",
    auctionPlatform: "County treasurer — in-person",
    auctionTiming: "September–November (varies by county)",
    keyNotes: [
      "4-year redemption is the LONGEST in the US — capital is tied up",
      "15% fixed rate compensates for long hold",
      "Low population state — limited inventory but less competition"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 17. North Dakota ──────────────────────────────────────
  {
    code: "ND",
    name: "North Dakota",
    type: "hybrid",
    rate: "9% fixed",
    rateNote: "County holds liens — retail investors buy deed sales only",
    redemption: "3 years (county holds lien during this period)",
    bidMethod: "Highest bidder",
    statute: "NDCC §57-28-04",
    officialLink: "https://www.legis.nd.gov/cencode/t57c28.pdf",
    auctionPlatform: "County commissioner — in-person",
    auctionTiming: "Varies by county",
    keyNotes: [
      "Hybrid: county holds the lien — retail investors cannot buy liens directly",
      "Investors access market through post-redemption deed sales only",
      "Low inventory, rural, agricultural land heavy"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 18. New York ──────────────────────────────────────────
  {
    code: "NY",
    name: "New York",
    type: "lien",
    rate: "14% max (upstate)",
    rateNote: "Upstate only for retail investors — NYC is institutional",
    redemption: "2 years (minimum)",
    bidMethod: "Bid-down interest rate (upstate)",
    statute: "RPTL §1110",
    officialLink: "https://www.nysenate.gov/legislation/laws/RPT/1110",
    auctionPlatform: "Varies by municipality — online and in-person",
    auctionTiming: "Varies by county",
    keyNotes: [
      "NYC has transitioned toward land bank model — institutional only, retail access essentially closed",
      "Upstate counties (Albany, Erie, Monroe) accessible for retail investors",
      "Adams vetoed 4 NYC reform bills December 31, 2025 — NYC market status in flux"
    ],
    investorAlert: "\u26A0\uFE0F NYC is NOT accessible for retail tax lien investors. Land bank transition underway. Mayor Adams vetoed 4 reform bills Dec 31, 2025. Upstate New York only for individual investors.",
    clarityCallCTA: true
  },

  // ── 19. Oregon ────────────────────────────────────────────
  {
    code: "OR",
    name: "Oregon",
    type: "deed",
    rate: "N/A — deed state, no lien product",
    rateNote: "County auctions property after 3-year delinquency",
    redemption: "None after sale",
    bidMethod: "Highest bidder",
    statute: "ORS Ch. 312 (2025 update)",
    officialLink: "https://www.oregonlegislature.gov/bills_laws/ors/ors312.html",
    auctionPlatform: "County-run — online and in-person varies",
    auctionTiming: "Varies by county",
    keyNotes: [
      "3-year delinquency before county can auction",
      "No post-sale redemption — buyer takes clean title",
      "2025 ORS 312.510 update — verify current county procedures"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 20. Washington ────────────────────────────────────────
  {
    code: "WA",
    name: "Washington",
    type: "deed",
    rate: "N/A — deed state, no lien product",
    rateNote: "County auctions property — clean title conveyed",
    redemption: "None after sale",
    bidMethod: "Highest bidder",
    statute: "RCW Ch. 84.64",
    officialLink: "https://app.leg.wa.gov/RCW/default.aspx?cite=84.64",
    auctionPlatform: "County treasurer — online and in-person varies",
    auctionTiming: "Winter (most counties)",
    keyNotes: [
      "Clean title conveyed at sale — no post-sale redemption",
      "Minimum bid includes all taxes, fees, penalties",
      "Seattle-area properties attract institutional competition"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 21. West Virginia ─────────────────────────────────────
  {
    code: "WV",
    name: "West Virginia",
    type: "lien",
    rate: "12% on BID amount",
    rateNote: "Interest on bid amount — not on tax amount. Sheriff-run process",
    redemption: "18 months",
    bidMethod: "Highest bidder (premium bid)",
    statute: "WV Code §11A-3-9",
    officialLink: "https://code.wvlegislature.gov/11A-3-9/",
    auctionPlatform: "Sheriff-run — in-person",
    auctionTiming: "October–November",
    keyNotes: [
      "12% is on the BID amount — not just the tax amount",
      "High redemption rate (~70–80%) — most liens pay out, rarely reach deed",
      "Sheriff conducts sales — not county treasurer"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 22. Vermont ───────────────────────────────────────────
  {
    code: "VT",
    name: "Vermont",
    type: "redeemable",
    rate: "N/A",
    rateNote: "255 towns each run their own sales — highly fragmented",
    redemption: "1 year (standard)",
    bidMethod: "Highest bidder",
    statute: "32 V.S.A. §5251",
    officialLink: "https://legislature.vermont.gov/statutes/section/32/135/05251",
    auctionPlatform: "Town-run — in-person",
    auctionTiming: "Varies by town",
    keyNotes: [
      "255 towns run independent sales — no centralized system",
      "State liens may survive tax deed sale — title research critical",
      "Land Court action recommended for clean title"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 23. South Dakota ──────────────────────────────────────
  {
    code: "SD",
    name: "South Dakota",
    type: "lien",
    rate: "Bid-down to lowest rate accepted",
    rateNote: "Bid-down system — investor accepts lowest rate willing to take",
    redemption: "3 years + 60-day notice period",
    bidMethod: "Bid-down interest rate",
    statute: "SDCL §10-23",
    officialLink: "https://sdlegislature.gov/Statutes/10/23",
    auctionPlatform: "County treasurer — in-person",
    auctionTiming: "December",
    keyNotes: [
      "December auction — one annual sale per county",
      "3-year redemption plus mandatory 60-day notice before deed",
      "Low population, rural land heavy — limited inventory"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 24. Oklahoma ──────────────────────────────────────────
  {
    code: "OK",
    name: "Oklahoma",
    type: "deed",
    rate: "N/A — deed state, no lien product",
    rateNote: "County auctions property — no post-sale redemption",
    redemption: "None after sale",
    bidMethod: "Highest bidder",
    statute: "68 O.S. §3101",
    officialLink: "https://www.oscn.net/applications/oscn/DeliverDocument.asp?CiteID=138625",
    auctionPlatform: "County-run — in-person",
    auctionTiming: "June (most counties)",
    keyNotes: [
      "No post-sale redemption — buyer takes immediate title",
      "June auction annual timing",
      "Rural land opportunities in eastern Oklahoma"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 25. Missouri ──────────────────────────────────────────
  {
    code: "MO",
    name: "Missouri",
    type: "deed",
    rate: "N/A — deed state, no lien product",
    rateNote: "Multiple offering system — 3rd+ offering is fastest path to deed",
    redemption: "None after sale",
    bidMethod: "Highest bidder",
    statute: "RSMo Ch. 140",
    officialLink: "https://revisor.mo.gov/main/OneChapter.aspx?chapter=140",
    auctionPlatform: "County collector — in-person",
    auctionTiming: "Varies by county",
    keyNotes: [
      "Multi-offering system: 1st offering minimum bid = taxes+fees; 3rd+ offering = any bid accepted",
      "3rd offering properties are fastest path to deed acquisition",
      "No post-sale redemption"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 26. Kentucky ──────────────────────────────────────────
  {
    code: "KY",
    name: "Kentucky",
    type: "lien",
    rate: "Varies — set by 3rd-party purchaser within statutory limits",
    rateNote: "No single fixed statewide rate — purchaser sets rate on each certificate",
    redemption: "Until foreclosure sale (pre-sale redemption only); 6 months additional if sold below 2/3 appraised value",
    bidMethod: "Highest bidder (sheriff sells certificates of delinquency)",
    statute: "KRS §134.420 et seq.",
    officialLink: "https://revenue.ky.gov/ClerkNetwork/Documents/DelinquentCollectionManual20062.pdf",
    auctionPlatform: "County sheriff — in-person",
    auctionTiming: "April–June (most counties)",
    keyNotes: [
      "Sheriff sells Certificates of Delinquency — 3rd party purchasers buy tax bills directly",
      "50-day notice requirement after purchase",
      "Circuit court foreclosure required to obtain deed — no automatic conversion",
      "High redemption rate — most certificates pay out"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 27. Georgia ───────────────────────────────────────────
  {
    code: "GA",
    name: "Georgia",
    type: "redeemable",
    rate: "20% year 1 / 10% year 2+",
    rateNote: "Premium penalty on purchase price — not interest rate bidding",
    redemption: "12 months",
    bidMethod: "Premium bid (highest dollar)",
    statute: "OCGA §48-4-42",
    officialLink: "https://advance.lexis.com/documentpage/?pdmfid=1000516&crid=&pdocfullpath=%2Fshared%2Fdocument%2Fstatutes-legislation%2Furn%3AcontentItem%3A5YD9-KJC1-FGRY-B4V1-00000-00&pdcontentcomponentid=234186",
    auctionPlatform: "County tax commissioner — in-person",
    auctionTiming: "Monthly (first Tuesday of every month)",
    keyNotes: [
      "20% penalty if redeemed in year 1 — one of the highest redeemable returns in the US",
      "10% penalty per year if NOT redeemed after year 1",
      "Investor CANNOT take possession during 12-month redemption period",
      "Barment action required after redemption expires to clear title",
      "Monthly auctions every first Tuesday — high frequency access"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 28. Texas ─────────────────────────────────────────────
  {
    code: "TX",
    name: "Texas",
    type: "redeemable",
    rate: "25% year 1 / 50% year 2 (homestead/ag) — 25% flat (commercial, 180 days)",
    rateNote: "Penalty on purchase price. Homestead/ag = 2-year window. Commercial = 180 days.",
    redemption: "2 years (homestead/agricultural) / 180 days (commercial)",
    bidMethod: "Premium bid (highest dollar)",
    statute: "TX Tax Code §34.21",
    officialLink: "https://statutes.capitol.texas.gov/Docs/TX/htm/TX.34.htm",
    auctionPlatform: "County courthouse steps — in-person (254 counties)",
    auctionTiming: "Monthly (first Tuesday of every month, all 254 counties)",
    keyNotes: [
      "Highest redeemable penalty in the US — 25% year 1 on homestead",
      "Commercial properties: 180-day redemption only — faster resolution",
      "Investor CAN take possession and collect rent during redemption period",
      "254 counties all auction same day — first Tuesday monthly",
      "Acts 2025, 89th Legislature update confirmed December 4, 2025"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 29. Tennessee ─────────────────────────────────────────
  {
    code: "TN",
    name: "Tennessee",
    type: "redeemable",
    rate: "12% per year on purchase price",
    rateNote: "Annual rate on full purchase price — sliding redemption window",
    redemption: "30 days to 365 days depending on length of delinquency",
    bidMethod: "Premium bid",
    statute: "TCA §67-5-2701",
    officialLink: "https://advance.lexis.com/documentpage/?pdmfid=1000516&crid=&pdocfullpath=%2Fshared%2Fdocument%2Fstatutes-legislation%2Furn%3AcontentItem%3A4WX6-FH80-R03N-P18H-00000-00&pdcontentcomponentid=234194",
    auctionPlatform: "County-run — varies by county",
    auctionTiming: "Varies by county",
    keyNotes: [
      "Redemption window slides based on how long property was delinquent — shorter delinquency = shorter redemption",
      "Anti-speculation rule: investor cannot flip immediately after deed clears",
      "Court-ordered sale process — judicial involvement required",
      "12% on full purchase price — lower return than GA or TX but lower competition"
    ],
    investorAlert: null,
    clarityCallCTA: true
  },

  // ── 30. Michigan ──────────────────────────────────────────
  {
    code: "MI",
    name: "Michigan",
    type: "deed",
    rate: "12% year 1 / 18% year 2 (pre-foreclosure interest)",
    rateNote: "3-year forfeiture process — public auction after foreclosure",
    redemption: "3 years total (forfeiture process)",
    bidMethod: "Highest bidder",
    statute: "MCL §211.78",
    officialLink: "https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-211-78",
    auctionPlatform: "Michigan Land Bank / county-run (GovEase in many counties)",
    auctionTiming: "July–September (most counties)",
    keyNotes: [
      "3-year process: year 1 forfeiture notice, year 2 foreclosure judgment, year 3 auction",
      "Tyler v. Hennepin ruling now requires surplus proceeds returned to former owner",
      "Strong rural opportunity in northern Michigan and Upper Peninsula",
      "Wayne County (Detroit) has highest volume — heavy institutional competition"
    ],
    investorAlert: null,
    pendingLegislation: [],
    clarityCallCTA: true
  },

  // ── 31. California ────────────────────────────────────────
  {
    code: "CA",
    name: "California",
    type: "deed",
    rate: "N/A — deed state, no lien product",
    rateNote: "County auctions property — 1-year challenge period after sale",
    redemption: "None after sale — but 1-year challenge period",
    bidMethod: "Highest bidder",
    statute: "CA Revenue & Tax Code §3712",
    officialLink: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=3712&lawCode=RTC",
    auctionPlatform: "GovEase (LA County and most major counties)",
    auctionTiming: "Year-round — LA County 2026 confirmed April and June via GovEase",
    keyNotes: [
      "1-year challenge period after sale — title companies will not insure during this window",
      "IRS liens survive tax deed sale — always check federal liens before bidding",
      "LA County 2026 auctions: April and June confirmed on GovEase",
      "High competition in coastal counties — best value in Central Valley and inland"
    ],
    investorAlert: null,
    pendingLegislation: [],
    clarityCallCTA: true
  },

  // ── 32. North Carolina ────────────────────────────────────
  {
    code: "NC",
    name: "North Carolina",
    type: "deed",
    rate: "N/A — deed state, no lien product",
    rateNote: "Unique upset bid process — sale not final until 10-day window closes",
    redemption: "None after final sale",
    bidMethod: "Highest bidder — subject to upset bid period",
    statute: "NC GS §105-374",
    officialLink: "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_105/GS_105-374.html",
    auctionPlatform: "County-run — in-person and online varies",
    auctionTiming: "Year-round",
    keyNotes: [
      "UNIQUE: 10-day upset bid window after winning bid — any party can overbid by 5% within 10 days",
      "Sale is NOT final until 10-day upset bid period expires with no higher offer",
      "No post-sale redemption once upset bid period closes",
      "Growing market — Charlotte and Triangle metro attract competition"
    ],
    investorAlert: null,
    pendingLegislation: [],
    clarityCallCTA: true
  },

  // ── 33. Pennsylvania ──────────────────────────────────────
  {
    code: "PA",
    name: "Pennsylvania",
    type: "deed",
    rate: "N/A — deed state, no lien product",
    rateNote: "TWO-SALE SYSTEM: Upset sale (dangerous) vs Judicial/Repository sale (clean title)",
    redemption: "None after judicial sale",
    bidMethod: "Highest bidder",
    statute: "72 P.S. §5860.601",
    officialLink: "https://www.legis.state.pa.us/cfdocs/legis/LI/uconsCheck.cfm?txtType=HTM&yr=1947&sessInd=0&smthLwInd=0&act=542&chpt=6&sctn=1&subsctn=0",
    auctionPlatform: "County-run — in-person",
    auctionTiming: "Year-round",
    keyNotes: [
      "CRITICAL: Upset sale = surviving liens (mortgages may remain) — dangerous for investors",
      "Judicial sale and Repository sale = clean title, all liens wiped",
      "Always confirm which type of sale before bidding — upset vs judicial is the difference between clean and clouded title",
      "Philadelphia and Pittsburgh have high volume — mostly judicial sales"
    ],
    investorAlert: "⚠️ Pennsylvania has TWO sale types. Upset Sale: surviving liens remain on title — buying here can mean inheriting a mortgage. Judicial/Repository Sale: clean title. ALWAYS confirm sale type before bidding.",
    pendingLegislation: [],
    clarityCallCTA: true
  },

  // ── 34. Louisiana ─────────────────────────────────────────
  {
    code: "LA",
    name: "Louisiana",
    type: "lien",
    rate: "0.7%–1.0%/month (8.4%–12% annualized)",
    rateNote: "Bid-down interest rate — NEW 2026 SYSTEM replacing ownership bid-down",
    redemption: "3 years",
    bidMethod: "Bid-down interest rate",
    statute: "La. Rev. Stat. §47:2154",
    officialLink: "https://www.legis.la.gov/legis/Law.aspx?d=99775",
    auctionPlatform: "Varies by parish",
    auctionTiming: "Varies by parish",
    keyNotes: [
      "NEW SYSTEM effective January 1 2026 — old ownership bid-down system eliminated",
      "Bid-down interest rate: investor accepts lowest monthly rate willing to take",
      "3-year redemption period — judicial foreclosure required after",
      "7-year statute of limitations on challenges to tax sale title",
      "Mandatory certified mail notices to owner and lienholders required"
    ],
    investorAlert: "⚠️ MAJOR 2026 LAW CHANGE: Louisiana converted from ownership bid-down to interest rate bid-down effective January 1, 2026 (Acts 2024, No. 409). ALL pre-2026 research on Louisiana tax sales is outdated. Do not apply old system rules.",
    pendingLegislation: [
      {
        bill: "Acts 2024, No. 409",
        summary: "Complete overhaul of Louisiana tax sale system — replaced ownership percentage bid-down with interest rate bid-down model. Effective January 1, 2026.",
        status: "passed",
        effectiveDate: "January 1, 2026"
      }
    ],
    clarityCallCTA: true
  },

  // ── 35. Massachusetts ─────────────────────────────────────
  {
    code: "MA",
    name: "Massachusetts",
    type: "hybrid",
    rate: "14%",
    rateNote: "Municipal tax taking — Land Court required for clean title",
    redemption: "Until Land Court decree (no fixed period)",
    bidMethod: "Municipal-controlled process",
    statute: "MGL Ch. 60",
    officialLink: "https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60",
    auctionPlatform: "Municipal — varies by city/town",
    auctionTiming: "Year-round",
    keyNotes: [
      "Municipality initiates tax taking — not a traditional auction",
      "Land Court action required to obtain clean, insurable title",
      "14% statutory rate on the taking amount",
      "Bulk sales used in some municipalities — individual retail access limited",
      "Boston and Cambridge have essentially no retail investor access"
    ],
    investorAlert: null,
    pendingLegislation: [],
    clarityCallCTA: true
  },

  // ── 36. Alaska ────────────────────────────────────────────
  {
    code: "AK",
    name: "Alaska",
    type: "deed",
    rate: "N/A — deed state, no lien product",
    rateNote: "Borough system — not county-based",
    redemption: "None after sale",
    bidMethod: "Varies by borough municipality",
    statute: "AS §29.45.330",
    officialLink: "https://www.akleg.gov/basis/statutes.asp#29.45.330",
    auctionPlatform: "Borough-run — in-person and online varies",
    auctionTiming: "Varies by borough",
    keyNotes: [
      "Alaska uses boroughs not counties — 19 organized boroughs plus unorganized areas",
      "Low inventory state — remote and rural parcels dominate",
      "Bidding method varies by municipality — always contact borough directly before registering"
    ],
    investorAlert: null,
    pendingLegislation: [],
    clarityCallCTA: true
  },

  // ── 37. Arkansas ──────────────────────────────────────────
  {
    code: "AR",
    name: "Arkansas",
    type: "deed",
    rate: "N/A — deed state, no lien product",
    rateNote: "30-day redemption only — fastest deed resolution in the US",
    redemption: "30 days only",
    bidMethod: "Highest bidder",
    statute: "Ark. Code §26-37-101",
    officialLink: "https://advance.lexis.com/documentpage/?pdmfid=1000516&crid=&pdocfullpath=%2Fshared%2Fdocument%2Fstatutes-legislation%2Furn%3AcontentItem%3A5PCX-GT41-JNCK-22SR-00000-00&pdcontentcomponentid=234148",
    auctionPlatform: "County-run — in-person",
    auctionTiming: "Year-round",
    keyNotes: [
      "30-day redemption is one of the shortest in the US — fast resolution for investors",
      "Strong rural land state — Ozarks and Delta regions offer volume",
      "Clean title conveyed after 30-day window closes"
    ],
    investorAlert: null,
    pendingLegislation: [],
    clarityCallCTA: true
  },

  // ── 38. Hawaii ────────────────────────────────────────────
  {
    code: "HI",
    name: "Hawaii",
    type: "redeemable",
    rate: "12% per year on purchase price",
    rateNote: "Annual rate — 1-year post-sale redemption window",
    redemption: "1 year",
    bidMethod: "Highest bidder",
    statute: "HRS §246-60",
    officialLink: "https://www.capitol.hawaii.gov/hrscurrent/Vol05_Ch0261-0319/HRS0246/HRS_0246-0060.htm",
    auctionPlatform: "County tax collector — in-person",
    auctionTiming: "Varies by county",
    keyNotes: [
      "Redeemable deed state — deed conveyed at sale but owner has 1 year to redeem",
      "4 counties only (Honolulu, Maui, Hawaii, Kauai) — very limited inventory",
      "High property values mean high minimum bids — capital intensive",
      "12% on purchase price during redemption period"
    ],
    investorAlert: null,
    pendingLegislation: [],
    clarityCallCTA: true
  },

  // ── 39. Idaho ─────────────────────────────────────────────
  {
    code: "ID",
    name: "Idaho",
    type: "deed",
    rate: "N/A — deed state, no lien product",
    rateNote: "No post-sale redemption — buyer takes clean title",
    redemption: "None after sale",
    bidMethod: "Highest bidder (oral auction)",
    statute: "Idaho Code §63-1001",
    officialLink: "https://legislature.idaho.gov/statutesrules/idstat/Title63/T63CH10/SECT63-1001/",
    auctionPlatform: "County commissioner — in-person",
    auctionTiming: "Varies by county",
    keyNotes: [
      "No post-sale redemption — immediate clean title",
      "Housing shortage driving strong demand statewide",
      "Boise-area properties attract heavy competition — best value in rural eastern and northern Idaho"
    ],
    investorAlert: null,
    pendingLegislation: [],
    clarityCallCTA: true
  },

  // ── 40. Kansas ────────────────────────────────────────────
  {
    code: "KS",
    name: "Kansas",
    type: "hybrid",
    rate: "12% fixed",
    rateNote: "Lien phase earns 12% — court action required to convert to deed",
    redemption: "3 years",
    bidMethod: "Highest bidder",
    statute: "K.S.A. §79-2803",
    officialLink: "https://kslegislature.org/li_2024/b2023_24/statute/079_000_0000_chapter/079_028_0000_article/079_028_0003_section/079_028_0003_k/",
    auctionPlatform: "County treasurer — in-person",
    auctionTiming: "September (most counties)",
    keyNotes: [
      "12% fixed rate on lien phase",
      "3-year redemption before deed eligible",
      "Court action required to obtain deed — no automatic conversion",
      "Rural ag land heavy — Wichita metro has more competition"
    ],
    investorAlert: null,
    pendingLegislation: [],
    clarityCallCTA: true
  },

  // ── 41. Maine ─────────────────────────────────────────────
  {
    code: "ME",
    name: "Maine",
    type: "lien",
    rate: "18% max",
    rateNote: "18-month redemption via tax lien mortgage — municipal process",
    redemption: "18 months",
    bidMethod: "Municipal-controlled",
    statute: "Me. Rev. Stat. tit. 36 §943",
    officialLink: "https://legislature.maine.gov/statutes/36/title36sec943.html",
    auctionPlatform: "Municipal — varies by town",
    auctionTiming: "Year-round",
    keyNotes: [
      "Tax lien mortgage system — municipality holds lien, not sold directly to investors in most cases",
      "After 18 months unredeemed, municipality forecloses and may sell property",
      "PL 2025, c. 351 update — verify current municipal procedures",
      "Retail investor access is limited — primarily municipal sales of foreclosed properties"
    ],
    investorAlert: null,
    pendingLegislation: [
      {
        bill: "PL 2025, c. 351",
        summary: "2025 update to Maine tax lien mortgage procedures. Verify current municipal requirements before transacting.",
        status: "passed",
        effectiveDate: "2025"
      }
    ],
    clarityCallCTA: true
  },

  // ── 42. Utah ──────────────────────────────────────────────
  {
    code: "UT",
    name: "Utah",
    type: "deed",
    rate: "N/A — deed state, no lien product",
    rateNote: "Statewide same-day auction — all counties sell on same day in May",
    redemption: "None after sale",
    bidMethod: "Highest bidder (premium bid)",
    statute: "Utah Code §59-2-1351",
    officialLink: "https://le.utah.gov/xcode/Title59/Chapter2/59-2-S1351.html",
    auctionPlatform: "County treasurer — in-person (all counties same day)",
    auctionTiming: "May — all counties statewide on same day",
    keyNotes: [
      "All 29 counties auction on the same day in May — investor must choose which county to attend",
      "No post-sale redemption — clean title conveyed",
      "Always research water rights on Utah properties — water rights are separate from land and critical in this state",
      "Salt Lake and Utah County properties attract heavy competition"
    ],
    investorAlert: null,
    pendingLegislation: [],
    clarityCallCTA: true
  },

  // ── 43. Virginia ──────────────────────────────────────────
  {
    code: "VA",
    name: "Virginia",
    type: "deed",
    rate: "N/A — deed state, no lien product",
    rateNote: "Judicial process — court-ordered sale",
    redemption: "None after judicial sale",
    bidMethod: "Highest bidder (premium bid)",
    statute: "VA Code §58.1-3965",
    officialLink: "https://law.lis.virginia.gov/vacode/title58.1/chapter39/section58.1-3965/",
    auctionPlatform: "County-run — in-person",
    auctionTiming: "Varies by county",
    keyNotes: [
      "Judicial sale process — court involvement required",
      "Rural Southwest and Southside Virginia offer best investor opportunity",
      "Northern Virginia (NoVA) has essentially no accessible inventory — prices too high for tax deed plays",
      "Clean title after judicial sale"
    ],
    investorAlert: null,
    pendingLegislation: [],
    clarityCallCTA: true
  },

  // ── 44. Wisconsin ─────────────────────────────────────────
  {
    code: "WI",
    name: "Wisconsin",
    type: "deed",
    rate: "N/A — deed state, no lien product",
    rateNote: "Year-round sales — clean title conveyed",
    redemption: "None after sale",
    bidMethod: "Highest bidder",
    statute: "WI Statutes §74.53",
    officialLink: "https://docs.legis.wisconsin.gov/statutes/statutes/74/53",
    auctionPlatform: "County-run — in-person and online varies",
    auctionTiming: "Year-round",
    keyNotes: [
      "Year-round sales across all 72 counties",
      "Rural Wisconsin strong for land and recreational property",
      "Environmental title risks in industrial counties — always check DNR records before bidding on former industrial land",
      "Clean title conveyed at sale"
    ],
    investorAlert: null,
    pendingLegislation: [],
    clarityCallCTA: true
  },

  // ── 45. Alabama ───────────────────────────────────────────
  {
    code: "AL",
    name: "Alabama",
    type: "lien",
    rate: "12% fixed",
    rateNote: "Bid-down interest rate — converted from deed state in 2018",
    redemption: "3 years (auto-converts to deed)",
    bidMethod: "Bid-down interest rate",
    statute: "AL Code §40-10-180",
    officialLink: "https://alison.legislature.state.al.us/codeofalabama/1975/coatoc.htm",
    auctionPlatform: "County-run — in-person",
    auctionTiming: "April–June (most counties)",
    keyNotes: [
      "Converted from deed to lien state via Act 2018-577 — pre-2018 research is outdated",
      "12% fixed bid-down rate",
      "3-year redemption then automatic deed conversion",
      "Foreclosure still required for fully clean insurable title post-conversion",
      "67 counties — strong rural land inventory"
    ],
    investorAlert: null,
    pendingLegislation: [],
    clarityCallCTA: true
  }

];
