import { ArrowUpRight } from "lucide-react";
import { DEMO_PATH } from "@/lib/plans";
import Link from "next/link";

/* Static hero. No animation, no gimmicks: one message, stated once.

   Deliberately text-only. The tools strip directly below is the first visual
   element on the page, so the padding here is set to let this section read as
   a complete statement rather than as a truncated one. */

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-28 sm:pt-44 sm:pb-36">
      {/* Pixel field plus two washes, all defined in globals.css. Deliberately
          a sibling rather than a background on the section: it has to be able
          to bleed past the container while the content stays on the measure. */}
      <div aria-hidden className="hero-field" />

      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-7" data-center="true">
            The management layer for AI coding
          </p>

          <h1 className="display-1">Every AI team, more efficient.</h1>

          <p className="lead mx-auto mt-6 max-w-xl">
            PlanckSpace measures what your team’s AI coding costs, cuts the waste
            it finds, and verifies the savings from your own telemetry.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={DEMO_PATH} className="btn btn-primary">
              Book a demo
              <span className="btn-disc">
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
              </span>
            </Link>
            <Link href="/pricing" className="btn btn-secondary">
              See pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
