// Network check against Polar's real, public validate endpoint with a made-up key: it must answer "not found" and the
// worker must treat that as an invalid key. Skipped when the network is not reachable. Run: node --test under-review/test
import test from 'node:test';
import assert from 'node:assert/strict';
import CONFIG from '../sheet-config.json' with { type: 'json' };
import { checkKey } from '../sheet.js';

test('Polar validate answers a made-up key with a not-found, which the worker reads as invalid', async (t) => {
  if (!CONFIG.benefitId) return t.skip('no benefit id yet (the Polar product has not been created)');
  let res;
  try { res = await fetch('https://api.polar.sh/v1/customer-portal/license-keys/validate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ key: 'AURSHEET-0000-NOT-A-REAL-KEY', organization_id: CONFIG.orgId, benefit_id: CONFIG.benefitId }) }); } catch { return t.skip('network not reachable'); }
  assert.ok([404, 422].includes(res.status), 'status ' + res.status);
  assert.equal(await checkKey('AURSHEET-0000-NOT-A-REAL-KEY'), 'invalid');
});
