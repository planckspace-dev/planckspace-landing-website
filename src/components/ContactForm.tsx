"use client";

import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

import { CONTACT_EMAIL } from "@/lib/plans";

const TOPICS = [
  { value: "sales", label: "Sales & plans" },
  { value: "support", label: "Product support" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Something else" },
];

const TEAM_SIZES = ["1-5", "6-15", "16-50", "51-200", "200+"];

const inputCls =
  "w-full rounded-xl border border-[var(--border-strong)] bg-white px-4 py-3 text-[14.5px] text-[var(--ink)] placeholder:text-[var(--text-3)] transition-colors duration-300 focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-100)]";

const labelCls = "mb-2 block text-[13px] font-medium text-[var(--ink)]";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? "") || undefined,
      teamSize: String(data.get("teamSize") ?? "") || undefined,
      topic: String(data.get("topic") ?? "sales"),
      message: String(data.get("message") ?? ""),
      // honeypot: hidden from humans, bots fill it
      website: String(data.get("website") ?? ""),
    };

    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `request failed (${res.status})`);
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "something went wrong");
    }
  }

  if (status === "sent") {
    return (
      <div className="card flex flex-col items-center p-8 text-center sm:p-12">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--green-50)]">
          <Check className="h-5 w-5 text-[var(--green-700)]" strokeWidth={2} />
        </span>
        <h3 className="mt-5 text-[20px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
          Message sent.
        </h3>
        <p className="mt-2 max-w-sm text-[14.5px] leading-relaxed text-[var(--text-2)]">
          Thanks, it’s in our inbox. A human (usually a founder) replies within
          one business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="link-quiet mt-6 text-[13.5px]"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card relative p-6 sm:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={labelCls}>
            Name
          </label>
          <input
            id="cf-name"
            name="name"
            required
            maxLength={200}
            placeholder="Ada Lovelace"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="cf-email" className={labelCls}>
            Work email
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            maxLength={320}
            placeholder="ada@company.com"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="cf-company" className={labelCls}>
            Company <span className="font-normal text-[var(--text-3)]">(optional)</span>
          </label>
          <input
            id="cf-company"
            name="company"
            maxLength={200}
            placeholder="Acme Inc."
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="cf-teamsize" className={labelCls}>
            Engineering team size
          </label>
          <select id="cf-teamsize" name="teamSize" className={inputCls} defaultValue="">
            <option value="" disabled>
              Select…
            </option>
            {TEAM_SIZES.map((t) => (
              <option key={t} value={t}>
                {t} engineers
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cf-topic" className={labelCls}>
            Topic
          </label>
          <select id="cf-topic" name="topic" className={inputCls} defaultValue="sales">
            {TOPICS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cf-message" className={labelCls}>
            Message
          </label>
          <textarea
            id="cf-message"
            name="message"
            required
            maxLength={5000}
            rows={5}
            placeholder="Tell us about your team, your tools, and what you're trying to figure out about your AI spend…"
            className={`${inputCls} resize-y`}
          />
        </div>

        {/* honeypot: visually hidden, tab-skipped */}
        <div className="absolute -left-[9999px] top-auto" aria-hidden="true">
          <label htmlFor="cf-website">Website</label>
          <input id="cf-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-5 rounded-xl border border-[var(--coral-500)]/30 bg-[var(--coral-50)] px-4 py-3 text-[13.5px] text-[var(--coral-700)]">
          {errorMsg}. You can also email us directly at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn btn-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Send message"}
        <span className="btn-disc">
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
        </span>
      </button>
    </form>
  );
}
