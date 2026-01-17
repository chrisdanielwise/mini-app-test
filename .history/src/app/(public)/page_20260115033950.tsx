"use client";

import * as React from "react";
import { useLayout } from "@/context/layout-provider";
import { useTelegramContext } from "@/components/providers/telegram-provider";
import { cn } from "@/lib/utils";

// --- REFACTORED INSTITUTIONAL STACK ---
import { Navbar } from "@/components/public/navbar";
import { Hero } from "@/components/public/hero";
// import { BentoInfrastructure } from "@/components/public/bento-infrastructure"; // 🛰️ MERGED UNIT
import { InfrastructureFAQ } from "@/components/public/faq";
import { Footer } from "@/components/public/footer";

/**
 * 🌊 ZIPHA_LIQUID_ASSEMBLY (v16.16.14)
 * Standard: v9.9.5 (Fluid Design), v16.16.12 (Institutional).
 * Refactor: Merged Telemetry & Features into BentoInfrastructure to eliminate redundancy.
 */
export default function LandingPage() {
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  return (
    <div className={cn(
      "flex flex-col min-h-screen bg-background text-foreground",
      "selection:bg-primary/20 overflow-x-hidden transition-colors duration-1000",
      isStaff && "selection:bg-amber-500/20"
    )}>
      <Navbar />
      
      <main className="flex-1 flex flex-col w-full max-w-[100vw]">
        {/* 1. HERO: THE ENTRY PROTOCOL */}
        {/* Fluid typography uses text-[clamp(2rem,8vw,7rem)] for liquid scaling */}
        <Hero />

        {/* 2. BENTO_INFRASTRUCTURE: MERGED TELEMETRY & SPECS */}
        {/* MERGE ALERT: Combined FeatureGrid + TrustWaveform into a unified Bento grid */}
        <BentoInfrastructure />

        {/* 3. SUPPORT & HANDSHAKE RULES */}
        <InfrastructureFAQ />
      </main>

      <Footer />

      {/* 🏛️ SUBSURFACE MESH: Fluid Grid Protocol */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[grid-white_32px] md:bg-[grid-white_48px] z-[-1]" />
    </div>
  );
}