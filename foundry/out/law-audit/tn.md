# Tennessee (TN) law audit

Checked 2026-11-01. Status: blocked, Couldn't reach source. No ledger was written, so `check-law.mjs --state tn` will fail until the state is audited.

## Why

Tennessee Code Annotated title 67 chapter 5 is served by script through LexisNexis; the download returned 1 character, and tn.gov/revenue returned only navigation text.

## Attempts

Every attempt is logged in `foundry/out/law-audit/attempts/tn.jsonl`. URLs tried:

- https://advance.lexis.com/container?config=00JAA1MDBlYzczZi1mYjUwLTQ3OTYtYmNiMC1mMmM4YTVkNzdkOTAKAFBvZENhdGFsb2cDvPdd0S5VdSYLwL6IMEZ9&crid=0
- https://www.tn.gov/revenue/

No certificate checking was turned off. No unofficial site was used.

## How to close

Find a PDF of T.C.A. 67-5-2501 to 67-5-2504 and 67-5-2701 to 67-5-2706 on a Tennessee legislature or comptroller site.

## 2023 to 2026 law search log

Not run: no official statute text could be read.

## Watch

None.
