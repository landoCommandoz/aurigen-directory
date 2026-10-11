/**
 * True while a job stage is running (a job in progress and not paused). The update banner is
 * suppressed then (BLUEPRINT 3.5). There is no Job Runner until Phase 3, but an imported backup
 * can hold a job in progress, so the shell reads the jobs table live. A storage failure reads
 * as "nothing running": the update itself is still refused by applyUpdateWhenIdle() if needed.
 */
import { useLiveQuery } from 'dexie-react-hooks';
import { getDb } from '../core/db';

async function anyStageRunning(): Promise<boolean> {
  try {
    const count = await getDb()
      .jobs.where('state')
      .equals('inProgress')
      .filter((job) => job.state === 'inProgress' && job.pausedAt === null)
      .count();
    return count > 0;
  } catch {
    return false;
  }
}

export function useJobRunning(): boolean {
  return useLiveQuery(anyStageRunning, [], false) === true;
}
