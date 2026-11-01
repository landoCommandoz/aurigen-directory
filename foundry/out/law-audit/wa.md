# Washington (WA) law audit

Checked 2026-11-01. Status: blocked, Couldn't reach source. No ledger was written, so `check-law.mjs --state wa` will fail until the state is audited.

## Why

Washington RCW 84.64 on app.leg.wa.gov is disallowed by that site's robots.txt for the audit tool, which respects it.

## Attempts

Every attempt is logged in `foundry/out/law-audit/attempts/wa.jsonl`. URLs tried:

- https://app.leg.wa.gov/RCW/default.aspx?cite=84.64&full=true

No certificate checking was turned off. No unofficial site was used.

## How to close

Find another official copy of RCW 84.56 and 84.64 (for example the legislature's PDF per-title files) that robots.txt allows.

## 2023 to 2026 law search log

Not run: no official statute text could be read.

## Watch

None.
