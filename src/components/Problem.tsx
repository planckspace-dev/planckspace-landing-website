import { Reveal } from "@/components/ui/reveal";

/* The three questions an engineering leader cannot answer today: cost,
   efficiency, impact, in that order, because each one depends on the one
   before it. The stat band underneath is the "this is everyone, not you"
   reassurance; sources are named on purpose. */

const QUESTIONS = [
  {
    index: "01",
    kicker: "Cost",
    title: "Where is the spend actually going?",
    body: "There is no attribution across developers, teams, or repositories. Finance sees one number at the end of the month that keeps climbing, and nobody can break it apart.",
  },
  {
    index: "02",
    kicker: "Efficiency",
    title: "Are teams getting leverage from AI?",
    body: "No visibility into wasted tokens, idle seats, oversized models on trivial work, or the sessions that grind for two hours and ship nothing. None of it surfaces until someone measures it.",
  },
  {
    index: "03",
    kicker: "Impact",
    title: "Is AI improving engineering outcomes?",
    body: "Nothing connects AI usage to shipped work. The one number that would settle the argument, what a shipped change actually costs, does not exist anywhere.",
  },
];

const ADOPTION = [
  {
    value: "84%",
    label: "of developers use or plan to use AI coding tools",
    source: "Stack Overflow Developer Survey 2025",
  },
  {
    value: "91%",
    label: "of organizations run more than one AI coding tool",
    source: "GitLab Global DevSecOps Report 2026",
  },
  {
    value: "51%",
    label: "of professional developers use AI every day",
    source: "Stack Overflow Developer Survey 2025",
  },
];

export default function Problem() {
  return (
    <section className="section-y">
      <div className="container-x">
        <div className="grid gap-10 sm:gap-14 lg:grid-cols-[1fr_1.35fr] lg:gap-24">
          {/* sticky editorial statement */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <h2 className="display-2">
                AI changed how we write code. Nobody knows what it’s costing.
              </h2>
              <p className="lead mt-5 max-w-md">
                Every team is already spending on AI. On an invoice, every
                interaction looks identical, so no one can tell which
                developers, repositories, or workflows created any value.
              </p>
              <p className="mt-6 max-w-md text-[14.5px] leading-relaxed text-[var(--text-3)]">
                Cloud got its observability layer a decade ago. AI coding
                doesn’t have one yet.
              </p>
            </Reveal>
          </div>

          {/* the three unanswerable questions */}
          <div>
            {QUESTIONS.map((q, i) => (
              <Reveal key={q.index} delay={i * 0.08}>
                <div className="border-t border-[var(--border)] py-7 last:border-b sm:py-11">
                  <div className="flex gap-4 sm:gap-10">
                    <span className="num pt-1 text-[13px] text-[var(--text-3)]">
                      {q.index}
                    </span>
                    <div>
                      <p className="num mb-2 text-[11px] uppercase tracking-[0.16em] text-[var(--brand-700)]">
                        {q.kicker}
                      </p>
                      <h3 className="text-[19px] font-semibold tracking-[-0.02em] text-[var(--ink)] sm:text-[22px]">
                        {q.title}
                      </h3>
                      <p className="mt-2.5 max-w-lg text-[15px] leading-relaxed text-[var(--text-2)]">
                        {q.body}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* the scale of the budget forming underneath all of this */}
        <Reveal className="mt-12 sm:mt-24">
          <p className="mb-8 max-w-md text-[15px] leading-relaxed text-[var(--text-3)]">
            This is not a niche line item. It is the fastest-growing budget in
            most engineering organizations.
          </p>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
            {ADOPTION.map((a) => (
              <div key={a.source + a.value} className="bg-white p-6 sm:p-8">
                <div className="num text-[40px] leading-none font-medium tracking-[-0.04em] text-[var(--ink)] sm:text-[52px]">
                  {a.value}
                </div>
                <p className="mt-4 text-[14.5px] leading-relaxed text-[var(--text-2)]">
                  {a.label}
                </p>
                <p className="num mt-4 border-t border-[var(--border)] pt-3 text-[10.5px] text-[var(--text-3)]">
                  {a.source}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
