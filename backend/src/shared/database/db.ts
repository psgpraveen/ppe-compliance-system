import { Pool, QueryResult } from "pg";
import { env } from "../../config/env";

const isSupabaseOrRemote =
  !!env.DATABASE_URL ||
  (env.DB_HOST &&
    (env.DB_HOST.includes("supabase.co") ||
      env.DB_HOST.includes("render") ||
      env.DB_HOST.includes("railway")));

export const dbPool = env.DATABASE_URL
  ? new Pool({
      connectionString: env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      ssl: isSupabaseOrRemote ? { rejectUnauthorized: false } : false,
    });

dbPool.on("error", (error) => {
  console.error("Unexpected PostgreSQL error:", error);
});

export async function connectDatabase(): Promise<void> {
  try {
    await dbPool.query("SELECT NOW()");
    console.log("✅ PostgreSQL Connected (Supabase Cloud Database)");
  } catch (error) {
    console.error("❌ Database Connection Failed");
    console.error(error);
    process.exit(1);
  }
}

export async function query(
  text: string,
  params: unknown[] = []
): Promise<QueryResult> {
  return dbPool.query(text, params);
}