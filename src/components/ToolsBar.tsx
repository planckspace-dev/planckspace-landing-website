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
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-4">
            {TOOLS.map((t) => (
              <div
                key={t}
                className="group/tool flex items-center justify-center gap-2 bg-white px-4 py-4"
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-[var(--brand-500)]"
                />
                <span className="text-[14.5px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
                  {t}
                </span>
              </div>
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
