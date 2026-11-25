import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { ArrowRight, BookOpen, Boxes, Lock } from "lucide-react";
import { AnthropicLogo, ClaudeLogo, CursorLogo, OpenAILogo, WindsurfLogo } from "@/components/brand/ToolLogos";
import ApertureArt from "@/components/site/ApertureArt";
import Button from "@/components/site/Button";
import Reveal from "@/components/site/Reveal";
import { DEMO_PATH } from "@/lib/plans";

/* ─────────────────────────────────────────────────────────────────────────
   The promise, in one line, and the light it stands in. Two actions: a
   demo, or the docs for anyone who would rather read how every figure is
   computed first. Under it, the tools it works with.

   Staged at night: the Aperture render (an opening in the shape of the mark,
   lit by blue hour, stars on its module grid) is the picture, whole and
   unobstructed. From 1024px it stands to the right of the headline, its
   top-left chamfer pointing at it, and the hero is one screen tall with the
   tools as a strip of glass over the floor's reflection. Below that: the
   copy, then the picture, then the tools over its reflection. Layout of the
   art and the stage: .hero-* in aperture.css.
   ───────────────────────────────────────────────────────────────────────── */

const TOOLS: { name: string; Logo: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { name: "Claude Code", Logo: ClaudeLogo },
  { name: "Cursor", Logo: CursorLogo },
  { name: "Windsurf", Logo: WindsurfLogo },
  { name: "Anthropic API", Logo: AnthropicLogo },
  { name: "OpenAI API", Logo: OpenAILogo },
  { name: "Amazon Bedrock", Logo: Boxes },
];

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" data-nav="dark" className="hero on-night grain bg-night">
      <div aria-hidden className="hero-scrim" />

      <div className="hero-copy hero-wrap hero-layer">
        <Reveal>
          <Link
            href="/docs/concepts/proof-of-savings"
            className="glass group inline-flex items-center gap-3 rounded-full px-4 py-2 text-[0.8125rem] leading-5 text-body transition-colors hover:text-ink"
          >
            <span className="hero-chip-new">New</span>
            <span>
              Proof of savings<span className="hidden sm:inline">: see what each fix really saved</span>
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-muted transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2} />
          </Link>

          <h1 id="hero-title" className="display mt-8">
            <span className="hero-line">Every token,</span>{" "}
            <span className="hero-line tone">accounted for.</span>
          </h1>

          <p className="lede hero-lede mt-8">
            PlanckSpace shows you where your team&apos;s AI coding money goes: Claude Code, Cursor and every API key. It finds the waste, fixes it
            in one click, and proves what you saved.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href={DEMO_PATH} size="lg" magnetic>
              Book a demo
            </Button>
            <Button href="/docs" size="lg" variant="secondary" icon={<BookOpen className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />}>
              Documentation
            </Button>
          </div>

          <p className="mt-8 flex items-center gap-2 text-[0.875rem] text-body">
            <Lock className="h-3.5 w-3.5 shrink-0 text-muted" strokeWidth={2} />
            Usage data only. Your prompts and code are never sent to PlanckSpace.
          </p>
        </Reveal>
      </div>

      <div aria-hidden className="hero-stage">
        <div className="hero-art">
          <ApertureArt variant="hero" preload />
        </div>
      </div>

      <div className="hero-tools hero-wrap hero-layer">
        <div className="glass flex flex-col gap-4 rounded-[1.25rem] px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-8 lg:py-4">
          <p className="shrink-0 text-[0.875rem] text-muted">Works with the tools you already use</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-center lg:gap-x-9">
            {TOOLS.map(({ name, Logo }) => (
              <li key={name} className="flex items-center gap-2 text-[0.9375rem] font-medium tracking-[-0.015em] text-ink/80">
                <Logo className="h-[18px] w-[18px] shrink-0" aria-hidden />
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
