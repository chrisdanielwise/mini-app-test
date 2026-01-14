export const IPGeoService = {
  async resolve(ip: string) {
    if (ip === "::1" || ip === "127.0.0.1" || ip.startsWith("192.168")) {
      return { countryCode: "LOC", city: "Localhost" };
    }
    
    try {
      const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode,city`);
      const data = await res.json();
      return data.status === "success" ? data : { countryCode: "UNK", city: "Unknown" };
    } catch {
      return { countryCode: "ERR", city: "Error" };
    }
  }
};