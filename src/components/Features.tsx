import Image, { type StaticImageData } from "next/image";
import { Reveal } from "@/components/ui/reveal";

import shotOverview from "../../assets/product-shots/derived/tile-overview.png";
import shotWaste from "../../assets/product-shots/derived/tile-waste.png";
import shotBudget from "../../assets/product-shots/derived/tile-budget.png";
import shotTeams from "../../assets/product-shots/derived/tile-teams.png";
import shotSession from "../../assets/product-shots/derived/tile-session.png";
import shotExport from "../../assets/product-shots/derived/tile-export.png";

/* ─────────────────────────────────────────────────────────────────────────
   Product bento — every tile maps to a real capability in the platform
   (wasted-spend, reconciliation, budgets/anomalies, team attribution,
   session detail, chargeback exports).

   Most tiles now carry real dashboard captures, cropped by
   scripts/crop-product-shots.mjs. Reconciliation, the editor fix-it flow and
   the savings ledger still use hand-built mocks — see that script's header for
   which source shots are outstanding.
   ───────────────────────────────────────────────────────────────────────── */

function TileShell({
  title,
  body,
  children,
  className = "",
}: {
  title: string;
  body: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`card group flex flex-col overflow-hidden transition-shadow duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:shadow-[var(--shadow-float)] ${className}`}
    >
      <div className="flex-1 border-b border-[var(--border)] bg-[var(--panel)] p-5">
        {children}
      </div>
      <div className="p-5">
        <h3 className="text-[16px] font-semibold tracking-[-0.015em] text-[var(--ink)]">
          {title}
        </h3>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--text-2)]">{body}</p>
      </div>
    </div>
  );
}

/** A real dashboard capture, floated on the tile's panel wash. */
function Shot({
  src,
  alt,
  sizes,
}: {
  src: StaticImageData;
  alt: string;
  sizes: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-[0_1px_2px_rgba(17,19,26,0.04),0_14px_30px_-20px_rgba(17,19,26,0.3)]">
      <Image src={src} alt={alt} sizes={sizes} className="block h-auto w-full" />
    </div>
  );
}

/* tile sizes in the 12-col bento, used for correct srcset selection */
const WIDE = "(min-width: 1024px) 640px, 100vw";
const MID = "(min-width: 1024px) 450px, 100vw";
const NARROW = "(min-width: 1024px) 350px, 100vw";

/* mini-mocks — still hand-built where no usable capture exists ------------ */

function MockReconciliation() {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4">
      <div className="space-y-3.5">
        <div>
          <div className="mb-1.5 flex justify-between text-[10.5px]">
            <span className="text-[var(--text-2)]">Invoiced (Anthropic)</span>
            <span className="num font-medium text-[var(--ink)]">$6,120</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--inset)]">
            <div className="h-full w-full rounded-full bg-[var(--ink)]" />
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex justify-between text-[10.5px]">
            <span className="text-[var(--text-2)]">Attributed by PlanckSpace</span>
            <span className="num font-medium text-[var(--brand-700)]">$5,780</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--inset)]">
            <div className="h-full w-[94%] rounded-full bg-[var(--brand-600)]" />
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-md bg-[var(--brand-50)] px-3 py-2.5 text-[10.5px] leading-relaxed text-[var(--brand-900)]">
        <span className="num font-medium">$340 gap</span> — likely 1 engineer without
        PlanckSpace installed. Invite them to close it.
      </div>
    </div>
  );
}

function MockFixIt() {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--text-3)]">
          Insight · your editor
        </span>
        <span className="num text-[10px] text-[var(--text-3)]">high confidence</span>
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[12px] font-medium text-[var(--ink)]">
          CLAUDE.md re-read 212× per session · api-service
        </span>
        <span className="num shrink-0 text-[12px] font-medium text-[var(--green-700)]">$34/mo</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-md bg-[var(--brand-600)] px-3 py-1.5 text-[10.5px] font-medium text-white">
          ⚡ Fix now
        </span>
        <span className="rounded-md border border-[var(--border)] px-3 py-1.5 text-[10.5px] font-medium text-[var(--text-2)]">
          ▸ Fix with Claude Code
        </span>
      </div>
      <div className="mt-2.5 text-[10px] text-[var(--text-3)]">
        files backed up · one-click undo · marked fixed automatically
      </div>
    </div>
  );
}

function MockLedger() {
  const receipts = [
    { label: "Context split · api-service", value: "$28/mo", date: "verified Jun 02" },
    { label: "Model routing · workspace", value: "$19/mo", date: "verified Jun 21" },
  ];
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4">
      <div className="flex items-baseline gap-2">
        <span className="text-[11px] text-[var(--text-2)]">Saved you</span>
        <span className="num text-[22px] font-medium tracking-[-0.03em] text-[var(--green-700)]">
          $212
        </span>
        <span className="text-[11px] text-[var(--text-2)]">since May 12</span>
      </div>
      <div className="mt-3 space-y-1.5">
        {receipts.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between rounded-md border border-[var(--border)] px-3 py-2"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="text-[10px] text-[var(--green-700)]">✓</span>
              <span className="truncate text-[10.5px] text-[var(--ink)]">{r.label}</span>
            </span>
            <span className="num shrink-0 pl-2 text-[10.5px] text-[var(--text-3)]">
              <span className="font-medium text-[var(--ink)]">{r.value}</span> · {r.date}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2.5 text-[10px] text-[var(--text-3)]">
        measured from your telemetry after each fix — never claimed
      </div>
    </div>
  );
}

/* section ----------------------------------------------------------------- */

export default function Features() {
  return (
    <section id="product" className="scroll-mt-24 border-t border-[var(--border)] bg-[var(--panel)] py-24 sm:py-36">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-6" data-center="true">
            The platform
          </p>
          <h2 className="display-2">
            From raw tokens to answers finance will accept.
          </h2>
          <p className="lead mt-5">
            Every session your team runs becomes attributed, explainable spend —
            in the dashboard, the CLI, and your editor.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <TileShell
              className="h-full"
              title="One shared source of truth"
              body="Live workspace spend across every tool, model, and developer — the same numbers for engineering, management, and finance."
            >
              <Shot src={shotOverview} sizes={WIDE} alt="Overview stat cards — usage value $1,134, cost per shipped session $25.21, 88% shipped rate — above a spend-over-time chart and a $594 per month recoverable-waste panel." />
            </TileShell>
          </Reveal>

          <Reveal delay={0.06} className="lg:col-span-5">
            <TileShell
              className="h-full"
              title="Wasted spend, itemized"
              body="Idle seats, cache misses, and oversized-model habits surfaced as line items with a dollar value — not vibes."
            >
              <Shot src={shotWaste} sizes={MID} alt="The wasted-spend fix queue, ranked by impact: context re-reads costing $204.34 a month, three marathon sessions that never shipped, each row carrying an estimated monthly saving and a View fix action." />
            </TileShell>
          </Reveal>

          <Reveal className="lg:col-span-5">
            <TileShell
              className="h-full"
              title="Reconcile the invoice"
              body="PlanckSpace matches attributed usage against what your providers actually billed — and explains the gap."
            >
              <MockReconciliation />
            </TileShell>
          </Reveal>

          <Reveal delay={0.06} className="lg:col-span-7">
            <TileShell
              className="h-full"
              title="Budgets that alert before the surprise"
              body="Monthly budgets with pace tracking and anomaly detection. When spend spikes 3× the median, you hear it from us — not the invoice."
            >
              <Shot src={shotBudget} sizes={WIDE} alt="The alert feed: three alerts, two critical — a session outlier at $190 against a $16 baseline and a repo spike at $190 against a $7 baseline, both already delivered." />
            </TileShell>
          </Reveal>

          <Reveal className="lg:col-span-4">
            <TileShell
              className="h-full"
              title="Per-team attribution"
              body="Spend rolls up by team, repo, and developer, with the unattributed remainder always visible."
            >
              <Shot src={shotTeams} sizes={NARROW} alt="Top repos by spend: planckspace-backend at $580 across 26 shipped sessions, planckspace-frontend at $263, each with cost per shipped session." />
            </TileShell>
          </Reveal>

          <Reveal delay={0.05} className="lg:col-span-4">
            <TileShell
              className="h-full"
              title="Session-level receipts"
              body="Every dollar traces to a session: model, token mix, cache efficiency, repo. Drill from invoice to receipt."
            >
              <Shot src={shotSession} sizes={NARROW} alt="The session list: each row shows repo and branch, tool and model, outcome, duration, turn count and cost — from $0.51 up to $187.18." />
            </TileShell>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-4">
            <TileShell
              className="h-full"
              title="Finance-ready exports"
              body="Chargeback and showback CSVs, cut by team or cost center — drop them straight into the monthly close."
            >
              <Shot src={shotExport} sizes={NARROW} alt="The chargeback export card: cost allocated per developer, including developer, repo, sessions, cost and shipped columns, downloadable as CSV or PDF." />
            </TileShell>
          </Reveal>

          <Reveal className="lg:col-span-7">
            <TileShell
              className="h-full"
              title="Fix it from your editor, in one click"
              body="The PlanckSpace extension for VS Code, Cursor, and Windsurf turns every insight into an applied fix — mechanical ones instantly (backed up, undoable), judgement calls handed to your own Claude Code with the measured data injected."
            >
              <MockFixIt />
            </TileShell>
          </Reveal>

          <Reveal delay={0.06} className="lg:col-span-5">
            <TileShell
              className="h-full"
              title="Savings, verified from telemetry"
              body="After a fix, PlanckSpace watches your real usage and only books the saving once it's confirmed. The ledger is measured, never claimed — with a dated receipt for every dollar."
            >
              <MockLedger />
            </TileShell>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
