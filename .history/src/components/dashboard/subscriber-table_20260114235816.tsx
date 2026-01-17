"use client";

import * as React from "react";
import { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Terminal,
  ChevronRight,
  Download,
  ShieldCheck,
  UserPlus,
  Zap,
  Globe
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

interface Subscriber {
  id: string;
  telegramName: string;
  telegramId: string;
  plan: string;
  status: "ACTIVE" | "EXPIRED" | "PENDING";
  joinedAt: string;
  revenue: string;
  merchantNode?: string;
}

/**
 * 🌊 FLUID SUBSCRIBER LEDGER (v16.16.12)
 * Logic: Haptic-synced identity scrubbing with Oversight Radiance.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
export function SubscriberTable({ data: initialData }: { data?: Subscriber[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const isStaff = flavor === "AMBER";

  const subscribers = initialData || [
    {
      id: "1",
      telegramName: "Alex_FX",
      telegramId: "7482910",
      plan: "PRO_SIGNAL",
      status: "ACTIVE",
      joinedAt: "2026-01-05",
      revenue: "$149.00",
      merchantNode: "ALPHA_NODE"
    },
    {
      id: "2",
      telegramName: "Sam_Signals",
      telegramId: "9283741",
      plan: "STARTER_NODE",
      status: "EXPIRED",
      joinedAt: "2025-12-20",
      revenue: "$49.00",
      merchantNode: "BETA_SYSTEMS"
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* 🌊 COMMAND UTILITY HUB: Atmospheric Filtering */}
      <div className={cn(
        "flex flex-col lg:flex-row gap-6 p-8 rounded-[2.5rem] border backdrop-blur-3xl shadow-2xl transition-all duration-700",
        isStaff ? "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5" : "bg-card/30 border-white/5"
      )}>
        <div className="relative w-full lg:max-w-md group">
          <Search className={cn(
            "absolute left-5 top-1/2 -translate-y-1/2 size-4 transition-colors",
            isStaff ? "group-focus-within:text-amber-500 text-muted-foreground/30" : "group-focus-within:text-primary text-muted-foreground/30"
          )} />
          <Input
            onFocus={() => impact("light")}
            placeholder={isStaff ? "GLOBAL_IDENTITY_SEARCH..." : "FILTER_BY_IDENTITY..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "pl-14 h-14 rounded-2xl md:rounded-[1.5rem] border font-black text-[10px] uppercase tracking-[0.25em] transition-all duration-500 italic placeholder:opacity-20",
              isStaff ? "bg-amber-500/5 border-amber-500/20 focus:ring-amber-500/10" : "bg-white/5 border-white/10 focus:ring-primary/10"
            )}
          />
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <Button
            variant="outline"
            onClick={() => impact("light")}
            className="flex-1 lg:flex-none h-14 px-8 rounded-2xl border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest italic"
          >
            <Filter className="mr-3 size-4 opacity-40" /> Filter_Logs
          </Button>
          <Button 
            onClick={() => impact("medium")}
            className={cn(
              "flex-1 lg:flex-none h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 transition-all italic",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/40" : "bg-primary text-primary-foreground shadow-primary/40"
            )}
          >
            <Download className="mr-3 size-4" /> Export_CSV
          </Button>
        </div>
      </div>

      {/* --- DATA GRID NODE: Fluid Ledger --- */}
      <div className={cn(
        "rounded-[3rem] border overflow-hidden backdrop-blur-3xl shadow-2xl relative transition-all duration-1000",
        isStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-card/20 border-white/5"
      )}>
        
        {/* DESKTOP PROTOCOL (v16.16.12) */}
        <div className="hidden md:block overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                {[
                  "Subscriber_Node",
                  isStaff ? "Source_Vector" : null,
                  "Protocol_Type",
                  "Identity_Hash",
                  "Status",
                  "LTV_Flow",
                  "Terminal",
                ].filter(Boolean).map((header) => (
                  <th key={header as string} className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {subscribers.map((sub, index) => (
                <tr 
                  key={sub.id} 
                  onMouseEnter={() => impact("light")}
                  className="hover:bg-white/[0.03] transition-all duration-500 group cursor-pointer animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "size-12 shrink-0 rounded-2xl flex items-center justify-center font-black italic shadow-inner border transition-all duration-700 group-hover:rotate-6",
                        isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                      )}>
                        {sub.telegramName[0]}
                      </div>
                      <div className="space-y-1.5 min-w-0">
                        <span className="text-sm font-black uppercase italic tracking-tighter block leading-none truncate text-foreground">
                          {sub.telegramName}
                        </span>
                        <div className="flex items-center gap-2 opacity-30 italic">
                          <UserPlus className="size-3" />
                          <span className="text-[9px] font-black uppercase tracking-widest">{sub.joinedAt}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  {isStaff && (
                    <td className="px-10 py-8">
                       <span className="text-[11px] font-black uppercase italic tracking-widest text-amber-500/80">
                         {sub.merchantNode}
                       </span>
                    </td>
                  )}
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                      <Terminal className={cn("size-3.5 opacity-20", isStaff ? "text-amber-500" : "text-primary")} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 italic truncate">
                        {sub.plan}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 font-mono text-[10px] font-black tracking-widest opacity-20 text-foreground/60">
                    {sub.telegramId}
                  </td>
                  <td className="px-10 py-8">
                    <Badge className={cn(
                        "rounded-xl text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 border shadow-xl italic",
                        sub.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      )}>
                      {sub.status}
                    </Badge>
                  </td>
                  <td className="px-10 py-8 font-black italic text-lg tracking-tighter text-foreground">
                    {sub.revenue}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button onClick={() => selectionChange()} className="size-10 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center text-muted-foreground/30 hover:text-foreground active:scale-90">
                      <MoreHorizontal className="size-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE PROTOCOL: Liquid Cards */}
        <div className="md:hidden p-6 space-y-6">
          {subscribers.map((sub) => (
            <div key={sub.id} onClick={() => selectionChange()} className={cn(
              "p-6 rounded-[2rem] border space-y-5 hover:bg-white/[0.03] active:scale-[0.98] transition-all duration-500 shadow-xl",
              isStaff ? "bg-amber-500/5 border-amber-500/10" : "bg-white/[0.02] border-white/5"
            )}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "size-12 rounded-2xl flex items-center justify-center font-black italic shadow-inner border",
                    isStaff ? "bg-amber-500/20 text-amber-500" : "bg-primary/10 text-primary"
                  )}>
                    {sub.telegramName[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-black uppercase italic tracking-tighter leading-none truncate text-foreground">
                      {sub.telegramName}
                    </p>
                    {isStaff && <p className="text-[8px] font-black text-amber-500 uppercase mt-1.5 italic tracking-tighter opacity-60">NODE_{sub.merchantNode}</p>}
                    <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest mt-2 italic truncate">
                      {sub.plan}
                    </p>
                  </div>
                </div>
                <Badge className={cn(
                    "rounded-xl text-[8px] font-black uppercase tracking-widest px-3 py-1 border shadow-xl italic",
                    sub.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                  )}>
                  {sub.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-5 border-t border-white/5">
                <div className="space-y-1.5">
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">ID_Hash</p>
                  <p className="text-[10px] font-mono font-black tracking-widest truncate text-foreground/40">{sub.telegramId}</p>
                </div>
                <div className="text-right space-y-1.5">
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">LTV_Flow</p>
                  <p className="text-sm font-black italic tracking-tighter text-foreground">{sub.revenue}</p>
                </div>
              </div>

              <Button variant="ghost" className={cn(
                "w-full h-12 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all duration-500 italic",
                isStaff ? "border-amber-500/20 text-amber-500 hover:bg-amber-500/5" : "border-white/10 hover:bg-primary/5 hover:text-primary"
              )}>
                Inspect_Node_Identity <ChevronRight className="ml-3 size-3.5" />
              </Button>
            </div>
          ))}
        </div>

        {/* 🏛️ INSTITUTIONAL WATERMARK */}
        <div className={cn(
          "absolute -bottom-10 -right-10 size-48 blur-[100px] opacity-10 pointer-events-none transition-all duration-1000",
          isStaff ? "bg-amber-500" : "bg-primary"
        )} />
      </div>
    </div>
  );
}