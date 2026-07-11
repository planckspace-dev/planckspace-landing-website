import { Reveal } from "@/components/ui/reveal";

const TOOLS = ["Claude Code", "Cursor", "Windsurf", "Antigravity"];

const FACTS = [
  { value: "4 tools", label: "one shared dashboard" },
  { value: "< 5 min", label: "to first synced session" },
  { value: "0 lines", label: "of code ever read" },
  { value: "$0.0001", label: "cost resolution per session" },
];

export default function ToolsBar() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--panel)]">
      <div className="container-x py-12 sm:py-14">
        <Reveal>
          <p className="eyebrow mb-8" data-center="true">
            Meters every major AI coding tool
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {TOOLS.map((t) => (
              <span
                key={t}
                className="text-[17px] font-semibold tracking-[-0.02em] text-[var(--text-3)] transition-colors duration-500 hover:text-[var(--ink)]"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] lg:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.label} className="bg-white px-6 py-5 text-center">
                <div className="num text-[20px] font-medium tracking-[-0.03em] text-[var(--ink)]">
                  {f.value}
                </div>
                <div className="mt-1 text-[12.5px] text-[var(--text-3)]">{f.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
