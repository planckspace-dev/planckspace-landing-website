import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ToolsBar from "@/components/ToolsBar";
import Problem from "@/components/Problem";
import Pillars from "@/components/Pillars";
import Features from "@/components/Features";
import Capabilities from "@/components/Capabilities";
import HowItWorks from "@/components/HowItWorks";
import Privacy from "@/components/Privacy";
import Roles from "@/components/Roles";
import PricingTeaser from "@/components/PricingTeaser";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

/* Page order is the argument, in order:
     why this exists      Problem
     what we do about it  Pillars, the four moves
     the measuring        Features
     the optimizing       Capabilities
     how you go live      HowItWorks
     the objection        Privacy
     who it's for         Roles
   Sections after Pillars each expand one of its four moves, so re-ordering
   them without re-ordering the spine breaks the read. */

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <Navbar />
      <Hero />
      <ToolsBar />
      <Problem />
      <Pillars />
      <Features />
      <Capabilities />
      <HowItWorks />
      <Privacy />
      <Roles />
      <PricingTeaser />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
