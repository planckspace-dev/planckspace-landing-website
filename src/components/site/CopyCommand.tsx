"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/* A shell command you can take with you. The copy state is announced to
   screen readers, and the command stays selectable if the clipboard API is
   unavailable (insecure origins, some embedded browsers). */

export default function CopyCommand({ command, className }: { command: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const sel = window.getSelection();
      const node = document.getElementById(`cmd-${command.length}`);
      if (sel && node) {
        const range = document.createRange();
        range.selectNodeContents(node);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };

  return (
    <div className={cn("ch-br flex items-center gap-3 bg-ink-3 py-2 pl-4 pr-2 [--ch:10px]", className)}>
      <span className="t-mono select-none text-[13px] text-lime">$</span>
      <code id={`cmd-${command.length}`} className="t-mono min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-[13px] text-fg [scrollbar-width:none]">
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy command"}
        className="ch-br relative grid h-9 w-9 shrink-0 place-items-center bg-ink-4 text-fg-2 transition-colors hover:bg-lime hover:text-ink [--ch:7px]"
      >
        <Copy className={cn("h-4 w-4 transition-all duration-300", copied && "scale-50 opacity-0")} strokeWidth={1.7} />
        <Check className={cn("absolute h-4 w-4 text-lime transition-all duration-300", copied ? "scale-100 opacity-100" : "scale-50 opacity-0")} strokeWidth={2} />
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Command copied to clipboard" : ""}
      </span>
    </div>
  );
}
