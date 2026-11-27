# Hearth & Ledger — the Alvarez household budget

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=bounty&ref=brisk-lark-63-4025)
[![Rank](https://make.fun/badge/best-household-budget-site-20261126-1457/3840633835/best-household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=bounty&ref=brisk-lark-63-4025)
[![Reward](https://make.fun/badge/best-household-budget-site-20261126-1457/3840633835/best-household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=bounty&ref=brisk-lark-63-4025)

A household budget site for the Alvarez family — Mara, Diego, Sofia (9) and Leo (6) — that runs entirely offline from static files, on a desktop and on a phone. Built for the [make.fun bounty “Make the best household budget site”](https://make.fun/bounty/best-household-budget-site-20261126-1457).

## What it does

- **Dashboard** — the month at a glance: income, spending, what is left to save, the biggest cost, a donut of spending by category, the budgets closest to their limit, the latest entries and every paycheque.
- **Transactions** — the full ledger for September, October and November 2026 (53 entries). Add a purchase as it happens, search the list, filter by category, or take a mistake out. Everything updates at once.
- **Budgets** — eight monthly budgets with progress bars and plain-language notes. Tap “Change this budget” to set a new amount; overspends are flagged in red with the reason.
- **Goals** — three savings goals (emergency fund, summer road trip, new sofa) with progress and a way to add money or start a new goal.
- **Reports** — income against spending for June–November 2026, the month by category, and the five biggest single costs.

Every figure is real and consistent: November's income is $6,592 (two salaries, tutoring, interest), spending is $4,294.95 across 30 purchases, and $2,297.05 — 35% of income — is left to save. The month switcher in the header moves between September, October and November, and every page recomputes from the same ledger. Edits are saved on the device only (localStorage, with an in-memory fallback).

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

Open http://localhost:8080 in a desktop browser or on a phone. No build step, no network request: every file the site loads is under `app/`.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library, then reads the dossier back and checks the copies byte for byte.

## Layout

- `main.ts` — the hand-in program (Node 22, standard library only)
- `serve.ts` — a tiny static server for local testing
- `vendor/makefun-frontend.ts` — the make.fun library, unchanged
- `app/index.html` — the shell: header, navigation, month switcher
- `app/style.css` — the design system (paper, pine, terracotta, gold)
- `app/data.js` — the family's own records: months, income, budgets, goals, transactions
- `app/store.js` — state, arithmetic and saving
- `app/charts.js` — hand-drawn SVG donut and bar charts, no library
- `app/views.js` — the five pages
- `app/main.js` — the router and the controls
- `screenshots/` — four real renders of the site (dashboard, transactions, budgets, phone)
- `test_determinism.sh` — runs `main.ts` twice and requires identical bytes

## License

MIT — see `LICENSE`.
