import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import ApertureArt from "@/components/site/ApertureArt";
import CopyCommand from "@/components/site/CopyCommand";
import Reveal from "@/components/site/Reveal";
import { FINDINGS, WORKSPACE, usd } from "@/lib/sample";

/* ─────────────────────────────────────────────────────────────────────────
   Going live, on a night panel set into the paper: the command, what it
   does, and a sample of what it prints. The recoverable total is the live
   finding types only (setup findings never count), the same figure the
   hero's receipt shows, because `planck init` prints the Findings headline.

   The panel is lit from the top right (.panel-ink draws the light in CSS).
   Its first child is the art slot for the rendered corner of the window:
   the image goes inside it and the CSS light steps aside. The terminal is a
   glass window in a bezel (outer shell, inner core, concentric radii), so
   the light reads through it.
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

/* The panel's light is the Aperture render: the chamfered corner of the
   opening entering from the top right, most of the frame dark. */
export default function Setup() {
  return (
    <section id="setup" aria-labelledby="setup-title" className="section">
      <div className="wrap">
        <div className="panel-ink on-night grain px-5 py-10 sm:p-12 lg:p-16">
          {/* The rendered corner of the window of light, entering from the top right. */}
          <div aria-hidden="true" data-art-slot="corner" className="pointer-events-none absolute inset-0 z-[-1] overflow-hidden rounded-[inherit]">
            <div className="corner-art">
              <ApertureArt variant="corner" />
            </div>
          </div>

          <Reveal className="relative z-[2]">
            <p className="eyebrow">Setup</p>
            <h2 id="setup-title" className="title-lg mt-6 max-w-[14ch] sm:mt-7">
              One command. <span className="tone">Your first number in minutes.</span>
            </h2>
          </Reveal>

          <div className="relative z-[2] mt-12 grid grid-cols-1 gap-12 lg:mt-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <Reveal>
              <ol className="space-y-7">
                {STEPS.map((s) => (
                  <li key={s.n} className="flex gap-4 sm:gap-5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-[0.8125rem] text-ink ring-1 ring-inset ring-white/20">
                      {s.n}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[1.1875rem] font-medium leading-snug tracking-[-0.018em] text-ink">{s.title}</p>
                      <p className="mt-2 text-[1rem] leading-relaxed text-body">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <CopyCommand command={COMMAND} tone="dark" className="mt-10 max-w-[31rem]" />
              <Link href="/docs/quickstart" className="link-arrow mt-7">
                Read the quickstart <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </Link>
            </Reveal>

            {/* the terminal: a glass shell holding a darker core (radii 28, 8 apart, 20) */}
            <div className="glass min-w-0 self-center rounded-[28px] p-2">
              <div className="overflow-hidden rounded-[20px] bg-night/70 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] ring-1 ring-inset ring-white/[0.07]">
                <div className="flex items-center gap-2 border-b border-white/[0.08] px-4 py-3" aria-hidden>
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <span className="ml-2 font-mono text-[0.75rem] text-muted">~/code/payments-api</span>
                </div>
                <Reveal mode="print" className="term overflow-x-auto px-4 py-5 text-[0.6875rem] sm:px-6 sm:py-6 sm:text-[0.8125rem]">
                  {LINES.map((l, i) => (
                    <pre key={i} className={l.cls} style={{ "--i": i } as CSSProperties}>
                      {l.t}
                    </pre>
                  ))}
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
