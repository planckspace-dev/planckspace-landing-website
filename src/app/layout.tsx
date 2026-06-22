import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
  display: "swap",
});

const FAVICON_BASE = "/planckspace-logo-kit/planckspace-logo";

export const metadata: Metadata = {
  title: "PlanckSpace — AI Coding Spend, Made Visible",
  description:
    "Track every token your team spends in Claude Code, Cursor, and Windsurf. Surface wasted spend, cut costs, and optimize AI ROI — without touching your code.",
  keywords: [
    "AI coding costs",
    "Claude Code spend tracker",
    "Cursor spend analytics",
    "AI token usage dashboard",
    "developer productivity analytics",
    "AI budget management for teams",
    "engineering cost visibility",
  ],
  authors: [{ name: "PlanckSpace" }],
  openGraph: {
    title: "PlanckSpace — AI Coding Spend, Made Visible",
    description:
      "Track every token your team spends in Claude Code, Cursor, and Windsurf. Surface wasted spend, cut costs, and optimize AI ROI.",
    type: "website",
    url: "https://planckspace.dev",
    siteName: "PlanckSpace",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlanckSpace — AI Coding Spend, Made Visible",
    description:
      "Track every token your team spends in Claude Code, Cursor, and Windsurf. Surface wasted spend, cut costs, and optimize AI ROI.",
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
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${spaceMono.variable} h-full`}
    >
      <body className="antialiased min-h-full">{children}</body>
    </html>
  );
}
