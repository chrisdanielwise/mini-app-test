import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "zipha_secure_secret_2026");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { origin } = new URL(request.url); // 🏁 Force Ngrok Origin
  const token = request.cookies.get('auth_token')?.value;

  if (isDashboardRoute) {
    console.log(`[Middleware Check] Path: ${pathname} | Token Found: ${!!token}`);
  }
  
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/auth') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isLoginPage = pathname === '/dashboard/login';

  let userSession = null;
  if (token) {
    try {
      const { payload } = await jose.jwtVerify(token, SECRET);
      userSession = payload;
    } catch (err) {
      userSession = null;
    }
  }

  // 🚀 REDIRECT FIX: Use 'origin' to stay on Ngrok
  if (isLoginPage && userSession) {
    return NextResponse.redirect(new URL('/dashboard', origin));
  }

  if (isDashboardRoute && !isLoginPage && !userSession) {
    const response = NextResponse.redirect(new URL('/dashboard/login', origin));
    if (token) response.cookies.delete('auth_token');
    return response;
  }

  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*'] };