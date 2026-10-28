"use client";

import { usd, type Finding } from "@/lib/sample";
import { cn } from "@/lib/utils";

/* A finding as the tour film draws it, in the dark "Signal" system the film
   was rendered in (film.css, scoped to the studio). The site's own findings
   live in sections/Findings.tsx. */

const TYPE_LABEL: Record<Finding["type"], string> = { seat: "Seat", plan: "Plan fit", metered: "Metered", setup: "Agent setup" };
const FIX: Record<string, string> = {
  model: "Fix: one click in VS Code, Sonnet as the repo default",
  context: "Fix: one click, CLAUDE.md split into an on-demand index",
  cache: "Fix: guided, handed to your own Claude Code with the numbers",
  maxpro: "Fix: guided, move two seats to Pro",
  dormant: "Fix: guided, reclaim four seats",
};

const FG = "rgb(247 245 240";

function ModelFig({ on }: { on: boolean }) {
  const rows = [
    { label: "today", opus: 0.64 },
    { label: "with Sonnet as the default", opus: 0.11 },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-6">
      {rows.map((r, i) => (
        <div key={r.label}>
          <div className="t-mono mb-2 flex justify-between text-[11px] text-[var(--fg-3)]">
            <span>{r.label}</span>
            <span>
              <span className="text-[#b9a6ff]">Opus {Math.round(r.opus * 100)}%</span> · Sonnet {Math.round((1 - r.opus) * 100)}%
            </span>
          </div>
          <div className="flex h-7 w-full gap-[3px]">
            <div
              className="h-full bg-[#9b82ff] transition-[width] duration-[1.4s]"
              style={{ width: on ? `${r.opus * 100}%` : "50%", transitionDelay: `${i * 0.25}s` }}
            />
            <div className="h-full flex-1 bg-[#6e9bff]/70" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ContextFig({ on }: { on: boolean }) {
  const turns = 12;
  return (
    <div className="flex h-full items-end gap-[6px]">
      {Array.from({ length: turns }, (_, i) => {
        const fresh = 8 + ((i * 37) % 17);
        return (
          <div key={i} className="flex flex-1 flex-col justify-end gap-[3px]" style={{ height: "100%" }}>
            <div className="transition-[height] duration-700" style={{ background: `${FG} / 0.7)`, height: on ? `${fresh}%` : "0%", transitionDelay: `${0.3 + i * 0.05}s` }} />
            <div className="bg-[#ff8a5c] transition-[height] duration-[1.1s]" style={{ height: on ? "62%" : "0%", transitionDelay: `${i * 0.05}s` }} />
          </div>
        );
      })}
    </div>
  );
}

function CacheFig({ on }: { on: boolean }) {
  const r = 70;
  const len = 2 * Math.PI * r * 0.75;
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="relative">
        <svg viewBox="0 0 180 180" className="h-[190px] w-[190px] rotate-[135deg]">
          <circle cx="90" cy="90" r={r} fill="none" stroke={`${FG} / 0.1)`} strokeWidth="14" strokeDasharray={`${len} 999`} />
          <circle
            cx="90"
            cy="90"
            r={r}
            fill="none"
            stroke="#c6ff3d"
            strokeWidth="14"
            strokeDasharray={`${len} 999`}
            strokeDashoffset={on ? len * (1 - 0.41) : len}
            style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1)" }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <p className="t-meter text-[2.6rem] text-[var(--lime)]">41%</p>
        </div>
      </div>
      <p className="t-mono -mt-2 text-[11px] text-[var(--fg-3)]">prompt tokens from cache · 90% is typical</p>
    </div>
  );
}

function MaxProFig({ on }: { on: boolean }) {
  return (
    <div className="flex h-full flex-col justify-center gap-7">
      {[0.62, 0.48].map((u, i) => (
        <div key={i}>
          <p className="t-mono mb-2 text-[11px] text-[var(--fg-3)]">Max seat {i + 1} · 30-day peak usage</p>
          <div className="relative h-7" style={{ background: `${FG} / 0.06)` }}>
            <div className="h-full bg-[#c6ff3d] transition-[width] duration-[1.4s]" style={{ width: on ? `${u * 20}%` : "0%", transitionDelay: `${i * 0.2}s` }} />
            <span className="absolute inset-y-[-6px] left-[20%] w-px bg-[#f7f5f0]" />
            <span className="absolute inset-y-[-6px] right-0 w-px" style={{ background: `${FG} / 0.4)` }} />
          </div>
          <div className="t-mono mt-1.5 flex justify-between text-[10.5px] text-[var(--fg-3)]">
            <span className="pl-[17%]">Pro ceiling</span>
            <span>Max ceiling</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function DormantFig({ on }: { on: boolean }) {
  const cells = 34;
  const dormant = new Set([5, 13, 22, 30]);
  return (
    <div className="grid h-full grid-cols-9 content-center gap-2">
      {Array.from({ length: cells }, (_, i) => (
        <span
          key={i}
          className={cn("aspect-square transition-all duration-700", dormant.has(i) && "border border-dashed border-[#ff8a5c]")}
          style={{
            background: dormant.has(i) ? (on ? "rgb(255 138 92 / 0.25)" : undefined) : `${FG} / 0.25)`,
            opacity: on ? 1 : 0.2,
            transitionDelay: `${i * 0.018}s`,
          }}
        />
      ))}
    </div>
  );
}

const FIGS: Record<string, (p: { on: boolean }) => React.JSX.Element> = {
  model: ModelFig,
  context: ContextFig,
  cache: CacheFig,
  maxpro: MaxProFig,
  dormant: DormantFig,
};

export function FindingCard({ f, on }: { f: Finding; on: boolean }) {
  const Fig = FIGS[f.id];
  return (
    <article className="fg-card frame h-full [--ch:22px] [--fill:var(--ink-2)]">
      <div className="frame-in flex h-full flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between gap-2">
          <span className="tag">{TYPE_LABEL[f.type]}</span>
          <span className="tag tag-lime">Off the bill</span>
        </div>
        <p className="mt-6 flex items-baseline gap-2">
          <span className="t-meter text-[2.6rem] text-[var(--lime)]">{usd(f.usd)}</span>
          <span className="t-mono text-sm text-[var(--fg-3)]">/mo</span>
        </p>
        <div className="mt-5 min-h-[200px] flex-1">
          <Fig on={on} />
        </div>
        <h3 className="t-h4 pt-6">{f.title}</h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--fg-2)]">{f.plain}.</p>
        <p className="t-mono mt-4 border-t border-[var(--line)] pt-4 text-[11.5px] text-[var(--fg-3)]">{FIX[f.id]}</p>
      </div>
    </article>
  );
}
