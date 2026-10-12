/**
 * Academy content: lessons (content-curator); drills, quiz questions, flashcards, and
 * sign-off criteria (learning-designer).
 * Owner of this file: architect. Layout and rules: src/schemas/README.md.
 */
import * as z from 'zod';
import { Base, KbRef, Line, QuizId, SkillId, Status, idWithPrefix } from './common';

/**
 * A lesson. Markdown file; the body is the "why" section (the deep part).
 * Levels 0 to 4 are full lessons in v1; 5 to 8 are outlines (outline: true).
 * A lesson names its skillId and nothing more: the pass mark, drill minimum, and
 * prerequisites live only in content/academy/signoff/<skillId>.yaml (OWNERSHIP).
 */
export const Lesson = Base.extend({
  id: idWithPrefix('lesson'),
  type: z.literal('lesson'),
  level: z.number().int().min(0).max(8),
  /** Position within its level, from 1. */
  order: z.number().int().min(1),
  /** Markdown, written as the file body. */
  why: z.string().min(1),
  steps: z.array(Line).min(1),
  numbers: z
    .array(
      z.strictObject({
        label: z.string().min(1),
        value: z.string().min(1),
        kbRef: KbRef.optional(),
        status: Status.optional(),
      }),
    )
    .default([]),
  mistakes: z.array(Line).default([]),
  drillIds: z.array(idWithPrefix('drill')).default([]),
  quizId: QuizId.optional(),
  skillId: SkillId.optional(),
  outline: z.boolean().default(false),
});
export type LessonItem = z.infer<typeof Lesson>;

/**
 * A drill: real practice with a number where there is one (scale pressure, marker-line turns,
 * timed 2 x 2 ft sections). Markdown file; the optional body goes in `body`.
 * repsPerSession is how many reps one logged session holds. It is NOT the sign-off drill
 * minimum, which lives only in the sign-off criteria file.
 */
export const Drill = Base.extend({
  id: idWithPrefix('drill'),
  type: z.literal('drill'),
  needs: z.array(z.string().min(1)).default([]),
  instructions: z.array(Line).min(1),
  logField: z.strictObject({ label: z.string().min(1), unit: z.string().min(1) }).optional(),
  repsPerSession: z.number().int().min(1).default(1),
  /**
   * What one session must show to count as a pass (added 2026-10-11, Phase 2), in the logField
   * unit where there is one. Numbers exactly as the knowledge base writes them; never a tolerance
   * it does not give. Each line may carry its own status. The drill minimum still counts logged
   * sessions, passed or not; v1 records no pass per session (DrillLog has no such field).
   */
  passMark: z.array(Line).default([]),
  body: z.string().default(''),
});
export type DrillItem = z.infer<typeof Drill>;

/**
 * One quiz question. YAML file in content/academy/quizzes/.
 * A quiz is the set of questions that share a quizId. A question's id is its quizId plus
 * "-" plus a number: quiz-l4-machine-01 belongs to quiz-l4-machine.
 */
export const QuizQuestion = Base.extend({
  id: idWithPrefix('quiz'),
  type: z.literal('quizquestion'),
  quizId: QuizId,
  prompt: z.string().min(1),
  choices: z.array(z.string().min(1)).min(2).max(6),
  /** Index into choices, from 0. */
  correctIndex: z.number().int().min(0),
  explanation: z.string().min(1),
  scenario: z.boolean().default(true),
})
  .refine((q) => q.correctIndex < q.choices.length, {
    error: 'correctIndex points past the last choice (it counts from 0)',
    path: ['correctIndex'],
  })
  .refine((q) => q.id.startsWith(`${q.quizId}-`), {
    error: 'A question id is its quizId, a hyphen, and a number (quiz-l4-machine-01)',
    path: ['id'],
  });
export type QuizQuestionItem = z.infer<typeof QuizQuestion>;

/** A flashcard for the numbers (bands, mixes, speeds, times, prices). YAML file. */
export const Flashcard = Base.extend({
  id: idWithPrefix('flash'),
  type: z.literal('flashcard'),
  /** Kebab-case deck name: bands, mixes, speeds, times, prices. */
  deck: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  front: z.string().min(1),
  back: z.string().min(1),
});
export type FlashcardItem = z.infer<typeof Flashcard>;

/** What a sign-off can unlock in the Job Runner. "polish-stage" is the Level 4 gate (D11). */
export const SIGNOFF_GATES = ['polish-stage'] as const;
export const SignOffGate = z.enum(SIGNOFF_GATES);

/** house: Lando accepted the numbers. verify: a proposal (the default). */
export const SIGNOFF_STATUSES = ['house', 'verify'] as const;

/**
 * Not a content item. One YAML file per skill: content/academy/signoff/<skillId>.yaml.
 * The only place a pass mark, a drill minimum, or prerequisites are written (learning-designer).
 * drillMinimum counts logged drill sessions of the drills listed in the lesson's drillIds.
 * gates: at most one file in the whole set may gate the polish stage; it must be the Level 4
 * machine polishing skill. If none does, the Runner treats every crew member as not cleared.
 */
export const SignOffCriteria = z.strictObject({
  skillId: SkillId,
  title: z.string().min(1).max(120),
  lessonId: idWithPrefix('lesson'),
  quizId: QuizId,
  /** Percent, 0 to 100. */
  quizPassScore: z.number().min(0).max(100),
  drillMinimum: z.number().int().min(0),
  prerequisites: z.array(SkillId).default([]),
  gates: z.array(SignOffGate).default([]),
  /**
   * What the owner watches the crew member do before entering the PIN (added 2026-10-11, Phase 2;
   * BLUEPRINT 2.4: a sign-off is given while Lando watches). One observable action per line; a line
   * may carry its own status.
   */
  ownerChecks: z.array(Line).default([]),
  /**
   * Whether Lando accepted quizPassScore and drillMinimum (added 2026-10-11, Phase 2). The knowledge
   * base sets neither, so a new file is a proposal: verify, the default. house only after Lando's
   * word is recorded (BLUEPRINT 12 or DECISIONS). The numbers apply either way, so the polish-stage
   * gate never switches off; verify only adds the unverified badge on the sign-off screen.
   */
  status: z.enum(SIGNOFF_STATUSES).default('verify'),
});
export type SignOffCriteriaItem = z.infer<typeof SignOffCriteria>;
