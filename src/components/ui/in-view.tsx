"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Flags a subtree as on-screen by setting data-in="true" on its wrapper, once.
 *
 * All of the site's data-viz entry motion (bars growing, lines drawing, pixels
 * filling) is plain CSS keyed off that attribute; see the "living layer" in
 * globals.css. That keeps the charts themselves server-rendered markup, with
 * this one tiny observer as the only client code they need.
 */
export function InView({
  children,
  className,
  margin = "0px 0px -12% 0px",
}: {
  children: ReactNode;
  className?: string;
  margin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: margin, threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return (
    <div ref={ref} data-in={on ? "true" : "false"} className={className}>
      {children}
    </div>
  );
}

/**
 * True while the element is on screen and the reader has not asked for reduced
 * motion. Every looping animation on the page (the live session feed, the
 * metering pixels, the privacy packets) gates on this, so nothing burns a
 * frame while it is scrolled away or for someone who opted out.
 */
export function useLive<T extends Element>() {
  const ref = useRef<T>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => setLive(visible && !mq.matches);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    mq.addEventListener("change", sync);
    return () => {
      io.disconnect();
      mq.removeEventListener("change", sync);
    };
  }, []);

  return [ref, live] as const;
}
