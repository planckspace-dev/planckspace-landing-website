import { PlanckMark } from "@/components/ui/logo";

/* ─────────────────────────────────────────────────────────────────────────
   Static, hand-built recreation of the real product overview screen,
   faithful to the dashboard's UI 2.0 design contract: soft-gray sidebar,
   white data area, ink stats, brand-600 area chart with a 10% gradient
   fill, horizontal dashed gridlines only, tabular-num metrics.
   No animation — the product is the show.
   ───────────────────────────────────────────────────────────────────────── */

const NAV = [
  { label: "Overview", active: true },
  { label: "Sessions" },
  { label: "Insights" },
  { label: "Wasted spend" },
  { label: "Reconciliation" },
  { label: "Reports" },
];

const STATS = [
  { label: "Total spend · 30d", value: "$4,820", delta: "+12%", tone: "ink" },
  { label: "Active developers", value: "11", delta: "+2", tone: "ink" },
  { label: "Sessions", value: "342", delta: "+18%", tone: "ink" },
  { label: "Cache hit rate", value: "61%", delta: "+9pt", tone: "green" },
];

const INSIGHTS = [
  {
    dot: "var(--coral-500)",
    title: "2 idle seats detected",
    detail: "$240/mo unused Cursor subscriptions",
  },
  {
    dot: "var(--amber-500)",
    title: "Cache hit rate 23% in api-service",
    detail: "est. −$340/mo with prompt caching",
  },
  {
    dot: "var(--green-500)",
    title: "Invoice reconciled",
    detail: "94% of June spend attributed",
  },
];

const TEAMS = [
  { name: "Platform", spend: "$1,940", pct: 82 },
  { name: "Product eng", spend: "$1,410", pct: 60 },
  { name: "Infra", spend: "$980", pct: 42 },
];

export default function ProductShot() {
  return (
    <div className="bezel">
      <div className="bezel-core">
        {/* browser chrome */}
        <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--panel)] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f26d5f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f5bd4f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#59c76f]" />
          <div className="num mx-auto flex h-6 w-full max-w-sm items-center justify-center rounded-md border border-[var(--border)] bg-white text-[10.5px] text-[var(--text-3)]">
            console.planckspace.dev/overview
          </div>
        </div>

        <div className="flex bg-white">
          {/* sidebar */}
          <aside className="hidden w-44 shrink-0 flex-col gap-0.5 border-r border-[var(--border)] bg-[#F5F6FB] p-3 sm:flex">
            <div className="mb-3 flex items-center gap-2 px-1.5">
              <PlanckMark className="h-5 w-5" />
              <span className="text-[12px] font-semibold tracking-[-0.01em]">Planckspace</span>
            </div>
            {NAV.map((n) => (
              <div
                key={n.label}
                className={
                  n.active
                    ? "rounded-md bg-[var(--brand-50)] px-2.5 py-1.5 text-[11.5px] font-medium text-[var(--brand-700)]"
                    : "px-2.5 py-1.5 text-[11.5px] text-[var(--text-2)]"
                }
              >
                {n.label}
              </div>
            ))}
            <div className="mt-auto border-t border-[var(--border)] px-2.5 pt-2.5 text-[10.5px] text-[var(--text-3)]">
              acme-eng · 11 members
            </div>
          </aside>

          {/* data area */}
          <div className="min-w-0 flex-1 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-baseline gap-2.5">
                <span className="text-[14px] font-semibold tracking-[-0.01em]">Overview</span>
                <span className="num text-[10.5px] text-[var(--text-3)]">last 30 days</span>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-[var(--green-500)]/25 bg-[var(--green-50)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--green-700)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--green-500)]" />
                Live
              </span>
            </div>

            {/* stat row */}
            <div className="mb-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-lg border border-[var(--border)] bg-white p-3 shadow-[0_1px_2px_rgba(17,19,26,0.03)]">
                  <div className="mb-1.5 text-[9.5px] font-medium uppercase tracking-[0.08em] text-[var(--text-3)]">
                    {s.label}
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="num text-[19px] font-medium tracking-[-0.03em] text-[var(--ink)]">
                      {s.value}
                    </span>
                    <span
                      className="num text-[10px]"
                      style={{ color: s.tone === "green" ? "var(--green-700)" : "var(--text-3)" }}
                    >
                      {s.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-2 lg:grid-cols-[1.7fr_1fr]">
              {/* spend chart */}
              <div className="rounded-lg border border-[var(--border)] bg-white p-3.5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10.5px] font-medium uppercase tracking-[0.08em] text-[var(--text-3)]">
                    Daily spend
                  </span>
                  <span className="num text-[10px] text-[var(--text-3)]">USD</span>
                </div>
                <svg viewBox="0 0 520 150" className="h-auto w-full" role="img" aria-label="Daily AI spend, trending with visibility into each day">
                  <defs>
                    <linearGradient id="ps-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#2E6BF2" stopOpacity="0.10" />
                      <stop offset="1" stopColor="#2E6BF2" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[30, 70, 110].map((y) => (
                    <line key={y} x1="0" x2="520" y1={y} y2={y} stroke="#EEF0F4" strokeDasharray="3 4" />
                  ))}
                  <path
                    d="M0,118 C30,112 45,104 70,106 C95,108 110,88 140,90 C170,92 185,72 215,76 C245,80 260,60 290,64 C320,68 335,84 360,78 C385,72 400,46 430,42 C460,38 480,52 520,30 L520,150 L0,150 Z"
                    fill="url(#ps-fill)"
                  />
                  <path
                    d="M0,118 C30,112 45,104 70,106 C95,108 110,88 140,90 C170,92 185,72 215,76 C245,80 260,60 290,64 C320,68 335,84 360,78 C385,72 400,46 430,42 C460,38 480,52 520,30"
                    fill="none"
                    stroke="#2E6BF2"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="430" cy="42" r="3.5" fill="#fff" stroke="#2E6BF2" strokeWidth="2" />
                </svg>
                {/* per-team attribution */}
                <div className="mt-3 space-y-2 border-t border-[var(--border)] pt-3">
                  {TEAMS.map((t) => (
                    <div key={t.name} className="flex items-center gap-3">
                      <span className="w-20 truncate text-[10.5px] text-[var(--text-2)]">{t.name}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--inset)]">
                        <div
                          className="h-full rounded-full bg-[var(--brand-600)]"
                          style={{ width: `${t.pct}%` }}
                        />
                      </div>
                      <span className="num w-12 text-right text-[10.5px] text-[var(--ink)]">{t.spend}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* insights */}
              <div className="rounded-lg border border-[var(--border)] bg-white p-3.5">
                <div className="mb-2.5 text-[10.5px] font-medium uppercase tracking-[0.08em] text-[var(--text-3)]">
                  Cost insights
                </div>
                <div className="space-y-2.5">
                  {INSIGHTS.map((i) => (
                    <div key={i.title} className="flex gap-2.5 rounded-md border border-[var(--border)] p-2.5">
                      <span
                        className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: i.dot }}
                      />
                      <div className="min-w-0">
                        <div className="truncate text-[11px] font-medium text-[var(--ink)]">{i.title}</div>
                        <div className="num truncate text-[10px] text-[var(--text-3)]">{i.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
