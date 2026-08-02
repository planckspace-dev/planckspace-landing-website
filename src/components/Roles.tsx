import { Reveal } from "@/components/ui/reveal";

const ROLES = [
  {
    eyebrow: "For leadership",
    title: "Defend the AI budget with numbers.",
    points: [
      "One figure for total AI spend, reconciled against provider invoices",
      "Cost per shipped session: the ROI number, by team",
      "Savings verified from telemetry, not a vendor's estimate",
      "Board-ready exports without asking engineering",
    ],
  },
  {
    eyebrow: "For managers",
    title: "Know where the budget actually goes.",
    points: [
      "Per-team and per-repo attribution, updated live",
      "Budgets with pace alerts before the overrun, not after",
      "Waste surfaced as line items with a dollar value",
      "A ranked queue of fixes, highest recovery first",
    ],
  },
  {
    eyebrow: "For developers",
    title: "Your usage, not your keystrokes.",
    points: [
      "Personal cost and cache-efficiency insights in the editor",
      "One-click fixes, backed up and undoable",
      "Metadata only, verifiable with planck inspect",
      "No screenshots, no timers, no surveillance",
    ],
  },
];

export default function Roles() {
  return (
    <section className="section-y border-t border-[var(--border)]">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <h2 className="display-2">
            The same numbers, three very different questions answered.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:mt-14 lg:grid-cols-3">
          {ROLES.map((r, i) => (
            <Reveal key={r.eyebrow} delay={i * 0.08} className="h-full">
              <div className="flex h-full flex-col bg-white p-7 sm:p-10">
                <p className="num mb-4 text-[11px] uppercase tracking-[0.16em] text-[var(--brand-700)] sm:mb-5">
                  {r.eyebrow}
                </p>
                <h3 className="text-[20px] font-semibold leading-snug tracking-[-0.02em] text-[var(--ink)]">
                  {r.title}
                </h3>
                <ul className="mt-6 space-y-3.5">
                  {r.points.map((p) => (
                    <li key={p} className="flex gap-3 text-[14px] leading-relaxed text-[var(--text-2)]">
                      <span aria-hidden className="num shrink-0 text-[14px] leading-relaxed text-[var(--text-3)]">
                        +
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
