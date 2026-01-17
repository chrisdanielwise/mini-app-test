"use server";

/**
 * 🌊 IP_GEO_SERVICE (v16.16.12)
 * Logic: Multi-tier Resolution (Proxy Headers -> External API -> Fallback).
 * Architecture: Non-blocking Abort-Signals with fail-safe "UNK" nodes.
 */
export const IPGeoService = {
  /**
   * 🔍 RESOLVE
   * Logic: Resolves geographic coordinates from an IP vector.
   */
  async resolve(ip: string) {
    // 🛡️ 1. INTERNAL NODE SHIELD
    // Prevents unnecessary API egress for local or loopback ingress.
    const isLocal = !ip || 
      ip === "::1" || 
      ip === "127.0.0.1" || 
      ip.startsWith("192.168") || 
      ip.startsWith("10.");

    if (isLocal) {
      return { countryCode: "LOC", city: "Internal_Node", isp: "System_Loop" };
    }

    // 🛡️ 2. TIMEOUT INTERLOCK
    // We enforce a strict 2s threshold. Security background tasks must not 
    // block the main event loop.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      /**
       * 🚀 EXTERNAL RESOLUTION: ipapi.co (v16.16.12 Protocol)
       * Standard: Uses HTTPS and Institutional User-Agent.
       */
      const res = await fetch(`https://ipapi.co/${ip}/json/`, {
        signal: controller.signal,
        headers: { 
          'User-Agent': 'Zipha-Identity-Sentinel/v16.16.12',
          'Accept': 'application/json'
        },
        next: { revalidate: 86400 } // Cache results for 24h to prevent rate-limits
      });

      if (!res.ok) throw new Error(`API_REJECTED: ${res.status}`);

      const data = await res.json();
      
      return {
        countryCode: data.country_code || "UNK",
        city: data.city || "Unknown_Sector",
        isp: data.org || "Unknown_ISP",
        region: data.region || "Unknown"
      };

    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.warn(`🛰️ [Geo_Timeout]: Resolution for ${ip} exceeded 2000ms threshold.`);
      } else {
        console.error(`🛰️ [Geo_Fault]: ${err.message}`);
      }
      
      // 🏛️ INSTITUTIONAL FALLBACK
      // Returns an "ERR" node rather than null to maintain object-shape stability.
      return { 
        countryCode: "ERR", 
        city: "Resolution_Fail", 
        isp: "Inaccessible" 
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
};