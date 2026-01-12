"use client";

import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  LogOut, 
  Terminal, 
  Cpu, 
  ChevronRight, 
  Fingerprint,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * 🛰️ TERMINAL SETTINGS (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Optimized: Adaptive haptics and touch-safe targets for hardware calibration.
 */
export default function SettingsPage() {
  const { user } = useTelegramContext();

  return (
    <div className="flex flex-col min-h-[100dvh] space-y-8 md:space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      
      {/* --- HUD HEADER: BRANDED IDENTITY --- */}
      <header className="px-5 py-8 md:p-8 md:pt-12 bg-card/30 border-b border-border/40 backdrop-blur-xl rounded-b-[2.5rem] md:rounded-b-[3.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] rotate-12 pointer-events-none">
          <Terminal className="h-32 w-32 md:h-48 md:w-48" />
        </div>
        <div className="relative z-10 space-y-2 md:space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Cpu className="h-3.5 w-3.5 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Node Configuration
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
            Terminal <span className="text-muted-foreground/40">Settings</span>
          </h1>
          <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 italic">
            Identity & Node Hardware Calibration
          </p>
        </div>
      </header>

      <div className="px-4 sm:px-6 space-y-10 md:space-y-12">
        
        {/* 🛰️ IDENTITY PASSPORT CARD */}
        <section className="space-y-4">
          <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic ml-2">
            Active Identity Node
          </h2>
          <div className="rounded-[2.5rem] md:rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
            <Fingerprint className="absolute -bottom-4 -right-4 h-20 w-20 opacity-[0.03] -rotate-12 pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-tr from-primary to-primary/40 flex items-center justify-center text-xl md:text-2xl font-black text-white italic shadow-inner border-2 border-primary/20">
                  {user?.fullName?.[0] || "U"}
                </div>
              </div>
              
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-0">
                <span className="text-xl md:text-2xl font-black uppercase italic tracking-tighter truncate w-full">
                  {user?.fullName || "Identity Unknown"}
                </span>
                <span className="text-[10px] md:text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                  @{user?.username || "anonymous_node"}
                </span>
                
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[8px] md:text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                    {user?.role || "USER"}
                  </Badge>
                  {user?.merchantId && (
                    <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[8px] md:text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                      <Zap className="h-3 w-3 mr-1.5 fill-current" />
                      Verified Merchant
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ⚙️ SETTINGS CLUSTER */}
        <section className="space-y-4">
          <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic ml-2">
            Protocol Adjustment
          </h2>
          <div className="flex flex-col gap-3">
            <SettingItem icon={User} label="Profile Metadata" sublabel="First Name, Last Name, Bio" />
            <SettingItem icon={Shield} label="Security & Sessions" sublabel="JWT Node Management" />
            <SettingItem icon={Bell} label="Signal Notifications" sublabel="Telegram Alert Frequency" />
            <SettingItem icon={Globe} label="Language" sublabel="English (US) / Russian" />
          </div>
        </section>

        {/* 🚩 DESTRUCTIVE ACTIONS */}
        <div className="pt-4">
          <Button 
            variant="ghost" 
            className="w-full h-14 md:h-16 rounded-2xl md:rounded-3xl bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 font-black uppercase italic tracking-[0.2em] text-[10px] md:text-xs transition-all active:scale-[0.98] border border-rose-500/10"
            onClick={() => {
              hapticFeedback("warning");
              window.location.reload();
            }}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Disconnect Identity Node
          </Button>
          <p className="mt-6 text-center text-[8px] font-bold text-muted-foreground/40 uppercase tracking-[0.4em] italic">
            Zipha_Core_v2.6 // Session_ID: {user?.id?.toString().slice(0, 12)}
          </p>
        </div>
      </div>
    </div>
  );
}

function SettingItem({ icon: Icon, label, sublabel }: { icon: any, label: string, sublabel: string }) {
  return (
    <div 
      onClick={() => hapticFeedback("light")}
      className="flex items-center justify-between p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] bg-card/40 border border-border/40 hover:border-primary/30 transition-all cursor-pointer group active:scale-[0.98] shadow-sm backdrop-blur-md"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-2xl md:rounded-[1.25rem] bg-muted/10 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-inner border border-transparent group-hover:border-primary/20">
          <Icon className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:scale-110" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs md:text-sm font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors truncate">
            {label}
          </span>
          <span className="text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 truncate">
            {sublabel}
          </span>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </div>
  );
}