import prisma from "../lib/db";

async function runDiagnostic() {
  console.log("🚀 Starting Merchant Sync Diagnostic...");

  // 1. TEST: Neon Database Connectivity & Cold Start
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log(`✅ Database Reachable: ${Date.now() - start}ms`);
  } catch (e) {
    console.error("❌ Database Connection Failed. Root Cause: Neon Cold Start or Invalid Pooler URL.");
    return;
  }

  // 2. TEST: Merchant Profile Existence
  // Replace with a known Telegram ID from your logs
  const testTgId = "09c55e7c-1143-4cf7-b302-8683ff5a14f9"; 
  const user = await prisma.user.findUnique({
    where: { telegramId: testTgId },
    include: { merchant: true }
  });

  if (!user) {
    console.error("❌ User not found in DB. Handshake will always fail.");
  } else if (!user.merchant) {
    console.error("❌ User exists but has NO Merchant profile. This is why it hangs.");
  } else {
    console.log("✅ Merchant Profile Linked:", user.merchant.companyName);
  }

  // 3. TEST: Concurrent Load Performance
  console.log("⏳ Testing Parallel Query Race...");
  const raceStart = Date.now();
  try {
    await Promise.all([
      prisma.subscription.count(),
      prisma.payment.count(),
      prisma.service.count()
    ]);
    console.log(`✅ Parallel Queries Finished: ${Date.now() - raceStart}ms`);
  } catch (e) {
    console.error("❌ Parallel Race Failed. Root Cause: Prisma connection pool exhaustion.");
  }
}

runDiagnostic();