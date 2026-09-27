"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/* Smooth scroll, driven off GSAP's ticker so ScrollTrigger and Lenis read the
   same frame. Lenis already honours prefers-reduced-motion (it drops to 1:1
   native scrolling), and anchors:true makes in-page links glide instead of
   jumping. The instance is exposed on window for the few places that need to
   scroll programmatically (the nav, the menu). */

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.105,
      smoothWheel: true,
      anchors: { offset: -80 },
      stopInertiaOnNavigate: true,
      autoRaf: false,
    });
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    /* Product surfaces measure and scale themselves after mount, and fonts
       swap in late; both move everything below them. Trigger positions are
       computed once, so re-measure whenever the document's height settles
       on a new value. Pin spacers make the height stable after one pass. */
    let last = document.body.scrollHeight;
    let timer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const h = document.body.scrollHeight;
        if (Math.abs(h - last) < 2) return;
        last = h;
        ScrollTrigger.refresh();
        last = document.body.scrollHeight;
      }, 180);
    });
    ro.observe(document.body);

    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
