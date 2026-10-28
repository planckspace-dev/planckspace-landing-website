import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Hero from "@/components/hero/Hero";
import Platform from "@/components/sections/Platform";
import Proof from "@/components/sections/Proof";
import Setup from "@/components/sections/Setup";
import Privacy from "@/components/sections/Privacy";
import Roles from "@/components/sections/Roles";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

/* The page is one argument, in order:
     the promise                Hero (a month, itemized)
     the problem, the answer    Platform (measure, find, fix, prove)
     the difference             Proof (savings as booked rows)
     going live                 Setup
     the objection              Privacy
     who it serves              Roles
     questions, action          FAQ, FinalCTA
   The site never pictures the console; it speaks in the product's artefacts
   (the ledger, a diff, a booked row). Every figure comes from one sample
   workspace (lib/sample.ts) and adds up. Depth lives in /docs. */

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" className="overflow-x-clip">
        <Hero />
        <Platform />
        <Proof />
        <Setup />
        <Privacy />
        <Roles />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
