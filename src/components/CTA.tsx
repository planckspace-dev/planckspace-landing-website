"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Terminal, Check, Copy } from "lucide-react";
import { useState } from "react";

const perks = [
  "Free forever for individual devs",
  "No code access, ever",
  "Works offline",
  "Up and running in 5 minutes",
];

const terminalLines = [
  { prompt: "$", cmd: "curl -fsSL https://planckspace.dev/install | sh", out: false },
  { prompt: "$", cmd: "planck init && planck scan", out: false },
  { prompt: "",  cmd: "✓  Ingested 1,284 sessions across 6 repos", out: true, color: "#6B7280" },
  { prompt: "",  cmd: "✓  Synced to workspace  Dev Org", out: true, color: "#6B7280" },
  { prompt: "",  cmd: "→  This month: $847.20  ↑ 12%", out: true, color: "#A7B6FB" },
];

export default function CTA() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText("curl -fsSL https://planckspace.dev/install | sh");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section id="get-started" className="section s-cta py-24 sm:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-[34px] overflow-hidden border border-[var(--border)] shadow-[var(--shadow-float)] grid grid-cols-1 lg:grid-cols-2"
        >
          {/* Left — blue panel */}
          <div className="accent-gradient p-10 sm:p-14 flex flex-col justify-center relative overflow-hidden noise-bg">
            <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-white/12 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-[var(--blue-900)]/40 blur-3xl pointer-events-none" />

            <h2 className="relative text-[34px] sm:text-[46px] font-semibold text-white leading-[1.04] tracking-tight mb-5">
              Your AI spend,<br />visible from day one.
            </h2>
            <p className="relative text-white/80 text-[17px] leading-relaxed mb-8 max-w-md">
              Install the CLI in 30 seconds and see your first session cost in VS Code
              before your next AI prompt. No account needed.
            </p>

            <ul className="relative space-y-3 mb-9">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-3 text-[14px] text-white/90">
                  <span className="w-5 h-5 rounded-full bg-white/18 flex items-center justify-center shrink-0 border border-white/25">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <div className="relative flex flex-col sm:flex-row gap-3">
              <Link
                href="https://app.planckspace.dev"
                className="group flex items-center justify-center gap-2 bg-white text-[var(--blue-700)] font-semibold text-sm pl-6 pr-2 py-2.5 rounded-full hover:bg-white/90 transition-colors shadow-[var(--shadow-md)]"
              >
                Get started free
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--blue-50)] group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-4 h-4 text-[var(--blue-700)]" />
                </span>
              </Link>
              <Link
                href="mailto:hello@planckspace.dev"
                className="flex items-center justify-center gap-2 text-white/85 hover:text-white text-sm font-medium border border-white/30 hover:border-white/55 px-6 py-2.5 rounded-full transition-colors"
              >
                Talk to us
              </Link>
            </div>
          </div>

          {/* Right — terminal panel */}
          <div className="bg-[#0A0C13] p-10 sm:p-14 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[var(--blue-600)]/14 blur-3xl pointer-events-none" />

            <div className="relative mono-label !text-[#6B7280] mb-5">Quick start</div>

            <div className="relative terminal mb-6">
              <div className="terminal-bar">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                <span className="ml-3 text-[11px] text-[#6B7280] font-mono">terminal</span>
              </div>
              <div className="p-5 space-y-2.5">
                {terminalLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.4 + i * 0.12 }}
                    className="flex items-start gap-2"
                  >
                    {!line.out && <span className="code-block text-xs text-[#8194F6] shrink-0 mt-0.5">{line.prompt}</span>}
                    <span className="code-block text-xs break-all" style={{ color: line.color ?? "#CBD5E1" }}>{line.cmd}</span>
                  </motion.div>
                ))}
                <div className="flex items-center gap-2 mt-1">
                  <span className="code-block text-xs text-[#8194F6]">$</span>
                  <span className="cursor-blink" />
                </div>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="relative flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-full px-4 py-3 hover:border-[var(--blue-500)]/50 hover:bg-white/[0.07] transition-all duration-200 cursor-pointer group text-left w-full"
            >
              <Terminal className="w-4 h-4 text-[#8194F6] shrink-0" />
              <code className="code-block text-xs text-[#94A3B8] flex-1 truncate">curl -fsSL https://planckspace.dev/install | sh</code>
              <span className={`flex items-center gap-1 text-[10px] font-mono transition-colors shrink-0 ${copied ? "text-[var(--green-500)]" : "text-[#4B5563] group-hover:text-[#8E8E96]"}`}>
                {copied ? <><Check className="w-3 h-3" /> copied</> : <><Copy className="w-3 h-3" /> copy</>}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
