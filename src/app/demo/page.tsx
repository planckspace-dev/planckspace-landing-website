import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Lock, Clock, UserRound } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoForm from "@/components/DemoForm";
import { CONTACT_EMAIL } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Book a demo",
  description:
    "See PlanckSpace on your own numbers. A 30-minute working session with a founder, covering how much your team spends on Claude Code, Cursor, and Windsurf, where it's wasted, and what it's returning.",
};

const AGENDA = [
  {
    title: "Your current spend, mapped",
    body: "We start from the tools you already run and show exactly what PlanckSpace would meter across them.",
  },
  {
    title: "The waste we'd expect to find",
    body: "Idle seats, cache misses, runaway sessions, models over-specified for the task. Usually the first surprise.",
  },
  {
    title: "Attribution your finance team accepts",
    body: "Per-team, per-repo, and per-developer, reconciled against the invoice you actually receive.",
  },
  {
    title: "Rollout, honestly scoped",
    body: "What setup takes, what your developers see, and what it costs. If you don't need us yet, we'll say so.",
  },
];

const ASSURANCES = [
  { icon: Clock, label: "30 minutes", sub: "No slide deck" },
  { icon: UserRound, label: "A founder", sub: "Not an SDR" },
  { icon: Lock, label: "Metadata only", sub: "Code stays on your machine" },
];

/** Matches the form card's footprint so the layout doesn't jump before hydration. */
function FormFallback() {
  return (
    <div className="card min-h-[34rem] p-6 sm:p-9" aria-busy="true">
      <div className="h-5 w-32 rounded-full bg-[var(--inset)]" />
      <div className="mt-4 flex gap-1.5">
        <span className="h-[3px] flex-1 rounded-full bg-[var(--ink)]" />
        <span className="h-[3px] flex-1 rounded-full bg-[var(--inset)]" />
        <span className="h-[3px] flex-1 rounded-full bg-[var(--inset)]" />
      </div>
      <div className="mt-9 space-y-5">
        <div className="h-12 rounded-xl bg-[var(--inset)]" />
        <div className="h-12 rounded-xl bg-[var(--inset)]" />
        <div className="h-12 rounded-xl bg-[var(--inset)]" />
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <main className="overflow-x-clip">
      <Navbar />

      <section className="page-top pb-20 sm:pb-32">
        <div className="container-x">
          <div className="grid gap-10 sm:gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
            {/* left: the pitch for spending 30 minutes */}
            <div>
              <p className="eyebrow mb-6 sm:mb-7">Book a demo</p>
              <h1 className="display-1 !text-[clamp(2.25rem,4.5vw,3.75rem)]">
                See it on your own numbers.
              </h1>
              <p className="lead mt-5 max-w-md sm:mt-6">
                PlanckSpace is rolled out with us, not around us. Tell us about
                your team, we’ll walk you through what your AI spend actually
                looks like, then set your workspace up ourselves.
              </p>

              <div className="mt-10 flex flex-wrap gap-2.5">
                {ASSURANCES.map((a) => (
                  <div
                    key={a.label}
                    className="flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-white px-3.5 py-2 shadow-[var(--shadow-soft)]"
                  >
                    <a.icon
                      className="h-3.5 w-3.5 shrink-0 text-[var(--brand-600)]"
                      strokeWidth={1.75}
                    />
                    <span className="text-[13px] font-medium text-[var(--ink)]">
                      {a.label}
                    </span>
                    <span className="num text-[11px] text-[var(--text-3)]">
                      {a.sub}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-10 sm:mt-12">
                <p className="num mb-6 text-[11px] uppercase tracking-[0.16em] text-[var(--text-3)] sm:mb-7">
                  What we’ll cover
                </p>
                <div className="space-y-7 sm:space-y-8">
                  {AGENDA.map((a, i) => (
                    <div key={a.title} className="flex gap-4 sm:gap-5">
                      <span className="num pt-0.5 text-[12px] text-[var(--text-3)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h2 className="text-[15.5px] font-semibold tracking-[-0.01em] text-[var(--ink)]">
                          {a.title}
                        </h2>
                        <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--text-2)]">
                          {a.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 border-t border-[var(--border)] pt-6 sm:mt-12 sm:pt-7">
                <p className="num text-[11px] uppercase tracking-[0.16em] text-[var(--text-3)]">
                  Not ready for a call?
                </p>
                {/* A "Compare plans" → /pricing link sat first in this line
                    while pricing was public. */}
                <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--text-2)]">
                  Read{" "}
                  <Link href="/#how-it-works" className="link-quiet">
                    how it works
                  </Link>
                  , or email us at{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="link-quiet">
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* right: the qualifying form */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Suspense fallback={<FormFallback />}>
                <DemoForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
