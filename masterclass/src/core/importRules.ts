/**
 * The settings row and audit entries an import writes. Shared by backupImport.ts (which runs the
 * transaction) and deviceRole.ts (which re-exports it as part of the role API), so neither file
 * imports the other in a cycle.
 */
import type { AuditLogValue, SettingsValue } from '../schemas';
import type { VerifiedBackup } from './backupFile';
import { nowIso } from './clock';
import { auditEntry } from './db';

/**
 * Used inside the import transaction (backupImport.ts). Given the current settings and a
 * verified backup, returns the settings row to write and the audit entries that record it.
 * Customer View is always off after an import; the PIN hash comes with a shop backup.
 */
export function markShopViaImport(
  current: SettingsValue,
  backup: VerifiedBackup,
): { settings: SettingsValue; audit: AuditLogValue[] } {
  const incoming = backup.backup.tables.settings[0];
  if (incoming === undefined) throw new Error('A verified backup always holds one settings row');
  const now = nowIso();
  const settings: SettingsValue = {
    ...incoming,
    customerViewOn: false,
    focusReminderShown: false,
    roleChosenAt: incoming.roleChosenAt ?? now,
  };
  const audit: AuditLogValue[] = [
    auditEntry(
      'import',
      `Imported the backup from ${backup.backup.createdAt} (${backup.summary.jobs} jobs, photos ${backup.backup.photos}). Every table replaced.`,
    ),
  ];
  if (current.deviceRole !== incoming.deviceRole) {
    audit.push(auditEntry('roleChange', `${current.deviceRole === 'shop' ? 'Shop' : 'Study'} phone to ${incoming.deviceRole} phone (import)`));
  }
  return { settings, audit };
}
