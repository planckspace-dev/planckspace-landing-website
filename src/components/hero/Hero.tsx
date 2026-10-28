import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { ArrowRight, BookOpen, Boxes, Lock } from "lucide-react";
import { AnthropicLogo, ClaudeLogo, CursorLogo, OpenAILogo, WindsurfLogo } from "@/components/brand/ToolLogos";
import Receipt from "@/components/hero/Receipt";
import Button from "@/components/site/Button";
import Reveal from "@/components/site/Reveal";
import { DEMO_PATH } from "@/lib/plans";

/* ─────────────────────────────────────────────────────────────────────────
   The promise, in one line, and the artefact that keeps it: a month
   itemized. Two actions: a demo, or the docs for anyone who would rather
   read how every figure is computed first. Under it, the tools metered.
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
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-[calc(var(--nav-h)+3rem)] sm:pt-[calc(var(--nav-h)+4.5rem)]">
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-x-0 top-0 h-[52rem] [mask-image:radial-gradient(55%_55%_at_72%_38%,#000_10%,transparent_75%)]" />

      <div className="wrap relative grid grid-cols-1 items-start gap-16 lg:grid-cols-[minmax(0,1fr)_27rem] lg:gap-12">
        <Reveal className="lg:pt-16">
          <Link
            href="/docs/concepts/proof-of-savings"
            className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/70 py-1 pl-1 pr-3.5 text-[0.8125rem] text-body shadow-[var(--shadow-flat)] backdrop-blur transition-colors hover:border-line-strong hover:text-ink"
          >
            <span className="rounded-full bg-ink px-2 py-0.5 text-[0.6875rem] font-medium text-white">New</span>
            <span>
              Proof of savings<span className="hidden sm:inline">, measured session by session</span>
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-subtle transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2} />
          </Link>

          <h1 id="hero-title" className="display mt-8">
            Every token,
            <br />
            <span className="tone">accounted for.</span>
          </h1>

          <p className="lede mt-8 max-w-[33rem]">
            PlanckSpace itemizes what your team spends on Claude Code, Cursor and every API key, finds the money that buys nothing, fixes it in one
            click, and proves each dollar the fix saves.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href={DEMO_PATH} size="lg">
              Book a demo
            </Button>
            <Button href="/docs" size="lg" variant="secondary" icon={<BookOpen className="h-[17px] w-[17px]" strokeWidth={1.8} />}>
              Documentation
            </Button>
          </div>

          <p className="mt-8 flex items-center gap-2 text-[0.875rem] text-muted">
            <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            Metadata only. Your prompts and code are never sent to PlanckSpace.
          </p>
        </Reveal>

        <div className="relative mx-auto w-full max-w-[27rem] lg:mr-0">
          <Receipt />
          <p className="mt-6 text-center text-[0.75rem] text-subtle">A sample month, itemized. Illustrative figures.</p>
        </div>
      </div>

      <div className="wrap relative mt-20 sm:mt-24">
        <div className="flex flex-col gap-6 border-t border-line py-9 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <p className="shrink-0 text-[0.875rem] text-muted">Meters every seat and every API key</p>
          <ul className="flex flex-wrap items-center gap-x-9 gap-y-4">
            {TOOLS.map(({ name, Logo }) => (
              <li key={name} className="flex items-center gap-2 text-[0.9375rem] font-medium tracking-[-0.015em] text-ink/75">
                <Logo className="h-[18px] w-[18px]" aria-hidden />
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
