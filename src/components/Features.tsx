import { Reveal } from "@/components/ui/reveal";

/* ─────────────────────────────────────────────────────────────────────────
   The product.

   Three acts and a closing strip, deliberately not nine equal tiles: the
   shared dashboard is the anchor, the three money cells are the argument,
   and the editor loop is the thing nobody else does. Act 1 runs copy-left,
   act 3 runs copy-right, so the eye does not read the same row twice.

   Every mock is drawn straight onto the surface it sits on. There is no
   panel inside a card inside a card here; regions are separated by hairlines
   the same way the real product separates them, which is the only thing that
   keeps a section this dense from reading as decoration.

   Figures match the Overview capture used in the hero. Keep them in sync if
   that screenshot is ever regenerated.
   ───────────────────────────────────────────────────────────────────────── */

/* ── primitives ─────────────────────────────────────────────────────────── */

/** One bordered white surface. Everything inside is divided by hairlines. */
function Slab({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-soft)] ${className}`}
    >
      {children}
    </div>
  );
}

/** Uppercase mono micro-label used as in-product chrome. */
function Cap({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--text-3)]">
      {children}
    </span>
  );
}

/** The written half of an act: claim, explanation, then the receipts in mono. */
function Lede({
  title,
  body,
  facts,
}: {
  title: string;
  body: string;
  facts: string[];
}) {
  /* Padding stacks on a phone: 20px of container gutter plus the slab's own
     inset. At p-8 that left ~286px of measure inside a 390px screen. p-6 to
     sm, unchanged above it. Same reasoning in Cell and EditorLoop below. */
  return (
    <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
      <h3 className="max-w-sm text-[23px] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--ink)] sm:text-[28px]">
        {title}
      </h3>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--text-2)]">
        {body}
      </p>
      <ul className="mt-7 space-y-2.5 border-t border-[var(--border)] pt-5 sm:mt-8 sm:pt-6">
        {facts.map((f) => (
          <li key={f} className="num text-[12px] leading-relaxed text-[var(--text-3)]">
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A cell in the three-across row: claim on top, evidence pinned underneath. */
function Cell({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col bg-white p-6 sm:p-8">
      <h3 className="text-[18px] font-semibold leading-snug tracking-[-0.02em] text-[var(--ink)]">
        {title}
      </h3>
      <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--text-2)]">{body}</p>
      <div className="mt-7 flex-1 sm:mt-8" />
      <div className="border-t border-[var(--border)] pt-5 sm:pt-6">{children}</div>
    </div>
  );
}

/* ── act 1: the shared dashboard ────────────────────────────────────────── */

function Stat({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  tone?: "pos" | "neg";
}) {
  const color =
    tone === "pos"
      ? "var(--green-700)"
      : tone === "neg"
        ? "var(--coral-700)"
        : "var(--text-3)";
  /* Three across at 390px leaves ~116px a cell. The value and its delta side
     by side do not fit in that, so on a phone the delta drops to its own line
     under the value; from sm they sit on one baseline as designed. */
  return (
    <div className="bg-white px-3.5 py-4 sm:px-6 sm:py-5">
      <Cap>{label}</Cap>
      <div className="mt-1.5 flex flex-col items-start gap-x-2 sm:mt-2 sm:flex-row sm:items-baseline">
        <span className="num text-[18px] font-medium tracking-[-0.04em] text-[var(--ink)] sm:text-[25px]">
          {value}
        </span>
        <span className="num text-[10.5px] font-medium sm:text-[11px]" style={{ color }}>
          {delta}
        </span>
      </div>
    </div>
  );
}

const SPEND = [30, 26, 33, 28, 40, 33, 47, 42, 55, 49, 66, 58, 82, 70, 96, 84];

const CHART = (() => {
  const W = 520;
  const H = 132;
  const PT = 12;
  const PB = 14;
  const max = Math.max(...SPEND);
  const min = Math.min(...SPEND);
  const range = max - min || 1;
  const n = SPEND.length;
  const pts = SPEND.map((v, i): [number, number] => [
    (i / (n - 1)) * W,
    PT + (1 - (v - min) / range) * (H - PT - PB),
  ]);
  // Catmull-Rom to cubic Bezier, so the line reads as measured rather than drawn
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

function Dashboard() {
  return (
    <div className="flex flex-col border-t border-[var(--border)] lg:border-l lg:border-t-0">
      <div className="grid grid-cols-3 gap-px border-b border-[var(--border)] bg-[var(--border)]">
        <Stat label="Usage value" value="$1,134" delta="↑ 120%" tone="pos" />
        <Stat label="Cost / shipped" value="$25.21" delta="↑ 458%" tone="neg" />
        <Stat label="Shipped rate" value="88%" delta="↓ 8.4 pts" />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Cap>Spend over time</Cap>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="num text-[24px] font-medium tracking-[-0.04em] text-[var(--ink)]">
                $1,132
              </span>
              <span className="num text-[11px] font-medium text-[var(--green-700)]">
                ↑ 120%
              </span>
            </div>
          </div>
          <div className="flex shrink-0 gap-1">
            {["Total", "By team", "By repo"].map((t, i) => (
              <span
                key={t}
                className={
                  i === 0
                    ? "rounded-md bg-[var(--ink)] px-2 py-1 text-[10.5px] font-medium text-white sm:px-2.5"
                    : "rounded-md px-2 py-1 text-[10.5px] text-[var(--text-3)] sm:px-2.5"
                }
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <svg
          viewBox={`0 0 ${CHART.W} ${CHART.H}`}
          className="mt-6 block h-auto w-full"
          role="img"
          aria-label="Workspace spend rising across the last thirty days, with one flagged peak near the end of week four."
        >
          <defs>
            <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-500)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--brand-500)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[34, 68, 102].map((y) => (
            <line
              key={y}
              x1="0"
              x2={CHART.W}
              y1={y}
              y2={y}
              stroke="var(--border)"
              strokeWidth="1"
              strokeDasharray="3 5"
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
            opacity="0.45"
          />
          <circle cx={CHART.peak[0]} cy={CHART.peak[1]} r="3.5" fill="var(--coral-500)" />
          <circle
            cx={CHART.peak[0]}
            cy={CHART.peak[1]}
            r="7"
            fill="var(--coral-500)"
            opacity="0.16"
          />
        </svg>

        <div className="num mt-3 flex justify-between text-[10px] text-[var(--text-3)]">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
        </div>
      </div>
    </div>
  );
}

/* ── act 2 mocks ────────────────────────────────────────────────────────── */

const LEAKS = [
  { label: "Context re-reads, api-service", note: "3,592× cache to input", save: "$204" },
  { label: "Marathon sessions that never shipped", note: "3 sessions, 152 turns each", save: "$195" },
  { label: "Opus on trivial edits", note: "route to Haiku", save: "$104" },
];

function LeakList() {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <Cap>Ranked by impact</Cap>
        <span className="num text-[11px] font-medium text-[var(--coral-700)]">
          $594/mo
        </span>
      </div>
      <ul className="mt-4 divide-y divide-[var(--border)]">
        {LEAKS.map((l) => (
          <li key={l.label} className="flex items-start justify-between gap-3 py-3 first:pt-0">
            <span className="min-w-0">
              <span className="block text-[12.5px] font-medium leading-snug text-[var(--ink)]">
                {l.label}
              </span>
              <span className="num mt-0.5 block text-[10.5px] text-[var(--text-3)]">
                {l.note}
              </span>
            </span>
            <span className="num shrink-0 text-[12.5px] font-medium text-[var(--green-700)]">
              {l.save}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Ledger() {
  const rows = [
    { k: "Invoiced by providers", v: "$6,120" },
    { k: "Attributed by PlanckSpace", v: "$5,780" },
  ];
  return (
    <div>
      <Cap>October, reconciled</Cap>
      <dl className="mt-4 space-y-2.5">
        {rows.map((r) => (
          <div key={r.k} className="flex items-baseline justify-between gap-3">
            <dt className="text-[12.5px] text-[var(--text-2)]">{r.k}</dt>
            <dd className="num text-[13px] font-medium text-[var(--ink)]">{r.v}</dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-3 border-t border-[var(--border)] pt-3">
          <dt className="text-[12.5px] font-medium text-[var(--ink)]">Unattributed</dt>
          <dd className="num text-[15px] font-medium text-[var(--brand-700)]">$340</dd>
        </div>
      </dl>
      <p className="mt-3 text-[11px] leading-relaxed text-[var(--text-3)]">
        One engineer is running without the agent installed. Invite them and the
        gap closes.
      </p>
    </div>
  );
}

function Budget() {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <Cap>October budget</Cap>
        <span className="num text-[11px] font-medium text-[var(--green-700)]">on pace</span>
      </div>
      <div className="num mt-2 flex items-baseline gap-1.5">
        <span className="text-[20px] font-medium tracking-[-0.04em] text-[var(--ink)]">
          $5,120
        </span>
        <span className="text-[11px] text-[var(--text-3)]">of $8,000</span>
      </div>
      {/* One bar, and it earns it: progress against a real ceiling, with the
          tick marking where the month's pace says you should be on day 19. */}
      <div className="relative mt-3.5 h-1.5 overflow-hidden rounded-full bg-[var(--inset)]">
        <div className="h-full w-[64%] rounded-full bg-[var(--brand-600)]" />
        <div className="absolute inset-y-0 left-[72%] w-px bg-[var(--ink)]" />
      </div>
      <p className="num mt-2.5 text-[10.5px] text-[var(--text-3)]">
        projected close $7,430
      </p>
      <div className="mt-5 border-t border-[var(--border)] pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[12.5px] font-medium text-[var(--ink)]">
            Session outlier
          </span>
          <span className="num text-[10px] uppercase tracking-[0.08em] text-[var(--coral-700)]">
            critical
          </span>
        </div>
        <p className="num mt-1 text-[10.5px] text-[var(--text-3)]">
          $190 against a $16 median, posted to #eng-spend
        </p>
      </div>
    </div>
  );
}

/* ── act 3: the editor loop ─────────────────────────────────────────────── */

function EditorLoop() {
  const receipts = [
    { label: "Context split, api-service", value: "$28/mo", date: "verified Jun 02" },
    { label: "Model routing, workspace", value: "$19/mo", date: "verified Jun 21" },
  ];
  return (
    <div className="flex flex-col">
      <div className="border-b border-[var(--border)] p-6 sm:p-10">
        <div className="flex items-baseline justify-between gap-3">
          <Cap>Insight in your editor</Cap>
          <span className="num text-[10.5px] text-[var(--text-3)]">high confidence</span>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <span className="text-[15px] font-medium leading-snug tracking-[-0.01em] text-[var(--ink)]">
            CLAUDE.md is re-read 212× per session in api-service
          </span>
          <span className="num shrink-0 text-[15px] font-medium text-[var(--green-700)]">
            $34/mo
          </span>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-[var(--brand-600)] px-3.5 py-2 text-[11.5px] font-medium text-white">
            Fix now
          </span>
          <span className="rounded-md border border-[var(--border-strong)] px-3.5 py-2 text-[11.5px] font-medium text-[var(--text-2)]">
            Fix with Claude Code
          </span>
          <span className="num text-[10.5px] text-[var(--text-3)]">
            backed up, one click to undo
          </span>
        </div>
      </div>

      <div className="flex-1 p-6 sm:p-10">
        <Cap>Booked from telemetry</Cap>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="num text-[28px] font-medium tracking-[-0.04em] text-[var(--green-700)]">
            $212
          </span>
          <span className="text-[12px] text-[var(--text-2)]">saved since May 12</span>
        </div>
        <ul className="mt-5 divide-y divide-[var(--border)] border-t border-[var(--border)]">
          {receipts.map((r) => (
            <li
              key={r.label}
              className="flex items-baseline justify-between gap-3 py-3"
            >
              <span className="min-w-0 truncate text-[12.5px] text-[var(--ink)]">
                {r.label}
              </span>
              <span className="num shrink-0 text-[11px] text-[var(--text-3)]">
                <span className="font-medium text-[var(--ink)]">{r.value}</span>{" "}
                {r.date}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── the quiet strip ────────────────────────────────────────────────────── */

const ALSO = [
  {
    title: "Per-team attribution",
    body: "Spend rolls up by team, repo, and developer, with the unattributed remainder always visible.",
  },
  {
    title: "Session-level receipts",
    body: "Every dollar traces back to one session: model, token mix, cache efficiency, and repo.",
  },
  {
    title: "Finance-ready exports",
    body: "Chargeback and showback CSVs cut by team or cost centre, sized for the monthly close.",
  },
];

/* ── section ────────────────────────────────────────────────────────────── */

export default function Features() {
  return (
    <section
      id="product"
      className="section-y scroll-mt-24 border-t border-[var(--border)] bg-[var(--panel)]"
    >
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-6" data-center="true">
            The product
          </p>
          <h2 className="display-2">
            Turn AI coding into clear engineering decisions.
          </h2>
          <p className="lead mt-5">
            Every session your team runs becomes attributed, explainable spend,
            tied to the work that actually shipped. In the dashboard, in the CLI,
            and in your editor.
          </p>
        </Reveal>

        <div className="mt-12 space-y-4 sm:mt-20">
          {/* act 1 */}
          <Reveal>
            <Slab>
              <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                <Lede
                  title="One number the whole company agrees on."
                  body="Live workspace spend across every tool, model, and developer, with cost per shipped session sitting next to it. Engineering, management, and finance read the same figure at the same time."
                  facts={[
                    "updates as sessions close",
                    "split by team, repo, or developer",
                    "reconciled against the provider invoice",
                  ]}
                />
                <Dashboard />
              </div>
            </Slab>
          </Reveal>

          {/* act 2 */}
          <Reveal delay={0.05}>
            <Slab>
              {/* Straight from one column to three. A two-column tablet step
                  would leave a fourth grid area empty, and with gap-px over the
                  border colour an empty area renders as a grey block. */}
              <div className="grid gap-px bg-[var(--border)] lg:grid-cols-3">
                <Cell
                  title="Waste, itemized in dollars"
                  body="Idle seats, cache misses, and oversized models on trivial work arrive as line items you can act on, each priced."
                >
                  <LeakList />
                </Cell>
                <Cell
                  title="The invoice, reconciled"
                  body="Attributed usage is matched against what your providers actually billed, and the difference is explained rather than rounded away."
                >
                  <Ledger />
                </Cell>
                <Cell
                  title="Alerts before the invoice"
                  body="Budgets track pace through the month and anomalies fire the day they happen, so nothing arrives as a surprise in accounting."
                >
                  <Budget />
                </Cell>
              </div>
            </Slab>
          </Reveal>

          {/* act 3, mirrored so the page does not read the same row twice */}
          <Reveal delay={0.05}>
            <Slab>
              <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                <div className="order-2 border-t border-[var(--border)] lg:order-1 lg:border-r lg:border-t-0">
                  <EditorLoop />
                </div>
                <div className="order-1 lg:order-2">
                  <Lede
                    title="Fix it in the editor. Book the saving only when it's real."
                    body="The extension for VS Code, Cursor, and Windsurf applies mechanical fixes in place and hands the judgement calls to your own Claude Code with the measured data attached. Then it watches your telemetry and books what actually landed."
                    facts={[
                      "every fix backed up and reversible",
                      "re-measured across the sessions that follow",
                      "unconfirmed savings are never counted",
                    ]}
                  />
                </div>
              </div>
            </Slab>
          </Reveal>

          {/* the rest, stated plainly */}
          <Reveal delay={0.05}>
            <Slab>
              <div className="grid gap-px bg-[var(--border)] sm:grid-cols-3">
                {ALSO.map((a) => (
                  <div key={a.title} className="bg-white p-6 sm:p-8">
                    <h3 className="text-[15px] font-semibold tracking-[-0.015em] text-[var(--ink)]">
                      {a.title}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-2)]">
                      {a.body}
                    </p>
                  </div>
                ))}
              </div>
            </Slab>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
