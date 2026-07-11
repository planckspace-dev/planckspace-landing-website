import { Check, X } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const SYNCED = [
  "Model and token counts",
  "Session cost and duration",
  "Tool and editor used",
  "Repo name and git author",
];

const NEVER = [
  "Source code",
  "Prompts and responses",
  "File contents",
  "Anything you typed",
];

/* The one deliberate dark moment on the page. */
export default function Privacy() {
  return (
    <section className="py-24 sm:py-36">
      <div className="container-x">
        <Reveal>
          <div className="overflow-hidden rounded-[1.5rem] border border-[var(--dark-border)] bg-[var(--dark-page)] shadow-[var(--shadow-float)]">
            <div className="grid lg:grid-cols-[1.15fr_1fr]">
              <div className="p-10 sm:p-14 lg:p-16">
                <p className="eyebrow mb-7 !text-[#6b7183] before:!bg-[rgba(255,255,255,0.15)]">
                  Privacy by architecture
                </p>
                <h2 className="display-2 !text-white">
                  We meter receipts,
                  <br />
                  not code.
                </h2>
                <p className="mt-6 max-w-md text-[16px] leading-relaxed text-[var(--dark-text-2)]">
                  PlanckSpace parses the metadata your AI tools already write to
                  disk — token counts, models, costs. Your source, prompts, and
                  responses never leave the machine. Developers can verify
                  exactly what syncs with{" "}
                  <code className="num rounded bg-white/10 px-1.5 py-0.5 text-[13px] text-white">
                    planck inspect
                  </code>
                  .
                </p>
                <p className="num mt-8 text-[12px] text-[#6b7183]">
                  Sync is opt-in per machine · revoke a device any time
                </p>
              </div>

              <div className="grid grid-cols-1 gap-px border-t border-[var(--dark-border)] bg-[var(--dark-border)] sm:grid-cols-2 lg:border-l lg:border-t-0">
                <div className="bg-[var(--ink-2)] p-8 sm:p-10">
                  <p className="num mb-6 text-[11px] uppercase tracking-[0.16em] text-[#6b7183]">
                    Synced
                  </p>
                  <ul className="space-y-4">
                    {SYNCED.map((s) => (
                      <li key={s} className="flex items-start gap-3 text-[14px] text-[#d5d9e4]">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#4ade80]" strokeWidth={1.75} />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[var(--dark-page)] p-8 sm:p-10">
                  <p className="num mb-6 text-[11px] uppercase tracking-[0.16em] text-[#6b7183]">
                    Never synced
                  </p>
                  <ul className="space-y-4">
                    {NEVER.map((s) => (
                      <li key={s} className="flex items-start gap-3 text-[14px] text-[#9ba1b0]">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-[#f4602f]" strokeWidth={1.75} />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
