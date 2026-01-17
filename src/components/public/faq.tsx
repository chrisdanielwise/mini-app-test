"use client";

import * as React from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { ShieldCheck, Terminal, Zap, Activity } from "lucide-react";
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
 * 🛰️ INFRASTRUCTURE_FAQ (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density py-4 triggers and shrunken typography prevent blowout.
 */
export function InfrastructureFAQ() {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { screenSize, isReady, viewportWidth } = useDeviceContext();

  const isStaff = flavor === "AMBER";

  if (!isReady) return <section className="py-10 px-6 animate-pulse"><div className="h-64 rounded-2xl bg-card/10" /></section>;

  return (
    <section className={cn("relative py-12 md:py-20 px-6 transition-all duration-700")}>
      <div className="max-w-2xl mx-auto relative z-10">
        
        {/* --- FIXED HUD: Stationary Header --- */}
        <div className="text-center mb-8 md:mb-12 space-y-2 leading-none">
          <div className="flex items-center justify-center gap-2 italic opacity-20">
             <Activity className="size-3" />
             <span className="text-[7.5px] font-black uppercase tracking-[0.3em]">Knowledge_Base_v16</span>
          </div>
          <h2 className={cn(
            "font-black uppercase italic tracking-tighter text-foreground",
            screenSize === 'xs' ? "text-3xl" : "text-4xl md:text-5xl"
          )}>
            Infra <span className={isStaff ? "text-amber-500" : "text-primary"}>Protocol</span>
          </h2>
        </div>

        {/* --- HARDENED ACCORDION: Tactical Slim --- */}
        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((faq) => (
            <AccordionItem 
              key={faq.id} 
              value={faq.id}
              className={cn(
                "group rounded-xl border transition-all duration-500",
                "bg-zinc-950/40 border-white/5 data-[state=open]:border-white/10",
                isStaff ? "data-[state=open]:bg-amber-500/[0.02]" : "data-[state=open]:bg-white/[0.02]"
              )}
            >
              <AccordionTrigger 
                onClick={() => { selectionChange(); impact("light"); }}
                className="py-4 md:py-5 px-5 hover:no-underline leading-none"
              >
                <div className="flex items-center gap-4 text-left min-w-0">
                  <div className={cn(
                    "size-9 rounded-lg flex items-center justify-center border shadow-inner transition-transform",
                    "bg-white/5 border-white/5",
                    isStaff ? "group-data-[state=open]:text-amber-500" : "group-data-[state=open]:text-primary"
                  )}>
                    <faq.icon className="size-4" />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-black uppercase italic tracking-widest text-foreground/40 group-data-[state=open]:text-foreground truncate">
                    {faq.question}
                  </span>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-5 pb-5">
                <div className="pl-13 animate-in fade-in slide-in-from-top-1">
                  <p className="text-[9px] md:text-[11px] font-bold leading-relaxed text-muted-foreground/30 italic max-w-lg">
                    {faq.answer}
                  </p>
                  <div className={cn("h-0.5 w-8 mt-4", isStaff ? "bg-amber-500/20" : "bg-primary/20")} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* --- SUBSURFACE AURA --- */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[100px] opacity-5 pointer-events-none transition-all",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} 
      style={{ width: `${viewportWidth * 0.4}px`, height: `${viewportWidth * 0.4}px` }} />
    </section>
  );
}