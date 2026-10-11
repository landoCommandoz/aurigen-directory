// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { base64ToBytes, bytesEqual, bytesToBase64, bytesToHex } from './base64';
import { hmacSha256, pbkdf2Sha256, pbkdf2Sha256Js, sha256Bytes, sha256Hex } from './crypto';

const enc = (s: string) => new TextEncoder().encode(s);

describe('base64 (no btoa)', () => {
  it('matches Node for every length 0 to 70 and round-trips', () => {
    for (let n = 0; n <= 70; n += 1) {
      const bytes = new Uint8Array(n).map((_, i) => (i * 37 + n) % 256);
      const b64 = bytesToBase64(bytes);
      expect(b64).toBe(Buffer.from(bytes).toString('base64'));
      expect(Array.from(base64ToBytes(b64))).toEqual(Array.from(bytes));
    }
  });

  it('refuses text outside the alphabet or with a bad length', () => {
    expect(() => base64ToBytes('abc')).toThrow('wrong length');
    expect(() => base64ToBytes('ab$=')).toThrow('outside the alphabet');
  });

  it('compares bytes in constant time, including different lengths', () => {
    expect(bytesEqual(enc('abc'), enc('abc'))).toBe(true);
    expect(bytesEqual(enc('abc'), enc('abd'))).toBe(false);
    expect(bytesEqual(enc('abc'), enc('abcd'))).toBe(false);
  });
});

describe('SHA-256, HMAC, PBKDF2 (pure-JS fallback equals Web Crypto)', () => {
  it('SHA-256 of known vectors', async () => {
    expect(bytesToHex(sha256Bytes(enc('')))).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    expect(bytesToHex(sha256Bytes(enc('abc')))).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    expect(await sha256Hex('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });

  it('pure-JS SHA-256 equals Web Crypto across block boundaries', async () => {
    for (const n of [0, 1, 55, 56, 63, 64, 65, 119, 120, 1000]) {
      const bytes = new Uint8Array(n).map((_, i) => (i * 13) % 256);
      const web = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
      expect(bytesToHex(sha256Bytes(bytes))).toBe(bytesToHex(web));
    }
  });

  it('HMAC-SHA-256 matches RFC 4231 test case 2', () => {
    expect(bytesToHex(hmacSha256(enc('Jefe'), enc('what do ya want for nothing?')))).toBe(
      '5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843',
    );
  });

  it('pure-JS PBKDF2 equals Web Crypto PBKDF2', async () => {
    const salt = new Uint8Array(16).map((_, i) => i);
    const js = pbkdf2Sha256Js(enc('123456'), salt, 1000);
    const web = await pbkdf2Sha256(enc('123456'), salt, 1000);
    expect(bytesToHex(js)).toBe(bytesToHex(web));
    expect(js.length).toBe(32);
  });
});
