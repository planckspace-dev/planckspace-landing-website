"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ClaudeLogo, CursorLogo, OpenAILogo } from "@/components/brand/ToolLogos";
import { cn } from "@/lib/utils";

/* Small shared pieces of the product surfaces. These draw the app's UI 2.0
   (see the frontend's docs/DESIGN.md), not the site's: everything here is
   meant to be read as a picture of the real dashboard. */

export function ToolBadge({ tool, size = 26 }: { tool: "claude" | "cursor" | "openai"; size?: number }) {
  const Logo = tool === "claude" ? ClaudeLogo : tool === "cursor" ? CursorLogo : OpenAILogo;
  const color = tool === "claude" ? "#D97757" : tool === "cursor" ? "#11131A" : "#11131A";
  return (
    <span
      className="grid shrink-0 place-items-center rounded-[7px] border border-[var(--border)] bg-white"
      style={{ width: size, height: size }}
    >
      <Logo style={{ width: size * 0.5, height: size * 0.5, color }} />
    </span>
  );
}

/** Fires once when the element first scrolls into view. */
export function useInView<T extends Element>(margin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, margin]);
  return [ref, seen] as const;
}

/** True while the element is on screen: live loops only run when someone can see them. */
export function useVisible<T extends Element>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}

export function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduce;
}

/** Counts from 0 to `value` once `run` turns true. Renders the final value on the server and without motion. */
export function CountUp({
  value,
  run,
  format,
  duration = 1600,
  className,
}: {
  value: number;
  run: boolean;
  format: (n: number) => string;
  duration?: number;
  className?: string;
}) {
  const [n, setN] = useState(value);
  const reduce = useReducedMotion();
  const started = useRef(false);
  useEffect(() => {
    if (!run || reduce || started.current) return;
    started.current = true;
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - p, 4);
      setN(value * e);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    setN(0);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, reduce, value, duration]);
  return <span className={className}>{format(n)}</span>;
}

export function Card({ children, className, hero }: { children: ReactNode; className?: string; hero?: boolean }) {
  return <div className={cn(hero ? "card-hero" : "card", "overflow-hidden", className)}>{children}</div>;
}

export function CardHead({
  icon,
  title,
  sub,
  right,
}: {
  icon?: ReactNode;
  title: string;
  sub?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
      <div className="flex items-start gap-2.5">
        {icon && <span className="mt-[2px] text-[var(--text-3)]">{icon}</span>}
        <div>
          <p className="text-[13px] font-medium text-[var(--ink)]">{title}</p>
          {sub && <p className="mt-0.5 text-[11px] text-[var(--text-3)]">{sub}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

/** Area sparkline with a working tooltip on every point (the app's rule: a chart with points has hover). */
export function Sparkline({
  data,
  labels,
  color = "var(--brand-600)",
  height = 40,
  format,
  draw,
}: {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
  format: (n: number) => string;
  draw: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const w = 200;
  const max = Math.max(...data) * 1.08;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, height - (v / max) * height] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${height} L0,${height} Z`;
  const id = `sp${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${w} ${height}`}
        preserveAspectRatio="none"
        className="block h-10 w-full overflow-visible"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const i = Math.round(((e.clientX - r.left) / r.width) * (data.length - 1));
          setHover(Math.max(0, Math.min(data.length - 1, i)));
        }}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.16" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${id})`} className={cn("transition-opacity duration-1000", draw ? "opacity-100" : "opacity-0")} />
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={draw ? 0 : 1}
          style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1)" }}
        />
        {hover !== null && (
          <line x1={pts[hover][0]} x2={pts[hover][0]} y1={0} y2={height} stroke="var(--border-strong)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        )}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute -top-9 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--border)] bg-white px-2 py-1 text-[10.5px] shadow-[var(--shadow-card)]"
          style={{ left: `${(hover / (data.length - 1)) * 100}%` }}
        >
          <span className="text-[var(--text-2)]">{labels[hover]}</span>{" "}
          <span className="num font-medium text-[var(--ink)]">{format(data[hover])}</span>
        </div>
      )}
    </div>
  );
}
