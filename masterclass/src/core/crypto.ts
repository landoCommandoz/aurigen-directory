/**
 * Hashing for the owner PIN (D4) and the backup checksum (src/schemas/backup.ts).
 * Web Crypto first. When crypto.subtle is missing (an insecure context or an old engine),
 * a small pure-JS SHA-256, HMAC, and PBKDF2 give byte-identical results, so a PIN set on
 * one phone verifies on another whichever path either phone used (D4 fallback).
 */
import { bytesToHex } from './base64';

const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98,
  0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8,
  0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
  0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7,
  0xc67178f2,
]);

/** Pure-JS SHA-256 of bytes. Used only when crypto.subtle is unavailable, and in tests against it. */
export function sha256Bytes(message: Uint8Array): Uint8Array<ArrayBuffer> {
  const h = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);
  const bitLength = message.length * 8;
  const padded = new Uint8Array(Math.ceil((message.length + 9) / 64) * 64);
  padded.set(message);
  padded[message.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, Math.floor(bitLength / 0x100000000));
  view.setUint32(padded.length - 4, bitLength >>> 0);
  const w = new Uint32Array(64);
  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let t = 0; t < 16; t += 1) w[t] = view.getUint32(offset + t * 4);
    for (let t = 16; t < 64; t += 1) {
      const x = w[t - 15] ?? 0;
      const y = w[t - 2] ?? 0;
      const s0 = ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3);
      const s1 = ((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10);
      w[t] = ((w[t - 16] ?? 0) + s0 + (w[t - 7] ?? 0) + s1) >>> 0;
    }
    let a = h[0] ?? 0;
    let b = h[1] ?? 0;
    let c = h[2] ?? 0;
    let d = h[3] ?? 0;
    let e = h[4] ?? 0;
    let f = h[5] ?? 0;
    let g = h[6] ?? 0;
    let hh = h[7] ?? 0;
    for (let t = 0; t < 64; t += 1) {
      const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      const ch = (e & f) ^ (~e & g);
      const t1 = (hh + S1 + ch + (K[t] ?? 0) + (w[t] ?? 0)) >>> 0;
      const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      hh = g;
      g = f;
      f = e;
      e = (d + t1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) >>> 0;
    }
    h[0] = ((h[0] ?? 0) + a) >>> 0;
    h[1] = ((h[1] ?? 0) + b) >>> 0;
    h[2] = ((h[2] ?? 0) + c) >>> 0;
    h[3] = ((h[3] ?? 0) + d) >>> 0;
    h[4] = ((h[4] ?? 0) + e) >>> 0;
    h[5] = ((h[5] ?? 0) + f) >>> 0;
    h[6] = ((h[6] ?? 0) + g) >>> 0;
    h[7] = ((h[7] ?? 0) + hh) >>> 0;
  }
  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  for (let i = 0; i < 8; i += 1) outView.setUint32(i * 4, h[i] ?? 0);
  return out;
}

function concat(...parts: Uint8Array[]): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.length;
  }
  return out;
}

/** Pure-JS HMAC-SHA-256 (RFC 2104). */
export function hmacSha256(key: Uint8Array, message: Uint8Array): Uint8Array<ArrayBuffer> {
  const block = new Uint8Array(64);
  block.set(key.length > 64 ? sha256Bytes(key) : key);
  const ipad = block.map((b) => b ^ 0x36);
  const opad = block.map((b) => b ^ 0x5c);
  return sha256Bytes(concat(opad, sha256Bytes(concat(ipad, message))));
}

/** Pure-JS PBKDF2-HMAC-SHA-256 with a 32-byte output (RFC 8018, one block). */
export function pbkdf2Sha256Js(password: Uint8Array, salt: Uint8Array, iterations: number): Uint8Array<ArrayBuffer> {
  let u = hmacSha256(password, concat(salt, new Uint8Array([0, 0, 0, 1])));
  const out = new Uint8Array(u);
  for (let i = 1; i < iterations; i += 1) {
    u = hmacSha256(password, u);
    for (let j = 0; j < out.length; j += 1) out[j] = (out[j] ?? 0) ^ (u[j] ?? 0);
  }
  return out;
}

function subtle(): SubtleCrypto | null {
  const s = globalThis.crypto?.subtle;
  return s !== undefined && typeof s.deriveBits === 'function' && typeof s.digest === 'function' ? s : null;
}

/** Which path hashing takes on this device; shown in the developer panel. */
export function cryptoPath(): 'webcrypto' | 'pure-js' {
  return subtle() === null ? 'pure-js' : 'webcrypto';
}

/** PBKDF2-HMAC-SHA-256, 32 bytes. Web Crypto when present, else the pure-JS version. */
export async function pbkdf2Sha256(password: Uint8Array<ArrayBuffer>, salt: Uint8Array<ArrayBuffer>, iterations: number): Promise<Uint8Array<ArrayBuffer>> {
  const s = subtle();
  if (s !== null) {
    try {
      const key = await s.importKey('raw', password, 'PBKDF2', false, ['deriveBits']);
      const bits = await s.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
      return new Uint8Array(bits);
    } catch {
      // Some engines expose subtle but refuse PBKDF2; the pure-JS path gives the same bytes.
    }
  }
  return pbkdf2Sha256Js(password, salt, iterations);
}

/** SHA-256 of bytes. */
export async function sha256(bytes: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
  const s = subtle();
  if (s !== null) {
    try {
      return new Uint8Array(await s.digest('SHA-256', bytes));
    } catch {
      // Fall through to the pure-JS digest.
    }
  }
  return sha256Bytes(bytes);
}

/** SHA-256 of the UTF-8 bytes of a string, as 64 lowercase hex characters (the backup checksum format). */
export async function sha256Hex(text: string): Promise<string> {
  return bytesToHex(await sha256(new TextEncoder().encode(text)));
}

export function randomBytes(length: number): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(length);
  const c = globalThis.crypto;
  if (typeof c?.getRandomValues === 'function') {
    c.getRandomValues(out);
    return out;
  }
  // No secure random source: weaker, but the PIN is a fence, not a lock (D4).
  for (let i = 0; i < length; i += 1) out[i] = Math.floor(Math.random() * 256);
  return out;
}
