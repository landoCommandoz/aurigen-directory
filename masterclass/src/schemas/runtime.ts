/**
 * Runtime records: what the Dexie database "masterclass" holds on the device (BLUEPRINT section 6).
 * One schema per table, so the same rules validate a write, an import, and a test fixture.
 * Owner: architect. db.ts (app-engineer) declares the tables and indexes from TABLE_NAMES.
 */
import * as z from 'zod';
import { AnyJob, Debrief, FieldNote, Issue, JobPhoto, StageTiming } from './runtime-job';
import { CrewMember, DrillLog, FlashcardState, QuizAttempt, SignOff, SkillState } from './runtime-crew';
import { AuditLog, Settings } from './runtime-device';
import { PanelReading } from './readings';
import type { TableName } from './records';

export * from './records';
export * from './runtime-job';
export * from './runtime-crew';
export * from './runtime-device';
export * from './readings';

/** The schema each table's rows must satisfy. jobs holds Drafts and Jobs; settings holds one row. */
export const TABLE_SCHEMAS = {
  jobs: AnyJob,
  stageTimings: StageTiming,
  panelReadings: PanelReading,
  jobPhotos: JobPhoto,
  issues: Issue,
  debriefs: Debrief,
  fieldNotes: FieldNote,
  crewMembers: CrewMember,
  skillStates: SkillState,
  signOffs: SignOff,
  quizAttempts: QuizAttempt,
  drillLogs: DrillLog,
  flashcardStates: FlashcardState,
  settings: Settings,
  auditLog: AuditLog,
} as const satisfies Record<TableName, z.ZodType>;
