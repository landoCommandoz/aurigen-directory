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
  }

];
