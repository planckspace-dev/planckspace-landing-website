import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { CONTACT_EMAIL, DEMO_PATH } from "@/lib/plans";
import { SOCIAL_LINKS } from "@/lib/social-links";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the PlanckSpace team about plans, Enterprise, support, or partnerships. A human replies within one business day.",
};

const EXPECT = [
  {
    title: "A reply within one business day",
    body: "Usually from a founder. No ticket numbers, no autoresponder maze.",
  },
  {
    title: "Straight answers on pricing",
    body: "Tell us your team size and tools. If the smallest setup is enough, we'll say so.",
  },
  {
    title: "A real demo, on your data",
    body: "Evaluations run against your own workspace, not a canned dataset. Want one now? Book a demo instead.",
  },
];

export default function ContactPage() {
  return (
    <main className="overflow-x-clip">
      <Navbar />

      <section className="page-top pb-20 sm:pb-32">
        <div className="container-x">
          <div className="grid gap-10 sm:gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
            {/* left: editorial intro */}
            <div>
              <p className="eyebrow mb-6 sm:mb-7">Contact</p>
              <h1 className="display-1 !text-[clamp(2.25rem,4.5vw,3.75rem)]">
                Talk to the people who built it.
              </h1>
              <p className="lead mt-5 max-w-md sm:mt-6">
                Sales, support, Enterprise, or partnerships. One form, straight
                to the founding team’s inbox.
              </p>

              <Link
                href={DEMO_PATH}
                className="group mt-8 flex max-w-md items-center gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] transition-colors duration-300 hover:border-[var(--ink)]"
              >
                <div className="flex-1">
                  <p className="text-[14.5px] font-semibold tracking-[-0.01em] text-[var(--ink)]">
                    Want to see the product?
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[var(--text-2)]">
                    Book a 30-minute demo. That’s how workspaces get set up.
                  </p>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--inset)] transition-colors duration-300 group-hover:bg-[var(--ink)]">
                  <ArrowUpRight
                    className="h-4 w-4 text-[var(--ink)] transition-colors duration-300 group-hover:text-white"
                    strokeWidth={1.75}
                  />
                </span>
              </Link>

              <div className="mt-10 space-y-7 sm:mt-12 sm:space-y-8">
                {EXPECT.map((e, i) => (
                  <div key={e.title} className="flex gap-4 sm:gap-5">
                    <span className="num pt-0.5 text-[12px] text-[var(--text-3)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-[15.5px] font-semibold tracking-[-0.01em] text-[var(--ink)]">
                        {e.title}
                      </h3>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--text-2)]">
                        {e.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 border-t border-[var(--border)] pt-6 sm:mt-12 sm:pt-7">
                <p className="num text-[11px] uppercase tracking-[0.16em] text-[var(--text-3)]">
                  Prefer email?
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="link-quiet mt-1 inline-block break-all py-2 text-[15px]"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>

              <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)] sm:p-5">
                <p className="num text-[11px] uppercase tracking-[0.16em] text-[var(--text-3)]">
                  Follow us
                </p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {SOCIAL_LINKS.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={social.label}
                        title={social.label}
                        className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[linear-gradient(180deg,#ffffff_0%,#f4f6fb_100%)] text-[var(--ink)] shadow-[0_1px_2px_rgba(17,19,26,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--ink)] hover:bg-[var(--surface)] hover:shadow-[var(--shadow-soft)]"
                      >
                        <Icon className="h-4 w-4 text-[var(--ink)] transition-transform duration-300 group-hover:scale-110" strokeWidth={2.1} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* right: the form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
