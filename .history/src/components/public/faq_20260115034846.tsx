"use client";

import * as React from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { HelpCircle, Terminal, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 PROTOCOL_DOCUMENTATION (Institutional v16.16.14)
 * Logic: Haptic-synced technical accordion with Focus-Lock radiance.
 * Refactor: Vertical compression & liquid typography scaling (v9.9.5).
 */

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

export function InfrastructureFAQ() {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const isStaff = flavor === "AMBER";

  return (
    <section className="relative py-[clamp(4rem,12vh,8rem)] px-6">
      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* --- SECTION HEADER: COMPRESSED --- */}
        <div className="text-center mb-12 md:mb-16 space-y-3">
          <div className="flex items-center justify-center gap-2.5">
             <HelpCircle className={cn("size-3.5", isStaff ? "text-amber-500" : "text-primary")} />
             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">
               Clearance_Level_Support
             </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-foreground leading-none">
            Infrastructure <span className={isStaff ? "text-amber-500" : "text-primary"}>Protocol.</span>
          </h2>
        </div>

        {/* --- HARDENED TACTICAL ACCORDION --- */}
        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((faq) => (
            <AccordionItem 
              key={faq.id} 
              value={faq.id}
              className={cn(
                "group rounded-[1.5rem] border px-5 md:px-8 transition-all duration-500 ease-out overflow-hidden",
                "bg-white/[0.01] border-white/5 data-[state=open]:bg-white/[0.03] data-[state=open]:border-white/10",
                isStaff ? "data-[state=open]:shadow-[0_0_40px_rgba(245,158,11,0.03)]" : "data-[state=open]:shadow-[0_0_40px_rgba(var(--primary),0.03)]"
              )}
            >
              <AccordionTrigger 
                onClick={() => { selectionChange(); impact("light"); }}
                className="py-6 hover:no-underline"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className={cn(
                    "size-9 rounded-lg flex items-center justify-center border transition-all duration-500",
                    "bg-white/5 border-white/5 group-data-[state=open]:scale-110",
                    isStaff ? "group-data-[state=open]:text-amber-500 group-data-[state=open]:border-amber-500/30" : "group-data-[state=open]:text-primary group-data-[state=open]:border-primary/30"
                  )}>
                    <faq.icon className="size-3.5" />
                  </div>
                  <span className="text-[10px] md:text-[11px] font-black uppercase italic tracking-widest text-foreground/70 transition-colors group-hover:text-foreground">
                    {faq.question}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 pt-0">
                <div className="pl-[52px] space-y-3">
                  <p className="text-[11px] font-bold leading-relaxed text-muted-foreground/50 italic max-w-xl">
                    {faq.answer}
                  </p>
                  <div className={cn(
                    "h-px w-10 opacity-30",
                    isStaff ? "bg-amber-500" : "bg-primary"
                  )} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* 🏛️ SUBSURFACE AURA: TACTICAL RADIANCE */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] blur-[140px] opacity-5 pointer-events-none transition-colors duration-1000",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />
    </section>
  );
}