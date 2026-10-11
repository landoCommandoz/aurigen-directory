/**
 * The settings row and audit entries an import or restore writes. Shared by backupImport.ts (which
 * runs the transaction) and deviceRole.ts (which re-exports markShopViaImport as part of the role
 * API), so neither file imports the other in a cycle. The settings rules themselves are
 * settingsAfterRestore and restorePlan in src/schemas/backup-recovery.ts (DEF-13); nothing here
 * restates them.
 */
import { settingsAfterRestore, type AuditLogValue, type DeviceRoleName, type RestorePath, type RestorePlanOk, type SettingsValue } from '../schemas';
import type { VerifiedBackup } from './backupFile';
import { nowIso } from './clock';
import { auditEntry } from './db';

function roleWord(role: DeviceRoleName | 'unreadable'): string {
  switch (role) {
    case 'shop':
      return 'Shop';
    case 'study':
      return 'Study';
    case 'unreadable':
      return 'Unreadable';
    default:
      return 'Study';
  }
}

/**
 * The settings row and audit entries for a readable shop backup landing on this phone (the D12
 * import). Customer View is always off after an import; the PIN hash comes with the backup.
 * Throws on a file whose settings could not be read: such a file never makes a shop phone.
 */
export function markShopViaImport(
  current: SettingsValue,
  backup: VerifiedBackup,
): { settings: SettingsValue; audit: AuditLogValue[] } {
  if ('settingsUnreadable' in backup.backup) throw new Error('A backup with unreadable settings never makes a shop phone');
  const incoming = backup.backup.tables.settings[0];
  if (incoming === undefined) throw new Error('A verified backup with readable settings always holds one settings row');
  const settings = settingsAfterRestore({ settingsFrom: 'file' }, { file: incoming, nowIso: nowIso() });
  const audit: AuditLogValue[] = [
    auditEntry(
      'import',
      `Imported the backup from ${backup.backup.createdAt} (${backup.summary.jobs} jobs, photos ${backup.backup.photos}). Every table replaced.`,
    ),
  ];
  if (current.deviceRole !== incoming.deviceRole) {
    audit.push(auditEntry('roleChange', `${roleWord(current.deviceRole)} phone to ${incoming.deviceRole} phone (import)`));
  }
  return { settings, audit };
}

/**
 * The audit entries a restore writes, from its plan: one import entry naming what happened (an
 * unreadable file, this phone's unreadable settings, the sign-offs marked needs re-check), plus a
 * roleChange entry when the role changes. Plain words; never the PIN or a setting value.
 */
export function restoreAudit(plan: RestorePlanOk, backup: VerifiedBackup, path: RestorePath): AuditLogValue[] {
  const parts = [`Imported the backup from ${backup.backup.createdAt} (${backup.summary.jobs} jobs, photos ${backup.backup.photos}). Every table replaced.`];
  if (plan.flags.fileSettingsUnreadable) {
    parts.push(
      plan.settingsFrom === 'thisPhone'
        ? "The file's role and owner PIN could not be read, so this phone kept its own settings."
        : "The file's role and owner PIN could not be read, so this phone starts as a new study phone with no PIN.",
    );
  }
  if (plan.flags.thisPhoneSettingsUnreadable) {
    parts.push("This phone's own role and owner PIN could not be read, so the typed word stood in for the PIN after a backup of this phone was offered.");
  }
  if (plan.signOffs.comeBack === 'needsRecheck' && plan.signOffs.rows > 0) {
    parts.push(`${plan.signOffs.rows} sign-off ${plan.signOffs.rows === 1 ? 'record' : 'records'} marked needs re-check.`);
  }
  const entries = [auditEntry('import', parts.join(' '))];
  if (plan.roleChange !== null) {
    const how = path === 'importBackup' ? 'import' : 'restore';
    entries.push(auditEntry('roleChange', `${roleWord(plan.roleChange.from)} phone to ${plan.roleChange.to} phone (${how})`));
  }
  return entries;
}
