import { Pool, QueryResult } from "pg";
import { env } from "../../config/env";

export const dbPool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});

dbPool.on("error", (error) => {
  console.error("Unexpected PostgreSQL error:", error);
  process.exit(1);
});

export async function connectDatabase(): Promise<void> {
  try {
    await dbPool.query("SELECT NOW()");
    console.log("✅ PostgreSQL Connected");
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