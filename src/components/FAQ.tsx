"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "Does PlanckSpace read my code or prompts?",
    a: "No. PlanckSpace reads only the local session database that your AI editor writes — which contains metadata: model name, token counts, cost, duration, repo name, and outcome. Your prompts, code, and AI responses are never stored or accessed.",
  },
  {
    q: "Which editors are supported?",
    a: "Claude Code (full support with token counts and costs), Cursor (supported, though token fields are 0 — Cursor meters server-side), and Windsurf (beta). The VS Code extension works in VS Code, Cursor, Windsurf, and VS Codium.",
  },
  {
    q: "Do I need an account to use PlanckSpace?",
    a: "No. The CLI and VS Code extension work completely offline with no account. You only need an account to sync data to a team workspace and unlock the shared dashboard.",
  },
  {
    q: "How does the team workspace work?",
    a: "You create a workspace and invite your developers via email. Each developer runs planck login <token> — a 30-second step. From that point, their CLI syncs session metadata to your workspace, visible in role-based dashboards.",
  },
  {
    q: "What does 'reconciliation' mean?",
    a: "Reconciliation compares what your team actually used (tracked by PlanckSpace) against what your AI vendor billed you. The reconciliation view flags the gap — surfacing overcharges or unaccounted sessions.",
  },
  {
    q: "How do cost insights work?",
    a: "The CLI detects patterns that inflate spend: large CLAUDE.md files, low prompt-cache hit rates, repeated context reloads, and anomalous sessions. Each insight shows an estimated monthly saving and a one-line fix.",
  },
  {
    q: "Is Windows supported?",
    a: "The CLI requires macOS or Linux (or WSL on Windows). The VS Code extension works on all platforms — it reads a local SQLite database that the CLI writes.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your local data stays on your machine — PlanckSpace never deletes it. Workspace data on our servers is retained for 90 days after cancellation, then permanently purged.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section s-faq py-24 sm:py-32 bg-[var(--soft)] border-y border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
          {/* Left — sticky header */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:sticky lg:top-32 self-start"
          >
            <h2 className="h-section text-[34px] sm:text-[46px] text-balance">
              Common questions
            </h2>
            <p className="mt-6 text-[var(--text-2)] text-[16px] leading-relaxed">
              Everything teams ask before rolling out PlanckSpace. Still curious?
            </p>
            <a
              href="mailto:hello@planckspace.dev"
              className="mt-5 inline-flex items-center gap-1.5 text-[var(--blue-600)] font-medium text-[15px] hover:underline"
            >
              Email us →
            </a>
          </motion.div>

          {/* Right — accordion */}
          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.03 }}
                  className={`rounded-2xl border transition-all duration-200 ${
                    isOpen ? "bg-white border-[var(--border-strong)] shadow-[var(--shadow-sm)]" : "bg-white border-[var(--border)]"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4.5 text-left cursor-pointer"
                  >
                    <span className="text-[15px] font-semibold text-[var(--ink)] leading-snug">{faq.q}</span>
                    <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-[var(--blue-600)] rotate-45" : "bg-[var(--inset)]"}`}>
                      <Plus className={`w-3.5 h-3.5 ${isOpen ? "text-white" : "text-[var(--text-3)]"}`} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-5 text-[14px] text-[var(--text-2)] leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
