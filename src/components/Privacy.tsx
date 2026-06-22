"use client";

import { motion } from "framer-motion";
import { Lock, Database, WifiOff, Eye } from "lucide-react";

const pillars = [
  { icon: Lock, title: "Read-only local file", body: "Opens ~/.planckspace/local.db read-only. Never writes to your AI editor's files." },
  { icon: Eye, title: "Metadata only", body: "Only model, token counts, cost, duration, and repo name. No prompts, no code, no responses." },
  { icon: WifiOff, title: "Works fully offline", body: "Dashboard, insights, and audit all work without a network connection. Sync is always opt-in." },
  { icon: Database, title: "You control the sync", body: "Data goes to planckspace.dev only when you connect a workspace token. Revoke access any time." },
];

export default function Privacy() {
  return (
    <section className="section s-privacy py-24 sm:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[34px] overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-[var(--shadow-float)] border border-[var(--border)]">
          {/* Left — ink panel (the deliberate dark moment) */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-10 sm:p-12 lg:p-14 flex flex-col justify-center overflow-hidden noise-bg"
            style={{ background: "#0C0D14" }}
          >
            {/* blue glow */}
            <div
              className="absolute -top-24 -left-16 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(76,94,230,0.40) 0%, transparent 70%)", animation: "drift-b 22s ease-in-out infinite" }}
            />
            <div
              className="absolute -bottom-20 right-0 w-72 h-72 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(97,117,238,0.18) 0%, transparent 70%)", animation: "drift-c 26s ease-in-out infinite" }}
            />

            <span className="relative inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--blue-300)] mb-6">
              <span className="w-[22px] h-px bg-[var(--blue-400)]" />Privacy-first
            </span>
            <h2 className="relative text-[34px] sm:text-[44px] font-semibold leading-[1.04] tracking-tight text-white mb-5">
              We never see your code.{" "}
              <span className="text-white/40">Ever.</span>
            </h2>
            <p className="relative text-white/65 text-[16px] leading-relaxed mb-8 max-w-md">
              PlanckSpace is built on one principle: total visibility into costs, zero
              visibility into content. Your prompts, code, and AI responses never leave
              your machine.
            </p>
            <div className="relative inline-flex items-center gap-2 text-[12px] font-mono bg-white/[0.07] border border-white/15 text-white/90 px-4 py-2.5 rounded-full w-fit">
              <Lock className="w-3.5 h-3.5 text-[var(--green-500)]" />
              No prompts · No code · No file contents
            </div>
          </motion.div>

          {/* Right — pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--border)]">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="bg-white p-7 sm:p-8 hover:bg-[var(--blue-50)]/50 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-2xl bg-[var(--blue-50)] border border-[var(--blue-100)] flex items-center justify-center mb-4">
                  <p.icon className="w-[18px] h-[18px] text-[var(--blue-600)]" />
                </div>
                <h4 className="text-[15px] font-semibold text-[var(--ink)] mb-2">{p.title}</h4>
                <p className="text-[13px] text-[var(--text-2)] leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
