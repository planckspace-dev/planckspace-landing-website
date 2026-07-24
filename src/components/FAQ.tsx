"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const FAQS = [
  {
    q: "How does the tracking actually work?",
    a: "AI coding tools already write session logs to your machine — model, token counts, timestamps. The PlanckSpace CLI (and its background daemon) parses that metadata locally, computes cost from current model pricing, and syncs the numbers to your workspace. Nothing is intercepted, proxied, or injected into your editor.",
  },
  {
    q: "Which tools are supported?",
    a: "Claude Code, Cursor, Windsurf, and Antigravity today. The VS Code extension adds in-editor spend, insights, and recommendations, and works in VS Code forks like Cursor and Windsurf.",
  },
  {
    q: "Do you ever see our code or prompts?",
    a: "No. PlanckSpace syncs usage metadata only: models, token counts, cost, duration, tool, repo name, and git author. Source code, prompts, responses, and file contents never leave the machine. Run planck inspect to see the exact payload before it syncs.",
  },
  {
    q: "What does “tracked spend” mean on the pricing page?",
    a: "It's the dollar value of AI usage PlanckSpace meters for your workspace each calendar month — the thing plans are sized by. Starter includes $200/month of tracked spend, Pro $500, Business $2,000. It's a measurement limit, not extra charges.",
  },
  {
    q: "How is this different from each provider's own usage page?",
    a: "Provider dashboards show one tool, one account, no team context. PlanckSpace unifies every tool into per-team, per-repo, per-developer attribution, reconciles it against the actual invoice, and flags waste like idle seats and cache misses — the questions finance actually asks.",
  },
  {
    q: "We're on Claude Pro / Max subscriptions, not API billing. Useful?",
    a: "Yes — subscription efficiency is a first-class view. PlanckSpace imputes the usage value of each flat-rate seat, shows who's under-using theirs, and tells you when a seat should move up or down a tier.",
  },
  {
    q: "How do we get access?",
    a: "Through a demo. We spend 30 minutes on your setup, agree the right plan, then provision the workspace and help your team roll it out. There's no self-serve sign-up — onboarding runs with us so your numbers are right from the first session.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. Starter is free forever: 3 users and $200 of tracked spend per month, no credit card. Pro and Business include a 14-day free trial. Every plan — Starter included — starts with a demo so we can set it up with you.",
  },
];

export default function FAQ() {
  return (
    <section className="py-24 sm:py-36">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <p className="eyebrow mb-6">FAQ</p>
              <h2 className="display-2">Fair questions, straight answers.</h2>
              <p className="lead mt-5 max-w-sm">
                Anything else —{" "}
                <a href="/contact" className="link-quiet">
                  ask us directly
                </a>
                . A human replies.
              </p>
            </Reveal>
          </div>

          <Reveal>
            <Accordion.Root type="single" collapsible className="w-full">
              {FAQS.map((f, i) => (
                <Accordion.Item
                  key={f.q}
                  value={`item-${i}`}
                  className="border-t border-[var(--border)] last:border-b"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-6 text-left">
                      <span className="flex items-baseline gap-4">
                        <span className="num shrink-0 text-[12px] tabular-nums text-[var(--text-3)] transition-colors duration-300 group-data-[state=open]:text-[var(--brand-600)]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[16px] font-medium tracking-[-0.01em] text-[var(--ink)] sm:text-[17px]">
                          {f.q}
                        </span>
                      </span>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:border-[var(--text-3)] group-data-[state=open]:rotate-45 group-data-[state=open]:border-[var(--ink)] group-data-[state=open]:bg-[var(--ink)]">
                        <Plus
                          className="h-3.5 w-3.5 text-[var(--text-2)] transition-colors duration-300 group-data-[state=open]:text-white"
                          strokeWidth={1.75}
                        />
                      </span>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[acc-up_0.35s_cubic-bezier(0.32,0.72,0,1)] data-[state=open]:animate-[acc-down_0.35s_cubic-bezier(0.32,0.72,0,1)]">
                    <p className="max-w-xl pb-7 pr-10 text-[14.5px] leading-relaxed text-[var(--text-2)]">
                      {f.a}
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </Reveal>
        </div>
      </div>

    </section>
  );
}
