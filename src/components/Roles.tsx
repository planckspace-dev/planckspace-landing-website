import { Reveal } from "@/components/ui/reveal";
import { InView } from "@/components/ui/in-view";

/* Three readers of the same numbers. Each column opens with the one view that
   reader actually lives in, drawn natively: the ROI trend leadership takes to
   a board, the team-budget pace a manager checks on a Tuesday, and the
   personal sidebar a developer sees in the editor. Same tokens as the product
   section, so these read as product, not illustration. */

const dl = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

function LeadershipView() {
  const pts = [8.2, 7.6, 6.9, 6.1, 5.3, 4.12];
  const W = 240;
  const H = 64;
  const max = 9;
  const min = 3.5;
  const xy = pts.map((v, i) => [(i / (pts.length - 1)) * W, 6 + (1 - (v - min) / (max - min)) * (H - 12)]);
  const line = xy.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--text-3)]">
          Cost per shipped session
        </span>
        <span className="num text-[10.5px] font-medium text-[var(--green-700)]">−50% in 6 mo</span>
      </div>
      <div className="num mt-1.5 text-[26px] font-medium tracking-[-0.04em] text-[var(--ink)]">$4.12</div>
      <svg viewBox={`0 0 ${W} ${H + 14}`} className="mt-2 block h-auto w-full overflow-visible" aria-hidden>
        <g className="iv-fade" style={dl(0.5)}>
          <path d={`${line} L${W},${H} L0,${H} Z`} fill="var(--brand-500)" opacity="0.08" />
        </g>
        <path className="iv-draw" style={dl(0.1)} pathLength={1} d={line} fill="none" stroke="var(--brand-600)" strokeWidth="1.75" strokeLinejoin="round" />
        {xy.map((p, i) => (
          <circle
            key={i}
            className="iv-pop"
            style={dl(0.25 + i * 0.12)}
            cx={p[0]}
            cy={p[1]}
            r={i === xy.length - 1 ? 3.5 : 2.25}
            fill={i === xy.length - 1 ? "var(--brand-600)" : "white"}
            stroke="var(--brand-600)"
            strokeWidth="1.25"
          />
        ))}
        {["Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((m, i) => (
          <text
            key={m}
            x={(i / 5) * W}
            y={H + 13}
            fontSize="9"
            className="num"
            fill="var(--text-3)"
            textAnchor={i === 0 ? "start" : i === 5 ? "end" : "middle"}
          >
            {m}
          </text>
        ))}
      </svg>
    </div>
  );
}

function ManagerView() {
  const teams = [
    { k: "platform", used: 72, pace: 63, v: "$5.8k" },
    { k: "api", used: 91, pace: 63, v: "$4.6k", hot: true },
    { k: "web", used: 48, pace: 63, v: "$2.4k" },
    { k: "data", used: 36, pace: 63, v: "$1.1k" },
  ];
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--text-3)]">
          Budget pace, day 19
        </span>
        <span className="num flex items-center gap-1.5 text-[10.5px] text-[var(--text-3)]">
          <span className="inline-block h-2.5 w-px bg-[var(--ink)]" /> expected
        </span>
      </div>
      <ul className="mt-4 space-y-3">
        {teams.map((t, i) => (
          <li key={t.k}>
            <div className="flex items-baseline justify-between text-[11.5px]">
              <span className="text-[var(--ink)]">{t.k}</span>
              <span className="num" style={{ color: t.hot ? "var(--coral-700)" : "var(--text-2)" }}>
                {t.v} · {t.used}%
              </span>
            </div>
            <div className="relative mt-1.5 h-[6px] rounded-full bg-[var(--inset)]">
              <div
                className="iv-grow-x h-full rounded-full"
                style={{
                  width: `${t.used}%`,
                  background: t.hot ? "var(--coral-500)" : "var(--brand-600)",
                  ...dl(0.1 + i * 0.1),
                }}
              />
              <div className="absolute -inset-y-[3px] w-px bg-[var(--ink)]" style={{ left: `${t.pace}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DeveloperView() {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--panel)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-white px-3 py-2">
        <span className="num text-[9.5px] uppercase tracking-[0.12em] text-[var(--text-3)]">PlanckSpace</span>
        <span className="num text-[9.5px] text-[var(--text-3)]">this week</span>
      </div>
      <div className="px-3 py-3">
        <div className="flex items-baseline justify-between">
          <span className="num text-[20px] font-medium tracking-[-0.04em] text-[var(--ink)]">$38.20</span>
          <span className="num text-[10px] text-[var(--green-700)]">↓ $6.10</span>
        </div>
        <div className="mt-3 flex items-baseline justify-between text-[10.5px]">
          <span className="text-[var(--text-2)]">cache efficiency</span>
          <span className="num text-[var(--ink)]">71%</span>
        </div>
        <div className="mt-1 h-[5px] rounded-full bg-[var(--inset)]">
          <div className="iv-grow-x h-full w-[71%] rounded-full bg-[var(--green-500)]" style={dl(0.2)} />
        </div>
        <div className="iv-fade mt-3 flex items-center justify-between gap-2 rounded-md border border-[var(--border)] bg-white px-2.5 py-2" style={dl(0.6)}>
          <span className="min-w-0">
            <span className="block truncate text-[11px] text-[var(--ink)]">Split CLAUDE.md</span>
            <span className="num block text-[9.5px] text-[var(--text-3)]">api-service · $34/mo</span>
          </span>
          <span className="shrink-0 rounded bg-[var(--brand-600)] px-2 py-1 text-[10px] font-medium text-white">Fix</span>
        </div>
      </div>
    </div>
  );
}

const ROLES = [
  {
    eyebrow: "For leadership",
    title: "Defend the AI budget with numbers.",
    View: LeadershipView,
    points: [
      "One figure for total AI spend, reconciled against provider invoices",
      "Cost per shipped session: the ROI number, by team",
      "Savings verified from telemetry, not a vendor's estimate",
      "Board-ready exports without asking engineering",
    ],
  },
  {
    eyebrow: "For managers",
    title: "Know where the budget actually goes.",
    View: ManagerView,
    points: [
      "Per-team and per-repo attribution, updated live",
      "Budgets with pace alerts before the overrun, not after",
      "Waste surfaced as line items with a dollar value",
      "A ranked queue of fixes, highest recovery first",
    ],
  },
  {
    eyebrow: "For developers",
    title: "Your usage, not your keystrokes.",
    View: DeveloperView,
    points: [
      "Personal cost and cache-efficiency insights in the editor",
      "One-click fixes, backed up and undoable",
      "Metadata only, verifiable with planck inspect",
      "No screenshots, no timers, no surveillance",
    ],
  },
];

export default function Roles() {
  return (
    <section className="section-y border-t border-[var(--border)]">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <h2 className="display-2">
            The same numbers, three very different questions answered.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:mt-14 lg:grid-cols-3">
          {ROLES.map((r, i) => (
            <Reveal key={r.eyebrow} delay={i * 0.08} className="h-full">
              <InView className="flex h-full flex-col bg-white">
                {/* the view this reader lives in */}
                <div className="border-b border-[var(--border)] bg-[linear-gradient(180deg,var(--panel),#fff)] p-7 sm:px-10 sm:pb-8 sm:pt-9">
                  {/* shared height so the three titles below start on one line */}
                  <div className="flex min-h-[10.5rem] flex-col justify-center lg:min-h-[13.25rem]">
                    <r.View />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-7 sm:p-10">
                  <p className="num mb-4 text-[11px] uppercase tracking-[0.16em] text-[var(--brand-700)] sm:mb-5">
                    {r.eyebrow}
                  </p>
                  <h3 className="text-[20px] font-semibold leading-snug tracking-[-0.02em] text-[var(--ink)]">
                    {r.title}
                  </h3>
                  <ul className="mt-6 space-y-3.5">
                    {r.points.map((p) => (
                      <li key={p} className="flex gap-3 text-[14px] leading-relaxed text-[var(--text-2)]">
                        <span aria-hidden className="num shrink-0 text-[14px] leading-relaxed text-[var(--text-3)]">
                          +
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </InView>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
