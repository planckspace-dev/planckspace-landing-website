import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, Minus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/ui/reveal";
import { PLANS, CONSOLE_URL } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "PlanckSpace pricing: free for 3 seats and $200 of tracked AI spend per month. Pro $30/mo, Business $200/mo — both with a 14-day free trial. Enterprise is custom.",
};

/* comparison matrix — rows map to real platform capabilities */
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
    q: "What is “tracked AI spend”?",
    a: "The dollar value of AI usage PlanckSpace meters for your workspace each calendar month. It sizes the plan — it is not an extra charge. If your team's metered usage reaches the limit, syncing pauses until the month rolls over or you upgrade; nothing breaks in your tools.",
  },
  {
    q: "How does the 14-day trial work?",
    a: "Pro and Business start with a full-featured 14-day trial — no credit card. When the trial ends without an upgrade, the workspace simply falls back to Starter limits. Nothing is deleted.",
  },
  {
    q: "What happens if we hit a seat or spend limit?",
    a: "You'll see it coming in the dashboard. At the seat limit, new invites are held until you upgrade. At the spend limit, new sessions queue locally and sync after the month resets or the plan changes — you never lose data.",
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
  if (v === true) return <Check className="mx-auto h-4 w-4 text-[var(--ink)]" strokeWidth={1.75} />;
  if (v === false) return <Minus className="mx-auto h-4 w-4 text-[var(--border-strong)]" strokeWidth={1.75} />;
  return <span className="num text-[13px] text-[var(--ink)]">{v}</span>;
}

export default function PricingPage() {
  return (
    <main className="overflow-x-clip">
      <Navbar />

      {/* header */}
      <section className="pt-36 pb-14 sm:pt-44 sm:pb-20">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-7" data-center="true">
              Pricing
            </p>
            <h1 className="display-1">Honest pricing for an honest meter.</h1>
            <p className="lead mx-auto mt-6 max-w-xl">
              Flat monthly plans sized by the AI spend you track. No per-token
              fees, no percentage of your bill, no credit card to start.
            </p>
          </div>
        </div>
      </section>

      {/* plan cards */}
      <section className="pb-20 sm:pb-28">
        <div className="container-x">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {PLANS.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05} className="h-full">
                <div
                  className={`card relative flex h-full flex-col p-7 ${
                    p.highlighted ? "!border-[var(--ink)] shadow-[var(--shadow-float)]" : ""
                  }`}
                >
                  {p.highlighted && (
                    <span className="num absolute -top-3 left-7 rounded-full bg-[var(--ink)] px-3 py-1 text-[9.5px] uppercase tracking-[0.12em] text-white">
                      Most popular
                    </span>
                  )}
                  <h2 className="text-[17px] font-semibold text-[var(--ink)]">{p.name}</h2>
                  <p className="mt-1 min-h-10 text-[12.5px] leading-relaxed text-[var(--text-3)]">
                    {p.tagline}
                  </p>

                  <div className="mt-5 flex items-baseline gap-1.5">
                    {p.priceUsdMonthly === null ? (
                      <span className="text-[34px] font-semibold tracking-[-0.03em]">Custom</span>
                    ) : (
                      <>
                        <span className="num text-[36px] font-medium tracking-[-0.04em]">
                          ${p.priceUsdMonthly}
                        </span>
                        <span className="text-[13px] text-[var(--text-3)]">/month</span>
                      </>
                    )}
                  </div>
                  <p className="num mt-1 text-[11px] text-[var(--text-3)]">
                    {p.trialDays > 0
                      ? `${p.trialDays}-day free trial · no card`
                      : p.id === "starter"
                        ? "free forever · no card"
                        : "annual or monthly · invoiced"}
                  </p>

                  <ul className="mt-6 space-y-3 border-t border-[var(--border)] pt-6">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-[13.5px] leading-snug text-[var(--text-2)]">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--ink)]" strokeWidth={2} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="flex-1" />

                  {p.id === "enterprise" ? (
                    <Link href="/contact" className="btn btn-secondary mt-8 w-full">
                      Talk to us
                    </Link>
                  ) : (
                    <a
                      href={`${CONSOLE_URL}/register?plan=${p.id}`}
                      className={`btn mt-8 w-full ${p.highlighted ? "btn-primary" : "btn-secondary"}`}
                    >
                      {p.id === "starter" ? "Start free" : `Start ${p.trialDays}-day trial`}
                      {p.highlighted && (
                        <span className="btn-disc">
                          <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                        </span>
                      )}
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* comparison table */}
      <section className="border-t border-[var(--border)] bg-[var(--panel)] py-20 sm:py-28">
        <div className="container-x">
          <Reveal className="mx-auto mb-12 max-w-xl text-center">
            <p className="eyebrow mb-6" data-center="true">
              Compare
            </p>
            <h2 className="display-2">Everything, side by side.</h2>
          </Reveal>

          <Reveal>
            <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="p-5 text-[12px] font-medium uppercase tracking-[0.1em] text-[var(--text-3)]">
                      Capability
                    </th>
                    {PLANS.map((p) => (
                      <th key={p.id} className="p-5 text-center">
                        <div className="text-[14px] font-semibold text-[var(--ink)]">{p.name}</div>
                        <div className="num mt-0.5 text-[11px] font-normal text-[var(--text-3)]">
                          {p.priceUsdMonthly === null ? "custom" : `$${p.priceUsdMonthly}/mo`}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MATRIX.map((row, i) => (
                    <tr
                      key={row.label}
                      className={i === MATRIX.length - 1 ? "" : "border-b border-[var(--border)]"}
                    >
                      <td className="p-5 text-[13.5px] text-[var(--text-2)]">{row.label}</td>
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
          </Reveal>
        </div>
      </section>

      {/* pricing FAQ */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <Reveal>
                <p className="eyebrow mb-6">Pricing FAQ</p>
                <h2 className="display-2">The fine print, in plain language.</h2>
              </Reveal>
            </div>
            <div>
              {PRICING_FAQS.map((f, i) => (
                <Reveal key={f.q} delay={i * 0.05}>
                  <div className="border-t border-[var(--border)] py-7 last:border-b">
                    <h3 className="text-[16.5px] font-medium tracking-[-0.01em] text-[var(--ink)]">
                      {f.q}
                    </h3>
                    <p className="mt-2.5 max-w-xl text-[14.5px] leading-relaxed text-[var(--text-2)]">
                      {f.a}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* closing strip */}
      <section className="border-t border-[var(--border)] bg-[var(--panel)] py-16 sm:py-20">
        <div className="container-x flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
              Not sure which plan fits?
            </h2>
            <p className="mt-1 text-[14.5px] text-[var(--text-2)]">
              Tell us your team size and tools — we'll tell you honestly, even if the answer is “Starter”.
            </p>
          </div>
          <Link href="/contact" className="btn btn-primary shrink-0">
            Talk to us
            <span className="btn-disc">
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
