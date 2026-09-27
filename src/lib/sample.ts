/* ─────────────────────────────────────────────────────────────────────────
   The sample workspace every product surface on the site is drawn from.

   One dataset, so the numbers agree with each other the way they do in the
   product: the hero total is the money row's billed figure, the removable
   figure is the sum of the findings, and realized savings is the sum of the
   verified receipts. Anyone who checks the page with a calculator should
   find it adds up. Every surface that shows these numbers is labelled as a
   sample workspace.
   ───────────────────────────────────────────────────────────────────────── */

export type ToolKey = "claude" | "cursor" | "windsurf" | "api";

export const WORKSPACE = {
  name: "Halyard",
  developers: 42,
  reporting: 38,
  period: "Sep 2026",
  periodLabel: "Last 30 days",
};

export const SEATS = [
  { tool: "claude" as const, plan: "Max", seats: 14, active: 13, price: 200 },
  { tool: "claude" as const, plan: "Pro", seats: 22, active: 22, price: 20 },
  { tool: "cursor" as const, plan: "Business", seats: 20, active: 17, price: 40 },
];

export const METERED = [
  { provider: "Anthropic API", usd: 7850 },
  { provider: "OpenAI API", usd: 1630 },
];

export const seatTotal = SEATS.reduce((s, x) => s + x.seats * x.price, 0); // 4,040
export const meteredTotal = METERED.reduce((s, x) => s + x.usd, 0); //       9,480
export const billedTotal = seatTotal + meteredTotal; //                     13,520

export type Reality = "real" | "imputed";

export interface Finding {
  id: string;
  title: string;
  plain: string;
  scope: string;
  type: "seat" | "plan" | "metered";
  usd: number;
  reality: Reality;
  effort: "1-click" | "guided";
  risk: "Low" | "Med";
  owner: string;
}

export const FINDINGS: Finding[] = [
  {
    id: "model",
    title: "Premium model on routine work",
    plain: "Opus is answering questions Sonnet ships just as well",
    scope: "payments-api · 212 sessions",
    type: "metered",
    usd: 1380,
    reality: "real",
    effort: "1-click",
    risk: "Low",
    owner: "Platform",
  },
  {
    id: "context",
    title: "Context re-read on every turn",
    plain: "The same 11k-token CLAUDE.md is sent again with every message",
    scope: "web · CLAUDE.md",
    type: "metered",
    usd: 640,
    reality: "real",
    effort: "1-click",
    risk: "Low",
    owner: "Growth",
  },
  {
    id: "cache",
    title: "Cold prompt cache",
    plain: "Only 41% of prompt tokens come from cache on the API keys",
    scope: "data-pipeline · API key",
    type: "metered",
    usd: 410,
    reality: "real",
    effort: "guided",
    risk: "Low",
    owner: "Data",
  },
  {
    id: "maxpro",
    title: "Max seats used at Pro levels",
    plain: "Two $200 seats never came near the $20 plan's ceiling",
    scope: "Claude Code · 2 seats",
    type: "plan",
    usd: 360,
    reality: "real",
    effort: "guided",
    risk: "Low",
    owner: "Unassigned",
  },
  {
    id: "dormant",
    title: "Dormant seats",
    plain: "Four paid seats had no sessions in 30 days",
    scope: "Cursor 3 · Claude Code Max 1",
    type: "seat",
    usd: 320,
    reality: "real",
    effort: "guided",
    risk: "Low",
    owner: "Unassigned",
  },
];

export const removableTotal = FINDINGS.reduce((s, f) => s + f.usd, 0); // 3,110

export interface Receipt {
  id: string;
  title: string;
  metric: string;
  before: string;
  after: string;
  /** 0..1 position of before/after on the receipt's track */
  beforePos: number;
  afterPos: number;
  usd: number;
  held: number;
  verified: string;
  /** day the fix was verified; day 0 = Aug 1 */
  day: number;
}

export const RECEIPTS: Receipt[] = [
  {
    id: "maxpro",
    title: "A Max seat used at Pro levels",
    metric: "max_plan_session_pct",
    before: "100",
    after: "0",
    beforePos: 1,
    afterPos: 0,
    usd: 180,
    held: 1,
    verified: "Aug 4",
    day: 3,
  },
  {
    id: "dormant",
    title: "Two Cursor seats with no sessions",
    metric: "paid_seat_count",
    before: "20",
    after: "18",
    beforePos: 1,
    afterPos: 0.9,
    usd: 80,
    held: 1,
    verified: "Aug 11",
    day: 10,
  },
  {
    id: "routing",
    title: "Premium model on routine work",
    metric: "sessions on Opus",
    before: "64%",
    after: "11%",
    beforePos: 0.64,
    afterPos: 0.11,
    usd: 1120,
    held: 0.83,
    verified: "Aug 26",
    day: 25,
  },
  {
    id: "claudemd",
    title: "CLAUDE.md re-read every turn",
    metric: "context tokens per turn",
    before: "11.2k",
    after: "3.1k",
    beforePos: 1,
    afterPos: 0.28,
    usd: 600,
    held: 0.91,
    verified: "Sep 12",
    day: 42,
  },
];

export const realizedTotal = RECEIPTS.reduce((s, r) => s + r.usd, 0); // 1,980

export const POSTURE = {
  score: 82,
  factors: [
    { key: "cache", label: "Cache efficiency", value: 27.4, max: 31.3, color: "var(--brand-600)" },
    { key: "shipped", label: "Shipped outcomes", value: 19.2, max: 25, color: "var(--green-500)" },
    { key: "routing", label: "Model routing", value: 17.5, max: 25, color: "var(--amber-600)" },
    { key: "seats", label: "Seat utilization", value: 17.9, max: 18.7, color: "var(--violet-500)" },
  ],
};

/* ── 30 days of metered spend, by tool ─────────────────────────────────── */

export const SERIES = [
  { key: "claude", label: "Claude Code", color: "#D97757", total: 7850 },
  { key: "openai", label: "OpenAI API", color: "#7A5AF8", total: 1630 },
] as const;

export const DAYS = 30;
/** Aug 29 is day 0; the last day is today, Sep 27. */
export const dayLabel = (i: number) => {
  const d = new Date(Date.UTC(2026, 7, 29 + i));
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
};

function shape(seed: number) {
  // weekday rhythm, a rising month, a little noise; deterministic
  const raw = Array.from({ length: DAYS }, (_, i) => {
    const dow = (i + 6) % 7; // Aug 29 2026 is a Saturday
    const weekend = dow >= 5 ? 0.45 : 1;
    const trend = 0.7 + (0.6 * i) / (DAYS - 1);
    const noise = 0.85 + 0.3 * Math.abs(Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453 % 1);
    return weekend * trend * noise;
  });
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map((v) => v / sum);
}

/** daily[i][k] = dollars for series k on day i; each series sums to its total. */
export const DAILY: number[][] = (() => {
  const shapes = SERIES.map((s, k) => shape(k + 1).map((f) => f * s.total));
  return Array.from({ length: DAYS }, (_, i) => shapes.map((sh) => sh[i]));
})();

/** Billed per day (seats spread evenly + metered), for the money-row sparkline. */
export const DAILY_BILLED = DAILY.map((d) => d.reduce((a, b) => a + b, 0) + seatTotal / DAYS);

/* ── the live session feed ─────────────────────────────────────────────── */

export interface Session {
  tool: "claude" | "cursor";
  repo: string;
  branch: string;
  model: string;
  turns: number;
  billing: { kind: "seat"; plan: string } | { kind: "metered"; usd: number };
  outcome: "shipped" | "partial" | "open";
}

export const SESSIONS: Session[] = [
  { tool: "claude", repo: "payments-api", branch: "main", model: "claude-sonnet-5", turns: 18, billing: { kind: "metered", usd: 2.41 }, outcome: "shipped" },
  { tool: "cursor", repo: "web", branch: "checkout-v2", model: "cursor-auto", turns: 9, billing: { kind: "seat", plan: "Business" }, outcome: "shipped" },
  { tool: "claude", repo: "infra", branch: "main", model: "claude-opus-5-5", turns: 31, billing: { kind: "seat", plan: "Max" }, outcome: "partial" },
  { tool: "claude", repo: "data-pipeline", branch: "etl-retry", model: "claude-haiku-4-5", turns: 6, billing: { kind: "metered", usd: 0.18 }, outcome: "shipped" },
  { tool: "cursor", repo: "mobile-app", branch: "main", model: "cursor-auto", turns: 12, billing: { kind: "seat", plan: "Business" }, outcome: "open" },
  { tool: "claude", repo: "web", branch: "search", model: "claude-sonnet-5", turns: 22, billing: { kind: "metered", usd: 3.07 }, outcome: "shipped" },
  { tool: "claude", repo: "design-system", branch: "tokens", model: "claude-sonnet-5", turns: 7, billing: { kind: "seat", plan: "Pro" }, outcome: "shipped" },
  { tool: "claude", repo: "payments-api", branch: "refunds", model: "claude-opus-5-5", turns: 26, billing: { kind: "metered", usd: 8.92 }, outcome: "partial" },
];

/* ── realized savings, accrued the way the ledger does ─────────────────── */

export const SAVINGS_DAYS = 57; // day 0 = Aug 1, today = Sep 27
const MS_PER_MONTH = 30.44;
/** cumulative dollars saved on day d: sum of rate x months since each fix was verified */
export const accrued = (d: number) =>
  RECEIPTS.reduce((s, r) => s + (d > r.day ? (r.usd * (d - r.day)) / MS_PER_MONTH : 0), 0);
export const savedToDate = Math.round(accrued(SAVINGS_DAYS));

export const usd = (n: number, digits = 0) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
