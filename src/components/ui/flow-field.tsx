"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * FlowField — adapted from 21st.dev "Modern Background Paths" (flow + neural
 * patterns), reworked for PlanckSpace: brand-blue on light, fully deterministic
 * (SSR-safe), and given meaning. Token-stream dashes flow left→right and a node
 * mesh clusters on the right, so the field reads as usage data converging into
 * the product dashboard. Inherits color via `currentColor`.
 */
const VB_W = 1200;
const VB_H = 720;

export function FlowField({ className }: { className?: string }) {
  const streams = useMemo(() => {
    const N = 9;
    return Array.from({ length: N }, (_, i) => {
      const startY = 30 + (i * (VB_H - 60)) / (N - 1);      // fan out on the left
      const endY = VB_H / 2 + (i - (N - 1) / 2) * 14;        // converge right-of-center
      const c1x = VB_W * 0.3;
      const c1y = startY - 28;
      const c2x = VB_W * 0.68;
      const c2y = endY + (i % 2 ? 46 : -46);
      const d = `M-60,${startY.toFixed(1)} C ${c1x},${c1y.toFixed(1)} ${c2x},${c2y.toFixed(1)} ${VB_W + 60},${endY.toFixed(1)}`;
      return {
        d,
        width: 1 + (i % 3) * 0.5,
        opacity: 0.1 + (i % 4) * 0.05,
        dur: 5 + (i % 5) * 1.4,
        delay: -(i * 0.7),
      };
    });
  }, []);

  const nodes = useMemo(() => {
    // denser toward the right (the convergence point)
    const pts: [number, number][] = [
      [0.74, 0.42], [0.82, 0.5], [0.68, 0.56], [0.88, 0.38], [0.79, 0.64],
      [0.6, 0.34], [0.92, 0.56], [0.71, 0.72], [0.5, 0.46], [0.85, 0.69],
      [0.4, 0.4], [0.56, 0.6], [0.31, 0.52], [0.64, 0.47],
    ];
    return pts.map(([px, py], i) => ({
      x: px * VB_W,
      y: py * VB_H,
      dur: 3 + (i % 4),
      delay: -(i * 0.4),
    }));
  }, []);

  const links = useMemo(() => {
    const out: { d: string; dur: number; delay: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (dist < 165) {
          out.push({
            d: `M${nodes[i].x.toFixed(1)},${nodes[i].y.toFixed(1)} L${nodes[j].x.toFixed(1)},${nodes[j].y.toFixed(1)}`,
            dur: 4 + ((i + j) % 4),
            delay: -((i + j) * 0.3),
          });
        }
      }
    }
    return out;
  }, [nodes]);

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        {/* node links */}
        {links.map((l, i) => (
          <path
            key={`l-${i}`}
            d={l.d}
            stroke="currentColor"
            strokeWidth={0.6}
            fill="none"
            style={{ animation: `ff-fade ${l.dur}s ease-in-out ${l.delay}s infinite` }}
          />
        ))}

        {/* token streams — base line + marching dashes (the "flow") */}
        {streams.map((s, i) => (
          <g key={`s-${i}`} style={{ opacity: s.opacity }}>
            <path d={s.d} fill="none" stroke="currentColor" strokeWidth={s.width} opacity={0.32} />
            <path
              d={s.d}
              fill="none"
              stroke="currentColor"
              strokeWidth={s.width + 0.7}
              strokeLinecap="round"
              strokeDasharray="2 16"
              style={{ animation: `flow-dash ${s.dur}s linear ${s.delay}s infinite` }}
            />
          </g>
        ))}

        {/* nodes */}
        {nodes.map((n, i) => (
          <circle
            key={`n-${i}`}
            cx={n.x}
            cy={n.y}
            r={2.4}
            fill="currentColor"
            className="ff-node"
            style={{ animation: `ff-pulse ${n.dur}s ease-in-out ${n.delay}s infinite` }}
          />
        ))}
      </svg>
    </div>
  );
}
