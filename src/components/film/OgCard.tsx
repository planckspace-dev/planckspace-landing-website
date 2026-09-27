"use client";

import { useEffect } from "react";
import TokenStream from "@/components/hero/TokenStream";
import { PlanckMark, Logo } from "@/components/ui/logo";
import { setFilmTime } from "@/lib/film-clock";

/* The social card, 1200 x 630: the hero's machine at rest, the promise, the
   address. Captured once by the studio script into public/og.png. */

export default function OgCard() {
  useEffect(() => {
    window.__film = { duration: 0, fps: 0, seek: (t: number) => setFilmTime(t), ready: true };
    setFilmTime(9);
    return () => {
      delete window.__film;
    };
  }, []);

  return (
    <section className="relative h-[630px] w-[1200px] overflow-hidden bg-ink">
      <TokenStream className="absolute inset-0 h-full w-full" cols={26} />
      <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_0%_100%,rgb(11_11_12/0.95),rgb(11_11_12/0.4)_45%,transparent_70%)]" />
      <div data-stream-ap className="absolute left-[640px] top-[92px] aspect-[320/300] w-[92px]">
        <PlanckMark className="h-full w-full" />
      </div>
      <div data-stream-ledger className="absolute left-[800px] right-[56px] top-[300px] h-[150px]" />
      <div className="absolute left-[64px] top-[56px]">
        <Logo height={30} />
      </div>
      <div data-stream-calm className="absolute bottom-[58px] left-[64px]">
        <p className="t-display text-[86px] leading-[0.92] [--wdth:112]">
          Every token,
          <br />
          accounted for.
        </p>
        <p className="t-mono mt-6 text-[22px] text-lime">planckspace.dev</p>
      </div>
    </section>
  );
}
