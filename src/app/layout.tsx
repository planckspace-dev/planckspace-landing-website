import type { Metadata, Viewport } from "next";
import { Science_Gothic, Doto, Geist, Geist_Mono } from "next/font/google";
import SmoothScroll from "@/components/site/SmoothScroll";
import "./globals.css";

/* ── the voices ───────────────────────────────────────────────────────────
   Science Gothic is the display face. Its counters are squared off the way
   the Aperture mark is, and it carries a width axis from 50 to 200, which is
   what the headlines animate along: type that stretches into place instead
   of fading in. Only the width axis is requested; weight comes with it.

   Doto is a dot-matrix face kept for one job, numbers being counted. A total
   drawn in discrete dots reads as metered.

   Geist and Geist Mono carry everything you actually read. The product and
   the wordmark are set in Geist, so the page and the app share a voice.
   ────────────────────────────────────────────────────────────────────── */

const display = Science_Gothic({
  subsets: ["latin"],
  variable: "--font-science",
  axes: ["wdth"],
  display: "swap",
  // next/font has no metric overrides for this face, so name the fallback
  // instead of letting it guess (and warn on every compile).
  adjustFontFallback: false,
  fallback: ["Arial Black", "Arial", "sans-serif"],
});

const meter = Doto({
  subsets: ["latin"],
  variable: "--font-doto",
  display: "swap",
  preload: false,
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
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
   env(safe-area-inset-*) non-zero; .wrap reads those insets. maximumScale is
   deliberately absent so pinch zoom keeps working. */
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#0b0b0c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${meter.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
