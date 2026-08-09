/**
 * Composes the internal notification email for /api/contact submissions.
 *
 * This is a transactional email read in a real inbox, so it is built the way
 * email actually works, not the way the site does: one 600px table stack, every
 * style inlined, no flexbox/grid, no external CSS, no web fonts. The `<style>`
 * block only carries responsive and dark-mode niceties — the layout has to be
 * correct with it stripped, which is what Outlook does.
 *
 * Colours mirror the site tokens in globals.css so the mail reads as the same
 * product: white surfaces, ink type, hairline borders, one brand blue.
 */

const SITE_URL = "https://planckspace.dev";

const C = {
  page: "#f0f2f6",
  surface: "#ffffff",
  panel: "#f7f8fb",
  border: "#e7e9f0",
  ink: "#11131a",
  text2: "#5a6172",
  text3: "#8a91a3",
  brand50: "#eef4ff",
  brand600: "#2e6bf2",
  brand700: "#1d53cf",
} as const;

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";

export const TOPIC_LABELS: Record<string, string> = {
  sales: "Sales & plans",
  support: "Product support",
  partnership: "Partnership",
  demo: "Demo request",
  other: "Something else",
};

/** Subject-line lead per topic. Front-loaded so it survives inbox truncation. */
const SUBJECT_LEAD: Record<string, string> = {
  sales: "Sales inquiry",
  support: "Support request",
  partnership: "Partnership inquiry",
  demo: "Demo request",
  other: "Contact form",
};

export interface DemoDetails {
  role?: string;
  teamSize?: string;
  tools?: string[];
  monthlySpend?: string;
  goals?: string[];
  timeline?: string;
  meetingTime?: string;
  plan?: string;
  notes?: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  teamSize?: string;
  topic: string;
  /** Free-text message. For demo submissions this is the composed transcript,
   *  which `demo` supersedes when present. */
  message: string;
  demo?: DemoDetails;
  receivedAt?: Date;
}

export interface ComposedEmail {
  subject: string;
  html: string;
  text: string;
}

/* -------------------------------------------------------------------------- */
/* primitives                                                                 */
/* -------------------------------------------------------------------------- */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Hyphen ranges like `1-5` read as a date range with a plain hyphen. */
function prettyRange(value: string): string {
  return value.replace(/(\d)\s*-\s*(\d)/g, "$1–$2");
}

function topicLabel(topic: string): string {
  return TOPIC_LABELS[topic] ?? topic;
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

/** `white-space:pre-wrap` is unreliable in Outlook, so blank-line-separated
 *  blocks become paragraphs and single newlines become `<br>`. */
function messageHtml(text: string): string {
  const blocks = text.split(/\n{2,}/).filter((b) => b.trim());
  return blocks
    .map((block, i) => {
      const body = escapeHtml(block.trim()).replace(/\n/g, "<br>");
      const margin = i === blocks.length - 1 ? "0" : "0 0 12px";
      return `<p class="ink" style="margin:${margin};font-size:15px;line-height:1.65;color:${C.ink}">${body}</p>`;
    })
    .join("");
}

function formatReceived(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  };
  // An invalid CONTACT_TIMEZONE must not take the send down with it.
  try {
    return new Intl.DateTimeFormat("en-GB", {
      ...options,
      timeZone: process.env.CONTACT_TIMEZONE || "UTC",
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(date);
  }
}

/* -------------------------------------------------------------------------- */
/* html building blocks                                                       */
/* -------------------------------------------------------------------------- */

interface Row {
  label: string;
  /** Pre-escaped HTML. Build it with `escapeHtml` unless it is markup. */
  value: string;
}

function detailRows(rows: Row[]): string {
  return rows
    .map(({ label, value }, i) => {
      const divider = i === 0 ? "" : `border-top:1px solid ${C.border};`;
      return `<tr>
        <td class="lbl hair" style="${divider}padding:11px 16px 11px 0;width:104px;font-family:${MONO};font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:${C.text3};vertical-align:top;line-height:1.55">${escapeHtml(
          label,
        )}</td>
        <td class="val ink hair" style="${divider}padding:11px 0;font-size:14.5px;line-height:1.5;color:${C.ink};vertical-align:top">${value}</td>
      </tr>`;
    })
    .join("");
}

function detailCard(rows: Row[]): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="panel" style="background:${C.panel};border:1px solid ${C.border};border-radius:12px">
      <tr><td style="padding:6px 20px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${detailRows(rows)}</table>
      </td></tr>
    </table>`;
}

function sectionLabel(text: string): string {
  return `<p class="muted" style="margin:0 0 10px;font-family:${MONO};font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:${C.text3}">${escapeHtml(
    text,
  )}</p>`;
}

function chips(values: string[]): string {
  return values
    .map(
      (v) =>
        `<span class="chip" style="display:inline-block;margin:0 6px 6px 0;padding:5px 11px;background:${C.brand50};border-radius:999px;font-size:13px;line-height:1.3;color:${C.brand700}">${escapeHtml(
          v,
        )}</span>`,
    )
    .join("");
}

function spacer(height: number): string {
  return `<tr><td style="height:${height}px;line-height:${height}px;font-size:0">&nbsp;</td></tr>`;
}

/* -------------------------------------------------------------------------- */
/* composition                                                                */
/* -------------------------------------------------------------------------- */

function buildSubject(s: ContactSubmission): string {
  const lead = SUBJECT_LEAD[s.topic] ?? "Contact form";
  return `${lead} — ${s.name}${s.company ? `, ${s.company}` : ""}`;
}

/** Inbox preview line. Leads with the qualifying facts, then the message. */
function buildPreheader(s: ContactSubmission, message: string): string {
  const parts = [
    s.company,
    s.teamSize ? `${prettyRange(s.teamSize)} engineers` : "",
    message.replace(/\s+/g, " ").trim(),
  ].filter(Boolean);
  return parts.join(" · ").slice(0, 140);
}

function identityRows(s: ContactSubmission): Row[] {
  const rows: Row[] = [
    { label: "Name", value: escapeHtml(s.name) },
    {
      label: "Email",
      value: `<a class="lnk" href="${escapeHtml(`mailto:${encodeURI(s.email)}`)}" style="color:${C.brand600};text-decoration:none;font-weight:500">${escapeHtml(
        s.email,
      )}</a>`,
    },
  ];
  if (s.company) rows.push({ label: "Company", value: escapeHtml(s.company) });
  if (s.teamSize) {
    rows.push({
      label: "Team size",
      value: escapeHtml(`${prettyRange(s.teamSize)} engineers`),
    });
  }
  rows.push({ label: "Topic", value: escapeHtml(topicLabel(s.topic)) });
  return rows;
}

/** Structured answers from the multi-step demo form, minus the free-text notes
 *  (those render in the message block like any other submission). */
function demoRows(demo: DemoDetails): Row[] {
  const rows: Row[] = [];
  if (demo.role) rows.push({ label: "Role", value: escapeHtml(demo.role) });
  if (demo.monthlySpend) {
    rows.push({ label: "Monthly spend", value: escapeHtml(demo.monthlySpend) });
  }
  if (demo.tools?.length) rows.push({ label: "Tools", value: chips(demo.tools) });
  if (demo.goals?.length) rows.push({ label: "Goals", value: chips(demo.goals) });
  if (demo.plan) rows.push({ label: "Plan", value: escapeHtml(demo.plan) });
  if (demo.timeline) rows.push({ label: "Timeline", value: escapeHtml(demo.timeline) });
  if (demo.meetingTime) {
    rows.push({ label: "Availability", value: escapeHtml(demo.meetingTime) });
  }
  return rows;
}

function buildHtml(s: ContactSubmission, message: string, subject: string): string {
  const received = formatReceived(s.receivedAt ?? new Date());
  const preheader = buildPreheader(s, message);
  const replyHref = escapeHtml(
    `mailto:${encodeURI(s.email)}?subject=${encodeURIComponent(`Re: ${subject}`)}`,
  );
  const demo = s.demo ? demoRows(s.demo) : [];

  const messageBlock = message
    ? `<div class="panel" style="background:${C.panel};border:1px solid ${C.border};border-radius:12px;padding:18px 20px">${messageHtml(
        message,
      )}</div>`
    : `<p class="muted" style="margin:0;font-size:14.5px;color:${C.text3};font-style:italic">No additional notes.</p>`;

  const demoBlock = demo.length
    ? `${spacer(28)}
       <tr><td>${sectionLabel("Demo brief")}${detailCard(demo)}</td></tr>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escapeHtml(subject)}</title>
<style>
  a { text-decoration: none; }
  @media only screen and (max-width: 620px) {
    .shell { padding: 16px 12px !important; }
    .pad { padding-left: 22px !important; padding-right: 22px !important; }
    .h1 { font-size: 22px !important; }
    .lbl { display: block !important; width: auto !important; padding: 12px 0 2px !important; border-top: 0 !important; }
    .val { display: block !important; padding: 0 0 12px !important; border-top: 0 !important; }
  }
  @media (prefers-color-scheme: dark) {
    .bg { background: #08090d !important; }
    .card, .panel { background: #14161d !important; border-color: #262a35 !important; }
    .hair { border-color: #262a35 !important; }
    .ink { color: #f4f5f7 !important; }
    .lnk { color: #9fbefb !important; }
    .muted { color: #8f96a6 !important; }
    .btn { background: #ffffff !important; }
    .btn a { color: #11131a !important; }
    .chip { background: #1b2540 !important; color: #9fbefb !important; }
  }
</style>
</head>
<body class="bg" style="margin:0;padding:0;background:${C.page};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all">${escapeHtml(
    preheader,
  )}</div>
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all">&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;</div>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="bg" style="background:${C.page}">
<tr><td align="center" class="shell" style="padding:32px 16px">

  <!--[if mso]><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" align="center"><tr><td><![endif]-->
  <!-- No width attribute on purpose: it becomes a minimum in auto table layout
       and pushes the card past narrow viewports. Outlook, which ignores
       max-width, gets its 600px from the conditional ghost table above. -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="card" style="width:100%;max-width:600px;background:${C.surface};border:1px solid ${C.border};border-radius:16px;overflow:hidden;font-family:${FONT}">

    <!-- brand rule -->
    <tr><td style="height:3px;line-height:3px;font-size:0;background:${C.brand600}">&nbsp;</td></tr>

    <!-- header -->
    <tr><td class="pad hair" style="padding:18px 32px;border-bottom:1px solid ${C.border}">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="vertical-align:middle">
            <img src="${SITE_URL}/favicon/favicon-128.png" width="26" height="26" alt="" style="display:inline-block;vertical-align:middle;border-radius:7px;border:0">
            <span class="ink" style="display:inline-block;vertical-align:middle;padding-left:9px;font-size:16px;font-weight:600;letter-spacing:-0.01em;color:${C.ink}">Planckspace</span>
          </td>
          <td align="right" class="muted" style="vertical-align:middle;font-family:${MONO};font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:${C.text3}">Website inquiry</td>
        </tr>
      </table>
    </td></tr>

    <!-- body -->
    <tr><td class="pad" style="padding:32px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">

        <tr><td>
          <span class="chip" style="display:inline-block;padding:5px 12px;background:${C.brand50};border-radius:999px;font-size:11.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:${C.brand700}">${escapeHtml(
            topicLabel(s.topic),
          )}</span>
        </td></tr>
        ${spacer(14)}
        <tr><td class="ink h1" style="font-size:25px;line-height:1.25;font-weight:600;letter-spacing:-0.02em;color:${C.ink}">${escapeHtml(
          s.name,
        )} got in touch</td></tr>
        ${spacer(8)}
        <tr><td class="muted" style="font-size:13px;line-height:1.5;color:${C.text3}">${escapeHtml(
          received,
        )} · via the contact form on planckspace.dev</td></tr>

        ${spacer(24)}
        <tr><td>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td class="btn" style="background:${C.ink};border-radius:999px">
              <a href="${replyHref}" style="display:inline-block;padding:12px 24px;font-family:${FONT};font-size:14px;font-weight:600;color:#ffffff;text-decoration:none">Reply to ${escapeHtml(
                firstName(s.name),
              )} →</a>
            </td>
          </tr></table>
        </td></tr>

        ${spacer(28)}
        <tr><td>${sectionLabel("Who wrote in")}${detailCard(identityRows(s))}</td></tr>
        ${demoBlock}

        ${spacer(28)}
        <tr><td>${sectionLabel(s.demo ? "Notes" : "Message")}${messageBlock}</td></tr>

      </table>
    </td></tr>

    <!-- footer -->
    <tr><td class="pad panel hair" style="padding:20px 32px;background:${C.panel};border-top:1px solid ${C.border}">
      <p class="muted" style="margin:0;font-size:12.5px;line-height:1.6;color:${C.text2}">
        Hitting reply answers <strong class="ink" style="color:${C.ink};font-weight:600">${escapeHtml(
          s.name,
        )}</strong> directly at ${escapeHtml(s.email)}.
      </p>
    </td></tr>

  </table>
  <!--[if mso]></td></tr></table><![endif]-->

  <p class="muted" style="margin:18px 0 0;max-width:600px;font-family:${FONT};font-size:11.5px;line-height:1.6;color:${C.text3}">
    PlanckSpace · Automated notification from <a class="muted" href="${SITE_URL}/contact" style="color:${C.text3};text-decoration:underline">planckspace.dev/contact</a>
  </p>

</td></tr>
</table>
</body>
</html>`;
}

function buildText(s: ContactSubmission, message: string): string {
  const rule = "-".repeat(56);
  const line = (label: string, value: string) => `${`${label}:`.padEnd(15)}${value}`;

  const lines: string[] = [
    `${topicLabel(s.topic).toUpperCase()} — via planckspace.dev/contact`,
    formatReceived(s.receivedAt ?? new Date()),
    "",
    rule,
    "",
    line("Name", s.name),
    line("Email", s.email),
  ];

  if (s.company) lines.push(line("Company", s.company));
  if (s.teamSize) lines.push(line("Team size", `${s.teamSize} engineers`));

  if (s.demo) {
    const d = s.demo;
    lines.push("", "DEMO BRIEF", "");
    if (d.role) lines.push(line("Role", d.role));
    if (d.monthlySpend) lines.push(line("Monthly spend", d.monthlySpend));
    if (d.tools?.length) lines.push(line("Tools", d.tools.join(", ")));
    if (d.goals?.length) lines.push(line("Goals", d.goals.join(", ")));
    if (d.plan) lines.push(line("Plan", d.plan));
    if (d.timeline) lines.push(line("Timeline", d.timeline));
    if (d.meetingTime) lines.push(line("Availability", d.meetingTime));
  }

  lines.push(
    "",
    rule,
    "",
    s.demo ? "NOTES" : "MESSAGE",
    "",
    message || "No additional notes.",
    "",
    rule,
    "",
    `Reply to this email to answer ${s.name} at ${s.email}.`,
    "",
  );

  return lines.join("\n");
}

/**
 * Builds the subject, HTML and plain-text parts for one submission. Both parts
 * carry the same information — plenty of inboxes and every notification preview
 * show the text one.
 */
export function buildContactEmail(submission: ContactSubmission): ComposedEmail {
  // A structured demo payload supersedes the transcript the demo form composes
  // into `message`; only its free-text notes stay in the message block.
  const message = submission.demo
    ? (submission.demo.notes ?? "").trim()
    : submission.message.trim();

  const subject = buildSubject(submission);

  return {
    subject,
    html: buildHtml(submission, message, subject),
    text: buildText(submission, message),
  };
}
