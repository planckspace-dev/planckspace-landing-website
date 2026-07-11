import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { PLANS, CONSOLE_URL } from "@/lib/plans";

export default function PricingTeaser() {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--panel)] py-24 sm:py-36">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-6" data-center="true">
            Pricing
          </p>
          <h2 className="display-2">Starts free. Scales with your spend.</h2>
          <p className="lead mt-5">
            Plans are sized by the AI spend you track, not by surprise line
            items. Paid tiers carry a 14-day free trial.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06} className="h-full">
              <div
                className={`card flex h-full flex-col p-6 ${
                  p.highlighted ? "!border-[var(--ink)] shadow-[var(--shadow-float)]" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-semibold text-[var(--ink)]">{p.name}</h3>
                  {p.highlighted && (
                    <span className="num rounded-full bg-[var(--ink)] px-2.5 py-0.5 text-[9.5px] uppercase tracking-[0.1em] text-white">
                      Popular
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-baseline gap-1.5">
                  {p.priceUsdMonthly === null ? (
                    <span className="text-[26px] font-semibold tracking-[-0.03em]">Custom</span>
                  ) : (
                    <>
                      <span className="num text-[28px] font-medium tracking-[-0.04em]">
                        ${p.priceUsdMonthly}
                      </span>
                      <span className="text-[12.5px] text-[var(--text-3)]">/month</span>
                    </>
                  )}
                </div>
                <p className="mt-3 border-t border-[var(--border)] pt-3 text-[12.5px] leading-relaxed text-[var(--text-2)]">
                  {p.trackedSpendUsdMonthly === null ? (
                    "Unlimited tracked spend · unlimited users"
                  ) : (
                    <>
                      <span className="num">${p.trackedSpendUsdMonthly.toLocaleString()}</span>{" "}
                      tracked spend/mo ·{" "}
                      <span className="num">{p.maxUsers}</span> users
                    </>
                  )}
                </p>
                <div className="flex-1" />
                <div className="num mt-4 text-[10.5px] text-[var(--text-3)]">
                  {p.trialDays > 0
                    ? `${p.trialDays}-day free trial`
                    : p.id === "starter"
                      ? "Free forever"
                      : "Sales-assisted onboarding"}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/pricing" className="btn btn-primary">
            Compare plans in full
            <span className="btn-disc">
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </span>
          </Link>
          <a href={`${CONSOLE_URL}/register`} className="link-quiet text-[14.5px]">
            or start free with 3 seats
          </a>
        </Reveal>
      </div>
    </section>
  );
}
