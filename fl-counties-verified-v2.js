// ═══════════════════════════════════════════════════════════
// FLORIDA — 67 COUNTIES — FULL STRUCTURE v2
// Statute: FL Stat Chapter 197
// Type: HYBRID (lien → deed path)
// ═══════════════════════════════════════════════════════════
//
// STATE-LEVEL RULES (apply to all 67 counties):
//
// AUCTION:
//   Statute: FL Stat §197.432
//   Sale: Annually on or before June 1
//   Method: Online reverse auction — bid DOWN from 18%
//   Min interest earned: 5% (unless bid at 0%)
//   0% bid: Earns zero interest, no 5% minimum
//   Certificate life: 7 years
//
// OTC / COUNTY-HELD CERTIFICATES:
//   Statute: FL Stat §197.4725
//   Name: "County-Held Certificate"
//   Rate: 18% (struck to county at 18%)
//   Available: Any time after issuance, before tax deed application
//   Platform: LienHub (most counties) — same platform as main auction
//   Fee: Face value + accrued interest + $6.25 admin fee
//   Note: Available Sept 1 onward for that year's unsold certs
//
// SUB-TAX / SUBSEQUENT TAX:
//   Statute: FL Stat §197.202
//   Name: "Subsequent Tax Purchase" / "Sub-Tax"
//   Available: Yes — certificate holder may pay future delinquent years
//   Fee: $6.25 per parcel
//   Effect: Adds to original certificate, earns same rate as original
//   Note: Must be paid before tax deed application or added separately
//
// CERTIFICATE TRANSFER / ASSIGNMENT:
//   Statute: FL Stat §197.462
//   Name: "Certificate Transfer / Endorsement"
//   Available: Any time before redemption or tax deed issued
//   Fee: $2.25 per certificate
//   Process: Submit Endorsement Form to Tax Collector
//
// REDEMPTION:
//   Statute: FL Stat §197.472
//   Period: Owner may redeem ANY TIME after certificate issued
//            until tax deed is issued and final payment made to Clerk
//   Homestead: Same redemption rules
//   Ag: Same redemption rules
//   Note: Owner can redeem on auction day before winning bidder's final payment
//
// TAX DEED APPLICATION (path to deed):
//   Statute: FL Stat §197.502
//   Eligible: 2 years after date of delinquency (April 1 of delinquent year)
//   Deadline: No later than 7 years from certificate issuance
//   Process: Certificate holder applies through Tax Collector
//            → Clerk of Circuit Court conducts tax deed auction
//   Deed auction platform: RealAuction or county clerk system (varies)
//
// SURPLUS FUNDS:
//   Statute: FL Stat §197.582
//   Name: "Surplus Funds" / "Tax Deed Surplus"
//   Trigger: Tax deed sale bid exceeds minimum (opening) bid
//   Claim period: 120 days from mailed Notice of Surplus
//   Who can claim: Lienholders (120 days), former titleholders
//   Process: File written claim with Clerk of Circuit Court
//   Warning: Non-governmental lienholders barred after 120 days
//   Note: Surplus held by Clerk for 1 year, then escheats to state
//
// FORECLOSURE PATH:
//   Statute: FL Stat §197.502 (tax deed application)
//   Not a traditional foreclosure — certificate holder applies for
//   tax deed through Tax Collector, Clerk conducts public auction
//   Quiet title: Not required by statute but strongly recommended
//   for marketable/insurable title post-deed-sale
//
// ═══════════════════════════════════════════════════════════

// State-level template applied to all 67 counties
const FL_STATE_RULES = {
  type: "hybrid",
  auction: {
    frequency: "Annual",
    saleMonth: "May-June",
    saleDate2026: "On or before June 1, 2026",
    bidMethod: "Reverse auction — interest rate bid DOWN from 18%",
    startRate: "18%",
    minInterest: "5% (unless 0% bid)",
    zeroBid: "0% bid earns zero interest, no minimum",
    deposit: "10% minimum per LienHub registration",
    statute: "FL Stat §197.432"
  },
  otc: {
    available: true,
    name: "County-Held Certificate",
    rate: "18%",
    availableWhen: "Available Sept 1 onward after annual sale",
    fee: "Face value + accrued interest + $6.25",
    statute: "FL Stat §197.4725",
    note: "Purchased through same platform as main auction"
  },
  subTax: {
    available: true,
    name: "Subsequent Tax Purchase (Sub-Tax)",
    fee: "$6.25 per parcel",
    statute: "FL Stat §197.202",
    note: "Earns same rate as original certificate"
  },
  transfer: {
    available: true,
    name: "Certificate Transfer / Endorsement",
    fee: "$2.25 per certificate",
    statute: "FL Stat §197.462",
    note: "Submit Endorsement Form to Tax Collector"
  },
  redemption: {
    period: "Anytime after issuance until tax deed issued",
    statute: "FL Stat §197.472",
    homesteadDifferent: false,
    agDifferent: false,
    note: "Owner may redeem on auction day before winning bidder final payment"
  },
  deedPath: {
    name: "Tax Deed Application",
    eligibleAfter: "2 years from April 1 of delinquent year",
    deadline: "7 years from certificate issuance",
    process: "Certificate holder applies through Tax Collector → Clerk conducts deed auction",
    statute: "FL Stat §197.502",
    quietTitleRequired: false,
    quietTitleRecommended: true,
    note: "Quiet title not required but strongly recommended for insurable title"
  },
  surplus: {
    available: true,
    name: "Tax Deed Surplus Funds",
    claimPeriod: "120 days from mailed Notice of Surplus",
    statute: "FL Stat §197.582",
    process: "File written claim with Clerk of Circuit Court",
    warning: "Non-gov lienholders barred after 120 days — permanently",
    note: "Surplus held 1 year by Clerk, then escheats to state"
  },
  results: {
    lastSaleUrl: null,
    avgRateBid: null,
    totalLiensSold: null,
    totalValue: null
  }
};

window.COUNTY_DATA = window.COUNTY_DATA || {};
window.COUNTY_DATA['FL'] = [
  // All 67 counties — auction URLs verified from FL DOR 2025 PDF
  // All state-level rules apply uniformly
  // County-specific: auction URL, platform, deed auction URL
  {county:"Alachua",      auction:{url:"https://lienhub.com/county/alachua",platform:"LienHub"},    deedAuction:{url:"https://lienhub.com/county/alachua",platform:"LienHub"},    ...FL_STATE_RULES, verified:true},
  {county:"Baker",        auction:{url:"https://www.taxcertsale.com/bakertaxsale/Default.aspx",platform:"TaxCertSale"}, deedAuction:{url:"https://baker.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Bay",          auction:{url:"https://lienhub.com/county/bay",platform:"LienHub"},         deedAuction:{url:"https://bay.realtaxdeed.com",platform:"RealTaxDeed"},         ...FL_STATE_RULES, verified:true},
  {county:"Bradford",     auction:{url:"https://www.bradfordtaxcollector.com/Property/TaxCertificates",platform:"Bradford TC"}, deedAuction:{url:"https://bradford.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Brevard",      auction:{url:"https://lienhub.com/county/brevard",platform:"LienHub"},     deedAuction:{url:"https://brevard.realtaxdeed.com",platform:"RealTaxDeed"},     ...FL_STATE_RULES, verified:true},
  {county:"Broward",      auction:{url:"https://lienhub.com/county/broward",platform:"LienHub"},     deedAuction:{url:"https://broward.realtaxdeed.com",platform:"RealTaxDeed"},     ...FL_STATE_RULES, verified:true},
  {county:"Calhoun",      auction:{url:"https://www.taxcertsale.com/CalhounTaxSale/Default.aspx",platform:"TaxCertSale"}, deedAuction:{url:"https://calhoun.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Charlotte",    auction:{url:"https://lienhub.com/county/charlotte",platform:"LienHub"},   deedAuction:{url:"https://charlotte.realtaxdeed.com",platform:"RealTaxDeed"},   ...FL_STATE_RULES, verified:true},
  {county:"Citrus",       auction:{url:"https://lienhub.com/county/citrus",platform:"LienHub"},      deedAuction:{url:"https://citrus.realtaxdeed.com",platform:"RealTaxDeed"},      ...FL_STATE_RULES, verified:true},
  {county:"Clay",         auction:{url:"https://lienhub.com/county/clay",platform:"LienHub"},        deedAuction:{url:"https://clay.realtaxdeed.com",platform:"RealTaxDeed"},        ...FL_STATE_RULES, verified:true},
  {county:"Collier",      auction:{url:"https://lienhub.com/county/collier",platform:"LienHub"},     deedAuction:{url:"https://collier.realtaxdeed.com",platform:"RealTaxDeed"},     ...FL_STATE_RULES, verified:true},
  {county:"Columbia",     auction:{url:"https://columbiafl.realtaxlien.com/",platform:"RealTaxLien"},deedAuction:{url:"https://columbia.realtaxdeed.com",platform:"RealTaxDeed"},    ...FL_STATE_RULES, verified:true},
  {county:"DeSoto",       auction:{url:"https://www.taxcertsale.com/desototaxsale/Default.aspx",platform:"TaxCertSale"}, deedAuction:{url:"https://desoto.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Dixie",        auction:{url:"https://dixiefl.realtaxlien.com/",platform:"RealTaxLien"},   deedAuction:{url:"https://dixie.realtaxdeed.com",platform:"RealTaxDeed"},       ...FL_STATE_RULES, verified:true},
  {county:"Duval",        auction:{url:"https://lienhub.com/county/duval",platform:"LienHub"},       deedAuction:{url:"https://duval.realtaxdeed.com",platform:"RealTaxDeed"},       ...FL_STATE_RULES, verified:true},
  {county:"Escambia",     auction:{url:"https://lienhub.com/county/escambia",platform:"LienHub"},    deedAuction:{url:"https://escambia.realtaxdeed.com",platform:"RealTaxDeed"},    ...FL_STATE_RULES, verified:true},
  {county:"Flagler",      auction:{url:"https://lienhub.com/county/flagler",platform:"LienHub"},     deedAuction:{url:"https://flagler.realtaxdeed.com",platform:"RealTaxDeed"},     ...FL_STATE_RULES, verified:true},
  {county:"Franklin",     auction:{url:"https://www.taxcertsale.com/franklintaxsale/Default.aspx",platform:"TaxCertSale"}, deedAuction:{url:"https://franklin.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Gadsden",      auction:{url:"https://gadsdenfl.realtaxlien.com/",platform:"RealTaxLien"}, deedAuction:{url:"https://gadsden.realtaxdeed.com",platform:"RealTaxDeed"},    ...FL_STATE_RULES, verified:true},
  {county:"Gilchrist",    auction:{url:"https://gilchristfl.realtaxlien.com/",platform:"RealTaxLien"},deedAuction:{url:"https://gilchrist.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Glades",       auction:{url:"https://www.taxcertsale.com/gladestaxsale/Default.aspx",platform:"TaxCertSale"}, deedAuction:{url:"https://glades.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Gulf",         auction:{url:"https://www.taxcertsale.com/gulftaxsale/Default.aspx",platform:"TaxCertSale"}, deedAuction:{url:"https://gulf.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Hamilton",     auction:{url:"https://www.taxcertsale.com/hamiltontaxsale/Default.aspx",platform:"TaxCertSale"}, deedAuction:{url:"https://hamilton.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Hardee",       auction:{url:"https://www.taxcertsale.com/hardeetaxsale/Default.aspx",platform:"TaxCertSale"}, deedAuction:{url:"https://hardee.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Hendry",       auction:{url:"https://auction.hendry.tax",platform:"Hendry TC"},           deedAuction:{url:"https://hendry.realtaxdeed.com",platform:"RealTaxDeed"},     ...FL_STATE_RULES, verified:true},
  {county:"Hernando",     auction:{url:"https://lienhub.com/county/hernando",platform:"LienHub"},    deedAuction:{url:"https://hernando.realtaxdeed.com",platform:"RealTaxDeed"},   ...FL_STATE_RULES, verified:true},
  {county:"Highlands",    auction:{url:"https://auction.highlands.tax/",platform:"Highlands TC"},    deedAuction:{url:"https://highlands.realtaxdeed.com",platform:"RealTaxDeed"},  ...FL_STATE_RULES, verified:true},
  {county:"Hillsborough", auction:{url:"https://lienhub.com/county/hillsborough",platform:"LienHub"},deedAuction:{url:"https://hillsborough.realtaxdeed.com",platform:"RealTaxDeed"},...FL_STATE_RULES, verified:true},
  {county:"Holmes",       auction:{url:"https://www.taxcertsale.com/holmestaxsale/Default.aspx",platform:"TaxCertSale"}, deedAuction:{url:"https://holmes.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Indian River", auction:{url:"https://lienhub.com/county/indianriver",platform:"LienHub"}, deedAuction:{url:"https://indianriver.realtaxdeed.com",platform:"RealTaxDeed"},...FL_STATE_RULES, verified:true},
  {county:"Jackson",      auction:{url:"https://www.taxcertsale.com/jacksontaxsale/Default.aspx",platform:"TaxCertSale"}, deedAuction:{url:"https://jackson.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Jefferson",    auction:{url:"https://www.taxcertsale.com/jeffersontaxsale/Default.aspx",platform:"TaxCertSale"}, deedAuction:{url:"https://jefferson.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Lafayette",    auction:{url:"https://lafayettefl.realtaxlien.com",platform:"RealTaxLien"},deedAuction:{url:"https://lafayette.realtaxdeed.com",platform:"RealTaxDeed"},  ...FL_STATE_RULES, verified:true},
  {county:"Lake",         auction:{url:"https://lienhub.com/county/lake",platform:"LienHub"},        deedAuction:{url:"https://lake.realtaxdeed.com",platform:"RealTaxDeed"},       ...FL_STATE_RULES, verified:true},
  {county:"Lee",          auction:{url:"https://lienhub.com/county/lee",platform:"LienHub"},         deedAuction:{url:"https://lee.realtaxdeed.com",platform:"RealTaxDeed"},        ...FL_STATE_RULES, verified:true},
  {county:"Leon",         auction:{url:"https://leontaxsale.wfbsusa.com/default.aspx",platform:"WFBS"}, deedAuction:{url:"https://leon.realtaxdeed.com",platform:"RealTaxDeed"},   ...FL_STATE_RULES, verified:true},
  {county:"Levy",         auction:{url:"https://levytaxsale.wfbsusa.com/default.aspx",platform:"WFBS"}, deedAuction:{url:"https://levy.realtaxdeed.com",platform:"RealTaxDeed"},   ...FL_STATE_RULES, verified:true},
  {county:"Liberty",      auction:{url:"https://www.taxcertsale.com/LibertyTaxSale",platform:"TaxCertSale"}, deedAuction:{url:"https://liberty.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Madison",      auction:{url:"https://www.taxcertsale.com/madisontaxsale/Default.aspx",platform:"TaxCertSale"}, deedAuction:{url:"https://madison.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Manatee",      auction:{url:"https://www.pacificblueauction.com",platform:"Pacific Blue"}, deedAuction:{url:"https://manatee.realtaxdeed.com",platform:"RealTaxDeed"},  ...FL_STATE_RULES, verified:true},
  {county:"Marion",       auction:{url:"https://mariontaxsale.wfbsusa.com/Default.aspx",platform:"WFBS"}, deedAuction:{url:"https://marion.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Martin",       auction:{url:"https://lienhub.com/county/martin",platform:"LienHub"},      deedAuction:{url:"https://martin.realtaxdeed.com",platform:"RealTaxDeed"},    ...FL_STATE_RULES, verified:true},
  {county:"Miami-Dade",   auction:{url:"https://lienhub.com/county/miamidade",platform:"LienHub"},   deedAuction:{url:"https://miamidade.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Monroe",       auction:{url:"https://lienhub.com/county/monroe",platform:"LienHub"},      deedAuction:{url:"https://monroe.realtaxdeed.com",platform:"RealTaxDeed"},    ...FL_STATE_RULES, verified:true},
  {county:"Nassau",       auction:{url:"https://lienhub.com/county/nassau",platform:"LienHub"},      deedAuction:{url:"https://nassau.realtaxdeed.com",platform:"RealTaxDeed"},    ...FL_STATE_RULES, verified:true},
  {county:"Okaloosa",     auction:{url:"https://lienhub.com/county/okaloosa/certsale/main",platform:"LienHub"}, deedAuction:{url:"https://okaloosa.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Okeechobee",   auction:{url:"https://www.taxcertsale.com/okeechobeetaxsale/Default.aspx",platform:"TaxCertSale"}, deedAuction:{url:"https://okeechobee.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Orange",       auction:{url:"https://lienhub.com/county/orange",platform:"LienHub"},      deedAuction:{url:"https://www.occompt.com/191/Tax-Deed-Sales",platform:"RealAuction"}, ...FL_STATE_RULES, verified:true},
  {county:"Osceola",      auction:{url:"https://lienhub.com/county/osceola/certsale/main",platform:"LienHub"}, deedAuction:{url:"https://osceola.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Palm Beach",   auction:{url:"https://palmbeachfl.realtaxlien.com/",platform:"RealTaxLien"},deedAuction:{url:"https://palmbeach.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Pasco",        auction:{url:"https://lienhub.com/county/pasco",platform:"LienHub"},       deedAuction:{url:"https://pasco.realtaxdeed.com",platform:"RealTaxDeed"},     ...FL_STATE_RULES, verified:true},
  {county:"Pinellas",     auction:{url:"https://lienhub.com/county/pinellas",platform:"LienHub"},    deedAuction:{url:"https://pinellas.realtaxdeed.com",platform:"RealTaxDeed"},  ...FL_STATE_RULES, verified:true},
  {county:"Polk",         auction:{url:"https://polkfl.realtaxlien.com/",platform:"RealTaxLien"},    deedAuction:{url:"https://polk.realtaxdeed.com",platform:"RealTaxDeed"},      ...FL_STATE_RULES, verified:true},
  {county:"Putnam",       auction:{url:"https://putnamfl.realtaxlien.com",platform:"RealTaxLien"},   deedAuction:{url:"https://putnam.realtaxdeed.com",platform:"RealTaxDeed"},    ...FL_STATE_RULES, verified:true},
  {county:"Santa Rosa",   auction:{url:"https://lienhub.com/county/santarosa",platform:"LienHub"},   deedAuction:{url:"https://santarosa.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Sarasota",     auction:{url:"https://sarasotafl.realtaxlien.com/",platform:"RealTaxLien"},deedAuction:{url:"https://sarasota.realtaxdeed.com",platform:"RealTaxDeed"},  ...FL_STATE_RULES, verified:true},
  {county:"Seminole",     auction:{url:"https://lienhub.com/county/seminole",platform:"LienHub"},    deedAuction:{url:"https://seminole.realtaxdeed.com",platform:"RealTaxDeed"},  ...FL_STATE_RULES, verified:true},
  {county:"St. Johns",    auction:{url:"https://sjctax.us/tax-certificate-sales/",platform:"St. Johns TC"}, deedAuction:{url:"https://stjohns.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"St. Lucie",    auction:{url:"https://lienhub.com/county/stlucie",platform:"LienHub"},     deedAuction:{url:"https://stlucie.realtaxdeed.com",platform:"RealTaxDeed"},   ...FL_STATE_RULES, verified:true},
  {county:"Sumter",       auction:{url:"https://lienhub.com/county/sumter/certsale/main",platform:"LienHub"}, deedAuction:{url:"https://sumter.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Suwannee",     auction:{url:"https://suwanneefl.realtaxlien.com/",platform:"RealTaxLien"},deedAuction:{url:"https://suwannee.realtaxdeed.com",platform:"RealTaxDeed"},  ...FL_STATE_RULES, verified:true},
  {county:"Taylor",       auction:{url:"https://taylorfl.realtaxlien.com/",platform:"RealTaxLien"},  deedAuction:{url:"https://taylor.realtaxdeed.com",platform:"RealTaxDeed"},    ...FL_STATE_RULES, verified:true},
  {county:"Union",        auction:{url:"https://floridarevenue.com/property/Pages/Taxpayers_TaxCertificateSales.aspx",platform:"In-Person"}, deedAuction:{url:"https://union.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true, note:"In-person only — 55 W Main St, Lake Butler FL 32054"},
  {county:"Volusia",      auction:{url:"https://lienhub.com/county/volusia",platform:"LienHub"},     deedAuction:{url:"https://volusia.realtaxdeed.com",platform:"RealTaxDeed"},   ...FL_STATE_RULES, verified:true},
  {county:"Wakulla",      auction:{url:"https://www.taxcertsale.com/wakullataxsale/Default.aspx",platform:"TaxCertSale"}, deedAuction:{url:"https://wakulla.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
  {county:"Walton",       auction:{url:"https://lienhub.com/walton",platform:"LienHub"},             deedAuction:{url:"https://walton.realtaxdeed.com",platform:"RealTaxDeed"},    ...FL_STATE_RULES, verified:true},
  {county:"Washington",   auction:{url:"https://www.taxcertsale.com/WashingtonTaxSale/Default.aspx",platform:"TaxCertSale"}, deedAuction:{url:"https://washington.realtaxdeed.com",platform:"RealTaxDeed"}, ...FL_STATE_RULES, verified:true},
];

window.COUNTY_DATA['FL_STATE_RULES'] = FL_STATE_RULES;
console.log('FL counties loaded:', window.COUNTY_DATA['FL'].length);
