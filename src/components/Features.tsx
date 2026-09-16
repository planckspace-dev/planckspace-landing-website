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

   Figures here are one team's slice ($1,134 window spend) and feed the
   detector math in Capabilities.tsx, so change them together. The hero
   console shows the whole workspace and is deliberately a larger number.
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

/** Uppercase mono micro-label used as in-product chrome. See .cap. */
function Cap({ children }: { children: React.ReactNode }) {
  return <span className="cap">{children}</span>;
}

/** Stagger step for a card's own regions, in seconds. */
const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

/**
 * The header over one act.
 *
 * The three slabs below were always a sequence — measure, then find, then
 * verify, which is the same promise the footer makes in one line — but nothing
 * on the page ever said so. Read cold they were three mocks stacked in a
 * column, and a reader who did not already know the product had no reason to
 * believe the third followed from the first.
 *
 * Naming and numbering them is the whole fix. It costs one row of chrome per
 * act and turns a stack into an argument you can feel moving.
 */
function Act({ n, name, line }: { n: string; name: string; line: string }) {
  return (
    <Reveal className="mt-14 mb-5 first:mt-0 sm:mt-20 sm:mb-6">
      <div className="flex items-center gap-3">
        <span className="num text-[12px] font-medium text-[var(--brand-700)]">{n}</span>
        <span className="cap">{name}</span>
        {/* The rule runs to the edge of the slab below it, which is what ties
            the label to the thing it labels rather than leaving it floating. */}
        <span className="h-px flex-1 bg-[var(--border-strong)]" />
      </div>
      <p
        className="iv-fade mt-3.5 max-w-xl text-[15.5px] leading-[1.55] tracking-[-0.011em] text-[var(--text-2)]"
        style={d(0.08)}
      >
        {line}
      </p>
    </Reveal>
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
      <h3
        className="iv-fade max-w-sm text-[23px] leading-[1.13] font-[580] tracking-[-0.026em] text-[var(--ink)] sm:text-[28px]"
        style={d(0.04)}
      >
        {title}
      </h3>
      <p
        className="iv-fade mt-4 max-w-md text-[15px] leading-[1.62] text-[var(--text-2)]"
        style={d(0.1)}
      >
        {body}
      </p>
      <ul className="mt-7 space-y-2.5 border-t border-[var(--border)] pt-5 sm:mt-8 sm:pt-6">
        {facts.map((f, i) => (
          <li
            key={f}
            className="num iv-fade iv-step text-[12.5px] leading-relaxed text-[var(--text-3)]"
            style={{ "--i": i + 3 } as React.CSSProperties}
          >
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
      <h3 className="iv-fade text-[18px] leading-snug font-[580] tracking-[-0.018em] text-[var(--ink)]">
        {title}
      </h3>
      <p
        className="iv-fade mt-2.5 text-[14px] leading-[1.6] text-[var(--text-2)]"
        style={d(0.06)}
      >
        {body}
      </p>
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
      <div className="mt-2 flex flex-col items-start gap-x-2 sm:flex-row sm:items-baseline">
        <span className="num text-[19px] font-medium tracking-[-0.045em] text-[var(--ink)] sm:text-[26px]">
          {value}
        </span>
        <span className="num text-[11.5px] font-medium" style={{ color }}>
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
        <div className="iv-fade flex items-start justify-between gap-4" style={d(0.18)}>
          <div>
            <Cap>Spend over time</Cap>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="num text-[25px] font-medium tracking-[-0.045em] text-[var(--ink)]">
                $1,132
              </span>
              <span className="num text-[11.5px] font-medium text-[var(--green-700)]">
                ↑ 120%
              </span>
            </div>
          </div>
          {/* A real segmented control rather than three loose chips: the
              inactive two now sit in a shared inset track, which is what says
              "these are the other two positions of one switch". */}
          <div className="flex shrink-0 gap-0.5 rounded-lg bg-[var(--inset)] p-0.5">
            {["Total", "By team", "By repo"].map((t, i) => (
              <span
                key={t}
                className={
                  i === 0
                    ? "rounded-[6px] bg-[var(--ink)] px-2 py-1 text-[11px] font-medium text-white shadow-[0_1px_2px_rgba(14,16,23,0.18)] sm:px-2.5"
                    : "rounded-[6px] px-2 py-1 text-[11px] font-medium text-[var(--text-3)] sm:px-2.5"
                }
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* vector-effect is the fix for the whole section looking slightly
            out of focus. This viewBox is 520 units wide and renders at ~700,
            so every "1px" stroke was being drawn at 1.35 device pixels and
            landing across two of them — a grey smear instead of a hairline.
            non-scaling-stroke pins the stroke width to the device, not to the
            viewBox, so a hairline stays a hairline at any column width. */}
        <div className="mt-6">
        <svg
          viewBox={`0 0 ${CHART.W} ${CHART.H}`}
          className="block h-auto w-full overflow-visible"
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
              strokeDasharray="2 6"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path d={CHART.area} fill="url(#spendFill)" className="iv-fade" style={{ "--d": "0.6s" } as React.CSSProperties} />
          <path
            className="iv-draw"
            pathLength={1}
            d={CHART.line}
            fill="none"
            stroke="var(--brand-600)"
            strokeWidth="2.25"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <g className="iv-fade" style={{ "--d": "1.2s" } as React.CSSProperties}>
          <line
            x1={CHART.peak[0]}
            x2={CHART.peak[0]}
            y1={CHART.peak[1]}
            y2={CHART.H}
            stroke="var(--coral-500)"
            strokeWidth="1"
            strokeDasharray="2 3"
            opacity="0.5"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx={CHART.peak[0]} cy={CHART.peak[1]} r="3.5" fill="var(--coral-500)" />
          <circle
            cx={CHART.peak[0]}
            cy={CHART.peak[1]}
            r="7"
            fill="var(--coral-500)"
            opacity="0.16"
          />
          </g>
        </svg>
        </div>

        <div className="num iv-fade mt-3 flex justify-between text-[11px] text-[var(--text-3)]" style={d(0.9)}>
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
  { label: "Context re-reads, api-service", note: "3,592× cache to input", save: "$204", bar: "100%", hot: true, d: "0.2s" },
  { label: "Marathon sessions that never shipped", note: "3 sessions, 152 turns each", save: "$195", bar: "96%", hot: false, d: "0.3s" },
  { label: "Opus on trivial edits", note: "route to Haiku", save: "$104", bar: "51%", hot: false, d: "0.4s" },
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
        {LEAKS.map((l, i) => (
          <li
            key={l.label}
            className="iv-fade iv-step flex items-start justify-between gap-3 py-3 first:pt-0"
            style={{ "--i": i + 2 } as React.CSSProperties}
          >
            <span className="min-w-0">
              <span className="block text-[13px] leading-snug font-medium text-[var(--ink)]">
                {l.label}
              </span>
              <span className="num mt-0.5 block text-[11.5px] text-[var(--text-3)]">
                {l.note}
              </span>
            </span>
            <span className="flex shrink-0 flex-col items-end gap-1.5">
              <span className="num text-[13px] font-medium text-[var(--green-700)]">
                {l.save}
              </span>
              <span className="block h-[3px] w-14 overflow-hidden rounded-full bg-[var(--inset)]">
                <span
                  className="iv-grow-x block h-full rounded-full"
                  style={{ width: l.bar, background: l.hot ? "var(--brand-600)" : "var(--border-strong)", "--d": l.d } as React.CSSProperties}
                />
              </span>
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
        {rows.map((r, i) => (
          <div
            key={r.k}
            className="iv-fade iv-step flex items-baseline justify-between gap-3"
            style={{ "--i": i + 2 } as React.CSSProperties}
          >
            <dt className="text-[13px] text-[var(--text-2)]">{r.k}</dt>
            <dd className="num text-[13.5px] font-medium text-[var(--ink)]">{r.v}</dd>
          </div>
        ))}
        <div
          className="iv-fade iv-step flex items-baseline justify-between gap-3 border-t border-[var(--border)] pt-3"
          style={{ "--i": 4 } as React.CSSProperties}
        >
          <dt className="text-[13px] font-medium text-[var(--ink)]">Unattributed</dt>
          <dd className="num text-[16px] font-medium text-[var(--brand-700)]">$340</dd>
        </div>
      </dl>
      <div className="mt-3 flex h-[6px] gap-[2px] overflow-hidden rounded-full" aria-hidden>
        <span className="iv-grow-x block h-full rounded-l-full bg-[var(--ink)]" style={{ width: "94.4%" }} />
        <span
          className="iv-grow-x block h-full rounded-r-full bg-[var(--brand-500)]"
          style={{ width: "5.6%", "--d": "0.7s" } as React.CSSProperties}
        />
      </div>
      <p className="mt-3 text-[12px] leading-relaxed text-[var(--text-3)]">
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
        <span className="text-[21px] font-medium tracking-[-0.045em] text-[var(--ink)]">
          $5,120
        </span>
        <span className="text-[11.5px] text-[var(--text-3)]">of $8,000</span>
      </div>
      {/* One bar, and it earns it: progress against a real ceiling, with the
          tick marking where the month's pace says you should be on day 19. */}
      <div className="relative mt-3.5 h-1.5 overflow-hidden rounded-full bg-[var(--inset)]">
        <div className="iv-grow-x h-full w-[64%] rounded-full bg-[var(--brand-600)]" style={{ "--d": "0.2s" } as React.CSSProperties} />
        <div className="absolute inset-y-0 left-[72%] w-px bg-[var(--ink)]" />
      </div>
      <p className="num mt-2.5 text-[11.5px] text-[var(--text-3)]">
        projected close $7,430
      </p>
      <div className="mt-5 border-t border-[var(--border)] pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[13px] font-medium text-[var(--ink)]">
            Session outlier
          </span>
          <span className="cap cap-hot">critical</span>
        </div>
        <p className="num mt-1.5 text-[11.5px] text-[var(--text-3)]">
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
        <div className="iv-fade flex items-baseline justify-between gap-3" style={d(0.04)}>
          <Cap>Insight in your editor</Cap>
          <span className="num text-[11.5px] text-[var(--text-3)]">high confidence</span>
        </div>
        <div
          className="iv-fade mt-4 flex items-baseline justify-between gap-4"
          style={d(0.1)}
        >
          <span className="text-[15.5px] leading-snug font-medium tracking-[-0.012em] text-[var(--ink)]">
            CLAUDE.md is re-read 212× per session in api-service
          </span>
          <span className="num shrink-0 text-[15.5px] font-medium text-[var(--green-700)]">
            $34/mo
          </span>
        </div>
        {/* These are a drawing of the extension's own buttons, so they get the
            extension's own weight: a real contact shadow under the primary and
            a true hairline on the secondary. Flat rectangles read as wireframe,
            and this row is meant to read as a screenshot. */}
        <div className="iv-fade mt-5 flex flex-wrap items-center gap-2" style={d(0.16)}>
          <span className="rounded-lg bg-[var(--brand-600)] px-3.5 py-2 text-[12px] font-medium text-white shadow-[0_1px_2px_rgba(29,83,207,0.35)]">
            Fix now
          </span>
          <span className="rounded-lg border border-[var(--border-strong)] bg-white px-3.5 py-2 text-[12px] font-medium text-[var(--text-2)] shadow-[0_1px_1px_rgba(14,16,23,0.04)]">
            Fix with Claude Code
          </span>
          <span className="num text-[11.5px] text-[var(--text-3)]">
            backed up, one click to undo
          </span>
        </div>
      </div>

      <div className="flex-1 p-6 sm:p-10">
        <div className="iv-fade" style={d(0.24)}>
          <Cap>Booked from telemetry</Cap>
        </div>
        <div className="iv-fade mt-2 flex items-baseline gap-2" style={d(0.28)}>
          <span className="num text-[30px] font-medium tracking-[-0.045em] text-[var(--green-700)]">
            $212
          </span>
          <span className="text-[12.5px] text-[var(--text-2)]">saved since May 12</span>
        </div>
        <ul className="mt-5 divide-y divide-[var(--border)] border-t border-[var(--border)]">
          {receipts.map((r, i) => (
            <li
              key={r.label}
              className="iv-fade iv-step flex items-baseline justify-between gap-3 py-3"
              style={{ "--i": i + 6 } as React.CSSProperties}
            >
              <span className="min-w-0 truncate text-[13px] text-[var(--ink)]">
                {r.label}
              </span>
              <span className="num shrink-0 text-[11.5px] text-[var(--text-3)]">
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

/* One glyph each, drawn on a 72×44 grid at 1:1 — the SVG is rendered at
   exactly its viewBox size, so nothing is ever resampled and a 1px rule stays
   a 1px rule. Ink plus the one accent, no third colour.

   The old set was drawn at 64×40 and read as three grey smudges at a glance:
   abstract enough that you had to look at the heading to learn what they were,
   which is the one job an icon has. These say their nouns — a ranked rollup,
   a torn receipt, a sheet being exported — before the heading does. */

function TeamsGlyph() {
  const rows = [
    { y: 2, bar: 40, rest: 12, o: 1 },
    { y: 17, bar: 28, o: 0.55 },
    { y: 32, bar: 15, o: 0.28 },
  ];
  return (
    <svg viewBox="0 0 72 44" className="h-11 w-[72px]" aria-hidden>
      {rows.map((r, i) => (
        <g key={r.y}>
          <rect x="0" y={r.y} width="10" height="10" rx="3" fill="var(--ink)" opacity={r.o} />
          <rect
            className="iv-grow-x"
            style={{ "--d": `${0.1 + i * 0.09}s` } as React.CSSProperties}
            x="15"
            y={r.y}
            width={r.bar}
            height="10"
            rx="3"
            fill="var(--brand-600)"
            opacity={r.o}
          />
          {/* the unattributed remainder the copy promises is always visible */}
          {r.rest ? (
            <rect
              className="iv-grow-x"
              style={{ "--d": "0.4s" } as React.CSSProperties}
              x={15 + r.bar + 2}
              y={r.y}
              width={r.rest}
              height="10"
              rx="3"
              fill="none"
              stroke="var(--border-strong)"
              strokeDasharray="2 2"
            />
          ) : null}
        </g>
      ))}
    </svg>
  );
}

function ReceiptGlyph() {
  return (
    <svg viewBox="0 0 72 44" className="h-11 w-[72px]" aria-hidden>
      <path
        d="M16 1h40v40l-5-3.2-5 3.2-5-3.2-5 3.2-5-3.2-5 3.2-5-3.2-5 3.2z"
        fill="white"
        stroke="var(--border-strong)"
      />
      <rect className="iv-grow-x" style={{ "--d": "0.1s" } as React.CSSProperties} x="22" y="8" width="20" height="3.5" rx="1.75" fill="var(--ink)" />
      <rect className="iv-grow-x" style={{ "--d": "0.18s" } as React.CSSProperties} x="22" y="16" width="28" height="2.5" rx="1.25" fill="var(--border-strong)" />
      <rect className="iv-grow-x" style={{ "--d": "0.26s" } as React.CSSProperties} x="22" y="22" width="22" height="2.5" rx="1.25" fill="var(--border-strong)" />
      <rect className="iv-grow-x" style={{ "--d": "0.34s" } as React.CSSProperties} x="36" y="29" width="14" height="3.5" rx="1.75" fill="var(--brand-600)" />
    </svg>
  );
}

function ExportGlyph() {
  return (
    <svg viewBox="0 0 72 44" className="h-11 w-[72px]" aria-hidden>
      <rect x="1" y="2" width="50" height="40" rx="5" fill="white" stroke="var(--border-strong)" />
      <path d="M1 14h50M1 25h50M1 36h50M18 2v40" stroke="var(--border)" />
      <rect x="1" y="2" width="50" height="12" rx="5" fill="var(--inset)" />
      <path d="M1 14h50M18 2v40" stroke="var(--border)" />
      {[17, 28].map((y, i) => (
        <rect
          key={y}
          className="iv-grow-x"
          style={{ "--d": `${0.15 + i * 0.09}s` } as React.CSSProperties}
          x="23"
          y={y}
          width={22 - i * 7}
          height="3"
          rx="1.5"
          fill="var(--text-3)"
        />
      ))}
      <circle className="iv-pop" style={{ "--d": "0.5s" } as React.CSSProperties} cx="59" cy="33" r="10" fill="var(--ink)" />
      <path
        className="iv-fade"
        style={{ "--d": "0.6s" } as React.CSSProperties}
        d="M59 28.5v8m-3.4-3.2 3.4 3.4 3.4-3.4"
        stroke="white"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ALSO = [
  {
    Glyph: TeamsGlyph,
    title: "Per-team attribution",
    body: "Spend rolls up by team, repo, and developer, with the unattributed remainder always visible.",
  },
  {
    Glyph: ReceiptGlyph,
    title: "Session-level receipts",
    body: "Every dollar traces back to one session: model, token mix, cache efficiency, and repo.",
  },
  {
    Glyph: ExportGlyph,
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
          {/* The eyebrow now carries the three surfaces. They used to be the
              last clause of the lead ("in the dashboard, in the CLI, and in
              your editor"), where they read as a feature list tacked onto an
              argument. As chrome they are simply a fact about where this runs,
              and the lead gets to stay an argument. */}
          <p className="eyebrow mb-6" data-center="true">
            Dashboard · CLI · Editor
          </p>
          <h2 className="display-2">
            Measure the spend. Cut the waste. Prove the saving.
          </h2>
          <p className="lead mt-5">
            Every session your team runs becomes attributed spend, tied to the
            work that actually shipped. The waste inside it arrives itemised in
            dollars, and a saving is only ever counted once your own telemetry
            confirms it.
          </p>
        </Reveal>

        <div className="mt-12 sm:mt-20">
          {/* act 1 */}
          <Act
            n="01"
            name="Measure"
            line="Every session your team closes, attributed and priced as it happens."
          />
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
          <Act
            n="02"
            name="Find"
            line="The waste inside that spend, itemised in dollars and traced back to the invoice it hides in."
          />
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
          <Act
            n="03"
            name="Verify"
            line="The fix applied where you work, then the saving confirmed from the sessions that follow."
          />
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

          {/* The rest, stated plainly. No act label: this is the shelf under
              the argument, not a fourth beat of it, and numbering it would
              promise a step that is not there. */}
          <Reveal delay={0.05} className="mt-4">
            <Slab>
              <div className="grid gap-px bg-[var(--border)] sm:grid-cols-3">
                {ALSO.map((a, i) => (
                  <div
                    key={a.title}
                    className="iv-fade iv-step bg-white p-6 transition-colors duration-500 [transition-timing-function:var(--ease-swift)] hover:bg-[var(--panel)] sm:p-8"
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    <a.Glyph />
                    <h3 className="mt-5 text-[16px] font-[580] tracking-[-0.016em] text-[var(--ink)]">
                      {a.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.6] text-[var(--text-2)]">
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
