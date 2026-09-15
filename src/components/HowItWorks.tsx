import { Reveal } from "@/components/ui/reveal";
import { TypedTerminal, type TermLine } from "@/components/ui/typed-terminal";
import { INSTALL_CMD } from "@/lib/plans";

/* Rollout. This section owns the #how-it-works anchor the nav and footer
   point at, so its id is load-bearing.

   The three terminals play in sequence as the row arrives, each starting
   roughly where the previous one finishes, so the section reads as one
   continuous install rather than three screenshots of one. The workspace
   name matches the hero console. */

const STEPS: Array<{ index: string; title: string; body: string; lines: TermLine[]; delay: number }> = [
  {
    index: "01",
    title: "Install the CLI",
    body: "One command. The installer sets up the planck binary and a background daemon that watches local session logs.",
    lines: [
      { kind: "cmd", text: INSTALL_CMD },
      { kind: "ok", text: "✓ planck v1 installed" },
    ],
    delay: 0,
  },
  {
    index: "02",
    title: "Connect your workspace",
    body: "Log in once and every future session syncs automatically: token counts, model, cost. Metadata only.",
    lines: [
      { kind: "cmd", text: "planck login" },
      { kind: "ok", text: "✓ workspace linked: meridian-eng" },
      { kind: "dim", text: "daemon syncing, 12 sessions found" },
    ],
    delay: 1.9,
  },
  {
    index: "03",
    title: "Invite the team",
    body: "Teammates join with an email invite. Spend appears in the shared dashboard, and in the VS Code extension right inside the editor.",
    lines: [
      { kind: "cmd", text: "planck status" },
      { kind: "dim", text: "workspace meridian-eng, 11 members" },
      { kind: "ok", text: "✓ live at console.planckspace.dev" },
    ],
    delay: 3.3,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-y scroll-mt-24 border-t border-[var(--border)] bg-[var(--panel)]"
    >
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="display-2">
            Three commands, and the whole team is measured.
          </h2>
          <p className="lead mt-5">
            Developers keep the tools they already use. Nothing proxies your
            traffic, nothing enters your build, and there are no API keys to
            rotate. Once we have provisioned the workspace, we are on the call
            for all three steps.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-9 sm:mt-16 sm:gap-10 lg:grid-cols-3 lg:gap-8">
          {STEPS.map((s, i) => (
            <Reveal key={s.index} delay={i * 0.08}>
              <div className="flex h-full flex-col">
                <div className="mb-5 flex items-center gap-4">
                  <span className="num text-[13px] text-[var(--text-3)]">{s.index}</span>
                  <span className="h-px flex-1 bg-[var(--border-strong)]" />
                </div>
                <h3 className="text-[19px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
                  {s.title}
                </h3>
                <p className="mb-6 mt-2.5 text-[14.5px] leading-relaxed text-[var(--text-2)]">
                  {s.body}
                </p>
                <TypedTerminal lines={s.lines} delay={s.delay} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
