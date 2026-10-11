/**
 * An address no route can match (DEF-02). routes.tsx renders the table for NO_SCREEN_PATH
 * instead, which the "*" route always matches, and puts the real path in the location state;
 * Not found reads it back. Kept apart from routes.tsx so Not found does not import the table.
 */

/** Where an address no route matches is drawn: any plain path the "*" route matches. */
export const NO_SCREEN_PATH = '/no-screen';

/** Location state carried to Not found when the real address matched nothing. */
export interface UnmatchedState {
  unmatchedPath: string;
}

export function isUnmatchedState(value: unknown): value is UnmatchedState {
  return value !== null && typeof value === 'object' && 'unmatchedPath' in value && typeof value.unmatchedPath === 'string';
}
