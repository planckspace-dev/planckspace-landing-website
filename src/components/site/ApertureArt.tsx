import type { CSSProperties } from "react";
import { preload as preloadResource } from "react-dom";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────
   Aperture: the site's light. A dark gallery room; in the far wall, an
   opening in the outline of the mark; blue-hour sky through it, stars on
   the mark's module grid, a polished floor that mirrors it all into night.
   Rendered by scripts/art/aperture.mjs (deterministic, seeded); the files
   live in public/art.

   Decorative: it fills its positioned parent (absolute, inset 0) and is
   hidden from assistive tech. Under 640px a variant with a portrait render
   swaps to it.

   Pre-encoded, not next/image. These are dark, smooth gradients whose only
   defence against banding is a one-step dither; the optimizer's default
   quality (and its 4:2:0 AVIF) would average that away and band, and an
   on-demand AVIF encode of a 4600px LCP image would land on the first
   visitor. So the encoder settings are chosen per file, checked by eye, and
   every width is rendered natively for the box the layout draws: the stars
   and dots sit on a regular pitch, and a file scaled by much more than ~0.8
   would make that pitch beat against the screen's pixels (moiré). Keep
   `widths` and `sizes` in step with the boxes in aperture.css and
   globals.css (.hero-art, .close-art, .corner-art).
   ───────────────────────────────────────────────────────────────────────── */

type Variant = "hero" | "close" | "corner";

interface Render {
  /** file stem in /art: `${file}-${width}.${avif|webp}` */
  file: string;
  /** intrinsic size of the master */
  w: number;
  h: number;
  /** encoded widths, ascending */
  widths: number[];
  /** the `sizes` the layout renders it at */
  sizes: string;
}

interface Art {
  landscape: Render;
  portrait?: Render;
  /** object-position for the fill */
  position: string;
  portraitPosition?: string;
}

/* Under 640px: the portrait render, where a variant has one. */
const PHONE = "(max-width: 639.98px)";
const WIDE = "(min-width: 640px)";

const ART: Record<Variant, Art> = {
  hero: {
    // ≥1024: the opening spans the island's row past the headline, so the
    // frame is 2300/531 × (column − 6.93 × headline), the column being
    // min(100vw − 2 × gutter, 77rem) and the headline min(7.4vw, 15vh, 110px).
    // 640–1023: a 4:3 box the screen's width, the render fitted by height
    // (192vw), cropped to centre the opening. Phones: the portrait, in a box
    // with its own proportions.
    landscape: {
      file: "aperture-hero",
      w: 4600,
      h: 1800,
      widths: [1400, 1800, 2300, 2900, 3600, 4600],
      sizes: "(min-width: 1024px) calc(4.33 * (min(100vw - 96px, 1232px) - 6.93 * min(7.4vw, 15vh, 110px))), 192vw",
    },
    portrait: { file: "aperture-hero-portrait", w: 1290, h: 1920, widths: [480, 860, 1290], sizes: "100vw" },
    position: "88% 0%",
    portraitPosition: "50% 0%",
  },
  close: {
    // .close-art: 4:3 at clamp(40rem, 76vw, 74rem) from 640px; 1:2 at 100vw below.
    landscape: {
      file: "aperture-close",
      w: 2400,
      h: 1800,
      widths: [720, 960, 1200, 1440, 1920, 2400],
      sizes: "(min-width: 1558px) 1184px, (min-width: 842px) 76vw, 640px",
    },
    portrait: { file: "aperture-close-portrait", w: 1290, h: 2580, widths: [400, 640, 860, 1290], sizes: "100vw" },
    position: "50% 50%",
  },
  corner: {
    // .corner-art (globals.css): from 1024px it is about 1.8× the Setup
    // panel's width (the panel is the page column, 77rem at most); below,
    // 185% of the panel's width.
    landscape: {
      file: "aperture-corner",
      w: 3400,
      h: 1915,
      widths: [1400, 1760, 2200, 2800, 3400],
      sizes: "(min-width: 1024px) calc(1.8 * min(100vw - 96px, 1232px)), 175vw",
    },
    position: "100% 0%",
  },
};

const srcSet = (r: Render, ext: "avif" | "webp") => r.widths.map((w) => `/art/${r.file}-${w}.${ext} ${w}w`).join(", ");
const mid = (r: Render, ext: "avif" | "webp") => `/art/${r.file}-${r.widths[Math.floor(r.widths.length / 2)]}.${ext}`;

export default function ApertureArt({
  variant,
  className,
  preload = false,
  style,
}: {
  variant: Variant;
  className?: string;
  /** The LCP image: preload it in <head> (AVIF, one hint per art-directed source) and fetch it eagerly. */
  preload?: boolean;
  style?: CSSProperties;
}) {
  const { landscape, portrait, position, portraitPosition } = ART[variant];

  if (preload) {
    if (portrait) {
      preloadResource(mid(portrait, "avif"), {
        as: "image",
        type: "image/avif",
        imageSrcSet: srcSet(portrait, "avif"),
        imageSizes: portrait.sizes,
        media: PHONE,
        fetchPriority: "high",
      });
    }
    preloadResource(mid(landscape, "avif"), {
      as: "image",
      type: "image/avif",
      imageSrcSet: srcSet(landscape, "avif"),
      imageSizes: landscape.sizes,
      media: portrait ? WIDE : undefined,
      fetchPriority: "high",
    });
  }

  return (
    <picture className={cn("pointer-events-none absolute inset-0 block select-none", className)} style={style}>
      {portrait && <source type="image/avif" media={PHONE} srcSet={srcSet(portrait, "avif")} sizes={portrait.sizes} width={portrait.w} height={portrait.h} />}
      {portrait && <source type="image/webp" media={PHONE} srcSet={srcSet(portrait, "webp")} sizes={portrait.sizes} width={portrait.w} height={portrait.h} />}
      <source type="image/avif" srcSet={srcSet(landscape, "avif")} sizes={landscape.sizes} />
      <img
        src={mid(landscape, "webp")}
        srcSet={srcSet(landscape, "webp")}
        sizes={landscape.sizes}
        width={landscape.w}
        height={landscape.h}
        alt=""
        aria-hidden
        draggable={false}
        decoding="async"
        loading={preload ? "eager" : "lazy"}
        fetchPriority={preload ? "high" : "auto"}
        className="aperture-art h-full w-full object-cover"
        style={
          {
            "--art-pos": position,
            "--art-pos-portrait": portraitPosition ?? position,
          } as CSSProperties
        }
      />
    </picture>
  );
}
