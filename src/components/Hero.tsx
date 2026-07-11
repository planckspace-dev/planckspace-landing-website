import { ArrowUpRight } from "lucide-react";
import ProductShot from "@/components/ProductShot";
import { CONSOLE_URL } from "@/lib/plans";
import Link from "next/link";

/* Static hero — no animation, no gimmicks. Big type, one message,
   the product shown large. */

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-24">
      {/* single, very quiet backdrop tint behind the product shot */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[62%] -z-10 h-[42rem] w-[80rem] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(46,107,242,0.07), rgba(46,107,242,0.02) 55%, transparent 75%)",
        }}
      />

      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-7" data-center="true">
            Claude Code · Cursor · Windsurf · Antigravity
          </p>

          <h1 className="display-1">
            Every token your team spends, accounted for.
          </h1>

          <p className="lead mx-auto mt-6 max-w-2xl">
            PlanckSpace meters AI usage across your coding tools and turns it into
            one shared dashboard of cost, waste, and ROI — for the whole team.
            It reads metadata, never your code.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={`${CONSOLE_URL}/register`} className="btn btn-primary">
              Start free
              <span className="btn-disc">
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
              </span>
            </a>
            <Link href="/pricing" className="btn btn-secondary">
              See pricing
            </Link>
          </div>

          <p className="num mt-7 text-[12px] text-[var(--text-3)]">
            Free for 3 seats&ensp;·&ensp;5-minute setup&ensp;·&ensp;No credit card
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-6xl sm:mt-20">
          <ProductShot />
        </div>
      </div>
    </section>
  );
}
