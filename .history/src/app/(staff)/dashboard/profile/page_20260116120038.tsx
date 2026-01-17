"use client";

import * as React from "react";
import { 
  User, ShieldCheck, Key, LogOut, Terminal, 
  Fingerprint, Lock, Globe, Building2, Activity, Cpu,
  Zap, Save
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Shells & Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 🏛️ Tactical Ingress Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

/**
 * 🛰️ IDENTITY_TERMINAL (Institutional Apex v2026.1.20)
 * Strategy: Stationary HUD & Independent Tactical Scroll.
 * Fix: High-density geometry prevents vertical blowout of profile nodes.
 */
export default function MerchantProfilePage({ session: serverSession, merchant: initialMerchant }: any) {
  const { flavor, mounted } = useLayout();
  const { impact } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  const { user: authUser } = useInstitutionalAuth();

  // 🛡️ IDENTITY RESOLUTION
  const isPlatformStaff = flavor === "AMBER";
  const session = serverSession || {};
  const currentUser = session?.user || authUser || {};
  const realMerchantId = session?.merchantId;
  const merchant = initialMerchant || {};

  // 🛡️ HYDRATION SHIELD
  if (!mounted || !isReady) return (
    <div className="h-screen w-full flex items-center justify-center bg-black">
       <Cpu className="size-10 text-primary/20 animate-pulse" />
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col min-w-0 overflow-hidden text-foreground bg-black">
      
      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Header --- */}
      <div 
        className="shrink-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 pb-4 pt-2"
        style={{ paddingTop: isMobile ? `calc(${safeArea.top}px + 0.5rem)` : "0.5rem" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 px-6">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-3 italic opacity-30">
              <Fingerprint className={cn("size-3.5", isPlatformStaff ? "text-amber-500 animate-pulse" : "text-primary")} />
              <span className={cn(
                "text-[8px] font-black uppercase tracking-[0.4em] leading-none",
                isPlatformStaff ? "text-amber-500" : "text-primary"
              )}>
                {isPlatformStaff ? "Platform_Root_Identity" : "Merchant_Node_Identity"}
              </span>
            </div>
            
            <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none truncate">
              Account <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Profile</span>
            </h1>
            
            <p className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-[0.3em] italic leading-none truncate">
              Node_Owner: {currentUser?.fullName || "ROOT_ADMIN"}
            </p>
          </div>

          <div className="shrink-0 scale-90 origin-bottom-right">
            <Button 
              onClick={() => impact("heavy")}
              className={cn(
                "h-10 px-6 rounded-xl font-black uppercase italic tracking-[0.2em] text-[10px] shadow-2xl transition-all",
                isPlatformStaff ? "bg-amber-500 text-black shadow-amber-500/10" : "bg-primary text-white shadow-primary/20"
              )}
            >
              Deploy_Changes
            </Button>
          </div>
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: Independent Profile Matrix --- */}
      <div className="flex-1 min-h-0 w-full relative overflow-y-auto custom-scrollbar px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* --- LEFT: PERSONAL TELEMETRY --- */}
          <div className="lg:col-span-2 space-y-6">
            <section className={cn(
              "rounded-[1.8rem] border p-6 md:p-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden group",
              isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-black/40 border-white/5"
            )}>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4 opacity-20">
                  <User className={cn("size-3.5", isPlatformStaff ? "text-amber-500" : "text-primary")} />
                  <h2 className="text-[8px] font-black uppercase tracking-[0.3em] italic">Personal_Manifest</h2>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-[7px] font-black uppercase tracking-[0.2em] opacity-20 italic">Legal_Label</Label>
                    <Input 
                      defaultValue={currentUser?.fullName || "Administrative Node"} 
                      className="h-10 rounded-lg border-white/5 bg-white/[0.02] px-4 font-black uppercase italic text-[10px] tracking-widest focus:ring-primary/10" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[7px] font-black uppercase tracking-[0.2em] opacity-20 italic">Handshake_ID</Label>
                    <div className="relative">
                      <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 size-3 text-muted-foreground opacity-20" />
                      <Input 
                        defaultValue={currentUser?.id?.slice(0, 16).toUpperCase() || "PENDING"} 
                        className="h-10 rounded-lg border-white/5 bg-white/[0.01] pl-10 font-mono text-[9px] opacity-20 cursor-not-allowed italic" 
                        disabled 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {!isPlatformStaff && (
              <div className="p-6 rounded-[1.5rem] bg-black/40 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="size-10 shrink-0 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                    <Building2 className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-20 leading-none">Linked_Node</p>
                    <p className="text-[11px] font-black uppercase italic tracking-tighter text-foreground mt-1 leading-none truncate">{merchant?.companyName || "INITIALIZING..."}</p>
                  </div>
                </div>
                <div className="text-right opacity-10 italic hidden sm:block">
                  <p className="text-[7px] font-black uppercase tracking-widest leading-none">Sync_Stable</p>
                  <p className="text-[9px] font-mono font-bold mt-1">NODE_{realMerchantId?.slice(-8).toUpperCase() || "ROOT"}</p>
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT: SECURITY HUD --- */}
          <div className="space-y-6">
            <section className={cn(
              "rounded-[1.8rem] border p-6 backdrop-blur-3xl shadow-2xl space-y-6",
              isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-black/40 border-white/5"
            )}>
              <div className="flex items-center gap-3 opacity-20">
                <ShieldCheck className={cn("size-4", isPlatformStaff ? "text-amber-500" : "text-primary")} />
                <h2 className="text-[8px] font-black uppercase tracking-[0.3em] italic">Access_Protocol</h2>
              </div>
              
              <div className="space-y-4">
                <div className={cn(
                  "rounded-xl border p-4 shadow-inner",
                  isPlatformStaff ? "bg-amber-500/[0.03] border-amber-500/10" : "bg-primary/5 border-primary/10"
                )}>
                  <p className={cn("text-[7px] font-black uppercase tracking-[0.3em] opacity-20 mb-2 italic", isPlatformStaff ? "text-amber-500" : "text-primary")}>Clearance</p>
                  <p className={cn("text-lg font-black italic uppercase tracking-tighter truncate leading-none", isPlatformStaff ? "text-amber-500" : "text-primary")}>
                    {isPlatformStaff ? "PLATFORM_ROOT" : "MERCHANT_NODE"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    onClick={() => impact("medium")}
                    className="w-full h-11 rounded-xl border-white/5 bg-white/[0.02] font-black uppercase italic text-[9px] tracking-[0.2em] hover:bg-primary/5"
                  >
                    <Key className="mr-2 size-3.5 opacity-40" />
                    Rotate_Key
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => impact("heavy")}
                    className="w-full h-9 rounded-xl text-rose-500/30 hover:text-rose-500 hover:bg-rose-500/5 font-black uppercase italic text-[8px] tracking-[0.3em]"
                  >
                    Terminate_Session
                  </Button>
                </div>
              </div>
            </section>

            <div className="px-4 space-y-3 opacity-10 italic">
               <div className="flex items-center gap-3">
                 <Lock className="size-3" />
                 <p className="text-[8px] font-black uppercase tracking-[0.4em]">Security_Broadcast</p>
               </div>
               <p className="text-[7px] font-bold text-muted-foreground uppercase leading-relaxed tracking-widest">
                 Identity changes trigger cluster protocol lockout.
               </p>
            </div>
          </div>
        </div>

        {/* --- FOOTER SIGNAL --- */}
        <div className="flex items-center justify-center gap-4 opacity-10 pt-8 pb-12">
           <Globe className={cn("size-3.5 animate-pulse", isPlatformStaff ? "text-amber-500" : "text-primary")} />
           <p className="text-[7px] font-black uppercase tracking-[0.5em] italic">
             Identity Sync Stable // Node_Ref_{realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "ROOT"}
           </p>
        </div>
      </div>
    </div>
  );
}