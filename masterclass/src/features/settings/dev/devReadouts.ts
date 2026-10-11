/**
 * Pure helpers for the developer panel: the iOS version from the user agent, and the small test
 * files for the share sheet test (Phase 1 device checklist items 1 and 4). No DOM here.
 */
import { base64ToBytes } from '../../../core/base64';

/**
 * The iOS version as the user agent states it, or "not iOS". The installed Home Screen app's user
 * agent carries only the OS field ("iPhone OS 18_4"); Safari adds "Version/x.y". Recent Safari may
 * freeze the OS field, so when Safari's version is 26 or more it is shown too. The panel always
 * says to confirm in Settings, General, About (checklist item 1).
 */
export function parseIosVersion(ua: string, maxTouchPoints = 0): string {
  const os = /\b(?:iPhone|iPad|iPod)\b[^)]*?\bOS (\d+)[_.](\d+)(?:[_.](\d+))?/.exec(ua);
  const safari = /\bVersion\/(\d+)(?:\.(\d+))?/.exec(ua);
  if (os !== null) {
    const fromOs = [os[1], os[2], os[3]].filter((part) => part !== undefined).join('.');
    if (safari !== null && Number(safari[1]) >= 26) {
      return `${safari[1]}.${safari[2] ?? '0'} (Safari version; the OS field reads ${fromOs})`;
    }
    return fromOs;
  }
  if (/Macintosh/.test(ua) && maxTouchPoints > 1) {
    return safari !== null ? `iPadOS, Safari ${safari[1]}.${safari[2] ?? '0'}` : 'iPadOS (version not in the user agent)';
  }
  return 'not iOS';
}

export const SHARE_KINDS = ['png', 'pdf', 'json'] as const;
export type ShareKind = (typeof SHARE_KINDS)[number];

/** A 1 x 1 pixel PNG. */
const PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

/** A one-page PDF written by hand, with correct cross-reference offsets (ASCII only, so characters equal bytes). */
export function minimalPdf(text = 'Masterclass share test'): string {
  const safe = text.replace(/[()\\]/g, '');
  const stream = `BT /F1 18 Tf 20 50 Td (${safe}) Tj ET`;
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 100] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  let out = '%PDF-1.4\n';
  const offsets: number[] = [];
  objects.forEach((body, index) => {
    offsets.push(out.length);
    out += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefAt = out.length;
  out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) out += `${String(offset).padStart(10, '0')} 00000 n \n`;
  out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF\n`;
  return out;
}

/** The test file for one kind. Built synchronously, so the share call can stay inside the tap. */
export function shareTestFile(kind: ShareKind, atIso: string): File {
  switch (kind) {
    case 'png':
      return new File([base64ToBytes(PNG_BASE64)], 'masterclass-share-test.png', { type: 'image/png' });
    case 'pdf':
      return new File([minimalPdf()], 'masterclass-share-test.pdf', { type: 'application/pdf' });
    case 'json':
    default:
      return new File([JSON.stringify({ kind: 'masterclass-share-test', at: atIso })], 'masterclass-share-test.json', {
        type: 'application/json',
      });
  }
}

/** Plain words for how a share call ended. */
export function shareErrorWords(name: string): string {
  switch (name) {
    case 'AbortError':
      return 'The share sheet opened and was closed without picking an app.';
    case 'NotAllowedError':
      return 'Refused: the phone wanted a fresh tap.';
    case 'DataError':
    case 'TypeError':
      return 'Refused: the phone would not share this kind of file.';
    case '':
      return 'The share failed for an unknown reason.';
    default:
      return `The share failed (${name}).`;
  }
}
