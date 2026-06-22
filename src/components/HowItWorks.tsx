"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Download, PuzzleIcon, Users, Check } from "lucide-react";

/* ════════ Typing terminal (step 1) ════════ */
function useTypingLines(lines: string[], inView: boolean, speed = 22) {
  const [revealed, setRevealed] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
  }, [inView]);

  useEffect(() => {
    if (!started.current || currentLine >= lines.length) return;
    const line = lines[currentLine];
    if (currentChar < line.length) {
      const t = setTimeout(() => setCurrentChar((c) => c + 1), speed);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setRevealed((r) => [...r, line]);
      setCurrentLine((l) => l + 1);
      setCurrentChar(0);
    }, 240);
    return () => clearTimeout(t);
  }, [currentChar, currentLine, lines, speed]);

  const activePartial = currentLine < lines.length ? lines[currentLine].slice(0, currentChar) : null;
  return { revealed, activePartial, done: currentLine >= lines.length };
}

function TerminalVisual({ inView }: { inView: boolean }) {
  const cmds = ["curl -fsSL https://planckspace.dev/install | sh", "planck init && planck scan"];
  const { revealed, activePartial, done } = useTypingLines(cmds, inView, 20);
  return (
    <div className="terminal w-full">
      <div className="terminal-bar">
        <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        <span className="ml-3 text-[11px] text-[#6B7280] font-mono">zsh — planckspace</span>
      </div>
      <div className="p-5 space-y-2 min-h-[150px]">
        {revealed.map((cmd, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="code-block text-xs text-[#8194F6] shrink-0">$</span>
            <span className="code-block text-xs text-[#E2E8F0] break-all">{cmd}</span>
          </div>
        ))}
        {activePartial !== null && (
          <div className="flex items-start gap-2">
            <span className="code-block text-xs text-[#8194F6] shrink-0">$</span>
            <span className="code-block text-xs text-[#E2E8F0] break-all">{activePartial}{!done && <span className="cursor-blink" />}</span>
          </div>
        )}
        {done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="pt-1 space-y-1">
            <div className="code-block text-xs text-[#64748B]">✓ Ingested 1,284 sessions across 6 repos</div>
            <div className="code-block text-xs" style={{ color: "#A7B6FB" }}>→ This month: $847.20 · ↑ 12%</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ════════ VS Code mock (step 2) ════════ */
function VSCodeVisual() {
  const bars = [40, 55, 48, 70, 62, 84, 96];
  const max = Math.max(...bars);
  return (
    <div className="rounded-2xl overflow-hidden border border-[#1E2230] bg-[#0C0E16] shadow-[var(--shadow-md)]">
      {/* title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#141826] border-b border-[#1E2230]">
        <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        <span className="ml-3 text-[11px] text-[#6B7280] font-mono">api-service — Visual Studio Code</span>
      </div>
      <div className="flex min-h-[300px]">
        {/* activity bar */}
        <div className="w-11 bg-[#080A11] border-r border-[#1E2230] py-3 flex flex-col items-center gap-4 shrink-0">
          {["#3a3f4d", "#3a3f4d", "#6175EE", "#3a3f4d"].map((c, i) => (
            <div key={i} className="w-5 h-5 rounded" style={{ background: c, opacity: c === "#6175EE" ? 1 : 0.5 }} />
          ))}
        </div>
        {/* PlanckSpace sidebar */}
        <div className="w-[58%] sm:w-[55%] bg-[#10131C] border-r border-[#1E2230] p-3.5 shrink-0">
          <div className="text-[10px] font-mono tracking-widest text-[#6B7280] mb-3">PLANCKSPACE</div>
          <div className="rounded-lg bg-[#171B25] border border-[#242838] p-3 mb-3">
            <div className="text-[9px] font-mono text-[#6B7280] mb-1 uppercase tracking-wide">Today&apos;s spend</div>
            <div className="flex items-end justify-between">
              <span className="text-xl font-bold font-mono text-white">$14.20</span>
              <span className="text-[10px] font-mono text-[#5DD6A0]">3 sessions</span>
            </div>
            <div className="flex items-end gap-1 h-10 mt-2.5">
              {bars.map((b, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height: `${(b / max) * 100}%`, background: i === bars.length - 1 ? "#6175EE" : "#2E3346" }} />
              ))}
            </div>
          </div>
          {[
            { t: "Cache hit rate 23%", v: "−$340/mo", c: "#F0552A" },
            { t: "Large CLAUDE.md", v: "−$18/day", c: "#F59E0B" },
          ].map((r) => (
            <div key={r.t} className="flex items-center justify-between rounded-lg bg-[#171B25] border border-[#242838] px-2.5 py-2 mb-1.5">
              <span className="text-[10px] text-[#CBD5E1]">{r.t}</span>
              <span className="text-[10px] font-mono font-bold" style={{ color: r.c }}>{r.v}</span>
            </div>
          ))}
        </div>
        {/* faux editor */}
        <div className="flex-1 p-4 hidden sm:block">
          <div className="space-y-2">
            {[70, 45, 88, 60, 40, 76, 52, 30, 64].map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-[#3a3f4d] w-4">{i + 1}</span>
                <div className="h-1.5 rounded-full" style={{ width: `${w}%`, background: i % 3 === 0 ? "#2E3346" : "#1E2230" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════ Team dashboard mock (step 3) ════════ */
function TeamVisual() {
  const members = [
    { n: "Alice Chen", r: "Lead", spend: 92, val: "$48", tone: "var(--coral-500)" },
    { n: "Marcus Lee", r: "Senior", spend: 64, val: "$31", tone: "var(--blue-600)" },
    { n: "Priya Nair", r: "Dev", spend: 47, val: "$22", tone: "var(--blue-500)" },
    { n: "Tom Reyes", r: "Dev", spend: 33, val: "$15", tone: "var(--blue-400)" },
  ];
  const initials = (n: string) => n.split(" ").map((x) => x[0]).join("");
  return (
    <div className="rounded-2xl overflow-hidden border border-[var(--border)] bg-white shadow-[var(--shadow-md)]">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] bg-[var(--soft)]">
        <div>
          <div className="text-[13px] font-bold text-[var(--ink)]">Acme Engineering</div>
          <div className="mono-label">Workspace · 4 of 6 connected</div>
        </div>
        <span className="text-[11px] font-semibold text-white bg-[var(--blue-600)] rounded-full px-3 py-1.5">+ Invite</span>
      </div>
      <div className="p-4 space-y-2">
        {members.map((m, i) => (
          <motion.div
            key={m.n}
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-3.5 py-3"
          >
            <span className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: m.tone }}>
              {initials(m.n)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-[var(--ink)] truncate">{m.n}</span>
                <span className="text-[9px] font-mono uppercase tracking-wide text-[var(--text-3)] border border-[var(--border)] rounded px-1.5 py-0.5">{m.r}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--inset)] mt-1.5 overflow-hidden">
                <motion.div className="h-full rounded-full" initial={{ width: 0 }} whileInView={{ width: `${m.spend}%` }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.08 }} style={{ background: m.tone }} />
              </div>
            </div>
            <span className="text-[13px] font-bold font-mono text-[var(--ink)] shrink-0">{m.val}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ════════ Steps ════════ */
const steps = [
  {
    number: "01",
    icon: Download,
    title: "Install the CLI",
    body: "One curl command installs the PlanckSpace CLI and initializes the local session store. It reads AI editor history from your machine — nothing leaves until you say so.",
    points: ["macOS / Linux · Windows via WSL", "Reads local editor history only", "Zero config to get started"],
  },
  {
    number: "02",
    icon: PuzzleIcon,
    title: "Open the VS Code extension",
    body: "The extension reads from the same local database. Spend, cost insights, skill recommendations, and your audit score appear in a sidebar the moment you open your editor.",
    points: ["Works in VS Code, Cursor & Windsurf", "Also on Open VSX", "Today's spend in your status bar"],
  },
  {
    number: "03",
    icon: Users,
    title: "See your team dashboard",
    body: "Share a workspace invite. Developers connect their CLI in 30 seconds. Leadership and managers get real-time spend analytics, alerts, and reconciliation — no data pipeline needed.",
    points: ["Role-based views for every seat", "Real-time team spend & alerts", "Billing reconciliation built in"],
  },
];

function StepBlock({ step, index, isLast }: { step: typeof steps[0]; index: number; isLast: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const Icon = step.icon;

  const visual =
    index === 0 ? <TerminalVisual inView={inView} /> :
    index === 1 ? <VSCodeVisual /> :
    <TeamVisual />;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
      className="relative pl-16 sm:pl-24 pb-16 sm:pb-24 last:pb-0"
    >
      {/* Spine */}
      {!isLast && (
        <span className="absolute left-[18px] sm:left-[26px] top-12 bottom-0 w-px bg-gradient-to-b from-[var(--blue-300)] to-[var(--border)]" />
      )}
      {/* Node */}
      <span className="absolute left-0 top-0 w-9 h-9 sm:w-[52px] sm:h-[52px] rounded-2xl bg-white border border-[var(--blue-100)] shadow-[var(--shadow-sm)] flex items-center justify-center">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--blue-600)]" />
      </span>

      {/* Copy */}
      <div className="flex items-baseline gap-3 mb-3">
        <span className="font-mono text-[12px] font-bold text-[var(--blue-600)] tracking-[0.1em]">{step.number}</span>
        <span className="h-px w-8 bg-[var(--border-strong)]" />
        <span className="mono-label">Step {step.number}</span>
      </div>
      <h3 className="text-[26px] sm:text-[32px] font-bold text-[var(--ink)] tracking-tight mb-3 leading-[1.05]">{step.title}</h3>
      <p className="text-[var(--text-2)] text-[15.5px] leading-relaxed max-w-lg mb-5">{step.body}</p>

      {/* Bullets as pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {step.points.map((p) => (
          <span key={p} className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--text-2)] bg-[var(--soft)] border border-[var(--border)] rounded-full pl-2 pr-3 py-1.5">
            <span className="w-4 h-4 rounded-full flex items-center justify-center bg-[var(--blue-50)] border border-[var(--blue-100)]">
              <Check className="w-2.5 h-2.5 text-[var(--blue-600)]" />
            </span>
            {p}
          </span>
        ))}
      </div>

      {/* Visual */}
      <div className="bezel max-w-2xl">
        <div className="bezel-core">{visual}</div>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section s-how py-24 sm:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="max-w-2xl mb-16 sm:mb-20"
        >
          <h2 className="h-section text-[36px] sm:text-[52px] text-balance">
            Up and running in under 5 minutes
          </h2>
          <p className="mt-6 text-[var(--text-2)] text-[17px] leading-relaxed">
            No infrastructure to manage, no data pipeline to build. PlanckSpace reads what
            your editors already write to disk.
          </p>
        </motion.div>

        <div>
          {steps.map((step, i) => (
            <StepBlock key={step.number} step={step} index={i} isLast={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
