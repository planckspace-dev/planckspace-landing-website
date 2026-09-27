"use client";

import Link from "next/link";
import { useRef, type ComponentProps, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────
   The button. Three behaviours, all in service of "this is pressable":

   1. A 45° sheet wipes across on hover (CSS, .btn::before), the same angle
      as the mark's chamfers, so the interaction belongs to the brand.
   2. The label rolls: an aria-hidden twin slides up into its place. The
      accessible name stays the single real label.
   3. On a fine pointer the whole button leans toward the cursor, a few
      pixels at most, and settles back when the pointer leaves. Off for
      touch and for reduced motion.
   ───────────────────────────────────────────────────────────────────────── */

type Variant = "lime" | "ghost" | "ink";
type Size = "md" | "sm";

interface Common {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Trailing icon box. Pass `false` for a plain label. */
  icon?: ReactNode | false;
  className?: string;
  magnetic?: boolean;
}

type AsLink = Common & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href" | "children" | "className">;
type AsButton = Common & { href?: undefined } & Omit<ComponentProps<"button">, "children" | "className">;

function useMagnet(enabled: boolean) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!enabled || !el) return;
      const mm = gsap.matchMedia();
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "expo.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "expo.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          xTo(Math.max(-9, Math.min(9, dx * 0.22)));
          yTo(Math.max(-7, Math.min(7, dy * 0.3)));
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
          gsap.set(el, { x: 0, y: 0 });
        };
      });
      return () => mm.revert();
    },
    { dependencies: [enabled] },
  );

  return ref;
}

function Inner({ children, icon, size }: { children: ReactNode; icon?: ReactNode | false; size: Size }) {
  return (
    <>
      <span className="roll">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      {icon !== false && (
        <span className="btn-icon" aria-hidden="true">
          {icon ?? <ArrowUpRight className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} strokeWidth={2} />}
        </span>
      )}
    </>
  );
}

export default function Button(props: AsLink | AsButton) {
  const { children, variant = "lime", size = "md", icon, className, magnetic = true, ...rest } = props;
  const ref = useMagnet(magnetic);
  const classes = cn("btn", `btn-${variant}`, size === "sm" && "btn-sm", icon === false && "btn-bare", className);
  const content = (
    <Inner icon={icon} size={size}>
      {children}
    </Inner>
  );

  if (rest.href !== undefined) {
    const { href, external, ...anchor } = rest as Omit<AsLink, keyof Common>;
    if (external || /^(https?:|mailto:)/.test(href)) {
      return (
        <a
          ref={ref as React.RefObject<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          {...anchor}
        >
          {content}
        </a>
      );
    }
    return (
      <Link ref={ref as React.RefObject<HTMLAnchorElement>} href={href} className={classes} {...anchor}>
        {content}
      </Link>
    );
  }

  const { type, ...button } = rest as Omit<AsButton, keyof Common>;
  return (
    <button ref={ref as React.RefObject<HTMLButtonElement>} type={type ?? "button"} className={classes} {...button}>
      {content}
    </button>
  );
}
