/**
 * Job records (BLUEPRINT 3.2 and section 6): the Job and its state table, stage timings,
 * photos, issues, debriefs, field notes. Owner: architect. The state machine (app-engineer)
 * writes these; the quote (business-customer, quoteFor(job)) fills Quote.
 */
import * as z from 'zod';
import { ContentType, ID_PATTERN, StageId, idWithPrefix } from './common';
import { At, Reason, RecordId, recordShape } from './records';

export const JOB_STATES = [
  'draft',
  'quoted',
  'booked',
  'checkedIn',
  'inProgress',
  'qc',
  'delivered',
  'debriefed',
  'stopped',
  'canceled',
] as const;
export const JobState = z.enum(JOB_STATES);
export type JobStateName = z.infer<typeof JobState>;

export const JOB_EVENTS = [
  'QUOTE',
  'DELETE',
  'EDIT',
  'BOOK',
  'CANCEL',
  'CHECK_IN_DONE',
  'START',
  'PAUSE',
  'RESUME',
  'STAGES_DONE',
  'STOP',
  'QC_FAIL',
  'DELIVER',
  'DEBRIEF_SAVED',
] as const;
export const JobEvent = z.enum(JOB_EVENTS);
export type JobEventName = z.infer<typeof JobEvent>;

/**
 * The 3.2 table, row for row. "deleted": the draft row is removed in the same transaction; no job
 * is ever stored with that state. Guards (size present, QC passed, test spot or override, Level 4
 * for a crew profile on the polish stage, cutoff, owner pass, reason present) run before this
 * table is read and return a plain-English refusal.
 */
export const jobTransitions = {
  draft: { QUOTE: 'quoted', DELETE: 'deleted' },
  quoted: { BOOK: 'booked', CANCEL: 'canceled', EDIT: 'draft' },
  booked: { CHECK_IN_DONE: 'checkedIn', CANCEL: 'canceled' },
  checkedIn: { START: 'inProgress', CANCEL: 'canceled' },
  /** PAUSE needs pausedAt null; RESUME needs it set. */
  inProgress: { PAUSE: 'inProgress', RESUME: 'inProgress', STAGES_DONE: 'qc', STOP: 'stopped' },
  /** DELIVER refused unless qc.passedAt is set; QC_FAIL sets position to the named stage. */
  qc: { DELIVER: 'delivered', QC_FAIL: 'inProgress' },
  delivered: { DEBRIEF_SAVED: 'debriefed' },
  debriefed: {},
  /** A debrief may be attached without a state change. */
  stopped: {},
  canceled: {},
} as const satisfies Record<JobStateName, Partial<Record<JobEventName, JobStateName | 'deleted'>>>;

/** The next state for an event, or null when the table has no such row (the event is refused). */
export function nextJobState(state: JobStateName, event: JobEventName): JobStateName | 'deleted' | null {
  const row: Partial<Record<JobEventName, JobStateName | 'deleted'>> = jobTransitions[state];
  return row[event] ?? null;
}

/** The one stage the test spot guard and the Level 4 guard check (D11). */
export const POLISH_STAGE_ID = 'polish' as const satisfies z.infer<typeof StageId>;

const CAR_SIZES = ['sedan', 'suv'];
const BIKE_SIZES = ['standard', 'bagger'];

export const VehicleShape = z.strictObject({
  type: z.enum(['car', 'bike']),
  size: z.enum(['sedan', 'suv', 'standard', 'bagger']),
  make: z.string().default(''),
  model: z.string().default(''),
  color: z.string().default(''),
  finish: z.enum(['gloss', 'matte']).default('gloss'),
  isTesla: z.boolean().default(false),
});
export const Vehicle = VehicleShape.refine(
  (v) => (v.type === 'car' ? CAR_SIZES.includes(v.size) : BIKE_SIZES.includes(v.size)),
  { error: 'A car is sedan or suv; a bike is standard or bagger', path: ['size'] },
);
/** Every vehicle field is optional while the job is a Draft. */
export const DraftVehicle = VehicleShape.partial();

const close = (a: number, b: number) => Math.abs(a - b) < 0.005;

export const QuoteLine = z.strictObject({
  priceItemId: idWithPrefix('price'),
  label: z.string().min(1),
  /** null only for a unit "quote" item (two-step); never rendered as a number. */
  amount: z.number().min(0).nullable(),
});

/** The quote, frozen into the job at QUOTE. The counters are read once, here, and never again. */
export const Quote = z
  .strictObject({
    lines: z.array(QuoteLine).min(1),
    /** 30 when mobile, else 0 (knowledge base 15.1). */
    mobileFee: z.number().min(0),
    /** Miles outside the zone times 1.50 (knowledge base 15.1). */
    travelFee: z.number().min(0),
    founderRate: z.boolean(),
    founderSlot: z.number().int().min(1).nullable(),
    carsLoggedAtQuote: z.number().int().min(0),
    deposit: z.number().min(0),
    total: z.number().min(0),
    balanceDue: z.number().min(0),
    quotedAt: At,
  })
  .refine(
    (q) => close(q.total, q.lines.reduce((sum, l) => sum + (l.amount ?? 0), 0) + q.mobileFee + q.travelFee),
    { error: 'total must equal the priced lines plus the mobile and travel fees', path: ['total'] },
  )
  .refine((q) => close(q.balanceDue, Math.max(0, q.total - q.deposit)), {
    error: 'balanceDue must equal total minus the deposit',
    path: ['balanceDue'],
  })
  .refine((q) => (q.founderSlot === null) === !q.founderRate, {
    error: 'A founder slot is held exactly when the founder rate applies',
    path: ['founderSlot'],
  });
export type QuoteValue = z.infer<typeof Quote>;

export const CheckIn = z.strictObject({
  beforePhotoIds: z.array(RecordId).default([]),
  scriptAcknowledgedAt: At.nullable().default(null),
  signaturePhotoId: RecordId.nullable().default(null),
  photoConsent: z.boolean().default(false),
  damageNotes: z.string().default(''),
  completedAt: At.nullable().default(null),
});

/** The test spot (knowledge base 8.5). rung is the ladder rung that won, 1 to 3 (BLUEPRINT 2.3). */
export const TestSpot = z.strictObject({
  panelId: z.string().regex(ID_PATTERN),
  rung: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  /** The words on the pad ladder card for that rung. */
  combo: z.string().min(1),
  result: z.enum(['swirlsGone', 'stillSwirled', 'tooDeep']),
  loggedAt: At,
});

const Customer = z.strictObject({ firstName: z.string(), phone: z.string() }).partial().nullable();

export const DraftJob = z.strictObject({
  ...recordShape,
  state: z.literal('draft'),
  vehicle: DraftVehicle,
  packageId: idWithPrefix('price').nullable(),
  addOnIds: z.array(idWithPrefix('price')).default([]),
  mobile: z.boolean().default(false),
  milesOutsideZone: z.number().min(0).default(0),
  customer: Customer.default(null),
});
export type DraftJobValue = z.infer<typeof DraftJob>;

/** From Quoted on. The invariants below make a half-written job fail to parse (import and tests). */
export const JobRecord = z.strictObject({
  ...recordShape,
  state: JobState.exclude(['draft']),
  vehicle: Vehicle,
  packageId: idWithPrefix('price'),
  addOnIds: z.array(idWithPrefix('price')).default([]),
  mobile: z.boolean().default(false),
  milesOutsideZone: z.number().min(0).default(0),
  quote: Quote,
  customer: Customer.default(null),
  /** Recorded at BOOK: paid, or waived with a reason (BLUEPRINT 3.2). */
  deposit: z
    .strictObject({ status: z.enum(['paid', 'waived']), reason: Reason.optional(), at: At })
    .refine((d) => d.status === 'paid' || d.reason !== undefined, { error: 'A waived deposit needs a reason', path: ['reason'] })
    .nullable()
    .default(null),
  checkIn: CheckIn.nullable().default(null),
  testSpot: TestSpot.nullable().default(null),
  polishOverride: z.strictObject({ reason: Reason, byCrewId: RecordId, at: At }).nullable().default(null),
  cutoffAt: At.nullable().default(null),
  startedAt: At.nullable().default(null),
  pausedAt: At.nullable().default(null),
  pausedMs: z.number().int().min(0).default(0),
  position: z
    .strictObject({
      stageId: StageId,
      stepIndex: z.number().int().min(0),
      square: z.number().int().min(0),
      set: z.number().int().min(0),
    })
    .nullable()
    .default(null),
  qc: z
    .strictObject({
      ticks: z.record(z.string(), z.boolean()),
      failedTicks: z.array(z.strictObject({ tick: z.string(), returnToStageId: StageId, at: At })).default([]),
      passedAt: At.nullable(),
    })
    .nullable()
    .default(null),
  deliveredAt: At.nullable().default(null),
  paidAt: At.nullable().default(null),
  stoppedAt: At.nullable().default(null),
  stopReason: Reason.nullable().default(null),
  canceledAt: At.nullable().default(null),
  cancelReason: Reason.nullable().default(null),
  /** Set at Cancel when a deposit was paid: kept under policies 3 and 4, or returned. */
  depositKept: z.boolean().nullable().default(null),
});

const BOOKED_ON = ['booked', 'checkedIn', 'inProgress', 'qc', 'delivered', 'debriefed', 'stopped'];
const CHECKED_IN_ON = ['checkedIn', 'inProgress', 'qc', 'delivered', 'debriefed', 'stopped'];
const STARTED_ON = ['inProgress', 'qc', 'delivered', 'debriefed', 'stopped'];
const DELIVERED_ON = ['delivered', 'debriefed'];

export const Job = JobRecord.superRefine((j, ctx) => {
  const need = (ok: boolean, path: string, message: string) => {
    if (!ok) ctx.addIssue({ code: 'custom', path: [path], message });
  };
  if (BOOKED_ON.includes(j.state)) need(j.deposit !== null, 'deposit', `A ${j.state} job has its deposit recorded`);
  if (CHECKED_IN_ON.includes(j.state)) {
    const c = j.checkIn;
    need(
      c !== null && c.completedAt !== null && c.beforePhotoIds.length > 0 && c.signaturePhotoId !== null && c.scriptAcknowledgedAt !== null,
      'checkIn',
      'Check-in needs a before photo, the script acknowledged, and a signature (house rule 13)',
    );
  }
  if (STARTED_ON.includes(j.state)) need(j.startedAt !== null, 'startedAt', `A ${j.state} job has a start time`);
  if (DELIVERED_ON.includes(j.state)) {
    need(j.qc?.passedAt != null, 'qc', 'No Delivered without a QC pass');
    need(j.deliveredAt !== null, 'deliveredAt', 'A delivered job has a delivery time');
    need(j.paidAt !== null, 'paidAt', 'Payment before keys (policy 2)');
  }
  if (j.state === 'stopped') need(j.stoppedAt !== null && j.stopReason !== null, 'stopReason', 'A stopped job has a time and a reason');
  if (j.state === 'canceled') need(j.canceledAt !== null && j.cancelReason !== null, 'cancelReason', 'A canceled job has a time and a reason');
  need(j.pausedAt === null || j.state === 'inProgress', 'pausedAt', 'Only a job in progress can be paused');
});
export type JobValue = z.infer<typeof Job>;

/** What the jobs table holds: a Draft, or a Job from Quoted on. */
export const AnyJob = z.discriminatedUnion('state', [DraftJob, Job]);
export type AnyJobValue = z.infer<typeof AnyJob>;

/** One stage run. Timers store stamps, never a countdown (BLUEPRINT section 3). */
export const StageTiming = z.strictObject({
  ...recordShape,
  jobId: RecordId,
  stageId: StageId,
  /** The active profile when the stage started; the Level 4 guard and the debrief read it. */
  runByCrewId: RecordId,
  plannedMinutes: z.number().int().positive().nullable().default(null),
  startedAt: At,
  endedAt: At.nullable().default(null),
  pausedMs: z.number().int().min(0).default(0),
  /** The heartbeat, written every 15 seconds while the app is awake. */
  lastTick: At,
  /** Set when the clock read earlier than lastTick: the timer holds here until the next tap. */
  heldElapsedMs: z.number().int().min(0).nullable().default(null),
  sections: z
    .array(z.strictObject({ index: z.number().int().min(0), startedAt: At, endedAt: At.nullable() }))
    .default([]),
});
export type StageTimingValue = z.infer<typeof StageTiming>;

export const PHOTO_KINDS = ['before', 'after', 'damage', 'testSpot', 'signature'] as const;

/** Photo metadata shared by the database row and the backup row. */
export const jobPhotoShape = {
  ...recordShape,
  jobId: RecordId,
  kind: z.enum(PHOTO_KINDS),
  panelId: z.string().regex(ID_PATTERN).nullable().default(null),
  /** JPEG for photos; PNG for the signature (D6). */
  mime: z.enum(['image/jpeg', 'image/png']),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  bytes: z.number().int().positive(),
  takenAt: At,
};
export const JobPhoto = z.strictObject({ ...jobPhotoShape, blob: z.instanceof(Blob) });
export type JobPhotoValue = z.infer<typeof JobPhoto>;

/** Photo cap per job in v1 (D6); raised only in Settings behind the PIN. */
export const DEFAULT_PHOTO_CAP = 24;

export const Issue = z.strictObject({
  ...recordShape,
  jobId: RecordId,
  fixNodeId: idWithPrefix('fix'),
  stageId: StageId.nullable().default(null),
  note: z.string().default(''),
  at: At,
});

export const Debrief = z.strictObject({
  ...recordShape,
  jobId: RecordId,
  timePerStage: z
    .array(z.strictObject({ stageId: StageId, plannedMinutes: z.number().min(0).nullable(), actualMinutes: z.number().min(0) }))
    .default([]),
  productsUsed: z.array(idWithPrefix('product')).default([]),
  issueIds: z.array(RecordId).default([]),
  photosTaken: z.number().int().min(0).default(0),
  rebookOffered: z.boolean().default(false),
  reviewAsked: z.boolean().default(false),
  drillNext: idWithPrefix('drill').nullable().default(null),
  note: z.string().default(''),
  at: At,
});

export const FieldNote = z.strictObject({
  ...recordShape,
  text: z.string().min(1),
  jobId: RecordId.nullable().default(null),
  stageId: StageId.nullable().default(null),
  status: z.enum(['inbox', 'promoted', 'dismissed']).default('inbox'),
  promotedTo: z.strictObject({ type: ContentType, id: z.string().regex(ID_PATTERN) }).nullable().default(null),
  at: At,
});
