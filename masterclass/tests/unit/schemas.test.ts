// @vitest-environment node
/**
 * Schema validation (BUILD_PROMPT 9 item 2): every content type parses a valid fixture and refuses
 * every broken one; gauge readings, bands, and flags (BLUEPRINT 3.8); the settings rules (D12).
 */
import { describe, expect, it } from 'vitest';
import {
  CONTENT_TYPES,
  ContentItem,
  Micron,
  PanelReading,
  SCHEMA_BY_TYPE,
  Settings,
  backupReminderDue,
  bandFor,
  defaultSettings,
  panelFlags,
  parseGaugeInput,
  setupStep,
} from '../../src/schemas';
import { BREAKAGES, TYPE_BREAKAGES, VALID } from '../fixtures/content';
import { BAD_READINGS, GOOD_READINGS, T0, qaId } from '../fixtures/jobs';

describe('content schemas: valid fixtures', () => {
  it('there is one fixture for every content type', () => {
    expect(Object.keys(VALID).sort()).toEqual([...CONTENT_TYPES].sort());
  });

  for (const type of CONTENT_TYPES) {
    it(`${type}: the valid fixture parses with its own schema and the union`, () => {
      const own = SCHEMA_BY_TYPE[type].safeParse(VALID[type]);
      expect(own.error?.issues ?? []).toEqual([]);
      expect(ContentItem.parse(VALID[type]).type).toBe(type);
    });
  }
});

describe('content schemas: broken fixtures are refused', () => {
  for (const type of CONTENT_TYPES) {
    for (const breakage of BREAKAGES) {
      it(`${type}: refuses ${breakage.name}`, () => {
        expect(SCHEMA_BY_TYPE[type].safeParse(breakage.mutate(VALID[type])).success).toBe(false);
        expect(ContentItem.safeParse(breakage.mutate(VALID[type])).success).toBe(false);
      });
    }
  }
  for (const t of TYPE_BREAKAGES) {
    it(`${t.type}: refuses ${t.name}`, () => {
      expect(SCHEMA_BY_TYPE[t.type].safeParse(t.mutate(VALID[t.type])).success).toBe(false);
    });
  }
  it('refuses a type the app does not know, and an item of one type wearing another type', () => {
    expect(ContentItem.safeParse({ ...VALID.quickcard, type: 'recipe' }).success).toBe(false);
    expect(ContentItem.safeParse({ ...VALID.quickcard, type: 'product' }).success).toBe(false);
  });
});

describe('gauge readings (knowledge base 7.2 and 7.3, BLUEPRINT 3.8)', () => {
  for (const bad of BAD_READINGS) {
    it(`refuses ${JSON.stringify(bad) ?? String(bad)} with "Check the gauge" and the FIX-21 link`, () => {
      const result = parseGaugeInput(bad);
      expect(result).toEqual({ ok: false, message: 'Check the gauge', fixId: 'fix-21' });
    });
  }
  for (const [raw, value] of GOOD_READINGS) {
    it(`accepts ${JSON.stringify(raw)} as ${value}`, () => {
      expect(parseGaugeInput(raw)).toEqual({ ok: true, value });
    });
  }

  it('a 9999 reading cannot be saved: Micron and the PanelReading record both refuse it', () => {
    expect(Micron.safeParse(9999).success).toBe(false);
    const reading = {
      id: qaId(),
      createdAt: T0,
      updatedAt: T0,
      jobId: qaId(),
      panelId: 'hood',
      readings: [120, 9999],
      band: 'full-ladder',
      flags: { repaint: false, thin: false },
      takenAt: T0,
    };
    expect(PanelReading.safeParse(reading).success).toBe(false);
    expect(PanelReading.safeParse({ ...reading, readings: [120, 118] }).success).toBe(true);
    expect(PanelReading.safeParse({ ...reading, readings: [] }).success).toBe(false);
    expect(PanelReading.safeParse({ ...reading, readings: [120, 120, 120, 120, 120, 120] }).success).toBe(false);
    expect(PanelReading.safeParse({ ...reading, jambBaseline: 0 }).success).toBe(false);
  });

  it('a band that does not match the lowest reading is refused', () => {
    const reading = { id: qaId(), createdAt: T0, updatedAt: T0, jobId: qaId(), panelId: 'hood', readings: [88, 130], band: 'full-ladder', flags: { repaint: false, thin: false }, takenAt: T0 };
    expect(PanelReading.safeParse(reading).success).toBe(false);
    expect(PanelReading.safeParse({ ...reading, band: 'tell-customer-light' }).success).toBe(true);
  });

  it.each([
    [100, 'full-ladder'],
    [99, 'polish-only'],
    [90, 'polish-only'],
    [89, 'tell-customer-light'],
    [85, 'tell-customer-light'],
    [84, 'tell-customer-finishing'],
    [75, 'tell-customer-finishing'],
    [74, 'no-machine'],
  ])('%i um lands in band %s', (um, band) => {
    expect(bandFor(um)).toBe(band);
  });

  it('repaint at 220 with the rest near 120; thin at 41 below the rest, not at 40 or 39; no flags without a rest', () => {
    expect(panelFlags(220, [120, 122, 118])).toEqual({ repaint: true, thin: false });
    expect(panelFlags(219, [120, 122, 118])).toEqual({ repaint: false, thin: false });
    expect(panelFlags(79, [120, 120, 120]).thin).toBe(true);
    expect(panelFlags(80, [120, 120, 120]).thin).toBe(false);
    expect(panelFlags(81, [120, 120, 120]).thin).toBe(false);
    expect(panelFlags(60, [120])).toEqual({ repaint: false, thin: false });
    expect(panelFlags(60, [])).toEqual({ repaint: false, thin: false });
  });
});

describe('settings rules (D12)', () => {
  const s0 = defaultSettings(T0);

  it('a new install is a study phone, role not chosen, no PIN, left-handed, reminder off', () => {
    expect(s0).toMatchObject({ deviceRole: 'study', roleChosenAt: null, ownerPin: null, handedness: 'left', backupReminderWeekly: false, customerViewOn: false });
    expect(setupStep(s0)).toBe('chooseRole');
  });

  it('a settings row with the shop role and no PIN fails its schema', () => {
    expect(Settings.safeParse({ ...s0, deviceRole: 'shop' }).success).toBe(false);
  });

  it('the Focus reminder mark cannot be set while Customer View is off', () => {
    expect(Settings.safeParse({ ...s0, focusReminderShown: true }).success).toBe(false);
  });

  it('setup steps run in order: role, PIN, first backup, done', () => {
    const pin = { algorithm: 'PBKDF2-SHA-256', iterations: 1, salt: 'AAAA', hash: 'AAAA', setAt: T0 } as const;
    expect(setupStep({ roleChosenAt: null, ownerPin: pin, lastBackupAt: T0 })).toBe('chooseRole');
    expect(setupStep({ roleChosenAt: T0, ownerPin: null, lastBackupAt: T0 })).toBe('setPin');
    expect(setupStep({ roleChosenAt: T0, ownerPin: pin, lastBackupAt: null })).toBe('firstBackup');
    expect(setupStep({ roleChosenAt: T0, ownerPin: pin, lastBackupAt: T0 })).toBe('done');
  });

  it('the backup reminder is due 7 days after the last backup, not at 6, never in Customer View, and at once with no backup', () => {
    const last = Date.parse(T0);
    const day = 24 * 60 * 60 * 1000;
    const on = { backupReminderWeekly: true, lastBackupAt: T0, customerViewOn: false };
    expect(backupReminderDue(on, last + 6 * day)).toBe(false);
    expect(backupReminderDue(on, last + 7 * day - 1)).toBe(false);
    expect(backupReminderDue(on, last + 7 * day)).toBe(true);
    expect(backupReminderDue({ ...on, customerViewOn: true }, last + 30 * day)).toBe(false);
    expect(backupReminderDue({ ...on, backupReminderWeekly: false }, last + 30 * day)).toBe(false);
    expect(backupReminderDue({ ...on, lastBackupAt: null }, last)).toBe(true);
    // A clock moved back before the last backup shows nothing.
    expect(backupReminderDue(on, last - 1000)).toBe(false);
    // A damaged stamp is treated as due (the safe direction).
    expect(backupReminderDue({ ...on, lastBackupAt: 'not a date' }, last)).toBe(true);
  });
});
