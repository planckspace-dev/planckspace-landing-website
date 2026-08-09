"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";

import { CONTACT_EMAIL, PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";

/**
 * Posts to this app's own /api/contact route handler, which treats `demo` as a
 * first-class topic so these land with a "Demo request" subject rather than
 * looking like generic sales mail. The structured `demo` object is what the
 * notification email renders; the same answers are also composed into `message`
 * as a plain-text transcript, which stands in if that object ever fails to
 * parse.
 */
const DEMO_TOPIC = "demo";

const ROLES = [
  "Founder / CEO",
  "CTO / VP Engineering",
  "Engineering manager",
  "Platform / DevEx",
  "Finance / FinOps",
  "Developer",
  "Other",
];

const TEAM_SIZES = ["1-5", "6-15", "16-50", "51-200", "200+"];

const TOOLS = [
  "Claude Code",
  "Cursor",
  "Windsurf",
  "Antigravity",
  "GitHub Copilot",
  "Something else",
];

const SPEND = [
  "Under $500",
  "$500 - $2k",
  "$2k - $10k",
  "$10k - $50k",
  "$50k+",
  "No idea, and that's the problem",
];

const GOALS = [
  "See total spend in one place",
  "Attribute cost per team or repo",
  "Find and cut wasted spend",
  "Reconcile against the invoice",
  "Set budgets and anomaly alerts",
  "Justify AI spend to leadership",
];

const TIMELINE = [
  "Evaluating now",
  "This quarter",
  "Next quarter",
  "Just exploring",
];

const MEETING_TIMES = [
  "Mornings work best",
  "Afternoons work best",
  "I'm flexible",
];

const STEPS = [
  { id: "you", label: "About you" },
  { id: "team", label: "Your team" },
  { id: "goals", label: "What you need" },
];

const inputCls =
  "w-full rounded-xl border border-[var(--border-strong)] bg-white px-4 py-3 text-[14.5px] text-[var(--ink)] placeholder:text-[var(--text-3)] transition-colors duration-300 focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-100)]";

const labelCls = "mb-2 block text-[13px] font-medium text-[var(--ink)]";

const legendCls = "mb-3 block text-[13px] font-medium text-[var(--ink)]";

type Status = "idle" | "sending" | "sent" | "error";

interface FormState {
  name: string;
  email: string;
  company: string;
  role: string;
  teamSize: string;
  tools: string[];
  spend: string;
  goals: string[];
  timeline: string;
  meetingTime: string;
  plan: string;
  notes: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  company: "",
  role: "",
  teamSize: "",
  tools: [],
  spend: "",
  goals: [],
  timeline: "",
  meetingTime: "",
  plan: "",
  notes: "",
};

/** Selectable pill used for single- and multi-choice questions. */
function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-3.5 py-2 text-[13px] font-medium transition-all duration-300 ease-[var(--ease-swift)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-100)]",
        selected
          ? "border-[var(--ink)] bg-[var(--ink)] text-white"
          : "border-[var(--border-strong)] bg-white text-[var(--text-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]",
      )}
    >
      {label}
    </button>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-2 text-[12.5px] text-[var(--coral-700)]">
      {children}
    </p>
  );
}

export default function DemoForm() {
  const searchParams = useSearchParams();
  const planFromUrl = searchParams.get("plan") ?? "";

  const [step, setStep] = useState(0);
  // Plan intent arrives from a pricing-page deep link (/demo?plan=business) and
  // is only ever a starting value; the visitor can still change their mind.
  const [form, setForm] = useState<FormState>(() => ({
    ...EMPTY,
    plan: PLANS.find((p) => p.id === planFromUrl)?.name ?? "",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const headingRef = useRef<HTMLParagraphElement>(null);
  const hasMoved = useRef(false);

  // Move focus to the new step so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (!hasMoved.current) {
      hasMoved.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const toggle = (key: "tools" | "goals", value: string) => {
    const current = form[key];
    set(
      key,
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    );
  };

  function validateStep(index: number): boolean {
    const next: Record<string, string> = {};

    if (index === 0) {
      if (!form.name.trim()) next.name = "Please tell us your name.";
      const email = form.email.trim().toLowerCase();
      if (!email) {
        next.email = "Please enter your email.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        next.email = "That doesn't look like a valid email address.";
      }
      // Consumer domains (gmail, outlook, …) used to be rejected here. Plenty of
      // the founders this page is aimed at book demos from a personal address, so
      // a hard block silently cost real requests. The "Work email" label still
      // nudges; it no longer stops anyone.
      if (!form.company.trim()) next.company = "Please add your company name.";
    }

    if (index === 1) {
      if (!form.role) next.role = "Pick the closest match.";
      if (!form.teamSize) next.teamSize = "Roughly how many engineers?";
      if (form.tools.length === 0) next.tools = "Select at least one tool.";
      if (!form.spend) next.spend = "A rough range is fine.";
    }

    if (index === 2) {
      if (form.goals.length === 0) next.goals = "Select at least one.";
      if (!form.timeline) next.timeline = "When are you looking to decide?";
      if (!form.meetingTime) next.meetingTime = "When suits you best?";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onContinue() {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function composeMessage(): string {
    return [
      "Demo request from the PlanckSpace website.",
      "",
      `Role:              ${form.role}`,
      `Engineering team:  ${form.teamSize}`,
      `Tools in use:      ${form.tools.join(", ")}`,
      `Monthly AI spend:  ${form.spend}`,
      form.plan ? `Plan of interest:  ${form.plan}` : null,
      "",
      "Goals:",
      ...form.goals.map((g) => `  · ${g}`),
      "",
      `Timeline:          ${form.timeline}`,
      `Preferred times:   ${form.meetingTime}`,
      "",
      form.notes.trim() ? `Notes:\n${form.notes.trim()}` : "Notes: none",
    ]
      .filter((line) => line !== null)
      .join("\n");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    if (!validateStep(2)) return;

    const honeypot = new FormData(e.currentTarget).get("website");

    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          teamSize: form.teamSize,
          topic: DEMO_TOPIC,
          message: composeMessage(),
          website: String(honeypot ?? ""),
          // structured mirror of the same answers
          demo: {
            role: form.role,
            teamSize: form.teamSize,
            tools: form.tools,
            monthlySpend: form.spend,
            goals: form.goals,
            timeline: form.timeline,
            meetingTime: form.meetingTime,
            plan: form.plan || undefined,
            notes: form.notes.trim() || undefined,
          },
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `request failed (${res.status})`);
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "something went wrong");
    }
  }

  /* ---------------------------------------------------------------- sent -- */

  if (status === "sent") {
    return (
      <div className="card p-9 sm:p-11">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--green-50)]">
          <Check className="h-5 w-5 text-[var(--green-700)]" strokeWidth={2} />
        </span>
        <h2 className="mt-6 text-[24px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
          Request received.
        </h2>
        <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-[var(--text-2)]">
          Thanks, {form.name.trim().split(" ")[0]}. We’ve got your details and
          we’re already looking at how PlanckSpace would map onto{" "}
          {form.company.trim()}.
        </p>

        <ol className="mt-8 space-y-5 border-t border-[var(--border)] pt-7">
          {[
            {
              t: "A founder replies within one business day",
              b: `We'll send a few times to ${form.email.trim()}, with no scheduling ping-pong.`,
            },
            {
              t: "A 30-minute working session",
              b: "We walk your setup, not a canned dataset. Bring the questions finance keeps asking.",
            },
            {
              t: "Access to your workspace",
              b: "If it's a fit, we provision your team and help with the rollout ourselves.",
            },
          ].map((s, i) => (
            <li key={s.t} className="flex gap-5">
              <span className="num pt-0.5 text-[12px] text-[var(--text-3)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--ink)]">
                  {s.t}
                </h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--text-2)]">
                  {s.b}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 border-t border-[var(--border)] pt-6 text-[13.5px] text-[var(--text-2)]">
          Something to add in the meantime? Reply straight to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="link-quiet">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    );
  }

  /* ---------------------------------------------------------------- form -- */

  return (
    <form onSubmit={onSubmit} className="card relative p-6 sm:p-9" noValidate>
      {/* progress */}
      <div className="mb-8">
        <div className="flex items-baseline justify-between">
          <p
            ref={headingRef}
            tabIndex={-1}
            className="text-[17px] font-semibold tracking-[-0.02em] text-[var(--ink)] focus:outline-none"
          >
            {STEPS[step].label}
          </p>
          <p className="num text-[11px] uppercase tracking-[0.14em] text-[var(--text-3)]">
            Step {step + 1} of {STEPS.length}
          </p>
        </div>
        <div className="mt-4 flex gap-1.5" aria-hidden>
          {STEPS.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                "h-[3px] flex-1 rounded-full transition-colors duration-500 ease-[var(--ease-swift)]",
                i <= step ? "bg-[var(--ink)]" : "bg-[var(--inset)]",
              )}
            />
          ))}
        </div>
      </div>

      {/* ---- step 1: about you ---- */}
      {step === 0 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="df-name" className={labelCls}>
              Full name
            </label>
            <input
              id="df-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              maxLength={200}
              autoComplete="name"
              aria-invalid={!!errors.name}
              placeholder="Ada Lovelace"
              className={inputCls}
            />
            {errors.name && <FieldError>{errors.name}</FieldError>}
          </div>
          <div>
            <label htmlFor="df-email" className={labelCls}>
              Work email
            </label>
            <input
              id="df-email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              maxLength={320}
              autoComplete="email"
              aria-invalid={!!errors.email}
              placeholder="ada@company.com"
              className={inputCls}
            />
            {errors.email && <FieldError>{errors.email}</FieldError>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="df-company" className={labelCls}>
              Company
            </label>
            <input
              id="df-company"
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
              maxLength={200}
              autoComplete="organization"
              aria-invalid={!!errors.company}
              placeholder="Acme Inc."
              className={inputCls}
            />
            {errors.company && <FieldError>{errors.company}</FieldError>}
          </div>
        </div>
      )}

      {/* ---- step 2: your team ---- */}
      {step === 1 && (
        <div className="space-y-7">
          <div>
            <label htmlFor="df-role" className={labelCls}>
              Your role
            </label>
            <select
              id="df-role"
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              aria-invalid={!!errors.role}
              className={inputCls}
            >
              <option value="" disabled>
                Select…
              </option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {errors.role && <FieldError>{errors.role}</FieldError>}
          </div>

          <fieldset>
            <legend className={legendCls}>Engineering team size</legend>
            <div className="flex flex-wrap gap-2">
              {TEAM_SIZES.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  selected={form.teamSize === t}
                  onClick={() => set("teamSize", t)}
                />
              ))}
            </div>
            {errors.teamSize && <FieldError>{errors.teamSize}</FieldError>}
          </fieldset>

          <fieldset>
            <legend className={legendCls}>
              Which AI coding tools does the team use?{" "}
              <span className="font-normal text-[var(--text-3)]">
                (select all)
              </span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {TOOLS.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  selected={form.tools.includes(t)}
                  onClick={() => toggle("tools", t)}
                />
              ))}
            </div>
            {errors.tools && <FieldError>{errors.tools}</FieldError>}
          </fieldset>

          <fieldset>
            <legend className={legendCls}>
              Rough monthly spend on those tools
            </legend>
            <div className="flex flex-wrap gap-2">
              {SPEND.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  selected={form.spend === s}
                  onClick={() => set("spend", s)}
                />
              ))}
            </div>
            {errors.spend && <FieldError>{errors.spend}</FieldError>}
          </fieldset>
        </div>
      )}

      {/* ---- step 3: what you need ---- */}
      {step === 2 && (
        <div className="space-y-7">
          <fieldset>
            <legend className={legendCls}>
              What do you want to walk away with?{" "}
              <span className="font-normal text-[var(--text-3)]">
                (select all)
              </span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {GOALS.map((g) => (
                <Chip
                  key={g}
                  label={g}
                  selected={form.goals.includes(g)}
                  onClick={() => toggle("goals", g)}
                />
              ))}
            </div>
            {errors.goals && <FieldError>{errors.goals}</FieldError>}
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="df-timeline" className={labelCls}>
                Timeline
              </label>
              <select
                id="df-timeline"
                value={form.timeline}
                onChange={(e) => set("timeline", e.target.value)}
                aria-invalid={!!errors.timeline}
                className={inputCls}
              >
                <option value="" disabled>
                  Select…
                </option>
                {TIMELINE.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.timeline && <FieldError>{errors.timeline}</FieldError>}
            </div>
            <div>
              <label htmlFor="df-time" className={labelCls}>
                Preferred meeting time
              </label>
              <select
                id="df-time"
                value={form.meetingTime}
                onChange={(e) => set("meetingTime", e.target.value)}
                aria-invalid={!!errors.meetingTime}
                className={inputCls}
              >
                <option value="" disabled>
                  Select…
                </option>
                {MEETING_TIMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.meetingTime && (
                <FieldError>{errors.meetingTime}</FieldError>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="df-notes" className={labelCls}>
              Anything else?{" "}
              <span className="font-normal text-[var(--text-3)]">
                (optional)
              </span>
            </label>
            <textarea
              id="df-notes"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              maxLength={5000}
              rows={4}
              placeholder="Compliance requirements, a specific number you're trying to explain, who else should join the call…"
              className={`${inputCls} resize-y`}
            />
          </div>
        </div>
      )}

      {/* honeypot: visually hidden, tab-skipped */}
      <div className="absolute -left-[9999px] top-auto" aria-hidden="true">
        <label htmlFor="df-website">Website</label>
        <input id="df-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && (
        <p className="mt-6 rounded-xl border border-[var(--coral-500)]/30 bg-[var(--coral-50)] px-4 py-3 text-[13.5px] text-[var(--coral-700)]">
          {errorMsg}. You can also email us directly at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      )}

      {/* nav */}
      <div className="mt-8 flex items-center gap-3 border-t border-[var(--border)] pt-7">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[13.5px] font-medium text-[var(--text-2)] transition-colors duration-300 hover:text-[var(--ink)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
            Back
          </button>
        )}
        <div className="flex-1" />
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={onContinue} className="btn btn-primary">
            Continue
            <span className="btn-disc">
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === "sending"}
            className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Request demo"}
            <span className="btn-disc">
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </span>
          </button>
        )}
      </div>

      <p className="mt-5 text-[12px] leading-relaxed text-[var(--text-3)]">
        We use these answers to prepare the call and nothing else. No newsletter,
        no sequence, no reselling your details.
      </p>
    </form>
  );
}
