PLANCKSPACE — LOGO KIT  ·  "Aperture" mark
==========================================
every token your team spends, accounted for

Built from the mark you supplied. The artwork was redrawn as true vector on a
32 × 30 module grid — see GEOMETRY for exactly what changed and why. Open
logo-kit-reference.html in a browser for the visual version of this document;
it is fully self-contained (fonts embedded, no network needed).


CONCEPT
  The outline is one continuous ribbon: up the stem, across the top, down the
  right, and back into the lower block. The channel between the stem and that
  block is the only opening — where the count goes in. Two 45° chamfers give
  the form direction: cost in at the top-left, insight out at the bottom-right.


COLOURS
  ink            #0B0B0C   primary mark and text on light surfaces
  ink soft       #17171B   raised planes and panels on dark surfaces
  paper          #F7F5F0   reversed mark and text on dark surfaces
  brand blue     #2E6BF2   the one accent — light surfaces
  signal lime    #C6FF3D   the one accent — dark surfaces only

  One accent at a time, never both, never a third colour. Lime fails contrast
  on paper — it only works against ink.


TYPE
  Wordmark: Geist Medium, sentence case, −0.037 em tracking, cap height at 56%
  of the mark height. Outlined to paths in every file here, so no asset in this
  kit depends on Geist being installed anywhere.
  Numbers and data elsewhere in the product: Geist Mono.


GEOMETRY — and what changed from the supplied JPEG
  grid        1 module (u) = 10 units; mark = 32u × 30u → viewBox "0 0 320 300"
  weights     stem 6u · top bar 8u · right bar 7u · channel 8.5u
  counter     19u × 12u, opening downward into the channel
  chamfers    top-left 9u, bottom-right 14.5u — both a true 45°
  corners     0.7u radius on the top-right and bottom-left, the two corners the
              chamfers leave behind (measured off your artwork)
  accent      the lower block below the counter line — the only element that
              ever takes a second colour

  Two things were corrected. The supplied chamfers measured 49.1° and 42.0°
  from vertical; both are now 45°. Stroke weights were off-grid by 1–3 px; they
  were snapped while keeping your relative proportions (the top bar stays the
  heaviest, the stem the lightest). Together that moves 3.4% of the pixels —
  93.4% overlap with the original, and nothing you can pick out side by side at
  any size. The untouched sub-pixel trace is kept at
  source/mark-traced-source.svg if you ever want the original angles back.

------------------------------------------------------------------
/svg   scalable, editable, no font dependency
------------------------------------------------------------------
  mark.svg                          primary — ink on light
  mark-paper.svg                    reversed — paper on dark
  mark-blue.svg                     single-colour brand blue
  mark-lime.svg                     single-colour lime (dark surfaces only)
  mark-accent.svg                   ink + blue accent block
  mark-accent-dark.svg              paper + lime accent block
  mark-current.svg                  inherits CSS `color` — use this inside the product
  mark-clearspace.svg               minimum clear space baked in
  favicon.svg                       square, corners sharpened for small sizes
  wordmark.svg / -paper.svg         "Planckspace" only — footers, dense UI
  lockup-horizontal.svg             mark + wordmark — nav, headers, signatures
  lockup-horizontal-dark.svg        same, reversed
  lockup-horizontal-accent.svg      with the blue accent
  lockup-horizontal-accent-dark.svg with the lime accent
  lockup-stacked.svg / -dark.svg    centred stack — square placements, print, swag
  app-icon.svg                      rounded tile — app stores, social avatars
  app-icon-blue.svg                 alternate blue tile
  app-icon-square.svg               unrounded — iOS/Android apply their own mask
  app-icon-maskable.svg             PWA maskable, mark inside the 80% safe circle
  extension-icon.svg                VS Code / Cursor marketplace listing
  extension-icon-blue.svg           alternate marketplace tile
  extension-activitybar.svg         editor sidebar — monochrome, currentColor
  og-card.svg                       Open Graph card source

------------------------------------------------------------------
/png   raster exports
------------------------------------------------------------------
  mark-512 / 1024 / 2048            transparent, for light surfaces
  mark-paper-512 / 1024 / 2048      transparent, for dark surfaces
  mark-accent-1024                  ink + blue
  mark-accent-dark-1024             paper + lime
  favicon-16 / 32 / 48 / 64 / 128   browser tab, bookmark bar
  favicon.ico                       legacy /favicon.ico — holds 16, 32, 48
  apple-touch-icon-180              iOS home screen
  icon-192 / icon-512               PWA manifest, purpose "any"
  maskable-512                      PWA manifest, purpose "maskable"
  app-icon-512 / 1024               stores, avatars
  app-icon-blue-1024                alternate tile
  extension-icon-128 / -128-blue    marketplace
  extension-activitybar-24 / 48     sidebar preview (real thing is currentColor SVG)
  lockup-horizontal-light/dark-1600
  lockup-horizontal-accent-1600 / -accent-dark-1600
  lockup-stacked-light/dark-1200
  wordmark-1200 / wordmark-paper-1200
  og-1200x630                       social share card

------------------------------------------------------------------
/usage   copy straight into the codebase
------------------------------------------------------------------
  brand.css              colour + geometry tokens as CSS custom properties
  head-snippet.html      icon and Open Graph meta tags
  site.webmanifest       PWA manifest, already wired to the icon filenames
  Planckspace.tsx        <PlanckspaceMark /> and <PlanckspaceLockup />, both
                         default to currentColor and take an optional accent

------------------------------------------------------------------
/source   provenance
------------------------------------------------------------------
  mark-traced-source.svg  unmodified sub-pixel trace of the supplied JPEG


WHERE EACH FILE GOES
  Website root      favicon.ico, favicon.svg, apple-touch-icon-180.png,
                    icon-192.png, icon-512.png, maskable-512.png,
                    og-1200x630.png, site.webmanifest
                    → then paste usage/head-snippet.html into <head>
  Web app UI        usage/Planckspace.tsx + usage/brand.css, or
                    svg/mark-current.svg if you'd rather import the file
  Nav / header      lockup-horizontal.svg (swap to -dark on the dark theme)
  CLI / terminal    mark-current.svg, or the 24px sharpened outline
  VS Code / Cursor  extension-icon-128.png for the listing,
                    extension-activitybar.svg for the sidebar — keep it
                    monochrome so the editor can theme it
  App stores        app-icon-1024.png
  Social avatars    app-icon-512.png
  Decks and docs    lockup-horizontal-light-1600.png, lockup-stacked-light-1200.png


USAGE RULES
  · Clear space: 6u on every side — the width of the stem, 18.75% of the mark's
    width. No type, rules or other logos inside that band.
  · Minimum size: 16px wide. At 24px and below use the sharpened outline
    (favicon.svg, or the `sharp` prop) so edges land on whole pixels. Below
    16px use the wordmark instead of the mark.
  · One accent only, and only on the lower block. The body of the mark stays
    ink or paper.
  · Never stretch, rotate, skew, outline, add a shadow, or place the mark
    inside another shape — app-icon.svg exists for that.
  · Lime on ink, blue on paper. Not the other way round.
  · The activity-bar icon must stay monochrome currentColor so VS Code and
    Cursor can theme it for light and dark editors.

Need a camel-case "PlanckSpace" wordmark, a monogram crop, an animated SVG for
the site hero, or extra sizes? All quick additions.
