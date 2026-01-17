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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 🛠️ UTILS & TELEMETRY
import {
  Ticket, Loader2, Zap, ShieldCheck, RefreshCw,
  Terminal, Globe, Activity, Cpu, Fingerprint
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useLayout } from "@/context/layout-provider";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🌊 CREATE_CAMPAIGN_MODAL (Institutional Apex v2026.1.15)
 * Strategy: morphology-aware safe-area clamping with Obsidian-OLED depth.
 * Logic: Independent content engine with pinned atmospheric radiances.
 */
export function CreateCouponModal({ merchantId }: { merchantId: string }) {
  const [open, setOpen] = useState(false);
  const [customCode, setCustomCode] = useState("");
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  
  const { impact, notification, selectionChange } = useHaptics();
  const { flavor } = useLayout();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  
  const [state, formAction, isPending] = useActionState(createCouponAction, null);
  const isStaffTheme = flavor === "AMBER";

  // 📡 SERVICE DISCOVERY: Handshake Protocol
  useEffect(() => {
    if (open && merchantId && isReady) {
      fetch(`/api/merchant/${merchantId}/services`)
        .then((res) => res.json())
        .then((data) => setServices(data))
        .catch((err) => console.error("SIGNAL_FETCH_FAILURE", err));
    }
  }, [open, merchantId, isReady]);

  // 🔄 HYDRATION SYNC: Broadcast Result
  useEffect(() => {
    if (state?.success && !isPending) {
      notification("success");
      toast.success("CAMPAIGN_LIVE", { description: "Discount node broadcasted." });
      setOpen(false);
      setCustomCode("");
    }
    if (state?.error && !isPending) notification("error");
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
            "rounded-2xl md:rounded-3xl h-14 md:h-16 px-8 shadow-apex transition-all hover:scale-[1.02] active:scale-95 group border-none",
            isStaffTheme ? "bg-amber-500 text-black shadow-apex-amber" : "bg-primary text-white shadow-apex-primary"
          )}
        >
          <div className="size-6 rounded-lg bg-black/10 flex items-center justify-center mr-3 transition-transform group-hover:rotate-12">
            <Ticket className="size-4" />
          </div>
          <span className="font-black uppercase italic tracking-[0.3em] text-[10px]">Initialize_Campaign</span>
        </Button>
      </DialogTrigger>

      <DialogContent 
        className={cn(
          "max-w-2xl border-white/5 bg-background/60 backdrop-blur-3xl shadow-apex p-0 overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          isMobile ? "fixed bottom-0 translate-y-0 rounded-t-[3rem] rounded-b-none w-full" : "rounded-[3.5rem]"
        )}
        style={{ 
          maxHeight: isMobile ? '94vh' : '85vh',
          paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1rem)` : '0px'
        }}
      >
        {/* 🧪 THE VAPOUR MASK: Kinetic Glass Ingress */}
        <div className={cn(
          "absolute inset-0 opacity-10 blur-[100px] pointer-events-none transition-colors duration-[2000ms]",
          isStaffTheme ? "bg-amber-500" : "bg-primary"
        )} />

        <form action={formAction} className="flex flex-col h-full relative z-10">
          <input type="hidden" name="merchantId" value={merchantId} />

          <div className="flex-1 overflow-y-auto p-8 md:p-14 space-y-12 custom-scrollbar">
            <DialogHeader className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "size-14 md:size-16 rounded-2xl md:rounded-[1.8rem] flex items-center justify-center shadow-inner border transition-colors",
                    isStaffTheme ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                  )}>
                    {isStaffTheme ? <Globe className="size-7" /> : <Zap className="size-7 fill-current" />}
                  </div>
                  <div>
                    <DialogTitle className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none text-foreground">
                      Campaign <span className={isStaffTheme ? "text-amber-500" : "text-primary"}>Deploy</span>
                    </DialogTitle>
                    <div className="flex items-center gap-3 mt-3 opacity-30 italic leading-none">
                      <Activity className="size-3 animate-pulse text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground">Protocol_Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-10 md:space-y-14">
              {/* --- Code Identity Node --- */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <Label className={cn("text-[10px] md:text-[11px] uppercase font-black italic tracking-[0.4em] leading-none", isStaffTheme ? "text-amber-500" : "text-primary")}>
                    Protocol_Identity_Code
                  </Label>
                  <button type="button" onClick={generateCode} className="text-[8px] font-black uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity italic">Auto_Generate</button>
                </div>
                <div className="flex gap-4">
                  <div className="relative flex-1 group">
                    <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/20 group-focus-within:text-primary transition-colors" />
                    <Input
                      name="code"
                      value={customCode}
                      onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                      placeholder="EX: ALPHA_NODE_2026"
                      required
                      className={cn(
                        "h-16 md:h-20 pl-16 rounded-2xl md:rounded-[2rem] font-mono font-black text-lg tracking-widest bg-white/[0.02] border-white/5 transition-all focus:bg-white/[0.04] text-foreground",
                        isStaffTheme ? "focus:border-amber-500/20" : "focus:border-primary/20"
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateCode}
                    className="size-16 md:size-20 rounded-2xl md:rounded-[2rem] border-white/5 bg-white/[0.02] group transition-all active:scale-90 hover:bg-white/5"
                  >
                    <RefreshCw className={cn("size-6 group-active:rotate-180 transition-transform duration-1000", isStaffTheme ? "text-amber-500" : "text-primary")} />
                  </Button>
                </div>
              </div>

              {/* --- Financial Variables --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                <div className="space-y-4">
                  <Label className={cn("text-[10px] uppercase font-black italic tracking-[0.4em] ml-2 leading-none", isStaffTheme ? "text-amber-500" : "text-primary")}>Reduction (%)</Label>
                  <Input
                    name="discountPercent"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="10"
                    required
                    className="h-16 md:h-20 px-8 rounded-2xl md:rounded-[2rem] border-white/5 bg-white/[0.02] font-black text-xl italic text-foreground placeholder:opacity-10"
                  />
                </div>
                <div className="space-y-4">
                  <Label className={cn("text-[10px] uppercase font-black italic tracking-[0.4em] ml-2 leading-none", isStaffTheme ? "text-amber-500" : "text-primary")}>Usage_Cap</Label>
                  <Input
                    name="maxUses"
                    type="number"
                    placeholder="INF_LIMIT"
                    className="h-16 md:h-20 px-8 rounded-2xl md:rounded-[2rem] border-white/5 bg-white/[0.02] font-black text-xl italic text-foreground placeholder:opacity-10"
                  />
                </div>
              </div>

              {/* --- Targeting Matrix --- */}
              <div className="space-y-4">
                <Label className={cn("text-[10px] uppercase font-black italic tracking-[0.4em] ml-2 leading-none", isStaffTheme ? "text-amber-500" : "text-primary")}>Target_Service_Node</Label>
                <div className="relative">
                  <select
                    name="serviceId"
                    className="w-full h-16 md:h-20 rounded-2xl md:rounded-[2rem] border border-white/5 bg-white/[0.02] px-8 text-[10px] font-black uppercase tracking-[0.3em] cursor-pointer outline-none focus:ring-1 focus:ring-primary/20 appearance-none focus:bg-white/[0.04] transition-all text-foreground italic"
                  >
                    <option value="global" className="bg-background">GLOBAL_CLUSTER (ALL_SERVICES)</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id} className="bg-background">{s.name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div className={cn("flex items-center gap-6 p-8 rounded-[2rem] border transition-all", isStaffTheme ? "bg-amber-500/[0.03] border-amber-500/10" : "bg-primary/[0.03] border-primary/10")}>
                  <ShieldCheck className={cn("size-6 shrink-0 animate-pulse", isStaffTheme ? "text-amber-500" : "text-primary")} />
                  <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] leading-relaxed italic">
                    Vouchers (100% OFF) grant instant <span className="text-foreground/60">VIP_ACCESS</span> bypassing standard gateway protocols.
                  </p>
                </div>
              </div>
            </div>

            {state?.error && (
              <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-6 animate-in shake-200">
                <p className="text-[10px] font-black uppercase text-rose-500 text-center tracking-widest italic leading-none">
                  FAULT: {state.error}
                </p>
              </div>
            )}
          </div>

          {/* --- Footer Assembly: Apex Horizon --- */}
          <div className="p-8 md:p-14 flex flex-col md:flex-row items-center justify-end gap-6 border-t border-white/5 bg-white/[0.01] backdrop-blur-2xl">
            <Button
              type="button"
              variant="ghost"
              onClick={() => { impact("light"); setOpen(false); }}
              className="w-full md:w-auto h-14 px-10 rounded-2xl md:rounded-3xl font-black uppercase italic tracking-[0.4em] text-[10px] opacity-20 hover:opacity-100 transition-all text-foreground"
            >
              Abort_Provision
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                "w-full md:w-auto min-w-[280px] h-14 md:h-20 rounded-2xl md:rounded-3xl shadow-apex transition-all border-none italic",
                isStaffTheme ? "bg-amber-500 text-black shadow-apex-amber" : "bg-primary text-white shadow-apex-primary"
              )}
            >
              {isPending ? (
                <div className="flex items-center gap-4">
                  <Loader2 className="size-4 animate-spin" />
                  <span className="font-black uppercase tracking-[0.3em] text-[10px]">Syncing_Block...</span>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Cpu className="size-5" />
                  <span className="font-black uppercase tracking-[0.3em] text-[10px]">Initialize_Campaign</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}