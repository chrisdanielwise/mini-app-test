"use client";

import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import Link from "next/link"; // Added Link for navigation
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface HeaderProps {
  user: {
    telegramId: string; // PRISMA 7 FIX: Changed from bigint to string for serialization
    fullName: string;
    username?: string;
  };
  merchant: {
    companyName: string;
  };
}

export function DashboardHeader({ user, merchant }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-md">
      {/* Left Section: Context & Search */}
      <div className="flex items-center gap-6">
        <div className="hidden lg:block">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {merchant.companyName}
          </p>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Search transactions or subscribers..."
            className="h-9 w-64 rounded-xl border border-border bg-background/50 pl-9 pr-4 text-sm transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary lg:w-80"
          />
        </div>
      </div>

      {/* Right Section: Notifications & Profile */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-primary/5"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-2 top-2.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-card" />
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 rounded-full px-2 hover:bg-primary/5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-xs font-black text-primary italic">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden flex-col items-start sm:flex">
                <span className="text-sm font-bold leading-none">
                  {user.fullName}
                </span>
                {user.username && (
                  <span className="text-[10px] font-medium text-muted-foreground">
                    @{user.username}
                  </span>
                )}
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 rounded-xl border-border bg-card p-2 shadow-xl"
          >
            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              My Account
            </DropdownMenuLabel>

            {/* FIXED: Added Link with asChild to point to /dashboard/profile */}
            <DropdownMenuItem className="rounded-lg cursor-pointer" asChild>
              <Link
                href="/dashboard/profile"
                className="flex items-center w-full"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>

            {/* FIXED: Added Link with asChild to point to /dashboard/settings */}
            <DropdownMenuItem className="rounded-lg cursor-pointer" asChild>
              <Link
                href="/dashboard/settings"
                className="flex items-center w-full"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border" />

            <DropdownMenuItem
              className="rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
              onClick={() => {
                // Handle logout logic here
                window.location.href = "/dashboard/login";
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
