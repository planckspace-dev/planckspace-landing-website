import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { CONTACT_EMAIL, DEMO_PATH } from "@/lib/plans";

const COLUMNS = [
  {
    head: "Product",
    links: [
      { label: "The approach", href: "/#approach" },
      { label: "The platform", href: "/#product" },
      { label: "Detection engine", href: "/#engine" },
      { label: "How it works", href: "/#how-it-works" },
    ],
  },
  {
    head: "Resources",
    links: [
      // Pricing is hidden for now — restore with the /pricing route.
      // { label: "Pricing", href: "/pricing" },
      { label: "Privacy model", href: "/#privacy" },
      { label: "Questions", href: "/#faq" },
      {
        label: "VS Code extension",
        href: "https://open-vsx.org/extension/planckspace/planckspace-extension",
      },
    ],
  },
  {
    head: "Company",
    links: [
      { label: "Book a demo", href: DEMO_PATH },
      { label: "Contact", href: "/contact" },
      { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      {/* The bottom pad clears the iOS home-indicator bar. Without it the last
          line of the footer sits under the gesture area on a notched phone. */}
      <div
        className="container-x pt-14 sm:pt-20"
        style={{ paddingBottom: "max(3.5rem, calc(env(safe-area-inset-bottom) + 2.5rem))" }}
      >
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo height={28} />
            <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-[var(--text-3)]">
              The management layer for AI coding. Measure it, optimize it, and
              verify the savings. Never your code, never your prompts.
            </p>
          </div>

          {/* Three columns don't divide into two, so at grid-cols-2 the last
              one hangs off a ragged second row. Company spans the full width
              instead and reads as the closing block it already is. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 sm:gap-10">
            {COLUMNS.map((c, i) => (
              <div
                key={c.head}
                className={i === COLUMNS.length - 1 ? "col-span-2 sm:col-span-1" : ""}
              >
                <p className="num mb-4 text-[10.5px] uppercase tracking-[0.16em] text-[var(--text-3)] sm:mb-5">
                  {c.head}
                </p>
                {/* -my-2.5/py-2.5 pads each row to a 40px tap target without
                    opening the visual gaps between them. */}
                <ul className="-my-2.5 space-y-0">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      {l.href.startsWith("/") ? (
                        <Link
                          href={l.href}
                          className="inline-block break-words py-2.5 text-[13.5px] text-[var(--text-2)] transition-colors duration-300 hover:text-[var(--ink)]"
                        >
                          {l.label}
                        </Link>
                      ) : (
                        <a
                          href={l.href}
                          className="inline-block break-words py-2.5 text-[13.5px] text-[var(--text-2)] transition-colors duration-300 hover:text-[var(--ink)]"
                        >
                          {l.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2.5 border-t border-[var(--border)] pt-6 sm:mt-16 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-7">
          <p className="num text-[11.5px] text-[var(--text-3)]">
            © {new Date().getFullYear()} PlanckSpace. All rights reserved.
          </p>
          <p className="num text-[11.5px] text-[var(--text-3)]">
            Metadata only. Code and prompts never leave your machine.
          </p>
        </div>
      </div>
    </footer>
  );
}
