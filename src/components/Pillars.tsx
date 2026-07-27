import { Lock } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

/* ─────────────────────────────────────────────────────────────────────────
   The spine of the whole page: Measure → Optimize → Connect → Verify.

   Every section after this one is an expansion of one of these four moves,
   so the labels here are load-bearing. Features expands Measure, the
   detection engine expands Optimize and Verify, Roles expands Connect.
   Change a name here and change it in those sections too.
   ───────────────────────────────────────────────────────────────────────── */

const PILLARS = [
  {
    n: "01",
    name: "Measure",
    body: "Every AI session, token, and dollar attributed to the developer, team, repository, and model that generated it.",
    out: "attribution, not invoices",
  },
  {
    n: "02",
    name: "Optimize",
    body: "Concrete actions, priced: reclaim idle seats, route the right model, shrink the context you re-send, end the sessions that never converge.",
    out: "a ranked queue, in dollars",
  },
  {
    n: "03",
    name: "Connect to outcomes",
    body: "Usage tied to what actually shipped: repository activity, developer throughput, and the cost of every session that made it to main.",
    out: "cost per shipped session",
  },
  {
    n: "04",
    name: "Verify",
    body: "Every recommendation re-measured from your own telemetry after the fix, so savings are booked from data instead of claimed from a model.",
    out: "a ledger, not an estimate",
  },
];

export default function Pillars() {
  return (
    <section
      id="approach"
      className="scroll-mt-24 border-t border-[var(--border)] py-24 sm:py-36"
    >
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="display-2">PlanckSpace makes AI coding measurable.</h2>
          <p className="lead mt-5">
            A lightweight local agent continuously attributes AI coding activity
            across developers, repositories, and teams, turning raw usage into
            engineering decisions you can defend in a budget meeting.
          </p>
        </Reveal>

        {/* Four moves, in order. The top rules read as one broken rail across
            the row on wide screens, which is the progression. */}
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {PILLARS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.07}>
              <div className="flex h-full flex-col border-t border-[var(--border-strong)] pt-6">
                <span className="num text-[13px] text-[var(--brand-700)]">{p.n}</span>
                <h3 className="mt-4 text-[21px] font-semibold tracking-[-0.025em] text-[var(--ink)]">
                  {p.name}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--text-2)]">
                  {p.body}
                </p>
                <div className="flex-1" />
                <p className="num mt-6 border-t border-[var(--border)] pt-4 text-[11.5px] text-[var(--text-3)]">
                  {p.out}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 flex justify-center">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-[var(--brand-100)] bg-[var(--brand-50)] px-4 py-2 text-[13.5px] font-medium text-[var(--brand-900)]">
            <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            Never your code. Never your prompts.
          </span>
        </Reveal>
      </div>
    </section>
  );
}
