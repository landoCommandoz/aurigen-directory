# Platbook release — the exact clicks

Everything below is prepared on the branch `rebrand/platbook`. Nothing on this list has
been done. The live site is untouched and still answers as Aurigen.

Three of these steps are blocked for the assistant and need Lando (or a permission
change). They are marked **LANDO**.

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

## 2. Merge the branch

`rebrand/platbook` into `main`. Nothing on main deploys by itself, with two exceptions
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

- `aurigendirectory.com` still points at nothing; the domain plan in `domain/README.md` is
  unchanged by the rename, except that the Worker it attaches to is now called `platbook`.
- The old browser setting `aurigen_lang` is still read once, so anyone who chose Spanish
  before the rename stays in Spanish.
- The GitHub repository itself is still called `aurigen-directory`. Renaming it is a
  separate decision; nothing here depends on it.
