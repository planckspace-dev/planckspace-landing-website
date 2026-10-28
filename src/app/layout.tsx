import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/* One family, the app's: Geist for everything read, Geist Mono for commands,
   ids, repo names and model strings. The wordmark is drawn in Geist too, so
   the page, the console and the logo share a voice. */

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const OG_IMAGE = "/og.png";
const DESCRIPTION =
  "PlanckSpace meters what your team spends on Claude Code, Cursor and the AI APIs, finds the waste, fixes it in one click, and proves every saving from your own telemetry. Metadata only: your code never leaves your machine.";

export const metadata: Metadata = {
  metadataBase: new URL("https://planckspace.dev"),
  title: {
    default: "PlanckSpace: Every token, accounted for",
    template: "%s | PlanckSpace",
  },
  description: DESCRIPTION,
  keywords: [
    "AI coding costs",
    "Claude Code spend",
    "Cursor spend analytics",
    "AI token usage dashboard",
    "AI spend management",
    "AI budget alerts",
    "verified AI savings",
    "cost per shipped session",
    "AI invoice reconciliation",
  ],
  authors: [{ name: "PlanckSpace" }],
  openGraph: {
    title: "PlanckSpace: Every token, accounted for",
    description:
      "Meter your team's AI coding spend across every tool, fix the waste in one click, and prove every saving from your own telemetry.",
    type: "website",
    url: "https://planckspace.dev",
    siteName: "PlanckSpace",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "PlanckSpace: Every token, accounted for" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlanckSpace: Every token, accounted for",
    description:
      "Meter your team's AI coding spend across every tool, fix the waste in one click, and prove every saving from your own telemetry.",
    images: [OG_IMAGE],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/planckspace-favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: { url: "/favicon/apple-touch-icon.png", sizes: "180x180" },
  },
  manifest: "/site.webmanifest",
};

/* viewportFit "cover" lets the page paint under a notch, which is what makes
   env(safe-area-inset-*) non-zero; .wrap and the nav read those insets.
   maximumScale is deliberately absent so pinch zoom keeps working. */
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#fafaf8",
  colorScheme: "light",
};

/* Entrances are an enhancement: content is hidden for its reveal only once
   this has run, so without script (or before it) everything is on the page.
   An attribute, not a class, so React never reconciles it away. */
const JS_FLAG = "document.documentElement.setAttribute('data-js','')";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
