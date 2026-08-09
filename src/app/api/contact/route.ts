import { Resend } from "resend";

import { buildContactEmail, type ContactSubmission, type DemoDetails } from "@/lib/contact-email";
import { CONTACT_EMAIL } from "@/lib/plans";

// The Resend SDK and the in-memory rate limiter both need a real Node runtime.
export const runtime = "nodejs";
// Never prerender or cache a submission endpoint.
export const dynamic = "force-dynamic";

/** Mirrors the `maxLength` attributes on the two forms, so a normal submission
 *  can never trip these — they exist to bound what a scripted caller can post. */
const LIMITS = {
  name: 200,
  email: 320,
  company: 200,
  teamSize: 40,
  topic: 40,
  message: 5000,
  /** Demo answers are picked from fixed lists, so these are generous bounds. */
  demoField: 120,
  demoList: 20,
} as const;

/* -------------------------------------------------------------------------- */
/* rate limiting                                                              */
/* -------------------------------------------------------------------------- */

const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

/** Per-IP submission timestamps. This lives in module memory, so it is per
 *  instance and resets on cold start — it throttles a casual flood, not a
 *  determined attacker. The honeypot plus Resend's own limits carry the rest;
 *  move this to a shared store only if abuse actually shows up. */
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic sweep so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }

  return recent.length > RATE_LIMIT.max;
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  // x-forwarded-for is a client→proxy chain; the first entry is the caller.
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

/* -------------------------------------------------------------------------- */
/* validation                                                                 */
/* -------------------------------------------------------------------------- */

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function strList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value
    .slice(0, LIMITS.demoList)
    .map((v) => str(v, LIMITS.demoField))
    .filter(Boolean);
  return items.length ? items : undefined;
}

/** The demo form posts this structured object alongside the transcript it
 *  composes into `message`. The object is what the email renders, so the brief
 *  arrives as real rows rather than a wall of preformatted text.
 *
 *  Returns undefined unless at least one answer came through, so an empty
 *  `demo: {}` cannot suppress the free-text message block. */
function demoDetails(value: unknown): DemoDetails | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const raw = value as Record<string, unknown>;

  const demo: DemoDetails = {
    role: str(raw.role, LIMITS.demoField) || undefined,
    teamSize: str(raw.teamSize, LIMITS.demoField) || undefined,
    tools: strList(raw.tools),
    monthlySpend: str(raw.monthlySpend, LIMITS.demoField) || undefined,
    goals: strList(raw.goals),
    timeline: str(raw.timeline, LIMITS.demoField) || undefined,
    meetingTime: str(raw.meetingTime, LIMITS.demoField) || undefined,
    plan: str(raw.plan, LIMITS.demoField) || undefined,
    notes: str(raw.notes, LIMITS.message) || undefined,
  };

  return Object.values(demo).some((v) => v !== undefined) ? demo : undefined;
}

/** Deliberately permissive: the goal is to catch typos and obvious junk, not to
 *  adjudicate RFC 5322. Anything stricter starts rejecting real addresses. */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function badRequest(error: string) {
  return Response.json({ error }, { status: 400 });
}

/* -------------------------------------------------------------------------- */
/* handler                                                                    */
/* -------------------------------------------------------------------------- */

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return badRequest("invalid request body");
  }

  const body = (raw ?? {}) as Record<string, unknown>;

  // Honeypot: the field is off-screen and tab-skipped, so only a bot fills it.
  // Answer 200 so the bot sees success and does not retry with variations.
  if (str(body.website, 200)) {
    return Response.json({ ok: true });
  }

  const payload: ContactSubmission = {
    name: str(body.name, LIMITS.name),
    email: str(body.email, LIMITS.email),
    company: str(body.company, LIMITS.company) || undefined,
    teamSize: str(body.teamSize, LIMITS.teamSize) || undefined,
    topic: str(body.topic, LIMITS.topic) || "sales",
    message: str(body.message, LIMITS.message),
    demo: demoDetails(body.demo),
    receivedAt: new Date(),
  };

  if (!payload.name) return badRequest("please include your name");
  if (!looksLikeEmail(payload.email)) return badRequest("please include a valid email address");
  if (!payload.message) return badRequest("please include a message");

  if (rateLimited(clientIp(req))) {
    return Response.json(
      { error: "too many messages from this address — try again shortly" },
      { status: 429 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Misconfiguration, not a caller error. Log loudly; tell the visitor
    // something true and actionable rather than leaking the cause.
    console.error("[contact] RESEND_API_KEY is not set — cannot send mail");
    return Response.json(
      { error: "our mail service is misconfigured right now" },
      { status: 500 },
    );
  }

  const to = process.env.CONTACT_TO_EMAIL ?? CONTACT_EMAIL;
  // Must be an address on a domain verified in Resend. `onboarding@resend.dev`
  // is the unverified fallback and only ever delivers to the Resend account owner.
  const from = process.env.CONTACT_FROM_EMAIL ?? "PlanckSpace <onboarding@resend.dev>";

  const { subject, html, text } = buildContactEmail(payload);

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to,
      // Replying in the mail client goes straight to the person who wrote in.
      replyTo: payload.email,
      subject,
      text,
      html,
      headers: {
        // Two people writing in about the same topic produce near-identical
        // subjects; without a unique reference Gmail folds them into one thread
        // and the second submission hides behind the first.
        "X-Entity-Ref-ID": crypto.randomUUID(),
      },
    });

    if (error) {
      console.error("[contact] resend rejected the send:", error);
      return Response.json({ error: "we could not send that message" }, { status: 502 });
    }
  } catch (err) {
    console.error("[contact] unexpected failure while sending:", err);
    return Response.json({ error: "we could not send that message" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
