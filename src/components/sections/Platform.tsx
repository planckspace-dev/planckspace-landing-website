import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import SectionHead from "@/components/site/SectionHead";
import { RECEIPTS, billedTotal, meteredTotal, seatTotal, usageValue, usd } from "@/lib/sample";

/* ─────────────────────────────────────────────────────────────────────────
   The platform: the problem in two sentences, then the four moves of the
   loop, each with one small exhibit drawn from the same sample month. The
   exhibits are artefacts (a ledger, a figure, a diff, a booked row), never
   screens of the console.
   ───────────────────────────────────────────────────────────────────────── */

const routing = RECEIPTS.find((r) => r.id === "routing")!;

function Exhibit({ children }: { children: ReactNode }) {
  return <div className="mt-auto rounded-[18px] border border-line-soft bg-band p-5 sm:p-6">{children}</div>;
}

function MeasureExhibit() {
  const seatPct = (seatTotal / billedTotal) * 100;
  return (
    <Exhibit>
      <div className="flex items-baseline justify-between">
        <p className="text-[0.8125rem] font-medium text-ink">Billed</p>
        <p className="num font-mono text-[1.0625rem] font-medium text-ink">{usd(billedTotal)}</p>
      </div>
      <div className="mt-2.5 flex h-2.5 gap-[2px]" aria-hidden>
        <span className="rounded-l-full bg-ink" style={{ width: `${seatPct}%` }} />
        <span className="flex-1 rounded-r-full bg-brand-600" />
      </div>
      <p className="mt-2 flex justify-between font-mono text-[0.6875rem] text-muted">
        <span>seats {usd(seatTotal)}</span>
        <span>metered {usd(meteredTotal)}</span>
      </p>

      <div className="my-4 flex items-center gap-3 text-[0.6875rem] text-subtle">
        <span className="h-px flex-1 bg-line" />
        never added together
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="flex items-baseline justify-between">
        <p className="text-[0.8125rem] font-medium text-muted">Usage value</p>
        <p className="num font-mono text-[1.0625rem] font-medium text-muted">{usd(usageValue)}</p>
      </div>
      <div className="hatch mt-2.5 h-2.5 rounded-full ring-1 ring-inset ring-amber-500/40" style={{ "--hatch": "#ecc99b" } as CSSProperties} aria-hidden />
      <p className="mt-2 font-mono text-[0.6875rem] text-muted">work on flat-rate seats, at API rates</p>
    </Exhibit>
  );
}

function FindExhibit() {
  return (
    <Exhibit>
      <p className="fig text-[3.5rem] font-semibold text-ink sm:text-[4rem]">71%</p>
      <p className="mt-3 max-w-[22rem] text-[0.9375rem] leading-snug text-body">
        of Opus sessions in <span className="font-mono text-[0.85em] text-ink">payments-api</span> were routine: under 12 turns, single-file
        edits.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="pill pill-waste">−$1,380 a month</span>
        <span className="pill pill-neutral pill-bare">fix: default to Sonnet</span>
      </div>
    </Exhibit>
  );
}

function FixExhibit() {
  return (
    <Exhibit>
      <div className="overflow-hidden rounded-[12px] border border-line bg-surface font-mono text-[0.78rem] leading-[1.9]">
        <p className="border-b border-line-soft px-4 py-2 text-[0.7rem] text-muted">payments-api / .claude/settings.json</p>
        <div className="px-4 py-3">
          <p className="text-subtle">{"{"}</p>
          <p className="-mx-4 bg-green-50 px-4 text-green-700">
            <span className="mr-3 select-none">+</span>&nbsp;&nbsp;&quot;model&quot;: &quot;sonnet&quot;
          </p>
          <p className="text-subtle">{"}"}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-[0.8125rem] text-green-700">
          <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
          Applied, backed up
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-[0.75rem] font-medium text-body">
          <RotateCcw className="h-3 w-3" strokeWidth={2.2} />
          Undo
        </span>
      </div>
    </Exhibit>
  );
}

function ProveExhibit() {
  return (
    <Exhibit>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[0.8125rem] font-medium text-ink">{routing.title}</p>
        <p className="shrink-0 font-mono text-[0.75rem] text-muted">confirmed {routing.verified}</p>
      </div>
      <p className="mt-1 text-[0.75rem] text-muted">{routing.metric}</p>
      <div className="relative mt-5 h-[3px] rounded-full bg-line" aria-hidden>
        <span className="absolute inset-y-0 rounded-full bg-green-500/50" style={{ left: `${routing.afterPos * 100}%`, right: `${100 - routing.beforePos * 100}%` }} />
        <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-coral-500" style={{ left: `${routing.beforePos * 100}%` }} />
        <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-green-500" style={{ left: `${routing.afterPos * 100}%` }} />
      </div>
      <p className="mt-3 flex justify-between font-mono text-[0.6875rem] text-muted">
        <span>after {routing.after}</span>
        <span>before {routing.before}</span>
      </p>
      <div className="mt-5 border-t border-line pt-4">
        <div className="leader text-[0.875rem]">
          <span className="text-body">{routing.booked} repriced</span>
          <span className="fill" aria-hidden />
          <span className="amt font-mono font-semibold text-green-700">{usd(routing.usd)}/mo</span>
        </div>
      </div>
    </Exhibit>
  );
}

const MOVES = [
  {
    id: "measure",
    n: "01",
    label: "Measure",
    title: "Every dollar, in its ledger.",
    body: "Each session becomes a row: tool, model, tokens, repository, outcome. Billed dollars and the usage value of flat-rate seats are kept in separate ledgers, so no figure quietly mixes the two.",
    link: { label: "How the two ledgers work", href: "/docs/concepts/two-ledgers" },
    exhibit: <MeasureExhibit />,
  },
  {
    id: "find",
    n: "02",
    label: "Find",
    title: "Waste, priced by the month.",
    body: "Seats nobody opens, plans larger than the work, premium models on routine edits, prompt caches gone cold. Each finding carries its evidence, its monthly amount and its fix.",
    link: { label: "What counts as a finding", href: "/docs/concepts/findings" },
    exhibit: <FindExhibit />,
  },
  {
    id: "fix",
    n: "03",
    label: "Fix",
    title: "One click. One more to undo.",
    body: "Mechanical fixes apply from the editor, next to the code they concern, with a backup first. Judgement calls go to your own Claude Code with the numbers attached. Seat changes wait for an approval.",
    link: { label: "Fixing a finding", href: "/docs/guides/fix-findings" },
    exhibit: <FixExhibit />,
  },
  {
    id: "prove",
    n: "04",
    label: "Prove",
    title: "A saving is a receipt.",
    body: "After a fix, the sessions that follow are priced at the rates you paid before it. The difference is booked row by row, only once there is enough work to judge.",
    link: { label: "How savings are measured", href: "/docs/concepts/proof-of-savings" },
    exhibit: <ProveExhibit />,
  },
];

export default function Platform() {
  return (
    <section id="platform" aria-labelledby="platform-title" className="section">
      <div className="wrap">
        <SectionHead
          id="platform-title"
          eyebrow="The platform"
          split
          title={
            <>
              AI is now a line item. <span className="tone">Nobody can itemize it.</span>
            </>
          }
          lede="The bill grows every month and no one can say what it bought. PlanckSpace reads the usage your tools already record and turns it into a ledger you can act on."
        />

        <div className="mt-16 grid grid-cols-1 overflow-hidden rounded-[28px] border border-line bg-surface shadow-[var(--shadow-card)] md:grid-cols-2 lg:mt-20">
          {MOVES.map((m, i) => (
            <Reveal
              key={m.id}
              id={m.id}
              delay={(i % 2) * 90}
              className="flex scroll-mt-28 flex-col border-line p-7 sm:p-10 [&:not(:first-child)]:border-t md:[&:nth-child(2)]:border-l md:[&:nth-child(2)]:border-t-0 md:[&:nth-child(4)]:border-l"
            >
              <p className="eyebrow">
                <span className="eyebrow-n">{m.n}</span>
                {m.label}
              </p>
              <h3 className="title-md mt-5">{m.title}</h3>
              <p className="copy mt-4 max-w-[30rem]">{m.body}</p>
              <Link href={m.link.href} className="link-arrow mb-8 mt-5">
                {m.link.label} <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
              {m.exhibit}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
