/**
 * The business counters (BLUEPRINT 3.3), derived from the job log every time they are read,
 * never stored by hand. Pure functions: the backup screen, the dashboard, and the quote
 * (business-customer's quoteFor) all read the same numbers.
 *
 * Cars logged, Lando 2026-10-10 [HOUSE]: only jobs that touch paint count. A job counts when it
 * reached Delivered or Debriefed, is a car, and its package has touchesPaint. Bikes, Stopped,
 * Canceled, and unfinished jobs never count; add-ons never change the answer.
 */
import type { AnyJobValue, JobValue, PriceItemItem } from '../schemas';

const FINISHED = new Set<JobValue['state']>(['delivered', 'debriefed']);
/** States in which a machine-polish job holds its founder's slot (held at Booked; released by Cancel, Edit, Stop). */
const SLOT_HELD = new Set<JobValue['state']>(['booked', 'checkedIn', 'inProgress', 'qc', 'delivered', 'debriefed']);

function isJob(job: AnyJobValue): job is JobValue {
  return job.state !== 'draft';
}

export function countsTowardTwentyFive(job: AnyJobValue, pkg: PriceItemItem | undefined): boolean {
  return isJob(job) && FINISHED.has(job.state) && job.vehicle.type === 'car' && pkg?.touchesPaint === true;
}

/** Cars logged toward 25: the seed ("cars logged before this app", set behind the PIN) plus counting jobs. */
export function carsLogged(jobs: readonly AnyJobValue[], priceItems: readonly PriceItemItem[], seed: number): number {
  const byId = new Map(priceItems.map((p) => [p.id, p]));
  return seed + jobs.filter((job) => isJob(job) && countsTowardTwentyFive(job, byId.get(job.packageId))).length;
}

/** A machine-polish package carries the founder's rate (knowledge base 15.1; the one-step polish packages). */
export function isMachinePolishItem(item: PriceItemItem | undefined): boolean {
  return item?.founderRate !== undefined;
}

/** Machine-polish jobs sold: a polish package or line, in Booked through Debriefed (BLUEPRINT 3.3). */
export function machinePolishJobsSold(jobs: readonly AnyJobValue[], priceItems: readonly PriceItemItem[]): number {
  const byId = new Map(priceItems.map((p) => [p.id, p]));
  return jobs.filter(
    (job) =>
      isJob(job) &&
      SLOT_HELD.has(job.state) &&
      (isMachinePolishItem(byId.get(job.packageId)) || job.quote.lines.some((l) => isMachinePolishItem(byId.get(l.priceItemId)))),
  ).length;
}

/** Founder's slots in use: jobs holding a slot (frozen in the quote) in a slot-holding state. */
export function founderSlotsUsed(jobs: readonly AnyJobValue[]): number {
  return jobs.filter((job) => isJob(job) && SLOT_HELD.has(job.state) && job.quote.founderRate).length;
}

export interface CounterSummary {
  jobs: number;
  carsLogged: number;
  founderSlotsUsed: number;
  machinePolishJobsSold: number;
}

export function summarizeCounters(jobs: readonly AnyJobValue[], priceItems: readonly PriceItemItem[], seed: number): CounterSummary {
  return {
    jobs: jobs.length,
    carsLogged: carsLogged(jobs, priceItems, seed),
    founderSlotsUsed: founderSlotsUsed(jobs),
    machinePolishJobsSold: machinePolishJobsSold(jobs, priceItems),
  };
}
