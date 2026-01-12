"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function LoopSentinel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1. Track reloads in Session Storage
    const count = parseInt(window.sessionStorage.getItem('loop_count') || '0');
    const newCount = count + 1;
    window.sessionStorage.setItem('loop_count', newCount.toString());

    // 2. Identify the source
    const reason = searchParams.get('reason');
    console.log(`%c 🛰️ RELOAD #${newCount} `, 'background: #f59e0b; color: #000; font-weight: bold');
    console.log(`📍 Path: ${pathname}`);
    console.log(`❓ Reason: ${reason || 'none'}`);

    // 3. Emergency Brake
    if (newCount > 15) {
      window.sessionStorage.setItem('loop_count', '0');
      alert("🛑 LOOP DETECTED: Check Browser Console (F12) for the 'Initiator' stack trace.");
    }
  }, [pathname, searchParams]);

  return null;
}