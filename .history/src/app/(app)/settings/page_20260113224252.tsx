"use client";

// ⚛️ React & Next.js Core
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

// 🛰️ Institutional Contexts & Hooks
import { useTelegramContext } from "@/components/telegram/telegram-provider";

// 🛠️ UI Components & Hardened Layouts
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// 🛡️ Security Icons & Terminal Branding
import {
  User, Shield, Bell, Globe, LogOut, Terminal, Cpu,
  ChevronRight, Fingerprint, Lock, ShieldAlert
} from "lucide-react";

// 🏛️ Utilities & Identity Logic
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/**
 * 🛰️ USER TERMINAL SETTINGS
 * Logic: Atomic Logout + Native Hardware Integration + Multi-Environment Ingress.
 */
export default function SettingsPage() {
  const { 
    auth, isReady, user: tgUser, mounted, 
    setMainButton, hapticFeedback, isTelegram 
  } = useTelegramContext();
  
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // 🛡️ ROLE DETECTION
  const isStaff = useMemo(() => 
    auth.user?.role && ["SUPER_ADMIN", "PLATFORM_MANAGER"].includes(auth.user.role.toUpperCase()),
    [auth.user?.role]
  );

  /**
   * 📥 COMPLIANCE EXPORT
   */
  const handleExport = async () => {
    setIsExporting(true);
    hapticFeedback("medium");
    toast.loading("Compiling Security Ledger...");
    window.location.href = "/api/auth/audit/export";
    setTimeout(() => setIsExporting(false), 2000);
  };

  /**
   * 🧹 ATOMIC LOGOUT
   */
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    hapticFeedback("warning");

    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error();
      toast.success("Identity Node De-provisioned");
      router.replace("/dashboard/login");
    } catch (err) {
      toast.error("Failed to disconnect node");
      setIsLoggingOut(false);
    }
  };

  // --- RENDERING BARRIERS (Keep your existing LoadingScreen & Lock barriers) ---

  return (
    <div className="flex flex-col min-h-[100dvh] max-w-3xl mx-auto pb-32">
      {/* HUD HEADER (Existing) */}
      <header className="..."> {/* ... (Your existing Header JSX) */} </header>

      <main className="px-5 py-8 space-y-10">
        
        {/* IDENTITY CARD (Existing) */}
        <section> {/* ... (Your existing Identity Card JSX) */} </section>

        {/* 📊 SESSION TELEMETRY (New Integration) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Activity className="h-3 w-3 text-primary animate-pulse" />
            <h2 className="text-[10px] font-black uppercase tracking-widest opacity-40">Active Telemetry</h2>
          </div>
          <SessionActivityTable />
        </section>

        {/* SETTINGS CLUSTER */}
        <section className="space-y-4">
          <SettingItem 
            icon={User} 
            label="Profile Metadata" 
            sublabel="Identity labels & bio" 
            isStaff={isStaff} 
          />
          <SettingItem 
            icon={FileDown} 
            label="Compliance Ledger" 
            sublabel="Export 30-day security CSV" 
            isStaff={isStaff}
            onClick={handleExport}
          />
          <SettingItem 
            icon={ShieldX} 
            label="Emergency Revocation" 
            sublabel="Instantly rotate security stamp" 
            isStaff={isStaff}
            variant="danger"
            onClick={() => router.push('/dashboard/settings/security')} // Redirect to a confirmation sub-page or trigger global wipe modal
          />
        </section>

        {/* WEB FALLBACK LOGOUT */}
        <div className="pt-4 md:block hidden">
          <Button 
            disabled={isLoggingOut} 
            variant="ghost" 
            className="w-full h-14 rounded-2xl bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 font-black uppercase italic tracking-widest text-[10px] border border-rose-500/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Disconnect Identity Node
          </Button>
        </div>
      </main>
    </div>
  );
}

/**
 * 🛠️ UPDATED SETTING ITEM
 */
function SettingItem({ icon: Icon, label, sublabel, isStaff, variant, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer group active:scale-[0.98] shadow-xl backdrop-blur-3xl",
        variant === "danger" 
          ? "bg-rose-500/5 border-rose-500/10 hover:border-rose-500/30" 
          : isStaff ? "bg-amber-500/5 border-amber-500/10 hover:border-amber-500/30" : "bg-card/40 border-border/40 hover:border-primary/20"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "h-11 w-11 rounded-xl flex items-center justify-center border transition-all shadow-inner",
          variant === "danger" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
          isStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-muted/10 text-muted-foreground group-hover:text-primary"
        )}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className={cn(
            "text-[13px] font-black uppercase italic tracking-tight",
            variant === "danger" ? "text-rose-500" : isStaff ? "text-amber-500/80" : "text-foreground"
          )}>{label}</span>
          <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-0.5">{sublabel}</span>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </div>
  );
}