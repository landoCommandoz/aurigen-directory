// @vitest-environment node
/**
 * Phase 2 content audit: the counts against the Phase 2 bar (BUILD_PROMPT 8, Phase 2; the brief).
 * Owner: qa-adversary.
 *
 *   Fix It: fix-01 to fix-33 (knowledge base 21) present, 33 or more in all.
 *   Academy Levels 0 to 4: every lesson in docs/CURRICULUM.md exists at its level and order, with
 *   a why and steps; each lesson has its drill and a quiz of 3 or more questions (the count the
 *   curriculum states); every skill has its sign-off file.
 *   Academy Levels 5 to 8: one outline lesson per curriculum topic, marked as an outline (DEF-21).
 *   Writing rules: every item has 4 or more search words and at least one related link; every page
 *   links on to at least one other page (no dead end).
 */
import { describe, expect, it } from 'vitest';
import { pageRoute } from '../../src/features/shared/contentRoutes';
import { lineStatus, lineText, type ContentItemValue, type LessonItem, type QuizQuestionItem } from '../../src/schemas';
import { built, curriculumRows, items, readText } from '../fixtures/contentAudit';

const all = items();
const byId = new Map(all.map((i) => [i.id, i]));
const lessons = all.filter((i): i is LessonItem => i.type === 'lesson');
const questions = all.filter((i): i is QuizQuestionItem => i.type === 'quizquestion');
const quizSize = (quizId: string) => questions.filter((q) => q.quizId === quizId).length;
const rows = curriculumRows();
const signOffs = built().bundle.signOffs;

function relatedOf(item: ContentItemValue): string[] {
  const extra = item.type === 'fixnode' ? [item.lessonId, ...item.productIds, ...item.equipmentIds] : [];
  return [...extra, ...item.related].filter((id): id is string => id !== undefined);
}

describe('Phase 2 bar: Fix It', () => {
  it('fix-01 to fix-33 are present, and 33 or more fixes in all', () => {
    const fixes = all.filter((i) => i.type === 'fixnode');
    const missing = Array.from({ length: 33 }, (_, n) => `fix-${String(n + 1).padStart(2, '0')}`).filter((id) => byId.get(id)?.type !== 'fixnode');
    expect(missing).toEqual([]);
    expect(fixes.length).toBeGreaterThanOrEqual(33);
    console.info(`Fix It entries: ${fixes.length}`);
  });

  it('every fix has a say-it word, a cause, and a step, and the STOP symptom (FIX-09) says STOP', () => {
    for (const f of all) {
      if (f.type !== 'fixnode') continue;
      expect(f.sayIt.length, `${f.id}`).toBeGreaterThan(0);
      expect(f.causes.length + f.steps.length, `${f.id}`).toBeGreaterThan(1);
    }
    expect(byId.get('fix-09')?.title).toMatch(/\bSTOP\b/);
    expect(byId.get('fix-01')?.title).toMatch(/jerks/i);
  });
});

describe('Phase 2 bar: Academy Levels 0 to 4', () => {
  it('the curriculum lists 31 lessons in Levels 0 to 4, in order, with no gaps', () => {
    expect(rows.length).toBe(31);
    for (const level of [0, 1, 2, 3, 4]) {
      const orders = rows.filter((r) => r.level === level).map((r) => r.order);
      expect(orders.length, `level ${level}`).toBeGreaterThan(0);
      expect(orders, `level ${level}`).toEqual(orders.map((_, i) => i + 1));
    }
  });

  it('every curriculum lesson exists at its level and order, is not an outline, and has a why and steps', () => {
    for (const r of rows) {
      const lesson = byId.get(r.lessonId);
      expect(lesson?.type, `${r.lessonId}`).toBe('lesson');
      if (lesson?.type !== 'lesson') continue;
      expect([lesson.level, lesson.order], `${r.lessonId}`).toEqual([r.level, r.order]);
      expect(lesson.outline, `${r.lessonId}`).toBe(false);
      expect(lesson.why.replace(/\*\*Goal:\*\*[^\n]*/, '').trim().length, `${r.lessonId} why`).toBeGreaterThan(200);
      expect(lesson.steps.length, `${r.lessonId} steps`).toBeGreaterThanOrEqual(3);
    }
  });

  it('no Level 0 to 4 lesson exists that the curriculum does not list', () => {
    const listed = new Set(rows.map((r) => r.lessonId));
    expect(lessons.filter((l) => l.level <= 4 && !listed.has(l.id)).map((l) => l.id)).toEqual([]);
  });

  it('each lesson has its drill, and a quiz of 3 or more questions, as many as the curriculum says', () => {
    for (const r of rows) {
      const lesson = byId.get(r.lessonId) as LessonItem | undefined;
      expect(byId.get(r.drillId)?.type, `${r.drillId}`).toBe('drill');
      expect(lesson?.drillIds, `${r.lessonId}`).toContain(r.drillId);
      expect(quizSize(r.quizId), `${r.quizId}`).toBeGreaterThanOrEqual(3);
      expect(quizSize(r.quizId), `${r.quizId} count in the curriculum`).toBe(r.quizCount);
    }
  });

  it('every quiz question has distinct choices, a valid answer, an explanation, and points at a lesson', () => {
    const lessonIds = new Set(lessons.map((l) => l.id));
    for (const q of questions) {
      expect(new Set(q.choices.map((c) => c.trim().toLowerCase())).size, `${q.id}`).toBe(q.choices.length);
      expect(q.correctIndex, `${q.id}`).toBeLessThan(q.choices.length);
      expect(q.explanation.trim().length, `${q.id}`).toBeGreaterThan(5);
      expect(q.related.some((id) => lessonIds.has(id)), `${q.id} links to no lesson`).toBe(true);
    }
  });

  it('six sign-off files, one per skill lesson, each with its quiz, drills, and owner checks; one polish gate', () => {
    expect(signOffs.length).toBe(6);
    const skillLessons = lessons.filter((l) => l.skillId !== undefined);
    expect(skillLessons.map((l) => l.skillId).sort()).toEqual(signOffs.map((s) => s.skillId).sort());
    for (const s of signOffs) {
      const lesson = byId.get(s.lessonId) as LessonItem | undefined;
      expect(lesson?.skillId, `${s.skillId}`).toBe(s.skillId);
      expect(quizSize(s.quizId), `${s.quizId}`).toBeGreaterThanOrEqual(3);
      expect(lesson?.drillIds.length ?? 0, `${s.skillId} drills`).toBeGreaterThan(0);
      expect(s.ownerChecks.length, `${s.skillId} owner checks`).toBeGreaterThan(0);
      expect(s.quizPassScore).toBeGreaterThan(0);
      // The knowledge base sets no pass mark or drill minimum: they stay verify until Lando accepts them.
      expect(s.status, `${s.skillId}`).toBe('verify');
    }
    expect(signOffs.filter((s) => s.gates.includes('polish-stage')).map((s) => s.skillId)).toEqual(['skill-l4-machine-polishing']);
  });

  it('flashcards exist for the numbers (bands, mixes, speeds, times, prices)', () => {
    const decks = new Set(all.flatMap((i) => (i.type === 'flashcard' ? [i.deck] : [])));
    for (const deck of ['bands', 'mixes', 'machine', 'times', 'prices']) expect(decks.has(deck), `${deck}`).toBe(true);
  });
});

/**
 * Levels 5 to 8 (DEF-21, closed in pass 2): one outline lesson per topic the curriculum lists under
 * "Levels 5 to 8 (outline only)", without the "Planned skill" lines and Level 8's opening rule.
 * Outlines carry no drill, quiz, or sign-off (the curriculum says so), and are marked as outlines.
 */
function outlineTopics(): Map<number, number> {
  const section = readText('docs/CURRICULUM.md').split(/^## Levels 5 to 8 \(outline only\)$/m)[1]?.split(/^## /m)[0] ?? '';
  const topics = new Map<number, number>();
  let level = -1;
  for (const line of section.split('\n')) {
    const heading = /^### Level (\d)\./.exec(line);
    if (heading !== null) level = Number(heading[1]);
    else if (level >= 5 && line.startsWith('- ') && !/^- (Planned skill|Opens when)/.test(line)) topics.set(level, (topics.get(level) ?? 0) + 1);
  }
  return topics;
}

describe('Academy Levels 5 to 8: outlines in the app (DEF-21)', () => {
  const outlines = lessons.filter((l) => l.level >= 5);
  const topics = outlineTopics();

  it('each of Levels 5 to 8 has as many outline lessons as the curriculum lists topics, in order with no gaps', () => {
    expect([...topics.keys()].sort()).toEqual([5, 6, 7, 8]);
    for (const level of [5, 6, 7, 8]) {
      const orders = outlines.filter((l) => l.level === level).map((l) => l.order).sort((a, b) => a - b);
      expect(orders.length, `level ${level}`).toBe(topics.get(level));
      expect(orders, `level ${level}`).toEqual(orders.map((_, i) => i + 1));
    }
    console.info(`Outline lessons: ${outlines.length} (${[5, 6, 7, 8].map((l) => `L${l} ${topics.get(l) ?? 0}`).join(', ')})`);
  });

  it('every outline is marked as one, has a goal, a why, steps, and links on; none carries a drill, quiz, or skill', () => {
    for (const l of outlines) {
      expect(l.outline, `${l.id}`).toBe(true);
      expect(l.why, `${l.id} goal`).toMatch(/^\*\*Goal:\*\* \S/);
      expect(l.why.replace(/\*\*Goal:\*\*[^\n]*/, '').trim().length, `${l.id} why`).toBeGreaterThan(80);
      expect(l.steps.length, `${l.id} steps`).toBeGreaterThanOrEqual(3);
      expect([l.drillIds.length, l.quizId, l.skillId], `${l.id}`).toEqual([0, undefined, undefined]);
      expect(relatedOf(l).some((id) => byId.get(id) !== undefined && pageRoute(byId.get(id) as ContentItemValue) !== null), `${l.id} links on`).toBe(true);
    }
    expect(questions.filter((q) => outlines.some((l) => q.related.includes(l.id) && q.quizId.startsWith(`quiz-l${l.level}`))).map((q) => q.id)).toEqual([]);
    expect(signOffs.filter((s) => /^skill-l[5-8]-/.test(s.skillId)).map((s) => s.skillId)).toEqual([]);
  });

  it('no outline step or row is written for odor or the two-step: both wait on Lando and the fact-checker', () => {
    for (const id of ['lesson-l6-05-odor', 'lesson-l8-01-two-step']) {
      const l = byId.get(id) as LessonItem | undefined;
      expect(l?.type, `${id}`).toBe('lesson');
      const method = (l?.steps ?? []).filter((s) => /no (odor|two-step) (method|procedure)/i.test(lineText(s)));
      expect(method.map((s) => lineStatus(s, l?.status ?? 'verify')), `${id} says the method is not written, as verify`).toEqual(['verify']);
    }
  });

  // DEF-25 (closed in pass 3): the curriculum's Counts line said 23 outline lessons; it now states the
  // number the app has, and the split per level matches the outlines in the app.
  it('DEF-25: the curriculum Counts line states the number of outline lessons the app has, level by level', () => {
    const line = /Levels 5 to 8: (\d+) outline lessons \(Level 5: (\d+), Level 6: (\d+), Level 7: (\d+), Level 8: (\d+)\)/.exec(readText('docs/CURRICULUM.md'));
    expect(line, 'the Counts line with its per-level split').not.toBeNull();
    const [, total, ...perLevel] = (line ?? []).map(Number);
    expect(total).toBe(outlines.length);
    expect(perLevel).toEqual([5, 6, 7, 8].map((level) => outlines.filter((l) => l.level === level).length));
  });
});

describe('writing rules and no dead ends', () => {
  it('every item has 4 or more search words (synonyms plus say-it) and at least one related link', () => {
    const few = all.filter((i) => i.synonyms.length + (i.type === 'fixnode' ? i.sayIt.length : 0) < 4).map((i) => i.id);
    const alone = all.filter((i) => relatedOf(i).length === 0).map((i) => i.id);
    expect(few).toEqual([]);
    expect(alone).toEqual([]);
  });

  it('every item with a page links on to at least one other item that has a page', () => {
    const deadEnds = all.filter((i) => pageRoute(i) !== null && !relatedOf(i).some((id) => {
      const target = byId.get(id);
      return target !== undefined && target.id !== i.id && pageRoute(target) !== null;
    }));
    expect(deadEnds.map((i) => i.id)).toEqual([]);
  });

  it('every related id points at an item that is in the bundle (nothing superseded, nothing missing)', () => {
    const broken = all.flatMap((i) => relatedOf(i).filter((id) => !byId.has(id)).map((id) => `${i.id} -> ${id}`));
    expect(broken).toEqual([]);
  });
});
