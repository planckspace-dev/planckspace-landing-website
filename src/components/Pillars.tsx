import { Lock } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { InView } from "@/components/ui/in-view";

/* ─────────────────────────────────────────────────────────────────────────
   The spine of the whole page: Measure → Optimize → Connect → Verify.

   Every section after this one is an expansion of one of these four moves,
   so the labels here are load-bearing. Features expands Measure, the
   detection engine expands Optimize and Verify, Roles expands Connect.
   Change a name here and change it in those sections too.

   Each move carries a small diagram of the move itself, drawn once as the
   row arrives: an invoice splitting into owners, a queue ranking itself, a
   branch merging with its cost attached, a metric dropping after a fix.
   They share one grid, one stroke weight and one accent so the four read as
   a sequence, not four illustrations.
   ───────────────────────────────────────────────────────────────────────── */

const W = 260;
const H = 132;

const d = (s: number): React.CSSProperties => ({ "--d": `${s}s` }) as React.CSSProperties;

function MeasureGlyph() {
  const teams = [
    { k: "platform", v: "$4.3k", w: 118 },
    { k: "api", v: "$2.9k", w: 80 },
    { k: "web", v: "$1.1k", w: 30 },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden>
      {/* the invoice, one opaque bar */}
      <text x="20" y="16" fontSize="9.5" className="num" fill="var(--text-3)">
        invoice
      </text>
      <text x="240" y="16" fontSize="9.5" textAnchor="end" className="num" fill="var(--text-2)">
        $8,240
      </text>
      <rect className="iv-grow-x" style={d(0)} x="20" y="23" width="220" height="10" rx="3" fill="var(--border-strong)" />

      {/* the same dollars, split to their owners */}
      <path
        className="iv-draw"
        style={d(0.3)}
        pathLength={1}
        d="M26,33 V109"
        fill="none"
        stroke="var(--border-strong)"
      />
      {teams.map((t, i) => {
        const y = 52 + i * 26;
        return (
          <g key={t.k}>
            <path className="iv-draw" style={d(0.45 + i * 0.1)} pathLength={1} d={`M26,${y + 5} H34`} stroke="var(--border-strong)" />
            <rect
              className="iv-grow-x"
              style={d(0.55 + i * 0.1)}
              x="38"
              y={y}
              width={t.w}
              height="10"
              rx="3"
              fill="var(--brand-600)"
              opacity={1 - i * 0.28}
            />
            <text
              className="num iv-fade"
              style={d(0.85 + i * 0.1)}
              x={38 + t.w + 7}
              y={y + 8.5}
              fontSize="9.5"
              fill="var(--text-2)"
            >
              {t.k} {t.v}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function OptimizeGlyph() {
  const rows = [
    { k: "context re-reads", v: "$204", w: 1 },
    { k: "marathons", v: "$195", w: 0.93 },
    { k: "opus on edits", v: "$104", w: 0.5 },
    { k: "idle seats", v: "$90", w: 0.43 },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden>
      {rows.map((r, i) => {
        const y = 12 + i * 29;
        return (
          <g key={r.k}>
            <text className="num iv-fade" style={d(0.05 + i * 0.08)} x="20" y={y + 8} fontSize="9.5" fill={i === 0 ? "var(--ink)" : "var(--text-3)"}>
              {String(i + 1).padStart(2, "0")} {r.k}
            </text>
            <text className="num iv-fade" style={d(0.05 + i * 0.08)} x="240" y={y + 8} fontSize="9.5" textAnchor="end" fill={i === 0 ? "var(--green-700)" : "var(--text-2)"}>
              {r.v}
            </text>
            <rect x="20" y={y + 14} width="220" height="4" rx="2" fill="var(--inset)" />
            <rect
              className="iv-grow-x"
              style={d(0.25 + i * 0.1)}
              x="20"
              y={y + 14}
              width={220 * r.w}
              height="4"
              rx="2"
              fill={i === 0 ? "var(--brand-600)" : "var(--border-strong)"}
            />
          </g>
        );
      })}
    </svg>
  );
}

function ConnectGlyph() {
  const mainY = 96;
  const branchY = 44;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden>
      <text x="20" y="124" fontSize="9.5" className="num" fill="var(--text-3)">
        main
      </text>
      <line className="iv-draw" style={d(0)} pathLength={1} x1="20" x2="240" y1={mainY} y2={mainY} stroke="var(--border-strong)" strokeWidth="1.5" />
      {/* feature branch: three AI sessions, then a merge */}
      <path
        className="iv-draw"
        style={d(0.3)}
        pathLength={1}
        d={`M52,${mainY} C52,${branchY} 60,${branchY} 84,${branchY} L176,${branchY} C200,${branchY} 206,${branchY} 206,${mainY}`}
        fill="none"
        stroke="var(--brand-600)"
        strokeWidth="1.5"
      />
      {[52, 132].map((x, i) => (
        <circle key={x} className="iv-pop" style={d(0.1 + i * 0.15)} cx={x} cy={mainY} r="4" fill="white" stroke="var(--border-strong)" strokeWidth="1.5" />
      ))}
      {[
        { x: 96, v: "$1.66" },
        { x: 128, v: "$2.14" },
        { x: 160, v: "$0.32" },
      ].map((s, i) => (
        <g key={s.x}>
          <rect className="iv-pop" style={d(0.7 + i * 0.12)} x={s.x - 5} y={branchY - 5} width="10" height="10" rx="2.5" fill="var(--brand-600)" />
          <text className="num iv-fade" style={d(0.8 + i * 0.12)} x={s.x} y={branchY - 12} fontSize="9" textAnchor="middle" fill="var(--text-3)">
            {s.v}
          </text>
        </g>
      ))}
      {/* the merge, priced */}
      <circle className="iv-pop" style={d(1.2)} cx="206" cy={mainY} r="5.5" fill="var(--ink)" />
      <g className="iv-fade" style={d(1.35)}>
        <rect x="150" y={mainY + 11} width="90" height="18" rx="4" fill="var(--brand-50)" />
        <text x="195" y={mainY + 23.5} fontSize="9.5" textAnchor="middle" className="num" fill="var(--brand-900)">
          $4.12 shipped
        </text>
      </g>
    </svg>
  );
}

function VerifyGlyph() {
  const before = [38, 34, 40, 36, 39, 35];
  const after = [74, 88, 92, 95];
  const fixX = 118;
  const pts = [
    ...before.map((y, i) => [20 + i * 18, y]),
    ...after.map((y, i) => [fixX + 12 + i * 34, y]),
  ];
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden>
      <line x1="20" x2="240" y1="104" y2="104" stroke="var(--border)" />
      <line className="iv-fade" style={d(0.4)} x1={fixX} x2={fixX} y1="14" y2="104" stroke="var(--text-3)" strokeDasharray="2 3" />
      <text className="num iv-fade" style={d(0.45)} x={fixX + 5} y="20" fontSize="9" fill="var(--text-3)">
        fix applied
      </text>
      <path className="iv-draw" style={d(0.15)} pathLength={1} d={line} fill="none" stroke="var(--brand-600)" strokeWidth="1.75" strokeLinejoin="round" />
      {after.slice(1).map((y, i) => (
        <circle key={i} className="iv-pop" style={d(1 + i * 0.12)} cx={fixX + 12 + (i + 1) * 34} cy={y} r="3" fill="var(--brand-600)" />
      ))}
      <text className="num" x="20" y="120" fontSize="9" fill="var(--text-3)">
        3,592×
      </text>
      <g className="iv-fade" style={d(1.4)}>
        <rect x="170" y="112" width="70" height="18" rx="4" fill="var(--green-50)" />
        <text x="205" y="124.5" fontSize="9.5" textAnchor="middle" className="num" fill="var(--green-700)">
          ✓ −94%
        </text>
      </g>
    </svg>
  );
}

const PILLARS = [
  {
    n: "01",
    name: "Measure",
    body: "Every AI session, token, and dollar attributed to the developer, team, repository, and model that generated it.",
    out: "attribution, not invoices",
    Glyph: MeasureGlyph,
  },
  {
    n: "02",
    name: "Optimize",
    body: "Concrete actions, priced: reclaim idle seats, route the right model, shrink the context you re-send, end the sessions that never converge.",
    out: "a ranked queue, in dollars",
    Glyph: OptimizeGlyph,
  },
  {
    n: "03",
    name: "Connect to outcomes",
    body: "Usage tied to what actually shipped: repository activity, developer throughput, and the cost of every session that made it to main.",
    out: "cost per shipped session",
    Glyph: ConnectGlyph,
  },
  {
    n: "04",
    name: "Verify",
    body: "Every recommendation re-measured from your own telemetry after the fix, so savings are booked from data instead of claimed from a model.",
    out: "a ledger, not an estimate",
    Glyph: VerifyGlyph,
  },
];

export default function Pillars() {
  return (
    <section
      id="approach"
      className="section-y scroll-mt-24 border-t border-[var(--border)]"
    >
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="display-2">PlanckSpace makes AI coding measurable.</h2>
          <p className="lead mt-5">
            A lightweight local agent continuously attributes AI coding activity
            across developers, repositories, and teams, turning raw usage into
            engineering decisions you can defend in a budget meeting.
          </p>
        </Reveal>

        {/* Four moves, in order. The top rules read as one broken rail across
            the row on wide screens, which is the progression. */}
        <div className="mt-12 grid gap-9 sm:mt-16 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-6">
          {PILLARS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.07}>
              <InView className="flex h-full flex-col">
                <div
                  className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel)] px-2 py-3"
                >
                  <p.Glyph />
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <span className="num text-[13px] text-[var(--brand-700)]">{p.n}</span>
                  <span className="h-px flex-1 bg-[var(--border-strong)]" />
                </div>
                <h3 className="mt-4 text-[21px] font-semibold tracking-[-0.025em] text-[var(--ink)]">
                  {p.name}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--text-2)]">
                  {p.body}
                </p>
                <div className="flex-1" />
                <p className="num mt-6 border-t border-[var(--border)] pt-4 text-[11.5px] text-[var(--text-3)]">
                  {p.out}
                </p>
              </InView>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex justify-center sm:mt-14">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-[var(--brand-100)] bg-[var(--brand-50)] px-4 py-2 text-center text-[13px] font-medium text-[var(--brand-900)] sm:text-[13.5px]">
            <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            Never your code. Never your prompts.
          </span>
        </Reveal>
      </div>
    </section>
  );
}
