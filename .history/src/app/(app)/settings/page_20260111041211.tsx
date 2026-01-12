"use client";

import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Bell, Globe, LogOut } from "lucide-react";

export default function SettingsPage() 
  const { user } = useTelegramContext();

  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 🏛️ HEADER SECTION */}
      <div className="flex flex-col gap-1 px-2">
        <h1 className="text-2xl font-black uppercase italic tracking-tighter">Terminal Settings</h1>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Identity & Node Configuration</p>
      </div>

      {/* 🛰️ PROFILE PREVIEW CARD */}
      <div className="rounded-[2.5rem] border border-border/60 bg-card/40 backdrop-blur-xl p-6 shadow-apex">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-primary to-primary/40 flex items-center justify-center text-xl font-black text-white italic">
            {user?.fullName?.[0] || "U"}
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black uppercase tracking-tight">{user?.fullName || "Identity Unknown"}</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">@{user?.username || "anonymous"}</span>
            <div className="mt-2 flex gap-2">
              <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase">
                {user?.role || "USER"}
              </Badge>
              {user?.merchantId && (
                <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] font-black uppercase">
                  Verified Merchant
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ⚙️ SETTINGS CATEGORIES */}
      <div className="flex flex-col gap-2">
        <SettingItem icon={User} label="Profile Metadata" sublabel="First Name, Last Name, Bio" />
        <SettingItem icon={Shield} label="Security & Sessions" sublabel="JWT Node Management" />
        <SettingItem icon={Bell} label="Signal Notifications" sublabel="Telegram Alert Frequency" />
        <SettingItem icon={Globe} label="Language" sublabel="English (US) / Russian" />
      </div>

      {/* 🚩 DESTRUCTIVE ACTIONS */}
      <Button variant="destructive" className="mt-4 w-full" onClick={() => window.location.reload()}>
        <LogOut className="mr-2 h-4 w-4" />
        Disconnect Node
      </Button>
    </div>
  );
}

function SettingItem({ icon: Icon, label, sublabel }: { icon: any, label: string, sublabel: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-[1.5rem] bg-muted/5 border border-transparent hover:border-border/40 hover:bg-muted/10 transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-muted/20 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black uppercase tracking-tight">{label}</span>
          <span className="text-[9px] font-bold text-muted-foreground uppercase">{sublabel}</span>
        </div>
      </div>
    </div>
  );
}