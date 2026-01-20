"use client";

import * as React from "react";
import { useState, useActionState, useEffect, useCallback } from "react";
import { createCouponAction } from "@/lib/actions/coupon.actions";

// 🌊 INSTITUTIONAL UI NODES
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 🛠️ UTILS & TELEMETRY
import {
  Ticket, Loader2, Zap, ShieldCheck, RefreshCw,
  Globe, Cpu, Fingerprint, ChevronDown, Layers
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useLayout } from "@/context/layout-provider";
import { useDeviceContext } from "@/components/providers/device-provider";

export function CreateCouponModal({ merchantId }: { merchantId: string }) {
  const [open, setOpen] = useState(false);
  const [customCode, setCustomCode] = useState("");
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  
  const { impact, notification, selectionChange } = useHaptics();
  const { flavor } = useLayout();
  const { isReady, isMobile } = useDeviceContext();
  
  const [state, formAction, isPending] = useActionState(createCouponAction, null);
  const isStaffTheme = flavor === "AMBER";

  // 📡 SERVICE DISCOVERY
  useEffect(() => {
    if (open && merchantId && isReady) {
      const targetId = merchantId === "PLATFORM_ROOT" ? "global" : merchantId;
      fetch(`/api/merchant/${targetId}/services`)
        .then((res) => res.json())
        .then((data) => setServices(Array.isArray(data) ? data : []))
        .catch((err) => console.error("SIGNAL_FETCH_FAILURE", err));
    }
  }, [open, merchantId, isReady]);

  // 🔄 HYDRATION & NOTIFICATION SYNC
  useEffect(() => {
    if (state?.success && !isPending) {
      notification("success");
      toast.success("CAMPAIGN_LIVE", { description: "Node authorized on ledger." });
      setOpen(false);
      setCustomCode("");
    }
    if (state?.error && !isPending) {
      notification("error");
      toast.error("DEPLOYMENT_FAILED", { description: state.error });
    }
  }, [state, isPending, notification]);

  const generateCode = useCallback(() => {
    impact("medium");
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    setCustomCode(result);
  }, [impact]);

  if (!isReady) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); impact("light"); }}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          onClick={() => selectionChange()}
          className={cn(
            "rounded-xl h-12 md:h-14 px-6 shadow-apex transition-all active:scale-95 group",
            isStaffTheme ? "bg-amber-500 text-black" : "bg-primary text-white"
          )}
        >
          <Ticket className="size-4 mr-2 transition-transform group-hover:rotate-12" />
          <span className="font-black uppercase tracking-widest text-[10px] md:text-xs italic">Deploy_Campaign</span>
        </Button>
      </DialogTrigger>

      <DialogContent 
        className={cn(
          "max-w-xl border-white/5 bg-background/80 backdrop-blur-3xl p-0 overflow-hidden",
          isMobile ? "fixed bottom-0 rounded-t-[2.5rem] w-full" : "rounded-[2rem] shadow-3xl"
        )}
      >
        <form action={formAction} className="flex flex-col h-full max-h-[90dvh]">
          {/* 🛡️ IDENTITY HANDSHAKE: Ensure name matches server expectation */}
          <input type="hidden" name="merchantId" value={merchantId} />
          
          {/* ✅ SYNC FIX: Explicitly set type to satisfy Zod Enum validation */}
          <input type="hidden" name="type" value="PERCENTAGE" />

          {/* --- 🛡️ COMPRESSED COMMAND HUD --- */}
          <div className="shrink-0 p-6 md:p-8 border-b border-white/5 bg-white/[0.02]">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "size-10 md:size-12 rounded-xl md:rounded-2xl flex items-center justify-center border shadow-inner transition-colors",
                  isStaffTheme ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                )}>
                  {isStaffTheme ? <Globe className="size-5 md:size-6" /> : <Zap className="size-5 md:size-6" />}
                </div>
                <div className="leading-none overflow-hidden">
                  <DialogTitle className="text-xl md:text-3xl font-black italic uppercase tracking-tighter text-foreground truncate">
                    Campaign <span className={isStaffTheme ? "text-amber-500" : "text-primary"}>Deploy</span>
                  </DialogTitle>
                  <DialogDescription className="text-[7.5px] md:text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] mt-1.5 italic truncate">
                    {isStaffTheme ? "Protocol: Global_Oversight_Sync" : `Node: ${merchantId.slice(0, 12).toUpperCase()}`}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* --- 🚀 TACTICAL SLIM CONTENT --- */}
          <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">Protocol_Identity</Label>
                <button type="button" onClick={generateCode} className="text-[7.5px] font-black uppercase tracking-widest text-primary hover:opacity-100 opacity-30 transition-opacity italic">Auto_Gen</button>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1 group">
                  <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/10 group-focus-within:text-primary transition-colors" />
                  <Input
                    name="code"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                    placeholder="E.G. ALPHA_NODE_2026"
                    required
                    className="h-12 md:h-14 pl-10 rounded-xl md:rounded-2xl font-mono font-black text-xs md:text-sm tracking-widest bg-white/[0.02] border-white/5"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateCode}
                  className="size-12 md:size-14 rounded-xl md:rounded-2xl border-white/5 bg-white/[0.02] active:scale-90 transition-all"
                >
                  <RefreshCw className={cn("size-4 md:size-5", isStaffTheme ? "text-amber-500" : "text-primary")} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic ml-1">Reduction (%)</Label>
                {/* ✅ SYNC FIX: Changed name to 'value' to match server-side amount logic */}
                <Input
                  name="value"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="10"
                  required
                  className="h-12 md:h-14 px-4 rounded-xl md:rounded-2xl border-white/5 bg-white/[0.02] font-black text-sm italic"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic ml-1">Usage_Cap</Label>
                <Input
                  name="maxUses"
                  type="number"
                  placeholder="INF_LIMIT"
                  className="h-12 md:h-14 px-4 rounded-xl md:rounded-2xl border-white/5 bg-white/[0.02] font-black text-sm italic"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[7.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic ml-1">Target_Service_Node</Label>
              <div className="relative group">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/20 group-focus-within:text-primary transition-colors" />
                <select
                  name="serviceId"
                  className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl border border-white/5 bg-white/[0.02] pl-12 pr-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] outline-none appearance-none italic transition-all"
                >
                  <option value="global" className="bg-zinc-900">GLOBAL_CLUSTER (ALL_SERVICES)</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id} className="bg-zinc-900">{s.name.toUpperCase()}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-3 opacity-20 pointer-events-none" />
              </div>
            </div>
            
            <div className={cn("flex items-start gap-3 p-4 rounded-xl md:rounded-2xl border", isStaffTheme ? "bg-amber-500/5 border-amber-500/10" : "bg-primary/5 border-primary/10")}>
              <ShieldCheck className={cn("size-4 shrink-0 mt-0.5", isStaffTheme ? "text-amber-500" : "text-primary")} />
              <p className="text-[7.5px] md:text-[8px] font-black text-muted-foreground/50 uppercase tracking-widest leading-relaxed italic">
                {isStaffTheme ? "Universal overrides grant 100% bypass on all platform gateway protocols." : "Vouchers grant instant VIP access bypassing gateway settlement layers."}
              </p>
            </div>
          </div>

          <div className={cn(
            "p-5 md:p-8 border-t border-white/5 bg-white/[0.01] flex items-center justify-end gap-3",
            isMobile && "pb-[calc(env(safe-area-inset-bottom)+1.5rem)]"
          )}>
            <Button
              type="button"
              variant="ghost"
              onClick={() => { impact("light"); setOpen(false); }}
              className="h-10 px-6 rounded-lg font-black uppercase italic tracking-widest text-[8px] md:text-[9px] opacity-30 hover:opacity-100 transition-all"
            >
              Abort_Sync
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                "min-w-[160px] md:min-w-[200px] h-12 md:h-14 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] md:text-[11px] shadow-lg transition-all active:scale-95",
                isStaffTheme ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-primary text-white shadow-primary/20"
              )}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span>Provisioning...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Cpu className="size-4" />
                  <span>Deploy_Node</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}