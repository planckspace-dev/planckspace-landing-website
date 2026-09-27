"use client";

import { useRef } from "react";
import Button from "@/components/site/Button";
import TokenStream from "@/components/hero/TokenStream";
import { PlanckMark } from "@/components/ui/logo";
import { DEMO_PATH } from "@/lib/plans";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/* The bookend. Tokens sweep in from the top-left through the mark, are
   counted, and spread into a ledger that runs the full width of the screen.
   Same scene and shader as the hero, read once more on the way out. */

export default function FinalCTA() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".cta-copy > *", {
          y: 40,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 1.2,
          scrollTrigger: { trigger: root.current, start: "top 55%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="cta-title" className="relative isolate flex min-h-[max(100svh,46rem)] flex-col overflow-hidden border-t border-[var(--line)] bg-ink">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <TokenStream className="absolute inset-0 h-full w-full" cols={52} wobble={0.15} />
        <div className="absolute inset-0 bg-[radial-gradient(46%_30%_at_50%_52%,rgb(11_11_12/0.7),transparent_80%)]" />
        <div data-stream-ap className="cta-mark absolute left-1/2 top-[13%] z-10 aspect-[320/300] w-[clamp(64px,7vw,108px)] -translate-x-1/2">
          <PlanckMark className="h-full w-full" />
        </div>
        <div data-stream-ledger className="absolute inset-x-0 bottom-[4%] h-[18%]" />
      </div>

      <div data-stream-calm className="cta-copy wrap relative my-auto flex flex-col items-center pb-[18vh] pt-[28vh] text-center">
        <h2 id="cta-title" className="t-display text-[clamp(2.4rem,7vw,6.6rem)] leading-[0.95] [--wdth:108]">
          See what your AI bill is made of.
        </h2>
        <p className="t-lead mt-7 max-w-[34rem]">
          Thirty minutes with a founder, on your own tools and your own numbers. If you don&apos;t need us yet, we&apos;ll say so.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href={DEMO_PATH}>Book a demo</Button>
          <Button href="/contact" variant="ghost">
            Talk to us
          </Button>
        </div>
      </div>
    </section>
  );
}
