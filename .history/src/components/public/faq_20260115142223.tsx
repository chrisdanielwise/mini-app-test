"use client";

import * as React from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { HelpCircle, Terminal, ShieldCheck, Zap, Waves, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

const FAQS = [
  {
    id: "setup",
    question: "How_long_is_node_provisioning?",
    answer: "Initial cluster initialization takes < 60 seconds. Once the handshake is established with the Telegram API, your signal broadcast nodes are globally active.",
    icon: Zap
  },
  {
    id: "security",
    question: "What_encryption_standard_is_used?",
    answer: "We utilize AES-256-GCM for all signal data. Merchant keys are stored in hardware security modules (HSM) with zero-knowledge architecture.",
    icon: ShieldCheck
  },
  {
    id: "payouts",
    question: "Liquidity_Settlement_Protocols?",
    answer: "Payouts are processed via TRC20 or ERC20. Standard epoch settlement is instant upon verification of the threshold liquidity.",
    icon: Terminal
  }
];

/**
 * 🌊 INFRASTRUCTURE_PROTOCOL (Institutional Apex v16.16.29)
 * Priority: Full DeviceState Integration (xs -> xxl, safeArea).
 * Logic: morphology-aware knowledge mesh with focus-lock haptics.
 */
export function InfrastructureFAQ() {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Consuming full morphology physics
  const { 
    screenSize, 
    isMobile, 
    isTablet, 
    isDesktop, 
    isPortrait, 
    viewportWidth,
    isReady 
  } = useDeviceContext();

  const isStaff = flavor === "AMBER";

  // 🛡️ HYDRATION GUARD
  if (!isReady) return (
    <section className="py-20 px-6 animate-pulse opacity-20">
      <div className="h-96 rounded-[3rem] bg-card/20 max-w-3xl mx-auto" />
    </section>
  );

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating layout gravity based on the 6-tier system.
   */
  const sectionPadding = screenSize === 'xs' ? "py-12 px-5" : "py-[clamp(4rem,12vh,10rem)] px-6";
  const accordionPadding = screenSize === 'xs' ? "px-5" : "px-8 md:px-10";

  return (
    <section className={cn("relative overflow-hidden transition-all duration-1000", sectionPadding)}>
      
      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* --- SECTION HEADER: MORPHOLOGY SCALING --- */}
        <div className="text-center mb-10 md:mb-20 space-y-4">
          <div className="flex items-center justify-center gap-3">
             <Activity className={cn("size-3.5", isStaff ? "text-amber-500" : "text-primary")} />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">
               Clearance_Level_Support
             </span>
          </div>
          <h2 className={cn(
            "font-black uppercase italic tracking-tighter leading-none text-foreground",
            screenSize === 'xs' ? "text-4xl" : "text-5xl md:text-7xl"
          )}>
            Infrastructure <span className={isStaff ? "text-amber-500" : "text-primary"}>Protocol.</span>
          </h2>
        </div>

        {/* --- HARDENED KNOWLEDGE MESH --- */}
        <Accordion type="single" collapsible className="space-y-4">
          {FAQS.map((faq) => (
            <AccordionItem 
              key={faq.id} 
              value={faq.id}
              className={cn(
                "group rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden",
                "bg-white/[0.01] border-white/5 data-[state=open]:bg-white/[0.03] data-[state=open]:border-white/10",
                accordionPadding,
                isStaff 
                  ? "data-[state=open]:shadow-[0_0_60px_rgba(245,158,11,0.05)]" 
                  : "data-[state=open]:shadow-apex"
              )}
            >
              <AccordionTrigger 
                onClick={() => { selectionChange(); impact("light"); }}
                className="py-6 md:py-8 hover:no-underline"
              >
                <div className="flex items-center gap-5 text-left min-w-0">
                  <div className={cn(
                    "size-10 md:size-12 shrink-0 rounded-2xl flex items-center justify-center border shadow-inner transition-all duration-1000",
                    "bg-white/5 border-white/5 group-data-[state=open]:rotate-12 group-data-[state=open]:scale-110",
                    isStaff 
                      ? "group-data-[state=open]:text-amber-500 group-data-[state=open]:border-amber-500/30" 
                      : "group-data-[state=open]:text-primary group-data-[state=open]:border-primary/30"
                  )}>
                    <faq.icon className="size-4 md:size-5" />
                  </div>
                  <span className="text-[11px] md:text-xs font-black uppercase italic tracking-widest text-foreground/60 transition-colors group-hover:text-foreground truncate">
                    {faq.question}
                  </span>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="pb-8 pt-0">
                <div className={cn(
                  "space-y-4 transition-all duration-700 animate-in fade-in slide-in-from-top-2",
                  screenSize === 'xs' ? "pl-0" : "pl-[68px]"
                )}>
                  <p className="text-[11px] md:text-sm font-bold leading-relaxed text-muted-foreground/50 italic max-w-xl">
                    {faq.answer}
                  </p>
                  <div className={cn(
                    "h-px w-12 opacity-30",
                    isStaff ? "bg-amber-500" : "bg-primary"
                  )} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* --- SUBSURFACE AURA: HARDWARE-AWARE RADIANCE --- */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[160px] opacity-10 pointer-events-none transition-all duration-1000",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} 
      style={{ 
        width: `${viewportWidth * 0.6}px`, 
        height: `${viewportWidth * 0.6}px` 
      }} />

      {/* Background Aesthetic Flow */}
      <Waves className="absolute bottom-0 left-0 w-full h-24 opacity-5 pointer-events-none" />
    </section>
  );
}