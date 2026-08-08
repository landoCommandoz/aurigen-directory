require('dotenv').config({ path: __dirname + '/.env' });

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { readCSV, writeCSV } = require('./csv-utils');

const SITES_DIR = path.join(__dirname, 'sites');

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function buildSiteDir(slug, htmlFile) {
  const tmpDir = path.join(__dirname, '.deploy-tmp', slug);
  fs.mkdirSync(tmpDir, { recursive: true });

  // Copy HTML as index.html
  const htmlPath = path.join(SITES_DIR, htmlFile);
  if (fs.existsSync(htmlPath)) {
    fs.copyFileSync(htmlPath, path.join(tmpDir, 'index.html'));
  }

  // Copy all photos matching this slug
  const allFiles = fs.readdirSync(SITES_DIR);
  for (const file of allFiles) {
    if (file.startsWith(slug + '-') && /\.(jpg|jpeg|png|webp)$/i.test(file)) {
      fs.copyFileSync(path.join(SITES_DIR, file), path.join(tmpDir, file));
    }
  }

  return tmpDir;
}

function cleanupTmpDir(tmpDir) {
  try {
    const files = fs.readdirSync(tmpDir);
    for (const f of files) fs.unlinkSync(path.join(tmpDir, f));
    fs.rmdirSync(tmpDir);
  } catch (_) { /* ignore */ }
}

function deploySurge(siteDir, domain) {
  const env = { ...process.env };
  if (process.env.SURGE_LOGIN) env.SURGE_LOGIN = process.env.SURGE_LOGIN;
  if (process.env.SURGE_TOKEN) env.SURGE_TOKEN = process.env.SURGE_TOKEN;

  execFileSync('npx', ['surge', siteDir, '--domain', domain], {
    cwd: __dirname,
    stdio: 'inherit',
    env
  });

  return `https://${domain}`;
}

async function main() {
  if (!process.env.SURGE_LOGIN || !process.env.SURGE_TOKEN) {
    console.error('Error: SURGE_LOGIN and SURGE_TOKEN not set.');
    console.error('Run these once to get your free credentials:');
    console.error('  npx surge login');
    console.error('  npx surge token');
    console.error('Then add both to your .env file.');
    process.exit(1);
  }

  const rows = readCSV('leads.csv');

  if (rows.length === 0) {
    console.log('No leads found. Run scraper.js and generator.js first.');
    return;
  }

  const columns = Object.keys(rows[0]);
  if (!columns.includes('live_url')) columns.push('live_url');

  fs.mkdirSync(path.join(__dirname, '.deploy-tmp'), { recursive: true });

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
    const domain = `${slug}.surge.sh`;
    console.log(`\nDeploying: ${row.business_name} -> ${domain}...`);

    const siteDir = buildSiteDir(slug, htmlFile);
    const fileCount = fs.readdirSync(siteDir).length;
    console.log(`  FILES: ${fileCount}`);

    try {
      const url = deploySurge(siteDir, domain);
      row.live_url = url;
      deployed++;

      writeCSV('leads.csv', rows, columns);
      console.log(`  LIVE: ${url}`);
    } catch (err) {
      console.warn(`  ERROR: ${row.business_name} — ${err.message} — skipping`);
    } finally {
      cleanupTmpDir(siteDir);
    }
  }

  // Clean up tmp dir
  try { fs.rmdirSync(path.join(__dirname, '.deploy-tmp')); } catch (_) { /* ignore */ }

  writeCSV('leads.csv', rows, columns);
  console.log(`\nDeployed ${deployed} sites. leads.csv updated.`);
}

main().catch(err => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});
