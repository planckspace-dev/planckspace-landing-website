import { ArrowUpRight } from "lucide-react";
import { DEMO_PATH } from "@/lib/plans";
import Link from "next/link";
import HeroConsole from "@/components/HeroConsole";
import { HeroPixels } from "@/components/ui/hero-pixels";

/* The hero states the message once, then shows it working.

   The copy block is unchanged and still server-rendered. Under it is the
   Overview console, built natively (HeroConsole) so it can be live rather
   than a capture. The backdrop raster gains a canvas that lights single units
   of the same raster: the field is the metering, not decoration behind it.

   The copy rises first and the console follows, so the headline is always
   the first thing read. */

export default function Hero() {
  return (
    <section className="page-top relative overflow-hidden pb-16 sm:pb-24">
      {/* Pixel field plus two washes, all defined in globals.css. Deliberately
          a sibling rather than a background on the section: it has to be able
          to bleed past the container while the content stays on the measure. */}
      <div aria-hidden className="hero-field">
        <HeroPixels />
      </div>

      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow rise mb-6 sm:mb-7" data-center="true">
            The management layer for AI coding
          </p>

          <h1 className="display-1 rise" style={{ "--d": "0.05s" } as React.CSSProperties}>
            Every AI team, more efficient.
          </h1>

          <p
            className="lead rise mx-auto mt-5 max-w-xl sm:mt-6"
            style={{ "--d": "0.12s" } as React.CSSProperties}
          >
            PlanckSpace measures what your team’s AI coding costs, cuts the waste
            it finds, and verifies the savings from your own telemetry.
          </p>

          {/* Full-width and equal on a phone, intrinsic and side-by-side from
              sm up. Two centred auto-width pills stacked in a column read as a
              layout that ran out of room. */}
          <div
            className="btn-row rise mx-auto mt-8 max-w-sm sm:mt-9 sm:max-w-none"
            data-center="true"
            style={{ "--d": "0.18s" } as React.CSSProperties}
          >
            <Link href={DEMO_PATH} className="btn btn-primary">
              Book a demo
              <span className="btn-disc">
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
              </span>
            </Link>
            <Link href="/#how-it-works" className="btn btn-secondary">
              See how it works
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-[68rem] sm:mt-20">
          <HeroConsole />
        </div>
      </div>
    </section>
  );
}
