"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Cpu, Globe, ShieldCheck, Twitter, Github, Terminal, Activity } from "lucide-react";
import { Navbar } from "@/components/public/navbar";
import { cn } from "@/lib/utils";
import { AuthSyncProvider } from "@/components/auth/auth-sync-provider";

/**
 * 🛰️ PUBLIC_TIER_LAYOUT (Institutional v16.16.12)
 * Architecture: High-density resilient grid wrapper.
 * Feature: Root-level AuthSync for frictionless guest-to-merchant transitions.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthSyncProvider>
      <div className="flex min-h-[100dvh] flex-col bg-background selection:bg-primary/20 antialiased overflow-x-hidden">
        
        {/* 📡 RESPONSIVE COMMAND NAVIGATION */}
        {/* Hydrated via Navbar component for mobile/desktop adaptive view */}
        <Navbar />

        {/* 🚀 PRIMARY INGRESS POINT */}
        <main className="flex-1 w-full relative">
          {/* Ambient Page Glow: Normalized for high-contrast visibility */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-primary/[0.02] blur-[100px] pointer-events-none -z-10" />
          
          <div className="animate-in fade-in duration-1000">
            {children}
          </div>
        </main>

        {/* 🏗️ INFRASTRUCTURE FOOTER: TACTICAL SCALE */}
        <footer className="relative border-t border-border/10 bg-muted/5 pt-12 md:pt-16 pb-10 overflow-hidden">
          
          {/* Background Watermark: v16.16.12 Institutional Seal */}
          <Terminal className="absolute -bottom-6 -left-6 h-32 w-32 opacity-[0.02] -rotate-12 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
              
              {/* Brand Cluster */}
              <div className="space-y-4 md:space-y-6">
                <Link href="/" className="flex items-center gap-2.5 group">
                  <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-all">
                    <Cpu className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-lg md:text-xl font-black uppercase italic tracking-tighter leading-none text-foreground">
                    Zipha<span className="text-primary">.</span>
                  </span>
                </Link>
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-relaxed max-w-[240px] opacity-50">
                  Architecting autonomous merchant infrastructure for the elite signal economy. 
                </p>
              </div>

              {/* Infrastructure Manifest */}
              <div className="space-y-4 md:space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground flex items-center gap-2 italic">
                  <Zap className="h-3 w-3 text-primary opacity-60" /> Infrastructure
                </h4>
                <ul className="space-y-3">
                  {[
                    { label: "Merchant Nodes", href: "#pricing" },
                    { label: "Global Clusters", href: "#infrastructure" },
                    { label: "Uptime Telemetry", href: "/status" }
                  ].map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center group">
                        <div className="h-px w-0 bg-primary mr-0 group-hover:w-2 group-hover:mr-1.5 transition-all" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Security Manifest */}
              <div className="space-y-4 md:space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground flex items-center gap-2 italic">
                  <ShieldCheck className="h-3 w-3 text-primary opacity-60" /> Protocols
                </h4>
                <ul className="space-y-3">
                  {[
                    { label: "Handshake Rules", href: "/terms" },
                    { label: "Data Encryption", href: "/privacy" },
                    { label: "Compliance Nodes", href: "/compliance" }
                  ].map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center group">
                         <div className="h-px w-0 bg-primary mr-0 group-hover:w-2 group-hover:mr-1.5 transition-all" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Handshake */}
              <div className="space-y-4 md:space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground italic">Connect</h4>
                <div className="flex gap-2">
                  {[Twitter, Github].map((Icon, i) => (
                    <Link key={i} href="#" className="h-9 w-9 rounded-lg border border-border/10 bg-card/40 flex items-center justify-center hover:border-primary/20 hover:bg-primary/5 transition-all group shadow-sm">
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
                <p className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.4em] italic">
                  Direct_Sync_Active
                </p>
              </div>
            </div>

            {/* Institutional Compliance Bar */}
            <div className="pt-8 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                 <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30 italic">
                   ZIPHA PROTOCOL © 2026 
                 </p>
                 <div className="h-1 w-1 rounded-full bg-border/20 hidden sm:block" />
                 <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30 italic">
                   V2.26_STABLE
                 </p>
              </div>
              
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 shadow-inner">
                <Activity className="h-3 w-3 text-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">
                  Network Synchronized
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AuthSyncProvider>
  );
}