import { NextResponse } from "next/server";

/**
 * 🛰️ HEALTH_NODE (Institutional v16.16.64)
 * Strategy: Atomic Handshake & Zero-Payload Ingress.
 * Mission: Provide a high-speed telemetry target for client-side heartbeats.
 */

export async function GET() {
  return NextResponse.json(
    {
      status: "STABLE",
      timestamp: new Date().toISOString(),
      node: process.env.NODE_ENV || "production",
      signal: "PULSE_OK",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    }
  );
}

/**
 * ⚡ OPTIMIZED_HEAD: Used by useHeartbeat for minimal data transfer.
 */
export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      "X-Signal-Stability": "LAMINAR",
      "X-Node-Status": "ACTIVE",
    },
  });
}