require('dotenv').config({ path: __dirname + '/.env' });

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { readCSV, writeCSV } = require('./csv-utils');

const NETLIFY_API = 'https://api.netlify.com/api/v1';
const API_KEY = process.env.NETLIFY_API_KEY;

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function parseCityState(address) {
  // "165 Gregson Ave S, Salt Lake City, UT 84115, USA" → { city: 'salt-lake-city', state: 'ut' }
  const parts = (address || '').split(',').map(s => s.trim());
  let city = '';
  let state = '';
  if (parts.length >= 3) {
    const candidate = parts[parts.length - 3];
    if (candidate && !/^\d/.test(candidate)) city = slugify(candidate);
  }
  if (parts.length >= 2) {
    const stateZip = parts[parts.length - 2];
    const match = stateZip.match(/^([A-Z]{2})\b/i);
    if (match) state = match[1].toLowerCase();
  }
  return { city, state };
}

async function netlifyRequest(endpoint, options = {}) {
  const url = `${NETLIFY_API}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Netlify API ${res.status}: ${body}`);
  }
  return res.json();
}

async function findExistingSite(siteName) {
  const url = `${NETLIFY_API}/sites?name=${encodeURIComponent(siteName)}&filter=all`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  });

  if (!res.ok) return null;
  const sites = await res.json();
  return sites.find(s => s.name === siteName) || null;
}

async function tryCreateSite(siteName) {
  const res = await fetch(`${NETLIFY_API}/sites`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: siteName })
  });

  if (res.ok) {
    return { site: await res.json(), status: 'created' };
  }

  if (res.status === 422) {
    const existing = await findExistingSite(siteName);
    if (existing) return { site: existing, status: 'exists' };
    return { site: null, status: 'taken' };
  }

  const body = await res.text();
  throw new Error(`Netlify API ${res.status}: ${body}`);
}

async function createOrGetSite(siteName, address) {
  // Try the base name first
  const first = await tryCreateSite(siteName);
  if (first.site) {
    const label = first.status === 'created' ? 'CREATED' : 'EXISTS';
    console.log(`  ${label}: ${first.site.name}.netlify.app`);
    return first.site;
  }

  // Name taken by another account — retry with city, then state suffix
  const { city, state } = parseCityState(address);
  const suffixes = [];
  if (city) suffixes.push(city);
  if (state) suffixes.push(state);

  for (const suffix of suffixes) {
    const retryName = `${siteName}-${suffix}`.slice(0, 60);
    console.log(`  NAME TAKEN: "${siteName}" — retrying as "${retryName}"...`);
    const retry = await tryCreateSite(retryName);
    if (retry.site) {
      const label = retry.status === 'created' ? 'CREATED' : 'EXISTS';
      console.log(`  ${label}: ${retry.site.name}.netlify.app`);
      return retry.site;
    }
  }

  throw new Error(`Site name "${siteName}" and all fallbacks taken by another account`);
}

async function deploySite(siteId, filePath) {
  const htmlContent = fs.readFileSync(filePath);
  const sha1 = crypto.createHash('sha1').update(htmlContent).digest('hex');

  // Create deploy with file digest
  const deploy = await netlifyRequest(`/sites/${siteId}/deploys`, {
    method: 'POST',
    body: JSON.stringify({
      files: { '/index.html': sha1 }
    })
  });

  // Upload the file
  const uploadUrl = `${NETLIFY_API}/deploys/${deploy.id}/files/index.html`;
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/octet-stream'
    },
    body: htmlContent
  });

  if (!uploadRes.ok) {
    const body = await uploadRes.text();
    throw new Error(`File upload failed ${uploadRes.status}: ${body}`);
  }

  return deploy;
}

const DEPLOY_DELAY_MS = 45000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  if (!API_KEY) {
    console.error('Error: NETLIFY_API_KEY not set. Add it to pipeline/local-biz/.env');
    process.exit(1);
  }

  const rows = readCSV('leads.csv');

  if (rows.length === 0) {
    console.log('No leads found. Run scraper.js and generator.js first.');
    return;
  }

  const columns = Object.keys(rows[0]);
  if (!columns.includes('live_url')) columns.push('live_url');

  let deployed = 0;

  for (const row of rows) {
    if (!row.local_file) {
      console.log(`SKIP: ${row.business_name} (no local_file — run generator.js)`);
      continue;
    }

    if (row.live_url) {
      console.log(`SKIP: ${row.business_name} (already deployed: ${row.live_url})`);
      continue;
    }

    const filePath = path.resolve(__dirname, row.local_file);
    if (!fs.existsSync(filePath)) {
      console.warn(`SKIP: ${row.business_name} — file not found: ${filePath}`);
      continue;
    }

    const siteName = slugify(row.business_name);
    console.log(`Deploying: ${row.business_name} as ${siteName}.netlify.app...`);

    try {
      const site = await createOrGetSite(siteName, row.address);
      await deploySite(site.id, filePath);

      row.live_url = site.ssl_url || `https://${site.name}.netlify.app`;
      deployed++;

      console.log(`  LIVE: ${row.live_url}`);

      // Delay between deploys to avoid Netlify 429 rate limiting
      await sleep(DEPLOY_DELAY_MS);
    } catch (err) {
      console.warn(`  ERROR: ${row.business_name} — ${err.message} — skipping`);
    }
  }

  writeCSV('leads.csv', rows, columns);
  console.log(`\nDeployed ${deployed} sites. leads.csv updated.`);
}

main().catch(err => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});
