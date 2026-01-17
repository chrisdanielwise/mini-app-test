"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
// import { useInstitutionalAuth } from "@/hooks/use-institutional-auth";

// 🧩 Refined Tactical Components (Now Device-Aware)
import { Navbar } from "@/components/public/navbar";
import { Hero } from "@/components/public/hero";
import { TrustWaveform } from "@/components/public/trust-waveform";
import { FeatureGrid } from "@/components/public/feature-grid";
import { PricingSection } from "@/components/public/pricing-section"; 
import { InfrastructureFAQ } from "@/components/public/faq";
import { Footer } from "@/components/public/footer";

/**
 * 🌊 ZIPHA_TACTICAL_INGRESS (Institutional Apex v16.16.30)
 * Priority: Full DeviceState Integration (xs -> xxl, safeArea, isPortrait).
 * Design: High-Density Telemetry with Hardware-Fluid Radiance.
 */
export default function LandingPage() {
  const { flavor } = useLayout();
  const { isStaff: isStaffAuth } = useInstitutionalAuth(); //
  
  // 🛰️ DEVICE PHYSICS: Consuming full morphology spectrum
  const { 
    isReady, 
    screenSize, 
    viewportHeight, 
    isMobile, 
    safeArea 
  } = useDeviceContext(); //

  const isStaff = flavor === "AMBER" || isStaffAuth;

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

  // 🛡️ HYDRATION GUARD: Stabilize hardware context before mounting
  if (!isReady) return null;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating tactical vertical compression for 2026 hardware.
   */
  const sectionSpacing = isMobile ? "py-12" : "py-[clamp(4rem,12vh,8rem)]";
  const horizontalPadding = screenSize === 'xs' ? "px-5" : "px-[clamp(1.5rem,5vw,4rem)]";

  return (
    <div 
      className={cn(
        "flex flex-col w-full bg-background text-foreground transition-colors duration-1000",
        "selection:bg-primary/20 overflow-x-hidden antialiased",
        isStaff && "selection:bg-amber-500/20"
      )}
      style={{ minHeight: `calc(var(--vh, 1vh) * 100)` }}
    >
      {/* 1. FLUID GLOBAL NAVIGATION: Hardware-aware membrane */}
      <Navbar /> //
      
      <main className="flex-1 flex flex-col w-full">
        
        {/* 2. HERO: KINETIC INGRESS */}
        <div className={cn("transition-all duration-1000", sectionSpacing)}>
          <Hero /> //
        </div>

        {/* 3. TELEMETRY: SEAMLESS LOOP */}
        <TrustWaveform /> //

        {/* 4. HARDWARE SPECS: HIGH-DENSITY GRID */}
        <section className={cn("transition-all duration-1000", horizontalPadding, sectionSpacing)}>
          <FeatureGrid /> //
        </section>

        {/* 5. PRICING: THE SCALABILITY MATRIX */}
        <section className="bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
          {/* Subsurface Radiance Bloom */}
          <div className={cn(
            "absolute inset-0 pointer-events-none opacity-5 blur-[120px]",
            isStaff ? "bg-amber-500" : "bg-primary"
          )} />
          <PricingSection /> //
        </section>

        {/* 6. CLEARANCE LEVEL: HARDENED FAQ */}
        <div className={cn("transition-all duration-1000", sectionSpacing)}>
          <InfrastructureFAQ /> //
        </div>
      </main>

      {/* 7. TERMINAL FOOTER: Safe-area anchored */}
      <Footer /> //
      
      {/* 🏛️ SUBSURFACE MESH: Identity grid for 2026 aesthetics */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('/assets/grid.svg')] bg-center transition-opacity duration-1000 z-[-1]" 
        style={{ backgroundSize: screenSize === 'xs' ? '32px' : '48px' }}
      />
    </div>
  );
}