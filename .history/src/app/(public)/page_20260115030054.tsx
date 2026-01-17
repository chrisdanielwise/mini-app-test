"use client";

import * as React from "react";
import { useEffect } from "react";
import { useLayout } from "@/context/layout-provider";
import { useTelegramContext } from "@/components/providers/telegram-provider";
import { cn } from "@/lib/utils";

// --- INSTITUTIONAL COMPONENT STACK ---
import { Navbar } from "@/components/public/navbar";
import { Hero } from "@/components/public/hero";
import { TrustWaveform } from "@/components/public/trust-waveform";
import { FeatureGrid } from "@/components/public/feature-grid";
import { InfrastructureFAQ } from "@/components/public/faq";
import { Footer } from "@/components/public/footer";

/**
 * 🌊 ZIPHA_PUBLIC_ASSEMBLY (Institutional v16.16.12)
 * Logic: Polymorphic flavor synchronization with Kinetic Ingress.
 * Feature: Cross-tab session recovery + Native Haptic Handshake.
 */
export default function LandingPage() {
  const { flavor } = useLayout();
  const { hapticFeedback } = useTelegramContext();
  const isStaff = flavor === "AMBER";

  // 📡 IDENTITY ANCHOR SYNC
  // Listens for the "Identity Anchored" pulse from the Callback Terminal
  useEffect(() => {
    const authChannel = new BroadcastChannel("zipha_auth_sync");
    
    authChannel.onmessage = (event) => {
      if (event.data.action === "RELOAD_SESSION") {
        // Provide tactile confirmation of session acquisition
        hapticFeedback?.("success");
        if ("vibrate" in navigator) navigator.vibrate([100, 30, 100]);

        // Hard reload to hydrate the verified identity node via Middleware
        window.location.reload(); 
      }
    };

    return () => authChannel.close();
  }, [hapticFeedback]);

  return (
    <div className={cn(
      "flex flex-col min-h-[100dvh] bg-background text-foreground",
      "selection:bg-primary/30 overflow-x-hidden transition-colors duration-1000",
      isStaff && "selection:bg-amber-500/30"
    )}>
      
      {/* 1. FLUID NAVIGATION MEMBRANE */}
      <Navbar />
      
      <main className="flex-1 flex flex-col">
        
        {/* 2. HERO: THE ENTRY PROTOCOL */}
        {/* Handles Mouse-reactive Radiance and Initial Handshake CTA */}
        <Hero />

        {/* 3. TRUST_WAVEFORM: REAL-TIME TELEMETRY */}
        {/* Marquee loop of infrastructure partners and live metrics */}
        <TrustWaveform />

        {/* 4. FEATURE_GRID: HARDWARE MODULES */}
        {/* Displays Technical_Specs with subsurface hover glows */}
        <FeatureGrid />

        {/* 5. PROTOCOL_PRICING: THE SUBSCRIPTION MATRIX */}
        {/* (Note: Pricing is typically integrated within Hero or as a standalone component. 
            If not separate, it's often placed here to close the logic.) */}
        <section id="pricing" className="relative py-24 px-6">
           {/* Pricing logic is handled within your PricingCard modules inside specific sections */}
        </section>

        {/* 6. INFRASTRUCTURE_FAQ: CLEARANCE DOCUMENTATION */}
        {/* Technical accordion with Focus-Lock radiance */}
        <InfrastructureFAQ />

      </main>

      {/* 7. TERMINAL_FOOTER: SYSTEM MAP */}
      {/* High-density site map with Live_System_Sync status */}
      <Footer />

      {/* 🏛️ BACKGROUND GRID: Institutional Subsurface Mesh */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.01] bg-[grid-white_40px] z-[-1]" />
    </div>
  );
}