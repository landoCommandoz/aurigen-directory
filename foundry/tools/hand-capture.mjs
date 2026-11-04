#!/usr/bin/env node
// Records one official statute page that no machine here can download, read by hand instead.
//
// Georgia and Tennessee serve their codes only to a browser running JavaScript, so
// fetch-source.mjs gets back one character and the audit cannot support a single claim about
// them. This tool is the way in: a person opens the official page, copies the statute text,
// and pastes it here along with a screenshot of the page it came from.
//
//   node foundry/tools/hand-capture.mjs \
//     --state ga --slug ocga-48-4-40 \
//     --url https://www.lexisnexis.com/hottopics/gacode/ \
//     --statute "O.C.G.A. 48-4-40" \
//     --text  path/to/pasted-statute.txt \
//     --shot  path/to/screenshot.png \
//     --by    "Landon Brewington"
//
// It writes the same snapshot layout fetch-source.mjs writes, so the quote check, the hash
// check and the gate all work on it unchanged:
//   foundry/out/law-audit/sources/<st>/<slug>.txt            the pasted text, normalized
//   foundry/out/law-audit/sources/<st>/<slug>.json           provenance, including both hashes
//   foundry/out/law-audit/shots/<st>/<slug>.<ext>            the screenshot, committed
//   foundry/out/law-audit/attempts/<st>.jsonl                one line, same as a download
//
// What it does NOT do: judge the text. It cannot tell a statute from a summary, so the person
// pasting is the evidence, which is exactly why their name and a picture of the page go in the
// record and onto the site. Paste the statute itself, never a search result, never a summary,
// never an AI answer. A claim resting on this snapshot is marked on the public page as read by
// hand, with who read it and when.
//
// Exit codes: 0 saved, 1 bad usage, 2 the text is not usable, 3 the screenshot is not usable.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256, normalizeText } from './law-text.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = path.join(ROOT, 'foundry', 'out', 'law-audit');
const TOOL = 'foundry/tools/hand-capture.mjs';
const SHOT_TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.pdf': 'application/pdf' };
const MIN_CHARS = 200;

const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  const k = String(process.argv[i] || '').replace(/^--/, '');
  args[k] = process.argv[i + 1];
}
const { state: st, slug, url, statute, text: textPath, shot: shotPath, by } = args;

const usage = (msg) => {
  console.error(`${msg}\n\nusage: node foundry/tools/hand-capture.mjs --state <2 letters> --slug <a-z0-9-> \\\n`
    + `         --url <official https url> --statute "<citation>" \\\n`
    + `         --text <file with the pasted statute text> --shot <screenshot file> --by "<your name>"`);
  process.exit(1);
};
if (!/^[a-z]{2}$/.test(st || '')) usage('--state must be two lowercase letters, such as ga');
if (!/^[a-z0-9][a-z0-9-]{0,80}$/.test(slug || '')) usage('--slug must be lowercase letters, digits and hyphens');
if (!/^https:\/\/[^\s]+$/.test(url || '')) usage('--url must be the https address of the official page you read');
if (!String(statute || '').trim()) usage('--statute must be the citation the text is, such as "O.C.G.A. 48-4-40"');
if (!String(by || '').trim()) usage('--by must be the name of the person who read the page');
if (!textPath || !fs.existsSync(textPath)) usage('--text must point at a file holding the text you pasted');
if (!shotPath || !fs.existsSync(shotPath)) usage('--shot must point at a screenshot of the page you read');

// The text. Normalized the same way a download is, so quoteFound behaves identically.
const pasted = fs.readFileSync(textPath, 'utf8');
const text = normalizeText(pasted) + '\n';
if (text.trim().length < MIN_CHARS) {
  console.error(`the pasted text is only ${text.trim().length} characters. A statute section is longer than that;`
    + ` this looks like a fragment or a summary. Paste the section itself.`);
  process.exit(2);
}
// A cheap guard against pasting a search page or an AI answer rather than law.
const looksLikeProse = /\b(as an ai|i cannot|search results|cookies|enable javascript|sign in to continue)\b/i.exec(text);
if (looksLikeProse) {
  console.error(`the pasted text contains "${looksLikeProse[0]}", which does not belong in statute text.`
    + ` Paste the statute from the official page, not the page furniture or an answer about it.`);
  process.exit(2);
}

// The screenshot. Committed, hashed, and named in the record, so the claim can be checked later.
const shotExt = path.extname(shotPath).toLowerCase();
if (!SHOT_TYPES[shotExt]) {
  console.error(`screenshot must be one of ${Object.keys(SHOT_TYPES).join(', ')} (got "${shotExt || 'no extension'}")`);
  process.exit(3);
}
const shotBytes = fs.readFileSync(shotPath);
if (shotBytes.length < 5000) {
  console.error(`the screenshot is only ${shotBytes.length} bytes, too small to show a page. Capture the whole window.`);
  process.exit(3);
}

const now = new Date().toISOString();
const shotDir = path.join(OUT, 'shots', st);
const srcDir = path.join(OUT, 'sources', st);
fs.mkdirSync(shotDir, { recursive: true });
fs.mkdirSync(srcDir, { recursive: true });
const shotRel = `foundry/out/law-audit/shots/${st}/${slug}${shotExt}`;
fs.writeFileSync(path.join(ROOT, shotRel), shotBytes);

const meta = {
  tool: TOOL,
  method: 'hand',
  state: st,
  slug,
  url,
  final_url: url,
  statute: String(statute).trim(),
  // fetched_at is the same field a download writes, so the gate's date check needs no special case.
  fetched_at: now,
  captured_at: now,
  captured_by: String(by).trim(),
  captured_from: textPath,
  extractor: 'pasted by hand, normalized by foundry/tools/law-text.mjs normalizeText',
  text_sha256: sha256(text),
  text_chars: text.length,
  screenshot: shotRel,
  screenshot_sha256: sha256(shotBytes),
  screenshot_bytes: shotBytes.length,
  screenshot_type: SHOT_TYPES[shotExt],
  note: 'Read by hand because this state serves its code only to a browser running JavaScript. '
    + 'The person named in captured_by read the page at url and pasted the text; the screenshot is '
    + 'a picture of that page. The public page says so on every claim that rests on this snapshot.',
};
fs.writeFileSync(path.join(srcDir, `${slug}.txt`), text);
fs.writeFileSync(path.join(srcDir, `${slug}.json`), JSON.stringify(meta, null, 1) + '\n');

const attempts = path.join(OUT, 'attempts', `${st}.jsonl`);
fs.mkdirSync(path.dirname(attempts), { recursive: true });
fs.appendFileSync(attempts, JSON.stringify({
  at: now, slug, url, result: 'saved_by_hand', captured_by: meta.captured_by, text_sha256: meta.text_sha256,
}) + '\n');

console.log(`saved foundry/out/law-audit/sources/${st}/${slug}.txt (${text.length} chars, read by hand by ${meta.captured_by})`);
console.log(`saved ${shotRel} (${shotBytes.length} bytes)`);
console.log(`\nNext: a ledger claim using this snapshot must also carry`);
console.log(`  "readBy": ${JSON.stringify(meta.captured_by)},`);
console.log(`  "readAt": ${JSON.stringify(now.slice(0, 10))}`);
console.log(`or cloudflare/scripts/check-law.mjs will refuse it. That is what puts "read by hand" on the page.`);
