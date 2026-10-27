# Polar setup (created 2026-10-27 by the Foundry run)

Organization ID: `bdbc4d3b-3520-432e-b8b2-b3bcc545b96c` (shared with Lando's other Polar products)

| Product | Price | Product ID | License benefit ID | Checkout link |
|---|---|---|---|---|
| Aurigen Directory Spreadsheet Pack | $19 one-time (key valid 12 months) | `b05b9ecb-559b-4a43-aae8-4877e6d1eb30` | `29728b31-0471-4c46-a208-16a31c987693` (prefix AURPACK) | https://buy.polar.sh/polar_cl_LhHnrgRKq0pezBy91bZg22lcK4pHCR0QFsjDM3V4RPl |
| Aurigen Sale Calendar (monthly) | $3 / month | `2edd05f7-dfd4-4f30-975e-c2cfd75e22ca` | `059c8dd0-5186-4f76-b9dc-dd889a70567b` (prefix AURCAL) | https://buy.polar.sh/polar_cl_Aky58EZhCcUTm7s1fgIsohd5gy74hsxWdYamW0N8jkz |
| Aurigen Sale Calendar (yearly) | $29 / year | `7ddc037a-2200-4ced-bdd5-54fdb33dcc67` | `059c8dd0-5186-4f76-b9dc-dd889a70567b` (same benefit) | https://buy.polar.sh/polar_cl_ZZxtCf7qgOkPYOOcmVVgbwFlnx1vBX1TEFZR84KtJBX |

Checkout link IDs: pack `f3862d62-b4d0-49fd-b1e9-f7d10e74849c`, calendar monthly `091c89a1-3f9a-4ffb-92cc-ad932c646912`, calendar yearly `64cf123f-11a2-45ef-b7ee-34d98f84f0eb`.
Success URL: `/extras/?preview=1&thanks=1` on the workers.dev site (change in Polar if a custom domain is attached).

Prices come from `income-research.md`: competitors only sell exports inside $39–$97/month plans, so $19 one-time is easy to justify. The calendar has to be cheap because counties publish dates for free. Polar's fee is 5% + $0.50 per sale, so the yearly plan is better for both sides.

## How the live site checks keys
The Worker calls Polar's public `POST /v1/customer-portal/license-keys/validate` with `key` + `organization_id` only (no token).
It then checks that `benefit_id` matches the product's benefit, so keys from Lando's other Polar products don't unlock Aurigen extras.
Results are cached for 10 minutes in D1 (`license_cache`, SHA-256 of the key, never the key itself).

## Before turning on
1. Finish Polar payout setup (Stripe Connect payout account) in the Polar dashboard. Polar won't pay out until this is done.
2. Read the wording on `/extras/?preview=1` and the product descriptions in Polar.
3. Set `PAID_EXTRAS` to `on` in `cloudflare/wrangler.jsonc` and deploy (`cd cloudflare && npm ci && npx wrangler deploy`),
   or change the variable in the Cloudflare dashboard: Workers & Pages → aurigen → Settings → Variables.
