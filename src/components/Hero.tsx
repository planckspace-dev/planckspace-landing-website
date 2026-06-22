"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, TrendingUp, TrendingDown, ShieldCheck, Zap } from "lucide-react";
import { FlowField } from "@/components/ui/flow-field";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

/* ── Headline word stagger ── */
const wordContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.06 } },
};
const wordItem = {
  hidden: { opacity: 0, y: 22, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE },
  },
};

function Words({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <motion.span key={i} variants={wordItem} className={`inline-block mr-[0.22em] ${className ?? ""}`}>
          {word}
        </motion.span>
      ))}
    </>
  );
}

/* ── Live count-up (above the fold → animate on mount) ── */
function useCountUp(target: number, duration = 2000) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (reduce) { setValue(target); return; }
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / duration, 1);
      setValue(Math.floor((1 - Math.pow(1 - p, 4)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduce]);
  return value;
}

/* ── Sparkline ── */
function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${100 - (v / max) * 100}`).join(" ");
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-16 h-7">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const areaPoints = [30, 45, 38, 60, 52, 75, 68, 82, 74, 90, 83, 95, 100, 88, 110];

function AreaChart({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${100 - (v / max) * 80}`).join(" ");
  const first = `0,${100 - (values[0] / max) * 80}`;
  const last = `100,${100 - (values[values.length - 1] / max) * 80}`;
  const area = `${first} ${pts} ${last} 100,100 0,100`;
  return (
    <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
      <defs>
        <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4C5EE6" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#4C5EE6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#heroArea)" />
      <polyline points={pts} fill="none" stroke="#4C5EE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const statTiles = [
  { label: "Total spend", value: "$4,820", delta: "+12%", up: true, bad: true,  spark: [40,55,45,70,65,80,72,90] },
  { label: "Active devs", value: "11",     delta: "+2",   up: true, bad: false, spark: [30,40,35,50,45,60,55,65] },
  { label: "Sessions",    value: "342",    delta: "+18%", up: true, bad: false, spark: [50,60,55,70,65,80,75,85] },
  { label: "Shipped",     value: "78%",    delta: "+3%",  up: true, bad: false, spark: [60,65,62,70,68,75,72,80] },
];

const insightRows = [
  { label: "Large CLAUDE.md · api-service", value: "$18/dev/day", type: "bad" },
  { label: "Cache hit rate 23% · 6 repos",  value: "−$340/mo",   type: "bad" },
  { label: "2 idle seats detected",          value: "$240/mo",    type: "warn" },
];

function DashboardMockup() {
  return (
    <div className="relative w-full overflow-hidden bg-[var(--soft)]">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-[var(--border)]">
        <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        <div className="flex-1 mx-4 bg-[var(--inset)] rounded-md h-6 flex items-center justify-center px-3">
          <span className="text-[10px] text-[var(--text-3)] font-mono">app.planckspace.dev/overview</span>
        </div>
      </div>

      {/* Dashboard layout */}
      <div className="flex" style={{ minHeight: 380 }}>
        {/* Sidebar */}
        <div className="w-44 bg-white border-r border-[var(--border)] p-3 shrink-0 hidden sm:block">
          <div className="flex items-center gap-2 mb-6 px-1">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--blue-500)] to-[var(--blue-700)] flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-[2px]" />
            </div>
            <span className="text-[11px] font-bold text-[var(--ink)]">Planckspace</span>
          </div>
          {[
            { label: "Overview", active: true },
            { label: "Sessions", active: false },
            { label: "Insights", active: false },
            { label: "Wasted spend", active: false },
            { label: "Reconciliation", active: false },
            { label: "Reports", active: false },
          ].map((item) => (
            <div
              key={item.label}
              className={`px-2.5 py-2 rounded-md mb-0.5 text-[11px] font-medium ${
                item.active ? "bg-[var(--blue-50)] text-[var(--blue-700)]" : "text-[var(--text-3)]"
              }`}
            >
              {item.label}
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="flex-1 p-4 overflow-hidden">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[var(--ink)]">Overview</span>
              <span className="text-[11px] text-[var(--text-3)] ml-2 font-mono">last 30 days</span>
            </div>
            <div className="text-[10px] bg-[var(--green-50)] text-[var(--green-700)] border border-[var(--green-100)] px-2.5 py-0.5 rounded-full font-mono font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--green-500)]" />
              Live
            </div>
          </div>

          {/* Stat tiles */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 mb-3">
            {statTiles.map((tile) => (
              <div key={tile.label} className="bg-white rounded-xl border border-[var(--border)] px-3 py-2.5">
                <div className="text-[9px] text-[var(--text-3)] mb-1.5 font-medium uppercase tracking-wide">{tile.label}</div>
                <div className="flex items-end justify-between">
                  <span className="text-base font-bold text-[var(--ink)] font-mono">{tile.value}</span>
                  <Sparkline values={tile.spark} color={tile.bad && tile.up ? "#F0552A" : "#12A565"} />
                </div>
                <div className={`flex items-center gap-0.5 mt-1.5 text-[9px] font-medium ${tile.bad && tile.up ? "text-[var(--coral-500)]" : "text-[var(--green-500)]"}`}>
                  {tile.up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  {tile.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-2.5">
            <div className="xl:col-span-2 bg-white rounded-xl border border-[var(--border)] p-3.5">
              <div className="text-[9px] text-[var(--text-3)] font-medium mb-2 uppercase tracking-wide">Daily spend · 30d</div>
              <div className="h-24"><AreaChart values={areaPoints} /></div>
            </div>
            <div className="bg-white rounded-xl border border-[var(--border)] p-3.5">
              <div className="text-[9px] text-[var(--text-3)] font-medium mb-2.5 uppercase tracking-wide">Cost insights</div>
              <div className="space-y-2">
                {insightRows.map((row) => (
                  <div key={row.label} className="flex items-start gap-1.5">
                    <span className={`mt-1 shrink-0 w-1.5 h-1.5 rounded-full ${row.type === "bad" ? "bg-[var(--coral-500)]" : "bg-[var(--amber-500)]"}`} />
                    <div>
                      <div className="text-[9px] text-[var(--ink)] leading-tight font-medium">{row.label}</div>
                      <div className={`text-[9px] font-mono font-bold ${row.type === "bad" ? "text-[var(--coral-500)]" : "text-[var(--amber-500)]"}`}>{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Token packets arriving at the dashboard's left edge ── */
function IngestDots() {
  return (
    <div className="hidden lg:block pointer-events-none absolute left-0 top-0 bottom-0 w-px z-10">
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-[var(--blue-500)]"
          style={{ top: `${24 + i * 16}%`, left: -64, boxShadow: "0 0 8px rgba(76,94,230,0.7)" }}
          animate={{ x: [0, 60], opacity: [0, 1, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, delay: i * 0.55, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const metered = useCountUp(14_820_344, 2200);

  return (
    <section className="section s-hero relative pt-32 sm:pt-40 pb-20 sm:pb-28 overflow-hidden bg-white grain">
      {/* ── Animated flow field — token streams converging into the dashboard ── */}
      <FlowField className="text-[var(--blue-500)] opacity-80 [mask-image:radial-gradient(118%_118%_at_72%_42%,black_20%,transparent_78%)]" />

      {/* Soft glow behind the product */}
      <div
        className="absolute right-[-8%] top-[10%] w-[640px] h-[520px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(76,94,230,0.16), transparent 70%)", animation: "drift-a 22s ease-in-out infinite" }}
      />
      {/* Faint dot grid behind the headline */}
      <div className="absolute inset-0 dot-grid opacity-[0.3] pointer-events-none [mask-image:radial-gradient(ellipse_42%_40%_at_20%_28%,black,transparent_72%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] gap-12 lg:gap-8 items-center">
        {/* ── LEFT — editorial copy column ── */}
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="tag">
              <span className="tag-dot" />
              <span className="tracking-[0.02em] text-[var(--text-2)]">Claude Code · Cursor · Windsurf</span>
            </span>
          </motion.div>

          <motion.h1
            variants={wordContainer}
            initial="hidden"
            animate="show"
            className="display mt-7 text-[clamp(2.3rem,1.1rem+2.9vw,3.95rem)] leading-[0.98] tracking-[-0.035em]"
          >
            <Words text="Stop guessing" />
            <br className="hidden sm:block" />{" "}
            <Words text="what" />
            <Words text="AI costs" className="text-[var(--blue-600)]" />
            <Words text="your team." />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
            className="lead mt-6 max-w-md"
          >
            PlanckSpace tracks every token your team spends in Claude Code, Cursor, and
            Windsurf — surfaced in one shared spend dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.55 }}
            className="mt-9 flex flex-col sm:flex-row sm:items-center gap-3"
          >
            <Link href="#get-started" className="btn-primary sheen w-full sm:w-auto">
              Get started free
              <span className="btn-icon"><ArrowRight className="w-3.5 h-3.5" /></span>
            </Link>
            <Link href="#how-it-works" className="btn-secondary w-full sm:w-auto">
              See how it works
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-[var(--text-3)]"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--blue-500)]" /> Reads metadata only
            </span>
            <span className="hidden sm:inline w-px h-3.5 bg-[var(--border-strong)]" />
            <span className="inline-flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[var(--blue-500)]" /> Live in 5 minutes
            </span>
            <span className="hidden sm:inline w-px h-3.5 bg-[var(--border-strong)]" />
            <span>No credit card</span>
          </motion.div>

          {/* Live token meter — reinforces the "flow into visibility" concept */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-white/70 backdrop-blur px-4 py-2 shadow-[var(--shadow-xs)]"
          >
            <span className="relative flex h-2 w-2">
              {!reduce && <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--green-500)] opacity-60 animate-ping" />}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--green-500)]" />
            </span>
            <span className="font-mono text-[12.5px] text-[var(--ink)] tabular-nums font-semibold">
              {metered.toLocaleString("en-US")}
            </span>
            <span className="font-mono text-[12px] text-[var(--text-3)]">tokens metered across teams today</span>
          </motion.div>
        </div>

        {/* ── RIGHT — product (flat, clean), fed by the data streams ── */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.95, ease: EASE, delay: 0.45 }}
          className="relative will-rise"
        >
          {/* Ingest glow at the seam where streams meet the product */}
          <div
            className="hidden lg:block pointer-events-none absolute -left-6 top-1/4 bottom-1/4 w-12 rounded-full blur-2xl"
            style={{ background: "radial-gradient(ellipse at center, rgba(76,94,230,0.32), transparent 70%)" }}
          />
          {!reduce && <IngestDots />}

          <div className="relative bezel shadow-[var(--shadow-product)]">
            <div className="bezel-core">
              <DashboardMockup />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
