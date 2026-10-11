/**
 * Standard base64 (with padding) for bytes, written out so the app never relies on btoa()
 * or atob() (CLAUDE.md Tier 4). Output matches what zod's z.base64() accepts.
 */

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const LOOKUP = new Int16Array(128).fill(-1);
for (let i = 0; i < ALPHABET.length; i += 1) LOOKUP[ALPHABET.charCodeAt(i)] = i;

export function bytesToBase64(bytes: Uint8Array): string {
  const parts: string[] = [];
  const CHUNK = 3 * 4096;
  for (let start = 0; start < bytes.length; start += CHUNK) {
    const end = Math.min(start + CHUNK, bytes.length);
    let out = '';
    for (let i = start; i < end; i += 3) {
      const a = bytes[i] ?? 0;
      const hasB = i + 1 < end;
      const hasC = i + 2 < end;
      const b = hasB ? (bytes[i + 1] ?? 0) : 0;
      const c = hasC ? (bytes[i + 2] ?? 0) : 0;
      const n = (a << 16) | (b << 8) | c;
      out += ALPHABET.charAt((n >> 18) & 63) + ALPHABET.charAt((n >> 12) & 63);
      out += hasB ? ALPHABET.charAt((n >> 6) & 63) : '=';
      out += hasC ? ALPHABET.charAt(n & 63) : '=';
    }
    parts.push(out);
  }
  return parts.join('');
}

/** Decode standard base64. Throws on a character outside the alphabet or a bad length. */
export function base64ToBytes(text: string): Uint8Array<ArrayBuffer> {
  const clean = text.replace(/\s+/g, '');
  if (clean.length % 4 !== 0) throw new Error('base64 text has the wrong length');
  const padding = clean.endsWith('==') ? 2 : clean.endsWith('=') ? 1 : 0;
  const outLength = (clean.length / 4) * 3 - padding;
  const out = new Uint8Array(outLength);
  let o = 0;
  for (let i = 0; i < clean.length; i += 4) {
    const values = [0, 1, 2, 3].map((k) => {
      const ch = clean.charCodeAt(i + k);
      if (ch === 61 /* = */) return 0;
      const v = ch < 128 ? (LOOKUP[ch] ?? -1) : -1;
      if (v < 0) throw new Error('base64 text has a character outside the alphabet');
      return v;
    });
    const n = ((values[0] ?? 0) << 18) | ((values[1] ?? 0) << 12) | ((values[2] ?? 0) << 6) | (values[3] ?? 0);
    if (o < outLength) out[o++] = (n >> 16) & 255;
    if (o < outLength) out[o++] = (n >> 8) & 255;
    if (o < outLength) out[o++] = n & 255;
  }
  return out;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Constant-time comparison of two byte arrays of possibly different lengths. */
export function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  let diff = a.length ^ b.length;
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i += 1) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}
