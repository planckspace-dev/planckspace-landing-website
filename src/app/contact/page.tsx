import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { CONTACT_EMAIL } from "@/lib/plans";

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
    title: "Straight answers on plans",
    body: "Tell us your team size and tools — if Starter is enough, we'll say so.",
  },
  {
    title: "A real demo, on your data",
    body: "Enterprise evaluations run against your own workspace, not a canned dataset.",
  },
];

export default function ContactPage() {
  return (
    <main className="overflow-x-clip">
      <Navbar />

      <section className="pt-36 pb-24 sm:pt-44 sm:pb-32">
        <div className="container-x">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
            {/* left — editorial intro */}
            <div>
              <p className="eyebrow mb-7">Contact</p>
              <h1 className="display-1 !text-[clamp(2.5rem,4.5vw,3.75rem)]">
                Talk to the people who built it.
              </h1>
              <p className="lead mt-6 max-w-md">
                Sales, support, Enterprise, partnerships — one form, straight to
                the founding team's inbox.
              </p>

              <div className="mt-12 space-y-8">
                {EXPECT.map((e, i) => (
                  <div key={e.title} className="flex gap-5">
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

              <div className="mt-12 border-t border-[var(--border)] pt-7">
                <p className="num text-[11px] uppercase tracking-[0.16em] text-[var(--text-3)]">
                  Prefer email?
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="link-quiet mt-2 inline-block text-[15px]"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>

            {/* right — the form */}
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
