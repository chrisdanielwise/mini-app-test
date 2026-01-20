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
 * 🛰️ LANDING_PAGE
 * Strategy: Document-Flow Verticality.
 * Fix: Eliminated all 'hidden' overflows and 'dvh' locking to allow natural scrolling.
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

  // 🛡️ PRE-HYDRATION SHIELD
  if (!isReady) return <div className="min-h-screen bg-black" />;

  const sectionSpacing = isMobile ? "py-12" : "py-20 md:py-32";
  const horizontalPadding = screenSize === 'xs' ? "px-6" : "px-8 md:px-12";

  return (
    <div 
      className={cn(
        "relative flex flex-col w-full bg-background text-foreground",
        "antialiased selection:bg-primary/20",
        isStaff && "selection:bg-amber-500/20"
      )}
    >
      {/* 🏎️ CONTENT_ENGINE
          🏁 THE FIX: Removed 'min-h-full' and 'overflow-hidden'.
          Setting 'display: block' and 'height: auto' allows the page to grow 
          vertically based on the total height of all sections combined.
      */}
      [Image of a web page structure showing the box model of a fixed header, scrollable body, and sticky footer]
      <main className="w-full h-auto relative z-10 block overflow-visible">
        
        {/* --- 🚀 HERO --- */}
        <section className="relative">
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
        <section id="pricing" className="relative z-10 bg-white/[0.005] border-y border-white/5">
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

      {/* 📐 GRID ANCHOR: Stays fixed in the background while content scrolls over it */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[url('/assets/grid.svg')] bg-center z-0" 
        style={{ backgroundSize: screenSize === 'xs' ? '32px' : '48px' }}
      />
    </div>
  );
}