"use client";

import * as React from "react";
import { useActionState, useEffect, useState } from "react";
import { createServiceAction } from "@/lib/actions/service.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// 🌊 INSTITUTIONAL UI NODES
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
import { toast } from "sonner";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ SERVICE_FORM (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Hardware Bridge Sync.
 * Fix: High-density inputs (h-11) and shrunken header volume prevents blowout.
 */
export function ServiceForm({ merchantId }: { merchantId: string }) {
  const [state, formAction, isPending] = useActionState(createServiceAction, null);
  const { impact, notification } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  // 🔄 HYDRATION_SYNC: Handle institutional feedback
  useEffect(() => {
    if (state?.success && !isPending) {
      notification("success");
      toast.success("CLUSTER_ONLINE", {
        description: "Asset node has been successfully initialized."
      });
    }
    if (state?.error && !isPending) {
      notification("error");
      toast.error("DEPLOYMENT_FAILED", { description: state.error });
    }
  }, [state, isPending, notification]);

  // 🛡️ HYDRATION_SHIELD: Prevents "Bogus" layout snaps on mobile ingress
  if (!isReady) return (
    <div className="space-y-6 animate-pulse p-6">
      <div className="h-48 w-full bg-white/[0.02] rounded-2xl border border-white/5" />
      <div className="h-48 w-full bg-white/[0.02] rounded-2xl border border-white/5" />
    </div>
  );

  return (
    <form 
      action={formAction} 
      className="flex flex-col h-full relative animate-in fade-in slide-in-from-bottom-4 duration-700"
    >
      <input type="hidden" name="merchantId" value={merchantId} />

      {/* --- 🚀 INTERNAL SCROLL: Configuration Manifest --- */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 md:space-y-6 pb-32 px-1">
        
        {/* SECTION 1: IDENTITY PROTOCOL */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-[2.5rem] border border-white/5 bg-zinc-950/40 p-5 md:p-8 backdrop-blur-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-6 relative z-10 leading-none">
            <div className="flex items-center gap-4">
              <div className="size-10 md:size-12 shrink-0 rounded-xl md:rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                <Zap className="size-5 md:size-6 fill-current animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 opacity-20 italic">
                  <Activity className="size-2.5" />
                  <h2 className="text-[7.5px] md:text-[8px] font-black uppercase tracking-[0.3em]">Identity_v16</h2>
                </div>
                <p className="text-lg md:text-2xl font-black uppercase italic tracking-tighter text-foreground leading-none">
                  Asset <span className="text-primary">Naming</span>
                </p>
              </div>
            </div>
            <Terminal className="size-4 md:size-5 opacity-10 hidden sm:block" />
          </div>
          
          <div className="grid gap-5 relative z-10">
            <div className="space-y-1.5 md:space-y-2">
              <Label className="text-[7.5px] md:text-[8.5px] font-black uppercase tracking-[0.2em] opacity-40 italic ml-1">Service_Label</Label>
              <Input 
                name="name" 
                placeholder="ENTER_NODE_DESIGNATION" 
                required 
                className="h-11 md:h-14 rounded-xl md:rounded-2xl bg-white/[0.02] border-white/5 px-5 font-black uppercase italic text-xs tracking-tight focus:ring-4 focus:ring-primary/5 transition-all text-foreground" 
              />
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-[7.5px] md:text-[8.5px] font-black uppercase tracking-[0.2em] opacity-40 italic ml-1">Protocol_Manifest</Label>
              <Textarea 
                name="description" 
                placeholder="Define value delivery vector..." 
                className="rounded-xl md:rounded-2xl min-h-[100px] bg-white/[0.02] border-white/5 p-4 text-[11px] font-medium leading-relaxed resize-none focus:ring-4 focus:ring-primary/5 text-foreground" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] opacity-40 italic ml-1">Asset_Class (Tag)</Label>
                <div className="relative group/field">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 opacity-20 group-focus-within/field:text-primary group-focus-within/field:opacity-100 transition-all" />
                  <Input 
                    name="categoryTag" 
                    placeholder="FOREX" 
                    className="h-11 pl-10 rounded-xl bg-white/[0.02] border-white/5 font-black uppercase text-[10px] tracking-widest text-foreground" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] opacity-40 italic ml-1">Terminal_ID</Label>
                <div className="relative group/field">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 opacity-20 group-focus-within/field:text-primary group-focus-within/field:opacity-100 transition-all" />
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
        <div className="relative overflow-hidden rounded-2xl md:rounded-[2.5rem] border border-white/5 bg-zinc-950/40 p-5 md:p-8 backdrop-blur-3xl shadow-2xl">
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="size-10 md:size-12 shrink-0 rounded-xl md:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
              <Layers className="size-5 md:size-6" />
            </div>
            <div className="space-y-1 leading-none">
              <div className="flex items-center gap-2 opacity-20 italic">
                <Activity className="size-2.5" />
                <h2 className="text-[7.5px] md:text-[8px] font-black uppercase tracking-[0.3em]">Liquidity_Node</h2>
              </div>
              <p className="text-lg md:text-2xl font-black uppercase italic tracking-tighter text-foreground">
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
                className="h-11 md:h-14 rounded-xl md:rounded-2xl bg-white/[0.02] border-white/5 px-5 font-black uppercase text-[10px] tracking-widest text-foreground shadow-inner" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] opacity-40 italic ml-1">USD</Label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/20 font-black text-xs group-focus-within:text-emerald-500 group-focus-within:opacity-100">$</span>
                  <Input 
                    name="tierPrices[]" 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    required 
                    className="h-11 px-4 pl-9 rounded-xl bg-white/[0.02] border-white/5 font-black text-sm text-foreground shadow-inner" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] opacity-40 italic ml-1">Epoch</Label>
                <select 
                  name="tierIntervals[]" 
                  className="w-full h-11 rounded-xl bg-zinc-900 border border-white/5 px-3 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] outline-none appearance-none cursor-pointer text-foreground shadow-inner"
                >
                  <option value="MONTH">Monthly Epoch</option>
                  <option value="WEEK">Weekly Sprint</option>
                  <option value="YEAR">Annual Horizon</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] opacity-40 italic ml-1">Lifecycle</Label>
                <select 
                  name="tierTypes[]" 
                  className="w-full h-11 rounded-xl bg-zinc-900 border border-white/5 px-3 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] outline-none appearance-none cursor-pointer text-foreground shadow-inner"
                >
                  <option value="STANDARD">Standard Cycle</option>
                  <option value="LIFETIME">Persistent Node</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Safe Area Sync --- */}
      <div 
        className="fixed bottom-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-xl border-t border-white/5 z-[100] transition-all"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1.25rem)` : "2rem" }}
      >
        <Button 
          type="submit" 
          disabled={isPending}
          onClick={() => impact("medium")}
          className="group relative w-full h-14 md:h-18 rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden transition-all active:scale-95 border-none"
        >
          <div className="absolute inset-0 bg-primary transition-transform group-hover:scale-105" />
          <div className="relative flex items-center justify-center gap-3 text-white font-black uppercase italic tracking-[0.2em] text-xs">
            {isPending ? (
              <><Loader2 className="size-5 animate-spin" /> Provisioning Node Cluster...</>
            ) : (
              <><ShieldCheck className="size-6" /> Initialize & Deploy Cluster</>
            )}
          </div>
        </Button>
      </div>
    </form>
  );
}