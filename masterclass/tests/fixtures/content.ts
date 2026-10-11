/**
 * Content fixtures (qa-adversary): one valid raw item per content type, written from the zod
 * schemas in src/schemas (the contract), plus the ways each one can be broken. Raw objects, as a
 * content file would hold them after YAML or front matter parsing; the tests parse them.
 * Not imported by app code.
 */
import type { ContentTypeName } from '../../src/schemas';

type Raw = Record<string, unknown>;

const base = (id: string, type: ContentTypeName, extra: Raw = {}): Raw => ({
  id,
  type,
  title: `Fixture ${id}`,
  audience: ['owner', 'crew'],
  visibility: 'internal',
  status: 'house',
  ...extra,
});

/** One valid item per content type. */
export const VALID: Record<ContentTypeName, Raw> = {
  lesson: base('lesson-l4-01-machine-control', 'lesson', { level: 4, order: 1, why: 'Control beats speed.', steps: ['Prime the pad'], skillId: 'skill-l4-machine-polishing' }),
  sop: base('sop-polish', 'sop', { stage: 'polish', steps: [{ text: 'Work a 2 by 2 square', timer: { kind: 'section', seconds: 60 } }] }),
  quickcard: base('card-fixture-mix', 'quickcard', { kind: 'mix', rows: [{ label: 'Water', value: '4 gal' }] }),
  product: base('product-fixture-soap', 'product', { brand: 'Fixture', jobs: ['Wash'] }),
  equipment: base('equipment-fixture-pad', 'equipment', { specs: [{ label: 'Size', value: '5.5 in', status: 'house' }] }),
  glossaryterm: base('term-fixture', 'glossaryterm', { term: 'Fixture', definition: 'A test item.' }),
  fixnode: base('fix-99', 'fixnode', { group: 'machine', sayIt: ['jerking'], causes: ['Pad off center'], steps: ['Stop, re-center the pad'] }),
  drill: base('drill-fixture', 'drill', { instructions: ['Hold the polisher flat for 60 seconds'] }),
  quizquestion: base('quiz-l4-machine-01', 'quizquestion', { quizId: 'quiz-l4-machine', prompt: 'Speed?', choices: ['3', '6'], correctIndex: 0, explanation: 'Start at 3.' }),
  flashcard: base('flash-fixture', 'flashcard', { deck: 'l4', front: 'OPM', back: 'Orbits per minute' }),
  priceitem: base('price-car-fixture-sedan', 'priceitem', { audience: ['owner'], kind: 'service', vehicleType: 'car', size: 'sedan', unit: 'flat', amount: 100 }),
  policy: base('policy-01-fixture', 'policy', { order: 1, text: 'A $50 deposit holds the date.' }),
  script: base('script-fixture', 'script', { when: 'walkaround', text: 'Walk the car with me.' }),
};

export interface Breakage {
  name: string;
  mutate: (raw: Raw) => Raw;
}

/** Ways every item can be broken; each must be refused by its schema. */
export const BREAKAGES: Breakage[] = [
  { name: 'an unknown field', mutate: (r) => ({ ...r, colour: 'red' }) },
  { name: 'an id without its type prefix', mutate: (r) => ({ ...r, id: 'no-prefix-here' }) },
  { name: 'an id in capitals', mutate: (r) => ({ ...r, id: String(r.id).toUpperCase() }) },
  { name: 'an id with an underscore', mutate: (r) => ({ ...r, id: String(r.id).replace(/-/, '_') }) },
  { name: 'no title', mutate: ({ title: _t, ...r }) => r },
  { name: 'an empty title', mutate: (r) => ({ ...r, title: '' }) },
  { name: 'a title over 120 characters', mutate: (r) => ({ ...r, title: 'x'.repeat(121) }) },
  { name: 'no audience', mutate: (r) => ({ ...r, audience: [] }) },
  { name: 'an unknown audience', mutate: (r) => ({ ...r, audience: ['public'] }) },
  { name: 'an unknown visibility', mutate: (r) => ({ ...r, visibility: 'public' }) },
  { name: 'an unknown status', mutate: (r) => ({ ...r, status: 'maybe' }) },
  { name: 'a status in capitals', mutate: (r) => ({ ...r, status: 'VERIFY' }) },
  { name: 'a kbRef that is a number, not quoted text', mutate: (r) => ({ ...r, kbRef: 7.3 }) },
  { name: 'a kbRef with words', mutate: (r) => ({ ...r, kbRef: 'section 7' }) },
  { name: 'a version of 0', mutate: (r) => ({ ...r, version: 0 }) },
  { name: 'a source with confirmedOn but no confirmedBy', mutate: (r) => ({ ...r, sources: [{ label: 'Label', date: '2026-10-01', confirmedOn: '2026-10-02' }] }) },
  { name: 'a source with a non-http url', mutate: (r) => ({ ...r, sources: [{ label: 'Label', date: '2026-10-01', url: 'javascript:alert(1)' }] }) },
];

/** Type-specific breakages: the required field of each type removed, or a rule broken. */
export const TYPE_BREAKAGES: Array<{ type: ContentTypeName; name: string; mutate: (raw: Raw) => Raw }> = [
  { type: 'lesson', name: 'level 9', mutate: (r) => ({ ...r, level: 9 }) },
  { type: 'lesson', name: 'no why', mutate: ({ why: _w, ...r }) => r },
  { type: 'lesson', name: 'no steps', mutate: (r) => ({ ...r, steps: [] }) },
  { type: 'sop', name: 'an unknown stage', mutate: (r) => ({ ...r, stage: 'buffing' }) },
  { type: 'sop', name: 'a timer of 0 seconds', mutate: (r) => ({ ...r, steps: [{ text: 'x', timer: { kind: 'dwell', seconds: 0 } }] }) },
  { type: 'quickcard', name: 'no rows', mutate: (r) => ({ ...r, rows: [] }) },
  { type: 'quickcard', name: 'an unknown kind', mutate: (r) => ({ ...r, kind: 'recipe' }) },
  { type: 'product', name: 'no jobs', mutate: (r) => ({ ...r, jobs: [] }) },
  { type: 'equipment', name: 'a spec without its own status', mutate: (r) => ({ ...r, specs: [{ label: 'Size', value: '5 in' }] }) },
  { type: 'glossaryterm', name: 'no definition', mutate: ({ definition: _d, ...r }) => r },
  { type: 'fixnode', name: 'no say-it words', mutate: (r) => ({ ...r, sayIt: [] }) },
  { type: 'fixnode', name: 'an unknown group', mutate: (r) => ({ ...r, group: 'misc' }) },
  { type: 'drill', name: 'no instructions', mutate: (r) => ({ ...r, instructions: [] }) },
  { type: 'quizquestion', name: 'correctIndex past the last choice', mutate: (r) => ({ ...r, correctIndex: 2 }) },
  { type: 'quizquestion', name: 'an id that does not start with its quizId', mutate: (r) => ({ ...r, id: 'quiz-l3-other-01' }) },
  { type: 'quizquestion', name: 'one choice only', mutate: (r) => ({ ...r, choices: ['3'], correctIndex: 0 }) },
  { type: 'flashcard', name: 'a deck with spaces', mutate: (r) => ({ ...r, deck: 'level four' }) },
  { type: 'priceitem', name: 'a flat price with no amount', mutate: ({ amount: _a, ...r }) => r },
  { type: 'priceitem', name: 'a quote item with an amount', mutate: (r) => ({ ...r, unit: 'quote' }) },
  { type: 'priceitem', name: 'a negative amount', mutate: (r) => ({ ...r, amount: -1 }) },
  { type: 'priceitem', name: 'a sedan size on a bike', mutate: (r) => ({ ...r, vehicleType: 'bike' }) },
  { type: 'priceitem', name: 'an add-on that touches paint', mutate: (r) => ({ ...r, kind: 'addon', touchesPaint: true }) },
  { type: 'priceitem', name: 'mobile only and drop-off only at once', mutate: (r) => ({ ...r, mobileOnly: true, dropOffOnly: true }) },
  { type: 'policy', name: 'order 0', mutate: (r) => ({ ...r, order: 0 }) },
  { type: 'script', name: 'an unknown moment', mutate: (r) => ({ ...r, when: 'lunch' }) },
];

/** A customer-safe item of any type, for the customer-safe rule. */
export function customerSafe(type: ContentTypeName, extra: Raw = {}): Raw {
  return { ...VALID[type], visibility: 'customer-safe', audience: ['customer'], ...extra };
}
