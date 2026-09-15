import { Reveal } from "@/components/ui/reveal";
import { TOOLS } from "@/components/brand/ToolLogos";

/* The strip directly under the hero: what we meter, and the four facts that
   answer the first objections before any section has to argue for them. One
   slab, hairline-divided, so it reads as a spec plate rather than eight boxes.

   Tools carry their real marks, in ink. Brand colours are kept for the charts,
   where they encode identity; here they would only compete with each other.

   The tool list is the supported set and must stay in sync with the FAQ. */

const FACTS = [
  { value: "4 tools", label: "one shared dashboard" },
  { value: "< 5 min", label: "to the first synced session" },
  { value: "0 lines", label: "of your code ever read" },
  { value: "$0.0001", label: "cost resolution per session" },
];

export default function ToolsBar() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--panel)]">
      <div className="container-x py-12 sm:py-16">
        <Reveal className="mx-auto max-w-4xl">
          <p className="mb-7 text-center text-[13.5px] text-[var(--text-3)]">
            Meters every major AI coding tool your team already runs.
          </p>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)]">
            <div className="grid grid-cols-2 gap-px sm:grid-cols-4">
              {TOOLS.map((t) => (
                <div
                  key={t.id}
                  className="group flex items-center justify-center gap-2.5 bg-white px-4 py-6"
                >
                  <t.Logo className="h-[22px] w-[22px] text-[var(--ink)] transition-transform duration-500 ease-[var(--ease-swift)] group-hover:scale-110" />
                  <span className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
                    {t.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-px lg:grid-cols-4">
              {FACTS.map((f) => (
                <div key={f.label} className="bg-white px-5 py-5 text-center">
                  <div className="num text-[19px] font-medium tracking-[-0.03em] text-[var(--ink)]">
                    {f.value}
                  </div>
                  <div className="mt-1 text-[12.5px] leading-snug text-[var(--text-3)]">
                    {f.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
