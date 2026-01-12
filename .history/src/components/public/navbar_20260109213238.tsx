"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Cpu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 🛰️ RESPONSIVE GLOBAL NAV (Tier 1)
 * Optimized for high-resiliency aesthetics and mobile ergonomics.
 */
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll Protocol: Adds blur effect when moving down the page
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Infrastructure", href: "#infrastructure" },
    { name: "Protocols", href: "#pricing" },
    { name: "Merchant Hub", href: "/dashboard/login" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6",
        scrolled ? "py-4 bg-background/80 backdrop-blur-xl border-b border-border/40" : "py-8 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO NODE */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-90 transition-transform duration-500">
            <Cpu className="h-5 w-5" />
          </div>
          <span className="text-xl font-black uppercase italic tracking-tighter">
            Zipha<span className="text-primary">.</span>
          </span>
        </Link>

        {/* DESKTOP PROTOCOL: Hidden on Mobile */}
        <div className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Button
            asChild
            className="rounded-full px-8 font-black uppercase italic tracking-widest text-[10px] shadow-xl shadow-primary/20"
          >
            <Link href="/register">Initialize Node</Link>
          </Button>
        </div>

        {/* MOBILE TRIGGER */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-card border border-border/60 text-foreground"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* MOBILE DRAWER: Tier 1 Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 top-[72px] bg-background/95 backdrop-blur-2xl z-[-1] lg:hidden transition-all duration-500 ease-in-out px-8 pt-12 flex flex-col gap-8",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className="text-4xl font-black uppercase italic tracking-tighter text-foreground hover:text-primary transition-all border-b border-border/40 pb-4"
          >
            {link.name}
          </Link>
        ))}
        
        <div className="mt-auto pb-12 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-4">
            Security Clearance Required
          </p>
          <Button
            asChild
            className="w-full h-16 rounded-2xl font-black uppercase italic tracking-widest"
            onClick={() => setIsOpen(false)}
          >
            <Link href="/register">
              Start Merchant Node <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}