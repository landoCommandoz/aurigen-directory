import { describe, expect, it } from 'vitest';
import { config } from '../app/config';
import {
  AnyJob,
  ContentItem,
  PanelReading,
  PriceItem,
  QuickCard,
  TABLE_NAMES,
  assertCustomerRenderable,
  backupReminderDue,
  bandFor,
  canBecomeShop,
  checkContentSet,
  defaultSettings,
  nextJobState,
  panelFlags,
  parseAppConfig,
  parseBackupFile,
  parseCrewProgressFile,
  parseGaugeInput,
  setupStep,
  type ContentItemValue,
} from './index';

const NOW = '2026-10-10T12:00:00.000Z';
const ID_A = '3f2b8c1e-5d4a-4b6f-9a7e-1c2d3e4f5a6b';
const ID_B = '8a1d2c3b-4e5f-4a6b-8c7d-9e0f1a2b3c4d';

const card = {
  id: 'card-bucket-mix',
  type: 'quickcard',
  title: 'Pre-polish bucket mix',
  audience: ['owner', 'crew'],
  visibility: 'internal',
  status: 'house',
  kbRef: '4',
  kind: 'mix',
  rows: [{ label: 'Water', value: '4 gal' }, { label: 'CG Citrus Wash & Gloss', value: '4 oz' }],
};

const price = (extra: Record<string, unknown>) => ({
  id: 'price-two-step-sedan',
  type: 'priceitem',
  title: 'Two-step correction',
  audience: ['owner'],
  visibility: 'internal',
  status: 'verify',
  kind: 'service',
  vehicleType: 'car',
  size: 'sedan',
  ...extra,
});

const reading = (readings: unknown[], band = 'full-ladder') => ({
  id: ID_A,
  createdAt: NOW,
  updatedAt: NOW,
  jobId: ID_B,
  panelId: 'hood',
  readings,
  band,
  flags: { repaint: false, thin: false },
  takenAt: NOW,
});

function emptyBackup(version: unknown = 1) {
  const tables: Record<string, unknown[]> = Object.fromEntries(TABLE_NAMES.map((n) => [n, []]));
  tables.settings = [defaultSettings(NOW)];
  return {
    kind: 'masterclass-backup',
    version,
    createdAt: NOW,
    appVersion: '0.1.0',
    deviceRole: 'study',
    photos: 'omitted',
    tables,
    checksum: { algorithm: 'SHA-256', value: 'a'.repeat(64) },
  };
}

describe('content schemas', () => {
  it('parses a valid QuickCard, with defaults applied', () => {
    const parsed = QuickCard.parse(card);
    expect(parsed.version).toBe(1);
    expect(parsed.related).toEqual([]);
    expect(ContentItem.parse(card).type).toBe('quickcard');
  });

  it('refuses an id without its type prefix, and an unknown field', () => {
    expect(QuickCard.safeParse({ ...card, id: 'bucket-mix' }).success).toBe(false);
    expect(QuickCard.safeParse({ ...card, color: 'red' }).success).toBe(false);
  });

  it('parses a PriceItem with unit quote and no amount', () => {
    expect(PriceItem.safeParse(price({ unit: 'quote' })).success).toBe(true);
  });

  it('fails a PriceItem with a priced unit (flat) and no amount', () => {
    expect(PriceItem.safeParse(price({ unit: 'flat' })).success).toBe(false);
    expect(PriceItem.safeParse(price({ unit: 'flat', amount: 425 })).success).toBe(true);
  });

  it('fails a PriceItem with unit quote that carries an amount', () => {
    expect(PriceItem.safeParse(price({ unit: 'quote', amount: 500 })).success).toBe(false);
  });
});

describe('customer-safe rule', () => {
  const safeCard = (extra: Record<string, unknown>) =>
    ContentItem.parse({ ...card, visibility: 'customer-safe', ...extra });

  it('fails a customer-safe item with status verify', () => {
    expect(() => assertCustomerRenderable(safeCard({ status: 'verify' }))).toThrow(/verify/);
  });

  it('fails a customer-safe item with status superseded', () => {
    expect(() => assertCustomerRenderable(safeCard({ status: 'superseded' }))).toThrow(/superseded/);
  });

  it('passes a customer-safe house item', () => {
    expect(() => assertCustomerRenderable(safeCard({ status: 'house' }))).not.toThrow();
  });

  it('fails on a "[VERIFY" note inside an otherwise house item, and on a verify row', () => {
    const tagged = safeCard({ rows: [{ label: 'IPA', value: '1 cup 70% IPA + 3 cups water [VERIFY ratio]' }] });
    expect(() => assertCustomerRenderable(tagged)).toThrow(/\[VERIFY/);
    const row = safeCard({ rows: [{ label: 'IPA', value: '1 cup 70% IPA + 3 cups water', status: 'verify' }] });
    expect(() => assertCustomerRenderable(row)).toThrow(/rows\[0\]/);
  });

  it('needs a fact-checker confirmation for a sourced item', () => {
    const src = { label: 'HF product page', date: '2026-10-07' };
    expect(() => assertCustomerRenderable(safeCard({ status: 'sourced', sources: [src] }))).toThrow(/confirmedOn/);
    const confirmed = { ...src, confirmedOn: '2026-10-12', confirmedBy: 'fact-checker' };
    expect(() => assertCustomerRenderable(safeCard({ status: 'sourced', sources: [confirmed] }))).not.toThrow();
  });
});

describe('content set checks', () => {
  it('fails a broken related reference and a dangling superseded item', () => {
    const items: ContentItemValue[] = [
      ContentItem.parse({ ...card, related: ['fix-99'] }),
      ContentItem.parse({ ...card, id: 'card-ipa-old', status: 'superseded' }),
    ];
    const problems = checkContentSet(items, []);
    expect(problems.some((p) => p.id === 'card-bucket-mix' && p.field === 'related[0]')).toBe(true);
    expect(problems.some((p) => p.id === 'card-ipa-old' && p.field === 'status')).toBe(true);
  });

  it('fails a customer-safe verify item in the set', () => {
    const items = [ContentItem.parse({ ...card, visibility: 'customer-safe', status: 'verify' })];
    expect(checkContentSet(items, []).some((p) => p.field === 'visibility')).toBe(true);
  });

  it('passes an empty set (Phase 1 has no content yet)', () => {
    expect(checkContentSet([], [])).toEqual([]);
  });
});

describe('paint gauge readings', () => {
  it('fails 9999 and 0, passes 20', () => {
    expect(PanelReading.safeParse(reading([9999])).success).toBe(false);
    expect(PanelReading.safeParse(reading([0])).success).toBe(false);
    expect(PanelReading.safeParse(reading([20], 'no-machine')).success).toBe(true);
  });

  it('refuses typed values outside 20 to 999 with "Check the gauge" and FIX-21', () => {
    for (const raw of ['0', '19', '1000', '9999', '', 'abc', '-5', null]) {
      expect(parseGaugeInput(raw)).toEqual({ ok: false, message: 'Check the gauge', fixId: 'fix-21' });
    }
    expect(parseGaugeInput(' 105 ')).toEqual({ ok: true, value: 105 });
  });

  it('puts each knowledge base 7.3 boundary in the right band', () => {
    expect([100, 99, 90, 89, 85, 84, 75, 74].map(bandFor)).toEqual([
      'full-ladder',
      'polish-only',
      'polish-only',
      'tell-customer-light',
      'tell-customer-light',
      'tell-customer-finishing',
      'tell-customer-finishing',
      'no-machine',
    ]);
  });

  it('flags repaint at 220 and thin at more than 40 below the rest', () => {
    expect(panelFlags(220, [120, 125, 118]).repaint).toBe(true);
    expect(panelFlags(79, [120, 120]).thin).toBe(true);
    expect(panelFlags(80, [120, 120]).thin).toBe(false);
    expect(panelFlags(81, [120, 120]).thin).toBe(false);
    expect(panelFlags(50, [120])).toEqual({ repaint: false, thin: false });
  });

  it('refuses a band that does not match the lowest reading', () => {
    expect(PanelReading.safeParse(reading([120, 88])).success).toBe(false);
  });
});

describe('backup and crew progress files', () => {
  it('parses a minimal backup', () => {
    expect(parseBackupFile(emptyBackup()).ok).toBe(true);
  });

  it('rejects a backup with an unknown version', () => {
    expect(parseBackupFile(emptyBackup(2))).toMatchObject({
      ok: false,
      reason: 'unknownVersion',
      message: expect.stringMatching(/newer version/),
    });
    expect(parseBackupFile(emptyBackup('1'))).toMatchObject({ ok: false, reason: 'unknownVersion' });
  });

  it('rejects a shop backup with no owner PIN', () => {
    const b = emptyBackup();
    b.deviceRole = 'shop';
    b.tables.settings = [{ ...defaultSettings(NOW), deviceRole: 'shop' }];
    expect(parseBackupFile(b).ok).toBe(false);
  });

  it('refuses and counts sign-off records in a crew progress file', () => {
    const file = {
      kind: 'masterclass-crew-progress',
      version: 1,
      createdAt: NOW,
      appVersion: '0.1.0',
      progress: { crew: { id: ID_A, name: 'DJ' }, drillLogs: [], quizAttempts: [], signOffs: [{}, {}] },
      checksum: { algorithm: 'SHA-256', value: 'b'.repeat(64) },
    };
    expect(parseCrewProgressFile(file)).toMatchObject({ ok: true, refused: { signOffs: 2, skillStates: 0 } });
  });
});

describe('device role and first run (D12)', () => {
  it('a bare "This is the shop phone" tap changes nothing', () => {
    expect(canBecomeShop({ pinExists: false }).allowed).toBe(false);
    expect(canBecomeShop({ pinExists: true }).allowed).toBe(false);
  });

  it('Start fresh needs the warning accepted and a PIN', () => {
    expect(canBecomeShop({ path: 'startFresh', pinExists: true }).allowed).toBe(false);
    expect(canBecomeShop({ path: 'startFresh', pinExists: false, startFreshWarningAccepted: true }).allowed).toBe(false);
    expect(canBecomeShop({ path: 'startFresh', pinExists: true, startFreshWarningAccepted: true }).allowed).toBe(true);
  });

  it('only a shop backup makes a second phone the shop phone', () => {
    expect(canBecomeShop({ path: 'importBackup', pinExists: true, backupDeviceRole: 'study' }).allowed).toBe(false);
    expect(canBecomeShop({ path: 'importBackup', pinExists: true, backupDeviceRole: 'shop' }).allowed).toBe(true);
  });

  it('a new install is a study phone, left-handed, with the setup banner on its first step', () => {
    const s = defaultSettings(NOW);
    expect([s.deviceRole, s.handedness, s.backupReminderWeekly]).toEqual(['study', 'left', false]);
    expect(setupStep(s)).toBe('chooseRole');
    expect(setupStep({ ...s, roleChosenAt: NOW })).toBe('setPin');
  });

  it('the weekly backup reminder waits 7 days and stays quiet in Customer View', () => {
    const base = { backupReminderWeekly: true, lastBackupAt: NOW, customerViewOn: false };
    const t = Date.parse(NOW);
    expect(backupReminderDue(base, t + 6 * 86_400_000)).toBe(false);
    expect(backupReminderDue(base, t + 7 * 86_400_000)).toBe(true);
    expect(backupReminderDue({ ...base, customerViewOn: true }, t + 8 * 86_400_000)).toBe(false);
  });
});

describe('jobs and config', () => {
  it('follows the 3.2 table and refuses events not in a row', () => {
    expect(nextJobState('qc', 'DELIVER')).toBe('delivered');
    expect(nextJobState('draft', 'DELETE')).toBe('deleted');
    expect(nextJobState('booked', 'DELIVER')).toBeNull();
    expect(nextJobState('debriefed', 'EDIT')).toBeNull();
  });

  it('parses a draft with no vehicle size', () => {
    const draft = { id: ID_A, createdAt: NOW, updatedAt: NOW, state: 'draft', vehicle: {}, packageId: null };
    expect(AnyJob.safeParse(draft).success).toBe(true);
  });

  it('accepts the app config and refuses an extra field', () => {
    expect(parseAppConfig(config).brandName).toBe("Lando's Detailing");
    expect(() => parseAppConfig({ ...config, address: 'never' })).toThrow(/address/);
    expect(() => parseAppConfig({ ...config, reviewLink: 'javascript:alert(1)' })).toThrow(/reviewLink/);
  });
});
