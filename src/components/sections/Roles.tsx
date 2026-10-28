import Reveal from "@/components/site/Reveal";
import SectionHead from "@/components/site/SectionHead";

/* Who it is for: three readers of the same ledger, each promised one thing. */

const ROLES = [
  {
    who: "Leaders",
    promise: "A bill you can defend.",
    points: [
      "Billed spend by team, repository and tool, checked against the provider invoice.",
      "Savings booked from real sessions and seat changes, never projected.",
      "Budgets with alerts before the month runs out, on billed dollars only.",
    ],
  },
  {
    who: "Managers",
    promise: "Your team's numbers, not a watchlist.",
    points: [
      "Spend and ship rate for your team, side by side, against the prior period.",
      "Findings scoped to your team's people, with the fix attached.",
      "A collaborative workspace keeps identities private from every role, yours included.",
    ],
  },
  {
    who: "Developers",
    promise: "Fixes in the editor, not a lecture.",
    points: [
      "Your own numbers on first open, in VS Code, Cursor or Windsurf.",
      "One-click fixes with a backup and an Undo.",
      "Metadata only, and planck inspect lets you check any session's payload.",
    ],
  },
];

export default function Roles() {
  return (
    <section id="roles" aria-labelledby="roles-title" className="section pt-0">
      <div className="wrap">
        <div className="rule mb-[var(--section-y)]" />
        <SectionHead
          id="roles-title"
          eyebrow="Who it is for"
          title={
            <>
              One ledger, read by the people who <span className="tone">sign, run and ship.</span>
            </>
          }
        />

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-0 lg:mt-20">
          {ROLES.map((r, i) => (
            <Reveal key={r.who} delay={i * 80} className="border-line md:px-8 md:first:pl-0 md:last:pr-0 md:[&:not(:first-child)]:border-l">
              <p className="eyebrow">{r.who}</p>
              <p className="title-md mt-5 text-[clamp(1.4rem,1.9vw,1.65rem)] md:min-h-[2lh]">{r.promise}</p>
              <ul className="mt-7 space-y-4">
                {r.points.map((p) => (
                  <li key={p} className="flex gap-3 text-[0.9375rem] leading-relaxed text-body">
                    <span className="mt-[0.6em] h-[5px] w-[5px] shrink-0 rounded-full bg-brand-600" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
