import { NextRequest, NextResponse } from "next/server";
import { createJWT } from "@/lib/auth/telegram";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  // 🔍 Use a real ID from your 'User' table
  const testUser = await prisma.user.findFirst({ 
    where: { role: 'super_admin' } // Or 'merchant'
  });

  if (!testUser) return NextResponse.json({ error: "No user found in DB" });

  const token = await createJWT({
    telegramId: testUser.telegramId.toString(), // Standardized to String
    userId: testUser.id,
    role: testUser.role.toLowerCase(), // Normalized
    merchantId: null,
  });

  const response = NextResponse.json({ message: "Session Injected", user: testUser.id });
  
  response.cookies.set("auth_token", token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  return response;
}