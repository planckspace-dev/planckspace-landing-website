import { cn } from "@/lib/utils";
import { PlanckspaceMark, PlanckspaceLockup } from "@/components/brand/Planckspace";

/**
 * Brand mark and lockup from the Aperture kit (components/brand/Planckspace.tsx
 * is the kit's usage file, copied verbatim).
 *
 * The kit's rule is one accent at a time, on the lower block only: blue on
 * paper, lime on ink. The site is light, so the default tone is the kit's
 * "accent" lockup, an ink mark with a brand-blue block. `tone="dark"` (paper
 * and lime) is kept for the studio film, which is still drawn on ink.
 */

export const INK = "#0C0C0C";
export const BLUE = "#2E6BF2";
export const PAPER = "#F7F5F0";
export const LIME = "#C6FF3D";

type Tone = "light" | "dark";

const toneOf = (tone: Tone) => (tone === "dark" ? { color: PAPER, accent: LIME } : { color: INK, accent: BLUE });

export function PlanckMark({ className, accent = true, tone = "light" }: { className?: string; accent?: boolean; tone?: Tone }) {
  const t = toneOf(tone);
  return <PlanckspaceMark className={className} accent={accent ? t.accent : undefined} style={{ color: t.color }} />;
}

/** Full lockup. The wordmark is outlined in the kit, so it renders in Geist Medium whether or not the font has loaded. */
export function Logo({
  className,
  height = 24,
  accent = true,
  tone = "light",
}: {
  className?: string;
  height?: number;
  accent?: boolean;
  tone?: Tone;
}) {
  const t = toneOf(tone);
  return (
    <PlanckspaceLockup
      className={cn("shrink-0", className)}
      height={height}
      width={Math.round(height * (1738 / 300))}
      accent={accent ? t.accent : undefined}
      style={{ color: t.color }}
    />
  );
}
