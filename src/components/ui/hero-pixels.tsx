"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   Metering pixels.

   The hero sits on a raster of 2px units (.hero-field::before, 16px tile,
   anchored center-top). This canvas lights individual units of that same
   raster in brand blue, one at a time, and lets them decay. It reads as the
   field quietly counting, which is what the product does.

   Calibration: a handful lit at once, each ~2.4s, never in a pattern. If a
   visitor consciously notices it before they notice the headline, it is too
   strong. Off entirely for reduced motion and while scrolled away.
   ───────────────────────────────────────────────────────────────────────── */

const TILE = 16;
const LIFE = 2400;
const MAX_LIT = 9;
const SPAWN_EVERY = 280;

type Lit = { x: number; y: number; born: number };

export function HeroPixels() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let w = 0;
    let h = 0;
    let offsetX = 0;
    let raf = 0;
    let visible = true;
    let lastSpawn = 0;
    const lit: Lit[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // background-position: center top → tiles are centred on the midline
      offsetX = ((w / 2) % TILE + TILE) % TILE;
    };

    const spawn = (now: number) => {
      // bias toward the band the headline and console occupy
      const cols = Math.floor(w / TILE);
      const rows = Math.floor(h / TILE);
      const cx = Math.floor(cols / 2 + (Math.random() - 0.5) * cols * 0.9);
      const cy = Math.floor(rows * (0.08 + Math.random() * 0.62));
      if (lit.some((p) => Math.abs(p.x - cx) < 3 && Math.abs(p.y - cy) < 3)) return;
      lit.push({ x: cx, y: cy, born: now });
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      if (now - lastSpawn > SPAWN_EVERY && lit.length < MAX_LIT) {
        lastSpawn = now;
        spawn(now);
      }
      ctx.clearRect(0, 0, w, h);
      for (let i = lit.length - 1; i >= 0; i--) {
        const p = lit[i];
        const t = (now - p.born) / LIFE;
        if (t >= 1) {
          lit.splice(i, 1);
          continue;
        }
        // quick attack, long decay
        const a = t < 0.12 ? t / 0.12 : Math.pow(1 - (t - 0.12) / 0.88, 2);
        const px = offsetX + p.x * TILE - TILE;
        const py = p.y * TILE;
        ctx.fillStyle = `rgba(46,107,242,${0.1 * a})`;
        ctx.fillRect(px - 3, py - 3, 8, 8);
        ctx.fillStyle = `rgba(46,107,242,${0.85 * a})`;
        ctx.fillRect(px, py, 2, 2);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="hero-pixels h-full w-full" />;
}
