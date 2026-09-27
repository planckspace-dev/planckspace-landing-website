"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Play, X } from "lucide-react";
import Button from "@/components/site/Button";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────
   The product tour: a 40-second film rendered frame by frame from the site's
   own product surfaces (app/studio). It lives in a native <dialog>, which
   brings Escape, focus containment and a backdrop with it; smooth scrolling
   pauses while it is open. The film has no soundtrack, so there is nothing to
   caption; the description below is what a screen reader gets instead.
   ───────────────────────────────────────────────────────────────────────── */

export const TOUR = {
  mp4: "/media/planckspace-tour.mp4",
  poster: "/media/planckspace-tour-poster.jpg",
  length: "0:40",
};

const DESCRIPTION =
  "A 40-second tour of PlanckSpace on a sample workspace: findings priced in dollars; the VS Code extension splitting a CLAUDE.md in one click, backing it up, measuring the result and handing a model-routing fix to Claude Code; the verified savings curve; and the metadata payload that is the only thing to leave a developer's machine.";

const noop = () => () => {};

export function useTourDialog() {
  // client-only: the dialog is portalled to <body> so no section's entrance
  // animation (which target their own children) can ever style it
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);

  const show = () => {
    dialog.current?.showModal();
    setOpen(true);
  };
  const hide = () => dialog.current?.close();

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClose = () => {
      setOpen(false);
      video.current?.pause();
    };
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, [mounted]);

  useEffect(() => {
    if (open) {
      window.__lenis?.stop();
      video.current?.play().catch(() => {});
    } else {
      window.__lenis?.start();
    }
  }, [open]);

  const node = (
    <dialog
      ref={dialog}
      aria-label="PlanckSpace product tour"
      aria-describedby="tour-desc"
      className="tour-dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) hide();
      }}
    >
      <div className="relative mx-auto w-full max-w-[88rem] px-4 sm:px-8">
        <div className="mb-3 flex items-center justify-between">
          <p className="t-mono text-[12px] text-fg-3">Product tour · {TOUR.length} · sample workspace</p>
          <button
            type="button"
            onClick={hide}
            aria-label="Close the tour"
            className="ch-br grid h-10 w-10 place-items-center bg-ink-3 text-fg transition-colors hover:bg-lime hover:text-ink [--ch:8px]"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
        <div className="frame [--ch:26px] [--edge:rgb(198_255_61/0.45)] [--fill:#000]">
          <div className="frame-in">
            {open && (
              <video ref={video} className="block aspect-video w-full" controls playsInline preload="auto" poster={TOUR.poster}>
                <source src={TOUR.mp4} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
        <p id="tour-desc" className="sr-only">
          {DESCRIPTION}
        </p>
      </div>
    </dialog>
  );

  return { show, node: mounted ? createPortal(node, document.body) : null };
}

/** The button that opens the tour, in the site's button language. */
export default function TourButton({ variant = "ghost", className, label = "Watch the tour" }: { variant?: "ghost" | "lime" | "ink"; className?: string; label?: string }) {
  const { show, node } = useTourDialog();
  return (
    <>
      <Button
        variant={variant}
        onClick={show}
        className={cn(className)}
        icon={<Play className="h-3.5 w-3.5 fill-current" strokeWidth={0} />}
      >
        {label}
      </Button>
      {node}
    </>
  );
}

/** A poster-frame card that opens the tour; used where a thumbnail reads better than a button. */
export function TourCard({ className }: { className?: string }) {
  const { show, node } = useTourDialog();
  return (
    <>
      <button type="button" onClick={show} className={cn("group relative block w-full text-left", className)} aria-label={`Watch the product tour, ${TOUR.length}`}>
        <span className="frame block [--ch:22px]">
          <span className="frame-in relative block overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={TOUR.poster} alt="" className="block aspect-video w-full object-cover opacity-80 transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.02] group-hover:opacity-100" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="ch-br flex items-center gap-3 bg-lime px-5 py-3 text-[0.95rem] font-semibold text-ink [--ch:10px]">
                <Play className="h-4 w-4 fill-current" strokeWidth={0} />
                Watch the tour
                <span className="t-mono text-[12px] font-normal text-on-lime-2">{TOUR.length}</span>
              </span>
            </span>
          </span>
        </span>
      </button>
      {node}
    </>
  );
}
