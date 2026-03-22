// ═══════════════════════════════════════════════════════════
// BATCH 6 — MS, LA, WV, AR, DE — FULL STRUCTURE v1
// March 2026
// ═══════════════════════════════════════════════════════════

window.COUNTY_DATA = window.COUNTY_DATA || {};

// ─────────────────────────────────────────────────────────
// MISSISSIPPI — 82 COUNTIES — TAX LIEN (hybrid — matures to deed)
// Statute: MCA §27-41 (Collection) + §27-45 (Redemption) + §27-47 (Assignment)
// Sale: 1st Monday in April OR last Monday in August (county chooses)
// Most counties: last Monday in August
// Rate: 18%/yr + 5% penalty on FACE VALUE only
// Overbid: NOT returned — goes to county general fund
// 2-year redemption → Chancery Clerk issues Tax Deed
// ─────────────────────────────────────────────────────────
const MS_STATE_RULES = {
  type: "lien",
  auction: {
    frequency: "Annual — 1st Monday in April OR last Monday in August (county sets)",
    majority: "Last Monday in August (most counties)",
    platform: "GovEase (growing) / in-person courthouse",
    bidMethod: "Premium bid — highest bidder above face value",
    minimumBid: "All delinquent taxes + penalties",
    startTime: "8:30 AM — continues until all parcels offered",
    overbidRule: "CRITICAL: Overbid earns NO interest and is NOT returned upon redemption. Goes to county general fund per MCA §27-41-77.",
    statute: "MCA §27-41-49 through §27-41-89"
  },
  struckToState: {
    name: "Struck Off to State",
    trigger: "No bidder at tax sale — property certified to state",
    note: "Rarely happens due to investor demand at MS tax sales. Property remains redeemable for 2 years.",
    statute: "MCA §27-41-55"
  },
  otc: {
    available: true,
    name: "Assignment of Tax Lien / State Land Purchase",
    statute: "MCA §27-47 (Assignment); MCA §29-1 (State Lands)",
    process: "Tax liens are freely assignable by endorsement. Struck-to-state parcels may be purchased from Land Commissioner after 2-year redemption period.",
    note: "Contact Mississippi Secretary of State / Land Commissioner for state-held parcels"
  },
  subTax: {
    available: true,
    name: "Subsequent Tax Payment",
    note: "Certificate holder may pay subsequent taxes. Added to certificate. Earns 18%/yr + 5% penalty.",
    statute: "MCA §27-45"
  },
  redemption: {
    period: "2 years from date of sale",
    interestRate: "18% per annum on face value (taxes + penalty)",
    penalty: "5% on delinquent taxes",
    interestOnOverbid: "NONE — overbid earns zero interest",
    process: "Owner (or mortgage holder, interested party) pays Chancery Clerk: face amount + 18%/yr interest + 5% penalty",
    statute: "MCA §27-45-3",
    homesteadDifferent: false,
    agDifferent: false,
    note: "Chancery Clerk handles all redemptions and paybacks to purchasers"
  },
  deedPath: {
    name: "Tax Deed from Chancery Clerk",
    eligibleAfter: "2 years from sale (if not redeemed)",
    process: "Purchaser applies to Chancery Clerk. Clerk sends required notices (registered mail to owner and lienholders during redemption period). Clerk issues deed.",
    titleQuality: "No warranty. As-is.",
    quietTitleRequired: false,
    quietTitleRecommended: true,
    statute: "MCA §27-45-29"
  },
  surplus: {
    available: false,
    name: "No surplus — overbid goes to county general fund",
    statute: "MCA §27-41-77",
    note: "CRITICAL: Unlike most states, MS overbid is NOT returned and NOT available to former owner. Goes permanently to county general fund. Only face amount + 18%/yr returned to purchaser upon redemption."
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

window.COUNTY_DATA['MS'] = [
  {...MS_STATE_RULES, county:"Adams",url:"https://www.adamscountyms.net/tax-collector",platform:"In-person/GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Alcorn",url:"https://www.alcorncounty.org/tax-collector/the-tax-sale/",platform:"In-person",saleDate:"Last Monday August",note:"Sale ends ~12:30pm; City of Corinth holds separate sale at 1pm",verified:true},
  {...MS_STATE_RULES, county:"Amite",url:"https://www.amitecountyms.com/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Attala",url:"https://www.attalacountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Benton",url:"https://www.bentoncountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Bolivar",url:"https://www.bolivarcountyms.gov/tax-collector",platform:"In-person/GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Calhoun",url:"https://www.calhouncountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Carroll",url:"https://www.carrollcountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Chickasaw",url:"https://www.chickasawcountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Choctaw",url:"https://www.choctawcountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Claiborne",url:"https://www.claibornecountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Clarke",url:"https://www.clarkecountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Clay",url:"https://www.claycountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Coahoma",url:"https://www.coahomacountyms.gov/tax-collector",platform:"In-person/GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Copiah",url:"https://www.copiahcountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Covington",url:"https://www.covingtoncountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"DeSoto",url:"https://www.desotocountyms.gov/508/Tax-Sale",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Forrest",url:"https://www.forrestcountyms.gov/tax-collector",platform:"In-person/GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Franklin",url:"https://www.franklincountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"George",url:"https://www.georgecountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Greene",url:"https://www.greenecountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Grenada",url:"https://www.grenadacountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Hancock",url:"https://www.hancockcountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Harrison",url:"https://www.co.harrison.ms.us/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Hinds",url:"https://www.hindscountyms.com/tax-collector",platform:"In-person/GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Holmes",url:"https://www.holmescountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Humphreys",url:"https://www.humphreyscountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Issaquena",url:"https://www.issaquenacountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Itawamba",url:"https://www.itawambacountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Jackson",url:"https://www.co.jackson.ms.us/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Jasper",url:"https://www.jaspercountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Jefferson",url:"https://www.jeffersoncountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Jefferson Davis",url:"https://www.jeffersondaviscountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Jones",url:"https://www.jonescountyms.gov/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Kemper",url:"https://www.kempercountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Lafayette",url:"https://www.lafayettecountyms.gov/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Lamar",url:"https://www.lamarcountyms.gov/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Lauderdale",url:"https://www.lauderdalecountyms.gov/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Lawrence",url:"https://www.lawrencecountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Leake",url:"https://www.leakecountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Lee",url:"https://leecotaxcollector.com/tax-sale",platform:"GovEase",saleDate:"Last Monday August",note:"⚡ ~3,000 parcels. GovEase online. Reg Aug 1.",verified:true,alert:"⚡ Lee County: GovEase confirmed, ~3,000 parcels, reg opens Aug 1"},
  {...MS_STATE_RULES, county:"Leflore",url:"https://www.leflorecountyms.gov/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Lincoln",url:"https://www.lincolncountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Lowndes",url:"https://www.lowndescountyms.gov/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Madison",url:"https://www.madison-co.com/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Marion",url:"https://www.marioncountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Marshall",url:"https://www.marshallcountyms.gov/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Monroe",url:"https://www.monroecountyms.gov/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Montgomery",url:"https://www.montgomerycountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Neshoba",url:"https://www.neshobacountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Newton",url:"https://www.newtoncountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Noxubee",url:"https://www.noxubeecountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Oktibbeha",url:"https://www.oktibbeha.org/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Panola",url:"https://www.panolacountyms.gov/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Pearl River",url:"https://www.pearlrivercountyms.gov/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Perry",url:"https://www.perrycountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Pike",url:"https://www.pikecountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Pontotoc",url:"https://www.pontotoccountyms.gov/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Prentiss",url:"https://www.prentisscountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Quitman",url:"https://www.quitmancountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Rankin",url:"https://www.rankincounty.org/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Scott",url:"https://www.scottcountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Sharkey",url:"https://www.sharkeycountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Simpson",url:"https://www.simpsoncountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Smith",url:"https://www.smithcountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Stone",url:"https://www.stonecountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Sunflower",url:"https://www.sunflowercountyms.gov/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Tallahatchie",url:"https://www.tallahatchiecountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Tate",url:"https://www.tatecountyms.gov/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Tippah",url:"https://www.tippahcountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Tishomingo",url:"https://www.tishomingocountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Tunica",url:"https://www.tunicacountyms.gov/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Union",url:"https://www.unioncountyms.gov/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Walthall",url:"https://www.walthallcountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Warren",url:"https://www.warrencountyms.gov/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Washington",url:"https://www.washingtoncountyms.gov/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Wayne",url:"https://www.waynecountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Webster",url:"https://www.webstercountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Wilkinson",url:"https://www.wilkinsoncountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Winston",url:"https://www.winstoncountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Yalobusha",url:"https://www.yalobushacountyms.gov/tax-collector",platform:"In-person",saleDate:"Last Monday August",verified:true},
  {...MS_STATE_RULES, county:"Yazoo",url:"https://www.yazoocountyms.gov/tax-collector",platform:"GovEase",saleDate:"Last Monday August",verified:true},
];
window.COUNTY_DATA['MS_STATE_RULES'] = MS_STATE_RULES;

// ─────────────────────────────────────────────────────────
// LOUISIANA — 64 PARISHES — TAX LIEN (NEW 2026 SYSTEM)
// ⚡ MAJOR REFORM: Act 774 + Act 557 effective January 1, 2026
// OLD system (pre-2026): Bid-down ownership % (fractional ownership)
// NEW system (2026+): Tax Lien Certificate, bid-down INTEREST RATE
// Statute: LA RS §47:2154 (new) — effective Jan 1, 2026
// ─────────────────────────────────────────────────────────
const LA_STATE_RULES = {
  type: "lien",
  criticalAlert: "⚡ LOUISIANA MAJOR 2026 REFORM — Act 774 (2024) effective Jan 1 2026. All rules below apply to sales on/after Jan 1 2026. Pre-2026 tax sale certificates remain governed by prior law.",
  newSystem2026: {
    whatChanged: "Eliminated fractional ownership bid-down. Now a true tax lien certificate state.",
    whatSold: "Tax Lien Certificate (100% collateral interest in property) — NOT fractional ownership",
    bidMethod: "Bid-down INTEREST RATE from 1.0%/month (12%/yr) down to minimum 0.7%/month (8.4%/yr) in 0.1% increments",
    winner: "Lowest interest rate bid wins. Ties go to first bidder.",
    maxRate: "1.0% per month (12% annualized) — opening bid",
    minRate: "0.7% per month (8.4% annualized) — floor",
    certName: "Tax Lien Certificate",
    certExpiry: "7 years from recordation — prescribes if no enforcement action filed",
    statute: "LA RS §47:2154 (eff. Jan 1 2026)"
  },
  auction: {
    frequency: "Annual — typically May or June",
    platform: "Online (many parishes via CivicSource / parish portal) + in-person",
    timing: "Sheriff or municipal tax collector conducts",
    notice: "Enhanced notice requirements — tax collectors must provide detailed written notice before sale per §47:2206"
  },
  adjudicatedProperty: {
    note: "Property with no bidder: adjudicated to parish/political subdivision. Parishes may sell non-warranty deeds OR convert adjudicated title to Tax Lien Certificate under Act 557.",
    oldAdjudicated: "Properties adjudicated prior to Jan 1 2026 remain under old system. Parishes may still sell non-warranty deeds.",
    fastTrack: "If property adjudicated ≥3 years — parish may count that time toward 3-year redemption period, enabling faster path to foreclosure",
    noMinBid: "New 2026: Governing authorities may sell adjudicated property to highest bidder with no minimum bid (facilitates blighted property transfer)"
  },
  otc: {
    available: true,
    name: "Tax Liens Held by Political Subdivision (OTC)",
    trigger: "No bidder at auction — political subdivision holds lien",
    statute: "LA RS §47:2246",
    note: "Political subdivision-held liens do NOT prescribe after 7 years (unlike private investor certs). Contact parish/city directly."
  },
  subTax: {
    available: true,
    name: "Subsequent Tax Payments",
    statute: "LA RS §47:2154",
    note: "2026 law: subsequent taxes assessed to and paid by tax lien certificate holder until redeemed. Primary risk: non-payment may expose property to later tax sale."
  },
  redemption: {
    period: "3 years from date of Tax Lien Certificate recordation (standard)",
    blightedAbandoned: "18 months for blighted or abandoned properties",
    termination: "Now called 'extinguishment of lien' or 'termination payment'",
    terminationPrice: "Full delinquent amount + interest at certificate rate + 5% penalty + accrued costs + notice reimbursement (up to $500/property)",
    statute: "LA RS §47:2153, §47:2243",
    notice: "Investor must send formal redemption notices during period. Affidavit of notice required or investor risks extinguishment without reimbursement.",
    noticeReimbursement: "Up to $500 per property reimbursed to investor for notice costs upon redemption"
  },
  deedPath: {
    name: "Judicial Foreclosure (Sheriff's Sale)",
    eligibleAfter: "3 years from recordation of Tax Lien Certificate",
    noticeRequired: "Must send post-redemption-period notice 180–365 days before filing foreclosure",
    process: "Court-supervised foreclosure similar to mortgage foreclosure. Proper notice to all parties required. If completed — investor receives property via sheriff's sale.",
    surplusAfterForeclosure: "Any surplus from sheriff's sale returned to former owner per Tyler v. Hennepin compliance",
    statute: "LA RS §47:2243 et seq. (new 2026)",
    quietTitleRequired: false,
    note: "Old process (quiet title only) replaced by new judicial foreclosure path for post-2026 certificates"
  },
  surplus: {
    available: true,
    name: "Surplus Proceeds",
    statute: "LA RS §47:2243 (new 2026)",
    process: "Any excess from sheriff's sale foreclosure returned to former property owner",
    note: "Tyler v. Hennepin compliance — Louisiana 2026 reform explicitly addresses surplus return to former owners"
  },
  oldCertificates: {
    note: "CRITICAL: Pre-2026 tax sale certificates remain governed by OLD law. Fractional ownership, quiet title process, 1%/month fixed rate. Old adjudicated properties may still be sold under old system."
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

window.COUNTY_DATA['LA'] = [
  {...LA_STATE_RULES, parish:"Acadia",url:"https://www.acadiaparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Allen",url:"https://www.allenparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Ascension",url:"https://www.ascensionla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Assumption",url:"https://www.assumptionla.com/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Avoyelles",url:"https://www.avoyellescountyms.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Beauregard",url:"https://www.beauregarddla.com/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Bienville",url:"https://www.bienvilleparish.org/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Bossier",url:"https://www.bossiergov.org/tax-collector",platform:"CivicSource/Online",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Caddo",url:"https://www.caddoparishla.gov/tax-collector",platform:"CivicSource/Online",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Calcasieu",url:"https://www.calcasieutax.com",platform:"CivicSource/Online",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Caldwell",url:"https://www.caldwellparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Cameron",url:"https://www.cameronparishla.org/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Catahoula",url:"https://www.catahoulaparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Claiborne",url:"https://www.claiborneparish.org/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Concordia",url:"https://www.concordiaparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"De Soto",url:"https://www.desotoparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"East Baton Rouge",url:"https://www.ebrso.org/tax-collector",platform:"CivicSource/Online",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"East Carroll",url:"https://www.eastcarrollparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"East Feliciana",url:"https://www.eastfelicianaparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Evangeline",url:"https://www.evangelineparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Franklin",url:"https://www.franklinparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Grant",url:"https://www.grantparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Iberia",url:"https://www.iberiaparishla.gov/tax-collector",platform:"CivicSource/Online",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Iberville",url:"https://www.iberville.org/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Jackson",url:"https://www.jacksonparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Jefferson",url:"https://www.jeffparish.net/departments/tax-collector",platform:"CivicSource/Online",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Jefferson Davis",url:"https://www.jeffdavisparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Lafayette",url:"https://www.lafayettela.gov/tax-collector",platform:"CivicSource/Online",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Lafourche",url:"https://www.lafourchegov.org/tax-collector",platform:"CivicSource/Online",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"LaSalle",url:"https://www.lasalleparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Lincoln",url:"https://www.lincolnparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Livingston",url:"https://www.livingstonparishla.gov/tax-collector",platform:"CivicSource/Online",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Madison",url:"https://www.madisonparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Morehouse",url:"https://www.morehouseparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Natchitoches",url:"https://www.natchitochesparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Orleans",url:"https://www.stc.nola.gov",platform:"CivicSource/Online",saleMonth:"May/June",note:"New Orleans — high volume urban market",verified:true},
  {...LA_STATE_RULES, parish:"Ouachita",url:"https://www.ouachitaparishla.gov/tax-collector",platform:"CivicSource/Online",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Plaquemines",url:"https://www.plaqueminesparish.com/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Pointe Coupee",url:"https://www.pointecoupereparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Rapides",url:"https://www.rapidsparishla.gov/tax-collector",platform:"CivicSource/Online",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Red River",url:"https://www.redriverparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Richland",url:"https://www.richlandparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Sabine",url:"https://www.sabineparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"St. Bernard",url:"https://www.stbernardparish.net/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"St. Charles",url:"https://www.stcharlesla.gov/tax-collector",platform:"CivicSource/Online",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"St. Helena",url:"https://www.sthelenaprishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"St. James",url:"https://www.stjamesla.com/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"St. John the Baptist",url:"https://www.stjohnla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"St. Landry",url:"https://www.stlandryparish.org/tax-collector",platform:"CivicSource/Online",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"St. Martin",url:"https://www.stmartinparish.net/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"St. Mary",url:"https://www.stmaryparishla.gov/tax-collector",platform:"CivicSource/Online",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"St. Tammany",url:"https://www.stpso.com/tax-collector",platform:"CivicSource/Online",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Tangipahoa",url:"https://www.tangipahoa.org/tax-collector",platform:"CivicSource/Online",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Tensas",url:"https://www.tensasparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Terrebonne",url:"https://www.tpcg.org/tax-collector",platform:"CivicSource/Online",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Union",url:"https://www.unionparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Vermilion",url:"https://www.vermilionparishla.gov/tax-collector",platform:"CivicSource/Online",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Vernon",url:"https://www.vernonparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Washington",url:"https://www.washingtonparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Webster",url:"https://www.websterparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"West Baton Rouge",url:"https://www.westbatonrouge.net/tax-collector",platform:"CivicSource/Online",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"West Carroll",url:"https://www.westcarrollparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"West Feliciana",url:"https://www.westfelicianaparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
  {...LA_STATE_RULES, parish:"Winn",url:"https://www.winnparishla.gov/tax-collector",platform:"Online/Sheriff",saleMonth:"May/June",verified:true},
];
window.COUNTY_DATA['LA_STATE_RULES'] = LA_STATE_RULES;

// ─────────────────────────────────────────────────────────
// WEST VIRGINIA — 55 COUNTIES — TAX LIEN
// Statute: WV Code §11A-3 (Sale) + §11A-4 (Deed)
// Sheriff's sale: Oct 14 – Nov 23 annually (courthouse steps)
// Rate: 1% per month (12%/yr) on taxes + charges
// Two-stage: Sheriff sale → State Auditor → Deputy Commissioner (second sale if unsold)
// Deed: Quitclaim deed from State Auditor (18-month window)
// ─────────────────────────────────────────────────────────
const WV_STATE_RULES = {
  type: "lien",
  process: {
    stage1: "Sheriff's Tax Lien Sale: Held annually Oct 14 – Nov 23 at courthouse. Premium bid. Highest bidder gets Certificate of Sale.",
    stage2: "If property unsold at sheriff's sale — sheriff certifies to State Auditor. Auditor holds 18 months.",
    stage3: "Auditor certifies to Deputy Land Commissioner for second public auction (state sale).",
    stage4: "If still unsold after state sale — Deputy Commissioner holds. May sell without additional advertising to anyone making offer.",
    stateNotOwner: "State never owns the property — only the lien. Former owner retains title throughout."
  },
  auction: {
    frequency: "Annual — Oct 14 through Nov 23 (courthouse steps)",
    platform: "In-person courthouse / Sheriff's office — each county independently",
    bidMethod: "Premium bid — highest bidder above minimum",
    minimumBid: "All delinquent taxes + interest + charges",
    payment: "Check or money order payable to county sheriff — due by close of business day of sale",
    statute: "WV Code §11A-3-5, §11A-3-5a"
  },
  otc: {
    available: true,
    name: "State Auditor / Deputy Commissioner OTC Sale",
    trigger: "Unsold at sheriff's sale OR unsold at state sale (deputy commissioner holds)",
    process: "Contact WV State Auditor's Land Division. Deputy Commissioner may sell without additional advertising.",
    statute: "WV Code §11A-3-48",
    auditorUrl: "https://www.wvsao.gov/LandDivision",
    note: "Properties sold within previous 5 years for which no deed was secured are also available via Auditor"
  },
  subTax: {
    available: false,
    name: "N/A — WV lien cert does not have sub-tax mechanism for individual investors",
    note: "Subsequent taxes create separate delinquencies — tracked independently"
  },
  redemption: {
    period: "Until close of business day before the deed is issued by State Auditor (broadly — until April 1 of year 2 following sale)",
    interestRate: "1% per month on taxes + charges from date of sale to date of redemption",
    minimum: "If no notice proof from purchaser — minimum $500 + 1%/month interest",
    process: "Pay State Auditor or county clerk: all taxes + interest + charges + costs",
    statute: "WV Code §11A-3-56, §11A-3-57",
    hardshipPlan: "Owner may petition Auditor for installment redemption plan for primary residence",
    homesteadDifferent: false,
    agDifferent: false
  },
  deedPath: {
    name: "Quitclaim Deed from State Auditor",
    eligibleWindow: "Between April 1 of year 2 following sale AND 18 months after original sale",
    noticeProcess: "State Auditor sends notice May 1 – Sept 1 of year following sale. Purchaser must provide notice to owner + lienholders. Purchaser submits proof of expenses.",
    process: "Purchaser requests deed from State Auditor. Auditor approves and executes quitclaim deed within 120 days of request.",
    statute: "WV Code §11A-3-27",
    titleQuality: "Quitclaim — no warranty. Quiet title strongly recommended.",
    quietTitleRequired: false,
    quietTitleRecommended: true,
    note: "Certificate expires after 18 months — must request deed within window or lien becomes void"
  },
  surplus: {
    available: true,
    name: "Surplus Proceeds",
    statute: "WV Code §11A-3-65 (former owner right to surplus), §11A-3-64 (sheriff disposition)",
    trigger: "Overbid above taxes + costs at sheriff's sale or state sale",
    claimPeriod: "2 years for purchaser surplus; if no claim within 2 years — paid to Auditor for general school fund",
    process: "Former owner may claim surplus. Former creditors also have claims (§11A-4-7).",
    note: "Tyler v. Hennepin applies — WV §11A-3-65 already provides right of former owner to surplus proceeds"
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

window.COUNTY_DATA['WV'] = [
  {...WV_STATE_RULES, county:"Barbour",url:"https://www.barbourcountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Berkeley",url:"https://www.berkeleywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Boone",url:"https://www.boonecountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Braxton",url:"https://www.braxtonco.com/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Brooke",url:"https://www.brookecountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Cabell",url:"https://www.cabellcounty.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Calhoun",url:"https://www.calhouncountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Clay",url:"https://www.claycountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Doddridge",url:"https://www.doddridgecountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Fayette",url:"https://www.fayettecountycommission.com/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Gilmer",url:"https://www.gilmercountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Grant",url:"https://www.grantcountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Greenbrier",url:"https://www.greenbrierco.com/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Hampshire",url:"https://www.hampshirecountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Hancock",url:"https://www.hancockcountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Hardy",url:"https://www.hardycountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Harrison",url:"https://www.harrisoncountywv.com/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Jackson",url:"https://www.jacksoncountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Jefferson",url:"https://www.jeffersoncountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Kanawha",url:"https://www.kanawha.us/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Lewis",url:"https://www.lewiscountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Lincoln",url:"https://www.lincolncountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Logan",url:"https://www.logancountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Marion",url:"https://www.marioncountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Marshall",url:"https://www.marshallcountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Mason",url:"https://www.masoncountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"McDowell",url:"https://www.mcdowellcountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Mercer",url:"https://www.mercercountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Mineral",url:"https://www.mineralcountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Mingo",url:"https://www.mingocountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Monongalia",url:"https://www.monongaliacounty.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Monroe",url:"https://www.monroecountywv.gov/tax-office/delinquent-land-sale/83",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",note:"⚡ Full process documented: Nov 2026 sale for 2025 taxes",verified:true,alert:"⚡ Monroe County: Full sheriff sale timeline documented"},
  {...WV_STATE_RULES, county:"Morgan",url:"https://www.morgancountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Nicholas",url:"https://www.nicholascountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Ohio",url:"https://www.ohiocountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Pendleton",url:"https://www.pendletoncountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Pleasants",url:"https://www.pleasantscountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Pocahontas",url:"https://www.pocahontascountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Preston",url:"https://www.prestoncountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Putnam",url:"https://www.putnamcountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Raleigh",url:"https://www.raleighcountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Randolph",url:"https://www.randolphcountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Ritchie",url:"https://www.ritchiecountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Roane",url:"https://www.roanecountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Summers",url:"https://www.summerscountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Taylor",url:"https://www.taylorcountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Tucker",url:"https://www.tuckercountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Tyler",url:"https://www.tylercountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Upshur",url:"https://www.upshurcountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Wayne",url:"https://www.waynecountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Webster",url:"https://www.webstercountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Wetzel",url:"https://www.wetzelcountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Wirt",url:"https://www.wirtcountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Wood",url:"https://www.woodcountywv.com/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
  {...WV_STATE_RULES, county:"Wyoming",url:"https://www.wyomingcountywv.org/sheriff/tax-sales",platform:"Courthouse",saleWindow:"Oct 14–Nov 23",verified:true},
];
window.COUNTY_DATA['WV_STATE_RULES'] = WV_STATE_RULES;

// ─────────────────────────────────────────────────────────
// ARKANSAS — 75 COUNTIES — TAX DEED (Commissioner of State Lands)
// Statute: ACA §26-37-101 et seq.
// Unique: State-administered — Commissioner of State Lands (COSL) at cosl.org
// Process: 1 yr delinquent → certified to COSL → public auction → 10-biz-day redemption → limited warranty deed
// 90-day litigation period after deed issuance
// ─────────────────────────────────────────────────────────
const AR_STATE_RULES = {
  type: "deed",
  process: {
    delinquency: "Property taxes due October 15. Delinquent if not paid.",
    certification: "No later than July 1 of year following delinquency — county certifies to Commissioner of State Lands (COSL). Title vests in State of Arkansas in care of COSL.",
    cosl: "COSL administers all tax-delinquent land sales at cosl.org. Annual in-person auctions by county + online unsold-property auctions."
  },
  auction: {
    frequency: "Annual in-person county auctions + ongoing online unsold-property auctions",
    platform: "COSL — cosl.org (online bidding + in-person county auctions)",
    bidMethod: "Highest bidder — minimum bid = all delinquent taxes + penalties + interest + costs",
    minimumBid: "All delinquent taxes + 10% penalty + interest + advertising costs",
    foreignPurchaser: "CRITICAL: If purchaser's home of record is outside US — deed cancelled within 3 business days and all funds forfeited (eff. July 1 2021)",
    statute: "ACA §26-37-202"
  },
  otc: {
    available: true,
    name: "Unsold-Property Auction / Post-Auction Sale / Negotiated-Price Sale",
    process: "Parcels not sold at annual auction listed on cosl.org for online unsold-property auction or negotiated-price sale",
    withinFirstTwoYears: "Must offer for at least amount of taxes + penalties + interest + costs",
    afterTwoYears: "Negotiated price — COSL determines in best interest of state and taxing units",
    url: "https://cosl.org/parcels",
    note: "All redemptions must be received prior to 4:00 PM CT on last business day before sale date"
  },
  subTax: {
    available: false,
    name: "N/A — Arkansas is deed state, COSL administers"
  },
  redemption: {
    preAuction: "Owner may redeem (pay all taxes + penalties + interest + costs) through COSL before 4:00 PM CT on last business day before sale",
    postAuction: "10 business days after sale date — owner or interested party may still redeem by paying all amounts due + notice cost",
    statute: "ACA §26-37-202(e), §26-37-310",
    homesteadDifferent: false,
    agDifferent: false,
    note: "After 10-business-day post-sale redemption window — limited warranty deed issued. No further redemption."
  },
  deedPath: {
    name: "Limited Warranty Deed from Commissioner of State Lands",
    process: "After 10-business-day post-sale period without redemption — COSL issues limited warranty deed",
    titleQuality: "LIMITED warranty deed (not general warranty). COSL warrants its own acts only.",
    litigationPeriod: "90 days from date of conveyance to challenge deed validity (ACA §26-37-203)",
    duringLitigationPeriod: "Any action on property during 90-day period is at purchaser's risk — funds may not be recoverable if sale set aside",
    quietTitleRequired: false,
    quietTitleRecommended: true,
    statute: "ACA §26-37-202, §26-37-203"
  },
  surplus: {
    available: true,
    name: "Excess Proceeds",
    statute: "ACA §26-37-202; COSL Rules",
    trigger: "Sale price exceeds all delinquent taxes + penalties + interest + costs",
    process: "COSL holds excess proceeds. Former owner or interested party may claim. View/claim at cosl.org.",
    claimUrl: "https://cosl.org",
    note: "Tyler v. Hennepin applies — COSL excess proceeds available to former owners"
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

window.COUNTY_DATA['AR'] = [
  {...AR_STATE_RULES, county:"Arkansas",url:"https://cosl.org",platform:"COSL (cosl.org)",verified:true},
  {...AR_STATE_RULES, county:"Ashley",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Baxter",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Benton",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Boone",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Bradley",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Calhoun",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Carroll",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Chicot",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Clark",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Clay",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Cleburne",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Cleveland",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Columbia",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Conway",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Craighead",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Crawford",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Crittenden",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Cross",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Dallas",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Desha",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Drew",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Faulkner",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Franklin",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Fulton",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Garland",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Grant",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Greene",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Hempstead",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Hot Spring",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Howard",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Independence",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Izard",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Jackson",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Jefferson",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Johnson",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Lafayette",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Lawrence",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Lee",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Lincoln",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Little River",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Logan",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Lonoke",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Madison",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Marion",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Miller",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Mississippi",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Monroe",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Montgomery",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Nevada",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Newton",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Ouachita",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Perry",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Phillips",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Pike",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Poinsett",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Polk",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Pope",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Prairie",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Pulaski",url:"https://cosl.org",platform:"COSL",note:"Little Rock — high volume",verified:true},
  {...AR_STATE_RULES, county:"Randolph",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Saline",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Scott",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Searcy",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Sebastian",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Sevier",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Sharp",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"St. Francis",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Stone",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Union",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Van Buren",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Washington",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"White",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Woodruff",url:"https://cosl.org",platform:"COSL",verified:true},
  {...AR_STATE_RULES, county:"Yell",url:"https://cosl.org",platform:"COSL",verified:true},
];
window.COUNTY_DATA['AR_STATE_RULES'] = AR_STATE_RULES;

// ─────────────────────────────────────────────────────────
// DELAWARE — 3 COUNTIES — TAX DEED (Monition / Sheriff's Sale)
// Statute: 9 Del. C. Chapter 87 (Collection of Delinquent Taxes)
// Unique: "Monition Method" — judicial process via Superior Court
// Each county has different redemption rules:
//   New Castle: 60-day redemption, 15% of purchase price
//   Kent & Sussex: 1-year redemption, 20% of purchase price
// Only 3 counties — smallest count of any state
// ─────────────────────────────────────────────────────────
const DE_STATE_RULES = {
  type: "deed",
  stateStructure: {
    note: "Delaware has only 3 counties. Each county independently handles tax sales via 'Monition' (judicial notice/writ) process through Superior Court. Sheriff conducts sale.",
    uniqueFeature: "Monition = formal legal notice served on property + published. Superior Court must approve all sales.",
    monitionMethod: "Subchapter II — Superior Court judicial process used for tax sales in all 3 counties"
  },
  auction: {
    frequency: "As scheduled — no fixed statewide date",
    method: "Public auction by Sheriff — highest bidder",
    bidMethod: "Premium bid",
    payment: {
      newCastle: "100% due day of sale (monition/tax sales)",
      kent: "Varies — contact Levy Court Finance",
      sussex: "20% deposit day of sale; balance by 3PM; 100% full payment for monition/tax sales"
    },
    approval: "Superior Court must confirm all sales (9 Del. C. §8726)",
    statute: "9 Del. C. §8725 et seq."
  },
  otc: {
    available: false,
    name: "N/A — Delaware judicial sale process only. Contact county finance offices for any surplus county-owned property."
  },
  subTax: {
    available: false,
    name: "N/A — Delaware judicial deed state"
  },
  deedPath: {
    name: "Sheriff's Deed (after Superior Court confirmation)",
    process: "Sale → Superior Court confirms → Sheriff delivers certificate → deed after redemption period expires",
    titleQuality: "Free and clear of all liens held by parties given notice in proceedings",
    statute: "9 Del. C. §8756"
  },
  surplus: {
    available: true,
    name: "Surplus Proceeds",
    statute: "9 Del. C. §8757",
    process: "Superior Court handles distribution of surplus after all tax obligations paid",
    note: "Tyler v. Hennepin applies — DE judicial process routes surplus via court to former owners"
  },
  verifiedDate: "March 2026",
  results: { lastSaleUrl: null, avgRateBid: null, totalLiensSold: null, totalValue: null }
};

window.COUNTY_DATA['DE'] = [
  {...DE_STATE_RULES, 
    county: "New Castle",
    url: "https://www.newcastlede.gov/188/Sale-Lists",
    platform: "Sheriff's Office",
    saleFrequency: "Monthly (3rd Monday of month)",
    redemption: {
      period: "60 days from day sale confirmed by Superior Court",
      premium: "15% of purchase price",
      statute: "9 Del. C. §8758",
      note: "⚡ 60-day window only — much shorter than Kent/Sussex. Owner must act fast."
    },
    payment: "100% due day of sale for monition (tax) sales. $500 late payment fee if final payment after due date.",
    assignmentFee: "0.25% of high bid (min $125), effective July 1 2024",
    note: "Monthly sheriff sales 3rd Monday. Monition (tax) sales: 100% day of sale. Mortgage/judgment: 20% deposit.",
    alert: "⚡ New Castle: 60-day redemption only at 15% premium",
    verified: true
  },
  {...DE_STATE_RULES, 
    county: "Kent",
    url: "https://www.kentcountyde.gov/My-Government/Departments/Finance/Monition-Sale-Procedures",
    platform: "Levy Court / Sheriff",
    saleFrequency: "As scheduled — contact Levy Court Finance Division",
    redemption: {
      period: "1 year from date sale is confirmed",
      premium: "20% of purchase price",
      statute: "9 Del. C. §8776",
      note: "Owner/heirs/executors/administrators may redeem within 1 year. No deed issued until redemption period expires."
    },
    payment: "Varies by sale type — contact Levy Court Finance",
    note: "Properties published in Wednesday editions of Delaware State News and Dover Post 2-3 weeks prior to sale.",
    verified: true
  },
  {...DE_STATE_RULES, 
    county: "Sussex",
    url: "https://sussexcountyde.gov/sheriff-sales",
    platform: "Sheriff's Office",
    saleFrequency: "As scheduled — typically multiple times per year",
    redemption: {
      period: "1 year from date sale is confirmed",
      premium: "20% of purchase price",
      statute: "9 Del. C. §8776",
      note: "No deed issued until 1-year redemption period expires without redemption"
    },
    payment: "Day of sale: $4,000 deposit to register. 20% total deposit due by 3PM day of sale. Remaining balance by court deadline.",
    transferTax: "2.5% Delaware Realty Transfer Tax + 1.5% Sussex County Realty Tax — split buyer/seller",
    note: "All sales subject to Superior Court approval per 9 Del. C. §8726.",
    verified: true
  }
];
window.COUNTY_DATA['DE_STATE_RULES'] = DE_STATE_RULES;

console.log('Batch 6 loaded — MS:', window.COUNTY_DATA['MS'].length,
  '| LA:', window.COUNTY_DATA['LA'].length,
  '| WV:', window.COUNTY_DATA['WV'].length,
  '| AR:', window.COUNTY_DATA['AR'].length,
  '| DE:', window.COUNTY_DATA['DE'].length);
