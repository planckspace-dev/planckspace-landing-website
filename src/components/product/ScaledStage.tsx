"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Renders a product surface at the width it was designed for and scales it
   to fit, so a 1240px console stays pixel-true inside any container. Below
   `minScale` it stops shrinking and becomes horizontally scrollable instead,
   because a dashboard at a third of its size is a texture, not a picture. */

export default function ScaledStage({
  width,
  minScale = 0.56,
  children,
  className,
}: {
  width: number;
  minScale?: number;
  children: ReactNode;
  className?: string;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | null>(null);
  const [scrolls, setScrolls] = useState(false);

  useEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const sync = () => {
      const s = Math.max(minScale, Math.min(1, o.clientWidth / width));
      setScale(s);
      setHeight(i.offsetHeight * s);
      setScrolls(o.clientWidth < width * s - 1);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, [width, minScale]);

  return (
    <div
      ref={outer}
      className={cn("relative w-full", scrolls && "overflow-x-auto overscroll-x-contain", className)}
      data-lenis-prevent-horizontal={scrolls ? "" : undefined}
      style={{ height: height ?? undefined }}
    >
      <div className="mx-auto" style={{ width: width * scale, height: height ?? undefined }}>
        <div ref={inner} style={{ width, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
