"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { PlanckspaceMark } from "@/components/brand/Planckspace";
import { billedTotal, realizedTotal, usd } from "@/lib/sample";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────
   One ledger, read three ways. A horizontal accordion: the open panel takes
   most of the row and shows that role's view; the others stay as spines
   with the role's name. Hover or focus opens a panel, so it works from the
   keyboard; on small screens the panels simply stack, all open.
   ───────────────────────────────────────────────────────────────────────── */

const ROLES = [
  {
    key: "leaders",
    role: "Leaders",
    who: "CTOs, VPs, founders",
    line: "What AI costs, what it returns, and where it is heading.",
    points: ["Seats and API spend in one billed number", "Cost per shipped session, by team", "Verified savings you can put in front of a board"],
  },
  {
    key: "managers",
    role: "Managers",
    who: "Engineering managers",
    line: "Your team's spend and output, without policing anyone.",
    points: ["A team-scoped view: spend, ship rate, budget burn", "A check-in prompt when a rate drops, never a wall of names", "Budgets and alerts per team"],
  },
  {
    key: "developers",
    role: "Developers",
    who: "The people doing the work",
    line: "Your own numbers, in your editor, for your eyes.",
    points: ["The extension works with no account at all", "Fix your own waste in one click, undo in one", "The before and after of every fix you apply"],
  },
];

function LeadersView() {
  return (
    <div className="grid gap-px bg-[var(--line)] sm:grid-cols-3">
      {[
        { k: "billed this month", v: usd(billedTotal) },
        { k: "per shipped session", v: "$2.84" },
        { k: "verified savings", v: usd(realizedTotal), lime: true },
      ].map((s) => (
        <div key={s.k} className="bg-ink p-4">
          <p className={cn("t-meter text-[1.7rem]", s.lime ? "text-lime" : "text-fg")}>{s.v}</p>
          <p className="t-mono mt-2 text-[10.5px] text-fg-3">{s.k}</p>
        </div>
      ))}
    </div>
  );
}

function ManagersView() {
  const rows = [
    { n: "Developer A", rate: 0.74 },
    { n: "Developer B", rate: 0.66 },
    { n: "Developer C", rate: 0.61 },
    { n: "Developer D", rate: 0.38, check: true },
  ];
  return (
    <ul className="space-y-2.5 bg-ink p-4">
      {rows.map((r) => (
        <li key={r.n} className="flex items-center gap-3">
          <span className="t-mono w-24 text-[11.5px] text-fg-2">{r.n}</span>
          <span className="relative h-1.5 flex-1 bg-fg/10">
            <span className={cn("absolute inset-y-0 left-0", r.check ? "bg-sig-amber" : "bg-lime")} style={{ width: `${r.rate * 100}%` }} />
            <span className="absolute -top-1 bottom-[-4px] left-[61%] w-px bg-fg/50" />
          </span>
          <span className="t-mono w-10 text-right text-[11px] text-fg-3">{Math.round(r.rate * 100)}%</span>
        </li>
      ))}
      <li className="t-mono pt-1 text-[10.5px] text-sig-amber">Developer D might want a hand: a check-in, not a flag</li>
    </ul>
  );
}

function DevelopersView() {
  return (
    <div className="bg-ink p-4">
      <div className="grid grid-cols-3 gap-px bg-[var(--line)] text-[11px]">
        {[
          { k: "Spent", v: "$412" },
          { k: "Dead ends", v: "$61" },
          { k: "Removable", v: "$134/mo", lime: true },
        ].map((s) => (
          <div key={s.k} className="bg-ink-2 p-3">
            <p className="text-fg-3">{s.k}</p>
            <p className={cn("t-mono mt-1 text-[13px] font-semibold", s.lime ? "text-lime" : "text-fg")}>{s.v}</p>
          </div>
        ))}
      </div>
      <p className="t-mono mt-3 flex items-center gap-2 text-[10.5px] text-fg-3">
        <PlanckspaceMark className="h-3 w-auto text-fg" accent="#C6FF3D" /> you · this month · computed on this machine
      </p>
    </div>
  );
}

const VIEWS: Record<string, () => React.JSX.Element> = { leaders: LeadersView, managers: ManagersView, developers: DevelopersView };

export default function Roles() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".rl-head > *", { y: 30, autoAlpha: 0, stagger: 0.1, duration: 1, scrollTrigger: { trigger: ".rl-head", start: "top 82%" } });
        gsap.from(".rl-panel", { y: 70, autoAlpha: 0, stagger: 0.1, duration: 1.1, scrollTrigger: { trigger: ".rl-row", start: "top 85%" } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="roles" aria-labelledby="roles-title" className="section">
      <div className="wrap">
        <div className="rl-head flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="roles-title" className="t-display t-h2 max-w-[16ch]">
            One ledger. Three ways to read it.
          </h2>
          <p className="t-lead max-w-[26rem]">The backend scopes every number by role, so each person sees their own slice and nothing they shouldn&apos;t.</p>
        </div>

        <div className="rl-row mt-14 flex flex-col gap-3 sm:mt-16 lg:h-[34rem] lg:flex-row">
          {ROLES.map((r, i) => {
            const View = VIEWS[r.key];
            const isOpen = open === i;
            return (
              <div
                key={r.key}
                className={cn("rl-panel group relative lg:min-w-0 lg:transition-[flex-grow] lg:duration-700 lg:ease-[var(--ease-out-expo)]", isOpen ? "lg:grow-[3.2]" : "lg:grow")}
                style={{ flexBasis: 0 }}
                onPointerEnter={() => setOpen(i)}
              >
                <div data-open={isOpen} className={cn("frame h-full [--ch:22px]", isOpen && "[--edge:rgb(198_255_61/0.5)]")}>
                  <div className="frame-in flex flex-col p-6 sm:p-7">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`role-${r.key}`}
                      onFocus={() => setOpen(i)}
                      onClick={() => setOpen(i)}
                      className="flex w-full items-start justify-between gap-4 text-left"
                    >
                      <span>
                        <span className="t-mono block text-[11.5px] text-fg-3">{r.who}</span>
                        <span className="rl-title t-display mt-2 block leading-none">{r.role}</span>
                      </span>
                      <Plus className={cn("mt-1 h-5 w-5 shrink-0 text-lime transition-transform duration-500 max-lg:hidden", isOpen && "rotate-45")} strokeWidth={1.7} />
                    </button>
                    <div
                      id={`role-${r.key}`}
                      className={cn(
                        "mt-auto w-full pt-8 transition-opacity duration-500 lg:min-w-[26rem]",
                        isOpen ? "opacity-100 lg:delay-200" : "lg:pointer-events-none lg:opacity-0",
                      )}
                    >
                      <p className="t-display text-[clamp(1.35rem,1.9vw,1.8rem)] leading-[1.1] [--wdth:100]">{r.line}</p>
                      <ul className="mt-5 space-y-2">
                        {r.points.map((p) => (
                          <li key={p} className="flex gap-3 text-[0.95rem] text-fg-2">
                            <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 bg-lime" />
                            {p}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6">
                        <View />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
