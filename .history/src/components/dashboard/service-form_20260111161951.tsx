"use client";

import { useActionState, useEffect } from "react";
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
import { hapticFeedback } from "@/lib/telegram/webapp";
import { toast } from "sonner";

/**
 * 🛰️ ASSET PROVISIONING INTERFACE
 * Logic: Synchronized with Universal Identity.
 * Optimized: Adaptive safe-zones and institutional touch-targets for cluster deployment.
 */
export function ServiceForm({ merchantId }: { merchantId: string }) {
  const [state, formAction, isPending] = useActionState(createServiceAction, null);

  // 🔄 HYDRATION SYNC: Handle server-side feedback
  useEffect(() => {
    if (state?.success) {
      toast.success("CLUSTER_ONLINE: Asset node has been initialized.");
    }
    if (state?.error) {
      toast.error(`DEPLOYMENT_FAILED: ${state.error}`);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 min-w-0">
      {/* 🔐 IDENTITY HANDSHAKE: Forced tenant context */}
      <input type="hidden" name="merchantId" value={merchantId} />

      {/* --- SECTION 1: IDENTITY PROTOCOL --- */}
      <div className="group relative overflow-hidden rounded-2xl md:rounded-[3rem] border border-border/40 bg-card/40 p-5 md:p-10 backdrop-blur-3xl shadow-2xl transition-all hover:border-primary/20">
        <div className="flex items-center justify-between mb-6 md:mb-8 relative z-10">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Zap className="h-5 w-5 md:h-6 md:w-6 fill-current animate-pulse" />
            </div>
            <div className="space-y-0.5 md:space-y-1 min-w-0">
              <h2 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60 truncate italic">
                Identity Protocol
              </h2>
              <p className="text-lg md:text-xl font-black uppercase italic tracking-tighter truncate text-foreground">
                Asset <span className="text-primary">Naming</span>
              </p>
            </div>
          </div>
          <Terminal className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground/20 hidden sm:block" />
        </div>
        
        <div className="grid gap-6 md:gap-8 relative z-10">
          <div className="space-y-2 md:space-y-3">
            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest ml-1 text-primary/70">Service Label</Label>
            <Input 
              name="name" 
              placeholder="E.G. PLATINUM ALPHA SIGNALS" 
              required 
              className="h-12 md:h-14 rounded-xl md:rounded-2xl border-border/40 bg-muted/10 px-4 md:px-6 font-black uppercase italic text-xs tracking-tight focus:ring-primary/20 transition-all shadow-inner text-foreground" 
            />
          </div>
          
          <div className="space-y-2 md:space-y-3">
            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest ml-1 text-primary/70">Protocol Manifest</Label>
            <Textarea 
              name="description" 
              placeholder="Define value delivery mechanism..." 
              className="rounded-xl md:rounded-[1.5rem] min-h-[100px] md:min-h-[120px] border-border/40 bg-muted/10 p-4 md:p-6 text-[10px] md:text-[11px] font-medium leading-relaxed resize-none focus:ring-primary/20 shadow-inner text-foreground" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div className="space-y-2 md:space-y-3">
              <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest ml-1 text-primary/70">Asset Class (Tag)</Label>
              <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30 group-focus-within:text-primary transition-colors" />
                <Input 
                  name="categoryTag" 
                  placeholder="FOREX" 
                  className="h-12 md:h-14 pl-12 rounded-xl md:rounded-2xl border-border/40 bg-muted/10 font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] shadow-inner text-foreground" 
                />
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest ml-1 text-primary/70">Telegram Target ID</Label>
              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30 group-focus-within:text-primary transition-colors" />
                <Input 
                  name="vipChannelId" 
                  placeholder="-100..." 
                  required
                  className="h-12 md:h-14 pl-12 rounded-xl md:rounded-2xl border-primary/20 bg-primary/5 font-mono text-xs text-primary shadow-inner" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: PRICING NODE --- */}
      <div className="group relative overflow-hidden rounded-2xl md:rounded-[3rem] border border-border/40 bg-card/40 p-5 md:p-10 backdrop-blur-3xl shadow-2xl transition-all hover:border-emerald-500/20">
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 relative z-10">
          <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl md:rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner">
            <Layers className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div className="space-y-0.5 md:space-y-1 min-w-0">
            <h2 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60 truncate italic">
              Primary Node
            </h2>
            <p className="text-lg md:text-xl font-black uppercase italic tracking-tighter truncate text-foreground">
              Initial <span className="text-emerald-500">Pricing</span>
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:gap-8 relative z-10">
          {/* Mapping Multi-Tier Fields for Action Protocol */}
          <div className="space-y-2 md:space-y-3">
            <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest ml-1 text-emerald-500/70">Node Identity</Label>
            <Input 
              name="tierNames[]" 
              placeholder="MONTHLY ACCESS PROTOCOL" 
              required 
              className="h-12 md:h-14 rounded-xl md:rounded-2xl border-border/40 bg-muted/10 px-4 md:px-6 font-black uppercase text-[10px] md:text-xs tracking-widest shadow-inner text-foreground" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
            <div className="space-y-2 md:space-y-3">
              <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest ml-1 text-emerald-500/70">Liquidity (USD)</Label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xs group-focus-within:text-emerald-500">$</span>
                <Input 
                  name="tierPrices[]" 
                  type="number" 
                  step="0.01" 
                  placeholder="99.00" 
                  required 
                  className="h-12 md:h-14 pl-10 rounded-xl md:rounded-2xl border-border/40 bg-muted/10 font-black italic text-sm shadow-inner text-foreground" 
                />
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest ml-1 text-emerald-500/70">Billing Epoch</Label>
              <select 
                name="tierIntervals[]" 
                className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl border border-border/40 bg-muted/10 px-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer shadow-inner text-foreground"
              >
                <option value="MONTH">Monthly Epoch</option>
                <option value="WEEK">Weekly Sprint</option>
                <option value="YEAR">Annual Horizon</option>
                <option value="DAY">Daily Node</option>
              </select>
            </div>
            <div className="space-y-2 md:space-y-3">
              <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest ml-1 text-emerald-500/70">Lifecycle</Label>
              <select 
                name="tierTypes[]" 
                className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl border border-border/40 bg-muted/10 px-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer shadow-inner text-foreground"
              >
                <option value="STANDARD">Standard Renewal</option>
                <option value="LIFETIME">Persistent / Lifetime</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isPending}
        onClick={() => hapticFeedback("medium")}
        className="group relative w-full h-16 md:h-20 rounded-xl md:rounded-[2rem] text-xs md:text-sm font-black uppercase italic tracking-[0.2em] shadow-2xl shadow-primary/30 overflow-hidden transition-all active:scale-95"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary" />
        <div className="relative flex items-center justify-center gap-3">
          {isPending ? (
            <><Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin" /> Provisioning Node Cluster...</>
          ) : (
            <><ShieldCheck className="h-5 w-5 md:h-6 md:w-6" /> Initialize & Deploy Cluster</>
          )}
        </div>
      </Button>
    </form>
  );
}