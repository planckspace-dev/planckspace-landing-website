import { BookOpen } from "lucide-react";
import Button from "@/components/site/Button";
import Reveal from "@/components/site/Reveal";
import { PlanckMark } from "@/components/ui/logo";
import { DEMO_PATH } from "@/lib/plans";

/* The close: the same two actions as the hero, on graph paper. */

const PROMISES = ["30 minutes with a founder", "Billed dollars, checked against the invoice", "Metadata only"];

export default function FinalCTA() {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden border-t border-line">
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(50%_70%_at_50%_45%,#000_15%,transparent_80%)]" />
      <Reveal className="wrap relative flex flex-col items-center py-[clamp(7rem,14vw,12rem)] text-center">
        <span className="grid h-14 w-14 place-items-center rounded-[16px] border border-line bg-surface shadow-[var(--shadow-card)]">
          <PlanckMark className="h-7 w-7" />
        </span>
        <h2 id="cta-title" className="title-xl mt-10 max-w-[15ch]">
          See what your AI bill <span className="tone">is made of.</span>
        </h2>
        <p className="lede mx-auto mt-6 max-w-[34rem]">
          Bring one month of your tools and plans. We will show you where it goes, what can be cut, and how the saving would be proven.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href={DEMO_PATH} size="lg">
            Book a demo
          </Button>
          <Button href="/docs" size="lg" variant="secondary" icon={<BookOpen className="h-[17px] w-[17px]" strokeWidth={1.8} />}>
            Read the docs
          </Button>
        </div>
        <ul className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-2 text-[0.875rem] text-muted">
          {PROMISES.map((p) => (
            <li key={p} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-subtle" aria-hidden />
              {p}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
