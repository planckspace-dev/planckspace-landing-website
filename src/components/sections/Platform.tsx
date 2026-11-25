import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import CountUp from "@/components/reactbits/CountUp";
import Reveal from "@/components/site/Reveal";
import SectionHead from "@/components/site/SectionHead";
import { RECEIPTS, billedTotal, meteredTotal, seatTotal, usageValue, usd } from "@/lib/sample";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────
   The platform: the problem in two sentences, then the four moves of the
   loop, each with one exhibit drawn from the same sample month. The exhibits
   are artefacts (a ledger, a figure, a diff, a booked row), never screens of
   the console.

   Each move wears the meaning the palette already has: Measure is blue (the
   ledger), Find is coral (waste), Fix is ink (the one night cell, the diff
   as a dark code block), Prove is green (saved). The number label, the
   exhibit's key figure and the exhibit's surface carry it.
   ───────────────────────────────────────────────────────────────────────── */

const routing = RECEIPTS.find((r) => r.id === "routing")!;

type Tone = "measure" | "find" | "fix" | "prove";

const SURFACE: Record<Tone, string> = {
  measure: "bg-brand-50 ring-brand-100",
  find: "bg-coral-50 ring-coral-500/15",
  fix: "bg-night-2 ring-white/10",
  prove: "bg-green-50 ring-green-700/15",
};

const LABEL: Record<Tone, string> = {
  measure: "text-brand-600",
  find: "text-coral-700",
  fix: "text-ink",
  prove: "text-green-700",
};

function Exhibit({ tone, className, children }: { tone: Tone; className?: string; children: ReactNode }) {
  return <div className={cn("mt-auto rounded-[20px] ring-1 ring-inset", SURFACE[tone], className ?? "p-6 sm:p-8")}>{children}</div>;
}

function MeasureExhibit() {
  const seatPct = (seatTotal / billedTotal) * 100;
  return (
    <Exhibit tone="measure">
      <div className="flex items-end justify-between gap-4">
        <p className="pb-1 text-[0.9375rem] font-medium text-ink">Billed</p>
        <p className="fig text-[clamp(2.25rem,3.6vw,3.25rem)] font-semibold tracking-[-0.045em] text-brand-700">
          <CountUp to={billedTotal} prefix="$" separator="," />
        </p>
      </div>
      <div className="mt-4 flex h-3 gap-1" aria-hidden>
        <span className="rounded-l-full bg-ink" style={{ width: `${seatPct}%` }} />
        <span className="flex-1 rounded-r-full bg-brand-600" />
      </div>
      <p className="mt-3 flex justify-between font-mono text-[0.75rem] text-muted">
        <span>seats {usd(seatTotal)}</span>
        <span>API usage {usd(meteredTotal)}</span>
      </p>

      <div className="my-5 flex items-center gap-3 font-mono text-[0.6875rem] text-muted">
        <span className="h-px flex-1 bg-brand-100" />
        never added together
        <span className="h-px flex-1 bg-brand-100" />
      </div>

      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[0.9375rem] font-medium text-muted">Usage value</p>
        <p className="num font-mono text-[1.25rem] font-medium text-muted">{usd(usageValue)}</p>
      </div>
      <div className="hatch mt-3 h-3 rounded-full ring-1 ring-inset ring-amber-500/40" style={{ "--hatch": "#ecc99b" } as CSSProperties} aria-hidden />
      <p className="mt-3 font-mono text-[0.75rem] text-muted">seat work, valued at API prices</p>
    </Exhibit>
  );
}

function FindExhibit() {
  return (
    <Exhibit tone="find" className="p-6 pt-8 sm:p-8 sm:pt-10">
      <p className="fig-display text-coral-600">
        <CountUp to={71} suffix="%" />
      </p>
      <p className="mt-6 max-w-[24rem] text-[1.0625rem] leading-snug text-body">
        of Opus sessions in <span className="font-mono text-[0.85em] text-ink">payments-api</span> were routine work: short, single-file edits.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="pill h-7 bg-surface px-3 text-[0.8125rem] text-coral-700 ring-1 ring-inset ring-coral-500/25">−$1,380 a month</span>
        <span className="pill pill-bare h-7 bg-surface/70 px-3 text-[0.8125rem] text-body ring-1 ring-inset ring-coral-500/15">fix: default to Sonnet</span>
      </div>
    </Exhibit>
  );
}

function FixExhibit() {
  return (
    <Exhibit tone="fix" className="overflow-hidden">
      <p className="flex items-center gap-2 border-b border-white/10 px-5 py-3 font-mono text-[0.75rem] text-muted sm:px-6">
        <span className="h-2 w-2 rounded-full bg-white/25" aria-hidden />
        payments-api / .claude/settings.json
      </p>
      <div className="py-4 font-mono text-[0.84rem] leading-[2] sm:text-[0.9rem]">
        <p className="px-5 text-muted sm:px-6">{"{"}</p>
        <p className="border-l-2 border-green-500 bg-green-50 px-5 text-green-700 sm:px-6">
          <span className="mr-3 select-none">+</span>&nbsp;&nbsp;&quot;model&quot;: &quot;sonnet&quot;
        </p>
        <p className="px-5 text-muted sm:px-6">{"}"}</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-3 sm:px-6">
        <span className="flex items-center gap-2 whitespace-nowrap text-[0.875rem] text-green-700">
          <Check className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          Applied, backed up
        </span>
        <span className="flex h-8 items-center gap-2 rounded-full bg-white/[0.07] px-3 text-[0.8125rem] font-medium text-ink ring-1 ring-inset ring-white/15">
          <RotateCcw className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          Undo
        </span>
      </div>
    </Exhibit>
  );
}

function ProveExhibit() {
  return (
    <Exhibit tone="prove">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-[0.9375rem] font-medium text-ink">{routing.title}</p>
        <p className="shrink-0 font-mono text-[0.75rem] text-muted">confirmed {routing.verified}</p>
      </div>
      <p className="mt-1 text-[0.8125rem] text-muted">{routing.metric}</p>
      <div className="relative mt-6 h-1 rounded-full bg-green-700/15" aria-hidden>
        <span className="absolute inset-y-0 rounded-full bg-green-500/60" style={{ left: `${routing.afterPos * 100}%`, right: `${100 - routing.beforePos * 100}%` }} />
        <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-green-50 bg-coral-500" style={{ left: `${routing.beforePos * 100}%` }} />
        <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-green-50 bg-green-500" style={{ left: `${routing.afterPos * 100}%` }} />
      </div>
      <p className="mt-3 flex justify-between font-mono text-[0.75rem] text-muted">
        <span>after {routing.after}</span>
        <span>before {routing.before}</span>
      </p>
      <div className="mt-6 border-t border-green-700/15 pt-5">
        {/* a leader row where the cell is wide enough; label over figure elsewhere */}
        <div className="leader flex-col items-start gap-2 xl:flex-row xl:items-baseline xl:gap-2">
          <span className="text-[0.9375rem] text-body">Saved across {routing.booked}</span>
          <span className="fill hidden xl:block" aria-hidden />
          <span className="amt fig text-[clamp(2rem,2.8vw,2.375rem)] font-semibold tracking-[-0.04em] text-green-700">
            <CountUp to={routing.usd} prefix="$" separator="," suffix="/mo" />
          </span>
        </div>
      </div>
    </Exhibit>
  );
}

const MOVES: { id: Tone; n: string; label: string; title: ReactNode; body: string; link: { label: string; href: string }; exhibit: ReactNode }[] = [
  {
    id: "measure",
    n: "01",
    label: "Measure",
    title: "See where every dollar goes.",
    body: "Every AI coding session is recorded with its tool, model, repository and cost, and whether the work shipped. What you actually paid is always shown apart from the value of work done on flat-rate seats, so no number mixes the two.",
    link: { label: "How billed and usage value differ", href: "/docs/concepts/two-ledgers" },
    exhibit: <MeasureExhibit />,
  },
  {
    id: "find",
    n: "02",
    label: "Find",
    title: "Find the money being wasted.",
    body: "Paid seats nobody uses. Plans bigger than the work needs. Expensive models doing simple edits. The same context paid for at full price, again and again. Each one comes with the evidence, what it costs you a month, and the fix.",
    link: { label: "What counts as waste", href: "/docs/concepts/findings" },
    exhibit: <FindExhibit />,
  },
  {
    id: "fix",
    n: "03",
    label: "Fix",
    // the second sentence holds together, so the break falls between them
    title: (
      <>
        Fix it in one click. <span className="whitespace-nowrap">Undo it in one more.</span>
      </>
    ),
    body: "Simple fixes are applied right in your editor, with a backup made first. Bigger changes are handed to your own Claude Code with the numbers attached, for you to review. Nothing changes a person's seat until an admin approves it.",
    link: { label: "How fixes work", href: "/docs/guides/fix-findings" },
    exhibit: <FixExhibit />,
  },
  {
    id: "prove",
    n: "04",
    label: "Prove",
    title: "See what each fix really saved.",
    body: "After a fix, PlanckSpace works out what each new session would have cost the old way. The difference is your saving, counted one session at a time, and only once there is enough work to be sure.",
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
          eyebrow="What PlanckSpace does"
          size="xl"
          title={
            <>
              Your AI bill keeps growing. <span className="tone">Nobody can explain it.</span>
            </>
          }
          lede="Seats, plans and API keys add up fast, and no one can say what the money bought. PlanckSpace reads the usage your AI tools already record and does four things with it."
        />

        <div className="mt-14 grid grid-cols-1 overflow-hidden rounded-[32px] border border-line bg-surface shadow-[var(--shadow-card)] md:grid-cols-2 lg:mt-20">
          {MOVES.map((m, i) => (
            <Reveal
              key={m.id}
              id={m.id}
              delay={(i % 2) * 90}
              className={cn(
                "flex min-w-0 scroll-mt-28 flex-col border-line p-6 py-9 sm:p-10 lg:p-12",
                "[&:not(:first-child)]:border-t md:[&:nth-child(2)]:border-l md:[&:nth-child(2)]:border-t-0 md:[&:nth-child(4)]:border-l",
                m.id === "fix" && "on-night bg-night",
              )}
            >
              <p className="eyebrow">
                <span className={cn("eyebrow-n", LABEL[m.id])}>{m.n}</span>
                {m.label}
              </p>
              <h3 className="title-md mt-6">{m.title}</h3>
              <p className="copy mt-4 max-w-[30rem] sm:text-[1.0625rem]">{m.body}</p>
              <Link href={m.link.href} className="link-arrow mb-9 mt-6">
                {m.link.label} <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </Link>
              {m.exhibit}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
