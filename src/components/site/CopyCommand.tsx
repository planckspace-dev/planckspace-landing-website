"use client";

import { useId, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/* A shell command you can take with you. The copy state is announced to
   screen readers, and the command stays selectable if the clipboard API is
   unavailable (insecure origins, some embedded browsers). `tone="dark"` sits
   on the ink panel. */

export default function CopyCommand({ command, className, tone = "light" }: { command: string; className?: string; tone?: "light" | "dark" }) {
  const [copied, setCopied] = useState(false);
  const id = `cmd-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const dark = tone === "dark";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const sel = window.getSelection();
      const node = document.getElementById(id);
      if (sel && node) {
        const range = document.createRange();
        range.selectNodeContents(node);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5",
        dark ? "bg-white/[0.06] ring-1 ring-white/10" : "border border-line bg-surface shadow-[var(--shadow-flat)]",
        className,
      )}
    >
      <span className={cn("select-none font-mono text-[0.8125rem]", dark ? "text-[#8fb2ff]" : "text-brand-600")}>$</span>
      <code
        id={id}
        className={cn("min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[0.8125rem] [scrollbar-width:none]", dark ? "text-white" : "text-ink")}
      >
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy command"}
        className={cn(
          "relative grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors",
          dark ? "text-[#b9bbc0] hover:bg-white/10 hover:text-white" : "text-body hover:bg-band hover:text-ink",
        )}
      >
        <Copy className={cn("h-4 w-4 transition-all duration-200", copied && "scale-50 opacity-0")} strokeWidth={1.7} />
        <Check
          className={cn("absolute h-4 w-4 transition-all duration-200", dark ? "text-[#6fd3a3]" : "text-green-700", copied ? "scale-100 opacity-100" : "scale-50 opacity-0")}
          strokeWidth={2}
        />
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Command copied to clipboard" : ""}
      </span>
    </div>
  );
}
