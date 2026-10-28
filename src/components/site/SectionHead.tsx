import type { ReactNode } from "react";
import Reveal from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

/* A section's opening: a small mono label (with its index when the section is
   one step of the loop), the headline (its second clause wrapped in
   <span className="tone">), and a lede. `split` sets the lede beside the
   headline on wide screens, bottom-aligned. */

export default function SectionHead({
  id,
  index,
  eyebrow,
  title,
  lede,
  align = "left",
  split,
  className,
  children,
}: {
  id: string;
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  split?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const center = align === "center";
  const label = eyebrow && (
    <p className="eyebrow">
      {index && <span className="eyebrow-n">{index}</span>}
      {eyebrow}
    </p>
  );

  if (split) {
    return (
      <Reveal className={cn("grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end lg:gap-20", className)}>
        <div>
          {label}
          <h2 id={id} className={cn("title-lg max-w-[16ch]", eyebrow && "mt-5")}>
            {title}
          </h2>
        </div>
        <div className="lg:pb-2">
          {lede && <p className="lede">{lede}</p>}
          {children}
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal className={cn(center ? "mx-auto max-w-[50rem] text-center" : "max-w-[48rem]", className)}>
      {label}
      <h2 id={id} className={cn("title-lg", eyebrow && "mt-5")}>
        {title}
      </h2>
      {lede && <p className={cn("lede mt-6", center ? "mx-auto max-w-[40rem]" : "max-w-[40rem]")}>{lede}</p>}
      {children}
    </Reveal>
  );
}
