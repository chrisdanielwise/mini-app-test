import { requireStaff } from "@/lib/auth/session";
import { getMerchantById } from "@/lib/services/merchant.service"; // 🛡️ Updated Named Export
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Key, 
  LogOut, 
  Terminal, 
  Fingerprint, 
  Lock, 
  BadgeCheck,
  Globe,
  Building2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * 🏛️ ADMINISTRATIVE IDENTITY TERMINAL (Institutional v9.3.6)
 * Fix: RBAC-Aware rendering for Super Admins (merchantId: null).
 * Fix: Null-safe footer display for platform-root nodes.
 */
export default async function MerchantProfilePage() {
  const session = await requireStaff();
  const realMerchantId = session.merchantId;
  const isSuperAdmin = session.user.role === "super_admin";
  
  // 🛰️ 2. Fetch Merchant telemetry ONLY if not Super Admin
  // Super Admins operate at the Platform Core level, not the Merchant Node level.
  const merchant = realMerchantId ? await getMerchantById(realMerchantId) : null;

  // 🛡️ PASSIVE GUARD: If it's a merchant role but no ID is found, the node is offline.
  if (!isSuperAdmin && !merchant) {
    return (
      <div className="flex h-[60vh] items-center justify-center animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <Terminal className="h-8 w-8 text-rose-500 mx-auto opacity-20" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 leading-none">
            Error: Identity_Node_Offline
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 px-4 text-foreground">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <div className="flex items-center gap-2 text-primary/60">
            <Fingerprint className="h-4 w-4 shrink-0 fill-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-80 whitespace-nowrap">
              {isSuperAdmin ? "Platform Root Identity" : "Merchant Node Identity"}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none">
              Account <span className="text-primary">Profile</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic truncate break-all">
              Node_Owner: <span className="text-foreground">{session.user?.fullName || "ROOT_ADMIN"}</span>
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto shrink-0">
          <Button className="w-full sm:w-auto h-11 px-6 rounded-xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            Deploy Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* --- LEFT: PERSONAL TELEMETRY --- */}
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl border border-border/40 bg-card/40 p-6 md:p-8 backdrop-blur-3xl shadow-xl relative overflow-hidden group transition-all">
            <div className="relative z-10 space-y-6 md:space-y-8">
              <div className="flex items-center gap-3 border-b border-border/10 pb-4">
                <User className="h-4 w-4 text-primary/60" />
                <h2 className="text-[10px] font-black uppercase tracking-widest">Personal Manifest</h2>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest ml-1 text-primary/70">Legal Label</Label>
                  <Input 
                    defaultValue={session.user?.fullName || "Administrative Node"} 
                    className="h-11 rounded-xl border-border/40 bg-muted/10 px-4 font-black uppercase italic text-xs tracking-tight focus:ring-primary/20" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest ml-1 text-primary/70">Telegram ID</Label>
                  <div className="relative">
                    <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-20" />
                    <Input 
                      defaultValue={session.user?.telegramId || ""} 
                      className="h-11 rounded-xl border-border/40 bg-muted/5 pl-10 font-bold text-xs opacity-40 cursor-not-allowed" 
                      disabled 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Terminal className="absolute -bottom-6 -right-6 h-32 w-32 opacity-[0.02] pointer-events-none -rotate-12" />
          </section>

          {/* Integration Status / Merchant Info */}
          {!isSuperAdmin && (
            <div className="p-5 md:p-6 rounded-2xl bg-muted/10 border border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Linked Merchant</p>
                  <p className="text-xs font-black uppercase italic tracking-tight">{merchant?.companyName || "N/A"}</p>
                </div>
              </div>
              <div className="text-center sm:text-right hidden sm:block opacity-30">
                <p className="text-[8px] font-black uppercase tracking-widest italic leading-none">Sync_Stable</p>
                <p className="text-[10px] font-mono font-bold mt-1">NODE_{realMerchantId?.slice(-6).toUpperCase()}</p>
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT: SECURITY HUD --- */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-3xl shadow-xl space-y-6">
            <div className="flex items-center gap-2 text-primary/60">
              <ShieldCheck className="h-4 w-4" />
              <h2 className="text-[10px] font-black uppercase tracking-widest">Access Level</h2>
            </div>
            
            <div className="space-y-6">
              <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 shadow-inner">
                <p className="text-[8px] font-black uppercase tracking-widest text-primary opacity-60 mb-1">Protocol Role</p>
                <p className="text-base font-black italic text-primary uppercase tracking-tighter truncate leading-none">
                  {isSuperAdmin ? "SUPER_ADMIN" : "MERCHANT_OWNER"}
                </p>
              </div>

              <div className="space-y-2.5">
                <Button variant="outline" className="w-full h-11 rounded-xl border-border/40 bg-muted/10 font-black uppercase text-[9px] tracking-widest hover:bg-primary hover:text-white transition-all group text-foreground">
                  <Key className="mr-2 h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
                  Rotate Access Key
                </Button>
                
                <Button variant="ghost" className="w-full h-10 rounded-xl text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 font-bold uppercase text-[9px] tracking-widest transition-all">
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  Terminate Session
                </Button>
              </div>
            </div>
          </section>

          <div className="px-4 space-y-2 opacity-20">
            <div className="flex items-center gap-2">
               <Lock className="h-3 w-3" />
               <p className="text-[8px] font-black uppercase tracking-widest leading-none">Protocol Signal</p>
            </div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase leading-tight tracking-wider italic">
              Identity changes broadcasted to node cluster. Unauthorized access triggers lockout.
            </p>
          </div>
        </div>
      </div>

      {/* --- FOOTER SIGNAL --- */}
      <div className="flex items-center justify-center gap-3 opacity-20 py-4">
        <Globe className="h-3 w-3 text-muted-foreground" />
        <p className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground italic text-center">
          {/* 🚀 FIXED: Null-safe slice check */}
          Administrative core synchronized // Node_ID: {realMerchantId ? realMerchantId.slice(0, 8) : "ROOT_PLATFORM"}
        </p>
      </div>
    </div>
  );
}