"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Cpu, ArrowRight, Zap, Globe, Shield, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID GLOBAL NAVIGATION (v16.16.12)
 * Logic: Hyper-Glass scroll protocol with role-aware membrane.
 * Design: Institutional Squircle Morphology.
 */
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";

  // 🌊 SCROLL PROTOCOL: Real-time membrane recalibration
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  const navLinks = [
    { name: "Infrastructure", href: "#infrastructure" },
    { name: "Protocols", href: "#pricing" },
    { name: isStaff ? "Oversight_Terminal" : "Merchant_Hub", href: "/dashboard" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] px-6 md:px-12",
        scrolled 
          ? "h-20 bg-background/60 backdrop-blur-2xl border-b border-white/5 shadow-2xl" 
          : "h-24 md:h-32 bg-transparent"
      )}
    >
      <div className="max-w-[1400px] mx-auto w-full h-full flex items-center justify-between">
        
        {/* LOGO NODE: Branding Vector */}
        <Link 
          href="/" 
          onClick={() => impact("light")}
          className="flex items-center gap-4 group z-[110]"
        >
          <div className={cn(
            "size-10 md:size-12 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-700 group-hover:rotate-12 active:scale-90",
            isStaff ? "bg-amber-500 shadow-amber-500/30" : "bg-primary shadow-primary/30"
          )}>
            {isStaff ? <Globe className="size-6" /> : <Cpu className="size-6" />}
          </div>
          <span className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none text-foreground">
            Zipha<span className={isStaff ? "text-amber-500" : "text-primary"}>.</span>
          </span>
        </Link>

        {/* DESKTOP PROTOCOL: Institutional Navigation */}
        <div className="hidden lg:flex items-center gap-10 xl:gap-16">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onMouseEnter={() => impact("light")}
              className={cn(
                "text-[10px] xl:text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-500 italic",
                isStaff 
                  ? "text-amber-500/40 hover:text-amber-500 hover:tracking-[0.5em]" 
                  : "text-muted-foreground/60 hover:text-primary hover:tracking-[0.5em]"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          <Button
            asChild
            onClick={() => impact("medium")}
            className={cn(
              "rounded-full h-14 px-10 font-black uppercase italic tracking-[0.2em] text-[11px] shadow-2xl transition-all duration-700 hover:scale-[1.05] active:scale-95",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/30" : "bg-primary text-primary-foreground shadow-primary/30"
            )}
          >
            <Link href="/register">
              {isStaff ? "Global_Oversight" : "Initialize_Node"}
            </Link>
          </Button>
        </div>

        {/* MOBILE TRIGGER: Kinetic Interface */}
        <button
          onClick={() => { impact("medium"); setIsOpen(!isOpen); }}
          className={cn(
            "lg:hidden size-12 z-[110] flex items-center justify-center rounded-2xl border transition-all duration-500 shadow-2xl active:scale-90",
            isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-white/5 border-white/5 text-foreground"
          )}
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* MOBILE DRAWER: Kinetic Membrane Overlay */}
      <div
        className={cn(
          "fixed inset-0 h-[100dvh] bg-background/95 backdrop-blur-3xl z-[105] lg:hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] px-10 flex flex-col pt-40 pb-16",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
      >
        <div className="flex flex-col gap-8 overflow-y-auto scrollbar-hide">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => { impact("light"); setIsOpen(false); }}
              style={{ transitionDelay: `${index * 50}ms` }}
              className={cn(
                "text-[clamp(2.5rem,10vw,4.5rem)] font-black uppercase italic tracking-tighter transition-all border-b border-white/5 pb-6",
                isStaff ? "text-amber-500/40 hover:text-amber-500" : "text-foreground hover:text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        <div className="mt-auto space-y-8">
          <div className="flex items-center gap-4 opacity-30 italic">
            <Shield className={cn("size-4 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">
              {isStaff ? "Universal_Oversight_Sync" : "Terminal_Handshake_Required"}
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className={cn(
              "w-full h-18 rounded-3xl font-black uppercase italic tracking-widest text-xs shadow-2xl active:scale-95 transition-all duration-500",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/40" : "bg-primary text-primary-foreground shadow-primary/40"
            )}
            onClick={() => { impact("heavy"); setIsOpen(false); }}
          >
            <Link href="/register" className="flex items-center justify-center gap-3">
              {isStaff ? "Access_Audit_Nodes" : "Start_Merchant_Node"} <ArrowRight className="size-6" />
            </Link>
          </Button>
        </div>

        {/* 🏛️ INSTITUTIONAL GRID WATERMARK */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px] z-[-1]" />
      </div>
    </nav>
  );
}