# Wiki System — How to Use

This wiki tracks institutional knowledge for the local-biz automated website pipeline. It follows the Karpathy-style project wiki pattern: raw notes flow in, organized knowledge lives in pages, and a log tracks every session.

## Structure

```
wiki/
├── claude.md        ← You are here. Instructions for agents.
├── index.md         ← Master table of contents. Always current.
├── log.md           ← Append-only session log. Newest entries at top.
├── raw/             ← Unprocessed notes, dumps, observations. Messy is fine.
└── pages/           ← Organized knowledge pages. One topic per file.
```

## Rules for Agents

1. **Read index.md first** to understand what pages exist before creating new ones.
2. **Append to log.md** at the top (reverse chronological) after every session that touches the pipeline.
3. **Raw notes go in `raw/`** — paste debug output, API responses, error traces, brainstorm lists. Name files descriptively: `2026-04-06-scraper-timeout-debug.md`.
4. **Organized knowledge goes in `pages/`** — each file covers one topic. Keep them updated, not duplicated.
5. **Update index.md** whenever you add or remove a page.
6. **Never delete raw notes.** They are the source record. Organize them into pages instead.
7. **Never touch pipeline code from wiki files.** This is documentation only.

## Page Naming Convention

Use kebab-case: `niche-results.md`, `prompt-versions.md`, `deployed-sites.md`.

## What to Track

- **Niche results**: What niches were tested, in which cities, hit rates, saturation signals.
- **Pipeline decisions**: Why something was built a certain way, what alternatives were considered.
- **Generator prompt versions**: When the prompt changed, what changed, why.
- **Deployed sites**: Business name, niche, city, URL, status (live/down/claimed).
- **Known issues**: Bugs encountered, root causes, fixes applied.
- **Outreach results**: Email response rates, objections heard, what copy worked.

## How to Ingest New Knowledge

1. Dump raw observations into `raw/` with a dated filename.
2. Read the relevant page in `pages/`.
3. Merge the new information into the page.
4. Log the session in `log.md`.
5. Update `index.md` if pages were added.
