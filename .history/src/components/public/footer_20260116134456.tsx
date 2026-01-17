"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Cpu, 
  Globe, 
  Terminal, 
  Twitter, 
  Github,
  Activity,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🛰️ TERMINAL_FOOTER (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density rows (py-2.5) and stationary HUD profile prevents blowout.
 */
export function Footer() {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { screenSize, isMobile, isTablet, isDesktop, isPortrait, safeArea, isReady } = useDeviceContext();
  const isStaff = flavor === "AMBER";

  const FOOTER_LINKS = [
    {
      label: "Infra",
      links: [
        { name: "Node_Status", href: "#" },
        { name: "Geo_Zones", href: "#" },
      ],
    },
    {
      label: "Protocols",
      links: [
        { name: "Audit_Vault", href: "#" },
        { name: "API_Handshake", href: "#" },
      ],
    },
    {
      label: "Compliance",
      links: [
        { name: "Legal_Manifest", href: "#" },
        { name: "Terms_of_Service", href: "#" },
      ],
    },
  ];

  if (!isReady) return <footer className="h-40 bg-white/[0.02] animate-pulse rounded-t-2xl" />;

  const gridLayout = (isDesktop || (isTablet && !isPortrait)) 
    ? "grid-cols-5 gap-8" 
    : "grid-cols-2 gap-y-10 gap-x-6";
  
  const footerPaddingBottom = `calc(${safeArea.bottom}px + 1.25rem)`;

  return (
    <footer 
      className="relative border-t border-white/5 bg-zinc-950/40 pt-12 px-6 overflow-hidden transition-all duration-700"
      style={{ paddingBottom: footerPaddingBottom }}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className={cn("grid mb-12", gridLayout)}>
          
          {/* --- BRAND NODE --- */}
          <div className="col-span-2 space-y-6">
            <Link 
              href="/" 
              onClick={() => impact("light")}
              className="flex items-center gap-3 group"
            >
              <div className={cn(
                "size-9 rounded-lg flex items-center justify-center transition-all",
                isStaff ? "bg-amber-500 text-black shadow-lg shadow-amber-500/10" : "bg-primary text-white shadow-lg shadow-primary/10"
              )}>
                {isStaff ? <Globe className="size-4.5" /> : <Cpu className="size-4.5" />}
              </div>
              <span className="text-xl font-black uppercase italic tracking-tighter text-foreground leading-none">
                Zipha<span className={isStaff ? "text-amber-500" : "text-primary"}>.</span>
              </span>
            </Link>
            
            <p className="max-w-[240px] text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 italic leading-tight">
              Institutional_Grade Monetization. v16.31_STABLE.
            </p>

            <div className="flex items-center gap-3">
              {[Twitter, Github].map((Icon, idx) => (
                <button 
                  key={idx} 
                  onClick={() => impact("light")}
                  className="size-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center opacity-20 hover:opacity-100 transition-all"
                >
                  <Icon className="size-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* --- LINK CLUSTERS --- */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.label} className="space-y-4">
              <h4 className="text-[7.5px] font-black uppercase tracking-[0.3em] text-foreground/10 italic">
                {section.label}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 hover:text-primary transition-colors italic inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* --- SYSTEM TELEMETRY --- */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 relative">
          <div className="flex items-center gap-6 flex-wrap justify-center leading-none">
            <div className="flex items-center gap-2">
              <div className="relative size-1.5">
                <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
                <div className="relative size-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[7.5px] font-black uppercase tracking-[0.2em] text-emerald-500/60 italic">
                SIGNAL_OK
              </span>
            </div>
            
            <div className="flex items-center gap-3 opacity-10">
              <Activity className="size-3" />
              <Terminal className="size-3" />
              <span className="text-[7px] font-mono uppercase tracking-widest">
                v16.31_APEX
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1.5 leading-none">
            <p className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground/10 italic">
              © 2026 ZIPHA_INFRASTRUCTURE
            </p>
            <ShieldCheck className="size-3 opacity-5" />
          </div>
        </div>
      </div>

      {/* 🏛️ STATIONARY GRID ANCHOR */}
      <div className="absolute inset-0 pointer-events-none z-[-1] opacity-[0.01] bg-[url('/assets/grid.svg')] bg-center" />
    </footer>
  );
}