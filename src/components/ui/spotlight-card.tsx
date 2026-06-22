"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type SpotlightCardProps = Omit<HTMLMotionProps<"div">, "children"> & {
  /** Override the section accent the glow uses. */
  glow?: string;
  children?: React.ReactNode;
};

/**
 * A card whose accent glow follows the pointer. The glow paints on a
 * dedicated layer beneath an explicit z-indexed content wrapper, so text
 * legibility is never affected. Reads `--sec-accent` from its section by
 * default; pass `glow` to override.
 */
export function SpotlightCard({ className, glow, children, style, ...props }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      className={cn("spotlight-card", className)}
      style={glow ? ({ ["--sec-accent" as string]: glow, ...style } as React.CSSProperties) : style}
      {...props}
    >
      <span aria-hidden className="spotlight-glow" />
      <div className="relative z-[1] h-full">{children}</div>
    </motion.div>
  );
}
