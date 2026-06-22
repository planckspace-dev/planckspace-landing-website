"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  BarChart3, Lightbulb, ShieldCheck, BookOpen, GitBranch, Bell,
  TrendingDown, ArrowUpRight, Wrench, Check, TrendingUp,
} from "lucide-react";

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number];
const AUTOPLAY = 5400; // ms per feature when cycling

/* ── Accent system ──
   One accent locked across the whole page: blue. Every key resolves to
   the blue scale so feature chrome stays uniform; only genuinely
   semantic states (overspend = coral, savings = green, warning = amber)
   keep their colour, and only inside the data-viz previews. */
type Accent = "violet" | "coral" | "green" | "blue" | "amber";
const BLUE_ACCENT = { fg: "var(--blue-600)", soft: "var(--blue-50)", border: "var(--blue-100)", ring: "var(--blue-200)" };
const ACCENTS: Record<Accent, { fg: string; soft: string; border: string; ring: string }> = {
  violet: BLUE_ACCENT,
  coral:  BLUE_ACCENT,
  green:  BLUE_ACCENT,
  blue:   BLUE_ACCENT,
  amber:  BLUE_ACCENT,
};

/* ════════ Preview visuals ════════ */

function SpendPreview({ a }: { a: Accent }) {
  const c = ACCENTS[a].fg;
  const pts = [30, 42, 36, 55, 48, 70, 62, 80, 72, 92, 84, 100, 90, 78, 96];
  const max = Math.max(...pts);
  const line = pts.map((v, i) => `${(i / (pts.length - 1)) * 100},${100 - (v / max) * 82}`).join(" ");
  const area = `0,100 ${line} 100,100`;
  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { l: "Today", v: "$14.20", d: "+8%" },
          { l: "This week", v: "$96.40", d: "+12%" },
          { l: "Avg / dev", v: "$38", d: "−4%" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-[var(--border)] bg-white px-3.5 py-3">
            <div className="mono-label mb-1.5">{s.l}</div>
            <div className="text-lg font-bold font-mono text-[var(--ink)]">{s.v}</div>
            <div className="text-[10px] font-mono mt-0.5" style={{ color: s.d.startsWith("−") ? "var(--green-700)" : c }}>{s.d}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="mono-label">Daily spend · 30d</span>
          <span className="text-[11px] font-mono font-semibold" style={{ color: c }}>$4,820 total</span>
        </div>
        <div className="h-32 relative">
          <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id={`g-${a}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c} stopOpacity="0.22" />
                <stop offset="100%" stopColor={c} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={area} fill={`url(#g-${a})`} />
            <polyline points={line} fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function InsightsPreview({ a }: { a: Accent }) {
  const c = ACCENTS[a].fg;
  const rows = [
    { t: "Oversized CLAUDE.md", s: "api-service · 6,200 tokens", v: "$18/day", fix: "Split into 3 files" },
    { t: "Low cache hit rate", s: "23% across 6 repos", v: "$340/mo", fix: "Enable prompt caching" },
    { t: "Repeated context reload", s: "12 sessions affected", v: "$60/mo", fix: "Pin shared context" },
  ];
  return (
    <div className="p-6">
      <div className="rounded-xl p-4 mb-4 flex items-center justify-between" style={{ background: ACCENTS[a].soft, border: `1px solid ${ACCENTS[a].border}` }}>
        <div>
          <div className="mono-label" style={{ color: c }}>Potential savings</div>
          <div className="text-2xl font-bold font-mono mt-1" style={{ color: c }}>$460<span className="text-sm">/mo</span></div>
        </div>
        <TrendingDown className="w-8 h-8" style={{ color: c }} />
      </div>
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.t} className="rounded-xl border border-[var(--border)] bg-white p-3.5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-[13px] font-semibold text-[var(--ink)]">{r.t}</div>
                <div className="text-[11px] text-[var(--text-3)]">{r.s}</div>
              </div>
              <span className="text-[12px] font-mono font-bold" style={{ color: c }}>−{r.v}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium rounded-md px-2 py-1" style={{ color: c, background: ACCENTS[a].soft }}>
              <Wrench className="w-3 h-3" /> {r.fix}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditPreview({ a }: { a: Accent }) {
  const c = ACCENTS[a].fg;
  const value = 72;
  const r = 52, circ = 2 * Math.PI * r, off = circ * (1 - value / 100);
  const dims = [
    { l: "CLAUDE.md budget", p: 85 },
    { l: "Cache hit rate", p: 40 },
    { l: "Hooks", p: 100 },
    { l: "Skills", p: 60 },
    { l: "MCP servers", p: 75 },
  ];
  return (
    <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
      <div className="relative shrink-0">
        <svg viewBox="0 0 140 140" className="w-36 h-36 -rotate-90">
          <circle cx="70" cy="70" r={r} fill="none" stroke="var(--inset-2)" strokeWidth="11" />
          <motion.circle
            cx="70" cy="70" r={r} fill="none" stroke={c} strokeWidth="11" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: off }}
            transition={{ duration: 1.1, ease: EASE }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold font-mono text-[var(--ink)]">{value}</span>
          <span className="text-[11px] font-mono" style={{ color: c }}>/ 100 · Good</span>
        </div>
      </div>
      <div className="flex-1 w-full space-y-2.5">
        {dims.map((d) => (
          <div key={d.l}>
            <div className="flex justify-between mb-1">
              <span className="text-[12px] text-[var(--text-2)]">{d.l}</span>
              <span className="text-[11px] font-mono text-[var(--text-3)]">{d.p}%</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--inset)] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${d.p}%` }}
                transition={{ duration: 0.8, ease: EASE }}
                style={{ background: d.p >= 70 ? "var(--green-500)" : d.p >= 40 ? "var(--amber-500)" : "var(--coral-500)" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsPreview({ a }: { a: Accent }) {
  const c = ACCENTS[a].fg;
  const skills = [
    { n: "react-component", m: "98%", hi: true },
    { n: "sql-query", m: "94%", hi: true },
    { n: "test-writer", m: "72%", hi: false },
    { n: "docker-debug", m: "68%", hi: false },
    { n: "api-scaffold", m: "61%", hi: false },
    { n: "perf-audit", m: "55%", hi: false },
  ];
  return (
    <div className="p-6">
      <div className="mono-label mb-3" style={{ color: c }}>6 skills matched to your stack</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {skills.map((s) => (
          <div key={s.n} className="rounded-xl border border-[var(--border)] bg-white px-3.5 py-3 flex items-center justify-between">
            <div>
              <div className="text-[12px] font-mono text-[var(--ink)]">/{s.n}</div>
              <div className="text-[10px] mt-0.5" style={{ color: s.hi ? "var(--green-700)" : "var(--text-3)" }}>{s.m} match</div>
            </div>
            <span className="text-[11px] font-semibold rounded-lg px-2.5 py-1.5 flex items-center gap-1" style={{ color: c, background: ACCENTS[a].soft, border: `1px solid ${ACCENTS[a].border}` }}>
              Install
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeatsPreview({ a }: { a: Accent }) {
  const c = ACCENTS[a].fg;
  return (
    <div className="p-6">
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="mono-label mb-1">Seat utilization</div>
          <div className="text-2xl font-bold font-mono text-[var(--ink)]">68<span className="text-base">%</span></div>
        </div>
        <div className="rounded-lg px-3 py-2 text-right" style={{ background: ACCENTS[a].soft, border: `1px solid ${ACCENTS[a].border}` }}>
          <div className="text-[10px] font-mono" style={{ color: c }}>5 idle seats</div>
          <div className="text-sm font-bold font-mono" style={{ color: c }}>−$240/mo</div>
        </div>
      </div>
      <div className="grid grid-cols-8 gap-2 mb-4">
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.025 }}
            className="aspect-square rounded-md"
            style={{ background: i < 11 ? c : "var(--inset-2)" }}
          />
        ))}
      </div>
      <div className="flex gap-5 text-[12px]">
        <span className="flex items-center gap-1.5 text-[var(--text-2)]"><span className="w-2.5 h-2.5 rounded" style={{ background: c }} /> 11 active</span>
        <span className="flex items-center gap-1.5 text-[var(--text-3)]"><span className="w-2.5 h-2.5 rounded bg-[var(--inset-2)]" /> 5 idle</span>
      </div>
    </div>
  );
}

function AlertsPreview({ a }: { a: Accent }) {
  const items = [
    { t: "Spend spike detected", s: "alice@acme.com · $48 in 2h · 3× team avg", tone: "coral", icon: TrendingUp },
    { t: "Budget threshold reached", s: "api-service repo · $800 / $1,000 budget", tone: "amber", icon: Bell },
    { t: "Cache improvement", s: "Hit rate 23% → 61% · saved $180/mo", tone: "green", icon: Check },
  ];
  const tones: Record<string, { fg: string; soft: string; border: string }> = {
    coral: { fg: "var(--coral-700)", soft: "var(--coral-50)", border: "var(--coral-100)" },
    amber: { fg: "var(--amber-700)", soft: "var(--amber-50)", border: "var(--amber-100)" },
    green: { fg: "var(--green-700)", soft: "var(--green-50)", border: "var(--green-100)" },
  };
  return (
    <div className="p-6 space-y-3">
      <div className="mono-label mb-1" style={{ color: ACCENTS[a].fg }}>Live alert feed</div>
      {items.map((it, i) => {
        const t = tones[it.tone];
        return (
          <motion.div
            key={it.t}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.12 }}
            className="rounded-xl p-3.5 flex items-start gap-3"
            style={{ background: t.soft, border: `1px solid ${t.border}` }}
          >
            <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/70" style={{ border: `1px solid ${t.border}` }}>
              <it.icon className="w-4 h-4" style={{ color: t.fg }} />
            </span>
            <div>
              <div className="text-[13px] font-semibold" style={{ color: t.fg }}>{it.t}</div>
              <div className="text-[11px] text-[var(--text-2)] mt-0.5">{it.s}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ════════ Feature data ════════ */
type Feature = {
  icon: typeof BarChart3;
  label: string;
  title: string;
  body: string;
  accent: Accent;
  preview: (a: Accent) => React.ReactNode;
};

const features: Feature[] = [
  { icon: BarChart3,  label: "Live spend dashboard", title: "Real-time spend, per developer, repo, and day", body: "The VS Code sidebar shows today's cost at a glance. The team dashboard breaks spend down by engineer, project, model, and tool — updated every session.", accent: "violet", preview: (a) => <SpendPreview a={a} /> },
  { icon: Lightbulb,  label: "Cost insights", title: "Pinpoint exactly what inflates your bill", body: "Oversized CLAUDE.md files, low cache hit rates, repeated context reloads — each insight ships with an estimated monthly saving and a one-line fix.", accent: "coral", preview: (a) => <InsightsPreview a={a} /> },
  { icon: ShieldCheck, label: "Workspace audit", title: "Score your AI setup across 5 dimensions", body: "Rate your Claude Code config: token budget, cache hit rate, hooks, skills, and MCP coverage. Get a concrete score and the steps to improve it.", accent: "green", preview: (a) => <AuditPreview a={a} /> },
  { icon: BookOpen,   label: "Skill recommendations", title: "Turn top workflows into team habits", body: "Based on your repo's stack and session history, PlanckSpace recommends slash-command skills that fit your workflow. One click installs them.", accent: "blue", preview: (a) => <SkillsPreview a={a} /> },
  { icon: GitBranch,  label: "Seat efficiency", title: "Know which seats are actually used", body: "Per-seat utilization, idle-seat detection, and cull recommendations — so you stop paying for subscriptions that sit unused.", accent: "amber", preview: (a) => <SeatsPreview a={a} /> },
  { icon: Bell,       label: "Budget alerts", title: "Get notified before costs become a problem", body: "Set per-developer, per-repo, or team-wide thresholds. Alerts fire when spend spikes, with full context on the session that caused it.", accent: "violet", preview: (a) => <AlertsPreview a={a} /> },
];

/* ════════ Window frame around a preview ════════ */
function PreviewWindow({ index }: { index: number }) {
  const feat = features[index];
  const ac = ACCENTS[feat.accent];
  const Icon = feat.icon;
  return (
    <div className="relative">
      {/* accent glow */}
      <div
        className="absolute -inset-6 rounded-[36px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 28%, ${ac.ring}55 0%, transparent 70%)` }}
      />
      <div className="relative rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-float)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] bg-white">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: ac.soft, border: `1px solid ${ac.border}` }}>
              <Icon className="w-4 h-4" style={{ color: ac.fg }} />
            </span>
            <span className="text-[13px] font-semibold text-[var(--ink)]">{feat.label}</span>
          </div>
          <span className="text-[10px] font-mono flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ color: ac.fg, background: ac.soft }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ac.fg }} /> Live
          </span>
        </div>
        <div className="relative min-h-[420px] bg-gradient-to-b from-white to-[var(--soft)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.34, ease: EASE }}
            >
              {feat.preview(feat.accent)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ════════ Header ════════ */
function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: EASE }}
      className="max-w-2xl"
    >
      <span className="eyebrow eyebrow-accent">Features</span>
      <h2 className="h-fluid mt-6 text-balance">
        Everything your team needs to own AI spend
      </h2>
      <p className="lead mt-6 max-w-xl">
        Six capabilities, one shared source of truth. Pick any to explore — or
        watch them cycle.
      </p>
    </motion.div>
  );
}

export default function Features() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Self-advancing showcase. Pauses on hover / reduced-motion.
  useEffect(() => {
    if (reduce || paused) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % features.length), AUTOPLAY);
    return () => clearTimeout(t);
  }, [active, paused, reduce]);

  return (
    <section id="features" className="section s-features bg-[var(--soft)] border-y border-[var(--border)] py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />

        {/* ───────── Desktop: interactive showcase ───────── */}
        <div
          className="hidden lg:grid grid-cols-[0.84fr_1.16fr] gap-8 xl:gap-12 items-start mt-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Selector list */}
          <div>
            <div className="mono-label mb-4 flex items-center gap-2">
              <span style={{ color: ACCENTS[features[active].accent].fg }}>{String(active + 1).padStart(2, "0")}</span>
              <span className="text-[var(--text-3)]">/ {String(features.length).padStart(2, "0")}</span>
              <span className="ml-2 text-[var(--text-3)] normal-case tracking-normal">
                {paused ? "paused" : "auto"}
              </span>
            </div>

            <div className="space-y-2">
              {features.map((f, i) => {
                const on = i === active;
                const fa = ACCENTS[f.accent];
                return (
                  <button
                    key={f.label}
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className="group w-full text-left rounded-2xl border p-4 transition-all duration-300 cursor-pointer"
                    style={{
                      background: on ? "var(--surface)" : "transparent",
                      borderColor: on ? "var(--border)" : "transparent",
                      boxShadow: on ? "var(--shadow-md)" : "none",
                    }}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300"
                        style={{ background: on ? fa.soft : "var(--inset)", border: `1px solid ${on ? fa.border : "var(--border)"}` }}
                      >
                        <f.icon className="w-[19px] h-[19px] transition-colors duration-300" style={{ color: on ? fa.fg : "var(--text-3)" }} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="mono-label mb-0.5 transition-colors duration-300" style={{ color: on ? fa.fg : "var(--text-3)" }}>{f.label}</div>
                        <h3 className="text-[15px] font-semibold tracking-tight leading-snug transition-colors duration-300" style={{ color: on ? "var(--ink)" : "var(--text-2)" }}>
                          {f.title}
                        </h3>
                      </div>
                      <ArrowUpRight className="w-4 h-4 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: fa.fg, opacity: on ? 1 : 0 }} />
                    </div>

                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="text-[13px] text-[var(--text-2)] leading-relaxed pt-3 pl-[54px] pr-2">{f.body}</p>
                          {!reduce && (
                            <div className="mt-3.5 ml-[54px] mr-2 h-[3px] rounded-full bg-[var(--inset-2)] overflow-hidden">
                              <div
                                key={active}
                                className="h-full rounded-full origin-left"
                                style={{
                                  background: fa.fg,
                                  animation: `grow-x ${AUTOPLAY}ms linear`,
                                  animationPlayState: paused ? "paused" : "running",
                                }}
                              />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-28">
            <PreviewWindow index={active} />
          </div>
        </div>

        {/* ───────── Mobile: stacked ───────── */}
        <div className="lg:hidden mt-12 space-y-14">
          {features.map((f, i) => {
            const fa = ACCENTS[f.accent];
            return (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: fa.soft, border: `1px solid ${fa.border}` }}>
                    <f.icon className="w-[19px] h-[19px]" style={{ color: fa.fg }} />
                  </span>
                  <span className="mono-label" style={{ color: fa.fg }}>{f.label}</span>
                </div>
                <h3 className="text-[21px] font-bold text-[var(--ink)] tracking-tight mb-2 leading-tight">{f.title}</h3>
                <p className="text-[14px] text-[var(--text-2)] leading-relaxed mb-5">{f.body}</p>
                <PreviewWindow index={i} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
