"use client";

import { useRef } from "react";
import { EyeOff, Lock, ScanSearch, Unplug } from "lucide-react";
import { PlanckMark } from "@/components/ui/logo";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/* ─────────────────────────────────────────────────────────────────────────
   Privacy, shown as a boundary. Packets leave the machine on the left; the
   gate lets counters through to the workspace and stops everything that is
   content. The right-hand panel is what `planck inspect` prints for one
   session: the whole payload, nothing summarised away.
   ───────────────────────────────────────────────────────────────────────── */

const PASS = ["tokens 18,204", "model sonnet-5", "repo payments-api", "active 14m", "cost $2.41"];
const STOP = ["prompt text", "src/billing.ts", "model output", "diff"];

const PAYLOAD: [string, string][] = [
  ["session", '"ses_8f2a91c"'],
  ["tool", '"claude_code"'],
  ["model", '"claude-sonnet-5"'],
  ["repo", '"payments-api"'],
  ["branch", '"main"'],
  ["author", '"mara@halyard.dev"'],
  ["turns", "18"],
  ["tokens", "{ in: 12840, out: 5364, cache_read: 91% }"],
  ["active_min", "14"],
  ["cost_usd", "2.41"],
  ["billing", '"metered"'],
];

const POINTS = [
  { icon: Unplug, text: "Nothing is proxied or intercepted. The CLI reads logs your tools already write." },
  { icon: EyeOff, text: "A workspace policy can hide developer names from everyone, leadership included." },
  { icon: ScanSearch, text: "planck inspect prints exactly what left the machine for any session." },
];

export default function Privacy() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 64rem)`, () => {
        const lanes = gsap.utils.toArray<HTMLElement>(".pv-packet");
        const track = root.current!.querySelector<HTMLElement>(".pv-lanes")!;
        const gate = () => track.offsetWidth / 2 - 56;
        const end = () => track.offsetWidth + 24;
        const tl = gsap.timeline({ repeat: -1, paused: true });
        lanes.forEach((p, i) => {
          const pass = p.dataset.pass === "1";
          const start = i * 0.55;
          tl.fromTo(p, { x: -20, y: 0, rotate: 0, autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: "power1.out" }, start).to(
            p,
            { x: gate, duration: 1.4, ease: "none" },
            start,
          );
          if (pass) {
            tl.to(p, { x: end, duration: 1.2, ease: "none" }, start + 1.4)
              .to(p, { color: "#0b0b0c", backgroundColor: "#C6FF3D", duration: 0.2 }, start + 1.4)
              .to(p, { autoAlpha: 0, duration: 0.25 }, start + 2.4);
          } else {
            tl.to(p, { x: () => gate() - 40, rotate: -8, duration: 0.35, ease: "power2.out" }, start + 1.4).to(
              p,
              { y: 60, autoAlpha: 0, duration: 0.6, ease: "power2.in" },
              start + 1.75,
            );
          }
        });
        const onResize = () => tl.invalidate();
        window.addEventListener("resize", onResize);
        tl.set({}, {}, lanes.length * 0.55 + 2.8);

        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tl.play() : tl.pause()));
        io.observe(root.current!.querySelector(".pv-diagram")!);

        gsap.from(".pv-json li", {
          autoAlpha: 0,
          x: -10,
          stagger: 0.05,
          duration: 0.6,
          scrollTrigger: { trigger: ".pv-json", start: "top 80%" },
        });
        return () => {
          io.disconnect();
          window.removeEventListener("resize", onResize);
        };
      });

      mm.add(MOTION_OK, () => {
        gsap.from(".pv-head > *", {
          y: 30,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 1,
          scrollTrigger: { trigger: ".pv-head", start: "top 82%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // counters and content interleaved, so the gate is seen doing both jobs
  const packets = [
    { t: PASS[0], pass: true },
    { t: STOP[0], pass: false },
    { t: PASS[1], pass: true },
    { t: PASS[2], pass: true },
    { t: STOP[1], pass: false },
    { t: PASS[3], pass: true },
    { t: STOP[2], pass: false },
    { t: PASS[4], pass: true },
    { t: STOP[3], pass: false },
  ];

  return (
    <section ref={root} id="privacy" aria-labelledby="privacy-title" className="section">
      <div className="wrap">
        <div className="pv-head max-w-[52rem]">
          <p className="t-kicker">The privacy model</p>
          <h2 id="privacy-title" className="t-display t-h2 mt-5">
            Metadata in. Your code never leaves.
          </h2>
          <p className="t-lead mt-6 max-w-[40rem]">
            The CLI reads the session logs your tools already write, on your machine, and sends counters: tokens,
            timings, model, repo and git email. Never prompts, responses or code.
          </p>
        </div>

        <div className="pv-diagram mt-14 grid gap-4 lg:mt-20 lg:grid-cols-[1fr_minmax(12rem,1fr)_1fr] lg:gap-0">
          {/* the machine */}
          <div className="frame [--ch:20px]">
            <div className="frame-in flex h-full flex-col p-5">
              <p className="t-mono flex items-center justify-between text-[11.5px] text-fg-3">
                <span>on your machine</span>
                <Lock className="h-3.5 w-3.5 text-lime" strokeWidth={1.8} />
              </p>
              <div className="relative mt-4 flex-1 overflow-hidden bg-ink p-4 font-mono text-[12px] leading-[1.7] text-fg-3">
                <div className="select-none blur-[3.5px]" aria-hidden="true">
                  <p>
                    <span className="text-sig-blue">export async function</span> refund(order: Order) {"{"}
                  </p>
                  <p className="pl-4">const cents = order.totalCents - order.feeCents;</p>
                  <p className="pl-4">
                    if (cents {"<"}= 0) <span className="text-sig-blue">throw new</span> RefundError(order.id);
                  </p>
                  <p className="pl-4">await ledger.debit(order.accountId, cents);</p>
                  <p className="pl-4">return stripe.refunds.create({"{"} amount: cents {"}"});</p>
                  <p>{"}"}</p>
                  <p className="mt-3 text-fg-2">&gt; make refunds idempotent and add a test for partial refunds</p>
                </div>
                <div className="absolute inset-0 grid place-items-center">
                  <span className="tag tag-lime">
                    <Lock className="h-3 w-3" strokeWidth={2} /> stays here
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* the gate */}
          <div className="relative hidden lg:block" aria-hidden="true">
            <div className="absolute inset-y-6 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(to_bottom,transparent,rgb(198_255_61/0.7),transparent)]" />
            <div className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center bg-ink">
              <PlanckMark className="h-9 w-auto" />
            </div>
            <ul className="pv-lanes absolute inset-0 flex flex-col justify-center gap-2.5">
              {packets.map((p) => (
                <li key={p.t} className="relative h-6">
                  <span
                    data-pass={p.pass ? "1" : "0"}
                    className={`pv-packet t-mono absolute left-0 top-0 whitespace-nowrap px-2 py-1 text-[11px] opacity-0 ${
                      p.pass ? "bg-ink-3 text-fg-2" : "bg-sig-coral/15 text-sig-coral line-through decoration-sig-coral/60"
                    }`}
                  >
                    {p.t}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* the workspace */}
          <div className="frame [--ch:20px] [--edge:rgb(198_255_61/0.45)]">
            <div className="frame-in flex h-full flex-col p-5">
              <p className="t-mono flex items-center justify-between text-[11.5px] text-fg-3">
                <span>what reaches your workspace</span>
                <span className="text-lime">metadata</span>
              </p>
              <div className="term mt-4 flex-1 bg-ink p-4 text-[12px]">
                <p>
                  <span className="p">$</span> <span className="hi">planck inspect ses_8f2a91c</span>
                </p>
                <ul className="pv-json mt-2">
                  <li className="dim">{"{"}</li>
                  {PAYLOAD.map(([k, v]) => (
                    <li key={k} className="pl-4">
                      <span className="text-sig-blue">{k}</span>
                      <span className="dim">: </span>
                      <span className="hi">{v}</span>
                    </li>
                  ))}
                  <li className="dim">{"}"}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <ul className="mt-12 grid gap-6 border-t border-[var(--line)] pt-10 md:grid-cols-3">
          {POINTS.map((p) => (
            <li key={p.text} className="flex gap-4">
              <p.icon className="mt-0.5 h-5 w-5 shrink-0 text-lime" strokeWidth={1.6} />
              <p className="text-[0.98rem] leading-relaxed text-fg-2">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
