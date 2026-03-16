#!/usr/bin/env node
// Aurigen Directory — Link Validator (uses curl for reliable gov site checking)

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const statesFile = path.join(__dirname, '..', 'states-en.js');
const src = fs.readFileSync(statesFile, 'utf8');
const STATES_EN = (new Function(src + '; return STATES_EN;'))();

const urls = [];
for (const s of STATES_EN) {
  if (s.auctionSignup && s.auctionSignup.directLink) {
    urls.push({ state: s.id, type: 'directLink', name: s.name, url: s.auctionSignup.directLink });
  }
  if (s.counties) {
    for (const c of s.counties) {
      if (c.link) urls.push({ state: s.id, type: 'county', name: c.name, url: c.link });
    }
  }
}

console.log(`Checking ${urls.length} URLs...\n`);

function checkUrl(url) {
  try {
    const code = execSync(
      `curl -s -o /dev/null -w "%{http_code}" --max-time 10 -L "${url}"`,
      { encoding: 'utf8', timeout: 15000 }
    ).trim();
    const status = parseInt(code, 10);
    return { status, ok: status >= 200 && status < 400 };
  } catch (err) {
    return { status: 0, ok: false, error: 'TIMEOUT/ERROR' };
  }
}

const broken = [];
const valid = [];

for (const entry of urls) {
  const result = checkUrl(entry.url);
  const label = `[${entry.state}] ${entry.type === 'county' ? entry.name + ' County' : 'directLink'}: ${entry.url}`;
  if (result.ok) { valid.push(entry); process.stdout.write('.'); }
  else { broken.push({ ...entry, ...result, label }); process.stdout.write('X'); }
}

console.log('\n');
if (broken.length > 0) {
  console.log(`=== BROKEN LINKS (${broken.length}/${urls.length}) ===\n`);
  for (const b of broken) {
    console.log(`  ${b.label}`);
    console.log(`    Status: ${b.status}${b.error ? ' — ' + b.error : ''}\n`);
  }
}
console.log(`Valid: ${valid.length}  |  Broken: ${broken.length}  |  Total: ${urls.length}`);
process.exit(broken.length > 0 ? 1 : 0);
