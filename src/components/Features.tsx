import { Reveal } from "@/components/ui/reveal";

/* ─────────────────────────────────────────────────────────────────────────
   Product bento — every tile maps to a real capability in the platform
   (shared source of truth, wasted-spend, reconciliation, budgets/anomalies,
   team attribution, session receipts, chargeback exports, editor fix-it,
   verified-savings ledger).

   These tiles are built natively in code — no dashboard screenshots. The hero
   already shows the real product large; here each capability is drawn as a
   crafted, on-brand mini-UI so the section reads as bespoke, not a re-crop.
   ───────────────────────────────────────────────────────────────────────── */

/* ── shared primitives ──────────────────────────────────────────────────── */

function TileShell({
  title,
  body,
  children,
  className = "",
}: {
  title: string;
  body: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`card group flex flex-col overflow-hidden transition-shadow duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:shadow-[var(--shadow-float)] ${className}`}
    >
      <div className="flex flex-1 items-stretch border-b border-[var(--border)] bg-[var(--panel)] p-5">
        <div className="w-full">{children}</div>
      </div>
      <div className="p-5">
        <h3 className="text-[16px] font-semibold tracking-[-0.015em] text-[var(--ink)]">
          {title}
        </h3>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--text-2)]">{body}</p>
      </div>
    </div>
  );
}

/** White "screen" plate that every mock floats on — matches the product's UI. */
function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-[0_1px_2px_rgba(17,19,26,0.04),0_14px_30px_-20px_rgba(17,19,26,0.3)]">
      <div className={className}>{children}</div>
    </div>
  );
}

/** Uppercase mono micro-caption used as an in-panel section label. */
function Cap({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-medium uppercase tracking-[0.09em] text-[var(--text-3)]">
      {children}
    </span>
  );
}

const TONE = {
  pos: "var(--green-700)",
  neg: "var(--coral-700)",
  muted: "var(--text-3)",
} as const;

function Stat({
  label,
  value,
  delta,
  tone = "muted",
  sub,
}: {
  label: string;
  value: string;
  delta?: string;
  tone?: keyof typeof TONE;
  sub?: string;
}) {
  return (
    <div className="bg-white p-3.5">
      <div className="text-[9.5px] font-medium uppercase tracking-[0.07em] text-[var(--text-3)]">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="num text-[18px] font-medium tracking-[-0.03em] text-[var(--ink)]">
          {value}
        </span>
        {delta && (
          <span className="num text-[10px] font-medium" style={{ color: TONE[tone] }}>
            {delta}
          </span>
        )}
      </div>
      {sub && <div className="mt-0.5 text-[9.5px] text-[var(--text-3)]">{sub}</div>}
    </div>
  );
}

/* ── inline spend chart ─────────────────────────────────────────────────── */

const SPEND = [30, 26, 33, 28, 40, 33, 47, 42, 55, 49, 66, 58, 82, 70, 96, 84];

const CHART = (() => {
  const W = 500;
  const H = 130;
  const PT = 14;
  const PB = 16;
  const max = Math.max(...SPEND);
  const min = Math.min(...SPEND);
  const range = max - min || 1;
  const n = SPEND.length;
  const pts = SPEND.map((v, i): [number, number] => [
    (i / (n - 1)) * W,
    PT + (1 - (v - min) / range) * (H - PT - PB),
  ]);
  // Catmull-Rom → cubic Bézier for a smooth, believable line
  let line = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    line += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  const area = `${line} L ${W},${H} L 0,${H} Z`;
  const peak = pts[SPEND.indexOf(max)];
  return { W, H, line, area, peak };
})();

function SpendChart() {
  return (
    <Panel>
      <div className="grid grid-cols-2 gap-px border-b border-[var(--border)] bg-[var(--border)] sm:grid-cols-4">
        <Stat label="Usage value" value="$1,134" delta="↑120%" tone="pos" sub="API-equivalent" />
        <Stat label="Cost / shipped" value="$25.21" delta="↑458%" tone="neg" sub="was $4.52" />
        <Stat label="Shipped rate" value="88%" delta="↓8.4pts" tone="muted" sub="target 70%" />
        <Stat label="Sessions" value="51" delta="2 devs" tone="muted" sub="last 30 days" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <Cap>Spend over time</Cap>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="num text-[18px] font-medium tracking-[-0.03em] text-[var(--ink)]">
                $1,132
              </span>
              <span className="num text-[10.5px] font-medium text-[var(--green-700)]">
                ↑120%
              </span>
            </div>
          </div>
          <div className="flex gap-1">
            {["Total", "By team", "By repo"].map((t, i) => (
              <span
                key={t}
                className={
                  i === 0
                    ? "rounded-md bg-[var(--ink)] px-2 py-0.5 text-[10px] font-medium text-white"
                    : "rounded-md px-2 py-0.5 text-[10px] text-[var(--text-3)]"
                }
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <svg
          viewBox={`0 0 ${CHART.W} ${CHART.H}`}
          className="mt-3 block h-auto w-full"
          role="img"
          aria-label="Daily spend rising from roughly $70 to $140 over the last 30 days, with one anomalous peak."
        >
          <defs>
            <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-500)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--brand-500)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[32, 66, 100].map((y) => (
            <line
              key={y}
              x1="0"
              x2={CHART.W}
              y1={y}
              y2={y}
              stroke="var(--border)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
          ))}
          <path d={CHART.area} fill="url(#spendFill)" />
          <path
            d={CHART.line}
            fill="none"
            stroke="var(--brand-600)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1={CHART.peak[0]}
            x2={CHART.peak[0]}
            y1={CHART.peak[1]}
            y2={CHART.H}
            stroke="var(--coral-500)"
            strokeWidth="1"
            strokeDasharray="2 3"
            opacity="0.5"
          />
          <circle cx={CHART.peak[0]} cy={CHART.peak[1]} r="3.5" fill="var(--coral-500)" />
          <circle cx={CHART.peak[0]} cy={CHART.peak[1]} r="6" fill="var(--coral-500)" opacity="0.18" />
        </svg>

        <div className="mt-1.5 flex justify-between text-[9.5px] text-[var(--text-3)]">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
        </div>
      </div>
    </Panel>
  );
}

/* ── wasted-spend fix queue ─────────────────────────────────────────────── */

function MockFixQueue() {
  const rows = [
    { n: 1, label: "Context re-reads · api-service", note: "3,592× cache/input", save: "$204", sev: "var(--coral-500)" },
    { n: 2, label: "3 marathon sessions never shipped", note: "avg 152 turns", save: "$195", sev: "var(--amber-500)" },
    { n: 3, label: "Opus on trivial edits", note: "route → Haiku", save: "$104", sev: "var(--amber-500)" },
  ];
  return (
    <Panel className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <Cap>Fix queue · ranked by impact</Cap>
        <span className="num text-[10.5px] font-medium text-[var(--coral-700)]">
          $594/mo on the table
        </span>
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.n}
            className="flex items-center gap-3 rounded-md border border-[var(--border)] px-2.5 py-2"
          >
            <span
              className="num flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-medium text-white"
              style={{ background: r.sev }}
            >
              {r.n}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[11.5px] font-medium text-[var(--ink)]">
                {r.label}
              </span>
              <span className="block truncate text-[10px] text-[var(--text-3)]">{r.note}</span>
            </span>
            <span className="num shrink-0 rounded bg-[var(--green-50)] px-1.5 py-0.5 text-[10.5px] font-medium text-[var(--green-700)]">
              save {r.save}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ── invoice reconciliation ─────────────────────────────────────────────── */

function MockReconciliation() {
  return (
    <Panel className="p-4">
      <div className="space-y-3.5">
        <div>
          <div className="mb-1.5 flex justify-between text-[10.5px]">
            <span className="text-[var(--text-2)]">Invoiced (Anthropic)</span>
            <span className="num font-medium text-[var(--ink)]">$6,120</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--inset)]">
            <div className="h-full w-full rounded-full bg-[var(--ink)]" />
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex justify-between text-[10.5px]">
            <span className="text-[var(--text-2)]">Attributed by PlanckSpace</span>
            <span className="num font-medium text-[var(--brand-700)]">$5,780</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--inset)]">
            <div className="h-full w-[94%] rounded-full bg-[var(--brand-600)]" />
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-md bg-[var(--brand-50)] px-3 py-2.5 text-[10.5px] leading-relaxed text-[var(--brand-900)]">
        <span className="num font-medium">$340 gap</span> — likely 1 engineer without
        PlanckSpace installed. Invite them to close it.
      </div>
    </Panel>
  );
}

/* ── budgets + anomaly alerts ───────────────────────────────────────────── */

function MockBudgets() {
  const alerts = [
    { label: "Session outlier", detail: "$190 vs $16 median", sev: "var(--coral-500)", tag: "critical" },
    { label: "Repo spike", detail: "3× median · planck-cli", sev: "var(--amber-500)", tag: "high" },
  ];
  return (
    <Panel>
      <div className="grid gap-px bg-[var(--border)] sm:grid-cols-2">
        <div className="bg-white p-4">
          <Cap>October budget</Cap>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="num text-[18px] font-medium tracking-[-0.03em] text-[var(--ink)]">
              $5,120
            </span>
            <span className="num text-[11px] text-[var(--text-3)]">/ $8,000</span>
          </div>
          <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-[var(--inset)]">
            <div className="h-full w-[64%] rounded-full bg-[var(--brand-600)]" />
            <div className="absolute inset-y-0 left-[72%] w-px bg-[var(--ink)]" />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px]">
            <span className="text-[var(--text-3)]">64% used · day 19</span>
            <span className="num font-medium text-[var(--green-700)]">on pace</span>
          </div>
          <div className="mt-0.5 text-[10px] text-[var(--text-3)]">
            projected close <span className="num">$7,430</span>
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <Cap>Anomaly alerts</Cap>
            <span className="num text-[10px] text-[var(--text-3)]">2 new</span>
          </div>
          <div className="space-y-2">
            {alerts.map((a) => (
              <div key={a.label} className="flex items-start gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: a.sev }}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="text-[11px] font-medium text-[var(--ink)]">{a.label}</span>
                    <span className="num shrink-0 text-[9.5px] uppercase tracking-[0.06em] text-[var(--text-3)]">
                      {a.tag}
                    </span>
                  </span>
                  <span className="num block truncate text-[10px] text-[var(--text-2)]">
                    {a.detail}
                  </span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2.5 border-t border-[var(--border)] pt-2 text-[10px] text-[var(--text-3)]">
            delivered to <span className="num">#eng-spend</span> before the invoice
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ── per-team attribution ───────────────────────────────────────────────── */

function MockAttribution() {
  const repos = [
    { name: "planckspace-backend", val: "$580", w: "100%", meta: "26 shipped" },
    { name: "planckspace-frontend", val: "$263", w: "45%", meta: "14 shipped" },
    { name: "planck-cli", val: "$96", w: "17%", meta: "8 shipped" },
    { name: "Unattributed", val: "$41", w: "7%", meta: "invite 1 dev", muted: true },
  ];
  return (
    <Panel className="p-4">
      <div className="mb-3">
        <Cap>Top repos · by spend</Cap>
      </div>
      <div className="space-y-2.5">
        {repos.map((r) => (
          <div key={r.name}>
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span
                className={`truncate text-[11px] font-medium ${
                  r.muted ? "text-[var(--text-3)]" : "text-[var(--ink)]"
                }`}
              >
                {r.name}
              </span>
              <span className="num shrink-0 text-[11px] font-medium text-[var(--ink)]">
                {r.val}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--inset)]">
              <div
                className={`h-full rounded-full ${
                  r.muted ? "bg-[var(--border-strong)]" : "bg-[var(--brand-600)]"
                }`}
                style={{ width: r.w }}
              />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ── session-level receipt ──────────────────────────────────────────────── */

function MockReceipt() {
  const metrics = [
    { k: "Cost", v: "$4.20" },
    { k: "Turns", v: "34" },
    { k: "Cache", v: "91%" },
  ];
  return (
    <Panel className="p-4">
      <div className="flex items-center justify-between">
        <Cap>Session · receipt</Cap>
        <span className="rounded bg-[var(--green-50)] px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.06em] text-[var(--green-700)]">
          shipped
        </span>
      </div>
      <div className="mt-2 truncate text-[12px] font-medium text-[var(--ink)]">
        planckspace-backend
      </div>
      <div className="num truncate text-[10.5px] text-[var(--text-2)]">
        fix/cache-key · claude-opus-4 · Claude Code
      </div>
      <div className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-[var(--border)] bg-[var(--border)]">
        {metrics.map((m) => (
          <div key={m.k} className="bg-white px-2 py-2">
            <div className="text-[9px] uppercase tracking-[0.06em] text-[var(--text-3)]">
              {m.k}
            </div>
            <div className="num mt-0.5 text-[13px] font-medium text-[var(--ink)]">{m.v}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ── finance-ready export ───────────────────────────────────────────────── */

function MockExport() {
  const rows = [
    { dev: "a.chen", cost: "$212" },
    { dev: "r.patel", cost: "$168" },
    { dev: "m.diaz", cost: "$97" },
  ];
  return (
    <Panel className="p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <Cap>Chargeback · October</Cap>
        <span className="num text-[9.5px] uppercase tracking-[0.06em] text-[var(--text-3)]">
          CSV
        </span>
      </div>
      <div className="overflow-hidden rounded-md border border-[var(--border)]">
        {rows.map((r, i) => (
          <div
            key={r.dev}
            className={`flex items-center justify-between px-3 py-1.5 text-[11px] ${
              i > 0 ? "border-t border-[var(--border)]" : ""
            }`}
          >
            <span className="num text-[var(--ink)]">{r.dev}</span>
            <span className="num font-medium text-[var(--ink)]">{r.cost}</span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--panel)] px-3 py-1.5 text-[11px]">
          <span className="text-[var(--text-2)]">Total</span>
          <span className="num font-medium text-[var(--ink)]">$477</span>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {["Download CSV", "PDF"].map((t) => (
          <span
            key={t}
            className="rounded-md border border-[var(--border)] px-2.5 py-1 text-[10.5px] font-medium text-[var(--text-2)]"
          >
            {t}
          </span>
        ))}
      </div>
    </Panel>
  );
}

/* ── editor fix-it ──────────────────────────────────────────────────────── */

function MockFixIt() {
  return (
    <Panel className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <Cap>Insight · your editor</Cap>
        <span className="num text-[10px] text-[var(--text-3)]">high confidence</span>
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[12px] font-medium text-[var(--ink)]">
          CLAUDE.md re-read 212× per session · api-service
        </span>
        <span className="num shrink-0 text-[12px] font-medium text-[var(--green-700)]">$34/mo</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-md bg-[var(--brand-600)] px-3 py-1.5 text-[10.5px] font-medium text-white">
          ⚡ Fix now
        </span>
        <span className="rounded-md border border-[var(--border)] px-3 py-1.5 text-[10.5px] font-medium text-[var(--text-2)]">
          ▸ Fix with Claude Code
        </span>
      </div>
      <div className="mt-2.5 text-[10px] text-[var(--text-3)]">
        files backed up · one-click undo · marked fixed automatically
      </div>
    </Panel>
  );
}

/* ── verified-savings ledger ────────────────────────────────────────────── */

function MockLedger() {
  const receipts = [
    { label: "Context split · api-service", value: "$28/mo", date: "verified Jun 02" },
    { label: "Model routing · workspace", value: "$19/mo", date: "verified Jun 21" },
  ];
  return (
    <Panel className="p-4">
      <div className="flex items-baseline gap-2">
        <span className="text-[11px] text-[var(--text-2)]">Saved you</span>
        <span className="num text-[22px] font-medium tracking-[-0.03em] text-[var(--green-700)]">
          $212
        </span>
        <span className="text-[11px] text-[var(--text-2)]">since May 12</span>
      </div>
      <div className="mt-3 space-y-1.5">
        {receipts.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between rounded-md border border-[var(--border)] px-3 py-2"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="text-[10px] text-[var(--green-700)]">✓</span>
              <span className="truncate text-[10.5px] text-[var(--ink)]">{r.label}</span>
            </span>
            <span className="num shrink-0 pl-2 text-[10.5px] text-[var(--text-3)]">
              <span className="font-medium text-[var(--ink)]">{r.value}</span> · {r.date}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2.5 text-[10px] text-[var(--text-3)]">
        measured from your telemetry after each fix — never claimed
      </div>
    </Panel>
  );
}

/* ── section ────────────────────────────────────────────────────────────── */

export default function Features() {
  return (
    <section
      id="product"
      className="scroll-mt-24 border-t border-[var(--border)] bg-[var(--panel)] py-24 sm:py-36"
    >
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-6" data-center="true">
            The platform
          </p>
          <h2 className="display-2">From raw tokens to answers finance will accept.</h2>
          <p className="lead mt-5">
            Every session your team runs becomes attributed, explainable spend —
            in the dashboard, the CLI, and your editor.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <TileShell
              className="h-full"
              title="One shared source of truth"
              body="Live workspace spend across every tool, model, and developer — the same numbers for engineering, management, and finance."
            >
              <SpendChart />
            </TileShell>
          </Reveal>

          <Reveal delay={0.06} className="lg:col-span-5">
            <TileShell
              className="h-full"
              title="Wasted spend, itemized"
              body="Idle seats, cache misses, and oversized-model habits surfaced as line items with a dollar value — not vibes."
            >
              <MockFixQueue />
            </TileShell>
          </Reveal>

          <Reveal className="lg:col-span-5">
            <TileShell
              className="h-full"
              title="Reconcile the invoice"
              body="PlanckSpace matches attributed usage against what your providers actually billed — and explains the gap."
            >
              <MockReconciliation />
            </TileShell>
          </Reveal>

          <Reveal delay={0.06} className="lg:col-span-7">
            <TileShell
              className="h-full"
              title="Budgets that alert before the surprise"
              body="Monthly budgets with pace tracking and anomaly detection. When spend spikes 3× the median, you hear it from us — not the invoice."
            >
              <MockBudgets />
            </TileShell>
          </Reveal>

          <Reveal className="lg:col-span-4">
            <TileShell
              className="h-full"
              title="Per-team attribution"
              body="Spend rolls up by team, repo, and developer, with the unattributed remainder always visible."
            >
              <MockAttribution />
            </TileShell>
          </Reveal>

          <Reveal delay={0.05} className="lg:col-span-4">
            <TileShell
              className="h-full"
              title="Session-level receipts"
              body="Every dollar traces to a session: model, token mix, cache efficiency, repo. Drill from invoice to receipt."
            >
              <MockReceipt />
            </TileShell>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-4">
            <TileShell
              className="h-full"
              title="Finance-ready exports"
              body="Chargeback and showback CSVs, cut by team or cost center — drop them straight into the monthly close."
            >
              <MockExport />
            </TileShell>
          </Reveal>

          <Reveal className="lg:col-span-7">
            <TileShell
              className="h-full"
              title="Fix it from your editor, in one click"
              body="The PlanckSpace extension for VS Code, Cursor, and Windsurf turns every insight into an applied fix — mechanical ones instantly (backed up, undoable), judgement calls handed to your own Claude Code with the measured data injected."
            >
              <MockFixIt />
            </TileShell>
          </Reveal>

          <Reveal delay={0.06} className="lg:col-span-5">
            <TileShell
              className="h-full"
              title="Savings, verified from telemetry"
              body="After a fix, PlanckSpace watches your real usage and only books the saving once it's confirmed. The ledger is measured, never claimed — with a dated receipt for every dollar."
            >
              <MockLedger />
            </TileShell>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
