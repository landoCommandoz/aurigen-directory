// ═══════════════════════════════════════════════════════════
// ARIZONA — 15 COUNTIES — 100% VERIFIED
// Statute: ARS §42-18101 et seq.
// Type: TAX LIEN
// Rate: 16% max, bid DOWN in 1% increments (0% accepted)
// Redemption: 3 years from purchase date (ARS §42-18152)
// Foreclosure: After 3 years, lien holder may foreclose
// Lien Expiry: 10 years if no action taken
// Sale: February annually — all online
// Primary platform: RealAuction (county-specific subdomains)
// Single Bidder Rule: Enforced statewide — one entity per auction
// Source: Individual county treasurer sites + official 2026 notices
// All 15 counties verified March 2026
// ═══════════════════════════════════════════════════════════

window.COUNTY_DATA = window.COUNTY_DATA || {};
window.COUNTY_DATA['AZ'] = [
  {
    county: "Apache",
    url: "https://www.apachecountyaz.gov/Treasurer",
    auctionUrl: "https://apache.arizonataxsale.com",
    platform: "RealAuction",
    saleDate: "February 18, 2026",
    verified: true,
    note: "Sale Feb 18 2026, 8:00am MST, bidding opens Feb 4"
  },
  {
    county: "Cochise",
    url: "https://www.cochise.az.gov/treasurer",
    auctionUrl: "https://cochise.arizonataxsale.com",
    platform: "RealAuction",
    saleDate: "February 2026",
    verified: true
  },
  {
    county: "Coconino",
    url: "https://www.coconino.az.gov/376/Tax-Liens",
    auctionUrl: "https://coconino.arizonataxsale.com",
    platform: "RealAuction",
    saleDate: "February 10, 2026",
    verified: true,
    note: "Published in AZ Daily Sun Jan 20 2026"
  },
  {
    county: "Gila",
    url: "https://www.gilacountyaz.gov/government/treasurer/tax_lein_sale.php",
    auctionUrl: "https://gila.arizonataxsale.com",
    platform: "RealAuction",
    saleDate: "February 2026",
    verified: true
  },
  {
    county: "Graham",
    url: "https://www.graham.az.gov/362/Tax-Sale-Lien-Guidelines",
    auctionUrl: "https://graham.arizonataxsale.com",
    platform: "RealAuction",
    saleDate: "February 25, 2026",
    verified: true,
    note: "2024 taxes sold Feb 25 2026; foreclosure after 3 yrs"
  },
  {
    county: "Greenlee",
    url: "https://greenlee.az.gov/tax-lien-sale-faq/",
    auctionUrl: "https://greenlee.arizonataxsale.com",
    platform: "RealAuction",
    saleDate: "February 2026",
    verified: true
  },
  {
    county: "La Paz",
    url: "https://lapaztreas.com/tax-lien-sale-1",
    auctionUrl: "https://lapaz.arizonataxsale.com",
    platform: "RealAuction",
    saleDate: "February 25, 2026",
    verified: true,
    note: "List published Feb 11 2026 in Parker Pioneer"
  },
  {
    county: "Maricopa",
    url: "https://treasurer.maricopa.gov/Pages/LoadPage?page=LiensAndResearch",
    auctionUrl: "https://maricopa.arizonataxsale.com",
    platform: "RealAuction",
    saleDate: "February 10, 2026",
    verified: true,
    note: "Bidding opens Jan 16 2026; 10% deposit required; $500 min"
  },
  {
    county: "Mohave",
    url: "https://www.mohave.gov/departments/treasurer/tax-liens/tax-lien-sale/",
    auctionUrl: "https://mohave.arizonataxsale.com",
    platform: "RealAuction",
    saleDate: "February 2026",
    verified: true
  },
  {
    county: "Navajo",
    url: "https://www.navajocountyaz.gov/459/February-Lien-Sale-Instructions",
    auctionUrl: "https://navajo.arizonataxsale.com",
    platform: "RealAuction",
    saleDate: "February 11, 2026",
    verified: true,
    note: "Sale Feb 11 2026 7am MST; bidding opens Feb 3"
  },
  {
    county: "Pima",
    url: "https://www.to.pima.gov/taxLienSale/",
    auctionUrl: "https://pima.arizonataxsale.com",
    platform: "RealAuction",
    saleDate: "February 26, 2026",
    verified: true,
    note: "Registration Feb 2–19 2026; Single Bidder Rule enforced; first batch closes 8am MST"
  },
  {
    county: "Pinal",
    url: "https://www.pinal.gov/780/Tax-Lien-Sale",
    auctionUrl: "https://pinal.arizonataxsale.com",
    platform: "RealAuction",
    saleDate: "February 12, 2026",
    verified: true,
    note: "Sale Feb 12 2026; deposit due via wire/ACH day before"
  },
  {
    county: "Santa Cruz",
    url: "https://www.santacruzcountyaz.gov/317/Treasurer",
    auctionUrl: "https://santacruz.arizonataxsale.com",
    platform: "RealAuction",
    saleDate: "February 10, 2026",
    verified: true,
    note: "Credit/debit card deadline Feb 3 2026; ACH payment only after sale"
  },
  {
    county: "Yavapai",
    url: "https://www.yavapaiaz.gov/Mapping-and-Properties/Property-Taxes/Treasurers-Office/Treasurers-Tax-Lien-Sale",
    auctionUrl: "https://yavapai.arizonataxsale.com",
    platform: "RealAuction",
    saleDate: "February 10, 2026",
    verified: true
  },
  {
    county: "Yuma",
    url: "https://www.yumacountyaz.gov/government/treasurer/tax-lien-information",
    auctionUrl: "https://yuma.arizonataxsale.com",
    platform: "RealAuction",
    saleDate: "February 2026",
    verified: true
  },
];

console.log('AZ counties loaded:', window.COUNTY_DATA['AZ'].length);
