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

PlanckSpace is an AI-coding spend-management platform. It tracks token usage across Claude Code, Cursor, and Windsurf and surfaces it in one shared dashboard — giving teams cost visibility, waste detection, and ROI insight **without touching code or prompts**. Products: a CLI, a VS Code extension, a web dashboard, and a backend.

Success for this landing page: a visitor immediately understands what PlanckSpace does and its value, and the surface reads at a YC-application / Linear-Stripe-Vercel quality bar.

## Brand Personality

Precise · instrument-grade · bold. The voice of a serious infra tool that is also unafraid to be loud about its one idea: **every token, accounted for.** Three words: **exact, kinetic, confident.** It should evoke switching on a precision instrument: invisible spend becomes visible, and it is satisfying to watch.

## Anti-references

- Generic AI/SaaS template looks: gradient-text headlines, purple/blue glow, spinning borders, identical icon-card grids, an eyebrow above every section.
- White, text-heavy pages (the pre-2026-09-27 site). Every section carries a visual: product UI, a live figure, WebGL or a diagram.
- Editorial-magazine affectation (display serif + italic + drop caps) — wrong register.
- Anything that reads as surveillance of developers. The privacy stance is a feature, surfaced deliberately.
- Fake precision: every number on the site comes from one coherent sample workspace (`src/lib/sample.ts`) and is labelled as such.

## Design Principles

1. **One idea, drawn.** Tokens pour in, the Aperture mark counts them, a ledger forms. The hero shows the product's job before a word is read.
2. **Show the real product, faithfully.** Product surfaces are native rebuilds of the app's UI 2.0 (its tokens live under `.app` in globals.css), not screenshots, and follow its number rules: billed dollars lead, imputed figures wear a tag.
3. **Measure, find, fix, verify.** The page follows the product's own loop, in that order.
4. **Art direction per section, one voice.** Each chapter gets its own set piece (console tilt, lime poster, horizontal pan, live fix film, savings curve, privacy gate, bento, accordion).
5. **Motion is the build.** GSAP ScrollTrigger + Lenis, width-axis type animation, one deterministic timeline per film. Every animation has a reduced-motion state and content is visible without script.

## Accessibility & Inclusion

- Body text ≥ 4.5:1 (fg-3 #9C9A94 is the floor for small text on ink); lime on ink and ink on lime are ~16:1.
- Full `prefers-reduced-motion` fallbacks: the WebGL scene draws one still frame, loops rest on a settled frame, Lenis goes 1:1.
- Chamfered controls are clipped, so focus is an inset lime ring inside the shape (outlines would be clipped).
- Loops longer than 5 s have a pause control (the fix film).

## Brand System Notes ("Signal", since 2026-09-27)

- **Theme:** dark. The logo kit's own dark system: ink `#0B0B0C` surfaces, paper `#F7F5F0` type, **signal lime `#C6FF3D` as the single accent**. One deliberate colour block: the lime poster.
- **Type:** Science Gothic (display, variable width 50–200; headlines animate along `--wdth`, registered with `@property`), Doto (dot-matrix, only for counted numbers), Geist + Geist Mono (everything read; matches the app and wordmark).
- **Geometry:** square corners everywhere; pressable and framed things carry the mark's 45° chamfer (`.ch-br`, `.frame`). Buttons wipe at 45° on hover and roll their label.
- **Media:** WebGL token stream (hero + final CTA), a 50 s product tour rendered from the site's own components (`/studio`, dev-only), OG card rendered the same way.
