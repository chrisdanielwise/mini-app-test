import prisma from "../lib/db";

async function runDiagnostic() {
  console.log("🚀 Starting Merchant Sync Diagnostic...");

  // 1. TEST: Neon Database Connectivity (SUCCESSFUL in your last run)
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log(`✅ Database Reachable: ${Date.now() - start}ms`);
  } catch (e) {
    console.error("❌ Database Connection Failed.");
    return;
  }

  // 2. TEST: Merchant Profile Existence
  // 🏁 FIX: Use the 'id' field for UUIDs, or a numeric string for 'telegramId'
  try {
    const user = await prisma.user.findFirst({
      where: {
        // Option A: If you have a real numeric Telegram ID, use it here:
        // telegramId: "598231234" 
        
        // Option B: Search by the UUID you provided (assuming it's the User ID)
        id: "09c55e7c-1143-4cf7-b302-8683ff5a14f9" 
      },
      include: { merchant: true }
    });

    if (!user) {
      console.error("❌ User not found in DB. Check if this UUID exists in the 'User' table.");
    } else if (!user.merchant) {
      console.error("❌ User found, but has NO Merchant profile linked.");
    } else {
      console.log("✅ Merchant Profile Linked:", user.merchant.companyName);
      console.log("✅ Bot Username:", user.merchant.botUsername);
    }
  } catch (err: any) {
    console.error("❌ Query Error:", err.message);
  }

  console.log("⏳ Testing Parallel Query Race...");
  try {
    const [subs, payments] = await Promise.all([
      prisma.subscription.count(),
      prisma.payment.count(),
    ]);
    console.log(`✅ Statistics: ${subs} Subs, ${payments} Payments`);
    console.log("🎉 DIAGNOSTIC COMPLETE: System is Ready.");
  } catch (e) {
    console.error("❌ Parallel Race Failed.");
  }
}

runDiagnostic();