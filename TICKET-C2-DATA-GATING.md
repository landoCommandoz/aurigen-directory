# C2 CRITICAL: Data Files Publicly Accessible — Architectural Gating Required

## Classification
- **Severity**: C2 — Critical
- **Type**: Architecture / Data Exposure
- **Status**: Ready to blueprint

## Problem
`states-en.js` and `states-es.js` are publicly accessible via direct URL. Anyone can download the complete paid dataset. These files contain the entire 51-state directory — the core paid product. Netlify redirect rules cannot block these without breaking the app, since `index.html` loads them via `<script src>`.

This is the last open critical security vector.

## Required Fix
1. **Create Netlify serverless function**: `/netlify/functions/get-states.js`
2. **Function checks access token** from request header or cookie
3. **Returns state data only if token valid** — unauthenticated requests get free-tier data only (FL, IL, AZ)
4. **`index.html` fetches data from function** instead of loading via `<script src="states-en.js">`
5. **Move `states-en.js` and `states-es.js` out of public directory** entirely

## Implementation Notes
- This is a **separate PR** — do not bundle with other work
- Requires changes to how `index.html` initializes state data (currently expects global `STATES_EN` / `STATES_ES` arrays)
- Token validation should reuse existing gate/Stripe verification logic from `aurigen.js`
- Free states (FL, IL, AZ) should remain accessible without authentication
- Blueprint review required before implementation begins

## Dependencies
- Security PR merged first (C1 + C3 fixes)
- @cipher-security Level 3 re-run scheduled after this ships

## Acceptance Criteria
- [ ] Direct URL access to state data files returns 404 or redirect
- [ ] Authenticated users receive full 51-state data via function
- [ ] Unauthenticated users receive only free-tier states (FL, IL, AZ)
- [ ] No regression in app functionality (map, tabs, language toggle)
- [ ] @cipher-security Level 3 PASS
