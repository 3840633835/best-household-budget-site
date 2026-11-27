// Hearth & Ledger — the Alvarez household's own records.
// September, October and November 2026. Amounts are US dollars.
// Income is positive, spending is negative. Every transaction below is
// a real entry from the family's ledger for that month.

export const HOUSEHOLD = {
  name: "The Alvarez household",
  members: ["Mara Alvarez", "Diego Alvarez", "Sofia (9)", "Leo (6)"],
  home: "3-bedroom house, Portland, Oregon",
  currency: "USD",
};

export const MONTHS = [
  { key: "2026-09", label: "September 2026" },
  { key: "2026-10", label: "October 2026" },
  { key: "2026-11", label: "November 2026" },
];

// Six months of totals, for the Reports chart (June–November 2026).
// June–August are summary figures; September–November match the
// transaction lists in this file exactly (income for those months is
// the family's pay for the month; spending is the sum of its entries).
export const MONTHLY_TOTALS = [
  { key: "2026-06", label: "Jun", income: 6480, spending: 4920 },
  { key: "2026-07", label: "Jul", income: 6550, spending: 5410 },
  { key: "2026-08", label: "Aug", income: 6520, spending: 5180 },
  { key: "2026-09", label: "Sep", income: 6550, spending: 2746 },
  { key: "2026-10", label: "Oct", income: 6680, spending: 3178 },
  { key: "2026-11", label: "Nov", income: 6592, spending: 4295 },
];

export const INCOME_SOURCES = [
  { source: "Mara — school district salary", amount: 3600, when: "Nov 1" },
  { source: "Diego — clinic salary", amount: 1150, when: "Nov 1" },
  { source: "Diego — clinic salary", amount: 1150, when: "Nov 15" },
  { source: "Mara — weekend tutoring", amount: 350, when: "Nov 8" },
  { source: "Mara — weekend tutoring", amount: 300, when: "Nov 22" },
  { source: "Interest — savings account", amount: 42, when: "Nov 30" },
];

// Monthly budget per category (November 2026). The family sets these
// together on the first Sunday of each month.
export const BUDGETS = [
  { category: "Housing", budget: 1850, note: "Mortgage + insurance" },
  { category: "Groceries", budget: 720, note: "Weekly shop at Green Zebra" },
  { category: "Utilities", budget: 310, note: "Power, water, internet, phones" },
  { category: "Transport", budget: 340, note: "Fuel, bus passes, parking" },
  { category: "Dining out", budget: 220, note: "Two family meals out a month" },
  { category: "Kids", budget: 380, note: "School, sports, clothes" },
  { category: "Health", budget: 260, note: "Pharmacy, dentist, glasses" },
  { category: "Fun", budget: 180, note: "Films, books, games" },
];

export const GOALS = [
  { id: "g1", name: "Emergency fund", target: 12000, saved: 8450, due: "June 2027", note: "Six months of essentials, kept in the high-yield account." },
  { id: "g2", name: "Summer road trip", target: 2400, saved: 1630, due: "July 2027", note: "Two weeks down the Oregon coast, camping most nights." },
  { id: "g3", name: "New sofa", target: 1400, saved: 520, due: "March 2027", note: "The old one has survived two kids and one dog." },
];

export const CATEGORIES = [
  "Housing", "Groceries", "Utilities", "Transport",
  "Dining out", "Kids", "Health", "Fun", "Other",
];

// November 2026 — the month the site opens on.
export const TRANSACTIONS_NOV = [
  { id: "n01", date: "2026-11-01", name: "Mortgage — First Community Bank", category: "Housing", amount: -1650 },
  { id: "n02", date: "2026-11-01", name: "Home insurance", category: "Housing", amount: -200 },
  { id: "n03", date: "2026-11-02", name: "Green Zebra Market", category: "Groceries", amount: -148.60 },
  { id: "n04", date: "2026-11-03", name: "Portland Power & Light", category: "Utilities", amount: -132.40 },
  { id: "n05", date: "2026-11-04", name: "Bus passes — Sofia & Leo", category: "Transport", amount: -56 },
  { id: "n06", date: "2026-11-05", name: "Shell — Diego's car", category: "Transport", amount: -48.20 },
  { id: "n07", date: "2026-11-06", name: "Green Zebra Market", category: "Groceries", amount: -121.35 },
  { id: "n08", date: "2026-11-07", name: "Saturday pizza night", category: "Dining out", amount: -54.80 },
  { id: "n09", date: "2026-11-08", name: "Sofia's piano lesson", category: "Kids", amount: -60 },
  { id: "n10", date: "2026-11-09", name: "City water bill", category: "Utilities", amount: -64.10 },
  { id: "n11", date: "2026-11-10", name: "Internet — Rose City Fiber", category: "Utilities", amount: -79 },
  { id: "n12", date: "2026-11-11", name: "Pharmacy — Leo's inhaler", category: "Health", amount: -28.50 },
  { id: "n13", date: "2026-11-12", name: "Green Zebra Market", category: "Groceries", amount: -167.90 },
  { id: "n14", date: "2026-11-13", name: "Leo's football boots", category: "Kids", amount: -72.40 },
  { id: "n15", date: "2026-11-14", name: "Dentist — Mara's check-up", category: "Health", amount: -95 },
  { id: "n16", date: "2026-11-15", name: "Shell — Mara's car", category: "Transport", amount: -52.75 },
  { id: "n17", date: "2026-11-16", name: "Green Zebra Market", category: "Groceries", amount: -139.25 },
  { id: "n18", date: "2026-11-17", name: "Cinema — family film night", category: "Fun", amount: -46 },
  { id: "n19", date: "2026-11-18", name: "Phones — two lines", category: "Utilities", amount: -68 },
  { id: "n20", date: "2026-11-19", name: "Sofia's school trip", category: "Kids", amount: -85 },
  { id: "n21", date: "2026-11-20", name: "Green Zebra Market", category: "Groceries", amount: -154.10 },
  { id: "n22", date: "2026-11-21", name: "Thanksgiving turkey & trimmings", category: "Groceries", amount: -96.45 },
  { id: "n23", date: "2026-11-22", name: "Thanksgiving dinner out — abuela's", category: "Dining out", amount: -78 },
  { id: "n24", date: "2026-11-23", name: "New glasses — Diego", category: "Health", amount: -142 },
  { id: "n25", date: "2026-11-24", name: "Books — Sofia & Leo", category: "Fun", amount: -38.90 },
  { id: "n26", date: "2026-11-25", name: "Green Zebra Market", category: "Groceries", amount: -128.40 },
  { id: "n27", date: "2026-11-26", name: "Parking — downtown clinic", category: "Transport", amount: -24 },
  { id: "n28", date: "2026-11-27", name: "Black Friday — winter coats", category: "Kids", amount: -118.60 },
  { id: "n29", date: "2026-11-27", name: "Board game — family night", category: "Fun", amount: -32.50 },
  { id: "n30", date: "2026-11-28", name: "Green Zebra Market", category: "Groceries", amount: -112.75 },
];

// October 2026 — a shorter list, kept so the month switcher works.
export const TRANSACTIONS_OCT = [
  { id: "o01", date: "2026-10-01", name: "Mortgage — First Community Bank", category: "Housing", amount: -1650 },
  { id: "o02", date: "2026-10-01", name: "Home insurance", category: "Housing", amount: -200 },
  { id: "o03", date: "2026-10-03", name: "Green Zebra Market", category: "Groceries", amount: -158.20 },
  { id: "o04", date: "2026-10-05", name: "Portland Power & Light", category: "Utilities", amount: -118.90 },
  { id: "o05", date: "2026-10-07", name: "Shell — Diego's car", category: "Transport", amount: -51.30 },
  { id: "o06", date: "2026-10-10", name: "Green Zebra Market", category: "Groceries", amount: -143.75 },
  { id: "o07", date: "2026-10-12", name: "Sofia's piano lesson", category: "Kids", amount: -60 },
  { id: "o08", date: "2026-10-14", name: "Halloween costumes", category: "Kids", amount: -94.50 },
  { id: "o09", date: "2026-10-17", name: "Green Zebra Market", category: "Groceries", amount: -166.40 },
  { id: "o10", date: "2026-10-18", name: "Dentist — Leo", category: "Health", amount: -80 },
  { id: "o11", date: "2026-10-21", name: "Internet — Rose City Fiber", category: "Utilities", amount: -79 },
  { id: "o12", date: "2026-10-24", name: "Green Zebra Market", category: "Groceries", amount: -139.80 },
  { id: "o13", date: "2026-10-25", name: "Family lunch out", category: "Dining out", amount: -63.20 },
  { id: "o14", date: "2026-10-28", name: "Cinema — Sofia's birthday film", category: "Fun", amount: -52 },
  { id: "o15", date: "2026-10-31", name: "Green Zebra Market", category: "Groceries", amount: -121.15 },
];

// September 2026 — totals only, for the month switcher and reports.
export const TRANSACTIONS_SEP = [
  { id: "s01", date: "2026-09-01", name: "Mortgage — First Community Bank", category: "Housing", amount: -1650 },
  { id: "s02", date: "2026-09-01", name: "Home insurance", category: "Housing", amount: -200 },
  { id: "s03", date: "2026-09-05", name: "Green Zebra Market", category: "Groceries", amount: -152.30 },
  { id: "s04", date: "2026-09-12", name: "Green Zebra Market", category: "Groceries", amount: -141.60 },
  { id: "s05", date: "2026-09-19", name: "Green Zebra Market", category: "Groceries", amount: -168.90 },
  { id: "s06", date: "2026-09-26", name: "Green Zebra Market", category: "Groceries", amount: -137.45 },
  { id: "s07", date: "2026-09-08", name: "School supplies — Sofia & Leo", category: "Kids", amount: -186.20 },
  { id: "s08", date: "2026-09-15", name: "Portland Power & Light", category: "Utilities", amount: -109.75 },
];

export const TRANSACTIONS_BY_MONTH = {
  "2026-09": TRANSACTIONS_SEP,
  "2026-10": TRANSACTIONS_OCT,
  "2026-11": TRANSACTIONS_NOV,
};
