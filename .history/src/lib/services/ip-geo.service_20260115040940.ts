/**
 * 🛰️ IP_GEO_SERVICE (Institutional v14.85.0)
 * Logic: Encrypted Resolution with Rate-Limit Resilience.
 */
export const IPGeoService = {
  async resolve(ip: string) {
    // 🛡️ 1. INTERNAL NODE DETECTION
    if (!ip || ip === "::1" || ip === "127.0.0.1" || ip.startsWith("192.168") || ip.startsWith("10.")) {
      return { countryCode: "LOC", city: "Localhost" };
    }

    // 🛡️ 2. FETCH WITH ABORT SIGNAL (Timeout)
    // We don't want a slow Geo-API to hang our security background tasks.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3-second limit

    try {
      // 🚀 Use HTTPS for Institutional Security
      const res = await fetch(`https://ipapi.co/${ip}/json/`, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Zipha-Identity-Sentinel' }
      });

      clearTimeout(timeout);

      if (!res.ok) throw new Error("API_REJECTED");

      const data = await res.json();

      return {
        countryCode: data.country_code || "UNK",
        city: data.city || "Unknown",
        isp: data.org || "Unknown Provider"
      };

    } catch (err: any) {
      clearTimeout(timeout);
      console.warn(`⚠️ [Geo_Fault] for ${ip}: ${err.message}`);
      
      // Fallback for failed lookups
      return { countryCode: "ERR", city: "Error", isp: "N/A" };
    }
  }
};