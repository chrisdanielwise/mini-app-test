"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/public/navbar";
import { Hero } from "@/components/public/hero";
import { TrustWaveform } from "@/components/public/trust-waveform";
import { FeatureGrid } from "@/components/public/feature-grid";
import { PricingSection } from "@/components/public/pricing-section"; 
import { InfrastructureFAQ } from "@/components/public/faq";
import { Footer } from "@/components/public/footer";
import { useTelegramContext } from "@/components/providers/telegram-provider";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";

/**
 * 🌊 ZIPHA_TACTICAL_INGRESS (v16.16.14)
 * Standard: v9.9.5 (Fluid Design), v16.16.12 (Institutional).
 * Design: Tactical Minimalism with Vertical Compression.
 */
export default function LandingPage() {
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  // 🔐 IDENTITY ANCHOR SYNC: Cross-tab session recovery
  useEffect(() => {
    const authChannel = new BroadcastChannel("zipha_auth_sync");
    authChannel.onmessage = (event) => {
      if (event.data.action === "RELOAD_SESSION") {
        window.location.reload(); 
      }
    };
    return () => authChannel.close();
  }, []);

  return (
    <div className={cn(
      "flex flex-col min-h-[100dvh] bg-background text-foreground",
      "selection:bg-primary/20 overflow-x-hidden antialiased",
      isStaff && "selection:bg-amber-500/20"
    )}>
      {/* 1. FLUID GLOBAL NAVIGATION */}
      <Navbar />
      
      <main className="flex-1 flex flex-col w-full">
        {/* 2. HERO: KINETIC TYPOGRAPHY */}
        {/* We use py-[clamp(4rem,10vh,8rem)] for tactical vertical spacing */}
        <div className="py-[clamp(2rem,5vh,4rem)]">
          <Hero />
        </div>

        {/* 3. TELEMETRY: SEAMLESS LOOP */}
        <TrustWaveform />

        {/* 4. HARDWARE SPECS: HIGH-DENSITY GRID */}
        {/* Normalized padding ensures it's not 'too big' on desktop */}
        <section className="px-[clamp(1rem,5vw,4rem)] py-[clamp(4rem,12vh,8rem)]">
          <FeatureGrid />
        </section>

        {/* 5. PRICING: THE SCALABILITY MATRIX */}
        <section className="bg-white/[0.01] border-y border-white/5">
          <PricingSection />
        </section>

        {/* 6. CLEARANCE LEVEL: HARDENED FAQ */}
        <div className="py-[clamp(4rem,12vh,8rem)]">
          <InfrastructureFAQ />
        </div>
      </main>

      {/* 7. TERMINAL FOOTER */}
      <Footer />
      
      {/* 🏛️ SUBSURFACE MESH: Identity grid for 2026 aesthetics */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[grid-white_32px] md:bg-[grid-white_48px] z-[-1]" />
    </div>
  );
}