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

Precise · premium · calm. The voice of a serious infra tool with one idea: **every token, accounted for.** Three words: **exact, calm, confident.** Type does most of the work; numbers are set like a ledger.

## Anti-references

- **Screens of the console.** The site never pictures the product UI (no dashboard replicas, no chart walls, no sneak peeks). It speaks in the product's artefacts instead: an itemized receipt, ledger rows, a one-line diff, a booked saving. (The 2026-10-28 "Daylight" site rebuilt the console on the page; retired 2026-10-29 as giving away too much.)
- Generic AI/SaaS template looks: gradient-text headlines, purple/blue glow, spinning borders, identical icon-card grids, decorative gradient washes.
- "Funky" art direction: scroll-jacking, pinned horizontal pans, display faces that animate, novelty geometry.
- Editorial-magazine affectation (display serif + italic + drop caps) — wrong register.
- Anything that reads as surveillance of developers. The privacy stance is a feature, surfaced deliberately, in transmission terms ("never leaves your machine"), never capability terms ("we never see your code").
- Fake precision: every number on the site comes from one coherent sample workspace (`src/lib/sample.ts`), is labelled as a sample, and adds up.

## Design Principles

1. **The artefact is the hero.** The first picture is a month itemized as a printed receipt: billed lines that add up, usage value set apart, waste priced per month, and the saving that was booked. It is the product's idea, not its screen.
2. **Statement, then four moves.** After the hero, one two-tone statement and the loop in four blocks — Measure, Find, Fix, Prove — each with one small exhibit (a ledger, a figure, a diff, a booked row).
3. **Two ledgers, always.** Billed dollars lead; usage value wears its own label and is never added in. Recoverable figures count only the live finding types, exactly what `planck init` prints.
4. **The docs carry the depth.** Every block links to the page that explains how its number is computed. The home page persuades; the docs prove.
5. **Calm motion.** One quiet entrance per block (600–700 ms, expo-out, 14px rise), the receipt and the terminal print line by line once. Native scrolling. No loops.

## Accessibility & Inclusion

- Body `#3C3E43` on the paper `#FAFAF8` is 10.6:1; `muted` `#6B6D72` is the floor for small text (5.1:1). The grey second clause of a headline (`#8F9196`) appears only at display sizes (3:1+ for large text).
- Reveal-on-scroll hides content only after `<html data-js>` is set by an inline script, so without script everything is on the page.
- Full `prefers-reduced-motion` support: no travel on reveals, the receipt and terminal appear whole.
- Focus is a 2px brand-500 ring. The nav menus are Radix NavigationMenu (keyboard and ARIA built in); the phone menu is a Radix Dialog (focus trapped, Escape closes).
- Every single-column grid is explicit (`grid-cols-1`, a `minmax(0,1fr)` track), so long mono lines can never widen the page on phones.

## Brand System Notes ("Ledger", since 2026-10-29)

- **Theme:** light paper and ink, inspired by navigara.com's restraint. Page `#FAFAF8`, bands `#F3F2EE`, white cards with a 1px `#E5E4DF` line and a faint warm shadow. Ink `#0E1013` for headlines and primary buttons. **Brand blue `#2E6BF2` is the one accent** (links, focus, the mark's block). Green = saved, measured; coral = waste you can cut; amber hatch = usage value.
- **Type:** Geist, bold and tight for headlines (`.display` 680 / −0.052em, `.title-lg` 650 / −0.04em); a headline's second clause drops to grey (`<span class="tone">`). Feature titles at 520 weight. Geist Mono for figures, commands and the small uppercase labels (`.eyebrow`) — the only uppercase on the site.
- **Geometry:** pill buttons (fully rounded, 44–50px), 20–28px cards, 18px exhibits inside them. Hairline rules between sections.
- **One dark moment:** the setup panel (`.panel-ink`) with the terminal. Everything else is paper.
- **Logo:** the Aperture kit's light lockup, an ink mark with a brand-blue accent block.
- **Docs:** Fumadocs (notebook layout) at `/docs`, light only, on the same palette through the `--color-fd-*` tokens in `globals.css`. Content is MDX in `content/docs/`, ordered by each folder's `meta.json`.
- **Media:** the 40 s product tour (`public/media/planckspace-tour.*`) is no longer linked from the page (its button became Documentation). The OG card (`public/og.png`) is still the share image and is still in the old dark system. The dev-only `/studio` route renders both; its styles are scoped to `html[data-film]` in `src/app/studio/film.css`.
