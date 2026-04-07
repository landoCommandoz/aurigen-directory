# Known Issues & Resolutions

## Open Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| K-001 | Max 20 leads per scraper run (Google Places API limit) | Low | Pagination not implemented. Run multiple times with different queries to get more leads. |
| K-002 | No duplicate detection across scraper runs | Medium | If you run `scraper.js` twice with the same query, leads may be duplicated in `leads.csv`. Generator/deployer skip already-processed rows, but CSV grows. |
| K-003 | Email generation has no send capability | Info | `emails.csv` is output-only. Manual send or integration with email service needed. |
| K-004 | No photo fallback for businesses without Google photos | Low | Sites without photos rely on typography and layout only. Could add placeholder/pattern backgrounds. |
| K-005 | Niche detection is substring matching | Low | `getNicheColors()` does fuzzy substring match. Unusual category strings from Google may not match any niche. Falls back to gold. |

## Resolved Issues

| ID | Issue | Resolution | Date |
|----|-------|-----------|------|
| (none yet) | | | |

## Error Handling Notes

- Each script logs errors per-row and continues (doesn't halt on single failures)
- `emailbuilder.js` writes errors to `email-errors.log`
- Deployer retries are not implemented — a failed Netlify deploy skips that row
- Generator wraps Anthropic calls but doesn't retry on rate limits
