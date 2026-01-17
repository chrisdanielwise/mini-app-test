"use client";

import * as React from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { HelpCircle, ChevronRight, Terminal, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 PROTOCOL_DOCUMENTATION (Institutional v16.16.12)
 * Logic: Haptic-synced technical accordion with Focus-Lock radiance.
 * Design: v9.9.1 Hardened Glassmorphism.
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
    <section className="relative py-32 px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* --- SECTION HEADER --- */}
        <div className="text-center mb-20 space-y-4">
          <div className="flex items-center justify-center gap-3">
             <HelpCircle className={cn("size-4", isStaff ? "text-amber-500" : "text-primary")} />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 italic">
               Protocol_Support
             </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-foreground">
            Clearance <span className={isStaff ? "text-amber-500" : "text-primary"}>Level.</span>
          </h2>
        </div>

        {/* --- HARDENED ACCORDION --- */}
        <Accordion type="single" collapsible className="space-y-4">
          {FAQS.map((faq) => (
            <AccordionItem 
              key={faq.id} 
              value={faq.id}
              className={cn(
                "group rounded-[2rem] border px-6 md:px-10 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden",
                "bg-white/[0.02] border-white/5 data-[state=open]:bg-white/[0.04] data-[state=open]:border-white/20 data-[state=open]:shadow-2xl",
                isStaff ? "data-[state=open]:shadow-amber-500/5" : "data-[state=open]:shadow-primary/5"
              )}
            >
              <AccordionTrigger 
                onClick={() => { selectionChange(); impact("light"); }}
                className="py-8 hover:no-underline"
              >
                <div className="flex items-center gap-5 text-left">
                  <div className={cn(
                    "size-10 rounded-xl flex items-center justify-center border transition-all duration-500",
                    "bg-white/5 border-white/5 group-data-[state=open]:rotate-12",
                    isStaff ? "group-data-[state=open]:text-amber-500 group-data-[state=open]:border-amber-500/40" : "group-data-[state=open]:text-primary group-data-[state=open]:border-primary/40"
                  )}>
                    <faq.icon className="size-4" />
                  </div>
                  <span className="text-[11px] md:text-xs font-black uppercase italic tracking-widest text-foreground/80 transition-colors group-hover:text-foreground">
                    {faq.question}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-8 pt-0">
                <div className="pl-[60px] space-y-4">
                  <p className="text-[12px] font-medium leading-relaxed text-muted-foreground/60 italic">
                    {faq.answer}
                  </p>
                  <div className={cn(
                    "h-px w-12",
                    isStaff ? "bg-amber-500/20" : "bg-primary/20"
                  )} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* 🏛️ SUBSURFACE AURA */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 blur-[160px] opacity-10 pointer-events-none transition-colors duration-1000",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />
    </section>
  );
}