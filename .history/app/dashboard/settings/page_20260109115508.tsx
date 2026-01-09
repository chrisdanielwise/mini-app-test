"use client";

import { useLayout } from "@/context/layout-provider";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Bot,
  ShieldCheck,
  Maximize,
  Key,
  Settings2,
  CheckCircle2,
  X,
  Layout,
  MousePointer2,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const { isFullSize, toggleFullSize, navMode, setNavMode } = useLayout();

  return (
    <div className="min-h-screen bg-background space-y-12 p-6 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- IMMERSIVE HEADER: NAVIGATION FIRST --- */}
      <div className="flex items-center justify-between border-b border-border pb-8">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Back to Command Center
          </Link>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-3">
            System Config <Settings2 className="h-7 w-7 text-primary" />
          </h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Identity & Interface Engine
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* --- LEFT COLUMN: CORE SETTINGS --- */}
        <div className="lg:col-span-2 space-y-12">
          {/* Section 1: Bot Identity */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <Bot className="h-4 w-4" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">
                Telegram Bot Identity
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase opacity-60 ml-1">
                  Bot Username
                </Label>
                <Input
                  className="rounded-xl border-muted bg-muted/20 h-12 font-bold"
                  placeholder="@MySignalBot"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase opacity-60 ml-1">
                  Bot Token (API)
                </Label>
                <div className="relative">
                  <Input
                    type="password"
                    defaultValue="••••••••••••••••"
                    className="rounded-xl border-muted bg-muted/20 h-12 font-mono pr-12"
                  />
                  <Key className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30" />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Interface Preferences */}
          <section className="space-y-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-emerald-500">
              <Maximize className="h-4 w-4" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">
                Viewport & Experience
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ultra-Wide Viewport Toggle */}
              <div className="flex items-center justify-between p-6 rounded-[2.5rem] bg-muted/10 border border-border">
                <div className="max-w-[70%]">
                  <p className="text-xs font-black uppercase italic">
                    Ultra-Wide
                  </p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">
                    Expand dashboard to 1920px width.
                  </p>
                </div>
                <Switch
                  checked={isFullSize}
                  onCheckedChange={toggleFullSize}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              {/* Navigation Anchor Mode */}
              <div className="flex items-center justify-between p-6 rounded-[2.5rem] bg-muted/10 border border-border">
                <div className="max-w-[70%]">
                  <p className="text-xs font-black uppercase italic">
                    Nav Mode
                  </p>
                  <select
                    value={navMode}
                    onChange={(e) => setNavMode(e.target.value as any)}
                    className="bg-transparent text-[9px] font-black uppercase text-primary outline-none cursor-pointer"
                  >
                    <option value="SIDEBAR">Sidebar</option>
                    <option value="TOPBAR">Top Bar</option>
                    <option value="BOTTOM">Bottom</option>
                  </select>
                </div>
                <Layout className="h-5 w-5 text-muted-foreground opacity-30" />
              </div>
            </div>
          </section>
        </div>

        {/* --- RIGHT COLUMN: ACTIONS & EXIT --- */}
        <div className="space-y-6">
          <div className="rounded-[2.5rem] bg-card border border-border p-8 shadow-xl">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-6">
              System Status
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase">
                  Database Linked
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase">
                  Webhooks Online
                </span>
              </li>
            </ul>
            <Button className="w-full mt-8 rounded-2xl bg-primary font-black uppercase text-[10px] tracking-widest h-14 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
              Apply Changes
            </Button>
          </div>

          {/* 🏁 THE END-OF-FLOW EXIT BUTTON
              Hidden at the bottom of the right stack to ensure the user scrolls past settings.
          */}
          <div className="pt-20 flex flex-col items-center gap-4">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-30 italic">
              Close Settings
            </p>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="h-20 w-20 rounded-full border-muted-foreground/20 hover:bg-destructive hover:text-white hover:border-destructive transition-all duration-500 group"
              >
                <X className="h-8 w-8 group-hover:rotate-90 transition-transform duration-500" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
