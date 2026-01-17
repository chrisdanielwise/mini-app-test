"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/public/navbar";
import { Hero } from "@/components/public/hero";
import { TrustWaveform } from "@/components/public/trust-waveform";
import { FeatureGrid } from "@/components/public/feature-grid";
import { PricingSection } from "@/components/public/pricing-section"; // 🏗️ YOUR DESIGNS
import { InfrastructureFAQ } from "@/components/public/faq";
import { Footer } from "@/components/public/footer";
import { useTelegramContext } from "@/components/providers/telegram-provider";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";

export default function LandingPage() {
  const { flavor } = useLayout();
  const { webApp } = useTelegramContext();
  const isStaff = flavor === "AMBER";

  // 🔐 YOUR AUTH SYNC PROTOCOL
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
      "flex flex-col min-h-[100dvh] bg-background text-foreground selection:bg-primary/20 overflow-x-hidden",
      isStaff && "selection:bg-amber-500/20"
    )}>
      <Navbar />
      
      <main className="flex-1 flex flex-col w-full">
        {/* DESIGN 1: THE ENTRY PROTOCOL */}
        <Hero />

        {/* DESIGN 2: TELEMETRY & WAVEFORM */}
        <TrustWaveform />

        {/* DESIGN 3: HARDWARE SPECS */}
        <FeatureGrid />

        {/* DESIGN 4: THE PRICING MATRIX (Your v9.5.0 extraction) */}
        <PricingSection />

        {/* DESIGN 5: CLEARANCE LEVEL FAQ */}
        <InfrastructureFAQ />
      </main>

      <Footer />
      
      {/* 🏛️ SUBSURFACE MESH */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[grid-white_40px] z-[-1]" />
    </div>
  );
}