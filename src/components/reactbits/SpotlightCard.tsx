'use client';

/* ─────────────────────────────────────────────────────────────────────────
   SpotlightCard: a soft light that follows the pointer across a surface.
   Used once, on the glass slab of the four rules on the blue field.

   Source: React Bits, https://reactbits.dev/r/SpotlightCard-TS-TW.json
   (github.com/DavidHDev/react-bits). Copyright (c) 2026 David Haz.
   Licence: MIT + Commons Clause License Condition v1.0, see ./LICENSE.md.
   Used as part of this website; not to be sold or redistributed on its own.

   Changes from the original:
   - No surface, radius, padding, shadow or border of its own: the caller's
     classes (here, .glass) are the card. The original's dark #111 fill
     would have covered the glass.
   - One neutral light (white by default, low intensity) and a faint lift of
     the hairline near it. No grain layer (the field has its own), no press
     flare, no ambient drift, no beam shape, no theme palettes.
   - Only on devices that hover with a fine pointer: on touch nothing is
     attached and nothing is drawn.
   - Under prefers-reduced-motion the light follows the pointer without
     easing (as the original did).
   ───────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type SpotlightCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Any CSS colour. Keep it neutral. */
  spotlightColor?: string;
  /** 0 to 1, the light's opacity at full presence. */
  intensity?: number;
  /** Radius of the light, in px. */
  spotlightSize?: number;
  /** 0 to 1, how much the hairline brightens under the light. */
  borderGlow?: number;
  /** Distance in px outside the card at which the light starts to appear. */
  proximity?: number;
  /** 0 to 1, how slowly the light catches up with the pointer. */
  smoothing?: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** A smooth radial falloff, as colour stops. */
const falloff = (color: string) => {
  const list = [`color-mix(in srgb, ${color} 100%, transparent) 0%`];
  for (let i = 1; i <= 12; i++) {
    const g = i / 12;
    const a = Math.exp(-4.6 * g * g) * (1 - g ** 6);
    list.push(`color-mix(in srgb, ${color} ${(a * 100).toFixed(2)}%, transparent) ${(g * 100).toFixed(2)}%`);
  }
  return list.join(', ');
};

const RIM =
  '[-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [-webkit-mask-composite:xor] [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]';

export default function SpotlightCard({
  children,
  className,
  style,
  spotlightColor = '#ffffff',
  // low by design: over the blue field white text keeps 4.5:1 even at the light's centre
  intensity = 0.04,
  spotlightSize = 320,
  borderGlow = 0.35,
  proximity = 60,
  smoothing = 0.3,
  ...rest
}: SpotlightCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLSpanElement>(null);
  const edgeRef = useRef<HTMLSpanElement>(null);
  const settings = {
    fill: falloff(spotlightColor),
    size: Math.max(20, spotlightSize),
    intensity: clamp(intensity, 0, 1),
    borderGlow: clamp(borderGlow, 0, 1),
    proximity: Math.max(0, proximity),
    smoothing: clamp(smoothing, 0, 1),
  };
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  });

  useEffect(() => {
    const root = rootRef.current;
    const light = lightRef.current;
    const edge = edgeRef.current;
    if (!root || !light || !edge) return undefined;
    // touch screens get no light at all
    if (!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const state = { x: 0, y: 0, presence: 0 };
    const pointer = { x: 0, y: 0, active: false };
    let raf = 0;
    let last = 0;
    let alive = true;

    const paint = () => {
      const s = settingsRef.current;
      const at = `${state.x.toFixed(1)}px ${state.y.toFixed(1)}px`;
      light.style.background = `radial-gradient(circle ${s.size}px at ${at}, ${s.fill})`;
      edge.style.background = `radial-gradient(circle ${(s.size * 0.6).toFixed(1)}px at ${at}, ${s.fill})`;
      light.style.opacity = String(state.presence * s.intensity);
      edge.style.opacity = String(state.presence * s.borderGlow);
    };

    const tick = (now: number) => {
      raf = 0;
      if (!alive) return;
      const s = settingsRef.current;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      const rect = root.getBoundingClientRect();
      let tx = state.x;
      let ty = state.y;
      let target = 0;
      if (pointer.active) {
        tx = pointer.x - rect.left;
        ty = pointer.y - rect.top;
        const gap = Math.hypot(Math.max(0, -tx, tx - rect.width), Math.max(0, -ty, ty - rect.height));
        if (gap === 0) target = 1;
        else if (s.proximity > 0) target = Math.max(0, 1 - gap / s.proximity) ** 2;
      }
      // arriving from nowhere: start where the pointer is, not where it was
      if (state.presence < 0.02 && target > 0) {
        state.x = tx;
        state.y = ty;
      }
      const follow = reduce || s.smoothing === 0 ? 1 : 1 - Math.exp(-dt / (0.015 + s.smoothing * 0.22));
      state.x += (tx - state.x) * follow;
      state.y += (ty - state.y) * follow;
      const fade = reduce ? 1 : 1 - Math.exp(-dt / (target > state.presence ? 0.1 : 0.32));
      state.presence += (target - state.presence) * fade;
      if (Math.abs(target - state.presence) < 0.002) state.presence = target;
      paint();
      const moving = Math.abs(tx - state.x) > 0.1 || Math.abs(ty - state.y) > 0.1;
      if (moving || state.presence !== target) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (raf || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
      wake();
    };
    const onOut = (event: PointerEvent) => {
      if (event.relatedTarget) return;
      pointer.active = false;
      wake();
    };
    const onScroll = () => {
      if (pointer.active || state.presence > 0) wake();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    document.addEventListener('pointerout', onOut);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll, { capture: true });
      document.removeEventListener('pointerout', onOut);
    };
  }, []);

  return (
    <div ref={rootRef} className={cn('relative isolate overflow-hidden', className)} style={style as CSSProperties} {...rest}>
      <span ref={lightRef} className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0" aria-hidden="true" />
      {children}
      <span ref={edgeRef} className={cn('pointer-events-none absolute inset-0 z-[1] rounded-[inherit] p-px opacity-0', RIM)} aria-hidden="true" />
    </div>
  );
}
