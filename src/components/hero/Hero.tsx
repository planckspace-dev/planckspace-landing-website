"use client";

import { useRef } from "react";
import Button from "@/components/site/Button";
import TourButton from "@/components/site/TourVideo";
import TokenStream from "@/components/hero/TokenStream";
import { DEMO_PATH } from "@/lib/plans";
import { billedTotal } from "@/lib/sample";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/* ─────────────────────────────────────────────────────────────────────────
   The hero is a poster. The headline sits low and left, where the eye lands
   after following the stream: tool-coloured tokens pour in from the top-left,
   slip into the mark's counter, drop out of its channel counted (lime), and
   stack up as a month of spend in the ledger. That is the product, drawn.

   Everything here is readable without script. The canvas, the count-up and
   the width-axis reveal only ever enhance text that is already on the page.
   ───────────────────────────────────────────────────────────────────────── */

const LINES = ["Every token,", "accounted for."];

const LEGEND = [
  { label: "Claude Code", color: "var(--color-tool-claude)" },
  { label: "Cursor", color: "#5c8dff" },
  { label: "Windsurf", color: "#1fc7a6" },
  { label: "API", color: "var(--color-fg-2)" },
];

/* Letters are plain inline spans at rest, so the face keeps its kerning. The
   reveal switches them to inline-block (transforms need a box) and hands
   them back when it finishes. */
function KineticLine({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span className="kin-line">
      <span className="kin-in">
        {words.map((w, wi) => (
          <span key={wi}>
            <span className="kin-word">
              {Array.from(w).map((ch, ci) => (
                <span key={ci} className="kin-ch">
                  {ch}
                </span>
              ))}
            </span>
            {wi < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const total = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const h1 = root.current!.querySelector("h1")!;
        const finalW = parseFloat(getComputedStyle(h1).getPropertyValue("--wdth")) || 112;
        const chars = gsap.utils.toArray<HTMLElement>(".kin-ch", h1);
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        h1.classList.add("kin-anim");

        tl.from(".hero-kicker", { y: 16, autoAlpha: 0, duration: 1 }, 0.1)
          .fromTo(
            chars,
            { "--wdth": 48, yPercent: 105 },
            {
              "--wdth": finalW,
              yPercent: 0,
              duration: 1.35,
              stagger: 0.022,
              clearProps: "--wdth,transform",
              onComplete: () => h1.classList.remove("kin-anim"),
            },
            0.15,
          )
          .from(".hero-lead", { y: 22, autoAlpha: 0, duration: 1.1 }, 0.62)
          .from(".hero-ctas > *", { y: 22, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.72)
          .from(".hero-meta", { y: 12, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.9);

        // the total counts up in step with the ledger growing in (same curve as the shader's bars)
        const counter = { v: 0 };
        tl.to(
          counter,
          {
            v: billedTotal,
            duration: 2.6,
            ease: "power4.out",
            onUpdate: () => {
              if (total.current) total.current.textContent = "$" + Math.round(counter.v).toLocaleString("en-US");
            },
          },
          0.35,
        );

        // leaving the hero: copy drifts up and away, the scene dims behind it
        gsap.to(".hero-copy", {
          yPercent: -18,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero-scene", {
          autoAlpha: 0.25,
          scale: 1.06,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });

        return () => h1.classList.remove("kin-anim");
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-scene" aria-hidden="true">
        <TokenStream className="absolute inset-0 h-full w-full" direct />
        <div className="hero-vignette" />
        <div data-stream-ledger className="hero-ledger">
          <div className="hero-meta hero-total">
            <span ref={total} className="t-meter lime">
              ${billedTotal.toLocaleString("en-US")}
            </span>
            <span className="t-mono text-[11px] tracking-[0.04em] text-fg-3">AI spend billed this month · sample workspace</span>
          </div>
          <ul className="hero-meta hero-legend">
            {LEGEND.map((l) => (
              <li key={l.label}>
                <span style={{ background: l.color }} />
                {l.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="wrap hero-copy" data-stream-calm>
        <p className="t-kicker hero-kicker">The management layer for AI coding</p>
        <h1 id="hero-title" className="t-display t-hero mt-5" aria-label={LINES.join(" ")}>
          {LINES.map((line, i) => (
            <span key={line}>
              <KineticLine text={line} />
              {i < LINES.length - 1 ? " " : null}
            </span>
          ))}
        </h1>
        <p className="t-lead hero-lead mt-6 max-w-[34rem] sm:mt-7">
          PlanckSpace meters what your team spends on Claude Code, Cursor and the API, finds the waste, and proves
          every saving.
        </p>
        <div className="hero-ctas mt-8 flex flex-wrap gap-3 sm:mt-10">
          <Button href={DEMO_PATH}>Book a demo</Button>
          <TourButton />
        </div>
      </div>
    </section>
  );
}
