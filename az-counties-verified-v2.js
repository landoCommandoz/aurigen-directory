// ═══════════════════════════════════════════════════════════
// ARIZONA — 15 COUNTIES — FULL STRUCTURE v2
// Statute: ARS Title 42, Chapter 18
// Type: TAX LIEN
// ═══════════════════════════════════════════════════════════
//
// STATE-LEVEL RULES (apply to all 15 counties):
//
// AUCTION:
//   Statute: ARS §42-18126
//   Sale: Annual — February
//   Method: Online via RealAuction — bid DOWN from 16% in 1% increments
//   0% bid: Accepted
//   Certificate: "Certificate of Purchase"
//   Single Bidder Rule: Enforced statewide — one entity per auction
//   Deposit: 10% of intended bids, $500 minimum, via ACH
//
// OTC / STATE CP / ASSIGNMENT:
//   Statute: ARS §42-18118
//   Name: "OTC Assignment" / "State CP" (Certificate of Purchase)
//   Trigger: No bidder → lien struck to State of Arizona
//   Rate: 16% (statutory maximum — no bidding)
//   Available: Year-round (most counties) — except Jan–Mar (Pima)
//   Process: Purchase via county treasurer or RealAuction assignment portal
//   Fee: Per ARS §42-18116 and §42-18118
//   Note: Assignments available by mail or online; some counties require form
//
// SUB-TAX / SUBSEQUENT TAX:
//   Statute: ARS §42-18121
//   Name: "Subsequent Tax Purchase" / "Sub-Tax"
//   Fee: $5.00 per parcel
//   Available: Year-round (specific windows vary by county)
//   Rate: Earns same rate as original Certificate of Purchase
//   Note: Must be purchased during dates set by county — not Jan–Mar (Pima)
//
// CERTIFICATE TRANSFER / ASSIGNMENT:
//   Statute: ARS §42-18118
//   Available: After purchase — transfer to another investor
//   Process: Via county treasurer or RealAuction platform
//
// REDEMPTION:
//   Statute: ARS §42-18151, §42-18152
//   Period: Anytime — but foreclosure eligible 3 years after purchase date
//   Lien Expiry: 10 years from date of purchase (if no action taken)
//   Note: Owner may redeem at any time before foreclosure judgment
//
// FORECLOSURE PATH:
//   Statute: ARS §42-18201 et seq.
//   Eligible: 3 years after date of original lien purchase
//   Process: Civil action in Superior Court to foreclose right to redeem
//   Quiet title: Not required by statute — but recommended
//   Deed: County Treasurer executes deed upon certified court judgment
//         + $50 fee per parcel (ARS §42-18204)
//
// SURPLUS / EXCESS PROCEEDS:
//   Statute: ARS §42-18303 (Tax Deeded Land Sales)
//   Name: "Excess Proceeds"
//   Trigger: At tax deeded land sale — overbid above minimum
//   Claim: Filed with county treasurer
//   Note: At foreclosure stage — any surplus from deed sale goes to
//         former owner. Process through Superior Court.
//
// ═══════════════════════════════════════════════════════════

const AZ_STATE_RULES = {
  type: "lien",
  auction: {
    frequency: "Annual",
    saleMonth: "February",
    bidMethod: "Online reverse auction — bid DOWN from 16% in 1% increments",
    startRate: "16%",
    zeroBid: "Accepted — earns zero interest",
    certificateName: "Certificate of Purchase",
    singleBidderRule: true,
    deposit: "10% of intended bids, $500 minimum, ACH only",
    statute: "ARS §42-18126"
  },
  otc: {
    available: true,
    name: "OTC Assignment / State CP",
    rate: "16% (statutory maximum)",
    availableWhen: "Year-round except Jan–Mar (varies by county)",
    process: "Purchase via county treasurer or RealAuction assignment portal",
    fee: "Per ARS §42-18116 and §42-18118",
    statute: "ARS §42-18118",
    note: "Struck to State of Arizona when no bidder. Available by mail or online."
  },
  subTax: {
    available: true,
    name: "Subsequent Tax Purchase (Sub-Tax)",
    fee: "$5.00 per parcel",
    statute: "ARS §42-18121",
    note: "Earns same rate as original certificate. County-specific date windows apply."
  },
  redemption: {
    period: "Anytime before foreclosure judgment (lien expires 10 years if no action)",
    statute: "ARS §42-18151, §42-18152",
    homesteadDifferent: false,
    agDifferent: false,
    note: "Foreclosure eligible 3 years after purchase. 10-year lien expiry if no action."
  },
  deedPath: {
    name: "Foreclosure of Right to Redeem",
    eligibleAfter: "3 years from date of purchase",
    process: "Civil action in Superior Court → certified judgment → Treasurer executes deed",
    statute: "ARS §42-18201 et seq.",
    deedFee: "$50 per parcel (ARS §42-18204)",
    quietTitleRequired: false,
    quietTitleRecommended: true
  },
  surplus: {
    available: true,
    name: "Excess Proceeds",
    statute: "ARS §42-18303",
    process: "Overbid at deed sale → former owner claims through county treasurer / Superior Court",
    note: "At tax deeded land sale stage only"
  },
  results: {
    lastSaleUrl: null,
    avgRateBid: null,
    totalLiensSold: null,
    totalValue: null
  }
};

window.COUNTY_DATA = window.COUNTY_DATA || {};
window.COUNTY_DATA['AZ'] = [
  {
    county:"Apache",
    auction:{url:"https://www.apachecountyaz.gov/Treasurer", saleUrl:"https://apache.arizonataxsale.com", platform:"RealAuction", saleDate2026:"February 18, 2026", note:"Bidding opens Feb 4"},
    otc:{...AZ_STATE_RULES.otc, url:"https://www.apachecountyaz.gov/Treasurer"},
    ...AZ_STATE_RULES, verified:true
  },
  {
    county:"Cochise",
    auction:{url:"https://www.cochise.az.gov/treasurer", saleUrl:"https://cochise.arizonataxsale.com", platform:"RealAuction", saleDate2026:"February 2026"},
    otc:{...AZ_STATE_RULES.otc, url:"https://www.cochise.az.gov/treasurer"},
    ...AZ_STATE_RULES, verified:true
  },
  {
    county:"Coconino",
    auction:{url:"https://www.coconino.az.gov/376/Tax-Liens", saleUrl:"https://coconino.arizonataxsale.com", platform:"RealAuction", saleDate2026:"February 10, 2026", note:"Published AZ Daily Sun Jan 20 2026"},
    otc:{...AZ_STATE_RULES.otc, url:"https://www.coconino.az.gov/376/Tax-Liens"},
    ...AZ_STATE_RULES, verified:true
  },
  {
    county:"Gila",
    auction:{url:"https://www.gilacountyaz.gov/government/treasurer/tax_lein_sale.php", saleUrl:"https://gila.arizonataxsale.com", platform:"RealAuction", saleDate2026:"February 2026"},
    otc:{...AZ_STATE_RULES.otc, url:"https://www.gilacountyaz.gov/government/treasurer/tax_lein_sale.php"},
    ...AZ_STATE_RULES, verified:true
  },
  {
    county:"Graham",
    auction:{url:"https://www.graham.az.gov/362/Tax-Sale-Lien-Guidelines", saleUrl:"https://graham.arizonataxsale.com", platform:"RealAuction", saleDate2026:"February 25, 2026", note:"2024 taxes sold; foreclosure after 3 yrs"},
    otc:{...AZ_STATE_RULES.otc, url:"https://www.graham.az.gov/362/Tax-Sale-Lien-Guidelines"},
    ...AZ_STATE_RULES, verified:true
  },
  {
    county:"Greenlee",
    auction:{url:"https://greenlee.az.gov/tax-lien-sale-faq/", saleUrl:"https://greenlee.arizonataxsale.com", platform:"RealAuction", saleDate2026:"February 2026"},
    otc:{...AZ_STATE_RULES.otc, url:"https://greenlee.az.gov/tax-lien-sale-faq/"},
    ...AZ_STATE_RULES, verified:true
  },
  {
    county:"La Paz",
    auction:{url:"https://lapaztreas.com/tax-lien-sale-1", saleUrl:"https://lapaz.arizonataxsale.com", platform:"RealAuction", saleDate2026:"February 25, 2026", note:"List published Feb 11 2026 in Parker Pioneer"},
    otc:{...AZ_STATE_RULES.otc, url:"https://lapaztreas.com/tax-lien-sale-1"},
    ...AZ_STATE_RULES, verified:true
  },
  {
    county:"Maricopa",
    auction:{url:"https://treasurer.maricopa.gov/Pages/LoadPage?page=LiensAndResearch", saleUrl:"https://maricopa.arizonataxsale.com", platform:"RealAuction", saleDate2026:"February 10, 2026", note:"Bidding opens Jan 16; $500 min deposit"},
    otc:{...AZ_STATE_RULES.otc, url:"https://treasurer.maricopa.gov/Pages/LoadPage?page=LiensAndResearch", availableWhen:"Year-round except Jan–Mar; in-person or mail", note:"Assignments available starting March 3 2025 for 2023 certs"},
    ...AZ_STATE_RULES, verified:true
  },
  {
    county:"Mohave",
    auction:{url:"https://www.mohave.gov/departments/treasurer/tax-liens/tax-lien-sale/", saleUrl:"https://mohave.arizonataxsale.com", platform:"RealAuction", saleDate2026:"February 2026"},
    otc:{...AZ_STATE_RULES.otc, url:"https://www.mohave.gov/departments/treasurer/tax-liens/tax-lien-sale/"},
    ...AZ_STATE_RULES, verified:true
  },
  {
    county:"Navajo",
    auction:{url:"https://www.navajocountyaz.gov/459/February-Lien-Sale-Instructions", saleUrl:"https://navajo.arizonataxsale.com", platform:"RealAuction", saleDate2026:"February 11, 2026", note:"7am MST; bidding opens Feb 3"},
    otc:{...AZ_STATE_RULES.otc, url:"https://www.navajocountyaz.gov/459/February-Lien-Sale-Instructions"},
    ...AZ_STATE_RULES, verified:true
  },
  {
    county:"Pima",
    auction:{url:"https://www.to.pima.gov/taxLienSale/", saleUrl:"https://pima.arizonataxsale.com", platform:"RealAuction", saleDate2026:"February 26, 2026", note:"Registration Feb 2–19; first batch closes 8am MST"},
    otc:{...AZ_STATE_RULES.otc, url:"https://www.to.pima.gov/taxLienSale/", availableWhen:"Year-round EXCEPT Jan, Feb, March", note:"$50 data fee for parcel list (updated monthly)"},
    ...AZ_STATE_RULES, verified:true
  },
  {
    county:"Pinal",
    auction:{url:"https://www.pinal.gov/780/Tax-Lien-Sale", saleUrl:"https://pinal.arizonataxsale.com", platform:"RealAuction", saleDate2026:"February 12, 2026", note:"Deposit via wire/ACH day before sale"},
    otc:{...AZ_STATE_RULES.otc, url:"https://www.pinal.gov/780/Tax-Lien-Sale"},
    ...AZ_STATE_RULES, verified:true
  },
  {
    county:"Santa Cruz",
    auction:{url:"https://www.santacruzcountyaz.gov/317/Treasurer", saleUrl:"https://santacruz.arizonataxsale.com", platform:"RealAuction", saleDate2026:"February 10, 2026", note:"CC/debit deadline Feb 3; ACH only after sale"},
    otc:{...AZ_STATE_RULES.otc, url:"https://www.santacruzcountyaz.gov/317/Treasurer"},
    ...AZ_STATE_RULES, verified:true
  },
  {
    county:"Yavapai",
    auction:{url:"https://www.yavapaiaz.gov/Mapping-and-Properties/Property-Taxes/Treasurers-Office/Treasurers-Tax-Lien-Sale", saleUrl:"https://yavapai.arizonataxsale.com", platform:"RealAuction", saleDate2026:"February 10, 2026"},
    otc:{...AZ_STATE_RULES.otc, url:"https://www.yavapaiaz.gov/Mapping-and-Properties/Property-Taxes/Treasurers-Office/Treasurers-Tax-Lien-Sale"},
    ...AZ_STATE_RULES, verified:true
  },
  {
    county:"Yuma",
    auction:{url:"https://www.yumacountyaz.gov/government/treasurer/tax-lien-information", saleUrl:"https://yuma.arizonataxsale.com", platform:"RealAuction", saleDate2026:"February 2026"},
    otc:{...AZ_STATE_RULES.otc, url:"https://www.yumacountyaz.gov/government/treasurer/tax-lien-information"},
    ...AZ_STATE_RULES, verified:true
  },
];

window.COUNTY_DATA['AZ_STATE_RULES'] = AZ_STATE_RULES;
console.log('AZ counties loaded:', window.COUNTY_DATA['AZ'].length);
