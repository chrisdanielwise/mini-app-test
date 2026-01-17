"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Twitter, 
  Github, 
  Terminal, 
  Activity 
} from "lucide-react";
import { Navbar } from "@/components/public/navbar";
import { cn } from "@/lib/utils";

/**
 * 🌊 PUBLIC_TIER_LAYOUT (Institutional v16.16.14)
 * Logic: Fluid-motion assembly with vertical compression.
 * Standard: v9.9.5 Liquid Scaling + v16.16.12 Institutional.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background text-foreground selection:bg-primary/20 antialiased overflow-x-hidden relative">
      
      {/* 🔮 LIQUID AMBIANCE: The Subsurface Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[60vh] bg-primary/[0.03] blur-[120px] pointer-events-none -z-10" />

      {/* 📡 RESPONSIVE COMMAND NAVIGATION */}
      <Navbar />

      {/* 🚀 PRIMARY INGRESS POINT: LIQUID FLOW */}
      <main className="flex-1 w-full relative z-10 animate-in fade-in duration-1000">
        {children}
      </main>

      {/* 🏗️ INFRASTRUCTURE FOOTER: COMPRESSED TACTICAL */}
      <footer className="relative border-t border-white/5 bg-black/40 pt-[clamp(3rem,8vh,6rem)] pb-10 overflow-hidden">
        
        {/* Hardware Watermark: Normalized Scale */}
        <Terminal className="absolute -bottom-10 -left-10 h-48 w-48 opacity-[0.015] -rotate-12 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 mb-16">
            
            {/* BRAND CLUSTER: COMPRESSED */}
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:rotate-6 transition-all duration-500">
                  <Cpu className="size-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-black uppercase italic tracking-tighter leading-none">
                  Zipha<span className="text-primary">.</span>
                </span>
              </Link>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 leading-relaxed max-w-[220px] italic">
                Architecting autonomous merchant infrastructure for the elite signal economy. 
              </p>
            </div>

            {/* INFRASTRUCTURE: NORMALIZED LISTS */}
            <FooterList 
              title="Infrastructure" 
              icon={<Zap className="size-3 text-primary/60" />}
              links={[
                { label: "Merchant Nodes", href: "#pricing" },
                { label: "Global Clusters", href: "#infrastructure" },
                { label: "Uptime Telemetry", href: "/status" }
              ]}
            />

            {/* PROTOCOLS: NORMALIZED LISTS */}
            <FooterList 
              title="Protocols" 
              icon={<ShieldCheck className="size-3 text-primary/60" />}
              links={[
                { label: "Handshake Rules", href: "/terms" },
                { label: "Data Encryption", href: "/privacy" },
                { label: "Compliance Nodes", href: "/compliance" }
              ]}
            />

            {/* SOCIAL HANDSHAKE: COMPACT GEOMETRY */}
            <div className="space-y-6">
              <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground/30 italic">Connect</h4>
              <div className="flex gap-2.5">
                {[Twitter, Github].map((Icon, i) => (
                  <Link key={i} href="#" className="size-9 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center hover:border-primary/20 hover:bg-primary/5 transition-all group">
                    <Icon className="size-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
              <p className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] italic">
                Direct_Sync_Active
              </p>
            </div>
          </div>

          {/* COMPLIANCE STATUS BAR: NORMALISED */}
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
               <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/10 italic">
                 ZIPHA PROTOCOL © 2026 
               </p>
               <div className="size-1 rounded-full bg-white/5 hidden sm:block" />
               <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/10 italic">
                 V16.16.14_STABLE
               </p>
            </div>
            
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <Activity className="size-3 text-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500/80">
                Network Synchronized
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* 🏛️ SUBSURFACE GRID: Fluid Design Protocol */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.01] bg-[grid-white_32px] md:bg-[grid-white_48px] z-[-1]" />
    </div>
  );
}

/** 🛠️ HELPER: TACTICAL FOOTER LISTS */
function FooterList({ title, icon, links }: { title: string, icon: React.ReactNode, links: { label: string, href: string }[] }) {
  return (
    <div className="space-y-6">
      <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground/30 flex items-center gap-2 italic">
        {icon} {title}
      </h4>
      <ul className="space-y-3.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30 hover:text-primary transition-colors flex items-center group">
              <div className="h-px w-0 bg-primary mr-0 group-hover:w-2 group-hover:mr-1.5 transition-all duration-500" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}