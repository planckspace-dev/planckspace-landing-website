import Link from "next/link";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import Magnet from "@/components/reactbits/Magnet";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────
   The button, in the app's language: primary actions are ink with white
   type, secondary ones are white with a line. No arrows appended to labels;
   an external link carries the one glyph that says "leaves the site".

   `magnetic` lets the button lean a few pixels toward a nearby pointer
   (reactbits/Magnet): only with a fine pointer, never under reduced motion,
   and never for the keyboard. Use it on one primary action per screen.
   ───────────────────────────────────────────────────────────────────────── */

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface Common {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Leading icon. */
  icon?: ReactNode;
  /** Lean toward a nearby pointer by a few pixels. */
  magnetic?: boolean;
  className?: string;
}

type AsLink = Common & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href" | "children" | "className">;
type AsButton = Common & { href?: undefined } & Omit<ComponentProps<"button">, "children" | "className">;

export default function Button(props: AsLink | AsButton) {
  const { magnetic, ...rest } = props;
  const button = <PlainButton {...(rest as AsLink | AsButton)} />;
  return magnetic ? <Magnet>{button}</Magnet> : button;
}

function PlainButton(props: AsLink | AsButton): ReactElement {
  const { children, variant = "primary", size = "md", icon, className, ...rest } = props;
  const classes = cn("btn", `btn-${variant}`, size !== "md" && `btn-${size}`, className);

  if (rest.href !== undefined) {
    const { href, external, ...anchor } = rest as Omit<AsLink, keyof Common>;
    const content = (
      <>
        {icon}
        {children}
        {external && <ArrowUpRight className="h-4 w-4 opacity-60" strokeWidth={1.5} aria-hidden="true" />}
      </>
    );
    if (external || /^(https?:|mailto:)/.test(href)) {
      return (
        <a href={href} className={classes} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} {...anchor}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchor}>
        {content}
      </Link>
    );
  }

  const { type, ...button } = rest as Omit<AsButton, keyof Common>;
  return (
    <button type={type ?? "button"} className={classes} {...button}>
      {icon}
      {children}
    </button>
  );
}
