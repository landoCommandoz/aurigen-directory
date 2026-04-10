require('dotenv').config({ path: __dirname + '/.env' });

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { readCSV, writeCSV } = require('./csv-utils');

const NETLIFY_API = 'https://api.netlify.com/api/v1';
const API_KEY = process.env.NETLIFY_API_KEY;
const SITES_DIR = path.join(__dirname, 'sites');

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function sha1(buffer) {
  return crypto.createHash('sha1').update(buffer).digest('hex');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// NETLIFY API
// ---------------------------------------------------------------------------

async function findExistingSite(siteName) {
  const url = `${NETLIFY_API}/sites?name=${encodeURIComponent(siteName)}&filter=all`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  });

  if (!res.ok) return null;
  const sites = await res.json();
  return sites.find(s => s.name === siteName) || null;
}

async function createOrGetSite(siteName) {
  const res = await fetch(`${NETLIFY_API}/sites`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: siteName })
  });

  if (res.ok) {
    const site = await res.json();
    console.log(`  CREATED: ${siteName}.netlify.app`);
    return site;
  }

  // 422 means the name is already taken
  if (res.status === 422) {
    const existing = await findExistingSite(siteName);
    if (existing) {
      console.log(`  EXISTS: ${siteName}.netlify.app, updating...`);
      return existing;
    }
    throw new Error(`Site name "${siteName}" is taken by another account`);
  }

  const body = await res.text();
  throw new Error(`Netlify API ${res.status}: ${body}`);
}

// ---------------------------------------------------------------------------
// MULTI-FILE DEPLOY (HTML + photos)
// ---------------------------------------------------------------------------

function collectDeployFiles(slug, htmlFile) {
  const files = [];

  // The HTML file becomes /index.html on the deployed site
  const htmlPath = path.join(SITES_DIR, htmlFile);
  if (fs.existsSync(htmlPath)) {
    const content = fs.readFileSync(htmlPath);
    files.push({ remotePath: '/index.html', localPath: htmlPath, content });
  }

  // Find all photos matching this slug: {slug}-1.jpg, {slug}-2.jpg, etc.
  const allFiles = fs.readdirSync(SITES_DIR);
  for (const file of allFiles) {
    if (file.startsWith(slug + '-') && /\.(jpg|jpeg|png|webp)$/i.test(file)) {
      const filePath = path.join(SITES_DIR, file);
      const content = fs.readFileSync(filePath);
      files.push({ remotePath: '/' + file, localPath: filePath, content });
    }
  }

  return files;
}

async function deploySite(siteId, slug, htmlFile) {
  const files = collectDeployFiles(slug, htmlFile);

  if (files.length === 0) {
    throw new Error('No files to deploy');
  }

  // Build digest map: { '/index.html': sha1, '/slug-1.jpg': sha1, ... }
  const digest = {};
  for (const f of files) {
    digest[f.remotePath] = sha1(f.content);
  }

  console.log(`  FILES: ${files.length} (${files.map(f => f.remotePath).join(', ')})`);

  // Create deploy with file digest
  const deployRes = await fetch(`${NETLIFY_API}/sites/${siteId}/deploys`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ files: digest })
  });

  if (!deployRes.ok) {
    const body = await deployRes.text();
    throw new Error(`Deploy create failed ${deployRes.status}: ${body}`);
  }

  const deploy = await deployRes.json();

  // Upload only the files Netlify says it needs
  const required = new Set(deploy.required || []);

  for (const f of files) {
    const fileHash = digest[f.remotePath];
    if (required.size > 0 && !required.has(fileHash)) {
      console.log(`    CACHED: ${f.remotePath}`);
      continue;
    }

    const uploadPath = f.remotePath.replace(/^\//, '');
    const contentType = uploadPath.endsWith('.html') ? 'text/html'
      : uploadPath.endsWith('.jpg') || uploadPath.endsWith('.jpeg') ? 'image/jpeg'
      : uploadPath.endsWith('.png') ? 'image/png'
      : uploadPath.endsWith('.webp') ? 'image/webp'
      : 'application/octet-stream';

    const uploadRes = await fetch(`${NETLIFY_API}/deploys/${deploy.id}/files/${uploadPath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': contentType
      },
      body: f.content
    });

    if (!uploadRes.ok) {
      const body = await uploadRes.text();
      throw new Error(`Upload failed for ${f.remotePath}: ${uploadRes.status} ${body}`);
    }

    console.log(`    UPLOADED: ${f.remotePath} (${Math.round(f.content.length / 1024)}KB)`);
  }

  return deploy;
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

const DEPLOY_DELAY_MS = 30000;

async function main() {
  if (!API_KEY) {
    console.error('Error: NETLIFY_API_KEY not set. Add it to .env');
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
      console.log(`SKIP: ${row.business_name} (no local_file, run generator.js)`);
      continue;
    }

    if (row.live_url) {
      console.log(`SKIP: ${row.business_name} (already deployed: ${row.live_url})`);
      continue;
    }

    const htmlFile = path.basename(row.local_file);
    const htmlPath = path.join(SITES_DIR, htmlFile);
    if (!fs.existsSync(htmlPath)) {
      console.warn(`SKIP: ${row.business_name} — file not found: ${htmlPath}`);
      continue;
    }

    const slug = slugify(row.business_name);
    console.log(`\nDeploying: ${row.business_name} as ${slug}.netlify.app...`);

    try {
      const site = await createOrGetSite(slug);
      await deploySite(site.id, slug, htmlFile);

      row.live_url = site.ssl_url || `https://${site.name}.netlify.app`;
      deployed++;

      // Write CSV after each deploy for crash resilience
      writeCSV('leads.csv', rows, columns);
      console.log(`  LIVE: ${row.live_url}`);

      // Delay between deploys to avoid Netlify rate limiting
      if (deployed < rows.length) {
        console.log(`  Waiting ${DEPLOY_DELAY_MS / 1000}s before next deploy...`);
        await sleep(DEPLOY_DELAY_MS);
      }
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
