# Indiana (IN) law audit

Checked 2026-11-01. Status: blocked, Couldn't reach source. No ledger was written, so `check-law.mjs --state in` will fail until the state is audited.

## Why

Indiana Code (title 6 article 1.1 chapter 24) on iga.in.gov is served by script: both the laws page and the pdf-documents path returned no text (1 character).

## Attempts

Every attempt is logged in `foundry/out/law-audit/attempts/in.jsonl`. URLs tried:

- https://iga.in.gov/laws/2025/ic/titles/6
- https://iga.in.gov/pdf-documents/124/2025/ic/titles/6
- https://iga.in.gov/ic/2025/Title_6/Article_1.1/Chapter_24

No certificate checking was turned off. No unofficial site was used.

## How to close

Find a PDF of IC 6-1.1-24 to 6-1.1-25 on iga.in.gov or the Indiana Department of Local Government Finance.

## 2023 to 2026 law search log

Not run: no official statute text could be read.

## Watch

None.
