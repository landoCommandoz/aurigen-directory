# Law audit summary

Spec: `foundry/aurigen-law-audit.md`. Gate: `cloudflare/scripts/check-law.mjs`. Ledgers: `cloudflare/data/law/<st>.json`.
States done: 4 of 51 (AK, AL, CA, DC).

| State | Status | Date | Claims | Supported | Corrected | Flagged | Unreachable | Pass 2 trims | Report |
|---|---|---|---|---|---|---|---|---|---|
| AK | done | 2026-10-27 | 69 | 1 | 60 | 6 | 2 | 50 | [ak.md](ak.md) |
| AL | done | 2026-10-27 | 70 | 2 | 66 | 2 | 0 | 62 | [al.md](al.md) |
| CA | done | 2026-10-27 | 70 | 7 | 62 | 1 | 0 | 55 | [ca.md](ca.md) |
| DC | done | 2026-10-27 | 74 | 1 | 71 | 2 | 0 | 56 | [dc.md](dc.md) |
| HI | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| KY | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| LA | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| ME | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| MS | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| ND | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| NM | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| OK | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| PA | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| TX | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| UT | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| WI | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| WV | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| AR | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| CO | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| CT | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| IA | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| IL | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| MA | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| MD | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| NH | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| SD | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| AZ | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| DE | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| FL | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| GA | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| ID | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| IN | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| KS | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| MI | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| MN | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| MO | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| MT | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| NC | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| NE | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| NJ | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| NV | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| NY | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| OH | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| OR | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| RI | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| SC | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| TN | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| VA | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| VT | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| WA | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |
| WY | todo |  | 0 | 0 | 0 | 0 | 0 | 0 |  |

## Conflicts (flagged claims)

- AK `bidMethod`: AS 29.45.460 sets no bid method; method comes from municipal ordinances not yet audited
- AK `signup.deposit.1`: Deposits are not set in AS 29.45; local rules not audited
- AK `otc.available`: No state OTC rule in AS 29.45; municipalities may sell unsold property by ordinance
- AK `otc.note.1`: Same as otc.available
- AL `rate`: Ala. Admin. Code r. 810-4-6-.02 says 8% for tax sales after Jan 1, 2020; the DOR Land Sales FAQ still says 12% per annum; the Code text could not be read (script-only site)
- CA `otc.available`: No official text fetched on OTC; SCO manual says unsold property may be re-offered at a reduced minimum bid
- DC `rate`: Fetched D.C. Code §§ 47-1330 to 47-1382.01 say redemption includes "interest thereon" but the 18% figure was not found in the sections read; confirm the rate section

## Unreachable sources ("Couldn't reach source")

- AK `signup.steps.1`: https://www.commerce.alaska.gov/web/dcra/, https://www.commerce.alaska.gov/web/dcra/OfficeoftheStateAssessor.aspx
