"use client";

import { useRef, useState } from "react";
import Button from "@/components/site/Button";
import { FINDINGS, removableTotal, usd, type Finding } from "@/lib/sample";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────
   What the detectors find, one per panel, panned sideways while the section
   holds still. Each panel carries its own figure, drawn from the same
   findings list the console's Removable tile sums, so the last panel's
   total is the dashboard's number.
   ───────────────────────────────────────────────────────────────────────── */

const TYPE_LABEL: Record<Finding["type"], string> = { seat: "Seat", plan: "Plan fit", metered: "Metered" };
const FIX: Record<string, string> = {
  model: "Fix: one click in VS Code, a model-routing rule",
  context: "Fix: one click, CLAUDE.md split into an on-demand index",
  cache: "Fix: guided, handed to your own Claude Code with the numbers",
  maxpro: "Fix: guided, move two seats to Pro",
  dormant: "Fix: guided, reclaim four seats",
};

/* ── figures ───────────────────────────────────────────────────────────── */

function ModelFig({ on }: { on: boolean }) {
  const rows = [
    { label: "today", opus: 0.64 },
    { label: "with a routing rule", opus: 0.11 },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-6">
      {rows.map((r, i) => (
        <div key={r.label}>
          <div className="mb-2 flex justify-between t-mono text-[11px] text-fg-3">
            <span>{r.label}</span>
            <span>
              <span className="text-[#b9a6ff]">Opus {Math.round(r.opus * 100)}%</span> · Sonnet {Math.round((1 - r.opus) * 100)}%
            </span>
          </div>
          <div className="flex h-7 w-full gap-[3px]">
            <div
              className="h-full bg-[#9b82ff] transition-[width] duration-[1.4s] ease-[var(--ease-out-expo)]"
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
            <div className="bg-fg/70 transition-[height] duration-700" style={{ height: on ? `${fresh}%` : "0%", transitionDelay: `${0.3 + i * 0.05}s` }} />
            <div
              className="bg-sig-coral transition-[height] duration-[1.1s] ease-[var(--ease-out-expo)]"
              style={{ height: on ? "62%" : "0%", transitionDelay: `${i * 0.05}s` }}
            />
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
          <circle cx="90" cy="90" r={r} fill="none" stroke="rgb(247 245 240 / 0.1)" strokeWidth="14" strokeDasharray={`${len} 999`} />
          <circle
            cx="90"
            cy="90"
            r={r}
            fill="none"
            stroke="var(--color-lime)"
            strokeWidth="14"
            strokeDasharray={`${len} 999`}
            strokeDashoffset={on ? len * (1 - 0.41) : len}
            style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1)" }}
          />
          <line
            x1="90"
            y1={90 - r - 12}
            x2="90"
            y2={90 - r + 12}
            stroke="var(--color-fg)"
            strokeWidth="2"
            transform={`rotate(${270 * 0.9} 90 90)`}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <p className="t-meter text-[2.6rem] text-lime">41%</p>
        </div>
      </div>
      <p className="t-mono -mt-2 text-[11px] text-fg-3">prompt tokens from cache · 90% is typical</p>
    </div>
  );
}

function MaxProFig({ on }: { on: boolean }) {
  return (
    <div className="flex h-full flex-col justify-center gap-7">
      {[0.62, 0.48].map((u, i) => (
        <div key={i}>
          <p className="t-mono mb-2 text-[11px] text-fg-3">Max seat {i + 1} · 30-day peak usage</p>
          <div className="relative h-7 bg-fg/[0.06]">
            <div
              className="h-full bg-lime transition-[width] duration-[1.4s] ease-[var(--ease-out-expo)]"
              style={{ width: on ? `${u * 20}%` : "0%", transitionDelay: `${i * 0.2}s` }}
            />
            <span className="absolute inset-y-[-6px] left-[20%] w-px bg-fg" />
            <span className="absolute inset-y-[-6px] right-0 w-px bg-fg/40" />
          </div>
          <div className="t-mono mt-1.5 flex justify-between text-[10.5px] text-fg-3">
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
          className={cn(
            "aspect-square transition-all duration-700",
            dormant.has(i) ? "border border-dashed border-sig-coral" : "bg-fg/25",
            on && dormant.has(i) && "bg-sig-coral/25",
          )}
          style={{ opacity: on ? 1 : 0.2, transitionDelay: `${i * 0.018}s` }}
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
    <article className="fg-card frame h-full [--ch:22px] [--fill:var(--color-ink-2)]">
      <div className="frame-in flex h-full flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between gap-2">
          <span className="tag">{TYPE_LABEL[f.type]}</span>
          <span className="tag tag-lime">Off the bill</span>
        </div>
        <p className="mt-6 flex items-baseline gap-2">
          <span className="t-meter text-[2.6rem] text-lime">{usd(f.usd)}</span>
          <span className="t-mono text-sm text-fg-3">/mo</span>
        </p>
        <div className="mt-5 min-h-[200px] flex-1">
          <Fig on={on} />
        </div>
        <h3 className="t-h4 pt-6">{f.title}</h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-fg-2">{f.plain}.</p>
        <p className="t-mono mt-4 border-t border-[var(--line)] pt-4 text-[11.5px] text-fg-3">{FIX[f.id]}</p>
      </div>
    </article>
  );
}

export default function FindingsGallery() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Set<string>>(new Set());

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const activate = (id: string) => setActive((s) => (s.has(id) ? s : new Set(s).add(id)));

      mm.add(`${MOTION_OK} and (min-width: 64rem)`, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const pan = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".fg-pin",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>(".fg-card", el).forEach((card, i) => {
          ScrollTrigger.create({
            trigger: card,
            containerAnimation: pan,
            start: "left 82%",
            onEnter: () => activate(FINDINGS[i]?.id ?? "sum"),
          });
        });
        gsap.to(".fg-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: ".fg-pin", start: "top top", end: () => `+=${distance()}`, scrub: true },
        });
      });

      // small screens and reduced motion: a native swipe row; everything is drawn
      mm.add(`(max-width: 63.99rem), (prefers-reduced-motion: reduce)`, () => {
        setActive(new Set(FINDINGS.map((f) => f.id)));
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="engine" aria-labelledby="engine-title" className="relative bg-ink">
      {/* phones: the header sits above a native swipe row */}
      <div className="wrap pt-24 lg:hidden">
        <p className="t-kicker">The detection engine</p>
        <h2 className="t-display t-h2 mt-5">It finds the waste. Then it prices it.</h2>
        <p className="t-lead mt-6 max-w-[28rem]">
          Detectors read your session metadata and your seat plans, and every finding arrives with a dollar figure, an
          owner and the fix attached.
        </p>
      </div>
      <div className="fg-pin lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:overflow-hidden">
        <div
          ref={track}
          className="fg-track flex gap-4 overflow-x-auto px-[max(var(--gutter),1rem)] pb-24 pt-10 [scrollbar-width:none] max-lg:snap-x max-lg:snap-mandatory max-lg:scroll-px-[max(var(--gutter),1rem)] lg:gap-6 motion-safe:lg:overflow-visible lg:py-0"
          data-lenis-prevent-horizontal=""
        >
          <div className="hidden w-[34vw] max-w-[34rem] shrink-0 flex-col justify-center pr-6 lg:flex">
            <p className="t-kicker">The detection engine</p>
            <h2 id="engine-title" className="t-display t-h2 mt-5">
              It finds the waste. Then it prices it.
            </h2>
            <p className="t-lead mt-6 max-w-[28rem]">
              Detectors read your session metadata and your seat plans, and every finding arrives with a dollar
              figure, an owner and the fix attached.
            </p>
          </div>

          {FINDINGS.map((f) => (
            <div key={f.id} className="w-[82vw] shrink-0 max-lg:snap-start sm:w-[25rem] lg:h-[min(40rem,78svh)] lg:w-[27rem]">
              <FindingCard f={f} on={active.has(f.id)} />
            </div>
          ))}

          <div className="w-[82vw] shrink-0 max-lg:snap-start sm:w-[25rem] lg:h-[min(40rem,78svh)] lg:w-[27rem]">
            <div className="fg-card frame h-full [--ch:22px] [--edge:var(--color-lime)] [--fill:var(--color-lime)]">
              <div className="frame-in flex h-full flex-col p-7 text-on-lime">
                <p className="t-mono text-[12px]">Removable this month</p>
                <p className="t-meter mt-4 text-[3.4rem] leading-none">{usd(removableTotal)}</p>
                <p className="t-mono mt-1 text-sm">/mo, all real dollars</p>
                <p className="mt-auto text-[1.05rem] leading-relaxed text-on-lime-2">
                  Five findings, ranked by what they take off the invoice. Seat time freed on flat plans is reported
                  beside it as imputed and never added in.
                </p>
                <div className="mt-6">
                  <Button href="#fix" variant="ink">
                    See a fix land
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[4vw] shrink-0" aria-hidden="true" />
        </div>

        <div className="wrap mt-10 hidden lg:block" aria-hidden="true">
          <div className="h-px w-full bg-[var(--line)]">
            <div className="fg-progress h-px origin-left bg-lime" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
