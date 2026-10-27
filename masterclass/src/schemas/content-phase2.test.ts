/**
 * Phase 2 contract readiness (architect, 2026-10-11). Each Phase 2 need is written the way a content
 * file would hold it and parsed, so the field-by-field answer in the architect's report is executable.
 * Covers the additive fields: SopStep.notes, Drill.passMark, SignOffCriteria.ownerChecks and status,
 * and Product.notes (2026-10-12, DEF-20).
 */
import { describe, expect, it } from 'vitest';
import {
  ContentItem,
  Drill,
  FixNode,
  Lesson,
  Product,
  QuizQuestion,
  SOP,
  SignOffCriteria,
  checkContentSet,
  customerRenderProblems,
  type ContentItemValue,
} from './index';

const base = (id: string, type: string, extra: Record<string, unknown>) => ({
  id,
  type,
  title: `Fixture ${id}`,
  audience: ['owner', 'crew'],
  visibility: 'internal',
  status: 'house',
  ...extra,
});

const teslaSource = {
  label: 'Tesla Model Y owner manual, cleaning',
  url: 'https://www.tesla.com/ownersmanual/modely/en_us/GUID-65384C1F-86F2-44E8-A8BC-8A12E7E00A40.html',
  date: '2026-10-10',
  note: 'Fact-checker FC-16',
};

/** The house line, the maker's line, and the pending row (the lead's pattern for FC-16, FC-22, FC-23). */
const threeRows = [
  { text: 'House: spray the wheel cleaner on the face and barrel.', status: 'house' },
  { text: 'The Tesla manual says not to use chemical wheel cleaners.', status: 'sourced' },
  { text: 'Lando decides how this applies to Teslas (pending).', status: 'verify' },
];

describe('Phase 2 needs, expressed without new fields', () => {
  it('a FixNode carries a pending row, a sourced maker row with its URL in sources, and links to every type', () => {
    const fix = base('fix-34', 'fixnode', {
      group: 'tesla',
      tags: ['tesla'],
      sayIt: ['tesla wheels'],
      causes: ['Brake dust baked on'],
      steps: threeRows,
      sources: [teslaSource],
      lessonId: 'lesson-l1-01-wheels-first',
      productIds: ['product-armor-all-extreme-wheel-tire'],
      equipmentIds: ['equipment-wheel-brush-soft'],
      related: ['card-tesla-wash-mode-tape', 'lesson-l6-01-tesla'],
    });
    const parsed = FixNode.parse(fix);
    expect(parsed.steps).toHaveLength(3);
    expect(parsed.sources[0]?.url).toBe(teslaSource.url);
  });

  it('a Lesson holds numbers with their own status and a bike-only tag', () => {
    const lesson = Lesson.parse(
      base('lesson-l6-02-motorcycles', 'lesson', {
        level: 6,
        order: 2,
        outline: true,
        why: 'Bikes break the car rules.',
        steps: ['No tire shine on a motorcycle. Ever.'],
        tags: ['bike'],
        numbers: [
          { label: 'Polisher speed, house', value: 'Speed 4', status: 'house', kbRef: '8.3' },
          { label: 'Polisher speed, the 56367 manual', value: 'Only use slower speeds for polishing', status: 'sourced' },
          { label: 'Lando decides which applies (pending)', value: 'Until then the house setting stays', status: 'verify' },
        ],
      }),
    );
    expect(lesson.numbers.map((n) => n.status)).toEqual(['house', 'sourced', 'verify']);
  });

  it('a quiz question carries a scenario and exactly one correct answer; a flashcard parses', () => {
    const q = QuizQuestion.parse(
      base('quiz-l4-machine-01', 'quizquestion', {
        quizId: 'quiz-l4-machine',
        prompt: 'You are on the hood and the polisher starts hopping. What do you check first?',
        choices: ['The pad is centered', 'The radio'],
        correctIndex: 0,
        explanation: 'FIX-01 checks first.',
      }),
    );
    expect(q.scenario).toBe(true);
    expect(ContentItem.safeParse(base('flash-bands-01', 'flashcard', { deck: 'bands', front: 'Front', back: 'Back' })).success).toBe(true);
  });
});

describe('SopStep.notes (added 2026-10-11)', () => {
  const sop = (steps: unknown[], extra: Record<string, unknown> = {}) =>
    base('sop-wheels-tesla', 'sop', { stage: 'wheels', vehicleBranch: 'tesla', steps, ...extra });

  it('defaults to no notes and keeps per-note status', () => {
    expect(SOP.parse(sop([{ text: 'One wheel at a time' }])).steps[0]?.notes).toEqual([]);
    const parsed = SOP.parse(sop([{ text: 'Spray the wheel cleaner', status: 'house', notes: threeRows.slice(1) }], { sources: [teslaSource] }));
    expect(parsed.steps[0]?.notes).toHaveLength(2);
  });

  it('still refuses an unknown key on a step', () => {
    expect(SOP.safeParse(sop([{ text: 'Spray', note: 'typo' }])).success).toBe(false);
  });

  it('keeps a verify note out of Customer View', () => {
    const item = ContentItem.parse(sop([{ text: 'Rinse', notes: [{ text: 'Pending', status: 'verify' }] }], { visibility: 'customer-safe' }));
    expect(customerRenderProblems(item).some((p) => p.includes('notes[0] has its own status verify'))).toBe(true);
  });
});

describe('Product.notes (added 2026-10-12, DEF-20)', () => {
  const product = (extra: Record<string, unknown> = {}) =>
    base('product-armor-all-extreme-wheel-tire', 'product', {
      brand: 'Armor All',
      tags: ['tesla'],
      jobs: ['Wheels and tires, first in the wash'],
      ...extra,
    });

  it('defaults to no notes, so every existing product file still parses', () => {
    expect(Product.parse(product()).notes).toEqual([]);
  });

  it('holds the house line, the maker line, and the pending row, each with its own status', () => {
    const parsed = Product.parse(product({ status: 'verify', notes: threeRows, sources: [teslaSource] }));
    expect(parsed.notes.map((n) => (typeof n === 'string' ? 'plain' : n.status))).toEqual(['house', 'sourced', 'verify']);
    expect(parsed.labelNotes).toBeUndefined();
  });

  it('still refuses an unknown key, so a typo never drops the rows silently', () => {
    expect(Product.safeParse(product({ note: threeRows })).success).toBe(false);
    expect(Product.safeParse(product({ notes: [{ text: 'Pending', status: 'pending' }] })).success).toBe(false);
  });

  it('keeps a verify note out of Customer View even on a house product', () => {
    const item = ContentItem.parse(product({ visibility: 'customer-safe', notes: threeRows, sources: [teslaSource] }));
    const problems = customerRenderProblems(item);
    expect(problems.some((p) => p.includes('notes[2] has its own status verify'))).toBe(true);
    expect(problems.some((p) => p.includes('notes[1] is marked sourced but the item has no confirmed source'))).toBe(true);
  });
});

describe('Drill.passMark (added 2026-10-11)', () => {
  it('defaults to empty and holds measurable lines with their own status', () => {
    const plain = Drill.parse(base('drill-scale-pressure', 'drill', { instructions: ['Press the polisher on a bathroom scale'] }));
    expect(plain.passMark).toEqual([]);
    const drill = Drill.parse(
      base('drill-scale-pressure', 'drill', {
        instructions: ['Press the polisher on a bathroom scale'],
        logField: { label: 'Scale reading', unit: 'lb' },
        passMark: [
          { text: 'The scale reads about 10 lb for the whole pass.', status: 'house' },
          { text: 'The 56367 manual says keep pressure off of the tool.', status: 'sourced' },
          { text: 'Lando decides which applies (pending).', status: 'verify' },
        ],
      }),
    );
    expect(drill.passMark).toHaveLength(3);
  });
});

describe('SignOffCriteria.ownerChecks and status (added 2026-10-11)', () => {
  const criteria = (extra: Record<string, unknown> = {}) => ({
    skillId: 'skill-l4-machine-polishing',
    title: 'Machine polishing',
    lessonId: 'lesson-l4-01-machine-control',
    quizId: 'quiz-l4-machine',
    quizPassScore: 80,
    drillMinimum: 3,
    gates: ['polish-stage'],
    ...extra,
  });

  it('defaults to a proposal with no owner checks', () => {
    const parsed = SignOffCriteria.parse(criteria());
    expect(parsed.status).toBe('verify');
    expect(parsed.ownerChecks).toEqual([]);
  });

  it('accepts house and owner checks with their own status; refuses sourced and superseded', () => {
    const parsed = SignOffCriteria.parse(
      criteria({ status: 'house', ownerChecks: ['Pad flat on the paint before the trigger', { text: 'Speed and pressure as Lando decides (pending)', status: 'verify' }] }),
    );
    expect(parsed.ownerChecks).toHaveLength(2);
    expect(SignOffCriteria.safeParse(criteria({ status: 'sourced' })).success).toBe(false);
    expect(SignOffCriteria.safeParse(criteria({ status: 'superseded' })).success).toBe(false);
  });

  it('passes the whole-set checks with the new fields in place', () => {
    const items = [
      base('lesson-l4-01-machine-control', 'lesson', { level: 4, order: 1, why: 'Control.', steps: ['Prime the pad'], quizId: 'quiz-l4-machine', skillId: 'skill-l4-machine-polishing', drillIds: ['drill-scale-pressure'] }),
      base('quiz-l4-machine-01', 'quizquestion', { quizId: 'quiz-l4-machine', prompt: 'Scenario?', choices: ['A', 'B'], correctIndex: 1, explanation: 'B.' }),
      base('drill-scale-pressure', 'drill', { instructions: ['Press'], passMark: ['About 10 lb'] }),
    ].map((raw) => ContentItem.parse(raw) as ContentItemValue);
    const signOffs = [SignOffCriteria.parse(criteria({ ownerChecks: ['Wipe once, at the end of the sets'] }))];
    expect(checkContentSet(items, signOffs)).toEqual([]);
  });
});
