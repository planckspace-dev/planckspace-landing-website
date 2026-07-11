import { Reveal } from "@/components/ui/reveal";

const PAINS = [
  {
    index: "01",
    title: "The invoice arrives. Nobody can explain it.",
    body: "Finance sees one number at the end of the month. No per-team, per-repo, or per-tool breakdown — just a total that keeps climbing.",
  },
  {
    index: "02",
    title: "Untracked machines leak spend.",
    body: "Every device without metering is invisible usage. The gap between what you're invoiced and what you can attribute quietly compounds.",
  },
  {
    index: "03",
    title: "Waste hides in the defaults.",
    body: "Cache misses, oversized models on trivial tasks, idle seats on paid subscriptions — none of it shows up until someone measures it.",
  },
];

export default function Problem() {
  return (
    <section className="py-24 sm:py-36">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.35fr] lg:gap-24">
          {/* sticky editorial statement */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <p className="eyebrow mb-6">The problem</p>
              <h2 className="display-2">
                AI spend is the fastest-growing line item nobody can see.
              </h2>
              <p className="lead mt-5 max-w-md">
                Teams adopted AI coding tools in weeks. The cost controls never
                arrived. PlanckSpace exists to close that gap.
              </p>
            </Reveal>
          </div>

          {/* numbered ledger */}
          <div>
            {PAINS.map((p, i) => (
              <Reveal key={p.index} delay={i * 0.08}>
                <div className="group border-t border-[var(--border)] py-9 last:border-b sm:py-11">
                  <div className="flex gap-6 sm:gap-10">
                    <span className="num pt-1 text-[13px] text-[var(--text-3)]">
                      {p.index}
                    </span>
                    <div>
                      <h3 className="text-[19px] font-semibold tracking-[-0.02em] text-[var(--ink)] sm:text-[22px]">
                        {p.title}
                      </h3>
                      <p className="mt-2.5 max-w-lg text-[15px] leading-relaxed text-[var(--text-2)]">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
