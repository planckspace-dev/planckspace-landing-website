import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TourFilm from "@/components/film/TourFilm";
import OgCard from "@/components/film/OgCard";

/* Development-only render target for the site's media: the product tour
   film (public/media/planckspace-tour.*) and the social card (public/og.png).
   A capture script steps window.__film through time and records frames; see
   the notes in components/film/TourFilm.tsx. Production builds return 404. */

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
      {film === "og" ? <OgCard /> : <TourFilm />}
    </>
  );
}
