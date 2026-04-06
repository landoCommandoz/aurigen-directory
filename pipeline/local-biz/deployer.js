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

async function createSite(siteName) {
  return netlifyRequest('/sites', {
    method: 'POST',
    body: JSON.stringify({ name: siteName })
  });
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
      const site = await createSite(siteName);
      await deploySite(site.id, filePath);

      row.live_url = site.ssl_url || `https://${site.name}.netlify.app`;
      deployed++;

      console.log(`  LIVE: ${row.live_url}`);
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
