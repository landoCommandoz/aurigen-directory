/**
 * Whole-set checks the content build runs after every file has parsed on its own.
 * Pure: no file system, no Node APIs. The build maps each problem's id back to its file.
 * Owner: architect. The list mirrors BLUEPRINT section 7, "Build-time validation".
 */
import type { SignOffCriteriaItem } from './content-academy';
import { customerRenderProblems, type ContentItemValue } from './content';

export interface ContentProblem {
  /** The content id or skill id the problem belongs to. */
  id: string;
  /** The field at fault, dotted ("steps[2].quickCardId"), or "" for the whole item. */
  field: string;
  message: string;
}

/**
 * Every problem in a full content set. Empty means the build may continue.
 * Fails on: duplicate ids; a related, supersedes, lessonId, quizId, drillIds, productIds,
 * equipmentIds, quickCardId, or skillId reference to nothing, or (supersedes aside) to a
 * superseded item; a supersedes target that is not
 * superseded; a superseded item nothing supersedes; a customer-safe item that may not render in
 * Customer View; a lesson with a skillId and no criteria file, or a criteria file no lesson names;
 * a criteria file whose lessonId, quizId, or prerequisites do not exist; a prerequisite loop;
 * more than one polish-stage gate, or one not on a Level 4 lesson; two lessons in one level slot.
 */
export function checkContentSet(
  items: readonly ContentItemValue[],
  signOffs: readonly SignOffCriteriaItem[],
): ContentProblem[] {
  const problems: ContentProblem[] = [];
  const add = (id: string, field: string, message: string) => problems.push({ id, field, message });

  const byId = new Map<string, ContentItemValue>();
  for (const item of items) {
    if (byId.has(item.id)) add(item.id, 'id', 'Duplicate id: another file already uses it');
    else byId.set(item.id, item);
  }
  const quizIds = new Set<string>();
  for (const item of items) if (item.type === 'quizquestion') quizIds.add(item.quizId);

  const criteriaBySkill = new Map<string, SignOffCriteriaItem>();
  for (const c of signOffs) {
    if (criteriaBySkill.has(c.skillId)) add(c.skillId, 'skillId', 'Duplicate sign-off criteria for this skill');
    else criteriaBySkill.set(c.skillId, c);
  }

  const mustExist = (from: string, field: string, target: string | undefined) => {
    if (target === undefined) return;
    const found = byId.get(target);
    if (found === undefined) add(from, field, `Points to "${target}", which does not exist`);
    else if (found.status === 'superseded') add(from, field, `Points to "${target}", which is superseded; point to its replacement`);
  };

  const supersededBy = new Set<string>();
  const lessonSlots = new Map<string, string>();
  const lessonsBySkill = new Map<string, string[]>();

  for (const item of items) {
    item.related.forEach((r, i) => mustExist(item.id, `related[${i}]`, r));

    if (item.supersedes !== undefined) {
      const target = byId.get(item.supersedes);
      if (item.supersedes === item.id) add(item.id, 'supersedes', 'An item cannot supersede itself');
      else if (target === undefined) mustExist(item.id, 'supersedes', item.supersedes);
      else if (target.status !== 'superseded') {
        add(item.id, 'supersedes', `"${item.supersedes}" must have status superseded once something replaces it`);
      }
      supersededBy.add(item.supersedes);
    }

    if (item.visibility === 'customer-safe') {
      for (const message of customerRenderProblems(item)) add(item.id, 'visibility', message);
    }

    switch (item.type) {
      case 'fixnode':
        mustExist(item.id, 'lessonId', item.lessonId);
        item.productIds.forEach((p, i) => mustExist(item.id, `productIds[${i}]`, p));
        item.equipmentIds.forEach((e, i) => mustExist(item.id, `equipmentIds[${i}]`, e));
        break;
      case 'sop':
        item.steps.forEach((s, i) => mustExist(item.id, `steps[${i}].quickCardId`, s.quickCardId));
        break;
      case 'lesson': {
        item.drillIds.forEach((d, i) => mustExist(item.id, `drillIds[${i}]`, d));
        if (item.quizId !== undefined && !quizIds.has(item.quizId)) {
          add(item.id, 'quizId', `No quiz question has quizId "${item.quizId}"`);
        }
        const slot = `${item.level}:${item.order}`;
        const taken = lessonSlots.get(slot);
        if (taken !== undefined) add(item.id, 'order', `Level ${item.level} order ${item.order} is already used by ${taken}`);
        else lessonSlots.set(slot, item.id);
        if (item.skillId !== undefined) {
          lessonsBySkill.set(item.skillId, [...(lessonsBySkill.get(item.skillId) ?? []), item.id]);
          if (!criteriaBySkill.has(item.skillId)) {
            add(item.id, 'skillId', `No content/academy/signoff/${item.skillId}.yaml exists for this skill`);
          }
        }
        break;
      }
      case 'quickcard':
      case 'product':
      case 'equipment':
      case 'priceitem':
      case 'policy':
      case 'script':
      case 'drill':
      case 'quizquestion':
      case 'flashcard':
      case 'glossaryterm':
        break;
      default: {
        const unreachable: never = item;
        add(String(unreachable), 'type', 'Unknown content type');
      }
    }
  }

  for (const item of items) {
    if (item.status === 'superseded' && !supersededBy.has(item.id)) {
      add(item.id, 'status', 'Superseded, but no item names it in supersedes (a dangling old version)');
    }
  }

  let polishGates = 0;
  for (const c of signOffs) {
    const lessons = lessonsBySkill.get(c.skillId) ?? [];
    if (lessons.length === 0) add(c.skillId, 'skillId', 'No lesson names this skillId');
    if (lessons.length > 1) add(c.skillId, 'skillId', `More than one lesson names this skill: ${lessons.join(', ')}`);
    const lesson = byId.get(c.lessonId);
    if (lesson === undefined) add(c.skillId, 'lessonId', `Points to "${c.lessonId}", which does not exist`);
    else if (lesson.type !== 'lesson' || lesson.skillId !== c.skillId) {
      add(c.skillId, 'lessonId', `"${c.lessonId}" does not name skillId "${c.skillId}"`);
    }
    if (!quizIds.has(c.quizId)) add(c.skillId, 'quizId', `No quiz question has quizId "${c.quizId}"`);
    if (lesson?.type === 'lesson' && lesson.quizId !== undefined && lesson.quizId !== c.quizId) {
      add(c.skillId, 'quizId', `The lesson names quiz "${lesson.quizId}"; this file names "${c.quizId}"`);
    }
    c.prerequisites.forEach((p, i) => {
      if (p === c.skillId) add(c.skillId, `prerequisites[${i}]`, 'A skill cannot be its own prerequisite');
      else if (!criteriaBySkill.has(p)) add(c.skillId, `prerequisites[${i}]`, `No sign-off criteria for "${p}"`);
    });
    if (c.gates.includes('polish-stage')) {
      polishGates += 1;
      if (lesson?.type === 'lesson' && lesson.level !== 4) {
        add(c.skillId, 'gates', 'Only the Level 4 machine polishing skill may gate the polish stage (D11)');
      }
    }
  }
  if (polishGates > 1) add('signoff', 'gates', 'More than one skill gates the polish stage; exactly one may (D11)');

  for (const loop of prerequisiteLoops(signOffs)) {
    add(loop[0] ?? 'signoff', 'prerequisites', `Prerequisite loop: ${loop.join(' -> ')}`);
  }

  return problems;
}

/** Each prerequisite loop found, as the skill ids around it. */
function prerequisiteLoops(signOffs: readonly SignOffCriteriaItem[]): string[][] {
  const next = new Map(signOffs.map((c) => [c.skillId, c.prerequisites] as const));
  const done = new Set<string>();
  const loops: string[][] = [];
  const visit = (id: string, stack: string[]) => {
    if (stack.includes(id)) {
      loops.push([...stack.slice(stack.indexOf(id)), id]);
      return;
    }
    if (done.has(id)) return;
    for (const p of next.get(id) ?? []) visit(p, [...stack, id]);
    done.add(id);
  };
  for (const c of signOffs) visit(c.skillId, []);
  return loops;
}
