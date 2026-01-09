"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { navigation } from "./sidebar" // Import the list to keep it DRY

export function DashboardTopNav({ merchant }: { merchant: any }) {
  return (
    <header className="h-20 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center font-black italic text-primary-foreground">Z</div>
        <span className="font-black uppercase italic text-xs">{merchant.companyName}</span>
      </div>
      
      {/* Search or Quick Actions can go here */}
      <div className="flex gap-4">
        <Link href="/dashboard/settings" className="text-[10px] font-black uppercase tracking-widest bg-muted px-4 py-2 rounded-xl">
          Settings
        </Link>
      </div>
    </header>
  )
}