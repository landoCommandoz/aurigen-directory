/**
 * What a checked backup holds, shown before anything is replaced (D12): its date, the device role
 * it came from, jobs, cars toward 25, founder's slots used, photos, and whether it carries a PIN.
 */
import type { BackupSummary as Summary } from '../../../core/backupFile';
import { formatBytes, formatWhen, roleWords, yesNo } from './format';
import { Readouts } from './Readouts';

export const SUMMARY_LABELS = {
  createdAt: 'Saved on',
  role: 'Device role in the file',
  jobs: 'Jobs',
  cars: 'Cars toward 25',
  founder: "Founder's slots used",
  photos: 'Photos',
  pin: 'Owner PIN in the file',
  version: 'App version',
  size: 'Size',
} as const;

export function BackupSummary({ summary }: { summary: Summary }) {
  return (
    <Readouts
      label="What this backup holds"
      items={[
        { label: SUMMARY_LABELS.createdAt, value: formatWhen(summary.createdAt, 'Unknown') },
        { label: SUMMARY_LABELS.role, value: roleWords(summary.deviceRole) },
        { label: SUMMARY_LABELS.jobs, value: String(summary.jobs) },
        { label: SUMMARY_LABELS.cars, value: String(summary.carsLogged) },
        { label: SUMMARY_LABELS.founder, value: String(summary.founderSlotsUsed) },
        { label: SUMMARY_LABELS.photos, value: summary.photos === 'included' ? `${summary.photoCount} included` : 'Not included' },
        { label: SUMMARY_LABELS.pin, value: yesNo(summary.hasPin) },
        { label: SUMMARY_LABELS.version, value: summary.appVersion },
        { label: SUMMARY_LABELS.size, value: formatBytes(summary.bytes) },
      ]}
    />
  );
}
