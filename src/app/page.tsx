import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogoBar from "@/components/LogoBar";
import Problem from "@/components/Problem";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Roles from "@/components/Roles";
import Privacy from "@/components/Privacy";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-[var(--page)] text-[var(--ink)] overflow-x-clip antialiased">
      <Navbar />
      <Hero />
      <LogoBar />
      <Problem />
      <Features />
      <HowItWorks />
      <Roles />
      <Privacy />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
