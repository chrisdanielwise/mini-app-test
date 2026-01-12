"use client";

import { useActionState } from "react";
import { createServiceAction } from "@/lib/actions/service.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Zap, 
  ShieldCheck, 
  Layers, 
  Loader2, 
  Terminal, 
  Globe, 
  Hash 
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 🛰️ ASSET PROVISIONING INTERFACE (Tier 2)
 * High-resiliency deployment engine for institutional signal nodes.
 */
export function ServiceForm({ merchantId }: { merchantId: string }) {
  const [state, formAction, isPending] = useActionState(createServiceAction, null);

  return (
    <form action={formAction} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <input type="hidden" name="merchantId" value={merchantId} />

      {/* --- SECTION 1: IDENTITY PROTOCOL --- */}
      <div className="group relative overflow-hidden rounded-[3rem] border border-border/40 bg-card/40 p-10 backdrop-blur-3xl shadow-2xl transition-all hover:border-primary/20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Zap className="h-6 w-6 fill-current" />
            </div>
            <div className="space-y-1">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">
                Identity Protocol
              </h2>
              <p className="text-xl font-black uppercase italic tracking-tighter">
                Asset <span className="text-primary">Naming</span>
              </p>
            </div>
          </div>
          <Terminal className="h-5 w-5 text-muted-foreground/20" />
        </div>
        
        <div className="grid gap-8">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-primary/70">Service Label</Label>
            <Input 
              name="name" 
              placeholder="E.G. PLATINUM ALPHA SIGNALS" 
              required 
              className="h-14 rounded-2xl border-border/40 bg-muted/10 px-6 font-black uppercase italic text-xs tracking-tight focus:ring-primary/20 transition-all" 
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-primary/70">Protocol Manifest (Description)</Label>
            <Textarea 
              name="description" 
              placeholder="Define the value delivery mechanism for this cluster..." 
              className="rounded-[1.5rem] min-h-[120px] border-border/40 bg-muted/10 p-6 text-[11px] font-medium leading-relaxed resize-none focus:ring-primary/20" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-primary/70">Asset Class (Tag)</Label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30" />
                <Input 
                  name="categoryTag" 
                  placeholder="FOREX" 
                  className="h-14 pl-12 rounded-2xl border-border/40 bg-muted/10 font-black uppercase text-[10px] tracking-[0.2em]" 
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-primary/70">Telegram Target ID</Label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30" />
                <Input 
                  name="vipChannelId" 
                  placeholder="-100..." 
                  required
                  className="h-14 pl-12 rounded-2xl border-primary/20 bg-primary/5 font-mono text-xs text-primary shadow-inner" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: PRICING NODE 01 --- */}
      <div className="group relative overflow-hidden rounded-[3rem] border border-border/40 bg-card/40 p-10 backdrop-blur-3xl shadow-2xl transition-all hover:border-emerald-500/20">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner">
            <Layers className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">
              Primary Node
            </h2>
            <p className="text-xl font-black uppercase italic tracking-tighter">
              Initial <span className="text-emerald-500">Pricing</span>
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-emerald-500/70">Node Identity (Tier Name)</Label>
            <Input 
              name="tierName" 
              placeholder="MONTHLY ACCESS PROTOCOL" 
              required 
              className="h-14 rounded-2xl border-border/40 bg-muted/10 px-6 font-black uppercase text-xs tracking-widest" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-emerald-500/70">Liquidity (USD)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xs">$</span>
                <Input 
                  name="price" 
                  type="number" 
                  step="0.01" 
                  placeholder="99.00" 
                  required 
                  className="h-14 pl-10 rounded-2xl border-border/40 bg-muted/10 font-black italic text-sm" 
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-emerald-500/70">Billing Epoch</Label>
              <select 
                name="interval" 
                className="w-full h-14 rounded-2xl border border-border/40 bg-muted/10 px-4 text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer"
              >
                <option value="MONTH">Monthly Epoch</option>
                <option value="WEEK">Weekly Sprint</option>
                <option value="YEAR">Annual Horizon</option>
                <option value="DAY">Daily Node</option>
              </select>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-emerald-500/70">Asset Lifecycle</Label>
              <select 
                name="type" 
                className="w-full h-14 rounded-2xl border border-border/40 bg-muted/10 px-4 text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer"
              >
                <option value="CUSTOM">Standard Renewal</option>
                <option value="LIFETIME">Persistent / Lifetime</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {state?.error && (
        <div className="p-6 rounded-[1.5rem] bg-rose-500/5 border border-rose-500/20 animate-in shake-200">
           <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest text-center">
            DEPLOYMENT_ERROR: {state.error}
          </p>
        </div>
      )}

      <Button 
        type="submit" 
        disabled={isPending}
        className="group relative w-full h-20 rounded-[2rem] text-sm font-black uppercase italic tracking-[0.2em] shadow-2xl shadow-primary/30 overflow-hidden transition-all hover:scale-[1.01] active:scale-95"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary transition-all group-hover:bg-primary/90" />
        <div className="relative flex items-center justify-center gap-3">
          {isPending ? (
            <><Loader2 className="h-6 w-6 animate-spin" /> Provisioning Node Cluster...</>
          ) : (
            <><ShieldCheck className="h-6 w-6" /> Initialize & Deploy Cluster</>
          )}
        </div>
      </Button>
    </form>
  );
}