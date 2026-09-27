"use client";

import { useEffect, useRef } from "react";
import { TokenStreamEngine, type Rect, type StreamLayout } from "./token-stream-engine";
import { isFilm, onFilmTime } from "@/lib/film-clock";

/* ─────────────────────────────────────────────────────────────────────────
   The React side of the token stream. It owns no geometry of its own: the
   scene is laid out by three DOM anchors inside the same section, so CSS
   decides where the mark, the ledger and the quiet zone behind the headline
   sit at every breakpoint and the shader simply follows.

     [data-stream-ap]      the mark's box; tokens converge on its counter
     [data-stream-ledger]  the ledger's box
     [data-stream-calm]    the copy block; tokens dim behind it

   Rendering stops while the hero is off screen or the tab is hidden. Under
   reduced motion it draws one settled frame and never starts a loop.
   ───────────────────────────────────────────────────────────────────────── */

const COUNTER = { x: 0.484, y: 0.467 }; // centre of the mark's counter, in mark units
const CHANNEL = { x: 0.325, y: 1.0 }; //   bottom of the channel

function rectIn(el: Element | null, origin: DOMRect, pad = 0): Rect | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return null;
  return { x: r.left - origin.left - pad, y: r.top - origin.top - pad, w: r.width + pad * 2, h: r.height + pad * 2 };
}

export default function TokenStream({
  className,
  cols = 30,
  particles = true,
  funnel = true,
  direct = false,
  from = "left",
  wobble = 1,
}: {
  className?: string;
  cols?: number;
  /** false draws only the dot-matrix ledger, no stream of tokens */
  particles?: boolean;
  /** false keeps the currents from pouring into the mark */
  funnel?: boolean;
  /** tokens fly straight into the ledger; no mark anchor needed */
  direct?: boolean;
  /** where the currents enter: sweeping from the top-left, or falling straight from the top */
  from?: "left" | "top";
  /** 0..1, how much the currents snake; low reads as a clean flow, not a swirl */
  wobble?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.closest("section");
    if (!canvas || !section) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cores = navigator.hardwareConcurrency ?? 8;
    const first = canvas.getBoundingClientRect();
    const areaRatio = (first.width * first.height) / (1440 * 900);
    let count = Math.round(Math.min(32000, Math.max(9000, 27000 * areaRatio)));
    if (cores <= 4) count = Math.round(count * 0.6);

    let engine: TokenStreamEngine;
    try {
      engine = new TokenStreamEngine(canvas, count);
      engine.particles = particles;
      engine.funnel = funnel;
      engine.direct = direct;
      engine.wobble = wobble;
    } catch {
      section.setAttribute("data-gl", "off");
      return;
    }
    section.setAttribute("data-gl", "on");

    const measure = () => {
      const box = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, box.width < 640 ? 1.5 : 1.75);
      engine.resize(box.width, box.height, dpr);

      const mark = rectIn(section.querySelector("[data-stream-ap]"), box);
      const ledger = rectIn(section.querySelector("[data-stream-ledger]"), box);
      if (!ledger || (!mark && !direct)) return;
      const calm = rectIn(section.querySelector("[data-stream-calm]"), box, 12);

      // direct mode aims the currents at the ledger itself
      const ap = mark && !direct ? { x: mark.x + mark.w * COUNTER.x, y: mark.y + mark.h * COUNTER.y } : { x: ledger.x + ledger.w * 0.5, y: ledger.y + ledger.h * 0.3 };
      const exit = mark && !direct ? { x: mark.x + mark.w * CHANNEL.x, y: mark.y + mark.h * CHANNEL.y + 2 } : ap;
      const portrait = box.height > box.width;
      const dir = from === "top" ? { x: 0, y: 1 } : portrait ? { x: 0.72, y: 0.69 } : { x: 0.9, y: 0.43 };
      // from the top the currents start just above the section, so they read as falling in
      const reach = from === "top" ? ap.y + box.height * 0.12 : Math.max(box.width, box.height) * (portrait ? 0.62 : 0.74);
      const layout: StreamLayout = {
        width: box.width,
        height: box.height,
        src: { x: ap.x - dir.x * reach, y: ap.y - dir.y * reach },
        ap,
        exit,
        apSize: mark?.w ?? 100,
        ledger,
        cols,
        calm,
        scale: box.width < 640 ? 0.85 : 1,
      };
      engine.setLayout(layout);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    document.fonts?.ready.then(measure).catch(() => {});

    // film capture: draw exactly the frame the studio seeks to
    if (isFilm()) {
      const off = onFilmTime((t) => {
        measure();
        engine.render(t, Math.min(1, t / 1.6));
      });
      return () => {
        off();
        ro.disconnect();
        engine.destroy();
      };
    }

    if (reduce) {
      engine.render(9, 1);
      return () => {
        ro.disconnect();
        engine.destroy();
      };
    }

    // pointer: tokens part around the cursor while it is over the hero
    const onMove = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      engine.setPointer(e.clientX - b.left, e.clientY - b.top, e.pointerType === "mouse");
    };
    const onLeave = () => engine.setPointer(-9999, -9999, false);
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let visible = true;
    const start = performance.now();
    const frame = (now: number) => {
      const t = (now - start) / 1000;
      engine.render(t, Math.min(1, t / 2.2));
      raf = requestAnimationFrame(frame);
    };
    const play = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) play();
        else pause();
      },
      { rootMargin: "80px" },
    );
    io.observe(canvas);
    const onVis = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVis);
    // A real context loss (GPU reset, driver update): hide the dead canvas,
    // ask for the context back, and rebuild the scene when it returns.
    const onLost = (e: Event) => {
      e.preventDefault();
      pause();
      section.setAttribute("data-gl", "off");
    };
    const onRestored = () => {
      try {
        engine = new TokenStreamEngine(canvas, count);
        engine.particles = particles;
        engine.funnel = funnel;
        engine.direct = direct;
        engine.wobble = wobble;
      } catch {
        return;
      }
      section.setAttribute("data-gl", "on");
      measure();
      play();
    };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    play();

    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      engine.destroy();
    };
  }, [cols, particles, funnel, direct, from, wobble]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
