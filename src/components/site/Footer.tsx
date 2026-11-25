import Link from "next/link";
import { PlanckspaceLockup } from "@/components/brand/Planckspace";
import { CONTACT_EMAIL, DEMO_PATH, SIGN_IN_URL } from "@/lib/plans";
import { SOCIAL_LINKS } from "@/lib/social-links";

/* The footer is night: on the home page it continues the closing section as
   one dark block that bookends the hero. The lockup in paper with its blue
   block, links in quiet white with 44px tap targets, hairlines at white/10,
   and the lockup again at poster scale, barely there, cut by the bottom edge
   so the brand is the last thing on the page. */

/** Off-site links open in a new tab unless `sameTab` (the console's Sign in). */
type FooterLink = { label: string; href: string; sameTab?: boolean };

const COLUMNS: { head: string; links: FooterLink[] }[] = [
  {
    head: "Product",
    links: [
      { label: "Measure", href: "/#measure" },
      { label: "Find", href: "/#find" },
      { label: "Fix", href: "/#fix" },
      { label: "Prove", href: "/#prove" },
      { label: "Privacy", href: "/#privacy" },
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
      { label: "Sign in", href: SIGN_IN_URL, sameTab: true },
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

const LINK = "inline-flex min-h-11 items-center break-words text-[0.9375rem] text-body transition-colors duration-200 hover:text-ink sm:min-h-9";

export default function Footer() {
  return (
    <footer data-nav="dark" className="on-night grain relative isolate overflow-hidden bg-night">
      <div className="wrap relative z-[2]">
        <div className="grid grid-cols-1 gap-14 border-t border-white/10 pt-16 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)]">
          <div>
            <PlanckspaceLockup className="h-6 w-auto text-on-night" accent="#4C80F6" />
            <p className="mt-6 max-w-[19rem] text-[0.9375rem] leading-relaxed text-body">
              See what your team spends on AI coding, cut the waste, and prove the saving. Every token, accounted for.
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
                      className="grid h-11 w-11 place-items-center rounded-full text-body ring-1 ring-inset ring-white/12 transition-colors duration-200 hover:bg-white/[0.06] hover:text-ink hover:ring-white/25"
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
              <div key={c.head} className="min-w-0">
                <p className="eyebrow">{c.head}</p>
                <ul className="mt-4">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      {l.href.startsWith("/") ? (
                        <Link href={l.href} className={LINK}>
                          {l.label}
                        </Link>
                      ) : (
                        <a
                          href={l.href}
                          {...(l.href.startsWith("http") && !l.sameTab ? { target: "_blank", rel: "noreferrer" } : {})}
                          className={`${LINK} break-all`}
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

        <div className="mt-16 flex flex-col gap-2 border-t border-white/10 pt-6 text-[0.8125rem] text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} PlanckSpace. All rights reserved.</p>
          <p>Usage data only. Your prompts and code are never sent to PlanckSpace.</p>
        </div>
      </div>

      <div className="wrap relative mt-14" aria-hidden="true" style={{ marginBottom: "-4.4vw" }}>
        <PlanckspaceLockup className="h-auto w-full text-white/[0.05]" accent="rgb(76 128 246 / 0.14)" />
      </div>
      <div style={{ height: "max(0px, env(safe-area-inset-bottom))" }} />
    </footer>
  );
}
