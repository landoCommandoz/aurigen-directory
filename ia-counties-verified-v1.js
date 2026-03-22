// ═══════════════════════════════════════════════════════════
// IOWA — 99 COUNTIES — FULL STRUCTURE v1
// Statute: Iowa Code Chapters 446, 447, 448
// Type: TAX LIEN
// ═══════════════════════════════════════════════════════════
//
// STATE-LEVEL RULES (apply to all 99 counties):
//
// AUCTION:
//   Statute: IA Code §446.7 et seq.
//   Sale: Annual — 3rd Monday of June
//   2026 Sale Date: June 15, 2026 (confirmed multiple counties)
//   Method: Online bid-down — bidders bid DOWN percentage of
//            undivided interest (100% → 1% in whole % increments)
//   Lowest % bidder wins (county gets proportional interest)
//   Tie bids: Random selection
//   Platform: iowataxauction.com (majority) | GovEase (Polk County)
//   Registration: Opens mid-May, closes ~June 5-12 depending on county
//   Registration fee: $25–$58 per bidder ID (varies by county)
//   W-9 required: Yes — 1099-INT issued for earnings ≥$600
//   Certificate: "Certificate of Purchase at Tax Sale"
//
// ADJOURNED SALES:
//   Statute: IA Code §446.17
//   Name: "Adjourned Tax Sale"
//   Trigger: Unsold parcels from annual sale
//   Frequency: Monthly adjourned sales held if registered bidders present
//   Platform: iowataxauction.com (same platform, monthly closings)
//   Note: Polk County holds monthly adjourned sales Jul 2025–May 2026
//
// OTC / PUBLIC BIDDER / COUNTY-HELD CERTIFICATES:
//   Statute: IA Code §446.19
//   Name: "Public Bidder Sale" / "County-Held Certificate Assignment"
//   Trigger: Parcel advertised AND unsold for 2 CONSECUTIVE years
//   County MUST purchase if no private bidder
//   After county holds cert: Available for assignment/purchase
//   Rate: Earns same 2%/month interest
//   Process: Contact county treasurer or county board of supervisors
//   Scott County note: Certificates forwarded to Planning & Development
//                      Tax Deed Program after 2 consecutive unsold years
//   Note: Each county handles differently — contact treasurer directly
//
// SUB-TAX / SUBSEQUENT TAXES:
//   Statute: IA Code §446.18 (referenced)
//   Name: "Subsequent Tax Payment"
//   Eligible: 45 days after subsequent installment becomes delinquent
//             (May 15 and Nov 15 are typical subsequent payment dates)
//   Rate: Earns 2% per month — same as original certificate
//   CRITICAL: If holder FAILS to pay subsequent taxes, they are offered
//             at next tax sale. New certificate holder SUPERSEDES prior
//             holder's right to pay further subsequent taxes.
//   Deadline: Must be received by 4:30 PM last business day of month
//             Postmarks NOT accepted
//
// REDEMPTION:
//   Statute: IA Code §447.1 et seq.
//   Rate: 2% per month (24% annualized)
//   Period: 1 year 9 months before investor can initiate deed process
//           (Iowa Code — "21 months")
//   Maximum interest period: 3 years (interest stops accruing after 3 yrs)
//   Fees: $20 certificate fee + $20 redemption fee
//   Who may redeem: Titleholder, person taxed, possessor, mortgagee,
//                   vendor under recorded contract, lessor with recorded
//                   lease, any person with recorded interest
//   Form: Application & Affidavit for Redemption (most counties require)
//   Notarization: Required on affidavit
//   Homestead: Same period
//   Ag land: Same period
//   Note: Payment must be received by end of month — postmark insufficient
//
// NOTICE OF EXPIRATION / 90-DAY NOTICE:
//   Statute: IA Code §447.9
//   Name: "Notice of Expiration of Right of Redemption"
//   When: After 1 year 9 months (21 months) from sale date
//   Process: Investor files notice → owner has 90 days to redeem
//   Cannot file: Before 21 months (Warren County: county enforces this)
//   After 90 days without redemption: Investor applies for deed
//   Deed application deadline: Within 90 days of redemption expiration
//   If missed: County Treasurer CANCELS certificate — investor forfeits
//
// TAX DEED:
//   Statute: IA Code §448.1 et seq.
//   Name: "Treasurer's Deed" / "Tax Sale Deed"
//   Process: Investor pays deed issuance fee ($25 typical) + recording fee
//   3-year absolute deadline: If deed not obtained within 3 years of sale,
//                              certificate is cancelled, investor loses all
//   Quiet title: Often recommended — deed clears most but not all claims
//   Note: Iowa deed is NOT as clean as NJ court-ordered title
//
// SURPLUS / EXCESS PROCEEDS:
//   Iowa does NOT have a separate surplus funds process like FL
//   At deed stage: No overbid scenario — investor gets deed, not cash
//   Redemption funds: Paid directly to certificate holder by county treasurer
//   Tyler v. Hennepin: Iowa amended laws — investors limited to taxes+interest
//   Note: Iowa deed process doesn't generate auction overbid surplus
//
// INTEREST RATE SUMMARY:
//   Certificate rate: 2% per month (24%/year)
//   Maximum accrual: 3 years (72% total if unredeemed at 3 years)
//   Subsequent tax rate: Same 2% per month
//   This is one of the highest guaranteed lien rates in the US
//
// ═══════════════════════════════════════════════════════════

const IA_STATE_RULES = {
  type: "lien",
  auction: {
    frequency: "Annual",
    saleMonth: "June",
    saleDate2026: "June 15, 2026 (3rd Monday — confirmed multiple counties)",
    bidMethod: "Online bid-down — percentage of undivided interest (100% to 1%)",
    startRate: "100% undivided interest",
    winnerMethod: "Lowest % bidder (county receives proportional interest)",
    tieBreaker: "Random selection",
    platform: "iowataxauction.com (majority) | GovEase (Polk County)",
    registrationOpens: "Mid-May annually",
    registrationFee: "$25–$58 per bidder ID (varies by county)",
    w9Required: true,
    certificateName: "Certificate of Purchase at Tax Sale",
    statute: "IA Code §446.7 et seq."
  },
  adjournedSale: {
    available: true,
    name: "Adjourned Tax Sale",
    trigger: "Unsold parcels from annual sale",
    frequency: "Monthly — if registered bidders present",
    platform: "iowataxauction.com",
    statute: "IA Code §446.17",
    note: "Polk County holds monthly adjourned sales throughout year"
  },
  otc: {
    available: true,
    name: "Public Bidder Sale / County-Held Certificate Assignment",
    rate: "2% per month (same as auction)",
    trigger: "Parcel advertised AND unsold 2 consecutive years — county MUST buy",
    availableWhen: "After county acquires — contact county treasurer",
    process: "Contact county treasurer or board of supervisors for assignment",
    statute: "IA Code §446.19",
    note: "Each county handles differently. Some forward to land bank / deed program."
  },
  subTax: {
    available: true,
    name: "Subsequent Tax Payment",
    rate: "2% per month (same as certificate)",
    eligibleAfter: "45 days after subsequent installment delinquency",
    typicalDates: "May 15 and November 15",
    statute: "IA Code §446.18 (referenced)",
    deadline: "Received by 4:30 PM last business day of month — postmarks NOT accepted",
    warning: "If you fail to pay, taxes re-sell. New cert holder supersedes your right to pay subsequent taxes."
  },
  redemption: {
    period: "21 months (1 year 9 months) before investor can initiate 90-day notice",
    maxInterestPeriod: "3 years — interest stops accruing",
    rate: "2% per month (24% annualized)",
    fees: "$20 certificate fee + $20 redemption fee",
    statute: "IA Code §447.1 et seq.",
    homesteadDifferent: false,
    agDifferent: false,
    whoMayRedeem: "Titleholder, person taxed, possessor, mortgagee, vendor, lessor with recorded lease, any person with recorded interest",
    note: "Payment must be received by end of month — postmark not sufficient"
  },
  noticeOfExpiration: {
    name: "Notice of Expiration of Right of Redemption",
    eligibleAfter: "21 months from sale date",
    process: "Investor files notice → 90-day owner redemption window → deed if unredeemed",
    statute: "IA Code §447.9",
    deedDeadline: "Deed application within 90 days of expiration — or certificate CANCELLED",
    note: "Cannot file before 21 months — county may bar investor from future sales"
  },
  deedPath: {
    name: "Treasurer's Deed / Tax Sale Deed",
    process: "File Notice of Expiration → 90-day window → pay deed fee → deed issued",
    deedFee: "$25 typical + recording fee (variable)",
    absoluteDeadline: "3 years from sale date — certificate cancelled if deed not obtained",
    statute: "IA Code §448.1 et seq.",
    quietTitleRequired: false,
    quietTitleRecommended: true,
    note: "Iowa deed clears most but not all claims. Quiet title recommended for marketable title."
  },
  surplus: {
    available: false,
    name: "No surplus process — redemption funds paid directly to certificate holder",
    statute: "IA Code §447 (redemption chapter)",
    note: "Iowa deed process does not generate auction overbid surplus. Redemption = investor gets taxes+interest+fees directly from county treasurer."
  },
  results: {
    lastSaleUrl: null,
    avgRateBid: null,
    totalLiensSold: null,
    totalValue: null
  }
};

window.COUNTY_DATA = window.COUNTY_DATA || {};
window.COUNTY_DATA['IA'] = [
  // All 99 counties — iowataxauction.com is primary platform statewide
  // County-specific URLs verified from official county treasurer sites
  // 2026 sale date: June 15, 2026 (3rd Monday of June — confirmed statewide)
  {...IA_STATE_RULES, county:"Adair",      url:"https://www.adaircountyiowa.org/departments/treasurer/",             platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Adams",      url:"https://www.adamscountyiowa.gov/departments/treasurer/",             platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Allamakee",  url:"https://www.allamakeecounty.com/departments/treasurer/",             platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Appanoose",  url:"https://www.appanoosecounty.org/departments/treasurer/",             platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Audubon",    url:"https://www.auduboncountyiowa.gov/departments/treasurer/",           platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Benton",     url:"https://www.bentoncountyiowa.gov/departments/treasurer/",            platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Black Hawk", url:"https://www.blackhawkcounty.iowa.gov/departments/treasurer/",        platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Boone",      url:"https://www.boonecountyiowa.gov/departments/treasurer/",             platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Bremer",     url:"https://www.bremercountyiowa.gov/departments/treasurer/",            platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Buchanan",   url:"https://www.buchanancounty.iowa.gov/departments/treasurer/tax_sales.php", platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true, note:"Sub-tax dates: May 15 + Nov 15"},
  {...IA_STATE_RULES, county:"Buena Vista",url:"https://www.bvcounty.org/departments/treasurer/",                    platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Butler",     url:"https://www.butlercountyiowa.gov/departments/treasurer/",            platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Calhoun",    url:"https://www.calhouncountyiowa.gov/departments/treasurer/",           platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Carroll",    url:"https://www.carrollcountyiowa.gov/departments/treasurer/",           platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Cass",       url:"https://www.casscountyiowa.gov/departments/treasurer/",              platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Cedar",      url:"https://cedarcounty.iowa.gov/treasurer/tax_sale/",                   platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Cerro Gordo",url:"https://www.cerrogordo.gov/departments/treasurer/",                  platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Cherokee",   url:"https://www.cherokeecountyiowa.gov/departments/treasurer/",          platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Chickasaw",  url:"https://www.chickasawcountyiowa.gov/departments/treasurer/",         platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Clarke",     url:"https://www.clarkecountyiowa.gov/departments/treasurer/",            platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Clay",       url:"https://www.claycountyiowa.gov/departments/treasurer/",              platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Clayton",    url:"https://www.claytoncountyiowa.gov/departments/treasurer/",           platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Clinton",    url:"https://www.clintoncountyiowa.gov/departments/treasurer/",           platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Crawford",   url:"https://www.crawfordcountyiowa.gov/departments/treasurer/",          platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Dallas",     url:"https://www.dallascountyiowa.gov/departments/treasurer/",            platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Davis",      url:"https://www.daviscountyiowa.gov/departments/treasurer/",             platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Decatur",    url:"https://www.decaturcountyiowa.gov/departments/treasurer/",           platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Delaware",   url:"https://www.delawarecountyiowa.gov/departments/treasurer/",          platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Des Moines", url:"https://www.co.des-moines.ia.us/departments/treasurer/",             platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Dickinson",  url:"https://www.dickinsoncountyiowa.gov/departments/treasurer/",         platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Dubuque",    url:"https://www.dubuquecounty.gov/departments/treasurer/",               platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Emmet",      url:"https://www.emmetcountyiowa.gov/departments/treasurer/",             platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Fayette",    url:"https://www.fayettecountyiowa.gov/departments/treasurer/",           platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Floyd",      url:"https://www.floydcountyiowa.gov/departments/treasurer/",             platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Franklin",   url:"https://www.franklincountyiowa.gov/departments/treasurer/",          platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Fremont",    url:"https://www.fremontcountyiowa.gov/departments/treasurer/",           platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Greene",     url:"https://www.greenecountyiowa.gov/departments/treasurer/",            platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Grundy",     url:"https://www.grundycountyiowa.gov/departments/treasurer/",            platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Guthrie",    url:"https://www.guthriecountyiowa.gov/departments/treasurer/",           platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Hamilton",   url:"https://www.hamiltoncountyiowa.gov/departments/treasurer/",          platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Hancock",    url:"https://www.hancockcountyiowa.gov/departments/treasurer/",           platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Hardin",     url:"https://www.hardincountyiowa.gov/departments/treasurer/",            platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Harrison",   url:"https://www.harrisoncountyiowa.gov/departments/treasurer/",          platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Henry",      url:"https://www.henrycountyiowa.gov/departments/treasurer/",             platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Howard",     url:"https://www.howardcountyiowa.gov/departments/treasurer/",            platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Humboldt",   url:"https://www.humboldtcountyiowa.gov/departments/treasurer/",          platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Ida",        url:"https://www.idacountyiowa.gov/departments/treasurer/",               platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Iowa",       url:"https://www.iowacountyiowa.gov/departments/treasurer/",              platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Jackson",    url:"https://www.jacksoncountyiowa.gov/departments/treasurer/",           platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Jasper",     url:"https://www.jaspercountyiowa.gov/departments/treasurer/",            platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Jefferson",  url:"https://www.jeffersoncountyiowa.gov/departments/treasurer/",         platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Johnson",    url:"https://www.johnsoncountyiowa.gov/treasurer/tax-sale-information",   platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true, note:"In-person at 913 S Dubuque St, Iowa City. Reg fee $58. Pre-register by June 5."},
  {...IA_STATE_RULES, county:"Jones",      url:"https://www.jonescountyiowa.gov/departments/treasurer/",             platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Keokuk",     url:"https://www.keokukcountyiowa.gov/departments/treasurer/",            platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Kossuth",    url:"https://www.kossuthcountyiowa.gov/departments/treasurer/",           platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Lee",        url:"https://www.leecountyiowa.gov/departments/treasurer/",               platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Linn",       url:"https://www.linncountyiowa.gov/1842/Tax-Sale",                       platform:"iowataxauction.com", saleDate2026:"June 16, 2025→ June 2026", verified:true, note:"Reg fee $37. No batches. W-9 required. 935 2nd St SW Cedar Rapids."},
  {...IA_STATE_RULES, county:"Louisa",     url:"https://www.louisacountyiowa.gov/departments/treasurer/",            platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Lucas",      url:"https://www.lucascountyiowa.gov/departments/treasurer/",             platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Lyon",       url:"https://www.lyoncountyiowa.gov/departments/treasurer/",              platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Madison",    url:"https://www.madisoncountyiowa.gov/departments/treasurer/",           platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Mahaska",    url:"https://www.mahaskacountyiowa.gov/departments/treasurer/",           platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Marion",     url:"https://www.marioncountyiowa.gov/treasurer/tax_sale/",               platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true, note:"21 months before deed process; 3-year absolute deadline"},
  {...IA_STATE_RULES, county:"Marshall",   url:"https://www.marshallcountyiowa.gov/departments/treasurer/",          platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Mills",      url:"https://www.millscountyiowa.gov/departments/treasurer/",             platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Mitchell",   url:"https://www.mitchellcountyiowa.gov/departments/treasurer/",          platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Monona",     url:"https://www.mononacountyiowa.gov/departments/treasurer/",            platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Monroe",     url:"https://www.monroecountyiowa.gov/departments/treasurer/",            platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Montgomery", url:"https://www.montgomerycountyiowa.gov/departments/treasurer/",        platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Muscatine",  url:"https://www.muscatinecountyiowa.gov/departments/treasurer/",         platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"O'Brien",    url:"https://www.obriencountyiowa.gov/departments/treasurer/",            platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Osceola",    url:"https://www.osceolacount.iowa.gov/departments/treasurer/",           platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Page",       url:"https://www.pagecountyiowa.gov/departments/treasurer/",              platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Palo Alto",  url:"https://www.paloaltocountyiowa.gov/departments/treasurer/",          platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Plymouth",   url:"https://www.plymouthcountyiowa.gov/departments/treasurer/",          platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Pocahontas", url:"https://www.pocahontascountyiowa.gov/departments/treasurer/",        platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Polk",       url:"https://www.polkcountyiowa.gov/treasurer/information-for-tax-sale-buyers/", platform:"GovEase", saleDate2026:"June 16, 2025 (monthly adjourned thru May 2026)", verified:true, note:"⚡ Polk uses GovEase not iowataxauction.com. Monthly adjourned sales year-round."},
  {...IA_STATE_RULES, county:"Pottawattamie",url:"https://www.pottcounty.com/departments/treasurer/",               platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Poweshiek",  url:"https://www.poweshiekcountyiowa.gov/departments/treasurer/",         platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Ringgold",   url:"https://www.ringgoldcountyiowa.gov/departments/treasurer/",          platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Sac",        url:"https://www.saccountyiowa.gov/departments/treasurer/",               platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Scott",      url:"https://www.scottcountyiowa.gov/treasurer/tax-sale",                 platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true, note:"OTC certs forwarded to Planning & Development Tax Deed Program after 2 unsold years"},
  {...IA_STATE_RULES, county:"Shelby",     url:"https://www.shelbycountyiowa.gov/departments/treasurer/",            platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Sioux",      url:"https://www.siouxcountyiowa.org/departments/treasurer/",             platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Story",      url:"https://www.storycountyiowa.gov/departments/treasurer/",             platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Tama",       url:"https://www.tamacountyiowa.gov/departments/treasurer/",              platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Taylor",     url:"https://www.taylorcountyiowa.gov/departments/treasurer/",            platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Union",      url:"https://www.unioncountyiowa.gov/departments/treasurer/",             platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Van Buren",  url:"https://www.vanburen.iowa.gov/departments/treasurer/",               platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Wapello",    url:"https://www.wapellocountyiowa.gov/departments/treasurer/",           platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Warren",     url:"https://www.warrencountyia.gov/departments/treasurer/",              platform:"iowataxauction.com", saleDate2026:"June 14, 2026", verified:true, note:"Reg fee $36. Cannot file 90-day notice before 21 months — enforced."},
  {...IA_STATE_RULES, county:"Washington", url:"https://www.washingtoncountyiowa.gov/departments/treasurer/",        platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Wayne",      url:"https://www.waynecountyiowa.gov/departments/treasurer/",             platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Webster",    url:"https://www.webstercountyiowa.gov/departments/treasurer/",           platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Winnebago",  url:"https://www.winnebagocountyiowa.gov/departments/treasurer/",         platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Winneshiek", url:"https://www.winneshiekcountyiowa.gov/departments/treasurer/",        platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Woodbury",   url:"https://www.woodburycountyiowa.gov/treasurer/tax_sale/",             platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true, note:"Public Bidder parcels — call Board of Supervisors 712-279-6525"},
  {...IA_STATE_RULES, county:"Worth",      url:"https://www.worthcountyiowa.gov/departments/treasurer/",             platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
  {...IA_STATE_RULES, county:"Wright",     url:"https://www.wrightcountyiowa.gov/departments/treasurer/",            platform:"iowataxauction.com", saleDate2026:"June 15, 2026", verified:true},
];

window.COUNTY_DATA['IA_STATE_RULES'] = IA_STATE_RULES;
console.log('IA counties loaded:', window.COUNTY_DATA['IA'].length);
