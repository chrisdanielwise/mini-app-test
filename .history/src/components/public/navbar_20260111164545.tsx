"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Cpu, ArrowRight, Zap, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { useLayout } from "@/context/layout-provider";

/**
 * 🛰️ GLOBAL NAVIGATION PROTOCOL
 * Logic: Synchronized with Universal Identity.
 * Optimized: Kinetic mobile drawer and institutional haptics for command parity.
 */
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  // Scroll Protocol: Real-time UI recalibration based on vertical offset
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync scroll lock when drawer is active
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  const navLinks = [
    { name: "Infrastructure", href: "#infrastructure" },
    { name: "Protocols", href: "#pricing" },
    { name: isStaff ? "Admin_Terminal" : "Merchant Hub", href: "/dashboard" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 md:px-8",
        scrolled 
          ? "h-16 md:h-18 bg-background/80 backdrop-blur-xl border-b border-border/10 flex items-center" 
          : "h-20 md:h-24 bg-transparent flex items-center"
      )}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        
        {/* LOGO NODE: Institutional Branding */}
        <Link 
          href="/" 
          onClick={() => hapticFeedback("light")}
          className="flex items-center gap-2 md:gap-3 group z-[110]"
        >
          <div className={cn(
            "h-8 w-8 md:h-9 md:w-9 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-500 active:scale-90",
            isStaff ? "bg-amber-500 shadow-amber-500/20" : "bg-primary shadow-primary/20"
          )}>
            {isStaff ? <Globe className="h-5 w-5" /> : <Cpu className="h-5 w-5" />}
          </div>
          <span className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none truncate text-foreground">
            Zipha<span className={isStaff ? "text-amber-500" : "text-primary"}>.</span>
          </span>
        </Link>

        {/* DESKTOP PROTOCOL: Hidden on Mobile Nodes */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-[9px] xl:text-[10px] font-black uppercase tracking-[0.25em] xl:tracking-[0.4em] transition-colors whitespace-nowrap italic",
                isStaff ? "text-amber-500/60 hover:text-amber-500" : "text-muted-foreground hover:text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Button
            asChild
            onClick={() => hapticFeedback("medium")}
            className={cn(
              "rounded-full h-11 px-8 font-black uppercase italic tracking-widest text-[10px] shadow-2xl hover:scale-[1.03] active:scale-95 transition-all",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-primary text-primary-foreground shadow-primary/20"
            )}
          >
            <Link href="/register">{isStaff ? "Oversight Terminal" : "Initialize Node"}</Link>
          </Button>
        </div>

        {/* MOBILE TRIGGER */}
        <button
          onClick={() => {
            hapticFeedback("light");
            setIsOpen(!isOpen);
          }}
          className={cn(
            "lg:hidden h-10 w-10 md:h-12 md:w-12 z-[110] flex items-center justify-center rounded-xl border transition-all shadow-xl active:scale-90",
            isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-card/80 border-border/20 text-foreground"
          )}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* MOBILE DRAWER: Kinetic Tier 1 Overlay */}
      <div
        className={cn(
          "fixed inset-0 top-0 h-[100dvh] bg-background/98 backdrop-blur-3xl z-[105] lg:hidden transition-all duration-500 ease-in-out px-8 flex flex-col pt-32 pb-12",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
      >
        <div className="flex flex-col gap-6 md:gap-8 overflow-y-auto scrollbar-hide">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => {
                hapticFeedback("light");
                setIsOpen(false);
              }}
              className={cn(
                "text-[clamp(2rem,8vw,4rem)] font-black uppercase italic tracking-tighter transition-all border-b border-border/10 pb-4 md:pb-6",
                isStaff ? "text-amber-500/80 hover:text-amber-500" : "text-foreground hover:text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        <div className="mt-auto space-y-6">
          <div className="flex items-center gap-2 opacity-40 italic">
            <Shield className={cn("h-3 w-3 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground">
              {isStaff ? "Universal_Oversight_Active" : "Node Clearance Required"}
            </p>
          </div>
          <Button
            asChild
            className={cn(
              "w-full h-16 rounded-2xl font-black uppercase italic tracking-widest text-xs shadow-2xl active:scale-95",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-primary text-primary-foreground shadow-primary/20"
            )}
            onClick={() => {
              hapticFeedback("medium");
              setIsOpen(false);
            }}
          >
            <Link href="/register">
              {isStaff ? "Access Global Audit" : "Start Merchant Node"} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:30px_30px] z-[-1]" />
      </div>
    </nav>
  );
}