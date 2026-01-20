"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

// 🧩 Refined Tactical Components (v2026.1.20)
import { Hero } from "@/components/public/hero";
import { TrustWaveform } from "@/components/public/trust-waveform";
import { FeatureGrid } from "@/components/public/feature-grid";
import { PricingSection } from "@/components/public/pricing-section"; 
import { InfrastructureFAQ } from "@/components/public/faq";

/**
 * 🛰️ LANDING_PAGE (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Stationary Horizon.
 * Fix: High-density py-8/12 spacing prevents visual blowout.
 */
export default function LandingPage() {
  const { flavor } = useLayout();
  const { isStaff: isStaffAuth } = useInstitutionalAuth();
  const { isReady, screenSize, isMobile } = useDeviceContext();

  const isStaff = flavor === "AMBER" || isStaffAuth;

  // 🔐 IDENTITY ANCHOR SYNC: Cross-tab recovery
  useEffect(() => {
    const authChannel = new BroadcastChannel("zipha_auth_sync");
    authChannel.onmessage = (event) => {
      if (event.data.action === "RELOAD_SESSION") window.location.reload(); 
    };
    return () => authChannel.close();
  }, []);

  if (!isReady) return <div className="min-h-screen bg-black animate-pulse" />;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Tactical vertical velocity for 2026 hardware tiers.
   */
  const sectionSpacing = isMobile ? "py-8" : "py-12 md:py-16";
  const horizontalPadding = screenSize === 'xs' ? "px-5" : "px-8 md:px-10";

  return (
    <div 
      className={cn(
        "flex flex-col w-full bg-background text-foreground transition-colors duration-700",
        "selection:bg-primary/20 antialiased leading-tight",
        isStaff && "selection:bg-amber-500/20"
      )}
    >
      <main className="flex-1 flex flex-col w-full relative z-10">
        
        {/* --- 🚀 HERO: KINETIC INGRESS --- */}
        <section className="animate-in fade-in duration-700">
          <Hero />
        </section>

        {/* --- 📊 TELEMETRY: SEAMLESS LOOP --- */}
        <div className="shrink-0 border-y border-white/5 bg-zinc-950/20">
          <TrustWaveform />
        </div>

        {/* --- 🛡️ HARDWARE SPECS: HIGH-DENSITY GRID --- */}
        <section className={cn("transition-all", horizontalPadding, sectionSpacing)}>
          <FeatureGrid />
        </section>

        {/* --- 💰 PRICING: THE SCALABILITY MATRIX --- */}
        <section className="bg-white/[0.005] border-y border-white/5 relative ">
          {/* Subsurface Radiance Bloom: Clinical Multiplier */}
          <div className={cn(
            "absolute inset-0 pointer-events-none opacity-[0.02] blur-[100px]",
            isStaff ? "bg-amber-500" : "bg-primary"
          )} />
          <div className={sectionSpacing}>
            <PricingSection />
          </div>
        </section>

        {/* --- 🔍 CLEARANCE LEVEL: HARDENED FAQ --- */}
        <div className={cn("transition-all", horizontalPadding, sectionSpacing)}>
          <InfrastructureFAQ />
        </div>
      </main>

      {/* 📐 STATIONARY GRID ANCHOR: The Tactical Horizon Anchor */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.01] bg-[url('/assets/grid.svg')] bg-center transition-opacity duration-1000 z-[-1]" 
        style={{ backgroundSize: screenSize === 'xs' ? '32px' : '48px' }}
      />
    </div>
  );
}