import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Button from "@/components/site/Button";
import { PLANS, DEMO_PATH } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "PlanckSpace pricing: Starter is free for 3 seats and $200 of tracked AI spend per month. Pro $30/mo and Business $200/mo, both with a 14-day trial. Enterprise is custom. Every plan starts with a demo.",
};

/* comparison matrix, rows map to real platform capabilities */
const MATRIX: {
  label: string;
  values: (string | boolean)[];
}[] = [
  { label: "Tracked AI spend / month", values: ["$200", "$500", "$2,000", "Unlimited"] },
  { label: "Users", values: ["3", "5", "10", "Unlimited"] },
  { label: "Claude Code, Cursor, Windsurf, Antigravity", values: [true, true, true, true] },
  { label: "CLI + VS Code extension", values: [true, true, true, true] },
  { label: "Shared spend dashboard", values: [true, true, true, true] },
  { label: "Session-level cost detail", values: [true, true, true, true] },
  { label: "Cost insights & recommendations", values: [false, true, true, true] },
  { label: "Invoice reconciliation", values: [false, true, true, true] },
  { label: "Wasted-spend detection", values: [false, true, true, true] },
  { label: "Budgets & anomaly alerts", values: [false, false, true, true] },
  { label: "Team-level attribution", values: [false, false, true, true] },
  { label: "Chargeback-ready exports", values: [false, false, true, true] },
  { label: "Audit log & compliance controls", values: [false, false, false, true] },
  { label: "Support", values: ["Email", "Email", "Email", "Dedicated"] },
];

const PRICING_FAQS = [
  {
    q: "How do we actually get access?",
    a: "Book a demo. We spend 30 minutes on your setup, agree the right plan, then provision your workspace and walk your team through the rollout. There's no self-serve sign-up, because onboarding runs with us so the numbers are right from the first session.",
  },
  {
    q: "What is “tracked AI spend”?",
    a: "The dollar value of AI usage PlanckSpace meters for your workspace each calendar month. It sizes the plan and is not an extra charge. If your team's metered usage reaches the limit, syncing pauses until the month rolls over or you upgrade; nothing breaks in your tools.",
  },
  {
    q: "How does the 14-day trial work?",
    a: "Pro and Business include a full-featured 14-day trial with no credit card. It starts when we provision your workspace after the demo. If the trial ends without an upgrade, the workspace falls back to Starter limits. Nothing is deleted.",
  },
  {
    q: "What happens if we hit a seat or spend limit?",
    a: "You'll see it coming in the dashboard. At the seat limit, new invites are held until you upgrade. At the spend limit, new sessions queue locally and sync after the month resets or the plan changes, so you never lose data.",
  },
  {
    q: "Do you charge per token or take a percentage of spend?",
    a: "No. Plans are flat monthly rates sized by tracked spend. Your AI bills stay with your providers; we never sit in the billing path.",
  },
  {
    q: "What does Enterprise add?",
    a: "Unlimited seats and tracked spend, audit log and compliance controls, chargeback-ready exports, and dedicated support with sales-assisted onboarding. Contact us and we'll scope it with you.",
  },
];

function CellValue({ v }: { v: string | boolean }) {
  if (v === true) return <Check className="mx-auto h-4 w-4 text-lime" strokeWidth={2} />;
  if (v === false) return <Minus className="mx-auto h-4 w-4 text-fg-4" strokeWidth={1.75} />;
  return <span className="t-mono text-[13px] text-fg">{v}</span>;
}

/* Parked: pricing is off the public site. This folder is private (the
   underscore keeps it out of routing); restore it by renaming the folder to
   `pricing` and linking it from the nav and footer again. */
export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="overflow-x-clip">
        <section className="pb-16 pt-[calc(var(--nav-h)+5rem)] sm:pb-20 sm:pt-[calc(var(--nav-h)+7rem)]">
          <div className="wrap max-w-[60rem] text-center">
            <p className="t-kicker">Pricing</p>
            <h1 className="t-display mt-5 text-[clamp(2.6rem,5vw,4.4rem)] leading-[0.95] [--wdth:106]">
              Honest pricing for an honest meter.
            </h1>
            <p className="t-lead mx-auto mt-6 max-w-xl">
              Flat monthly plans sized by the AI spend you track. No per-token fees, no percentage of your bill, no
              credit card. Every plan starts with a 30-minute demo, and we set the workspace up with you.
            </p>
          </div>
        </section>

        <section className="pb-20 sm:pb-28">
          <div className="wrap grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {PLANS.map((p) => (
              <div key={p.id} className={`frame h-full [--ch:20px] ${p.highlighted ? "[--edge:var(--color-lime)]" : ""}`}>
                <div className="frame-in flex h-full flex-col p-7">
                  <div className="flex items-center justify-between">
                    <h2 className="t-h4">{p.name}</h2>
                    {p.highlighted && <span className="tag tag-lime">Most popular</span>}
                  </div>
                  <p className="mt-2 min-h-10 text-[0.88rem] leading-relaxed text-fg-3">{p.tagline}</p>
                  <p className="mt-5 flex items-baseline gap-1.5">
                    {p.priceUsdMonthly === null ? (
                      <span className="t-display text-[2.2rem] leading-none">Custom</span>
                    ) : (
                      <>
                        <span className="t-meter text-[2.6rem] text-lime">${p.priceUsdMonthly}</span>
                        <span className="t-mono text-[13px] text-fg-3">/month</span>
                      </>
                    )}
                  </p>
                  <p className="t-mono mt-2 text-[11px] text-fg-3">
                    {p.trialDays > 0
                      ? `${p.trialDays}-day free trial, no card`
                      : p.id === "starter"
                        ? "free forever, no card"
                        : "annual or monthly, invoiced"}
                  </p>
                  <ul className="mt-6 space-y-3 border-t border-[var(--line)] pt-6">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-[0.9rem] leading-snug text-fg-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime" strokeWidth={2.2} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex-1" />
                  <Button href={`${DEMO_PATH}?plan=${p.id}`} variant={p.highlighted ? "lime" : "ghost"} className="mt-8 w-full">
                    {p.id === "enterprise" ? "Talk to sales" : "Book a demo"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section bg-ink-1">
          <div className="wrap">
            <h2 className="t-display t-h2 max-w-[16ch]">Everything, side by side.</h2>
            <div className="mt-12 overflow-x-auto" data-lenis-prevent-horizontal="">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--line-2)]">
                    <th className="t-mono p-5 text-[11.5px] font-normal text-fg-3">Capability</th>
                    {PLANS.map((p) => (
                      <th key={p.id} className="p-5 text-center">
                        <div className="text-[0.95rem] font-semibold text-fg">{p.name}</div>
                        <div className="t-mono mt-0.5 text-[11px] font-normal text-fg-3">
                          {p.priceUsdMonthly === null ? "custom" : `$${p.priceUsdMonthly}/mo`}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MATRIX.map((row) => (
                    <tr key={row.label} className="border-b border-[var(--line)]">
                      <td className="p-5 text-[0.9rem] text-fg-2">{row.label}</td>
                      {row.values.map((v, j) => (
                        <td key={j} className="p-5 text-center">
                          <CellValue v={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <h2 className="t-display t-h2 max-w-[14ch] lg:sticky lg:top-28 lg:self-start">The fine print, in plain language.</h2>
            <div className="border-t border-[var(--line)]">
              {PRICING_FAQS.map((f) => (
                <div key={f.q} className="border-b border-[var(--line)] py-7">
                  <h3 className="text-[1.1rem] font-medium text-fg">{f.q}</h3>
                  <p className="mt-2.5 max-w-xl text-[0.98rem] leading-relaxed text-fg-2">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--line)] bg-ink-1 py-16 sm:py-20">
          <div className="wrap flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="t-h4">Not sure which plan fits?</h2>
              <p className="mt-1 text-[0.95rem] text-fg-3">Tell us your team size and tools. We&apos;ll answer honestly, even when the answer is Starter.</p>
            </div>
            <Button href="/contact">Talk to us</Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
