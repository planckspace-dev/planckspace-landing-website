"use client";

import * as Accordion from "@radix-ui/react-accordion";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import Reveal from "@/components/site/Reveal";

/* Fair questions, straight answers. Radix supplies the keyboard model and
   the ARIA; the open/close animates on Radix's measured height. The full
   list lives in the docs. */

const FAQS = [
  {
    q: "How does the tracking actually work?",
    a: "AI coding tools already write session logs on the developer's machine: models, token counts, timestamps. The PlanckSpace CLI and its background daemon read that metadata locally and sync it to your workspace. Nothing is intercepted, proxied or injected into your editor.",
  },
  {
    q: "Which tools are supported?",
    a: "Claude Code, Cursor and Windsurf on the developer's machine, plus metered API spend through Anthropic, OpenAI and Amazon Bedrock. The editor extension runs in VS Code, and in Cursor and Windsurf through Open VSX. The docs list exactly what each tool reports.",
  },
  {
    q: "Do our code or prompts ever reach PlanckSpace?",
    a: "No. PlanckSpace syncs usage metadata only: models, token counts, timings, tool, repository and file names, outcome and the git email that attributes a session. Prompts, responses, source code and file contents are never sent to PlanckSpace; run planck inspect on any session to check its payload. The one opt-in exception sends truncated prompts to a third party, never to us: an agent policy that uses TypeSafe's decision model, on machines where the developer adds their own TypeSafe key.",
  },
  {
    q: "What does a measured saving mean?",
    a: "Every saved dollar is a booked row you can open. After a routing or cache fix, each session is priced at what the same work cost before the fix, and the difference is booked; a removed seat is counted for each day it stays off. Nothing books until a session fix has run for 7 days and 20 sessions. If the ship rate drops 10 points, booking stops, and if the old behaviour comes back, the finding reopens.",
  },
  {
    q: "We pay for Claude Max and Pro seats, not the API. Is it useful?",
    a: "Yes. Seat findings are some of the largest: seats nobody opens, and Max seats used at Pro levels. Work done on flat-rate seats is shown as usage value, and never added to the money that actually leaves the account.",
  },
  {
    q: "How is this different from each provider's usage page?",
    a: "A provider dashboard shows one tool and one account, without team context. PlanckSpace puts every tool on one ledger, attributes it per developer, team and repository, checks it against the invoice, and prices the waste.",
  },
  {
    q: "How do we get access, and what does it cost?",
    a: "Through a demo. We spend 30 minutes on your setup, size the plan to your team and tools, then provision the workspace and help roll it out. Onboarding runs with us so your numbers are right from the first session.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section pt-0">
      <div className="wrap">
        <div className="rule mb-[var(--section-y)]" />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.35fr)] lg:gap-24">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Questions</p>
            <h2 id="faq-title" className="title-lg mt-5 text-[clamp(2rem,2.8vw,2.5rem)]">
              Fair questions, <span className="tone">straight answers.</span>
            </h2>
            <p className="lede mt-6 max-w-[24rem]">
              Something we have not covered?{" "}
              <Link href="/contact" className="link-under text-ink">
                Ask us directly
              </Link>
              . A founder replies.
            </p>
            <Link href="/docs/faq" className="link-arrow mt-6">
              Every question in the docs <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </Reveal>

          <Reveal>
            <Accordion.Root type="single" collapsible defaultValue="item-0" className="border-t border-line">
              {FAQS.map((f, i) => (
                <Accordion.Item key={f.q} value={`item-${i}`} className="border-b border-line">
                  <Accordion.Header>
                    <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                      <span className="text-[1.125rem] font-medium leading-snug tracking-[-0.018em] text-ink">{f.q}</span>
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-body transition-[transform,background-color,color,border-color] duration-300 group-hover:border-line-strong group-data-[state=open]:rotate-45 group-data-[state=open]:border-ink group-data-[state=open]:bg-ink group-data-[state=open]:text-white">
                        <Plus className="h-4 w-4" strokeWidth={1.8} />
                      </span>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="faq-content">
                    <p className="max-w-[44rem] pb-7 pr-14 text-[1rem] leading-relaxed text-body">{f.a}</p>
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
