"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  Bell,
  ChevronDown,
  LayoutGrid,
  Scale,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { PlanckMark } from "@/components/ui/logo";
import { TOOLS, TOOL_BY_ID, TOOL_COLOR, type ToolId } from "@/components/brand/ToolLogos";
import { useLive } from "@/components/ui/in-view";

/* ─────────────────────────────────────────────────────────────────────────
   The hero's product moment: the Overview screen, built natively.

   It replaced a raster capture because a capture cannot move, and the one
   thing a metering product should look like on first sight is *metered*:
   sessions closing, spend ticking, a chart that is plainly made of data.

   Orchestration on first load, in order, all ease-out and each under a second:
     frame rises (.rise)  →  KPI figures count up  →  bars grow left to right
     →  the session feed starts taking new rows every few seconds.
   After that only the feed moves, and only while the console is on screen.

   Every figure is derived from DAILY below, so the KPI, the chart, the
   legend shares and the tooltip can never disagree with each other.
   ───────────────────────────────────────────────────────────────────────── */

/* ── data ───────────────────────────────────────────────────────────────── */

/** mulberry32: tiny, seeded, identical on server and client. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ORDER: ToolId[] = ["claude", "cursor", "windsurf", "antigravity"];
const BASE: Record<ToolId, number> = { claude: 360, cursor: 190, windsurf: 78, antigravity: 46 };

type Day = { label: string; weekend: boolean; v: Record<ToolId, number>; total: number };

const DAILY: Day[] = (() => {
  const r = rng(20260915);
  const out: Day[] = [];
  const start = new Date(Date.UTC(2026, 7, 17)); // Aug 17 → Sep 15
  for (let i = 0; i < 30; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    const dow = d.getUTCDay();
    const weekend = dow === 0 || dow === 6;
    const growth = 0.72 + (i / 29) * 0.5;
    const v = {} as Record<ToolId, number>;
    let total = 0;
    for (const t of ORDER) {
      const noise = 0.78 + r() * 0.44;
      const val = BASE[t] * growth * noise * (weekend ? 0.34 : 1);
      v[t] = Math.round(val * 100) / 100;
      total += v[t];
    }
    out.push({
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
      weekend,
      v,
      total,
    });
  }
  return out;
})();

const SPEND_30D = DAILY.reduce((s, d) => s + d.total, 0);
const SHARE = Object.fromEntries(
  ORDER.map((t) => [t, DAILY.reduce((s, d) => s + d.v[t], 0) / SPEND_30D]),
) as Record<ToolId, number>;

const usd = (n: number, dp = 0) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });

/* ── live sessions ──────────────────────────────────────────────────────── */

type Session = {
  tool: ToolId;
  dev: string;
  repo: string;
  model: string;
  tokens: string;
  cost: number;
  shipped: boolean;
};

const POOL: Session[] = [
  { tool: "claude", dev: "priya.n", repo: "api-service", model: "sonnet-5", tokens: "48.2k", cost: 2.14, shipped: true },
  { tool: "cursor", dev: "marcus.o", repo: "web-app", model: "gpt-5", tokens: "21.7k", cost: 0.86, shipped: true },
  { tool: "claude", dev: "aiko.t", repo: "billing", model: "opus-5", tokens: "112k", cost: 7.9, shipped: false },
  { tool: "windsurf", dev: "tomas.r", repo: "mobile", model: "swe-1.5", tokens: "30.4k", cost: 0.52, shipped: true },
  { tool: "antigravity", dev: "lena.k", repo: "infra", model: "gemini-3-pro", tokens: "64.9k", cost: 1.73, shipped: true },
  { tool: "claude", dev: "dev.okafor", repo: "api-service", model: "sonnet-5", tokens: "39.1k", cost: 1.66, shipped: true },
  { tool: "cursor", dev: "sofia.m", repo: "design-system", model: "sonnet-5", tokens: "17.3k", cost: 0.71, shipped: true },
  { tool: "claude", dev: "priya.n", repo: "ingest", model: "haiku-4.5", tokens: "26.0k", cost: 0.31, shipped: true },
  { tool: "windsurf", dev: "jonah.b", repo: "web-app", model: "sonnet-5", tokens: "44.8k", cost: 1.92, shipped: false },
  { tool: "claude", dev: "aiko.t", repo: "billing", model: "sonnet-5", tokens: "57.5k", cost: 2.48, shipped: true },
  { tool: "antigravity", dev: "ravi.s", repo: "data-pipeline", model: "gemini-3-pro", tokens: "33.2k", cost: 0.94, shipped: true },
  { tool: "cursor", dev: "marcus.o", repo: "web-app", model: "composer-1", tokens: "12.6k", cost: 0.38, shipped: true },
];

const AGO = ["just now", "14s ago", "39s ago", "1m ago", "2m ago", "4m ago"];
/* Rows held in state. Deliberately more than can ever be on screen: the
   window takes whatever height the column has spare, and a list that ran out
   of rows would show white space under the last one. Clipped rows cost a few
   DOM nodes and remove the whole class of bug. */
const FEED_LEN = 9;
/* The shortest the window is allowed to get, in rows. Independent of
   FEED_LEN — this one is about how much of the feed is worth showing, that
   one is about never running out of list. */
const FEED_MIN_ROWS = 5;
/* Every row is exactly this tall, border included. The feed's whole
   animation rests on that number being true — see Feed. */
const ROW_H = 52;
const TICK_MS = 3400;

/* ── number motion ──────────────────────────────────────────────────────── */

/** Eases the displayed value toward `target` whenever it changes. */
function useTween(target: number, { from, duration = 1400, delay = 0 }: { from?: number; duration?: number; delay?: number } = {}) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(target);
  const current = useRef(target);
  const first = useRef(true);

  useEffect(() => {
    if (reduce) {
      current.current = target;
      return;
    }
    const start = first.current && from !== undefined ? from : current.current;
    const wait = first.current ? delay : 0;
    const dur = first.current ? duration : 700;
    first.current = false;
    let raf = 0;
    let t0 = 0;
    const step = (now: number) => {
      if (!t0) t0 = now + wait;
      const p = Math.min(1, Math.max(0, (now - t0) / dur));
      const e = 1 - Math.pow(1 - p, 4);
      const v = start + (target - start) * e;
      current.current = v;
      setValue(v);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reduce]);

  return reduce ? target : value;
}

/* ── pieces ─────────────────────────────────────────────────────────────── */

function Cap({ children }: { children: React.ReactNode }) {
  return <span className="cap">{children}</span>;
}

function Sparkline() {
  // close to the tile's rendered width, so the stretch is negligible
  const W = 220;
  const H = 30;
  const max = Math.max(...DAILY.map((d) => d.total));
  const min = Math.min(...DAILY.map((d) => d.total));
  const pts = DAILY.map((d, i) => [
    (i / (DAILY.length - 1)) * W,
    3 + (1 - (d.total - min) / (max - min)) * (H - 6),
  ]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-[30px] w-full" aria-hidden preserveAspectRatio="none">
      <path d={`${line} L${W},${H} L0,${H} Z`} fill="var(--brand-500)" opacity="0.08" />
      <path
        d={line}
        pathLength={1}
        className="draw-in"
        style={{ "--d": "0.9s" } as React.CSSProperties}
        fill="none"
        stroke="var(--brand-600)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function Kpis({ spend }: { spend: number }) {
  const s = useTween(spend, { from: spend * 0.62, delay: 450 });
  const cps = useTween(4.12, { from: 6.9, delay: 450 });
  const waste = useTween(2310, { from: 0, delay: 450 });
  const saved = useTween(1184, { from: 0, delay: 450 });

  const weeks = [6.9, 6.2, 5.8, 5.1, 4.6, 4.12];
  const leaks = [
    { k: "Context re-reads", w: 41 },
    { k: "Marathon sessions", w: 26 },
    { k: "Model routing", w: 19 },
    { k: "Idle seats", w: 14 },
  ];

  return (
    <div className="grid grid-cols-2 gap-px border-b border-[var(--border)] bg-[var(--border)] lg:grid-cols-4">
      <div className="bg-white px-4 py-3.5 sm:px-5 sm:py-4">
        <Cap>AI spend, 30 days</Cap>
        <div className="num mt-1.5 text-[19px] font-medium tracking-[-0.04em] text-[var(--ink)] sm:text-[22px]">
          {usd(s, 2)}
        </div>
        <div className="mt-2 hidden sm:block">
          <Sparkline />
        </div>
      </div>

      <div className="bg-white px-4 py-3.5 sm:px-5 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <Cap>Cost / shipped session</Cap>
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="num text-[19px] font-medium tracking-[-0.04em] text-[var(--ink)] sm:text-[22px]">
            {usd(cps, 2)}
          </span>
          <span className="num text-[10.5px] font-medium text-[var(--green-700)]">↓ 40%</span>
        </div>
        <div className="mt-2 hidden h-[30px] items-end gap-[5px] sm:flex" aria-hidden>
          {weeks.map((w, i) => (
            <span
              key={i}
              className="bar-up block w-[10px] rounded-[2px]"
              style={
                {
                  height: `${(w / 7) * 100}%`,
                  background: i === weeks.length - 1 ? "var(--brand-600)" : "var(--border-strong)",
                  "--d": `${0.7 + i * 0.07}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>

      <div className="bg-white px-4 py-3.5 sm:px-5 sm:py-4">
        <Cap>Recoverable waste</Cap>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="num text-[19px] font-medium tracking-[-0.04em] text-[var(--coral-700)] sm:text-[22px]">
            {usd(waste)}
          </span>
          <span className="num text-[11px] text-[var(--text-3)]">/mo</span>
        </div>
        <div className="mt-2 hidden sm:block">
          <div className="flex h-[6px] gap-[2px] overflow-hidden rounded-full" aria-hidden>
            {leaks.map((l, i) => (
              <span
                key={l.k}
                className="h-full"
                style={{ width: `${l.w}%`, background: "var(--coral-500)", opacity: 1 - i * 0.2 }}
              />
            ))}
          </div>
          <div className="num mt-2 text-[10px] text-[var(--text-3)]">4 leaks, 7 fixes ready</div>
        </div>
      </div>

      <div className="bg-white px-4 py-3.5 sm:px-5 sm:py-4">
        <Cap>Verified savings</Cap>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="num text-[19px] font-medium tracking-[-0.04em] text-[var(--green-700)] sm:text-[22px]">
            {usd(saved)}
          </span>
          <span className="num text-[11px] text-[var(--text-3)]">/mo</span>
        </div>
        <div className="mt-2 hidden sm:block">
          <div className="flex gap-[3px]" aria-hidden>
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                className="h-[6px] flex-1 rounded-[1.5px]"
                style={{ background: i < 11 ? "var(--green-500)" : "var(--inset)" }}
              />
            ))}
          </div>
          <div className="num mt-2 text-[10px] text-[var(--text-3)]">11 of 14 fixes re-measured</div>
        </div>
      </div>
    </div>
  );
}

/* ── the chart ──────────────────────────────────────────────────────────── */

function SpendChart() {
  const [hover, setHover] = useState<number | null>(null);
  const W = 600;
  const H = 176;
  const TOP = 6;
  const max = Math.ceil(Math.max(...DAILY.map((d) => d.total)) / 250) * 250;
  const slot = W / DAILY.length;
  const bw = slot * 0.62;
  const y = (v: number) => (v / max) * (H - TOP);
  const ticks = [max / 3, (2 * max) / 3, max];

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full overflow-visible"
        role="img"
        aria-label={`Daily AI spend over the last 30 days, stacked by tool. Total ${usd(SPEND_30D)}, rising through the month with quieter weekends.`}
        onMouseLeave={() => setHover(null)}
      >
        {ticks.map((t) => (
          <line
            key={t}
            x1="0"
            x2={W}
            y1={H - y(t)}
            y2={H - y(t)}
            stroke="var(--border)"
            strokeDasharray="3 5"
          />
        ))}
        <line x1="0" x2={W} y1={H} y2={H} stroke="var(--border-strong)" />

        {DAILY.map((d, i) => {
          let acc = 0;
          const x = i * slot + (slot - bw) / 2;
          const dim = hover !== null && hover !== i;
          return (
            <g
              key={d.label}
              className="bar-up"
              style={{ "--d": `${0.75 + i * 0.022}s`, opacity: dim ? 0.35 : 1, transition: "opacity .25s" } as React.CSSProperties}
            >
              {ORDER.map((t) => {
                const h = y(d.v[t]);
                const top = H - acc - h;
                acc += h;
                // 1.5px surface gap between stacked segments
                return (
                  <rect
                    key={t}
                    x={x}
                    y={top + 0.75}
                    width={bw}
                    height={Math.max(0, h - 1.5)}
                    rx="1.5"
                    fill={TOOL_COLOR[t]}
                  />
                );
              })}
            </g>
          );
        })}

        {/* hit targets wider than the marks */}
        {DAILY.map((d, i) => (
          <rect
            key={`hit-${d.label}`}
            x={i * slot}
            y="0"
            width={slot}
            height={H}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}
      </svg>

      <div className="num pointer-events-none absolute -top-1 right-0 flex flex-col items-end text-[9.5px] text-[var(--text-3)]" aria-hidden>
        <span>{usd(max)}</span>
      </div>

      <div className="num mt-2 flex justify-between text-[9.5px] text-[var(--text-3)]" aria-hidden>
        <span>{DAILY[0].label}</span>
        <span className="hidden sm:inline">{DAILY[10].label}</span>
        <span className="hidden sm:inline">{DAILY[20].label}</span>
        <span>{DAILY[29].label}</span>
      </div>

      <AnimatePresence>
        {hover !== null && (
          <motion.div
            key="tip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-none absolute top-2 z-10 w-[168px] rounded-lg border border-[var(--border)] bg-white/95 p-2.5 shadow-[var(--shadow-float)] backdrop-blur"
            style={{
              left: `clamp(0px, calc(${((hover + 0.5) / DAILY.length) * 100}% - 84px), calc(100% - 168px))`,
            }}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-medium text-[var(--ink)]">{DAILY[hover].label}</span>
              <span className="num text-[11px] font-medium text-[var(--ink)]">{usd(DAILY[hover].total, 2)}</span>
            </div>
            <div className="mt-1.5 space-y-1">
              {[...ORDER].reverse().map((t) => {
                const Tool = TOOL_BY_ID[t];
                return (
                  <div key={t} className="flex items-center justify-between gap-2 text-[10.5px]">
                    <span className="flex items-center gap-1.5 text-[var(--text-2)]">
                      <span className="h-2 w-2 rounded-[2px]" style={{ background: TOOL_COLOR[t] }} />
                      {Tool.name}
                    </span>
                    <span className="num text-[var(--ink)]">{usd(DAILY[hover].v[t], 2)}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── live feed ──────────────────────────────────────────────────────────── */

type Row = Session & { key: number };

/**
 * The live session feed: a fixed window that new rows slide into.
 *
 * This used to be an AnimatePresence list where every row carried framer's
 * `layout` prop, and it was the most destructive thing on the page. Two
 * faults, compounding:
 *
 *   1. The exiting row animated only its opacity, so it stayed in flow for
 *      the whole 0.55s. The list held six rows instead of five, grew by a row
 *      height, grew the console, and reflowed the entire document — every
 *      section below the hero jumped, once every 3.4 seconds.
 *
 *   2. `layout` and `y` both write to transform. Framer resolves that by
 *      measuring the real box and projecting a correction onto it, so the two
 *      fought each other across a subtree that fault 1 was busy resizing.
 *      That is what turned a jump into the screen coming apart.
 *
 * So the list no longer changes size, ever, and nothing measures anything.
 * The window is clipped, and its height is owned by the flex column rather
 * than by its contents — min-height is explicit and overflow is hidden, so
 * the rows inside cannot push it. Rows are a known ROW_H tall, which lets the
 * arrival be one transform on one element: start the list a row high and let
 * it fall back to rest. No projection, no reflow, and nothing below the hero
 * can feel it.
 */
function Feed({ live, onSession }: { live: boolean; onSession: (cost: number) => void }) {
  const [rows, setRows] = useState<Row[]>(() =>
    POOL.slice(0, FEED_LEN).map((s, i) => ({ ...s, key: i })),
  );
  const cursor = useRef(FEED_LEN);
  const started = useRef(false);
  const listRef = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!live) return;
    // hold the first new row until the load choreography has finished
    const lead = started.current ? TICK_MS : 2600;
    started.current = true;
    let id: ReturnType<typeof setInterval> | undefined;

    const push = () => {
      const s = POOL[cursor.current % POOL.length];
      const key = cursor.current++;
      setRows((r) => [{ ...s, key }, ...r].slice(0, FEED_LEN));
      onSession(s.cost);

      /* Run straight off the DOM rather than through state. The new row is
         already painted in its final place by the time this fires; all this
         does is start the list one row high and let it settle, which reads as
         the arrival pushing the others down. On WAAPI it stays off React's
         clock, so a dropped render cannot park the list mid-slide. */
      const el = listRef.current;
      if (el && !reduce) {
        el.animate(
          [{ transform: `translateY(-${ROW_H}px)` }, { transform: "translateY(0)" }],
          { duration: 520, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        );
      }
    };

    const t = setTimeout(() => {
      push();
      id = setInterval(push, TICK_MS);
    }, lead);
    return () => {
      clearTimeout(t);
      if (id) clearInterval(id);
    };
  }, [live, onSession, reduce]);

  return (
    /* The clip, and it is two elements for one specific reason.

       overflow:hidden does not stop a box sizing itself to its contents — it
       only clips what spills afterwards — and min-height is a floor, not a
       ceiling. So a single div here still grew to fit all nine rows, pushed
       the right column past the chart column beside it, and left a bank of
       dead white space under the chart.

       Taking the list out of flow is what actually fixes it. An absolutely
       positioned child contributes nothing to its parent's height, so the
       outer box is sized purely by its own min-height and by whatever the
       grid row gives it — the rows inside can no longer vote. That is also
       what lets the feed end level with the chart instead of dragging the
       console taller than it needs to be. */
    <div className="relative flex-1" style={{ minHeight: FEED_MIN_ROWS * ROW_H }}>
      {/* The clip is its own element, separate from the list that moves
          inside it. Putting overflow on the same box that gets the transform
          drags the window along with the contents, so the feed would slide
          out of its own frame instead of the rows sliding through it. */}
      <div className="absolute inset-0 overflow-hidden">
        <ul ref={listRef}>
          {rows.map((r, i) => {
            const Tool = TOOL_BY_ID[r.tool];
            return (
              <li
                key={r.key}
                /* feed-new runs once, on mount, for whichever row is newest: a
                   CSS keyframe rather than an animated style, so React never has
                   to re-render anything to take the highlight back off. */
                className={`box-border flex items-center gap-2.5 border-b border-[var(--border)] px-4${
                  i === 0 ? " feed-new" : ""
                }`}
                style={{ height: ROW_H }}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-[var(--panel)]">
                  <Tool.Logo className="h-3.5 w-3.5" style={{ color: TOOL_COLOR[r.tool] }} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-1.5">
                    <span className="truncate text-[12px] leading-[16px] font-medium text-[var(--ink)]">
                      {r.repo}
                    </span>
                    <span className="num hidden truncate text-[10px] leading-[16px] text-[var(--text-3)] sm:inline">
                      {r.dev}
                    </span>
                  </span>
                  <span className="num block truncate text-[10px] leading-[14px] text-[var(--text-3)]">
                    {r.model} · {r.tokens} tok
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end">
                  <span className="num text-[12px] leading-[16px] font-medium text-[var(--ink)]">
                    {usd(r.cost, 2)}
                  </span>
                  <span
                    className="num text-[9.5px] leading-[14px]"
                    style={{ color: r.shipped ? "var(--green-700)" : "var(--text-3)" }}
                  >
                    {i === 0 ? AGO[0] : r.shipped ? "shipped" : "no commit"}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ── frame ──────────────────────────────────────────────────────────────── */

const NAV = [LayoutGrid, Activity, Sparkles, Wallet, Scale, Bell, Users];

export default function HeroConsole() {
  const [ref, live] = useLive<HTMLDivElement>();
  const [spend, setSpend] = useState(SPEND_30D);
  const onSession = useMemo(() => (cost: number) => setSpend((s) => s + cost), []);

  return (
    <div ref={ref} className="relative">
      {/* Two annotations that sit just off the frame on wide screens. They are
          the two outcomes the product exists for, pinned to where they would
          surface: a spike, and a saving that has been confirmed. */}
      <div
        className="rise absolute -left-12 -bottom-12 z-10 hidden w-[236px] rounded-xl border border-[var(--border)] bg-white/95 p-3 shadow-[var(--shadow-float)] backdrop-blur xl:block"
        style={{ "--d": "1.9s" } as React.CSSProperties}
        aria-hidden
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--coral-500)]" />
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--coral-700)]">
            Anomaly
          </span>
          <span className="num ml-auto text-[10px] text-[var(--text-3)]">09:42</span>
        </div>
        <p className="mt-1.5 text-[12px] leading-snug text-[var(--ink)]">
          <span className="num font-medium">$190</span> session in billing, 12× the median
        </p>
        <p className="num mt-1 text-[10px] text-[var(--text-3)]">posted to #eng-spend</p>
      </div>

      <div
        className="rise absolute -right-10 -top-6 z-10 hidden w-[228px] rounded-xl border border-[var(--border)] bg-white/95 p-3 shadow-[var(--shadow-float)] backdrop-blur xl:block"
        style={{ "--d": "2.2s" } as React.CSSProperties}
        aria-hidden
      >
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-[var(--green-500)]" aria-hidden>
            <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.14" />
            <path d="M4.8 8.2l2.1 2.1 4.3-4.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--green-700)]">
            Saving verified
          </span>
        </div>
        <p className="mt-1.5 text-[12px] leading-snug text-[var(--ink)]">
          Context split in api-service
        </p>
        <p className="num mt-1 text-[10px] text-[var(--text-3)]">
          3,592× → 212× · <span className="text-[var(--green-700)]">+$191.87/mo</span>
        </p>
      </div>

      <div className="rise console-shadow overflow-hidden rounded-[1.1rem] border border-[var(--border)] bg-white" style={{ "--d": "0.35s" } as React.CSSProperties}>
        {/* chrome */}
        <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--panel)] px-3.5 py-2.5 sm:px-4">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e5e7ee]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e5e7ee]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e5e7ee]" />
          <div className="num mx-auto flex h-6 w-full max-w-xs items-center justify-center gap-1.5 rounded-md border border-[var(--border)] bg-white text-[10.5px] text-[var(--text-3)]">
            <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden>
              <rect x="2.5" y="5.5" width="7" height="5" rx="1" fill="none" stroke="currentColor" />
              <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" fill="none" stroke="currentColor" />
            </svg>
            console.planckspace.dev/overview
          </div>
          <span className="w-[42px]" />
        </div>

        <div className="flex">
          {/* rail */}
          <aside className="hidden w-[52px] shrink-0 flex-col items-center gap-1 border-r border-[var(--border)] bg-[var(--panel)] py-3 md:flex" aria-hidden>
            <PlanckMark className="mb-3 h-[18px] w-auto" />
            {NAV.map((Icon, i) => (
              <span
                key={i}
                className={`grid h-8 w-8 place-items-center rounded-lg ${i === 0 ? "bg-white text-[var(--ink)] shadow-[var(--shadow-soft)]" : "text-[var(--text-3)]"}`}
              >
                <Icon className="h-[15px] w-[15px]" strokeWidth={1.75} />
              </span>
            ))}
          </aside>

          <div className="min-w-0 flex-1">
            {/* page header */}
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="truncate text-[14px] font-semibold tracking-[-0.02em] text-[var(--ink)]">Overview</span>
                <span className="hidden items-center gap-1.5 rounded-full border border-[var(--border)] px-2 py-0.5 sm:inline-flex">
                  <span className="beacon" />
                  <span className="num text-[10px] text-[var(--text-2)]">live</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-1 rounded-md border border-[var(--border)] px-2 py-1 text-[11px] text-[var(--text-2)] sm:inline-flex">
                  meridian-eng <ChevronDown className="h-3 w-3" />
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-2 py-1 text-[11px] text-[var(--text-2)]">
                  Last 30 days <ChevronDown className="h-3 w-3" />
                </span>
              </div>
            </div>

            <Kpis spend={spend} />

            <div className="grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              {/* spend by tool */}
              <div className="border-b border-[var(--border)] p-4 sm:p-5 lg:border-b-0 lg:border-r">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <div>
                    <Cap>Spend by tool</Cap>
                    <p className="mt-1 text-[12px] text-[var(--text-2)]">Every session, attributed</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {["Tool", "Team", "Repo", "Model"].map((t, i) => (
                      <span
                        key={t}
                        className={
                          i === 0
                            ? "rounded-md bg-[var(--ink)] px-2 py-1 text-[10.5px] font-medium text-white"
                            : "rounded-md px-2 py-1 text-[10.5px] text-[var(--text-3)]"
                        }
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* legend doubles as the share breakdown */}
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
                  {TOOLS.map((t) => (
                    <div key={t.id} className="flex items-center gap-2">
                      <t.Logo className="h-3.5 w-3.5 shrink-0" style={{ color: TOOL_COLOR[t.id] }} />
                      <span className="truncate text-[11px] text-[var(--text-2)]">{t.name}</span>
                      <span className="num ml-auto text-[11px] font-medium text-[var(--ink)] sm:ml-0">
                        {Math.round(SHARE[t.id] * 100)}%
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <SpendChart />
                </div>
              </div>

              {/* live sessions */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-4 pb-2 pt-4 sm:px-5">
                  <Cap>Sessions, as they close</Cap>
                  <span className="num text-[10px] text-[var(--text-3)]">metadata only</span>
                </div>
                <Feed live={live} onSession={onSession} />
                {/* No border-t: the feed rows carry their own bottom rule, so
                    one here would double the hairline at the clip edge. */}
                <div className="mt-auto bg-[var(--panel)] px-4 py-3 sm:px-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--brand-700)]">
                        Top fix
                      </span>
                      <span className="block truncate text-[12px] text-[var(--ink)]">
                        CLAUDE.md re-read 212× per session
                      </span>
                    </span>
                    <span className="num shrink-0 rounded-md bg-[var(--ink)] px-2.5 py-1.5 text-[10.5px] font-medium text-white">
                      Fix · $204/mo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
