// Hearth & Ledger — state and arithmetic.
// The site's figures live here: everything the pages show is computed
// from the transaction lists, the budgets and the goals in data.js,
// plus the family's own edits, which are saved on this device only.

import {
  BUDGETS, GOALS, MONTHLY_TOTALS, MONTHS,
  TRANSACTIONS_BY_MONTH, INCOME_SOURCES,
} from "./data.js";

const STORAGE_KEY = "hearth-and-ledger-v1";

export const fmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: n % 1 ? 2 : 0,
  }).format(n);

export const fmtDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// --- saved edits (localStorage, with a silent in-memory fallback) ---
let memoryStore = null;
function readSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { added: {}, removed: [], budgets: {}, goals: {} };
  } catch {
    return memoryStore ?? { added: {}, removed: [], budgets: {}, goals: {} };
  }
}
function writeSaved(saved) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    memoryStore = saved;
  }
}

let saved = readSaved();

export function transactionsFor(monthKey) {
  const base = TRANSACTIONS_BY_MONTH[monthKey] ?? [];
  const removed = new Set(saved.removed);
  // Added entries are filtered by the removed set too: otherwise an
  // entry the family added could never be taken out again.
  const added = (saved.added[monthKey] ?? []).filter((t) => !removed.has(t.id));
  return [...base.filter((t) => !removed.has(t.id)), ...added]
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function incomeFor(monthKey) {
  if (monthKey === "2026-11") {
    return INCOME_SOURCES.reduce((sum, row) => sum + row.amount, 0);
  }
  return MONTHLY_TOTALS.find((m) => m.key === monthKey)?.income ?? 0;
}

export function spendingFor(monthKey) {
  return transactionsFor(monthKey)
    .reduce((sum, t) => sum + Math.min(0, t.amount), 0) * -1;
}

export function spendingByCategory(monthKey) {
  const out = {};
  for (const t of transactionsFor(monthKey)) {
    if (t.amount < 0) out[t.category] = (out[t.category] ?? 0) + -t.amount;
  }
  return out;
}

export function budgets() {
  return BUDGETS.map((b) => ({
    ...b,
    budget: saved.budgets[b.category] ?? b.budget,
  }));
}

export function goals() {
  const custom = saved.customGoals ?? [];
  return [...GOALS, ...custom].map((g) => ({
    ...g,
    saved: saved.goals[g.id] ?? g.saved,
  }));
}

export function addGoal(name, target, due) {
  const id = `g${Date.now().toString(36)}`;
  saved.customGoals = [...(saved.customGoals ?? []), { id, name, target, saved: 0, due, note: "Added by the family." }];
  writeSaved(saved);
  return id;
}

export function addTransaction(monthKey, tx) {
  const id = `u${Date.now().toString(36)}`;
  const entry = { id, ...tx };
  saved.added[monthKey] = [...(saved.added[monthKey] ?? []), entry];
  writeSaved(saved);
  return entry;
}

export function removeTransaction(id) {
  saved.removed = [...saved.removed, id];
  writeSaved(saved);
}

export function setBudget(category, amount) {
  saved.budgets[category] = amount;
  writeSaved(saved);
}

export function addToGoal(id, amount) {
  const goal = goals().find((g) => g.id === id);
  if (!goal) return;
  saved.goals[id] = Math.min(goal.target, goal.saved + amount);
  writeSaved(saved);
}

export function resetEdits() {
  saved = { added: {}, removed: [], budgets: {}, goals: {} };
  writeSaved(saved);
}

export function monthIndex(key) {
  return MONTHS.findIndex((m) => m.key === key);
}

export function monthLabel(key) {
  return MONTHS.find((m) => m.key === key)?.label ?? key;
}

// Six-month series for the Reports chart: June–August from the
// summary table, September–November computed from the ledger itself.
export function monthlySeries() {
  return MONTHLY_TOTALS.map((m) => ({
    ...m,
    spending: m.key >= "2026-09" ? Math.round(spendingFor(m.key)) : m.spending,
  }));
}
