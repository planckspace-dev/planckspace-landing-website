"use client";

import { motion } from "framer-motion";
import { EyeOff, Users, TrendingUp } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";

const problems = [
  {
    icon: EyeOff,
    title: "Zero visibility",
    body: "You pay AI subscriptions every month but can't tell which team, project, or developer is spending the most — or why costs keep climbing.",
  },
  {
    icon: Users,
    title: "No accountability",
    body: "When the bill doubles, there's no trail. Was it one power user? A runaway script? Context that reloads every session? You can't know.",
  },
  {
    icon: TrendingUp,
    title: "Costs only go up",
    body: "Without usage data, there's nothing to optimize. Subscriptions accumulate, token counts rise, and 'we need more AI budget' becomes the default answer.",
  },
];

export default function Problem() {
  return (
    <section className="section s-problem py-24 sm:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
          >
            <h2 className="h-section text-[36px] sm:text-[52px] text-balance">
              AI coding tools are powerful.{" "}
              <span className="text-[var(--text-3)]">The costs are invisible.</span>
            </h2>
            <p className="mt-6 text-[var(--text-2)] text-[17px] leading-relaxed max-w-md">
              Most teams discover their AI spend problem only when the bill arrives.
              By then there&apos;s no way to course-correct — the money is already gone.
            </p>

            {/* Bill spike card */}
            <div className="mt-10 card-soft p-7">
              <div className="mono-label mb-5">Typical monthly AI spend · unmanaged team</div>
              <div className="flex items-end gap-1.5 h-28">
                {[20, 28, 35, 32, 45, 48, 60, 55, 72, 80, 95, 100].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.04, ease: [0.23, 1, 0.32, 1] }}
                    className="flex-1 rounded-t-[4px]"
                    style={{ background: i >= 10 ? "var(--coral-500)" : "var(--inset-2)" }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2.5">
                <span className="text-[10px] text-[var(--text-3)] font-mono">Jan</span>
                <span className="text-[10px] text-[var(--text-3)] font-mono">Dec</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--coral-500)]" />
                <span className="text-[13px] text-[var(--coral-700)] font-semibold">+127% YoY — with no insight into why</span>
              </div>
            </div>
          </motion.div>

          {/* Right */}
          <div className="space-y-4">
            {problems.map((p, i) => (
              <SpotlightCard
                key={p.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                className="card-soft p-7"
              >
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--coral-50)] border border-[var(--coral-100)] flex items-center justify-center shrink-0">
                    <p.icon className="w-5 h-5 text-[var(--coral-500)]" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold text-[var(--ink)] mb-2">{p.title}</h3>
                    <p className="text-[14px] text-[var(--text-2)] leading-relaxed">{p.body}</p>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
