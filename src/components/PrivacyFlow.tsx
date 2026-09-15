"use client";

import { Lock } from "lucide-react";
import { useLive } from "@/components/ui/in-view";
import { PlanckMark } from "@/components/ui/logo";

/* ─────────────────────────────────────────────────────────────────────────
   The privacy claim, as a diagram of where data actually goes.

   Left, the developer's machine: code, prompts and the session log all stay
   inside the dashed boundary. The daemon reads counters out of that log.
   Middle, the only thing that crosses: small metadata records, drifting
   across the lane. Right, the workspace receiving exactly those fields.

   Packets use negative animation delays, so even paused (off-screen, or
   before hydration) they sit spread along the lane rather than bunched at
   the start. Reduced motion pins them to --rest.
   ───────────────────────────────────────────────────────────────────────── */

const STAYS = [
  { k: "src/**", note: "source" },
  { k: "prompts, responses", note: "conversation" },
  { k: "file contents", note: "workspace" },
];

const PACKETS = [
  { text: "48.2k tok", d: "0s", rest: "4%" },
  { text: "sonnet-5", d: "-2s", rest: "40%" },
  { text: "$2.14", d: "-4s", rest: "78%" },
];

export default function PrivacyFlow() {
  const [ref, live] = useLive<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-live={live ? "true" : "false"}
      className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.1fr)_minmax(0,0.95fr)] lg:gap-0"
    >
      {/* the machine */}
      <div className="rounded-xl border border-dashed border-white/15 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="num text-[10.5px] uppercase tracking-[0.14em] text-[#6b7183]">
            Your machine
          </span>
          <span className="num text-[10.5px] text-[#6b7183]">never leaves</span>
        </div>
        <ul className="mt-3.5 space-y-1.5">
          {STAYS.map((s) => (
            <li
              key={s.k}
              className="flex items-center gap-2.5 rounded-md bg-white/[0.03] px-2.5 py-2"
            >
              <Lock className="h-3 w-3 shrink-0 text-[#6b7183]" strokeWidth={2} />
              <span className="num truncate text-[11.5px] text-[#9ba1b0]">{s.k}</span>
              <span className="num ml-auto text-[10px] text-[#4d5263]">{s.note}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center gap-2.5 rounded-md border border-[rgba(159,190,251,0.25)] bg-[rgba(46,107,242,0.08)] px-2.5 py-2">
          <span className="grid h-5 w-5 place-items-center rounded bg-[var(--brand-600)]">
            <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
              <path d="M2 3.5h8M2 6h5M2 8.5h6.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="num block text-[11.5px] text-white">planck daemon</span>
            <span className="num block truncate text-[10px] text-[#9ba1b0]">reads counters from session logs</span>
          </span>
        </div>
      </div>

      {/* the lane */}
      <div className="relative flex min-h-[4.5rem] flex-col justify-center lg:px-5">
        <span className="num mb-1 text-center text-[10px] uppercase tracking-[0.14em] text-[#6b7183]">
          metadata only
        </span>
        <div className="relative h-10">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[linear-gradient(90deg,rgba(255,255,255,0.05),rgba(159,190,251,0.45),rgba(255,255,255,0.05))]" />
          {PACKETS.map((p) => (
            <span
              key={p.text}
              className="packet num whitespace-nowrap rounded-full border border-[rgba(159,190,251,0.35)] bg-[#141a2b] px-2 py-[3px] text-[10px] text-[#c9d8fc]"
              style={{ "--d": p.d, "--rest": p.rest } as React.CSSProperties}
              aria-hidden
            >
              {p.text}
            </span>
          ))}
        </div>
        <span className="num mt-1 text-center text-[10px] text-[#4d5263]">
          inspect it first: planck inspect
        </span>
      </div>

      {/* the workspace */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <PlanckMark onDark className="h-3.5 w-auto" />
            <span className="num text-[10.5px] uppercase tracking-[0.14em] text-[#6b7183]">
              Workspace
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="beacon" />
            <span className="num text-[10.5px] text-[#6b7183]">receiving</span>
          </span>
        </div>
        <div className="mt-3.5 overflow-hidden rounded-md border border-white/[0.06]">
          <div className="num grid grid-cols-[1fr_auto_auto] gap-x-3 border-b border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 text-[9.5px] uppercase tracking-[0.08em] text-[#4d5263]">
            <span>repo</span>
            <span>tokens</span>
            <span className="text-right">cost</span>
          </div>
          {[
            ["api-service", "48,210", "$2.14"],
            ["web-app", "21,730", "$0.86"],
            ["billing", "57,504", "$2.48"],
            ["mobile", "30,412", "$0.52"],
          ].map((r) => (
            <div
              key={r[0]}
              className="num grid grid-cols-[1fr_auto_auto] gap-x-3 border-b border-white/[0.04] px-2.5 py-2 text-[11px] last:border-b-0"
            >
              <span className="truncate text-[#d5d9e4]">{r[0]}</span>
              <span className="text-[#9ba1b0]">{r[1]}</span>
              <span className="w-12 text-right text-white">{r[2]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
