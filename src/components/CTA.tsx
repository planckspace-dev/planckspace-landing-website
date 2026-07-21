import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { DEMO_PATH } from "@/lib/plans";

/* Closing CTA. Access is demo-led — no install command, no self-serve
   registration. The three cells below set expectations for the call. */

const EXPECT = [
  { k: "30 min", v: "A working session, not a pitch deck" },
  { k: "Your numbers", v: "Mapped against the tools you already run" },
  { k: "A founder", v: "Answering directly, including on price" },
];

export default function CTA() {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--panel)] py-24 sm:py-36">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-7" data-center="true">
            Get started
          </p>
          <h2 className="display-1 !text-[clamp(2.5rem,5vw,3.75rem)]">
            Stop guessing.
            <br />
            Start metering.
          </h2>
          <p className="lead mx-auto mt-6 max-w-xl">
            Book 30 minutes and we’ll show you what your team’s AI spend actually
            looks like — then set the workspace up with you.
          </p>

          <div className="mx-auto mt-12 grid max-w-xl gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
            {EXPECT.map((e) => (
              <div key={e.k} className="bg-white px-5 py-6 text-center">
                <p className="num text-[13px] font-medium text-[var(--ink)]">
                  {e.k}
                </p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--text-2)]">
                  {e.v}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
