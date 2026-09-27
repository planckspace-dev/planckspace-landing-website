import { cn } from "@/lib/utils";
import { PlanckspaceMark, PlanckspaceLockup } from "@/components/brand/Planckspace";

/**
 * Brand mark and lockup from the Aperture kit (components/brand/Planckspace.tsx
 * is the kit's usage file, copied verbatim).
 *
 * The site is built on the kit's dark system, so the default is the kit's
 * "accent dark" lockup: paper mark, signal-lime lower block. The kit's rule is
 * lime on ink only, which is the only surface this site puts the mark on.
 */

export const PAPER = "#F7F5F0";
export const LIME = "#C6FF3D";

export function PlanckMark({ className, accent = true }: { className?: string; accent?: boolean }) {
  return <PlanckspaceMark className={className} accent={accent ? LIME : undefined} style={{ color: PAPER }} />;
}

/** Full lockup. The wordmark is outlined in the kit, so it renders in Geist Medium whether or not the font has loaded. */
export function Logo({ className, height = 26, accent = true }: { className?: string; height?: number; accent?: boolean }) {
  return (
    <PlanckspaceLockup
      className={cn("shrink-0", className)}
      height={height}
      width={Math.round(height * (1738 / 300))}
      accent={accent ? LIME : undefined}
      style={{ color: PAPER }}
    />
  );
}
