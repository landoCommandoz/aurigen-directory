/**
 * Test fixtures for core tests: valid jobs in any state and price items, each parsed through the
 * real schemas so a fixture can never drift from the contract. Not imported by app code.
 */
import { AnyJob, PriceItem, type AnyJobValue, type JobStateName, type PriceItemItem } from '../../schemas';

export const T0 = '2026-10-10T12:00:00.000Z';

let counter = 0;
/** Deterministic valid v4 UUIDs for fixtures. */
export function fixtureId(): string {
  counter += 1;
  const tail = counter.toString(16).padStart(12, '0');
  return `3f2b8c1e-5d4a-4b6f-9a7e-${tail}`;
}

export const POLISH_SEDAN = 'price-car-full-detail-polish-sedan';
export const WASH_WAX_SEDAN = 'price-car-wash-wax-sedan';
export const INTERIOR_SEDAN = 'price-car-interior-only-sedan';
export const BIKE_DETAIL = 'price-bike-detail-standard';

export function priceItems(): PriceItemItem[] {
  const base = { type: 'priceitem', audience: ['owner'], visibility: 'internal', status: 'house', kind: 'service', unit: 'flat' };
  return [
    PriceItem.parse({ ...base, id: POLISH_SEDAN, title: 'Full Detail + One-Step Polish', vehicleType: 'car', size: 'sedan', amount: 425, touchesPaint: true, founderRate: { amount: 275, slots: 5 } }),
    PriceItem.parse({ ...base, id: WASH_WAX_SEDAN, title: 'Wash & Ceramic Wax', vehicleType: 'car', size: 'sedan', amount: 100, touchesPaint: true }),
    PriceItem.parse({ ...base, id: INTERIOR_SEDAN, title: 'Interior Only', vehicleType: 'car', size: 'sedan', amount: 150, touchesPaint: false }),
    PriceItem.parse({ ...base, id: BIKE_DETAIL, title: 'Bike detail', vehicleType: 'bike', size: 'standard', amount: 120, touchesPaint: true }),
  ];
}

const AFTER_BOOKED: JobStateName[] = ['booked', 'checkedIn', 'inProgress', 'qc', 'delivered', 'debriefed', 'stopped'];
const AFTER_CHECKIN: JobStateName[] = ['checkedIn', 'inProgress', 'qc', 'delivered', 'debriefed', 'stopped'];
const AFTER_START: JobStateName[] = ['inProgress', 'qc', 'delivered', 'debriefed', 'stopped'];

export interface JobOptions {
  packageId?: string;
  vehicleType?: 'car' | 'bike';
  founderRate?: boolean;
  pausedAt?: string | null;
}

/** A job that satisfies the Job schema's per-state invariants. */
export function makeJob(state: JobStateName, opts: JobOptions = {}): AnyJobValue {
  const id = fixtureId();
  if (state === 'draft') {
    return AnyJob.parse({ id, createdAt: T0, updatedAt: T0, state: 'draft', vehicle: {}, packageId: null });
  }
  const packageId = opts.packageId ?? POLISH_SEDAN;
  const founderRate = opts.founderRate ?? packageId === POLISH_SEDAN;
  const amount = founderRate ? 275 : 425;
  const bike = opts.vehicleType === 'bike';
  return AnyJob.parse({
    id,
    createdAt: T0,
    updatedAt: T0,
    state,
    vehicle: bike ? { type: 'bike', size: 'standard' } : { type: 'car', size: 'sedan', make: 'Tesla', model: 'Model Y', isTesla: true },
    packageId,
    quote: {
      lines: [{ priceItemId: packageId, label: 'Package', amount }],
      mobileFee: 0,
      travelFee: 0,
      founderRate,
      founderSlot: founderRate ? 1 : null,
      carsLoggedAtQuote: 0,
      deposit: 50,
      total: amount,
      balanceDue: amount - 50,
      quotedAt: T0,
    },
    deposit: AFTER_BOOKED.includes(state) ? { status: 'paid', at: T0 } : null,
    checkIn: AFTER_CHECKIN.includes(state)
      ? { beforePhotoIds: [fixtureId()], scriptAcknowledgedAt: T0, signaturePhotoId: fixtureId(), photoConsent: false, damageNotes: '', completedAt: T0 }
      : null,
    startedAt: AFTER_START.includes(state) ? T0 : null,
    pausedAt: state === 'inProgress' ? (opts.pausedAt ?? null) : null,
    qc: state === 'delivered' || state === 'debriefed' ? { ticks: { swirls: true }, failedTicks: [], passedAt: T0 } : null,
    deliveredAt: state === 'delivered' || state === 'debriefed' ? T0 : null,
    paidAt: state === 'delivered' || state === 'debriefed' ? T0 : null,
    stoppedAt: state === 'stopped' ? T0 : null,
    stopReason: state === 'stopped' ? 'Paint on the pad' : null,
    canceledAt: state === 'canceled' ? T0 : null,
    cancelReason: state === 'canceled' ? 'Customer walked' : null,
  });
}
