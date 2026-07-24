import { cn } from "@/lib/utils";
import { PlanckspaceMark, PlanckspaceLockup } from "@/components/brand/Planckspace";

/**
 * Brand mark and lockup — the "Aperture" artwork from the logo kit
 * (public/planckspace-logo-kit). components/brand/Planckspace.tsx is a verbatim
 * copy of the kit's usage/Planckspace.tsx; re-copy it when the kit is updated
 * and keep site-specific wrapping here.
 *
 * Both inherit `currentColor`, so colour comes from the surrounding text colour
 * — `onDark` just flips that to paper. The lower-right block is the one element
 * that takes the accent.
 *
 * The kit's rule is blue on paper / lime on ink, but this product runs a single
 * accent everywhere and it is brand blue — so blue on both surfaces.
 */

const PAPER = "#F7F5F0";
const BLUE = "#2E6BF2";

export function PlanckMark({
  className,
  onDark = false,
  accent = true,
}: {
  className?: string;
  onDark?: boolean;
  accent?: boolean;
}) {
  return (
    <PlanckspaceMark
      className={className}
      accent={accent ? BLUE : undefined}
      style={onDark ? { color: PAPER } : { color: "var(--ink)" }}
    />
  );
}

/**
 * Full lockup: mark + "Planckspace" wordmark. The wordmark is outlined to paths
 * in the kit, so it renders in the brand's Geist Medium with the correct
 * tracking whether or not Geist has loaded.
 */
export function Logo({
  className,
  height = 28,
  onDark = false,
  accent = true,
}: {
  className?: string;
  /** Height in px. Width follows the lockup's 1738:300 ratio. */
  height?: number;
  onDark?: boolean;
  accent?: boolean;
}) {
  return (
    <PlanckspaceLockup
      className={cn("shrink-0", className)}
      height={height}
      width={Math.round(height * (1738 / 300))}
      accent={accent ? BLUE : undefined}
      style={onDark ? { color: PAPER } : { color: "var(--ink)" }}
    />
  );
}
