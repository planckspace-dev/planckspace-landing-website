import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Hero from "@/components/hero/Hero";
import ToolMarquee from "@/components/sections/ToolMarquee";
import Poster from "@/components/sections/Poster";
import FindingsGallery from "@/components/sections/FindingsGallery";
import FixLoop from "@/components/sections/FixLoop";
import Verify from "@/components/sections/Verify";
import Privacy from "@/components/sections/Privacy";
import Govern from "@/components/sections/Govern";
import Roles from "@/components/sections/Roles";
import Setup from "@/components/sections/Setup";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

/* The page is one argument, in order:
     the promise          Hero (every token, accounted for)
     what it meters       ToolMarquee
     the problem          Poster
     find                 FindingsGallery
     fix                  FixLoop
     verify               Verify
     the objection        Privacy
     for the org          Govern, Roles
     going live           Setup
     questions, action    FAQ, FinalCTA
   Find, fix, verify is the product's own loop; keep those in that order.
   The product console is deliberately not shown on the site. */

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" className="overflow-x-clip">
        <Hero />
        <ToolMarquee />
        <Poster />
        <FindingsGallery />
        <FixLoop />
        <Verify />
        <Privacy />
        <Govern />
        <Roles />
        <Setup />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
