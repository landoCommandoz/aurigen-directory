# New Jersey (NJ) law audit

Checked 2026-11-01. Status: blocked, Couldn't reach source. No ledger was written, so `check-law.mjs --state nj` will fail until the state is audited.

## Why

New Jersey's tax sale law (N.J.S.A. 54:5) was not reachable as text: pub.njleg.gov and pub.njleg.state.nj.us returned HTTP 404 for the statute PDF, and the legislature's database page returned no text.

## Attempts

Every attempt is logged in `foundry/out/law-audit/attempts/nj.jsonl`. URLs tried:

- https://pub.njleg.state.nj.us/Statutes/STATUTES-PDF/54-5.pdf
- https://pub.njleg.gov/statutes/STATUTES-PDF/54-5-19.pdf
- https://pub.njleg.gov/Statutes/STATUTES-PDF/54-5.pdf
- https://lis.njleg.state.nj.us/nxt/gateway.dll?f=templates&fn=default.htm&vid=Publish:10.1048/Enu

No certificate checking was turned off. No unofficial site was used.

## How to close

Find the correct official PDF path for N.J.S.A. 54:5 and 54:5-19 and related sections, or the Division of Taxation's tax sale guidance.

## 2023 to 2026 law search log

Not run: no official statute text could be read.

## Watch

None.
