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
 * 🌊 SERVICE_FORM (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Kinetic Ingress | Vapour-Glass depth.
 * Logic: morphology-aware safe-area clamping with high-pressure provisioning.
 */
export function ServiceForm({ merchantId }: { merchantId: string }) {
  const [state, formAction, isPending] = useActionState(createServiceAction, null);
  
  // 🛰️ DEVICE & TACTILE INGRESS
  const { impact, notification } = useHaptics();
  const { isReady, isMobile, safeArea, screenSize } = useDeviceContext();

  // 🔄 HYDRATION SYNC: Handle server-side feedback
  useEffect(() => {
    if (state?.success && !isPending) {
      notification("success");
      toast.success("CLUSTER_ONLINE", { description: "Asset node initialized and deployed." });
    }
    if (state?.error && !isPending) {
      notification("error");
      toast.error("DEPLOYMENT_FAILED", { description: state.error });
    }
  }, [state, isPending, notification]);

  const handleTactile = useCallback((level: "light" | "medium" | "heavy" = "light") => {
    impact(level);
  }, [impact]);

  if (!isReady) return <div className="space-y-10 animate-pulse">
    <div className="h-64 w-full bg-card/20 rounded-[3rem]" />
    <div className="h-64 w-full bg-card/20 rounded-[3rem]" />
  </div>;

  return (
    <form 
      action={formAction} 
      className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-24"
    >
      {/* 🔐 IDENTITY HANDSHAKE */}
      <input type="hidden" name="merchantId" value={merchantId} />

      {/* --- SECTION 1: IDENTITY PROTOCOL --- */}
      <div className={cn(
        "group relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 bg-card/40 p-6 md:p-12 backdrop-blur-3xl shadow-apex transition-all duration-1000",
        "hover:bg-white/[0.03] hover:border-primary/20"
      )}>
        {/* 🌫️ VAPOUR RADIANCE */}
        <div className="absolute -right-24 -top-24 size-64 bg-primary/5 blur-[120px] pointer-events-none transition-opacity group-hover:opacity-100" />

        <div className="flex items-center justify-between mb-10 relative z-10">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 shrink-0 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner transition-transform group-hover:rotate-6">
              <Zap className="h-7 w-7 fill-current animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 opacity-30 italic">
                <Activity className="h-3 w-3" />
                <h2 className="text-[9px] font-black uppercase tracking-[0.4em]">Identity_Protocol_v1</h2>
              </div>
              <p className="text-xl md:text-3xl font-black uppercase italic tracking-tighter text-foreground">
                Asset <span className="text-primary">Naming</span>
              </p>
            </div>
          </div>
          <Terminal className="h-6 w-6 text-muted-foreground/10" />
        </div>
        
        <div className="grid gap-8 md:gap-10 relative z-10">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.4em] ml-2 opacity-40 italic">Service_Label</Label>
            <Input 
              name="name" 
              onFocus={() => handleTactile("light")}
              placeholder="ENTER_NODE_DESIGNATION" 
              required 
              className="h-16 md:h-20 rounded-2xl md:rounded-[1.8rem] bg-white/[0.03] border-white/5 px-8 font-black uppercase italic text-sm md:text-lg tracking-widest focus:bg-white/[0.06] focus:border-primary/40 transition-all shadow-inner" 
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.4em] ml-2 opacity-40 italic">Protocol_Manifest</Label>
            <Textarea 
              name="description" 
              onFocus={() => handleTactile("light")}
              placeholder="Define value delivery vector..." 
              className="rounded-2xl md:rounded-[2rem] min-h-[140px] bg-white/[0.03] border-white/5 p-8 text-[11px] md:text-xs font-medium leading-relaxed resize-none focus:bg-white/[0.06] focus:border-primary/40 shadow-inner" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.4em] ml-2 opacity-40 italic">Asset_Class</Label>
              <div className="relative group/field">
                <Hash className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground opacity-20 group-focus-within/field:text-primary transition-opacity" />
                <Input 
                  name="categoryTag" 
                  onFocus={() => handleTactile("light")}
                  placeholder="FOREX" 
                  className="h-16 pl-16 rounded-2xl bg-white/[0.03] border-white/5 font-black uppercase text-[11px] tracking-widest focus:bg-white/[0.06]" 
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.4em] ml-2 opacity-40 italic">Terminal_ID</Label>
              <div className="relative group/field">
                <Globe className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground opacity-20 group-focus-within/field:text-primary transition-opacity" />
                <Input 
                  name="vipChannelId" 
                  onFocus={() => handleTactile("light")}
                  placeholder="-100..." 
                  required
                  className="h-16 pl-16 rounded-2xl border-primary/20 bg-primary/5 font-mono text-sm text-primary shadow-inner" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: PRICING NODE --- */}
      <div className={cn(
        "group relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 bg-card/40 p-6 md:p-12 backdrop-blur-3xl shadow-apex transition-all duration-1000",
        "hover:bg-white/[0.03] hover:border-emerald-500/20"
      )}>
        {/* 🌫️ VAPOUR RADIANCE */}
        <div className="absolute -left-24 -top-24 size-64 bg-emerald-500/5 blur-[120px] pointer-events-none transition-opacity group-hover:opacity-100" />

        <div className="flex items-center gap-5 mb-10 relative z-10">
          <div className="h-14 w-14 shrink-0 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
            <Layers className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 opacity-30 italic">
              <Activity className="h-3 w-3" />
              <h2 className="text-[9px] font-black uppercase tracking-[0.4em]">Primary_Liquidity_Node</h2>
            </div>
            <p className="text-xl md:text-3xl font-black uppercase italic tracking-tighter text-foreground">
              Initial <span className="text-emerald-500">Pricing</span>
            </p>
          </div>
        </div>

        <div className="grid gap-10 relative z-10">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.4em] ml-2 opacity-40 italic">Tier_Identity</Label>
            <Input 
              name="tierNames[]" 
              onFocus={() => handleTactile("light")}
              placeholder="MONTHLY_ACCESS_PROTOCOL" 
              required 
              className="h-16 md:h-20 rounded-2xl md:rounded-[1.8rem] bg-white/[0.03] border-white/5 px-8 font-black uppercase text-xs md:text-sm tracking-[0.2em] focus:bg-white/[0.06]" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.4em] ml-2 opacity-40 italic">Liquidity_USD</Label>
              <div className="relative group/field">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-sm group-focus-within/field:text-emerald-500 transition-colors">$</span>
                <Input 
                  name="tierPrices[]" 
                  onFocus={() => handleTactile("light")}
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  required 
                  className="h-16 pl-12 rounded-2xl bg-white/[0.03] border-white/5 font-black italic text-lg shadow-inner focus:bg-white/[0.06]" 
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.4em] ml-2 opacity-40 italic">Billing_Epoch</Label>
              <select 
                name="tierIntervals[]" 
                onChange={() => handleTactile("medium")}
                className="w-full h-16 rounded-2xl bg-white/[0.03] border border-white/5 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white/[0.06] appearance-none cursor-pointer"
              >
                <option value="MONTH">Monthly Epoch</option>
                <option value="WEEK">Weekly Sprint</option>
                <option value="YEAR">Annual Horizon</option>
              </select>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.4em] ml-2 opacity-40 italic">Lifecycle</Label>
              <select 
                name="tierTypes[]" 
                onChange={() => handleTactile("medium")}
                className="w-full h-16 rounded-2xl bg-white/[0.03] border border-white/5 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white/[0.06] appearance-none cursor-pointer"
              >
                <option value="STANDARD">Standard Renewal</option>
                <option value="LIFETIME">Persistent_Node</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* --- TERMINAL ACTIONS --- */}
      <div 
        className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-xl border-t border-white/5 z-[100] animate-in slide-in-from-bottom-full duration-1000 lg:relative lg:p-0 lg:bg-transparent lg:border-none lg:z-auto"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1rem)` : "1.5rem" }}
      >
        <Button 
          type="submit" 
          disabled={isPending}
          onClick={() => handleTactile("heavy")}
          className="group relative w-full h-18 md:h-24 rounded-2xl md:rounded-[2.5rem] shadow-apex-primary overflow-hidden transition-all active:scale-95"
        >
          <div className="absolute inset-0 bg-primary transition-transform group-hover:scale-105" />
          <div className="relative flex items-center justify-center gap-4 text-white font-black uppercase italic tracking-[0.3em] text-xs md:text-sm">
            {isPending ? (
              <><Loader2 className="h-6 w-6 animate-spin" /> Provisioning_Node...</>
            ) : (
              <><ShieldCheck className="h-7 w-7" /> Deploy_Service_Mesh</>
            )}
          </div>
        </Button>
      </div>
    </form>
  );
}