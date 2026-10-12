// @vitest-environment node
/**
 * Phase 2 content audit: a sample of 87 numbers across lessons (Levels 0 to 4 and the Levels 5 to 8
 * outlines), SOPs, Quick Cards, Fix It, quizzes, flashcards, and drills, each checked against the
 * knowledge base or the fact-checker's verification log (or BLUEPRINT section 12 for a default Lando accepted). Owner: qa-adversary.
 *
 * Each row: the item, the words with the number as the item says them, the source file, and the
 * words with the same number as the source says them. The test proves both are there and that the
 * number is the same; the run prints the table with each line's status for the QA report.
 * Numbers in quiz scenarios (a reading of 94, a 2021 SUV) are inputs, not facts, and are not sampled.
 */
import { describe, expect, it } from 'vitest';
import { allStrings, items, readText, units } from '../fixtures/contentAudit';

type Source = 'kb' | 'log' | 'blueprint';
const SOURCES: Record<Source, string> = {
  kb: readText('knowledge/KNOWLEDGE_BASE.md'),
  log: readText('knowledge/verification-log.md'),
  blueprint: readText('docs/BLUEPRINT.md'),
};

const SAMPLE: ReadonlyArray<readonly [string, string, Source, string]> = [
  // Lessons
  ['lesson-l0-01-rules-that-never-bend', 'until 25 cars are logged', 'kb', 'until 25 cars are logged'],
  ['lesson-l0-02-stay-safe', 'at least 30 seconds', 'log', 'run 30 seconds off the car'],
  ['lesson-l0-04-how-paint-works', '100 to 180 µm', 'kb', 'about 100 to 180 µm'],
  ['lesson-l0-04-how-paint-works', '35 to 50 µm (1.5 to 2 mils)', 'log', '1.5 to 2.0 mils (35 to 50 microns)'],
  ['lesson-l0-06-shop-setup', '1 hour in warm soapy water', 'kb', 'soak 1 hour in warm soapy water'],
  ['lesson-l1-01-wheels-first', '30 seconds', 'log', '30 seconds, not about a minute'],
  ['lesson-l1-03-towel-wash', '16 microfiber towels in quarters', 'kb', '16 microfiber towels in the bucket, one per panel, folded in quarters'],
  ['lesson-l1-04-hard-water-drying', 'Rinse, dry, and jambs, 20 min', 'kb', 'rinse/dry/jambs 20'],
  ['lesson-l2-05-glass', 'Glass towels per full detail: 4', 'kb', 'glass 4'],
  ['lesson-l2-06-full-interior', 'Sedan $150, SUV or truck $180', 'kb', '| Interior Only | $150 | $180 |'],
  ['lesson-l3-03-thickness-bands', '100 µm or more', 'kb', '| 100 µm or more | Full ladder permitted'],
  ['lesson-l3-02-tc100-gauge', '4 to 6 mils (100 to 150 µm)', 'log', 'about 4 to 6 mils (100 to 150 µm), highest on the hood (forum)'],
  // SOPs
  ['sop-clay', '2 x 2 ft', 'kb', 'Work 2 x 2 ft sections'],
  ['sop-measure', 'about 220 µm or more', 'kb', '(about 220+)'],
  ['sop-measure-tesla', 'More than 40 µm below the median', 'blueprint', 'more than 40 µm below the median of the other measured panels'],
  ['sop-polish', 'speed 1 to 2', 'kb', 'Spread on speed 1 to 2'],
  ['sop-polish', '4 to 6 sets', 'kb', '4 to 6 sets per square'],
  ['sop-polish-tesla', '3 drops', 'kb', '3 drops worked into the face'],
  ['sop-setup', '15 minutes', 'kb', 'Setup target time: 15 minutes'],
  ['sop-test-spot', 'under 100 µm', 'kb', 'reads 100 µm or more'],
  ['sop-wheels-tesla', 'Let it work 30 seconds', 'log', 'Allow the foam to penetrate for 30 seconds'],
  ['sop-wash', '3 to 4 minutes', 'kb', 'Pre-rinse on jet 3 to 4 minutes'],
  // Quick Cards
  ['card-bucket-mix', '4 gal', 'kb', '4 gal water + 4 oz CG Citrus Wash & Gloss'],
  ['card-clay-tub', '1 gal', 'kb', '1 gal water + 1 oz Citrus Wash & Gloss'],
  ['card-ipa-wipe', '1 cup', 'kb', '1 cup 70% IPA + 3 cups water'],
  ['card-ipa-wipe', '17.5% alcohol', 'log', '(17.5% alcohol)'],
  ['card-machine-settings', 'About 1 inch per second', 'kb', 'About 1 inch per second'],
  ['card-machine-settings', 'About 10 lb', 'kb', 'About 10 lb of pressure'],
  ['card-thickness-bands', 'about 220+', 'kb', '(about 220+)'],
  ['card-pad-ladder', 'x2', 'kb', 'Maroon 6 in. x2'],
  ['card-tesla-wash-mode-tape', 'Controls > Service > Car Wash Mode', 'kb', 'Controls > Service > Car Wash Mode'],
  ['card-bike-rules', 'A 3 in. machine comes later', 'kb', 'A 3 in. machine comes later'],
  // Fix It
  ['fix-01', 'speed 1 to 2', 'kb', 'spread at speed 1 to 2'],
  ['fix-01', 'about 10 lb', 'kb', 'pressure over ~10 lb'],
  ['fix-01', '1-888-866-5797', 'kb', '1-888-866-5797'],
  ['fix-04', '1 to 2 drops', 'kb', 'mist the pad face with water; 1 to 2 drops'],
  ['fix-05', '4 to 6 sets', 'kb', '4 to 6 sets, wipe once at the end'],
  ['fix-14', '3 to 4 minutes', 'kb', 'jet 3 to 4 minutes'],
  ['fix-18', '2 to 3 sprays', 'kb', '2 to 3 sprays on a clean damp towel'],
  ['fix-21', '20 µm', 'kb', '20 µm swings within a foot are normal'],
  ['fix-22', 'Under 75', 'kb', '| Under 75 | No machine'],
  ['fix-23', '5/16 in.-24', 'kb', 'is 5/16 in.-24 thread'],
  ['fix-23', '$23.05', 'log', '$23.05'],
  ['fix-26', '9 mph', 'log', '9 mph'],
  ['fix-33', '50 F', 'kb', 'below about 50 F'],
  ['fix-81', 'five body cameras', 'log', 'five (2020 to 2024)'],
  ['fix-88', '$1.50 per mile', 'kb', '$1.50 per mile outside Tooele'],
  ['fix-89', '24 hours', 'kb', '24 hours notice or the deposit stays'],
  // Quizzes
  ['quiz-l0-ground-rules-05', '1 hour in warm soapy water', 'kb', 'soak 1 hour in warm soapy water'],
  ['quiz-l1-02-pre-rinse-01', '3 to 4 minutes', 'kb', 'Pre-rinse on jet 3 to 4 minutes'],
  ['quiz-l1-wash-decon-04', '30', 'kb', 'contact wash 30'],
  ['quiz-l3-03-bands-02', '90 to 99', 'kb', '| 90 to 99 | Polish only'],
  ['quiz-l3-02-gauge-03', '20 µm', 'kb', '20 µm swings within a foot are normal'],
  ['quiz-l4-test-spot-04', '3 to 4 sets', 'kb', 'maroon + Ultimate Compound (3 to 4 sets)'],
  ['quiz-l4-06-pads-plate-01', '5/16 in.-24', 'kb', 'is 5/16 in.-24 thread'],
  ['quiz-l4-06-pads-plate-02', '1-888-866-5797', 'kb', 'HF tech/parts line 1-888-866-5797'],
  // Flashcards
  ['flash-gauge-mil', '25.4 µm', 'kb', '1 mil = 25.4 µm'],
  ['flash-ladder-rung-3', '3 to 4 sets', 'kb', 'maroon + Ultimate Compound (3 to 4 sets)'],
  ['flash-machine-test-run', 'at least 30 seconds', 'log', 'run 30 seconds off the car'],
  ['flash-policies-cancel', '24 hours', 'kb', '24 hours notice or the deposit stays'],
  ['flash-prices-full-detail', 'Sedan $230. SUV or truck $280', 'kb', '| Full Detail (no polish) | $230 | $280 |'],
  ['flash-times-wash-slots', 'contact wash 30', 'kb', 'contact wash 30'],
  ['flash-towels-per-detail', '24 to 30', 'kb', 'Call it 24 to 30'],
  ['flash-prices-example-mobile', '$328', 'kb', '= $328'],
  // Drills
  ['drill-l0-explain-paint', '1 mil', 'kb', '1 mil = 25.4 µm'],
  ['drill-l1-dry', '20 min', 'kb', 'rinse/dry/jambs 20'],
  ['drill-l1-wheels', '30 seconds', 'log', 'Allow the foam to penetrate for 30 seconds'],
  ['drill-l3-gauge-sheet', 'the 11 panels', 'kb', '11 panels x 3 readings'],
  ['drill-l4-marker-line', 'speed 1 to 2', 'kb', 'Spread on speed 1 to 2'],
  ['drill-l4-timed-square', '4 minutes', 'kb', 'About 4 minutes per 2 x 2 ft section'],
  // Outline lessons, Levels 5 to 8 (added in pass 2 with DEF-21's fix)
  ['lesson-l5-03-tire-dressing', 'At least 3 to 5 minutes before the car moves', 'log', 'at least 3 to 5 min (trigger), 5 min (aerosol)'],
  ['lesson-l5-05-exterior-glass', 'Drop the windows 1 to 2 inches', 'kb', 'Drop windows 1 to 2 inches'],
  ['lesson-l6-03-headlight-refresh', '$30 a pair', 'kb', 'headlight refresh $30/pair'],
  ['lesson-l6-04-pet-hair-job', '2 hrs or more', 'kb', 'stains: 2 hrs or more'],
  ['lesson-l7-01-menus', 'Standard $75, bagger or touring $95', 'kb', '| Wash & Protect (1 hr): wash, air dry, ceramic wax, wheels, chrome wipe | $75 | $95 |'],
  ['lesson-l7-01-menus', 'badge removal $40', 'kb', 'badge removal $40'],
  ['lesson-l7-01-menus', '$60 to $75 per hour gross', 'kb', 'Target: $60 to $75 per hour gross'],
  ['lesson-l7-03-five-policies', '24 hours notice', 'kb', 'Cancellation: 24 hours notice or the deposit stays'],
  ['lesson-l7-05-honest-selling', 'fresh paint under 30 days', 'kb', 'fresh paint under 30 days'],
  ['lesson-l8-01-two-step', '4 h 55 m', 'kb', '| **Total on paint** | 39 | **2 h 30 m** | **4 h 55 m** |'],
  ['lesson-l8-01-two-step', '3 to 4 cutting plus 3 finishing', 'kb', 'two-step 3 to 4 cutting plus 3 finishing'],
  ['lesson-l8-02-speed', '5:25 PM against a 6:10 plan', 'kb', 'wheels + wash done 5:25 PM (plan was 6:10)'],
  ['lesson-l8-03-two-person-flow', 'About 5 h', 'kb', 'Two people (one in, one out): about 5 h'],
  ['lesson-l8-04-mobile-polishing', 'The polisher draws 7.5 A', 'log', '120VAC / 60Hz / 7.5A'],
  ['lesson-l8-04-mobile-polishing', '12-gauge, 50 ft max', 'kb', '12-gauge cord, 50 ft max'],
  ['lesson-l8-04-mobile-polishing', 'within 20 minutes of each other', 'kb', 'within 20 minutes of each other'],
  ['lesson-l8-05-black-pad', 'speed 2 to 3', 'kb', 'sealant at speed 2 to 3'],
];

const byId = new Map(items().map((i) => [i.id, i]));
const PARAGRAPHS = new Set(['why', 'body', 'explanation', 'labelNotes', 'definition', 'prompt', 'front', 'back', 'title']);
const numbersIn = (s: string) => (s.match(/\d[\d,.]*\d|\d/g) ?? []).map((n) => Number(n.replace(/,/g, '')));

describe('Phase 2 numbers sample: 87 numbers against the knowledge base and the verification log', () => {
  it('samples at least 60 numbers from all seven content types', () => {
    expect(SAMPLE.length).toBeGreaterThanOrEqual(60);
    const types = new Set(SAMPLE.map(([id]) => byId.get(id)?.type));
    for (const t of ['lesson', 'sop', 'quickcard', 'fixnode', 'quizquestion', 'flashcard', 'drill']) expect(types.has(t as never), `${t}`).toBe(true);
  });

  for (const [id, said, source, sourceSays] of SAMPLE) {
    it(`${id}: "${said}" matches ${source} "${sourceSays}"`, () => {
      const item = byId.get(id);
      expect(item, `${id} exists`).toBeDefined();
      if (item === undefined) return;
      const texts = [...allStrings(item).map((s) => s.text), ...units(item).map((u) => u.text)];
      const found = texts.some((t) => t.toLowerCase().includes(said.toLowerCase()));
      expect(found, `${id} says "${said}"`).toBe(true);
      expect(SOURCES[source], `${source} says "${sourceSays}"`).toContain(sourceSays);
      for (const n of numbersIn(said)) expect(numbersIn(sourceSays), `the number ${n} in "${sourceSays}"`).toContain(n);
    });
  }

  it('prints the sample with the status each line renders with (QA report evidence)', () => {
    const table = SAMPLE.map(([id, said, source]) => {
      const item = byId.get(id);
      const all = item === undefined ? [] : units(item).filter((u) => u.text.toLowerCase().includes(said.toLowerCase()));
      // A line or row carries its own status; a Markdown paragraph (why, body, explanation) carries the item's.
      // A mistakes line names what not to do, so a step, row, or note is preferred when there is one.
      const line = all.find((u) => !PARAGRAPHS.has(u.field) && !u.field.startsWith('mistakes')) ?? all.find((u) => !PARAGRAPHS.has(u.field));
      return `${id} | ${said} | ${line?.status ?? `${all[0]?.status ?? '?'} (paragraph)`} | ${source}`;
    });
    console.info(table.join('\n'));
    expect(table.length).toBe(SAMPLE.length);
  });
});
