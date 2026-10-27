# Hawaii (HI) law audit: IN PROGRESS (run 1 stopped here)

Status: in_progress. No ledger yet (`cloudflare/data/law/hi.json` not written), so the gate fails for HI as intended.

## Where run 1 stopped

- Hawaii Revised Statutes on capitol.hawaii.gov returned HTTP 403 for HRS §§ 246-55 to 246-63 (https and http), and
  data.capitol.hawaii.gov returned 404 (all logged in `attempts/hi.jsonl`).
- Leads found (web search, not yet downloaded or verified): each county runs tax sales under its own ordinance.
  - Kauai: 2026 Tax Sale Instructions and FAQ (on qpublic.net, a vendor host; check whether kauai.gov links it as the
    county's copy) cite KCC Chapter 5A, § 5A-5.6: redemption within one year of the sale, 12% a year. Older county copy:
    https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf
  - Hawaii County: https://hawaiipropertytax.com/docs/Tax Sale Frequently Asked Questions.pdf (2018).
  - Maui County: 2025 tax sale legal notice (one year, 12%).
  - Honolulu: no official page found yet.

## Next run

1. Try another official HRS copy (session laws, or the legislature's alternative viewer); if none, cite county ordinances
   and county pages for county-only statements, and flag statewide statements (rate, redemption) that rest on HRS § 246-60.
2. Add the county domains (kauai.gov, mauicounty.gov, hawaiicounty.gov / hawaiipropertytax.com if county-run,
   honolulu.gov / realpropertyhonolulu.com) to `official-domains.json` with reasons.
3. Run the 2023–2026 enacted-law search on the legislature's site.
