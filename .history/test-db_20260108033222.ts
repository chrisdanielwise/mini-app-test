import { Pool } from 'pg';
import 'dotenv/config';

async function testConnection() {
  console.log("🔍 Testing Database Connection...");
  console.log("📍 URL:", process.env.DATABASE_URL?.split('@')[1] || "Not found");

  const pool = new Pool({
    connectionString: env("DATABASE_URL"),
    connectionTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log("✅ SUCCESS: Raw PostgreSQL is reachable!");
    
    const res = await client.query('SELECT NOW()');
    console.log("🕒 DB Time:", res.rows[0].now);
    
    client.release();
  } catch (err: any) {
    console.error("❌ FAILURE: Could not connect to DB.");
    console.error("📝 Error Code:", err.code);
    console.error("📝 Message:", err.message);
    
    if (err.message.includes("IP")) {
      console.log("\n💡 SUGGESTION: Your Database Provider is blocking your current IP. You need to allow 0.0.0.0/0 in your DB dashboard.");
    }
  } finally {
    await pool.end();
  }
}

testConnection()