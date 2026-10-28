import Link from "next/link";
import { PlanckspaceLockup } from "@/components/brand/Planckspace";
import { Logo } from "@/components/ui/logo";
import { CONTACT_EMAIL, DEMO_PATH } from "@/lib/plans";
import { SOCIAL_LINKS } from "@/lib/social-links";

/* Plain links with 40px tap targets, then the lockup at poster scale, a step
   off the paper and cut by the bottom edge, so the brand is the last thing
   on the page. */

const COLUMNS = [
  {
    head: "Product",
    links: [
      { label: "Measure", href: "/#measure" },
      { label: "Find", href: "/#find" },
      { label: "Fix", href: "/#fix" },
      { label: "Prove", href: "/#prove" },
      { label: "Privacy model", href: "/#privacy" },
    ],
  },
  {
    head: "Docs",
    links: [
      { label: "Introduction", href: "/docs" },
      { label: "Quickstart", href: "/docs/quickstart" },
      { label: "Billed and usage value", href: "/docs/concepts/two-ledgers" },
      { label: "Proof of savings", href: "/docs/concepts/proof-of-savings" },
      { label: "Security", href: "/docs/security/overview" },
      { label: "CLI reference", href: "/docs/reference/cli" },
    ],
  },
  {
    head: "Get started",
    links: [
      { label: "Book a demo", href: DEMO_PATH },
      { label: "VS Code extension", href: "https://marketplace.visualstudio.com/items?itemName=Planckspace.planckspace-extension" },
      { label: "Open VSX", href: "https://open-vsx.org/extension/planckspace/planckspace-extension" },
      { label: "npm package", href: "https://www.npmjs.com/package/@planckspace/cli" },
    ],
  },
  {
    head: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/#faq" },
      { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-page">
      <div className="wrap pt-20 sm:pt-24">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)]">
          <div>
            <Logo height={22} />
            <p className="mt-6 max-w-[19rem] text-[0.9375rem] leading-relaxed text-body">
              The cost ledger for AI-assisted engineering. Every token, accounted for.
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
                      className="grid h-10 w-10 place-items-center rounded-full border border-line text-body transition-colors duration-200 hover:border-line-strong hover:bg-surface hover:text-ink"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {COLUMNS.map((c) => (
              <div key={c.head}>
                <p className="eyebrow">{c.head}</p>
                <ul className="mt-4">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      {l.href.startsWith("/") ? (
                        <Link href={l.href} className="inline-block break-words py-[0.4rem] text-[0.9rem] text-body transition-colors hover:text-ink">
                          {l.label}
                        </Link>
                      ) : (
                        <a
                          href={l.href}
                          {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                          className="inline-block break-all py-[0.4rem] text-[0.9rem] text-body transition-colors hover:text-ink"
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

        <div className="mt-16 flex flex-col gap-2 border-t border-line pt-6 text-[0.8125rem] text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} PlanckSpace. All rights reserved.</p>
          <p>Metadata only. Your prompts and code are never sent to PlanckSpace.</p>
        </div>
      </div>

      <div className="wrap mt-14" aria-hidden="true" style={{ marginBottom: "-4.4vw" }}>
        <PlanckspaceLockup className="h-auto w-full text-[#ecebe6]" accent="#e1e8fb" />
      </div>
      <div style={{ height: "max(0px, env(safe-area-inset-bottom))" }} />
    </footer>
  );
}
