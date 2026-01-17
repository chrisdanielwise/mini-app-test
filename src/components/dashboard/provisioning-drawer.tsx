"use client";

import * as React from "react";
import { useState } from "react";
import { 
  X, 
  Zap, 
  ShieldCheck, 
  Settings2, 
  Network,
  Cpu,
  ArrowRight,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ PROVISIONING_DRAWER (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Stationary Horizon Lock.
 * Fix: Standardized h-11 inputs and h-12 actions for high-density configuration.
 */
export function ProvisioningDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(1);
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  
  const isStaff = flavor === "AMBER";

  React.useEffect(() => {
    if (!isOpen) setTimeout(() => setStep(1), 500);
  }, [isOpen]);

  if (!isReady) return null;

  return (
    <>
      {/* 🌌 FOCUS-LOCK BACKDROP */}
      <div 
        className={cn(
          "fixed inset-0 z-[150] bg-background/40 backdrop-blur-sm transition-opacity duration-700",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => { impact("light"); onClose(); }}
      />

      {/* 🚀 THE DRAWER VOLUME: Tactical Slim Geometry */}
      <aside className={cn(
        "fixed inset-y-0 right-0 z-[160] bg-zinc-950/95 backdrop-blur-3xl border-l transition-all duration-700 ease-out shadow-3xl",
        isOpen ? "translate-x-0" : "translate-x-full",
        isStaff ? "border-amber-500/10" : "border-white/5",
        isMobile ? "w-full rounded-none" : "w-full max-w-md rounded-l-3xl"
      )}>
        <div className="flex flex-col h-full" style={{ paddingTop: isMobile ? `${safeArea.top}px` : "0px" }}>
          
          {/* --- 🛡️ FIXED HUD: Compressed Header --- */}
          <div className="shrink-0 h-16 md:h-20 px-6 md:px-8 flex items-center justify-between border-b border-white/5 bg-white/[0.02] relative z-20">
            <div className="flex items-center gap-4">
              <div className={cn(
                "size-10 rounded-xl flex items-center justify-center border shadow-inner transition-all",
                isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
              )}>
                <Network className="size-5" />
              </div>
              <div className="leading-none">
                <h3 className="text-lg font-black uppercase italic tracking-tighter text-foreground">
                  Node_Provision
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5 opacity-20 italic">
                  <span className="text-[7px] font-black uppercase tracking-[0.3em]">Mesh_Exp_v16.31</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => { impact("light"); onClose(); }}
              className="size-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all opacity-40 hover:opacity-100"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* --- PROGRESS TELEMETRY: Compressed h-8 --- */}
          <div className="shrink-0 px-8 py-4 flex items-center gap-2 border-b border-white/5">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={cn(
                  "h-1 rounded-full transition-all duration-700",
                  step === s ? "w-10 bg-primary" : step > s ? "w-4 bg-primary/20" : "w-4 bg-white/5"
                )} />
              </React.Fragment>
            ))}
          </div>

          {/* --- 🚀 INTERNAL SCROLL: Configuration Ingress --- */}
          <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-8 custom-scrollbar">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                <div className="space-y-2">
                  <label className="text-[7.5px] font-black uppercase tracking-[0.3em] opacity-30 italic ml-1">Protocol_Identity</label>
                  <input 
                    autoFocus
                    placeholder="NODE_LABEL..."
                    className="w-full h-11 rounded-xl bg-white/[0.02] border border-white/5 px-5 font-mono text-[11px] font-black uppercase tracking-widest outline-none focus:border-primary/20 transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <ProvisionOption isActive={true} icon={Zap} title="Fast_Signal" />
                  <ProvisionOption isActive={false} icon={ShieldCheck} title="Stable_Node" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                <div className="space-y-4">
                  <label className="text-[7.5px] font-black uppercase tracking-[0.3em] opacity-30 italic ml-1">Hardware_Allocation</label>
                  <div className="space-y-2">
                    {[
                      { icon: Cpu, label: "Compute_A1", price: "+$12" },
                      { icon: Settings2, label: "Audit_Relay", price: "+$8" }
                    ].map((hw) => (
                      <div key={hw.label} className="group flex items-center justify-between p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-primary/20 hover:bg-white/[0.02] transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                          <hw.icon className="size-4 opacity-10 group-hover:text-primary transition-all" />
                          <span className="text-[10px] font-black uppercase tracking-widest italic">{hw.label}</span>
                        </div>
                        <span className="text-[9px] font-black text-primary tabular-nums">{hw.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- 🌊 SLIM FOOTER --- */}
          <div 
            className="shrink-0 p-6 md:p-8 border-t border-white/5 bg-white/[0.01] flex items-center gap-4 backdrop-blur-2xl"
            style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1rem)` : "2rem" }}
          >
            {step > 1 && (
              <Button 
                variant="ghost" 
                onClick={() => { impact("light"); setStep(s => s - 1); }}
                className="h-11 px-6 rounded-xl text-[8px] font-black uppercase italic tracking-widest opacity-20 hover:opacity-100"
              >
                <ChevronLeft className="mr-2 size-3" />
                Back
              </Button>
            )}
            <Button 
              className="flex-1 h-11 md:h-12 rounded-xl bg-primary text-primary-foreground text-[9px] font-black uppercase italic tracking-[0.2em] shadow-lg active:scale-95"
              onClick={() => {
                if (step < 3) {
                  impact("medium");
                  selectionChange();
                  setStep(s => s + 1);
                } else {
                  impact("heavy");
                  onClose();
                }
              }}
            >
              {step === 3 ? "Initialize_Cluster" : "Next_Phase"}
              <ArrowRight className="ml-3 size-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

/** 🛠️ ATOMIC: Provision Option Card (Compressed) */
function ProvisionOption({ isActive, icon: Icon, title }: { isActive: boolean, icon: any, title: string }) {
  const { impact } = useHaptics();
  return (
    <div 
      onClick={() => impact("medium")}
      className={cn(
        "p-4 rounded-xl border transition-all duration-500 cursor-pointer group",
        isActive 
          ? "bg-primary/5 border-primary/20 shadow-sm" 
          : "bg-white/[0.01] border-white/5 hover:border-white/10"
      )}
    >
      <Icon className={cn("size-5 mb-3", isActive ? "text-primary" : "text-muted-foreground/10 group-hover:text-foreground")} />
      <p className="text-[10px] font-black uppercase italic tracking-tighter leading-none">{title}</p>
    </div>
  );
}