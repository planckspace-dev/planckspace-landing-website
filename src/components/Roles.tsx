"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Users, Code2, DollarSign, TrendingDown, Activity, FileText, AlertTriangle, Cpu } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";

const roles = [
  {
    id: "cto",
    label: "CTOs",
    icon: Building2,
    headline: "Own the AI line item. Finally.",
    sub: "See total AI spend across every team, tool, and subscription. Compare metered usage against vendor invoices. Detect idle seats. Export reports.",
    metrics: [
      { icon: DollarSign, label: "Total spend", value: "$4,820", sub: "This month · all tools", tone: "ink" },
      { icon: TrendingDown, label: "Wasted spend", value: "$640", sub: "Low-utility sessions", tone: "coral" },
      { icon: Activity, label: "Seat efficiency", value: "68%", sub: "11 of 16 seats active", tone: "amber" },
      { icon: FileText, label: "Reconciliation gap", value: "$220", sub: "Billed vs tracked", tone: "coral" },
    ],
    bullets: [
      "Leadership dashboard with spend across all tools",
      "Subscription efficiency: active vs idle seat reports",
      "Billing reconciliation — metered usage vs invoices",
      "Monthly reports exportable to CSV",
    ],
  },
  {
    id: "manager",
    label: "Managers",
    icon: Users,
    headline: "Keep your team's AI ROI high.",
    sub: "See per-developer spend, catch anomalies before they blow up the budget, and surface insights that help everyone work more efficiently.",
    metrics: [
      { icon: Users, label: "Team avg / day", value: "$38", sub: "6 developers today", tone: "ink" },
      { icon: AlertTriangle, label: "Anomalies", value: "2", sub: "Unusual sessions flagged", tone: "coral" },
      { icon: Activity, label: "Productivity", value: "82/100", sub: "Shipped session ratio", tone: "green" },
      { icon: TrendingDown, label: "Savings avail.", value: "$280", sub: "If insights applied", tone: "amber" },
    ],
    bullets: [
      "Per-developer spend breakdown and team leaderboard",
      "Anomaly detection — flag sessions with cost spikes",
      "Productivity metrics: shipped vs abandoned ratios",
      "Wasted spend breakdown by category",
    ],
  },
  {
    id: "developer",
    label: "Developers",
    icon: Code2,
    headline: "Use AI better. Spend less.",
    sub: "See your own usage in VS Code, get personal insights that cut waste, and install skill recommendations matched to your workflow.",
    metrics: [
      { icon: DollarSign, label: "My spend today", value: "$12.40", sub: "3 sessions · 2 repos", tone: "ink" },
      { icon: Cpu, label: "Cache hit rate", value: "41%", sub: "Target: 60%+", tone: "coral" },
      { icon: Activity, label: "CLAUDE.md size", value: "6,200 tok", sub: "api-service repo", tone: "coral" },
      { icon: FileText, label: "Skills available", value: "4 new", sub: "Matched to your stack", tone: "blue" },
    ],
    bullets: [
      "VS Code status bar: today's spend and session count",
      "Personal insights: cache rate, context size, patterns",
      "Skill recommendations based on your repo and history",
      "Workspace audit: score your AI setup and improve it",
    ],
  },
];

const toneMap = {
  ink: "text-[var(--ink)]",
  coral: "text-[var(--coral-500)]",
  amber: "text-[var(--amber-500)]",
  green: "text-[var(--green-700)]",
  blue: "text-[var(--blue-600)]",
};

export default function Roles() {
  const [active, setActive] = useState("cto");
  const role = roles.find((r) => r.id === active)!;

  return (
    <section className="section s-roles py-24 sm:py-32 bg-[var(--soft)] border-y border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="h-section text-[36px] sm:text-[52px] text-balance">
            The right view for every seat
          </h2>
          <p className="mt-6 text-[var(--text-2)] text-[17px] leading-relaxed">
            Role-gated dashboards so leadership, managers, and developers each see exactly
            what they need — nothing more, nothing less.
          </p>
        </motion.div>

        {/* Tab bar */}
        <div className="flex justify-center mb-10">
          <div className="flex gap-1 bg-white border border-[var(--border)] rounded-full p-1.5 shadow-[var(--shadow-sm)]">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setActive(r.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  active === r.id ? "bg-[var(--ink)] text-white shadow-[var(--shadow-sm)]" : "text-[var(--text-2)] hover:text-[var(--ink)] hover:bg-[var(--inset)]"
                }`}
              >
                <r.icon className="w-4 h-4" />
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Left */}
            <SpotlightCard className="card-soft p-8 sm:p-10">
              <div className="flex flex-col justify-center h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[var(--blue-50)] border border-[var(--blue-100)] flex items-center justify-center">
                  <role.icon className="w-5 h-5 text-[var(--blue-600)]" />
                </div>
                <span className="mono-label">For {role.label}</span>
              </div>
              <h3 className="text-[30px] font-bold text-[var(--ink)] mb-4 leading-[1.08] tracking-tight">{role.headline}</h3>
              <p className="text-[var(--text-2)] text-[15px] leading-relaxed mb-8">{role.sub}</p>
              <ul className="space-y-3">
                {role.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-[var(--text-2)]">
                    <span className="w-5 h-5 rounded-full bg-[var(--blue-50)] border border-[var(--blue-100)] flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-[var(--blue-600)]" fill="none" viewBox="0 0 16 16">
                        <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              </div>
            </SpotlightCard>

            {/* Right */}
            <div className="grid grid-cols-2 gap-4">
              {role.metrics.map((m, i) => (
                <SpotlightCard
                  key={m.label}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="card-soft p-5 sm:p-6"
                >
                  <div className="flex flex-col justify-center h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <m.icon className="w-4 h-4 text-[var(--text-3)]" />
                      <span className="mono-label">{m.label}</span>
                    </div>
                    <div className={`text-[28px] font-bold font-mono mb-1 tracking-tight ${toneMap[m.tone as keyof typeof toneMap]}`}>
                      {m.value}
                    </div>
                    <div className="text-[12px] text-[var(--text-3)]">{m.sub}</div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
