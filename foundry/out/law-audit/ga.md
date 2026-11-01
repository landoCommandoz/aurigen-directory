# Georgia (GA) law audit

Checked 2026-11-01. Status: blocked, Couldn't reach source. No ledger was written, so `check-law.mjs --state ga` will fail until the state is audited.

## Why

Georgia's official code (O.C.G.A. title 48 chapter 4) is only served to browsers by script: legis.ga.gov and the LexisNexis public code link returned pages with no statute text (68 and 1 characters). dor.georgia.gov/tax-sales returned HTTP 404.

## Attempts

Every attempt is logged in `foundry/out/law-audit/attempts/ga.jsonl`. URLs tried:

- https://www.legis.ga.gov/
- https://www.legis.ga.gov/legislation/ocga
- https://advance.lexis.com/documentpage/?pdmfid=1000516&crid=&pdocfullpath=%2Fshared%2Fdocument%2Fstatutes-legislation%2Furn%3AcontentItem%3A5YD9-KJC1-FGRY-B4V1-00000-00&pdcontentcomponentid=234186
- https://dor.georgia.gov/tax-sales

No certificate checking was turned off. No unofficial site was used.

## How to close

Find a print or PDF copy of O.C.G.A. 48-4-40 to 48-4-48 on legis.ga.gov or a Georgia state body, or the enacted acts (HB 581 and others) as PDFs.

## 2023 to 2026 law search log

Not run: no official statute text could be read.

## Watch

None.
