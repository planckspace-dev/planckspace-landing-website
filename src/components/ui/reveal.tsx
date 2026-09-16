"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * The one scroll-entry treatment on the site. It does two jobs, and fusing
 * them into a single element is the whole point:
 *
 *   1. it lifts and fades the block in, and
 *   2. it sets data-in="true", which is the trigger every `.iv-*` mark in
 *      globals.css keys off.
 *
 * These used to be two components with two observers on two different
 * thresholds (Reveal at -64px, InView at -12%). A card was therefore still
 * travelling upward while the chart inside it had already begun drawing, and
 * the two clocks drifting against each other is what made a big slab look
 * like it arrived broken. One observer means the card lands and its contents
 * assemble on one clock.
 *
 * The transition is plain CSS rather than a spring on the main thread, so it
 * composites alongside the scroll instead of competing with it. will-change is
 * declared up front so the layer exists before the first frame rather than
 * being promoted mid-flight, and is dropped again on arrival: a box left on a
 * composited layer keeps its text on grayscale antialiasing, which is exactly
 * the half-sharp look a revealed card is never supposed to settle into.
 *
 * The delay is carried on --rv-d, NOT --d. --d is the inner marks' stagger
 * variable and it inherits; putting the wrapper's own delay there would shift
 * every chart inside it by the same amount.
 *
 * The lift reads data-shown and the marks read data-in, and they are two
 * attributes rather than one because `marks` can switch the second off. Mark
 * rules are written as [data-in="true"] .iv-x, which matches on ANY ancestor
 * and therefore always beats the lower-specificity resting rule — so a Reveal
 * wrapped around something that drives its own marks (the detector rail, whose
 * panels re-play on every tab change) would pin those marks permanently
 * finished. marks={false} keeps the lift and stays out of the way.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  lift = true,
  marks = true,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** false triggers the contents without moving the block itself. */
  lift?: boolean;
  /** false stops this Reveal from driving the .iv-* marks beneath it. */
  marks?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* No observer (old Safari, a JSDOM test) means no scroll trigger, so the
       block is simply shown. Deferred by a frame rather than set here: a
       synchronous setState in an effect body cascades an extra render pass,
       and this path runs for every Reveal on the page at once.

       prefers-reduced-motion needs no branch of its own. globals.css zeroes
       every transition duration for those readers, so the observer still
       fires and the block simply arrives finished. */
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => {
        setOn(true);
        setDone(true);
      });
      return () => cancelAnimationFrame(id);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setOn(true);
        io.disconnect();
      },
      /* A settle point, not a trip wire. The block starts once it is a tenth
         of the way up from the bottom edge, so it finishes moving while the
         reader is still travelling towards it, rather than sliding around
         under their eye after it has arrived. */
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className ? `rv ${className}` : "rv"}
      data-shown={on ? "true" : "false"}
      data-in={marks ? (on ? "true" : "false") : undefined}
      data-lift={lift ? "true" : "false"}
      data-done={done ? "true" : undefined}
      style={delay ? ({ "--rv-d": `${delay}s` } as CSSProperties) : undefined}
      onTransitionEnd={(e) => {
        // Inner marks bubble their own transitionend through here; only the
        // wrapper's own arrival should retire the layer.
        if (e.target === e.currentTarget) setDone(true);
      }}
    >
      {children}
    </div>
  );
}
