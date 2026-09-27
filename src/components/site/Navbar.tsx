"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/site/Button";
import { Logo } from "@/components/ui/logo";
import { CONTACT_EMAIL, DEMO_PATH } from "@/lib/plans";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────
   The nav sits flat over the hero, then condenses into a floating chamfered
   bar once the page moves. Scrolling down tucks it away, scrolling up brings
   it back, so it is there when you reach for it and gone while you read.

   On small screens the links live in a full-screen menu. It is a real
   dialog: it mounts only while open, traps focus, closes on Escape, locks
   the page behind it, and hands focus back to the button that opened it.
   ───────────────────────────────────────────────────────────────────────── */

export const NAV_LINKS = [
  { label: "Product", href: "/#engine" },
  { label: "Fixes", href: "/#fix" },
  { label: "Savings", href: "/#savings" },
  { label: "Privacy", href: "/#privacy" },
  { label: "FAQ", href: "/#faq" },
];

export default function Navbar() {
  const bar = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useGSAP(() => {
    let hidden = false;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        setScrolled(y > 24);
        const hide = self.direction === 1 && y > 520;
        if (hide === hidden) return;
        hidden = hide;
        gsap.to(bar.current, { yPercent: hide ? -130 : 0, duration: 0.6, ease: "expo.out", overwrite: "auto" });
      },
    });
    return () => st.kill();
  });

  const close = useCallback(() => setOpen(false), []);

  // lock the page behind the menu (Lenis and native), restore on close
  useEffect(() => {
    if (!open) return;
    const button = trigger.current;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
      button?.focus();
    };
  }, [open]);

  // close on navigation: adjust state during render rather than in an effect
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const sync = () => mq.matches && setOpen(false);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // focus trap + Escape
  useEffect(() => {
    if (!open || !panel.current) return;
    const root = panel.current;
    const focusables = () =>
      Array.from(root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")).filter((el) => el.offsetParent !== null);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const els = focusables();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // menu entrance: the panel wipes down at 45°, links rise in sequence
  useGSAP(
    () => {
      if (!open || !panel.current) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          panel.current,
          { clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)" },
          { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 0.8, ease: "expo.out" },
        );
        gsap.from(panel.current!.querySelectorAll("[data-menu-item]"), {
          yPercent: 110,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.05,
          delay: 0.12,
        });
      });
      return () => mm.revert();
    },
    { dependencies: [open] },
  );

  return (
    <>
      <header ref={bar} className="nav-root">
        <div className={cn("nav-bar", scrolled && "is-scrolled")}>
          <Link href="/" aria-label="PlanckSpace home" className="nav-logo">
            <Logo height={22} />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link text-[0.875rem] font-medium text-fg-2 hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/contact" className="link hidden text-[0.875rem] font-medium text-fg-2 hover:text-fg sm:inline-block lg:mr-3">
              Contact
            </Link>
            <Button href={DEMO_PATH} size="sm" className="hidden xs:inline-flex">
              Book a demo
            </Button>
            <button
              ref={trigger}
              type="button"
              className="nav-burger lg:hidden"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span className={cn("nav-burger-lines", open && "is-open")} aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          ref={panel}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="nav-panel lg:hidden"
        >
          <nav aria-label="Menu" className="wrap flex h-full flex-col pb-[max(2rem,env(safe-area-inset-bottom))] pt-[calc(var(--nav-h)+2.5rem)]">
            <ul className="flex flex-col gap-1">
              {[...NAV_LINKS, { label: "Contact", href: "/contact" }].map((l) => (
                <li key={l.href} className="overflow-hidden">
                  <Link
                    href={l.href}
                    data-menu-item
                    onClick={close}
                    className="t-display block py-1.5 text-[clamp(2.4rem,11vw,4rem)] leading-[1.05] text-fg transition-colors hover:text-lime"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-5 overflow-hidden">
              <div data-menu-item>
                <Button href={DEMO_PATH} className="w-full">
                  Book a demo
                </Button>
              </div>
              <a data-menu-item href={`mailto:${CONTACT_EMAIL}`} className="t-mono text-sm text-fg-3">
                {CONTACT_EMAIL}
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
