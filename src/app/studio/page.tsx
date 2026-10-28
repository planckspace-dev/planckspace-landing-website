import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Doto, Science_Gothic } from "next/font/google";
import TourFilm from "@/components/film/TourFilm";
import OgCard from "@/components/film/OgCard";
import "./film.css";

/* Development-only render target for the site's media: the product tour
   film (public/media/planckspace-tour.*) and the social card (public/og.png).
   A capture script steps window.__film through time and records frames; see
   the notes in components/film/TourFilm.tsx. Production builds return 404.

   The film is still drawn in the previous dark system, so its two display
   faces load here, not in the root layout, and its styles are scoped
   (film.css). */

const display = Science_Gothic({
  subsets: ["latin"],
  variable: "--font-science",
  axes: ["wdth"],
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Arial Black", "Arial", "sans-serif"],
});

const meter = Doto({
  subsets: ["latin"],
  variable: "--font-doto",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default async function Studio({ searchParams }: { searchParams: Promise<{ film?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { film } = await searchParams;

  return (
    <>
      {/* must run before hydration so animated components mount in film mode */}
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.film='1'" }} />
      <style>{`
        .film *, .film *::before, .film *::after, section *, section *::before { transition: none !important; animation: none !important; }
        nextjs-portal { display: none !important; }
        html, body { overflow: hidden; background: #0b0b0c; }
      `}</style>
      <div className={`${display.variable} ${meter.variable}`}>{film === "og" ? <OgCard /> : <TourFilm />}</div>
    </>
  );
}
