"use client";

import { useEffect, useRef, useState } from "react";

/* A terminal that plays its session once when it scrolls into view: commands
   type at a human-ish pace, output lands a beat later, the way a CLI answers.

   The full transcript is server-rendered and stays in the DOM the whole time
   (unrevealed characters are only visually hidden), so crawlers read it from
   the start and nothing reflows as it types. Assistive tech gets a plain
   copy instead of the animated one, and reduced motion simply shows the
   finished session. */

export type TermLine = { kind: "cmd" | "ok" | "dim"; text: string };

const CHAR_MS = 24;
const OUTPUT_PAUSE = 320;

export function TypedTerminal({ lines, delay = 0 }: { lines: TermLine[]; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  // [line index, chars shown in that line]; null = everything shown
  const [pos, setPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const run = (li: number, ci: number) => {
      if (cancelled) return;
      if (li >= lines.length) {
        setPos(null);
        return;
      }
      const line = lines[li];
      if (line.kind === "cmd" && ci < line.text.length) {
        setPos([li, ci + 1]);
        timer = setTimeout(() => run(li, ci + 1), CHAR_MS + (Math.random() * 18 - 6));
        return;
      }
      // line finished; next output line arrives after a pause
      const next = li + 1;
      const pause = lines[next]?.kind === "cmd" ? 500 : OUTPUT_PAUSE;
      timer = setTimeout(() => {
        if (next < lines.length && lines[next].kind !== "cmd") {
          setPos([next, lines[next].text.length]);
          run(next, lines[next].text.length);
        } else {
          setPos([next, 0]);
          run(next, 0);
        }
      }, pause);
    };

    // Two thresholds. The first clears the transcript while the terminal is
    // still a screen's quarter below the fold, so the reader never sees the
    // finished text vanish; the second starts typing once it is properly in.
    const arm = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        arm.disconnect();
        setPos([0, 0]);
      },
      { rootMargin: "0px 0px 25% 0px" },
    );
    const play = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        play.disconnect();
        // The stagger only makes sense when the terminals sit side by side.
        // Stacked on a phone, each one is reached by scrolling on its own.
        const wide = window.matchMedia("(min-width: 1024px)").matches;
        timer = setTimeout(() => run(0, 0), (wide ? delay : 0.25) * 1000);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    arm.observe(el);
    play.observe(el);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      arm.disconnect();
      play.disconnect();
    };
  }, [lines, delay]);

  const done = pos === null;

  return (
    <div ref={ref} className="terminal mt-auto">
      <div className="t-head">
        <span className="t-dot" />
        <span className="t-dot" />
        <span className="t-dot" />
      </div>
      <div className="t-body" aria-hidden>
        {lines.map((l, i) => {
          const shown = done ? l.text.length : i < pos[0] ? l.text.length : i === pos[0] ? pos[1] : 0;
          const lineVisible = done || i < pos[0] || (i === pos[0] && (l.kind === "cmd" || shown > 0));
          const caretHere = !done && i === pos[0] && l.kind === "cmd";
          const cls = l.kind === "ok" ? "t-green" : l.kind === "dim" ? "t-dim" : "";
          return (
            <div key={i} className={`${cls} whitespace-pre-wrap`} style={{ visibility: lineVisible ? "visible" : "hidden" }}>
              {l.kind === "cmd" && <span className="t-prompt">$ </span>}
              <span>{l.text.slice(0, shown)}</span>
              {caretHere && <span className="t-caret" aria-hidden />}
              <span style={{ visibility: "hidden" }}>{l.text.slice(shown)}</span>
            </div>
          );
        })}
      </div>
      <pre className="sr-only">
        {lines.map((l) => (l.kind === "cmd" ? `$ ${l.text}` : l.text)).join("\n")}
      </pre>
    </div>
  );
}
