// ═══════════════════════════════════════════════════════════
// ILLINOIS — 102 COUNTIES — FULL STRUCTURE v2
// Statute: 35 ILCS 200 (Property Tax Code)
// Type: TAX LIEN
// ═══════════════════════════════════════════════════════════
//
// STATE-LEVEL RULES (apply to all 102 counties):
//
// AUCTION:
//   Statute: 35 ILCS 200/21-150, 200/21-215
//   Sale: Annual — fall (Oct–Jan depending on county)
//   Method: RAMS2 automated — USB drive bids, bid DOWN from 9%
//   Start rate: 9% per 6-month period
//   0% bid: Accepted — earns zero interest
//   Certificate: "Certificate of Purchase"
//
// OTC / FORFEITURE PURCHASE:
//   Statute: 35 ILCS 200/21-225
//   Name: "Forfeiture Sale" / "Over the Counter Forfeiture"
//   Trigger: No bidder at annual sale → lien forfeited to state
//   Process: Buyer applies with County Clerk (not treasurer)
//   Rate: 12% per 6-month period (penalty rate — HIGHER than auction)
//   Note: Buyer must pay ALL delinquent years plus penalties
//   County Clerk sends notice to owner before sale completes
//
// SCAVENGER SALE:
//   Statute: 35 ILCS 200/21-145
//   Name: "Scavenger Sale"
//   Trigger: 3+ years of delinquent taxes — properties not sold at annual
//   Frequency: Optional (law changed 2023 — no longer mandatory every 2 yrs)
//   Cook County: Last Scavenger Sale optional per County Board direction
//   Bid method: Highest bidder (NOT reverse/interest bid)
//   Min bid: $250 or half of total taxes due (whichever is less)
//   Note: Properties with 3+ delinquent years only
//
// SUB-TAX / SUBSEQUENT TAX:
//   Statute: 35 ILCS 200/21-355 (redemption amount includes sub-taxes)
//   Name: "Sub-Tax" / "Subsequent Tax"
//   Available: Certificate holder may pay subsequent years' taxes
//   Effect: Added to certificate, increases redemption amount
//   Note: Sub-tax payments often handled by county collector office
//         or at specific dates (e.g. DuPage accepts after Sept 9 2026)
//
// REDEMPTION:
//   Statute: 35 ILCS 200/21-350, 200/21-355
//   Period: 2.5 years (residential/improved) / 2 years (vacant)
//   Penalty increases every 6 months
//   Redemption amount includes: certificate + penalty + subsequent taxes
//          + costs + petition fees
//   Homestead: Same period as residential (2.5 years)
//   Ag: 2.5 years
//
// TAX DEED PATH (after redemption expires):
//   Statute: 35 ILCS 200/22-5 et seq.
//   Process: Certificate holder petitions circuit court for tax deed
//   Court order required — judge must approve
//   Notice: Published + served to all interested parties
//   Quiet title: Often recommended but not always required
//   ILTaxSale.com: Handles deed petition process for many counties
//
// SURPLUS FUNDS:
//   Illinois does NOT have a traditional surplus funds process
//   at the lien stage. At the deed/scavenger stage:
//   Statute: 35 ILCS 200/21-260
//   Any overbid at scavenger sale goes to county general fund
//   No direct surplus claim process for former owners at lien level
//   Note: Consult attorney — some surplus scenarios exist via court
//
// ═══════════════════════════════════════════════════════════

const IL_STATE_RULES = {
  type: "lien",
  auction: {
    frequency: "Annual",
    saleMonth: "Oct–Jan (varies by county)",
    bidMethod: "RAMS2 automated — bid DOWN from 9% per 6-month period",
    startRate: "9% per 6-month period",
    zeroBid: "Accepted — earns zero interest",
    certificateName: "Certificate of Purchase",
    statute: "35 ILCS 200/21-150, 200/21-215"
  },
  otc: {
    available: true,
    name: "Forfeiture Sale (OTC)",
    rate: "12% per 6-month period (penalty rate)",
    availableWhen: "After annual sale — unsold properties forfeited to state",
    process: "Apply with County Clerk (not treasurer)",
    statute: "35 ILCS 200/21-225",
    note: "Must pay ALL delinquent years + penalties. County Clerk notifies owner."
  },
  scavenger: {
    available: true,
    name: "Scavenger Sale",
    trigger: "3+ years delinquent taxes",
    frequency: "Optional — no longer mandatory every 2 years (law changed 2023)",
    bidMethod: "Highest bidder (NOT interest rate bid-down)",
    minBid: "$250 or half of total taxes due",
    statute: "35 ILCS 200/21-145",
    note: "Cook County: Scavenger Sale at Board direction only"
  },
  subTax: {
    available: true,
    name: "Sub-Tax / Subsequent Tax",
    statute: "35 ILCS 200/21-355",
    note: "Certificate holder pays future delinquent years — added to certificate and redemption amount"
  },
  redemption: {
    period: "2.5 years (residential/improved) | 2 years (vacant)",
    statute: "35 ILCS 200/21-350",
    homesteadDifferent: false,
    agDifferent: false,
    note: "Penalty increases every 6 months. Includes sub-taxes, costs, petition fees."
  },
  deedPath: {
    name: "Tax Deed Petition",
    process: "Certificate holder petitions Circuit Court — judge must approve",
    statute: "35 ILCS 200/22-5 et seq.",
    quietTitleRequired: false,
    quietTitleRecommended: true,
    note: "ILTaxSale.com handles deed petitions for many counties"
  },
  surplus: {
    available: false,
    name: "No standard surplus process at lien level",
    statute: "35 ILCS 200/21-260",
    note: "Overbid at scavenger sale goes to county general fund. Consult attorney for edge cases."
  },
  results: {
    lastSaleUrl: null,
    avgRateBid: null,
    totalLiensSold: null,
    totalValue: null
  }
};

window.COUNTY_DATA = window.COUNTY_DATA || {};
window.COUNTY_DATA['IL'] = [
  {county:"Adams",        auction:{url:"https://www.adamscountyil.gov/government/departments/treasurer/tax-sale",         platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Alexander",    auction:{url:"https://www.alexandercountyil.org/departments/treasurer/",                         platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Bond",         auction:{url:"https://bondcountyil.gov/treasurer/tax-sale-information/",                         platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Boone",        auction:{url:"https://www.boonecountyil.gov/government/departments/clerk___recorder/tax_reports_and_delinquent_taxes.php", platform:"RAMS2"}, ...IL_STATE_RULES, verified:true},
  {county:"Brown",        auction:{url:"https://www.browncoil.org/departments/treasurer/",                                 platform:"RAMS2"},    ...IL_STATE_RULES, verified:false, note:"[VERIFY] domain"},
  {county:"Bureau",       auction:{url:"https://bureaucounty-il.gov/directory/treasurers-office/",                        platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Calhoun",      auction:{url:"https://www.calhouncountyil.gov/departments/treasurer/",                           platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Carroll",      auction:{url:"https://www.carrollcountyil.gov/county_departments/treasurer.php",                 platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Cass",         auction:{url:"https://www.cassco.org/treasurer/",                                                platform:"RAMS2"},    ...IL_STATE_RULES, verified:false, note:"[VERIFY] domain"},
  {county:"Champaign",    auction:{url:"https://www.champaigncountyil.gov/treasurer/",                                     platform:"RAMS2"},    ...IL_STATE_RULES, verified:true,  note:"Sale Oct 31 annually"},
  {county:"Christian",    auction:{url:"https://www.christiancountyil.com/departments/treasurer/",                         platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Clark",        auction:{url:"https://clarkcounty.illinois.gov/departments/treasurer/",                          platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Clay",         auction:{url:"https://claycounty.illinois.gov/departments/treasurer/",                           platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Clinton",      auction:{url:"https://clintonco.illinois.gov/county-offices/treasurer/",                         platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Coles",        auction:{url:"https://www.co.coles.il.us/Treasurer/",                                           platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Cook",         auction:{url:"https://www.cookcountytreasurer.com/taxsalegeneralinformation.aspx",               platform:"RAMS2"},    ...IL_STATE_RULES, verified:true,  alert:"⚡ Annual sale delayed to Dec 2026 (PA 104-0460)", scavenger:{...IL_STATE_RULES.scavenger, note:"Cook: Scavenger Sale optional per County Board only"}},
  {county:"Crawford",     auction:{url:"https://crawfordcountyil.org/treasurer/",                                          platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Cumberland",   auction:{url:"https://www.cumberlandco.org/departments/treasurer/",                              platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"DeKalb",       auction:{url:"https://dekalbcounty.org/departments/treasurer-collector/frequently-asked-questions/delinquent-tax-sale-information/", platform:"RAMS2"}, ...IL_STATE_RULES, verified:true},
  {county:"DeWitt",       auction:{url:"https://www.dewittcountyil.gov/departments/treasurer.php",                         platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Douglas",      auction:{url:"https://www.douglascountyil.gov/treasurer/tax-sale-calendar-taxbuyers/tax-sale-registration-information", platform:"RAMS1"}, ...IL_STATE_RULES, verified:true, note:"Uses RAMS I (not RAMS2)"},
  {county:"DuPage",       auction:{url:"https://www.dupagecounty.gov/elected_officials/treasurer/tax_sale_information.php", platform:"RAMS2"},   ...IL_STATE_RULES, verified:true,  alert:"⚡ 2026 sale Nov 19-20; cost $104/parcel", subTax:{...IL_STATE_RULES.subTax, note:"Sub-tax accepted after Sept 9 2026"}},
  {county:"Edgar",        auction:{url:"https://www.edgarcountyillinois.gov/departments/treasurer/",                       platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Edwards",      auction:{url:"https://edwardscounty.illinois.gov/departments/treasurer/",                        platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Effingham",    auction:{url:"https://www.co.effingham.il.us/departments/treasurer/",                            platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Fayette",      auction:{url:"https://www.fayettecountyillinois.gov/county-offices/county-treasurer/",           platform:"RAMS2"},    ...IL_STATE_RULES, verified:true,  note:"2025 sale Dec 3"},
  {county:"Ford",         auction:{url:"https://fordcounty.illinois.gov/treasurer/",                                       platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Franklin",     auction:{url:"https://www.franklincountyil.org/departments/treasurer/",                          platform:"ILTaxSale"},...IL_STATE_RULES, verified:true},
  {county:"Fulton",       auction:{url:"https://www.fultonco.org/fulton-county-treasurer/",                                platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Gallatin",     auction:{url:"https://gallatin.illinois.gov/departments/treasurer/",                             platform:"RAMS2"},    ...IL_STATE_RULES, verified:false, note:"[VERIFY] — treasurer uses personal Gmail"},
  {county:"Greene",       auction:{url:"https://greenecountyil.org/departments/treasurer/",                                platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Grundy",       auction:{url:"https://www.grundycountyil.gov/departments/treasurer/",                            platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Hamilton",     auction:{url:"https://www.hamiltoncountyil.gov/departments/treasurer/",                          platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Hancock",      auction:{url:"https://www.hancockcounty-il.gov/departments/treasurer/",                          platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Hardin",       auction:{url:"https://www.hardincountyil.gov/departments/treasurer/",                            platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Henderson",    auction:{url:"https://www.hendersoncountyil.gov/departments/treasurer/",                         platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Henry",        auction:{url:"https://www.henrycty.com/departments/treasurer/",                                  platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Iroquois",     auction:{url:"https://www.iroquiscountyil.gov/departments/treasurer/",                           platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Jackson",      auction:{url:"https://www.jacksoncounty-il.gov/departments/treasurer/",                          platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Jasper",       auction:{url:"https://jaspercounty.illinois.gov/departments/treasurer/",                         platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Jefferson",    auction:{url:"https://jeffersoncounty.illinois.gov/services/treasurercollector/annual_tax_auctions.php", platform:"ILTaxSale"}, ...IL_STATE_RULES, verified:true, alert:"⚡ Single Bidder Rule effective Jan 2026"},
  {county:"Jersey",       auction:{url:"https://www.jerseycounty-il.gov/departments/treasurer/",                           platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"JoDaviess",    auction:{url:"https://www.jodaviesscountyil.gov/departments/treasurer/",                         platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Johnson",      auction:{url:"https://johnsonco.illinois.gov/departments/treasurer/",                            platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Kane",         auction:{url:"https://www.countyofkane.org/Treasurer/Pages/TaxSale.aspx",                       platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Kankakee",     auction:{url:"https://www.kankakeecounty.org/treasurer/",                                        platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Kendall",      auction:{url:"https://www.kendallcountyil.gov/offices/treasurer/annual-tax-sale",               platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Knox",         auction:{url:"https://www.knoxcountyil.gov/departments/county_treasurer/real_estate_taxes/tax_sale_info.php", platform:"RAMS2"}, ...IL_STATE_RULES, verified:true},
  {county:"Lake",         auction:{url:"https://www.lakecountyil.gov/200/Tax-Sales",                                       platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"LaSalle",      auction:{url:"https://www.lasallecountyil.gov/departments/treasurer/",                           platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Lawrence",     auction:{url:"https://www.lawrencecountyil.com/departments/treasurer/",                          platform:"RAMS2"},    ...IL_STATE_RULES, verified:false, note:"[VERIFY] — Yahoo email on record"},
  {county:"Lee",          auction:{url:"https://www.countyoflee.org/departments/treasurer/",                               platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Livingston",   auction:{url:"https://www.livingstoncountyil.gov/department/treasurer/sealed_bid_auction.php",   platform:"ILTaxSale"},...IL_STATE_RULES, verified:true},
  {county:"Logan",        auction:{url:"https://www.logancountyil.gov/index.php?option=com_content&view=article&id=165",  platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Macon",        auction:{url:"https://maconcounty.illinois.gov/departments/treasurer/",                          platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Macoupin",     auction:{url:"https://macoupincountyil.gov/ova_sev/county-treasurer/",                           platform:"RAMS2"},    ...IL_STATE_RULES, verified:true,  alert:"⚡ 2026 sale Jan 12 2026"},
  {county:"Madison",      auction:{url:"https://www.madisoncountyil.gov/treasurer/tax_sale.php",                           platform:"ILTaxSale"},...IL_STATE_RULES, verified:true,  alert:"⚡ 2026 sale Feb 17 2026"},
  {county:"Marion",       auction:{url:"https://marionco.illinois.gov/departments/treasurer/",                             platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Marshall",     auction:{url:"https://www.marshallcountyillinois.gov/departments/treasurer/",                    platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Mason",        auction:{url:"https://www.masoncountyil.gov/departments/treasurer/",                             platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Massac",       auction:{url:"https://massaccountyil.gov/departments/treasurer/",                                platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"McDonough",    auction:{url:"https://www.mcdonoughcountyillinois.com/departments/treasurer/",                   platform:"RAMS2"},    ...IL_STATE_RULES, verified:false, note:"[VERIFY] domain"},
  {county:"McHenry",      auction:{url:"https://www.mchenrycountyil.gov/departments/treasurer/your-property-taxes/tax-sale", platform:"RAMS2"}, ...IL_STATE_RULES, verified:true},
  {county:"McLean",       auction:{url:"https://www.mcleancountyil.gov/401/Annual-Tax-Sale",                               platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Menard",       auction:{url:"https://www.menardcountyil.gov/departments/treasurer/",                            platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Mercer",       auction:{url:"https://www.mercercountyil.org/departments/treasurer/",                            platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Monroe",       auction:{url:"https://www.monroecountyil.gov/departments/treasurer/",                            platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Montgomery",   auction:{url:"https://www.montgomerycountyil.gov/departments/treasurer/",                        platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Morgan",       auction:{url:"https://www.morgancounty-il.com/departments/treasurer/",                           platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Moultrie",     auction:{url:"https://www.moultriecountyil.gov/departments/treasurer/",                          platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Ogle",         auction:{url:"https://www.oglecountyil.gov/departments/treasurer/",                              platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Peoria",       auction:{url:"https://www.peoriacounty.gov/367/Delinquent-Tax-Information",                      platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Perry",        auction:{url:"https://www.perrycountyil.gov/departments/treasurer/",                             platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Piatt",        auction:{url:"https://www.piattco.org/departments/treasurer/",                                   platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Pike",         auction:{url:"https://www.pikecountyil.org/departments/treasurer/",                              platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Pope",         auction:{url:"https://popeco.illinois.gov/departments/treasurer/",                               platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Pulaski",      auction:{url:"https://www.pulaskicountyil.gov/departments/treasurer/",                           platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Putnam",       auction:{url:"https://www.putnamil.gov/departments/treasurer/",                                  platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Randolph",     auction:{url:"https://www.randolphcountyil.org/departments/treasurer/",                          platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Richland",     auction:{url:"https://richlandcounty.illinois.gov/departments/treasurer/",                       platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Rock Island",  auction:{url:"https://www.rockislandcountyil.gov/departments/treasurer/",                        platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Saline",       auction:{url:"https://salinecounty.illinois.gov/departments/treasurer/",                         platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Sangamon",     auction:{url:"https://sangamonil.gov/departments/s-z/treasurer/annual-tax-sale",                 platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Schuyler",     auction:{url:"https://www.schuylercounty.org/departments/treasurer/",                            platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Scott",        auction:{url:"https://www.scottcoil.gov/departments/treasurer/",                                 platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Shelby",       auction:{url:"https://www.shelbycounty-il.gov/departments/treasurer/",                           platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"St. Clair",    auction:{url:"https://www.co.st-clair.il.us/departments/treasurer/tax-sale",                     platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Stark",        auction:{url:"https://starkco.illinois.gov/departments/treasurer/",                              platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Stephenson",   auction:{url:"https://stephensoncountyil.gov/government/treasurer-collector/tax_sales.php",      platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Tazewell",     auction:{url:"https://www.tazewell-il.gov/Treasurer/",                                           platform:"ILTaxSale"},...IL_STATE_RULES, verified:true},
  {county:"Union",        auction:{url:"https://www.unioncountyil.gov/departments/treasurer/",                             platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Vermilion",    auction:{url:"https://www.vercounty.org/treasurer/tax-sale-information/",                        platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Wabash",       auction:{url:"https://www.wabashcountyil.gov/departments/treasurer/",                            platform:"RAMS2"},    ...IL_STATE_RULES, verified:false, note:"[VERIFY] — Yahoo email on record"},
  {county:"Warren",       auction:{url:"https://www.warrencountyil.gov/departments/treasurer/",                            platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Washington",   auction:{url:"https://washingtonco.illinois.gov/departments/treasurer/",                         platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Wayne",        auction:{url:"https://www.waynecountyil.gov/departments/treasurer/",                             platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"White",        auction:{url:"https://whitecounty-il.gov/departments/treasurer/",                                platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Whiteside",    auction:{url:"https://www.whiteside.org/departments/treasurer/",                                  platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Will",         auction:{url:"https://www.willcountyillinois.com/treasurer/",                                     platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Williamson",   auction:{url:"https://www.williamsoncountyil.gov/departments/treasurer/",                        platform:"ILTaxSale"},...IL_STATE_RULES, verified:true},
  {county:"Winnebago",    auction:{url:"https://www.treasurer.wincoil.gov/",                                               platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
  {county:"Woodford",     auction:{url:"https://www.woodfordcountyil.gov/departments/treasurer/",                          platform:"RAMS2"},    ...IL_STATE_RULES, verified:true},
];

window.COUNTY_DATA['IL_STATE_RULES'] = IL_STATE_RULES;
console.log('IL counties loaded:', window.COUNTY_DATA['IL'].length);
