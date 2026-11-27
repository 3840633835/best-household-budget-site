// Hearth & Ledger — router and controls.
// Hash routes: #/ dashboard, #/transactions, #/budgets, #/goals, #/reports.
// The month switcher in the header moves September ↔ October ↔ November;
// every page re-renders from the store, so an edit shows everywhere.

import { MONTHS } from "./data.js";
import {
  transactionsFor, addTransaction, removeTransaction,
  setBudget, addToGoal, addGoal, monthLabel, fmt, fmtDate,
} from "./store.js";
import {
  dashboardView, transactionsView, budgetsView, goalsView, reportsView,
} from "./views.js";

const app = document.getElementById("app");
const monthLabelEl = document.getElementById("month-label");
const prevBtn = document.getElementById("prev-month");
const nextBtn = document.getElementById("next-month");

let monthIndex = 2; // November 2026, the current month
let route = "";

const ROUTES = {
  "": dashboardView,
  transactions: transactionsView,
  budgets: budgetsView,
  goals: goalsView,
  reports: reportsView,
};

function monthKey() {
  return MONTHS[monthIndex].key;
}

function render() {
  const view = ROUTES[route] ?? dashboardView;
  app.innerHTML = view(monthKey());
  document.querySelectorAll(".nav-link").forEach((a) => {
    a.classList.toggle("active", a.dataset.route === route);
  });
  monthLabelEl.textContent = monthLabel(monthKey());
  prevBtn.disabled = monthIndex === 0;
  nextBtn.disabled = monthIndex === MONTHS.length - 1;
  wirePage();
}

function parseRoute() {
  const hash = location.hash.replace(/^#\/?/, "");
  route = hash.split("/")[0] in ROUTES ? hash.split("/")[0] : "";
}

// --- Transactions page: list, search, filter, add, remove ---
function renderTxList() {
  const list = document.getElementById("tx-list");
  const count = document.getElementById("tx-count");
  if (!list) return;
  const q = (document.getElementById("tx-search")?.value ?? "").trim().toLowerCase();
  const cat = document.getElementById("tx-category")?.value ?? "";
  const rows = transactionsFor(monthKey()).filter((t) =>
    (!cat || t.category === cat) &&
    (!q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)));
  count.textContent = rows.length === 0
    ? "Nothing matches — try another word or category."
    : `${rows.length} entr${rows.length === 1 ? "y" : "ies"} · ${rows.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0).toLocaleString("en-US", { style: "currency", currency: "USD" })} spent in this list`;
  list.innerHTML = rows.length ? rows.map((t) => `
    <div class="rowline">
      <div class="who"><b>${escapeHtml(t.name)}</b><span>${fmtDate(t.date)}</span><br><span class="tag">${escapeHtml(t.category)}</span></div>
      <span class="amount ${t.amount < 0 ? "out" : "in"}">${fmt(t.amount)}</span>
      <button type="button" class="edit-btn" data-delete="${t.id}">Remove</button>
    </div>`).join("") : `<p class="empty">No transactions match.</p>`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wirePage() {
  // Add-transaction form
  const addForm = document.getElementById("add-tx");
  if (addForm) {
    renderTxList();
    document.getElementById("tx-search")?.addEventListener("input", renderTxList);
    document.getElementById("tx-category")?.addEventListener("change", renderTxList);
    addForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(addForm);
      const amount = Math.abs(Number(data.get("amount")));
      if (!amount || amount <= 0) return;
      addTransaction(monthKey(), {
        date: String(data.get("date")),
        name: String(data.get("name")).trim(),
        category: String(data.get("category")),
        amount: data.get("direction") === "in" ? amount : -amount,
      });
      addForm.reset();
      addForm.querySelector('[name="date"]').value = "2026-11-27";
      render();
    });
  }

  // Goals: start a new goal
  const goalForm = document.getElementById("add-goal");
  if (goalForm) {
    goalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(goalForm);
      addGoal(String(data.get("name")).trim(), Number(data.get("target")), String(data.get("due")).trim());
      render();
    });
  }
}

// One delegated click handler on #app, attached once: it survives the
// transaction list re-rendering itself on every search keystroke (which
// rebuilds its buttons and would drop listeners attached to them).
app.addEventListener("click", (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  const del = target.closest("[data-delete]");
  if (del) {
    removeTransaction(del.dataset.delete);
    render();
    return;
  }
  const edit = target.closest("[data-edit-budget]");
  if (edit) {
    const line = edit.closest(".budget-line");
    line.querySelector(".budget-editor").hidden = false;
    edit.hidden = true;
    line.querySelector(".budget-editor input").focus();
    return;
  }
  const save = target.closest("[data-save-budget]");
  if (save) {
    const line = save.closest(".budget-line");
    const value = Number(line.querySelector(".budget-editor input").value);
    if (Number.isFinite(value) && value >= 0) setBudget(save.dataset.saveBudget, Math.round(value));
    render();
    return;
  }
  const add = target.closest("[data-add-goal]");
  if (add) {
    const box = add.closest(".goal");
    const value = Number(box.querySelector("input").value);
    if (Number.isFinite(value) && value > 0) addToGoal(add.dataset.addGoal, value);
    render();
  }
});

window.addEventListener("hashchange", () => { parseRoute(); render(); });
prevBtn.addEventListener("click", () => { if (monthIndex > 0) { monthIndex -= 1; render(); } });
nextBtn.addEventListener("click", () => { if (monthIndex < MONTHS.length - 1) { monthIndex += 1; render(); } });

parseRoute();
render();
