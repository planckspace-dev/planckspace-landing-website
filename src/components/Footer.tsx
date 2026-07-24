import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { CONTACT_EMAIL, DEMO_PATH } from "@/lib/plans";

const COLUMNS = [
  {
    head: "Product",
    links: [
      { label: "Platform", href: "/#product" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Book a demo", href: DEMO_PATH },
    ],
  },
  {
    head: "Toolkit",
    links: [
      { label: "CLI", href: "/#how-it-works" },
      { label: "VS Code extension", href: "https://open-vsx.org/extension/planckspace/planckspace-extension" },
      { label: "Dashboard", href: "/#product" },
    ],
  },
  {
    head: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Privacy approach", href: "/#product" },
      { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="container-x py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo height={28} />
            <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-[var(--text-3)]">
              Spend management for AI-assisted engineering. Every token
              accounted for — never your code.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((c) => (
              <div key={c.head}>
                <p className="num mb-5 text-[10.5px] uppercase tracking-[0.16em] text-[var(--text-3)]">
                  {c.head}
                </p>
                <ul className="space-y-3">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      {l.href.startsWith("/") ? (
                        <Link
                          href={l.href}
                          className="text-[13.5px] text-[var(--text-2)] transition-colors duration-300 hover:text-[var(--ink)]"
                        >
                          {l.label}
                        </Link>
                      ) : (
                        <a
                          href={l.href}
                          className="text-[13.5px] text-[var(--text-2)] transition-colors duration-300 hover:text-[var(--ink)]"
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

        <div className="mt-16 flex flex-col gap-3 border-t border-[var(--border)] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="num text-[11.5px] text-[var(--text-3)]">
            © {new Date().getFullYear()} PlanckSpace. All rights reserved.
          </p>
          <p className="num text-[11.5px] text-[var(--text-3)]">
            Metadata only · code and prompts never leave your machine
          </p>
        </div>
      </div>
    </footer>
  );
}
