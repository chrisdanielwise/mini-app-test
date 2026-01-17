"use client";

import * as React from "react";
import { 
  User, ShieldCheck, Key, LogOut, Terminal, 
  Fingerprint, Lock, Globe, Building2, Activity, Cpu,
  Zap, Save
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Shells & Components
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 🏛️ Tactical Ingress Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

/**
 * 🌊 IDENTITY_TERMINAL (Institutional Apex v2026.1.16)
 * Strategy: Build Error Resolution + Defensive Ingress.
 * Aesthetics: Obsidian Depth | Water-Ease Ingress.
 */
export default function MerchantProfilePage({ session: serverSession, merchant: initialMerchant }: any) {
  const { flavor, mounted } = useLayout();
  const { impact } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  const { user: authUser, isAuthenticated } = useInstitutionalAuth();

  // 🛡️ CHROMA RESOLUTION
  const isPlatformStaff = flavor === "AMBER";
  
  // 🛡️ CRASH SHIELD: Safe-null fallbacks for identity resolution
  const session = serverSession || {};
  const currentUser = session?.user || authUser || {};
  const realMerchantId = session?.merchantId;
  const merchant = initialMerchant || {};

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!mounted || !isReady) return (
    <div className="min-h-screen bg-black/40 flex items-center justify-center animate-pulse">
       <Cpu className="size-12 text-primary/20" />
    </div>
  );

  return (
    <div 
      className={cn(
        "max-w-[1600px] mx-auto space-y-10 md:space-y-16 pb-24 px-6 md:px-12 transition-all duration-1000",
        "animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      )}
    >
      {/* --- COMMAND HUD HEADER: Morphology-Aware Scaling --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10 relative group">
        <div className="space-y-6">
          <div className="flex items-center gap-4 italic opacity-40">
            <Fingerprint className={cn("size-4", isPlatformStaff ? "text-amber-500 animate-pulse" : "text-primary")} />
            <div className="flex flex-col">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.5em] leading-none",
                isPlatformStaff ? "text-amber-500" : "text-primary"
              )}>
                {isPlatformStaff ? "Platform_Root_Identity" : "Merchant_Node_Identity"}
              </span>
              <span className="text-[7px] font-mono uppercase tracking-widest mt-1 opacity-50">Auth_Protocol_v16.31</span>
            </div>
          </div>
          
          <div className="space-y-3">
             <h1 className="text-[clamp(2.5rem,10vw,4.5rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
                Account <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Profile</span>
             </h1>
             <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.4em] italic leading-none">
                Node_Owner: {currentUser?.fullName || "ROOT_ADMIN"}
             </p>
          </div>
        </div>

        <div className="shrink-0 relative z-20">
          <Button 
            onClick={() => impact("heavy")}
            className={cn(
              "h-14 md:h-16 px-10 rounded-2xl md:rounded-[1.4rem] font-black uppercase italic tracking-[0.3em] text-[11px] shadow-2xl transition-all duration-1000 active:scale-95 w-full md:w-auto",
              isPlatformStaff ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-primary text-white shadow-primary/20"
            )}
          >
            Deploy_Changes
          </Button>
        </div>
      </div>

      {/* --- CONTENT MATRIX: Adaptive 2+1 Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        
        {/* --- LEFT: PERSONAL TELEMETRY --- */}
        <div className="lg:col-span-2 space-y-8">
          <section className={cn(
            "rounded-[3rem] border p-8 md:p-14 backdrop-blur-3xl shadow-2xl relative overflow-hidden group transition-all duration-1000",
            isPlatformStaff ? "bg-amber-500/[0.02] border-amber-500/10 shadow-amber-500/5" : "bg-black/40 border-white/5"
          )}>
            <div className="relative z-10 space-y-10">
              <div className="flex items-center gap-4 border-b border-white/5 pb-6 opacity-40">
                <User className={cn("size-4", isPlatformStaff ? "text-amber-500" : "text-primary")} />
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] italic">Personal_Manifest</h2>
              </div>
              
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-4">
                  <Label className="text-[9px] font-black uppercase tracking-[0.3em] ml-1 opacity-30 italic">Legal_Label</Label>
                  <Input 
                    defaultValue={currentUser?.fullName || "Administrative Node"} 
                    className="h-12 rounded-xl border-white/5 bg-white/[0.03] px-6 font-black uppercase italic text-xs tracking-widest focus:ring-primary/10 transition-all" 
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-[9px] font-black uppercase tracking-[0.3em] ml-1 opacity-30 italic">Handshake_ID</Label>
                  <div className="relative">
                    <Terminal className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground opacity-20" />
                    <Input 
                      defaultValue={currentUser?.id?.slice(0, 16).toUpperCase() || "PENDING"} 
                      className="h-12 rounded-xl border-white/5 bg-white/[0.01] pl-14 font-mono text-[10px] opacity-20 cursor-not-allowed italic" 
                      disabled 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Terminal className="absolute -bottom-10 -right-10 size-48 opacity-[0.01] pointer-events-none -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
          </section>

          {/* Integration Status / Merchant Info */}
          {!isPlatformStaff && (
            <div className="p-8 rounded-[2.5rem] bg-black/40 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl animate-in slide-in-from-bottom-4 duration-1000">
              <div className="flex items-center gap-6">
                <div className="size-14 shrink-0 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                  <Building2 className="size-6" />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-30 italic leading-none">Linked_Merchant_Node</p>
                  <p className="text-sm font-black uppercase italic tracking-tighter text-foreground mt-1.5 leading-none">{merchant?.companyName || "INITIALIZING..."}</p>
                </div>
              </div>
              <div className="text-center sm:text-right opacity-10 italic">
                <p className="text-[9px] font-black uppercase tracking-widest leading-none">Sync_Stable</p>
                <p className="text-[11px] font-mono font-bold mt-2 tracking-tighter">NODE_{realMerchantId?.slice(-10).toUpperCase() || "ROOT"}</p>
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT: SECURITY HUD --- */}
        <div className="space-y-8">
          <section className={cn(
            "rounded-[2.8rem] md:rounded-[3rem] border p-10 backdrop-blur-3xl shadow-2xl space-y-10 transition-all duration-1000",
            isPlatformStaff ? "bg-amber-500/[0.02] border-amber-500/10 shadow-amber-500/5" : "bg-black/40 border-white/5"
          )}>
            <div className="flex items-center gap-4 text-primary/40 opacity-40">
              <ShieldCheck className={cn("size-5", isPlatformStaff ? "text-amber-500" : "text-primary")} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] italic">Access_Protocol</h2>
            </div>
            
            <div className="space-y-8">
              <div className={cn(
                "rounded-2xl border p-6 shadow-inner",
                isPlatformStaff ? "bg-amber-500/[0.05] border-amber-500/10" : "bg-primary/5 border-primary/10"
              )}>
                <p className={cn("text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mb-3 italic", isPlatformStaff ? "text-amber-500" : "text-primary")}>Clearance_Level</p>
                <p className={cn("text-xl font-black italic uppercase tracking-tighter truncate leading-none", isPlatformStaff ? "text-amber-500" : "text-primary")}>
                  {isPlatformStaff ? "PLATFORM_ROOT" : "MERCHANT_NODE"}
                </p>
              </div>

              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  onClick={() => impact("medium")}
                  className="w-full h-14 rounded-2xl border-white/5 bg-white/[0.02] font-black uppercase italic text-[10px] tracking-[0.3em] hover:bg-primary/10 hover:text-primary transition-all group text-foreground shadow-lg"
                >
                  <Key className="mr-3 size-4 group-hover:rotate-45 transition-transform duration-700" />
                  Rotate_Access_Key
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={() => impact("heavy")}
                  className="w-full h-12 rounded-2xl text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/5 font-black uppercase italic text-[9px] tracking-[0.4em] transition-all"
                >
                  <LogOut className="mr-3 size-4" />
                  Terminate_Session
                </Button>
              </div>
            </div>
          </section>

          <div className="px-6 space-y-4 opacity-10 italic">
            <div className="flex items-center gap-4">
               <Lock className="size-4" />
               <p className="text-[9px] font-black uppercase tracking-[0.5em] leading-none">Security_Broadcasting</p>
            </div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed tracking-widest">
              Identity changes broadcasted to node cluster. Unauthorized vectors trigger automated protocol lockout.
            </p>
          </div>
        </div>
      </div>

      {/* --- FOOTER SIGNAL --- */}
      <div 
        className="flex flex-col md:flex-row items-center justify-center gap-6 opacity-10 py-16 border-t border-white/5"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 2rem)` : "4rem" }}
      >
        <div className="flex items-center gap-4">
           <Globe className={cn("size-4 animate-pulse", isPlatformStaff ? "text-amber-500" : "text-primary")} />
           <p className="text-[10px] font-black uppercase tracking-[0.6em] text-foreground italic text-center leading-none">
             Administrative_Core_Synchronized // Node_Ref_{realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "ROOT"}
           </p>
        </div>
        {!isMobile && (
          <div className="flex items-center gap-4">
            <Cpu className="size-4" />
            <span className="text-[8px] font-mono tabular-nums">[v16.31_STABLE]</span>
          </div>
        )}
      </div>
    </div>
  );
}