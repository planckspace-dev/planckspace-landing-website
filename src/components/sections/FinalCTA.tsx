import { BookOpen } from "lucide-react";
import ApertureArt from "@/components/site/ApertureArt";
import Button from "@/components/site/Button";
import Reveal from "@/components/site/Reveal";
import { PlanckspaceMark } from "@/components/brand/Planckspace";
import { DEMO_PATH } from "@/lib/plans";

/* The close: the same two actions as the hero, at night. With the footer it
   is one continuous dark block that bookends the hero. Everything that reads
   sits above the light: the Aperture render (the whole mark as a window of
   blue light, low and centred, its reflection running toward the viewer and
   on into the footer's night). .close-art sizes the render from --close-w,
   and the copy's bottom padding clears the opening's top edge with
   --close-clear, so the two never meet at any width. If the art slot is ever
   empty, .close-night falls back to a horizon of light drawn in CSS. */

const PROMISES = ["30 minutes with a founder", "Billed dollars, checked against the invoice", "Metadata only"];

export default function FinalCTA() {
  return (
    <section aria-labelledby="cta-title" data-nav="dark" className="close-night on-night grain bg-night">
      {/* The rendered room, seen from further back: the whole mark as a window
          of light, low and centred under the copy. */}
      <div aria-hidden="true" data-art-slot="close" className="pointer-events-none absolute inset-0 z-[-1] overflow-hidden">
        <div className="close-art">
          <ApertureArt variant="close" />
        </div>
      </div>

      <Reveal className="wrap-wide relative z-[2] flex flex-col items-center pb-[calc(var(--close-clear)+3.5rem)] pt-[clamp(7rem,12vw,10.5rem)] text-center">
        <span className="grid h-14 w-14 place-items-center rounded-[16px] bg-white/[0.06] shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] ring-1 ring-inset ring-white/12">
          <PlanckspaceMark className="h-7 w-7 text-on-night" accent="#4C80F6" aria-hidden="true" />
        </span>
        <h2 id="cta-title" className="title-close mt-10 max-w-[13ch] sm:mt-12 lg:max-w-[16ch]">
          See what your AI bill <span className="tone">is made of.</span>
        </h2>
        <p className="lede mx-auto mt-8 max-w-[36rem]">
          Bring one month of your tools and plans. We will show you where it goes, what can be cut, and how the saving would be proven.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href={DEMO_PATH} size="lg" magnetic>
            Book a demo
          </Button>
          <Button href="/docs" size="lg" variant="secondary" icon={<BookOpen className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />}>
            Read the docs
          </Button>
        </div>
        <ul className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-2 text-[0.875rem] text-muted">
          {PROMISES.map((p) => (
            <li key={p} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-brand-500" aria-hidden />
              {p}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
