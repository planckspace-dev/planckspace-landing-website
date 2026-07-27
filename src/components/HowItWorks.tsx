import { Reveal } from "@/components/ui/reveal";
import { INSTALL_CMD } from "@/lib/plans";

/* Rollout. This section owns the #how-it-works anchor the nav and footer
   point at, so its id is load-bearing. */

const STEPS = [
  {
    index: "01",
    title: "Install the CLI",
    body: "One command. The installer sets up the planck binary and a background daemon that watches local session logs.",
    terminal: (
      <>
        <div>
          <span className="t-prompt">$ </span>
          {INSTALL_CMD}
        </div>
        <div className="t-green">✓ planck v1 installed</div>
      </>
    ),
  },
  {
    index: "02",
    title: "Connect your workspace",
    body: "Log in once and every future session syncs automatically: token counts, model, cost. Metadata only.",
    terminal: (
      <>
        <div>
          <span className="t-prompt">$ </span>planck login
        </div>
        <div className="t-green">✓ workspace linked: acme-eng</div>
        <div className="t-dim">daemon syncing, 12 sessions found</div>
      </>
    ),
  },
  {
    index: "03",
    title: "Invite the team",
    body: "Teammates join with an email invite. Spend appears in the shared dashboard, and in the VS Code extension right inside the editor.",
    terminal: (
      <>
        <div>
          <span className="t-prompt">$ </span>planck status
        </div>
        <div className="t-dim">workspace&ensp;acme-eng, 11 members</div>
        <div className="t-green">✓ live at console.planckspace.dev</div>
      </>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-t border-[var(--border)] bg-[var(--panel)] py-24 sm:py-36"
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

        <div className="mt-16 grid gap-10 lg:grid-cols-3 lg:gap-8">
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
                <div className="terminal mt-auto">
                  <div className="t-head">
                    <span className="t-dot" />
                    <span className="t-dot" />
                    <span className="t-dot" />
                  </div>
                  <div className="t-body">{s.terminal}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
