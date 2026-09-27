"use client";

import { useRef } from "react";
import Button from "@/components/site/Button";
import CopyCommand from "@/components/site/CopyCommand";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/* ─────────────────────────────────────────────────────────────────────────
   How it goes live. Three steps that are a real sequence, so they are
   numbered, beside a terminal that types the first run once it scrolls into
   view. The output is the CLI's actual first-run shape: connect, backfill,
   daemon, then a number in billed dollars (or what is missing for one).
   ───────────────────────────────────────────────────────────────────────── */

const STEPS = [
  {
    title: "Run one command",
    body: "Each developer connects with a one-time code. No tokens pasted into shells, nothing proxied.",
  },
  {
    title: "It reads the last 30 days",
    body: "Session history is already on disk. The CLI backfills it, then a small daemon keeps it current.",
  },
  {
    title: "You get a real number",
    body: "What is recoverable this month in billed dollars, or exactly what data it still needs. Never a placeholder zero.",
  },
];

const LINES: { t: string; c?: string }[] = [
  { t: "$ npx @planckspace/cli@latest init --code 4F9K2", c: "hi" },
  { t: "✓ Connected to halyard as mara@halyard.dev", c: "ok" },
  { t: "✓ Found Claude Code and Cursor session logs", c: "ok" },
  { t: "✓ Backfilled 30 days · 412 sessions · metadata only", c: "ok" },
  { t: "✓ Daemon installed · syncs every 60s", c: "ok" },
  { t: "" },
  { t: "Recoverable this month   $134/mo   real, billed", c: "lime" },
  { t: "  CLAUDE.md re-read every turn        $96/mo", c: "dim" },
  { t: "  Opus on routine sessions            $38/mo", c: "dim" },
];

const JOIN = "npx @planckspace/cli@latest init --join pk_join_…";

export default function Setup() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const lines = gsap.utils.toArray<HTMLElement>(".st-line");
        const first = lines[0];
        const full = first.dataset.text ?? "";
        const typed = { n: 0 };
        const tl = gsap.timeline({ scrollTrigger: { trigger: ".st-term", start: "top 75%" } });
        tl.set(lines.slice(1), { autoAlpha: 0 })
          .set(first, { textContent: "" })
          .to(typed, {
            n: full.length,
            duration: 1.6,
            ease: "none",
            onUpdate: () => {
              first.textContent = full.slice(0, Math.round(typed.n));
            },
          })
          .to(lines.slice(1), { autoAlpha: 1, stagger: 0.32, duration: 0.2 }, "+=0.35");

        gsap.from(".st-step", { y: 34, autoAlpha: 0, stagger: 0.12, duration: 1, scrollTrigger: { trigger: ".st-steps", start: "top 82%" } });
        gsap.from(".st-head > *", { y: 30, autoAlpha: 0, stagger: 0.1, duration: 1, scrollTrigger: { trigger: ".st-head", start: "top 82%" } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="how-it-works" aria-labelledby="setup-title" className="section bg-ink-1">
      <div className="wrap">
        <div className="st-head max-w-[50rem]">
          <p className="t-kicker">How it goes live</p>
          <h2 id="setup-title" className="t-display t-h2 mt-5">
            A real number in minutes.
          </h2>
          <p className="t-lead mt-6 max-w-[40rem]">
            We set your workspace up with you on the demo call. From there, rollout is one command per developer, and
            the extension works on its own from the first open.
          </p>
        </div>

        <div className="mt-14 grid gap-10 sm:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-14">
          <ol className="st-steps space-y-8">
            {STEPS.map((s, i) => (
              <li key={s.title} className="st-step flex gap-5">
                <span className="t-meter w-10 shrink-0 text-[1.9rem] leading-none text-lime">{i + 1}</span>
                <div className="border-t border-[var(--line)] pt-4">
                  <h3 className="t-h4">{s.title}</h3>
                  <p className="mt-2 text-[0.98rem] leading-relaxed text-fg-3">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="min-w-0">
            <div className="st-term frame [--ch:20px]">
              <div className="frame-in">
                <div className="flex h-10 items-center gap-2 border-b border-[var(--line)] px-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
                  <span className="t-mono ml-3 text-[11px] text-fg-4">~/halyard/web</span>
                </div>
                <div className="term min-h-[19rem] overflow-x-auto p-5 text-[13px] sm:p-6">
                  {LINES.map((l, i) => (
                    <p
                      key={i}
                      data-text={l.t}
                      className={`st-line whitespace-pre ${l.c === "lime" ? "font-semibold text-lime" : l.c ?? ""}`}
                    >
                      {l.t || " "}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-[0.95rem] font-semibold text-fg">Rolling out to a team</p>
                <p className="mt-1 text-[0.9rem] leading-relaxed text-fg-3">
                  Paste one join command in the team channel. Each developer joins as themselves.
                </p>
                <CopyCommand command={JOIN} className="mt-4" />
              </div>
              <div>
                <p className="text-[0.95rem] font-semibold text-fg">In the editor</p>
                <p className="mt-1 text-[0.9rem] leading-relaxed text-fg-3">
                  Works with no account. VS Code, or Cursor and Windsurf through Open VSX.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    href="https://marketplace.visualstudio.com/items?itemName=planckspace.planckspace-extension"
                    external
                    size="sm"
                    variant="ghost"
                  >
                    VS Code
                  </Button>
                  <Button href="https://open-vsx.org/extension/planckspace/planckspace-extension" external size="sm" variant="ghost">
                    Open VSX
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
