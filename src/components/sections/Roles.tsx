import Reveal from "@/components/site/Reveal";
import SectionHead from "@/components/site/SectionHead";

/* Who it is for: three readers of the same ledger, each promised one thing.
   Set as three rows of a ledger: who, the promise as a headline, and what
   they get. */

const ROLES = [
  {
    who: "Leaders",
    promise: "A bill you can explain.",
    points: [
      "What you paid, by team, repository and tool, checked against the real invoice.",
      "Savings counted from real sessions and seat changes, never a forecast.",
      "Budgets that warn you before the money runs out.",
    ],
  },
  {
    who: "Managers",
    promise: "Your team's numbers, not a watchlist.",
    points: [
      "What your team spent and how much of its work shipped, next to last period.",
      "The waste found in your own team, each with its fix.",
      "In a collaborative workspace, names stay hidden from everyone, you included.",
    ],
  },
  {
    who: "Developers",
    promise: "Fixes in the editor, not a lecture.",
    points: [
      "Your own numbers the first time you open it, in VS Code, Cursor or Windsurf.",
      "One-click fixes with a backup and an Undo.",
      "Usage data only. Run planck inspect to see what any session sends.",
    ],
  },
];

export default function Roles() {
  return (
    <section id="roles" aria-labelledby="roles-title" className="section band">
      <div className="wrap">
        <SectionHead
          id="roles-title"
          eyebrow="Who it is for"
          titleClassName="max-w-[18ch]"
          title={
            <>
              The same numbers, for the people who <span className="tone">pay, lead and build.</span>
            </>
          }
        />

        <div className="mt-14 border-t-2 border-ink lg:mt-20">
          {ROLES.map((r, i) => (
            <Reveal
              key={r.who}
              delay={i * 60}
              className="grid grid-cols-1 gap-5 border-b border-line-strong py-9 sm:py-11 lg:grid-cols-[minmax(0,10rem)_minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12 lg:py-14"
            >
              <p className="eyebrow self-start lg:pt-3">{r.who}</p>
              <p className="text-[clamp(2rem,3.6vw,3.25rem)] font-semibold leading-[1] tracking-[-0.045em] text-balance text-ink">{r.promise}</p>
              <ul className="space-y-3 lg:pt-2">
                {r.points.map((p) => (
                  <li key={p} className="flex gap-3 text-[1rem] leading-relaxed text-body sm:text-[1.0625rem]">
                    <span className="mt-[0.62em] h-1.5 w-1.5 shrink-0 bg-brand-600" aria-hidden />
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
