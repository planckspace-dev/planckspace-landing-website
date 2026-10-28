"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

/* One quiet entrance per block: a 14px rise and a fade, once, as it scrolls
   into view. `mode="print"` instead brings the block's children in one after
   another (each child sets its own `--i`), the way a receipt prints. The
   hiding rules only apply once the layout's script has flagged
   <html data-js>, so without script the content is simply there; under
   reduced motion it appears without travelling. */

export default function Reveal({
  as: Tag = "div",
  mode = "reveal",
  delay = 0,
  className,
  style,
  children,
  id,
}: {
  as?: ElementType;
  mode?: "reveal" | "print";
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.setAttribute("data-in", "");
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const flag = mode === "print" ? { "data-print": "" } : { "data-reveal": "" };
  return (
    <Tag ref={ref} id={id} {...flag} className={className} style={{ "--d": `${delay}ms`, ...style } as CSSProperties}>
      {children}
    </Tag>
  );
}
