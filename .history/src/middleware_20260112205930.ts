import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG } from '@/lib/auth/config'; 

/**
 * 🛰️ GLOBAL GATEKEEPER (Institutional v9.8.6)
 * Architecture: Turbopack Proxy Node
 * Logic: Atomic Exclusion to prevent 307-Storms.
 * Fix: Rename to 'middleware' and hardened bypass for token exchange.
 */


/**
 * 🚩 ATOMIC EXCLUSION MATCHER
 * Strictly prevents the middleware from running on assets and auth APIs.
 */
export const config = {
  matcher: [
    /*
     * Exclude paths that should never trigger middleware:
     * - api/auth & api/telegram
     * - static assets & next internals
     */
    '/((?!api/auth|api/telegram|_next/static|_next/image|favicon.ico|assets|dashboard/login).*)',
  ],
};