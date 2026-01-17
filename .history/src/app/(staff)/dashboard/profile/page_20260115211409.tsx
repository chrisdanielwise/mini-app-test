import { requireStaff } from "@/lib/auth/session";
import { getMerchantById } from "@/lib/services/merchant.service";
import { 
  User, ShieldCheck, Key, LogOut, Terminal, 
  Fingerprint, Lock, Globe, Building2, Activity, Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Shells & Components
import { DashboardShell, DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * 🌊 IDENTITY_TERMINAL (Institutional Apex v2026.1.15)
 * Architecture: RBAC-Aware Adaptive Membrane.
 * Aesthetics: Obsidian Depth | Water-Ease Ingress.
 */
export default async function MerchantProfilePage() {
  const session = await requireStaff();
  
  // 🛡️ IDENTITY EXTRACTION
  const { role } = session.user;
  const realMerchantId = session.merchantId;
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support", "amber"].includes(role);
  
  // 🛰️ DATA INGRESS: Selective Telemetry Retrieval
  const merchant = realMerchantId ? await getMerchantById(realMerchantId) : null;

  // 🛡️ PASSIVE GUARD: Offline Node Detection
  if (!isPlatformStaff && !merchant) {
    return (
      <DashboardShell>
        <div className="flex h-[50vh] flex-col items-center justify-center animate-in fade-in zoom-in duration-1000">
          <Terminal className="size-12 text-rose-500/20 mb-6" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-500 italic">
            Error: Identity_Node_Offline
          </p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      {/* --- COMMAND HUD HEADER: Morphology-Aware Scaling --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10 relative group">
        <div className="space-y-6">
          <div className="flex items-center gap-4 italic opacity-40">
            <Fingerprint className={cn("size-4", isPlatformStaff ? "text-amber-500 animate-pulse" : "text-primary")} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] leading-none">
                {isPlatformStaff ? "Platform_Root_Identity" : "Merchant_Node_Identity"}
              </span>
              <span className="text-[7px] font-black uppercase tracking-widest mt-1">Auth_Protocol_v16.31</span>
            </div>
          </div>
          
          <DashboardHeader 
            title="Account Profile" 
            subtitle={`Node_Owner: ${session.user?.fullName || "ROOT_ADMIN"}`} 
          />
        </div>

        <div className="shrink-0 relative z-20">
          <Button className={cn(
            "h-14 md:h-16 px-10 rounded-2xl md:rounded-[1.4rem] font-black uppercase italic tracking-[0.3em] text-[11px] shadow-apex transition-all duration-1000 active:scale-95 w-full md:w-auto",
            isPlatformStaff ? "bg-amber-500 text-black shadow-apex-amber" : "bg-primary text-white shadow-apex-primary"
          )}>
            Deploy_Changes
          </Button>
        </div>
      </div>

      {/* --- CONTENT MATRIX: Adaptive 2+1 Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        
        {/* --- LEFT: PERSONAL TELEMETRY --- */}
        <div className="lg:col-span-2 space-y-8">
          <section className="rounded-[3rem] border border-white/5 bg-card/30 p-8 md:p-14 backdrop-blur-3xl shadow-apex relative overflow-hidden group">
            <div className="relative z-10 space-y-10">
              <div className="flex items-center gap-4 border-b border-white/5 pb-6 opacity-40">
                <User className="size-4 text-primary" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] italic">Personal_Manifest</h2>
              </div>
              
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] ml-1 text-primary/40">Legal_Label</Label>
                  <Input 
                    defaultValue={session.user?.fullName || "Administrative Node"} 
                    className="h-14 rounded-2xl border-white/5 bg-white/[0.03] px-6 font-black uppercase italic text-xs tracking-widest focus:ring-primary/10 transition-all" 
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] ml-1 text-primary/40">Telegram_Handshake</Label>
                  <div className="relative">
                    <Terminal className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground opacity-20" />
                    <Input 
                      defaultValue={session.user?.telegramId || ""} 
                      className="h-14 rounded-2xl border-white/5 bg-white/[0.01] pl-14 font-mono text-[10px] opacity-20 cursor-not-allowed italic" 
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
            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-apex animate-in slide-in-from-bottom-4 duration-1000">
              <div className="flex items-center gap-6">
                <div className="size-14 shrink-0 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                  <Building2 className="size-6" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-30 italic">Linked_Merchant_Node</p>
                  <p className="text-sm font-black uppercase italic tracking-tighter text-foreground">{merchant?.companyName || "N/A"}</p>
                </div>
              </div>
              <div className="text-center sm:text-right opacity-10 italic">
                <p className="text-[9px] font-black uppercase tracking-widest leading-none">Sync_Stable</p>
                <p className="text-[11px] font-mono font-bold mt-2 tracking-tighter">NODE_{realMerchantId?.slice(-10).toUpperCase()}</p>
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT: SECURITY HUD --- */}
        <div className="space-y-8">
          <section className="rounded-[3rem] border border-white/5 bg-card/30 p-10 backdrop-blur-3xl shadow-apex space-y-10">
            <div className="flex items-center gap-4 text-primary/40 opacity-40">
              <ShieldCheck className="size-5" />
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
                <Button variant="outline" className="w-full h-14 rounded-2xl border-white/5 bg-white/[0.02] font-black uppercase italic text-[10px] tracking-[0.3em] hover:bg-primary hover:text-white transition-all group text-foreground shadow-apex">
                  <Key className="mr-3 size-4 group-hover:rotate-45 transition-transform duration-700" />
                  Rotate_Access_Key
                </Button>
                
                <Button variant="ghost" className="w-full h-12 rounded-2xl text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/5 font-black uppercase italic text-[9px] tracking-[0.4em] transition-all">
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
            <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed tracking-widest">
              Identity changes broadcasted to node cluster. Unauthorized vectors trigger automated protocol lockout.
            </p>
          </div>
        </div>
      </div>

      {/* --- FOOTER SIGNAL --- */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 opacity-10 py-16 border-t border-white/5">
        <div className="flex items-center gap-4">
           <Globe className="size-4" />
           <p className="text-[10px] font-black uppercase tracking-[0.6em] text-foreground italic text-center leading-none">
             Administrative_Core_Synchronized // Node_Ref_{realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "ROOT"}
           </p>
        </div>
        {!isPlatformStaff && (
          <div className="flex items-center gap-4">
            <Cpu className="size-4" />
            <span className="text-[8px] font-mono tabular-nums">[v16.31_STABLE]</span>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}