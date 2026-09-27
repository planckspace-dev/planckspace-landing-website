"use client";

/* One place that registers GSAP's plugins, so no component has to remember
   to. Every animated component imports from here, never from "gsap"
   directly, which also keeps plugin registration out of server bundles. */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP);

gsap.defaults({ ease: "expo.out", duration: 1 });

/** The one media query every choreography is gated on. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, DrawSVGPlugin, useGSAP };
