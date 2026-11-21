"use client";

import { useId, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/* A shell command you can take with you. The copy state is announced to
   screen readers, and the command stays selectable if the clipboard API is
   unavailable (insecure origins, some embedded browsers). `tone="dark"` is a
   glass pill for the night panel (glass only over a field or an image). The
   copy button draws 36px and takes taps across 44px. */

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
        "flex items-center gap-3 rounded-full py-2 pl-5 pr-2",
        dark ? "glass" : "border border-line bg-surface shadow-[var(--shadow-flat)]",
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
          "relative grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-150 after:absolute after:-inset-1 after:content-['']",
          dark ? "text-[#c3c7d0] hover:bg-white/10 hover:text-white" : "text-body hover:bg-band hover:text-ink",
        )}
      >
        <Copy
          aria-hidden
          className={cn("h-4 w-4 transition-[scale,opacity] duration-200 ease-[var(--ease-out-expo)]", copied && "scale-50 opacity-0")}
          strokeWidth={1.5}
        />
        <Check
          aria-hidden
          className={cn(
            "absolute h-4 w-4 transition-[scale,opacity] duration-200 ease-[var(--ease-out-expo)]",
            dark ? "text-[#6fd3a3]" : "text-green-700",
            copied ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
          strokeWidth={1.5}
        />
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Command copied to clipboard" : ""}
      </span>
    </div>
  );
}
