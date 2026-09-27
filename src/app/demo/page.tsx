import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Clock, Lock, UserRound } from "lucide-react";

import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import DemoForm from "@/components/DemoForm";
import { CONTACT_EMAIL } from "@/lib/plans";
import { SOCIAL_LINKS } from "@/lib/social-links";

export const metadata: Metadata = {
  title: "Book a demo",
  description:
    "See PlanckSpace on your own numbers. A 30-minute working session with a founder: what your team spends on Claude Code, Cursor and the AI APIs, where it's wasted, and what it would take to fix.",
};

const AGENDA = [
  {
    title: "Your current spend, mapped",
    body: "We start from the tools and plans you already pay for and show exactly what PlanckSpace would meter across them.",
  },
  {
    title: "The waste we'd expect to find",
    body: "Seats nobody opens, Max plans used at Pro levels, premium models on routine work, context re-sent every turn.",
  },
  {
    title: "Numbers finance will accept",
    body: "Per team, per repo and per developer, billed dollars kept apart from estimates, checked against the invoice.",
  },
  {
    title: "Rollout, honestly scoped",
    body: "What setup takes, what your developers see, and what it costs. If you don't need us yet, we'll say so.",
  },
];

const ASSURANCES = [
  { icon: Clock, label: "30 minutes", sub: "no slide deck" },
  { icon: UserRound, label: "A founder", sub: "not an SDR" },
  { icon: Lock, label: "Metadata only", sub: "code stays on your machine" },
];

/** Matches the form's footprint so the layout doesn't jump before hydration. */
function FormFallback() {
  return (
    <div className="frame [--ch:24px]" aria-busy="true">
      <div className="frame-in min-h-[34rem] p-6 sm:p-9">
        <div className="h-6 w-40 bg-fg/10" />
        <div className="mt-4 flex gap-1.5">
          <span className="h-[3px] flex-1 bg-lime" />
          <span className="h-[3px] flex-1 bg-fg/10" />
          <span className="h-[3px] flex-1 bg-fg/10" />
        </div>
        <div className="mt-9 space-y-5">
          <div className="h-12 bg-fg/[0.06]" />
          <div className="h-12 bg-fg/[0.06]" />
          <div className="h-12 bg-fg/[0.06]" />
        </div>
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="overflow-x-clip">
        <section className="relative pb-24 pt-[calc(var(--nav-h)+4.5rem)] sm:pb-32 sm:pt-[calc(var(--nav-h)+6rem)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-[34rem] w-[60%] bg-[radial-gradient(rgb(198_255_61/0.22)_1px,transparent_1.4px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_70%_at_80%_20%,#000,transparent)]"
          />
          <div className="wrap relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-20">
            <div>
              <p className="t-kicker">Book a demo</p>
              <h1 className="t-display mt-5 text-[clamp(2.6rem,5vw,4.4rem)] leading-[0.95] [--wdth:106]">
                See it on your own numbers.
              </h1>
              <p className="t-lead mt-6 max-w-md">
                PlanckSpace is rolled out with us, not around us. Tell us about your team, we&apos;ll walk you through
                what your AI spend actually looks like, then set your workspace up with you.
              </p>

              <ul className="mt-9 flex flex-wrap gap-2">
                {ASSURANCES.map((a) => (
                  <li key={a.label} className="ch-br flex items-center gap-2.5 bg-ink-2 px-3.5 py-2.5 [--ch:8px]">
                    <a.icon className="h-4 w-4 shrink-0 text-lime" strokeWidth={1.7} />
                    <span className="text-[0.88rem] font-medium text-fg">{a.label}</span>
                    <span className="t-mono text-[11px] text-fg-3">{a.sub}</span>
                  </li>
                ))}
              </ul>

              <h2 className="t-h4 mt-12">What we&apos;ll cover</h2>
              <ol className="mt-6 space-y-6">
                {AGENDA.map((a, i) => (
                  <li key={a.title} className="flex gap-5">
                    <span className="t-meter w-6 shrink-0 pt-0.5 text-[1.25rem] text-lime">{i + 1}</span>
                    <div>
                      <h3 className="text-[1rem] font-semibold text-fg">{a.title}</h3>
                      <p className="mt-1 text-[0.92rem] leading-relaxed text-fg-3">{a.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-12 border-t border-[var(--line)] pt-7">
                <p className="text-[0.95rem] leading-relaxed text-fg-3">
                  Not ready for a call? Read{" "}
                  <Link href="/#how-it-works" className="link-lined text-fg">
                    how it goes live
                  </Link>
                  , or email{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="link-lined text-fg">
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
                <ul className="mt-6 flex gap-2">
                  {SOCIAL_LINKS.map((s) => {
                    const Icon = s.icon;
                    return (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={s.label}
                          className="ch-br grid h-11 w-11 place-items-center bg-ink-3 text-fg-2 transition-colors duration-300 hover:bg-lime hover:text-ink [--ch:8px]"
                        >
                          <Icon className="h-[17px] w-[17px]" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <Suspense fallback={<FormFallback />}>
                <DemoForm />
              </Suspense>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
