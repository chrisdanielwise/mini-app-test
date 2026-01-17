"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Cpu, ArrowRight, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID_GLOBAL_NAVIGATION (Institutional v16.16.14)
 * Logic: Hyper-Glass scroll protocol with role-aware membrane.
 * Refactor: Vertical compression & branding normalization (v9.9.5).
 */
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";

  // 🌊 SCROLL PROTOCOL: Compressed recalibration
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
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-out px-6 md:px-10",
        scrolled 
          ? "h-16 md:h-20 bg-background/60 backdrop-blur-2xl border-b border-white/5 shadow-2xl" 
          : "h-20 md:h-24 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-between">
        
        {/* LOGO NODE: BRANDING NORMALIZATION */}
        <Link 
          href="/" 
          onClick={() => impact("light")}
          className="flex items-center gap-3 group z-[110]"
        >
          <div className={cn(
            "size-9 md:size-10 rounded-xl flex items-center justify-center text-white shadow-2xl transition-all duration-500 group-hover:rotate-6",
            isStaff ? "bg-amber-500 shadow-amber-500/20" : "bg-primary shadow-primary/20"
          )}>
            {isStaff ? <Globe className="size-5" /> : <Cpu className="size-5" />}
          </div>
          <span className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none text-foreground">
            Zipha<span className={isStaff ? "text-amber-500" : "text-primary"}>.</span>
          </span>
        </Link>

        {/* DESKTOP PROTOCOL: TACTICAL NAVIGATION */}
        <div className="hidden lg:flex items-center gap-10 xl:gap-14">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onMouseEnter={() => impact("light")}
              className={cn(
                "text-[9px] xl:text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 italic",
                isStaff 
                  ? "text-amber-500/40 hover:text-amber-500" 
                  : "text-muted-foreground/40 hover:text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          <Button
            asChild
            onClick={() => impact("medium")}
            className={cn(
              "rounded-xl h-11 px-8 font-black uppercase italic tracking-[0.2em] text-[10px] shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-95",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-primary text-primary-foreground shadow-primary/20"
            )}
          >
            <Link href="/register">
              {isStaff ? "Global_Oversight" : "Deploy_Node"}
            </Link>
          </Button>
        </div>

        {/* MOBILE TRIGGER: TACTICAL INTERFACE */}
        <button
          onClick={() => { impact("medium"); setIsOpen(!isOpen); }}
          className={cn(
            "lg:hidden size-11 z-[110] flex items-center justify-center rounded-xl border transition-all duration-500 shadow-2xl active:scale-90",
            isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-white/5 border-white/5 text-foreground"
          )}
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* MOBILE DRAWER: LIQUID OVERLAY */}
      <div
        className={cn(
          "fixed inset-0 h-[100dvh] bg-background/98 backdrop-blur-3xl z-[105] lg:hidden transition-all duration-500 ease-in-out px-10 flex flex-col pt-32 pb-12",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
      >
        <div className="flex flex-col gap-6">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => { impact("light"); setIsOpen(false); }}
              style={{ transitionDelay: `${index * 40}ms` }}
              className={cn(
                "text-[clamp(2rem,8vw,3.5rem)] font-black uppercase italic tracking-tighter transition-all border-b border-white/5 pb-4",
                isStaff ? "text-amber-500/40 hover:text-amber-500" : "text-foreground hover:text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        <div className="mt-auto space-y-6">
          <div className="flex items-center gap-3 opacity-20 italic">
            <Shield className={cn("size-3.5", isStaff ? "text-amber-500" : "text-primary")} />
            <p className="text-[9px] font-black uppercase tracking-[0.4em]">
              {isStaff ? "Universal_Sync" : "Identity_Required"}
            </p>
          </div>
          <Button
            asChild
            className={cn(
              "w-full h-16 rounded-2xl font-black uppercase italic tracking-widest text-xs shadow-2xl active:scale-95 transition-all duration-500",
              isStaff ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground"
            )}
            onClick={() => { impact("heavy"); setIsOpen(false); }}
          >
            <Link href="/register" className="flex items-center justify-center gap-2">
              {isStaff ? "Audit_Terminal" : "Start_Node"} <ArrowRight className="size-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* 🏛️ SUBSURFACE GRID WATERMARK */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.01] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px] z-[-1]" />
    </nav>
  );
}