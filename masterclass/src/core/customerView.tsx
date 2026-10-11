/**
 * Customer View: the one mechanism (BLUEPRINT 3.4, D10, OWNERSHIP "Where the lines are thin").
 *
 * - <Internal> renders nothing while Customer View is on, so internal elements are not on the
 *   page at all. It also renders nothing while the persisted flag is still loading: a refresh
 *   in Customer View never flashes internals (fail closed).
 * - useCustomerView() gives the flag, whether a customer session is active, the held flag the
 *   ToastProvider reads, and the switch functions.
 * - customerSafe(items) keeps only items that may render to a customer (customerSafe.ts).
 *
 * States (3.4): Off; On with no customer session; On with a session. The session is derived:
 * Customer View on AND a customer screen (check-in, paint report, aftercare) is mounted. The
 * on/off flag and the Focus reminder mark live in settings, so a refresh keeps them; the
 * mounted screen comes back with the route, so the session comes back too.
 *
 * The hint (customerViewHint.ts, DEF-01): a synchronous copy of the flag in localStorage, read
 * before the first frame so the shell can hold the internal top bar on a refresh in Customer View.
 * Written "on" before the row changes and "off" only after the row says off; the row always wins.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import { ROLE_CAN } from '../schemas';
import { readCustomerViewHint, writeCustomerViewHint, type CustomerViewHint } from './customerViewHint';
import { auditEntry, readSettingsForRecoveryIn, readSettingsIn, storageRefusal, withDb, writeSettingsIn } from './db';
import { RefusedError, refuse, type Refusal } from './errors';
import { ownerPassActive } from './pin';
import { useSettings } from './settingsStore';

export { customerSafe, showUnverifiedBadge } from './customerSafe';

/* ---------- Customer screens (the derived session) ---------- */

const openScreens = new Set<symbol>();
const screenListeners = new Set<() => void>();
let screenCount = 0;

function emitScreens(): void {
  screenCount = openScreens.size;
  for (const l of Array.from(screenListeners)) l();
}

function subscribeScreens(listener: () => void): () => void {
  screenListeners.add(listener);
  return () => {
    screenListeners.delete(listener);
  };
}

const getScreenCount = () => screenCount;

/**
 * A customer screen (check-in, paint report, aftercare) calls this while it is mounted. With
 * Customer View on, that makes the customer session active, whichever was opened first.
 */
export function useCustomerScreen(open = true): void {
  useEffect(() => {
    if (!open) return undefined;
    const token = Symbol('customer-screen');
    openScreens.add(token);
    emitScreens();
    return () => {
      openScreens.delete(token);
      emitScreens();
    };
  }, [open]);
}

/** True while any customer screen is mounted (outside React: tests, guards). */
export function customerScreenOpen(): boolean {
  return openScreens.size > 0;
}

/* ---------- Switch functions (usable outside React) ---------- */

export type CustomerViewCode = 'notShopPhone' | 'needsOwnerPass' | 'storage';
export type SwitchResult = { ok: true; on: boolean } | Refusal<CustomerViewCode>;

/** Turn Customer View on. No PIN. The caller shows the Focus reminder next (D10). */
export async function turnCustomerViewOn(): Promise<SwitchResult> {
  let hinted = false;
  try {
    return await withDb((db) =>
      db.transaction('rw', db.settings, async () => {
        const s = await readSettingsIn(db);
        if (!ROLE_CAN[s.deviceRole].customerView) {
          throw new RefusedError(refuse('notShopPhone', 'Customer View is on the shop phone. This phone is a study phone.'));
        }
        // The hint first: a refresh between the two writes then holds the top bar (fail closed).
        hinted = true;
        writeCustomerViewHint(true);
        if (!s.customerViewOn) await writeSettingsIn(db, { ...s, customerViewOn: true, focusReminderShown: false });
        return { ok: true as const, on: true };
      }),
    );
  } catch (error) {
    // The transaction rolled back, so the row still says off; the hint follows it.
    if (hinted) writeCustomerViewHint(false);
    if (error instanceof RefusedError) return error.refusal as Refusal<CustomerViewCode>;
    return storageRefusal(error);
  }
}

/**
 * Turn Customer View off. Needs the owner pass while a customer session is active (3.4); then it
 * also writes a customerViewOff audit entry. Without a session, no PIN.
 * The way out must never dead-end (DEF-08): it reads through the recovery read, so a settings
 * field this version cannot use does not trap the phone in Customer View (Settings is hidden
 * there). The row written back holds that field at its default; the role and PIN are untouched.
 */
export async function turnCustomerViewOff(): Promise<SwitchResult> {
  const sessionActive = customerScreenOpen();
  if (sessionActive && !ownerPassActive()) {
    return refuse('needsOwnerPass', 'Enter the owner PIN to end the customer session.');
  }
  try {
    const result = await withDb((db) =>
      db.transaction('rw', db.settings, db.auditLog, async () => {
        const s = (await readSettingsForRecoveryIn(db)).settings;
        if (s.customerViewOn) {
          await writeSettingsIn(db, { ...s, customerViewOn: false, focusReminderShown: false });
          if (sessionActive) await db.auditLog.add(auditEntry('customerViewOff', 'Customer View off during a customer session (owner PIN)'));
        }
        return { ok: true as const, on: false };
      }),
    );
    // Only after the row says off (fail closed).
    writeCustomerViewHint(false);
    return result;
  } catch (error) {
    return storageRefusal(error);
  }
}

/** Record that the Focus reminder was shown for this switch-on, so a refresh never repeats it (D10). */
export async function markFocusReminderShown(): Promise<void> {
  try {
    await withDb((db) =>
      db.transaction('rw', db.settings, async () => {
        const s = await readSettingsIn(db);
        if (s.customerViewOn && !s.focusReminderShown) await writeSettingsIn(db, { ...s, focusReminderShown: true });
      }),
    );
  } catch (error) {
    // Unsaved, the reminder may show once more after a refresh; that is the safe direction.
    storageRefusal(error);
  }
}

/* ---------- React ---------- */

export interface CustomerViewApi {
  /** The persisted flag has been read (until then <Internal> renders nothing). */
  ready: boolean;
  on: boolean;
  /** On AND a customer screen is open: switching off needs the PIN. */
  sessionActive: boolean;
  /** Show the Focus reminder now: on, and not yet shown for this switch-on. */
  focusReminderDue: boolean;
  /** Pass to <ToastProvider held={held}>: on, or not yet known. */
  held: boolean;
  /** Storage is unavailable: the flag cannot be read or saved. */
  storageProblem: string | null;
  /**
   * What the last session left in the synchronous hint, read once when the provider mounted. Only
   * for the frames before `ready`: 'on' or 'unknown' means hold the internal top bar.
   */
  hint: CustomerViewHint;
  turnOn: () => Promise<SwitchResult>;
  turnOff: () => Promise<SwitchResult>;
  markFocusReminderShown: () => Promise<void>;
}

const CustomerViewContext = createContext<CustomerViewApi | null>(null);

export function CustomerViewProvider({ children }: { children: ReactNode }) {
  const snapshot = useSettings();
  const screens = useSyncExternalStore(subscribeScreens, getScreenCount, getScreenCount);
  const [hint] = useState(readCustomerViewHint);
  const ready = snapshot.status !== 'loading';
  const on = snapshot.settings?.customerViewOn === true;
  const rowRead = snapshot.status === 'ready';

  // Once the row is read, the hint follows it (it also fills in a hint this phone never had).
  // Not while storage is unavailable: the defaults then are not what the phone saved.
  useEffect(() => {
    if (rowRead) writeCustomerViewHint(on);
  }, [rowRead, on]);
  const turnOn = useCallback(() => turnCustomerViewOn(), []);
  const turnOff = useCallback(() => turnCustomerViewOff(), []);
  const markShown = useCallback(() => markFocusReminderShown(), []);
  const value = useMemo<CustomerViewApi>(
    () => ({
      ready,
      on,
      sessionActive: on && screens > 0,
      focusReminderDue: on && snapshot.settings?.focusReminderShown === false,
      held: on || !ready,
      storageProblem: snapshot.status === 'unavailable' ? snapshot.error.message : null,
      hint,
      turnOn,
      turnOff,
      markFocusReminderShown: markShown,
    }),
    [ready, on, screens, snapshot, hint, turnOn, turnOff, markShown],
  );
  return <CustomerViewContext.Provider value={value}>{children}</CustomerViewContext.Provider>;
}

const NO_PROVIDER: CustomerViewApi = {
  ready: false,
  on: false,
  sessionActive: false,
  focusReminderDue: false,
  held: true,
  storageProblem: null,
  hint: 'unknown',
  turnOn: turnCustomerViewOn,
  turnOff: turnCustomerViewOff,
  markFocusReminderShown,
};

/** The Customer View state. Outside the provider it reads as "not ready", so <Internal> fails closed. */
export function useCustomerView(): CustomerViewApi {
  return useContext(CustomerViewContext) ?? NO_PROVIDER;
}

/**
 * Wrap every internal element. Renders nothing while Customer View is on or still loading.
 * Otherwise renders a box-less wrapper (display: contents) marked data-internal, so the privacy
 * test can find any internal element that should not be there.
 */
export function Internal({ children, as = 'div' }: { children: ReactNode; as?: 'div' | 'span' }) {
  const { ready, on } = useCustomerView();
  if (!ready || on) return null;
  const Tag = as;
  return (
    <Tag data-internal="" style={{ display: 'contents' }}>
      {children}
    </Tag>
  );
}
