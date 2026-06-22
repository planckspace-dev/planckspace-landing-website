import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "CLI Reference", href: "#" },
    { label: "VS Code Extension", href: "https://marketplace.visualstudio.com" },
    { label: "Open VSX", href: "https://open-vsx.org" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "mailto:hello@planckspace.dev" },
    { label: "Status", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="section s-footer border-t border-[var(--border)] bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-14">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center mb-4" aria-label="PlanckSpace home">
              <Logo markClassName="w-9 h-9" textClassName="text-[21px]" />
            </Link>
            <p className="text-[14px] text-[var(--text-2)] leading-relaxed max-w-xs">
              AI coding spend, made visible. Track every token from Claude Code, Cursor,
              and Windsurf — without touching your code.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--soft)] px-3.5 py-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--green-500)]" />
              <span className="text-[11px] text-[var(--text-2)] font-mono">Beta · Applying to Y Combinator</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <div className="mono-label mb-4">{category}</div>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-[var(--text-2)] hover:text-[var(--blue-600)] transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--border)]">
          <p className="text-[12px] text-[var(--text-3)] font-mono">© 2026 PlanckSpace. All rights reserved.</p>
          <p className="text-[12px] text-[var(--text-3)]">No prompts · No code · No file contents ever stored.</p>
        </div>
      </div>
    </footer>
  );
}
