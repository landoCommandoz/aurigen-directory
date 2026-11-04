// Proof that the hand-read path works end to end, and that it cannot be quietly faked.
// Run: node --test foundry/tools/test
//
// Everything here uses the state code "zz", which is not a real jurisdiction and which no ledger
// and no page refers to, so a test run can never leave behind something that looks like a real
// citation for Georgia or Tennessee. The artifacts are deleted again at the end.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { sha256, loadSnapshot, quoteFound } from '../law-text.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const TOOL = path.join(ROOT, 'foundry', 'tools', 'hand-capture.mjs');
const SRC = path.join(ROOT, 'foundry', 'out', 'law-audit', 'sources', 'zz');
const SHOTS = path.join(ROOT, 'foundry', 'out', 'law-audit', 'shots', 'zz');
const ATTEMPTS = path.join(ROOT, 'foundry', 'out', 'law-audit', 'attempts', 'zz.jsonl');
const TMP = path.join(ROOT, 'foundry', 'out', 'law-audit', 'tmp-handtest');

// Stand-in statute text. Long enough to be a real section, and obviously a test.
const STATUTE_TEXT = `TEST CODE SECTION 1-2-3. Sale of property for unpaid taxes.
(a) The tax commissioner shall advertise the sale once a week for four weeks in the newspaper
in which the sheriff's advertisements are published. (b) The defendant in fi. fa. may redeem the
property at any time within twelve months from the date of the sale by paying the redemption
price. (c) No sale under this section shall convey title free of the right of redemption until
that period has run and the right has been foreclosed as provided in this chapter.`;
const QUOTE = 'may redeem the property at any time within twelve months from the date of the sale';

// A small but valid-enough PNG header plus filler, built here rather than committed, so the test
// needs no binary fixture in the repo.
function pngBytes() {
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    Buffer.alloc(6000, 0x5a),
  ]);
}

const run = (args) => execFileSync(process.execPath, [TOOL, ...args], { encoding: 'utf8', cwd: ROOT });
const metaPath = (slug) => path.join(SRC, `${slug}.json`);
const textPath = (slug) => path.join(SRC, `${slug}.txt`);

// Flags as an object, so a test can override or drop exactly one of them without miscounting.
const ARGS = (slug = 'test-1-2-3', over = {}, drop = []) => {
  const o = {
    '--state': 'zz',
    '--slug': slug,
    '--url': 'https://www.example.gov/code/1-2-3',
    '--statute': 'TEST CODE 1-2-3',
    '--text': path.join(TMP, 'statute.txt'),
    '--shot': path.join(TMP, 'shot.png'),
    '--by': 'Landon Brewington',
    ...over,
  };
  for (const d of drop) delete o[d];
  return Object.entries(o).flat();
};

function clean() {
  for (const p of [SRC, SHOTS, TMP]) fs.rmSync(p, { recursive: true, force: true });
  fs.rmSync(ATTEMPTS, { force: true });
}

test.before(() => {
  clean();
  fs.mkdirSync(TMP, { recursive: true });
  fs.writeFileSync(path.join(TMP, 'statute.txt'), STATUTE_TEXT);
  fs.writeFileSync(path.join(TMP, 'shot.png'), pngBytes());
});
test.after(clean);

test('a page read by hand becomes a snapshot the gate can check', () => {
  const out = run(ARGS());
  assert.match(out, /read by hand by Landon Brewington/);

  const snap = loadSnapshot(metaPath('test-1-2-3'));
  assert.equal(snap.ok, true, snap.reason);
  assert.equal(snap.kind, 'hand');
  assert.equal(snap.meta.method, 'hand');
  assert.equal(snap.meta.captured_by, 'Landon Brewington');
  assert.equal(snap.meta.url, 'https://www.example.gov/code/1-2-3');
  assert.ok(snap.meta.captured_at && snap.meta.fetched_at, 'both dates recorded');
  assert.equal(snap.meta.screenshot, 'foundry/out/law-audit/shots/zz/test-1-2-3.png');
  assert.ok(fs.existsSync(path.join(ROOT, snap.meta.screenshot)), 'screenshot saved at the recorded path');

  // The whole point: a quote from the pasted text verifies exactly as a downloaded one would.
  assert.equal(quoteFound(QUOTE, snap.text), true);
  assert.equal(quoteFound('a sentence that is nowhere in the pasted statute text at all', snap.text), false);

  // And the attempt is logged like any other, so the audit trail stays one list, not two.
  const line = JSON.parse(fs.readFileSync(ATTEMPTS, 'utf8').trim().split('\n').pop());
  assert.equal(line.result, 'saved_by_hand');
  assert.equal(line.captured_by, 'Landon Brewington');
});

test('editing the text after the fact breaks the snapshot', () => {
  run(ARGS('tamper-text'));
  const p = textPath('tamper-text');
  fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace('twelve months', 'twenty-four months'));
  const snap = loadSnapshot(metaPath('tamper-text'));
  assert.equal(snap.ok, false);
  assert.match(snap.reason, /hash mismatch/);
});

test('swapping the screenshot breaks the snapshot', () => {
  run(ARGS('tamper-shot'));
  const meta = JSON.parse(fs.readFileSync(metaPath('tamper-shot'), 'utf8'));
  fs.writeFileSync(path.join(ROOT, meta.screenshot), Buffer.alloc(6000, 0x11));
  const snap = loadSnapshot(metaPath('tamper-shot'));
  assert.equal(snap.ok, false);
  assert.match(snap.reason, /screenshot was changed/);
});

test('deleting the screenshot breaks the snapshot', () => {
  run(ARGS('no-shot'));
  const meta = JSON.parse(fs.readFileSync(metaPath('no-shot'), 'utf8'));
  fs.rmSync(path.join(ROOT, meta.screenshot));
  const snap = loadSnapshot(metaPath('no-shot'));
  assert.equal(snap.ok, false);
  assert.match(snap.reason, /screenshot missing/);
});

test('a hand snapshot stripped of its provenance is refused', () => {
  run(ARGS('no-by'));
  const p = metaPath('no-by');
  const meta = JSON.parse(fs.readFileSync(p, 'utf8'));
  delete meta.captured_by;
  fs.writeFileSync(p, JSON.stringify(meta, null, 1) + '\n');
  const snap = loadSnapshot(p);
  assert.equal(snap.ok, false);
  assert.match(snap.reason, /does not name who read the page/);
});

test('a snapshot claiming a tool we do not ship is refused', () => {
  run(ARGS('wrong-tool'));
  const p = metaPath('wrong-tool');
  const meta = JSON.parse(fs.readFileSync(p, 'utf8'));
  meta.tool = 'some/other/script.mjs';
  fs.writeFileSync(p, JSON.stringify(meta, null, 1) + '\n');
  const snap = loadSnapshot(p);
  assert.equal(snap.ok, false);
  assert.match(snap.reason, /not written by fetch-source\.mjs or hand-capture\.mjs/);
});

test('a summary, a stub or page furniture is refused instead of recorded', () => {
  const short = path.join(TMP, 'short.txt');
  fs.writeFileSync(short, 'Georgia sells tax deeds with a twelve month redemption.');
  assert.throws(() => run(ARGS('too-short', { '--text': short })), /fragment or a summary|only \d+ characters/);
  assert.equal(fs.existsSync(metaPath('too-short')), false, 'a summary was not recorded');

  const furniture = path.join(TMP, 'furniture.txt');
  fs.writeFileSync(furniture, STATUTE_TEXT + '\n\nYou need to enable JavaScript to run this app.');
  assert.throws(() => run(ARGS('furniture', { '--text': furniture })), /does not belong in statute text/);
  assert.equal(fs.existsSync(metaPath('furniture')), false, 'page furniture was not recorded');
});

test('the tool refuses to record anything without a name, a URL, a citation, text or a screenshot', () => {
  for (const flag of ['--by', '--url', '--shot', '--statute', '--text']) {
    assert.throws(() => run(ARGS('missing-bits', {}, [flag])), /usage: node foundry\/tools\/hand-capture\.mjs/,
      `missing ${flag} should stop it`);
  }
  assert.equal(fs.existsSync(metaPath('missing-bits')), false, 'nothing was written');
});

test('an http url or a non-image screenshot is refused', () => {
  assert.throws(() => run(ARGS('plain-http', { '--url': 'http://www.example.gov/code/1-2-3' })), /must be the https address/);
  const notAnImage = path.join(TMP, 'shot.bmp');
  fs.writeFileSync(notAnImage, Buffer.alloc(6000, 0x22));
  assert.throws(() => run(ARGS('bad-shot', { '--shot': notAnImage })), /screenshot must be one of/);
});

test('the hashes in the record are the hashes of the files on disk', () => {
  run(ARGS('hash-check'));
  const meta = JSON.parse(fs.readFileSync(metaPath('hash-check'), 'utf8'));
  assert.equal(sha256(fs.readFileSync(textPath('hash-check'), 'utf8')), meta.text_sha256);
  assert.equal(sha256(fs.readFileSync(path.join(ROOT, meta.screenshot))), meta.screenshot_sha256);
});
