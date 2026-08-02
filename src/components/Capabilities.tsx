"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";

/* ─────────────────────────────────────────────────────────────────────────
   The detection engine.

   Features.tsx shows WHAT the platform is. This section shows HOW the engine
   actually finds waste: for each detector, the signal it measures, the
   threshold that fires it, the savings math, and the fix.

   Layout: the index on the left is pinned while all six panels scroll past it
   on the right, and a scrollspy keeps the pinned entry in sync with whichever
   panel you're reading.

   Every panel ends with the exact fields the detector read, all of which are
   counters. That footer is the point: the engine is this specific *because*
   it only ever sees metering data, never code.

   Thresholds and math below mirror the real detectors:
     backend  src/jobs/autoInsights.ts, src/services/insightVerification.ts
     cli      src/detectors/{seat-efficiency,repeat-read}.ts
   Keep them in sync when a detector constant changes.
   ───────────────────────────────────────────────────────────────────────── */

type Capability = {
  id: string;
  n: string;
  name: string;
  blurb: string;
  detector: string;
  confidence: "high" | "medium";
  /** Big measured headline in the panel. */
  signal: { value: string; label: string };
  /** signal → threshold readout rows. */
  readout: Array<{ k: string; v: string; hot?: boolean }>;
  /** The savings arithmetic, shown as a line the reader can check. */
  math: string;
  result: string;
  fix: string;
  /** Telemetry fields the detector consumed. All counters. */
  measuredFrom: string[];
};

const CAPS: Capability[] = [
  {
    id: "context-bloat",
    n: "01",
    name: "Context re-read metering",
    blurb: "Finds the stable context you pay to re-send every single session.",
    detector: "context-bloat",
    confidence: "high",
    signal: { value: "3,592×", label: "cache reads per input token" },
    readout: [
      { k: "Cache-read ÷ input tokens", v: "3,592×", hot: true },
      { k: "Fires above", v: "0.40×" },
      { k: "Avg input / session", v: "48,210 tokens" },
      { k: "Sessions measured", v: "51 in 30 days" },
    ],
    math: "$1,134 window spend × 18% recoverable × (30 ÷ 30)",
    result: "$204.12 / mo",
    fix: "Move CLAUDE.md's topic sections into .claude/docs/ and leave a pointer index in the root. Each file then loads only in the sessions where its topic comes up. Not @import: imports load in full at every conversation start, so they move text around without saving a token.",
    measuredFrom: ["cacheReadTokens", "inputTokens", "costUsd", "startedAt"],
  },
  {
    id: "model-routing",
    n: "02",
    name: "Premium-model routing",
    blurb: "Catches the expensive model doing work that never shipped.",
    detector: "model-routing",
    confidence: "high",
    signal: { value: "62%", label: "of sessions on Opus, 24% of what shipped" },
    readout: [
      { k: "Opus share of sessions", v: "62.0%", hot: true },
      { k: "Opus share of shipped work", v: "24.0%" },
      { k: "Fires when", v: "session share > shipped share" },
      { k: "Spend on Opus that didn't ship", v: "$104.30" },
    ],
    math: "$104.30 non-shipping premium spend × (30 ÷ 30)",
    result: "$104.30 / mo",
    fix: "Add a routing rule to CLAUDE.md: default exploration and iteration to a Sonnet-class model, escalate to Opus for architecture, tricky debugging, and large refactors. The gap between those two percentages is the money.",
    measuredFrom: ["model", "outcome", "costUsd", "gitAuthorEmail"],
  },
  {
    id: "cache-efficiency",
    n: "03",
    name: "Cache-hit recovery",
    blurb: "Spots high token volume paying full input price on every turn.",
    detector: "cache-efficiency",
    confidence: "high",
    signal: { value: "11.4%", label: "cache-hit rate across 8.2M tokens" },
    readout: [
      { k: "Cache-hit rate", v: "11.4%", hot: true },
      { k: "Fires below", v: "30.0%" },
      { k: "Token volume", v: "8.2M" },
      { k: "Volume floor", v: "1.0M" },
    ],
    math: "7.3M input × 50% cacheable × 90% saved × $3.00/M",
    result: "$98.55 / mo",
    fix: "Put the stable prefix (project overview, conventions, standing guidance) first and unchanged, ahead of anything task-specific. The cache keys on that prefix, so anything dynamic above it invalidates everything below.",
    measuredFrom: ["inputTokens", "cacheReadTokens", "sessionId"],
  },
  {
    id: "marathon-sessions",
    n: "04",
    name: "Marathon-session detection",
    blurb: "Flags long sessions that grind past the point of converging.",
    detector: "marathon-sessions",
    confidence: "high",
    signal: { value: "6 sessions", label: "averaging 152 turns, none shipped" },
    readout: [
      { k: "Marathon sessions", v: "6", hot: true },
      { k: "Turn threshold", v: "≥ 30 turns" },
      { k: "Avg turns", v: "152" },
      { k: "Combined cost", v: "$195.40" },
    ],
    math: "$195.40 across 6 non-shipping marathons × (30 ÷ 30)",
    result: "$195.40 / mo",
    fix: "Past roughly 30 turns the accumulated context is re-sent on every turn and the session rarely converges. When one stalls, start fresh with a tighter prompt carrying what you learned. Restarting is cheaper than pushing.",
    measuredFrom: ["turnCount", "outcome", "costUsd"],
  },
  {
    id: "seat-efficiency",
    n: "05",
    name: "Idle-seat reclaim",
    blurb: "Prices the seats nobody is using against what you're billed.",
    detector: "seat-efficiency",
    confidence: "high",
    signal: { value: "4 seats", label: "consuming under 10% of their cost" },
    readout: [
      { k: "Dormant seats", v: "4", hot: true },
      { k: "Dormant below", v: "10% of seat cost" },
      { k: "Seat cost", v: "$30.00 / mo" },
      { k: "Avg consumption", v: "$1.14 / mo" },
    ],
    math: "4 dormant seats × $30.00 seat cost",
    result: "$120.00 / mo",
    fix: "Reclaim or reassign at the provider. This one is deliberately never automated. It is a billing change against a real person's access, so PlanckSpace surfaces it and hands you the list, nothing more.",
    measuredFrom: ["gitAuthorEmail", "costUsd", "tool", "seatCostUsdMonthly"],
  },
  {
    id: "verification",
    n: "06",
    name: "Telemetry-verified savings",
    blurb: "Re-measures after the fix, so savings are booked and never claimed.",
    detector: "insight-verification",
    confidence: "high",
    signal: { value: "94%", label: "of the measured problem eliminated" },
    readout: [
      { k: "Baseline at detection", v: "3,592×" },
      { k: "Re-measured after fix", v: "212×", hot: true },
      { k: "Confirms above", v: "30% improvement" },
      { k: "Post-fix sessions needed", v: "≥ 3" },
    ],
    math: "$204.12 estimate × 94% actually realised",
    result: "$191.87 / mo booked",
    fix: "The baseline is snapshotted at first detection, then re-measured over the sessions that ran after the fix. A fix you marked done whose metric never moved stays 'claimed' and is never counted. A metric that improves on its own still verifies.",
    measuredFrom: ["cacheReadTokens", "inputTokens", "startedAt", "statusChangedAt"],
  },
];

/* ── panel ──────────────────────────────────────────────────────────────── */

function Detail({ cap }: { cap: Capability }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-[0_1px_2px_rgba(17,19,26,0.04),0_18px_40px_-24px_rgba(17,19,26,0.28)]">
      {/* Header, self-identifying since all six panels are stacked now. Below
          lg it is the ONLY place the detector is named — the index that used
          to carry the name and blurb is hidden there — so the title wraps
          rather than truncating and the blurb comes along for the ride. */}
      <div className="border-b border-[var(--border)] px-5 py-3.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1.5">
          <span className="flex min-w-0 items-baseline gap-3">
            <span className="num shrink-0 text-[12px] text-[var(--text-3)]">{cap.n}</span>
            <h3
              id={`cap-title-${cap.id}`}
              className="text-[15px] font-semibold tracking-[-0.015em] text-[var(--ink)] lg:truncate"
            >
              {cap.name}
            </h3>
          </span>
          <span className="num shrink-0 rounded bg-[var(--green-50)] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-[var(--green-700)]">
            {cap.confidence} confidence
          </span>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-2)] lg:hidden">
          {cap.blurb}
        </p>
        <div className="num mt-1.5 text-[11px] text-[var(--text-3)]">
          detector <span className="text-[var(--ink)]">{cap.detector}</span>
        </div>
      </div>

      {/* measured signal */}
      <div className="border-b border-[var(--border)] px-5 py-6">
        <div className="text-[10px] font-medium uppercase tracking-[0.09em] text-[var(--text-3)]">
          Measured signal
        </div>
        <div className="num mt-2 text-[38px] leading-none font-medium tracking-[-0.04em] text-[var(--ink)]">
          {cap.signal.value}
        </div>
        <div className="mt-2 text-[13px] text-[var(--text-2)]">{cap.signal.label}</div>
      </div>

      {/* readout */}
      <div className="grid grid-cols-1 gap-px border-b border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
        {cap.readout.map((r) => (
          <div key={r.k} className="bg-white px-5 py-3">
            <div className="text-[10.5px] text-[var(--text-3)]">{r.k}</div>
            <div
              className="num mt-0.5 text-[14px] font-medium"
              style={{ color: r.hot ? "var(--coral-700)" : "var(--ink)" }}
            >
              {r.v}
            </div>
          </div>
        ))}
      </div>

      {/* math */}
      <div className="border-b border-[var(--border)] bg-[var(--panel)] px-5 py-4">
        <div className="text-[10px] font-medium uppercase tracking-[0.09em] text-[var(--text-3)]">
          How the number is built
        </div>
        {/* overscroll-contain so flicking the formula sideways doesn't drag
            the page with it on a touch screen. */}
        <div className="mt-2 min-w-0 overflow-x-auto overscroll-x-contain">
          <div className="num w-max text-[12.5px] whitespace-nowrap text-[var(--text-2)]">
            {cap.math}
          </div>
        </div>
        <div className="num mt-1.5 text-[16px] font-medium tracking-[-0.02em] text-[var(--green-700)]">
          = {cap.result}
        </div>
      </div>

      {/* fix */}
      <div className="border-b border-[var(--border)] px-5 py-4">
        <div className="text-[10px] font-medium uppercase tracking-[0.09em] text-[var(--text-3)]">
          The fix
        </div>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-2)]">{cap.fix}</p>
      </div>

      {/* privacy footer, which is the whole point */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 px-5 py-3.5">
        <span className="text-[10px] font-medium uppercase tracking-[0.09em] text-[var(--text-3)]">
          Read to know this
        </span>
        {cap.measuredFrom.map((f) => (
          <span
            key={f}
            className="num rounded border border-[var(--border)] bg-[var(--inset)] px-1.5 py-0.5 text-[10.5px] text-[var(--text-2)]"
          >
            {f}
          </span>
        ))}
        <span className="num ml-auto text-[10.5px] text-[var(--text-3)]">
          counters only, no code, no prompts
        </span>
      </div>
    </div>
  );
}

/* ── section ────────────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const;
/** Fraction down the viewport at which a panel takes over as the active one. */
const ACTIVATION = 0.35;
/** Where a clicked panel comes to rest, measured from the top of the viewport. */
const SCROLL_OFFSET = 110;

export default function Capabilities() {
  const [active, setActive] = useState(0);
  const panelRefs = useRef<Array<HTMLElement | null>>([]);
  const lockUntil = useRef(0);
  const reduce = useReducedMotion();

  /* Scrollspy. The index is pinned while the panels scroll past it, so the
     active entry is simply the last panel whose top has crossed the activation
     line. Desktop only: below lg nothing is pinned, so there is nothing to
     keep in sync. */
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    let raf = 0;
    let bound = false;

    const pick = () => {
      raf = 0;
      if (performance.now() < lockUntil.current) return;
      const line = window.innerHeight * ACTIVATION;
      let best = 0;
      panelRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) best = i;
      });
      setActive((prev) => (prev === best ? prev : best));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(pick);
    };
    const bind = () => {
      if (bound) return;
      bound = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      onScroll();
    };
    const unbind = () => {
      if (!bound) return;
      bound = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };

    const sync = () => (desktop.matches ? bind() : unbind());
    sync();
    desktop.addEventListener("change", sync);
    return () => {
      desktop.removeEventListener("change", sync);
      unbind();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* Clicking an entry jumps to its panel. The lock keeps the spy from fighting
     the smooth scroll while it's travelling. */
  const select = useCallback(
    (i: number) => {
      setActive(i);
      const el = panelRefs.current[i];
      if (!el) return;
      lockUntil.current = performance.now() + 900;
      window.scrollTo({
        top: window.scrollY + el.getBoundingClientRect().top - SCROLL_OFFSET,
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [reduce],
  );

  return (
    <section
      id="engine"
      className="section-y scroll-mt-24 border-t border-[var(--border)]"
    >
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="display-2">Six detectors. Every one shows its work.</h2>
          <p className="lead mt-5">
            Each targets a specific way AI spend leaks, and each carries the
            measurement that found it: the signal, the threshold, the arithmetic,
            and the re-measurement that confirms the fix worked. Nothing here
            needs to read your code.
          </p>
        </Reveal>

        {/* Deliberately no items-start: the columns stretch to the row height,
            which is what gives the pinned index room to stick against the
            scrolling panel column. */}
        <div className="mt-12 grid gap-4 sm:mt-16 lg:grid-cols-12 lg:gap-6">
          {/* The pinned index, desktop only. Nothing pins below lg, so on a
              phone this rendered as six nav rows stacked directly above the
              six panels they point at: ~540px of scrolling to reach content
              that then repeats every one of these labels. The panels are
              self-identifying by design, so the index has no job here. */}
          <div className="hidden lg:col-span-5 lg:block">
            <nav
              aria-label="Detectors"
              className="flex flex-col lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto"
            >
              {CAPS.map((c, i) => {
                const on = i === active;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => select(i)}
                    aria-current={on ? "true" : undefined}
                    className={`group relative border-b border-[var(--border)] px-4 py-5 text-left transition-colors duration-300 first:border-t focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--brand-500)] ${
                      on ? "bg-[var(--brand-50)]" : "hover:bg-[var(--panel)]"
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="cap-active-bar"
                        className="absolute inset-y-0 left-0 w-[2px] bg-[var(--brand-600)]"
                        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE }}
                      />
                    )}
                    <span className="flex items-baseline gap-3">
                      <span
                        className="num shrink-0 text-[12px] transition-colors duration-300"
                        style={{ color: on ? "var(--brand-700)" : "var(--text-3)" }}
                      >
                        {c.n}
                      </span>
                      <span className="min-w-0">
                        <span
                          className="block text-[15.5px] font-semibold tracking-[-0.015em] transition-colors duration-300"
                          style={{ color: on ? "var(--ink)" : "var(--text-2)" }}
                        >
                          {c.name}
                        </span>
                        <span
                          className="mt-1 block text-[13px] leading-relaxed transition-colors duration-300"
                          style={{ color: on ? "var(--text-2)" : "var(--text-3)" }}
                        >
                          {c.blurb}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* The column that actually moves.

              min-w-0 is load-bearing, not defensive. A grid item defaults to
              min-width:auto, so its track cannot size below its content's
              min-content width. The "How the number is built" line is
              whitespace-nowrap inside an overflow-x-auto scroller, and that
              355px min-content propagated up here and pinned every panel at
              412px wide on every phone. Because <main> is overflow-x-clip the
              page never gained a scrollbar to reveal it — the right edge of
              all six panels was simply cut off. min-width:0 lets the track
              shrink, which in turn lets the scroller actually scroll. */}
          <div className="min-w-0 lg:col-span-7">
            <div className="space-y-4 lg:space-y-6">
              {CAPS.map((c, i) => (
                <article
                  key={c.id}
                  id={`cap-${c.id}`}
                  ref={(el) => {
                    panelRefs.current[i] = el;
                  }}
                  aria-labelledby={`cap-title-${c.id}`}
                  className="scroll-mt-28"
                >
                  <Reveal>
                    <Detail cap={c} />
                  </Reveal>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
