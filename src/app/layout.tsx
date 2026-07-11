import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
  display: "swap",
});

const FAVICON_BASE = "/planckspace-logo-kit/planckspace-logo";

export const metadata: Metadata = {
  metadataBase: new URL("https://planckspace.dev"),
  title: {
    default: "PlanckSpace — Spend management for AI-assisted engineering",
    template: "%s — PlanckSpace",
  },
  description:
    "PlanckSpace meters every token your team spends in Claude Code, Cursor, Windsurf, and Antigravity — one shared dashboard for cost visibility, waste detection, and invoice reconciliation. Metadata only, never your code.",
  keywords: [
    "AI coding costs",
    "Claude Code spend tracker",
    "Cursor spend analytics",
    "AI token usage dashboard",
    "AI budget management for teams",
    "engineering cost visibility",
    "AI spend reconciliation",
  ],
  authors: [{ name: "PlanckSpace" }],
  openGraph: {
    title: "PlanckSpace — Spend management for AI-assisted engineering",
    description:
      "Meter every token across Claude Code, Cursor, Windsurf, and Antigravity. Cost visibility, waste detection, and invoice reconciliation — without touching your code.",
    type: "website",
    url: "https://planckspace.dev",
    siteName: "PlanckSpace",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlanckSpace — Spend management for AI-assisted engineering",
    description:
      "Meter every token across Claude Code, Cursor, Windsurf, and Antigravity. Cost visibility, waste detection, and invoice reconciliation — without touching your code.",
  },
  icons: {
    icon: [
      { url: `${FAVICON_BASE}/png/favicon/favicon.ico`, sizes: "any" },
      { url: `${FAVICON_BASE}/svg/planckspace-favicon.svg`, type: "image/svg+xml" },
      { url: `${FAVICON_BASE}/png/favicon/favicon-32.png`, sizes: "32x32", type: "image/png" },
      { url: `${FAVICON_BASE}/png/favicon/favicon-16.png`, sizes: "16x16", type: "image/png" },
    ],
    apple: { url: `${FAVICON_BASE}/png/favicon/apple-touch-icon.png`, sizes: "180x180" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${jetbrains.variable} h-full`}>
      <body className="antialiased min-h-full bg-[var(--page)] text-[var(--ink)]">
        {children}
      </body>
    </html>
  );
}
