/**
 * Seeded job logs (OWNERSHIP: tests/fixtures holds 24 and 25 cars, 4 and 5 founder jobs, a 9999
 * reading). Every job is parsed through the real AnyJob schema, so a fixture cannot drift from
 * the contract. Price items are fixtures too: the business content arrives in Phase 4.
 * Not imported by app code.
 */
import { AnyJob, PriceItem, type AnyJobValue, type JobStateName, type PriceItemItem } from '../../src/schemas';

export const T0 = '2026-10-10T12:00:00.000Z';

let n = 0;
/** Deterministic valid v4 UUIDs. */
export function qaId(): string {
  n += 1;
  return `7c1e2a3b-4d5e-4f60-8a71-${n.toString(16).padStart(12, '0')}`;
}

export const PKG = {
  polishSedan: 'price-car-full-detail-polish-sedan',
  fullDetailSedan: 'price-car-full-detail-sedan',
  washWaxSedan: 'price-car-wash-wax-sedan',
  interiorSedan: 'price-car-interior-only-sedan',
  bike: 'price-bike-detail-standard',
} as const;

export function qaPriceItems(): PriceItemItem[] {
  const service = { type: 'priceitem', audience: ['owner'], visibility: 'internal', status: 'house', kind: 'service', unit: 'flat' };
  return [
    PriceItem.parse({ ...service, id: PKG.polishSedan, title: 'Full Detail + One-Step Polish', vehicleType: 'car', size: 'sedan', amount: 425, touchesPaint: true, founderRate: { amount: 275, slots: 5 } }),
    PriceItem.parse({ ...service, id: PKG.fullDetailSedan, title: 'Full Detail (no polish)', vehicleType: 'car', size: 'sedan', amount: 250, touchesPaint: true }),
    PriceItem.parse({ ...service, id: PKG.washWaxSedan, title: 'Wash & Ceramic Wax', vehicleType: 'car', size: 'sedan', amount: 100, touchesPaint: true }),
    PriceItem.parse({ ...service, id: PKG.interiorSedan, title: 'Interior Only', vehicleType: 'car', size: 'sedan', amount: 150, touchesPaint: false }),
    PriceItem.parse({ ...service, id: PKG.bike, title: 'Bike detail', vehicleType: 'bike', size: 'standard', amount: 120, touchesPaint: true }),
  ];
}

const AFTER_BOOKED: JobStateName[] = ['booked', 'checkedIn', 'inProgress', 'qc', 'delivered', 'debriefed', 'stopped'];
const AFTER_CHECKIN: JobStateName[] = ['checkedIn', 'inProgress', 'qc', 'delivered', 'debriefed', 'stopped'];
const AFTER_START: JobStateName[] = ['inProgress', 'qc', 'delivered', 'debriefed', 'stopped'];

export function qaJob(state: JobStateName, opts: { packageId?: string; bike?: boolean } = {}): AnyJobValue {
  const id = qaId();
  if (state === 'draft') return AnyJob.parse({ id, createdAt: T0, updatedAt: T0, state: 'draft', vehicle: {}, packageId: null });
  const packageId = opts.packageId ?? PKG.washWaxSedan;
  const founderRate = packageId === PKG.polishSedan;
  const amount = founderRate ? 275 : 100;
  const finished = state === 'delivered' || state === 'debriefed';
  return AnyJob.parse({
    id,
    createdAt: T0,
    updatedAt: T0,
    state,
    vehicle: opts.bike === true ? { type: 'bike', size: 'standard' } : { type: 'car', size: 'sedan', make: 'Tesla', model: 'Model Y', isTesla: true },
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
      ? { beforePhotoIds: [qaId()], scriptAcknowledgedAt: T0, signaturePhotoId: qaId(), photoConsent: false, damageNotes: '', completedAt: T0 }
      : null,
    startedAt: AFTER_START.includes(state) ? T0 : null,
    pausedAt: null,
    qc: finished ? { ticks: { swirls: true }, failedTicks: [], passedAt: T0 } : null,
    deliveredAt: finished ? T0 : null,
    paidAt: finished ? T0 : null,
    stoppedAt: state === 'stopped' ? T0 : null,
    stopReason: state === 'stopped' ? 'Paint on the pad' : null,
    canceledAt: state === 'canceled' ? T0 : null,
    cancelReason: state === 'canceled' ? 'Customer walked' : null,
  });
}

/**
 * A log of `paintCars` delivered paint-touching car jobs, plus jobs that must never count: one
 * Delivered Interior Only, one Delivered bike, one Stopped and one Canceled wash, and one wash
 * still In progress (BLUEPRINT 3.8).
 */
export function carsLog(paintCars: number): AnyJobValue[] {
  const counted = Array.from({ length: paintCars }, (_, i) =>
    qaJob(i % 3 === 0 ? 'debriefed' : 'delivered', { packageId: [PKG.washWaxSedan, PKG.fullDetailSedan][i % 2] }),
  );
  return [
    ...counted,
    qaJob('delivered', { packageId: PKG.interiorSedan }),
    qaJob('delivered', { packageId: PKG.bike, bike: true }),
    qaJob('stopped', { packageId: PKG.washWaxSedan }),
    qaJob('canceled', { packageId: PKG.washWaxSedan }),
    qaJob('inProgress', { packageId: PKG.washWaxSedan }),
  ];
}

/** `count` machine-polish jobs holding a founder's slot (Booked), plus one Canceled that released its slot. */
export function founderLog(count: number): AnyJobValue[] {
  return [...Array.from({ length: count }, () => qaJob('booked', { packageId: PKG.polishSedan })), qaJob('canceled', { packageId: PKG.polishSedan })];
}

/** The out-of-range gauge readings BLUEPRINT 3.8 lists, plus a few more a thumb can type. */
export const BAD_READINGS: unknown[] = [0, 19, 1000, 9999, '', 'abc', -5, '-5', '9999', ' ', '1e3', '0x50', 'NaN', Number.NaN, Number.POSITIVE_INFINITY, null, undefined, '85 um', '8 5'];
export const GOOD_READINGS: Array<[unknown, number]> = [[20, 20], [999, 999], ['85', 85], [' 120 ', 120], ['99.5', 99.5], [100, 100]];
