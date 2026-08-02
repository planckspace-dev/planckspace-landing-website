"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { CONTACT_EMAIL, DEMO_PATH } from "@/lib/plans";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────
   The floating nav pill, and the full-screen menu behind it on touch.

   The menu is a real dialog, not a styled div. It mounts only while open, so
   its links are never in the tab order behind an invisible overlay; it traps
   focus while it is up and hands focus back to the trigger on close; Escape
   closes it. Those four things are what separate a menu that works from one
   that only looks like it does.

   Two earlier defects it exists to fix. The panel was translucent white over
   the live page, so whatever happened to be scrolled underneath showed
   through as ghost shapes behind the links. And its items were centred in the
   viewport, which left the list floating in the middle of a tall screen with
   dead space above and below. It is opaque now, and the list starts directly
   under the pill and reads top-down like the rest of the site.
   ───────────────────────────────────────────────────────────────────────── */

const LINKS = [
  { label: "Approach", href: "/#approach", note: "The four moves" },
  { label: "Product", href: "/#product", note: "What you get" },
  { label: "How it works", href: "/#how-it-works", note: "Three commands" },
  { label: "Contact", href: "/contact", note: "A human replies" },
];

/* The rest of the site, which the desktop pill has no room for and the footer
   carries instead. On a phone the menu is the only navigation surface there
   is, so it holds the full index — and four primary rows alone left a 350px
   void above the pinned action. Filling it with real destinations beats
   padding it out. */
const MORE = [
  { label: "Detection engine", href: "/#engine" },
  { label: "Privacy model", href: "/#privacy" },
  { label: "Questions", href: "/#faq" },
  {
    label: "VS Code extension",
    href: "https://open-vsx.org/extension/planckspace/planckspace-extension",
    external: true,
  },
];

const EASE = [0.32, 0.72, 0, 1] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  /* The pill lifts off the page once you leave the top of it. Without this it
     floats over scrolling content with the same weight it has at rest, and the
     hairline reads as a seam rather than an edge. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close on navigation. Every link in the panel closes it on click, which
     covers forward navigation including the in-page hash links that unmount
     nothing. This covers the other direction: a back or forward gesture while
     the panel is open, where there is no click to hang it off. */
  useEffect(() => {
    const onPop = () => setOpen(false);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /* Nothing to close against above the breakpoint: if the menu is open and the
     viewport crosses into the desktop layout, drop it rather than leaving a
     full-screen panel over a nav that already shows every link. */
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const sync = () => desktop.matches && setOpen(false);
    desktop.addEventListener("change", sync);
    return () => desktop.removeEventListener("change", sync);
  }, []);

  /* Scroll lock. overflow:hidden alone does not hold on iOS Safari, which
     keeps rubber-banding the body under the panel. Pinning the body at a
     negative offset does, and restoring that offset on close puts the reader
     back exactly where they were instead of at the top of the page. */
  useEffect(() => {
    if (!open) return;
    const y = window.scrollY;
    const { body } = document;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overscroll: body.style.overscrollBehavior,
    };
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.width = "100%";
    body.style.overscrollBehavior = "none";
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overscrollBehavior = prev.overscroll;
      // Restoring position must not animate, or the page visibly flies back.
      const behavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, y);
      document.documentElement.style.scrollBehavior = behavior;
    };
  }, [open]);

  /* Escape to close, and a focus trap so Tab cannot walk out of the panel into
     the page behind it. Focus returns to the hamburger on close, which is what
     a screen-reader or keyboard user expects to find under their cursor. */
  useEffect(() => {
    if (!open) return;

    // Touch browsers don't always focus a button on tap, which would leave the
    // trap with nothing to loop from. Anchor it explicitly on the trigger.
    triggerRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const trigger = triggerRef.current;

      // The trigger lives in the header, outside the panel, but stays part of
      // the loop: it is the control that closes this thing.
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        trigger?.focus();
      } else if (!e.shiftKey && document.activeElement === trigger) {
        e.preventDefault();
        first.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        trigger?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <header
        className="pointer-events-none fixed inset-x-0 top-0"
        style={{ zIndex: "var(--z-nav)" }}
      >
        <div className="container-x">
          <nav
            className={cn(
              "pointer-events-auto flex items-center justify-between rounded-full border bg-white/80 pl-4 pr-2 backdrop-blur-xl transition-[box-shadow,border-color,background-color] duration-500 ease-[var(--ease-swift)]",
              scrolled || open
                ? "border-[var(--border-strong)] bg-white/92 shadow-[0_1px_2px_rgba(17,19,26,0.05),0_16px_40px_-20px_rgba(17,19,26,0.28)]"
                : "border-[var(--border)] shadow-[0_1px_2px_rgba(17,19,26,0.04),0_12px_32px_-16px_rgba(17,19,26,0.18)]",
            )}
            style={{ height: "var(--nav-h)", marginTop: "var(--nav-top)" }}
            aria-label="Main"
          >
            {/* -my-2/py-2 gives the lockup a 40px-tall hit area inside the
                52px pill without moving it optically. */}
            <Link
              href="/"
              className="-my-2 shrink-0 rounded-full py-2"
              aria-label="PlanckSpace home"
              onClick={close}
            >
              <Logo height={24} />
            </Link>

            <div className="hidden items-center gap-1 md:flex">
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

            <div className="hidden items-center gap-1.5 md:flex">
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

            {/* Two rules that morph into an X. The button is a 44px target
                pulled flush with the pill's right edge by a negative margin,
                so the tap area is honest without the glyph drifting inward. */}
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative -mr-1 h-11 w-11 rounded-full md:hidden"
            >
              <span
                className={cn(
                  "absolute left-1/2 top-1/2 h-[1.5px] w-[1.125rem] -translate-x-1/2 rounded-full bg-[var(--ink)] transition-transform duration-500 ease-[var(--ease-swift)]",
                  open ? "rotate-45" : "-translate-y-[3.5px]",
                )}
              />
              <span
                className={cn(
                  "absolute left-1/2 top-1/2 h-[1.5px] w-[1.125rem] -translate-x-1/2 rounded-full bg-[var(--ink)] transition-transform duration-500 ease-[var(--ease-swift)]",
                  open ? "-rotate-45" : "translate-y-[3.5px]",
                )}
              />
            </button>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 flex flex-col overflow-y-auto bg-[var(--page)] md:hidden"
            style={{
              zIndex: "var(--z-menu)",
              paddingTop: "calc(var(--nav-block) + var(--nav-h) * 0.4)",
              paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
            }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduce ? 0.12 : 0.34, ease: EASE }}
          >
            {/* The same pixel field the hero sits on, held to the top third so
                the panel is a surface of this site rather than a blank sheet. */}
            <div aria-hidden className="menu-field" />

            <div className="container-x relative flex flex-1 flex-col">
              <nav aria-label="Site" className="border-t border-[var(--border)]">
                {LINKS.map((l, i) => (
                  <motion.div
                    key={l.label}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reduce ? 0.12 : 0.5,
                      delay: reduce ? 0 : 0.06 + i * 0.05,
                      ease: EASE,
                    }}
                  >
                    <Link
                      href={l.href}
                      onClick={close}
                      className="group flex items-center gap-4 border-b border-[var(--border)] py-4 active:bg-[var(--inset)]"
                    >
                      <span className="num w-6 shrink-0 text-[11px] text-[var(--text-3)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[26px] font-semibold leading-tight tracking-[-0.03em] text-[var(--ink)]">
                          {l.label}
                        </span>
                        <span className="mt-0.5 block text-[13px] text-[var(--text-3)]">
                          {l.note}
                        </span>
                      </span>
                      <ArrowUpRight
                        className="h-4 w-4 shrink-0 text-[var(--text-3)]"
                        strokeWidth={1.75}
                      />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                className="mt-7"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduce ? 0.12 : 0.5,
                  delay: reduce ? 0 : 0.26,
                  ease: EASE,
                }}
              >
                <p className="num mb-1 text-[10.5px] uppercase tracking-[0.16em] text-[var(--text-3)]">
                  More
                </p>
                <div className="grid grid-cols-2 gap-x-4">
                  {MORE.map((m) =>
                    m.external ? (
                      <a
                        key={m.label}
                        href={m.href}
                        onClick={close}
                        className="py-2.5 text-[14px] text-[var(--text-2)] active:text-[var(--ink)]"
                      >
                        {m.label}
                      </a>
                    ) : (
                      <Link
                        key={m.label}
                        href={m.href}
                        onClick={close}
                        className="py-2.5 text-[14px] text-[var(--text-2)] active:text-[var(--ink)]"
                      >
                        {m.label}
                      </Link>
                    ),
                  )}
                </div>
              </motion.div>

              {/* The action and the sign-off travel together, pinned to the
                  bottom of the panel. Pinning only the sign-off left a hairline
                  and one line of grey stranded under 200px of nothing; as one
                  block the whitespace above it reads as separation between the
                  list and the close, which is the intent. */}
              <motion.div
                className="mt-auto pt-8"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduce ? 0.12 : 0.5,
                  delay: reduce ? 0 : 0.28,
                  ease: EASE,
                }}
              >
                <Link
                  href={DEMO_PATH}
                  onClick={close}
                  className="btn btn-primary w-full"
                >
                  Book a demo
                  <span className="btn-disc">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                </Link>
                <p className="mt-3 text-center text-[13px] leading-relaxed text-[var(--text-3)]">
                  30 minutes with a founder, on your own numbers.
                </p>

                {/* The privacy line is the objection this product answers, and
                    a phone screen has room to state it where a pill never does. */}
                <div className="mt-7 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[var(--border)] pt-5">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="-my-2 break-all py-2 text-[13.5px] font-medium text-[var(--text-2)]"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  <span className="num shrink-0 text-[11px] text-[var(--text-3)]">
                    Metadata only
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
