/**
 * Crew and Academy records (BLUEPRINT 3.1 and section 6): crew profiles, skill states and their
 * table, sign-offs, quiz attempts, drill logs, flashcard states. Owner: architect.
 */
import * as z from 'zod';
import { QuizId, SkillId, idWithPrefix } from './common';
import { At, CompoundKey, ImportedFrom, Reason, RecordId, recordShape } from './records';

export const CREW_ROLES = ['owner', 'ops', 'crew'] as const;
export const CrewRole = z.enum(CREW_ROLES);

export const CrewMember = z.strictObject({
  ...recordShape,
  name: z.string().trim().min(1).max(40),
  role: CrewRole,
  active: z.boolean().default(true),
});
export type CrewMemberValue = z.infer<typeof CrewMember>;

export const SKILL_STATES = ['locked', 'learning', 'practicing', 'readyForSignOff', 'signedOff', 'revoked'] as const;
/** The Skill state enum (BLUEPRINT 3.1). The record that holds it is SkillState. */
export const SkillStateEnum = z.enum(SKILL_STATES);
export type SkillStateName = z.infer<typeof SkillStateEnum>;

export const SKILL_EVENTS = ['OPEN_LESSON', 'LOG_DRILL', 'READINESS_MET', 'SIGN_OFF', 'REVOKE'] as const;
export const SkillEvent = z.enum(SKILL_EVENTS);
export type SkillEventName = z.infer<typeof SkillEvent>;

/**
 * The 3.1 table. OPEN_LESSON needs every prerequisite Signed off. READINESS_MET is recomputed
 * after every quiz or drill write and after every crew progress import (quiz passed at or above
 * the pass mark AND the drill minimum met, in either order). SIGN_OFF and REVOKE need the owner
 * pass and are refused on a study phone. A revoke means the quiz is retaken.
 */
export const skillTransitions = {
  locked: { OPEN_LESSON: 'learning' },
  learning: { LOG_DRILL: 'practicing' },
  practicing: { READINESS_MET: 'readyForSignOff' },
  readyForSignOff: { SIGN_OFF: 'signedOff' },
  signedOff: { REVOKE: 'revoked' },
  revoked: { LOG_DRILL: 'practicing' },
} as const satisfies Record<SkillStateName, Partial<Record<SkillEventName, SkillStateName>>>;

export function nextSkillState(state: SkillStateName, event: SkillEventName): SkillStateName | null {
  const row: Partial<Record<SkillEventName, SkillStateName>> = skillTransitions[state];
  return row[event] ?? null;
}

/** Keyed "<crewId>:<skillId>" (compoundKey in records.ts). */
export const SkillState = z.strictObject({
  id: CompoundKey,
  createdAt: At,
  updatedAt: At,
  crewId: RecordId,
  skillId: SkillId,
  state: SkillStateEnum,
  lessonOpenedAt: At.nullable().default(null),
  drillsLogged: z.number().int().min(0).default(0),
  quizBestScore: z.number().min(0).max(100).nullable().default(null),
  readyAt: At.nullable().default(null),
  signOffId: RecordId.nullable().default(null),
  revokedAt: At.nullable().default(null),
  /** A prerequisite was revoked after this skill was signed off. No cascade: shown, not changed. */
  prerequisiteRevoked: z.boolean().default(false),
});
export type SkillStateValue = z.infer<typeof SkillState>;

/** Written only with an owner pass, only on a shop phone. A crew progress file never carries one. */
export const SignOff = z
  .strictObject({
    ...recordShape,
    crewId: RecordId,
    skillId: SkillId,
    action: z.enum(['signoff', 'revoke']),
    reason: Reason.nullable().default(null),
    /** When the owner pass that allowed this write was issued. */
    ownerVerifiedAt: At,
    /** Set on every sign-off and override after a PIN reset, until the owner confirms it (D4). */
    needsRecheck: z.boolean().default(false),
    at: At,
  })
  .refine((s) => s.action === 'signoff' || s.reason !== null, {
    error: 'A revoke needs a reason',
    path: ['reason'],
  });
export type SignOffValue = z.infer<typeof SignOff>;

export const QuizAttempt = z
  .strictObject({
    ...recordShape,
    crewId: RecordId,
    quizId: QuizId,
    /** Saved as each answer is given, so an attempt survives a refresh. */
    answers: z
      .array(z.strictObject({ questionId: idWithPrefix('quiz'), choiceIndex: z.number().int().min(0), at: At }))
      .default([]),
    startedAt: At,
    submittedAt: At.nullable().default(null),
    /** Percent, set at submit. */
    score: z.number().min(0).max(100).nullable().default(null),
    passed: z.boolean().nullable().default(null),
    importedFrom: ImportedFrom.optional(),
  })
  .refine((q) => (q.submittedAt === null) === (q.score === null && q.passed === null), {
    error: 'score and passed are set exactly when the attempt is submitted',
    path: ['submittedAt'],
  });
export type QuizAttemptValue = z.infer<typeof QuizAttempt>;

/** One logged practice session of a drill. */
export const DrillLog = z.strictObject({
  ...recordShape,
  crewId: RecordId,
  drillId: idWithPrefix('drill'),
  reps: z.number().int().min(1).default(1),
  /** The number the drill asks for, in its logField unit (pounds on the scale, seconds per section). */
  value: z.number().nullable().default(null),
  note: z.string().default(''),
  at: At,
  importedFrom: ImportedFrom.optional(),
});
export type DrillLogValue = z.infer<typeof DrillLog>;

/** Spaced repetition, SM-2 style. Keyed "<crewId>:<cardId>". */
export const FlashcardState = z.strictObject({
  id: CompoundKey,
  createdAt: At,
  updatedAt: At,
  crewId: RecordId,
  cardId: idWithPrefix('flash'),
  due: z.iso.date(),
  intervalDays: z.number().int().min(0).default(0),
  ease: z.number().min(1.3).default(2.5),
  reps: z.number().int().min(0).default(0),
  lapses: z.number().int().min(0).default(0),
  lastReviewedAt: At.nullable().default(null),
});
export type FlashcardStateValue = z.infer<typeof FlashcardState>;
