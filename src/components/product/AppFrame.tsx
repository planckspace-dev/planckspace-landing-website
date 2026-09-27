import type { ReactNode } from "react";
import {
  Bell,
  ChevronDown,
  LayoutGrid,
  ListTree,
  PiggyBank,
  Receipt,
  RefreshCw,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { PlanckspaceMark } from "@/components/brand/Planckspace";
import { WORKSPACE } from "@/lib/sample";
import { cn } from "@/lib/utils";

/* The console's shell, drawn to the app's own layout: grouped sidebar
   (analyze / spend / workspace) with the daemon chip pinned at the foot, a
   workspace header, and the page underneath. Browser chrome on top so it
   reads as the real product at its real address. */

const NAV = [
  { group: "Analyze", items: [{ label: "Overview", icon: LayoutGrid }, { label: "Findings", icon: Sparkles }, { label: "Sessions", icon: ListTree }] },
  { group: "Spend", items: [{ label: "Realized savings", icon: PiggyBank }, { label: "Spend", icon: Receipt }, { label: "Budgets & alerts", icon: Bell }] },
  { group: "Workspace", items: [{ label: "Team", icon: Users }, { label: "Settings", icon: Settings }] },
];

export default function AppFrame({
  active = "Overview",
  path = "overview",
  children,
  className,
}: {
  active?: string;
  path?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("app overflow-hidden rounded-[14px] bg-[var(--canvas)]", className)}>
      {/* browser chrome */}
      <div className="flex h-10 items-center gap-3 border-b border-[var(--border)] bg-white px-4">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#E5E7EB]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#E5E7EB]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#E5E7EB]" />
        </div>
        <div className="mx-auto flex h-6 w-[340px] items-center justify-center gap-1.5 rounded-md bg-[var(--well)] text-[11px] text-[var(--text-2)]">
          <span className="text-[var(--text-3)]">app.planckspace.dev/</span>
          {path}
        </div>
        <div className="w-[42px]" />
      </div>

      <div className="flex">
        {/* sidebar */}
        <aside className="flex w-[200px] shrink-0 flex-col border-r border-[var(--border)] bg-white">
          <div className="flex h-12 items-center gap-2 px-4">
            <PlanckspaceMark className="h-[17px] w-auto text-[var(--ink)]" accent="#2E6BF2" />
            <span className="text-[14px] font-medium tracking-[-0.02em]">Planckspace</span>
          </div>
          <nav className="flex-1 px-2.5 pb-3">
            {NAV.map((g) => (
              <div key={g.group} className="mt-3">
                <p className="px-2 pb-1 text-[10.5px] text-[var(--text-3)]">{g.group}</p>
                {g.items.map((it) => {
                  const on = it.label === active;
                  return (
                    <div
                      key={it.label}
                      className={cn(
                        "relative flex h-8 items-center gap-2.5 rounded-md px-2 text-[12.5px]",
                        on ? "bg-[var(--brand-50)] font-medium text-[var(--brand-700)]" : "text-[var(--text-2)]",
                      )}
                    >
                      {on && <span className="absolute -left-2.5 top-1.5 bottom-1.5 w-[3px] rounded-r bg-[var(--brand-600)]" />}
                      <it.icon className="h-[15px] w-[15px]" strokeWidth={1.6} />
                      {it.label}
                    </div>
                  );
                })}
              </div>
            ))}
          </nav>
          <div className="m-2.5 rounded-lg border border-[var(--border)] bg-[var(--canvas)] px-3 py-2">
            <p className="flex items-center gap-1.5 text-[11px] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--green-500)]" />
              Daemons healthy
            </p>
            <p className="mt-0.5 text-[10px] text-[var(--text-3)]">last sync 1 min ago</p>
          </div>
        </aside>

        {/* main */}
        <div className="min-w-0 flex-1">
          <header className="flex h-12 items-center justify-between border-b border-[var(--border)] bg-white px-5">
            <div className="flex items-center gap-2 text-[12.5px]">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-[var(--brand-600)] text-[11px] font-semibold text-white">
                H
              </span>
              <span className="font-medium">{WORKSPACE.name}</span>
              <span className="rounded bg-[var(--well)] px-1.5 py-px text-[10px] text-[var(--text-2)]">Leader</span>
              <ChevronDown className="h-3.5 w-3.5 text-[var(--text-3)]" />
              <span className="mx-1 text-[var(--border-strong)]">/</span>
              <span className="text-[var(--text-2)]">{active}</span>
            </div>
            <div className="flex items-center gap-3 text-[12px] text-[var(--text-2)]">
              <span className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3" strokeWidth={1.8} /> Synced
              </span>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--brand-100)] text-[11px] font-medium text-[var(--brand-700)]">
                MR
              </span>
            </div>
          </header>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
