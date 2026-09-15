import { Reveal } from "@/components/ui/reveal";
import { InView } from "@/components/ui/in-view";

/* The three questions an engineering leader cannot answer today: cost,
   efficiency, impact, in that order, because each one depends on the one
   before it. The stat band underneath is the "this is everyone, not you"
   reassurance; sources are named on purpose.

   Two visuals carry the argument so the copy does not have to:
   - The invoice. Six months of one line item, climbing, drawn in ink and grey
     on purpose. It is the "before" picture; the hero console above it is what
     the same spend looks like once it is attributed.
   - The waffles. Each adoption figure is shown as units of the Planck raster
     the hero sits on, so a percentage reads as a share of people, not a
     number in a box. */

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
    value: 84,
    label: "of developers use or plan to use AI coding tools",
    source: "Stack Overflow Developer Survey 2025",
  },
  {
    value: 91,
    label: "of organizations run more than one AI coding tool",
    source: "GitLab Global DevSecOps Report 2026",
  },
  {
    value: 51,
    label: "of professional developers use AI every day",
    source: "Stack Overflow Developer Survey 2025",
  },
];

const INVOICE = [
  { m: "Apr", v: 7420 },
  { m: "May", v: 10890 },
  { m: "Jun", v: 15230 },
  { m: "Jul", v: 21780 },
  { m: "Aug", v: 29640 },
  { m: "Sep", v: 41280 },
];

function Invoice() {
  const W = 360;
  const H = 132;
  const max = 44000;
  const slot = W / INVOICE.length;
  const bw = 30;
  return (
    <InView className="mt-9 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
      <div className="flex items-baseline justify-between gap-3 border-b border-[var(--border)] px-5 py-3.5">
        <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--text-3)]">
          AI tooling, monthly invoice
        </span>
        <span className="num text-[10.5px] text-[var(--text-3)]">1 line item</span>
      </div>

      <div className="px-5 pb-4 pt-5">
        <svg
          viewBox={`0 0 ${W} ${H + 18}`}
          className="block h-auto w-full overflow-visible"
          role="img"
          aria-label="AI tooling invoice by month, April to September: $7,420 rising to $41,280, with no breakdown by developer, repository or team."
        >
          {INVOICE.map((d, i) => {
            const h = (d.v / max) * H;
            const x = i * slot + (slot - bw) / 2;
            const last = i === INVOICE.length - 1;
            return (
              <g key={d.m}>
                <rect
                  className="iv-grow-y"
                  style={{ "--d": `${0.1 + i * 0.09}s` } as React.CSSProperties}
                  x={x}
                  y={H - h}
                  width={bw}
                  height={h}
                  rx="4"
                  fill={last ? "var(--ink)" : "var(--border-strong)"}
                />
                <text
                  x={x + bw / 2}
                  y={H + 15}
                  textAnchor="middle"
                  className="num"
                  fontSize="10"
                  fill="var(--text-3)"
                >
                  {d.m}
                </text>
                {last && (
                  <text
                    className="num iv-fade"
                    style={{ "--d": "0.8s" } as React.CSSProperties}
                    x={x + bw}
                    y={H - h - 8}
                    textAnchor="end"
                    fontSize="12"
                    fontWeight="500"
                    fill="var(--ink)"
                  >
                    $41,280
                  </text>
                )}
              </g>
            );
          })}
          <line x1="0" x2={W} y1={H} y2={H} stroke="var(--border-strong)" />
        </svg>
      </div>

      {/* the line item, and everything it does not say */}
      <div className="border-t border-[var(--border)] bg-[var(--panel)] px-5 py-3.5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[12.5px] text-[var(--ink)]">AI coding tools, September</span>
          <span className="num text-[12.5px] font-medium text-[var(--ink)]">$41,280.00</span>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {["developer", "repository", "team", "outcome"].map((k) => (
            <span
              key={k}
              className="num rounded border border-dashed border-[var(--border-strong)] px-1.5 py-0.5 text-[10px] text-[var(--text-3)]"
            >
              {k}: ?
            </span>
          ))}
        </div>
      </div>
    </InView>
  );
}

function Waffle({ value }: { value: number }) {
  return (
    <div className="waffle" aria-hidden>
      {Array.from({ length: 100 }).map((_, i) => {
        // fill bottom-up, left to right, the way a level rises
        const row = 9 - Math.floor(i / 10);
        const idx = row * 10 + (i % 10);
        const on = idx < value;
        return (
          <i
            key={i}
            data-on={on ? "" : undefined}
            style={on ? ({ "--i": idx } as React.CSSProperties) : undefined}
          />
        );
      })}
    </div>
  );
}

export default function Problem() {
  return (
    <section className="section-y">
      <div className="container-x">
        <div className="grid gap-10 sm:gap-14 lg:grid-cols-[1fr_1.35fr] lg:gap-24">
          {/* sticky editorial statement */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <h2 className="display-2">
                AI changed how we write code. Nobody knows what it’s costing.
              </h2>
              <p className="lead mt-5 max-w-md">
                Every team is already spending on AI. On an invoice, every
                interaction looks identical, so no one can tell which
                developers, repositories, or workflows created any value.
              </p>
              <Invoice />
              <p className="mt-5 max-w-md text-[14.5px] leading-relaxed text-[var(--text-3)]">
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
          <InView className="grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
            {ADOPTION.map((a) => (
              <div key={a.source + a.value} className="flex flex-col bg-white p-6 sm:p-8">
                <div className="flex items-start justify-between gap-5">
                  <div className="num text-[40px] leading-none font-medium tracking-[-0.04em] text-[var(--ink)] sm:text-[52px]">
                    {a.value}%
                  </div>
                  <Waffle value={a.value} />
                </div>
                <p className="mt-5 text-[14.5px] leading-relaxed text-[var(--text-2)]">
                  {a.label}
                </p>
                <div className="flex-1" />
                <p className="num mt-4 border-t border-[var(--border)] pt-3 text-[10.5px] text-[var(--text-3)]">
                  {a.source}
                </p>
              </div>
            ))}
          </InView>
        </Reveal>
      </div>
    </section>
  );
}
