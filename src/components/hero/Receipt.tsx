import type { CSSProperties, ReactNode } from "react";
import Reveal from "@/components/site/Reveal";
import { PlanckMark } from "@/components/ui/logo";
import { FINDINGS, METERED, SEATS, WORKSPACE, billedTotal, realizedTotal, usageValue, usd } from "@/lib/sample";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────
   The hero's one picture: a month of AI coding, itemized the way the product
   keeps it. Billed lines add up to the bill; usage value sits apart and is
   never added in; the waste is priced per month; the saving is what was
   booked from real sessions. Only the live finding types are listed (setup
   findings never count toward the recoverable figure), so the total matches
   what `planck init` prints for the same sample. The lines print in one
   after another the first time the receipt is on screen.
   ───────────────────────────────────────────────────────────────────────── */

const FOUND = FINDINGS.filter((f) => f.type !== "setup");
const recoverable = FOUND.reduce((s, f) => s + f.usd, 0);

function Line({ label, meta, amount, className, amountClass }: { label: ReactNode; meta?: string; amount: string; className?: string; amountClass?: string }) {
  return (
    <div className={cn("leader", className)}>
      <span className="min-w-0 sm:truncate">
        {label}
        {meta && <span className="text-subtle"> · {meta}</span>}
      </span>
      <span className="fill" aria-hidden />
      <span className={cn("amt", amountClass)}>{amount}</span>
    </div>
  );
}

function Head({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <p className="flex items-baseline justify-between text-[0.6875rem] tracking-[0.14em] text-muted uppercase">
      <span>{children}</span>
      {right && <span className="tracking-[0.06em] normal-case">{right}</span>}
    </p>
  );
}

export default function Receipt({ className }: { className?: string }) {
  const rows: ReactNode[] = [
    <div key="brand" className="flex items-start justify-between">
      <div>
        <p className="flex items-center gap-2 text-[0.75rem] font-semibold tracking-[0.16em] uppercase">
          <PlanckMark className="h-4 w-4" />
          PlanckSpace
        </p>
        <p className="mt-2 text-[0.75rem] text-muted">
          {WORKSPACE.name} · {WORKSPACE.developers} developers
        </p>
      </div>
      <p className="text-right text-[0.75rem] leading-snug text-muted">
        Statement
        <br />
        <span className="text-ink">{WORKSPACE.period}</span>
      </p>
    </div>,

    <div key="t1" className="tear" />,
    <Head key="h-billed" right="from your invoices">
      Billed
    </Head>,
    ...SEATS.map((s) => <Line key={s.label} label={s.label} meta={`${s.seats} seats`} amount={usd(s.seats * s.price)} />),
    ...METERED.map((m) => <Line key={m.key} label={m.provider} meta="metered" amount={usd(m.usd)} />),
    <Line key="billed" label={<span className="font-semibold">Billed this month</span>} amount={usd(billedTotal)} className="pt-1" amountClass="font-semibold" />,

    <div key="t2" className="tear" />,
    <div key="usage">
      <Line label="Usage value on seats" amount={usd(usageValue)} amountClass="text-muted" className="text-muted" />
      <p className="mt-1 text-[0.6875rem] text-subtle">Work done on flat-rate seats, at API rates. Not a charge; never added to the bill.</p>
    </div>,

    <div key="t3" className="tear" />,
    <Head key="h-found" right="each with a fix">
      Found
    </Head>,
    ...FOUND.map((f) => <Line key={f.id} label={f.title} amount={`−${usd(f.usd)}`} amountClass="text-coral-700" />),
    <Line
      key="recoverable"
      label={<span className="font-semibold">Recoverable</span>}
      amount={`${usd(recoverable)}/mo`}
      className="pt-1"
      amountClass="font-semibold text-coral-700"
    />,

    <div key="t4" className="tear" />,
    <Head key="h-saved" right="measured, not modeled">
      Saved
    </Head>,
    <Line key="saved" label="Booked in the last 30 days" amount={usd(realizedTotal)} amountClass="font-semibold text-green-700" />,
    <p key="saved-note" className="-mt-1.5 text-[0.6875rem] text-subtle">
      Each dollar a row: a repriced session or a day a seat stayed off.
    </p>,

    <div key="foot" className="pt-3 text-center">
      <div
        aria-hidden
        className="mx-auto h-9 w-[78%]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #0e1013 0 2px, transparent 2px 4px, #0e1013 4px 5px, transparent 5px 8px, #0e1013 8px 11px, transparent 11px 12px, #0e1013 12px 13px, transparent 13px 16px)",
        }}
      />
      <p className="mt-2.5 text-[0.6875rem] tracking-[0.12em] text-muted uppercase">Every token, accounted for</p>
    </div>,
  ];

  return (
    <figure className={cn("receipt-shadow", className)} aria-label={`A sample month, itemized: ${usd(billedTotal)} billed, ${usd(recoverable)} a month recoverable, ${usd(realizedTotal)} saved in the last 30 days.`}>
      <Reveal mode="print" className="receipt space-y-3 px-5 pb-7 pt-8 text-[0.75rem] sm:px-8 sm:pb-8 sm:pt-10 sm:text-[0.8125rem]">
        {rows.map((row, i) => (
          <div key={i} style={{ "--i": i } as CSSProperties}>
            {row}
          </div>
        ))}
      </Reveal>
      <figcaption className="sr-only">Sample workspace. Figures are illustrative.</figcaption>
    </figure>
  );
}
