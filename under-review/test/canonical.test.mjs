// The one address the site answers on, and what happens to every other one.
//
// This lives here rather than beside the Worker because this is the directory the deploy
// workflows run `node --test` against, and an untested redirect is how a shared link quietly
// stops working. `wrangler dev` cannot exercise it: it answers on 127.0.0.1 whatever Host
// header is sent, so the rule is tested by calling it directly.
import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalRedirect, CANONICAL_HOST } from '../../cloudflare/src/worker.js';

test('the real address is left alone', () => {
  for (const u of [
    'https://theplatbook.com/',
    'https://theplatbook.com/state/fl/',
    'https://theplatbook.com/rules-sheet/?key=ABC-123',
  ]) assert.equal(canonicalRedirect(u), null, u);
});

test('www goes to the apex, same path', () => {
  assert.equal(canonicalRedirect('https://www.theplatbook.com/'), 'https://theplatbook.com/');
  assert.equal(canonicalRedirect('https://www.theplatbook.com/state/fl/'), 'https://theplatbook.com/state/fl/');
});

test('both workers.dev addresses go to the apex, same path', () => {
  assert.equal(
    canonicalRedirect('https://platbook.landonbrewington12.workers.dev/state/az/'),
    'https://theplatbook.com/state/az/',
  );
  assert.equal(
    canonicalRedirect('https://aurigen.landonbrewington12.workers.dev/about/'),
    'https://theplatbook.com/about/',
  );
});

test('the query string survives, so a licence link keeps its key', () => {
  assert.equal(
    canonicalRedirect('https://www.theplatbook.com/rules-sheet/?key=ABC-123&x=1'),
    'https://theplatbook.com/rules-sheet/?key=ABC-123&x=1',
  );
});

test('http is upgraded to https on the way', () => {
  assert.equal(canonicalRedirect('http://www.theplatbook.com/legal/'), 'https://theplatbook.com/legal/');
});

test('a port is dropped, never carried onto the public address', () => {
  assert.equal(canonicalRedirect('http://example.test:8788/state/fl/'), 'https://theplatbook.com/state/fl/');
});

test('local development is exempt, or wrangler dev would redirect away from itself', () => {
  for (const u of [
    'http://localhost:8787/',
    'http://127.0.0.1:8788/state/fl/',
    'http://[::1]:8787/',
    'http://0.0.0.0:8787/',
  ]) assert.equal(canonicalRedirect(u), null, u);
});

test('a lookalike hostname is not treated as the real one', () => {
  for (const u of [
    'https://theplatbook.com.evil.test/',
    'https://nottheplatbook.com/',
    'https://sub.theplatbook.com/',
  ]) assert.equal(canonicalRedirect(u), `https://${CANONICAL_HOST}/`, u);
});
