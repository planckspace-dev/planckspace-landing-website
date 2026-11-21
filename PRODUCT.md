# Product

## Register

brand

## Users

Three audiences land on this page, and each must "get it" within one fold:
- **Engineering leaders (CTOs / VPs / founders)** — accountable for AI tooling spend, want ROI visibility without policing developers.
- **Eng managers** — need per-team / per-repo cost accountability and waste signals.
- **Developers** — skeptical of surveillance; need reassurance this tracks *spend*, never code or prompts.

Context: evaluating PlanckSpace during a budgeting or tool-rationalization moment. Often arriving from a founder share, a YC-adjacent channel, or a "how much are we spending on Claude Code / Cursor?" search.

## Product Purpose

PlanckSpace is an AI-coding spend-management platform. It tracks token usage across Claude Code, Cursor, and Windsurf and the API keys behind them, and surfaces it in one shared ledger — giving teams cost visibility, waste detection, one-click fixes and measured savings **without their prompts or code ever leaving the machine**. Products: a CLI, an editor extension, a web console, and a backend.

Success for this landing page: a visitor immediately understands what PlanckSpace does and its value, and the surface reads at a Navigara / Linear / Stripe quality bar. Depth lives in the docs (`/docs`), not on the home page.

## Brand Personality

Precise · premium · calm. The voice of a serious infra tool with one idea: **every token, accounted for.** Three words: **exact, calm, confident.** Type does most of the work, at a size that carries the page; numbers are set like a ledger; one image, the Aperture, gives the page its light.

## Anti-references

- **Screens of the console.** The site never pictures the product UI (no dashboard replicas, no chart walls, no sneak peeks). It speaks in the product's artefacts instead: ledger rows, a priced finding, a one-line diff, a booked saving, a terminal's printout. (The 2026-10-28 "Daylight" site rebuilt the console on the page; retired 2026-10-29 as giving away too much.)
- **A wall of paper.** The 2026-10-29 "Ledger" site was paper from top to bottom with one dark panel. On 2026-11-21 it was judged too plain: no imagery, no large type, no colour contrast. The page needs a picture, headlines that carry it, and sections that differ in tone.
- Generic AI/SaaS template looks: gradient-text headlines, purple/blue glow, spinning borders, identical icon-card grids, decorative gradient washes. The site's one image is a rendered scene with a hard edge and a reason (the mark, as a window); it is never a glow blob, a particle wave or a mesh gradient.
- Glass on paper. Glass is for UI that floats over the image or a colour field (the nav island, the hero's chip and tools row, the ledger strip on the blue field, the terminal on the night panel). On paper, surfaces stay solid.
- "Funky" art direction: scroll-jacking, pinned horizontal pans, display faces that animate, novelty geometry.
- Editorial-magazine affectation (display serif + italic + drop caps) — wrong register.
- Anything that reads as surveillance of developers. The privacy stance is a feature, surfaced deliberately, in transmission terms ("never leaves your machine"), never capability terms ("we never see your code").
- Fake precision: every number on the site comes from one coherent sample workspace (`src/lib/sample.ts`), is labelled as a sample, and adds up.

## Design Principles

1. **The promise and the picture.** The hero is the headline at full size, two actions, and one image: the Aperture, a dark room with a window of blue light in the outline of the mark, shown whole. Nothing is layered on the picture: no card, no mock, no floating chips. (Until 2026-11-21 a printed receipt stood in front of it as "the artefact"; it was removed as looking bad, and it hid the image.) The product's artefacts live in the sections below.
2. **Statement, then four moves.** After the hero, one two-tone statement and the loop in four blocks — Measure, Find, Fix, Prove — each with one exhibit (a ledger, a figure, a diff, a booked row) and each in the colour of its meaning: blue measures, coral is waste found, ink is the fix (the one night cell), green is the saving.
3. **Two ledgers, always.** Billed dollars lead; usage value wears its own label and is never added in. Recoverable figures count only the live finding types, exactly what `planck init` prints.
4. **The docs carry the depth.** Every block links to the page that explains how its number is computed. The home page persuades; the docs prove.
5. **Calm motion.** One curve everywhere (expo-out): 160 ms for hover and focus feedback, 600–700 ms for things that enter. One quiet entrance per block (a 14px rise); in the hero the two headline lines rise one after the other. The terminal prints line by line once, and the key figures roll into place once, like a meter (the product's verb). One primary button per screen leans a few pixels toward the pointer; one neutral light follows the pointer across the ledger strip on the blue field. Native scrolling. No loops, no hover transforms on cards, no animated layout properties. The image does not move.
6. **Contrast is structure.** The page changes tone as the argument does: night (hero) → paper (Platform) → one blue field (Proof) → paper holding a night panel (Setup) → a white/black split (Privacy: what is sent, and what stays in the dark) → band (Roles) → paper (FAQ) → night (the close and the footer, which bookend the hero). Colour changes separate the sections; there are no rules between them.

## Accessibility & Inclusion

- Body `#3C3E43` on the paper `#FAFAF8` is 10.6:1; `muted` `#6B6D72` is the floor for small text (5.1:1). The grey second clause of a headline (`#8F9196`) appears only at display sizes (3:1+ for large text).
- On night `#06080D`: reading text `#B8BCC6` is 10.5:1, quiet text `#8F94A1` is 6.6:1; a headline's second clause takes the light's blue `#9DBCFB`. On the blue field the base is `#1F55D0` (white is 6.5:1); small text stays off its lightest corner. Text over the image is measured on the rendered pixels, not assumed.
- The nav island carries its own tone: dark glass with white text over any section marked `data-nav="dark"`, light glass with ink text over paper. It is dense enough (74%) that its text holds when it crosses something white.
- Reveal-on-scroll hides content only after `<html data-js>` is set by an inline script, so without script everything is on the page.
- Full `prefers-reduced-motion` support: no travel on reveals, the terminal appears whole.
- Focus is a 2px brand-500 ring on paper, a lighter blue on night, white on the blue field. The nav menus are Radix NavigationMenu (keyboard and ARIA built in); the phone menu is a Radix Dialog (focus trapped, Escape closes).
- Every single-column grid is explicit (`grid-cols-1`, a `minmax(0,1fr)` track), so long mono lines can never widen the page on phones.

## Brand System Notes ("Ledger, lit", since 2026-11-21)

The 2026-10-29 "Ledger" system (paper, ink, one blue, inspired by navigara.com's restraint) with a light source added. Paper sections are unchanged in kind; what is new is night, one blue field, glass over both, the image, and a much larger type scale.

- **Paper:** page `#FAFAF8`, bands `#F3F2EE`, white cards with a 1px `#E5E4DF` line and a faint warm shadow. Ink `#0E1013` for headlines and primary buttons. **Brand blue `#2E6BF2` is the one accent** (links, focus, the mark's block). Green = saved, measured; coral = waste you can cut; amber hatch = usage value.
- **Night:** `#06080D` (`bg-night`), the room the light falls into: the hero, the Fix cell, the Setup panel, the "never sent" half of Privacy, the close and the footer. Put `.on-night` on the container: it re-points the palette's own variables, so `text-ink`, `text-muted`, `border-line`, `.lede`, `.tone`, links and pills read correctly without a second set of classes; `.on-paper` puts paper back for an island inside it (the savings table). Buttons invert there (white primary, glass secondary). `.grain` adds film grain at runtime. All of it lives in `src/app/aperture.css`.
- **The blue field:** `.field-cobalt` (Proof), `#1F55D0` rising to `#2E6BF2` in one corner under a white dot lattice. The one loud colour moment: one glass ledger strip (the four rules as columns divided by hairlines, not four cards) and a white table on it.
- **Glass:** `.glass`, white at 5–11% over a 22px blur, a hairline and one top highlight. Only over the image or a colour field. Larger glass cards use a double bezel (a glass shell holding a darker core at a concentric radius). Keep the count low: a blurred backdrop is repainted while the page scrolls.
- **The image ("Aperture"):** a dark gallery room; in the far wall an opening in the outline of the mark; blue-hour sky through it, stars on the mark's own module grid; a polished floor that mirrors it. Rendered procedurally and deterministically by `scripts/art/aperture.mjs` (plain Node + sharp, no extra dependency): `node scripts/art/aperture.mjs [variant…]`. Variants: `hero` (landscape and portrait), `close` (the whole mark, seen from further back; landscape and portrait) and `corner` (the Setup panel). Files are pre-encoded AVIF + WebP in `public/art/`, served by `src/components/site/ApertureArt.tsx` (a `<picture>`, not next/image: the optimizer's re-encode bands the dark gradients). No stock imagery, and no second image family.
- **Type:** Geist. Headlines are large and tight: the hero `.display` runs to 6.875rem (660 / −0.055em; capped so the image keeps its size inside the page column), `.title-xl` to 6.25rem, `.title-lg` to 5rem, `.title-md` to 2.5rem, the closing `.title-close` to 8.5rem; key figures are set at display size (`.fig-display`, `.fig-lg`). A headline's second clause steps back (`<span class="tone">`): grey on paper, the light's blue `#9DBCFB` on night, white at 68% on the blue field. Never gradient text. Geist Mono for figures, commands and the small labels (`.eyebrow`), which are sentence case at zero tracking: there is no uppercase on the site. Figures are tabular and in one format (`$13,520`, `/mo` where monthly). Small text never takes negative tracking.
- **One column:** the nav island, the hero, every section and the footer share two edges at every width: `min(100% − 2 × gutter, 77rem)`, centred. The hero text starts on the island's left edge and the image's opening ends on its right edge; the gap after "accounted for." is constant, so the opening's size is what is left.
- **Geometry:** everything on a 4px grid. Pill buttons (fully rounded, 44–48px), 20–28px cards, 18px exhibits inside them; nested radii add up (the terminal's shell is 28, its padding 8, its core 20). Icons are lucide at stroke 1.5: 16px inline with text, 18px standalone or in buttons. The 45° chamfer belongs to the mark and to the image; UI corners stay round.
- **Nav:** a floating glass island (`src/components/site/Navbar.tsx`, `src/app/nav.css`), detached from the top edge. It turns dark over any section carrying `data-nav="dark"` and light over paper, by IntersectionObserver; a page that opens on night passes `initialTone="dark"` so the first paint is right. The menu panel and the phone sheet are solid paper in both tones.
- **Logo:** the Aperture kit's lockup. On paper, an ink mark with the brand-blue accent block; on night, a paper mark with a lighter blue block (`#4C80F6`). Lime is not used on this site.
- **Borrowed parts:** three React Bits components (reactbits.dev; MIT + Commons Clause, see `src/components/reactbits/LICENSE.md`), each adapted and documented in its file header: `CountUp` in roll mode (the server render and the no-JS page always show the final figure; the roll is an aria-hidden overlay; `motion` was removed, so there is no new dependency), `SpotlightCard` (one neutral light, fine pointers only) and `Magnet` (4px at most; `<Button magnetic>`). To add another, read `https://reactbits.dev/r/<Name>-TS-TW.json` and copy the file in; do not run `shadcn init`, which rewrites `globals.css`.
- **unslop:** the `unslop` skill (heydamir/unslop, CC BY 4.0) is installed at `.claude/skills/unslop` and was run in polish mode on 2026-11-21. Standing rulings where its rules meet ours: glass and grain stay (the founder asked for glass); full-sentence headlines keep their periods (the tagline is written with one), while labels, buttons and captions never end in one; headline weights stay; uppercase tracked labels, badges-in-pills, coloured glows and rows of identical cards do not come back.
- **Docs:** Fumadocs (notebook layout) at `/docs`, light only, on the same palette through the `--color-fd-*` tokens in `globals.css`. Content is MDX in `content/docs/`, ordered by each folder's `meta.json`.
- **Media:** the 40 s product tour (`public/media/planckspace-tour.*`) is no longer linked from the page (its button became Documentation). The OG card (`public/og.png`) is still the share image and is still in the old dark-and-lime system; it has not been redrawn for "Ledger, lit". The dev-only `/studio` route renders both; its styles are scoped to `html[data-film]` in `src/app/studio/film.css`.
