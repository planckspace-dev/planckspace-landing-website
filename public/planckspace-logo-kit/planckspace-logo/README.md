# Planckspace — Logo Asset Kit

The "Peek" mark: a white astronaut peeking over a ledger ledge, `//` glint in the visor,
antenna dot for live telemetry, hands gripping the edge. Faded-violet tile, single hue.

Everything here is generated from the master SVG. SVG is the source of truth — prefer it
anywhere it renders; PNGs are for fixed-size contexts (favicons, marketplace, social).

---

## Color

| token | hex | use |
|-------|-----|-----|
| violet 600 | `#5847E5` | primary / visor / accent |
| violet 500 | `#7463F0` | gradient top |
| ink | `#11131A` | mono-ink, wordmark on light |
| white | `#FFFFFF` | the astronaut |
| page | `#F7F8FA` | background behind the mark |

The tile gradient runs `#7463F0` → `#5847E5` (top-left to bottom-right). It's one hue with
depth — never introduce a second background color.

---

## Files

### `/svg` — source of truth (use these in code wherever SVG works)
| file | what it is | where it goes |
|------|------------|---------------|
| `planckspace-mark-master.svg` | the full mark, gradient violet | hero, anywhere large |
| `planckspace-app-icon.svg` | same, framed as app icon | app/PWA icon source |
| `planckspace-favicon.svg` | simplified (no hands/antenna) | favicon source |
| `planckspace-mark-flat.svg` | solid violet, no gradient | email sig, embeds, print |
| `planckspace-mark-mono-white.svg` | white astronaut, ink `//` | dark backgrounds |
| `planckspace-mark-mono-ink.svg` | all ink | single-color light print |
| `planckspace-mark-ink-tile.svg` | dark tile + white astronaut | white pages where violet feels loud |
| `planckspace-glyph-loading.svg` | just the `//`-eyes circle | loading / "thinking" state |
| `planckspace-lockup-dark.svg` | mark + wordmark, dark text | site header on light bg |
| `planckspace-lockup-light.svg` | mark + wordmark, white text | sidebar / footer on dark bg |

### `/png/favicon`
`favicon.ico` (16/32/48/64 multi-res), `favicon-{16,32,48,64,96,192,512}.png`,
`apple-touch-icon.png` (180), plus `favicon-180.png`.

### `/png/app`
`planckspace-app-{128,256,512,1024}.png` — full-color app icons.

### `/extension`
`icon-128.png` (VS Code Marketplace requires exactly 128×128), `icon-256.png` (hi-dpi).

### `/png/social`
`mark-{400,512}.png` — the bare mark for avatars (GitHub, npm, X, LinkedIn).
For an OG/Twitter share card, place `mark-512.png` on a `#F7F8FA` 1200×630 canvas with
the wordmark — that's a layout, build it in the site, not here.

### `/png` (root)
`mono-white-{256,512}.png`, `mono-ink-{256,512}.png`, `flat-{256,512}.png`,
`ink-tile-{256,512}.png`, `glyph-loading-{256,512}.png`,
`planckspace-lockup-{dark,light}.png`.

### root
`site.webmanifest` — drop in `/public`, adjust paths to match your favicon folder.

---

## Drop-in HTML `<head>` (Next.js / any site)

```html
<link rel="icon" href="/favicon/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/favicon/planckspace-favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#5847E5">
```

In Next.js App Router you can instead drop `favicon.ico`, `icon.svg`, and
`apple-icon.png` into `/app` and Next wires them automatically.

---

## VS Code extension (S12)

In the extension's `package.json`:
```json
{ "icon": "icon-128.png" }
```
Use `/extension/icon-128.png`. The Marketplace shows it at 128×128; `icon-256.png` is
there if you want hi-dpi listing art.

For the npm package (`@planckspace/cli`, `@planckspace/core`), npm has no icon field —
the org avatar comes from the npm org settings; upload `png/social/mark-512.png` there.

---

## Sidebar logo (dashboard, R1)

The R1 prompt embeds an inline SVG of the mark. To use these files instead, import
`planckspace-mark-master.svg` for the collapsed (icon-only) state and
`planckspace-lockup-dark.svg` for the expanded state (on the white sidebar).

---

## Don'ts

- Don't recolor the astronaut (always white) or the visor (always violet `#5847E5`).
- Don't add a second background color — the tile is one violet hue.
- Don't stretch the lockup; keep the mark square.
- Don't put the gradient tile on a violet page — use `ink-tile` or `mono` there.
- Keep clear space around the mark equal to ~25% of its width.
