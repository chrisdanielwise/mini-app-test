"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Cpu, 
  Globe, 
  Terminal, 
  Twitter, 
  Github 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 TERMINAL_FOOTER (Institutional v16.16.14)
 * Logic: High-density site map with Live_System_Sync.
 * Refactor: Vertical compression & normalized link geometry (v9.9.5).
 */
export function Footer() {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";

  const FOOTER_LINKS = [
    {
      label: "Infrastructure",
      links: [
        { name: "Node_Status", href: "#" },
        { name: "Protocol_Specs", href: "#" },
        { name: "Geo_Zones", href: "#" },
      ],
    },
    {
      label: "Protocols",
      links: [
        { name: "Liquidity_Sync", href: "#" },
        { name: "Audit_Vault", href: "#" },
        { name: "API_Handshake", href: "#" },
      ],
    },
    {
      label: "Governance",
      links: [
        { name: "Legal_Manifest", href: "#" },
        { name: "Privacy_Mask", href: "#" },
        { name: "Terms_of_Service", href: "#" },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-white/5 bg-black/40 pt-[clamp(4rem,10vh,6rem)] pb-10 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-12 gap-x-8 mb-16 md:mb-20">
          
          {/* --- BRAND NODE: COMPRESSED --- */}
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <Link 
              href="/" 
              onClick={() => impact("light")}
              className="flex items-center gap-3 group"
            >
              <div className={cn(
                "size-9 rounded-xl flex items-center justify-center text-white shadow-2xl transition-all duration-500 group-hover:rotate-12",
                isStaff ? "bg-amber-500 shadow-amber-500/20" : "bg-primary shadow-primary/20"
              )}>
                {isStaff ? <Globe className="size-4.5" /> : <Cpu className="size-4.5" />}
              </div>
              <span className="text-xl font-black uppercase italic tracking-tighter text-foreground leading-none">
                Zipha<span className={isStaff ? "text-amber-500" : "text-primary"}>.</span>
              </span>
            </Link>
            <p className="max-w-[240px] text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 italic leading-relaxed">
              Institutional_Grade Telegram Monetization Infrastructure. Deploying Signal Clusters Since 2024.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Github].map((Icon, idx) => (
                <button key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all opacity-30 hover:opacity-80">
                  <Icon className="size-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* --- LINK CLUSTERS: NORMALIZED --- */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.label} className="space-y-5">
              <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground/30 italic">
                {section.label}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      onMouseEnter={() => impact("light")}
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

        {/* --- SYSTEM STATUS & COMPLIANCE --- */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="relative size-1.5">
                <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30" />
                <div className="relative size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              </div>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-500/80 italic">
                SYSTEM_LIVE_100%
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 opacity-15">
              <Terminal className="size-3" />
              <span className="text-[7px] font-black uppercase tracking-widest italic leading-none">v16.16.14_STABLE</span>
            </div>
          </div>

          <p className="text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/10 italic">
            © 2026 Zipha_Infrastructure // Authorized_By_Root
          </p>
        </div>
      </div>

      {/* 🏛️ SUBSURFACE GRID & TACTICAL RADIANCE */}
      <div className={cn(
        "absolute -bottom-20 -left-20 size-80 blur-[100px] opacity-5 pointer-events-none transition-colors duration-1000",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.01] bg-[grid-white_32px] md:bg-[grid-white_48px] z-[-1]" />
    </footer>
  );
}