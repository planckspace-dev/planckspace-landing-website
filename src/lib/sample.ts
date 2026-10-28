/* ─────────────────────────────────────────────────────────────────────────
   The sample workspace every product surface on the site is drawn from.

   One dataset, so the numbers agree with each other the way they do in the
   product: the bill is seats plus metered spend, the removable figure is the
   sum of the findings, every grouping of the spend chart adds up to the same
   daily bars, and the realized figure is the sum of booked savings rows.
   Anyone who checks the page with a calculator should find it adds up. Every
   surface that shows these numbers is labelled as a sample workspace.
   ───────────────────────────────────────────────────────────────────────── */

const DAY_MS = 86_400_000;

export const WORKSPACE = {
  name: "Halyard",
  developers: 42,
  reporting: 38,
  silent: 3,
  period: "October 2026",
  periodLabel: "Last 30 days",
};

/** The sample's "today": Tuesday, October 27 2026. */
export const TODAY = Date.UTC(2026, 9, 27);

const fmtDay = (t: number) => new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const isWeekend = (t: number) => {
  const d = new Date(t).getUTCDay();
  return d === 0 || d === 6;
};

/* ── what the workspace pays for ───────────────────────────────────────── */

export const SEATS = [
  { tool: "claude" as const, label: "Claude Code Max", plan: "Max", seats: 14, active: 13, price: 200 },
  { tool: "claude" as const, label: "Claude Code Pro", plan: "Pro", seats: 22, active: 22, price: 20 },
  { tool: "cursor" as const, label: "Cursor Business", plan: "Business", seats: 20, active: 17, price: 40 },
];

export const METERED = [
  { key: "claude", label: "Claude Code", provider: "Anthropic API", usd: 7850, color: "#d97757" },
  { key: "openai", label: "OpenAI API", provider: "OpenAI API", usd: 1630, color: "#0f9d8f" },
];

export const seatCount = SEATS.reduce((s, x) => s + x.seats, 0); //                   56
export const seatTotal = SEATS.reduce((s, x) => s + x.seats * x.price, 0); //         4,040
export const meteredTotal = METERED.reduce((s, x) => s + x.usd, 0); //                9,480
export const billedTotal = seatTotal + meteredTotal; //                               13,520

/** API-equivalent value of the work done on flat seats. Imputed: never a charge, never added to the bill. */
export const usageValue = 28390;

export const SHIPPING = { sessions: 5472, shipped: 3338, rate: 0.61, perShipped: 2.84 };

/* ── 30 days of metered spend ──────────────────────────────────────────── */

export const DAYS = 30;
/** Day i of the 30-day window; the last day is today. */
export const dayTime = (i: number) => TODAY - (DAYS - 1 - i) * DAY_MS;
export const dayLabel = (i: number) => fmtDay(dayTime(i));

/** 0..1 noise from integer math only (one mulberry32 step), so the server's HTML and the hydrating
    browser compute the same bits. A sin-based hash broke hydration: Math.sin can differ in its last
    bit between Node and Chrome, and the hash's multiplier carried that into the chart coordinates. */
function noise(i: number, seed: number) {
  let t = ((Math.imul(i, 0x9e3779b1) ^ Math.imul(seed, 0x85ebca77)) + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), 1 | t);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** A month's daily shape: weekday rhythm, a rising month, a little noise. Sums to 1. */
function shape(seed: number) {
  const raw = Array.from({ length: DAYS }, (_, i) => {
    const weekend = isWeekend(dayTime(i)) ? 0.42 : 1;
    const trend = 0.74 + (0.5 * i) / (DAYS - 1);
    return weekend * trend * (0.84 + 0.32 * noise(i, seed));
  });
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map((v) => v / sum);
}

/** Splits a daily total across series whose shares drift a little day to day, summing exactly to the total. */
function split(totals: number[], shares: number[], seed: number) {
  return totals.map((t, i) => {
    const w = shares.map((s, k) => s * (0.86 + 0.28 * noise(i * 7 + k, seed)));
    const sum = w.reduce((a, b) => a + b, 0);
    return w.map((x) => (x / sum) * t);
  });
}

export interface Series {
  key: string;
  label: string;
  color: string;
}

export type Grouping = "tool" | "team" | "model";

const toolDaily = METERED.map((m, k) => shape(k + 1).map((f) => f * m.usd));
const claudeDaily = toolDaily[0];
const openaiDaily = toolDaily[1];

/** Metered dollars per day, total. */
export const DAILY_METERED = claudeDaily.map((c, i) => c + openaiDaily[i]);

const claudeByModel = split(claudeDaily, [0.58, 0.36, 0.06], 5);

/* Colour orders validated for adjacent-pair separation (dataviz validator):
   a stack never puts two hard-to-tell hues next to each other. */
export const GROUPINGS: Record<Grouping, { label: string; series: Series[]; rows: number[][] }> = {
  tool: {
    label: "Tool",
    series: METERED.map((m) => ({ key: m.key, label: m.label, color: m.color })),
    rows: DAILY_METERED.map((_, i) => [claudeDaily[i], openaiDaily[i]]),
  },
  team: {
    label: "Team",
    series: [
      { key: "platform", label: "Platform", color: "#2e6bf2" },
      { key: "growth", label: "Growth", color: "#dc6803" },
      { key: "data", label: "Data", color: "#0f9d8f" },
      { key: "mobile", label: "Mobile", color: "#7a5af8" },
    ],
    rows: split(DAILY_METERED, [0.38, 0.27, 0.2, 0.15], 9),
  },
  model: {
    label: "Model",
    series: [
      { key: "gpt", label: "gpt-5", color: "#d6359a" },
      { key: "opus", label: "opus-5-5", color: "#dc6803" },
      { key: "sonnet", label: "sonnet-5-5", color: "#2e6bf2" },
      { key: "haiku", label: "haiku-5-5", color: "#0f9d8f" },
    ],
    rows: DAILY_METERED.map((_, i) => [openaiDaily[i], ...claudeByModel[i]]),
  },
};

export const seriesTotals = (g: Grouping) =>
  GROUPINGS[g].series.map((_, k) => GROUPINGS[g].rows.reduce((s, r) => s + r[k], 0));

/* ── findings ──────────────────────────────────────────────────────────── */

export interface Finding {
  id: "model" | "context" | "cache" | "maxpro" | "dormant";
  /** What is wrong, in words anyone can act on. */
  title: string;
  /** One line, for compact surfaces. */
  plain: string;
  /** What the detector actually saw. */
  saw: string;
  /** Why it costs. */
  why: string;
  /** The fix, and how it is applied. */
  fix: string;
  scope: string;
  type: "seat" | "plan" | "metered" | "setup";
  usd: number;
  effort: "1-click" | "guided";
  risk: "Low" | "Med";
  owner: string;
}

export const FINDINGS: Finding[] = [
  {
    id: "model",
    title: "Premium model on routine work",
    plain: "Opus is answering questions Sonnet ships just as well",
    saw: "64% of payments-api sessions ran on Opus, and 71% of those were routine: under 12 turns, single-file edits.",
    why: "Premium-model rates, paid for work the standard model ships just as well.",
    fix: "One click in VS Code sets the repo's default model to Sonnet in .claude/settings.json.",
    scope: "payments-api · 212 sessions",
    type: "metered",
    usd: 1380,
    effort: "1-click",
    risk: "Low",
    owner: "Platform",
  },
  {
    id: "context",
    title: "Context re-sent on every turn",
    plain: "The same 11k-token CLAUDE.md is sent again with every message",
    saw: "web's CLAUDE.md is 11.2k tokens, and it is read again on every turn of every session.",
    why: "Each message pays to re-read instructions the task mostly doesn't need.",
    fix: "One click splits it into an on-demand index; sections load only when a task needs them.",
    scope: "web · CLAUDE.md",
    type: "setup",
    usd: 640,
    effort: "1-click",
    risk: "Low",
    owner: "Growth",
  },
  {
    id: "cache",
    title: "Cold prompt cache",
    plain: "Only 41% of prompt tokens come from cache on the API key",
    saw: "Only 41% of prompt tokens on the data-pipeline key are served from cache. Well-cached sessions reach 90%.",
    why: "Uncached input is billed at full price on every call.",
    fix: "Guided: handed to your own Claude Code with the measured numbers, plan and diff first.",
    scope: "data-pipeline · API key",
    type: "metered",
    usd: 410,
    effort: "guided",
    risk: "Low",
    owner: "Data",
  },
  {
    id: "maxpro",
    title: "Max seats used at Pro levels",
    plain: "Two $200 seats never came near the $20 plan's ceiling",
    saw: "Two $200 Max seats stayed under the Pro plan's ceiling every day for 30 days.",
    why: "The difference is billed every month, used or not.",
    fix: "Guided: an admin approves the move to Pro; the saving books once the seat change shows.",
    scope: "Claude Code · 2 seats",
    type: "plan",
    usd: 360,
    effort: "guided",
    risk: "Low",
    owner: "Unassigned",
  },
  {
    id: "dormant",
    title: "Dormant seats",
    plain: "Four paid seats had no sessions in 30 days",
    saw: "Four paid seats had no sessions in 30 days. Members who aren't reporting are never counted as idle.",
    why: "An idle seat is billed in full.",
    fix: "Guided: an admin approves, then reclaims or reassigns the seats.",
    scope: "Cursor 3 · Claude Code Max 1",
    type: "seat",
    usd: 320,
    effort: "guided",
    risk: "Low",
    owner: "Unassigned",
  },
];

export const removableTotal = FINDINGS.reduce((s, f) => s + f.usd, 0); // 3,110

/* ── proof of savings ──────────────────────────────────────────────────────
   A saved dollar is a booked row: a session priced against what the same work
   cost before the fix, or a removed seat prorated per day while it stays off.
   Session fixes are judged after 7 days AND 20 sessions. Day 0 is Sep 1. */

export const SAVINGS_START = Date.UTC(2026, 8, 1);
/** Index of today on the savings axis (Oct 27). */
export const SAVINGS_DAYS = Math.round((TODAY - SAVINGS_START) / DAY_MS); // 56
export const savingsDayLabel = (d: number) => fmtDay(SAVINGS_START + d * DAY_MS);

export type Method = "seat" | "repriced" | "cache";

export const METHOD_LABEL: Record<Method, string> = {
  seat: "Seat change, prorated daily",
  repriced: "Repriced at the old model's rates",
  cache: "Re-split at the old cache hit rate",
};

export interface Receipt {
  id: string;
  title: string;
  method: Method;
  metric: string;
  before: string;
  after: string;
  /** 0..1 positions of before / after on the receipt's track */
  beforePos: number;
  afterPos: number;
  /** measured pace, $/mo */
  usd: number;
  /** day the fix was applied */
  day: number;
  /** day it was confirmed (session fixes: after 7 days and 20 sessions) */
  confirmedDay: number;
  /** what was booked: sessions repriced, or days a seat stayed off */
  booked: string;
  /** legacy label used by the studio film */
  verified: string;
}

const r = (x: Omit<Receipt, "verified">): Receipt => ({ ...x, verified: fmtDay(SAVINGS_START + x.confirmedDay * DAY_MS) });

export const RECEIPTS: Receipt[] = [
  r({
    id: "maxpro",
    title: "A Max seat moved to Pro",
    method: "seat",
    metric: "sessions on the Max plan",
    before: "100%",
    after: "0%",
    beforePos: 1,
    afterPos: 0,
    usd: 180,
    day: 3,
    confirmedDay: 3,
    booked: "54 days off",
  }),
  r({
    id: "dormant",
    title: "Two idle Cursor seats removed",
    method: "seat",
    metric: "paid Cursor seats",
    before: "20",
    after: "18",
    beforePos: 1,
    afterPos: 0.9,
    usd: 80,
    day: 10,
    confirmedDay: 10,
    booked: "47 days off",
  }),
  r({
    id: "routing",
    title: "Opus on routine work in web",
    method: "repriced",
    metric: "sessions on Opus",
    before: "64%",
    after: "11%",
    beforePos: 0.64,
    afterPos: 0.11,
    usd: 1120,
    day: 24,
    confirmedDay: 31,
    booked: "418 sessions",
  }),
  r({
    id: "cache",
    title: "Cold cache on search-api",
    method: "cache",
    metric: "prompt tokens from cache",
    before: "38%",
    after: "86%",
    beforePos: 0.38,
    afterPos: 0.86,
    usd: 310,
    day: 38,
    confirmedDay: 45,
    booked: "164 sessions",
  }),
];

const MONTH_DAYS = 30.44;
/** average weekday weight, so a weighted month books the receipt's monthly pace */
const WEEK_WEIGHT = (5 + 2 * 0.35) / 7;

/** Dollars booked on savings-day d, per receipt. */
export function bookedOn(d: number): number[] {
  const weekend = isWeekend(SAVINGS_START + d * DAY_MS);
  return RECEIPTS.map((rc) => {
    if (d < rc.day) return 0;
    if (rc.method === "seat") return (rc.usd * 12) / 365;
    return (rc.usd / MONTH_DAYS / WEEK_WEIGHT) * (weekend ? 0.35 : 1);
  });
}

export const BOOKED: number[][] = Array.from({ length: SAVINGS_DAYS + 1 }, (_, d) => bookedOn(d));
export const bookedDaily = BOOKED.map((row) => row.reduce((a, b) => a + b, 0));
export const cumulativeSaved = bookedDaily.reduce<number[]>((acc, v, i) => (acc.push((acc[i - 1] ?? 0) + v), acc), []);

/** Cumulative dollars booked through day d (continues past today at the same rules). */
export function accrued(d: number): number {
  if (d <= SAVINGS_DAYS) return cumulativeSaved[Math.max(0, Math.floor(d))] ?? 0;
  let s = cumulativeSaved[SAVINGS_DAYS];
  for (let k = SAVINGS_DAYS + 1; k <= d; k++) s += bookedOn(k).reduce((a, b) => a + b, 0);
  return s;
}

/** Measured pace: what was booked in the last 30 days. */
export const realizedTotal = Math.round(bookedDaily.slice(-30).reduce((a, b) => a + b, 0));
export const savedToDate = Math.round(cumulativeSaved[SAVINGS_DAYS]);

/* ── health ────────────────────────────────────────────────────────────── */

export const POSTURE = {
  score: 82,
  delta: 6,
  factors: [
    { key: "cache", label: "Cache efficiency", value: 27.4, max: 31.3, color: "var(--brand-600)" },
    { key: "shipped", label: "Shipped outcomes", value: 19.2, max: 25, color: "var(--green-500)" },
    { key: "routing", label: "Model routing", value: 17.5, max: 25, color: "var(--amber-600)" },
    { key: "seats", label: "Seat utilization", value: 17.9, max: 18.7, color: "var(--violet-500)" },
  ],
};

export const TEAM_PERF = [
  { team: "Platform", members: 12, spend: 3602, rate: 0.68, perShipped: 2.49, trend: -0.06, color: "#2e6bf2" },
  { team: "Growth", members: 11, spend: 2560, rate: 0.64, perShipped: 2.65, trend: -0.02, color: "#dc6803" },
  { team: "Mobile", members: 10, spend: 1422, rate: 0.57, perShipped: 3.54, trend: -0.31, color: "#7a5af8" },
  { team: "Data", members: 9, spend: 1896, rate: 0.52, perShipped: 3.63, trend: 0.04, color: "#0f9d8f" },
];

export const INVOICES = [
  { provider: "Anthropic", invoice: 7912, metered: 7850 },
  { provider: "OpenAI", invoice: 1644, metered: 1630 },
];

/* ── this month's budget ─────────────────────────────────────────────────
   Seats land on the 1st; metered spend accrues daily. October so far is the
   last 27 days of the 30-day window, so the burn is drawn from the same rows. */

const OCT_FIRST = DAYS - 27;
export const BUDGET = (() => {
  const ceiling = 16000;
  const days = 31;
  let acc = seatTotal;
  const points = Array.from({ length: 27 }, (_, k) => {
    acc += DAILY_METERED[OCT_FIRST + k];
    return acc;
  });
  const spent = points[points.length - 1];
  const recent = DAILY_METERED.slice(-7).reduce((a, b) => a + b, 0) / 7;
  const forecast = spent + recent * (days - 27);
  const crossed = [0.5, 0.8, 1].map((f) => {
    const i = points.findIndex((v) => v >= ceiling * f);
    return { pct: Math.round(f * 100), day: i < 0 ? null : i + 1 };
  });
  return { ceiling, days, day: 27, points, spent, forecast, crossed };
})();

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
  { tool: "claude", repo: "payments-api", branch: "main", model: "claude-sonnet-5-5", turns: 18, billing: { kind: "metered", usd: 2.41 }, outcome: "shipped" },
  { tool: "cursor", repo: "web", branch: "checkout-v2", model: "cursor-auto", turns: 9, billing: { kind: "seat", plan: "Business" }, outcome: "shipped" },
  { tool: "claude", repo: "infra", branch: "main", model: "claude-opus-5-5", turns: 31, billing: { kind: "seat", plan: "Max" }, outcome: "partial" },
  { tool: "claude", repo: "data-pipeline", branch: "etl-retry", model: "claude-haiku-5-5", turns: 6, billing: { kind: "metered", usd: 0.18 }, outcome: "shipped" },
  { tool: "cursor", repo: "mobile-app", branch: "main", model: "cursor-auto", turns: 12, billing: { kind: "seat", plan: "Business" }, outcome: "open" },
  { tool: "claude", repo: "web", branch: "search", model: "claude-sonnet-5-5", turns: 22, billing: { kind: "metered", usd: 3.07 }, outcome: "shipped" },
  { tool: "claude", repo: "design-system", branch: "tokens", model: "claude-sonnet-5-5", turns: 7, billing: { kind: "seat", plan: "Pro" }, outcome: "shipped" },
  { tool: "claude", repo: "payments-api", branch: "refunds", model: "claude-opus-5-5", turns: 26, billing: { kind: "metered", usd: 8.92 }, outcome: "partial" },
];

/* ── formatting ────────────────────────────────────────────────────────── */

export const usd = (n: number, digits = 0) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** Compact money for axis ticks: $0, $250, $1.2K. */
export const usdTick = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : `$${Math.round(n)}`);
