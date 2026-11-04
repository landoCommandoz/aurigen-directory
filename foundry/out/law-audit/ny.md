# New York (NY) law audit

Checked 2026-11-01. Status: blocked, Couldn't reach source. No ledger was written, so `check-law.mjs --state ny` will fail until the state is audited.

## Why

New York Real Property Tax Law article 11 on nysenate.gov returned HTTP 403 to the audit's download tool.

## Attempts

Every attempt is logged in `foundry/out/law-audit/attempts/ny.jsonl`. URLs tried:

- https://www.nysenate.gov/legislation/laws/RPT/A11

No certificate checking was turned off. No unofficial site was used.

## How to close

Find another official copy of RPTL article 11 (e.g. legislation.nysenate.gov or the Department of Taxation and Finance) that allows the download tool.

## 2023 to 2026 law search log

Not run: no official statute text could be read.

## Watch

None.
