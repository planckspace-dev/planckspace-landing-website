"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ── Count-up ── */
function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function useCountUp(target: number, duration = 1600) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTs: number | null = null;
    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      setValue(Math.floor(easeOutQuart(progress) * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { value, ref };
}

const stats = [
  { raw: 1000000, display: (v: number) => (v >= 1000000 ? "1M+" : `${Math.floor(v / 1000)}K`), label: "Sessions tracked" },
  { raw: 0,       display: () => "$0",                  label: "Code ever read" },
  { raw: 3,       display: (v: number) => String(v),    label: "Editors supported" },
  { raw: 5,       display: (v: number) => `${v} min`,   label: "To first insight" },
];

function StatCounter({ raw, display, label }: { raw: number; display: (v: number) => string; label: string }) {
  const { value, ref } = useCountUp(raw, raw > 100 ? 1500 : 900);
  return (
    <div ref={ref} className="text-center">
      <div className="text-[32px] sm:text-[42px] font-bold text-[var(--ink)] font-mono tracking-tight tabular-nums">
        {display(value)}
      </div>
      <div className="text-[13px] text-[var(--text-3)] mt-2 font-medium">{label}</div>
    </div>
  );
}

const editorItems = [
  { name: "Claude Code", dot: "#D97706" },
  { name: "Cursor", dot: "#1A1A1A" },
  { name: "Windsurf", dot: "#0284C7" },
  { name: "VS Code", dot: "#007ACC" },
  { name: "GitHub Copilot", dot: "#6E40C9" },
  { name: "Codeium", dot: "#09B6A2" },
];

export default function LogoBar() {
  return (
    <section className="section s-logos border-y border-[var(--border)] bg-[var(--soft)] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        {/* Marquee */}
        <div className="relative mb-14">
          <p className="text-center mono-label mb-7">Works with the tools your team already uses</p>
          <div className="absolute left-0 bottom-0 top-10 w-24 z-10 bg-gradient-to-r from-[var(--soft)] to-transparent pointer-events-none" />
          <div className="absolute right-0 bottom-0 top-10 w-24 z-10 bg-gradient-to-l from-[var(--soft)] to-transparent pointer-events-none" />
          <div className="flex items-center overflow-hidden">
            <div className="marquee-track">
              {[...editorItems, ...editorItems].map((e, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 mx-8 shrink-0 text-[15px] font-semibold text-[var(--text-2)]"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: e.dot }} />
                  {e.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats with hairline dividers */}
        <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x divide-[var(--border-strong)]">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: [0.23, 1, 0.32, 1] }}
              className="px-4 py-4"
            >
              <StatCounter raw={stat.raw} display={stat.display} label={stat.label} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
