import { Reveal } from "@/components/ui/reveal";

const ROLES = [
  {
    eyebrow: "For leadership",
    title: "Defend the AI budget with numbers.",
    points: [
      "One figure for total AI spend, reconciled against provider invoices",
      "ROI framing: spend vs. sessions shipped, by team",
      "Board-ready exports without asking engineering",
    ],
  },
  {
    eyebrow: "For managers",
    title: "Know where the budget actually goes.",
    points: [
      "Per-team and per-repo attribution, updated live",
      "Budgets with pace alerts before the overrun, not after",
      "Waste surfaced as line items you can act on",
    ],
  },
  {
    eyebrow: "For developers",
    title: "Your usage, not your keystrokes.",
    points: [
      "Personal cost and cache-efficiency insights in the editor",
      "Metadata only — verify what syncs with planck inspect",
      "No screenshots, no timers, no surveillance",
    ],
  },
];

export default function Roles() {
  return (
    <section className="border-t border-[var(--border)] py-24 sm:py-36">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-6">Every seat at the table</p>
          <h2 className="display-2">
            The same numbers, three very different questions answered.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] lg:grid-cols-3">
          {ROLES.map((r, i) => (
            <Reveal key={r.eyebrow} delay={i * 0.08} className="h-full">
              <div className="flex h-full flex-col bg-white p-8 sm:p-10">
                <p className="num mb-5 text-[11px] uppercase tracking-[0.16em] text-[var(--brand-700)]">
                  {r.eyebrow}
                </p>
                <h3 className="text-[20px] font-semibold leading-snug tracking-[-0.02em] text-[var(--ink)]">
                  {r.title}
                </h3>
                <ul className="mt-6 space-y-3.5">
                  {r.points.map((p) => (
                    <li key={p} className="flex gap-3 text-[14px] leading-relaxed text-[var(--text-2)]">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[var(--border-strong)]" />
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
