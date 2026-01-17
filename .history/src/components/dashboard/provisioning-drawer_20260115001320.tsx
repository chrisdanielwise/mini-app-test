"use client";

import * as React from "react";
import { useState } from "react";
import { 
  X, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  Settings2, 
  Network,
  Cpu,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID PROVISIONING DRAWER (Institutional v16.16.12)
 * Logic: Multi-step infrastructure deployment.
 * Design: Side-sliding glass volume with Momentum Ingress.
 */
export function ProvisioningDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(1);
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const isStaff = flavor === "AMBER";

  // 🛡️ RESET ON CLOSE
  React.useEffect(() => {
    if (!isOpen) setTimeout(() => setStep(1), 500);
  }, [isOpen]);

  return (
    <>
      {/* 🌌 ATMOSPHERIC SHROUD */}
      <div 
        className={cn(
          "fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm transition-opacity duration-700",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => { impact("light"); onClose(); }}
      />

      {/* 🚀 THE DRAWER VOLUME */}
      <aside className={cn(
        "fixed inset-y-0 right-0 z-[160] w-full max-w-xl bg-card/80 backdrop-blur-3xl border-l transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[-20px_0_50px_rgba(0,0,0,0.5)]",
        isOpen ? "translate-x-0" : "translate-x-full",
        isStaff ? "border-amber-500/20" : "border-white/5"
      )}>
        <div className="flex flex-col h-full">
          
          {/* --- TERMINAL HEADER --- */}
          <div className="h-24 px-10 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className={cn(
                "size-12 rounded-2xl flex items-center justify-center border shadow-inner",
                isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
              )}>
                <Network className="size-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground">
                  Node_Provisioning
                </h3>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 italic">
                  Cluster_Expansion_v16
                </span>
              </div>
            </div>
            <button 
              onClick={() => { impact("light"); onClose(); }}
              className="size-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition-all opacity-40 hover:opacity-100"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* --- PROGRESS TELEMETRY --- */}
          <div className="px-10 py-8 flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={cn(
                  "h-1.5 rounded-full transition-all duration-700",
                  step === s ? "w-12 bg-primary" : step > s ? "w-6 bg-primary/40" : "w-6 bg-white/5"
                )} />
                {s < 3 && <div className="size-1 rounded-full bg-white/5" />}
              </React.Fragment>
            ))}
          </div>

          {/* --- FLOW CONTAINER --- */}
          <div className="flex-1 overflow-y-auto p-10 pt-0 scrollbar-hide space-y-10">
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic">Step_01 // Protocol_Identity</label>
                  <input 
                    placeholder="ENTER_NODE_LABEL"
                    className="w-full h-16 rounded-2xl bg-white/5 border border-white/5 px-6 font-black uppercase italic tracking-widest outline-none focus:border-primary/40 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl border border-primary/20 bg-primary/5 space-y-3 cursor-pointer group hover:bg-primary/10 transition-all">
                    <Zap className="size-5 text-primary" />
                    <p className="text-[11px] font-black uppercase italic tracking-tighter">Fast_Signal</p>
                    <p className="text-[8px] opacity-40 uppercase tracking-widest font-black leading-tight">Low Latency<br/>High Frequency</p>
                  </div>
                  <div className="p-6 rounded-3xl border border-white/5 bg-white/5 space-y-3 cursor-pointer opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                    <ShieldCheck className="size-5 text-muted-foreground" />
                    <p className="text-[11px] font-black uppercase italic tracking-tighter">Stable_Node</p>
                    <p className="text-[8px] opacity-40 uppercase tracking-widest font-black leading-tight">Max Security<br/>Audit Verified</p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic">Step_02 // Hardware_Allocation</label>
                  <div className="space-y-3">
                    {[
                      { icon: Cpu, label: "Compute_Node_A1", price: "+$12/mo" },
                      { icon: Settings2, label: "Audit_Relay_v4", price: "+$8/mo" }
                    ].map((hw) => (
                      <div key={hw.label} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-4">
                          <hw.icon className="size-4 opacity-40" />
                          <span className="text-[10px] font-black uppercase tracking-widest italic">{hw.label}</span>
                        </div>
                        <span className="text-[9px] font-black text-primary">{hw.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- TERMINAL ACTIONS --- */}
          <div className="p-10 border-t border-white/5 bg-white/[0.02] flex items-center gap-4">
            {step > 1 && (
              <Button 
                variant="ghost" 
                onClick={() => { impact("light"); setStep(s => s - 1); }}
                className="h-14 px-8 rounded-2xl text-[10px] font-black uppercase italic tracking-widest"
              >
                Back
              </Button>
            )}
            <Button 
              className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground text-[10px] font-black uppercase italic tracking-widest shadow-2xl shadow-primary/20"
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