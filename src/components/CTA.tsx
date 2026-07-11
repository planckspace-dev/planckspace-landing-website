"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { CONSOLE_URL, INSTALL_CMD } from "@/lib/plans";

export default function CTA() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the command is selectable text */
    }
  };

  return (
    <section className="border-t border-[var(--border)] bg-[var(--panel)] py-24 sm:py-36">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-7" data-center="true">
            Get started
          </p>
          <h2 className="display-1 !text-[clamp(2.5rem,5vw,3.75rem)]">
            Stop guessing.
            <br />
            Start metering.
          </h2>
          <p className="lead mx-auto mt-6 max-w-xl">
            Your team's next AI session can be on the books. Free for 3 seats,
            live in about five minutes.
          </p>

          <div className="mx-auto mt-10 max-w-xl">
            <button
              type="button"
              onClick={copy}
              aria-label="Copy install command"
              className="terminal group flex w-full items-center gap-3 !rounded-full px-5 py-3.5 text-left transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.99]"
            >
              <span className="t-prompt">$</span>
              <code className="num flex-1 truncate text-[13px]">{INSTALL_CMD}</code>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors duration-300 group-hover:bg-[var(--brand-600)]">
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-[#4ade80]" strokeWidth={2} />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-white/80" strokeWidth={1.75} />
                )}
              </span>
            </button>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={`${CONSOLE_URL}/register`} className="btn btn-primary">
              Create your workspace
              <span className="btn-disc">
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
              </span>
            </a>
            <a href="/contact" className="btn btn-secondary">
              Talk to us
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
