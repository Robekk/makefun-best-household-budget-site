# Tally House — a household budget site

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Robekk/makefun-best-household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Robekk/makefun-best-household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Entry for the make.fun bounty [Make the best household budget site](https://make.fun/bounty/best-household-budget-site-20261126-1457).

**Tally House** is the Hale family's budget book: a complete household
budget site that runs entirely from its own static files — no build step,
no network, no account — on a desktop or a phone. Every figure on every
page is summed live from one ledger, so the pages can never disagree.

## What is inside

- **Overview** — money in / out / kept for the month, a 50/30/20 rule
  check measured on the real ledger, the six biggest budget pots against
  their limits, spending by week, bills still to pay with a projected
  month-end balance, the latest ledger entries and the savings goals.
- **Budget** — twelve spending pots with editable limits; type a new
  figure and the whole book rebalances.
- **Transactions** — the full ledger for the month, searchable and
  filterable by pot and account, with an add-a-receipt form that updates
  every total on the site.
- **Bills** — the month's fixed costs in due-date order, with mark-paid
  toggles that feed the overview's "still to pay" list.
- **Goals** — four savings goals with progress, this month's transfers,
  a projected finish date for each, and a pace simulator: slide the
  monthly amount and the finish line moves.
- **Reports** — a spending donut, a three-month in/out/kept comparison,
  top payees and computed notes about the month.
- A **month switcher** (September–November 2026) in the header: every
  page re-draws for the month chosen. Edits persist in the browser's
  local storage when available.

## Running it

Serve `app/` with any static file server and open `index.html`, or just
open the folder with the kit's development server. To hand it in the way
the grader does:

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and
`screenshots/` into the output directory and writes `dossier.json` with
the vendored make.fun library.
