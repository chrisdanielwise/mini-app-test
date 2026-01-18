// src/app/(staff)/dashboard/page.tsx
import * as React from "react";
import { getSession } from "@/lib/auth/session"; 
import { redirect } from "next/navigation";
import { DashboardClientView } from "./dashboard-client-view";

export default async function DashboardPage() {
  // 🔐 SERVER-SIDE ONLY: Identity Handshake
  const session = await getSession();
  
  if (!session) {
    redirect("/login?reason=session_invalid");
  }

  // 🛰️ HANDSHAKE: Pass sanitized data to the Client-side View
  return <DashboardClientView session={session} />;
}