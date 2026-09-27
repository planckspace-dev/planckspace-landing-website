"use client";

import { useRef } from "react";
import { RECEIPTS, SAVINGS_DAYS, accrued, realizedTotal, savedToDate, usd } from "@/lib/sample";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/* ─────────────────────────────────────────────────────────────────────────
   Verify. The number every other tool estimates, shown as a measurement:
   the ledger's own accrual (rate x months since each fix was verified), so
   the curve bends upward at every pin. Under it, the receipts, each with the
   metric before and after and how much of the forecast actually held.
   ───────────────────────────────────────────────────────────────────────── */

const PROJ = 22;
const DAYS = SAVINGS_DAYS + PROJ;
const MAX = accrued(DAYS) * 1.06;
const TICKS = [
  { d: 0, l: "Aug 1" },
  { d: 14, l: "Aug 15" },
  { d: 31, l: "Sep 1" },
  { d: 45, l: "Sep 15" },
  { d: SAVINGS_DAYS, l: "Today" },
];

/** The accrual curve, drawn for one width. Rendered twice (desktop, phone) so
    labels stay at a readable size instead of scaling down with the viewBox. */
export function SavingsCurve({ W, H, compact, className }: { W: number; H: number; compact?: boolean; className?: string }) {
  const base = H - 26;
  const x = (d: number) => (d / DAYS) * W;
  const y = (v: number) => base - (v / MAX) * (H - 50);
  const line = Array.from({ length: SAVINGS_DAYS + 1 }, (_, d) => `${d ? "L" : "M"}${x(d).toFixed(1)},${y(accrued(d)).toFixed(1)}`).join(" ");
  const area = `${line} L${x(SAVINGS_DAYS)},${base} L0,${base} Z`;
  const proj = `M${x(SAVINGS_DAYS)},${y(accrued(SAVINGS_DAYS))} L${x(DAYS)},${y(accrued(DAYS))}`;
  const fs = compact ? 11 : 12.5;
  const ticks = compact ? TICKS.filter((t) => t.d === 0 || t.d === 31 || t.d === SAVINGS_DAYS) : TICKS;
  const fill = compact ? "vf-fill-sm" : "vf-fill";
  const dots = compact ? "vf-dots-sm" : "vf-dots";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`block h-auto w-full overflow-visible ${className ?? ""}`}
      role="img"
      aria-label={`Cumulative verified savings since August 1, reaching ${usd(savedToDate)} today, with four verified fixes marked.`}
    >
      <defs>
        <linearGradient id={fill} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C6FF3D" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#C6FF3D" stopOpacity="0" />
        </linearGradient>
        <pattern id={dots} width={compact ? 16 : 24} height={compact ? 16 : 24} patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="rgb(247 245 240 / 0.12)" />
        </pattern>
      </defs>
      <rect x="0" y="0" width={W} height={base} fill={`url(#${dots})`} />
      <line x1="0" x2={W} y1={base} y2={base} stroke="rgb(247 245 240 / 0.2)" />
      <path className="vf-area" d={area} fill={`url(#${fill})`} />
      <path className="vf-line" d={line} fill="none" stroke="#C6FF3D" strokeWidth={compact ? 2.5 : 3} strokeLinejoin="round" />
      <path className="vf-proj" d={proj} fill="none" stroke="#C6FF3D" strokeWidth="2" strokeDasharray="6 7" opacity="0.6" />
      <line x1={x(SAVINGS_DAYS)} x2={x(SAVINGS_DAYS)} y1="0" y2={base} stroke="rgb(247 245 240 / 0.35)" strokeDasharray="3 5" />
      {RECEIPTS.map((r, i) => {
        const px = x(r.day);
        const py = y(accrued(r.day));
        const lift = i === 1 ? (compact ? 22 : 26) : 0;
        // the line only rises to the right, so up-and-left of a pin is clear; pins near the left edge label rightward
        const early = px < W * 0.17;
        const lx = early ? px + 10 : px - 10;
        const anchor = early ? "start" : "end";
        const d = compact ? 5.5 : 7;
        return (
          <g key={r.id}>
            <line x1={px} x2={px} y1={py} y2={base} stroke="rgb(198 255 61 / 0.25)" />
            <g className="vf-pin">
              <rect x={px - d} y={py - d} width={d * 2} height={d * 2} fill="#0B0B0C" stroke="#C6FF3D" strokeWidth="2.5" transform={`rotate(45 ${px} ${py})`} />
            </g>
            <g className="vf-pin-label">
              <text x={lx} y={py - (compact ? 16 : 36) - lift} textAnchor={anchor} fill="#F7F5F0" fontSize={compact ? 12 : 15} fontFamily="var(--font-geist)" fontWeight="600">
                +{usd(r.usd)}
                {compact ? "" : "/mo"}
              </text>
              {!compact && (
                <text x={lx} y={py - 18 - lift} textAnchor={anchor} fill="#9C9A94" fontSize="12.5" fontFamily="var(--font-geist-mono)">
                  verified {r.verified}
                </text>
              )}
            </g>
          </g>
        );
      })}
      {ticks.map((t) => (
        <text key={t.l} x={x(t.d)} y={H - 4} fill="#9C9A94" fontSize={fs} fontFamily="var(--font-geist-mono)" textAnchor={t.d === 0 ? "start" : "middle"}>
          {t.l}
        </text>
      ))}
      {!compact && (
        <text x={x(DAYS)} y={y(accrued(DAYS)) - 14} fill="#9C9A94" fontSize={fs} fontFamily="var(--font-geist-mono)" textAnchor="end">
          at today&apos;s rate
        </text>
      )}
    </svg>
  );
}

export default function Verify() {
  const root = useRef<HTMLElement>(null);
  const total = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const counter = { v: 0 };
        gsap.to(counter, {
          v: realizedTotal,
          duration: 2.2,
          ease: "power4.out",
          onUpdate: () => {
            if (total.current) total.current.textContent = usd(Math.round(counter.v));
          },
          scrollTrigger: { trigger: ".vf-num", start: "top 80%" },
        });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".vf-chart", start: "top 78%", end: "bottom 55%", scrub: 0.8 },
        });
        tl.from(".vf-line", { drawSVG: "0%", ease: "none", duration: 1 })
          .from(".vf-area", { opacity: 0, ease: "none", duration: 0.6 }, 0.2)
          .from(".vf-pin", { scale: 0, transformOrigin: "50% 50%", stagger: 0.18, duration: 0.25, ease: "back.out(2)" }, 0.1)
          .from(".vf-pin-label", { opacity: 0, y: 8, stagger: 0.18, duration: 0.25 }, 0.15)
          .from(".vf-proj", { drawSVG: "0%", ease: "none", duration: 0.3 }, 0.95);

        gsap.from(".vf-receipt", {
          y: 50,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.1,
          scrollTrigger: { trigger: ".vf-receipts", start: "top 85%" },
        });
        gsap.from(".vf-track-after", {
          scaleX: 0,
          transformOrigin: "100% 50%",
          duration: 1.4,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".vf-receipts", start: "top 75%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="savings" aria-labelledby="savings-title" className="section overflow-hidden">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 id="savings-title" className="t-display t-h2 max-w-[14ch]">
              Savings you can audit.
            </h2>
            <p className="t-lead mt-6 max-w-[34rem]">
              A fix only counts once your own telemetry shows the metric moved. Every saving carries its receipt, and
              the part of a forecast that didn&apos;t happen is never booked.
            </p>
          </div>
          <div className="vf-num lg:text-right">
            <p className="flex items-baseline gap-3 lg:justify-end">
              <span ref={total} className="t-meter text-[clamp(4rem,11vw,9.5rem)] leading-[0.85] text-lime">
                {usd(realizedTotal)}
              </span>
              <span className="t-mono text-lg text-fg-3">/mo</span>
            </p>
            <p className="t-mono mt-4 text-[13px] text-fg-2">
              off the bill, verified · {usd(savedToDate)} saved to date · {usd(realizedTotal * 12)} a year at this rate
            </p>
          </div>
        </div>

        <div className="vf-chart relative mt-14 sm:mt-20">
          <SavingsCurve W={1200} H={300} className="hidden sm:block" />
          <SavingsCurve W={380} H={250} compact className="sm:hidden" />
        </div>

        <ul className="vf-receipts mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {RECEIPTS.map((r) => (
            <li key={r.id} className="vf-receipt frame [--ch:18px]">
              <div className="frame-in flex h-full flex-col p-5">
                <p className="t-mono flex items-center justify-between text-[11px] text-fg-3">
                  <span>verified {r.verified}</span>
                  <span className="text-lime">receipt</span>
                </p>
                <h3 className="mt-3 text-[1.02rem] font-semibold leading-snug text-fg">{r.title}</h3>
                <p className="t-mono mt-4 text-[11px] text-fg-3">{r.metric}</p>
                <div className="relative mt-3 h-[3px] bg-fg/10">
                  <span
                    className="vf-track-after absolute inset-y-0 bg-lime"
                    style={{ left: `${r.afterPos * 100}%`, right: `${(1 - r.beforePos) * 100}%` }}
                  />
                  <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-fg bg-ink" style={{ left: `${r.beforePos * 100}%` }} />
                  <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-lime" style={{ left: `${r.afterPos * 100}%` }} />
                </div>
                <p className="t-mono mt-3 flex justify-between text-[12px]">
                  <span className="text-lime">after {r.after}</span>
                  <span className="text-fg-3">before {r.before}</span>
                </p>
                <div className="mt-auto flex items-end justify-between border-t border-[var(--line)] pt-4">
                  <span className="t-meter text-[1.6rem] text-fg">+{usd(r.usd)}</span>
                  <span className="t-mono text-right text-[11px] leading-tight text-fg-3">
                    {Math.round(r.held * 100)}% of forecast
                    <br />
                    held up
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
