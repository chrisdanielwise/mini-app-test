"use client";

import { useActionState, useEffect, useCallback } from "react";
import { createServiceAction } from "@/lib/actions/service.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// 🏛️ Institutional Contexts & Hooks
import { 
  Zap, 
  ShieldCheck, 
  Layers, 
  Loader2, 
  Terminal, 
  Globe, 
  Hash,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { toast } from "sonner";

/**
 * 🛰️ SERVICE_FORM (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density inputs (h-11) and row compression prevents blowout.
 */
export function ServiceForm({ merchantId }: { merchantId: string }) {
  const [state, formAction, isPending] = useActionState(createServiceAction, null);
  const { impact, notification } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  useEffect(() => {
    if (state?.success && !isPending) {
      notification("success");
      toast.success("CLUSTER_ONLINE");
    }
    if (state?.error && !isPending) {
      notification("error");
      toast.error("DEPLOYMENT_FAILED", { description: state.error });
    }
  }, [state, isPending, notification]);

  if (!isReady) return <div className="space-y-6 animate-pulse p-6">
    <div className="h-48 w-full bg-white/5 rounded-2xl" />
    <div className="h-48 w-full bg-white/5 rounded-2xl" />
  </div>;

  return (
    <form 
      action={formAction} 
      className="flex flex-col h-full relative"
    >
      <input type="hidden" name="merchantId" value={merchantId} />

      {/* --- 🚀 INTERNAL SCROLL: Configuration Manifest --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 md:space-y-6 pb-28 md:pb-32 px-1">
        
        {/* SECTION 1: IDENTITY PROTOCOL */}
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-950/40 p-5 md:p-7 backdrop-blur-3xl">
          <div className="flex items-center justify-between mb-6 relative z-10 leading-none">
            <div className="flex items-center gap-4">
              <div className="size-10 shrink-0 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                <Zap className="size-5 fill-current animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 opacity-20 italic">
                  <Activity className="size-2.5" />
                  <h2 className="text-[7.5px] font-black uppercase tracking-[0.3em]">Identity_v16</h2>
                </div>
                <p className="text-xl font-black uppercase italic tracking-tighter text-foreground">
                  Asset <span className="text-primary">Naming</span>
                </p>
              </div>
            </div>
            <Terminal className="size-4 opacity-10" />
          </div>
          
          <div className="grid gap-5 relative z-10">
            <div className="space-y-1.5">
              <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] opacity-40 italic ml-1">Service_Label</Label>
              <Input 
                name="name" 
                placeholder="ENTER_NODE_DESIGNATION" 
                required 
                className="h-11 rounded-xl bg-white/[0.02] border-white/5 px-5 font-black uppercase italic text-xs tracking-widest focus:ring-4 focus:ring-primary/5 transition-all" 
              />
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] opacity-40 italic ml-1">Protocol_Manifest</Label>
              <Textarea 
                name="description" 
                placeholder="Define value delivery vector..." 
                className="rounded-xl min-h-[100px] bg-white/[0.02] border-white/5 p-4 text-[11px] font-medium leading-relaxed resize-none focus:ring-4 focus:ring-primary/5" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] opacity-40 italic ml-1">Asset_Class</Label>
                <div className="relative group/field">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 opacity-20" />
                  <Input 
                    name="categoryTag" 
                    placeholder="FOREX" 
                    className="h-11 pl-10 rounded-xl bg-white/[0.02] border-white/5 font-black uppercase text-[10px] tracking-widest" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] opacity-40 italic ml-1">Terminal_ID</Label>
                <div className="relative group/field">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 opacity-20" />
                  <Input 
                    name="vipChannelId" 
                    placeholder="-100..." 
                    required
                    className="h-11 pl-10 rounded-xl border-primary/20 bg-primary/5 font-mono text-[11px] text-primary" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: PRICING NODE */}
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-950/40 p-5 md:p-7 backdrop-blur-3xl">
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="size-10 shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
              <Layers className="size-5" />
            </div>
            <div className="space-y-1 leading-none">
              <div className="flex items-center gap-2 opacity-20 italic">
                <Activity className="size-2.5" />
                <h2 className="text-[7.5px] font-black uppercase tracking-[0.3em]">Liquidity_Node</h2>
              </div>
              <p className="text-xl font-black uppercase italic tracking-tighter text-foreground">
                Initial <span className="text-emerald-500">Pricing</span>
              </p>
            </div>
          </div>

          <div className="grid gap-5 relative z-10">
            <div className="space-y-1.5">
              <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] opacity-40 italic ml-1">Tier_Identity</Label>
              <Input 
                name="tierNames[]" 
                placeholder="MONTHLY_PROTOCOL" 
                required 
                className="h-11 rounded-xl bg-white/[0.02] border-white/5 px-5 font-black uppercase text-[10px] tracking-widest" 
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] opacity-40 italic ml-1">USD</Label>
                <Input 
                  name="tierPrices[]" 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  required 
                  className="h-11 px-4 rounded-xl bg-white/[0.02] border-white/5 font-black text-sm" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] opacity-40 italic ml-1">Epoch</Label>
                <select 
                  name="tierIntervals[]" 
                  className="w-full h-11 rounded-xl bg-zinc-900 border border-white/5 px-3 text-[8px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer"
                >
                  <option value="MONTH">Monthly</option>
                  <option value="WEEK">Weekly</option>
                  <option value="YEAR">Annual</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] opacity-40 italic ml-1">Cycle</Label>
                <select 
                  name="tierTypes[]" 
                  className="w-full h-11 rounded-xl bg-zinc-900 border border-white/5 px-3 text-[8px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer"
                >
                  <option value="STANDARD">Standard</option>
                  <option value="LIFETIME">Lifetime</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Deployment Action --- */}
      <div 
        className="fixed bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-xl border-t border-white/5 z-[100] lg:absolute lg:bg-transparent lg:border-none lg:p-0"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1rem)` : "1.25rem" }}
      >
        <Button 
          type="submit" 
          disabled={isPending}
          className="group relative w-full h-12 md:h-14 rounded-xl md:rounded-2xl shadow-lg overflow-hidden transition-all active:scale-95 border-none"
        >
          <div className="absolute inset-0 bg-primary transition-transform group-hover:scale-105" />
          <div className="relative flex items-center justify-center gap-3 text-white font-black uppercase italic tracking-[0.2em] text-[10px] md:text-xs">
            {isPending ? (
              <><Loader2 className="size-4 animate-spin" /> Provisioning...</>
            ) : (
              <><ShieldCheck className="size-5" /> Deploy_Service_Mesh</>
            )}
          </div>
        </Button>
      </div>
    </form>
  );
}