import Link from "next/link";
import { ArrowRight, Check, EyeOff, FolderLock, ScanSearch, X } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import SectionHead from "@/components/site/SectionHead";

/* ─────────────────────────────────────────────────────────────────────────
   The objection, answered by what crosses the wire. The promise is about
   transmission, never capability: the CLI reads files locally (to count
   tokens, for one) and sends only the counts. Prompts are "never sent to
   PlanckSpace", not "never leave the machine": an opt-in agent-policy
   provider (TypeSafe, with the developer's own key) receives truncated
   prompts straight from the device, so the note under the lists says so.
   ───────────────────────────────────────────────────────────────────────── */

const LEAVES = ["Token counts and timings", "Models and tool names", "Repository and file names", "Session outcome", "The git email that attributes a session"];
const STAYS = ["Your prompts", "The model's responses", "Source code and file contents", "Hook commands and MCP secrets", "API keys"];

const POINTS = [
  {
    icon: ScanSearch,
    title: "Check any session",
    body: "planck inspect rebuilds a session's payload with the sync's own code and prints its core fields.",
    href: "/docs/security/data-we-collect",
  },
  {
    icon: EyeOff,
    title: "Identity private by policy",
    body: "A collaborative workspace hides who is who from every role, leadership included.",
    href: "/docs/security/workspace-policies",
  },
  {
    icon: FolderLock,
    title: "Only the repositories you choose",
    body: "Sessions from untracked repositories are kept out of every figure and every screen.",
    href: "/docs/guides/repo-scope",
  },
];

export default function Privacy() {
  return (
    <section id="privacy" aria-labelledby="privacy-title" className="section pt-0">
      <div className="wrap">
        <div className="rule mb-[var(--section-y)]" />
        <SectionHead
          id="privacy-title"
          eyebrow="Privacy"
          split
          title={
            <>
              The numbers leave the machine. <span className="tone">Your code never does.</span>
            </>
          }
          lede="The CLI reads the session logs your tools already keep and sends usage metadata only. Every session is checked on arrival against a fixed list of fields, and one that carries anything else is rejected."
        />

        <Reveal className="mt-16 grid grid-cols-1 overflow-hidden rounded-[28px] border border-line bg-surface shadow-[var(--shadow-card)] md:grid-cols-2 lg:mt-20">
          <div className="p-7 sm:p-10">
            <p className="eyebrow">Sent to PlanckSpace</p>
            <ul className="mt-6 divide-y divide-line-soft">
              {LEAVES.map((l) => (
                <li key={l} className="flex items-center gap-3 py-3.5 text-[0.9875rem] text-ink">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-green-50 text-green-700">
                    <Check className="h-3 w-3" strokeWidth={2.6} />
                  </span>
                  {l}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-line bg-band/70 p-7 sm:p-10 md:border-l md:border-t-0">
            <p className="eyebrow">Never sent to PlanckSpace</p>
            <ul className="mt-6 divide-y divide-line">
              {STAYS.map((l) => (
                <li key={l} className="flex items-center gap-3 py-3.5 text-[0.9875rem] text-muted">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-canvas text-muted">
                    <X className="h-3 w-3" strokeWidth={2.6} />
                  </span>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <p className="note mt-5 max-w-[46rem]">
          One opt-in exception: if an admin points{" "}
          <Link href="/docs/guides/agent-policy" className="link-under text-body">
            agent policy
          </Link>{" "}
          at TypeSafe&apos;s decision model and a developer adds their own TypeSafe key, that machine sends TypeSafe the first 2,000 characters of the current
          and previous prompt. PlanckSpace never receives them.
        </p>

        <ul className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {POINTS.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 70}>
              <p.icon className="h-5 w-5 text-ink" strokeWidth={1.6} />
              <p className="title-sm mt-4">{p.title}</p>
              <p className="copy mt-2 text-[0.9375rem]">{p.body}</p>
              <Link href={p.href} className="link-arrow mt-3 text-[0.875rem]">
                Read more <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
