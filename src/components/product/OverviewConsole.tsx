"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, ChevronDown, CircleCheck, Gauge, Layers, Radio, Scissors, TrendingUp, Wallet } from "lucide-react";
import AppFrame from "@/components/product/AppFrame";
import { Card, CardHead, CountUp, Sparkline, ToolBadge, useInView, useReducedMotion, useVisible } from "@/components/product/parts";
import {
  DAILY,
  DAILY_BILLED,
  DAYS,
  FINDINGS,
  POSTURE,
  RECEIPTS,
  SAVINGS_DAYS,
  SERIES,
  SESSIONS,
  WORKSPACE,
  accrued,
  billedTotal,
  dayLabel,
  meteredTotal,
  realizedTotal,
  removableTotal,
  savedToDate,
  seatTotal,
  usd,
  type Session,
} from "@/lib/sample";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────
   The Overview, as the app draws it (leadership lens), on the sample
   workspace. Everything reads from lib/sample so the figures agree: the
   money row's billed total is the hero's total, Removable is the findings'
   sum, and the realized card ends on the receipts' sum.
   ───────────────────────────────────────────────────────────────────────── */

const fmt = (n: number) => usd(Math.round(n));

/* ── coverage ──────────────────────────────────────────────────────────── */

export function CoverageMeter({ compact = false }: { compact?: boolean }) {
  const { developers, reporting } = WORKSPACE;
  const silent = developers - reporting - 1;
  return (
    <div className={cn("flex items-center gap-2.5 rounded-lg border border-[var(--border)] bg-white", compact ? "px-2.5 py-1.5" : "px-3 py-2")}>
      <div className="flex gap-[2px]">
        {Array.from({ length: developers }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-3 w-[3px] rounded-[1px]",
              i < reporting ? "bg-[var(--green-500)]" : i < reporting + silent ? "bg-[var(--amber-500)]" : "border border-[var(--border-strong)]",
            )}
          />
        ))}
      </div>
      <span className="whitespace-nowrap text-[11.5px] text-[var(--text-2)]">
        <span className="num font-medium text-[var(--ink)]">{reporting}</span> of {developers} reporting
      </span>
    </div>
  );
}

/* ── money row ─────────────────────────────────────────────────────────── */

function MoneyRow({ run }: { run: boolean }) {
  const labels = useMemo(() => Array.from({ length: DAYS }, (_, i) => dayLabel(i)), []);
  const shipRate = 0.61;
  return (
    <div className="card-hero grid grid-cols-4 overflow-visible">
      <div className="border-r border-[var(--border)] p-4">
        <p className="flex items-center gap-1.5 text-[11.5px] text-[var(--text-2)]">
          <Wallet className="h-3.5 w-3.5 text-[var(--text-3)]" strokeWidth={1.7} /> AI spend (billed)
        </p>
        <p className="mt-2 flex items-baseline gap-1">
          <CountUp value={billedTotal} run={run} format={fmt} className="num-d text-[26px] font-semibold" />
          <span className="text-[12px] text-[var(--text-3)]">/mo</span>
        </p>
        <p className="mt-1 flex gap-3 text-[11px] text-[var(--text-2)]">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-600)]" />
            Seats <b className="num font-medium text-[var(--ink)]">{usd(seatTotal)}</b>
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--teal-500)]" />
            Metered <b className="num font-medium text-[var(--ink)]">{usd(meteredTotal)}</b>
          </span>
        </p>
        <div className="mt-3">
          <Sparkline data={DAILY_BILLED} labels={labels} format={fmt} draw={run} />
        </div>
        <p className="mt-1 text-[10.5px] text-[var(--text-3)]">Daily billed</p>
      </div>

      <div className="border-r border-[var(--border)] p-4">
        <p className="flex items-center gap-1.5 text-[11.5px] text-[var(--text-2)]">
          <Gauge className="h-3.5 w-3.5 text-[var(--text-3)]" strokeWidth={1.7} /> Metered cost per shipped session
        </p>
        <p className="mt-2 flex items-baseline gap-2">
          <CountUp value={2.84} run={run} format={(n) => usd(n, 2)} className="num-d text-[26px] font-semibold" />
          <span className="pill pill-real">real</span>
        </p>
        <p className="mt-1 text-[11px] text-[var(--text-2)]">metered spend per shipped session</p>
        <div className="mt-5 h-1.5 rounded-full bg-[var(--well)]">
          <div
            className="h-full rounded-full bg-[var(--green-500)] transition-[width] duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ width: run ? `${shipRate * 100}%` : "0%" }}
          />
        </div>
        <p className="mt-2 text-[10.5px] text-[var(--text-3)]">
          <span className="num">61%</span> ship rate · <span className="num">3,338</span> of <span className="num">5,472</span> sessions
        </p>
      </div>

      <div className="border-r border-[var(--border)] p-4">
        <p className="flex items-center gap-1.5 text-[11.5px] text-[var(--text-2)]">
          <Scissors className="h-3.5 w-3.5 text-[var(--coral-500)]" strokeWidth={1.7} /> Removable from the bill
        </p>
        <p className="mt-2 flex items-baseline gap-1">
          <CountUp value={removableTotal} run={run} format={fmt} className="num-d text-[26px] font-semibold text-[var(--coral-700)]" />
          <span className="text-[12px] text-[var(--text-3)]">/mo</span>
        </p>
        <p className="mt-1 text-[11px] text-[var(--text-2)]">{FINDINGS.length} fixes ready, all real dollars</p>
        <div className="mt-5 flex gap-1">
          {FINDINGS.map((f, i) => (
            <span
              key={f.id}
              title={`${f.title}: ${usd(f.usd)}/mo`}
              className="h-2.5 rounded-[2px] bg-[var(--coral-500)] transition-opacity duration-700"
              style={{ width: `${(f.usd / removableTotal) * 100}%`, opacity: run ? 1 : 0, transitionDelay: `${i * 90}ms` }}
            />
          ))}
        </div>
        <p className="mt-2 text-[10.5px] text-[var(--text-3)]">one mark per open finding, sized by $/mo</p>
      </div>

      <div className="p-4">
        <p className="flex items-center gap-1.5 text-[11.5px] text-[var(--text-2)]">
          <TrendingUp className="h-3.5 w-3.5 text-[var(--text-3)]" strokeWidth={1.7} /> Leverage on spend
        </p>
        <p className="mt-2 flex items-baseline gap-2">
          <CountUp value={3.1} run={run} format={(n) => n.toFixed(1)} className="num-d text-[26px] font-semibold" />
          <span className="text-[12px] text-[var(--text-3)]">×</span>
          <span className="pill pill-imputed">imputed</span>
        </p>
        <p className="mt-1 text-[11px] text-[var(--text-2)]">work done per dollar billed</p>
        <div className="mt-4 space-y-1.5">
          {[
            { label: "billed", v: billedTotal, c: "var(--ink)" },
            { label: "work at API rates", v: 41912, c: "var(--amber-500)" },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <div className="h-2 flex-1 rounded-full bg-[var(--well)]">
                <div
                  className="h-full rounded-full transition-[width] duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ width: run ? `${(b.v / 41912) * 100}%` : "0%", background: b.c }}
                />
              </div>
              <span className="num w-[86px] text-right text-[10.5px] text-[var(--text-3)]">
                {b.label.split(" ")[0]} {usd(b.v)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── realized savings ──────────────────────────────────────────────────── */

export function SavingsChart({
  run,
  height = 150,
  width = 330,
  projection = true,
}: {
  run: boolean;
  height?: number;
  /** viewBox width: match the rendered width so labels stay at their true size */
  width?: number;
  projection?: boolean;
}) {
  const W = width;
  const H = height;
  const days = SAVINGS_DAYS + (projection ? 18 : 0);
  const max = accrued(days) * 1.08;
  const x = (d: number) => (d / days) * W;
  const y = (v: number) => H - 14 - (v / max) * (H - 26);
  const pts = Array.from({ length: SAVINGS_DAYS + 1 }, (_, d) => `${d ? "L" : "M"}${x(d).toFixed(1)},${y(accrued(d)).toFixed(1)}`).join(" ");
  const proj = `M${x(SAVINGS_DAYS)},${y(accrued(SAVINGS_DAYS))} L${x(days)},${y(accrued(days))}`;
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full overflow-visible" style={{ height: H }}>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1="0" x2={W} y1={y(max * f * 0.92)} y2={y(max * f * 0.92)} stroke="var(--chart-grid)" strokeDasharray="3 4" />
        ))}
        <path
          d={`${pts} L${x(SAVINGS_DAYS)},${H - 14} L0,${H - 14} Z`}
          fill="var(--green-500)"
          opacity={run ? 0.08 : 0}
          style={{ transition: "opacity 1.2s" }}
        />
        <path
          d={pts}
          fill="none"
          stroke="var(--green-500)"
          strokeWidth="2"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={run ? 0 : 1}
          style={{ transition: "stroke-dashoffset 2s cubic-bezier(0.16,1,0.3,1)" }}
        />
        {projection && (
          <path d={proj} fill="none" stroke="var(--green-500)" strokeWidth="1.5" strokeDasharray="4 4" opacity={run ? 0.7 : 0} style={{ transition: "opacity 1s 1.4s" }} />
        )}
        <line x1={x(SAVINGS_DAYS)} x2={x(SAVINGS_DAYS)} y1="6" y2={H - 14} stroke="var(--border-strong)" strokeDasharray="2 3" />
        <text x={x(SAVINGS_DAYS) - 4} y="12" textAnchor="end" fontSize="10" fill="var(--text-3)">
          Today
        </text>
        {RECEIPTS.map((r, i) => (
          <g
            key={r.id}
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
            style={{ opacity: run ? 1 : 0, transition: `opacity .5s ${0.5 + i * 0.25}s` }}
          >
            <circle cx={x(r.day)} cy={y(accrued(r.day))} r="9" fill="transparent" />
            <circle cx={x(r.day)} cy={y(accrued(r.day))} r="4" fill="white" stroke="var(--green-500)" strokeWidth="2" />
          </g>
        ))}
        {["Aug 1", "Aug 15", "Sep 1", "Sep 15"].map((l, i) => (
          <text key={l} x={x([0, 14, 31, 45][i])} y={H} fontSize="10" fill="var(--text-3)">
            {l}
          </text>
        ))}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 w-[190px] -translate-x-1/2 rounded-md border border-[var(--border)] bg-white p-2 text-[10.5px] shadow-[var(--shadow-card)]"
          style={{ left: `${(RECEIPTS[hover].day / days) * 100}%`, top: y(accrued(RECEIPTS[hover].day)) - 70 }}
        >
          <p className="font-medium text-[var(--ink)]">{RECEIPTS[hover].title}</p>
          <p className="mt-0.5 text-[var(--text-2)]">
            verified {RECEIPTS[hover].verified} · <span className="num text-[var(--green-700)]">+{usd(RECEIPTS[hover].usd)}/mo</span>
          </p>
        </div>
      )}
    </div>
  );
}

function RealizedSavingsCard({ run }: { run: boolean }) {
  return (
    <Card className="flex flex-col">
      <CardHead icon={<CircleCheck className="h-4 w-4" strokeWidth={1.7} />} title="Realized savings" sub="Verified against post-fix telemetry" />
      <div className="grid flex-1 grid-cols-[1.35fr_1fr]">
        <div className="border-r border-[var(--border)] p-4">
          <p className="flex items-baseline gap-1.5">
            <CountUp value={realizedTotal} run={run} format={fmt} className="num-d text-[30px] font-semibold text-[var(--green-700)]" />
            <span className="text-[13px] text-[var(--text-3)]">/mo verified</span>
            <span className="pill pill-real ml-1">real</span>
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-2)]">
            <span className="num rounded bg-[var(--green-50)] px-1 font-medium text-[var(--green-700)]">{usd(savedToDate)} saved to date</span>{" "}
            <span className="num">{usd(realizedTotal * 12)}</span> a year at this rate
          </p>
          <div className="mt-4">
            <SavingsChart run={run} />
          </div>
        </div>
        <div className="p-3">
          <p className="flex justify-between px-1 text-[11.5px] font-medium">
            Verified fixes <span className="font-normal text-[var(--text-3)]">{RECEIPTS.length} total</span>
          </p>
          <ul className="mt-2 space-y-1">
            {RECEIPTS.slice()
              .reverse()
              .map((r) => (
                <li key={r.id} className="rounded-md px-1 py-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="flex gap-1.5 text-[11.5px] leading-tight">
                      <CircleCheck className="mt-px h-3.5 w-3.5 shrink-0 text-[var(--green-500)]" strokeWidth={1.8} />
                      {r.title}
                    </p>
                    <span className="num whitespace-nowrap text-[11.5px] font-medium text-[var(--green-700)]">+{usd(r.usd)}/mo</span>
                  </div>
                  <p className="ml-5 mt-1 flex items-center gap-1.5 text-[10px] text-[var(--text-3)]">
                    <span className="num rounded border border-[var(--border)] px-1">
                      {r.before} → {r.after}
                    </span>
                    {r.verified}
                  </p>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

/* ── posture ───────────────────────────────────────────────────────────── */

export function PostureRings({ run, size = 150 }: { run: boolean; size?: number }) {
  const c = size / 2;
  const stroke = size * 0.056;
  const gap = size * 0.022;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="shrink-0 -rotate-90">
      {POSTURE.factors.map((f, i) => {
        const r = c - stroke / 2 - 1 - i * (stroke + gap);
        const len = 2 * Math.PI * r;
        const frac = f.value / f.max;
        return (
          <g key={f.key}>
            <circle cx={c} cy={c} r={r} fill="none" stroke="var(--well)" strokeWidth={stroke} />
            <circle
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke={f.color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${len}`}
              strokeDashoffset={run ? len * (1 - frac) : len}
              style={{ transition: `stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s` }}
            />
          </g>
        );
      })}
    </svg>
  );
}

function PostureCard({ run }: { run: boolean }) {
  return (
    <Card className="flex flex-col">
      <CardHead
        icon={<Gauge className="h-4 w-4" strokeWidth={1.7} />}
        title="AI posture"
        sub="How well AI spend turns into shipped work"
        right={<span className="num text-[11px] font-medium text-[var(--green-700)]">↑ 6 this month</span>}
      />
      <div className="flex flex-1 items-center gap-5 p-4">
        <div className="relative">
          <PostureRings run={run} />
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <CountUp value={POSTURE.score} run={run} format={(n) => String(Math.round(n))} className="num-d block text-[32px] font-semibold leading-none" />
              <span className="text-[10px] text-[var(--text-3)]">of 100</span>
            </div>
          </div>
        </div>
        <ul className="flex-1 space-y-2.5">
          {POSTURE.factors.map((f) => {
            const gap = f.max - f.value;
            return (
              <li key={f.key}>
                <p className="flex items-center justify-between text-[11.5px]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: f.color }} />
                    {f.label}
                  </span>
                  <span className="num text-[var(--text-2)]">
                    {f.value}/{f.max}
                  </span>
                </p>
                <p className={cn("ml-3.5 text-[10px]", gap < 1 ? "text-[var(--green-700)]" : "text-[var(--text-3)]")}>
                  {gap < 1 ? "full marks" : `${gap.toFixed(1)} pts to recover`}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}

/* ── spend by tool ─────────────────────────────────────────────────────── */

const GROUPINGS = {
  Tool: SERIES.map((s) => ({ label: s.label, color: s.color, share: s.total / meteredTotal })),
  Team: [
    { label: "Platform", color: "#2E6BF2", share: 0.38 },
    { label: "Growth", color: "#DC6803", share: 0.27 },
    { label: "Data", color: "#0F9D8F", share: 0.2 },
    { label: "Mobile", color: "#7A5AF8", share: 0.15 },
  ],
  Model: [
    { label: "opus-5-5", color: "#7A5AF8", share: 0.46 },
    { label: "sonnet-5", color: "#2E6BF2", share: 0.36 },
    { label: "gpt-5", color: "#D6359A", share: 0.12 },
    { label: "haiku-4-5", color: "#0F9D8F", share: 0.06 },
  ],
} as const;

export function SpendByToolCard({ run }: { run: boolean }) {
  const [group, setGroup] = useState<keyof typeof GROUPINGS>("Tool");
  const [hover, setHover] = useState<number | null>(null);
  const totals = DAILY.map((d) => d.reduce((a, b) => a + b, 0));
  const max = Math.max(...totals) * 1.1;
  const H = 150;
  const segs = GROUPINGS[group];
  const perDay = (i: number) =>
    group === "Tool" ? DAILY[i] : segs.map((s) => totals[i] * s.share);

  return (
    <Card className="flex flex-col">
      <CardHead icon={<Layers className="h-4 w-4" strokeWidth={1.7} />} title="Spend by tool" sub="Daily metered spend, every session attributed" />
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex gap-1 rounded-md bg-[var(--well)] p-0.5">
          {(Object.keys(GROUPINGS) as (keyof typeof GROUPINGS)[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGroup(g)}
              className={cn(
                "rounded px-2.5 py-1 text-[11px] transition-colors",
                g === group ? "bg-[var(--ink)] font-medium text-white" : "text-[var(--text-2)] hover:text-[var(--ink)]",
              )}
            >
              {g}
            </button>
          ))}
        </div>
        <p className="flex items-center gap-2 text-[11px] text-[var(--text-2)]">
          <span className="pill pill-real">real</span>
          <span className="num font-medium text-[var(--ink)]">{usd(meteredTotal)}</span> over 30 days
        </p>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 px-4 pt-3">
        {segs.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5 text-[11px]">
            <span className="h-2 w-2 rounded-[2px]" style={{ background: s.color }} />
            {s.label}
            <span className="num text-[var(--text-3)]">{Math.round(s.share * 100)}%</span>
          </span>
        ))}
      </div>
      <div className="relative flex-1 px-4 pb-3 pt-2">
        <svg viewBox={`0 0 ${DAYS * 16} ${H + 14}`} className="block w-full" onPointerLeave={() => setHover(null)}>
          {[0.33, 0.66, 1].map((f) => (
            <line key={f} x1="0" x2={DAYS * 16} y1={H - (H * f * 0.9)} y2={H - (H * f * 0.9)} stroke="var(--chart-grid)" strokeDasharray="3 4" />
          ))}
          {Array.from({ length: DAYS }, (_, i) => {
            const vals = perDay(i);
            let acc = 0;
            return (
              <g
                key={i}
                onPointerEnter={() => setHover(i)}
                opacity={hover === null || hover === i ? 1 : 0.35}
                style={{ transition: "opacity .2s" }}
              >
                <rect x={i * 16} y="0" width="16" height={H} fill="transparent" />
                {vals.map((v, k) => {
                  const h = (v / max) * H;
                  const yTop = H - acc - h;
                  acc += h;
                  return (
                    <rect
                      key={k}
                      x={i * 16 + 3}
                      width="10"
                      y={run ? yTop : H}
                      height={run ? Math.max(h - 1, 0.5) : 0}
                      rx={k === vals.length - 1 ? 2 : 0}
                      fill={segs[k].color}
                      style={{ transition: `y .9s cubic-bezier(0.16,1,0.3,1) ${i * 0.018}s, height .9s cubic-bezier(0.16,1,0.3,1) ${i * 0.018}s` }}
                    />
                  );
                })}
              </g>
            );
          })}
          {[0, 10, 20, 29].map((i) => (
            <text key={i} x={i * 16 + 8} y={H + 12} textAnchor="middle" fontSize="9.5" fill="var(--text-3)">
              {i === 29 ? "Today" : dayLabel(i)}
            </text>
          ))}
        </svg>
        {hover !== null && (
          <div
            className="pointer-events-none absolute top-6 z-10 w-[168px] -translate-x-1/2 rounded-md border border-[var(--border)] bg-white p-2 text-[10.5px] shadow-[var(--shadow-card)]"
            style={{ left: `calc(1rem + (100% - 2rem) * ${(hover + 0.5) / DAYS})` }}
          >
            <p className="text-[var(--text-2)]">{dayLabel(hover)}</p>
            {perDay(hover).map((v, k) => (
              <p key={k} className="mt-0.5 flex justify-between">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-[1px]" style={{ background: segs[k].color }} />
                  {segs[k].label}
                </span>
                <span className="num font-medium">{usd(v)}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

/* ── live sessions ─────────────────────────────────────────────────────── */

function SessionRow({ s, fresh }: { s: Session; fresh?: boolean }) {
  return (
    <li className={cn("flex items-center gap-3 border-b border-[var(--border)]/70 px-4 py-2.5 last:border-0", fresh && "animate-[row-in_.7s_cubic-bezier(0.16,1,0.3,1)]")}>
      <ToolBadge tool={s.tool} />
      <div className="min-w-0 flex-1">
        <p className="mono truncate text-[12px] font-medium">{s.repo}</p>
        <p className="mono truncate text-[10.5px] text-[var(--text-3)]">
          {s.branch} · {s.model} · {s.turns} turns
        </p>
      </div>
      <div className="text-right">
        {s.billing.kind === "metered" ? (
          <>
            <p className="num text-[12px] font-medium">{usd(s.billing.usd, 2)}</p>
            <span className="text-[10px] text-[var(--teal-700)]">metered</span>
          </>
        ) : (
          <span className="pill pill-seat">Seat · {s.billing.plan}</span>
        )}
      </div>
      <span
        className={cn(
          "w-[58px] text-right text-[10.5px]",
          s.outcome === "shipped" ? "text-[var(--green-700)]" : s.outcome === "partial" ? "text-[var(--amber-700)]" : "text-[var(--text-3)]",
        )}
      >
        {s.outcome === "open" ? "in review" : s.outcome}
      </span>
    </li>
  );
}

export function LiveSessionsCard({ rows = 6 }: { rows?: number }) {
  const [ref, visible] = useVisible<HTMLDivElement>();
  const reduce = useReducedMotion();
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (!visible || reduce) return;
    const id = setInterval(() => setOffset((o) => o + 1), 3400);
    return () => clearInterval(id);
  }, [visible, reduce]);
  const list = Array.from({ length: rows }, (_, i) => ({
    s: SESSIONS[(((i - offset) % SESSIONS.length) + SESSIONS.length) % SESSIONS.length],
    key: offset - i,
  }));

  return (
    <div ref={ref} className="h-full">
      <Card className="flex h-full flex-col">
        <CardHead
          icon={<Radio className="h-4 w-4" strokeWidth={1.7} />}
          title="Sessions, as they close"
          sub="Newest first · metadata only"
          right={
            <span className="flex items-center gap-1.5 text-[11px] text-[var(--green-700)]">
              <span className="live-dot" />
              Live
            </span>
          }
        />
        <ul className="flex-1 overflow-hidden">
          {list.map(({ s, key }, i) => (
            <SessionRow key={key} s={s} fresh={i === 0 && offset > 0} />
          ))}
        </ul>
        <p className="border-t border-[var(--border)] px-4 py-2 text-[10.5px] text-[var(--text-3)]">
          Counters and identifiers only. No prompts, no code, no diffs leave the machine.
        </p>
      </Card>
    </div>
  );
}

/* ── the page ──────────────────────────────────────────────────────────── */

export default function OverviewConsole() {
  const [ref, seen] = useInView<HTMLDivElement>("0px 0px -20% 0px");
  return (
    <div ref={ref}>
      <AppFrame active="Overview" path="overview">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-[19px] font-medium tracking-[-0.01em]">Overview</h3>
            <p className="mt-0.5 text-[12px] text-[var(--text-2)]">
              <span className="num">{WORKSPACE.developers}</span> developers · <span className="num">{usd(billedTotal)}</span> billed this period ·{" "}
              <span className="num">$2.84</span> metered per shipped session
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CoverageMeter compact />
            <span className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-2.5 py-1.5 text-[11.5px]">
              <Calendar className="h-3.5 w-3.5 text-[var(--text-3)]" strokeWidth={1.7} />
              {WORKSPACE.periodLabel}
              <ChevronDown className="h-3 w-3 text-[var(--text-3)]" />
            </span>
          </div>
        </div>

        <div className="mt-4">
          <MoneyRow run={seen} />
        </div>
        <div className="mt-4 grid grid-cols-[1.55fr_1fr] items-stretch gap-4">
          <RealizedSavingsCard run={seen} />
          <PostureCard run={seen} />
        </div>
        <div className="mt-4 grid grid-cols-[1.55fr_1fr] items-stretch gap-4">
          <SpendByToolCard run={seen} />
          <LiveSessionsCard />
        </div>
      </AppFrame>
    </div>
  );
}
