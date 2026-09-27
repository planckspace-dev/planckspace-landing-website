"use client";

import { Fragment, useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/* ─────────────────────────────────────────────────────────────────────────
   The problem, as a poster. The page's single colour block: the whole panel
   is signal lime, cut with the mark's chamfers at two corners. On desktop it
   holds still while the sentence brightens word by word under the scroll, so
   the reader takes it in at the pace they scroll. Small ink glyphs sit inside
   the sentence as figures: the waste, drawn.
   ───────────────────────────────────────────────────────────────────────── */

function SeatGlyph() {
  return (
    <svg viewBox="0 0 64 28" className="poster-glyph" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <rect
          key={i}
          x={4 + i * 10}
          y={8}
          width="7"
          height="12"
          fill={i < 4 ? "#C6FF3D" : "none"}
          stroke="#C6FF3D"
          strokeWidth={i < 4 ? 0 : 1.4}
          strokeDasharray={i < 4 ? undefined : "2 2"}
        />
      ))}
    </svg>
  );
}

function ModelGlyph() {
  return (
    <svg viewBox="0 0 64 28" className="poster-glyph" aria-hidden="true">
      {[18, 22, 16, 20, 24, 19].map((h, i) => (
        <rect key={i} x={5 + i * 9.5} y={24 - h} width="6" height={h} fill={i === 1 || i === 4 ? "#C6FF3D" : "rgb(198 255 61 / 0.35)"} />
      ))}
    </svg>
  );
}

function StackGlyph() {
  return (
    <svg viewBox="0 0 64 28" className="poster-glyph" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <rect x={5 + i * 9.5} y={9} width="6" height={15} fill="#C6FF3D" />
          <rect x={5 + i * 9.5} y={4} width="6" height={3.5} fill="rgb(198 255 61 / 0.4)" />
        </g>
      ))}
    </svg>
  );
}

type Part = string | { glyph: ReactNode };

const STATEMENT: Part[] = [
  "Seats",
  { glyph: <SeatGlyph /> },
  "nobody opens. Opus",
  { glyph: <ModelGlyph /> },
  "doing Sonnet's job. An 11k-token CLAUDE.md",
  { glyph: <StackGlyph /> },
  "re-read on every single turn.",
];

export default function Poster() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const words = gsap.utils.toArray<HTMLElement>(".pw");

      mm.add(`${MOTION_OK} and (min-width: 64rem)`, () => {
        gsap.set(words, { opacity: 0.14 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".poster-pin", start: "top top", end: "+=140%", pin: true, scrub: 0.5 },
        });
        tl.to(words, { opacity: 1, stagger: 0.12, ease: "none", duration: 0.4 })
          .from(".poster-after > *", { y: 40, autoAlpha: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" }, ">-0.1");
      });

      mm.add(`${MOTION_OK} and (max-width: 63.99rem)`, () => {
        gsap.from(words, {
          opacity: 0.14,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: { trigger: ".poster-text", start: "top 80%", end: "bottom 45%", scrub: true },
        });
      });

      mm.add(MOTION_OK, () => {
        // the chamfers start deep and close to the mark's proportion as the panel arrives
        gsap.from(".poster-panel", {
          "--c": 24,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 30%", scrub: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  let k = 0;
  return (
    <section ref={root} id="approach" aria-labelledby="poster-title" className="relative">
      <div className="poster-pin">
        <div className="poster-panel bg-lime text-on-lime">
          <div className="wrap flex min-h-[100svh] flex-col justify-center py-24 sm:py-28">
            <h2 id="poster-title" className="sr-only">
              Where AI coding spend leaks
            </h2>
            <p className="poster-text t-display text-[clamp(2.1rem,5.6vw,5.9rem)] leading-[1.02] [--wdth:104]">
              {STATEMENT.map((part, i) =>
                typeof part === "string" ? (
                  <Fragment key={i}>
                    {part.split(" ").map((w) => (
                      <Fragment key={k++}>
                        <span className="pw">{w}</span>{" "}
                      </Fragment>
                    ))}
                  </Fragment>
                ) : (
                  <Fragment key={i}>
                    <span className="pw poster-chip">{part.glyph}</span>{" "}
                  </Fragment>
                ),
              )}
            </p>
            <div className="poster-after mt-12 grid gap-8 border-t border-on-lime/25 pt-8 sm:mt-16 md:grid-cols-[1.2fr_1fr] md:items-end">
              <p className="t-display text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.05] [--wdth:100]">
                None of it shows up until the invoice does.
              </p>
              <p className="max-w-[30rem] text-[1.0625rem] leading-relaxed text-on-lime-2 md:justify-self-end">
                PlanckSpace finds it in your session metadata, prices it in real dollars, names the repo and the team,
                and hands you the fix.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
