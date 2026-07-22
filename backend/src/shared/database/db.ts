import { Pool, QueryResult } from "pg";
import { env } from "../../config/env";

function formatDatabaseUrl(urlStr: string | undefined): string | undefined {
  if (!urlStr) return undefined;
  const firstColon = urlStr.indexOf('://');
  if (firstColon === -1) return urlStr;
  const lastAt = urlStr.lastIndexOf('@');
  if (lastAt === -1) return urlStr;

  const authPart = urlStr.substring(firstColon + 3, lastAt);
  const firstAuthColon = authPart.indexOf(':');
  if (firstAuthColon === -1) return urlStr;

  const user = authPart.substring(0, firstAuthColon);
  const pass = authPart.substring(firstAuthColon + 1);
  const hostAndDb = urlStr.substring(lastAt + 1);

  return `${urlStr.substring(0, firstColon + 3)}${user}:${encodeURIComponent(pass)}@${hostAndDb}`;
}

const sanitizedDatabaseUrl = formatDatabaseUrl(env.DATABASE_URL);

const isSupabaseOrRemote =
  !!sanitizedDatabaseUrl ||
  (env.DB_HOST &&
    (env.DB_HOST.includes("supabase.co") ||
      env.DB_HOST.includes("render") ||
      env.DB_HOST.includes("railway")));

export const dbPool = sanitizedDatabaseUrl
  ? new Pool({
      connectionString: sanitizedDatabaseUrl,
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