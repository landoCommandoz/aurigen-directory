// Completes the certificate chain for the few official legislature hosts whose servers leave out their
// intermediate certificate (curl error 60, "unable to get local issuer certificate").
//
//   node foundry/tools/cert-chain.mjs            fetch and verify the missing intermediates (run once per audit job)
//
// What it does, per host in HOSTS:
//   1. connects with TLS checking on and reads the certificate the server sends (the leaf);
//   2. reads the leaf's Authority Information Access "CA Issuers" address, which is the issuing authority's own
//      published copy of its certificate, and downloads it;
//   3. keeps it ONLY if `openssl verify` builds a chain from the leaf through it to a root already in the
//      system trust store. A certificate that does not verify is thrown away;
//   4. saves the intermediates to foundry/out/law-audit/certs/<host>.pem and logs each one's SHA-256
//      fingerprint, subject, issuer and expiry to foundry/out/law-audit/certs/log.jsonl.
// If any step fails the host is logged as failed and stays "Couldn't reach source". Nothing is ever trusted
// without that chain check, and TLS checking is never turned off.
//
// fetch-source.mjs then adds `--cacert <system roots + this host's intermediates>` to curl for these hosts only
// (extraCurlArgs below). Every other host is fetched with the normal trust store.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const CERT_DIR = path.join(ROOT, 'foundry', 'out', 'law-audit', 'certs');
export const HOSTS = ['www.cga.ct.gov', 'cga.ct.gov', 'www.ilga.gov', 'ilga.gov'];
const SYSTEM_BUNDLES = ['/etc/ssl/certs/ca-certificates.crt', '/etc/pki/tls/certs/ca-bundle.crt', '/etc/ssl/cert.pem'];
const systemBundle = () => process.env.CERT_CHAIN_SYSTEM_CA || SYSTEM_BUNDLES.find((p) => fs.existsSync(p)) || null;

const run = (cmd, args, input) => spawnSync(cmd, args, { encoding: 'utf8', input, maxBuffer: 1 << 24, timeout: 60000 });
const pems = (text) => (text.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g) || []).map((p) => p.trim() + '\n');
const fingerprint = (pem) => crypto.createHash('sha256').update(new crypto.X509Certificate(pem).raw).digest('hex').toUpperCase().replace(/(..)(?=.)/g, '$1:');

function toPems(buf) {
  const asText = buf.toString('latin1');
  if (asText.includes('-----BEGIN CERTIFICATE-----')) return pems(asText);
  for (const args of [['x509', '-inform', 'DER', '-outform', 'PEM'], ['pkcs7', '-inform', 'DER', '-print_certs']]) {
    const r = spawnSync('openssl', args, { input: buf, maxBuffer: 1 << 24 });
    if (r.status === 0) { const p = pems(r.stdout.toString()); if (p.length) return p; }
  }
  return [];
}

function aiaIssuerUrl(certPem) {
  const r = run('openssl', ['x509', '-noout', '-ext', 'authorityInfoAccess'], certPem);
  const m = (r.stdout || '').match(/CA Issuers - URI:(\S+)/);
  return m ? m[1] : null;
}

function download(url) {
  const r = spawnSync('curl', ['-sS', '-L', '--max-redirs', '4', '--max-time', '30', '--max-filesize', '200000', '-A', 'AurigenLawAudit/1.0', url], { maxBuffer: 1 << 22 });
  if (r.status !== 0) throw new Error(`download ${url}: ${(r.stderr || '').toString().trim().slice(0, 160)}`);
  return r.stdout;
}

function chainOk(leaf, untrusted, cafile) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'chain-'));
  const l = path.join(dir, 'leaf.pem'), u = path.join(dir, 'untrusted.pem');
  fs.writeFileSync(l, leaf); fs.writeFileSync(u, untrusted.join(''));
  const args = ['verify', '-CAfile', cafile, '-no-CApath', ...(untrusted.length ? ['-untrusted', u] : []), l];
  const r = run('openssl', args);
  fs.rmSync(dir, { recursive: true, force: true });
  return { ok: r.status === 0 && /: OK/.test(r.stdout || ''), out: ((r.stdout || '') + (r.stderr || '')).trim().split('\n').slice(-2).join(' | ') };
}

export function completeChain(hostPort, { cafile = systemBundle(), certDir = CERT_DIR } = {}) {
  const [host, port = '443'] = hostPort.split(':');
  const log = { at: new Date().toISOString(), host, ok: false };
  try {
    if (!cafile) throw new Error('no system CA bundle found');
    const s = run('openssl', ['s_client', '-connect', `${host}:${port}`, '-servername', host, '-showcerts'], '');
    const served = pems(s.stdout || '');
    if (!served.length) throw new Error('no certificate received from the server');
    const leaf = served[0];
    log.leaf = { subject: new crypto.X509Certificate(leaf).subject.replace(/\n/g, ', '), sha256: fingerprint(leaf), notAfter: new crypto.X509Certificate(leaf).validTo };
    log.served = served.length;
    const direct = chainOk(leaf, served.slice(1), cafile);
    if (direct.ok) { log.ok = true; log.note = 'the server already sends a complete chain; nothing added'; return finish(log, [], host, certDir); }
    const added = [];
    let cur = served.length > 1 ? served[served.length - 1] : leaf;
    for (let depth = 0; depth < 3; depth++) {
      const url = aiaIssuerUrl(cur);
      if (!url) throw new Error('the certificate has no CA Issuers address to fetch the issuer from');
      const got = toPems(download(url));
      if (!got.length) throw new Error(`could not read a certificate from ${url}`);
      for (const p of got) {
        const x = new crypto.X509Certificate(p);
        if (new Date(x.validTo) < new Date() || new Date(x.validFrom) > new Date()) throw new Error(`certificate from ${url} is not valid today`);
        added.push({ pem: p, url, subject: x.subject.replace(/\n/g, ', '), issuer: x.issuer.replace(/\n/g, ', '), sha256: fingerprint(p), notAfter: x.validTo });
      }
      const test = chainOk(leaf, [...served.slice(1), ...added.map((a) => a.pem)], cafile);
      if (test.ok) { log.ok = true; log.verify = 'chain from the leaf through the fetched certificate(s) to a root in the system store: OK'; return finish(log, added, host, certDir); }
      cur = added[added.length - 1].pem;
    }
    throw new Error('the fetched certificates do not chain to a trusted root');
  } catch (e) {
    log.error = String(e.message || e).slice(0, 300);
    return finish(log, [], host, certDir);
  }
}

function finish(log, added, host, certDir) {
  fs.mkdirSync(certDir, { recursive: true });
  const file = path.join(certDir, `${host}.pem`);
  if (log.ok && added.length) { fs.writeFileSync(file, added.map((a) => a.pem).join('')); log.certs = added.map(({ url, subject, issuer, sha256, notAfter }) => ({ url, subject, issuer, sha256, notAfter })); }
  else if (fs.existsSync(file)) fs.rmSync(file);
  fs.appendFileSync(path.join(certDir, 'log.jsonl'), JSON.stringify(log) + '\n');
  return log;
}

// Extra curl arguments for one URL: for the listed hosts only, trust the system roots plus the verified
// intermediates saved by completeChain(). Returns [] for every other host or when nothing was saved.
export function extraCurlArgs(url, { certDir = CERT_DIR, hosts = HOSTS, cafile = systemBundle() } = {}) {
  let h;
  try { h = new URL(url).hostname.toLowerCase(); } catch { return []; }
  if (!hosts.includes(h) || !cafile) return [];
  const f = path.join(certDir, `${h}.pem`);
  if (!fs.existsSync(f)) return [];
  const bundle = path.join(os.tmpdir(), `aurigen-ca-${h}.pem`);
  fs.writeFileSync(bundle, fs.readFileSync(cafile, 'utf8') + '\n' + fs.readFileSync(f, 'utf8'));
  return ['--cacert', bundle];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const hosts = process.argv.slice(2).length ? process.argv.slice(2) : ['www.cga.ct.gov', 'www.ilga.gov'];
  let bad = 0;
  for (const h of hosts) {
    const r = completeChain(h);
    console.log(`${h}: ${r.ok ? 'ok' : 'FAILED'}${r.note ? ' (' + r.note + ')' : ''}${r.error ? ' ' + r.error : ''}`);
    for (const c of r.certs || []) console.log(`  added ${c.subject} sha256=${c.sha256}`);
    if (!r.ok) bad++;
    // The bare domain (cga.ct.gov) is served with the same certificate as www, so it shares the saved file.
    const from = path.join(CERT_DIR, `${h}.pem`);
    if (r.ok && fs.existsSync(from) && h.startsWith('www.')) fs.copyFileSync(from, path.join(CERT_DIR, `${h.slice(4)}.pem`));
  }
  process.exit(0);
}
