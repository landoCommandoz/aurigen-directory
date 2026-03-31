#!/usr/bin/env node
// ============================================================
// AURIGEN SCRAPER — run-puppeteer.js
// Entry point: runs RealAuction + GovEase Puppeteer scrapers
// Usage: node netlify/functions/scraper/run-puppeteer.js
// Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY env vars
// ============================================================

var startTime = Date.now();

console.log('========================================');
console.log('AURIGEN PUPPETEER SCRAPER');
console.log('Started: ' + new Date().toISOString());
console.log('========================================');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('FATAL: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

async function main() {
  var totalFound = 0;
  var totalAdded = 0;
  var totalErrors = 0;

  // ── Step 1: RealAuction (FL + AZ) ──
  console.log('\n=== STEP 1: RealAuction (FL + AZ) ===');
  try {
    var { scrapeRealAuctionPuppeteer } = require('./puppeteer-realauction');
    var raResult = await scrapeRealAuctionPuppeteer();
    console.log('[run] RealAuction: found=' + raResult.found + ' added=' + raResult.added + ' errors=' + raResult.errors);
    totalFound += raResult.found;
    totalAdded += raResult.added;
    totalErrors += raResult.errors;
  } catch (e) {
    console.error('[run] RealAuction FAILED:', e.message);
    totalErrors++;
  }

  // ── Step 2: GovEase (AL + GA) ──
  console.log('\n=== STEP 2: GovEase (AL + GA) ===');
  try {
    var { scrapeGovEasePuppeteer } = require('./puppeteer-govease');
    var geResult = await scrapeGovEasePuppeteer();
    console.log('[run] GovEase: found=' + geResult.found + ' added=' + geResult.added + ' errors=' + geResult.errors);
    totalFound += geResult.found;
    totalAdded += geResult.added;
    totalErrors += geResult.errors;
  } catch (e) {
    console.error('[run] GovEase FAILED:', e.message);
    totalErrors++;
  }

  // ── Summary ──
  var elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n========================================');
  console.log('PUPPETEER SCRAPER COMPLETE');
  console.log('Runtime: ' + elapsed + 's');
  console.log('Total found: ' + totalFound);
  console.log('Total added: ' + totalAdded);
  console.log('Total errors: ' + totalErrors);
  console.log('Finished: ' + new Date().toISOString());
  console.log('========================================');

  if (totalErrors > 0) process.exit(1);
}

main().catch(function(e) {
  console.error('FATAL:', e.message);
  process.exit(1);
});
