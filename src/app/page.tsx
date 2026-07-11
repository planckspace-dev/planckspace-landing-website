import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ToolsBar from "@/components/ToolsBar";
import Problem from "@/components/Problem";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Privacy from "@/components/Privacy";
import Roles from "@/components/Roles";
import PricingTeaser from "@/components/PricingTeaser";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <Navbar />
      <Hero />
      <ToolsBar />
      <Problem />
      <Features />
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
