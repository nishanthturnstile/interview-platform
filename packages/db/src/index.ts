import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";

export function createDatabase(connectionString: string) {
  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 2000,
    query_timeout: 2000,
    statement_timeout: 1800,
  });

  pool.on("error", () => {
    console.warn("An idle PostgreSQL connection closed unexpectedly.");
  });

  const db = drizzle(pool, { schema });

  return {
    pool,
    db,
    async isSchemaReady() {
      const result = await db.execute<{ ready: boolean | null }>(
        sql`SELECT has_schema_privilege(to_regnamespace(${schema.interview.schemaName}), 'USAGE') AS ready`,
      );
      return result.rows[0]?.ready === true;
    },
  };
}
