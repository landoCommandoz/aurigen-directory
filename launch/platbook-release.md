# Platbook release — DONE 2026-11-08

Lando said go at 08:50 UTC on 2026-11-08 and the release went out the same hour. The site
is **https://platbook.landonbrewington12.workers.dev**. The rest of this file is kept as
the record of how it was done and what is still open.

## What actually happened

| Step | How it went |
|---|---|
| Merge both branches to main | Done. A Foundry run landed on main mid-release and had to be merged in too. |
| Deploy the site | Done, `platbook` Worker. Three runs: the first missed its cron trigger (see below), the second attached it, the third carried the canonical fix. |
| Forward the old address | Done. Every path 301s, query strings kept. |
| Vercel | Repointed, plus a new rule so its home page no longer loads the retired `gate.html` first. |
| Checks | Home, FL, AZ, GA, about, legal, status, robots, sitemap, 404 and the Rules Sheet all answer. 28 of 28 page/width combinations clean at 375 to 1440 px on the live site. |

## Three things that only showed up on the live run

1. **Cron limit.** The free plan allows 5 cron triggers per account and the old `aurigen`
   Worker still held one, so the first deploy of `platbook` could not attach its daily
   licence-cache job. Deploying the forwarder (no cron) freed the slot and the next deploy
   took it. Nothing was lost; the gap was about four minutes.
2. **Canonical address.** The deploy workflow passes `SITE_URL` as the *old* address, so
   the first Platbook pages went out with `<link rel="canonical">` and the sitemap pointing
   at what is now a 301. `build-site.mjs` now refuses that one host and says so in the build
   log. Fixed and redeployed within minutes.
3. **Every restore run now ends red.** The workflow's final check asks the old address for a
   page and gets a redirect. The deploy before it succeeds. See step 1 below for the cure.

## Still open

- The four `SITE_URL` lines (step 1 below) — bead `aurigen-directory-6rz`.
- The only "Aurigen" a visitor can still see is the GitHub link on `/about/` and the Rules
  Sheet. It is the real project address, so changing the words would break the link;
  renaming the project online is a separate decision (GitHub forwards the old name).
- `forward/aurigen-redirect` is a permanent branch that exists only to deploy the redirect
  Worker. **Never merge it to main.** Redeploy the forwarder by running "Aurigen site" with
  that branch; its last step fails on purpose.

---

## 0. What goes live in this one release

- The name: Aurigen becomes Platbook everywhere a visitor can see it — page titles,
  header, footer, about, legal, 404, the Rules Sheet, the under-review page, the status
  file and the link-preview text.
- The look: deep cyanotype blue ink on warm drafting paper, statute quotes in monospace,
  every colour in one block of variables at the top of `cloudflare/src/site.css`.
- The layout fix: the home-page badge used to carry the full audited sale-type sentence,
  which forced cards wider than the page, printed on top of the state code and pushed the
  whole page sideways at 768px and up. The badge now carries the short type only.
- The address: the Worker is renamed `platbook`, and a redirect Worker keeps the name
  `aurigen` so every old link still lands on the matching new page.
- The corrected status line (the one that still claims the site is under review).

## 1. LANDO — let the assistant push the automation files

The stored GitHub token has no `workflow` permission, so four automation files cannot be
pushed from this machine. Either:

- **Easiest:** in the Claude Code prompt type `! gh auth refresh -s workflow` and approve
  in the browser. Then the assistant can push them and steps 2 and 3 become automatic.
- **Or by hand** on github.com: open each file, pencil icon, change the one line, Commit.

The four files and the single change in each — replace
`aurigen.landonbrewington12.workers.dev` with `platbook.landonbrewington12.workers.dev`:

| File | Line | What it is |
|---|---|---|
| `.github/workflows/aurigen-site.yml` | 36 (`SITE_URL:`) | the address the deploy checks afterwards |
| `.github/workflows/status-publish.yml` | 29 (`SITE_URL:`) and the comment on line 1 | same |
| `.github/workflows/domain-attach.yml` | 21 (`SITE_URL:`) | same |
| `.github/workflows/publish.yml` | 47 (the `else` branch) | the address printed in the launch message |

**If this step is skipped the release still works, but the deploy job reports a failure
at the end:** it would check the old address, which now answers with a redirect (301)
instead of a page (200). The site itself would be live and correct.

## 2. Merge the branches — both of them

**`foundry/aurigen-law-audit` first, then `rebrand/platbook`.**

The audit branch carries the Florida gap closure: on 2026-11-08 the checker read
ch. 2024-91, ch. 2024-140 and ch. 2026-174 as chaptered acts and read §197.502(6) and
§197.522 to §197.532, so Florida moved from "checked with gaps" to **checked**. It also
tried New York and Indiana again and logged both as still blocked.

**Correction to an earlier version of this file:** that work changed no page text. The run
found that no shown Florida claim needed changing, and it touched only
`cloudflare/data/law/gaps.json`, which no build script reads. Florida's page text was
already corrected on 2026-11-01 and has been live since 2026-11-04. Merging the audit
branch publishes the *record* that the 2024 and 2026 acts do not affect the page — it does
not change what a visitor reads. Nothing about the Florida page was waiting on this
release.

The two branches touch different files — the audit branch touches `cloudflare/data/law/`
and `foundry/out/`, the rebrand touches the site's code and copy — except for
`cloudflare/data/law/gaps.json` and `foundry/out/law-audit/PROGRESS.json`, where the
rebrand branch only reordered the queue and the audit branch only marked Florida closed.
Take both changes.

Nothing on main deploys by itself, with two exceptions
that fire on merge and are both wanted here:

- **Polar sheet** runs because `polar/rules-sheet.json` changed: it renames the live
  product to "Platbook Rules Sheet". No money moves; the sheet is already free.
- **Status publish** runs because `STATUS.md` changed, and does nothing while the full
  site is live. That is why step 3 is what actually publishes the status line.

## 3. Publish the site

GitHub → **Actions** → **Aurigen site** → **Run workflow**:

- mode: **restore**
- restore_branch: **main**
- confirm_restore: **tick the box**
- Run workflow

This builds from main and deploys the renamed Worker. The build runs the law safety check
first and stops if it fails. Afterwards `platbook.landonbrewington12.workers.dev` is the
site, and `/status.json` carries the corrected line.

**LANDO:** the assistant is refused permission to start a production deploy, so this run
has to be started by a person.

## 4. Turn the old address into a forwarder

This is the only step that needs a Cloudflare deploy of a second Worker, and there is no
workflow for it yet. Either add one, or run it once from a machine with a Cloudflare
token:

```
cd forward
npx wrangler@4.148.0 deploy
```

It deploys `forward/worker.js` under the name `aurigen`, which is the name the old
workers.dev address is built from. After this, every old link 301s to the same path on
the new address: `/state/fl/` → `/state/fl/`, `/rules-sheet/?key=…` keeps its key,
`/status.json` still answers.

**Order matters: do step 3 before step 4.** Deploying the forwarder first would redirect
the old address to a Worker that does not exist yet.

## 5. Check it

- `https://platbook.landonbrewington12.workers.dev/` — home, says Platbook
- `https://platbook.landonbrewington12.workers.dev/state/fl/` — Florida
- `https://aurigen.landonbrewington12.workers.dev/state/fl/` — should land on the Florida
  page at the new address
- `https://platbook.landonbrewington12.workers.dev/status.json` — no longer says the site
  is under review

## 6. Afterwards

- `aurigendirectory.com` is parked and out of reach. Lando, 2026-11-08: "I can't change
  aurigendirectory.com right now, because it's locked behind an account I can't reach.
  Don't plan around it. The platbook address is permanent until we buy a new domain."
  So `platbook.landonbrewington12.workers.dev` is the permanent address, and
  `domain/README.md` plus the Domain zone and Domain attach workflows are parked.
- The old browser setting `aurigen_lang` is still read once, so anyone who chose Spanish
  before the rename stays in Spanish.
- The GitHub repository itself is still called `aurigen-directory`. Renaming it is a
  separate decision; nothing here depends on it.
