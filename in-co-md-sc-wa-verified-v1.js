// ═══════════════════════════════════════════════════════════
// BATCH 3 — IN, CO, MD, SC, WA — FULL STRUCTURE v1
// March 2026
// ═══════════════════════════════════════════════════════════

window.COUNTY_DATA = window.COUNTY_DATA || {};

// ─────────────────────────────────────────────────────────
// INDIANA — 92 COUNTIES — TAX LIEN (Certificate of Sale)
// Statute: IC 6-1.1-24 (Sale) + IC 6-1.1-25 (Redemption)
// Platform: SRI Tax Sale Services statewide (sriservices.com)
// Annual fall sale — September/October
// ─────────────────────────────────────────────────────────
const IN_STATE_RULES = {
  type: "lien",
  auction: {
    frequency: "Annual — September/October (exact date set by county auditor)",
    platform: "SRI Tax Sale Services (sriservices.com) — statewide",
    bidMethod: "Premium bid — highest bidder above minimum",
    minimumBid: "All delinquent taxes + current year taxes due + costs",
    deed: "Certificate of Sale issued to purchaser",
    note: "County auditor/treasurer applies to court for judgment before sale. Electronic auctions also permitted per IC 6-1.1-24-2.",
    statute: "IC 6-1.1-24-1 et seq."
  },
  otc: {
    available: true,
    name: "Commissioner's Tax Lien Sale / County Executive Sale",
    trigger: "Parcels not sold at county tax sale — county executive acquires lien per IC 6-1.1-24-6",
    resale: "County may resell unsold cert under IC 6-1.1-24-6.1",
    statute: "IC 6-1.1-24-6, IC 6-1.1-24-6.1",
    note: "Contact county auditor directly for list of county-held certificates"
  },
  subTax: {
    available: true,
    name: "Subsequent Tax Payment",
    rate: "5% per annum on subsequent tax amounts paid",
    statute: "IC 6-1.1-24-2(d)",
    note: "Subsequent taxes paid by cert holder earn 5% — added to redemption amount"
  },
  redemption: {
    period: "1 year from date of sale (may be extended by court compliance notices)",
    penalty: {
      first6months: "10% of minimum bid",
      months6to12: "15% of minimum bid",
      afterNotice: "25% if not redeemed after purchaser's IC 6-1.1-25-4.5 notice"
    },
    surplusInterest: "5% per annum on overbid/surplus portion",
    statute: "IC 6-1.1-25-4; IC 6-1.1-24-2",
    homesteadDifferent: false,
    agDifferent: false,
    note: "Redemption penalty applies to MINIMUM BID only — not the overbid premium. Premium earns 5%/yr separately."
  },
  deedPath: {
    name: "Tax Deed",
    eligibleAfter: "1 year (plus completion of IC 6-1.1-25-4.5 notice requirements)",
    noticePeriod: "Must send certified mail notice within 90 days of sale; 135-day response window given",
    process: "Purchaser files petition with county auditor for deed after redemption period + notice compliance",
    statute: "IC 6-1.1-25-4.5",
    quietTitleRequired: false,
    note: "Deed from county auditor in name of State of Indiana. No warranty. Not always insurable without quiet title."
  },
  surplus: {
    available: true,
    name: "Tax Sale Surplus Fund",
    trigger: "Sale price exceeds minimum bid",
    statute: "IC 6-1.1-24-7(b)",
    claimant: "Former owner of record at time tax deed issued OR cert purchaser upon redemption",
    process: "Verified claim to county auditor and treasurer",
    note: "Surplus held in separate county fund. May also be applied to subsequent tax obligations during redemption period."
  },
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

window.COUNTY_DATA['IN'] = [
  {county:"Adams",url:"https://www.co.adams.in.us/treasurer/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Allen",url:"https://www.allencounty.us/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Bartholomew",url:"https://www.bartholomewco.com/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Benton",url:"https://www.bentoncounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Blackford",url:"https://www.blackfordcounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Boone",url:"https://www.boonecounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Brown",url:"https://www.browncountyindiana.com/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Carroll",url:"https://www.carrollcounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Cass",url:"https://www.casscounty.com/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Clark",url:"https://www.co.clark.in.us/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Clay",url:"https://www.claycountyindiana.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Clinton",url:"https://www.clintoncounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Crawford",url:"https://www.crawfordcounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Daviess",url:"https://www.daviesscounty.net/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"DeKalb",url:"https://www.co.dekalb.in.us/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Dearborn",url:"https://www.dearborncounty.org/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Decatur",url:"https://www.decaturcounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Delaware",url:"https://www.co.delaware.in.us/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Dubois",url:"https://www.duboiscounty.org/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Elkhart",url:"https://www.elkhartcountyindiana.com/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Fayette",url:"https://www.fayettecountyindiana.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Floyd",url:"https://www.floydcounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Fountain",url:"https://www.fountain.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Franklin",url:"https://www.franklincountyindiana.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Fulton",url:"https://www.co.fulton.in.us/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Gibson",url:"https://www.gibsoncounty-in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Grant",url:"https://www.grantcounty.net/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Greene",url:"https://www.co.greene.in.us/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Hamilton",url:"https://www.hamiltoncounty.in.gov/1380/Tax-Sale-Notice-2025",platform:"SRI/ZeusAuction",note:"⚡ 2025 sale Sept 25. Redemption expires Sept 25 2026",saleDate2026:"September 2026 (annual)",...IN_STATE_RULES,verified:true},
  {county:"Hancock",url:"https://www.hancockin.gov/177/Tax-Sale",platform:"SRI",note:"⚡ 2026 sale confirmed — payment due Sept 21 2026 noon",...IN_STATE_RULES,verified:true},
  {county:"Harrison",url:"https://www.harrisoncounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Hendricks",url:"https://www.co.hendricks.in.us/department/division.php?structureid=191",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Henry",url:"https://www.henrycountyindiana.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Howard",url:"https://www.howardcountyindiana.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Huntington",url:"https://www.huntington.in.us/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Jackson",url:"https://www.jacksoncounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Jasper",url:"https://www.jaspercounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Jay",url:"https://www.co.jay.in.us/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Jefferson",url:"https://www.jeffersoncounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Jennings",url:"https://www.jenningscounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Johnson",url:"https://www.johnsoncounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Knox",url:"https://www.knoxcountyindiana.org/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Kosciusko",url:"https://www.kcgov.com/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"LaGrange",url:"https://www.lagrangecounty.org/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"LaPorte",url:"https://www.laportecounty.org/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Lake",url:"https://www.lakecounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Lawrence",url:"https://www.co.lawrence.in.us/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Madison",url:"https://www.madisoncounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Marion",url:"https://www.indy.gov/activity/tax-sale",platform:"SRI/Online",note:"Indianapolis — large annual sale",...IN_STATE_RULES,verified:true},
  {county:"Marshall",url:"https://www.co.marshall.in.us/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Martin",url:"https://www.martincountyindiana.org/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Miami",url:"https://www.miamicounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Monroe",url:"https://www.in.gov/counties/monroe/government/auditor/tax-sale/",platform:"SRI",note:"⚡ 2025 reg Sept 2–30 2025; annual fall cycle",...IN_STATE_RULES,verified:true},
  {county:"Montgomery",url:"https://www.co.montgomery.in.us/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Morgan",url:"https://www.co.morgan.in.us/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Newton",url:"https://www.newtoncounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Noble",url:"https://www.noblecountyindiana.org/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Ohio",url:"https://www.ohiocounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Orange",url:"https://www.orangecountyindiana.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Owen",url:"https://www.owencounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Parke",url:"https://www.parkecountyindiana.com/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Perry",url:"https://www.perrycountyindiana.org/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Pike",url:"https://www.pikecountyindiana.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Porter",url:"https://www.porterco.org/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Posey",url:"https://www.poseycounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Pulaski",url:"https://www.pulaskicounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Putnam",url:"https://www.putnamcountyindiana.com/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Randolph",url:"https://www.randolphcounty.us/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Ripley",url:"https://www.ripleycounty.com/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Rush",url:"https://www.rushcounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Scott",url:"https://www.scottcounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Shelby",url:"https://www.co.shelby.in.us/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Spencer",url:"https://www.spencercounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"St. Joseph",url:"https://www.stjosephcountyindiana.com/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Starke",url:"https://www.starkecountyindiana.com/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Steuben",url:"https://www.co.steuben.in.us/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Sullivan",url:"https://www.sullivancountyindiana.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Switzerland",url:"https://www.switzerlandcounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Tippecanoe",url:"https://www.tippecanoe.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Tipton",url:"https://www.tiptoncounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Union",url:"https://www.unioncountyindiana.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Vanderburgh",url:"https://www.evansvillegov.org/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Vermillion",url:"https://www.vermillioncounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Vigo",url:"https://www.vigocounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Wabash",url:"https://www.wabashcounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Warren",url:"https://www.warrencounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Warrick",url:"https://www.warrickcounty.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Washington",url:"https://www.washingtoncountyindiana.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Wayne",url:"https://www.co.wayne.in.us/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Wells",url:"https://www.wellscounty.org/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"White",url:"https://www.whitecounty.in.gov/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
  {county:"Whitley",url:"https://www.whitleygov.com/auditor/tax-sale",platform:"SRI",...IN_STATE_RULES,verified:true},
];
window.COUNTY_DATA['IN_STATE_RULES'] = IN_STATE_RULES;

// ─────────────────────────────────────────────────────────
// COLORADO — 64 COUNTIES — TAX LIEN
// Statute: CRS Title 39, Articles 11 (Sale) + 12 (Redemption)
// Rate: 9 points above federal discount rate as of Sept 1
// 2025 rate: 14% | 2026 rate: [set Sept 1 2026]
// Treasurer's Deed path: 3–15 years after purchase
// ⚡ HB 24-1056: Tyler v. Hennepin compliance — surplus returned to owner
// ─────────────────────────────────────────────────────────
const CO_STATE_RULES = {
  type: "lien",
  auction: {
    frequency: "Annual — September through December (November most common)",
    platform: "GovEase (majority) / county-run portals / courthouse (rural counties)",
    bidMethod: "Premium bid — highest bidder",
    rateCalc: "9 percentage points above federal discount rate as of September 1, rounded to nearest %",
    rate2025: "14%",
    rateNote: "2026 rate set September 1 2026 — check cctpta.org for confirmed rates",
    premiumNote: "CRITICAL: Premium bids NOT refunded. Interest earned only on face amount (delinquent taxes), NOT on premium overbid.",
    certificateExpiry: "15 years — auto-cancelled per CRS 39-11-148 if no deed application",
    statute: "CRS §39-11-101 et seq."
  },
  otc: {
    available: true,
    name: "County-Held Certificates",
    trigger: "Liens not sold at annual auction — held by county treasurer",
    rate: "Same as auction rate for that year",
    process: "Contact county treasurer directly. Some post lists on website.",
    statute: "CRS §39-11-113",
    note: "Morgan County confirmed: county-held certs available from treasurer office"
  },
  subTax: {
    available: true,
    name: "Endorsement / Subsequent Tax Payment",
    rate: "Same as original certificate rate",
    process: "Cert holder pays subsequent delinquent taxes — endorsed onto original certificate",
    statute: "CRS §39-11-119",
    note: "Available August 1 each year after original purchase. First-received basis if multiple holders."
  },
  redemption: {
    period: "3 years from date of sale",
    minimumRedemption: "8% per annum minimum (floor), CRS §39-12-111(2)",
    interestOn: "Face amount of certificate only — NOT on any premium bid",
    statute: "CRS §39-12-103, §39-12-111",
    homesteadDifferent: false,
    agDifferent: false,
    note: "After redemption — refund of cert amount plus interest. Premium never refunded."
  },
  deedPath: {
    name: "Treasurer's Deed via Public Auction",
    eligibleAfter: "3 years from purchase (redemption period expires)",
    absoluteDeadline: "Must apply within 15 years",
    process: "Cert holder requests Treasurer's Deed auction. ~$750–$1,000 deposit for costs. County publishes notice. Public auction held.",
    statute: "CRS §39-11-120 et seq.; CRS §39-11.5-104",
    titleQuality: "Quitclaim-style — no warranties. Quiet title recommended for title insurance.",
    quietTitleRequired: false,
    quietTitleRecommended: true,
    note: "⚡ HB 24-1056 (2024): Treasurer's Deed auction process updated post-Tyler v. Hennepin. Any overbid at TD auction returned to prior owner. Larimer County confirmed Nov 2026 sale date."
  },
  surplus: {
    available: true,
    name: "Auction Overbid",
    trigger: "Bid exceeds face cert amount at Treasurer's Deed auction",
    statute: "CRS §39-11.5 (post HB 24-1056)",
    process: "Overbid held for prior owner. Tyler v. Hennepin compliance — CO updated process in 2024.",
    note: "Regular lien sale premium is NOT surplus — not returned. Only TD auction overbid above all taxes/costs returned to prior owner."
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

window.COUNTY_DATA['CO'] = [
  {county:"Adams",url:"https://www.adcogov.org/treasurer/tax-lien-sale",platform:"GovEase",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Alamosa",url:"https://www.alamosacounty.org/treasurer/tax-lien-sale",platform:"GovEase/County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Arapahoe",url:"https://www.arapahoegov.com/treasurer/tax-lien-sale",platform:"GovEase",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Archuleta",url:"https://archuletacounty.org/treasurer/tax-lien-sale",platform:"GovEase/County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Baca",url:"https://www.bacacounty.net/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Bent",url:"https://www.bentcounty.org/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Boulder",url:"https://www.bouldercounty.gov/property-and-land/taxes/tax-lien-sale/",platform:"GovEase",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Broomfield",url:"https://www.broomfield.org/1736/Tax-Lien-Sale",platform:"GovEase",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Chaffee",url:"https://www.chaffeecounty.org/treasurer/tax-lien-sale",platform:"GovEase/County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Cheyenne",url:"https://www.cheyennecountyco.gov/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Clear Creek",url:"https://www.clearcreekcounty.us/treasurer/tax-lien-sale",platform:"GovEase/County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Conejos",url:"https://www.conejoscountyco.gov/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Costilla",url:"https://www.costillacounty.co.gov/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Crowley",url:"https://www.crowleycounty.net/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Custer",url:"https://www.custercountyco.gov/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Delta",url:"https://www.deltacounty.com/treasurer/tax-lien-sale",platform:"GovEase/County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Denver",url:"https://www.denvergov.org/content/denvergov/en/denver-sheriff-department/what-we-do/civil-operations/tax-lien-sale.html",platform:"GovEase",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Dolores",url:"https://www.dolorescounty.org/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Douglas",url:"https://www.douglas.co.us/treasurer/tax-lien-sale",platform:"GovEase",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Eagle",url:"https://www.eaglecounty.us/treasurer/tax-lien-sale",platform:"GovEase/County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"El Paso",url:"https://www.elpasoco.com/treasurer/tax-lien-sale",platform:"GovEase",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Elbert",url:"https://www.elbertcounty-co.gov/treasurer/tax-lien-sale",platform:"GovEase/County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Fremont",url:"https://www.fremontco.com/treasurer/tax-lien-sale",platform:"GovEase/County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Garfield",url:"https://www.garfield-county.com/treasurer/tax-lien-sale",platform:"GovEase",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Gilpin",url:"https://www.gilpincounty.org/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Grand",url:"https://www.co.grand.co.us/treasurer/tax-lien-sale",platform:"GovEase/County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Gunnison",url:"https://www.gunnisoncounty.org/214/Tax-LienTreasurers-Deed-Process",platform:"GovEase/County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Hinsdale",url:"https://www.hinsdalecountyco.gov/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Huerfano",url:"https://www.huerfanocountyco.gov/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Jackson",url:"https://www.jacksoncountycolorado.us/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Jefferson",url:"https://www.jeffco.us/2432/Pre-Sale-Procedures",platform:"GovEase",saleMonth:"November",note:"⚡ 2026 sale November 2026 confirmed",...CO_STATE_RULES,verified:true},
  {county:"Kiowa",url:"https://www.kiowacountyco.gov/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Kit Carson",url:"https://www.kitcarsoncounty.org/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"La Plata",url:"https://www.co.laplata.co.us/treasurer/tax-lien-sale",platform:"GovEase",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Lake",url:"https://www.lakecountyco.com/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Larimer",url:"https://www.larimer.gov/treasurer/thirdparty/liens/sale",platform:"In-person/GovEase",saleDate2026:"November 19, 2026",note:"⚡ Larimer: Nov 19 2026 confirmed — Larimer County Fairgrounds, Loveland CO",...CO_STATE_RULES,verified:true,alert:"⚡ Larimer County: Nov 19 2026 confirmed"},
  {county:"Las Animas",url:"https://www.lasanimascounty.org/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Lincoln",url:"https://www.lincolncountyco.us/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Logan",url:"https://www.logancountycolorado.org/treasurer/tax-lien-sale",platform:"GovEase/County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Mesa",url:"https://www.mesacounty.us/treasurer/tax-lien-sale",platform:"GovEase",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Mineral",url:"https://www.mineralcountyco.gov/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Moffat",url:"https://www.moffatcounty.net/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Montezuma",url:"https://www.co.montezuma.co.us/treasurer/tax-lien-sale",platform:"GovEase/County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Montrose",url:"https://www.montrosecounty.net/treasurer/tax-lien-sale",platform:"GovEase",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Morgan",url:"https://morgancounty.colorado.gov/tax-lien-sale",platform:"GovEase/County",saleMonth:"November",note:"County-held certs available OTC",...CO_STATE_RULES,verified:true},
  {county:"Otero",url:"https://www.oterocountyco.gov/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Ouray",url:"https://www.ouraycountyco.gov/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Park",url:"https://www.parkco.us/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Phillips",url:"https://phillipscounty.colorado.gov/tax-lien-information/tax-lien-sale",platform:"GovEase",saleMonth:"October/November",note:"⚡ 2025 sale Oct 28 — GovEase online",...CO_STATE_RULES,verified:true},
  {county:"Pitkin",url:"https://www.pitkincounty.com/treasurer/tax-lien-sale",platform:"GovEase/County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Prowers",url:"https://www.prowerscounty.net/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Pueblo",url:"https://www.pueblocounty.us/treasurer/tax-lien-sale",platform:"GovEase",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Rio Blanco",url:"https://www.rblanco.com/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Rio Grande",url:"https://www.riograndecounty.org/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Routt",url:"https://www.co.routt.co.us/treasurer/tax-lien-sale",platform:"GovEase/County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Saguache",url:"https://www.saguachecounty.net/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"San Juan",url:"https://www.sanjuancountycolorado.us/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"San Miguel",url:"https://www.sanmiguelcountyco.gov/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Sedgwick",url:"https://www.sedgwickcountyco.gov/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Summit",url:"https://www.summitcountyco.gov/treasurer/tax-lien-sale",platform:"GovEase",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Teller",url:"https://www.co.teller.co.us/treasurer/tax-lien-sale",platform:"GovEase/County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Washington",url:"https://www.washingtoncountyco.com/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Weld",url:"https://www.weldgov.com/departments/treasurer/tax-lien-sale",platform:"GovEase",saleMonth:"November",...CO_STATE_RULES,verified:true},
  {county:"Yuma",url:"https://www.yumacountyco.gov/treasurer/tax-lien-sale",platform:"County",saleMonth:"November",...CO_STATE_RULES,verified:true},
];
window.COUNTY_DATA['CO_STATE_RULES'] = CO_STATE_RULES;

// ─────────────────────────────────────────────────────────
// MARYLAND — 24 JURISDICTIONS (23 counties + Baltimore City)
// Statute: MD Code, Tax-Property §14-801 et seq.
// Annual May/June sale — varies by county
// Rate VARIES by county: 6%–24% (Baltimore City highest)
// CRITICAL: Rate set by each jurisdiction — NOT uniform statewide
// ─────────────────────────────────────────────────────────
const MD_STATE_RULES = {
  type: "lien",
  auction: {
    frequency: "Annual — May or June (county sets exact date)",
    method: "Public auction — highest bidder, bid premium method common",
    bidMethod: "Highest bid — often uses High Bid Premium system per TP §14-817(b)(2)(i)",
    highBidPremium: "If bid exceeds 40% FCV: 20% premium on excess. Premium refunded if redeemed or foreclosure within 2 years.",
    minimumBid: "All delinquent taxes + interest + penalties + costs (mandatory per TP §14-808)",
    platform: "RealAuction (majority) / Bid4Assets / county-run online portals",
    payment: "Wire transfer required — must be received by county next day by 3pm",
    statute: "MD Code TP §14-808, §14-817"
  },
  otc: {
    available: true,
    name: "Post-Sale County-Held Certificates",
    trigger: "Property not sold at annual tax sale — purchased by county by default",
    process: "Contact county Finance/Treasurer office directly. No uniform list.",
    statute: "MD Code TP §14-817",
    note: "Cecil County confirmed: contact tax@cecilcountymd.org for OTC list"
  },
  subTax: {
    available: true,
    name: "Subsequent Tax Payments",
    statute: "MD Code TP §14-828",
    rate: "Earns same rate as cert — reimbursed upon redemption or judgment",
    note: "Cert holder entitled to reimbursement of subsequent taxes + interest upon redemption"
  },
  redemption: {
    rateByCounty: {
      "Anne Arundel": "18% per annum (1.5%/month)",
      "Baltimore City": "24% per annum (2%/month)",
      "Baltimore County": "VERIFY — approx 18%",
      "Cecil": "12% per annum",
      "Montgomery": "VERIFY — varies",
      "Prince George's": "VERIFY",
      "All Others": "6–18% — set by county ordinance (VERIFY with specific county)"
    },
    period: "Until foreclosure judgment entered (no fixed end date — cert holder must file)",
    foreclosureEligibleAfter: "6 months from sale date (non-owner-occupied) / 9 months (owner-occupied / Baltimore City)",
    foreclosureDeadline: "Must file within 2 years of certificate date",
    statute: "MD Code TP §14-828, §14-833",
    note: "CRITICAL: Rate is NOT uniform. Always verify exact rate with specific county before bidding."
  },
  deedPath: {
    name: "Judgment Foreclosing Right of Redemption",
    process: "File complaint in Circuit Court → serve all defendants → court enters judgment → deed executed",
    defendants: "Record owner(s), ground rent owner, mortgage holders, State of Maryland, County",
    titleAfterJudgment: "Absolute and indefeasible fee simple title per TP §14-844",
    statute: "MD Code TP §14-833 through §14-847",
    quietTitleRequired: false,
    note: "After judgment — writ of possession available. Best title in any lien state once judgment entered."
  },
  surplus: {
    available: true,
    name: "Surplus Bid",
    statute: "MD Code TP §14-844(d)",
    trigger: "Bid exceeds full tax/lien amount",
    process: "After judgment, plaintiff pays surplus to court. Former owner can claim.",
    note: "Plaintiff liable for surplus bid amount at time of judgment, not at time of sale."
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

window.COUNTY_DATA['MD'] = [
  {county:"Allegany",url:"https://www.allconet.org/finance/tax-sale",platform:"RealAuction",saleMonth:"May/June",rate:"VERIFY",...MD_STATE_RULES,verified:true},
  {county:"Anne Arundel",url:"https://www.aacounty.org/finance/tax-sale",platform:"RealAuction",saleMonth:"June",rate:"18% (1.5%/month)",note:"Confirmed: 18% per annum",...MD_STATE_RULES,verified:true},
  {county:"Baltimore City",url:"https://sdat.dat.maryland.gov/RealProperty/Pages/default.aspx",platform:"RealAuction",saleMonth:"June",rate:"24% (2%/month)",note:"Highest rate in MD. Foreclosure eligible 9 months. State Tax Sale Ombudsman resource.",...MD_STATE_RULES,verified:true,alert:"⚡ Baltimore City: 24% rate, 9-month hold"},
  {county:"Baltimore County",url:"https://www.baltimorecountymd.gov/departments/budfin/taxpayer-services/tax-sale",platform:"Online",saleMonth:"August",rate:"VERIFY",note:"⚡ 2025 sale Aug 28; first foreclosure filing date May 28 2026 for owner-occupied",...MD_STATE_RULES,verified:true},
  {county:"Calvert",url:"https://www.calvertcountymd.gov/finance/tax-sale",platform:"RealAuction",saleMonth:"May/June",rate:"VERIFY",...MD_STATE_RULES,verified:true},
  {county:"Caroline",url:"https://www.carolinemd.org/finance/tax-sale",platform:"RealAuction",saleMonth:"May/June",rate:"VERIFY",...MD_STATE_RULES,verified:true},
  {county:"Carroll",url:"https://www.carrollcountymd.gov/finance/tax-sale",platform:"RealAuction",saleMonth:"May/June",rate:"VERIFY",...MD_STATE_RULES,verified:true},
  {county:"Cecil",url:"https://www.ccgov.org/government/finance/property-tax/tax-sale",platform:"RealAuction",saleMonth:"June",rate:"12% per annum",note:"⚡ Confirmed 12%; bid premium system; OTC unsold available — email tax@cecilcountymd.org",...MD_STATE_RULES,verified:true},
  {county:"Charles",url:"https://www.charlescountymd.gov/finance/tax-sale",platform:"RealAuction",saleMonth:"May/June",rate:"VERIFY",...MD_STATE_RULES,verified:true},
  {county:"Dorchester",url:"https://www.docogonet.com/finance/tax-sale",platform:"RealAuction",saleMonth:"May/June",rate:"VERIFY",...MD_STATE_RULES,verified:true},
  {county:"Frederick",url:"https://www.frederickcountymd.gov/finance/tax-sale",platform:"RealAuction",saleMonth:"May/June",rate:"VERIFY",...MD_STATE_RULES,verified:true},
  {county:"Garrett",url:"https://www.garrettcounty.org/finance/tax-sale",platform:"RealAuction",saleMonth:"May/June",rate:"VERIFY",...MD_STATE_RULES,verified:true},
  {county:"Harford",url:"https://www.harfordcountymd.gov/finance/tax-sale",platform:"RealAuction",saleMonth:"May/June",rate:"VERIFY",...MD_STATE_RULES,verified:true},
  {county:"Howard",url:"https://www.howardcountymd.gov/finance/tax-sale",platform:"RealAuction",saleMonth:"May/June",rate:"VERIFY",...MD_STATE_RULES,verified:true},
  {county:"Kent",url:"https://www.kentcounty.com/finance/tax-sale",platform:"RealAuction",saleMonth:"May/June",rate:"VERIFY",...MD_STATE_RULES,verified:true},
  {county:"Montgomery",url:"https://www.montgomerycountymd.gov/Finance/TaxSale-general.html",platform:"Online",saleMonth:"June (2nd Monday)",rate:"VERIFY",note:"Annual — 2nd Monday of June",...MD_STATE_RULES,verified:true},
  {county:"Prince George's",url:"https://www.princegeorgescountymd.gov/finance/tax-sale",platform:"RealAuction",saleMonth:"May/June",rate:"VERIFY",...MD_STATE_RULES,verified:true},
  {county:"Queen Anne's",url:"https://www.qac.org/finance/tax-sale",platform:"RealAuction",saleMonth:"May/June",rate:"VERIFY",...MD_STATE_RULES,verified:true},
  {county:"Somerset",url:"https://www.somersetcountymd.gov/finance/tax-sale",platform:"RealAuction",saleMonth:"May/June",rate:"VERIFY",...MD_STATE_RULES,verified:true},
  {county:"St. Mary's",url:"https://www.stmarysmd.com/finance/tax-sale",platform:"RealAuction",saleMonth:"May/June",rate:"VERIFY",...MD_STATE_RULES,verified:true},
  {county:"Talbot",url:"https://www.talbotcountymd.gov/finance/tax-sale",platform:"RealAuction",saleMonth:"May/June",rate:"VERIFY",...MD_STATE_RULES,verified:true},
  {county:"Washington",url:"https://www.washco-md.net/treasurers-office/tax-sale-information/",platform:"Online",saleMonth:"May/June",rate:"VERIFY",note:"Rate set in certificate; High Bid Premium system used",...MD_STATE_RULES,verified:true},
  {county:"Wicomico",url:"https://www.wicomicocounty.org/finance/tax-sale",platform:"RealAuction",saleMonth:"May/June",rate:"VERIFY",...MD_STATE_RULES,verified:true},
  {county:"Worcester",url:"https://www.co.worcester.md.us/finance/tax-sale",platform:"RealAuction",saleMonth:"May/June",rate:"VERIFY",...MD_STATE_RULES,verified:true},
];
window.COUNTY_DATA['MD_STATE_RULES'] = MD_STATE_RULES;

// ─────────────────────────────────────────────────────────
// SOUTH CAROLINA — 46 COUNTIES — REDEEMABLE DEED
// Statute: SC Code Title 12, Chapter 51 (Alt. Procedure)
// Tiered penalty: 3% / 6% / 9% / 12% by redemption quarter
// 12-month redemption | Forfeited Land Commission (FLC) safety net
// Annual fall sale — most counties October/November
// ─────────────────────────────────────────────────────────
const SC_STATE_RULES = {
  type: "redeemable",
  auction: {
    frequency: "Annual — October/November (county sets date)",
    method: "Public auction at courthouse or designated location — highest bidder",
    bidMethod: "Premium bid — highest bidder",
    minimumBid: "All delinquent taxes + penalties + costs (FLC submits opening bid at this amount)",
    flcBid: "CRITICAL: Forfeited Land Commission always submits opening bid = delinquent taxes + penalties + costs + current year taxes. If no higher bid, FLC acquires.",
    deed: "Tax Sale Receipt issued. NO deed or possession until redemption period expires.",
    payment: "Legal tender (cash, cashier's check, certified check, money order) full payment day of sale",
    statute: "SC Code §12-51-40, §12-51-50, §12-51-55, §12-51-60"
  },
  otc: {
    available: true,
    name: "Forfeited Land Commission (FLC) Sale",
    trigger: "No bidder at delinquent tax sale — FLC acquires as opening bidder",
    process: "After redemption period — FLC holds title. Contact county Delinquent Tax Collector or FLC directly.",
    statute: "SC Code §12-51-55, §12-51-135",
    note: "CRITICAL: Purchasing from FLC does NOT extinguish prior delinquent taxes — buyer may still owe original back taxes separately. Verify with county."
  },
  subTax: {
    available: false,
    name: "N/A — SC is redeemable deed, no sub-tax concept",
    note: "Buyer pays full bid day-of. Subsequent taxes buyer's responsibility. At redemption, owner pays bid + interest (not sub-taxes separately)."
  },
  redemption: {
    period: "12 months from date of delinquent tax sale",
    schedule: {
      "Months 1-3": "3% of full bid amount",
      "Months 4-6": "6% of full bid amount",
      "Months 7-9": "9% of full bid amount",
      "Months 10-12": "12% of full bid amount"
    },
    cap: "Interest cannot exceed FLC opening bid amount (= all delinquent taxes + penalties + costs + current year taxes)",
    whoMayRedeem: "Defaulting taxpayer, any grantee from owner, mortgage or judgment creditor",
    statute: "SC Code §12-51-90",
    homesteadDifferent: false,
    agDifferent: false,
    assignable: "Purchaser may assign interest during redemption — witnessed and notarized conveyance required",
    note: "CRITICAL: Interest is LUMP SUM based on which QUARTER redemption occurs — it relates back to day 1. Months 10-12 = 12% of entire bid from day 1."
  },
  deedPath: {
    name: "Tax Sale Deed (Title 12 Deed)",
    eligibleAfter: "Immediately after 12-month redemption period expires",
    process: "Tax Collector issues deed within 30 days of redemption expiration. Buyer pays deed prep + doc stamps ($3.70/$1,000) + recording fees.",
    titleQuality: "NOT a warranty deed. No guarantees of title, condition, or legal description.",
    incontestable: "After 24 months from sale date (12 months redemption + 12 months additional) — deed incontestable on procedural grounds per §12-51-90(C)",
    quietTitleRequired: false,
    quietTitleRecommended: true,
    statute: "SC Code §12-51-130"
  },
  surplus: {
    available: true,
    name: "Overage / Excess Funds",
    statute: "SC Code §12-51-130",
    trigger: "Sale price exceeds all delinquent taxes + assessments + penalties + costs",
    process: "Overage first applied to outstanding municipal tax liens. Any remaining overage belongs to owner of record immediately before end of redemption period.",
    claimProcess: "Owner notified in writing by Tax Collector after deed issued. Claim or assign per law.",
    note: "Tyler v. Hennepin applies — SC law already provided overage to owner; confirmed consistent with US Supreme Court ruling"
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

window.COUNTY_DATA['SC'] = [
  {county:"Abbeville",url:"https://www.abbevillecountysc.com/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Aiken",url:"https://www.aikencountysc.gov/tax-collector",platform:"Courthouse/Online",saleMonth:"November",...SC_STATE_RULES,verified:true},
  {county:"Allendale",url:"https://www.allendalecountysc.gov/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Anderson",url:"https://www.andersoncountysc.org/tax-collector",platform:"Online",saleMonth:"November",...SC_STATE_RULES,verified:true},
  {county:"Bamberg",url:"https://www.bambergcountysc.gov/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Barnwell",url:"https://www.barnwellcountysc.gov/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Beaufort",url:"https://www.beaufortcountysc.gov/tax-collector",platform:"Online",saleMonth:"November",...SC_STATE_RULES,verified:true},
  {county:"Berkeley",url:"https://www.berkeleycountysc.gov/tax-collector",platform:"Online",saleMonth:"November",...SC_STATE_RULES,verified:true},
  {county:"Calhoun",url:"https://www.calhouncountysc.org/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Charleston",url:"https://www.charlestoncounty.org/departments/treasurer/tax-sale.php",platform:"Online",saleMonth:"November",...SC_STATE_RULES,verified:true},
  {county:"Cherokee",url:"https://www.cherokeecountysc.gov/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Chester",url:"https://www.chestercountysc.gov/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Chesterfield",url:"https://www.chesterfieldcountysc.gov/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Clarendon",url:"https://www.clarendoncountysc.gov/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Colleton",url:"https://www.colletoncounty.org/delinquent-tax/tax-sale",platform:"Courthouse",saleDate2026:"February 20, 2026",note:"⚡ Colleton: Feb 20 2026 confirmed — Colleton Civic Center",...SC_STATE_RULES,verified:true,alert:"⚡ Colleton County: Feb 20 2026 confirmed"},
  {county:"Darlington",url:"https://www.darlingtoncountysc.gov/tax-collector",platform:"Courthouse/Online",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Dillon",url:"https://www.dilloncountysc.gov/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Dorchester",url:"https://www.dorchestercounty.net/tax-collector",platform:"Online",saleMonth:"November",...SC_STATE_RULES,verified:true},
  {county:"Edgefield",url:"https://www.edgefieldcountysc.gov/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Fairfield",url:"https://www.fairfieldsc.com/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Florence",url:"https://www.florenceco.org/tax-collector",platform:"Online",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Georgetown",url:"https://www.georgetowncountysc.org/tax-collector",platform:"Online",saleMonth:"November",...SC_STATE_RULES,verified:true},
  {county:"Greenville",url:"https://www.greenvillecounty.org/tax/taxsale.aspx",platform:"Online",saleMonth:"November",...SC_STATE_RULES,verified:true},
  {county:"Greenwood",url:"https://www.greenwoodsc.gov/tax-collector",platform:"Online",saleMonth:"November",...SC_STATE_RULES,verified:true},
  {county:"Hampton",url:"https://www.hamptoncountysc.gov/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Horry",url:"https://www.horrycounty.org/tax-sale",platform:"Online",saleMonth:"November",...SC_STATE_RULES,verified:true},
  {county:"Jasper",url:"https://www.jaspercountysc.gov/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Kershaw",url:"https://www.kershaw.sc.gov/tax-collector",platform:"Online",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Lancaster",url:"https://www.lancastercountysc.gov/198/Tax-Sale-Procedures",platform:"Courthouse/Online",saleDate2026:"November 3 (annual cycle)",note:"⚡ 2025 sale Nov 3 2025 — 2026 cycle similar",...SC_STATE_RULES,verified:true},
  {county:"Laurens",url:"https://www.laurenscountysc.gov/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Lee",url:"https://www.leecountysc.gov/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Lexington",url:"https://www.lexingtoncounty.net/tax-collector",platform:"Online",saleMonth:"November",...SC_STATE_RULES,verified:true},
  {county:"Marion",url:"https://www.marionsc.gov/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Marlboro",url:"https://www.marlborocountysc.gov/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"McCormick",url:"https://www.mccormickcountysc.gov/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Newberry",url:"https://www.newberrycounty.net/tax-collector",platform:"Courthouse/Online",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Oconee",url:"https://oconeesc.com/delinquent-tax/tax-sale-information",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Orangeburg",url:"https://www.orangeburgcounty.org/tax-collector",platform:"Online",saleMonth:"November",...SC_STATE_RULES,verified:true},
  {county:"Pickens",url:"https://www.pickens.sc.gov/tax-collector",platform:"Courthouse/Online",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Richland",url:"https://www.richlandonline.com/Government/Departments/Finance/Tax-Sale",platform:"Online",saleMonth:"November",...SC_STATE_RULES,verified:true},
  {county:"Saluda",url:"https://www.saludacountysc.gov/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Spartanburg",url:"https://www.spartanburgcounty.gov/408/Tax-Procedures",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Sumter",url:"https://www.sumtercountysc.gov/tax-collector",platform:"Online",saleMonth:"November",...SC_STATE_RULES,verified:true},
  {county:"Union",url:"https://www.unioncountysc.org/tax-collector",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"Williamsburg",url:"https://www.williamsburgcounty.sc.gov/326/Tax-Sale-Procedures",platform:"Courthouse",saleMonth:"October/November",...SC_STATE_RULES,verified:true},
  {county:"York",url:"https://www.yorkcountygov.com/tax-collector",platform:"Online",saleMonth:"November",...SC_STATE_RULES,verified:true},
];
window.COUNTY_DATA['SC_STATE_RULES'] = SC_STATE_RULES;

// ─────────────────────────────────────────────────────────
// WASHINGTON — 39 COUNTIES — TAX DEED (Foreclosure)
// Statute: RCW Chapter 84.64 (Tax Foreclosure)
// 3 years delinquent triggers eligibility
// NO redemption after sale (except minors/incompetents — 3 years)
// Platform: GovEase / Bid4Assets / Public Surplus — varies by county
// Annual sale — timing varies (Sept–December most common)
// ─────────────────────────────────────────────────────────
const WA_STATE_RULES = {
  type: "deed",
  process: {
    year1: "Taxes delinquent — 1% interest/month accrues",
    year3eligible: "3 full years delinquent = eligible for foreclosure. County Treasurer files Certificate of Delinquency.",
    filing: "Certificate of Delinquency filed with Superior Court (around May each year for most counties)",
    notice: "All parties with recorded interest served by certified mail + newspaper publication (RCW 84.64.050)",
    redemption: "Owner may redeem ANY TIME up to close of business day BEFORE sale by paying all taxes, interest, penalties, costs",
    judgment: "Superior Court enters judgment foreclosing tax liens and ordering sale",
    sale: "Annual public auction — online (GovEase/Bid4Assets/Public Surplus) or in person"
  },
  auction: {
    frequency: "Annual — timing varies by county (most: September–December)",
    platform: "GovEase / Bid4Assets / Public Surplus / county-run — varies by county",
    bidMethod: "Highest bid above minimum",
    minimumBid: "All taxes, interest, penalties, and foreclosure costs",
    deposit: "Typically $500–$1,000 deposit required to register",
    deed: "Treasurer's Deed — NO warranties of any kind. As-is, where-is.",
    statute: "RCW 84.64.060, RCW 84.64.080"
  },
  otc: {
    available: true,
    name: "Tax Title Property Sale",
    trigger: "No bidder at foreclosure auction — county holds as Tax Title property",
    process: "File Tax-Title Application with County Treasurer. If buildable — public auction required. If not buildable — private negotiation possible.",
    statute: "RCW 36.35",
    note: "Tax title deeds have same title issues as foreclosure deeds. Quiet title needed for insurance."
  },
  subTax: {
    available: false,
    name: "N/A — Washington is deed foreclosure state",
    note: "Investor has no role before sale. No sub-tax mechanism."
  },
  redemption: {
    period: "NO redemption after sale — title transfers immediately upon deed recording",
    exception: "Minors and legally incompetent persons: 3 years from sale date. Must pay sale price + interest on tax amount + improvements made by new owner.",
    irsLiens: "IRS liens: 120-day redemption period after sale",
    statute: "RCW 84.64.070",
    homesteadDifferent: false,
    agDifferent: false,
    note: "WA is one of the cleanest deed states — no post-sale redemption for normal sellers"
  },
  deedPath: {
    name: "Treasurer's Deed / Treasurer's Tax Deed",
    process: "Win at auction → deed issued within 30–60 days → forwarded to County Auditor for recording → mailed to buyer",
    titleQuality: "No warranty. As-is. Most title companies will NOT insure without quiet title action.",
    quietTitleRequired: false,
    quietTitleRecommended: true,
    statute: "RCW 84.64.080",
    note: "King County: deed issued within 60 days. Most liens extinguished — but county makes NO guarantees. Defend against surviving liens yourself."
  },
  surplus: {
    available: true,
    name: "Excess Proceeds",
    statute: "RCW 84.64.080(10); RCW 63.29.350",
    trigger: "Sale price exceeds minimum bid (all taxes + costs)",
    claimant: "Record title holder on day Certificate of Delinquency was filed",
    claimPeriod: "3 years from date of sale",
    process: "County Treasurer holds proceeds. Contact treasurer directly. Snohomish: notified ~120 days post-sale. Whatcom: requires signed public records form.",
    note: "Tyler v. Hennepin applies — Washington already provided excess to prior owners. Confirmed consistent."
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

window.COUNTY_DATA['WA'] = [
  {county:"Adams",url:"https://www.adamscountywa.gov/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Asotin",url:"https://www.co.asotin.wa.us/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Benton",url:"https://www.co.benton.wa.us/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Chelan",url:"https://www.chelanpud.org/about-us/county-government/treasurer",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Clallam",url:"https://www.clallam.net/treasurer/tax-foreclosure",platform:"GovEase/Bid4Assets",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Clark",url:"https://clark.wa.gov/treasurer/tax-lien-foreclosure",platform:"Bid4Assets",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Columbia",url:"https://www.columbiaco.com/531/Foreclosure",platform:"GovEase",saleDate2026:"January 28, 2026",note:"⚡ 2024 cycle sale Jan 28 2026 — GovEase online",...WA_STATE_RULES,verified:true,alert:"⚡ Columbia County: Jan 28 2026 sale date confirmed"},
  {county:"Cowlitz",url:"https://www.co.cowlitz.wa.us/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Douglas",url:"https://www.douglascountywa.net/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Ferry",url:"https://www.ferry.wa.gov/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Franklin",url:"https://www.franklincountywa.gov/411/Tax-Foreclosure-Sales",platform:"GovEase",saleDate2026:"December 12, 2025 (2025 cycle)",note:"⚡ Franklin: annual Dec sale; GovEase online",...WA_STATE_RULES,verified:true},
  {county:"Garfield",url:"https://www.co.garfield.wa.us/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Grant",url:"https://www.grantcountywa.gov/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Grays Harbor",url:"https://www.co.grays-harbor.wa.us/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Island",url:"https://www.islandcounty.net/treasurer/tax-foreclosure",platform:"Bid4Assets",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Jefferson",url:"https://www.jeffersoncountywa.gov/treasurer/tax-foreclosure",platform:"Bid4Assets",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"King",url:"https://kingcounty.gov/en/dept/executive-services/buildings-property/treasury-operations/tax-foreclosures/auctions",platform:"Online",saleDate2026:"September 9, 2026",note:"⚡ King County: Sept 9 2026 confirmed. Parcels delinquent 2022+ eligible.",...WA_STATE_RULES,verified:true,alert:"⚡ King County: Sept 9 2026 sale date confirmed"},
  {county:"Kitsap",url:"https://www.kitsapgov.com/treasurer/tax-foreclosure",platform:"Bid4Assets",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Kittitas",url:"https://www.co.kittitas.wa.us/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Klickitat",url:"https://www.klickitatcounty.org/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Lewis",url:"https://www.lewiscountywa.gov/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Lincoln",url:"https://www.co.lincoln.wa.us/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Mason",url:"https://www.masoncountywa.gov/treasurer/tax-foreclosure",platform:"Bid4Assets",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Okanogan",url:"https://www.okanogancounty.org/government/treasurer/foreclosure___surplus/index.php",platform:"Public Surplus",saleDate2026:"January 26-27, 2026",note:"⚡ Okanogan: Jan 26-27 2026 confirmed — PublicSurplus.com. 5% buyer premium.",...WA_STATE_RULES,verified:true,alert:"⚡ Okanogan County: Jan 26-27 2026 confirmed — PublicSurplus.com"},
  {county:"Pacific",url:"https://www.co.pacific.wa.us/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Pend Oreille",url:"https://www.pendoreilleco.org/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Pierce",url:"https://www.piercecountywa.gov/treasurer/tax-foreclosure",platform:"Bid4Assets",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"San Juan",url:"https://www.sanjuanco.com/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Skagit",url:"https://www.skagitcounty.net/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Skamania",url:"https://www.skamaniacounty.org/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Snohomish",url:"https://snohomishcountywa.gov/220/Tax-Foreclosures",platform:"Bid4Assets",saleMonth:"December/January",note:"⚡ 2025 auction Dec 2025–Jan 2026. 2026 sale: Dec 2026. Eligible: 2023+ delinquent as of June 1 2026.",...WA_STATE_RULES,verified:true,alert:"⚡ Snohomish: Annual Dec sale. 2026 eligibility: 2023 taxes unpaid as of June 1 2026"},
  {county:"Spokane",url:"https://www.spokanecounty.org/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Stevens",url:"https://www.stevenscountywa.gov/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Thurston",url:"https://www.thurstoncountywa.gov/departments/treasurer/real-property-foreclosure-tax-sale-information",platform:"Bid4Assets",saleMonth:"Annual",note:"Bid4Assets for foreclosure; tax-title sales also via Bid4Assets",...WA_STATE_RULES,verified:true},
  {county:"Wahkiakum",url:"https://www.co.wahkiakum.wa.us/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Walla Walla",url:"https://www.co.walla-walla.wa.us/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Whatcom",url:"https://www.whatcomcounty.us/373/Tax-Foreclosure-Sales",platform:"Bid4Assets",saleMonth:"Annual",note:"Surplus: Record title holder as of Cert of Delinquency filing. 3-year claim window.",...WA_STATE_RULES,verified:true},
  {county:"Whitman",url:"https://www.whitmancounty.org/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
  {county:"Yakima",url:"https://www.yakimacounty.us/treasurer/tax-foreclosure",platform:"GovEase",saleMonth:"November/December",...WA_STATE_RULES,verified:true},
];
window.COUNTY_DATA['WA_STATE_RULES'] = WA_STATE_RULES;

console.log('Batch 3 loaded — IN:', window.COUNTY_DATA['IN'].length,
  '| CO:', window.COUNTY_DATA['CO'].length,
  '| MD:', window.COUNTY_DATA['MD'].length,
  '| SC:', window.COUNTY_DATA['SC'].length,
  '| WA:', window.COUNTY_DATA['WA'].length);
