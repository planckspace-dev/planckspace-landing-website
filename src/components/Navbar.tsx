"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-5 pt-3 sm:pt-5"
    >
      <div
        className={cn(
          "max-w-5xl mx-auto flex items-center justify-between h-15 pl-4 pr-3 sm:pl-5 sm:pr-3 py-2.5 rounded-full transition-all duration-500",
          scrolled
            ? "glass-island"
            : "bg-white/45 backdrop-blur-md border border-transparent"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0" aria-label="PlanckSpace home">
          <Logo markClassName="w-8 h-8" textClassName="text-[19px]" />
        </Link>

        {/* Desktop nav — centered */}
        <nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13.5px] text-[var(--text-2)] hover:text-[var(--ink)] transition-colors duration-150 font-medium px-3.5 py-2 rounded-full hover:bg-[var(--inset)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          <Link
            href="https://app.planckspace.dev/login"
            className="text-[13.5px] text-[var(--text-2)] hover:text-[var(--ink)] transition-colors font-medium px-3.5 py-2 rounded-full hover:bg-[var(--inset)]"
          >
            Sign in
          </Link>
          <Link
            href="#get-started"
            className="group sheen flex items-center gap-2 text-[13.5px] font-semibold bg-[var(--ink)] text-white pl-4 pr-2 py-2 rounded-full hover:bg-[var(--ink-soft)] transition-colors duration-150"
          >
            Get started
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/15 group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-[var(--ink)] p-2 -mr-0.5 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="md:hidden mt-2 max-w-5xl mx-auto bg-white border border-[var(--border)] rounded-3xl shadow-[var(--shadow-lg)] overflow-hidden"
          >
            <div className="px-3 py-3 space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-[var(--text-2)] hover:text-[var(--ink)] hover:bg-[var(--inset)] px-3 py-2.5 text-sm font-medium rounded-xl"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-[var(--border)] flex flex-col gap-2 px-1 pb-1">
                <Link
                  href="https://app.planckspace.dev/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium py-2.5 text-center border border-[var(--border-strong)] rounded-full text-[var(--ink)]"
                >
                  Sign in
                </Link>
                <Link
                  href="#get-started"
                  onClick={() => setMobileOpen(false)}
                  className="block text-white text-sm font-semibold py-2.5 text-center bg-[var(--ink)] rounded-full"
                >
                  Get started free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
