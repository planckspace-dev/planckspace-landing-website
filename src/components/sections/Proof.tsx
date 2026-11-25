import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CountUp from "@/components/reactbits/CountUp";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import Reveal from "@/components/site/Reveal";
import SectionHead from "@/components/site/SectionHead";
import { METHOD_LABEL, RECEIPTS, savedToDate, usd } from "@/lib/sample";

/* ─────────────────────────────────────────────────────────────────────────
   Proof of savings: the rules that make a saving a fact, as four figures,
   then the booked rows themselves, set as a ledger. The rules are the
   product's (backend proof-of-savings): 7 days AND 20 settled sessions, one
   pinned price card, the ship-rate guardrail, and a total that is a sum of
   rows.

   The page's one loud colour: a full-bleed field of brand blue (.field-cobalt)
   with the rules on glass and the booked rows on a solid white card, a paper
   island (.on-paper) lifted off the blue. Reading text on the field is solid
   white (6.4:1 on the base); the quieter headline clause is display-size only.

   The rules are one glass slab, four columns divided by hairlines: a strip
   of the ledger, not four cards. A neutral light follows the pointer across
   it (reactbits/SpotlightCard, fine pointers only). The figures roll into
   place once (reactbits/CountUp); the HTML carries their final values.
   ───────────────────────────────────────────────────────────────────────── */

// `to` rolls; the 0 is set as a glyph (nothing to roll to). −10 is written with a true minus.
const RULES: { to?: number; prefix?: string; glyph?: string; unit?: string; sub: string; body: string }[] = [
  { to: 7, unit: " days", sub: "and 20 sessions", body: "We wait a week and twenty finished sessions before we judge a session fix. Anything less is too little to trust." },
  { to: 1, sub: "price list", body: "Before and after are priced from the same price list. If a provider changes its prices, that never shows up as your saving." },
  { to: 10, prefix: "−", sub: "points", body: "If the share of your work that ships drops ten points after a fix, we stop counting. Cheaper but worse is not a saving." },
  { glyph: "0", sub: "forecasts", body: "Your total is added up from real sessions and real seat changes. It is never a monthly rate multiplied forward." },
];

export default function Proof() {
  return (
    <section id="proof" aria-labelledby="proof-title" data-nav="dark" className="section on-night field-cobalt grain">
      <div className="wrap relative z-[2]">
        <SectionHead
          id="proof-title"
          eyebrow="Proof of savings"
          size="xl"
          title={
            <>
              Savings you can check, <span className="tone block">not a forecast.</span>
            </>
          }
          lede="Most tools tell you what you might save. PlanckSpace measures what you did save. After a fix, it works out what each new session would have cost the old way, and counts only the difference."
        />

        <Reveal className="mt-14 lg:mt-20">
          <SpotlightCard className="glass rounded-[28px]">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {RULES.map((r) => (
                <li
                  key={r.sub}
                  className="flex min-w-0 flex-col border-white/15 px-6 py-8 sm:px-8 [&:not(:first-child)]:border-t sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(even)]:border-l lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-t-0"
                >
                  <p className="fig-lg whitespace-nowrap text-white">
                    {r.to !== undefined ? <CountUp to={r.to} prefix={r.prefix} /> : r.glyph}
                    {r.unit && <span className="text-[0.4em] font-semibold tracking-[-0.03em]">{r.unit}</span>}
                  </p>
                  <p className="mt-4 text-[1rem] font-medium text-white">{r.sub}</p>
                  <p className="mt-6 text-[0.9375rem] leading-relaxed text-white">{r.body}</p>
                </li>
              ))}
            </ul>
          </SpotlightCard>
        </Reveal>

        <Reveal className="on-paper mt-5 overflow-hidden rounded-[24px] bg-surface shadow-[0_2px_4px_rgb(9_27_84/0.18),0_32px_64px_-24px_rgb(9_27_84/0.5)] lg:mt-6">
          <div className="flex items-baseline justify-between gap-4 border-b border-line px-6 py-5 sm:px-8 sm:py-6">
            <p className="text-[1rem] font-medium text-ink">Savings so far · sample workspace</p>
            <Link href="/docs/concepts/proof-of-savings" className="link-arrow hidden text-[0.875rem] sm:inline-flex">
              How each row is measured <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            </Link>
          </div>

          <table className="w-full text-left">
            <thead className="hidden md:table-header-group">
              <tr className="font-mono text-[0.75rem] text-muted">
                <th scope="col" className="px-8 pb-2 pt-5 font-normal">
                  Fix
                </th>
                <th scope="col" className="pb-2 pt-5 font-normal">
                  How it was measured
                </th>
                <th scope="col" className="pb-2 pt-5 font-normal">
                  Before → after
                </th>
                <th scope="col" className="pb-2 pt-5 font-normal">
                  Confirmed
                </th>
                <th scope="col" className="px-8 pb-2 pt-5 text-right font-normal">
                  Saving
                </th>
              </tr>
            </thead>
            <tbody>
              {RECEIPTS.map((r) => (
                <tr key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 border-t border-line-soft px-6 py-4 first:border-t-0 sm:px-8 md:table-row md:px-0 md:first:border-t">
                  <th scope="row" className="text-[1rem] font-medium text-ink md:py-5 md:pl-8 md:pr-4">
                    {r.title}
                  </th>
                  <td className="text-right font-mono text-[0.9375rem] font-semibold text-green-700 md:hidden">{usd(r.usd)}/mo</td>
                  <td className="col-span-2 text-[0.8125rem] text-muted md:py-5 md:pr-4 md:text-[0.9375rem]">{METHOD_LABEL[r.method]}</td>
                  <td className="col-span-2 font-mono text-[0.8125rem] text-body md:py-5 md:pr-4 md:text-[0.875rem]">
                    <span className="md:hidden">{r.metric}: </span>
                    {r.before} → {r.after}
                  </td>
                  <td className="col-span-2 font-mono text-[0.8125rem] text-muted md:py-5 md:pr-4 md:text-[0.875rem]">{r.verified}</td>
                  <td className="hidden py-5 pr-8 text-right font-mono text-[1rem] font-semibold text-green-700 md:table-cell">{usd(r.usd)}/mo</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="flex items-baseline justify-between gap-4 border-t border-line bg-green-50/70 px-6 py-5 sm:px-8 md:table-row md:px-0">
                <th scope="row" colSpan={4} className="text-[1rem] font-medium text-ink md:py-6 md:pl-8">
                  Total saved so far
                </th>
                <td className="fig text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.045em] text-green-700 md:py-5 md:pr-8 md:text-right">
                  <CountUp to={savedToDate} prefix="$" separator="," />
                </td>
              </tr>
            </tfoot>
          </table>
        </Reveal>
      </div>
    </section>
  );
}
