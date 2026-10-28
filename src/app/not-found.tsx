import { BookOpen } from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Button from "@/components/site/Button";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" className="relative overflow-hidden">
        <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(50%_60%_at_50%_40%,#000_15%,transparent_80%)]" />
        <div className="wrap relative flex min-h-[78vh] flex-col items-center justify-center pt-[var(--nav-h)] text-center">
          <p className="eyebrow">404</p>
          <h1 className="title-xl mt-6 max-w-[14ch]">
            This page is <span className="tone">not in the ledger.</span>
          </h1>
          <p className="lede mt-6 max-w-[30rem]">The link may be old, or the page may have moved. Everything else is accounted for.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/" size="lg">
              Back to the homepage
            </Button>
            <Button href="/docs" size="lg" variant="secondary" icon={<BookOpen className="h-[17px] w-[17px]" strokeWidth={1.8} />}>
              Documentation
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
