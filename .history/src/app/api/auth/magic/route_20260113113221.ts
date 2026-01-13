// import { NextRequest, NextResponse } from "next/server";
// import { AuthService } from "@/lib/services/auth.service";

// /**
//  * 🛰️ MAGIC HANDSHAKE HANDLER (v13.9.50)
//  */
// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const token = searchParams.get("token");
  
//   const host = request.headers.get("host");
//   const protocol = request.headers.get("x-forwarded-proto") || "https";

//   console.log(`🔑 [Magic_Attempt]: Ingress detected. Token: ${token?.slice(0, 6)}...`);

//   if (!token) {
//     return NextResponse.redirect(new URL("/dashboard/login?reason=no_token", request.url));
//   }

//   try {
//     // 1. Verify and Burn Token
//     const user = await AuthService.verifyMagicToken(token);

//     if (!user) {
//       console.warn("⚠️ [Magic_Failed]: Token invalid or already consumed.");
//       return NextResponse.redirect(new URL("/dashboard/login?reason=invalid_token", request.url));
//     }

//     // 2. Issue Session
//     const sessionToken = await AuthService.createSession(user);
//     const cookieMetadata = AuthService.getCookieMetadata(host, protocol);

//     // 3. Redirect to Dashboard (Corrected Path)
//     const response = NextResponse.redirect(new URL("/dashboard", request.url));

//     response.cookies.set({
//       name: cookieMetadata.name,
//       value: sessionToken,
//       ...cookieMetadata.options,
//     });

//     console.log(`✅ [Magic_Success]: Node ${user.id} authenticated via Magic Link.`);
//     return response;

//   } catch (error: any) {
//     console.error("🔥 [Magic_Critical]:", error.message);
//     return NextResponse.json({ error: "INTERNAL_AUTH_FAULT" }, { status: 500 });
//   }
// }


