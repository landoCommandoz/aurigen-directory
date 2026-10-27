/**
 * A small content bundle for the Phase 2 page tests (Fix It, lessons, procedures, items, search).
 * Every item is parsed through the real ContentItem schema, and the set passes the build's own
 * whole-set check, so a fixture can never drift from the contract. Not imported by app code.
 * The words are test words, not facts: no number here is a house or label value.
 */
import { checkContentSet, ContentItem, type ContentItemValue } from '../../../schemas';
import { emptyBundle, type ContentBundle } from '../../../core/contentBundle';

type Raw = Record<string, unknown>;

const base = (id: string, type: string, title: string, extra: Raw = {}): Raw => ({
  id,
  type,
  title,
  audience: ['owner', 'crew'],
  visibility: 'internal',
  status: 'house',
  ...extra,
});

export const FIX_JERK = 'fix-01';
export const FIX_SPIN = 'fix-02';
export const FIX_STOP = 'fix-09';
export const FIX_TESLA = 'fix-60';
export const LESSON_PRESSURE = 'lesson-l4-03-pressure';
export const LESSON_RULES = 'lesson-l0-01-rules';
export const LESSON_OUTLINE = 'lesson-l5-01-outline';
export const SOP_POLISH = 'sop-polish';
export const CARD_SETTINGS = 'card-machine-settings';
export const PRODUCT = 'product-test-polish';
export const TOOL = 'equipment-test-polisher';
export const TERM = 'term-test-set';
export const DRILL = 'drill-test-scale';

const RAW: Raw[] = [
  base(FIX_JERK, 'fixnode', 'Polisher jerks, walks, or hops side to side', {
    group: 'machine',
    kbRef: '21',
    sayIt: ['jerking', 'hopping', 'fighting me'],
    stopIf: ['Grinding noise or a burning smell. Stop now.', { text: 'Odd shaking on the test run.', status: 'sourced' }],
    checks: ['Unplug it first.', { text: 'Center bolt tight.', status: 'sourced' }],
    causes: ['Pad tilted onto an edge.', 'Pushing instead of guiding.'],
    steps: ['Re-center the pad.', { text: 'Old step that was replaced.', status: 'superseded' }, { text: 'Hold it with two hands.', status: 'verify' }, 'Keep the pad flat.'],
    stillHappening: ['Marker line stops: open the pad stops spinning fix.'],
    notes: [
      { text: 'House setting: test speed.', status: 'house' },
      { text: 'The test manual says something else.', status: 'sourced' },
      { text: 'Lando decides which applies (pending).', status: 'verify' },
    ],
    lessonId: LESSON_PRESSURE,
    productIds: [PRODUCT],
    equipmentIds: [TOOL],
    related: [FIX_SPIN, CARD_SETTINGS, SOP_POLISH, TERM],
    sources: [{ label: 'Test manual', url: 'https://example.com/manual.pdf', date: '2026-10-10', note: 'Page 8.' }],
  }),
  base(FIX_SPIN, 'fixnode', 'Pad stops spinning', { group: 'machine', sayIt: ['pad stopped'], causes: ['Too much pressure.'], steps: ['Ease up.'], related: [FIX_JERK] }),
  base(FIX_STOP, 'fixnode', 'Paint color on the pad: STOP', { group: 'paint', sayIt: ['color on the pad'], stopIf: ['Color on the pad.'], causes: ['Through the clear.'], steps: ['Stop polishing that panel.'] }),
  base(FIX_TESLA, 'fixnode', 'Tesla test symptom', { group: 'tesla', status: 'verify', sayIt: ['tesla thing'], causes: ['Unknown.'], steps: ['Ask Lando.'] }),
  base(LESSON_RULES, 'lesson', 'The rules', { level: 0, order: 1, why: '**Goal:** Know the rules.\n\n## The first rule\n\nThe label wins.', steps: ['Read the label.'] }),
  base(LESSON_PRESSURE, 'lesson', 'Pressure: feel it on a scale', {
    level: 4,
    order: 3,
    kbRef: '8.3',
    why: '**Goal:** Feel the pressure on a scale.\n\n## Why a scale\n\nA **scale** turns the number into a feeling.\n\n- First point\n- Second point\n\n| Check | What it does |\n|---|---|\n| Wrap | No polish |',
    steps: ['Unplug the polisher.', { text: 'Work at the test pressure.', status: 'house' }, { text: 'The manual says light. Lando decides which applies (pending).', status: 'verify' }],
    numbers: [
      { label: 'Pressure, house', value: 'Test value.', status: 'house' },
      { label: 'Not checked', value: 'Test value two.', status: 'verify' },
      { label: 'Gone', value: 'Old value.', status: 'superseded' },
    ],
    mistakes: ['Pushing instead of guiding.'],
    drillIds: [DRILL],
    related: [CARD_SETTINGS, FIX_JERK],
  }),
  base(LESSON_OUTLINE, 'lesson', 'Protection outline', { level: 5, order: 1, outline: true, why: 'Topics for later.', steps: ['Topic one.'] }),
  base(SOP_POLISH, 'sop', 'Machine polishing, one-step', {
    stage: 'polish',
    plannedMinutes: 150,
    steps: [
      { text: 'Check for shade.', stopIf: 'Sun on the panel. Do not polish.' },
      { text: 'Set the dial.', timer: { kind: 'section', seconds: 240 }, quickCardId: CARD_SETTINGS, notes: [{ text: 'Lando decides which applies (pending).', status: 'verify' }] },
      { text: 'Old step.', status: 'superseded' },
    ],
    related: [FIX_JERK],
  }),
  base(CARD_SETTINGS, 'quickcard', 'Machine settings', { kind: 'settings', rows: [{ label: 'Work', value: 'Test speed.' }], related: [FIX_JERK] }),
  base(PRODUCT, 'product', 'Test polish', { brand: 'Test brand', jobs: ['Polish.'], related: [FIX_JERK] }),
  base(TOOL, 'equipment', 'Test polisher', { model: 'Model T', specs: [{ label: 'Throw', value: 'Test throw.', status: 'house' }], related: [FIX_JERK, DRILL] }),
  base(TERM, 'glossaryterm', 'Set', { term: 'Set', definition: 'One pass each way.' }),
  base(DRILL, 'drill', 'Scale pressure drill', { synonyms: ['jerking drill'], instructions: ['Press on the scale.'] }),
  base('quiz-l4-test-01', 'quizquestion', 'Pressure quiz', { quizId: 'quiz-l4-test', prompt: 'How hard?', choices: ['Light', 'Hard'], correctIndex: 0, explanation: 'Light.' }),
  base('flash-test-pressure', 'flashcard', 'Pressure flashcard', { deck: 'numbers', front: 'Pressure?', back: 'Test.' }),
];

export function fixtureItems(): ContentItemValue[] {
  const items = RAW.map((raw) => ContentItem.parse(raw)).sort((a, b) => a.id.localeCompare(b.id));
  const problems = checkContentSet(items, []);
  if (problems.length > 0) throw new Error(`fixture breaks the content rules: ${problems.map((p) => `${p.id} ${p.field} ${p.message}`).join('; ')}`);
  return items;
}

export function fixtureBundle(): ContentBundle {
  return { ...emptyBundle(), items: fixtureItems() };
}
