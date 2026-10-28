import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import SectionHead from "@/components/site/SectionHead";
import { METHOD_LABEL, RECEIPTS, savedToDate, usd } from "@/lib/sample";

/* ─────────────────────────────────────────────────────────────────────────
   Proof of savings: the rules that make a saving a fact, as four figures,
   then the booked rows themselves, set as a ledger. The rules are the
   product's (backend proof-of-savings): 7 days AND 20 settled sessions, one
   pinned price card, the ship-rate guardrail, and a total that is a sum of
   rows.
   ───────────────────────────────────────────────────────────────────────── */

const RULES = [
  { fig: "7 days", sub: "and 20 sessions", body: "A session fix is judged only after a week and twenty settled sessions in its scope. Anything less is noise." },
  { fig: "1", sub: "price card", body: "Both sides of a comparison are priced from the same pinned rates, so a vendor's price change is never booked as your saving." },
  { fig: "−10", sub: "points", body: "If the ship rate falls ten points after a fix, booking stops. Cheaper and worse is not a saving." },
  { fig: "Σ", sub: "booked rows", body: "Saved to date is the sum of rows booked from real sessions and seat changes. Never a rate multiplied forward." },
];

export default function Proof() {
  return (
    <section id="proof" aria-labelledby="proof-title" className="section band">
      <div className="wrap">
        <SectionHead
          id="proof-title"
          eyebrow="Proof of savings"
          split
          title={
            <>
              A saving is a receipt, <span className="tone">not a forecast.</span>
            </>
          }
          lede="Most tools project savings from a model of what might happen. PlanckSpace waits for the work: after a fix, it prices the sessions that follow at the rates you paid before, and books the difference one row at a time."
        />

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-[24px] border border-line bg-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {RULES.map((r, i) => (
            <Reveal key={r.sub} delay={i * 70} className="bg-page p-7 sm:p-8">
              <p className="fig whitespace-nowrap text-[2.75rem] font-semibold text-ink">{r.fig}</p>
              <p className="mt-2 text-[0.9375rem] font-medium text-muted">{r.sub}</p>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-body">{r.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 overflow-hidden rounded-[24px] border border-line bg-surface shadow-[var(--shadow-card)]">
          <div className="flex items-baseline justify-between gap-4 border-b border-line px-6 py-5 sm:px-8">
            <p className="text-[0.9375rem] font-medium text-ink">Booked savings · sample workspace</p>
            <Link href="/docs/concepts/proof-of-savings" className="link-arrow hidden text-[0.875rem] sm:inline-flex">
              How each row is measured <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>

          <table className="w-full text-left">
            <thead className="hidden md:table-header-group">
              <tr className="font-mono text-[0.6875rem] tracking-[0.1em] text-muted uppercase">
                <th scope="col" className="px-8 pb-2 pt-5 font-normal">
                  Fix
                </th>
                <th scope="col" className="pb-2 pt-5 font-normal">
                  Measured by
                </th>
                <th scope="col" className="pb-2 pt-5 font-normal">
                  Before → after
                </th>
                <th scope="col" className="pb-2 pt-5 font-normal">
                  Confirmed
                </th>
                <th scope="col" className="px-8 pb-2 pt-5 text-right font-normal">
                  Pace
                </th>
              </tr>
            </thead>
            <tbody>
              {RECEIPTS.map((r) => (
                <tr key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 border-t border-line-soft px-6 py-4 first:border-t-0 sm:px-8 md:table-row md:px-0 md:first:border-t">
                  <th scope="row" className="text-[0.9375rem] font-medium text-ink md:py-4 md:pl-8 md:pr-4">
                    {r.title}
                  </th>
                  <td className="text-right font-mono text-[0.875rem] font-semibold text-green-700 md:hidden">{usd(r.usd)}/mo</td>
                  <td className="col-span-2 text-[0.8125rem] text-muted md:py-4 md:pr-4 md:text-[0.875rem]">{METHOD_LABEL[r.method]}</td>
                  <td className="col-span-2 font-mono text-[0.8125rem] text-body md:py-4 md:pr-4">
                    <span className="md:hidden">{r.metric}: </span>
                    {r.before} → {r.after}
                  </td>
                  <td className="col-span-2 font-mono text-[0.8125rem] text-muted md:py-4 md:pr-4">{r.verified}</td>
                  <td className="hidden py-4 pr-8 text-right font-mono text-[0.9375rem] font-semibold text-green-700 md:table-cell">{usd(r.usd)}/mo</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="flex items-baseline justify-between border-t border-line bg-band/60 px-6 py-5 sm:px-8 md:table-row md:px-0">
                <th scope="row" colSpan={4} className="text-[0.9375rem] font-medium text-ink md:py-5 md:pl-8">
                  Saved to date, as booked rows
                </th>
                <td className="font-mono text-[1.0625rem] font-semibold text-green-700 md:py-5 md:pr-8 md:text-right">{usd(savedToDate)}</td>
              </tr>
            </tfoot>
          </table>
        </Reveal>
      </div>
    </section>
  );
}
