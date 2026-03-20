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
  }

];
