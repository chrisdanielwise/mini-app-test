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
 * 🌊 PROVISIONING_DRAWER (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Kinetic Momentum | Vapour-Glass volume.
 * Logic: morphology-aware safe-area clamping with multi-step haptic sync.
 */
export function ProvisioningDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(1);
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Hardware-state consumption
  const { isReady, screenSize, isMobile, safeArea } = useDeviceContext();
  
  const isStaff = flavor === "AMBER";

  // 🛡️ RESET PROTOCOL: Cleanup on exit
  React.useEffect(() => {
    if (!isOpen) setTimeout(() => setStep(1), 500);
  }, [isOpen]);

  if (!isReady) return null;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Logic: Balancing geometry for 6-tier hardware spectrum.
   */
  const drawerWidth = isMobile ? "w-full" : "w-full max-w-xl";
  const drawerRadius = isMobile ? "rounded-none" : "rounded-l-[3.5rem]";

  return (
    <>
      {/* 🌌 ATMOSPHERIC SHROUD: Focus-Lock Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-[150] bg-background/60 backdrop-blur-md transition-opacity duration-1000",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => { impact("light"); onClose(); }}
      />

      {/* 🚀 THE DRAWER VOLUME: Vapour-Glass Construction */}
      <aside className={cn(
        "fixed inset-y-0 right-0 z-[160] bg-card/90 backdrop-blur-3xl border-l transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-apex",
        isOpen ? "translate-x-0" : "translate-x-full",
        isStaff ? "border-amber-500/20" : "border-white/5",
        drawerWidth,
        drawerRadius
      )}>
        <div className="flex flex-col h-full" style={{ paddingTop: isMobile ? `${safeArea.top}px` : "0px" }}>
          
          {/* --- TERMINAL HEADER --- */}
          <div className="h-24 md:h-28 px-8 md:px-12 flex items-center justify-between border-b border-white/5 relative z-10">
            <div className="flex items-center gap-6">
              <div className={cn(
                "size-14 rounded-2xl md:rounded-[1.3rem] flex items-center justify-center border shadow-inner transition-colors duration-700",
                isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
              )}>
                <Network className="size-7" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-foreground leading-none">
                  Node_Provision
                </h3>
                <div className="flex items-center gap-2 mt-2 opacity-30 italic">
                  <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em]">Mesh_Exp_v16.31</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => { impact("light"); onClose(); }}
              className="size-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all opacity-40 hover:opacity-100 active:scale-90"
            >
              <X className="size-6" />
            </button>
          </div>

          {/* --- PROGRESS TELEMETRY: Laminar Track --- */}
          <div className="px-10 py-10 flex items-center gap-3">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={cn(
                  "h-2 rounded-full transition-all duration-1000",
                  step === s ? "w-16 bg-primary" : step > s ? "w-8 bg-primary/40" : "w-8 bg-white/5"
                )} />
                {s < 3 && <div className="size-1.5 rounded-full bg-white/10" />}
              </React.Fragment>
            ))}
          </div>

          {/* --- FLOW CONTAINER: Content Ingress --- */}
          <div className="flex-1 overflow-y-auto px-8 md:px-12 pt-2 scrollbar-hide space-y-12 pb-32">
            {step === 1 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000">
                <div className="space-y-5">
                  <label className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 italic ml-2">Protocol_Identity_v1</label>
                  <input 
                    autoFocus
                    placeholder="ENTER_NODE_LABEL"
                    className="w-full h-18 rounded-[1.8rem] bg-white/[0.03] border border-white/5 px-8 font-black uppercase italic tracking-widest outline-none focus:border-primary/40 focus:bg-white/[0.06] transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <ProvisionOption 
                    isActive={true}
                    icon={Zap}
                    title="Fast_Signal"
                    desc="Low Latency // High Frequency"
                  />
                  <ProvisionOption 
                    isActive={false}
                    icon={ShieldCheck}
                    title="Stable_Node"
                    desc="Max Security // Audit Verified"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000">
                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 italic ml-2">Hardware_Allocation</label>
                  <div className="space-y-4">
                    {[
                      { icon: Cpu, label: "Compute_Node_A1", price: "+$12/mo" },
                      { icon: Settings2, label: "Audit_Relay_v4", price: "+$8/mo" }
                    ].map((hw) => (
                      <div key={hw.label} className="group flex items-center justify-between p-6 rounded-[1.8rem] bg-white/[0.03] border border-white/5 hover:border-primary/30 hover:bg-white/[0.06] transition-all duration-700 cursor-pointer">
                        <div className="flex items-center gap-5">
                          <hw.icon className="size-5 opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all" />
                          <span className="text-[11px] font-black uppercase tracking-widest italic">{hw.label}</span>
                        </div>
                        <span className="text-[10px] font-black text-primary tabular-nums tracking-widest">{hw.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- TERMINAL ACTIONS: Clamped Footer --- */}
          <div 
            className="p-8 md:p-12 border-t border-white/5 bg-white/[0.02] flex items-center gap-6 backdrop-blur-2xl"
            style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1.5rem)` : "3rem" }}
          >
            {step > 1 && (
              <Button 
                variant="ghost" 
                onClick={() => { impact("light"); setStep(s => s - 1); }}
                className="h-16 md:h-18 px-10 rounded-2xl md:rounded-[1.6rem] text-[11px] font-black uppercase italic tracking-widest opacity-40 hover:opacity-100"
              >
                <ChevronLeft className="mr-3 size-4" />
                Back
              </Button>
            )}
            <Button 
              className="flex-1 h-16 md:h-18 rounded-2xl md:rounded-[1.6rem] bg-primary text-primary-foreground text-[11px] font-black uppercase italic tracking-[0.2em] shadow-apex transition-all active:scale-95"
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
              <ArrowRight className="ml-4 size-5" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

/** 🛠️ ATOMIC: Provision Option Card */
function ProvisionOption({ isActive, icon: Icon, title, desc }: { isActive: boolean, icon: any, title: string, desc: string }) {
  const { impact } = useHaptics();
  return (
    <div 
      onClick={() => impact("medium")}
      className={cn(
        "p-7 rounded-[2.2rem] border transition-all duration-700 cursor-pointer group",
        isActive 
          ? "bg-primary/10 border-primary/30 shadow-apex-primary" 
          : "bg-white/[0.03] border-white/5 hover:border-white/20"
      )}
    >
      <Icon className={cn("size-7 mb-4 transition-all duration-700", isActive ? "text-primary rotate-6" : "text-muted-foreground/30 group-hover:text-foreground")} />
      <p className="text-[13px] font-black uppercase italic tracking-tighter">{title}</p>
      <p className="text-[8px] opacity-40 uppercase tracking-widest font-black leading-relaxed mt-2">{desc}</p>
    </div>
  );
}