"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

// 🧩 Refined Tactical Components
import { Hero } from "@/components/public/hero";
import { TrustWaveform } from "@/components/public/trust-waveform";
import { FeatureGrid } from "@/components/public/feature-grid";
import { PricingSection } from "@/components/public/pricing-section"; 
import { InfrastructureFAQ } from "@/components/public/faq";

/**
 * 🛰️ LANDING_PAGE (Institutional Apex v2026.1.20)
 * Strategy: Content-Driven Verticality.
 * Fix: Removed 'flex-1' from main to prevent height-locking.
 */
export default function LandingPage() {
  const { flavor } = useLayout();
  const { isStaff: isStaffAuth } = useInstitutionalAuth();
  const { isReady, screenSize, isMobile } = useDeviceContext();

  const isStaff = flavor === "AMBER" || isStaffAuth;

  useEffect(() => {
    const authChannel = new BroadcastChannel("zipha_auth_sync");
    authChannel.onmessage = (event) => {
      if (event.data.action === "RELOAD_SESSION") window.location.reload(); 
    };
    return () => authChannel.close();
  }, []);

  if (!isReady) return <div className="min-h-screen bg-black animate-pulse" />;

  const sectionSpacing = isMobile ? "py-10" : "py-16 md:py-24";
  const horizontalPadding = screenSize === 'xs' ? "px-6" : "px-8 md:px-12";

  return (
    <div 
      className={cn(
        "relative flex flex-col w-full min-h-full bg-background text-foreground",
        "antialiased leading-tight selection:bg-primary/20",
        isStaff && "selection:bg-amber-500/20"
      )}
    >
      {/* ✅ FIX: Removed 'flex-1' and 'flex-col' from main. 
          Using 'h-auto' ensures the container grows with its sections.
      */}
      <main className="w-full h-auto relative z-10 block">
        
        {/* --- 🚀 HERO --- */}
        <section className="relative overflow-hidden">
          <Hero />
        </section>

        {/* --- 📊 TELEMETRY --- */}
        <div className="relative z-20 border-y border-white/5 bg-zinc-950/20">
          <TrustWaveform />
        </div>

        {/* --- 🛡️ SPECS --- */}
        <section className={cn("relative z-10", horizontalPadding, sectionSpacing)}>
          <FeatureGrid />
        </section>

        {/* --- 💰 PRICING --- */}
        <section className="relative z-10 bg-white/[0.005] border-y border-white/5 overflow-hidden">
          <div className={cn(
            "absolute inset-0 pointer-events-none opacity-[0.03] blur-[120px]",
            isStaff ? "bg-amber-500" : "bg-primary"
          )} />
          <div className={sectionSpacing}>
            <PricingSection />
          </div>
        </section>

        {/* --- 🔍 FAQ --- */}
        <section className={cn("relative z-10", horizontalPadding, sectionSpacing)}>
          <InfrastructureFAQ />
        </section>
      </main>

      {/* 📐 GRID ANCHOR: Ensure z-index is below main content */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[url('/assets/grid.svg')] bg-center z-0" 
        style={{ backgroundSize: screenSize === 'xs' ? '32px' : '48px' }}
      />
    </div>
  );
}