// "publish" in one command: list the Rules Sheet.
//   node launch/publish.mjs           list it
//   node launch/publish.mjs --undo    unlist it again
// This flips `listed` in under-review/sheet-listing.json. Once that file is on main, the Worker (redeployed by
// status-publish.yml) does the rest by itself: the sheet page loses its noindex header and meta tag, and the home page
// footer links to /rules-sheet/. The .github/workflows/publish.yml workflow runs this and also redeploys the showcase with a
// link to the sheet (if the showcase exists), so pressing Run there is the whole job.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'under-review', 'sheet-listing.json');
const cfg = JSON.parse(fs.readFileSync(path.resolve(path.dirname(file), 'sheet-config.json'), 'utf8'));
const undo = process.argv.includes('--undo');
if (!undo && (!cfg.checkoutUrl || !cfg.benefitId)) { console.error('Not publishing: checkout is not connected (under-review/sheet-config.json has no checkout link or benefit id).'); process.exit(1); }
const cur = JSON.parse(fs.readFileSync(file, 'utf8'));
const next = { ...cur, listed: !undo };
fs.writeFileSync(file, JSON.stringify(next, null, 1) + '\n');
console.log(undo ? 'unlisted: /rules-sheet/ is noindex again and not linked' : cur.listed ? 'already listed (nothing changed)' : 'listed: /rules-sheet/ loses noindex and the home page footer links to it');
