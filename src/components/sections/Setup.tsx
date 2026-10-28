import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import CopyCommand from "@/components/site/CopyCommand";
import Reveal from "@/components/site/Reveal";
import { FINDINGS, WORKSPACE, usd } from "@/lib/sample";

/* ─────────────────────────────────────────────────────────────────────────
   Going live, on the page's one dark panel: the command, what it does, and a
   sample of what it prints. The recoverable total is the live finding types
   only (setup findings never count), the same figure the hero's receipt
   shows, because `planck init` prints the Findings headline.
   ───────────────────────────────────────────────────────────────────────── */

const COMMAND = "npx @planckspace/cli@latest init";
const FOUND = FINDINGS.filter((f) => f.type !== "setup");
const recoverable = FOUND.reduce((s, f) => s + f.usd, 0);
const perMachine = Math.round(5472 / WORKSPACE.developers);

const STEPS = [
  { n: "1", title: "Each developer runs one command", body: "It connects the machine, backfills the session history already on it, and starts a background daemon that keeps syncing." },
  { n: "2", title: "An admin connects billing", body: "Admin keys or a seat invoice, so tracked spend is checked against what the providers actually billed." },
  { n: "3", title: "The findings arrive", body: "Priced in billed dollars, each with its evidence and its fix, in the console and in the editor." },
];

const LINES: { t: string; cls?: string }[] = [
  { t: `$ ${COMMAND}`, cls: "hi" },
  { t: `✓ Connected to ${WORKSPACE.name}`, cls: "ok" },
  { t: `✓ Backfilled local history · ${perMachine} sessions`, cls: "ok" },
  { t: "✓ Daemon running in the background", cls: "ok" },
  { t: " " },
  { t: "Recoverable this month, billed dollars", cls: "hi" },
  // 39 columns wide, so the totals still fit a phone without scrolling
  ...FOUND.map((f) => ({ t: `  ${f.title.padEnd(30, ".")} ${usd(f.usd).padStart(6)}` })),
  { t: `  ${"".padEnd(30, " ")} ${"──────".padStart(6)}`, cls: "dim" },
  { t: `  ${"Total, a month".padEnd(30, " ")} ${usd(recoverable).padStart(6)}`, cls: "hi" },
  { t: " " },
  { t: "Next: open the findings in the console.", cls: "dim" },
];

export default function Setup() {
  return (
    <section id="setup" aria-labelledby="setup-title" className="section">
      <div className="wrap">
        <div className="panel-ink grid grid-cols-1 gap-12 p-6 sm:p-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14 lg:p-16">
          <Reveal>
            <p className="eyebrow text-[#8d9096]">Setup</p>
            <h2 id="setup-title" className="title-lg mt-5 text-[clamp(2.1rem,3.6vw,3.25rem)] text-white">
              One command. <span className="text-[#8a8d93]">Your first number in minutes.</span>
            </h2>
            <ol className="mt-10 space-y-6">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/15 font-mono text-[0.75rem] text-[#c9cbcf]">{s.n}</span>
                  <div>
                    <p className="text-[1rem] font-medium tracking-[-0.012em] text-white">{s.title}</p>
                    <p className="mt-1 text-[0.9375rem] leading-relaxed text-[#a3a6ab]">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <CopyCommand command={COMMAND} tone="dark" className="mt-10 max-w-[30rem]" />
            <Link href="/docs/quickstart" className="mt-6 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-[#8fb2ff] transition-colors hover:text-white">
              Read the quickstart <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </Reveal>

          <div className="min-w-0 self-center overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.035]">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="ml-3 font-mono text-[0.6875rem] text-[#6e7177]">~/code/payments-api</span>
            </div>
            <Reveal mode="print" className="term overflow-x-auto px-4 py-5 text-[0.6875rem] sm:px-6 sm:text-[0.8125rem]">
              {LINES.map((l, i) => (
                <pre key={i} className={l.cls} style={{ "--i": i } as CSSProperties}>
                  {l.t}
                </pre>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
