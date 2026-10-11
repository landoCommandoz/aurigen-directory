/**
 * The restore confirm (D3, D12, DEF-13): what the restore will do, before anything changes.
 * Order on screen: this phone's counts, then what the backup holds, then the plan's words (texts C
 * and D, the flags), then the step: a refusal with Cancel; the owner PIN when this phone has a
 * readable one; or, when this phone's own settings are unreadable, a backup of this phone offered
 * first and then the typed word. Presentational: the screen owns the state table and the writes.
 */
import { Button } from '../../../components/ui';
import type { RestorePreview } from '../../../core/restorePreview';
import { restoreNotices, restoreRoleNote, thisPhoneLine } from '../restoreFlow';
import { RESTORE_WORD } from '../roleFlow';
import { BackupNow } from './BackupNow';
import { BackupSummary } from './BackupSummary';
import { PinGate } from './PinGate';
import { Actions, StatusLine } from './Screen';
import { TypedConfirm } from './TypedConfirm';

export interface RestoreConfirmProps {
  preview: Extract<RestorePreview, { ok: true }>;
  view: 'confirm' | 'pin' | 'restoring';
  /** The last refusal from the restore itself, in words. */
  error: string | null;
  onApply: () => void;
  onPinOk: () => void;
  onCancel: () => void;
}

export function RestoreConfirm({ preview, view, error, onApply, onPinOk, onCancel }: RestoreConfirmProps) {
  const { plan, thisPhone, file } = preview;
  return (
    <div className="mc-section">
      <StatusLine>{thisPhoneLine(thisPhone)}</StatusLine>
      <BackupSummary summary={file} />
      {error !== null ? <StatusLine tone="warning">{error} Nothing changed.</StatusLine> : null}
      {!plan.ok ? (
        <>
          <StatusLine tone="warning">{plan.message}</StatusLine>
          <Actions>
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </Actions>
        </>
      ) : (
        <>
          {restoreNotices(plan, { thisPhone, fileJobs: file.jobs }).map((line) => (
            <StatusLine key={line} tone="warning">
              {line}
            </StatusLine>
          ))}
          {restoreRoleNote(plan.roleChange) !== null ? <StatusLine>{restoreRoleNote(plan.roleChange)}</StatusLine> : null}
          {view === 'pin' ? (
            <PinGate label="This phone has an owner PIN. Enter it to replace its data." onSuccess={onPinOk} onCancel={onCancel} />
          ) : (
            <>
              {plan.needs.backupFirst ? <BackupNow buttonLabel="Save a backup of this phone" showSettingsNotice={false} /> : null}
              <p>Apply replaces everything on this phone with this backup.</p>
              <TypedConfirm word={RESTORE_WORD} actionLabel="Apply" busy={view === 'restoring'} onConfirm={onApply} onCancel={onCancel} />
            </>
          )}
        </>
      )}
    </div>
  );
}
