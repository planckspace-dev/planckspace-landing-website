import Link from "next/link";
import { PlanckspaceLockup } from "@/components/brand/Planckspace";
import { CONTACT_EMAIL, DEMO_PATH } from "@/lib/plans";
import { SOCIAL_LINKS } from "@/lib/social-links";

/* The footer ends on the lockup, set the full width of the page and cut by
   the bottom edge, so the last thing on the page is the brand at poster
   scale. Everything above it is plain links with 40px tap targets. */

const COLUMNS = [
  {
    head: "Product",
    links: [
      { label: "Detection engine", href: "/#engine" },
      { label: "One-click fixes", href: "/#fix" },
      { label: "Verified savings", href: "/#savings" },
      { label: "Privacy model", href: "/#privacy" },
    ],
  },
  {
    head: "Get started",
    links: [
      { label: "Book a demo", href: DEMO_PATH },
      { label: "How it goes live", href: "/#how-it-works" },
      { label: "VS Code extension", href: "https://marketplace.visualstudio.com/items?itemName=Planckspace.planckspace-extension" },
      { label: "Open VSX", href: "https://open-vsx.org/extension/planckspace/planckspace-extension" },
    ],
  },
  {
    head: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Questions", href: "/#faq" },
      { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--line)] bg-ink">
      <div className="wrap pt-16 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <p className="t-display max-w-[16ch] text-[1.7rem] leading-[1.05] [--wdth:104]">Every token, accounted for.</p>
            <p className="mt-4 max-w-[22rem] text-[0.92rem] leading-relaxed text-fg-3">
              The management layer for AI coding. Metadata only: your code and prompts never leave your machine.
            </p>
            <ul className="mt-7 flex gap-2">
              {SOCIAL_LINKS.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      className="ch-br grid h-11 w-11 place-items-center bg-ink-3 text-fg-2 transition-colors duration-300 hover:bg-lime hover:text-ink [--ch:8px]"
                    >
                      <Icon className="h-[17px] w-[17px]" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
            {COLUMNS.map((c, i) => (
              <div key={c.head} className={i === COLUMNS.length - 1 ? "col-span-2 sm:col-span-1" : ""}>
                <p className="t-mono text-[11px] tracking-[0.04em] text-fg-4">{c.head}</p>
                <ul className="mt-4">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      {l.href.startsWith("/") ? (
                        <Link href={l.href} className="link inline-block break-words py-2.5 text-[0.92rem] text-fg-2 hover:text-fg">
                          {l.label}
                        </Link>
                      ) : (
                        <a
                          href={l.href}
                          {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                          className="link inline-block break-all py-2.5 text-[0.92rem] text-fg-2 hover:text-fg"
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

        <div className="mt-14 flex flex-col gap-2 border-t border-[var(--line)] pt-6 sm:flex-row sm:justify-between">
          <p className="t-mono text-[11.5px] text-fg-4">© {new Date().getFullYear()} PlanckSpace. All rights reserved.</p>
          <p className="t-mono text-[11.5px] text-fg-4">Metadata only. Code and prompts never leave your machine.</p>
        </div>
      </div>

      <div className="wrap mt-10" aria-hidden="true" style={{ marginBottom: "-4.2vw" }}>
        <PlanckspaceLockup className="h-auto w-full text-ink-3" accent="#C6FF3D" />
      </div>
      <div style={{ height: "max(0px, env(safe-area-inset-bottom))" }} />
    </footer>
  );
}
