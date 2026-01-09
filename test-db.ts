import { Pool } from 'pg';

async function testConnection() {
  console.log("🔍 Testing Database Connection...");
  
  // We use process.env directly; Node will load this from the command line
  const url = process.env.DATABASE_URL;
  
  if (!url) {
    console.error("❌ ERROR: DATABASE_URL is not defined in your .env file.");
    return;
  }

  console.log("📍 Target Host:", url.split('@')[1] || "Hidden");

  const pool = new Pool({
    connectionString: url,
    connectionTimeoutMillis: 15000,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log("✅ SUCCESS: Your machine can reach the database server!");
    
    const res = await client.query('SELECT NOW()');
    console.log("🕒 Database Server Time:", res.rows[0].now);
    
    client.release();
  } catch (err: any) {
    console.error("❌ FAILURE: Connection failed.");
    console.error("📝 Error Code:", err.code || "N/A");
    console.error("📝 Message:", err.message);
    
    if (err.message.includes("timeout") || err.code === 'ETIMEDOUT') {
      console.log("\n💡 DIAGNOSIS: Network Timeout. This is likely your Ngrok tunnel or a slow internet connection.");
    } else if (err.message.includes("IP")) {
      console.log("\n💡 DIAGNOSIS: Firewall Block. You MUST go to your DB dashboard (Supabase/Neon) and allow all IPs (0.0.0.0/0).");
    }
  } finally {
    await pool.end();
  }
}

testConnection();