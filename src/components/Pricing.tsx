"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    badge: null,
    price: "$0",
    period: "forever",
    tagline: "For individual developers who want to understand their own spend before rolling out to a team.",
    cta: "Install the CLI",
    ctaHref: "#get-started",
    highlight: false,
    features: [
      "Local spend dashboard in VS Code",
      "Cost insights with savings estimates",
      "Skill recommendations (stack-matched)",
      "Workspace audit score",
      "CLAUDE.md split preview",
      "Supports Claude Code, Cursor, Windsurf",
      "Fully offline — no account required",
    ],
    note: "No credit card. No account. Just install.",
  },
  {
    name: "Team",
    badge: "Most popular",
    price: "$12",
    period: "per seat / month",
    tagline: "For engineering teams that need shared visibility, leadership analytics, and spend accountability.",
    cta: "Start free trial",
    ctaHref: "#get-started",
    highlight: true,
    features: [
      "Everything in Free for every team member",
      "Team dashboard: spend by developer, repo, model",
      "Leadership analytics & reconciliation",
      "Manager view: productivity + wasted spend",
      "Anomaly detection & budget alerts",
      "Subscription efficiency reports",
      "Role-based access (CTO / Manager / Developer)",
      "CSV export",
      "Slack integration (coming soon)",
    ],
    note: "14-day free trial · no credit card required",
  },
  {
    name: "Enterprise",
    badge: null,
    price: "Custom",
    period: "contact us",
    tagline: "For larger orgs with SSO, custom data retention, dedicated support, and multi-workspace needs.",
    cta: "Talk to us",
    ctaHref: "mailto:hello@planckspace.dev",
    highlight: false,
    features: [
      "Everything in Team",
      "SSO / SAML",
      "Custom data retention policies",
      "Dedicated onboarding & support",
      "SLA guarantee",
      "Multi-workspace management",
      "Custom integrations",
      "On-premise deployment option",
    ],
    note: "Usually responds within 1 business day",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section s-pricing py-24 sm:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="eyebrow eyebrow-accent eyebrow-center justify-center">Pricing</span>
          <h2 className="h-section text-[36px] sm:text-[52px] mt-6 text-balance">
            Start free. Scale when you need the team view.
          </h2>
          <p className="mt-6 text-[var(--text-2)] text-[17px] leading-relaxed">
            The free tier is genuinely useful — no login, no card, no catch. Upgrade
            when you want shared visibility across your team.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.09, ease: [0.23, 1, 0.32, 1] }}
              className={`relative rounded-[28px] flex flex-col ${
                plan.highlight
                  ? "grain text-white ring-1 ring-inset ring-white/15 shadow-[0_30px_70px_-20px_rgba(76,94,230,0.6)] lg:-mt-4 lg:mb-4"
                  : "bg-white border border-[var(--border)] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-lg)] transition-all duration-300"
              }`}
              style={plan.highlight ? { background: "linear-gradient(160deg, var(--blue-600) 0%, var(--blue-700) 100%)" } : undefined}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <span className="flex items-center gap-1.5 bg-[var(--ink)] text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-[var(--shadow-md)]">
                    <Sparkles className="w-3 h-3 text-[var(--blue-300)]" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-7 sm:p-8 flex flex-col flex-1">
                <div className={`mono-label mb-4 ${plan.highlight ? "!text-white/60" : ""}`}>{plan.name}</div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-[42px] font-bold font-mono tracking-tight ${plan.highlight ? "text-white" : "text-[var(--ink)]"}`}>
                    {plan.price}
                  </span>
                  {plan.period !== "contact us" && (
                    <span className={`text-[13px] font-medium ${plan.highlight ? "text-white/60" : "text-[var(--text-3)]"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>

                <p className={`text-[13px] leading-relaxed mb-7 min-h-[3.25rem] ${plan.highlight ? "text-white/75" : "text-[var(--text-2)]"}`}>
                  {plan.tagline}
                </p>

                <Link
                  href={plan.ctaHref}
                  className={`flex items-center justify-center gap-2 text-sm font-semibold py-3 px-5 rounded-full mb-7 transition-all duration-200 ${
                    plan.highlight
                      ? "sheen bg-white text-[var(--blue-700)] hover:bg-white/90 shadow-[var(--shadow-sm)]"
                      : "bg-[var(--ink)] text-white hover:bg-[var(--ink-soft)]"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <ul className="space-y-3 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-start gap-2.5 text-[13.5px] ${plan.highlight ? "text-white/90" : "text-[var(--text-2)]"}`}>
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? "text-white/85" : "text-[var(--blue-600)]"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className={`mt-7 pt-5 border-t text-center text-[11px] font-mono ${
                  plan.highlight ? "border-white/15 text-white/45" : "border-[var(--border)] text-[var(--text-3)]"
                }`}>
                  {plan.note}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-[14px] text-[var(--text-3)] mt-10"
        >
          All plans include the VS Code extension, CLI, and privacy-first local data handling.
          <Link href="#faq" className="text-[var(--blue-600)] ml-1 hover:underline font-medium">See FAQ →</Link>
        </motion.p>
      </div>
    </section>
  );
}
