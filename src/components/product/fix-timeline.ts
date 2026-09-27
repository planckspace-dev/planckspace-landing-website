import { gsap } from "gsap";

/* The fix loop, as one timeline over FixScene. Every state change is a tween
   or a set placed on the timeline, never a free-running callback, so
   timeline.seek(t) renders the exact frame for any t. That is what lets the
   same choreography play live on the page and be captured into a video. */

export const FIX_LOOP_SECONDS = 15;

/** Position of an element in the scene's own (unscaled) coordinates. */
function at(root: HTMLElement, el: HTMLElement | null, fx = 0.5, fy = 0.5) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x: x + (el?.offsetWidth ?? 0) * fx, y: y + (el?.offsetHeight ?? 0) * fy };
}

export function buildFixTimeline(root: HTMLElement, opts: { repeat?: boolean } = {}) {
  const q = (name: string) => root.querySelector<HTMLElement>(`[data-f="${name}"]`);
  const qa = (name: string) => Array.from(root.querySelectorAll<HTMLElement>(`[data-f="${name}"]`));

  const cursor = q("cursor");
  const ripple = q("ripple");
  const prompt = q("prompt");
  const full = prompt?.dataset.text ?? "";
  const btn1 = at(root, q("item1-btn"), 0.45, 0.55);
  const btn2 = at(root, q("item2-btn2"), 0.4, 0.55);
  const rest = { x: 760, y: 560 };

  const tl = gsap.timeline({
    paused: true,
    repeat: opts.repeat ? -1 : 0,
    defaults: { ease: "power3.out" },
  });

  // ── initial state (placed on the timeline so every loop and seek resets) ──
  tl.set(cursor, { x: rest.x, y: rest.y, opacity: 1 }, 0)
    .set(ripple, { opacity: 0, scale: 0.2 }, 0)
    .set(q("item1-btn-label"), { opacity: 1 }, 0)
    .set(q("item1-btn-busy"), { opacity: 0 }, 0)
    .set(q("item1-btn-done"), { opacity: 0 }, 0)
    .set(q("item1-btn"), { opacity: 1, scale: 1 }, 0)
    .set([q("item1-measuring"), q("item1-improved")], { opacity: 0 }, 0)
    .set(q("item1-ready"), { opacity: 1 }, 0)
    .set(qa("strike"), { opacity: 0 }, 0)
    .set(q("old"), { opacity: 1, y: 0 }, 0)
    .set(q("new"), { opacity: 0 }, 0)
    .set(qa("new-l"), { opacity: 0, x: -10 }, 0)
    .set(q("tokens"), { opacity: 0 }, 0)
    .set(q("newtabs"), { opacity: 0 }, 0)
    .set(q("toast"), { opacity: 0, y: 24 }, 0)
    .set(q("ba"), { opacity: 0, y: 16 }, 0)
    .set(q("ba-after"), { width: "100%" }, 0)
    // y: 0 matters: GSAP reads the SSR'd translateY(100%) as pixels and would add it to yPercent
    .set(q("term"), { y: 0, yPercent: 100 }, 0)
    .set(q("claude"), { opacity: 0 }, 0)
    .set(q("item2-btn2"), { scale: 1 }, 0)
    .set(q("veil"), { opacity: 1 }, 0);

  const typed = { n: 0 };
  const writePrompt = () => {
    if (prompt) prompt.textContent = full.slice(0, Math.round(typed.n));
  };
  tl.set(typed, { n: 0, onUpdate: writePrompt }, 0);

  const num = { v: 11.2 };
  const numEl = q("ba-after-num");
  const writeNum = () => {
    if (numEl) numEl.textContent = `${num.v.toFixed(1)}k`;
  };
  tl.set(num, { v: 11.2, onUpdate: writeNum }, 0);

  const click = (t: number, p: { x: number; y: number }, target: HTMLElement | null) => {
    tl.set(ripple, { x: p.x, y: p.y, opacity: 0.9, scale: 0.2 }, t)
      .to(ripple, { scale: 1.8, opacity: 0, duration: 0.55, ease: "power2.out" }, t)
      .to(target, { scale: 0.93, duration: 0.09, ease: "power1.out" }, t)
      .to(target, { scale: 1, duration: 0.3 }, t + 0.1);
  };

  // ── the loop ────────────────────────────────────────────────────────────
  tl.to(q("veil"), { opacity: 0, duration: 0.5, ease: "power1.out" }, 0)
    .to(cursor, { x: btn1.x, y: btn1.y, duration: 1.1, ease: "power2.inOut" }, 0.35);
  click(1.55, btn1, q("item1-btn"));
  tl.to(q("item1-btn-label"), { opacity: 0, duration: 0.15 }, 1.7)
    .to(q("item1-btn-busy"), { opacity: 1, duration: 0.15 }, 1.7)
    .to(qa("strike").slice(2), { opacity: 1, duration: 0.25, stagger: 0.02 }, 1.95)
    .to(q("old"), { opacity: 0, y: -14, duration: 0.45, ease: "power2.in" }, 2.75)
    .set(q("new"), { opacity: 1 }, 3.15)
    .to(qa("new-l"), { opacity: 1, x: 0, duration: 0.45, stagger: 0.05 }, 3.15)
    .to(q("newtabs"), { opacity: 1, duration: 0.4 }, 3.3)
    .to(q("item1-btn-busy"), { opacity: 0, duration: 0.2 }, 3.3)
    .to(q("item1-btn-done"), { opacity: 1, duration: 0.2 }, 3.35)
    .to(q("item1-btn"), { opacity: 0.55, duration: 0.3 }, 3.3)
    .to(q("item1-ready"), { opacity: 0, duration: 0.2 }, 3.35)
    .to(q("item1-measuring"), { opacity: 1, duration: 0.2 }, 3.4)
    .to(q("toast"), { opacity: 1, y: 0, duration: 0.6 }, 3.45)
    .to(q("tokens"), { opacity: 1, duration: 0.5 }, 3.9)
    .to(cursor, { x: rest.x + 60, y: rest.y - 40, duration: 1, ease: "power2.inOut" }, 3.6)
    .to(q("toast"), { opacity: 0, y: 16, duration: 0.4, ease: "power2.in" }, 5.6)
    .to(q("ba"), { opacity: 1, y: 0, duration: 0.6 }, 5.8)
    .to(q("ba-after"), { width: "28%", duration: 1.4, ease: "expo.out" }, 6.4)
    .fromTo(num, { v: 11.2 }, { v: 3.1, duration: 1.4, ease: "expo.out", immediateRender: false, onUpdate: writeNum }, 6.4)
    .to(q("item1-measuring"), { opacity: 0, duration: 0.2 }, 7.6)
    .to(q("item1-improved"), { opacity: 1, duration: 0.25 }, 7.65)
    .to(cursor, { x: btn2.x, y: btn2.y, duration: 1.05, ease: "power2.inOut" }, 8.2);
  click(9.35, btn2, q("item2-btn2"));
  tl.to(q("term"), { yPercent: 0, duration: 0.7, ease: "expo.out" }, 9.5)
    .to(cursor, { x: rest.x + 140, y: rest.y - 250, opacity: 0, duration: 0.8, ease: "power2.in" }, 9.7)
    .fromTo(typed, { n: 0 }, { n: full.length, duration: 2.6, ease: "none", immediateRender: false, onUpdate: writePrompt }, 10.0)
    .to(q("claude"), { opacity: 1, duration: 0.5 }, 12.8)
    .to(q("veil"), { opacity: 1, duration: 0.6, ease: "power1.in" }, FIX_LOOP_SECONDS - 0.6)
    .set({}, {}, FIX_LOOP_SECONDS);

  return tl;
}
