"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import TokenStream from "@/components/hero/TokenStream";
import FixScene from "@/components/product/FixScene";
import { buildFixTimeline } from "@/components/product/fix-timeline";
import { FindingCard } from "@/components/sections/FindingsGallery";
import { SavingsCurve } from "@/components/sections/Verify";
import { PlanckMark } from "@/components/ui/logo";
import { FINDINGS, RECEIPTS, realizedTotal, removableTotal, savedToDate, usd } from "@/lib/sample";
import { setFilmTime } from "@/lib/film-clock";

gsap.registerPlugin(DrawSVGPlugin);

/* ─────────────────────────────────────────────────────────────────────────
   The product tour, as a 1920 x 1080 film (camera targets are computed from
   no dashboard: the site never shows the product console). Every moving part hangs off one
   paused master timeline and the film clock, so window.__film.seek(t)
   renders the exact frame for t. The studio capture script steps through it
   at 30 fps and pipes the frames to ffmpeg.
   ───────────────────────────────────────────────────────────────────────── */

export const TOUR_SECONDS = 40.2;

const CHAPTERS = [
  { at: 4.2, n: "01", t: "Find" },
  { at: 11.2, n: "02", t: "Fix" },
  { at: 26.2, n: "03", t: "Verify" },
  { at: 32.2, n: "04", t: "Privacy" },
];

const PAYLOAD: [string, string][] = [
  ["tool", '"claude_code"'],
  ["model", '"claude-sonnet-5"'],
  ["repo", '"payments-api"'],
  ["turns", "18"],
  ["tokens", "{ in: 12840, out: 5364 }"],
  ["active_min", "14"],
  ["cost_usd", "2.41"],
];

declare global {
  interface Window {
    __film?: { duration: number; fps: number; seek: (t: number) => void; ready: boolean };
  }
}

export default function TourFilm() {
  const root = useRef<HTMLDivElement>(null);
  const fixRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const q = (s: string) => el.querySelectorAll<HTMLElement>(s);
    const one = (s: string) => el.querySelector<HTMLElement>(s);
    const m = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });

    const scene = (name: string, from: number, to: number) => {
      m.set(one(`[data-scene="${name}"]`), { autoAlpha: 0 }, 0)
        .to(one(`[data-scene="${name}"]`), { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, from)
        .to(one(`[data-scene="${name}"]`), { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, to - 0.5);
    };

    /* 1 · title */
    scene("title", 0, 4.4);
    m.fromTo(q(".ft-ch"), { "--wdth": 48, yPercent: 110 }, { "--wdth": 112, yPercent: 0, duration: 1.3, stagger: 0.03 }, 0.4)
      .fromTo(one(".ft-mark"), { scale: 0.5, rotate: -14, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 1.4 }, 0.1)
      .fromTo(one(".ft-sub"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 1.4);

    /* 3 · findings */
    scene("find", 4.2, 11.2);
    m.fromTo(q(".ff-card"), { x: 260, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.1, stagger: 0.35 }, 4.8)
      .fromTo(one(".ff-sum"), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 6.6)
      .fromTo(q(".ff-head > *"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1 }, 4.4);

    /* 4 · the fix loop, nested whole */
    scene("fix", 11.2, 26.5);
    const fix = buildFixTimeline(fixRef.current!, { repeat: false });
    fix.paused(false);
    m.add(fix, 11.4).fromTo(q(".fx-head > *"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1 }, 11.4);

    /* 5 · verify */
    scene("verify", 26.2, 32.5);
    const counter = { v: 0 };
    const num = one(".fv-num");
    m.fromTo(
      counter,
      { v: 0 },
      {
        v: realizedTotal,
        duration: 2.2,
        ease: "power4.out",
        immediateRender: false,
        onUpdate: () => {
          if (num) num.textContent = usd(Math.round(counter.v));
        },
      },
      26.6,
    )
      .fromTo(one('[data-scene="verify"] .vf-line'), { drawSVG: "0%" }, { drawSVG: "100%", duration: 2.4, ease: "power2.inOut" }, 26.9)
      .fromTo(one('[data-scene="verify"] .vf-area'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 27.7)
      .fromTo(q('[data-scene="verify"] .vf-pin, [data-scene="verify"] .vf-pin-label'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, stagger: 0.25 }, 27.4)
      .fromTo(one('[data-scene="verify"] .vf-proj'), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.8 }, 29.3);

    /* 6 · privacy */
    scene("privacy", 32.2, 36.5);
    m.fromTo(q(".fp-line"), { x: -16, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, stagger: 0.18 }, 32.8)
      .fromTo(q(".fp-head > *"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1 }, 32.3);

    /* 7 · end */
    m.set(one('[data-scene="end"]'), { autoAlpha: 0 }, 0).to(one('[data-scene="end"]'), { autoAlpha: 1, duration: 0.7 }, 36.2);
    m.fromTo(q(".fe-in > *"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.12 }, 36.5);

    /* chapter label */
    CHAPTERS.forEach((c, i) => {
      const next = CHAPTERS[i + 1]?.at ?? 36.2;
      const label = one(`[data-chapter="${c.n}"]`);
      m.set(label, { autoAlpha: 0 }, 0)
        .to(label, { autoAlpha: 1, duration: 0.4 }, c.at + 0.2)
        .to(label, { autoAlpha: 0, duration: 0.3 }, next - 0.3);
    });

    m.set({}, {}, TOUR_SECONDS);

    const seek = (t: number) => {
      setFilmTime(t);
      m.seek(t, false);
    };
    seek(0);
    window.__film = { duration: TOUR_SECONDS, fps: 30, seek, ready: true };
    return () => {
      m.kill();
      delete window.__film;
    };
  }, []);

  return (
    <div ref={root} className="film relative h-[1080px] w-[1920px] overflow-hidden bg-ink">
      {/* 1 · title */}
      <section data-scene="title" className="hero absolute inset-0 !min-h-0">
        <div className="hero-scene" aria-hidden="true">
          <TokenStream className="absolute inset-0 h-full w-full" />
          <div className="hero-vignette" />
          <div data-stream-ap className="ft-mark hero-mark">
            <PlanckMark className="h-full w-full" />
          </div>
          <div data-stream-ledger className="hero-ledger" />
        </div>
        <div data-stream-calm className="absolute bottom-[120px] left-[110px] z-10">
          <h1 className="t-display text-[132px] leading-[0.9]">
            {["Every token,", "accounted for."].map((l) => (
              <span key={l} className="block overflow-hidden pb-[0.08em]">
                {Array.from(l).map((c, i) => (
                  <span key={i} className="ft-ch inline-block" style={{ fontVariationSettings: '"wdth" var(--wdth)' }}>
                    {c === " " ? " " : c}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="ft-sub t-lead mt-8 !text-[28px]">Meter every AI tool your team pays for. Fix the waste. Prove the savings.</p>
        </div>
      </section>

      {/* 3 · findings */}
      <section data-scene="find" className="absolute inset-0 px-[110px] pt-[110px]">
        <div className="ff-head">
          <h2 className="t-display text-[84px] leading-[0.95] [--wdth:110]">It finds the waste. Then it prices it.</h2>
        </div>
        <div className="mt-14 flex gap-6">
          {FINDINGS.filter((f) => ["model", "context", "dormant"].includes(f.id)).map((f) => (
            <div key={f.id} className="ff-card h-[640px] w-[440px] shrink-0">
              <FindingCard f={f} on />
            </div>
          ))}
          <div className="ff-sum ch-br flex w-[380px] flex-col justify-end bg-lime p-9 text-on-lime [--ch:22px]">
            <p className="t-mono text-[18px]">Removable this month</p>
            <p className="t-meter mt-4 text-[88px] leading-none">{usd(removableTotal)}</p>
            <p className="t-mono mt-2 text-[20px]">/mo, all real dollars</p>
          </div>
        </div>
      </section>

      {/* 4 · fix */}
      <section data-scene="fix" className="absolute inset-0">
        <div className="fx-head absolute left-[110px] top-[64px]">
          <h2 className="t-display text-[64px] leading-none [--wdth:110]">Fix it in one click. Undo it in one more.</h2>
        </div>
        <div className="absolute left-1/2 top-[170px] -translate-x-1/2">
          <div style={{ width: 1200 * 1.11, height: 750 * 1.11 }}>
            <div style={{ transform: "scale(1.11)", transformOrigin: "0 0" }}>
              <FixScene ref={fixRef} />
            </div>
          </div>
        </div>
      </section>

      {/* 5 · verify */}
      <section data-scene="verify" className="absolute inset-0 px-[110px] pt-[110px]">
        <div className="flex items-end justify-between">
          <h2 className="t-display text-[84px] leading-[0.95] [--wdth:110]">
            Savings you
            <br />
            can audit.
          </h2>
          <div className="text-right">
            <p className="flex items-baseline justify-end gap-4">
              <span className="fv-num t-meter text-[190px] leading-[0.85] text-lime">{usd(realizedTotal)}</span>
              <span className="t-mono text-[30px] text-fg-3">/mo</span>
            </p>
            <p className="t-mono mt-5 text-[21px] text-fg-2">
              off the bill, verified · {usd(savedToDate)} saved to date · {RECEIPTS.length} receipts
            </p>
          </div>
        </div>
        <div className="mt-20">
          <SavingsCurve W={1700} H={430} />
        </div>
      </section>

      {/* 6 · privacy */}
      <section data-scene="privacy" className="absolute inset-0 grid grid-cols-[1fr_760px] items-center gap-24 px-[110px]">
        <div className="fp-head">
          <p className="t-kicker !text-[20px]">The privacy model</p>
          <h2 className="t-display mt-6 text-[96px] leading-[0.95] [--wdth:110]">Metadata in. Your code never leaves.</h2>
          <p className="t-lead mt-8 !text-[27px]">Tokens, timings, model, repo. Never prompts, responses or code.</p>
        </div>
        <div className="frame [--ch:26px] [--edge:rgb(198_255_61/0.5)]">
          <div className="frame-in term p-10 !text-[25px] !leading-[1.75]">
            <p className="fp-line">
              <span className="p">$</span> <span className="hi">planck inspect ses_8f2a91c</span>
            </p>
            <p className="fp-line dim mt-3">{"{"}</p>
            {PAYLOAD.map(([k, v]) => (
              <p key={k} className="fp-line pl-8">
                <span className="text-sig-blue">{k}</span>
                <span className="dim">: </span>
                <span className="hi">{v}</span>
              </p>
            ))}
            <p className="fp-line dim">{"}"}</p>
          </div>
        </div>
      </section>

      {/* 7 · end */}
      <section data-scene="end" className="absolute inset-0 grid place-items-center">
        <div className="fe-in flex flex-col items-center text-center">
          <PlanckMark className="h-[120px] w-auto" />
          <h2 className="t-display mt-14 text-[112px] leading-[0.95] [--wdth:108]">
            See what your AI bill
            <br />
            is made of.
          </h2>
          <p className="t-mono mt-12 text-[30px] text-lime">planckspace.dev/demo</p>
        </div>
      </section>

      {/* chapter label */}
      {CHAPTERS.map((c) => (
        <p key={c.n} data-chapter={c.n} className="t-mono ch-br absolute right-[96px] top-[48px] bg-ink px-4 py-2 text-[20px] text-fg-2 [--ch:8px]">
          <span className="text-lime">{c.n}</span> {c.t}
        </p>
      ))}
    </div>
  );
}
