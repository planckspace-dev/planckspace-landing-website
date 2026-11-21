'use client';

/* ─────────────────────────────────────────────────────────────────────────
   Magnet: the element leans a few pixels toward a nearby pointer. Used on
   the primary button of the close (and anywhere through <Button magnetic>).

   Source: React Bits, https://reactbits.dev/r/Magnet-TS-TW.json
   (github.com/DavidHDev/react-bits). Copyright (c) 2026 David Haz.
   Licence: MIT + Commons Clause License Condition v1.0, see ./LICENSE.md.
   Used as part of this website; not to be sold or redistributed on its own.

   Changes from the original:
   - A pull of a few pixels at most (maxOffset 4 by default) and a
     critically damped spring, so it settles without overshoot.
   - Off unless the device hovers with a fine pointer, and off under
     prefers-reduced-motion: nothing is attached, nothing moves.
   - Tilt, scale, axis locking and the active-change callback are removed;
     no permanent will-change (it softened the button's text).
   - The wrapper is inline-flex so the child keeps its own box and baseline.
     Only the pointer moves it: keyboard focus, the focus ring and clicks
     are the child's own and are untouched.
   ───────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** How far outside the element, in px, the pull begins. */
  padding?: number;
  disabled?: boolean;
  /** Higher is weaker: the offset is the pointer's distance from centre divided by this. */
  magnetStrength?: number;
  /** The most the element moves, in px. */
  maxOffset?: number;
  innerClassName?: string;
}

type Point = { x: number; y: number };
type Entry = { wrapper: HTMLDivElement; settings: { current: Settings }; wake: () => void };
type Settings = { padding: number; disabled: boolean; strength: number; maxOffset: number };

const SPRING = { stiffness: 220, damping: 30, mass: 1 };

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

// One pointer listener for every magnet on the page; the nearest one wins.
const registry = new Set<Entry>();
const field: { pointer: Point | null; owner: Entry | null } = { pointer: null, owner: null };
let detach: (() => void) | null = null;

const reach = (rect: DOMRect, pointer: Point) => {
  const dx = pointer.x - (rect.left + rect.width / 2);
  const dy = pointer.y - (rect.top + rect.height / 2);
  const outside = Math.hypot(Math.max(0, Math.abs(dx) - rect.width / 2), Math.max(0, Math.abs(dy) - rect.height / 2));
  return { dx, dy, outside };
};

const arbitrate = () => {
  let winner: Entry | null = null;
  let nearest = Infinity;
  for (const entry of registry) {
    const s = entry.settings.current;
    if (!field.pointer || s.disabled) continue;
    const near = reach(entry.wrapper.getBoundingClientRect(), field.pointer);
    if (near.outside <= s.padding && near.outside < nearest) {
      winner = entry;
      nearest = near.outside;
    }
  }
  const previous = field.owner;
  field.owner = winner;
  if (previous && previous !== winner) previous.wake();
  if (winner) winner.wake();
};

const attach = () => {
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    field.pointer = { x: event.clientX, y: event.clientY };
    arbitrate();
  };
  const onLeave = () => {
    field.pointer = null;
    arbitrate();
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('scroll', arbitrate, { passive: true, capture: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  window.addEventListener('blur', onLeave);
  return () => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('scroll', arbitrate, { capture: true });
    document.documentElement.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('blur', onLeave);
  };
};

export default function Magnet({
  children,
  padding = 48,
  disabled = false,
  magnetStrength = 6,
  maxOffset = 4,
  className,
  innerClassName,
  ...props
}: MagnetProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const settings: Settings = { padding: Math.max(0, padding), disabled, strength: Math.max(1, magnetStrength), maxOffset: Math.max(0, maxOffset) };
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return undefined;
    const fine = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (!fine || reduce) return undefined;

    const current = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };
    let raf = 0;
    let last = 0;

    const target = () => {
      const s = settingsRef.current;
      if (s.disabled || !field.pointer || field.owner !== entry) return { x: 0, y: 0 };
      const { dx, dy, outside } = reach(wrapper.getBoundingClientRect(), field.pointer);
      if (outside > s.padding) return { x: 0, y: 0 };
      const pull = s.padding > 0 ? 1 - smoothstep(s.padding * 0.5, s.padding, outside) : 1;
      let x = (dx / s.strength) * pull;
      let y = (dy / s.strength) * pull;
      const length = Math.hypot(x, y);
      if (length > s.maxOffset) {
        x *= s.maxOffset / length;
        y *= s.maxOffset / length;
      }
      return { x, y };
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;
      const goal = target();
      const steps = Math.ceil(dt / (1 / 120));
      let resting = true;
      for (let i = 0; i < steps; i++) {
        resting = true;
        (['x', 'y'] as const).forEach((key) => {
          const force = SPRING.stiffness * (goal[key] - current[key]) - SPRING.damping * velocity[key];
          velocity[key] += (force / SPRING.mass) * (dt / steps);
          current[key] += velocity[key] * (dt / steps);
          if (Math.abs(goal[key] - current[key]) > 0.02 || Math.abs(velocity[key]) > 0.02) resting = false;
        });
      }
      if (resting) {
        current.x = goal.x;
        current.y = goal.y;
        velocity.x = velocity.y = 0;
      }
      inner.style.transform = current.x || current.y ? `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)` : '';
      if (!resting) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    function wake() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    const entry: Entry = { wrapper, settings: settingsRef, wake };
    registry.add(entry);
    if (!detach) detach = attach();

    return () => {
      cancelAnimationFrame(raf);
      registry.delete(entry);
      if (field.owner === entry) field.owner = null;
      if (!registry.size && detach) {
        detach();
        detach = null;
      }
    };
  }, []);

  return (
    <div ref={wrapperRef} className={cn('relative inline-flex', className)} {...props}>
      <div ref={innerRef} className={cn('inline-flex', innerClassName)}>
        {children}
      </div>
    </div>
  );
}
