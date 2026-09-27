"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Sparkles, TerminalSquare, Zap } from "lucide-react";
import FixScene from "@/components/product/FixScene";
import ScaledStage from "@/components/product/ScaledStage";
import { useReducedMotion } from "@/components/product/parts";
import { buildFixTimeline, FIX_LOOP_SECONDS } from "@/components/product/fix-timeline";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────
   Fix. The extension applying a real fix, played live: one click, the file
   rewritten, a backup and an Undo, the saving measured from the next
   sessions, then a judgement call handed to your own Claude Code with the
   numbers attached. The loop only runs while it is on screen, and it can be
   paused; under reduced motion it rests on the measured frame.
   ───────────────────────────────────────────────────────────────────────── */

const CHAPTERS = [
  { t: 1.5, label: "Fix now" },
  { t: 3.4, label: "Backed up, undoable" },
  { t: 6.3, label: "Measured after" },
  { t: 9.3, label: "Handed to Claude Code" },
];

const MOVES = [
  {
    icon: Zap,
    title: "Mechanical fixes apply in one click",
    body: "Split an oversized CLAUDE.md, add a model-routing rule, set session rules, default new sessions to Sonnet.",
  },
  {
    icon: TerminalSquare,
    title: "Judgement calls go to your own agent",
    body: "Fix with Claude Code opens a visible terminal with a prompt carrying the measured data. It shows the plan and the diff first.",
  },
  {
    icon: RotateCcw,
    title: "Nothing is one-way",
    body: "Every file a fix touches is snapshotted first. Undo is one click, from the toast or the command palette.",
  },
];

export default function FixLoop() {
  const root = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const reduce = useReducedMotion();
  const [userPlaying, setPlaying] = useState(true);
  const playing = userPlaying && !reduce;
  const [chapter, setChapter] = useState(-1);
  const bar = useRef<HTMLDivElement>(null);
  const userPaused = useRef(false);

  useEffect(() => {
    const el = scene.current;
    if (!el) return;
    const timeline = buildFixTimeline(el, { repeat: true });
    tl.current = timeline;
    timeline.eventCallback("onUpdate", () => {
      const t = timeline.time();
      if (bar.current) bar.current.style.transform = `scaleX(${t / FIX_LOOP_SECONDS})`;
      let c = -1;
      CHAPTERS.forEach((ch, i) => {
        if (t >= ch.t) c = i;
      });
      setChapter(c);
    });

    // reduced motion: rest on the measured frame, never loop
    if (reduce) {
      timeline.seek(8.4).pause();
      return () => {
        timeline.kill();
      };
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !userPaused.current) timeline.play();
        else timeline.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timeline.kill();
    };
  }, [reduce]);

  const toggle = () => {
    const t = tl.current;
    if (!t) return;
    if (t.paused()) {
      userPaused.current = false;
      t.play();
      setPlaying(true);
    } else {
      userPaused.current = true;
      t.pause();
      setPlaying(false);
    }
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".fx-copy > *", {
          y: 30,
          autoAlpha: 0,
          stagger: 0.09,
          duration: 1,
          scrollTrigger: { trigger: ".fx-copy", start: "top 80%" },
        });
        gsap.from(".fx-moves > li", {
          y: 30,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 1,
          scrollTrigger: { trigger: ".fx-moves", start: "top 88%" },
        });
        gsap.from(".fx-player", {
          y: 60,
          autoAlpha: 0,
          duration: 1.3,
          scrollTrigger: { trigger: ".fx-player", start: "top 88%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="fix" aria-labelledby="fix-title" className="section bg-ink-1">
      <div className="wrap">
        <div className="fx-copy grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <h2 id="fix-title" className="t-display t-h2">
            Fix it in one click. Undo it in one more.
          </h2>
          <p className="t-lead lg:pb-2">
            The VS Code extension puts each finding next to your code with the fix attached. It runs in Cursor and
            Windsurf too, and your own numbers never leave your machine.
          </p>
        </div>

        <div className="fx-player mt-12 sm:mt-16">
          <div className="frame [--ch:26px] [--edge:rgb(247_245_240/0.14)] [--fill:#0f0f11]">
            <div className="frame-in p-2 sm:p-3">
              <ScaledStage width={1200} minScale={0.5}>
                <FixScene ref={scene} />
              </ScaledStage>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause the demo" : "Play the demo"}
              className="ch-br grid h-9 w-9 shrink-0 place-items-center bg-ink-3 text-fg transition-colors hover:bg-lime hover:text-ink [--ch:7px]"
            >
              {playing ? <Pause className="h-3.5 w-3.5 fill-current" strokeWidth={0} /> : <Play className="h-3.5 w-3.5 fill-current" strokeWidth={0} />}
            </button>
            <div className="relative h-px flex-1 bg-[var(--line-2)]">
              <div ref={bar} className="absolute inset-0 origin-left bg-lime" style={{ transform: "scaleX(0)" }} />
              {CHAPTERS.map((c) => (
                <span key={c.label} className="absolute -top-[3px] h-[7px] w-px bg-fg-3" style={{ left: `${(c.t / FIX_LOOP_SECONDS) * 100}%` }} />
              ))}
            </div>
          </div>
          <ol className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
            {CHAPTERS.map((c, i) => (
              <li
                key={c.label}
                className={cn(
                  "flex items-center gap-2 t-mono text-[11.5px] transition-colors duration-500",
                  i <= chapter ? "text-fg" : "text-fg-4",
                )}
              >
                <Sparkles className={cn("h-3 w-3 transition-colors", i === chapter ? "text-lime" : "text-transparent")} />
                {c.label}
              </li>
            ))}
          </ol>
        </div>

        <ul className="fx-moves mt-14 grid gap-8 border-t border-[var(--line)] pt-10 md:grid-cols-3">
          {MOVES.map((m) => (
            <li key={m.title} className="flex gap-4">
              <span className="ch-br grid h-10 w-10 shrink-0 place-items-center bg-ink-3 text-lime [--ch:8px]">
                <m.icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
              </span>
              <div>
                <h3 className="text-[1.05rem] font-semibold text-fg">{m.title}</h3>
                <p className="mt-1 text-[0.95rem] leading-relaxed text-fg-3">{m.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
