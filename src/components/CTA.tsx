import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { DEMO_PATH } from "@/lib/plans";

/* Closing CTA. Access is demo-led: no install command, no self-serve
   registration. The three cells below set expectations for the call. */

const EXPECT = [
  { k: "30 min", v: "A working session, not a pitch deck" },
  { k: "Your numbers", v: "Mapped against the tools you already run" },
  { k: "A founder", v: "Answering directly, including on price" },
];

export default function CTA() {
  return (
    <section className="section-y border-t border-[var(--border)] bg-[var(--panel)]">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="display-1 !text-[clamp(2.25rem,5vw,3.75rem)]">
            Stop estimating.
            <br />
            Start measuring.
          </h2>
          <p className="lead mx-auto mt-5 max-w-xl sm:mt-6">
            Book 30 minutes. We’ll show you what your team’s AI coding costs,
            what it’s returning, and then set the workspace up with you.
          </p>

          {/* Three stacked centred cards on a phone is a lot of vertical spend
              for a set-up line. Two columns with the last cell spanning both
              keeps it compact and keeps the reading left-aligned, which is
              easier to scan than centred text at this size. */}
          <div className="mx-auto mt-10 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:mt-12 sm:grid-cols-3">
            {EXPECT.map((e, i) => (
              <div
                key={e.k}
                className={`bg-white px-5 py-5 text-left sm:py-6 sm:text-center ${
                  i === EXPECT.length - 1 ? "col-span-2 sm:col-span-1" : ""
                }`}
              >
                <p className="num text-[13px] font-medium text-[var(--ink)]">
                  {e.k}
                </p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--text-2)]">
                  {e.v}
                </p>
              </div>
            ))}
          </div>

          <div className="btn-row mx-auto mt-9 max-w-sm sm:mt-10 sm:max-w-none" data-center="true">
            <Link href={DEMO_PATH} className="btn btn-primary">
              Book a demo
              <span className="btn-disc">
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
              </span>
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Talk to us
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
