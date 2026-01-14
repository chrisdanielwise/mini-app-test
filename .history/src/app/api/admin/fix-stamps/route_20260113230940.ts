import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const users = await prisma.user.findMany({ where: { securityStamp: null } });
  
  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: { securityStamp: uuidv4() }
    });
  }

  return NextResponse.json({ message: `Updated ${users.length} users.` });
}
