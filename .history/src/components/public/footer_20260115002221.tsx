"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Cpu, 
  Globe, 
  Activity, 
  ShieldCheck, 
  Terminal, 
  Zap, 
  Twitter, 
  Github 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 TERMINAL_FOOTER (Institutional v16.16.12)
 * Logic: High-density site map with Live_System_Sync.
 * Design: v9.9.2 Hyper-Glass with Hardware Morphology.
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
    <footer className="relative border-t border-white/5 bg-black/40 pt-24 pb-12 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-24">
          
          {/* --- BRAND NODE --- */}
          <div className="col-span-2 lg:col-span-2 space-y-8">
            <Link 
              href="/" 
              onClick={() => impact("light")}
              className="flex items-center gap-4 group"
            >
              <div className={cn(
                "size-10 rounded-xl flex items-center justify-center text-white shadow-2xl transition-all duration-700 group-hover:rotate-12",
                isStaff ? "bg-amber-500 shadow-amber-500/20" : "bg-primary shadow-primary/20"
              )}>
                {isStaff ? <Globe className="size-5" /> : <Cpu className="size-5" />}
              </div>
              <span className="text-2xl font-black uppercase italic tracking-tighter text-foreground">
                Zipha<span className={isStaff ? "text-amber-500" : "text-primary"}>.</span>
              </span>
            </Link>
            <p className="max-w-xs text-[11px] font-bold uppercase tracking-widest text-muted-foreground/40 italic leading-relaxed">
              Institutional_Grade Telegram Monetization Infrastructure. Deploying Signal Clusters Since 2024.
            </p>
            <div className="flex items-center gap-4">
              <button className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all opacity-40 hover:opacity-100">
                <Twitter className="size-4" />
              </button>
              <button className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all opacity-40 hover:opacity-100">
                <Github className="size-4" />
              </button>
            </div>
          </div>

          {/* --- LINK CLUSTERS --- */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.label} className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 italic">
                {section.label}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      onMouseEnter={() => impact("light")}
                      className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-colors italic"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* --- SYSTEM STATUS & LEGAL --- */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="relative size-2">
                <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-40" />
                <div className="relative size-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 italic">
                SYSTEM_LIVE_100%
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2 opacity-20">
              <Terminal className="size-3" />
              <span className="text-[8px] font-black uppercase tracking-widest italic">Node_Sync: v16.16.12_STABLE</span>
            </div>
          </div>

          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic">
            © 2026 Zipha_Infrastructure // Authorized_By_Root
          </p>
        </div>
      </div>

      {/* 🏛️ BACKGROUND GRID & RADIANCE */}
      <div className="absolute -bottom-24 -left-24 size-96 bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.01] bg-[grid-white_40px] z-[-1]" />
    </footer>
  );
}