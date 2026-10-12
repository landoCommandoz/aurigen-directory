/**
 * Pure helpers for the Academy pages (Phase 2, read-only): the nine levels with plain names, the
 * lessons in level and order, the lesson goal split from its "why", the lesson before and after,
 * and the procedures by stage with their read-aloud text. No React, no DOM.
 * The level names and one-line topics come from BUILD_PROMPT section 2 and docs/CURRICULUM.md;
 * the lessons themselves come only from the content bundle.
 */
import { STAGE_IDS, visibleLines, type LessonItem, type SopItem, type SopStepValue, type StageIdName } from '../../schemas';
import { isPendingText, sentence, speakable, spokenLine } from '../shared/speechText';

export interface LevelInfo {
  level: number;
  title: string;
  topics: string;
}

export const LEVELS: readonly LevelInfo[] = [
  { level: 0, title: 'Level 0. Ground rules', topics: "How paint works, what can and can't be fixed, safety, the never list, shop setup." },
  { level: 1, title: 'Level 1. Wash and decon', topics: 'Wheels first, the hose-only towel method, pre-soak, hard water, drying, clay.' },
  { level: 2, title: 'Level 2. Interior', topics: 'The interior order, vacuum, wipe and dress, pet hair and spots, glass.' },
  { level: 3, title: 'Level 3. Inspect and measure', topics: 'Light, the TC100 gauge, bands, the 8 checks, the walk-away list, the script.' },
  {
    level: 4,
    title: 'Level 4. Machine polishing',
    topics:
      'The long-throw DA, priming and product amount, pressure, arm speed, sets, marker-line rotation, test spot and ladder, edges, heat, pad care, the backing plate. Its sign-off on the shop phone is what lets crew polish on a job.',
  },
  { level: 5, title: 'Level 5. Protection and finishing', topics: 'An outline in v1.' },
  { level: 6, title: 'Level 6. Specialty', topics: 'Tesla, motorcycles, headlights, pet hair, odor. An outline in v1.' },
  { level: 7, title: 'Level 7. Business', topics: 'Menu, floor price, policies, booking flow, retention, seasons. An outline in v1.' },
  { level: 8, title: 'Level 8. Mastery', topics: 'Opens at 25 cars: two-step correction, speed, two-person flow, teaching others. An outline in v1.' },
];

/** The line every Academy page carries until the Phase 5 Academy app. */
export const PHASE_5_LINE = 'Drills, quizzes, and sign-off arrive in Phase 5.';

/** Lessons by level, then order, then id (so two files in one slot still list in a fixed order). */
export function orderedLessons<T extends Pick<LessonItem, 'id' | 'level' | 'order'>>(lessons: readonly T[]): T[] {
  return [...lessons].sort((a, b) => a.level - b.level || a.order - b.order || a.id.localeCompare(b.id));
}

export function lessonsOfLevel<T extends Pick<LessonItem, 'id' | 'level' | 'order'>>(lessons: readonly T[], level: number): T[] {
  return orderedLessons(lessons.filter((lesson) => lesson.level === level));
}

/** The lesson before and after this one, across levels. */
export function lessonNeighbours<T extends Pick<LessonItem, 'id' | 'level' | 'order'>>(lessons: readonly T[], id: string): { prev: T | null; next: T | null } {
  const all = orderedLessons(lessons);
  const at = all.findIndex((lesson) => lesson.id === id);
  if (at < 0) return { prev: null, next: null };
  return { prev: all[at - 1] ?? null, next: all[at + 1] ?? null };
}

/**
 * The lesson goal: the writers open every "why" with a line "**Goal:** ...". It becomes the
 * objective under the title; the rest is the "why". A body without that line keeps all its text.
 */
export function splitGoal(why: string): { goal: string | null; rest: string } {
  const text = why.replace(/\r\n?/g, '\n').trim();
  const m = /^\*\*Goal:?\*\*:?\s*(.+?)\s*(?:\n|$)/i.exec(text);
  if (m === null || m[1] === undefined) return { goal: null, rest: text };
  return { goal: m[1].trim(), rest: text.slice(m[0].length).trim() };
}

/* ---------- Procedures ---------- */

export const STAGE_LABELS: Record<StageIdName, string> = {
  setup: 'Setup',
  walkaround: 'Walkaround',
  wheels: 'Wheels and tires',
  wash: 'Wash',
  clay: 'Clay',
  dry: 'Dry',
  measure: 'Measure',
  tape: 'Tape',
  'test-spot': 'Test spot',
  polish: 'Machine polish',
  'hand-polish': 'Hand polish',
  protect: 'Protect',
  'tires-trim': 'Tires and trim',
  chain: 'Chain',
  interior: 'Interior',
  glass: 'Glass',
  'final-walkaround': 'Final walkaround',
  cleanup: 'Cleanup',
};

export const BRANCH_LABELS: Record<SopItem['vehicleBranch'], string> = {
  any: 'Any car',
  tesla: 'Tesla',
  bike: 'Bike',
};

export interface StageGroup<T> {
  stage: StageIdName;
  label: string;
  sops: T[];
}

/** Procedures by stage in STAGE_IDS order, any car first, then Tesla, then bike. Empty stages left out. */
export function sopsByStage<T extends Pick<SopItem, 'id' | 'stage' | 'vehicleBranch'>>(sops: readonly T[]): StageGroup<T>[] {
  const branchRank = { any: 0, tesla: 1, bike: 2 } as const;
  return STAGE_IDS.map((stage) => ({
    stage,
    label: STAGE_LABELS[stage],
    sops: sops
      .filter((sop) => sop.stage === stage)
      .sort((a, b) => branchRank[a.vehicleBranch] - branchRank[b.vehicleBranch] || a.id.localeCompare(b.id)),
  })).filter((group) => group.sops.length > 0);
}

/** Steps that may render: a superseded step never renders. */
export function visibleSteps(sop: Pick<SopItem, 'status' | 'steps'>): SopStepValue[] {
  return sop.steps.filter((step) => (step.status ?? sop.status) !== 'superseded');
}

/** "4 min", "1 min 30 s", "45 s": the seconds the writer gave, in plain words. */
export function durationWords(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '';
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes === 0) return `${rest} s`;
  return rest === 0 ? `${minutes} min` : `${minutes} min ${rest} s`;
}

const TIMER_WORDS: Record<NonNullable<SopStepValue['timer']>['kind'], string> = {
  dwell: 'Dwell timer',
  section: 'Section timer',
  setup: 'Setup timer',
  stage: 'Stage timer',
  cure: 'Set time',
};

export function timerWords(timer: SopStepValue['timer']): string | null {
  if (timer === undefined) return null;
  const time = durationWords(timer.seconds);
  return time === '' ? null : `${TIMER_WORDS[timer.kind]}: ${time}`;
}

/** The procedure read aloud: each step in order, its STOP line after it, then its notes. */
export function sopSpeechText(sop: Pick<SopItem, 'title' | 'status' | 'steps'>): string {
  const parts = [sentence(sop.title)];
  visibleSteps(sop).forEach((step, index) => {
    parts.push(`Step ${index + 1}. ${spokenLine({ text: step.text, ...(step.status ? { status: step.status } : {}) }, sop.status)}`);
    if (step.stopIf !== undefined) parts.push(`Stop if: ${sentence(step.stopIf)}`);
    for (const note of visibleLines(step.notes, step.status ?? sop.status)) {
      const words = spokenLine(note, step.status ?? sop.status);
      parts.push(isPendingText(words) ? words : `Note. ${words}`);
    }
  });
  return speakable(parts.join(' '));
}
