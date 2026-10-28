import { RECEIPTS, SAVINGS_DAYS, accrued, savedToDate, usd } from "@/lib/sample";

/* The savings curve as the tour film draws it, in the dark "Signal" system
   (ink, paper, lime). The line is the booked total from lib/sample; the
   dashed tail continues it at the same booking rules. The site's own chart
   is sections/Verify.tsx. */

const PROJ = 22;
const DAYS = SAVINGS_DAYS + PROJ;
const MAX = accrued(DAYS) * 1.06;
const TICKS = [
  { d: 0, l: "Sep 1" },
  { d: 14, l: "Sep 15" },
  { d: 30, l: "Oct 1" },
  { d: 44, l: "Oct 15" },
  { d: SAVINGS_DAYS, l: "Today" },
];

export function SavingsCurve({ W, H, compact, className }: { W: number; H: number; compact?: boolean; className?: string }) {
  const base = H - 26;
  const x = (d: number) => (d / DAYS) * W;
  const y = (v: number) => base - (v / MAX) * (H - 50);
  const line = Array.from({ length: SAVINGS_DAYS + 1 }, (_, d) => `${d ? "L" : "M"}${x(d).toFixed(1)},${y(accrued(d)).toFixed(1)}`).join(" ");
  const area = `${line} L${x(SAVINGS_DAYS)},${base} L0,${base} Z`;
  const proj = `M${x(SAVINGS_DAYS)},${y(accrued(SAVINGS_DAYS))} L${x(DAYS)},${y(accrued(DAYS))}`;
  const fs = compact ? 11 : 12.5;
  const ticks = compact ? TICKS.filter((t) => t.d === 0 || t.d === 30 || t.d === SAVINGS_DAYS) : TICKS;
  const fill = compact ? "vf-fill-sm" : "vf-fill";
  const dots = compact ? "vf-dots-sm" : "vf-dots";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`block h-auto w-full overflow-visible ${className ?? ""}`}
      role="img"
      aria-label={`Example workspace: cumulative booked savings since September 1, reaching ${usd(savedToDate)} today, with four fixes marked.`}
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
                  confirmed {r.verified}
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
          at the same rules
        </text>
      )}
    </svg>
  );
}
