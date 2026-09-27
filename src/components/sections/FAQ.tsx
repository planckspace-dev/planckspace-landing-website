"use client";

import * as Accordion from "@radix-ui/react-accordion";
import Link from "next/link";
import { Plus } from "lucide-react";

/* Fair questions, straight answers. Radix supplies the keyboard model and
   the ARIA; the open/close is a grid-rows transition, so the height animates
   without measuring anything. */

const FAQS = [
  {
    q: "How does the tracking actually work?",
    a: "AI coding tools already write session logs to your machine: model, token counts, timestamps. The PlanckSpace CLI and its background daemon read that metadata locally, price it at current model rates, and sync the numbers to your workspace. Nothing is intercepted, proxied or injected into your editor.",
  },
  {
    q: "Which tools are supported?",
    a: "Claude Code and Cursor today, with Windsurf and Antigravity in beta, plus metered API spend through Anthropic, OpenAI and Bedrock admin keys. The VS Code extension also runs in Cursor and Windsurf through Open VSX.",
  },
  {
    q: "Do you ever see our code or prompts?",
    a: "No. PlanckSpace syncs usage metadata only: model, token counts, cost, duration, tool, repo name and git author. Source code, prompts, responses and file contents never leave the machine. Run planck inspect on any session to see the exact payload.",
  },
  {
    q: "What does verified savings actually mean?",
    a: "When a fix is applied, PlanckSpace snapshots the metric it targets, waits for at least three sessions afterwards, and measures the same metric again from your telemetry. Only the improvement that shows up is booked, with a dated receipt. A fix whose metric never moved stays unverified and is never counted.",
  },
  {
    q: "We pay for Claude Max and Pro seats, not the API. Is it useful?",
    a: "Yes. Seat findings are some of the largest: seats nobody opens, and Max seats used at Pro levels. Work done on flat plans is shown as usage value and labelled imputed, so it is never mixed up with money that actually leaves the account.",
  },
  {
    q: "How is this different from each provider's usage page?",
    a: "A provider dashboard shows one tool and one account, without team context, and cannot show you a competitor's spend. PlanckSpace puts every tool on one ledger, attributes it per developer, team and repo, checks it against the invoice, and prices the waste.",
  },
  {
    q: "How do we get access, and what does it cost?",
    a: "Through a demo. We spend 30 minutes on your setup, size the plan to your team and tools, then provision the workspace and help roll it out. There is no self-serve sign-up, because onboarding runs with us so your numbers are right from the first session.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section">
      <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="faq-title" className="t-display t-h2 max-w-[12ch]">
            Fair questions, straight answers.
          </h2>
          <p className="t-lead mt-6 max-w-[24rem]">
            Something we have not covered?{" "}
            <Link href="/contact" className="link-lined text-fg">
              Ask us directly
            </Link>
            . A founder replies.
          </p>
        </div>

        <Accordion.Root type="single" collapsible defaultValue="item-0" className="border-t border-[var(--line)]">
          {FAQS.map((f, i) => (
            <Accordion.Item key={f.q} value={`item-${i}`} className="faq-item border-b border-[var(--line)]">
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-6 text-left">
                  <span className="text-[clamp(1.05rem,1.5vw,1.3rem)] font-medium leading-snug text-fg transition-colors group-hover:text-lime">
                    {f.q}
                  </span>
                  <span className="ch-br grid h-9 w-9 shrink-0 place-items-center bg-ink-3 text-lime transition-colors group-data-[state=open]:bg-lime group-data-[state=open]:text-ink [--ch:7px]">
                    <Plus className="h-4 w-4 transition-transform duration-500 group-data-[state=open]:rotate-45" strokeWidth={1.8} />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="faq-content">
                <div className="overflow-hidden">
                  <p className="max-w-[44rem] pb-7 pr-12 text-[1rem] leading-relaxed text-fg-2">{f.a}</p>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
