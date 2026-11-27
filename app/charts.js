// Hearth & Ledger — small SVG charts, drawn by hand, no library.
// A donut for spending by category and a paired bar chart for the
// six-month trend. Both are pure strings of SVG the pages drop in.

const PALETTE = {
  Housing: "#1e4d3b",
  Groceries: "#c65d3b",
  Utilities: "#d9a441",
  Transport: "#7fa08b",
  "Dining out": "#a34d6e",
  Kids: "#4a7ba6",
  Health: "#8a6d3b",
  Fun: "#5b8c5a",
  Other: "#9a9a92",
};

export const colorFor = (category) => PALETTE[category] ?? PALETTE.Other;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Donut: `parts` is [{ label, value }]. Returns SVG + legend HTML.
export function donut(parts, total, centerLabel) {
  const r = 74, cx = 95, cy = 95, circ = 2 * Math.PI * r;
  let offset = 0;
  const rings = parts
    .filter((p) => p.value > 0)
    .map((p) => {
      const frac = p.value / total;
      const dash = `${(frac * circ).toFixed(1)} ${(circ - frac * circ).toFixed(1)}`;
      const el = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${colorFor(p.label)}" stroke-width="30" stroke-dasharray="${dash}" stroke-dashoffset="${(-offset * circ).toFixed(1)}" />`;
      offset += frac;
      return el;
    })
    .join("");
  const legend = parts
    .filter((p) => p.value > 0)
    .map((p) => {
      const pct = Math.round((p.value / total) * 100);
      return `<span><span class="swatch" style="background:${colorFor(p.label)}"></span>${esc(p.label)} ${pct}%</span>`;
    })
    .join("");
  return {
    svg: `<svg class="chart" viewBox="0 0 190 190" role="img" aria-label="Spending by category, ${esc(centerLabel)}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#ece5d3" stroke-width="30" />
      ${rings}
      <text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-center" font-size="21" fill="#22302a">${esc(centerLabel)}</text>
      <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="11" fill="#5c6b62">spent this month</text>
    </svg>`,
    legend: `<p class="legend">${legend}</p>`,
  };
}

// Paired bars: income (green) against spending (terracotta) per month.
export function monthBars(series) {
  const W = 640, H = 260, base = 220, top = 16;
  const max = Math.max(...series.map((m) => Math.max(m.income, m.spending)));
  const slot = W / series.length;
  const barW = 26;
  const bars = series.map((m, i) => {
    const x = i * slot + slot / 2;
    const ih = ((m.income / max) * (base - top)).toFixed(1);
    const sh = ((m.spending / max) * (base - top)).toFixed(1);
    return `<g>
      <rect x="${(x - barW - 3).toFixed(1)}" y="${(base - ih).toFixed(1)}" width="${barW}" height="${ih}" rx="3" fill="#1e4d3b" />
      <rect x="${(x + 3).toFixed(1)}" y="${(base - sh).toFixed(1)}" width="${barW}" height="${sh}" rx="3" fill="#c65d3b" />
      <text x="${x.toFixed(1)}" y="${base + 18}" text-anchor="middle" font-size="12" fill="#5c6b62">${m.label}</text>
    </g>`;
  }).join("");
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = base - f * (base - top);
    return `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#e4dccb" stroke-width="1" />
      <text x="2" y="${y - 4}" font-size="11" fill="#9a9a92">$${Math.round(max * f / 100) * 100}</text>`;
  }).join("");
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Income against spending, June to November 2026">
    ${grid}${bars}
    <line x1="0" y1="${base}" x2="${W}" y2="${base}" stroke="#22302a" stroke-width="1.5" />
  </svg>
  <p class="legend"><span><span class="swatch" style="background:#1e4d3b"></span>Income</span><span><span class="swatch" style="background:#c65d3b"></span>Spending</span></p>`;
}
