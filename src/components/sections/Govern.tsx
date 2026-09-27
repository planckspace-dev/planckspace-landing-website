"use client";

import { useRef } from "react";
import { Bell, Gauge, Rocket, TrendingDown, Trophy } from "lucide-react";
import { PostureRings } from "@/components/product/OverviewConsole";
import { useInView } from "@/components/product/parts";
import { POSTURE, WORKSPACE, usd } from "@/lib/sample";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────
   Governance, as a bento with exactly as many cells as it has things to
   say. On a 12-column grid: budget 7 x 2 beside coverage and invoice check
   (5 x 1 each), then posture and team performance at 6 + 6. Two cells are
   product fragments in the app's own light theme; three are instruments.
   ───────────────────────────────────────────────────────────────────────── */

const BUDGET = { ceiling: 15000, spent: 9860, day: 27, days: 30 };

function BudgetBurn({ run }: { run: boolean }) {
  const W = 560;
  const H = 210;
  const max = 17000;
  const x = (d: number) => 30 + (d / BUDGET.days) * (W - 40);
  const y = (v: number) => H - 22 - (v / max) * (H - 36);
  // cumulative billed by day: seats land on the 1st, metered accrues on weekdays
  const pts: [number, number][] = [];
  let acc = 4040;
  for (let d = 1; d <= BUDGET.day; d++) {
    const dow = (d + 1) % 7;
    acc += dow >= 5 ? 110 : 265 + ((d * 37) % 60);
    pts.push([d, Math.min(acc, BUDGET.spent)]);
  }
  const line = pts.map(([d, v], i) => `${i ? "L" : "M"}${x(d)},${y(v)}`).join(" ");
  const pace = `M${x(BUDGET.day)},${y(BUDGET.spent)} L${x(BUDGET.days)},${y(BUDGET.spent + (BUDGET.spent - 4040) / (BUDGET.day - 1) * 3)}`;

  return (
    <div className="app card h-full p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-[11.5px] text-[var(--text-2)]">
            <Bell className="h-3.5 w-3.5 text-[var(--text-3)]" strokeWidth={1.7} /> Workspace budget
          </p>
          <p className="mt-2 flex items-baseline gap-1.5">
            <span className="num-d text-[26px] font-semibold">{usd(BUDGET.spent)}</span>
            <span className="text-[12px] text-[var(--text-2)]">of {usd(BUDGET.ceiling)} billed in September</span>
          </p>
          <p className="mt-1 text-[11.5px] text-[var(--text-2)]">66% used with 90% of the month gone, comfortably behind the calendar</p>
        </div>
        <span className="pill pill-real">On track</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 block w-full">
        {[0.5, 0.8].map((f) => (
          <g key={f}>
            <line x1="30" x2={W - 10} y1={y(BUDGET.ceiling * f)} y2={y(BUDGET.ceiling * f)} stroke="var(--chart-grid)" strokeDasharray="3 4" />
            <text x={W - 10} y={y(BUDGET.ceiling * f) - 4} textAnchor="end" fontSize="10" fill="var(--text-3)">
              {f * 100}%
            </text>
          </g>
        ))}
        <line x1="30" x2={W - 10} y1={y(BUDGET.ceiling)} y2={y(BUDGET.ceiling)} stroke="var(--ink)" strokeDasharray="5 4" />
        <text x={W - 10} y={y(BUDGET.ceiling) - 5} textAnchor="end" fontSize="10.5" fill="var(--ink)" fontWeight="600">
          ceiling {usd(BUDGET.ceiling)}
        </text>
        <path
          d={`${line} L${x(BUDGET.day)},${H - 22} L${x(1)},${H - 22} Z`}
          fill="var(--brand-600)"
          opacity={run ? 0.08 : 0}
          style={{ transition: "opacity 1s .6s" }}
        />
        <path
          d={line}
          fill="none"
          stroke="var(--brand-600)"
          strokeWidth="2"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={run ? 0 : 1}
          style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1)" }}
        />
        <path d={pace} fill="none" stroke="var(--green-500)" strokeWidth="1.8" strokeDasharray="5 4" opacity={run ? 1 : 0} style={{ transition: "opacity .6s 1.6s" }} />
        <circle cx={x(BUDGET.day)} cy={y(BUDGET.spent)} r="4" fill="white" stroke="var(--brand-600)" strokeWidth="2" opacity={run ? 1 : 0} style={{ transition: "opacity .4s 1.5s" }} />
        {[
          { d: 1, l: "Sep 1" },
          { d: 15, l: "Sep 15" },
          { d: BUDGET.day, l: "Today" },
        ].map((t) => (
          <text key={t.l} x={x(t.d)} y={H - 4} fontSize="10" fill="var(--text-3)" textAnchor="middle">
            {t.l}
          </text>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-3 text-[11px] text-[var(--text-2)]">
        Alerts at
        {["50% · Sep 16", "80%", "100%"].map((a, i) => (
          <span key={a} className={cn("rounded-md border px-1.5 py-0.5", i === 0 ? "border-[var(--amber-500)]/40 bg-[var(--amber-50)] text-[var(--amber-700)]" : "border-[var(--border)]")}>
            {a}
          </span>
        ))}
        <span className="ml-auto text-[10.5px] text-[var(--text-3)]">burns on billed dollars only</span>
      </div>
    </div>
  );
}

function Cell({ title, body, children, className, light }: { title: string; body: string; children: React.ReactNode; className?: string; light?: boolean }) {
  return (
    <article className={cn("gv-cell frame h-full [--ch:20px]", className)}>
      <div className="frame-in flex h-full flex-col p-5 sm:p-6">
        <h3 className="t-h4">{title}</h3>
        <p className="mt-1.5 max-w-[34rem] text-[0.95rem] leading-relaxed text-fg-3">{body}</p>
        <div className={cn("mt-5 flex-1", light && "min-h-0")}>{children}</div>
      </div>
    </article>
  );
}

export default function Govern() {
  const root = useRef<HTMLElement>(null);
  const [vis, seen] = useInView<HTMLDivElement>("0px 0px -15% 0px");
  const { developers, reporting } = WORKSPACE;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".gv-head > *", { y: 30, autoAlpha: 0, stagger: 0.1, duration: 1, scrollTrigger: { trigger: ".gv-head", start: "top 82%" } });
        gsap.from(".gv-cell", { y: 60, autoAlpha: 0, stagger: 0.08, duration: 1.1, scrollTrigger: { trigger: ".gv-grid", start: "top 82%" } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="govern" aria-labelledby="govern-title" className="section bg-ink-1">
      <div className="wrap">
        <div className="gv-head max-w-[54rem]">
          <h2 id="govern-title" className="t-display t-h2">
            Guardrails the whole org can read.
          </h2>
          <p className="t-lead mt-6 max-w-[42rem]">
            Budgets that burn on billed dollars, alerts when a repo runs far above its usual, coverage that names who
            isn&apos;t reporting, and invoices checked against what was metered.
          </p>
        </div>

        <div ref={vis} className="gv-grid mt-14 grid grid-flow-dense gap-4 sm:mt-16 lg:grid-cols-12">
          <Cell
            title="Budgets that know the calendar"
            body="A ceiling on billed spend, the pace to month end, and a pin where each threshold was crossed."
            className="lg:col-span-7 lg:row-span-2"
            light
          >
            <BudgetBurn run={seen} />
          </Cell>

          <Cell title="Coverage, not guesswork" body="A partial fleet reads as incomplete, never as a small total." className="lg:col-span-5">
            <p className="flex items-baseline gap-3">
              <span className="t-meter text-[3rem] text-lime">
                {reporting}/{developers}
              </span>
              <span className="t-mono text-[12px] text-fg-3">developers reporting</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-[4px]">
              {Array.from({ length: developers }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-5 w-[9px] transition-opacity duration-500",
                    i < reporting ? "bg-lime" : i < developers - 1 ? "bg-sig-amber" : "border border-fg-4",
                  )}
                  style={{ opacity: seen ? 1 : 0.15, transitionDelay: `${i * 0.02}s` }}
                />
              ))}
            </div>
            <p className="t-mono mt-3 text-[11.5px] text-fg-3">3 silent for 26h · 1 never connected · invites one command away</p>
          </Cell>

          <Cell title="Invoice check" body="The provider's own report, held up against the spend PlanckSpace metered." className="lg:col-span-5">
            <ul className="space-y-4">
              {[
                { p: "Anthropic", inv: 7912, tracked: 7850 },
                { p: "OpenAI", inv: 1644, tracked: 1630 },
              ].map((r) => (
                <li key={r.p}>
                  <p className="flex justify-between text-[0.9rem]">
                    <span className="text-fg">{r.p}</span>
                    <span className="t-mono text-[12px] text-sig-green">within {(((r.inv - r.tracked) / r.inv) * 100).toFixed(1)}%</span>
                  </p>
                  <div className="mt-2 space-y-1">
                    {[
                      { l: "invoice", v: r.inv, c: "bg-fg/70" },
                      { l: "metered", v: r.tracked, c: "bg-lime" },
                    ].map((b) => (
                      <div key={b.l} className="flex items-center gap-2">
                        <span className="t-mono w-14 text-[10.5px] text-fg-3">{b.l}</span>
                        <span className="h-1.5 flex-1 bg-fg/10">
                          <span className={cn("block h-full transition-[width] duration-[1.4s] ease-[var(--ease-out-expo)]", b.c)} style={{ width: seen ? `${(b.v / 8000) * 100}%` : "0%" }} />
                        </span>
                        <span className="t-mono w-14 text-right text-[11px] text-fg-2">{usd(b.v)}</span>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </Cell>

          <Cell title="One score, every point explained" body="AI posture: how well spend turns into shipped work, and the factor costing the most." className="lg:col-span-6">
            <div className="app card flex items-center gap-5 p-4">
              <div className="relative">
                <PostureRings run={seen} size={132} />
                <div className="absolute inset-0 grid place-items-center">
                  <p className="text-center">
                    <span className="num-d block text-[28px] font-semibold leading-none">{POSTURE.score}</span>
                    <span className="text-[10px] text-[var(--text-3)]">of 100</span>
                  </p>
                </div>
              </div>
              <ul className="flex-1 space-y-1.5">
                {POSTURE.factors.map((f) => (
                  <li key={f.key} className="flex items-center justify-between text-[11.5px]">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ background: f.color }} />
                      {f.label}
                    </span>
                    <span className="num text-[var(--text-2)]">
                      {f.value}/{f.max}
                    </span>
                  </li>
                ))}
                <li className="pt-1 text-[10.5px] text-[var(--amber-700)]">
                  <Gauge className="mr-1 inline h-3 w-3" strokeWidth={1.8} />
                  Biggest drag: model routing, 7.5 pts
                </li>
              </ul>
            </div>
          </Cell>

          <Cell title="Team performance, ranked" body="Spend share, shipped work and cost per shipped session for every team." className="lg:col-span-6">
            <ul className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Trophy, k: "Most efficient", team: "Platform", v: "$1.92", s: "per shipped session" },
                { icon: TrendingDown, k: "Most improved", team: "Mobile", v: "-31%", s: "cost per shipped" },
                { icon: Rocket, k: "Most shipped", team: "Growth", v: "1,104", s: "shipped sessions" },
              ].map((t) => (
                <li key={t.k} className="bg-ink p-3.5">
                  <p className="t-mono flex items-center gap-1.5 text-[10.5px] text-fg-3">
                    <t.icon className="h-3 w-3 text-lime" strokeWidth={1.8} /> {t.k}
                  </p>
                  <p className="mt-2 text-[1rem] font-semibold text-fg">{t.team}</p>
                  <p className="t-meter mt-1 text-[1.35rem] text-lime">{t.v}</p>
                  <p className="t-mono text-[10.5px] text-fg-3">{t.s}</p>
                </li>
              ))}
            </ul>
          </Cell>
        </div>
      </div>
    </section>
  );
}
