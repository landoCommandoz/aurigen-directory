/**
 * Plain-words formatting for settings screens. Pure; no DOM.
 */

/** "Oct 10, 2026, 3:04 PM" in the phone's own locale and time zone, or the fallback for null or junk. */
export function formatWhen(iso: string | null | undefined, fallback = 'Never'): string {
  if (iso === null || iso === undefined || iso === '') return fallback;
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return fallback;
  try {
    return new Date(ms).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return new Date(ms).toISOString();
  }
}

export function yesNo(value: boolean | null | undefined, unknown = 'Not known'): string {
  if (value === null || value === undefined) return unknown;
  return value ? 'Yes' : 'No';
}

/** "1.2 MB" or "820 KB" for a byte count. */
export function formatBytes(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined || !Number.isFinite(bytes) || bytes < 0) return 'Not known';
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`;
}

export function formatMB(mb: number | null | undefined): string {
  if (mb === null || mb === undefined || !Number.isFinite(mb)) return 'Not known';
  return `${mb} MB`;
}

/** 'unknown': a backup made while its phone could not read its role (DEF-13). */
export function roleWords(role: 'study' | 'shop' | 'unknown'): string {
  switch (role) {
    case 'shop':
      return 'Shop phone';
    case 'study':
      return 'Study phone';
    case 'unknown':
      return 'Not readable';
    default:
      return 'Study phone';
  }
}

/** Whole minutes and seconds left, "4 min 05 s". */
export function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return minutes > 0 ? `${minutes} min ${String(seconds).padStart(2, '0')} s` : `${seconds} s`;
}
