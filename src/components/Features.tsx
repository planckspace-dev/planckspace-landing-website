import { Reveal } from "@/components/ui/reveal";

/* ─────────────────────────────────────────────────────────────────────────
   Product bento — every tile maps to a real capability in the platform
   (wasted-spend, reconciliation, budgets/anomalies, team attribution,
   session detail, chargeback exports). Mini-mocks follow the dashboard's
   design contract: ink values, brand-blue series, functional color only.
   ───────────────────────────────────────────────────────────────────────── */

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
      <div className="flex-1 border-b border-[var(--border)] bg-[var(--panel)] p-5">
        {children}
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

/* mini-mocks ------------------------------------------------------------- */

function MockOverview() {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-[0_1px_2px_rgba(17,19,26,0.03)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--text-3)]">
          Workspace spend · 30d
        </span>
        <span className="num text-[10px] text-[var(--green-700)]">94% attributed</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="num text-[26px] font-medium tracking-[-0.03em]">$4,820.14</span>
        <span className="num text-[11px] text-[var(--text-3)]">+12% vs May</span>
      </div>
      <svg viewBox="0 0 360 84" className="mt-3 w-full">
        <defs>
          <linearGradient id="ft-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2E6BF2" stopOpacity="0.10" />
            <stop offset="1" stopColor="#2E6BF2" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[20, 46, 72].map((y) => (
          <line key={y} x1="0" x2="360" y1={y} y2={y} stroke="#EEF0F4" strokeDasharray="3 4" />
        ))}
        <path
          d="M0,66 C25,62 40,56 62,58 C84,60 100,44 126,47 C152,50 165,34 192,38 C219,42 232,28 258,31 C284,34 300,46 320,40 C340,34 350,20 360,16 L360,84 L0,84 Z"
          fill="url(#ft-fill)"
        />
        <path
          d="M0,66 C25,62 40,56 62,58 C84,60 100,44 126,47 C152,50 165,34 192,38 C219,42 232,28 258,31 C284,34 300,46 320,40 C340,34 350,20 360,16"
          fill="none"
          stroke="#2E6BF2"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <div className="num mt-2 flex justify-between text-[9.5px] text-[var(--text-3)]">
        <span>Jun 06</span>
        <span>Jun 20</span>
        <span>Jul 05</span>
      </div>
    </div>
  );
}

function MockWaste() {
  const rows = [
    { label: "2 idle Cursor seats", value: "$240/mo", tone: "var(--coral-700)" },
    { label: "Cache hit 23% · api-service", value: "−$340/mo", tone: "var(--coral-700)" },
    { label: "Opus on lint fixes · 41 runs", value: "−$88/mo", tone: "var(--coral-700)" },
  ];
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5"
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--coral-500)]" />
            <span className="truncate text-[11.5px] text-[var(--ink)]">{r.label}</span>
          </span>
          <span className="num shrink-0 text-[11.5px] font-medium" style={{ color: r.tone }}>
            {r.value}
          </span>
        </div>
      ))}
      <div className="flex items-center justify-between px-1 pt-1">
        <span className="text-[10.5px] text-[var(--text-3)]">Recoverable this month</span>
        <span className="num text-[13px] font-medium text-[var(--ink)]">$668</span>
      </div>
    </div>
  );
}

function MockReconciliation() {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4">
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
    </div>
  );
}

function MockBudget() {
  return (
    <div className="space-y-2.5">
      <div className="rounded-lg border border-[var(--border)] bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-medium text-[var(--ink)]">July budget</span>
          <span className="num text-[11px] text-[var(--text-2)]">
            $4,820 <span className="text-[var(--text-3)]">/ $6,000</span>
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--inset)]">
          <div className="h-full w-[82%] rounded-full bg-[var(--amber-500)]" />
        </div>
        <div className="mt-2 flex justify-between text-[10px]">
          <span className="font-medium text-[var(--amber-500)]">82% consumed · day 6 pace alert</span>
          <span className="num text-[var(--text-3)]">runway: 9 days</span>
        </div>
      </div>
      <div className="flex items-center gap-2.5 rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--coral-500)]" />
        <span className="text-[11px] text-[var(--ink)]">
          Anomaly: spend 3.1× daily median
        </span>
        <span className="num ml-auto text-[10px] text-[var(--text-3)]">email sent 09:12</span>
      </div>
    </div>
  );
}

function MockTeams() {
  const teams = [
    { name: "Platform", value: "$1,940", pct: 82 },
    { name: "Product eng", value: "$1,410", pct: 60 },
    { name: "Infra", value: "$980", pct: 42 },
    { name: "Unattributed", value: "$490", pct: 20, muted: true },
  ];
  return (
    <div className="space-y-2.5 rounded-lg border border-[var(--border)] bg-white p-4">
      {teams.map((t) => (
        <div key={t.name} className="flex items-center gap-3">
          <span className="w-[74px] truncate text-[10.5px] text-[var(--text-2)]">{t.name}</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--inset)]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${t.pct}%`,
                background: t.muted ? "#64708A" : "var(--brand-600)",
              }}
            />
          </div>
          <span className="num w-12 text-right text-[10.5px] text-[var(--ink)]">{t.value}</span>
        </div>
      ))}
    </div>
  );
}

function MockSession() {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="num text-[10.5px] text-[var(--text-3)]">session · 38 min · claude code</span>
        <span className="num text-[12px] font-medium text-[var(--ink)]">$3.84</span>
      </div>
      <div className="space-y-1.5">
        {[
          ["model", "claude-sonnet-4-6"],
          ["tokens in / out", "412k / 38k"],
          ["cache read", "1.2M (61%)"],
          ["repo", "acme/api-service"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between text-[10.5px]">
            <span className="text-[var(--text-3)]">{k}</span>
            <span className="num text-[var(--ink)]">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockExport() {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4">
      <div className="num space-y-1.5 text-[10px] leading-relaxed text-[var(--text-2)]">
        <div className="flex justify-between border-b border-[var(--border)] pb-1.5 text-[var(--text-3)]">
          <span>team</span>
          <span>sessions</span>
          <span>cost_usd</span>
        </div>
        {[
          ["platform", "141", "1940.22"],
          ["product-eng", "118", "1410.85"],
          ["infra", "83", "980.07"],
        ].map(([a, b, c]) => (
          <div key={a} className="flex justify-between">
            <span>{a}</span>
            <span>{b}</span>
            <span className="text-[var(--ink)]">{c}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-md bg-[var(--inset)] px-3 py-2">
        <span className="num text-[10px] text-[var(--text-2)]">chargeback_june.csv</span>
        <span className="text-[10px] font-medium text-[var(--brand-700)]">Download ↓</span>
      </div>
    </div>
  );
}

/* section ----------------------------------------------------------------- */

export default function Features() {
  return (
    <section id="product" className="scroll-mt-24 border-t border-[var(--border)] bg-[var(--panel)] py-24 sm:py-36">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-6" data-center="true">
            The platform
          </p>
          <h2 className="display-2">
            From raw tokens to answers finance will accept.
          </h2>
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
              <MockOverview />
            </TileShell>
          </Reveal>

          <Reveal delay={0.06} className="lg:col-span-5">
            <TileShell
              className="h-full"
              title="Wasted spend, itemized"
              body="Idle seats, cache misses, and oversized-model habits surfaced as line items with a dollar value — not vibes."
            >
              <MockWaste />
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
              <MockBudget />
            </TileShell>
          </Reveal>

          <Reveal className="lg:col-span-4">
            <TileShell
              className="h-full"
              title="Per-team attribution"
              body="Spend rolls up by team, repo, and developer, with the unattributed remainder always visible."
            >
              <MockTeams />
            </TileShell>
          </Reveal>

          <Reveal delay={0.05} className="lg:col-span-4">
            <TileShell
              className="h-full"
              title="Session-level receipts"
              body="Every dollar traces to a session: model, token mix, cache efficiency, repo. Drill from invoice to receipt."
            >
              <MockSession />
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
        </div>
      </div>
    </section>
  );
}
