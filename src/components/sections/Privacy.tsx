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

   Set as a split: what is sent sits on white, what is never sent stays in
   the dark.
   ───────────────────────────────────────────────────────────────────────── */

const LEAVES = ["How many tokens were used, and when", "Which model and which tool", "Repository and file names", "Whether the work shipped", "The git email, to show whose session it was"];
const STAYS = ["Your prompts", "The model's responses", "Source code and file contents", "Hook commands and MCP secrets", "API keys"];

const POINTS = [
  {
    icon: ScanSearch,
    title: "Check it yourself",
    body: "Run planck inspect on any session and it prints what would be sent.",
    href: "/docs/security/data-we-collect",
  },
  {
    icon: EyeOff,
    title: "Names can stay hidden",
    body: "In a collaborative workspace, nobody sees who is who. Not managers, not leadership.",
    href: "/docs/security/workspace-policies",
  },
  {
    icon: FolderLock,
    title: "Only the repositories you choose",
    body: "Sessions from any repository you have not added stay out of every number and every screen.",
    href: "/docs/guides/repo-scope",
  },
];

export default function Privacy() {
  return (
    <section id="privacy" aria-labelledby="privacy-title" className="section pt-0">
      <div className="wrap">
        <SectionHead
          id="privacy-title"
          eyebrow="Privacy"
          title={
            <>
              The numbers leave the machine. <span className="tone block">Your code never does.</span>
            </>
          }
          lede="PlanckSpace reads the logs your AI tools already keep on each machine and sends usage data only: numbers and names, never content. Every session is checked on arrival against a fixed list of fields, and anything extra is rejected."
        />

        <Reveal className="mt-14 grid grid-cols-1 overflow-hidden rounded-[32px] border border-line shadow-[var(--shadow-lift)] md:grid-cols-2 lg:mt-20">
          <div className="min-w-0 bg-surface px-6 py-9 sm:p-10 lg:p-14">
            <p className="text-[clamp(1.5rem,2.2vw,2rem)] font-semibold leading-tight tracking-[-0.032em] text-ink">Sent to PlanckSpace</p>
            <ul className="mt-8 border-t border-line">
              {LEAVES.map((l) => (
                <li key={l} className="flex items-center gap-4 border-b border-line-soft py-4 text-[1.0625rem] text-ink sm:text-[1.125rem]">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-green-50 text-green-700 ring-1 ring-inset ring-green-700/15">
                    <Check className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  </span>
                  {l}
                </li>
              ))}
            </ul>
          </div>
          <div className="on-night min-w-0 bg-night px-6 py-9 sm:p-10 lg:p-14">
            <p className="text-[clamp(1.5rem,2.2vw,2rem)] font-semibold leading-tight tracking-[-0.032em] text-ink">Never sent to PlanckSpace</p>
            <ul className="mt-8 border-t border-white/15">
              {STAYS.map((l) => (
                <li key={l} className="flex items-center gap-4 border-b border-white/[0.08] py-4 text-[1.0625rem] text-body sm:text-[1.125rem]">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted ring-1 ring-inset ring-white/15">
                    <X className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  </span>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <p className="note mt-6 max-w-[48rem] text-[0.875rem]">
          One opt-in exception: if an admin points{" "}
          <Link href="/docs/guides/agent-policy" className="link-under text-body">
            agent policy
          </Link>{" "}
          at TypeSafe&apos;s decision model and a developer adds their own TypeSafe key, that machine sends TypeSafe the first 2,000 characters of the current
          and previous prompt. PlanckSpace never receives them.
        </p>

        {/* Three guarantees, set as an index: each joined to the page that
            proves it by a dotted leader, the way a ledger joins a line to its
            amount. Not three feature cards. */}
        <Reveal as="ul" className="mt-16 border-t border-line-strong lg:mt-20">
          {POINTS.map((p) => (
            <li key={p.title} className="border-b border-line-strong py-6 sm:py-8">
              {/* From sm the link closes the leader row; on phones it follows the body
                  (only one of the two is ever displayed, so the tree holds one link). */}
              <div className="leader gap-3">
                <p.icon className="mt-1 h-[18px] w-[18px] shrink-0 self-start text-muted sm:mt-0 sm:self-center" strokeWidth={1.5} aria-hidden />
                <p className="text-[clamp(1.25rem,1.6vw,1.5rem)] font-semibold leading-tight tracking-[-0.024em] text-ink">{p.title}</p>
                <span className="fill hidden sm:block" aria-hidden />
                <Link href={p.href} className="link-arrow hidden shrink-0 sm:inline-flex" aria-label={`Read more: ${p.title}`}>
                  Read more <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                </Link>
              </div>
              <p className="copy mt-2 max-w-[40rem] pl-[1.875rem] sm:text-[1.0625rem]">{p.body}</p>
              <Link href={p.href} className="link-arrow ml-[1.875rem] mt-3 sm:hidden" aria-label={`Read more: ${p.title}`}>
                Read more <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
