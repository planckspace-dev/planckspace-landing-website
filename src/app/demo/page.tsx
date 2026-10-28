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
    <div className="box min-h-[34rem] p-6 sm:p-9" aria-busy="true">
      <div className="h-6 w-40 rounded-md bg-canvas" />
      <div className="mt-4 flex gap-1.5">
        <span className="h-[3px] flex-1 rounded-full bg-brand-600" />
        <span className="h-[3px] flex-1 rounded-full bg-track" />
        <span className="h-[3px] flex-1 rounded-full bg-track" />
      </div>
      <div className="mt-9 space-y-5">
        <div className="h-12 rounded-[10px] bg-canvas" />
        <div className="h-12 rounded-[10px] bg-canvas" />
        <div className="h-12 rounded-[10px] bg-canvas" />
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="overflow-x-clip">
        <section className="relative isolate pb-24 pt-[calc(var(--nav-h)+3.5rem)] sm:pb-32 sm:pt-[calc(var(--nav-h)+5rem)]">
          <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem]" aria-hidden="true" />
          <div className="wrap relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
            <div>
              <p className="eyebrow">Book a demo</p>
              <h1 className="title-xl mt-4 text-[clamp(2.4rem,4.6vw,3.75rem)]">See it on your own numbers.</h1>
              <p className="lede mt-6 max-w-md">
                PlanckSpace is rolled out with us, not around us. Tell us about your team, we&apos;ll walk you through what
                your AI spend actually looks like, then set your workspace up with you.
              </p>

              <ul className="mt-8 flex flex-wrap gap-2">
                {ASSURANCES.map((a) => (
                  <li key={a.label} className="flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 shadow-[var(--shadow-flat)]">
                    <a.icon className="h-4 w-4 shrink-0 text-brand-600" strokeWidth={1.8} />
                    <span className="text-[0.875rem] font-medium text-ink">{a.label}</span>
                    <span className="text-[0.8125rem] text-muted">{a.sub}</span>
                  </li>
                ))}
              </ul>

              <h2 className="title-sm mt-12">What we&apos;ll cover</h2>
              <ol className="mt-6 space-y-6">
                {AGENDA.map((a, i) => (
                  <li key={a.title} className="flex gap-4">
                    <span className="num mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line-strong bg-surface text-[0.8125rem] font-medium text-ink">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-[1rem] font-semibold text-ink">{a.title}</h3>
                      <p className="mt-1 text-[0.92rem] leading-relaxed text-body">{a.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-12 border-t border-line pt-7">
                <p className="text-[0.95rem] leading-relaxed text-body">
                  Not ready for a call? Read{" "}
                  <Link href="/#how-it-works" className="link-under text-ink">
                    how it goes live
                  </Link>
                  , or email{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="link-under text-ink">
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
                          className="grid h-10 w-10 place-items-center rounded-[10px] border border-line bg-surface text-body transition-colors duration-200 hover:border-line-strong hover:text-ink"
                        >
                          <Icon className="h-4 w-4" />
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
