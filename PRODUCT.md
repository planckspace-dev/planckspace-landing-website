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

Precise · structural · quietly confident. The voice of a serious infra tool, not a hype SaaS. Three words: **disciplined, structural, premium.** It should evoke *confidence and clarity* — "these people are serious, and I understand exactly what this does."

## Anti-references

- Generic AI/SaaS template looks. No gradient-text headlines, no purple/blue flooding every element, no pulsing glow buttons, no spinning gradient borders, no loud badge pill on every section.
- Editorial-magazine affectation (display-serif + italic + drop caps + broadsheet grid) — wrong register for an infra tool.
- Anything that reads as surveillance-of-developers. The privacy stance is a feature, surfaced deliberately.

## Design Principles

1. **Discipline over decoration.** One accent (warm cornflower blue) used precisely; the rest is ink / white / structural grey. Restraint is the brand.
2. **Show the product, large.** Real, detailed product mockups (dashboard, terminal, charts) carry the page — "show, don't tell."
3. **Answer "so what?" for each of the three audiences.** Every section earns its place against CTO / manager / developer needs.
4. **Art direction per section.** Each section has its own distinct premium identity; consistency of *voice* beats consistency of *treatment*.
5. **Motion is part of the build, not decoration.** Orchestrated first-load + intentional reveals; ease-out, no bounce; full reduced-motion fallbacks.

## Accessibility & Inclusion

- Body text ≥ 4.5:1 contrast on its background; large/bold text ≥ 3:1. No light-gray-for-elegance body copy.
- Full `prefers-reduced-motion` fallbacks on every animation (crossfade / instant).
- Visible focus states; keyboard-operable nav, tabs, accordion, dialogs (Radix primitives already in use).

## Brand System Notes

- **Theme:** light. Near-black ink on near-white; structural neutrals tinted faintly toward the blue accent.
- **Accent:** warm cornflower / periwinkle blue, `--blue-600 ≈ #4C5EE6`. Functional red/green/amber only inside data-viz.
- **Fonts (committed brand identity — preserved):** Space Grotesk (display + body), Space Mono (labels / code). Identity-preservation overrides the greenfield reflex-reject list.
- **Aesthetic:** "Soft Structuralism" — big tight Space Grotesk, generous whitespace, ultra-diffused blue-tinted shadows, floating cards, glass island nav, hairline borders.
