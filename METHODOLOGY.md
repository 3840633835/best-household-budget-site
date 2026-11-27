# Hearth & Ledger — how it was built

## The idea

Most budget tools show a spreadsheet. A household keeps its budget the
way it keeps its house: with a routine, a story and a plan for the
future. Hearth & Ledger is built around that — a warm, paper-like site
for one fictional family, the Alvarez household of Portland, Oregon
(Mara, Diego, Sofia aged 9, Leo aged 6), with real, internally
consistent figures for September, October and November 2026.

## The figures

Every number on the site is computed from the same ledger in
`app/data.js`, and I verified the sums by hand in the build:

- November income: $6,592 — Mara's school salary $3,600, Diego's clinic
  pay $1,150 twice, tutoring $350 + $300, savings interest $42.
- November spending: $4,294.95 across 30 purchases; the six-month
  summary table agrees with the transaction lists to the dollar.
- Left to save: $2,297.05, i.e. 35% of income.
- Groceries ran $348.80 over their $720 budget — Thanksgiving week did
  most of it, and the site says so plainly on the Budgets page instead
  of hiding it. Utilities ($33.50 over) and Health ($5.50 over) are over
  too; the other five categories are inside their budgets.

## What works

Every control does what it says, verified in headless Chrome
(14 checks, all passing, no console errors):

- Add a transaction: it appears in the ledger, the count, the totals,
  the donut and the budget bars move with it.
- Search and category filter narrow the ledger live.
- Remove takes an entry out — including one the family just added
  (this was a real bug found in testing: the remove list only filtered
  the original entries, so an added entry could never be removed; fixed
  in `store.js`).
- Change a budget: the bar, the amount and the over/under line update.
- Add money to a goal, or start a new goal — both show at once.
- The month switcher moves September ↔ October ↔ November and every
  page recomputes; pages that only keep full records for November say
  so instead of showing the wrong month's figures.
- Two more bugs found in testing and fixed: the new-goal form's target
  field rejected $800 because `min="1" step="10"` only allows 1, 11,
  21…; and the transaction list rebuilt its buttons on every search
  keystroke, dropping their listeners — all button handling is now one
  delegated listener on `#app`.

## Design

- Palette: warm paper, deep pine, terracotta, harvest gold — a
  kitchen-table feel, not a fintech dashboard.
- Type: Georgia serif for headings and big numbers, system sans for
  body and figures, so the site needs no web font and its first load
  stays small (the whole app is about 40 KB of source).
- Charts are hand-drawn SVG (donut + paired bars), no library, so the
  first load is just the site's own files.
- Layout: one column on a phone (tested at 390 × 844), two columns on
  a desktop. Navigation is a row of links in the header and footer.

## Structure

One file, one job: `data.js` holds the records, `store.js` the state
and arithmetic, `charts.js` the SVG, `views.js` the five pages,
`main.js` the router and controls, `style.css` the design. No
framework, no build step, no network request — everything the site
loads is a file under `app/`, and a `data:` URI favicon means not even
that request 404s.

## Screenshots

Four real renders taken in headless Chromium (Playwright) from the
running site, listed in `shots.json`: the dashboard and the budgets
page at 1280 × 800, the transactions page scrolled to its ledger at
1280 × 800, and the dashboard on a phone at 390 × 844. Each is a JPEG
under 256 KiB.

## Determinism

`test_determinism.sh` runs `main.ts` twice into two fresh output
directories and requires every byte to match. `main.ts` also reads
`dossier.json` back after writing it and checks the copied files byte
for byte before reporting the hand-in ready.
