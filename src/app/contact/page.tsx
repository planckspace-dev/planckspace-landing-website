import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
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
    body: "Evaluations run against your own workspace, not a canned dataset.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="overflow-x-clip">
        <section className="relative pb-24 pt-[calc(var(--nav-h)+4.5rem)] sm:pb-32 sm:pt-[calc(var(--nav-h)+6rem)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-[34rem] w-[60%] bg-[radial-gradient(rgb(198_255_61/0.22)_1px,transparent_1.4px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_70%_at_80%_20%,#000,transparent)]"
          />
          <div className="wrap relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-20">
            <div>
              <p className="t-kicker">Contact</p>
              <h1 className="t-display mt-5 text-[clamp(2.6rem,5vw,4.4rem)] leading-[0.95] [--wdth:106]">
                Talk to the people who built it.
              </h1>
              <p className="t-lead mt-6 max-w-md">
                Sales, support, Enterprise or partnerships. One form, straight to the founding team&apos;s inbox.
              </p>

              <Link href={DEMO_PATH} className="group ch-br mt-9 flex max-w-md items-center gap-4 bg-ink-2 p-5 [--ch:14px]">
                <div className="flex-1">
                  <p className="text-[1rem] font-semibold text-fg">Want to see the product?</p>
                  <p className="mt-1 text-[0.9rem] leading-relaxed text-fg-3">Book a 30-minute demo. That&apos;s how workspaces get set up.</p>
                </div>
                <span className="ch-br grid h-10 w-10 shrink-0 place-items-center bg-lime text-ink transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 [--ch:7px]">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                </span>
              </Link>

              <ol className="mt-10 space-y-6">
                {EXPECT.map((e, i) => (
                  <li key={e.title} className="flex gap-5">
                    <span className="t-meter w-6 shrink-0 pt-0.5 text-[1.25rem] text-lime">{i + 1}</span>
                    <div>
                      <h2 className="text-[1rem] font-semibold text-fg">{e.title}</h2>
                      <p className="mt-1 text-[0.92rem] leading-relaxed text-fg-3">{e.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-12 border-t border-[var(--line)] pt-7">
                <p className="text-[0.95rem] text-fg-3">Prefer email?</p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="link-lined mt-1 inline-block break-all py-1 text-[1.05rem] text-fg">
                  {CONTACT_EMAIL}
                </a>
                <ul className="mt-6 flex gap-2">
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
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
