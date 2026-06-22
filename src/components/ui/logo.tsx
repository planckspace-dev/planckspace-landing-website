import { cn } from "@/lib/utils";

/**
 * Brand mark — the PlanckSpace bot glyph, recolored from the legacy violet kit
 * to the current warm-blue palette (#6175EE → #3A45C7). Inline SVG so it scales
 * crisply and inherits sizing from className.
 */
export function PlanckMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="PlanckSpace">
      <defs>
        <linearGradient id="pmark-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6175EE" />
          <stop offset="1" stopColor="#3A45C7" />
        </linearGradient>
        <clipPath id="pmark-clip">
          <rect width="100" height="100" rx="24" />
        </clipPath>
      </defs>
      <rect width="100" height="100" rx="24" fill="url(#pmark-grad)" />
      <g clipPath="url(#pmark-clip)">
        <circle cx="50" cy="45" r="24" fill="#FFFFFF" />
        <rect y="64" width="100" height="36" fill="#FFFFFF" opacity="0.14" />
        <rect x="29" y="60" width="11" height="9" rx="4.5" fill="#FFFFFF" />
        <rect x="60" y="60" width="11" height="9" rx="4.5" fill="#FFFFFF" />
      </g>
      <rect x="31" y="38" width="38" height="16" rx="8" fill="#2C349C" />
      <line x1="45" y1="50.5" x2="49" y2="41.5" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="50.5" x2="56" y2="41.5" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="21" x2="50" y2="14" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="50" cy="11" r="3.2" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * Full lockup: mark + "PlanckSpace" wordmark set in the brand sans. The wordmark
 * is real text (proper casing, crisp at any size) instead of a baked-in image.
 */
export function Logo({
  className,
  markClassName = "w-8 h-8",
  textClassName = "text-[18px]",
  onDark = false,
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  onDark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <PlanckMark className={cn("shrink-0", markClassName)} />
      <span
        className={cn(
          "font-bold tracking-[-0.02em] leading-none",
          onDark ? "text-white" : "text-[var(--ink)]",
          textClassName,
        )}
      >
        PlanckSpace
      </span>
    </span>
  );
}
