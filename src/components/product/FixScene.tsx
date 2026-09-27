"use client";

import { forwardRef, memo } from "react";
import { PlanckspaceMark } from "@/components/brand/Planckspace";

/* ─────────────────────────────────────────────────────────────────────────
   VS Code with the PlanckSpace extension open, drawn at 1200 x 750.

   This file is only the picture. The choreography lives in fix-timeline.ts
   and drives it through data-f attributes, so the same scene can play live
   on the page or be stepped frame by frame into a video.

   What it shows is the extension as it ships: the "you · this month" strip,
   "Fixes for you" judged on your own sessions, a one-click fix that backs up
   every file it touches, the before/after measured from your next sessions,
   and a judgement call handed to your own Claude Code with the numbers.
   ───────────────────────────────────────────────────────────────────────── */

const VS = {
  bg: "#1f1f1f",
  side: "#181818",
  line: "#2b2b2b",
  text: "#cccccc",
  dim: "#8b8b8b",
  faint: "#5a5a5a",
  blue: "#0078d4",
  green: "#4ec9b0",
  red: "#f48771",
  kw: "#569cd6",
  str: "#ce9178",
};

const OLD_MD = [
  ["# web", "h"],
  ["", ""],
  ["## Testing", "h"],
  ["Run vitest in watch mode. Snapshot tests live in __snapshots__ next to", ""],
  ["the component. Never update snapshots without reading the diff first.", ""],
  ["Integration tests need the local stack: docker compose up db redis.", ""],
  ["", ""],
  ["## Deploy", "h"],
  ["Preview deploys run on every PR. Production deploys are tagged releases", ""],
  ["cut from main by the release workflow. Never deploy from a laptop.", ""],
  ["Rollback: re-run the previous tag's workflow, then open an incident.", ""],
  ["", ""],
  ["## Style guide", "h"],
  ["Components are function components with named exports. Tailwind only,", ""],
  ["no CSS modules. Colours come from tokens.css, never a raw hex.", ""],
  ["", ""],
  ["## API conventions", "h"],
  ["Every route validates input with zod and returns typed errors. Money is", ""],
  ["integer cents end to end; format only at the edge. Timestamps are UTC.", ""],
  ["", ""],
  ["## Architecture", "h"],
  ["The app router owns routing; data fetching goes through lib/api.ts...", ""],
];

const NEW_MD = [
  ["# web", "h"],
  ["", ""],
  ["Context lives in .claude/context/. Open the file for the task at hand:", ""],
  ["- Testing          .claude/context/testing.md", "l"],
  ["- Deploy           .claude/context/deploy.md", "l"],
  ["- Style guide      .claude/context/style.md", "l"],
  ["- API conventions  .claude/context/api.md", "l"],
  ["- Architecture     .claude/context/architecture.md", "l"],
];

const PROMPT =
  'claude "Add a model-routing rule for payments-api. Planckspace measured 64% of sessions on claude-opus-5-5 over 30 days, 71% of them routine: under 12 turns, single-file edits. Route routine work to claude-sonnet-5, keep Opus for multi-file refactors. Show me the plan and the diff first."';

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function FixItem({
  n,
  title,
  meta,
  state,
  primary,
  secondary,
}: {
  n: number;
  title: string;
  meta: string;
  state: "ready" | "applied" | "not-needed";
  primary?: string;
  secondary?: string;
}) {
  return (
    <div data-f={`item${n}`} className="rounded-[4px] border border-[#2b2b2b] bg-[#1f1f1f] p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[12.5px] font-medium leading-snug text-[#e6e6e6]">{title}</p>
        <span className="relative h-[18px] w-[76px] shrink-0 text-right text-[10.5px]">
          {state === "ready" && (
            <>
              <span data-f={`item${n}-ready`} className="absolute right-0 rounded-sm bg-[#c6ff3d1f] px-1.5 py-0.5 text-[#c6ff3d]">
                ready
              </span>
              <span data-f={`item${n}-measuring`} className="absolute right-0 rounded-sm bg-[#f7a53a24] px-1.5 py-0.5 text-[#f7a53a] opacity-0">
                measuring
              </span>
              <span data-f={`item${n}-improved`} className="absolute right-0 rounded-sm bg-[#3ddc9124] px-1.5 py-0.5 text-[#3ddc91] opacity-0">
                improved
              </span>
            </>
          )}
          {state === "applied" && <span className="rounded-sm bg-[#3ddc9124] px-1.5 py-0.5 text-[#3ddc91]">applied</span>}
          {state === "not-needed" && <span className="rounded-sm bg-[#ffffff12] px-1.5 py-0.5 text-[#8b8b8b]">not needed</span>}
        </span>
      </div>
      <p className="mt-1 text-[11px] leading-snug text-[#8b8b8b]">{meta}</p>
      {(primary || secondary) && (
        <div className="mt-2.5 flex gap-2">
          {primary && (
            <span data-f={`item${n}-btn`} className="relative inline-flex h-[26px] items-center rounded-[3px] bg-[#c6ff3d] px-2.5 text-[11.5px] font-semibold text-[#0b0b0c]">
              <span data-f={`item${n}-btn-label`}>{primary}</span>
              <span data-f={`item${n}-btn-busy`} className="absolute inset-0 grid place-items-center opacity-0">
                Applying…
              </span>
              <span data-f={`item${n}-btn-done`} className="absolute inset-0 grid place-items-center opacity-0">
                Applied
              </span>
            </span>
          )}
          {secondary && (
            <span data-f={`item${n}-btn2`} className="inline-flex h-[26px] items-center rounded-[3px] border border-[#3c3c3c] px-2.5 text-[11.5px] text-[#cccccc]">
              {secondary}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

const FixScene = forwardRef<HTMLDivElement>(function FixScene(_, ref) {
  return (
    <div ref={ref} className="relative h-[750px] w-[1200px] select-none overflow-hidden rounded-[10px] font-sans text-[13px]" style={{ background: VS.bg, color: VS.text }}>
      {/* title bar */}
      <div className="flex h-[34px] items-center justify-between border-b px-3" style={{ background: VS.side, borderColor: VS.line }}>
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <p className="text-[12px]" style={{ color: VS.dim }}>
          CLAUDE.md · web · Visual Studio Code
        </p>
        <div className="w-[52px]" />
      </div>

      <div className="flex h-[694px]">
        {/* activity bar */}
        <div className="flex w-[48px] flex-col items-center gap-5 border-r pt-3" style={{ background: VS.side, borderColor: VS.line, color: VS.faint }}>
          <Icon d="M14 3v4a1 1 0 0 0 1 1h4M5 3h9l5 5v13H5z" />
          <Icon d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3" />
          <Icon d="M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15 6a9 9 0 0 0-9 9" />
          <Icon d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 17h6M17 14v6" />
          <span className="relative grid h-[34px] w-full place-items-center" style={{ color: "#f7f5f0" }}>
            <span className="absolute left-0 top-0 h-full w-[2px] bg-[#c6ff3d]" />
            <PlanckspaceMark className="h-[20px] w-auto" accent="#C6FF3D" />
          </span>
        </div>

        {/* extension sidebar */}
        <div className="relative w-[340px] shrink-0 border-r" style={{ background: VS.side, borderColor: VS.line }}>
          <p className="flex h-[35px] items-center px-4 text-[11px] tracking-[0.08em]" style={{ color: VS.dim }}>
            PLANCKSPACE
          </p>
          <div className="mx-3 grid grid-cols-3 gap-px overflow-hidden rounded-[4px] bg-[#2b2b2b]">
            {[
              { k: "Spent", v: "$412" },
              { k: "Dead ends", v: "$61" },
              { k: "Removable", v: "$134/mo", lime: true },
            ].map((s) => (
              <div key={s.k} className="bg-[#1f1f1f] px-2.5 py-2">
                <p className="text-[10px]" style={{ color: VS.dim }}>
                  {s.k}
                </p>
                <p className={`mt-0.5 font-mono text-[13px] font-semibold ${s.lime ? "text-[#c6ff3d]" : "text-[#e6e6e6]"}`}>{s.v}</p>
              </div>
            ))}
          </div>
          <p className="mx-3 mt-1.5 text-[10px]" style={{ color: VS.faint }}>
            you · this month · computed on this machine
          </p>

          <div className="mx-3 mt-3 flex gap-4 border-b text-[11.5px]" style={{ borderColor: VS.line, color: VS.dim }}>
            {["Activity", "Skills", "Optimize", "Insights"].map((t) => (
              <span key={t} className={`pb-2 ${t === "Optimize" ? "border-b border-[#c6ff3d] text-[#e6e6e6]" : ""}`}>
                {t}
              </span>
            ))}
          </div>

          <p className="mx-3 mt-3 text-[11px] font-semibold tracking-[0.04em]" style={{ color: VS.dim }}>
            FIXES FOR YOU
          </p>
          <div className="mx-3 mt-2 space-y-2">
            <FixItem
              n={1}
              title="Split CLAUDE.md into on-demand sections"
              meta="11.2k tokens re-sent every turn · est. $96/mo"
              state="ready"
              primary="Fix now"
              secondary="Preview"
            />
            <FixItem
              n={2}
              title="Add a model-routing rule"
              meta="64% of sessions on Opus, 71% routine · est. $38/mo"
              state="ready"
              primary="Fix now"
              secondary="Fix with Claude Code"
            />
            <FixItem n={3} title="Default new sessions to Sonnet" meta="applied Sep 18 · backed up" state="applied" />
            <FixItem n={4} title="Session discipline rules" meta="3% of sessions abandoned, nothing to fix" state="not-needed" />
          </div>

          {/* before / after, revealed after the fix */}
          <div data-f="ba" className="absolute inset-x-3 bottom-3 rounded-[4px] border border-[#2b2b2b] bg-[#1f1f1f] p-3 opacity-0">
            <div className="flex items-center justify-between">
              <p className="text-[11.5px] font-medium text-[#e6e6e6]">Before / after · CLAUDE.md split</p>
              <p data-f="ba-sessions" className="font-mono text-[10.5px]" style={{ color: VS.dim }}>
                3 sessions since
              </p>
            </div>
            <p className="mt-1 text-[10.5px]" style={{ color: VS.dim }}>
              context read per turn
            </p>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-[42px] font-mono text-[10.5px]" style={{ color: VS.dim }}>
                  before
                </span>
                <span className="h-[8px] flex-1 bg-[#f48771]/80" />
                <span className="w-[40px] text-right font-mono text-[11px]">11.2k</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-[42px] font-mono text-[10.5px]" style={{ color: VS.dim }}>
                  after
                </span>
                <span className="flex h-[8px] flex-1">
                  <span data-f="ba-after" className="h-full bg-[#c6ff3d]" style={{ width: "100%" }} />
                </span>
                <span data-f="ba-after-num" className="w-[40px] text-right font-mono text-[11px] text-[#c6ff3d]">
                  11.2k
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* editor */}
        <div className="relative min-w-0 flex-1">
          <div className="flex h-[35px] items-end border-b" style={{ background: VS.side, borderColor: VS.line }}>
            <span className="flex h-full items-center gap-2 border-r border-t-2 border-t-[#c6ff3d] px-4 text-[12.5px]" style={{ background: VS.bg, borderRightColor: VS.line }}>
              <span className="text-[#519aba]">M↓</span> CLAUDE.md
            </span>
            <span data-f="newtabs" className="flex h-full items-center gap-4 px-4 text-[12px] opacity-0" style={{ color: VS.dim }}>
              <span>+ 5 files in .claude/context/</span>
            </span>
          </div>
          <p className="px-5 py-2 text-[11.5px]" style={{ color: VS.faint }}>
            web › CLAUDE.md
          </p>

          <div className="relative h-[420px] overflow-hidden font-mono text-[12.5px] leading-[19px]">
            <div data-f="old" className="absolute inset-x-0 top-0">
              {OLD_MD.map(([t, kind], i) => (
                <div key={i} data-f={kind === "h" && i > 0 ? "old-h" : "old-l"} className="relative flex">
                  <span className="w-[52px] shrink-0 pr-4 text-right" style={{ color: VS.faint }}>
                    {i + 1}
                  </span>
                  <span data-f="strike" className="absolute inset-y-0 left-[52px] right-0 bg-[#f4877129] opacity-0" />
                  <span className="relative whitespace-pre" style={{ color: kind === "h" ? VS.kw : VS.text }}>
                    {t}
                  </span>
                </div>
              ))}
            </div>
            <div data-f="new" className="absolute inset-x-0 top-0 opacity-0">
              {NEW_MD.map(([t, kind], i) => (
                <div key={i} data-f="new-l" className="relative flex">
                  <span className="w-[52px] shrink-0 pr-4 text-right" style={{ color: VS.faint }}>
                    {i + 1}
                  </span>
                  <span className="absolute inset-y-0 left-[52px] right-0 bg-[#4ec9b01c]" />
                  <span className="relative whitespace-pre" style={{ color: kind === "h" ? VS.kw : kind === "l" ? VS.str : VS.text }}>
                    {t}
                  </span>
                </div>
              ))}
              <p data-f="tokens" className="mt-4 pl-[52px] text-[11.5px]" style={{ color: VS.green }}>
                1,960 tokens, down from 11,240. Sections load only when a task needs them.
              </p>
            </div>
          </div>

          {/* terminal panel */}
          <div data-f="term" className="absolute inset-x-0 bottom-0 h-[250px] border-t" style={{ background: VS.side, borderColor: VS.line, transform: "translateY(100%)" }}>
            <div className="flex h-[32px] items-center gap-5 px-4 text-[11px] tracking-[0.04em]" style={{ color: VS.dim }}>
              <span className="border-b border-[#e6e6e6] pb-1 text-[#e6e6e6]">TERMINAL</span>
              <span className="pb-1">PROBLEMS</span>
              <span className="pb-1">OUTPUT</span>
            </div>
            <div className="px-4 pt-2 font-mono text-[12px] leading-[19px]">
              <p>
                <span className="text-[#4ec9b0]">~/payments-api</span> <span style={{ color: VS.dim }}>$</span>{" "}
                <span data-f="prompt" data-text={PROMPT} className="whitespace-pre-wrap break-words text-[#e6e6e6]" />
                <span data-f="caret" className="ml-px inline-block h-[14px] w-[7px] translate-y-[2px] bg-[#e6e6e6]" />
              </p>
              <p data-f="claude" className="mt-3 opacity-0">
                <span className="text-[#d97757]">●</span>{" "}
                <span className="text-[#e6e6e6]">I&apos;ll add the rule to .claude/settings.json. Here is the plan and the diff before I write anything.</span>
              </p>
            </div>
          </div>

          {/* toast */}
          <div data-f="toast" className="absolute bottom-4 right-4 w-[360px] rounded-[4px] border border-[#3c3c3c] bg-[#252526] p-3 opacity-0 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-start gap-2.5">
              <PlanckspaceMark className="mt-0.5 h-[14px] w-auto shrink-0 text-[#f7f5f0]" accent="#C6FF3D" />
              <p className="text-[12px] leading-snug text-[#e6e6e6]">
                CLAUDE.md split into 5 on-demand sections. Every touched file is backed up in ~/.planckspace/fix-backups.
              </p>
            </div>
            <div className="mt-2.5 flex justify-end gap-2">
              <span className="rounded-[3px] px-2.5 py-1 text-[11.5px]" style={{ color: VS.dim }}>
                Dismiss
              </span>
              <span className="rounded-[3px] bg-[#0078d4] px-2.5 py-1 text-[11.5px] text-white">Undo</span>
            </div>
          </div>
        </div>
      </div>

      {/* status bar */}
      <div className="absolute inset-x-0 bottom-0 flex h-[22px] items-center justify-between border-t px-3 text-[11px]" style={{ background: VS.side, borderColor: VS.line, color: VS.dim }}>
        <span>⎇ main</span>
        <span className="flex items-center gap-1.5">
          <PlanckspaceMark className="h-[10px] w-auto text-[#cccccc]" accent="#C6FF3D" />
          Planckspace · $14.20 today · billed
        </span>
      </div>

      {/* cursor */}
      <svg data-f="cursor" viewBox="0 0 24 24" className="pointer-events-none absolute left-0 top-0 h-[22px] w-[22px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" style={{ transform: "translate(760px, 560px)" }}>
        <path d="M5 3l14 7.5-6.2 1.6L10 18.5z" fill="#ffffff" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <div data-f="veil" className="pointer-events-none absolute inset-0 bg-[#1f1f1f] opacity-0" />
      <span data-f="ripple" className="pointer-events-none absolute -left-4 -top-4 h-8 w-8 rounded-full border-2 border-[#c6ff3d] opacity-0" />
    </div>
  );
});

export default memo(FixScene);
