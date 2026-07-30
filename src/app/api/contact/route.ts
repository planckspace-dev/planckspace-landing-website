import { Resend } from "resend";

import { CONTACT_EMAIL } from "@/lib/plans";

// The Resend SDK and the in-memory rate limiter both need a real Node runtime.
export const runtime = "nodejs";
// Never prerender or cache a submission endpoint.
export const dynamic = "force-dynamic";

const TOPIC_LABELS: Record<string, string> = {
  sales: "Sales & plans",
  support: "Product support",
  partnership: "Partnership",
  demo: "Demo request",
  other: "Something else",
};

/** Mirrors the `maxLength` attributes on the two forms, so a normal submission
 *  can never trip these — they exist to bound what a scripted caller can post. */
const LIMITS = {
  name: 200,
  email: 320,
  company: 200,
  teamSize: 40,
  topic: 40,
  message: 5000,
} as const;

type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  teamSize?: string;
  topic: string;
  message: string;
};
// The demo form also posts a structured `demo` object, but every field in it is
// already rendered into `message` by that form — so it is intentionally ignored.

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

/** Deliberately permissive: the goal is to catch typos and obvious junk, not to
 *  adjudicate RFC 5322. Anything stricter starts rejecting real addresses. */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function badRequest(error: string) {
  return Response.json({ error }, { status: 400 });
}

/* -------------------------------------------------------------------------- */
/* email composition                                                          */
/* -------------------------------------------------------------------------- */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fieldRows(payload: ContactPayload): Array<[string, string]> {
  const rows: Array<[string, string]> = [
    ["Name", payload.name],
    ["Email", payload.email],
  ];
  if (payload.company) rows.push(["Company", payload.company]);
  if (payload.teamSize) rows.push(["Team size", `${payload.teamSize} engineers`]);
  rows.push(["Topic", TOPIC_LABELS[payload.topic] ?? payload.topic]);
  return rows;
}

function textBody(payload: ContactPayload): string {
  const rows = fieldRows(payload)
    .map(([label, value]) => `${label.padEnd(12)} ${value}`)
    .join("\n");
  return `${rows}\n\n---\n\n${payload.message}\n`;
}

function htmlBody(payload: ContactPayload): string {
  const rows = fieldRows(payload)
    .map(
      ([label, value]) =>
        `<tr>
           <td style="padding:6px 16px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
           <td style="padding:6px 0;color:#111827;font-size:14px">${escapeHtml(value)}</td>
         </tr>`,
    )
    .join("");

  return `<div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px">
      <p style="margin:0 0 16px;color:#6b7280;font-size:12px;letter-spacing:.08em;text-transform:uppercase">
        planckspace.dev — ${escapeHtml(TOPIC_LABELS[payload.topic] ?? payload.topic)}
      </p>
      <table style="border-collapse:collapse;margin-bottom:20px">${rows}</table>
      <div style="border-top:1px solid #e5e7eb;padding-top:20px;color:#111827;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(
        payload.message,
      )}</div>
    </div>`;
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

  const payload: ContactPayload = {
    name: str(body.name, LIMITS.name),
    email: str(body.email, LIMITS.email),
    company: str(body.company, LIMITS.company) || undefined,
    teamSize: str(body.teamSize, LIMITS.teamSize) || undefined,
    topic: str(body.topic, LIMITS.topic) || "sales",
    message: str(body.message, LIMITS.message),
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

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to,
      // Replying in the mail client goes straight to the person who wrote in.
      replyTo: payload.email,
      subject: `[${TOPIC_LABELS[payload.topic] ?? payload.topic}] ${payload.name}${
        payload.company ? ` · ${payload.company}` : ""
      }`,
      text: textBody(payload),
      html: htmlBody(payload),
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
