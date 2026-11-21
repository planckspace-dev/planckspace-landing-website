import type { ReactNode } from "react";
import Reveal from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

/* A section's opening: a small mono label (with its index when the section is
   one step of the loop), the headline (its second clause wrapped in
   <span className="tone">), and a lede. The headline gets the full measure of
   the column and carries the section; the lede sits under it, a reading
   width wide. `size="xl"` is for the page's statements (the problem, the
   proof); everything else is `lg`. */

export default function SectionHead({
  id,
  index,
  eyebrow,
  title,
  lede,
  align = "left",
  size = "lg",
  className,
  titleClassName,
  ledeClassName,
  children,
}: {
  id: string;
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  size?: "xl" | "lg";
  className?: string;
  titleClassName?: string;
  ledeClassName?: string;
  children?: ReactNode;
}) {
  const center = align === "center";

  return (
    <Reveal className={cn(center && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="eyebrow">
          {index && <span className="eyebrow-n">{index}</span>}
          {eyebrow}
        </p>
      )}
      <h2 id={id} className={cn(size === "xl" ? "title-xl" : "title-lg", eyebrow && "mt-6 sm:mt-7", center && "mx-auto", titleClassName)}>
        {title}
      </h2>
      {lede && <p className={cn("lede mt-7 max-w-[40rem] sm:mt-8", center && "mx-auto", ledeClassName)}>{lede}</p>}
      {children}
    </Reveal>
  );
}
