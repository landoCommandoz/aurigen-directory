/**
 * Device role (D12, BLUEPRINT 2.1 and 3.9). Every install is a study phone. The only two ways
 * to the shop phone are importing the newest shop backup and Start fresh. The pure rules are
 * canBecomeShop and canBecomeStudy in src/schemas; this file runs them against the stored
 * settings and writes the result in one transaction with its audit entries.
 *
 * Lando, 2026-10-10 [HOUSE]: "A mistaken 'This is the shop phone' tap changes nothing until an
 * owner PIN exists, and the screen has a clear Cancel. One shop phone at a time: a second phone
 * can only become the shop phone by importing the latest backup. 'Start fresh' is a separate
 * choice with a warning that the counts reset to zero."
 */
import {
  START_FRESH_CLEARS,
  START_FRESH_WARNING,
  canBecomeShop,
  canBecomeStudy,
  settingsOnPinCreated,
  PinEntry,
  type DeviceRoleName,
  type SettingsValue,
  type AuditLogValue,
} from '../schemas';
import type { VerifiedBackup } from './backupFile';
import { importBackup } from './backupImport';
import { newId, nowIso } from './clock';
import { auditEntry, readSettingsIn, storageRefusal, validRow, withDb, writeSettingsIn } from './db';
import { RefusedError, refuse, type Refusal } from './errors';
import { grantPassForNewPin, hashPin, ownerPassActive } from './pin';

export { START_FRESH_WARNING, START_FRESH_CLEARS };
export { markShopViaImport } from './importRules';

export type RoleCode =
  | 'choosePath'
  | 'noPin'
  | 'notShopBackup'
  | 'warningNotAccepted'
  | 'noOwnerPass'
  | 'alreadyShop'
  | 'useSwitchToStudy'
  | 'invalidPin'
  | 'notConfirmed'
  | 'shopNeedsShopBackup'
  | 'storage';

export type RoleResult = { ok: true; role: DeviceRoleName } | Refusal<RoleCode>;

/** The role on this phone. A phone whose storage is unavailable works as a study phone. */
export async function getRole(): Promise<DeviceRoleName> {
  try {
    return await withDb(async (db) => (await db.transaction('rw', db.settings, () => readSettingsIn(db))).deviceRole);
  } catch {
    return 'study';
  }
}

function asResult(error: unknown): Refusal<RoleCode> {
  if (error instanceof RefusedError) return error.refusal as Refusal<RoleCode>;
  return storageRefusal(error);
}

/** "This is a study phone": records the choice. The banner moves on to "Set the owner PIN". */
export async function chooseStudy(): Promise<RoleResult> {
  try {
    return await withDb((db) =>
      db.transaction('rw', db.settings, db.auditLog, async () => {
        const current = await readSettingsIn(db);
        if (current.deviceRole === 'shop') {
          throw new RefusedError(refuse('useSwitchToStudy', 'This is the shop phone. Use "Switch to study phone" with the owner PIN.'));
        }
        if (current.roleChosenAt === null) {
          await writeSettingsIn(db, { ...current, roleChosenAt: nowIso() });
          await db.auditLog.add(auditEntry('roleChange', 'Set up as a study phone'));
        }
        return { ok: true as const, role: 'study' as const };
      }),
    );
  } catch (error) {
    return asResult(error);
  }
}

export type BecomeShopRequest =
  | { path?: null }
  | { path: 'startFresh'; warningAccepted: boolean; newPin?: string }
  | { path: 'importBackup'; backup: VerifiedBackup; confirmedNewest: boolean };

/**
 * The shop path. With no path (the bare "This is the shop phone" tap) it refuses and writes
 * nothing, whether or not a PIN exists. Start fresh and Import each write in one transaction.
 */
export async function becomeShop(request: BecomeShopRequest = {}): Promise<RoleResult> {
  const path = request.path ?? null;
  if (path === null) {
    const decision = canBecomeShop({ path: null, pinExists: false });
    return decision.allowed ? refuse('choosePath', 'Choose a path.') : refuse(decision.code, decision.message);
  }
  if (path === 'startFresh') {
    const r = request as Extract<BecomeShopRequest, { path: 'startFresh' }>;
    return startFresh({ warningAccepted: r.warningAccepted, ...(r.newPin === undefined ? {} : { newPin: r.newPin }) });
  }
  const r = request as Extract<BecomeShopRequest, { path: 'importBackup' }>;
  const result = await importBackup(r.backup, { path: 'importBackup', confirmed: r.confirmedNewest });
  return result.ok ? { ok: true, role: result.deviceRole } : (result as Refusal<RoleCode>);
}

/**
 * Start fresh: a separate choice. The caller shows START_FRESH_WARNING first and passes
 * warningAccepted: true. With no PIN on the phone, newPin creates it in the same write; with a
 * PIN already set, the owner pass is required (enter the existing PIN). One transaction writes
 * the PIN, the shop role, the weekly reminder on, empties START_FRESH_CLEARS, sets the cars
 * seed to 0, creates and selects the owner profile, and writes the audit entries.
 * Academy progress (crew, skills, quizzes, drills, flashcards) stays.
 */
export async function startFresh(opts: { warningAccepted: boolean; newPin?: string }): Promise<RoleResult> {
  if (opts.warningAccepted !== true) return refuse('warningNotAccepted', START_FRESH_WARNING);
  if (opts.newPin !== undefined && !PinEntry.safeParse(opts.newPin).success) {
    return refuse('invalidPin', 'The PIN is 6 digits.');
  }
  // Hash before the transaction: an IndexedDB transaction closes while awaiting crypto.
  const hashed = opts.newPin === undefined ? null : await hashPin(opts.newPin);
  const clearTables = START_FRESH_CLEARS;
  try {
    return await withDb((db) =>
      db.transaction('rw', [db.settings, db.auditLog, db.crewMembers, ...clearTables.map((t) => db.table(t))], async () => {
        const current = await readSettingsIn(db);
        if (current.deviceRole === 'shop') {
          throw new RefusedError(refuse('alreadyShop', 'This phone is already the shop phone. Nothing changed.'));
        }
        const pinExists = current.ownerPin !== null;
        const decision = canBecomeShop({ path: 'startFresh', pinExists: pinExists || hashed !== null, startFreshWarningAccepted: opts.warningAccepted });
        if (!decision.allowed) throw new RefusedError(refuse(decision.code, decision.message));
        if (pinExists && !ownerPassActive()) {
          throw new RefusedError(refuse('noOwnerPass', 'This phone already has an owner PIN. Enter it to start fresh.'));
        }

        for (const table of clearTables) await db.table(table).clear();

        const now = nowIso();
        const crew = await db.crewMembers.toArray();
        let owner = crew.find((c) => c.role === 'owner');
        if (owner === undefined) {
          owner = validRow('crewMembers', { id: newId(), createdAt: now, updatedAt: now, name: 'Owner', role: 'owner', active: true });
          await db.crewMembers.add(owner);
        }

        const next: SettingsValue = {
          ...current,
          ...(hashed !== null && !pinExists ? settingsOnPinCreated(hashed) : { backupReminderWeekly: true }),
          deviceRole: 'shop',
          roleChosenAt: now,
          carsLoggedBefore: 0,
          activeCrewId: owner.id,
          customerViewOn: false,
          focusReminderShown: false,
        };
        await writeSettingsIn(db, next);

        const entries: AuditLogValue[] = [];
        if (hashed !== null && !pinExists) entries.push(auditEntry('pinSet', 'Owner PIN created; weekly backup reminder on'));
        entries.push(auditEntry('startFresh', `Start fresh accepted. Emptied: ${clearTables.join(', ')}. Cars logged seed set to 0.`));
        entries.push(auditEntry('roleChange', 'Study phone to shop phone (Start fresh)'));
        await db.auditLog.bulkAdd(entries);
        return { ok: true as const, role: 'shop' as const };
      }),
    ).then((result) => {
      // A PIN created in this flow counts as the owner pass (canBecomeShop note).
      if (hashed !== null) grantPassForNewPin();
      return result;
    });
  } catch (error) {
    return asResult(error);
  }
}

/** "Switch to study phone": owner pass, logged. Jobs stay in the database; a study phone shows no job screens. */
export async function demoteToStudy(): Promise<RoleResult> {
  try {
    return await withDb((db) =>
      db.transaction('rw', db.settings, db.auditLog, async () => {
        const current = await readSettingsIn(db);
        const decision = canBecomeStudy({ currentRole: current.deviceRole, ownerPassValid: ownerPassActive() });
        if (!decision.allowed) throw new RefusedError(refuse(decision.code, decision.message));
        if (current.deviceRole === 'study') return { ok: true as const, role: 'study' as const };
        await writeSettingsIn(db, { ...current, deviceRole: 'study', roleChosenAt: nowIso(), customerViewOn: false, focusReminderShown: false });
        await db.auditLog.add(auditEntry('roleChange', 'Shop phone to study phone (owner PIN)'));
        return { ok: true as const, role: 'study' as const };
      }),
    );
  } catch (error) {
    return asResult(error);
  }
}
