"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { CONSOLE_URL, DEMO_PATH } from "@/lib/plans";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Product", href: "/#product" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Lock scroll while the mobile overlay is open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 pointer-events-none">
        <div className="container-x">
          <nav
            className="pointer-events-auto mt-4 flex h-[3.25rem] items-center justify-between rounded-full border border-[var(--border)] bg-white/80 pl-4 pr-2 backdrop-blur-xl shadow-[0_1px_2px_rgba(17,19,26,0.04),0_12px_32px_-16px_rgba(17,19,26,0.18)]"
            aria-label="Main"
          >
            <Link href="/" className="shrink-0" aria-label="PlanckSpace home">
              <Logo markClassName="w-7 h-7" textClassName="text-[15px]" />
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="rounded-full px-3.5 py-1.5 text-[13.5px] font-medium text-[var(--text-2)] transition-colors duration-300 hover:bg-[var(--inset)] hover:text-[var(--ink)]"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-1.5">
              <a
                href={`${CONSOLE_URL}/login`}
                className="rounded-full px-3.5 py-1.5 text-[13.5px] font-medium text-[var(--text-2)] transition-colors duration-300 hover:text-[var(--ink)]"
              >
                Sign in
              </a>
              <Link
                href={DEMO_PATH}
                className="btn btn-primary !py-1.5 !pl-4 !text-[13.5px]"
              >
                Book a demo
                <span className="btn-disc !h-6 !w-6">
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                </span>
              </Link>
            </div>

            {/* mobile hamburger — two lines that morph into an X */}
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="md:hidden relative mr-2 h-9 w-9"
            >
              <span
                className={cn(
                  "absolute left-2 top-1/2 h-[1.5px] w-5 bg-[var(--ink)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  open ? "rotate-45" : "-translate-y-[3.5px]",
                )}
              />
              <span
                className={cn(
                  "absolute left-2 top-1/2 h-[1.5px] w-5 bg-[var(--ink)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  open ? "-rotate-45" : "translate-y-[3.5px]",
                )}
              />
            </button>
          </nav>
        </div>
      </header>

      {/* mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-30 md:hidden bg-white/90 backdrop-blur-2xl transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="container-x flex h-full flex-col justify-center gap-2">
          {LINKS.map((l, i) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "text-4xl font-semibold tracking-[-0.03em] text-[var(--ink)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
              )}
              style={{ transitionDelay: open ? `${100 + i * 60}ms` : "0ms" }}
            >
              {l.label}
            </Link>
          ))}
          <div
            className={cn(
              "mt-8 flex flex-col gap-3 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
            )}
            style={{ transitionDelay: open ? "360ms" : "0ms" }}
          >
            <Link
              href={DEMO_PATH}
              onClick={() => setOpen(false)}
              className="btn btn-primary w-max"
            >
              Book a demo
              <span className="btn-disc">
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
              </span>
            </Link>
            <a
              href={`${CONSOLE_URL}/login`}
              className="text-[15px] font-medium text-[var(--text-2)]"
            >
              Sign in →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
