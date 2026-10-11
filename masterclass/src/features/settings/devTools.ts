/**
 * When the developer panel and the device preview may show (CLAUDE.md engineering rules, BLUEPRINT 3.4):
 * - always in a dev build (import.meta.env.DEV);
 * - in a production build only when the owner turned on "Developer tools" with the owner PIN;
 * - never while Customer View is on, and never while the Customer View flag is still loading.
 *
 * setDeveloperToggle writes settings.developerPanel with an audit entry, in one transaction, and
 * only with the owner pass. It uses core's exported database primitives only.
 * Flagged for core: this guarded write belongs next to the other guarded settings writes.
 */
import { auditEntry, readSettingsIn, storageRefusal, withDb, writeSettingsIn } from '../../core/db';
import { RefusedError, refuse, type Refusal } from '../../core/errors';
import { useCustomerView } from '../../core/customerView';
import { ownerPassActive } from '../../core/pin';
import { useSettings } from '../../core/settingsStore';

let devOverride: boolean | null = null;

/** True in a dev build. Tests may override it to check the production rule. */
export function isDevBuild(): boolean {
  return devOverride ?? import.meta.env.DEV === true;
}

/** Tests only: pretend to be a dev (true) or production (false) build; null restores the real value. */
export function __setDevBuildForTests(value: boolean | null): void {
  devOverride = value;
}

/** The pure rule, so tests can read it without React. */
export function developerToolsAllowed(input: { dev: boolean; toggle: boolean; customerViewReady: boolean; customerViewOn: boolean }): boolean {
  if (!input.customerViewReady || input.customerViewOn) return false;
  return input.dev || input.toggle;
}

/** The shell renders the device preview bar and the developer slide-over only when this is true. */
export function useDeveloperToolsEnabled(): boolean {
  const snapshot = useSettings();
  const cv = useCustomerView();
  return developerToolsAllowed({
    dev: isDevBuild(),
    toggle: snapshot.settings?.developerPanel === true,
    customerViewReady: cv.ready,
    customerViewOn: cv.on,
  });
}

export type DevToggleResult = { ok: true; on: boolean } | Refusal<'noOwnerPass' | 'storage'>;

/** Turn the production "Developer tools" toggle on or off. Needs the owner pass; logged. */
export async function setDeveloperToggle(on: boolean): Promise<DevToggleResult> {
  try {
    return await withDb((db) =>
      db.transaction('rw', db.settings, db.auditLog, async () => {
        if (!ownerPassActive()) {
          throw new RefusedError(refuse('noOwnerPass', 'Enter the owner PIN to change Developer tools.'));
        }
        const current = await readSettingsIn(db);
        if (current.developerPanel !== on) {
          await writeSettingsIn(db, { ...current, developerPanel: on });
          await db.auditLog.add(auditEntry('developerToggle', on ? 'Developer tools turned on' : 'Developer tools turned off'));
        }
        return { ok: true as const, on };
      }),
    );
  } catch (error) {
    if (error instanceof RefusedError) return error.refusal as Refusal<'noOwnerPass'>;
    return storageRefusal(error);
  }
}
