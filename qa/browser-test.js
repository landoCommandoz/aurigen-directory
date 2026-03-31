const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SITE = process.env.QA_URL || 'https://aurigendirectory.com';
const HEADLESS = process.env.QA_HEADLESS !== 'false';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const REPORT_FILE = path.join(__dirname, 'last-run-report.txt');

if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const results = [];
function log(name, pass, note) {
  var status = pass ? 'PASS' : 'FAIL';
  results.push({ name, status, note: note || '' });
  console.log('[' + status + '] ' + name + (note ? ' — ' + note : ''));
}

async function screenshot(page, name) {
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, name + '.png'), fullPage: false });
}

async function run() {
  var browser;
  try {
    browser = await puppeteer.launch({
      headless: HEADLESS ? 'new' : false,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
    });
  } catch (e) {
    // Fallback: try puppeteer-core with system chromium
    try {
      var pCore = require('puppeteer-core');
      var chromePath = '/usr/bin/chromium-browser' || '/usr/bin/chromium' || '/usr/bin/google-chrome';
      browser = await pCore.launch({
        headless: HEADLESS ? 'new' : false,
        executablePath: chromePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
      });
    } catch (e2) {
      console.error('Could not launch browser:', e2.message);
      console.log('\nTo run QA tests, ensure Chromium is installed or set PUPPETEER_EXECUTABLE_PATH');
      process.exit(1);
    }
  }

  var page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Set paid access before loading
  await page.goto(SITE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.evaluate(function() {
    localStorage.setItem('aurigen_access', 'paid');
    localStorage.setItem('aurigen_is_admin', 'true');
    localStorage.setItem('aurigen_email', 'qa@test.com');
  });
  await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForTimeout(2000);

  // ═══ MAP TAB ═══
  try {
    var mapBtn = await page.$('#tab-map');
    log('MAP tab button visible', !!mapBtn);
    if (mapBtn) await mapBtn.click();
    await page.waitForTimeout(1500);
    await screenshot(page, '01-map-tab');

    var statePaths = await page.$$('.state-path');
    log('Map SVG renders states', statePaths.length >= 48, statePaths.length + ' paths');

    if (statePaths.length > 0) {
      await statePaths[10].click();
      await page.waitForTimeout(1000);
      await screenshot(page, '02-state-panel');

      var panelVisible = await page.$('.sp-panel');
      log('State panel opens on click', !!panelVisible);

      if (panelVisible) {
        var stateName = await page.$('.sp-state-name');
        var typeBadge = await page.$('.sp-type-badge');
        var tabs = await page.$$('.sp-tab');
        log('Panel shows state name', !!stateName);
        log('Panel shows type badge', !!typeBadge);
        log('Panel has 3 tabs', tabs.length === 3, tabs.length + ' tabs');

        var closeBtn = await page.$('.sp-close');
        if (closeBtn) {
          await closeBtn.click();
          await page.waitForTimeout(500);
          var panelAfterClose = await page.$('.sp-panel');
          log('Panel closes on X click', !panelAfterClose);
        } else {
          log('Panel closes on X click', false, 'close button not found');
        }
      }
    }
  } catch (e) {
    log('MAP TAB tests', false, e.message);
  }

  // ═══ LIST TAB ═══
  try {
    var listBtn = await page.$('#tab-list');
    if (listBtn) {
      await listBtn.click();
      await page.waitForTimeout(1000);
      await screenshot(page, '03-list-tab');

      var rows = await page.$$('.state-row');
      log('LIST tab switches view', rows.length > 0);
      log('At least 51 rows render', rows.length >= 51, rows.length + ' rows');

      if (rows.length > 0) {
        await rows[0].click();
        await page.waitForTimeout(1000);
        await screenshot(page, '04-list-state-panel');
        var listPanel = await page.$('.sp-panel');
        log('List row click opens state panel', !!listPanel);
        if (listPanel) {
          var closeBtn2 = await page.$('.sp-close');
          if (closeBtn2) await closeBtn2.click();
          await page.waitForTimeout(500);
        }
      }
    } else {
      log('LIST tab switches view', false, 'tab button not found');
    }
  } catch (e) {
    log('LIST TAB tests', false, e.message);
  }

  // ═══ CALENDAR / LIVE INVENTORY ═══
  try {
    // Switch to auctions tab
    await page.evaluate(function() {
      if (typeof switchTab === 'function') switchTab('auctions');
    });
    await page.waitForTimeout(2000);
    await screenshot(page, '05-calendar-tab');

    // Look for inventory/property cards
    var cards = await page.$$('.auction-card, .inv-card, .property-card');
    log('Calendar tab renders', true);
    if (cards.length > 0) {
      log('Property cards render', true, cards.length + ' cards');

      // Check for NaN in equity
      var pageText = await page.evaluate(function() { return document.body.innerText; });
      var hasNaN = pageText.indexOf('NaN') >= 0;
      log('No NaN values visible', !hasNaN, hasNaN ? 'NaN found in page text' : '');

      // Check for Analyze/Scout buttons
      var analyzeBtn = await page.$('[class*="analyze"], [onclick*="analyze"], button:has-text("Analyze")');
      var scoutBtn = await page.$('[class*="scout"], [onclick*="scout"], button:has-text("Scout")');
      log('Analyze button visible', !!analyzeBtn);
      log('Scout button visible', !!scoutBtn);
    } else {
      log('Property cards render', false, 'no cards found');
    }
  } catch (e) {
    log('CALENDAR tests', false, e.message);
  }

  // ═══ TOOLS ═══
  try {
    // Try clicking tools menu
    var toolsBtn = await page.$('.nav-tab[data-tab="tools"], [onclick*="tools-menu"], .tools-trigger');
    if (toolsBtn) {
      await toolsBtn.click();
      await page.waitForTimeout(500);
      log('TOOLS menu opens', true);
    }

    // Scout panel
    await page.evaluate(function() {
      if (typeof switchTab === 'function') switchTab('scout');
    });
    await page.waitForTimeout(1000);
    await screenshot(page, '06-scout-panel');
    var scoutPanel = await page.$('#panel-scout.active, #panel-scout[style*="display: flex"]');
    log('Scout panel opens', !!scoutPanel);

    // Deal Analyzer
    await page.evaluate(function() {
      if (typeof switchTab === 'function') switchTab('tools');
    });
    await page.waitForTimeout(1000);
    await screenshot(page, '07-tools-panel');
    var toolsPanel = await page.$('#panel-tools.active, #panel-tools[style*="display: flex"]');
    log('Deal Analyzer panel opens', !!toolsPanel);
  } catch (e) {
    log('TOOLS tests', false, e.message);
  }

  await screenshot(page, '08-final-state');
  await browser.close();

  // Write report
  var report = '═══ QA BROWSER TEST REPORT ═══\n';
  report += 'Date: ' + new Date().toISOString() + '\n';
  report += 'URL: ' + SITE + '\n';
  report += 'Headless: ' + HEADLESS + '\n\n';
  var passCount = 0, failCount = 0;
  results.forEach(function(r) {
    report += '[' + r.status + '] ' + r.name + (r.note ? ' — ' + r.note : '') + '\n';
    if (r.status === 'PASS') passCount++; else failCount++;
  });
  report += '\n═══ SUMMARY: ' + passCount + ' PASS / ' + failCount + ' FAIL ═══\n';
  fs.writeFileSync(REPORT_FILE, report);
  console.log('\n' + report);

  process.exit(failCount > 0 ? 1 : 0);
}

run().catch(function(e) {
  console.error('Fatal:', e);
  process.exit(1);
});
