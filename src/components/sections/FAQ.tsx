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
    q: "What is PlanckSpace, in one sentence?",
    a: "A tool that shows a company what its AI coding tools cost, finds the money being wasted, fixes it, and then measures what each fix saved. It works with Claude Code, Cursor, Windsurf and the API keys behind them.",
  },
  {
    q: "How does it work?",
    a: "Your AI coding tools already keep a log of every session on the developer's machine: which model, how many tokens, when. A small PlanckSpace program reads those logs on the machine and sends the usage numbers to your workspace. It does not sit between you and your tools, and it changes nothing in your editor.",
  },
  {
    q: "Which tools does it work with?",
    a: "Claude Code, Cursor and Windsurf on each developer's machine, plus pay-as-you-go API spend with Anthropic, OpenAI and Amazon Bedrock. The editor extension runs in VS Code, and in Cursor and Windsurf through Open VSX. The docs list exactly what each tool reports.",
  },
  {
    q: "Are our code or prompts ever sent to PlanckSpace?",
    a: "No. Only usage data is sent: models, token counts, timings, tool, repository and file names, whether the work shipped, and the git email that shows whose session it was. Prompts, responses, source code and file contents are never sent to PlanckSpace. Run planck inspect on any session to check. There is one opt-in exception, and it sends shortened prompts to a third party, never to us: an agent policy that uses TypeSafe's decision model, on machines where the developer adds their own TypeSafe key.",
  },
  {
    q: "How do you know a saving is real?",
    a: "We measure it instead of estimating it. After a fix, we work out what each new session would have cost the old way, and count the difference. A removed seat counts for each day it stays removed. A session fix counts for nothing until it has run for 7 days and 20 sessions. If the share of work that ships drops 10 points, we stop counting, and if the old habit comes back, the problem is reopened.",
  },
  {
    q: "We pay for Claude Max and Pro seats, not the API. Is it still useful?",
    a: "Yes. Seats are where some of the biggest waste is: seats nobody uses, and Max seats that only need Pro. We also show how much work each flat-rate seat carried, as a separate number that is never added to what you paid.",
  },
  {
    q: "How is this different from the usage page each provider gives us?",
    a: "A provider's page shows one tool and one account. PlanckSpace puts all your tools in one place, shows the spend by developer, team and repository, checks it against the invoice, and tells you what the waste costs. Then it helps you fix it.",
  },
  {
    q: "How do we get access, and what does it cost?",
    a: "Book a demo. In 30 minutes we look at your setup and size a plan to your team and tools. Then we set up your workspace and help you roll it out, so your numbers are right from day one.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.5fr)] lg:gap-20">
          <Reveal className="lg:col-span-2">
            <p className="eyebrow">Questions</p>
            <h2 id="faq-title" className="title-lg mt-6 sm:mt-7">
              Fair questions, <span className="tone">straight answers.</span>
            </h2>
          </Reveal>

          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="lede max-w-[24rem]">
              Something we have not covered?{" "}
              <Link href="/contact" className="link-under text-ink">
                Ask us directly
              </Link>
              . A founder replies.
            </p>
            <Link href="/docs/faq" className="link-arrow mt-6">
              Every question in the docs <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            </Link>
          </Reveal>

          <Reveal>
            <Accordion.Root type="single" collapsible defaultValue="item-0" className="border-t-2 border-ink">
              {FAQS.map((f, i) => (
                <Accordion.Item key={f.q} value={`item-${i}`} className="border-b border-line-strong">
                  <Accordion.Header>
                    <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:py-7">
                      <span className="text-[1.1875rem] font-medium leading-snug tracking-[-0.022em] text-ink sm:text-[1.375rem]">{f.q}</span>
                      {/* Tailwind v4's rotate-* is the `rotate` property, so that is what transitions */}
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-strong text-body transition-[rotate,background-color,color,border-color] duration-200 ease-[var(--ease-out-expo)] group-hover:border-ink group-hover:text-ink group-data-[state=open]:rotate-45 group-data-[state=open]:border-ink group-data-[state=open]:bg-ink group-data-[state=open]:text-white">
                        <Plus className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
                      </span>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="faq-content">
                    <p className="max-w-[46rem] pb-8 pr-14 text-[1rem] leading-relaxed text-body sm:text-[1.0625rem]">{f.a}</p>
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
