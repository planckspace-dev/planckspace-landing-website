import type { ComponentType, SVGProps } from "react";
import { AnthropicLogo, AntigravityLogo, ClaudeLogo, CursorLogo, OpenAILogo, WindsurfLogo } from "@/components/brand/ToolLogos";

/* The one marquee on the page: what PlanckSpace meters. Coding tools and the
   provider APIs whose admin keys it reads. Tools whose per-plan accounting is
   still being verified say beta rather than pretending to parity. */

type Item = { name: string; Logo?: ComponentType<SVGProps<SVGSVGElement>>; beta?: boolean };

const ITEMS: Item[] = [
  { name: "Claude Code", Logo: ClaudeLogo },
  { name: "Cursor", Logo: CursorLogo },
  { name: "Anthropic API", Logo: AnthropicLogo },
  { name: "OpenAI API", Logo: OpenAILogo },
  { name: "Windsurf", Logo: WindsurfLogo, beta: true },
  { name: "Antigravity", Logo: AntigravityLogo, beta: true },
  { name: "Amazon Bedrock" },
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="marquee-track" aria-hidden={hidden || undefined}>
      {ITEMS.map(({ name, Logo, beta }) => (
        <li key={name} className="flex items-center gap-3.5 whitespace-nowrap">
          {Logo ? <Logo className="h-7 w-7 text-fg" /> : <span className="h-7 w-7 bg-fg [clip-path:polygon(0_0,100%_0,100%_65%,65%_100%,0_100%)]" />}
          <span className="t-display text-[1.65rem] leading-none [--wdth:104] text-fg">{name}</span>
          {beta && <span className="tag">beta</span>}
        </li>
      ))}
    </ul>
  );
}

export default function ToolMarquee() {
  return (
    <section aria-label="What PlanckSpace meters" className="border-y border-[var(--line)] bg-ink-1 py-7 sm:py-9">
      <div className="wrap mb-5 flex items-center justify-between gap-4">
        <p className="t-small">Meters every seat and every API key your team pays for</p>
        <p className="t-small hidden sm:block">Nothing to proxy, nothing to install in the tools</p>
      </div>
      <div className="marquee">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
