/**
 * Developer panel: storage and screen-awake tests (Phase 1 device checklist items 2 and 6).
 * "Hold screen awake for 30 s" asks inside the tap, reports the answer, and lets go after 30 s.
 */
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../components/ui';
import { nowMs } from '../../../core/clock';
import { probeStorage, requestPersistOnce, useStorageProbe } from '../../../core/storage';
import { releaseWakeLock, requestWakeLock, useWakeLockStatus, wakeLockStatus } from '../../../core/wakeLock';
import { formatMB, formatWhen, yesNo } from '../ui/format';
import { Readouts } from '../ui/Readouts';
import { Actions, Section } from '../ui/Screen';

export const STORAGE_LABELS = {
  supported: 'Storage manager',
  quota: 'Quota',
  usage: 'Usage',
  persisted: 'Storage kept (persisted)',
  requested: 'Asked to keep storage this launch',
  answer: 'Answer to the keep request',
  checked: 'Checked',
  error: 'Storage error',
} as const;

export const WAKE_LABELS = {
  supported: 'Screen wake lock supported',
  active: 'Screen held awake now',
  hint: 'If not supported',
  result: 'Last test',
} as const;

const HOLD_MS = 30_000;

export function StorageWakeTests() {
  const storage = useStorageProbe();
  const wake = useWakeLockStatus();
  const [holdUntil, setHoldUntil] = useState<number | null>(null);
  const [now, setNow] = useState(() => nowMs());
  const [wakeResult, setWakeResult] = useState<string>('Not run yet');
  const releaseTimer = useRef<number | null>(null);

  useEffect(() => {
    if (holdUntil === null) return undefined;
    const tick = window.setInterval(() => setNow(nowMs()), 1000);
    return () => window.clearInterval(tick);
  }, [holdUntil]);

  useEffect(
    () => () => {
      if (releaseTimer.current !== null) window.clearTimeout(releaseTimer.current);
    },
    [],
  );

  function hold() {
    // The request starts inside this tap; nothing is awaited before it.
    void requestWakeLock().then((result) => {
      if (!result.ok) {
        setWakeResult(`Refused or not supported. ${result.message}`);
        return;
      }
      const until = nowMs() + HOLD_MS;
      setHoldUntil(until);
      setNow(nowMs());
      setWakeResult('Granted. Leave the phone alone: the screen should stay on for 30 seconds.');
      if (releaseTimer.current !== null) window.clearTimeout(releaseTimer.current);
      releaseTimer.current = window.setTimeout(() => {
        releaseTimer.current = null;
        setHoldUntil(null);
        // A running stage (Phase 3) keeps its own hold.
        if (!wakeLockStatus.get().shouldHold) void releaseWakeLock();
        setWakeResult('Done: held for 30 seconds, then released.');
      }, HOLD_MS);
    });
  }

  const left = holdUntil === null ? 0 : Math.max(0, Math.ceil((holdUntil - now) / 1000));
  return (
    <>
      <Section title="Storage" index={4} intro={<p>Checklist item 2: report the two values for "storage kept". No inside the installed app is the one worth telling the lead.</p>}>
        <Readouts
          label="Storage"
          items={[
            { label: STORAGE_LABELS.supported, value: storage.supported ? 'Available' : 'Not available' },
            { label: STORAGE_LABELS.quota, value: formatMB(storage.quotaMB) },
            { label: STORAGE_LABELS.usage, value: formatMB(storage.usageMB) },
            { label: STORAGE_LABELS.persisted, value: yesNo(storage.persisted) },
            { label: STORAGE_LABELS.requested, value: yesNo(storage.persistRequested) },
            { label: STORAGE_LABELS.answer, value: yesNo(storage.persistResult, 'Not asked yet') },
            { label: STORAGE_LABELS.checked, value: formatWhen(storage.checkedAt, 'Not yet') },
            { label: STORAGE_LABELS.error, value: storage.error ?? 'None' },
          ]}
        />
        <Actions>
          <Button onClick={() => void probeStorage()}>Check storage again</Button>
          <Button onClick={() => void requestPersistOnce().then(() => probeStorage())}>Ask to keep storage</Button>
        </Actions>
      </Section>
      <Section title="Keep the screen on" index={5} intro={<p>Checklist item 6: turn on Low Power Mode, tap the button, and watch whether the screen stays on.</p>}>
        <Readouts
          label="Wake lock"
          items={[
            { label: WAKE_LABELS.supported, value: yesNo(wake.supported) },
            { label: WAKE_LABELS.active, value: wake.active ? `Yes${left > 0 ? `, ${left} s left in the test` : ''}` : 'No' },
            { label: WAKE_LABELS.hint, value: wake.hint ?? 'Not needed' },
            { label: WAKE_LABELS.result, value: wakeResult },
          ]}
        />
        <Actions>
          <Button onClick={hold} disabled={holdUntil !== null}>
            Hold screen awake for 30 s
          </Button>
        </Actions>
      </Section>
    </>
  );
}
