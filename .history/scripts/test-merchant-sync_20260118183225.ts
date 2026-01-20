// import prisma from "../src/lib/db";

// async function runDiagnostic() {
//   console.log("🚀 Starting Merchant Sync Diagnostic...");

//   // 1. TEST: Neon Database Connectivity
//   const start = Date.now();
//   try {
//     await prisma.$queryRaw`SELECT 1`;
//     console.log(`✅ Database Reachable: ${Date.now() - start}ms`);
//   } catch (e) {
//     console.error("❌ Database Connection Failed.");
//     return;
//   }

//   // 2. TEST: Merchant Profile Existence
//   try {
//     const user = await prisma.user.findFirst({
//       where: {
//         id: "09c55e7c-1143-4cf7-b302-8683ff5a14f9" 
//       },
//       include: { 
//         merchantProfile: true // 🚀 SCHEMA FIX: Changed from 'merchant' to 'merchantProfile'
//       }
//     });

//     if (!user) {
//       console.error("❌ User not found in DB.");
//     } else if (!user.merchantProfile) {
//       console.error("❌ User found, but 'merchantProfile' is null. Check if the merchant record exists.");
//     } else {
//       console.log("✅ Merchant Profile Linked:", user.merchantProfile.companyName);
//       console.log("✅ Bot Username:", user.merchantProfile.botUsername);
//     }
//   } catch (err: any) {
//     console.error("❌ Query Error:", err.message);
//   }

//   // 3. STATS
//   console.log("⏳ Testing Parallel Query Race...");
//   try {
//     const [subs, payments] = await Promise.all([
//       prisma.subscription.count(),
//       prisma.payment.count(),
//     ]);
//     console.log(`✅ Statistics: ${subs} Subs, ${payments} Payments`);
//     console.log("🎉 DIAGNOSTIC COMPLETE: System is Ready.");
//   } catch (e) {
//     console.error("❌ Stats Fetch Failed.");
//   }
// }

// runDiagnostic();