"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Reveal } from "@/components/ui/reveal";
import { useSeen } from "@/components/ui/in-view";

/* ─────────────────────────────────────────────────────────────────────────
   The detection engine.

   Features.tsx shows WHAT the platform is. This section shows HOW the engine
   finds waste — and it has one job above all others: a reader who has never
   thought about token accounting has to understand a detector in about four
   seconds.

   The previous version did not do that. It stacked six panels, each carrying
   a signal, a four-cell readout, a threshold, a formula, a fix and a field
   list, all visible at once, all at 10px. Six of those is roughly forty
   figures on screen with nothing saying which one is the point. Dense is not
   the same as credible.

   So: one detector at a time, chosen from a rail, and inside it a fixed
   three-beat read that never changes shape.

       the claim    one plain sentence, no jargon, the takeaway
       the signal   one measured number and one picture of it
       the money    what it costs, and what to do about it

   Everything that made the old panel unreadable — the readout grid, the
   arithmetic, the telemetry fields — is still here, unchanged, behind "show
   the working". That is the trade: the default read is a sentence and a
   chart, and the proof is one click away for the reader who wants it. No
   number was softened to get there.

   The charts are DOM, not SVG. The old ones were drawn on a 240×88 viewBox
   and then scaled to ~290px, which multiplied every hairline by 1.2 and put
   every label on a fractional pixel. That scaling, more than anything else,
   is why these mocks looked slightly out of focus. Divs and real text land on
   whole pixels at whatever size the panel happens to be.

   Thresholds and math below mirror the real detectors:
     backend  src/jobs/autoInsights.ts, src/services/insightVerification.ts
     cli      src/detectors/{seat-efficiency,repeat-read}.ts
   Keep them in sync when a detector constant changes. The figures also tie to
   the one team's slice used in Features.tsx ($1,134 window spend).
   ───────────────────────────────────────────────────────────────────────── */

type Tone = "hot" | "ink" | "good" | "mute";

type Capability = {
  id: string;
  n: string;
  /** Short label for the rail. Has to survive a two-column grid on a phone. */
  tab: string;
  name: string;
  /** The takeaway, in plain English. This is the line that has to land. */
  claim: string;
  detector: string;
  confidence: "high" | "medium";
  /** The measured headline. */
  signal: { value: string; label: string };
  viz: ReactNode;
  costLabel: string;
  cost: string;
  costNote: string;
  fix: string;
  /* ── the working, behind the disclosure ── */
  readout: Array<{ k: string; v: string; hot?: boolean }>;
  math: string;
  result: string;
  /** Telemetry fields the detector consumed. All counters. */
  measuredFrom: string[];
};

/* ── the measurement, drawn in DOM ──────────────────────────────────────── */

const FILL: Record<Tone, string> = {
  hot: "var(--coral-500)",
  ink: "var(--ink)",
  good: "var(--green-500)",
  mute: "var(--border-strong)",
};
const INK: Record<Tone, string> = {
  hot: "var(--coral-700)",
  ink: "var(--ink)",
  good: "var(--green-700)",
  mute: "var(--text-3)",
};

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/* Where a chart starts, relative to the panel arriving. The headline figure
   lands at 0.2s and its caption at 0.26s, so anything earlier than this has
   the picture explaining a number the reader has not read yet. */
const VIZ = 0.34;

/** One labelled bar. pct is the bar's share of the track, 0–100. */
function Bar({
  label,
  value,
  pct,
  tone = "ink",
  i = 0,
}: {
  label: string;
  value: string;
  pct: number;
  tone?: Tone;
  i?: number;
}) {
  return (
    <div className="iv-fade" style={d(VIZ + i * 0.08)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="num text-[12.5px] text-[var(--text-2)]">{label}</span>
        <span className="num text-[12.5px] font-medium" style={{ color: INK[tone] }}>
          {value}
        </span>
      </div>
      <div className="mt-2 h-[9px] overflow-hidden rounded-[3px] bg-[var(--inset)]">
        {/* A floor of 0.5%, because a bar that rounds to zero width reads as a
            rendering fault rather than as "almost nothing" — and "almost
            nothing" is precisely the point detector 01 is making. */}
        <div
          className="iv-grow-x h-full rounded-[3px]"
          style={{
            width: `${Math.max(pct, 0.5)}%`,
            background: FILL[tone],
            ...d(VIZ + 0.1 + i * 0.14),
          }}
        />
      </div>
    </div>
  );
}

/** A bar with the threshold that gates it drawn across the track. */
function GatedBar({
  label,
  value,
  pct,
  gate,
  gateLabel,
  tone = "hot",
}: {
  label: string;
  value: string;
  pct: number;
  gate: number;
  gateLabel: string;
  tone?: Tone;
}) {
  return (
    <div className="iv-fade" style={d(VIZ)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="num text-[12.5px] text-[var(--text-2)]">{label}</span>
        <span className="num text-[14px] font-medium" style={{ color: INK[tone] }}>
          {value}
        </span>
      </div>
      <div className="relative mt-2 h-5 overflow-hidden rounded-[4px] bg-[var(--inset)]">
        <div
          className="iv-grow-x h-full rounded-[4px]"
          style={{ width: `${pct}%`, background: FILL[tone], ...d(VIZ + 0.12) }}
        />
        <span
          className="absolute inset-y-0 w-px bg-[var(--ink)]"
          style={{ left: `${gate}%` }}
          aria-hidden
        />
      </div>
      <div className="num mt-1.5 flex justify-between text-[11px] text-[var(--text-3)]">
        <span>0</span>
        <span className="text-[var(--ink)]">{gateLabel}</span>
        <span>100%</span>
      </div>
    </div>
  );
}

/** Turn counts per session, with the threshold that separates them. */
function Columns({
  values,
  gate,
  max,
  gateLabel,
}: {
  values: number[];
  gate: number;
  max: number;
  gateLabel: string;
}) {
  return (
    <div className="iv-fade" style={d(VIZ)}>
      <div className="relative flex h-24 items-end gap-[3px] border-b border-[var(--border-strong)]">
        {values.map((v, i) => (
          <span
            key={i}
            className="iv-grow-y flex-1 rounded-t-[2px]"
            style={{
              height: `${Math.max(2.5, (v / max) * 100)}%`,
              background: v >= gate ? FILL.hot : FILL.mute,
              ...d(VIZ + 0.06 + i * 0.035),
            }}
          />
        ))}
        <span
          className="pointer-events-none absolute inset-x-0 border-t border-dashed border-[var(--ink)]"
          style={{ bottom: `${(gate / max) * 100}%` }}
          aria-hidden
        />
      </div>
      <div className="num mt-2 flex justify-between gap-3 text-[11px] text-[var(--text-3)]">
        <span>turns per session, last 30 days</span>
        <span className="shrink-0 text-[var(--ink)]">{gateLabel}</span>
      </div>
    </div>
  );
}

/** One square per seat. Dormant seats are the hollow, dashed ones. */
function Seats({ total, dormant }: { total: number; dormant: number[] }) {
  const off = new Set(dormant);
  return (
    <div className="iv-fade" style={d(VIZ)}>
      <div className="grid grid-cols-10 gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className="iv-pop aspect-square rounded-[4px] border"
            style={{
              background: off.has(i) ? "transparent" : "var(--ink)",
              borderColor: off.has(i) ? "var(--coral-500)" : "var(--ink)",
              borderStyle: off.has(i) ? "dashed" : "solid",
              ...d(VIZ + 0.06 + i * 0.025),
            }}
          />
        ))}
      </div>
      <div className="num mt-3 flex flex-wrap justify-between gap-x-3 gap-y-1 text-[11px] text-[var(--text-3)]">
        <span>{total - dormant.length} active</span>
        <span className="text-[var(--coral-700)]">
          {dormant.length} dormant · $1.14/mo each against a $30.00 seat
        </span>
      </div>
    </div>
  );
}

/** The caption under a chart, in the metering voice. */
function Note({ children }: { children: ReactNode }) {
  return (
    <p
      className="num iv-fade mt-4 text-[11.5px] leading-relaxed text-[var(--text-3)]"
      style={d(VIZ + 0.55)}
    >
      {children}
    </p>
  );
}

/* ── the six ────────────────────────────────────────────────────────────── */

const CAPS: Capability[] = [
  {
    id: "context-bloat",
    n: "01",
    tab: "Context re-reads",
    name: "Context re-read metering",
    claim:
      "Your standing instructions get re-sent on every turn, and you are billed for every copy.",
    detector: "context-bloat",
    confidence: "high",
    signal: { value: "3,592×", label: "cache reads per input token, api-service" },
    viz: (
      <>
        <div className="space-y-4">
          <Bar label="input tokens / session" value="48.2k" pct={1.2} tone="ink" i={0} />
          <Bar label="cache re-reads / session" value="173.2M" pct={100} tone="hot" i={1} />
        </div>
        <Note>fires above 0.40× · measured at 3,592× across 51 sessions</Note>
      </>
    ),
    costLabel: "What it costs",
    cost: "$204.12",
    costNote: "per month, recoverable",
    fix: "Move CLAUDE.md's topic sections into .claude/docs/ and leave a pointer index in the root. Each file then loads only in the sessions where its topic comes up. Not @import: imports load in full at every conversation start, so they move text around without saving a token.",
    readout: [
      { k: "Cache-read ÷ input tokens", v: "3,592×", hot: true },
      { k: "Fires above", v: "0.40×" },
      { k: "Avg input / session", v: "48,210 tokens" },
      { k: "Sessions measured", v: "51 in 30 days" },
    ],
    math: "$1,134 window spend × 18% recoverable × (30 ÷ 30)",
    result: "$204.12 / mo",
    measuredFrom: ["cacheReadTokens", "inputTokens", "costUsd", "startedAt"],
  },
  {
    id: "model-routing",
    n: "02",
    tab: "Model routing",
    name: "Premium-model routing",
    claim:
      "The expensive model is running most of your sessions and shipping the least of your work.",
    detector: "model-routing",
    confidence: "high",
    signal: { value: "38 pts", label: "between what Opus runs and what Opus ships" },
    viz: (
      <>
        <div className="space-y-4">
          <Bar label="Opus share of sessions" value="62.0%" pct={62} tone="ink" i={0} />
          <Bar label="Opus share of shipped work" value="24.0%" pct={24} tone="mute" i={1} />
        </div>
        <Note>fires when session share exceeds shipped share · the gap is $104.30</Note>
      </>
    ),
    costLabel: "What it costs",
    cost: "$104.30",
    costNote: "per month, on work that never shipped",
    fix: "Add a routing rule to CLAUDE.md: default exploration and iteration to a Sonnet-class model, escalate to Opus for architecture, tricky debugging, and large refactors. The gap between those two percentages is the money.",
    readout: [
      { k: "Opus share of sessions", v: "62.0%", hot: true },
      { k: "Opus share of shipped work", v: "24.0%" },
      { k: "Fires when", v: "session share > shipped share" },
      { k: "Spend on Opus that didn't ship", v: "$104.30" },
    ],
    math: "$104.30 non-shipping premium spend × (30 ÷ 30)",
    result: "$104.30 / mo",
    measuredFrom: ["model", "outcome", "costUsd", "gitAuthorEmail"],
  },
  {
    id: "cache-efficiency",
    n: "03",
    tab: "Cache hits",
    name: "Cache-hit recovery",
    claim:
      "Nine tokens in ten are billed at full price when the cache should have covered them.",
    detector: "cache-efficiency",
    confidence: "high",
    signal: { value: "11.4%", label: "cache-hit rate across 8.2M tokens" },
    viz: (
      <>
        <GatedBar
          label="cache-hit rate"
          value="11.4%"
          pct={11.4}
          gate={30}
          gateLabel="fires below 30%"
        />
        <Note>volume floor 1.0M tokens · measured across 8.2M</Note>
      </>
    ),
    costLabel: "What it costs",
    cost: "$98.55",
    costNote: "per month, recoverable",
    fix: "Put the stable prefix (project overview, conventions, standing guidance) first and unchanged, ahead of anything task-specific. The cache keys on that prefix, so anything dynamic above it invalidates everything below.",
    readout: [
      { k: "Cache-hit rate", v: "11.4%", hot: true },
      { k: "Fires below", v: "30.0%" },
      { k: "Token volume", v: "8.2M" },
      { k: "Volume floor", v: "1.0M" },
    ],
    math: "7.3M input × 50% cacheable × 90% saved × $3.00/M",
    result: "$98.55 / mo",
    measuredFrom: ["inputTokens", "cacheReadTokens", "sessionId"],
  },
  {
    id: "marathon-sessions",
    n: "04",
    tab: "Marathons",
    name: "Marathon-session detection",
    claim:
      "Six sessions ground on past 150 turns apiece, and not one of them shipped anything.",
    detector: "marathon-sessions",
    confidence: "high",
    signal: {
      value: "152 turns",
      label: "average across six sessions that shipped nothing",
    },
    viz: (
      <>
        <Columns
          values={[6, 9, 11, 14, 18, 23, 27, 58, 96, 131, 152, 188, 214, 253]}
          gate={30}
          max={260}
          gateLabel="30-turn threshold"
        />
        <Note>six sessions past the line · $195.40 between them</Note>
      </>
    ),
    costLabel: "What it costs",
    cost: "$195.40",
    costNote: "per month, on sessions that never converged",
    fix: "Past roughly 30 turns the accumulated context is re-sent on every turn and the session rarely converges. When one stalls, start fresh with a tighter prompt carrying what you learned. Restarting is cheaper than pushing.",
    readout: [
      { k: "Marathon sessions", v: "6", hot: true },
      { k: "Turn threshold", v: "≥ 30 turns" },
      { k: "Avg turns", v: "152" },
      { k: "Combined cost", v: "$195.40" },
    ],
    math: "$195.40 across 6 non-shipping marathons × (30 ÷ 30)",
    result: "$195.40 / mo",
    measuredFrom: ["turnCount", "outcome", "costUsd"],
  },
  {
    id: "seat-efficiency",
    n: "05",
    tab: "Idle seats",
    name: "Idle-seat reclaim",
    claim: "Four seats are billed at thirty dollars a month and used for about one.",
    detector: "seat-efficiency",
    confidence: "high",
    signal: { value: "4 seats", label: "consuming under 10% of what they cost" },
    viz: (
      <>
        <Seats total={20} dormant={[3, 9, 14, 17]} />
        <Note>dormant below 10% of a $30.00 seat · measured over 30 days</Note>
      </>
    ),
    costLabel: "What it costs",
    cost: "$120.00",
    costNote: "per month, billed for nobody",
    fix: "Reclaim or reassign at the provider. This one is deliberately never automated. It is a billing change against a real person's access, so PlanckSpace surfaces it and hands you the list, nothing more.",
    readout: [
      { k: "Dormant seats", v: "4", hot: true },
      { k: "Dormant below", v: "10% of seat cost" },
      { k: "Seat cost", v: "$30.00 / mo" },
      { k: "Avg consumption", v: "$1.14 / mo" },
    ],
    math: "4 dormant seats × $30.00 seat cost",
    result: "$120.00 / mo",
    measuredFrom: ["gitAuthorEmail", "costUsd", "tool", "seatCostUsdMonthly"],
  },
  {
    id: "verification",
    n: "06",
    tab: "Verification",
    name: "Telemetry-verified savings",
    claim:
      "A saving is only counted once your own telemetry shows the problem actually went away.",
    detector: "insight-verification",
    confidence: "high",
    signal: { value: "−94%", label: "of the measured problem, gone and confirmed" },
    viz: (
      <>
        <div className="space-y-4">
          <Bar label="at detection" value="3,592×" pct={100} tone="hot" i={0} />
          <Bar label="re-measured after the fix" value="212×" pct={5.9} tone="good" i={1} />
        </div>
        <Note>confirms above 30% improvement · needs 3 post-fix sessions</Note>
      </>
    ),
    costLabel: "What was booked",
    cost: "$191.87",
    costNote: "per month, of a $204.12 estimate",
    fix: "The baseline is snapshotted at first detection, then re-measured over the sessions that ran after the fix. A fix you marked done whose metric never moved stays 'claimed' and is never counted. A metric that improves on its own still verifies.",
    readout: [
      { k: "Baseline at detection", v: "3,592×" },
      { k: "Re-measured after fix", v: "212×", hot: true },
      { k: "Confirms above", v: "30% improvement" },
      { k: "Post-fix sessions needed", v: "≥ 3" },
    ],
    math: "$204.12 estimate × 94% actually realised",
    result: "$191.87 / mo booked",
    measuredFrom: ["cacheReadTokens", "inputTokens", "startedAt", "statusChangedAt"],
  },
];

/* ── the panel ──────────────────────────────────────────────────────────── */

/**
 * Drives the .iv-* marks in one panel, and re-drives them every time that
 * panel becomes the visible one.
 *
 * The site's charts normally animate once, on scroll. Here the reader is
 * switching detectors on an instrument that is already on screen, so "once"
 * would mean every detector after the first arrives pre-drawn and the rail
 * reads as flipping through slides. The charts drawing themselves on each
 * switch is most of what makes the rail worth touching.
 *
 * Turning on is deferred by two frames, and that is not a nicety. All six
 * panels are in the DOM and the five that are not selected are display:none.
 * A box coming back from display:none has no previous computed style, so
 * flipping it to its final state in the same commit paints it finished with
 * no transition at all. Two frames gives the browser one commit at the
 * resting style to transition away from.
 *
 * play is gated on the section having been scrolled to, so the first panel
 * does not quietly play itself out while it is still a thousand pixels below
 * the fold.
 */
function Replay({ play, children }: { play: boolean; children: ReactNode }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!play) {
      const id = requestAnimationFrame(() => setOn(false));
      return () => cancelAnimationFrame(id);
    }
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setOn(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [play]);

  return <div data-in={on ? "true" : "false"}>{children}</div>;
}

/** The receipts. Everything a sceptical engineer wants, and nobody else does. */
function Working({ cap }: { cap: Capability }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-[var(--border)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 px-5 py-3.5 text-left transition-colors duration-300 hover:bg-[var(--panel)] sm:px-8"
      >
        <svg
          viewBox="0 0 12 12"
          className="h-3 w-3 shrink-0 text-[var(--text-3)] transition-transform duration-[400ms] [transition-timing-function:var(--ease-swift)]"
          style={{ transform: open ? "rotate(90deg)" : "none" }}
          aria-hidden
        >
          <path
            d="M4 2.5 8 6l-4 3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[13px] font-medium text-[var(--ink)]">
          {open ? "Hide the working" : "Show the working"}
        </span>
        <span className="num ml-auto hidden text-[11.5px] text-[var(--text-3)] sm:block">
          detector <span className="text-[var(--text-2)]">{cap.detector}</span>
        </span>
      </button>

      {/* 0fr → 1fr is the one way to transition to an unknown height without
          measuring it in JS every time the reader opens a different panel. */}
      <div
        className="grid transition-[grid-template-rows] duration-[500ms] [transition-timing-function:var(--ease-swift)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[var(--border)]">
            <div className="grid grid-cols-1 gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
              {cap.readout.map((r) => (
                <div key={r.k} className="bg-white px-5 py-4 sm:px-8 lg:px-5">
                  <div className="text-[11.5px] leading-snug text-[var(--text-3)]">
                    {r.k}
                  </div>
                  <div
                    className="num mt-1 text-[15px] font-medium"
                    style={{ color: r.hot ? "var(--coral-700)" : "var(--ink)" }}
                  >
                    {r.v}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 border-t border-[var(--border)] bg-[var(--panel)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div className="min-w-0">
                <div className="cap">How the number is built</div>
                {/* overscroll-contain so flicking the formula sideways does not
                    drag the page with it on a touch screen. */}
                <div className="mt-2 min-w-0 overflow-x-auto overscroll-x-contain">
                  <div className="num w-max whitespace-nowrap text-[13px] text-[var(--text-2)]">
                    {cap.math}
                  </div>
                </div>
              </div>
              <div className="num shrink-0 text-[17px] font-medium tracking-[-0.02em] text-[var(--green-700)]">
                = {cap.result}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-[var(--border)] px-5 py-4 sm:px-8">
              <span className="cap mr-1">Read to know this</span>
              {cap.measuredFrom.map((f) => (
                <span
                  key={f}
                  className="num rounded border border-[var(--border)] bg-[var(--inset)] px-2 py-1 text-[11.5px] text-[var(--text-2)]"
                >
                  {f}
                </span>
              ))}
              <span className="num w-full text-[11.5px] text-[var(--text-3)] sm:ml-auto sm:w-auto">
                counters only, no code, no prompts
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({ cap, play }: { cap: Capability; play: boolean }) {
  return (
    <Replay play={play}>
      {/* beat one: the claim */}
      <div className="border-b border-[var(--border)] px-5 py-6 sm:px-8 sm:py-8">
        <div className="iv-fade flex items-center gap-3" style={d(0)}>
          <span className="num text-[12px] text-[var(--text-3)]">{cap.n}</span>
          <span className="h-px flex-1 bg-[var(--border)]" />
          <span className="num rounded bg-[var(--green-50)] px-2 py-1 text-[10.5px] font-medium uppercase tracking-[0.07em] text-[var(--green-700)]">
            {cap.confidence} confidence
          </span>
        </div>
        <h3
          className="iv-fade mt-4 max-w-3xl text-[20px] leading-[1.28] font-medium tracking-[-0.022em] text-[var(--ink)] sm:text-[25px]"
          style={d(0.06)}
        >
          {cap.claim}
        </h3>
        <p className="num iv-fade mt-3 text-[12.5px] text-[var(--text-3)]" style={d(0.12)}>
          {cap.name}
        </p>
      </div>

      {/* beats two and three, side by side */}
      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <div className="cap iv-fade" style={d(0.16)}>
            What we measured
          </div>
          <div
            className="num iv-fade mt-3 text-[40px] leading-none font-medium tracking-[-0.045em] text-[var(--ink)] sm:text-[46px]"
            style={d(0.2)}
          >
            {cap.signal.value}
          </div>
          <p
            className="iv-fade mt-2.5 max-w-sm text-[14px] leading-relaxed text-[var(--text-2)]"
            style={d(0.26)}
          >
            {cap.signal.label}
          </p>
          <div className="mt-7">{cap.viz}</div>
        </div>

        <div className="flex flex-col border-t border-[var(--border)] bg-[var(--panel)] px-5 py-6 sm:px-8 sm:py-8 lg:border-t-0 lg:border-l">
          <div className="cap iv-fade" style={d(0.3)}>
            {cap.costLabel}
          </div>
          <div
            className="num iv-fade mt-3 text-[34px] leading-none font-medium tracking-[-0.045em] text-[var(--green-700)] sm:text-[38px]"
            style={d(0.34)}
          >
            {cap.cost}
          </div>
          <p className="num iv-fade mt-2 text-[12px] text-[var(--text-3)]" style={d(0.38)}>
            {cap.costNote}
          </p>

          <div className="mt-7 border-t border-[var(--border)] pt-6">
            <div className="cap iv-fade" style={d(0.42)}>
              What to do
            </div>
            <p
              className="iv-fade mt-3 text-[14px] leading-[1.65] text-[var(--text-2)]"
              style={d(0.46)}
            >
              {cap.fix}
            </p>
          </div>
        </div>
      </div>

      <Working cap={cap} />
    </Replay>
  );
}

/* ── section ────────────────────────────────────────────────────────────── */

export default function Capabilities() {
  const [active, setActive] = useState(CAPS[0].id);
  const [railRef, seen] = useSeen<HTMLDivElement>();

  return (
    <section id="engine" className="section-y scroll-mt-24 border-t border-[var(--border)]">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="display-2">Six detectors. Every one shows its work.</h2>
          <p className="lead mt-5">
            Each one targets a specific way AI spend leaks. Open any of them and
            you get the same three things: what it measured, what that is
            costing you, and what to do about it. None of it needs to read your
            code.
          </p>
        </Reveal>

        {/* One instrument: the rail is its channel selector, the panel is its
            readout. Two separate floating boxes would read as a menu sitting
            next to an unrelated card. */}
        {/* marks={false}: this Reveal lifts the instrument in, but the panel
            marks below belong to Replay. A mark rule matches on any ancestor
            carrying data-in="true", so leaving it on here would pin every
            chart permanently finished and kill the replay on tab change. */}
        <Reveal className="mt-12 sm:mt-16" delay={0.05} marks={false}>
          <Tabs.Root
            ref={railRef}
            value={active}
            onValueChange={setActive}
            className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]"
          >
            {/* Six across from lg, two on a phone. Deliberately not a
                horizontally scrolling strip: a rail whose last three entries
                sit off-screen with no affordance is a rail nobody uses. */}
            <Tabs.List
              aria-label="Detectors"
              className="grid grid-cols-2 gap-px border-b border-[var(--border)] bg-[var(--border)] sm:grid-cols-3 lg:grid-cols-6"
            >
              {CAPS.map((c) => {
                const on = c.id === active;
                return (
                  <Tabs.Trigger
                    key={c.id}
                    value={c.id}
                    className={`relative flex flex-col items-start gap-1.5 px-4 py-3.5 text-left transition-colors duration-[400ms] [transition-timing-function:var(--ease-swift)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--brand-500)] ${
                      on ? "bg-white" : "bg-[var(--panel)] hover:bg-[var(--surface)]"
                    }`}
                  >
                    <span
                      className="absolute inset-x-0 top-0 h-[2px] origin-left bg-[var(--brand-600)] transition-transform duration-[450ms] [transition-timing-function:var(--ease-swift)]"
                      style={{ transform: on ? "scaleX(1)" : "scaleX(0)" }}
                      aria-hidden
                    />
                    <span
                      className="num text-[11px] transition-colors duration-300"
                      style={{ color: on ? "var(--brand-700)" : "var(--text-3)" }}
                    >
                      {c.n}
                    </span>
                    <span
                      className="text-[13.5px] leading-tight font-medium tracking-[-0.012em] transition-colors duration-300"
                      style={{ color: on ? "var(--ink)" : "var(--text-2)" }}
                    >
                      {c.tab}
                    </span>
                  </Tabs.Trigger>
                );
              })}
            </Tabs.List>

            {CAPS.map((c) => (
              <Tabs.Content
                key={c.id}
                value={c.id}
                /* forceMount, because without it Radix renders only the
                   selected panel and five of the six detectors — their claims,
                   their arithmetic, their fixes — never reach the HTML at all.
                   That is the bulk of this section's indexable copy.

                   forceMount also stops Radix setting hidden itself (it ties
                   that to presence, not to selection), so the inactive panels
                   are hidden here instead. The floor keeps the rail from
                   jumping as panels of slightly different length swap in. */
                forceMount
                className="focus-visible:outline-none data-[state=inactive]:hidden lg:min-h-[29rem]"
              >
                <Panel cap={c} play={seen && c.id === active} />
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </Reveal>
      </div>
    </section>
  );
}
