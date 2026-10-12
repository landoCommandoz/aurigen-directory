// @vitest-environment node
/**
 * Phase 2 content audit: the truth rules (BUILD_PROMPT 9 item 11; CLAUDE.md truth and writing
 * rules; the Phase 2 brief's seven pending answers). Owner: qa-adversary.
 *
 * Every check runs on the bundle the content build makes and, for characters, on the raw files.
 * A failure names the item, the field, and the words. Known open defects are `it.fails` with their
 * DEF number, so the suite stays green while the defect is open and turns red the day it is fixed
 * (then the test is flipped). None open in this file since Phase 2 pass 5 (DEF-16 closed in pass 2,
 * DEF-20 in pass 4, DEF-28 in pass 5).
 */
import { describe, expect, it } from 'vitest';
import { lineStatus, visibleLines, type LineValue } from '../../src/schemas';
import { allStrings, built, filesUnder, items, negated, readText, settledMatches, units, type TextUnit } from '../fixtures/contentAudit';

const all = items();
const allUnits: TextUnit[] = all.flatMap((item) => units(item));
const say = (u: TextUnit) => `${u.id} ${u.field} [${u.status}]: ${u.text.slice(0, 140)}`;

describe('Phase 2 truth rules', () => {
  it('the content build is clean', () => {
    expect(built().problems).toEqual([]);
    expect(built().ok).toBe(true);
    expect(all.length).toBeGreaterThan(500);
  });

  it('no em dash or en dash in any content file, the search files, or the curriculum', () => {
    const files = [...filesUnder('content'), 'tests/search-cases.yaml', 'docs/CURRICULUM.md'];
    const hits = files.filter((f) => /[\u2014\u2013]/.test(readText(f)));
    expect(hits).toEqual([]);
  });

  it('every item is internal, and nothing is customer-safe in Phase 2', () => {
    expect(all.filter((i) => i.visibility !== 'internal').map((i) => i.id)).toEqual([]);
    expect(built().stats.customerSafe).toBe(0);
  });

  it('nothing superseded is in the bundle, and the renderer drops every superseded line', () => {
    expect(all.filter((i) => i.status === 'superseded').map((i) => i.id)).toEqual([]);
    for (const item of all) {
      for (const field of ['steps', 'checks', 'causes', 'notes', 'mistakes', 'stopIf', 'stillHappening', 'instructions', 'passMark']) {
        const list = (item as unknown as Record<string, unknown>)[field];
        if (!Array.isArray(list) || item.type === 'sop') continue;
        const shown = visibleLines(list as LineValue[], item.status);
        expect(shown.some((l) => lineStatus(l, item.status) === 'superseded'), `${item.id} ${field}`).toBe(false);
      }
    }
  });

  it('no status tag in brackets inside any text', () => {
    const hits = all.flatMap((i) => allStrings(i).filter((s) => /\[(VERIFY|HOUSE|SOURCED|SUPERSEDED)/i.test(s.text)).map((s) => `${i.id} ${s.path}`));
    expect(hits).toEqual([]);
  });

  it('no aftercare text (FC-06, Phase 4): no "first 24 hours", no "keep it dry", no set-up line', () => {
    const re = /first 24 hours|keep it dry|still setting up|protection is setting/i;
    const hits = all.flatMap((i) => allStrings(i).filter((s) => re.test(s.text)).map((s) => `${i.id} ${s.path}: ${s.text.slice(0, 80)}`));
    expect(hits).toEqual([]);
    expect(filesUnder('content').filter((f) => f.startsWith('content/customer/'))).toEqual([]);
  });

  it('no market research figure, and knowledge base 15.5 is never cited', () => {
    const re = /market research|competitor|going rate|industry average|average price|\b15\.5\b/i;
    const hits = all.flatMap((i) => allStrings(i).filter((s) => re.test(s.text)).map((s) => `${i.id} ${s.path}: ${s.text.slice(0, 80)}`));
    expect(hits).toEqual([]);
  });

  it('every dollar amount is in the knowledge base or the verification log (two quiz distractors excepted)', () => {
    const kb = readText('knowledge/KNOWLEDGE_BASE.md');
    const log = readText('knowledge/verification-log.md');
    const distractors = new Set(['quiz-l2-interior-04 $200', 'quiz-l2-interior-04 $260']);
    const unknown: string[] = [];
    for (const item of all) {
      for (const s of allStrings(item)) {
        for (const m of s.text.matchAll(/\$\d[\d,]*(?:\.\d+)?/g)) {
          const amount = m[0].replace(/,$/, '');
          if (kb.includes(amount) || log.includes(amount) || distractors.has(`${item.id} ${amount}`)) continue;
          unknown.push(`${item.id} ${s.path}: ${amount}`);
        }
      }
    }
    expect(unknown).toEqual([]);
    const q = all.find((i) => i.id === 'quiz-l2-interior-04');
    expect(q?.type === 'quizquestion' ? q.choices[q.correctIndex] : '').not.toMatch(/\$200|\$260/);
  });

  it('knowledge base 23 and 9.1 superseded guidance never reads as current', () => {
    const OLD: Array<[string, RegExp]> = [
      ['IPA 50/50', /50 ?\/ ?50|half and half/i],
      ['Pro Speed compound', /pro speed/i],
      ['CM-224 gauge', /CM-?224/i],
      ['booklet ceramic wax haze', /haze (for )?3 to 5|let it haze|thin coat.{0,40}haze/i],
      ['foam cannon pre-soak', /foam cannon pre-?soak|pre-?soak with the foam cannon/i],
      ['under 70 to 80', /70 to 80/],
      ['placeholder price', /YOUR PRICE/i],
      ['microfiber cutting pads', /microfiber cutting/i],
      ['early Panel Map test spot', /need compound and (you )?don.?t have it/i],
      ['towels and pads both warm', /pads and towels (both )?in warm/i],
      ['Wash & Wax before a polish', /wash (&|and) wax (wash )?before (a )?polish/i],
    ];
    const hits: string[] = [];
    for (const item of all) {
      // A flashcard answer reads with its question; a mistakes list is what not to do.
      const context = item.type === 'flashcard' ? item.front : item.type === 'quizquestion' ? item.prompt : '';
      for (const u of units(item)) {
        if (u.field.startsWith('mistakes')) continue;
        for (const [name, re] of OLD) if (re.test(u.text) && !negated(context) && settledMatches(u.text, re).length > 0) hits.push(`${name}: ${say(u)}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it("the fact-checker's corrections are applied (FC-02, FC-08, FC-10, FC-18, FC-26, FC-29, FC-66, FC-67, FC-71)", () => {
    const WRONG: Array<[string, RegExp]> = [
      ['FC-02 strip ratio is not the label', /label[^.]{0,30}1 oz per gal|label's strip/i],
      ['FC-08 IPA strength is 17.5%', /about 17 ?%/i],
      ['FC-10 M210 is not "built for" dark paint', /built for dark/i],
      ['FC-18 M8 is not from the manual', /manual[^.]{0,40}M8|M8[^.]{0,40}manual/i],
      ['FC-26 wheel cleaner waits 30 seconds', /wheel[^.]{0,60}(about a minute|one minute|1 minute)|(about a minute|one minute)[^.]{0,40}wheel/i],
      ['FC-29 tire shine dries at least 3 to 5 minutes', /tire shine[^.]{0,40}a few minutes/i],
      ['FC-66 maroon is medium cut', /maroon[^.]{0,30}heav(y|ier) (polishing|cut)/i],
      ['FC-67 Uro-Tec is 1 in. thick', /5\/8 in/],
      ['FC-71 clear coat is 35 to 50', /38 to 50/],
    ];
    const hits: string[] = [];
    for (const u of allUnits) for (const [name, re] of WRONG) if (settledMatches(u.text, re).length > 0) hits.push(`${name}: ${say(u)}`);
    expect(hits).toEqual([]);
  });

  it('facts the knowledge base or the fact-checker leave open render with the unverified badge (status verify)', () => {
    const OPEN: Array<[string, RegExp]> = [
      ['IPA ratio, KB 4 and FC-08', /3 cups (of )?water/i],
      ['cold limit, FC-51', /\b50 ?F\b/],
      ['generator, FC-64', /2,?000 ?W\b/],
      ['APC ratios, FC-80', /\b10:1\b|\b4:1\b/],
      ['hose water use, FC-90', /25 to 35 gal/i],
      ['Monthly Maintenance, BLUEPRINT 12 item 4', /monthly maintenance/i],
      ['insurance walk-away, BLUEPRINT 12 item 7', /worth more than (your|the) insurance/i],
      ['ShineMate fit, FC-59', /shinemate/i],
      ['trim residue method, FC-53', /trim-safe cleaner/i],
      ['Bug & Tar one-minute dwell, FC-45', /bug (&|and) tar[^.]{0,80}(one|1) minute|(sit|dwell|wait) (about )?(one|1) minute/i],
    ];
    const hits: string[] = [];
    for (const u of allUnits) {
      if (u.type === 'quizquestion' && !u.field.includes('correct') && u.field.startsWith('choices')) continue;
      for (const [name, re] of OPEN) if (u.status !== 'verify' && settledMatches(u.text, re).length > 0) hits.push(`${name}: ${say(u)}`);
    }
    expect(hits).toEqual([]);
  });

  it('Blazin Banana, Tuff Stuff, and the HF finishing pad colors are on no Quick Card and no SOP step (BLUEPRINT 12 items 8, 9)', () => {
    const hits = allUnits.filter((u) => (u.type === 'quickcard' || u.type === 'sop') && /blazin|tuff stuff|finishing pads? (are|is) (white|black|blue|orange|red|grey|gray)/i.test(u.text));
    expect(hits.map(say)).toEqual([]);
  });

  it('speed 4 and about 10 lb never stand alone: the 56367 manual lines and a pending row sit with them (FC-22, FC-23)', () => {
    const misses: string[] = [];
    for (const item of all) {
      if (item.type === 'quizquestion' || item.type === 'flashcard') continue;
      const us = units(item);
      const text = us.map((u) => u.text).join('\n');
      const speed = /\bspeed 4\b|work(s|ing)? at 4\b/i.test(text);
      const pressure = /\b(about )?10 ?lb\b/i.test(text);
      if (!speed && !pressure) continue;
      const manualSpeed = us.some((u) => u.status === 'sourced' && /slower speeds/i.test(u.text));
      const manualPressure = us.some((u) => u.status === 'sourced' && /pressure off/i.test(u.text));
      const pending = us.some((u) => u.status === 'verify' && /\(pending\)/.test(u.text));
      if ((speed && !manualSpeed) || (pressure && !manualPressure) || !pending) misses.push(`${item.id}: speed ${speed}/${manualSpeed}, pressure ${pressure}/${manualPressure}, pending ${pending}`);
    }
    expect(misses).toEqual([]);
  });

  it('Teslas: wheel cleaner, pre-soak, and compound are never settled; Tesla-only items carry the manual line and the pending row (FC-16)', () => {
    const TOPIC = /wheel cleaner|wheel & tire|armor all extreme wheel|pre-?soak|pre-wash|compound|cutting paste|rung 3/i;
    const misses: string[] = [];
    for (const item of all) {
      if (item.type === 'quizquestion' || item.type === 'flashcard') continue;
      const us = units(item);
      const teslaOnly = item.type === 'fixnode' ? item.group === 'tesla' : item.type === 'sop' ? item.vehicleBranch === 'tesla' : item.tags.includes('tesla');
      const pending = us.some((u) => u.status === 'verify' && /\(pending\)/.test(u.text) && /tesla/i.test(u.text));
      const manual = us.some((u) => u.status === 'sourced' && /tesla/i.test(u.text) && /manual|says/i.test(u.text));
      // A line written for a Tesla that names a topic, settled, with nothing pending anywhere in the item.
      for (const u of us) {
        const forTesla = /\b(on|for) a tesla\b|\bteslas?\b(?! (is|are) not)/i.test(u.text) && !/not a tesla/i.test(u.text);
        if (forTesla && TOPIC.test(u.text) && (u.status === 'house' || u.status === 'sourced') && !/tesla.{0,20}(manual|says)/i.test(u.text) && !negated(u.text) && !pending) misses.push(`settled on a Tesla: ${say(u)}`);
      }
      // A Tesla-only item that uses one of the three on the car (not a "do not" line or a maker's line).
      const uses = us.some((u) => TOPIC.test(u.text) && !negated(u.text) && !/(manual|says)/i.test(u.text));
      if (teslaOnly && uses && item.type !== 'product' && !(manual && pending)) misses.push(`${item.id}: Tesla-only, manual line ${manual}, pending row ${pending}`);
    }
    expect(misses).toEqual([]);
  });

  // DEF-20 (closed in pass 4): six products held a "(pending)" sentence, and with it the house line
  // and the maker's line beside it, inside labelNotes, a paragraph with no status of its own. Pass 3
  // named two of them; the content-curator moved the lines on all six into Product.notes, one line
  // each with its own status (src/schemas/README.md, the product pattern; D2 amendment 2026-10-12).
  describe('DEF-20: pending rows, house lines, and maker lines are product notes, never labelNotes', () => {
    const products = all.flatMap((i) => (i.type === 'product' ? [i] : []));
    const notesOf = (id: string) => {
      const product = products.find((p) => p.id === id);
      expect(product, `${id}`).toBeDefined();
      return (product?.notes ?? []).map((n) => ({ text: typeof n === 'string' ? n : n.text, status: lineStatus(n, product?.status ?? 'verify') }));
    };
    const MOVED = [
      'product-armor-all-extreme-tire-shine',
      'product-armor-all-extreme-wheel-tire',
      'product-blazin-banana',
      'product-meguiars-quik-interior-detailer',
      'product-meguiars-ultimate-compound',
      'product-tuff-stuff',
    ];

    it('no product holds a pending sentence in labelNotes, and every pending note is a verify line', () => {
      expect(products.filter((p) => /\(pending\)|lando decides/i.test(p.labelNotes ?? '')).map((p) => p.id)).toEqual([]);
      const pendingNotes = products.flatMap((p) => notesOf(p.id).filter((n) => /\(pending\)/.test(n.text)).map((n) => ({ id: p.id, ...n })));
      expect(pendingNotes.length).toBeGreaterThanOrEqual(8);
      expect(pendingNotes.filter((n) => n.status !== 'verify').map((n) => `${n.id} [${n.status}]: ${n.text}`)).toEqual([]);
    });

    it('the six moved products keep their pending rows as notes, and their labelNotes name no house line or Tesla', () => {
      for (const id of MOVED) {
        expect(notesOf(id).some((n) => n.status === 'verify' && /\(pending\)/.test(n.text)), `${id} pending note`).toBe(true);
        const label = products.find((p) => p.id === id)?.labelNotes ?? '';
        expect(label, `${id} labelNotes`).not.toMatch(/\bhouse\b|\btesla\b|\blando\b/i);
      }
    });

    it('the Tesla rows: a house line, a sourced Tesla manual line, and the pending row, in that order where a house line exists', () => {
      for (const id of ['product-armor-all-extreme-wheel-tire', 'product-meguiars-ultimate-compound']) {
        const notes = notesOf(id);
        const house = notes.findIndex((n) => n.status === 'house' && /tesla/i.test(n.text));
        const manual = notes.findIndex((n) => n.status === 'sourced' && /tesla's manual/i.test(n.text));
        const pending = notes.findIndex((n) => n.status === 'verify' && /Lando decides how this applies to Teslas \(pending\)/.test(n.text));
        expect([house >= 0, manual >= 0, pending >= 0], `${id}`).toEqual([true, true, true]);
        expect(house < manual && manual < pending, `${id} order`).toBe(true);
      }
      for (const id of ['product-meguiars-quik-interior-detailer', 'product-tuff-stuff']) {
        const notes = notesOf(id);
        expect(notes.some((n) => n.status === 'sourced' && /tesla's manual/i.test(n.text)), `${id} Tesla manual note`).toBe(true);
        expect(notes.some((n) => n.status === 'verify' && /Lando decides how this applies to Teslas \(pending\)/.test(n.text)), `${id} pending note`).toBe(true);
      }
    });

    it('no fact was lost in the move: the label words and the numbers are still on each page', () => {
      const text = (id: string) => {
        const p = products.find((x) => x.id === id);
        return [p?.labelNotes ?? '', ...notesOf(id).map((n) => n.text), ...(p?.jobs ?? []), ...(p?.neverFor ?? [])].join(' ');
      };
      expect(text('product-armor-all-extreme-tire-shine')).toMatch(/4 to 6 inches[\s\S]*8 to 12 inches/);
      expect(text('product-armor-all-extreme-tire-shine')).toMatch(/at least 3 to 5 minutes on the trigger label, at least 5 minutes on the aerosol label/);
      expect(text('product-armor-all-extreme-tire-shine')).toMatch(/no tire shine on a motorcycle at all/);
      expect(text('product-armor-all-extreme-wheel-tire')).toMatch(/30 seconds/);
      expect(text('product-armor-all-extreme-wheel-tire')).toMatch(/not covered by the warranty/);
      expect(text('product-armor-all-extreme-wheel-tire')).toMatch(/On a bike, what to use on the wheels is for Lando to decide \(pending\)/);
      expect(text('product-meguiars-ultimate-compound')).toMatch(/cutting pastes, color restoration compounds, or polishes with harsh abrasives/);
      expect(text('product-meguiars-quik-interior-detailer')).toMatch(/touchscreen gets no cleaners at all/);
      expect(text('product-tuff-stuff')).toMatch(/Lando decides what it is for \(pending\)/);
      expect(text('product-blazin-banana')).toMatch(/house rule 5 applies: no wax before the paint is polished/);
    });
  });

  // DEF-28 (closed in pass 5), found in pass 4: four more products mixed house policy into labelNotes,
  // which holds the label's own words only (D2 amendment 2026-10-12; README, product pattern:
  // "labelNotes is the label's own words, one paragraph, nothing else"). The content-curator moved
  // each house line to a house note and each unconfirmed number to a verify note (version +1 each).
  // These tests hold the rule on every item with labelNotes, and pin what the move must keep.
  describe('DEF-28: labelNotes holds the label\'s words only; house lines and open numbers are notes with their own status', () => {
    const withLabel = all.flatMap((i) => ('labelNotes' in i && typeof i.labelNotes === 'string' ? [{ id: i.id, labelNotes: i.labelNotes }] : []));
    const products = all.flatMap((i) => (i.type === 'product' ? [i] : []));
    const product = (id: string) => {
      const p = products.find((x) => x.id === id);
      expect(p, `${id}`).toBeDefined();
      return p;
    };
    const notesOf = (id: string) => {
      const p = product(id);
      return (p?.notes ?? []).map((n) => ({ text: typeof n === 'string' ? n : n.text, status: lineStatus(n, p?.status ?? 'verify') }));
    };

    it('no labelNotes holds a house line, a pending row, a name, a doubt, or a "read your bottle" line', () => {
      expect(withLabel.length).toBeGreaterThanOrEqual(6);
      const NOT_LABEL = /\bhouse\b|\blando\b|\btesla\b|\(pending\)|\bpending\b|not confirmed|unconfirmed|no label|no source|\bconfirms?\b|read (your|the) (bottle|can|label|directions)|\bwins\b|\bcrew\b|\bwe\b/i;
      expect(withLabel.filter((x) => NOT_LABEL.test(x.labelNotes)).map((x) => `${x.id}: ${x.labelNotes}`)).toEqual([]);
    });

    it('the four moved products went up a version and carry their house lines as house notes and their open numbers as verify notes', () => {
      expect(
        ['product-blue-magic-headlight-restorer', 'product-meguiars-bug-tar', 'product-meguiars-hot-shine', 'product-meguiars-hybrid-ceramic-wax'].map((id) => [id, product(id)?.version]),
      ).toEqual([
        ['product-blue-magic-headlight-restorer', 2],
        ['product-meguiars-bug-tar', 3],
        ['product-meguiars-hot-shine', 3],
        ['product-meguiars-hybrid-ceramic-wax', 4],
      ]);
      const has = (id: string, status: string, re: RegExp) => notesOf(id).some((n) => n.status === status && re.test(n.text));
      // Blue Magic: the two house numbers stay open (FC-78 unconfirmed), and the bottle wins.
      expect(has('product-blue-magic-headlight-restorer', 'verify', /about two minutes per light[\s\S]*about a month[\s\S]*no label or maker source confirms/i)).toBe(true);
      expect(has('product-blue-magic-headlight-restorer', 'house', /the bottle wins/i)).toBe(true);
      expect(product('product-blue-magic-headlight-restorer')?.labelNotes).toBeUndefined();
      // FC-78: neither number is stated anywhere else on the page with a settled status.
      const blueMagic = product('product-blue-magic-headlight-restorer');
      expect([...(blueMagic?.jobs ?? []), ...(blueMagic?.neverFor ?? [])].filter((t) => /minute|month/i.test(t))).toEqual([]);
      // Bug & Tar: the one-minute dwell is open (FC-45); the can wins.
      expect(has('product-meguiars-bug-tar', 'verify', /about one minute[\s\S]*no label confirms/i)).toBe(true);
      expect(has('product-meguiars-bug-tar', 'house', /the can wins/i)).toBe(true);
      // Hot Shine: the house rule is a house line; the unread directions and the trigger bottle are open (FC-31, FC-32).
      expect(has('product-meguiars-hot-shine', 'house', /spray the applicator, never on a motorcycle/i)).toBe(true);
      expect(has('product-meguiars-hot-shine', 'verify', /two-wheeler line were not read/i)).toBe(true);
      expect(has('product-meguiars-hot-shine', 'verify', /trigger bottle was not checked/i)).toBe(true);
      // Hybrid Ceramic Wax: the next-day coat is house (FC-05), the 50 F line and the house uses are open (FC-49, FC-51, FC-87).
      expect(has('product-meguiars-hybrid-ceramic-wax', 'house', /next day counts as the second coat/i)).toBe(true);
      expect(has('product-meguiars-hybrid-ceramic-wax', 'verify', /below about 50 F/)).toBe(true);
      expect(has('product-meguiars-hybrid-ceramic-wax', 'verify', /hard water spots, and on bike chrome, are house uses Meguiar's has not confirmed/)).toBe(true);
      expect(has('product-meguiars-hybrid-ceramic-wax', 'house', /the bottle wins/i)).toBe(true);
    });

    it('the label words stayed in labelNotes, word for word', () => {
      expect(product('product-meguiars-bug-tar')?.labelNotes).toBe("Meguiar's says spray it on, let it soften the bugs and tar, then hose it off or wash over it. No scrubbing.");
      expect(product('product-meguiars-hot-shine')?.labelNotes).toMatch(/^If your Hot Shine is an aerosol can, it is a flammable aerosol\. Keep it away from the heat gun, hot surfaces, and sparks\. Use it outdoors or where the air moves \(Meguiar's safety data sheet\)\. Keep it out of your eyes\.$/);
      expect(product('product-meguiars-hybrid-ceramic-wax')?.labelNotes).toMatch(/^Standard method: on a wet car, spray, rinse, dry\.[\s\S]*Meguiar's recommends two coats: apply on the wet car, dry, re-wet, and repeat\.$/);
    });
  });

  it('the label beats the app (house rule 12) is house, and what crew does next is pending (pre-build answer 6)', () => {
    expect(allUnits.some((u) => /label on the bottle beats this app/i.test(u.text) && u.status === 'house')).toBe(true);
    // Paragraph fields (Markdown) carry no status of their own; the rows and lines do.
    const next = allUnits.filter((u) => /what crew does next/i.test(u.text) && !['why', 'body', 'explanation'].includes(u.field));
    expect(next.length).toBeGreaterThan(0);
    expect(next.filter((u) => u.status !== 'verify').map(say)).toEqual([]);
    expect(next.every((u) => /\(pending\)/.test(u.text))).toBe(true);
  });

  it('synonyms.yaml opens with the commented block "Lando\'s own words (pending)" (pre-build answer 5)', () => {
    const head = readText('content/search/synonyms.yaml').split('\n').slice(0, 20).join('\n');
    expect(head).toMatch(/^# .*Lando's own words \(pending\)/m);
  });

  it('the curriculum notes that Lando may reorder Level 0 (pre-build answer 7)', () => {
    expect(readText('docs/CURRICULUM.md')).toMatch(/Level 0 order \(Lando may reorder\)/);
  });
});

describe('quizzes and flashcards never depend on a decision Lando has not made', () => {
  const PENDING = /\(pending\)|lando decides|not settled/i;
  const HOUSE_PENDING_VALUE = /\bspeed 4\b|\b10 ?lb\b|loose grip|face down on a rack/i;

  it('no correct quiz answer states a pending decision or a house value that waits on one', () => {
    const hits = all.flatMap((q) => {
      if (q.type !== 'quizquestion') return [];
      const answer = q.choices[q.correctIndex] ?? '';
      return PENDING.test(answer) || HOUSE_PENDING_VALUE.test(answer) ? [`${q.id}: ${answer}`] : [];
    });
    expect(hits).toEqual([]);
  });

  it('no quiz asks about a Tesla wheel cleaner, pre-soak, or compound step and marks a house answer right', () => {
    const hits = all.flatMap((q) => {
      if (q.type !== 'quizquestion') return [];
      const asksTesla = /tesla/i.test(q.prompt) && !/not a tesla/i.test(q.prompt);
      const topic = /wheel cleaner|pre-?soak|pre-wash|compound|rung 3/i.test(`${q.prompt} ${q.choices[q.correctIndex] ?? ''}`);
      return asksTesla && topic ? [`${q.id}: ${q.prompt}`] : [];
    });
    expect(hits).toEqual([]);
  });

  it('no flashcard answer holds a pending decision or a house value that waits on one', () => {
    const hits = all.flatMap((f) => (f.type === 'flashcard' && (PENDING.test(f.back) || HOUSE_PENDING_VALUE.test(f.back)) ? [`${f.id}: ${f.back}`] : []));
    expect(hits).toEqual([]);
  });

  // DEF-16 (closed in Phase 2 pass 2): the answer held the product-pile water temperature (FC-88,
  // pending). The fix keeps the settled parts and points to the lesson for the rest; this pins it.
  it('DEF-16: flash-towels-washer keeps the settled parts and leaves the product-pile water to the lesson', () => {
    const card = all.find((f) => f.id === 'flash-towels-washer');
    const back = card?.type === 'flashcard' ? card.back : '';
    expect(back).not.toMatch(PENDING);
    expect(back).not.toMatch(/\bhot\b/i);
    for (const settled of [/care tag/i, /water-only pile, warm/i, /dye-free, fragrance-free/i, /full cycle/i, /extra rinse/i]) expect(back).toMatch(settled);
    expect(card?.related).toEqual(expect.arrayContaining(['lesson-l0-06-shop-setup', 'fix-76']));
  });
});

describe('the audit itself catches what it should (so a pass above means something)', () => {
  it('a bare statement is settled; one negated by the next sentences or a "Never" heading is not', () => {
    expect(settledMatches('Spray the wheel and wait about a minute. Then brush.', /wheel[^.]{0,60}about a minute/i)).toHaveLength(1);
    expect(settledMatches('Mix 1 cup 70% IPA and 3 cups water.', /3 cups water/)).toHaveLength(1);
    expect(settledMatches('Mix 1 cup 70% IPA and 3 cups water. That ratio is not confirmed yet.', /3 cups water/)).toHaveLength(0);
    expect(settledMatches('## Never in the bucket\n- Ultimate Wash & Wax before polishing', /wash (&|and) wax before/i)).toHaveLength(0);
    expect(settledMatches('Use the 6 in. plate. It fits.', /6 in\. plate/)).toHaveLength(1);
    // A stray "no" in another sentence of a long paragraph does not excuse a match.
    expect(settledMatches('No rubbing. Fine. Okay. Then the clear coat is 38 to 50 µm.', /38 to 50/)).toHaveLength(1);
  });
});
