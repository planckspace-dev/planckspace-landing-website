'use client';

/* ─────────────────────────────────────────────────────────────────────────
   CountUp, roll mode: an odometer for the page's key figures. The product
   meters; its figures roll into place once, when they come into view.

   Source: React Bits, https://reactbits.dev/r/CountUp-TS-TW.json
   (github.com/DavidHDev/react-bits). Copyright (c) 2026 David Haz.
   Licence: MIT + Commons Clause License Condition v1.0, see ./LICENSE.md.
   Used as part of this website; not to be sold or redistributed on its own.

   Changes from the original, all so the figure is a fact first and an
   animation second:
   - The final value is the only thing in the HTML. The server render, the
     no-JS page and the first client render all show the exact, formatted
     final value as plain text; it is never 0 and never the roll markup.
   - The roll is an aria-hidden overlay, absolutely positioned over that
     text, mounted only while it plays and removed when it lands. The text
     underneath keeps its box (so nothing shifts) and stays in the
     accessibility tree (so assistive tech reads the final value once); it is
     only made transparent while the overlay plays.
   - The roll spins from the final value to the final value (the original's
     `spin` replay): every column turns and lands on its digit, so the width
     never changes and no zero is ever shown.
   - Once only, on view (an IntersectionObserver at 60%, in place of
     motion's useInView), never on hover. Under prefers-reduced-motion the
     overlay is never mounted.
   - Count mode, compact format, the spring easing, enter/leave columns,
     `direction`, `from`, `replayOnHover` and the callbacks are removed. The
     easing is the original's own expo-out, the site's one curve.
   - motion is gone: the original used motion's animate() only as a linear
     clock (and cubicBezier for an easing), which costs about 25 KB gzipped;
     a requestAnimationFrame loop does the same here.
   - The window over each digit column fades at its top and bottom edge
     like a counter's drum.
   ───────────────────────────────────────────────────────────────────────── */

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Column = { slot: number; index: number; place: number; digit: number; delta: number };
type Mark = { char: string };
type Slot = Column | Mark;

/** Height of one digit cell, in em. */
const CELL = 1.2;
/** Delay between columns, left to right, in seconds. */
const STAGGER = 0.07;
/** Expo-out, from the original's easings. */
const EASE = (t: number) => (t >= 1 ? 1 : (1 - Math.pow(2, -10 * t)) / (1 - Math.pow(2, -10)));

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const mod10 = (value: number) => ((value % 10) + 10) % 10;
const group = (int: string, separator: string) => (separator ? int.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : int);

/** The digits of `value` as columns that each turn one to three times and land where they started. */
function buildSpin(value: number, decimals: number, separator: string) {
  const [int, frac = ''] = Math.abs(value).toFixed(decimals).split('.');
  const slots: Slot[] = [];
  const columns: Column[] = [];
  const digitAt = (place: number) => Number(place < 0 ? frac[-place - 1] : int[int.length - 1 - place]);
  for (let place = int.length - 1; place >= -decimals; place--) {
    if (place === -1) slots.push({ char: '.' });
    const column: Column = { slot: slots.length, index: columns.length, place, digit: digitAt(place), delta: 0 };
    slots.push(column);
    columns.push(column);
    if (separator && place > 0 && place % 3 === 0) slots.push({ char: separator });
  }
  // the rightmost columns turn more, as on a meter
  columns.forEach((column, index) => {
    const rank = columns.length - 1 - index;
    column.delta = 10 * Math.max(1, 3 - rank);
  });
  return { slots, columns };
}

export interface CountUpProps {
  /** The final value. Non-negative; write a minus sign as the prefix. */
  to: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  decimals?: number;
  /** Seconds for one column's roll. */
  duration?: number;
  /** Seconds after the figure comes into view. */
  delay?: number;
  className?: string;
}

export default function CountUp({ to, prefix = '', suffix = '', separator = '', decimals = 0, duration = 1.2, delay = 0.12, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const staticRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLSpanElement>(null);
  const slotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const filterRefs = useRef<(SVGFEGaussianBlurElement | null)[]>([]);
  const uid = useId().replace(/[^\w-]/g, '');
  const [rolling, setRolling] = useState(false);

  const finalText = `${prefix}${group(Math.abs(to).toFixed(decimals).split('.')[0], separator)}${decimals ? `.${Math.abs(to).toFixed(decimals).split('.')[1]}` : ''}${suffix}`;
  const model = useMemo(() => buildSpin(to, decimals, separator), [to, decimals, separator]);

  // Mount the overlay once, when most of the figure is in view and motion is
  // welcome. Under reduced motion nothing is observed and nothing mounts.
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setRolling(true);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Before the overlay's first paint, sit its glyphs exactly on the static
  // ones (sub-pixel rounding of the centred box can leave them a fraction of
  // a pixel apart).
  useLayoutEffect(() => {
    if (!rolling || !staticRef.current || !overlayRef.current) return;
    const firstGlyph = (node: Node | null | undefined) => {
      const text = node?.nodeType === Node.TEXT_NODE ? node : node?.firstChild;
      if (!text || text.nodeType !== Node.TEXT_NODE || !(text as Text).length) return null;
      const range = document.createRange();
      range.setStart(text, 0);
      range.setEnd(text, 1);
      return range.getBoundingClientRect();
    };
    const overlay = overlayRef.current;
    const lead = overlay.firstElementChild;
    const leadText = lead?.firstElementChild?.children.length === 4 ? lead.firstElementChild.children[1] : lead;
    const s = firstGlyph(staticRef.current);
    const o = firstGlyph(leadText);
    if (s && o) {
      overlay.style.marginLeft = `${(s.left - o.left).toFixed(2)}px`;
      overlay.style.marginTop = `${(s.top - o.top).toFixed(2)}px`;
    }
  }, [rolling]);

  // Play it, then remove it.
  useEffect(() => {
    if (!rolling || !ref.current) return undefined;
    const { columns: layout } = model;
    const fontSize = parseFloat(getComputedStyle(ref.current).fontSize) || 16;
    const cell = CELL * fontSize;
    const total = Math.max(0.001, duration + STAGGER * (layout.length - 1));
    const columns = layout.map((column) => {
      const box = slotRefs.current[column.slot];
      const strip = box?.firstChild as HTMLSpanElement | null;
      return {
        ...column,
        strip,
        blur: filterRefs.current[column.index],
        cells: strip ? Array.from(strip.childNodes, (node) => node.firstChild) : ([] as (ChildNode | null)[]),
        base: column.digit,
        sigma: 0,
      };
    });

    const render = (t: number) => {
      columns.forEach((column, index) => {
        if (!column.strip) return;
        const u = clamp01((t - index * STAGGER) / duration);
        const pos = column.digit + column.delta * EASE(u);
        const base = Math.floor(pos);
        if (base !== column.base) {
          column.base = base;
          column.cells.forEach((node, offset) => {
            if (node) node.nodeValue = String(mod10(base + offset - 1));
          });
        }
        column.strip.style.transform = `translateY(${(-(1 + pos - base) * CELL).toFixed(4)}em)`;

        // a little vertical motion blur while the column is fast
        const u0 = Math.max(0, u - 0.004);
        const u1 = Math.min(1, u + 0.004);
        const speed = u1 > u0 ? (column.delta * Math.abs(EASE(u1) - EASE(u0))) / (u1 - u0) / duration : 0;
        const sigma = u > 0 && u < 1 ? Math.min(cell * 0.05, (speed * cell) / 600) : 0;
        if (Math.abs(sigma - column.sigma) > 0.05 || (sigma === 0 && column.sigma !== 0)) {
          column.sigma = sigma;
          if (sigma > 0.2 && column.blur) {
            column.blur.setAttribute('stdDeviation', `0 ${sigma.toFixed(2)}`);
            column.strip.style.filter = `url(#${uid}-${index})`;
          } else {
            column.strip.style.filter = '';
          }
        }
      });
    };

    // a linear clock in seconds, after the delay; land, then remove the overlay
    const start = performance.now() + delay * 1000;
    let raf = 0;
    const frame = (now: number) => {
      const t = (now - start) / 1000;
      if (t >= total) {
        render(Infinity);
        setRolling(false);
        return;
      }
      if (t > 0) render(t);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [rolling, model, duration, delay, uid]);

  return (
    <span ref={ref} className={cn('relative inline-block tabular-nums', className)}>
      {/* The figure itself: what the server sends, what is read aloud, what holds the box. */}
      <span ref={staticRef} className={rolling ? 'text-transparent' : undefined}>
        {finalText}
      </span>

      {rolling && (
        <span
          ref={overlayRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1/2 flex -translate-y-1/2 whitespace-pre select-none [mask-image:linear-gradient(transparent,#000_18%,#000_82%,transparent)]"
        >
          {prefix && <span className="inline-block h-[1.2em] leading-[1.2em]">{prefix}</span>}
          {model.slots.map((slot, index) =>
            'char' in slot ? (
              <span key={index} className="inline-block h-[1.2em] leading-[1.2em]">
                {slot.char}
              </span>
            ) : (
              <span
                key={index}
                ref={(node) => {
                  slotRefs.current[index] = node;
                }}
                className="relative inline-block h-[1.2em] overflow-hidden leading-[1.2em]"
              >
                <span className="flex flex-col" style={{ transform: `translateY(${-CELL}em)` }}>
                  {[-1, 0, 1, 2].map((offset) => (
                    <span key={offset} className="h-[1.2em]">
                      {mod10(slot.digit + offset)}
                    </span>
                  ))}
                </span>
              </span>
            ),
          )}
          {suffix && <span className="inline-block h-[1.2em] leading-[1.2em]">{suffix}</span>}
          <svg aria-hidden="true" width="0" height="0" className="absolute">
            <defs>
              {model.columns.map((column) => (
                <filter key={column.index} id={`${uid}-${column.index}`} x="-20%" y="-50%" width="140%" height="200%" colorInterpolationFilters="sRGB">
                  <feGaussianBlur
                    ref={(node) => {
                      filterRefs.current[column.index] = node;
                    }}
                    stdDeviation="0 0"
                  />
                </filter>
              ))}
            </defs>
          </svg>
        </span>
      )}
    </span>
  );
}
