# Unblock plan: bring the free site back with four states marked verification pending

bd item: aurigen-directory-rkk.5. Written 2026-11-02. **Plan only — nothing was switched, built for
deploy, or published to produce it.** Every figure below was read from the repo or from read-only
HTTP status checks.

## Where things actually stand

| Thing | State today |
|---|---|
| Live Worker `aurigen` | the under-review 503 page on every path except `/rules-sheet/` (200) and `/status.json` (200) |
| Audited ledgers on `main` | 4 (AK, AL, CA, DC) |
| Audited ledgers on `foundry/aurigen-law-audit` | **47** |
| Audited ledgers on `foundry/aurigen-free` | **0** |
| GA, IN, NY, TN | **no ledger file at all** on any branch |
| Oklahoma's 22 disputed claims | already `hold:true` with `shown:""` |

Two facts drive everything else.

**1. The gate is the blocker, and it is the right blocker.** `npm run build` is
`build-data → check-law → build-site`, chained with `&&`. `check-law.mjs` reports `no ledger
(cloudflare/data/law/<st>.json); N shown pieces unaudited` for every state without a ledger and
exits 1. On `main` that is 47 problems. On `foundry/aurigen-law-audit` it would be 4 — GA, IN, NY,
TN — and still exit 1, so **a restore run fails during the build and deploys nothing**. The gate is
refusing to publish legal text nobody has checked. The plan below teaches it the difference between
"unaudited and asserted anyway" and "declared pending and asserting nothing", instead of switching
it off.

**2. Restoring the wrong branch would publish 51 unaudited states.** The restore workflow's default
`restore_branch` is `foundry/aurigen-free`, which carries **zero** ledgers. The branch to restore is
`foundry/aurigen-law-audit`.

## What changes

Five code changes, one research task, and one that is only convenience.

### 1. New file: `cloudflare/data/law/pending.json`

The explicit list of states that assert nothing. Per state: code, the statute citation, a
**government** URL for it, the date the audit last failed to reach the source, and one plain
sentence saying why. Being a file rather than a flag in code means the gate and the renderer read
the same list, and a state leaves the list by being audited, not by an edit in two places.

### 2. `cloudflare/scripts/build-site.mjs` — a pending state asserts nothing

This is the substantive change, and it is wider than the state page, because unaudited claims leak
into four other places:

| Place | Line today | What it leaks | Change |
|---|---|---|---|
| State facts table | 312-316 fallback | `st.rate`, `st.redemption`, `st.bidMethod`, `st.type` from the legacy data | replace the table with the pending panel |
| State prose | `auditedProse` / legacy prose | summary, risks, due diligence, OTC, signup steps | omit entirely |
| County list shipped to the browser | 343 `countyJson` | `t`/`tl` sale type, `r` redemption, `x` interest — per-county **legal** claims | drop those four keys; keep `n`, `k`, `p`, `u`, `no`, `v`, `e` (office, platform, link, notes, date, extra), which are contact and logistics, not law |
| Home page card | 268 | `Rate` and `Redemption` | show "Verification pending" in their place |
| Page `<meta name="description">` | 413 | asserts rate and redemption in the search snippet | drop both for pending states |

Also the national map (`nationalMap`, 189) shades each state by sale type. A pending state should
take the neutral `--t-none` tone, not a sale-type colour, because the colour is itself a claim.

Sources already half-handles this: at line 348, when a state has no ledger the Sources list falls
back to `st.officialLink` labelled "(official)". That is the hook the pending panel reuses.

### 3. `cloudflare/scripts/check-law.mjs` — keep the gate, narrow it

Today: any state without a ledger is a problem. After: a state without a ledger is a problem
**unless** it is in `pending.json`, and for those states the gate instead asserts the opposite —
that the built page contains **no** claim text for it, that the pending panel and its government
link are present, and that `countyJson` carries none of the four legal keys. That turns "we skipped
these" into something the gate can prove, the same way it already proves the flagged and unreachable
labels render.

### 4. GA and TN need a government source first — this one is research, not code

All four `officialLink` values answer 200, but:

| State | officialLink host | Government? |
|---|---|---|
| IN | `iga.in.gov` | yes |
| NY | `nysenate.gov` | yes |
| GA | `advance.lexis.com` | **no — LexisNexis, a commercial host** |
| TN | `advance.lexis.com` | **no — LexisNexis, a commercial host** |

The standing rule is statute first, government link always. A pending panel whose only link is a
commercial reprint fails that rule, and on a page that exists to say "we have not checked this yet"
it would be the worst place to break it. So GA and TN need a `.gov` URL for OCGA §48-4-42 and
TCA §67-5-2701, found under the legal-research skill, before either can show a link at all. Until
then those two show the citation and no link.

### 5. Oklahoma — nothing to change

`ok.json` has 61 claims: 22 `flagged` with `hold:true`, and 36 of the 61 carry `shown:""`.
`shownClaims()` filters on `shown !== ''` and the Rules Sheet builder takes only supported or
corrected unheld claims, so both sides already omit them, consistently. The held claims stay hidden
with no work.

### 6. `.gitattributes` for the snapshot text — convenience only

`core.autocrlf=true` rewrites `foundry/out/law-audit/sources/**/*.txt` to CRLF on checkout, and
`loadSnapshot()` hashes that file against `meta.text_sha256`, so on this PC the gate reports 328
problems instead of 47. The committed LF blob hashes correctly, so **the Linux runner is unaffected
and this does not block the restore** — but it does mean no Windows session can verify the gate
before pushing, and a Windows session that ever commits one of those files would commit CRLF and
break the gate for everyone. Filed as its own bd bug.

## What deploys

One thing, and only when a person taps it:

- **GitHub Actions → "Aurigen site" → Run workflow**, `mode: restore`,
  `restore_branch: foundry/aurigen-law-audit`, and the `confirm_restore` box ticked (the job exits
  with an error if it is not).
- It checks out that branch, runs `npm ci && npm run build`, drops `/status.json` built from
  `main`'s `STATUS.md` into the assets folder, runs `wrangler deploy`, then asserts `/` and
  `/state/az/` return **200**. It replaces the under-review Worker with the full static site.
- **Cost: $0.** Cloudflare Workers free plan, Actions minutes are free on this public repo, and the
  workflow contains no Claude or API step.
- **Not touched:** Vercel (it only redirects, and the catch-all 307 stays), the Rules Sheet listing
  (that is `under-review/sheet-listing.json` plus the separate Publish workflow), Polar, and the
  domain.
- Before running it, the audit branch's `.github/workflows` must match `main`'s — a run's token
  cannot push workflow files, and that sync is already a standing rule.

Once the free site is back, `rkk.5` stops gating `6lr.7`, and the sheet can be listed without being
the only readable copy of the law.

## What a visitor sees on a pending state

Taking `/state/ga/` as the example. Everything that is a legal claim is gone; everything that is a
fact about an office, a platform or a date stays.

```
Georgia

!  Verification pending — Aurigen has not been able to read Georgia's official
   source yet. Nothing on this page states Georgia law. Last attempt: <date>.
   Statute: OCGA §48-4-42      [government link, once one is found]

   Sale type            Verification pending
   Interest / penalty   Verification pending
   Redemption           Verification pending
   Bid method           Verification pending

   [no Summary, no Key points, no Risks, no due diligence, no OTC, no signup steps]

   159 counties
   Each row: county name · Superior Court Clerk · official page link · notes · date
   (no sale type, no redemption, no interest — those are claims about the law)

   Sources
   OCGA §48-4-42 (official)
```

On the home page Georgia keeps its card and its place in search, with "Verification pending" where
Rate and Redemption sit, and the neutral grey on the map rather than a sale-type colour. It stays
findable and it stays honest: a visitor can see Aurigen covers Georgia, can reach the county office
and the statute, and is told plainly that the law text has not been checked. Nothing on the page is
a statement of Georgia law, so there is nothing to be wrong about.

## Order to do it in

1. Find the `.gov` statute URLs for GA and TN (legal-research). Blocks nothing else.
2. Write `pending.json` with all four states.
3. Change `build-site.mjs` for the six leak points, then `check-law.mjs` for the narrowed rule and
   the new positive cases.
4. Run `npm run check` and `npm run build` locally and read `/state/ga/` before anything deploys.
   (The CRLF fix in 6 makes step 4 possible on this PC; without it `npm run build` cannot pass here
   no matter what the code says.)
5. Sync `.github/workflows` from `main` to `foundry/aurigen-law-audit`.
6. Then, and only then, run "Aurigen site" → restore on `foundry/aurigen-law-audit`.
