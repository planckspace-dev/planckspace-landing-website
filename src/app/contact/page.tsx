import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
        <section className="relative isolate pb-24 pt-[calc(var(--nav-h)+3.5rem)] sm:pb-32 sm:pt-[calc(var(--nav-h)+5rem)]">
          <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem]" aria-hidden="true" />
          <div className="wrap relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
            <div>
              <p className="eyebrow">Contact</p>
              <h1 className="title-xl mt-4 text-[clamp(2.4rem,4.6vw,3.75rem)]">Talk to the people who built it.</h1>
              <p className="lede mt-6 max-w-md">Sales, support, Enterprise or partnerships. One form, straight to the founding team&apos;s inbox.</p>

              <Link
                href={DEMO_PATH}
                className="group mt-8 flex max-w-md items-center gap-4 rounded-[16px] border border-line bg-surface p-5 shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-[var(--shadow-lift)]"
              >
                <div className="flex-1">
                  <p className="text-[1rem] font-semibold text-ink">Want to see the product?</p>
                  <p className="mt-1 text-[0.9rem] leading-relaxed text-body">Book a 30-minute demo. That&apos;s how workspaces get set up.</p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-white transition-transform duration-200 group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </span>
              </Link>

              <ol className="mt-10 space-y-6">
                {EXPECT.map((e, i) => (
                  <li key={e.title} className="flex gap-4">
                    <span className="num mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line-strong bg-surface text-[0.8125rem] font-medium text-ink">
                      {i + 1}
                    </span>
                    <div>
                      <h2 className="text-[1rem] font-semibold text-ink">{e.title}</h2>
                      <p className="mt-1 text-[0.92rem] leading-relaxed text-body">{e.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-12 border-t border-line pt-7">
                <p className="text-[0.95rem] text-body">Prefer email?</p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="link-under mt-1 inline-block break-all py-1 text-[1.05rem] text-ink">
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
                          className="grid h-10 w-10 place-items-center rounded-[10px] border border-line bg-surface text-body transition-colors duration-200 hover:border-line-strong hover:text-ink"
                        >
                          <Icon className="h-4 w-4" />
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
