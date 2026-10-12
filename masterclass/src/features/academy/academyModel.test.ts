// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { ContentItem, STAGE_IDS, type SopItem } from '../../schemas';
import { durationWords, lessonNeighbours, LEVELS, lessonsOfLevel, orderedLessons, sopSpeechText, sopsByStage, splitGoal, STAGE_LABELS, timerWords, visibleSteps } from './academyModel';

const lesson = (id: string, level: number, order: number) => ({ id, level, order });

describe('levels and lessons', () => {
  it('names all nine levels, 0 to 8, in order', () => {
    expect(LEVELS.map((l) => l.level)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    for (const l of LEVELS) expect(l.title.startsWith(`Level ${l.level}. `)).toBe(true);
  });

  it('orders lessons by level, then order, then id', () => {
    const list = [lesson('lesson-l1-02-b', 1, 2), lesson('lesson-l0-02-b', 0, 2), lesson('lesson-l1-01-a', 1, 1), lesson('lesson-l0-01-a', 0, 1)];
    expect(orderedLessons(list).map((l) => l.id)).toEqual(['lesson-l0-01-a', 'lesson-l0-02-b', 'lesson-l1-01-a', 'lesson-l1-02-b']);
    expect(lessonsOfLevel(list, 1).map((l) => l.id)).toEqual(['lesson-l1-01-a', 'lesson-l1-02-b']);
    expect(lessonsOfLevel(list, 7)).toEqual([]);
  });

  it('finds the lesson before and after, across levels, and nothing for an unknown id', () => {
    const list = [lesson('a', 0, 1), lesson('b', 0, 2), lesson('c', 1, 1)];
    expect(lessonNeighbours(list, 'b')).toEqual({ prev: list[0], next: list[2] });
    expect(lessonNeighbours(list, 'a').prev).toBeNull();
    expect(lessonNeighbours(list, 'c').next).toBeNull();
    expect(lessonNeighbours(list, 'zz')).toEqual({ prev: null, next: null });
  });

  it('splits the goal line from the why, and keeps a why with no goal whole', () => {
    expect(splitGoal('**Goal:** Feel it on a scale.\n\n## Why\n\nBecause.')).toEqual({ goal: 'Feel it on a scale.', rest: '## Why\n\nBecause.' });
    expect(splitGoal('No goal here.\n\nMore.')).toEqual({ goal: null, rest: 'No goal here.\n\nMore.' });
    expect(splitGoal('**Goal:** Only a goal.')).toEqual({ goal: 'Only a goal.', rest: '' });
    expect(splitGoal('')).toEqual({ goal: null, rest: '' });
  });
});

describe('procedures', () => {
  const sop = (id: string, stage: string, vehicleBranch = 'any', extra: Record<string, unknown> = {}) =>
    ContentItem.parse({ id, type: 'sop', title: id, audience: ['crew'], visibility: 'internal', status: 'house', stage, vehicleBranch, steps: [{ text: 'Do it.' }], ...extra }) as SopItem;

  it('labels every stage', () => {
    for (const stage of STAGE_IDS) expect(STAGE_LABELS[stage]).toMatch(/^[A-Z]/);
  });

  it('groups by stage in the house stage list, any car first, then Tesla, then bike', () => {
    const groups = sopsByStage([sop('sop-wash-bike', 'wash', 'bike'), sop('sop-wheels', 'wheels'), sop('sop-wash-tesla', 'wash', 'tesla'), sop('sop-wash', 'wash')]);
    expect(groups.map((g) => g.stage)).toEqual(['wheels', 'wash']);
    expect(groups[1]?.sops.map((s) => s.id)).toEqual(['sop-wash', 'sop-wash-tesla', 'sop-wash-bike']);
    expect(sopsByStage([])).toEqual([]);
  });

  it('writes timers in plain words from the seconds given', () => {
    expect(durationWords(240)).toBe('4 min');
    expect(durationWords(90)).toBe('1 min 30 s');
    expect(durationWords(45)).toBe('45 s');
    expect(durationWords(0)).toBe('');
    expect(timerWords({ kind: 'section', seconds: 240 })).toBe('Section timer: 4 min');
    expect(timerWords({ kind: 'cure', seconds: 600 })).toBe('Set time: 10 min');
    expect(timerWords(undefined)).toBeNull();
  });

  it('reads each step, its STOP line, and its notes, never a superseded step', () => {
    const item = sop('sop-polish', 'polish', 'any', {
      steps: [
        { text: 'Check for shade.', stopIf: 'Sun on the panel' },
        { text: 'Gone.', status: 'superseded' },
        { text: 'Set the dial.', notes: ['One pad per liquid.', { text: 'Lando decides (pending).', status: 'verify' }] },
      ],
    });
    expect(visibleSteps(item)).toHaveLength(2);
    expect(sopSpeechText(item)).toBe('sop-polish. Step 1. Check for shade. Stop if: Sun on the panel. Step 2. Set the dial. Note. One pad per liquid. Lando decides (pending).');
  });
});
