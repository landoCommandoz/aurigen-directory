/**
 * Fields every runtime record shares (BLUEPRINT section 6). Owner: architect.
 * Times are ISO strings with an offset or Z: new Date().toISOString() is accepted.
 */
import * as z from 'zod';

/** A moment in time: 2026-10-10T14:05:00-06:00 or 2026-10-10T20:05:00.000Z. */
export const At = z.iso.datetime({ offset: true });

/**
 * The Dexie tables, database "masterclass" (BLUEPRINT section 6). The backup file carries every
 * one of them, by these names. Adding a table is a schema change: architect, then the lead.
 */
export const TABLE_NAMES = [
  'jobs',
  'stageTimings',
  'panelReadings',
  'jobPhotos',
  'issues',
  'debriefs',
  'fieldNotes',
  'crewMembers',
  'skillStates',
  'signOffs',
  'quizAttempts',
  'drillLogs',
  'flashcardStates',
  'settings',
  'auditLog',
] as const;
export type TableName = (typeof TABLE_NAMES)[number];

/** A random UUID from crypto.randomUUID(). */
export const RecordId = z.uuid();

/** id, createdAt, updatedAt: on every table except the keyed ones noted in their own schema. */
export const recordShape = {
  id: RecordId,
  createdAt: At,
  updatedAt: At,
};

/** Who and when, for a record that came in through a crew progress file. */
export const ImportedFrom = z.strictObject({
  fileCreatedAt: At,
  importedAt: At,
});

/** A reason a person typed: 3 characters or more (D11 override, Stop, revoke, cancel). */
export const Reason = z.string().trim().min(3, { error: 'Give a reason (3 characters or more)' });

/** A compound key for tables keyed by person and item: "<crewId>:<itemId>". */
export function compoundKey(crewId: string, itemId: string): string {
  return `${crewId}:${itemId}`;
}

export const CompoundKey = z.string().regex(/^[0-9a-f-]{36}:[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  error: 'Key is "<crewId>:<itemId>"',
});
