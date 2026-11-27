// Hearth & Ledger — the five pages.
// Each view is a function of the current month that returns HTML.
// main.js drops it into #app and wires the controls afterwards.

import { fmt, fmtDate, transactionsFor, incomeFor, spendingFor, spendingByCategory, budgets, goals, monthlySeries, monthLabel } from "./store.js";
import { INCOME_SOURCES, CATEGORIES } from "./data.js";
import { donut, monthBars } from "./charts.js";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function tiles(monthKey) {
  const income = incomeFor(monthKey);
  const spending = spendingFor(monthKey);
  const left = income - spending;
  const top = Object.entries(spendingByCategory(monthKey)).sort((a, b) => b[1] - a[1])[0];
  return `<section class="tiles" aria-label="Month at a glance">
    <div class="tile good"><p class="label">Income</p><p class="value">${fmt(income)}</p><p class="sub">${monthKey === "2026-11" ? "6 sources, Nov 1–30" : "monthly pay"}</p></div>
    <div class="tile"><p class="label">Spending</p><p class="value">${fmt(spending)}</p><p class="sub">${transactionsFor(monthKey).filter((t) => t.amount < 0).length} purchases</p></div>
    <div class="tile ${left < 0 ? "warn" : "good"}"><p class="label">Left to save</p><p class="value">${fmt(left)}</p><p class="sub">${Math.round((left / income) * 100)}% of income kept</p></div>
    <div class="tile"><p class="label">Biggest cost</p><p class="value">${top ? esc(top[0]) : "—"}</p><p class="sub">${top ? fmt(top[1]) + " this month" : ""}</p></div>
  </section>`;
}

function txRow(t) {
  return `<div class="rowline">
    <div class="who"><b>${esc(t.name)}</b><span>${fmtDate(t.date)}</span><br><span class="tag">${esc(t.category)}</span></div>
    <span class="amount ${t.amount < 0 ? "out" : "in"}">${fmt(t.amount)}</span>
    <button type="button" class="edit-btn" data-delete="${t.id}">Remove</button>
  </div>`;
}

export function dashboardView(monthKey) {
  const byCat = spendingByCategory(monthKey);
  const parts = Object.entries(byCat)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
  const chart = donut(parts, spendingFor(monthKey), fmt(spendingFor(monthKey)));
  const recent = transactionsFor(monthKey).slice(0, 6);
  const budgetRows = budgets()
    .map((b) => {
      const spent = byCat[b.category] ?? 0;
      const pct = Math.round((spent / b.budget) * 100);
      return { ...b, spent, pct };
    })
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3);
  const fund = goals().find((g) => g.id === "g1");

  return `<div class="page-head"><h1>${esc(monthLabel(monthKey))}, at a glance</h1>
    <p>Mara and Diego bring home ${fmt(incomeFor(monthKey))} this month. Here is where it goes — and what is left for the future.</p></div>
  ${tiles(monthKey)}
  <div class="grid two">
    <section class="card"><h2>Where the money went</h2>
      <p class="hint">Spending by category, ${monthLabel(monthKey)}.</p>
      <div class="donut-wrap"><div>${chart.svg}</div><div>${chart.legend}</div></div>
    </section>
    <section class="card"><h2>Budgets to watch</h2>
      <p class="hint">The three categories closest to their limit.</p>
      ${budgetRows.map((b) => `<div class="budget-line">
        <div class="top"><b>${esc(b.category)}</b><span class="amount ${b.pct > 100 ? "neg" : ""}">${fmt(b.spent)} of ${fmt(b.budget)}</span></div>
        <div class="bar"><span class="${b.pct > 100 ? "over" : ""}" style="width:${Math.min(100, b.pct)}%"></span></div>
        <div class="meta"><span class="${b.pct > 100 ? "left" : ""}">${b.pct > 100 ? `${fmt(b.spent - b.budget)} over` : `${fmt(b.budget - b.spent)} left`}</span><span>${b.pct}% used</span></div>
      </div>`).join("")}
      <p style="margin:12px 0 0"><a href="#/budgets">See all eight budgets →</a></p>
    </section>
  </div>
  <div class="grid two" style="margin-top:16px">
    <section class="card"><h2>Latest spending</h2>
      <p class="hint">The six most recent entries in the ledger.</p>
      ${recent.map(txRow).join("")}
      <p style="margin:12px 0 0"><a href="#/transactions">All ${transactionsFor(monthKey).length} transactions →</a></p>
    </section>
    <section class="card"><h2>Money in</h2>
      ${monthKey === "2026-11" ? `<p class="hint">Every paycheque and extra this month.</p>
      ${INCOME_SOURCES.map((s) => `<div class="rowline"><div class="who"><b>${esc(s.source)}</b><span>${esc(s.when)}</span></div><span class="amount in">+${fmt(s.amount)}</span></div>`).join("")}` : `<p class="hint">The family's pay for ${esc(monthLabel(monthKey))} is ${fmt(incomeFor(monthKey))} — Mara's school salary and Diego's clinic pay, as in November. The full paycheque list is kept for November, the current month.</p>`}
      ${fund ? `<div class="notice" style="margin-top:14px">Emergency fund: <b>${fmt(fund.saved)} of ${fmt(fund.target)}</b> — ${Math.round((fund.saved / fund.target) * 100)}% there. <a href="#/goals">Add to it →</a></div>` : ""}
    </section>
  </div>`;
}

export function transactionsView(monthKey) {
  const options = CATEGORIES.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join("");
  return `<div class="page-head"><h1>Transactions</h1>
    <p>Every dollar in and out for ${monthLabel(monthKey)}. Add a purchase as it happens, search the list, or take a mistake out.</p></div>
  <section class="card" style="margin-bottom:16px"><h2>Add a transaction</h2>
    <form class="add" id="add-tx">
      <label class="field">What was it?<input name="name" type="text" required maxlength="80" placeholder="e.g. Green Zebra Market"></label>
      <label class="field">Amount (dollars)<input name="amount" type="number" required step="0.01" min="0.01" placeholder="e.g. 42.50"></label>
      <label class="field">Category<select name="category">${options}</select></label>
      <label class="field">Date<input name="date" type="date" required value="2026-11-27"></label>
      <label class="field">Money in or out?
        <select name="direction"><option value="out">Spent — money out</option><option value="in">Received — money in</option></select></label>
      <p class="wide"><button class="btn" type="submit">Add to the ledger</button></p>
    </form>
  </section>
  <section class="card"><h2>Ledger</h2>
    <div class="toolbar">
      <label class="field search">Search<input id="tx-search" type="search" placeholder="Search a shop or a note…"></label>
      <label class="field">Category<select id="tx-category"><option value="">All categories</option>${options}</select></label>
    </div>
    <p class="hint" id="tx-count"></p>
    <div id="tx-list"></div>
  </section>`;
}

export function budgetsView(monthKey) {
  const byCat = spendingByCategory(monthKey);
  const rows = budgets().map((b) => {
    const spent = byCat[b.category] ?? 0;
    const pct = Math.round((spent / b.budget) * 100);
    const left = b.budget - spent;
    return `<div class="budget-line" data-category="${esc(b.category)}">
      <div class="top"><b>${esc(b.category)}</b><span class="amount ${pct > 100 ? "neg" : ""}">${fmt(spent)} of <span class="budget-amount">${fmt(b.budget)}</span></span></div>
      <div class="bar"><span class="${pct > 100 ? "over" : ""}" style="width:${Math.min(100, pct)}%"></span></div>
      <div class="meta"><span class="${pct > 100 ? "left" : ""}">${pct > 100 ? `${fmt(-left)} over budget` : `${fmt(left)} left`}</span><span>${pct}% used · ${esc(b.note)}</span></div>
      <p style="margin:8px 0 0"><button type="button" class="edit-btn" data-edit-budget="${esc(b.category)}">Change this budget</button>
      <span class="budget-editor" hidden><input type="number" min="0" step="10" value="${b.budget}" aria-label="New monthly budget for ${esc(b.category)}"> <button type="button" class="btn small" data-save-budget="${esc(b.category)}">Save</button></span></p>
    </div>`;
  }).join("");
  const totalBudget = budgets().reduce((s, b) => s + b.budget, 0);
  const totalSpent = spendingFor(monthKey);
  const over = budgets().filter((b) => (byCat[b.category] ?? 0) > b.budget);
  return `<div class="page-head"><h1>Budgets</h1>
    <p>The family sets these together on the first Sunday of each month. ${esc(monthLabel(monthKey))}'s plan is <b>${fmt(totalBudget)}</b>; so far <b>${fmt(totalSpent)}</b> is spent.</p></div>
  ${over.length && monthKey === "2026-11" ? `<p class="notice warn">${over.map((b) => esc(b.category)).join(", ")} ${over.length === 1 ? "is" : "are"} over budget this month — Thanksgiving week did most of it. The family agreed to cook at home for the last weekend of the month.</p>` : ""}
  <section class="card"><h2>${esc(monthLabel(monthKey))} budgets</h2><p class="hint">Tap “Change this budget” to set a new monthly amount.</p>${rows}</section>`;
}

export function goalsView() {
  const rows = goals().map((g) => {
    const pct = Math.round((g.saved / g.target) * 100);
    return `<div class="goal" data-goal="${g.id}">
      <div class="top"><b>${esc(g.name)}</b><span class="amount">${fmt(g.saved)} of ${fmt(g.target)}</span></div>
      <div class="bar"><span class="gold" style="width:${Math.min(100, pct)}%"></span></div>
      <div class="meta" style="display:flex;justify-content:space-between;font-size:13px;color:var(--ink-soft)"><span>${pct}% saved · ${fmt(g.target - g.saved)} to go</span><span class="due">Target: ${esc(g.due)}</span></div>
      <p class="hint" style="margin:6px 0 0">${esc(g.note)}</p>
      <div class="actions"><input type="number" min="1" step="5" placeholder="Add $…" aria-label="Amount to add to ${esc(g.name)}"><button type="button" class="btn small" data-add-goal="${g.id}">Add to this goal</button></div>
    </div>`;
  }).join("");
  return `<div class="page-head"><h1>Savings goals</h1>
    <p>What the family is saving for, and how close each goal is. Money moved here comes out of “left to save” on the dashboard.</p></div>
  <section class="card"><h2>Three goals, one family</h2>${rows}</section>
  <section class="card" style="margin-top:16px"><h2>Start a new goal</h2>
    <form class="add" id="add-goal">
      <label class="field">What are you saving for?<input name="name" type="text" required maxlength="60" placeholder="e.g. New bikes for the kids"></label>
      <label class="field">Target amount ($)<input name="target" type="number" required min="1" step="1" placeholder="e.g. 800"></label>
      <label class="field">Save it by<input name="due" type="text" required maxlength="30" placeholder="e.g. September 2027"></label>
      <p class="wide"><button class="btn" type="submit">Add this goal</button></p>
    </form>
  </section>`;
}

export function reportsView(monthKey) {
  const series = monthlySeries();
  const byCat = spendingByCategory(monthKey);
  const parts = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const top = transactionsFor(monthKey).filter((t) => t.amount < 0).sort((a, b) => a.amount - b.amount).slice(0, 5);
  const income = incomeFor(monthKey);
  const spending = spendingFor(monthKey);
  const best = series.reduce((a, b) => (a.income - a.spending > b.income - b.spending ? a : b));
  return `<div class="page-head"><h1>Reports</h1>
    <p>Six months of the family's money, June to November 2026. The best month for saving was <b>${best.label} 2026</b> — ${fmt(best.income - best.spending)} kept.</p></div>
  <section class="card" style="margin-bottom:16px"><h2>Income against spending</h2>
    <p class="hint">Green is money in, terracotta is money out. November's spending is lower than the summer's — the family spent less after the back-to-school month.</p>
    ${monthBars(series)}
  </section>
  <div class="grid two equal">
    <section class="card"><h2>${esc(monthLabel(monthKey))} by category</h2>
      <p class="hint">Every dollar of the ${fmt(spending)} spent this month.</p>
      ${parts.map(([cat, val]) => `<div class="rowline"><div class="who"><b>${esc(cat)}</b><span>${Math.round((val / spending) * 100)}% of spending</span></div><span class="amount">${fmt(val)}</span></div>`).join("")}
      <div class="rowline"><div class="who"><b>Total spent</b></div><span class="amount">${fmt(spending)}</span></div>
      <div class="rowline"><div class="who"><b>Income</b></div><span class="amount in">${fmt(income)}</span></div>
      <div class="rowline"><div class="who"><b>Kept this month</b></div><span class="amount in">${fmt(income - spending)}</span></div>
    </section>
    <section class="card"><h2>Biggest single costs</h2>
      <p class="hint">The five largest purchases of ${monthLabel(monthKey)}.</p>
      ${top.map((t) => `<div class="rowline"><div class="who"><b>${esc(t.name)}</b><span>${fmtDate(t.date)} · ${esc(t.category)}</span></div><span class="amount out">${fmt(t.amount)}</span></div>`).join("")}
      ${monthKey === "2026-11" ? `<p class="hint" style="margin-top:14px">Housing is the family's largest fixed cost at ${fmt(1650 + 200)} a month — mortgage plus insurance. Groceries ran over budget in November: the Thanksgiving shop added ${fmt(96.45)} in one week.</p>` : `<p class="hint" style="margin-top:14px">Housing is the family's largest fixed cost at ${fmt(1650 + 200)} a month — mortgage plus insurance — in every month of the year.</p>`}
    </section>
  </div>`;
}
